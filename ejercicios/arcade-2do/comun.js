/* ═══════════════════════════════════════════
   BATIN · Arcade de 2° — piezas compartidas
   utilidades · código con colores · un desafío (componente)
   · modales · registro (navegador + Google Sheets)
═══════════════════════════════════════════ */

(function () {
  'use strict';
  var CFG = window.AR_CONFIG || {};

  /* ─────────── Utilidades ─────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function escT(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function q(s, base) { return (base || document).querySelector(s); }
  function qa(s, base) { return Array.prototype.slice.call((base || document).querySelectorAll(s)); }
  function azar(n) { return Math.floor(Math.random() * n); }
  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function indices(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function ahora() { return new Date().toISOString(); }
  function mmss(ms) { var s = Math.max(0, Math.floor(ms / 1000)), m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }
  function normalizar(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/(\d)\.(?=\d{3}\b)/g, '$1').replace(/gs\.?|₲/g, '')
      .replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var NIVEL_NOM = { 3: 'Aplicar', 4: 'Analizar', 5: 'Evaluar', 6: 'Crear' };
  var TEMA = {
    pseudo:   { nom: 'Pseudocódigo', ico: '📝' },
    vectores: { nom: 'Vectores', ico: '📏' },
    matrices: { nom: 'Matrices', ico: '🔢' },
    python:   { nom: 'Python', ico: '🐍' }
  };
  var TIPO_NOM = { opcion: 'Elige', valor: 'Responde', linea: 'Encuentra la línea', ordenar: 'Ordena', clasificar: 'Clasifica', traza: 'Prueba de escritorio', celdas: 'Marca las celdas' };
  var PJ = {
    gatiel: { nom: 'GATIEL', emoji: '🐱', img: { explicando: '../../img/gatiel_explicando.png', idea: '../../img/gatiel_idea.png', accion: '../../img/gatiel_accion.png', leyendo: '../../img/gatiel_leyendo.png', saludando: '../../img/gatiel_saludando.png' } },
    bit:    { nom: 'BIT', emoji: '🤖', img: { explicando: '../../img/bit_explicando.png', idea: '../../img/bit_idea.png', accion: '../../img/bit_motivando.png', ok: '../../img/bit_ok.png', saludando: '../../img/bit_saludando.png' } },
    techi:  { nom: 'TECHI', emoji: '👩‍💻', img: { explicando: '../../img/techi_explicando.png', idea: '../../img/techi_idea.png', accion: '../../img/techi_accion.png', saludando: '../../img/techi_saludando.png' } }
  };
  function personaje(quien, txt, gesto, color) {
    var p = PJ[quien] || PJ.bit, img = p.img[gesto] || p.img.explicando;
    return '<div class="a-guia"' + (color ? ' style="--gc:' + color + '"' : '') + '><img src="' + img + '" alt="' + p.nom + '" onerror="this.outerHTML=\'<span class=&quot;emo&quot;>' + p.emoji + '</span>\'"><div><div class="nm">' + p.nom + '</div><p>' + txt + '</p></div></div>';
  }

  /* ─────────── Código con colores ─────────── */
  var KW = {
    pseudo: ['Algoritmo', 'FinAlgoritmo', 'Definir', 'Como', 'Entero', 'Real', 'Caracter', 'Logico', 'Dimension', 'Leer', 'Escribir', 'Sin', 'Saltar', 'Si', 'Entonces', 'SiNo', 'FinSi', 'Mientras', 'Hacer', 'FinMientras', 'Para', 'Hasta', 'Con', 'Paso', 'FinPara', 'Repetir', 'Segun', 'MOD', 'Y', 'O', 'NO'],
    py: ['def', 'return', 'if', 'elif', 'else', 'for', 'in', 'while', 'and', 'or', 'not', 'True', 'False', 'None', 'print', 'input', 'int', 'float', 'str', 'range', 'len', 'max', 'min']
  };
  function resaltar(linea, lang) {
    if (!KW[lang]) return escT(linea);
    var com = lang === 'py' ? '#' : '//';
    var ic = linea.indexOf(com), resto = '';
    if (ic >= 0 && linea.slice(0, ic).split('"').length % 2 === 1) { resto = '<span class="com">' + escT(linea.slice(ic)) + '</span>'; linea = linea.slice(0, ic); }
    var re = /"[^"]*"/g, partes = [], m, u = 0;
    while ((m = re.exec(linea))) { partes.push({ t: linea.slice(u, m.index) }); partes.push({ t: m[0], s: 1 }); u = re.lastIndex; }
    partes.push({ t: linea.slice(u) });
    var rk = new RegExp('\\b(' + KW[lang].join('|') + ')\\b', 'g');
    return partes.map(function (p) {
      if (p.s) return '<span class="str">' + escT(p.t) + '</span>';
      return escT(p.t).replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>').replace(rk, '<span class="kw">$1</span>').replace(/&lt;-/g, '<span class="asg">&lt;-</span>');
    }).join('') + resto;
  }
  function bloqueCodigo(code, clic) {
    var lang = code.lang || 'txt';
    return '<div class="codigo ' + (lang === 'pseudo' ? 'pseudo' : 'oscuro') + '"><div class="lbl">' + (lang === 'pseudo' ? 'PSeInt' : lang === 'py' ? 'Python' : '') + '</div><table>' +
      code.txt.split('\n').map(function (l, i) {
        return '<tr' + (clic ? ' class="clic" data-ln="' + (i + 1) + '" tabindex="0" role="button" aria-label="Línea ' + (i + 1) + '"' : '') + '><td class="ln">' + (i + 1) + '</td><td>' + (resaltar(l, lang) || ' ') + '</td></tr>';
      }).join('') + '</table></div>';
  }
  function tablaHTML(t) {
    return '<div class="a-tabla-wrap"><table class="a-tabla"><thead><tr>' + t.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.filas.map(function (f) { return '<tr>' + f.map(function (v, i) { return i === 0 ? '<th>' + esc(v) + '</th>' : '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* ═══════════════════════════════════════════
     COMPONENTE: un desafío
     o = { revelar: bool, pista: bool, sinCodigo: bool, alResponder: fn(ok, respuesta) }
  ═══════════════════════════════════════════ */
  function montarReto(cont, r, o) {
    var hecho = false;
    cont.innerHTML =
      '<div class="a-q">' + esc(r.q) + '</div>' +
      (r.tabla ? tablaHTML(r.tabla) : '') +
      (r.code && r.tipo !== 'linea' && !o.sinCodigo ? bloqueCodigo(r.code) : '') +
      '<div class="a-zona"></div><div class="a-pistabox"></div><div class="a-msgz"></div>' +
      '<div class="a-pie"><span class="der a-acc"></span></div>';
    var zona = q('.a-zona', cont), acc = q('.a-acc', cont);
    var api = { detalle: '' };
    function msg(tipo, titulo, txt) { q('.a-msgz', cont).innerHTML = '<div class="a-msg ' + tipo + '"><b class="t">' + titulo + '</b>' + esc(txt) + '</div>'; }
    function terminar(ok, resp) {
      if (hecho) return; hecho = true;
      qa('.a-zona button, .a-zona input, .a-acc button', cont).forEach(function (b) { b.disabled = true; });
      qa('.a-zona tr.clic', cont).forEach(function (t) { t.classList.remove('clic'); t.removeAttribute('tabindex'); });
      o.alResponder(ok, resp);
    }
    api.pista = function () { q('.a-pistabox', cont).innerHTML = '<div class="a-msg pista"><b class="t">🔎 Pista</b>' + esc(r.pista) + '</div>'; };
    api.bloquear = function () { if (!hecho) terminar(false, '[tiempo agotado]'); };
    api.hecho = function () { return hecho; };
    if (o.pista) api.pista();
    function boton(txt) { acc.innerHTML = '<button class="a-btn solid a-comp" type="button">' + txt + '</button>'; return q('.a-comp', acc); }

    if (r.tipo === 'opcion') {
      var orden = mezclar(indices(r.op.length)), letras = 'ABCDEF';
      zona.innerHTML = '<div class="a-ops">' + orden.map(function (idx, k) {
        return '<button type="button" class="op" data-idx="' + idx + '"><span class="k">' + letras[k] + '</span><span class="tx">' + esc(r.op[idx]) + '</span></button>';
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
      api.mitad = function () { mezclar(qa('.op', zona).filter(function (b) { return b.dataset.idx !== '0'; })).slice(0, Math.max(0, r.op.length - 2)).forEach(function (b) { b.classList.add('fuera'); b.disabled = true; }); };
    }

    else if (r.tipo === 'valor') {
      zona.innerHTML = '<div class="a-valor"><input type="text" class="a-val" autocomplete="off" spellcheck="false" placeholder="Escribe tu respuesta"></div>';
      var inp = q('.a-val', zona);
      var comp = function () {
        var v = inp.value.trim(); if (!v) { inp.focus(); return; }
        var n = normalizar(v);
        terminar(r.acepta.some(function (a) { return normalizar(a) === n; }), v);
      };
      boton('Comprobar').addEventListener('click', comp);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); comp(); } });
    }

    else if (r.tipo === 'linea') {
      zona.innerHTML = bloqueCodigo(r.code, true) + '<div class="a-ayuda">👆 Haz clic en la línea</div>';
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
      var marcar = false;
      var pintarO = function () {
        zona.innerHTML = '<ol class="a-orden">' + ord.map(function (idx, pos) {
          var cls = marcar ? (r.lineas[idx] === r.lineas[pos] ? 'bien' : 'mal') : '';
          return '<li class="' + cls + '"><span class="n">' + (pos + 1) + '</span><code>' + escT(r.lineas[idx]) + '</code>' +
            (hecho ? '' : '<button type="button" data-sube="' + pos + '" aria-label="Subir"' + (pos === 0 ? ' disabled' : '') + '>▲</button><button type="button" data-baja="' + pos + '" aria-label="Bajar"' + (pos === ord.length - 1 ? ' disabled' : '') + '>▼</button>') + '</li>';
        }).join('') + '</ol>';
        qa('[data-sube]', zona).forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.sube), -1); }); });
        qa('[data-baja]', zona).forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.baja), 1); }); });
      };
      var mover = function (pos, d) { var t = ord[pos]; ord[pos] = ord[pos + d]; ord[pos + d] = t; pintarO(); var bt = q('[data-' + (d < 0 ? 'sube' : 'baja') + '="' + (pos + d) + '"]', zona); if (bt && !bt.disabled) bt.focus(); };
      pintarO();
      boton('Comprobar el orden').addEventListener('click', function () {
        var ok = ord.every(function (idx, pos) { return r.lineas[idx] === r.lineas[pos]; });
        hecho = true; marcar = !!o.revelar; pintarO(); hecho = false;
        terminar(ok, ord.map(function (i) { return r.lineas[i].trim(); }).join(' | '));
      });
      api.alTerminar = pintarO;
    }

    else if (r.tipo === 'clasificar') {
      var ordC = mezclar(indices(r.items.length)), asig = {}, marcarC = false;
      var pintarC = function () {
        zona.innerHTML = '<div class="a-clas">' + ordC.map(function (idx) {
          var it = r.items[idx], a = asig[idx];
          var cls = marcarC ? (a === it.c ? ' bien' : ' mal') : '';
          return '<div class="it' + cls + '"><span class="t">' + esc(it.t) + '</span><span class="a-seg">' +
            r.categorias.map(function (c) { return '<button type="button" data-it="' + idx + '" data-cat="' + esc(c) + '"' + (a === c ? ' class="act"' : '') + (hecho ? ' disabled' : '') + '>' + esc(c) + '</button>'; }).join('') +
            '</span>' + (marcarC && a !== it.c ? '<span class="corr">→ ' + esc(it.c) + '</span>' : '') + '</div>';
        }).join('') + '</div>';
        qa('[data-cat]', zona).forEach(function (b) { b.addEventListener('click', function () { asig[b.dataset.it] = b.dataset.cat; pintarC(); }); });
      };
      pintarC();
      boton('Comprobar').addEventListener('click', function () {
        var faltan = r.items.length - Object.keys(asig).length;
        if (faltan > 0) { msg('pista', 'Falta completar', 'Quedan ' + faltan + ' sin ubicar.'); return; }
        var malos = r.items.filter(function (it, i) { return asig[i] !== it.c; });
        hecho = true; marcarC = !!o.revelar; pintarC(); hecho = false;
        terminar(!malos.length, malos.length ? malos[0].t + ' → ' + asig[r.items.indexOf(malos[0])] : '');
      });
    }

    else if (r.tipo === 'traza') {
      var huecos = [];
      zona.innerHTML = '<div class="a-tabla-wrap"><table class="a-tabla a-traza"><thead><tr>' + r.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        r.filas.map(function (f, fi) {
          return '<tr>' + f.map(function (v, ci) {
            var m = /^\{(.*)\}$/.exec(String(v));
            if (m) { huecos.push(m[1]); return '<td><input type="text" class="a-celda" data-h="' + (huecos.length - 1) + '" autocomplete="off" spellcheck="false" aria-label="' + esc(r.cols[ci]) + ', fila ' + (fi + 1) + '"></td>'; }
            return '<td class="dada">' + esc(v) + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div><div class="a-ayuda">✏️ Completa las celdas vacías (Tab pasa a la siguiente)</div>';
      var ins = qa('.a-celda', zona);
      ins.forEach(function (inp, i) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (ins[i + 1]) ins[i + 1].focus(); else q('.a-comp', acc).click(); } }); });
      boton('Comprobar la tabla').addEventListener('click', function () {
        var vacios = ins.filter(function (i) { return !i.value.trim(); }).length;
        if (vacios) { msg('pista', 'Faltan celdas', 'Quedan ' + vacios + ' celda' + (vacios === 1 ? '' : 's') + ' vacía' + (vacios === 1 ? '' : 's') + '.'); return; }
        var mal = [];
        ins.forEach(function (inp, i) {
          var ok = normalizar(inp.value).replace(/^si$/, 'si') === normalizar(huecos[i]);
          if (o.revelar) { inp.classList.add(ok ? 'bien' : 'mal'); if (!ok) inp.title = 'Correcto: ' + huecos[i]; }
          if (!ok) mal.push(inp.value + '≠' + huecos[i]);
        });
        if (o.revelar && mal.length) api.detalle = 'Valores correctos de las celdas: ' + huecos.join(' · ');
        terminar(!mal.length, ins.map(function (i) { return i.value.trim(); }).join(' | '));
      });
    }

    else if (r.tipo === 'celdas') {
      var sel = {}, mk = {};
      r.marcar.forEach(function (p) { mk[p[0] + ',' + p[1]] = 1; });
      var pintarG = function (rev) {
        var h = '<div class="a-grilla" style="grid-template-columns: auto repeat(' + r.c + ', minmax(0, 1fr))"><span></span>';
        for (var c = 1; c <= r.c; c++) h += '<span class="ix">' + c + '</span>';
        for (var f = 1; f <= r.f; f++) {
          h += '<span class="ix">' + f + '</span>';
          for (var c2 = 1; c2 <= r.c; c2++) {
            var k = f + ',' + c2, v = r.valores ? r.valores[f - 1][c2 - 1] : '';
            var cls = sel[k] ? ' sel' : '';
            if (rev) cls += mk[k] ? (sel[k] ? ' bien' : ' falta') : (sel[k] ? ' mal' : '');
            h += '<button type="button" class="cel' + cls + '" data-k="' + k + '" aria-label="Fila ' + f + ', columna ' + c2 + '" aria-pressed="' + (sel[k] ? 'true' : 'false') + '"' + (hecho ? ' disabled' : '') + '>' + (v !== '' ? '<b>' + v + '</b>' : '') + '<small>[' + f + ',' + c2 + ']</small></button>';
          }
        }
        zona.innerHTML = h + '</div><div class="a-ayuda">👆 Toca las celdas para marcarlas o desmarcarlas' + (rev ? ' · <span class="ley bien">acertada</span> <span class="ley mal">sobra</span> <span class="ley falta">faltó</span>' : '') + '</div>';
        qa('.cel', zona).forEach(function (b) { b.addEventListener('click', function () { if (hecho) return; sel[b.dataset.k] = !sel[b.dataset.k]; if (!sel[b.dataset.k]) delete sel[b.dataset.k]; pintarG(false); }); });
      };
      pintarG(false);
      boton('Comprobar').addEventListener('click', function () {
        var ks = Object.keys(sel);
        if (!ks.length) { msg('pista', 'No marcaste nada', 'Toca las celdas que correspondan.'); return; }
        var ok = ks.length === r.marcar.length && ks.every(function (k) { return mk[k]; });
        hecho = true; pintarG(!!o.revelar);
        hecho = false;
        terminar(ok, ks.map(function (k) { return '[' + k + ']'; }).join(' '));
      });
    }
    return api;
  }
  function respuestaCorrecta(r) {
    if (r.tipo === 'opcion') return r.op[0];
    if (r.tipo === 'valor') return r.acepta[0];
    if (r.tipo === 'linea') return 'Línea ' + r.correcta;
    if (r.tipo === 'celdas') return r.marcar.map(function (p) { return '[' + p[0] + ',' + p[1] + ']'; }).join(' ');
    return '';
  }

  /* ─────────── Modal ─────────── */
  function modal(capa, ico, tit, cuerpo, botones) {
    capa.innerHTML = '<div class="a-velo"><div class="a-modal" role="dialog" aria-modal="true" aria-label="' + esc(tit) + '">' + (ico ? '<div class="gran">' + ico + '</div>' : '') + '<h2>' + esc(tit) + '</h2>' + cuerpo +
      '<div class="a-pie centro">' + botones.map(function (b, i) { return '<button type="button" class="a-btn' + (b[1] ? ' solid' : '') + '" data-mb="' + i + '">' + b[0] + '</button>'; }).join('') + '</div></div></div>';
    qa('[data-mb]', capa).forEach(function (el) { el.addEventListener('click', function () { var b = botones[Number(el.dataset.mb)]; capa.innerHTML = ''; if (b[2]) b[2](); }); });
    var p = q('.a-btn.solid', capa); if (p) p.focus();
  }

  /* ─────────── Registro ─────────── */
  var K_REG = 'batin_ar2_respuestas', K_PEND = 'batin_ar2_pendientes', K_EST = 'batin_ar2_estado';
  function leer(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function endpoint() { return (CFG.endpoint || '').trim(); }
  var enviando = false;
  function enviarPendientes() {
    var url = endpoint();
    if (!url) return Promise.resolve('sin-endpoint');
    var pend = leer(K_PEND, []);
    if (!pend.length || enviando) return Promise.resolve('nada');
    enviando = true;
    var lote = pend.slice(0, 60), f0 = lote[0];
    return fetch(url, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: 'partida', partida: { id: f0.partida + '-' + Date.now().toString(36), fecha: f0.fecha, curso: f0.curso, modo: f0.modo }, filas: lote })
    }).then(function () { escribir(K_PEND, leer(K_PEND, []).slice(lote.length)); enviando = false; return leer(K_PEND, []).length ? enviarPendientes() : 'enviado'; })
      .catch(function () { enviando = false; return 'sin-conexion'; });
  }
  function registrar(partida, curso, modo, equipo, r, ok, resp, extra) {
    var fila = { partida: partida, fecha: ahora(), curso: curso, modo: modo, equipo: equipo, qid: r.id, tema: r.tema,
      sub: r.sub + ' · N' + r.nv, n: 1, ok: !!ok, elegida: (extra || '') + (ok ? '' : String(resp || '').slice(0, 200)), t: ahora() };
    var regs = leer(K_REG, []); regs.push(fila); if (regs.length > 4000) regs = regs.slice(regs.length - 4000); escribir(K_REG, regs);
    if (endpoint()) { var p = leer(K_PEND, []); p.push(fila); escribir(K_PEND, p); if (p.length >= 8) enviarPendientes(); }
  }
  function filasRemotas(clave) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error('No hay endpoint configurado en config.js'));
    return fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'k=' + encodeURIComponent(clave || '')).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) throw new Error((j && j.error) || 'Respuesta inválida');
      return j.filas.filter(function (f) { return ['detective', 'flota', 'copa'].indexOf(f.modo) >= 0; }).map(function (f) { f.ok = (f.ok === true || f.ok === 'TRUE' || f.ok === 'true' || f.ok === 1); return f; });
    });
  }
  if (leer(K_PEND, []).length) enviarPendientes();

  function selectorCursos(id) { var c = CFG.cursos && CFG.cursos.length ? CFG.cursos : ['2° A']; return '<select id="' + id + '">' + c.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select>'; }

  window.AR = {
    CFG: CFG, esc: esc, escT: escT, q: q, qa: qa, azar: azar, mezclar: mezclar, indices: indices, ahora: ahora, mmss: mmss,
    NIVEL_NOM: NIVEL_NOM, TEMA: TEMA, TIPO_NOM: TIPO_NOM, personaje: personaje, bloqueCodigo: bloqueCodigo, tablaHTML: tablaHTML,
    montarReto: montarReto, respuestaCorrecta: respuestaCorrecta, modal: modal, selectorCursos: selectorCursos,
    puntos: function (nv) { return (CFG.puntosNivel || {})[nv] || 100; },
    registro: {
      registrar: registrar, enviarPendientes: enviarPendientes, filasRemotas: filasRemotas,
      filasLocales: function () { return leer(K_REG, []); },
      pendientes: function () { return leer(K_PEND, []).length; },
      hayEndpoint: function () { return !!endpoint(); },
      estado: function (k, v) { var t = leer(K_EST, {}); if (arguments.length > 1) { if (v === null) delete t[k]; else t[k] = v; escribir(K_EST, t); } return t[k]; },
      estados: function () { return leer(K_EST, {}); },
      borrarTodo: function () { try { localStorage.removeItem(K_REG); localStorage.removeItem(K_PEND); localStorage.removeItem(K_EST); } catch (e) {} }
    }
  };
})();
