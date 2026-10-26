/* ═══════════════════════════════════════════
   BATIN · Expedición Kernel — motor del juego
   · Expedición: tablero de 4 regiones. El dado decide el nivel del
     desafío (y cuánto se avanza). Solo se avanza respondiendo bien.
     Al final de cada región hay un guardián de 3 pasos.
   · Simulacro: preguntas al azar, cronómetro y nota.
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.EK_CONFIG || {};
  var REG = window.EkRegistro;
  var BD = window.EK_BD || [];
  var PLAN = window.EK_PLANILLA;
  var raiz = document.getElementById('ek');
  if (!raiz) return;

  var REGIONES = (window.EK_REGIONES || []).map(function (r) {
    var c = {}; for (var k in r) c[k] = r[k];
    c.retos = r.retos.filter(function (x) { return !x.opcional || CFG[x.opcional]; });
    return c;
  });
  var RETO = {}, REGION_DE = {};
  REGIONES.forEach(function (rg, i) { rg.retos.forEach(function (x) { RETO[x.id] = x; REGION_DE[x.id] = i; }); });

  var CELDAS = 10;                                // casillas por región (la última es el guardián)
  var META = REGIONES.length * CELDAS;
  var PUNTOS = CFG.puntosNivel || { 3: 100, 4: 150, 5: 200, 6: 250 };
  var NIVEL_NOM = { 3: 'Aplicar', 4: 'Analizar', 5: 'Evaluar', 6: 'Crear' };
  var TIPO_NOM = { opcion: 'Elige', valor: 'Responde', linea: 'Encuentra la línea', ordenar: 'Ordena', clasificar: 'Clasifica', sql: 'SQL en vivo', simular: 'Simula' };
  var TOKENS = ['🦊', '🐢', '🦉', '🐸'];
  var COMODIN = {
    pista: { ico: '💡', nom: 'Pista', txt: 'muestra la pista del desafío' },
    mitad: { ico: '✂️', nom: '50/50', txt: 'elimina dos opciones incorrectas' },
    dado:  { ico: '🎲', nom: 'Volver a tirar', txt: 'cambia el desafío por otro tiro' }
  };
  var EVENTO = {
    cofre:    { ico: '🎁', nom: 'Cofre', txt: 'ganas un comodín al azar' },
    bug:      { ico: '🐛', nom: 'Bug', txt: 'respóndelo o retrocedes 2' },
    tormenta: { ico: '🌪️', nom: 'Tormenta', txt: 'el próximo desafío es N5 y vale doble' },
    portal:   { ico: '🌀', nom: 'Portal', txt: 'un N5 opcional: si aciertas, saltas 3' }
  };
  var GUIAS = {
    techi:  { nom: 'TECHI',  img: '../../img/techi_explicando.png',  emoji: '👩‍💻' },
    bit:    { nom: 'BIT',    img: '../../img/bit_explicando.png',    emoji: '🤖' },
    gatiel: { nom: 'GATIEL', img: '../../img/gatiel_explicando.png', emoji: '🐱' }
  };

  /* ─────────── Utilidades ─────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function escT(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function q(s, base) { return (base || raiz).querySelector(s); }
  function qa(s, base) { return Array.prototype.slice.call((base || raiz).querySelectorAll(s)); }
  function azar(n) { return Math.floor(Math.random() * n); }
  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function indices(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function ahora() { return new Date().toISOString(); }
  function mmss(ms) { var s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (x < 10 ? '0' : '') + x; }
  function normalizar(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/(\d)\.(?=\d{3}\b)/g, '$1')
      .replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function nivelDado(v) { return v <= 2 ? 3 : v <= 4 ? 4 : 5; }
  function regionDe(pos) { return Math.min(REGIONES.length - 1, Math.floor(pos / CELDAS)); }
  function posGuardian(r) { return r * CELDAS + CELDAS - 1; }
  function esGuardian(pos) { return pos < META && pos % CELDAS === CELDAS - 1; }
  function eventoEn(pos) { if (pos >= META || esGuardian(pos)) return null; return REGIONES[regionDe(pos)].eventos[pos % CELDAS] || null; }
  function colorReg(i) { return 'var(--r' + (i + 1) + ')'; }

  /* ─────────── Código con resaltado ─────────── */
  var KW = {
    pseudo: ['Algoritmo', 'FinAlgoritmo', 'Definir', 'Como', 'Entero', 'Real', 'Leer', 'Escribir', 'Si', 'Entonces', 'SiNo', 'FinSi', 'Mientras', 'Hacer', 'hacer', 'FinMientras', 'Para', 'FinPara', 'no', 'y', 'o'],
    java: ['import', 'public', 'class', 'static', 'void', 'new', 'int', 'double', 'String', 'if', 'else', 'for', 'while', 'do', 'return', 'true', 'false', 'Scanner'],
    sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'UPDATE', 'SET', 'DELETE', 'AND', 'OR', 'IS', 'NULL', 'COUNT', 'SUM', 'AVG', 'AS', 'LIMIT', 'DESC']
  };
  function resaltar(linea, lang) {
    if (!KW[lang]) return escT(linea);
    var com = lang === 'sql' ? '--' : '//';
    var ic = linea.indexOf(com), resto = '';
    if (ic >= 0 && linea.slice(0, ic).split('"').length % 2 === 1) { resto = '<span class="com">' + escT(linea.slice(ic)) + '</span>'; linea = linea.slice(0, ic); }
    var re = /"[^"]*"|'[^']*'/g, partes = [], m, u = 0;
    while ((m = re.exec(linea))) { partes.push({ t: linea.slice(u, m.index) }); partes.push({ t: m[0], s: 1 }); u = re.lastIndex; }
    partes.push({ t: linea.slice(u) });
    var rk = new RegExp('\\b(' + KW[lang].join('|') + ')\\b', 'g');
    return partes.map(function (p) {
      if (p.s) return '<span class="str">' + escT(p.t) + '</span>';
      return escT(p.t).replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>').replace(rk, '<span class="kw">$1</span>');
    }).join('') + resto;
  }
  function bloqueCodigo(code, clic) {
    var lang = code.lang || 'txt';
    return '<div class="codigo ' + (lang === 'pseudo' ? 'pseudo' : 'oscuro') + '"><table>' +
      code.txt.split('\n').map(function (l, i) {
        return '<tr' + (clic ? ' class="clic" data-ln="' + (i + 1) + '" tabindex="0" role="button" aria-label="Línea ' + (i + 1) + '"' : '') + '><td class="ln">' + (i + 1) + '</td><td>' + (resaltar(l, lang) || ' ') + '</td></tr>';
      }).join('') + '</table></div>';
  }
  function planillaHTML() {
    if (!PLAN) return '';
    return '<div class="k-plan"><table><thead><tr>' + PLAN.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      PLAN.filas.map(function (f) { return '<tr>' + f.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* ─────────── SQL en el navegador (sql.js) ─────────── */
  var SQL = null, sqlEstado = 'cargando', alCargarSQL = null;
  function cargarSQL() {
    if (typeof window.initSqlJs !== 'function') { sqlEstado = 'error'; return; }
    window.initSqlJs({ locateFile: function (f) { return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/' + f; } })
      .then(function (s) { SQL = s; sqlEstado = 'listo'; if (alCargarSQL) alCargarSQL(); })
      .catch(function () { sqlEstado = 'error'; if (alCargarSQL) alCargarSQL(); });
  }
  function nuevaBD() { var db = new SQL.Database(); BD.forEach(function (s) { db.run(s); }); return db; }
  function ultimo(res) { return res && res.length ? res[res.length - 1] : null; }
  function celdaN(v) { if (v === null || v === undefined) return 'NULL'; if (typeof v === 'number') return String(Math.round(v * 1e6) / 1e6); return String(v).trim(); }
  function firma(res, orden) {
    if (!res) return { cols: 0, filas: [] };
    var f = res.values.map(function (r) { return r.map(celdaN).join('\u0001'); });
    if (!orden) f.sort();
    return { cols: res.columns.length, filas: f };
  }
  function iguales(a, b) { return a.cols === b.cols && a.filas.length === b.filas.length && a.filas.every(function (x, i) { return x === b.filas[i]; }); }
  function resultadoEsperado(r) {
    var db = nuevaBD();
    try { if (r.cambio) { db.exec(r.solucion); return ultimo(db.exec(r.verificar)); } return ultimo(db.exec(r.solucion)); }
    finally { db.close(); }
  }
  function tablaHTML(res, max) {
    if (!res) return '<div class="info">La consulta no devolvió filas.</div>';
    max = max || 30;
    return '<div class="info">' + res.values.length + ' fila' + (res.values.length === 1 ? '' : 's') + '</div>' +
      '<table class="k-datos"><thead><tr>' + res.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      res.values.slice(0, max).map(function (r) { return '<tr>' + r.map(function (v) { return v === null ? '<td class="null">NULL</td>' : '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table>';
  }
  var ESQUEMA = [
    ['colegios', 'id_colegio, nombre, ciudad'],
    ['jugadores', 'id_jugador, nombre, id_colegio, posicion, edad'],
    ['partidos', 'id_partido, fecha, id_local, id_visitante, goles_local, goles_visitante'],
    ['goles', 'id_gol, id_partido, id_jugador, minuto']
  ];
  function esquemaHTML() {
    return '<div class="k-esquema">' + ESQUEMA.map(function (t) {
      return '<div class="tb"><b>' + t[0] + '</b>(' + t[1] + ')<br><button type="button" class="k-btn sm" data-ver="' + t[0] + '">👁 Ver datos</button></div>';
    }).join('') + '</div><div class="k-ver-datos" id="k-verdatos"></div>';
  }
  function conectarEsquema(base) {
    qa('[data-ver]', base).forEach(function (b) {
      b.addEventListener('click', function () {
        var out = q('#k-verdatos', base);
        if (out.dataset.t === b.dataset.ver) { out.innerHTML = ''; out.dataset.t = ''; return; }
        if (sqlEstado !== 'listo') { out.innerHTML = '<div class="info">El motor SQL todavía no cargó.</div>'; return; }
        var db = nuevaBD();
        out.innerHTML = tablaHTML(ultimo(db.exec('SELECT * FROM ' + b.dataset.ver)), 40);
        out.dataset.t = b.dataset.ver;
        db.close();
      });
    });
  }

  /* ─────────── Simulación de estructuras ─────────── */
  function simAplicar(est, estado, op) {
    var e = estado.e, s = estado.s;
    if (op[0] === 'in') e.push(op[1]);
    else if (op[0] === 'out') { if (e.length) s.push(est === 'pila' ? e.pop() : e.shift()); }
    else if (op[0] === 'ini') e.unshift(op[1]);
    else if (op[0] === 'fin') e.push(op[1]);
    else if (op[0] === 'del') { var i = e.indexOf(op[1]); if (i >= 0) e.splice(i, 1); }
  }
  function simEsperado(r) { var st = { e: [], s: [] }; r.ops.forEach(function (op) { simAplicar(r.est, st, op); }); return st; }

  /* ═══════════════════════════════════════════
     COMPONENTE: un desafío
     o = { revelar: bool, mitad: bool, pista: bool, alResponder: fn(ok, respuesta) }
     alResponder(null) = no se pudo responder (sin conexión para SQL)
  ═══════════════════════════════════════════ */
  function montarReto(cont, r, o) {
    var hecho = false;
    var rg = REGIONES[REGION_DE[r.id]];
    cont.innerHTML =
      '<div class="k-q">' + esc(r.q) + '</div>' +
      (r.pasos ? '<ol class="k-pasos">' + r.pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' : '') +
      (rg && rg.planilla && !r.guardian ? '<details class="k-planilla"' + (r.id === 'F-01' || r.id === 'F-03' ? ' open' : '') + '><summary>📊 Ver la planilla de CeluTec</summary>' + planillaHTML() + '</details>' : '') +
      (r.tipo === 'sql' || (rg && rg.sql && r.tipo === 'valor') ? esquemaHTML() : '') +
      (r.code && r.tipo !== 'linea' ? bloqueCodigo(r.code) : '') +
      '<div class="k-zona"></div><div class="k-pistabox"></div><div class="k-msg-zona"></div>' +
      '<div class="k-pie"><span class="der k-acc"></span></div>';
    conectarEsquema(cont);
    var zona = q('.k-zona', cont), acc = q('.k-acc', cont);
    function msg(tipo, titulo, txt) { q('.k-msg-zona', cont).innerHTML = '<div class="k-msg ' + tipo + '"><b class="t">' + titulo + '</b>' + esc(txt) + '</div>'; }
    function terminar(ok, resp) {
      if (hecho) return; hecho = true;
      qa('.k-zona button, .k-zona input, .k-zona textarea, .k-acc button', cont).forEach(function (b) { b.disabled = true; });
      qa('.k-zona tr.clic', cont).forEach(function (t) { t.classList.remove('clic'); t.removeAttribute('tabindex'); });
      o.alResponder(ok, resp);
    }
    if (o.pista) mostrarPista();
    function mostrarPista() { q('.k-pistabox', cont).innerHTML = '<div class="k-msg pista"><b class="t">💡 Pista</b>' + esc(r.pista) + '</div>'; }

    var api = { pista: mostrarPista, mitad: function () {}, msg: msg };

    if (r.tipo === 'opcion') {
      var orden = mezclar(indices(r.op.length)), letras = 'ABCDEF';
      zona.innerHTML = '<div class="k-ops">' + orden.map(function (idx, k) {
        return '<button type="button" class="op" data-idx="' + idx + '"><span class="k">' + letras[k] + '</span><span>' + esc(r.op[idx]) + '</span></button>';
      }).join('') + '</div>';
      qa('.op', zona).forEach(function (b) {
        b.addEventListener('click', function () {
          if (hecho) return;
          var idx = Number(b.dataset.idx), ok = idx === 0;
          if (o.revelar) { b.classList.add(ok ? 'bien' : 'mal'); var c = q('.op[data-idx="0"]', zona); if (c) c.classList.add('bien'); }
          else b.classList.add('elegida');
          terminar(ok, r.op[idx]);
        });
      });
      api.mitad = function () {
        var malas = mezclar(qa('.op', zona).filter(function (b) { return b.dataset.idx !== '0'; })).slice(0, Math.max(0, r.op.length - 2));
        malas.forEach(function (b) { b.classList.add('fuera'); b.disabled = true; });
      };
      if (o.mitad) api.mitad();
    }

    else if (r.tipo === 'valor') {
      zona.innerHTML = '<div class="k-valor"><input type="text" class="k-val" autocomplete="off" spellcheck="false" placeholder="Escribe tu respuesta"></div>';
      acc.innerHTML = '<button class="k-btn solid k-comp" type="button">Comprobar</button>';
      var inp = q('.k-val', zona);
      var comprobar = function () {
        var v = inp.value.trim(); if (!v) { inp.focus(); return; }
        var n = normalizar(v), ok = r.acepta.some(function (a) { return normalizar(a) === n; });
        terminar(ok, v);
      };
      q('.k-comp', acc).addEventListener('click', comprobar);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); comprobar(); } });
      setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 30);
    }

    else if (r.tipo === 'linea') {
      zona.innerHTML = bloqueCodigo(r.code, true);
      qa('tr.clic', zona).forEach(function (tr) {
        function elegir() {
          if (hecho) return;
          var ln = Number(tr.dataset.ln), ok = ln === r.correcta;
          if (o.revelar) { tr.classList.add(ok ? 'bien' : 'mal'); var c = q('tr[data-ln="' + r.correcta + '"]', zona); if (c) c.classList.add('bien'); }
          else tr.classList.add('elegida');
          terminar(ok, 'línea ' + ln);
        }
        tr.addEventListener('click', elegir);
        tr.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(); } });
      });
    }

    else if (r.tipo === 'ordenar') {
      var ord; do { ord = mezclar(indices(r.lineas.length)); } while (r.lineas.length > 1 && ord.every(function (v, i) { return r.lineas[v] === r.lineas[i]; }));
      var pintarO = function (marcar) {
        zona.innerHTML = '<ol class="k-orden">' + ord.map(function (idx, pos) {
          var cls = marcar ? (r.lineas[idx] === r.lineas[pos] ? 'bien' : 'mal') : '';
          return '<li class="' + cls + '"><span class="n">' + (pos + 1) + '</span><code>' + escT(r.lineas[idx]) + '</code>' +
            (hecho ? '' : '<button type="button" data-sube="' + pos + '" aria-label="Subir"' + (pos === 0 ? ' disabled' : '') + '>▲</button><button type="button" data-baja="' + pos + '" aria-label="Bajar"' + (pos === ord.length - 1 ? ' disabled' : '') + '>▼</button>') + '</li>';
        }).join('') + '</ol>';
        qa('[data-sube]', zona).forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.sube), -1); }); });
        qa('[data-baja]', zona).forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.baja), 1); }); });
      };
      var mover = function (pos, d) { var t = ord[pos]; ord[pos] = ord[pos + d]; ord[pos + d] = t; pintarO(false); var bt = q('[data-' + (d < 0 ? 'sube' : 'baja') + '="' + (pos + d) + '"]', zona); if (bt && !bt.disabled) bt.focus(); };
      pintarO(false);
      acc.innerHTML = '<button class="k-btn solid k-comp" type="button">Comprobar el orden</button>';
      q('.k-comp', acc).addEventListener('click', function () {
        var ok = ord.every(function (idx, pos) { return r.lineas[idx] === r.lineas[pos]; });
        var resp = ord.map(function (i) { return r.lineas[i].trim(); }).join(' | ');
        hecho = true; pintarO(!!o.revelar); hecho = false;
        terminar(ok, resp);
      });
    }

    else if (r.tipo === 'clasificar') {
      var ordC = mezclar(indices(r.items.length)), asig = {};
      var pintarC = function (marcar) {
        zona.innerHTML = '<div class="k-clas">' + ordC.map(function (idx) {
          var it = r.items[idx], a = asig[idx];
          var cls = marcar ? (a === it.c ? ' bien' : ' mal') : '';
          return '<div class="it' + cls + '"><span class="t">' + esc(it.t) + '</span><span class="k-seg">' +
            r.categorias.map(function (c) { return '<button type="button" data-it="' + idx + '" data-cat="' + esc(c) + '"' + (a === c ? ' class="act"' : '') + (hecho ? ' disabled' : '') + '>' + esc(c) + '</button>'; }).join('') +
            '</span>' + (marcar && a !== it.c ? '<span class="corr">→ ' + esc(it.c) + '</span>' : '') + '</div>';
        }).join('') + '</div>';
        qa('[data-cat]', zona).forEach(function (b) {
          b.addEventListener('click', function () { asig[b.dataset.it] = b.dataset.cat; pintarC(false); });
        });
      };
      pintarC(false);
      acc.innerHTML = '<button class="k-btn solid k-comp" type="button">Comprobar</button>';
      q('.k-comp', acc).addEventListener('click', function () {
        var faltan = r.items.length - Object.keys(asig).length;
        if (faltan > 0) { msg('pista', 'Falta completar', 'Quedan ' + faltan + ' elemento' + (faltan === 1 ? '' : 's') + ' sin ubicar.'); return; }
        var malos = r.items.filter(function (it, i) { return asig[i] !== it.c; });
        hecho = true; pintarC(!!o.revelar); hecho = false;
        terminar(!malos.length, malos.length ? malos[0].t + ' → ' + asig[r.items.indexOf(malos[0])] : 'todo bien');
      });
    }

    else if (r.tipo === 'sql') {
      var pintarS = function () {
        if (sqlEstado === 'cargando') { zona.innerHTML = '<div class="k-msg">⏳ Cargando la base de datos…</div>'; alCargarSQL = pintarS; return; }
        if (sqlEstado === 'error') {
          zona.innerHTML = '<div class="k-msg mal"><b class="t">No se pudo cargar el motor SQL</b>Hace falta conexión a internet para ejecutar consultas.</div>';
          acc.innerHTML = '<button class="k-btn" type="button" id="k-saltar">Saltar (no cuenta)</button>';
          q('#k-saltar', acc).addEventListener('click', function () { terminar(null, '[sin conexión]'); });
          return;
        }
        zona.innerHTML = '<textarea class="k-sql" spellcheck="false" placeholder="Escribe aquí tu consulta SQL… (Ctrl+Enter para ejecutar)"></textarea><div class="k-res"></div>';
        acc.innerHTML = '<button class="k-btn solid k-comp" type="button">▶ Ejecutar y comprobar</button>';
        var ta = q('.k-sql', zona);
        var ejecutar = function () {
          var txt = ta.value.trim(), out = q('.k-res', zona);
          if (!txt) { ta.focus(); return; }
          var db = nuevaBD(), res, verif;
          try { res = db.exec(txt); if (r.cambio) verif = ultimo(db.exec(r.verificar)); }
          catch (err) { db.close(); out.innerHTML = '<div class="err">⚠ Error de SQL: ' + esc(err.message) + '</div><div class="info">Los errores de escritura no cuentan: corrige y vuelve a ejecutar.</div>'; return; }
          var got = r.cambio ? verif : ultimo(res), esperado = resultadoEsperado(r);
          var ok = iguales(firma(got, r.orden || r.cambio), firma(esperado, r.orden || r.cambio));
          var cambios = r.cambio ? db.getRowsModified() : 0;
          db.close();
          out.innerHTML = (r.cambio ? '<div class="info">Filas modificadas: ' + cambios + '. Así quedó la tabla:</div>' : '') + tablaHTML(got);
          if (!ok && o.revelar) {
            var det = 'La consulta funciona, pero el resultado no es el pedido.';
            if (got && esperado && got.values.length !== esperado.values.length) det += ' Devolvió ' + got.values.length + ' filas y se esperaban ' + esperado.values.length + '.';
            else if (got && esperado && got.columns.length !== esperado.columns.length) det += ' Revisa qué columnas muestras.';
            if (r.cambio && cambios > 1) det = '¡Cuidado! Se modificaron ' + cambios + ' filas. ¿Falta el WHERE?';
            api.detalle = det;
          }
          terminar(ok, txt);
        };
        q('.k-comp', acc).addEventListener('click', ejecutar);
        ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); ejecutar(); } });
      };
      pintarS();
    }

    else if (r.tipo === 'simular') {
      var st = { e: [], s: [] }, hist = [], sel = null;
      var verbo = r.est === 'pila' ? ['Apilar', 'Desapilar'] : r.est === 'cola' ? ['Encolar', 'Atender (desencolar)'] : null;
      var pintarSim = function () {
        var usadas = hist.filter(function (h) { return h[0] !== 'out' && h[0] !== 'del'; }).map(function (h) { return h[1]; });
        var escena;
        if (r.est === 'pila') escena = '<div><div class="k-pila">' + st.e.map(function (x) { return '<div class="el">' + esc(x) + '</div>'; }).join('') + (st.e.length ? '' : '<span class="k-vacio">vacía</span>') + '</div><div class="cima" style="text-align:center;margin-top:4px">' + (st.e.length ? '▲ la cima es el último' : '') + '</div></div>';
        else if (r.est === 'cola') escena = '<div class="k-cola"><span class="lbl">frente →</span>' + st.e.map(function (x) { return '<span class="el">' + esc(x) + '</span>'; }).join('') + (st.e.length ? '' : '<span class="k-vacio">vacía</span>') + '<span class="lbl">← final</span></div>';
        else escena = '<div class="k-lista"><span class="lbl k-vacio" style="font-style:normal">cabeza →</span>' + st.e.map(function (x, i) { return (i ? '<span class="flecha">→</span>' : '') + '<span class="el">' + esc(x) + (hecho ? '' : '<button type="button" data-del="' + esc(x) + '" aria-label="Eliminar ' + esc(x) + '">✕</button>') + '</span>'; }).join('') + '<span class="flecha">→ null</span></div>';
        zona.innerHTML = '<div class="k-sim">' +
          '<div class="k-sim-ctrl">' + r.fichas.map(function (f) {
            var usada = usadas.indexOf(f) >= 0;
            return '<button type="button" class="k-ficha' + (sel === f ? ' sel' : '') + '" data-ficha="' + esc(f) + '"' + (usada || hecho ? ' disabled' : '') + '>' + (verbo ? '＋ ' : '') + esc(f) + '</button>';
          }).join('') + '</div>' +
          '<div class="k-sim-ctrl">' +
          (verbo ? '<button type="button" class="k-btn" data-out="1"' + (st.e.length && !hecho ? '' : ' disabled') + '>' + (r.est === 'pila' ? '⬆ ' : '⬅ ') + verbo[1] + '</button>'
                 : '<button type="button" class="k-btn" data-pos="ini"' + (sel && !hecho ? '' : ' disabled') + '>⇤ Insertar al inicio</button><button type="button" class="k-btn" data-pos="fin"' + (sel && !hecho ? '' : ' disabled') + '>Insertar al final ⇥</button>') +
          '<button type="button" class="k-btn sm" data-reset="1"' + (hist.length && !hecho ? '' : ' disabled') + '>↺ Reiniciar</button></div>' +
          '<div class="k-escena">' + escena + '</div>' +
          (verbo ? '<div class="k-salieron">' + (r.est === 'pila' ? 'Desapilados' : 'Atendidos') + ': ' + (st.s.length ? st.s.map(function (x) { return '<b>' + esc(x) + '</b>'; }).join(', ') : '—') + '</div>' : '') +
          '</div>';
        qa('[data-ficha]', zona).forEach(function (b) {
          b.addEventListener('click', function () {
            var f = b.dataset.ficha;
            if (verbo) { hacer(['in', f]); } else { sel = sel === f ? null : f; pintarSim(); }
          });
        });
        qa('[data-out]', zona).forEach(function (b) { b.addEventListener('click', function () { hacer(['out']); }); });
        qa('[data-pos]', zona).forEach(function (b) { b.addEventListener('click', function () { var f = sel; sel = null; hacer([b.dataset.pos, f]); }); });
        qa('[data-del]', zona).forEach(function (b) { b.addEventListener('click', function () { hacer(['del', b.dataset.del]); }); });
        qa('[data-reset]', zona).forEach(function (b) { b.addEventListener('click', function () { st = { e: [], s: [] }; hist = []; sel = null; pintarSim(); }); });
      };
      var hacer = function (op) { if (hecho) return; hist.push(op); simAplicar(r.est, st, op); pintarSim(); };
      pintarSim();
      acc.innerHTML = '<button class="k-btn solid k-comp" type="button">Comprobar</button>';
      q('.k-comp', acc).addEventListener('click', function () {
        if (!hist.length) { msg('pista', 'Todavía no hiciste nada', 'Usa los botones para simular cada paso.'); return; }
        var esp = simEsperado(r);
        var ok = esp.e.join('|') === st.e.join('|') && (r.est === 'lista' || esp.s.join('|') === st.s.join('|'));
        if (!ok && o.revelar) api.detalle = 'Debía quedar: ' + (esp.e.join(r.est === 'lista' ? ' → ' : ', ') || 'vacía') + (r.est !== 'lista' ? '. ' + (r.est === 'pila' ? 'Desapilados' : 'Atendidos') + ': ' + esp.s.join(', ') + '.' : '.');
        terminar(ok, st.e.join(',') + (r.est !== 'lista' ? ' / salieron ' + st.s.join(',') : ''));
        pintarSim();
      });
    }
    return api;
  }
  function respuestaCorrecta(r) {
    if (r.tipo === 'opcion') return r.op[0];
    if (r.tipo === 'valor') return r.acepta[0];
    if (r.tipo === 'linea') return 'Línea ' + r.correcta + '.';
    if (r.tipo === 'ordenar') return '';
    return '';
  }
  function guiaHTML(rg, txt) {
    var g = GUIAS[rg.guia] || GUIAS.bit;
    return '<div class="k-guia" style="--rc:' + colorReg(rg.n - 1) + '"><img src="' + g.img + '" alt="' + g.nom + '" onerror="this.outerHTML=\'<span style=&quot;font-size:40px&quot;>' + g.emoji + '</span>\'"><div><div class="nm">' + g.nom + ' · ' + esc(rg.nombre) + '</div><p>' + esc(txt) + '</p></div></div>';
  }

  /* ═══════════════════════════════════════════
     PANTALLA DE INICIO
  ═══════════════════════════════════════════ */
  var P = null, S = null, reloj = null, nEquipos = 1;

  function pantallaInicio() {
    pararReloj(); P = null; S = null;
    var todas = REG.partidas.todas();
    var enCurso = Object.keys(todas).map(function (k) { return todas[k]; }).filter(function (p) { return !p.terminada; })
      .sort(function (a, b) { return a.creada < b.creada ? 1 : -1; });
    var cursos = CFG.cursos && CFG.cursos.length ? CFG.cursos : ['3° A'];
    raiz.innerHTML = '<div class="k-inicio">' +
      '<div class="k-kicker">// 3er curso · repaso para el examen · juego</div>' +
      '<h1 class="k-h1">🌋 Expedición Kernel</h1>' +
      '<p class="k-lead">Un apagón borró el <b>Kernel</b> del colegio justo antes del examen. Para recuperarlo hay que cruzar cuatro regiones: normalizar datos, consultar con SQL, dominar las estructuras y pensar como el compilador de Java. <b>El dado pone la suerte; el conocimiento pone el avance.</b></p>' +
      '<div class="k-mapa-mini" style="margin-top:14px">' + REGIONES.map(function (rg, i) { return '<span style="border-color:' + colorReg(i) + '">' + rg.ico + ' ' + esc(rg.nombre) + '</span>'; }).join('') + '<span>💾 Kernel</span></div>' +

      '<div class="k-modos">' +
        '<div class="k-modo prin"><div class="ico">🎲</div><h2>Expedición</h2>' +
          '<p>Juego de tablero con historia, dado y guardianes. Solo o con 2 a 4 equipos por turnos (en el proyector).</p>' +
          '<label class="k-campo">Curso<select id="k-curso">' + cursos.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></label>' +
          '<div><div style="font-size:13px;color:var(--texto2);margin-bottom:6px">¿Cuántos juegan?</div><div class="k-seg" id="k-cuantos">' +
            [1, 2, 3, 4].map(function (n) { return '<button type="button" data-n="' + n + '"' + (n === nEquipos ? ' class="act"' : '') + '>' + (n === 1 ? 'Solo' : n + ' equipos') + '</button>'; }).join('') + '</div></div>' +
          '<div class="k-equipos-in" id="k-nombres"></div>' +
          '<div><button type="button" class="k-btn solid xl" id="k-empezar">Zarpar 🚀</button></div>' +
        '</div>' +
        '<div class="k-modo"><div class="ico">📝</div><h2>Simulacro de examen</h2>' +
          '<p>' + (CFG.simulacro && CFG.simulacro.preguntas || 15) + ' preguntas al azar, de nivel N3 a N6' + (CFG.simulacro && CFG.simulacro.minutos ? ', en ' + CFG.simulacro.minutos + ' minutos' : '') + '. Sin pistas ni ayuda: al final ves tu nota y la explicación de cada pregunta.</p>' +
          '<label class="k-campo">Tu nombre<input type="text" id="k-sim-nombre" maxlength="40" placeholder="Nombre y apellido"></label>' +
          '<label class="k-campo">Curso<select id="k-sim-curso">' + cursos.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></label>' +
          '<div><div style="font-size:13px;color:var(--texto2);margin-bottom:6px">Temas</div><div class="k-checks">' +
            REGIONES.map(function (rg) { return '<label><input type="checkbox" value="' + rg.id + '" checked> ' + rg.ico + ' ' + esc(rg.area) + '</label>'; }).join('') + '</div></div>' +
          '<div><button type="button" class="k-btn" id="k-sim-empezar">Empezar el simulacro</button></div>' +
        '</div>' +
      '</div>' +

      (enCurso.length ? '<div class="k-card"><h3>Continuar una expedición</h3><div class="k-guardadas">' +
        enCurso.map(function (p) {
          return '<div class="k-guardada"><span class="nm">' + p.equipos.map(function (e, i) { return TOKENS[i] + ' ' + esc(e.nom); }).join(' · ') + '</span>' +
            '<span class="info">' + esc(p.curso) + ' · ' + p.equipos.map(function (e) { return Math.round(Math.min(e.pos, META) / META * 100) + '%'; }).join(' / ') + ' · ⏱ ' + mmss(p.ms) + '</span>' +
            '<button type="button" class="k-btn sm solid" data-seguir="' + esc(p.id) + '">Seguir</button>' +
            '<button type="button" class="k-btn sm" data-borrar="' + esc(p.id) + '">Borrar</button></div>';
        }).join('') + '</div></div>' : '') +

      '<div class="k-card"><h3>Cómo se juega</h3><div class="k-reglas">' +
        '<div class="k-regla"><span class="ico">🎲</span><span><b>Tiras el dado</b>1–2 → desafío N3 · 3–4 → N4 · 5–6 → N5. Más suerte, desafío más difícil.</span></div>' +
        '<div class="k-regla"><span class="ico">✅</span><span><b>Solo avanzas si aciertas</b>Avanzas lo que salió en el dado. Si fallas, te quedas y ves la explicación.</span></div>' +
        '<div class="k-regla"><span class="ico">🗿</span><span><b>Guardianes</b>Al final de cada región hay un caso de 3 pasos (N4–N6). Con suerte no se salta.</span></div>' +
        Object.keys(EVENTO).map(function (k) { return '<div class="k-regla"><span class="ico">' + EVENTO[k].ico + '</span><span><b>' + EVENTO[k].nom + '</b>' + EVENTO[k].txt.charAt(0).toUpperCase() + EVENTO[k].txt.slice(1) + '.</span></div>'; }).join('') +
        '<div class="k-regla"><span class="ico">🃏</span><span><b>Comodines</b>' + Object.keys(COMODIN).map(function (k) { return COMODIN[k].ico + ' ' + COMODIN[k].nom; }).join(' · ') + '. Se ganan en los cofres.</span></div>' +
      '</div></div>' +
      '<p style="margin-top:18px;font-size:13px;color:var(--texto3)">El progreso se guarda en este navegador. <a href="panel.html" style="color:var(--acento)">Panel de fallas (docente)</a></p>' +
      '</div>';

    function pintarNombres() {
      var prev = qa('#k-nombres input').map(function (i) { return i.value; });
      q('#k-nombres').innerHTML = indices(nEquipos).map(function (i) {
        return '<label><span class="tok">' + TOKENS[i] + '</span><input type="text" maxlength="30" data-eq="' + i + '" placeholder="' + (nEquipos === 1 ? 'Tu nombre' : 'Equipo ' + (i + 1)) + '" value="' + esc(prev[i] || '') + '"></label>';
      }).join('');
    }
    pintarNombres();
    qa('#k-cuantos button').forEach(function (b) {
      b.addEventListener('click', function () { nEquipos = Number(b.dataset.n); qa('#k-cuantos button').forEach(function (x) { x.classList.toggle('act', x === b); }); pintarNombres(); });
    });
    q('#k-empezar').addEventListener('click', function () {
      var noms = qa('#k-nombres input').map(function (inp, i) { return inp.value.trim() || (nEquipos === 1 ? 'Explorador/a' : 'Equipo ' + (i + 1)); });
      nuevaExpedicion(noms, q('#k-curso').value);
    });
    q('#k-sim-empezar').addEventListener('click', function () {
      var inp = q('#k-sim-nombre'), nom = inp.value.trim();
      if (!nom) { inp.focus(); inp.placeholder = 'Escribe tu nombre para empezar'; return; }
      var temas = qa('.k-checks input:checked').map(function (c) { return c.value; });
      if (!temas.length) return;
      nuevoSimulacro(nom, q('#k-sim-curso').value, temas);
    });
    qa('[data-seguir]').forEach(function (b) { b.addEventListener('click', function () { P = REG.partidas.todas()[b.dataset.seguir]; if (P) pantallaExpedicion(); }); });
    qa('[data-borrar]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.conf) { REG.partidas.borrar(b.dataset.borrar); pantallaInicio(); }
        else { b.dataset.conf = '1'; b.textContent = '¿Seguro? Borrar'; }
      });
    });
  }

  /* ═══════════════════════════════════════════
     EXPEDICIÓN
  ═══════════════════════════════════════════ */
  function nuevaExpedicion(noms, curso) {
    var ini = CFG.comodinesIniciales || { pista: 1, mitad: 0, dado: 0 };
    P = {
      id: 'ek-' + Date.now().toString(36) + azar(1e4).toString(36), tipo: 'exp', curso: curso, creada: ahora(),
      equipos: noms.map(function (n) { return { nom: n, pos: 0, paso: 0, com: { pista: ini.pista || 0, mitad: ini.mitad || 0, dado: ini.dado || 0 }, pts: 0, ok: 0, n: 0, tormenta: false }; }),
      turno: 0, fase: 'tirar', dado: 0, reto: null, vistos: {}, ms: 0, terminada: false, bitacora: []
    };
    anotar('🚀 Zarpan: ' + noms.join(', ') + '.');
    guardar();
    pantallaExpedicion();
    modalIntro();
  }
  function guardar() { if (P) REG.partidas.guardar(P); }
  function eqAct() { return P.equipos[P.turno]; }
  function anotar(t) { P.bitacora.unshift(t); if (P.bitacora.length > 40) P.bitacora.length = 40; }

  function pantallaExpedicion() {
    if (P.fase === 'resuelto' || P.fase === 'fin-turno') { P.fase = 'tirar'; P.reto = null; }
    raiz.innerHTML = '<div class="k-juego">' +
      '<div class="k-hud"><span class="tit">🌋 Expedición Kernel</span><span class="k-chip" id="k-reloj">⏱ 0:00</span>' +
      '<button type="button" class="k-btn sm" id="k-reglas">❓ Reglas</button><button type="button" class="k-btn sm" id="k-salir">💾 Guardar y salir</button></div>' +
      '<div class="k-izq"><div class="k-tablero" id="k-tablero"></div><div class="k-mesa" id="k-mesa"></div></div>' +
      '<aside class="k-lado" id="k-lado"></aside>' +
      '</div><div id="k-capa"></div>';
    q('#k-salir').addEventListener('click', function () { guardar(); pantallaInicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    q('#k-reglas').addEventListener('click', modalIntro);
    pintarTablero(); pintarLado(); pintarMesa();
    arrancarReloj();
  }

  function pintarTablero() {
    var html = '';
    REGIONES.forEach(function (rg, ri) {
      var celdas = indices(CELDAS).map(function (k) { return ri * CELDAS + k; });
      if (ri % 2 === 1) celdas.reverse();
      html += '<div class="k-reg-lbl" style="--rc:' + colorReg(ri) + '">' + rg.ico + ' ' + esc(rg.nombre) + ' <span style="color:var(--texto3)">· ' + esc(rg.area) + '</span></div>';
      html += celdas.map(function (pos) {
        var k = pos % CELDAS, ev = eventoEn(pos), g = esGuardian(pos);
        var aqui = P.equipos.map(function (e, i) { return e.pos === pos ? i : -1; }).filter(function (i) { return i >= 0; });
        var vencido = g && P.equipos.every(function (e) { return e.pos > pos; });
        var ico = g ? rg.guardian.ico : ev ? EVENTO[ev].ico : k === 0 ? '⛺' : '';
        var tit = g ? rg.guardian.nombre : ev ? EVENTO[ev].nom : k === 0 ? 'Campamento' : 'Casilla';
        return '<div class="k-celda' + (g ? ' guard' : '') + (vencido ? ' vencido' : '') + (aqui.indexOf(P.turno) >= 0 && !P.terminada ? ' aqui' : '') + '" style="--rc:' + colorReg(ri) + '" title="' + esc(tit) + '">' +
          '<span class="num">' + (pos + 1) + '</span><span class="ev">' + ico + '</span>' +
          (aqui.length ? '<span class="toks">' + aqui.map(function (i) { return '<span title="' + esc(P.equipos[i].nom) + '">' + TOKENS[i] + '</span>'; }).join('') + '</span>' : '') + '</div>';
      }).join('');
    });
    var llegaron = P.equipos.filter(function (e) { return e.pos >= META; });
    q('#k-tablero').innerHTML = '<div class="k-grid">' + html + '</div>' +
      '<div class="k-meta' + (llegaron.length ? ' si' : '') + '">💾 KERNEL ' + (llegaron.length ? '· recuperado por ' + llegaron.map(function (e) { return TOKENS[P.equipos.indexOf(e)] + ' ' + esc(e.nom); }).join(', ') : '') + '</div>' +
      '<div class="k-leyenda"><span>⛺ campamento</span>' + Object.keys(EVENTO).map(function (k) { return '<span>' + EVENTO[k].ico + ' ' + EVENTO[k].nom.toLowerCase() + '</span>'; }).join('') + '<span>🗿 guardián</span></div>';
  }

  function pintarLado() {
    q('#k-lado').innerHTML = '<h4>' + (P.equipos.length > 1 ? 'Tripulaciones' : 'Tu tripulación') + '</h4>' +
      P.equipos.map(function (e, i) {
        var rg = REGIONES[regionDe(Math.min(e.pos, META - 1))];
        var donde = e.pos >= META ? '💾 Kernel recuperado' : rg.ico + ' ' + rg.nombre + (esGuardian(e.pos) ? ' · guardián ' + e.paso + '/3' : ' · casilla ' + (e.pos + 1));
        return '<div class="k-eq' + (i === P.turno && !P.terminada ? ' act' : '') + '"><div class="cab"><span class="tok">' + TOKENS[i] + '</span><span class="nm">' + esc(e.nom) + '</span><span class="pts">' + e.pts + ' pts</span></div>' +
          '<div class="det">' + esc(donde) + (e.tormenta ? ' · 🌪️' : '') + '</div>' +
          '<div class="det">✔ ' + e.ok + ' de ' + e.n + ' desafíos</div>' +
          '<div class="coms">' + Object.keys(COMODIN).map(function (k) { return '<span class="' + (e.com[k] ? '' : 'cero') + '" title="' + COMODIN[k].nom + '">' + COMODIN[k].ico + ' ' + e.com[k] + '</span>'; }).join('') + '</div>' +
          '<div class="k-progreso"><i style="width:' + Math.round(Math.min(e.pos, META) / META * 100) + '%"></i></div></div>';
      }).join('') +
      '<h4 style="margin-top:6px">Bitácora</h4><div class="k-bitacora">' + P.bitacora.slice(0, 14).map(function (t) { return '<div>' + esc(t) + '</div>'; }).join('') + '</div>';
  }

  function pintarTodo() { pintarTablero(); pintarLado(); pintarMesa(); }

  /* ─── La mesa: según la fase ─── */
  function pintarMesa() {
    var m = q('#k-mesa'), e = eqAct();
    if (P.terminada) { m.innerHTML = '<div class="k-turno"><span class="quien">💾 ¡Kernel recuperado!</span></div><div class="k-pie"><button class="k-btn solid" id="k-ver-fin" type="button">Ver resultados</button></div>'; q('#k-ver-fin').addEventListener('click', modalFinal); return; }
    var rg = REGIONES[regionDe(e.pos)];
    var multi = P.equipos.length > 1;
    var cab = '<div class="k-turno" style="--rc:' + colorReg(rg.n - 1) + '"><span class="quien">' + TOKENS[P.turno] + ' ' + (multi ? 'Turno de ' : '') + esc(e.nom) + '</span>' +
      '<span class="donde">' + rg.ico + ' ' + esc(rg.nombre) + ' · ' + (esGuardian(e.pos) ? esc(rg.guardian.nombre) : 'casilla ' + (e.pos + 1) + ' de ' + META) + '</span></div>';

    if (P.fase === 'tirar') {
      if (esGuardian(e.pos)) {
        m.innerHTML = cab + guiaHTML(rg, rg.guardian.intro) +
          '<div class="k-aviso guard" style="--rc:' + colorReg(rg.n - 1) + '">' + rg.guardian.ico + ' <b>' + esc(rg.guardian.nombre) + '</b> · paso ' + (e.paso + 1) + ' de 3. Si lo resuelves, sigues con el próximo paso; si no, lo intentas en tu próximo turno.</div>' +
          '<div class="k-pie"><button class="k-btn solid xl" id="k-enfrentar" type="button">⚔️ Enfrentar al guardián</button></div>';
        q('#k-enfrentar').addEventListener('click', function () {
          P.reto = { id: rg.guardian.retos[e.paso], origen: 'guardian', nv: RETO[rg.guardian.retos[e.paso]].nv, avance: 0 };
          P.fase = 'reto'; guardar(); pintarMesa(); verMesa();
        });
        return;
      }
      m.innerHTML = cab + (e.pos % CELDAS === 0 ? guiaHTML(rg, rg.intro) : '') +
        '<div class="k-dado-zona"><div class="k-dado" id="k-dado">' + (P.dado || '🎲') + '</div>' +
        '<div class="k-tabla-dado"><b>1–2</b><span>N3 · Aplicar</span><span>avanzas 1 o 2</span><b>3–4</b><span>N4 · Analizar</span><span>avanzas 3 o 4</span><b>5–6</b><span>N5 · Evaluar</span><span>avanzas 5 o 6</span></div></div>' +
        (e.tormenta ? '<div class="k-aviso tormenta">🌪️ <b>Tormenta:</b> sin importar el dado, tu próximo desafío es N5 y vale el doble.</div>' : '') +
        '<div class="k-pie"><button class="k-btn solid xl" id="k-tirar" type="button">🎲 Tirar el dado</button></div>';
      q('#k-tirar').addEventListener('click', tirar);
      return;
    }

    if (P.fase === 'reto' && !(P.reto && RETO[P.reto.id])) { P.fase = 'tirar'; P.reto = null; pintarMesa(); return; }
    if (P.fase === 'reto') {
      var pr = P.reto, r = RETO[pr.id];
      var base = PUNTOS[r.nv] || 100, mult = pr.doble ? 2 : 1;
      var premio = pr.origen === 'dado' ? 'Si aciertas: avanzas ' + pr.avance + ' · +' + base * mult + ' pts'
        : pr.origen === 'bug' ? 'Si aciertas: +' + (CFG.bonoBug || 50) + ' pts · si fallas: retrocedes 2'
        : pr.origen === 'portal' ? 'Si aciertas: saltas 3 casillas · +' + base + ' pts'
        : 'Paso ' + (e.paso + 1) + ' de 3 · +' + base + ' pts';
      m.innerHTML = cab +
        '<div class="k-reto-cab" style="margin-top:12px"><span class="k-chip nv">N' + r.nv + ' · ' + NIVEL_NOM[r.nv] + '</span><span class="k-chip">' + TIPO_NOM[r.tipo] + '</span><span class="k-chip">' + esc(r.sub) + '</span>' +
        (pr.origen === 'bug' ? '<span class="k-chip alerta">🐛 Bug</span>' : pr.origen === 'portal' ? '<span class="k-chip">🌀 Portal</span>' : pr.doble ? '<span class="k-chip">🌪️ ×2</span>' : '') +
        '<span class="premio">' + premio + '</span></div>' +
        '<div class="k-comodines" id="k-coms"></div><div id="k-reto"></div><div id="k-tras"></div>';
      var usados = {};
      var api = montarReto(q('#k-reto'), r, { revelar: pr.origen !== 'guardian', alResponder: function (ok, resp) { responder(ok, resp, usados, api); } });
      var pintarComs = function (bloq) {
        var c = q('#k-coms'); if (!c) return;
        var lista = [];
        if (!usados.pista) lista.push(['pista', e.com.pista > 0]);
        if (r.tipo === 'opcion' && r.op.length > 2 && !usados.mitad) lista.push(['mitad', e.com.mitad > 0]);
        if (pr.origen === 'dado' && !usados.dado) lista.push(['dado', e.com.dado > 0]);
        c.innerHTML = lista.map(function (x) {
          return '<button type="button" class="k-btn sm" data-com="' + x[0] + '"' + (x[1] && !bloq ? '' : ' disabled') + ' title="' + COMODIN[x[0]].txt + '">' + COMODIN[x[0]].ico + ' ' + COMODIN[x[0]].nom + ' (' + e.com[x[0]] + ')' + (x[0] === 'pista' ? ' · −' + (CFG.descuentoPista || 30) + '%' : '') + '</button>';
        }).join('');
        qa('[data-com]', c).forEach(function (b) {
          b.addEventListener('click', function () {
            var k = b.dataset.com; if (e.com[k] <= 0) return;
            e.com[k]--; usados[k] = true;
            if (k === 'pista') api.pista();
            if (k === 'mitad') api.mitad();
            anotar(TOKENS[P.turno] + ' ' + e.nom + ' usa ' + COMODIN[k].ico + ' ' + COMODIN[k].nom + '.');
            guardar(); pintarLado();
            if (k === 'dado') { P.fase = 'tirar'; tirar(true); return; }
            pintarComs();
          });
        });
      };
      pintarComs();
      api.bloquearComodines = function () { pintarComs(true); };
    }
  }

  function verMesa() { var m = q('#k-mesa'); if (m && m.scrollIntoView) m.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy(0, -64); }

  function tirar(sinAnimar) {
    var e = eqAct(), dado = q('#k-dado'), btn = q('#k-tirar');
    if (btn) btn.disabled = true;
    var v = 1 + azar(6);
    function fin() {
      P.dado = v;
      var nv = e.tormenta ? 5 : nivelDado(v), doble = e.tormenta;
      e.tormenta = false;
      var rg = regionDe(e.pos);
      P.reto = { id: elegirReto(rg, nv), origen: 'dado', nv: nv, avance: v, doble: doble };
      anotar(TOKENS[P.turno] + ' ' + e.nom + ' saca un ' + v + ' → desafío N' + nv + (doble ? ' (tormenta ×2)' : '') + '.');
      P.fase = 'reto'; guardar(); pintarLado(); pintarMesa(); verMesa();
    }
    if (sinAnimar === true || !dado) { pintarMesa(); dado = q('#k-dado'); }
    if (!dado) { fin(); return; }
    dado.classList.add('gira');
    var t = 0, iv = setInterval(function () {
      dado.textContent = 1 + azar(6); t++;
      if (t > 9) { clearInterval(iv); dado.classList.remove('gira'); dado.textContent = v; setTimeout(fin, 450); }
    }, 70);
  }

  function elegirReto(ri, nv, excluir) {
    var pool = REGIONES[ri].retos.filter(function (x) { return !x.guardian && x.id !== excluir; });
    var cand = pool.filter(function (x) { return x.nv === nv; });
    var d = 1;
    while (!cand.length && d < 4) { cand = pool.filter(function (x) { return Math.abs(x.nv - nv) === d; }); d++; }
    if (!cand.length) cand = pool;
    if (sqlEstado === 'error') { var sin = cand.filter(function (x) { return x.tipo !== 'sql'; }); if (sin.length) cand = sin; }
    var min = Math.min.apply(null, cand.map(function (x) { return P.vistos[x.id] || 0; }));
    var menos = cand.filter(function (x) { return (P.vistos[x.id] || 0) === min; });
    var elegido = menos[azar(menos.length)];
    P.vistos[elegido.id] = (P.vistos[elegido.id] || 0) + 1;
    return elegido.id;
  }

  function registrarRespuesta(r, ok, resp, e, pista) {
    REG.registrar({
      partida: P.id, fecha: ahora(), curso: P.curso, modo: 'expedicion', equipo: e.nom, qid: r.id,
      tema: REGIONES[REGION_DE[r.id]].id, sub: r.sub + ' · N' + r.nv, n: 1, ok: !!ok,
      elegida: (pista ? '[pista] ' : '') + (ok ? '' : String(resp || '').slice(0, 200)), t: ahora()
    });
  }

  /* ─── Resultado de un desafío ─── */
  function responder(ok, resp, usados, api) {
    var e = eqAct(), pr = P.reto, r = RETO[pr.id];
    if (api.bloquearComodines) api.bloquearComodines();
    var tras = q('#k-tras');
    var salto = ok === null;
    if (salto && pr.origen !== 'guardian') {   // sin conexión (SQL)
      anotar('⚠ Desafío SQL saltado (sin conexión).');
      P.fase = 'fin-turno'; guardar();
      tras.innerHTML = '<div class="k-pie"><span class="der"><button class="k-btn solid" id="k-seguir" type="button">Seguir →</button></span></div>';
      q('#k-seguir').addEventListener('click', finTurno);
      return;
    }
    if (!salto) { e.n++; if (ok) e.ok++; registrarRespuesta(r, ok, resp, e, usados.pista); }
    else { ok = true; anotar('⚠ Paso SQL del guardián saltado (sin conexión).'); }
    var base = PUNTOS[r.nv] || 100, pts = 0, txt = '', accion = null;
    if (ok && !salto) {
      pts = pr.origen === 'bug' ? (CFG.bonoBug || 50) : base * (pr.doble ? 2 : 1);
      if (usados.pista) pts = Math.round(pts * (100 - (CFG.descuentoPista || 30)) / 100);
      e.pts += pts;
    }
    if (pr.origen === 'dado') {
      if (ok) {
        var dest = Math.min(e.pos + pr.avance, posGuardian(regionDe(e.pos)));
        txt = dest - e.pos < pr.avance ? 'Avanzas hasta el guardián (no se puede pasar de largo).' : 'Avanzas ' + pr.avance + ' casilla' + (pr.avance === 1 ? '' : 's') + '.';
        accion = function () { moverA(e, dest, function () { llegar(e); }); };
        anotar('✔ ' + e.nom + ' resuelve un N' + r.nv + ' (+' + pts + ').');
      } else { txt = 'Esta vez no avanzas.'; accion = finTurno; anotar('✘ ' + e.nom + ' falla un N' + r.nv + ' (' + r.sub + ').'); }
    } else if (pr.origen === 'bug') {
      if (ok) { txt = '¡Bug aplastado! Te quedas en tu casilla.'; accion = finTurno; anotar('🐛 ' + e.nom + ' aplasta un bug.'); }
      else {
        var atras = Math.max(regionDe(e.pos) * CELDAS, e.pos - 2);
        txt = 'El bug te hace retroceder ' + (e.pos - atras) + ' casilla' + (e.pos - atras === 1 ? '' : 's') + '.';
        accion = function () { moverA(e, atras, finTurno); }; anotar('🐛 El bug hace retroceder a ' + e.nom + '.');
      }
    } else if (pr.origen === 'portal') {
      if (ok) {
        var d2 = Math.min(e.pos + 3, posGuardian(regionDe(e.pos)));
        txt = '¡El portal te lleva ' + (d2 - e.pos) + ' casillas adelante!'; accion = function () { moverA(e, d2, finTurno); }; anotar('🌀 ' + e.nom + ' cruza el portal.');
      } else { txt = 'El portal se cierra, pero no pierdes nada.'; accion = finTurno; }
    } else if (pr.origen === 'guardian') {
      var rg = REGIONES[regionDe(e.pos)];
      if (ok) {
        e.paso++;
        if (e.paso >= 3) {
          e.pts += (CFG.bonoGuardian || 200);
          txt = '¡Venciste a ' + rg.guardian.nombre + '! +' + (CFG.bonoGuardian || 200) + ' pts extra.';
          accion = function () { cruzar(e, rg); };
          anotar('🏆 ' + e.nom + ' vence a ' + rg.guardian.nombre + '.');
          REG.enviarPendientes();
        } else {
          txt = 'Paso ' + e.paso + ' de 3 superado. ¡Sigue con el próximo!';
          accion = function () { P.reto = { id: rg.guardian.retos[e.paso], origen: 'guardian', nv: RETO[rg.guardian.retos[e.paso]].nv, avance: 0 }; P.fase = 'reto'; guardar(); pintarTodo(); verMesa(); };
          anotar('⚔️ ' + e.nom + ' supera el paso ' + e.paso + ' del guardián.');
        }
      } else { txt = 'El guardián resiste. Lo vuelves a intentar en tu próximo turno.'; accion = finTurno; anotar('🛡️ ' + rg.guardian.nombre + ' resiste a ' + e.nom + '.'); }
    }
    P.fase = 'resuelto'; guardar(); pintarLado();
    var cuerpo;
    if (ok) cuerpo = '<div class="k-msg ok"><b class="t">✔ ¡Correcto!' + (pts ? ' +' + pts + ' pts' : '') + '</b>' + esc(r.ex) + '<br><b>' + esc(txt) + '</b></div>';
    else if (pr.origen === 'guardian') cuerpo = '<div class="k-msg mal"><b class="t">✘ No es correcto</b>' + esc(txt) + ' Piensa en esto: ' + esc(r.pista) + '</div>';
    else {
      var corr = respuestaCorrecta(r);
      cuerpo = '<div class="k-msg mal"><b class="t">✘ No es correcto</b>' + (api.detalle ? esc(api.detalle) + '<br>' : '') + (corr ? 'Respuesta correcta: <b>' + esc(corr) + '</b><br>' : '') + esc(r.ex) + '<br><b>' + esc(txt) + '</b></div>';
    }
    tras.innerHTML = cuerpo + '<div class="k-pie"><span class="der"><button class="k-btn solid" id="k-seguir" type="button">Seguir →</button></span></div>';
    q('#k-seguir').addEventListener('click', function () { this.disabled = true; accion(); });
    var b = q('#k-seguir'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40);
  }

  function moverA(e, dest, cb) {
    var paso = dest > e.pos ? 1 : -1;
    if (e.pos === dest) { cb(); return; }
    var iv = setInterval(function () {
      e.pos += paso; pintarTablero();
      if (e.pos === dest) { clearInterval(iv); guardar(); pintarLado(); setTimeout(cb, 250); }
    }, 220);
  }

  /* ─── Al caer en una casilla ─── */
  function llegar(e) {
    var ev = eventoEn(e.pos), rg = REGIONES[regionDe(e.pos)];
    if (esGuardian(e.pos)) {
      e.paso = 0; guardar();
      modal(rg.guardian.ico, rg.guardian.nombre, '<p>' + esc(rg.guardian.intro) + '</p><p>Es un caso de <b>3 pasos</b>. ' + (P.equipos.length > 1 ? 'Lo enfrentan en su próximo turno.' : 'Lo enfrentas en tu próximo turno.') + '</p>', [['Entendido', true, finTurno]]);
      return;
    }
    if (ev === 'cofre') {
      var k = Object.keys(COMODIN)[azar(3)];
      e.com[k]++; anotar('🎁 ' + e.nom + ' abre un cofre: ' + COMODIN[k].ico + ' ' + COMODIN[k].nom + '.'); guardar(); pintarLado();
      modal('🎁', '¡Un cofre!', '<p>Ganas el comodín <b>' + COMODIN[k].ico + ' ' + COMODIN[k].nom + '</b>: ' + COMODIN[k].txt + '.</p>', [['¡Genial!', true, finTurno]]);
    } else if (ev === 'tormenta') {
      e.tormenta = true; anotar('🌪️ Tormenta sobre ' + e.nom + '.'); guardar(); pintarLado();
      modal('🌪️', 'Tormenta', '<p>Tu próximo desafío será <b>N5 (evaluar)</b> sin importar el dado… pero vale el <b>doble</b> de puntos.</p>', [['Que venga', true, finTurno]]);
    } else if (ev === 'bug') {
      modal('🐛', '¡Un bug!', '<p>Un bug se metió en tu código. Resuelve este desafío N3 para aplastarlo; si fallas, <b>retrocedes 2 casillas</b>.</p>', [['A aplastarlo', true, function () {
        P.reto = { id: elegirReto(regionDe(e.pos), 3), origen: 'bug', nv: 3, avance: 0 }; P.fase = 'reto'; guardar(); pintarMesa(); verMesa();
      }]]);
    } else if (ev === 'portal') {
      modal('🌀', 'Un portal', '<p>Puedes aceptar un desafío <b>N5</b>: si aciertas, <b>saltas 3 casillas</b> (sin pasar al guardián). Si fallas, no pierdes nada.</p>', [
        ['Acepto el desafío', true, function () { P.reto = { id: elegirReto(regionDe(e.pos), 5), origen: 'portal', nv: 5, avance: 3 }; P.fase = 'reto'; guardar(); pintarMesa(); verMesa(); }],
        ['Sigo de largo', false, finTurno]]);
    } else finTurno();
  }

  function cruzar(e, rg) {
    var sig = rg.n * CELDAS;
    e.paso = 0;
    if (sig >= META) {
      e.pos = META; P.terminada = true; P.ganador = P.turno; P.terminadaEn = ahora(); P.fase = 'fin';
      pararReloj(); guardar(); pintarTodo(); REG.enviarPendientes();
      modalFinal();
      return;
    }
    moverA(e, sig, function () {
      var nr = REGIONES[regionDe(sig)];
      modal(nr.ico, 'Llegas a ' + nr.nombre, guiaHTML(nr, nr.intro), [['A explorar', true, finTurno]]);
    });
  }

  function finTurno() {
    P.fase = 'tirar'; P.reto = null; P.dado = 0;
    if (P.equipos.length > 1) {
      var n = P.equipos.length, i = P.turno;
      do { i = (i + 1) % n; } while (P.equipos[i].pos >= META && i !== P.turno);
      P.turno = i;
    }
    guardar(); pintarTodo(); verMesa();
  }

  /* ─── Modales ─── */
  function modal(ico, tit, cuerpo, botones) {
    var capa = q('#k-capa'); if (!capa) return;
    capa.innerHTML = '<div class="k-velo"><div class="k-modal" role="dialog" aria-modal="true" aria-label="' + esc(tit) + '"><div class="gran">' + ico + '</div><h2>' + esc(tit) + '</h2>' + cuerpo +
      '<div class="k-pie">' + botones.map(function (b, i) { return '<button type="button" class="k-btn' + (b[1] ? ' solid' : '') + '" data-mb="' + i + '">' + b[0] + '</button>'; }).join('') + '</div></div></div>';
    qa('[data-mb]', capa).forEach(function (el) { el.addEventListener('click', function () { var b = botones[Number(el.dataset.mb)]; capa.innerHTML = ''; if (b[2]) b[2](); }); });
    var p = q('.k-btn.solid', capa); if (p) p.focus();
  }
  function modalIntro() {
    P.vistoIntro = true;
    modal('🌋', 'Expedición Kernel',
      '<p style="text-align:left">Un apagón borró el Kernel del colegio. Hay que cruzar <b>' + REGIONES.length + ' regiones</b> (' + REGIONES.map(function (r) { return r.ico + ' ' + r.nombre; }).join(', ') + ') y vencer a sus guardianes.</p>' +
      '<p style="text-align:left">🎲 <b>1–2</b> → N3 · <b>3–4</b> → N4 · <b>5–6</b> → N5. Si aciertas, avanzas lo que salió; si fallas, te quedas y aprendes la explicación.</p>' +
      '<p style="text-align:left">' + Object.keys(EVENTO).map(function (k) { return EVENTO[k].ico + ' ' + EVENTO[k].txt; }).join(' · ') + '.</p>',
      [['¡A zarpar!', true, null]]);
  }
  function modalFinal() {
    var orden = P.equipos.map(function (e, i) { return { e: e, i: i }; }).sort(function (a, b) { return (b.e.pos - a.e.pos) || (b.e.pts - a.e.pts); });
    var med = ['🥇', '🥈', '🥉', '4°'];
    var g = P.equipos[P.ganador || 0];
    modal('💾', '¡' + (P.equipos.length > 1 ? esc(g.nom) + ' recupera' : 'Recuperaste') + ' el Kernel!',
      '<p>⏱ ' + mmss(P.ms) + '</p>' +
      '<table><thead><tr><th></th><th>' + (P.equipos.length > 1 ? 'Equipo' : 'Jugador') + '</th><th class="num">Puntos</th><th class="num">Aciertos</th></tr></thead><tbody>' +
      orden.map(function (o, k) { return '<tr><td>' + med[k] + '</td><td>' + TOKENS[o.i] + ' ' + esc(o.e.nom) + '</td><td class="num">' + o.e.pts + '</td><td class="num">' + o.e.ok + ' / ' + o.e.n + '</td></tr>'; }).join('') +
      '</tbody></table><p style="margin-top:12px;font-size:14px">¿Quieres medirte de verdad? Prueba el <b>simulacro de examen</b>.</p>',
      [['Volver al inicio', true, function () { pantallaInicio(); window.scrollTo({ top: 0, behavior: 'instant' }); }], ['Ver el tablero', false, null]]);
  }

  /* ═══════════════════════════════════════════
     SIMULACRO DE EXAMEN
  ═══════════════════════════════════════════ */
  var SIMC = CFG.simulacro || {};
  function nuevoSimulacro(nombre, curso, temas) {
    var n = SIMC.preguntas || 15;
    var listas = REGIONES.filter(function (rg) { return temas.indexOf(rg.id) >= 0; }).map(function (rg) {
      return mezclar(rg.retos.filter(function (x) { return !(sqlEstado === 'error' && x.tipo === 'sql'); }).map(function (x) { return x.id; }));
    });
    var elegidas = [], k = 0;
    while (elegidas.length < n && listas.some(function (l) { return l.length; })) {
      var l = listas[k % listas.length]; if (l.length) elegidas.push(l.shift()); k++;
    }
    S = { id: 'sim-' + Date.now().toString(36) + azar(1e4).toString(36), nombre: nombre, curso: curso, temas: temas,
      preguntas: mezclar(elegidas), i: 0, resp: {}, inicio: Date.now(), limite: (SIMC.minutos || 0) * 60000, terminado: false };
    pantallaSimulacro();
  }
  function pantallaSimulacro() {
    raiz.innerHTML = '<div class="k-sim-juego">' +
      '<div class="k-hud"><span class="tit">📝 Simulacro · ' + esc(S.nombre) + '</span><span class="k-chip" id="k-prog"></span><span class="k-chip" id="k-reloj"></span>' +
      '<button type="button" class="k-btn sm" id="k-entregar">Entregar</button></div>' +
      '<div class="k-barra"><i id="k-barra"></i></div>' +
      '<div class="k-mesa" id="k-mesa"></div></div><div id="k-capa"></div>';
    q('#k-entregar').addEventListener('click', function () {
      var faltan = S.preguntas.length - Object.keys(S.resp).length;
      modal('📝', '¿Entregar el simulacro?', faltan ? '<p>Te ' + (faltan === 1 ? 'falta 1 pregunta' : 'faltan ' + faltan + ' preguntas') + '. Las que no respondas cuentan como incorrectas.</p>' : '<p>Respondiste todo.</p>',
        [['Entregar', true, terminarSimulacro], ['Seguir', false, null]]);
    });
    pintarPregunta();
    pararReloj();
    reloj = setInterval(function () {
      if (!S || S.terminado) return;
      pintarRelojSim();
      if (S.limite && Date.now() - S.inicio >= S.limite) terminarSimulacro(true);
    }, 1000);
    pintarRelojSim();
  }
  function pintarRelojSim() {
    var el = q('#k-reloj'); if (!el) return;
    var t = Date.now() - S.inicio;
    if (S.limite) { var resta = S.limite - t; el.textContent = '⏳ ' + mmss(resta); el.classList.toggle('alerta', resta < 120000); }
    else el.textContent = '⏱ ' + mmss(t);
  }
  function pintarPregunta() {
    var id = S.preguntas[S.i], r = RETO[id], rg = REGIONES[REGION_DE[id]];
    q('#k-prog').textContent = 'Pregunta ' + (S.i + 1) + ' de ' + S.preguntas.length;
    q('#k-barra').style.width = Math.round(Object.keys(S.resp).length / S.preguntas.length * 100) + '%';
    var m = q('#k-mesa');
    m.innerHTML = '<div class="k-reto-cab"><span class="k-chip" style="border-color:' + colorReg(rg.n - 1) + '">' + rg.ico + ' ' + esc(rg.area) + '</span><span class="k-chip nv">N' + r.nv + ' · ' + NIVEL_NOM[r.nv] + '</span><span class="k-chip">' + TIPO_NOM[r.tipo] + '</span>' +
      '<span class="premio">' + ((SIMC.peso || {})[r.nv] || 1) + ' pt' + (((SIMC.peso || {})[r.nv] || 1) === 1 ? '' : 's') + '</span></div><div id="k-reto"></div><div id="k-tras"></div>';
    if (S.resp[id]) {
      q('#k-reto').innerHTML = '<div class="k-q">' + esc(r.q) + '</div><div class="k-msg">Ya respondiste esta pregunta.</div>';
      navSim();
      return;
    }
    montarReto(q('#k-reto'), r, { revelar: false, alResponder: function (ok, resp) {
      S.resp[id] = { ok: ok, resp: resp };
      q('#k-barra').style.width = Math.round(Object.keys(S.resp).length / S.preguntas.length * 100) + '%';
      navSim(true);
    } });
    navSim();
  }
  function navSim(recien) {
    var tras = q('#k-tras'), ult = S.i === S.preguntas.length - 1, id = S.preguntas[S.i];
    tras.innerHTML = (recien ? '<div class="k-msg">✔ Respuesta registrada.</div>' : '') +
      '<div class="k-pie">' + (S.i > 0 ? '<button class="k-btn sm" id="k-ant" type="button">← Anterior</button>' : '') +
      '<span class="der">' + (ult ? '<button class="k-btn solid" id="k-fin" type="button">Entregar el simulacro</button>'
        : '<button class="k-btn' + (S.resp[id] ? ' solid' : '') + '" id="k-sig" type="button">' + (S.resp[id] ? 'Siguiente →' : 'Saltar por ahora →') + '</button>') + '</span></div>';
    var a = q('#k-ant'); if (a) a.addEventListener('click', function () { S.i--; pintarPregunta(); });
    var s = q('#k-sig'); if (s) s.addEventListener('click', function () { S.i++; pintarPregunta(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    var f = q('#k-fin'); if (f) f.addEventListener('click', function () { q('#k-entregar').click(); });
  }
  function notaDe(pct) {
    var esc_ = (SIMC.escala || [{ desde: 0, nota: 1 }, { desde: 60, nota: 2 }, { desde: 70, nota: 3 }, { desde: 80, nota: 4 }, { desde: 90, nota: 5 }]).slice().sort(function (a, b) { return a.desde - b.desde; });
    var n = esc_[0].nota; esc_.forEach(function (x) { if (pct >= x.desde) n = x.nota; }); return n;
  }
  function terminarSimulacro(porTiempo) {
    if (S.terminado) return;
    S.terminado = true; pararReloj();
    var peso = SIMC.peso || {}, total = 0, logrado = 0, porReg = {};
    var validas = S.preguntas.filter(function (id) { return !(S.resp[id] && S.resp[id].ok === null); });
    validas.forEach(function (id) {
      var r = RETO[id], w = peso[r.nv] || 1, res = S.resp[id], ok = !!(res && res.ok);
      total += w; if (ok) logrado += w;
      var rgid = REGIONES[REGION_DE[id]].id; porReg[rgid] = porReg[rgid] || { ok: 0, n: 0 }; porReg[rgid].n++; if (ok) porReg[rgid].ok++;
      REG.registrar({ partida: S.id, fecha: ahora(), curso: S.curso, modo: 'simulacro', equipo: S.nombre, qid: id, tema: rgid,
        sub: r.sub + ' · N' + r.nv, n: 1, ok: ok, elegida: ok ? '' : (res ? String(res.resp || '').slice(0, 200) : '[sin responder]'), t: ahora() });
    });
    REG.enviarPendientes();
    var pct = total ? Math.round(logrado / total * 100) : 0, nota = notaDe(pct);
    REG.simulacros.agregar({ id: S.id, fecha: ahora(), nombre: S.nombre, curso: S.curso, pct: pct, nota: nota, puntos: logrado, total: total, ms: Date.now() - S.inicio });
    var flojo = Object.keys(porReg).map(function (k) { return { k: k, p: porReg[k].ok / porReg[k].n }; }).sort(function (a, b) { return a.p - b.p; })[0];
    var rgFlojo = flojo && flojo.p < 1 ? REGIONES.filter(function (r) { return r.id === flojo.k; })[0] : null;
    raiz.innerHTML = '<div class="k-sim-juego"><div class="k-card" style="text-align:center">' +
      (porTiempo ? '<p style="color:var(--mal);font-weight:700">⏳ Se terminó el tiempo.</p>' : '') +
      '<div class="k-kicker">Simulacro · ' + esc(S.nombre) + ' · ' + esc(S.curso) + '</div><div class="k-nota">' + nota + '</div>' +
      '<p style="font-size:18px">' + logrado + ' de ' + total + ' puntos · <b>' + pct + '%</b> · ⏱ ' + mmss(Date.now() - S.inicio) + '</p>' +
      '<div class="k-mapa-mini" style="justify-content:center">' + Object.keys(porReg).map(function (k) { var rg = REGIONES.filter(function (r) { return r.id === k; })[0]; return '<span style="border-color:' + colorReg(rg.n - 1) + '">' + rg.ico + ' ' + esc(rg.area) + ': ' + porReg[k].ok + '/' + porReg[k].n + '</span>'; }).join('') + '</div>' +
      (rgFlojo ? '<p style="margin-top:12px">Para repasar primero: <b>' + rgFlojo.ico + ' ' + esc(rgFlojo.area) + '</b>. En la expedición puedes practicarla con explicaciones.</p>' : '<p style="margin-top:12px">¡Todo bien! 🎉</p>') +
      '<div class="k-pie" style="justify-content:center"><button class="k-btn solid" id="k-otro" type="button">Otro simulacro</button><button class="k-btn" id="k-inicio" type="button">Volver al inicio</button></div></div>' +
      '<div class="k-card"><h3>Revisión pregunta por pregunta</h3><div style="overflow-x:auto"><table class="k-revision"><thead><tr><th>#</th><th>Pregunta</th><th>Nivel</th><th>Resultado</th></tr></thead><tbody>' +
      S.preguntas.map(function (id, i) {
        var r = RETO[id], res = S.resp[id], est = !res ? '<span class="no">sin responder</span>' : res.ok === null ? 'no cuenta' : res.ok ? '<span class="si">✔</span>' : '<span class="no">✘</span>';
        var corr = respuestaCorrecta(r);
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(r.q) + '<details><summary>Ver explicación</summary><p>' + (res && !res.ok && res.resp ? 'Tu respuesta: <code>' + esc(String(res.resp).slice(0, 160)) + '</code><br>' : '') + (corr ? 'Correcta: <b>' + esc(corr) + '</b><br>' : '') + esc(r.ex) + '</p></details></td><td>N' + r.nv + '</td><td>' + est + '</td></tr>';
      }).join('') + '</tbody></table></div></div></div>';
    q('#k-otro').addEventListener('click', function () { nuevoSimulacro(S.nombre, S.curso, S.temas); window.scrollTo({ top: 0, behavior: 'instant' }); });
    q('#k-inicio').addEventListener('click', function () { pantallaInicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ─────────── Cronómetro de la expedición ─────────── */
  function arrancarReloj() {
    pararReloj();
    if (!P || P.terminada) { var el0 = q('#k-reloj'); if (el0 && P) el0.textContent = '⏱ ' + mmss(P.ms); return; }
    reloj = setInterval(function () {
      if (!P || P.terminada || document.hidden) return;
      P.ms += 1000;
      var el = q('#k-reloj'); if (el) el.textContent = '⏱ ' + mmss(P.ms);
      if (P.ms % 15000 === 0) guardar();
    }, 1000);
  }
  function pararReloj() { if (reloj) clearInterval(reloj); reloj = null; }
  window.addEventListener('beforeunload', function () { guardar(); });

  /* ─────────── Arranque ─────────── */
  window.__ek = { estado: function () { return P; }, sim: function () { return S; }, regiones: REGIONES, reto: RETO, sql: function () { return sqlEstado; } };
  if (REG.pendientes()) REG.enviarPendientes();
  cargarSQL();
  pantallaInicio();
})();
