/* ═══════════════════════════════════════════
   BATIN · Sistema en Producción — motor del escape room
   · Cada sala es una capa del sistema de la biblioteca.
   · Al resolver todos los retos de una sala se obtiene su LLAVE
     y se abre la siguiente.
   · El progreso se guarda solo: un equipo puede seguir otro día.
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.SP_CONFIG || {};
  var REG = window.SpRegistro;
  var CASO = window.SP_CASO || {};
  var BD = window.SP_BD || [];
  var PLAN = window.SP_PLANILLA;
  var raiz = document.getElementById('sp');
  if (!raiz) return;

  var SALAS = (window.SP_SALAS || []).filter(function (s) { return !s.opcional || CFG[s.opcional]; });
  var OCULTAS = (window.SP_SALAS || []).filter(function (s) { return s.opcional && !CFG[s.opcional]; });
  var GUIAS = {
    techi:  { nom: 'TECHI',  img: '../../img/techi_explicando.png',  emoji: '👩‍💻' },
    bit:    { nom: 'BIT',    img: '../../img/bit_explicando.png',    emoji: '🤖' },
    gatiel: { nom: 'GATIEL', img: '../../img/gatiel_explicando.png', emoji: '🐱' }
  };
  var TIPO_NOM = { opcion: 'Elige', valor: 'Responde', ordenar: 'Ordena', clasificar: 'Clasifica', sql: 'SQL en vivo' };

  /* ─────────── Utilidades ─────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function escT(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function q(s) { return raiz.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(raiz.querySelectorAll(s)); }
  function azar(n) { return Math.floor(Math.random() * n); }
  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ahora() { return new Date().toISOString(); }
  function indices(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function desordenar(n) { var a; var k = 0; do { a = mezclar(indices(n)); } while (n > 1 && a.every(function (v, i) { return v === i; }) && k++ < 20); return a; }
  function mmss(ms) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (x < 10 ? '0' : '') + x; }
  function normalizar(s) {
    return String(s).toLowerCase()
      .replace(/guaran[ií]es|gs\.?|₲/g, '')
      .replace(/(\d)\.(?=\d{3}\b)/g, '$1')
      .replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* ─────────── SQL en el navegador (sql.js) ─────────── */
  var SQL = null, sqlEstado = 'cargando';
  function cargarSQL() {
    if (typeof window.initSqlJs !== 'function') { sqlEstado = 'error'; return; }
    window.initSqlJs({ locateFile: function (f) { return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/' + f; } })
      .then(function (s) { SQL = s; sqlEstado = 'listo'; if (P && retoActual() && retoActual().tipo === 'sql') pintarReto(); })
      .catch(function () { sqlEstado = 'error'; if (P && retoActual() && retoActual().tipo === 'sql') pintarReto(); });
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
    try {
      if (r.cambio) { db.exec(r.solucion); return ultimo(db.exec(r.verificar)); }
      return ultimo(db.exec(r.solucion));
    } finally { db.close(); }
  }
  function tablaHTML(res, max) {
    if (!res) return '<div class="info">La consulta no devolvió filas.</div>';
    max = max || 50;
    return '<div class="info">' + res.values.length + ' fila' + (res.values.length === 1 ? '' : 's') + '</div>' +
      '<table class="e-datos"><thead><tr>' + res.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      res.values.slice(0, max).map(function (r) {
        return '<tr>' + r.map(function (v) { return v === null ? '<td class="null">NULL</td>' : '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }

  /* ─────────── Resaltado de código ─────────── */
  var KW = {
    py: ['for', 'in', 'if', 'elif', 'else', 'while', 'print', 'input', 'int', 'str', 'range', 'len', 'sum', 'or', 'and', 'not', 'True', 'False'],
    pseudo: ['Algoritmo', 'FinAlgoritmo', 'Leer', 'Escribir', 'Si', 'Entonces', 'SiNo', 'FinSi', 'Para', 'Hasta', 'Con', 'Paso', 'Hacer', 'FinPara', 'Mientras', 'FinMientras'],
    java: ['import', 'public', 'class', 'static', 'void', 'new', 'int', 'double', 'String', 'if', 'else', 'for', 'while', 'return', 'true', 'false'],
    sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP', 'BY', 'ORDER', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'INTEGER', 'TEXT', 'NOT', 'NULL', 'REFERENCES', 'DEFAULT', 'UNIQUE', 'PRIMARY', 'KEY', 'AND', 'OR', 'IS', 'COUNT', 'AS', 'DISTINCT']
  };
  function resaltar(linea, lang) {
    if (lang === 'txt') return escT(linea);
    var com = lang === 'sql' ? '--' : lang === 'java' ? '//' : lang === 'py' ? '#' : null;
    var ic = com ? linea.indexOf(com) : -1;
    var resto = '';
    if (ic >= 0 && linea.slice(0, ic).split('"').length % 2 === 1) { resto = '<span class="com">' + escT(linea.slice(ic)) + '</span>'; linea = linea.slice(0, ic); }
    var re = (lang === 'sql' || lang === 'java') ? /"[^"]*"|'[^']*'/g : /"[^"]*"/g;
    var partes = [], m, u = 0;
    while ((m = re.exec(linea))) { partes.push({ t: linea.slice(u, m.index) }); partes.push({ t: m[0], s: 1 }); u = re.lastIndex; }
    partes.push({ t: linea.slice(u) });
    var rk = new RegExp('\\b(' + KW[lang].join('|') + ')\\b', 'g');
    return partes.map(function (p) {
      if (p.s) return '<span class="str">' + escT(p.t) + '</span>';
      return escT(p.t).replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>').replace(rk, '<span class="kw">$1</span>');
    }).join('') + resto;
  }
  function bloqueCodigo(code) {
    var lang = code.lang || 'txt';
    return '<div class="codigo ' + (lang === 'pseudo' ? 'pseudo' : 'oscuro') + '"><table>' +
      code.txt.split('\n').map(function (l, i) { return '<tr><td class="ln">' + (i + 1) + '</td><td>' + (resaltar(l, lang) || ' ') + '</td></tr>'; }).join('') +
      '</table></div>';
  }
  function planillaHTML() {
    if (!PLAN) return '';
    return '<div class="e-planilla"><table><thead><tr><th></th>' + PLAN.cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
      PLAN.filas.map(function (f, i) {
        return '<tr' + (i === 0 ? ' class="cab"' : '') + '><th>' + (i + 1) + '</th>' + f.map(function (v) { return '<td' + (i > 0 && v === '' ? ' class="vacia"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }
  function tablaEjemplo(t) {
    return '<div class="e-res" style="margin:0 0 14px"><table class="e-datos"><thead><tr>' + t.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.filas.map(function (f) { return '<tr>' + f.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* ─────────── Estado ─────────── */
  var P = null;          // partida (equipo)
  var reloj = null, guardarT = 0;

  function nuevaPartida(equipo, curso) {
    return {
      id: 'E' + Date.now().toString(36) + azar(1e6).toString(36),
      equipo: equipo, curso: curso, creada: ahora(), ms: 0, puntos: 0,
      vista: { sala: 0, reto: 0 }, r: {}, llaves: {}, hechas: [], terminada: false
    };
  }
  function estadoReto(id) { return P.r[id] || (P.r[id] = { errores: 0, pista: false, ok: false, primera: '', puntos: 0 }); }
  function guardar() { if (P) REG.partidas.guardar(P); }
  function salaActual() { return SALAS[P.vista.sala]; }
  function retoActual() { var s = salaActual(); return s && s.retos[P.vista.reto]; }
  function salaAbierta(i) { return i === 0 || P.hechas.indexOf(SALAS[i - 1].id) >= 0; }
  function salaHecha(s) { return P.hechas.indexOf(s.id) >= 0; }
  function totalRetos() { return SALAS.reduce(function (a, s) { return a + s.retos.length; }, 0); }
  function retosResueltos() { var n = 0; SALAS.forEach(function (s) { s.retos.forEach(function (r) { if (P.r[r.id] && P.r[r.id].ok) n++; }); }); return n; }

  /* ═════════════ INICIO ═════════════ */
  function pantallaInicio() {
    pararReloj();
    if (P) guardar();
    P = null;
    var todas = REG.partidas.todas();
    var enCurso = Object.keys(todas).map(function (k) { return todas[k]; }).filter(function (p) { return !p.terminada; })
      .sort(function (a, b) { return a.creada < b.creada ? 1 : -1; });
    var cursos = CFG.cursos && CFG.cursos.length ? CFG.cursos : ['3° A', '3° B'];

    raiz.innerHTML = '<div class="e-inicio">' +
      '<span class="e-kicker">BATIN · 3er curso · escape room integrador</span>' +
      '<h1 class="e-h1">Sistema en Producción</h1>' +
      '<p class="e-lead">Tres años de bachillerato en un solo sistema. Tu equipo tiene que construir, capa por capa, el sistema de préstamos de la biblioteca: desde el pedido de la clienta hasta la defensa ante el jurado. Cada sala resuelta da una llave; con todas las llaves, el sistema sale a producción.</p>' +
      '<div class="e-card"><div class="e-pedido"><span class="av">📚</span><div><blockquote>«' + esc(CASO.pedido) + '»</blockquote><cite>— ' + esc(CASO.cliente) + '</cite></div></div></div>' +
      '<div class="e-card"><h3>Las salas</h3><div class="e-ruta">' +
        SALAS.map(function (s) { return '<span>' + s.ico + ' ' + s.n + '. ' + esc(s.nombre) + '</span>'; }).join('') +
        OCULTAS.map(function (s) { return '<span class="off" title="Se activa en config.js">' + s.ico + ' ' + esc(s.nombre) + ' · después de la feria</span>'; }).join('') +
      '</div></div>' +
      (enCurso.length ? '<div class="e-card"><h3>Equipos con partida guardada en esta compu</h3><div class="e-guardadas">' +
        enCurso.map(function (p) {
          var hechas = (p.hechas || []).length;
          return '<div class="e-guardada"><span class="nm">' + esc(p.equipo) + ' <small style="color:var(--texto3);font-weight:400">· ' + esc(p.curso) + '</small></span>' +
            '<span class="info">' + hechas + ' de ' + SALAS.length + ' salas · ' + mmss(p.ms || 0) + ' · ' + (p.puntos || 0) + ' pts</span>' +
            '<button class="e-btn sm solid" data-seguir="' + esc(p.id) + '" type="button">Continuar →</button>' +
            '<button class="e-btn sm" data-borrar="' + esc(p.id) + '" type="button" title="Borrar esta partida">🗑</button></div>';
        }).join('') + '</div></div>' : '') +
      '<div class="e-card"><h3>Nuevo equipo</h3><div class="e-fila">' +
        '<label class="e-campo">Nombre del equipo<input type="text" id="e-equipo" maxlength="28" autocomplete="off" placeholder="por ejemplo: Los Normalizados"><small>Nombre de equipo, no nombres de personas.</small></label>' +
        '<label class="e-campo">Curso<select id="e-curso">' + cursos.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></label>' +
        '<button class="e-btn solid" id="e-empezar" type="button" style="padding:12px 24px">Entrar a la sala 1 →</button>' +
      '</div></div>' +
      '<div class="e-card"><h3>Cómo se juega</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px 18px;font-size:14px;color:var(--texto2);line-height:1.55">' +
        '<div>🔐 <b style="color:var(--texto)">Las salas se abren en orden.</b> Para abrir la siguiente hay que resolver todos los retos de la actual.</div>' +
        '<div>🔁 <b style="color:var(--texto)">Si se equivocan, prueben otra vez.</b> Cada error descuenta puntos, pero nunca los bloquea.</div>' +
        '<div>💡 <b style="color:var(--texto)">Cada reto tiene una pista.</b> Ayuda, pero cuesta puntos: discutan antes de pedirla.</div>' +
        '<div>🗄️ <b style="color:var(--texto)">En la sala SQL</b> las consultas se ejecutan de verdad sobre la base de datos de la biblioteca.</div>' +
        '<div>💾 <b style="color:var(--texto)">El progreso se guarda solo.</b> Pueden seguir otro día desde esta misma compu.</div>' +
        '<div>⏱ <b style="color:var(--texto)">El cronómetro</b> solo corre mientras están jugando.</div>' +
      '</div></div>' +
      '<div class="e-fila" style="margin-top:20px"><a class="e-btn" href="panel.html">📊 Panel de la profe</a></div>' +
      '</div>';

    q('#e-empezar').addEventListener('click', function () {
      var eq = (q('#e-equipo').value || '').trim();
      if (!eq) { q('#e-equipo').focus(); q('#e-equipo').placeholder = 'Escriban un nombre de equipo'; return; }
      P = nuevaPartida(eq, q('#e-curso').value);
      guardar();
      pantallaJuego();
    });
    qa('[data-seguir]').forEach(function (b) {
      b.addEventListener('click', function () {
        P = REG.partidas.todas()[b.dataset.seguir];
        if (!P) return;
        P.vista = P.vista || { sala: 0, reto: 0 };
        if (P.vista.sala >= SALAS.length) P.vista = { sala: SALAS.length - 1, reto: 0 };
        pantallaJuego();
      });
    });
    qa('[data-borrar]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!confirm('¿Borrar la partida guardada de este equipo? Lo que ya se registró en el panel no se borra.')) return;
        REG.partidas.borrar(b.dataset.borrar); pantallaInicio();
      });
    });
  }

  /* ═════════════ JUEGO ═════════════ */
  function pantallaJuego() {
    raiz.innerHTML = '<div class="e-juego">' +
      '<div class="e-hud"><span class="tit">Sistema en Producción<small>' + esc(P.equipo) + ' · ' + esc(P.curso) + '</small></span>' +
        '<span class="e-chip" id="h-tiempo">⏱ 0:00</span><span class="e-chip" id="h-puntos"></span><span class="e-chip" id="h-retos"></span>' +
        '<button class="e-btn sm" id="h-salir" type="button">💾 Guardar y salir</button></div>' +
      '<aside><div class="e-mapa" id="e-mapa"></div><div class="e-llavero"><h4>Llavero</h4><div class="e-llaves" id="e-llaves"></div></div></aside>' +
      '<section id="e-sala"></section>' +
      '</div><div id="e-capa"></div>';
    var nav = document.querySelector('.batin-nav');
    window.scrollTo({ top: Math.max(0, raiz.getBoundingClientRect().top + window.scrollY - (nav ? nav.getBoundingClientRect().height : 0)), behavior: 'instant' });
    q('#h-salir').addEventListener('click', function () { guardar(); pantallaInicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    pintarHud(); pintarMapa(); pintarSala();
    arrancarReloj();
  }

  function pintarHud() {
    var t = q('#h-tiempo'); if (!t) return;
    t.textContent = '⏱ ' + mmss(P.ms);
    var lim = (CFG.tiempoObjetivo || 0) * 60000;
    t.classList.toggle('tarde', !!lim && P.ms > lim);
    if (lim) t.title = 'Tiempo objetivo: ' + CFG.tiempoObjetivo + ' minutos';
    q('#h-puntos').textContent = '⭐ ' + P.puntos + ' pts';
    q('#h-retos').textContent = '✔ ' + retosResueltos() + ' / ' + totalRetos() + ' retos';
  }

  function pintarMapa() {
    q('#e-mapa').innerHTML = '<h4>Salas</h4>' + SALAS.map(function (s, i) {
      var abierta = salaAbierta(i), hecha = salaHecha(s);
      return '<button type="button" class="e-sala-btn' + (i === P.vista.sala ? ' act' : '') + (hecha ? ' hecha' : '') + '" data-sala="' + i + '"' + (abierta ? '' : ' disabled') + '>' +
        '<span class="ico">' + s.ico + '</span><span class="tx">' + s.n + '. ' + esc(s.nombre) + '<small>' + esc(s.area) + '</small></span>' +
        '<span class="st">' + (hecha ? '✔' : abierta ? '' : '🔒') + '</span></button>';
    }).join('');
    qa('[data-sala]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.dataset.sala);
        if (!salaAbierta(i)) return;
        P.vista = { sala: i, reto: primerPendiente(SALAS[i]) };
        guardar(); pintarMapa(); pintarSala();
      });
    });
    q('#e-llaves').innerHTML = SALAS.map(function (s) {
      var v = P.llaves[s.id];
      return '<span class="e-llave' + (v ? ' si' : '') + '" title="' + esc(s.nombre) + (v ? ': ' + esc(s.llave.txt) : '') + '">' + (v ? esc(v) : '?') + '</span>';
    }).join('');
  }
  function primerPendiente(s) { for (var i = 0; i < s.retos.length; i++) if (!(P.r[s.retos[i].id] && P.r[s.retos[i].id].ok)) return i; return 0; }

  function pintarSala() {
    var s = salaActual(), g = GUIAS[s.guia] || GUIAS.bit;
    q('#e-sala').innerHTML =
      '<div class="e-sala-cab"><span class="area">Sala ' + s.n + ' · ' + esc(s.area) + '</span><h2>' + s.ico + ' ' + esc(s.nombre) + '</h2></div>' +
      '<div class="e-guia"><img src="' + g.img + '" alt="' + g.nom + '" onerror="this.outerHTML=\'<span style=&quot;font-size:40px&quot;>' + g.emoji + '</span>\'"><div><div class="nm">' + g.nom + '</div><p>' + esc(s.intro) + '</p></div></div>' +
      (s.planilla ? '<details class="e-ver-planilla" open><summary>📊 La planilla de Rosa</summary>' + planillaHTML() + '</details>' : '') +
      (s.esquema ? esquemaHTML() : '') +
      '<div class="e-tabs" id="e-tabs"></div><div class="e-reto" id="e-reto"></div>';
    if (s.esquema) conectarEsquema();
    pintarTabs(); pintarReto();
  }

  function esquemaHTML() {
    return '<div class="e-esquema">' +
      '<div class="tb"><b>socios</b>(id_socio, nombre, curso)<br><button class="e-btn sm" data-ver="socios" type="button">👁 Ver datos</button></div>' +
      '<div class="tb"><b>libros</b>(id_libro, titulo, autor, categoria, anio)<br><button class="e-btn sm" data-ver="libros" type="button">👁 Ver datos</button></div>' +
      '<div class="tb"><b>prestamos</b>(id_prestamo, id_socio, id_libro, fecha_prestamo, fecha_devolucion)<br><button class="e-btn sm" data-ver="prestamos" type="button">👁 Ver datos</button></div>' +
      '</div><div class="e-res" id="e-ver-res"></div>';
  }
  function conectarEsquema() {
    qa('[data-ver]').forEach(function (b) {
      b.addEventListener('click', function () {
        var out = q('#e-ver-res');
        if (sqlEstado !== 'listo') { out.innerHTML = '<div class="err">La base de datos todavía no está cargada.</div>'; return; }
        var db = nuevaBD();
        out.innerHTML = '<div class="info">SELECT * FROM ' + b.dataset.ver + ';  (ver datos no descuenta puntos)</div>' + tablaHTML(ultimo(db.exec('SELECT * FROM ' + b.dataset.ver)));
        db.close();
      });
    });
  }

  function pintarTabs() {
    var s = salaActual();
    q('#e-tabs').innerHTML = s.retos.map(function (r, i) {
      var st = P.r[r.id];
      return '<button type="button" class="e-tab' + (i === P.vista.reto ? ' act' : '') + (st && st.ok ? ' ok' : '') + '" data-reto="' + i + '">' + (st && st.ok ? '✔ ' : '') + 'Reto ' + (i + 1) + '</button>';
    }).join('');
    qa('[data-reto]').forEach(function (b) { b.addEventListener('click', function () { P.vista.reto = Number(b.dataset.reto); guardar(); pintarTabs(); pintarReto(); }); });
  }

  /* ─────────── Reto ─────────── */
  function pintarReto() {
    var r = retoActual(), st = estadoReto(r.id), cont = q('#e-reto');
    if (!cont) return;
    var cab = '<div class="e-reto-cab"><span class="e-chip">' + TIPO_NOM[r.tipo] + '</span><span class="e-chip">' + esc(r.sub) + '</span>' +
      '<span class="pts">' + (st.ok ? '✔ +' + st.puntos + ' pts' : (st.errores ? st.errores + ' intento' + (st.errores === 1 ? '' : 's') + ' fallido' + (st.errores === 1 ? '' : 's') : '')) + '</span></div>';
    var cuerpo = '<div class="e-q">' + esc(r.q) + '</div>' +
      (r.planilla && !salaActual().planilla ? '<details class="e-ver-planilla"><summary>📊 Ver la planilla de Rosa</summary>' + planillaHTML() + '</details>' : '') +
      (r.tabla ? tablaEjemplo(r.tabla) : '') + (r.code ? bloqueCodigo(r.code) : '');
    cont.innerHTML = cab + cuerpo + '<div id="e-zona"></div><div id="e-pistabox"></div><div id="e-msg"></div>' +
      '<div class="e-pie"><button class="e-btn sm" id="e-pista" type="button"' + (st.pista || st.ok ? ' disabled' : '') + '>💡 Pista (−' + (CFG.castigoPista || 20) + ' pts)</button>' +
      '<span class="der" id="e-acciones"></span></div>';
    q('#e-pista').addEventListener('click', function () { st.pista = true; guardar(); pintarReto(); });
    ({ opcion: zonaOpcion, valor: zonaValor, ordenar: zonaOrdenar, clasificar: zonaClasificar, sql: zonaSQL })[r.tipo](r, st);
    if (st.pista && !st.ok) q('#e-pistabox').innerHTML = '<div class="e-msg pista"><b class="t">💡 Pista</b>' + esc(r.pista) + '</div>';
    if (st.ok) mostrarResuelto(r, st);
  }

  function mensaje(tipo, titulo, txt) {
    q('#e-msg').innerHTML = '<div class="e-msg ' + tipo + '"><b class="t">' + titulo + '</b>' + esc(txt) + '</div>';
  }
  function fallo(r, st, respuesta, txt) {
    st.errores++;
    if (!st.primera) st.primera = String(respuesta).slice(0, 120);
    guardar(); pintarHud();
    var cab = q('.e-reto-cab .pts'); if (cab) cab.textContent = st.errores + ' intento' + (st.errores === 1 ? '' : 's') + ' fallido' + (st.errores === 1 ? '' : 's');
    mensaje('mal', '✘ Todavía no', txt || 'Revisen y prueben de nuevo.' + (st.pista ? '' : ' Si se trabaron, pueden pedir la pista.'));
    verMensaje();
  }
  function verMensaje() { var m = q('#e-msg'); if (m && m.scrollIntoView) m.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  function resolver(r, st) {
    st.ok = true; st.t = ahora();
    st.puntos = Math.max(CFG.minimoReto || 40, (CFG.puntosReto || 100) - st.errores * (CFG.castigoError || 20) - (st.pista ? (CFG.castigoPista || 20) : 0));
    P.puntos += st.puntos;
    guardar(); pintarHud(); pintarTabs();
    pintarReto();
  }
  function mostrarResuelto(r, st) {
    q('#e-msg').innerHTML = '<div class="e-msg ok"><b class="t">✔ ¡Resuelto! +' + st.puntos + ' pts</b>' + esc(r.ex) + '</div>';
    if (st.t && Date.now() - Date.parse(st.t) < 1500) setTimeout(verMensaje, 30);
    var s = salaActual();
    var pendiente = primerPendienteDesde(s, P.vista.reto);
    var acc = q('#e-acciones');
    if (pendiente >= 0) {
      acc.innerHTML = '<button class="e-btn solid" id="e-sig" type="button">Siguiente reto →</button>';
      q('#e-sig').addEventListener('click', function () { P.vista.reto = pendiente; guardar(); pintarTabs(); pintarReto(); });
    } else if (!salaHecha(s)) {
      completarSala(s);
    } else {
      var i = P.vista.sala;
      if (SALAS[i + 1]) {
        acc.innerHTML = '<button class="e-btn solid" id="e-sig" type="button">Ir a la sala ' + SALAS[i + 1].n + ' →</button>';
        q('#e-sig').addEventListener('click', function () { irASala(i + 1); });
      }
    }
  }
  function primerPendienteDesde(s, desde) {
    for (var k = 1; k <= s.retos.length; k++) { var i = (desde + k) % s.retos.length; if (!(P.r[s.retos[i].id] && P.r[s.retos[i].id].ok)) return i; }
    return -1;
  }
  function irASala(i) { P.vista = { sala: i, reto: primerPendiente(SALAS[i]) }; guardar(); pintarMapa(); pintarSala(); window.scrollTo({ top: Math.max(0, raiz.getBoundingClientRect().top + window.scrollY - 60), behavior: 'instant' }); }

  /* Opción múltiple */
  function zonaOpcion(r, st) {
    if (!st.orden) { st.orden = mezclar(indices(r.op.length)); st.descartadas = []; guardar(); }
    var letras = 'ABCDEF';
    q('#e-zona').innerHTML = '<div class="e-ops">' + st.orden.map(function (idx, k) {
      var cls = st.ok && idx === 0 ? ' bien' : (st.descartadas || []).indexOf(idx) >= 0 ? ' mal' : '';
      var dis = st.ok || cls === ' mal';
      return '<button type="button" class="op' + cls + '" data-idx="' + idx + '"' + (dis ? ' disabled' : '') + '><span class="k">' + letras[k] + '</span><span>' + esc(r.op[idx]) + '</span></button>';
    }).join('') + '</div>';
    qa('.op').forEach(function (b) {
      b.addEventListener('click', function () {
        var idx = Number(b.dataset.idx);
        if (idx === 0) { resolver(r, st); return; }
        st.descartadas = (st.descartadas || []).concat([idx]);
        b.classList.add('mal'); b.disabled = true;
        fallo(r, st, r.op[idx]);
      });
    });
  }

  /* Valor */
  function zonaValor(r, st) {
    q('#e-zona').innerHTML = '<div class="e-valor"><input type="text" id="e-val" autocomplete="off" placeholder="Escriban la respuesta"' + (st.ok ? ' disabled value="' + esc(r.acepta[0]) + '"' : '') + '>' +
      (st.ok ? '' : '<button class="e-btn solid" id="e-comp" type="button">Comprobar</button>') + '</div>';
    if (st.ok) return;
    var inp = q('#e-val');
    function comprobar() {
      var v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      var n = normalizar(v);
      if (r.acepta.some(function (a) { return normalizar(a) === n; })) resolver(r, st);
      else { fallo(r, st, v); inp.select(); }
    }
    q('#e-comp').addEventListener('click', comprobar);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); comprobar(); } });
  }

  /* Ordenar */
  function zonaOrdenar(r, st) {
    if (!st.orden) { st.orden = desordenar(r.lineas.length); guardar(); }
    function pintar(marcar) {
      q('#e-zona').innerHTML = '<ol class="e-orden">' + st.orden.map(function (idx, pos) {
        var cls = st.ok ? ' bien' : (marcar ? (idx === pos ? ' bien' : ' mal') : '');
        return '<li class="' + cls.trim() + '"><span class="n">' + (pos + 1) + '</span><code>' + escT(r.lineas[idx]) + '</code>' +
          (st.ok ? '' : '<button type="button" data-sube="' + pos + '" aria-label="Subir"' + (pos === 0 ? ' disabled' : '') + '>▲</button><button type="button" data-baja="' + pos + '" aria-label="Bajar"' + (pos === st.orden.length - 1 ? ' disabled' : '') + '>▼</button>') + '</li>';
      }).join('') + '</ol>';
      qa('[data-sube]').forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.sube), -1); }); });
      qa('[data-baja]').forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.baja), 1); }); });
    }
    function mover(pos, d) { var o = st.orden, t = o[pos]; o[pos] = o[pos + d]; o[pos + d] = t; guardar(); pintar(false); }
    pintar(false);
    if (st.ok) return;
    q('#e-acciones').innerHTML = '<button class="e-btn solid" id="e-comp" type="button">Comprobar el orden</button>';
    q('#e-comp').addEventListener('click', function () {
      var bien = st.orden.filter(function (v, i) { return v === i; }).length;
      if (bien === st.orden.length) { resolver(r, st); return; }
      fallo(r, st, st.orden.map(function (i) { return r.lineas[i].trim(); }).join(' | '),
        bien + ' de ' + st.orden.length + ' líneas están en su lugar.' + (st.errores >= 1 ? ' Marcamos en verde las que ya están bien.' : ''));
      pintar(st.errores >= 2);
    });
  }

  /* Clasificar */
  function zonaClasificar(r, st) {
    if (!st.orden) { st.orden = mezclar(indices(r.items.length)); st.asig = {}; guardar(); }
    function pintar(marcar) {
      q('#e-zona').innerHTML = '<div class="e-clas">' + st.orden.map(function (idx) {
        var it = r.items[idx], a = st.asig[idx];
        var cls = st.ok ? ' bien' : (marcar && a ? (a === it.c ? ' bien' : ' mal') : '');
        return '<div class="it' + cls + '"><span class="t">' + esc(it.t) + '</span><span class="e-seg">' +
          r.categorias.map(function (c) { return '<button type="button" data-it="' + idx + '" data-cat="' + esc(c) + '"' + (a === c || (st.ok && it.c === c) ? ' class="act"' : '') + (st.ok ? ' disabled' : '') + '>' + esc(c) + '</button>'; }).join('') +
          '</span></div>';
      }).join('') + '</div>';
      qa('[data-cat]').forEach(function (b) {
        b.addEventListener('click', function () { st.asig[b.dataset.it] = b.dataset.cat; guardar(); pintar(false); });
      });
    }
    pintar(false);
    if (st.ok) return;
    q('#e-acciones').innerHTML = '<button class="e-btn solid" id="e-comp" type="button">Comprobar</button>';
    q('#e-comp').addEventListener('click', function () {
      var faltan = r.items.length - Object.keys(st.asig).length;
      if (faltan > 0) { mensaje('pista', 'Falta completar', 'Quedan ' + faltan + ' elemento' + (faltan === 1 ? '' : 's') + ' sin ubicar.'); return; }
      var mal = r.items.filter(function (it, i) { return st.asig[i] !== it.c; }).length;
      if (!mal) { resolver(r, st); return; }
      var primeroMal = r.items.find(function (it, i) { return st.asig[i] !== it.c; });
      fallo(r, st, primeroMal.t + ' → ' + st.asig[r.items.indexOf(primeroMal)],
        mal + ' de ' + r.items.length + ' están mal ubicados.' + (st.errores >= 1 ? ' Los marcamos en rojo.' : ' Revísenlos y prueben de nuevo.'));
      pintar(st.errores >= 2);
    });
  }

  /* SQL */
  function zonaSQL(r, st) {
    var z = q('#e-zona');
    if (st.ok) {
      z.innerHTML = '<textarea class="e-sql" disabled>' + escT(st.borrador || r.solucion) + '</textarea>';
      return;
    }
    if (sqlEstado === 'cargando') { z.innerHTML = '<div class="e-msg">⏳ Cargando la base de datos…</div>'; return; }
    if (sqlEstado === 'error') {
      z.innerHTML = '<div class="e-msg mal"><b class="t">No se pudo cargar el motor SQL</b>Hace falta conexión a internet para ejecutar consultas. Pueden escribir la consulta en el cuaderno y seguir.</div>';
      q('#e-acciones').innerHTML = '<button class="e-btn" id="e-saltar" type="button">Saltar este reto (sin puntos)</button>';
      q('#e-saltar').addEventListener('click', function () { st.saltado = true; st.errores = st.errores || 0; st.primera = st.primera || '[sin conexión]'; st.ok = true; st.puntos = 0; st.t = ahora(); guardar(); pintarHud(); pintarTabs(); pintarReto(); });
      return;
    }
    z.innerHTML = '<textarea class="e-sql" id="e-sqltxt" spellcheck="false" placeholder="Escriban aquí la consulta SQL…">' + escT(st.borrador || '') + '</textarea>' +
      '<div class="e-res" id="e-sqlres"></div>';
    var ta = q('#e-sqltxt');
    ta.addEventListener('input', function () { st.borrador = ta.value; guardarT = Date.now(); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); ejecutarSQL(); } });
    q('#e-acciones').innerHTML = '<button class="e-btn solid" id="e-ejec" type="button">▶ Ejecutar y comprobar</button>';
    q('#e-ejec').addEventListener('click', ejecutarSQL);
    function ejecutarSQL() {
      var txt = ta.value.trim(), out = q('#e-sqlres');
      st.borrador = ta.value; guardar();
      if (!txt) { ta.focus(); return; }
      var db = nuevaBD(), res, verif;
      try {
        res = db.exec(txt);
        if (r.cambio) verif = ultimo(db.exec(r.verificar));
      } catch (err) {
        db.close();
        out.innerHTML = '<div class="err">⚠ Error de SQL: ' + esc(err.message) + '</div><div class="info">Los errores de escritura no descuentan puntos.</div>';
        return;
      }
      var got = r.cambio ? verif : ultimo(res);
      var esperado = resultadoEsperado(r);
      var ok = iguales(firma(got, r.orden || r.cambio), firma(esperado, r.orden || r.cambio));
      var cambios = r.cambio ? db.getRowsModified() : 0;
      db.close();
      out.innerHTML = (r.cambio ? '<div class="info">Filas modificadas: ' + cambios + '. Así quedó la tabla:</div>' : '') + tablaHTML(got);
      if (ok) resolver(r, st);
      else {
        var detalle = 'La consulta funciona, pero el resultado no es el que pidió Rosa.';
        if (got && esperado && got.values.length !== esperado.values.length) detalle += ' Devolvió ' + got.values.length + ' filas.';
        else if (got && esperado && got.columns.length !== esperado.columns.length) detalle += ' Revisen qué columnas muestran.';
        if (r.cambio && cambios > 1) detalle = '¡Cuidado! Se modificaron ' + cambios + ' filas. ¿Falta el WHERE?';
        fallo(r, st, txt, detalle);
      }
    }
  }

  /* ─────────── Fin de sala y fin del juego ─────────── */
  var estadoEnvio = '';
  function completarSala(s) {
    if (salaHecha(s)) return;
    P.hechas.push(s.id);
    P.llaves[s.id] = s.llave.valor;
    guardar(); pintarMapa(); pintarHud();
    REG.registrarSala({
      id: P.id + '-' + s.id, fecha: ahora(), curso: P.curso, equipo: P.equipo, sala: s.id,
      retos: s.retos.map(function (r) {
        var st = P.r[r.id] || {};
        return { qid: r.id, sub: r.sub, intentos: st.saltado ? 0 : (st.errores || 0) + 1, pista: !!st.pista, primera: st.primera || '', t: st.t || ahora() };
      })
    }).then(function (res) { estadoEnvio = res; });
    var i = SALAS.indexOf(s), sig = SALAS[i + 1];
    if (!sig) { terminar(); return; }
    modal('🔑', 'Llave de la sala ' + s.n,
      '<div class="codigo-final">' + esc(s.llave.valor) + '</div><p>' + esc(s.llave.txt.charAt(0).toUpperCase() + s.llave.txt.slice(1)) + '.</p><p>Se abre la sala ' + sig.n + ': <b>' + esc(sig.nombre) + '</b>.</p>',
      [['Entrar a la sala ' + sig.n + ' →', true, function () { irASala(i + 1); }], ['Quedarnos acá', false, function () { pintarReto(); }]]);
  }

  function terminar() {
    P.terminada = true; P.terminadaEn = ahora();
    pararReloj(); guardar(); pintarHud();
    var codigo = SALAS.map(function (s) { return P.llaves[s.id] || '?'; }).join(' · ');
    var filas = SALAS.map(function (s) {
      var primera = 0, pistas = 0;
      s.retos.forEach(function (r) { var st = P.r[r.id] || {}; if (st.ok && !st.errores && !st.saltado) primera++; if (st.pista) pistas++; });
      return '<tr><td>' + s.ico + ' ' + esc(s.nombre) + '</td><td class="num">' + primera + ' / ' + s.retos.length + '</td><td class="num">' + pistas + '</td></tr>';
    }).join('');
    modal('🚀', '¡Sistema en producción!',
      '<p>Código de despliegue:</p><div class="codigo-final">' + esc(codigo) + '</div>' +
      '<p><b>' + P.puntos + ' puntos</b> · ⏱ ' + mmss(P.ms) + '</p>' +
      '<table><thead><tr><th>Sala</th><th class="num">Al primer intento</th><th class="num">Pistas</th></tr></thead><tbody>' + filas + '</tbody></table>' +
      '<p style="margin-top:12px;font-size:14px">Lo que construyeron hoy es exactamente el recorrido del Proyecto de Promoción: pedido → datos → modelo → consultas → lógica → código → defensa.</p>',
      [['Volver al inicio', true, function () { pantallaInicio(); window.scrollTo({ top: 0, behavior: 'instant' }); }], ['Ver las salas', false, function () { pintarMapa(); pintarSala(); }]]);
  }

  function modal(ico, tit, cuerpo, botones) {
    q('#e-capa').innerHTML = '<div class="e-velo"><div class="e-modal" role="dialog" aria-modal="true"><div class="gran">' + ico + '</div><h2>' + tit + '</h2>' + cuerpo +
      '<div class="e-pie">' + botones.map(function (b, i) { return '<button type="button" class="e-btn' + (b[1] ? ' solid' : '') + '" data-mb="' + i + '">' + b[0] + '</button>'; }).join('') + '</div></div></div>';
    qa('[data-mb]').forEach(function (el) { el.addEventListener('click', function () { var b = botones[Number(el.dataset.mb)]; q('#e-capa').innerHTML = ''; b[2](); }); });
    var p = q('#e-capa .e-btn.solid'); if (p) p.focus();
  }

  /* ─────────── Cronómetro ─────────── */
  function arrancarReloj() {
    pararReloj();
    if (P.terminada) return;
    reloj = setInterval(function () {
      if (!P || P.terminada || document.hidden) return;
      P.ms += 1000;
      pintarHud();
      if (P.ms % 10000 === 0 || (guardarT && Date.now() - guardarT > 3000)) { guardarT = 0; guardar(); }
    }, 1000);
  }
  function pararReloj() { if (reloj) clearInterval(reloj); reloj = null; }
  window.addEventListener('beforeunload', guardar);

  /* ─────────── Arranque ─────────── */
  window.__sp = { estado: function () { return P; }, salas: SALAS, sql: function () { return sqlEstado; } };
  if (REG.pendientes()) REG.enviarPendientes();
  cargarSQL();
  pantallaInicio();
})();
