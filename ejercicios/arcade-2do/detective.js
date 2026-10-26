/* ═══════════════════════════════════════════
   BATIN · Arcade de 2° — 🐱 Gatiel, detective de código
   4 casos · cada uno con 4 pasos que suben de nivel:
   Interrogar (N3) → Acusar (N4) → Corregir (N5) → Comprobar (N4–N6)
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR, R = A.registro, esc = A.esc, q = A.q, qa = A.qa;
  var CASOS = window.AR_CASOS || [];
  var D = null;   // estado del detective
  var ETAPA_ICO = { Interrogar: '🗣️', Acusar: '☝️', Corregir: '🔧', Comprobar: '✅' };

  function guardar() { if (D) R.estado(D.id, D); }
  function paso(c, i) {
    var p = {}, s = c.pasos[i]; for (var k in s) p[k] = s[k];
    p.tema = c.tema;
    if (p.tipo === 'linea') p.code = c.code;
    return p;
  }
  function pasosHechos(c) { return c.pasos.filter(function (p) { return D.r[p.id] && D.r[p.id].fin; }).length; }
  function casoCerrado(c) { return pasosHechos(c) === c.pasos.length; }
  function abierto(i) { return i === 0 || casoCerrado(CASOS[i - 1]); }

  /* ─── Inicio ─── */
  function inicio() {
    D = null;
    var guardados = Object.keys(R.estados()).filter(function (k) { return k.indexOf('det-') === 0; }).map(function (k) { return R.estados()[k]; })
      .sort(function (a, b) { return a.creada < b.creada ? 1 : -1; });
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-kicker">// Arcade de 2° · detective de código</div>' +
      '<h1 class="a-h1">🐱 Gatiel, detective de código</h1>' +
      A.personaje('gatiel', '«En este colegio pasan cosas raras: boletines que mienten, cantinas que cobran de más, asientos que aparecen de la nada… Siempre hay un <b>código culpable</b>. Necesito un ayudante que sepa hacer una prueba de escritorio. ¿Te animas?»', 'leyendo') +
      '<div class="a-card"><h3>Nueva investigación</h3><div class="a-fila">' +
        '<label class="a-campo">Detective o equipo<input type="text" id="d-nom" maxlength="40" placeholder="Tu nombre o el del equipo"></label>' +
        '<label class="a-campo">Curso' + A.selectorCursos('d-curso') + '</label>' +
        '<button class="a-btn solid" id="d-empezar" type="button">🔎 Abrir los expedientes</button></div></div>' +
      (guardados.length ? '<div class="a-card"><h3>Seguir una investigación</h3>' + guardados.map(function (g) {
        var hechos = CASOS.filter(function (c) { return c.pasos.every(function (p) { return g.r[p.id] && g.r[p.id].fin; }); }).length;
        return '<div class="a-fila" style="align-items:center;margin-bottom:8px"><b style="flex:1">🕵️ ' + esc(g.nom) + '</b><span class="a-chip">' + esc(g.curso) + '</span><span class="a-chip">📁 ' + hechos + '/' + CASOS.length + ' casos</span><span class="a-chip">⭐ ' + g.pts + '</span><button class="a-btn sm solid" data-seguir="' + esc(g.id) + '" type="button">Seguir</button></div>';
      }).join('') + '</div>' : '') +
      '<div class="a-card"><h3>Cómo se investiga</h3><p style="margin:0;line-height:1.7;color:var(--texto2)">Cada caso tiene 4 pasos que se ponen cada vez más difíciles: <b>🗣️ interrogar</b> a las variables (prueba de escritorio, N3), <b>☝️ acusar</b> a la línea culpable (N4), <b>🔧 corregir</b> eligiendo el arreglo (N5) y <b>✅ comprobar</b> que quedó bien (N4–N6). Si te equivocas puedes volver a intentarlo, pero cada error baja los puntos. La 🔎 lupa muestra una pista (−' + (A.CFG.descuentoPista || 30) + ' %). Al tercer error, Gatiel te explica la respuesta.</p></div>' +
      '</div><div id="a-capa"></div>';
    q('#d-empezar').addEventListener('click', function () {
      var n = q('#d-nom').value.trim(); if (!n) { q('#d-nom').focus(); return; }
      D = { id: 'det-' + Date.now().toString(36) + A.azar(1e4).toString(36), nom: n, curso: q('#d-curso').value, creada: A.ahora(), pts: 0, r: {}, caso: 0 };
      guardar(); tablero();
    });
    qa('[data-seguir]').forEach(function (b) { b.addEventListener('click', function () { D = R.estado(b.dataset.seguir); if (D) tablero(); }); });
  }

  /* ─── Tablero de casos ─── */
  function tablero() {
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">🐱 Expedientes de Gatiel</span><span class="a-chip">🕵️ ' + esc(D.nom) + '</span><span class="a-chip ac">⭐ ' + D.pts + ' pts</span><button class="a-btn sm" id="d-salir" type="button">💾 Guardar y salir</button></div>' +
      '<div class="d-casos">' + CASOS.map(function (c, i) {
        var h = pasosHechos(c), ab = abierto(i), cerr = casoCerrado(c);
        var estrellas = cerr ? estrellasDe(c) : 0;
        return '<button type="button" class="d-caso' + (cerr ? ' cerrado' : '') + '" data-caso="' + i + '"' + (ab ? '' : ' disabled') + '>' +
          '<span class="sello">' + (cerr ? 'CASO CERRADO' : ab ? 'ABIERTO' : '🔒 BLOQUEADO') + '</span>' +
          '<span class="ico">' + c.ico + '</span><span class="num">Expediente ' + c.n + ' · ' + A.TEMA[c.tema].ico + ' ' + A.TEMA[c.tema].nom + '</span>' +
          '<span class="tt">' + esc(c.titulo) + '</span>' +
          '<span class="pr">' + c.pasos.map(function (p) { return '<i class="' + (D.r[p.id] && D.r[p.id].fin ? 'si' : '') + '"></i>'; }).join('') + ' ' + h + '/' + c.pasos.length + (cerr ? ' · ' + '★★★'.slice(0, estrellas) + '☆☆☆'.slice(0, 3 - estrellas) : '') + '</span>' +
          '</button>';
      }).join('') + '</div>' +
      (CASOS.every(casoCerrado) ? '<div class="a-pie centro"><button class="a-btn solid xl" id="d-placa" type="button">🏅 Ver tu placa de detective</button></div>' : '') +
      '</div><div id="a-capa"></div>';
    q('#d-salir').addEventListener('click', function () { guardar(); inicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    qa('[data-caso]').forEach(function (b) { b.addEventListener('click', function () { D.caso = Number(b.dataset.caso); guardar(); abrirCaso(); }); });
    var pl = q('#d-placa'); if (pl) pl.addEventListener('click', placa);
  }
  function estrellasDe(c) {
    var err = c.pasos.reduce(function (a, p) { var s = D.r[p.id] || {}; return a + (s.err || 0) + (s.pista ? 1 : 0); }, 0);
    return err === 0 ? 3 : err <= 2 ? 2 : 1;
  }

  /* ─── Un caso ─── */
  function abrirCaso() {
    var c = CASOS[D.caso];
    var i = c.pasos.findIndex(function (p) { return !(D.r[p.id] && D.r[p.id].fin); });
    if (i < 0) i = c.pasos.length - 1;
    pintarCaso(c, i);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function pintarCaso(c, i) {
    var p = paso(c, i), st = D.r[p.id] || (D.r[p.id] = { err: 0, pista: false, fin: false, pts: 0 });
    var testigo = A.personaje(c.testigo.quien, '<i>Testigo:</i> «' + esc(c.testigo.dice) + '»', 'explicando', c.testigo.quien === 'bit' ? 'var(--bi)' : 'var(--te)');
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">' + c.ico + ' Expediente ' + c.n + ': ' + esc(c.titulo) + '</span><span class="a-chip ac" id="d-pts">⭐ ' + D.pts + ' pts</span><button class="a-btn sm" id="d-volver" type="button">📁 Expedientes</button></div>' +
      '<div class="d-grid">' +
        '<aside class="d-exp"><div class="d-denuncia"><b>🚨 La denuncia</b>' + esc(c.denuncia) + '</div>' + testigo +
          (c.matriz && p.tipo !== 'celdas' ? '<div class="a-ayuda" style="margin:4px 0">Matriz s del aula (1 = ocupado, 0 = libre):</div>' + A.tablaHTML({ cols: [''].concat(c.matriz[0].map(function (x, k) { return 'col ' + (k + 1); })), filas: c.matriz.map(function (f, k) { return ['fila ' + (k + 1)].concat(f); }) }) : '') +
          (p.tipo !== 'linea' ? '<div class="a-ayuda" style="margin:4px 0">🧾 Evidencia: el código sospechoso</div>' + A.bloqueCodigo(c.code) : '') +
        '</aside>' +
        '<section class="d-paso">' +
          '<div class="d-etapas">' + c.pasos.map(function (pp, k) { var s = D.r[pp.id]; return '<span class="' + (k === i ? 'act' : '') + (s && s.fin ? ' si' : '') + '">' + ETAPA_ICO[pp.etapa] + ' ' + pp.etapa + '</span>'; }).join('') + '</div>' +
          '<div class="a-reto"><div class="a-reto-cab"><span class="a-chip ac">N' + p.nv + ' · ' + A.NIVEL_NOM[p.nv] + '</span><span class="a-chip">' + A.TIPO_NOM[p.tipo] + '</span>' +
            '<span class="der">' + (st.fin ? '✔ +' + st.pts + ' pts' : st.err ? '✘ ' + st.err + ' error' + (st.err === 1 ? '' : 'es') : '+' + A.puntos(p.nv) + ' pts') + '</span></div>' +
            '<div class="a-fila" style="margin-bottom:10px"><button class="a-btn sm" id="d-lupa" type="button"' + (st.pista || st.fin ? ' disabled' : '') + '>🔎 Usar la lupa (−' + (A.CFG.descuentoPista || 30) + ' %)</button></div>' +
            '<div id="d-reto"></div><div id="d-tras"></div></div>' +
        '</section>' +
      '</div></div><div id="a-capa"></div>';
    q('#d-volver').addEventListener('click', function () { guardar(); tablero(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    if (st.fin) { mostrarFin(c, i, p, st, true); return; }
    var api = A.montarReto(q('#d-reto'), p, { revelar: false, pista: st.pista, sinCodigo: true, alResponder: function (ok, resp) { responder(c, i, p, st, ok, resp); } });
    q('#d-lupa').addEventListener('click', function () { st.pista = true; guardar(); api.pista(); this.disabled = true; });
  }
  function responder(c, i, p, st, ok, resp) {
    if (st.err === 0 && !st.registrado) { R.registrar(D.id, D.curso, 'detective', D.nom, p, ok, resp, st.pista ? '[pista] ' : ''); st.registrado = true; }
    if (ok) {
      var f = 1 - st.err * 0.25 - (st.pista ? (A.CFG.descuentoPista || 30) / 100 : 0);
      st.pts = Math.max(0, Math.round(A.puntos(p.nv) * Math.max(0.2, f)));
      st.fin = true; D.pts += st.pts; guardar(); var hp = q('#d-pts'); if (hp) hp.textContent = '⭐ ' + D.pts + ' pts';
      mostrarFin(c, i, p, st, false);
      return;
    }
    st.err++; guardar();
    if (st.err >= 3) {
      st.fin = true; st.pts = 0; st.revelado = true; guardar();
      mostrarFin(c, i, p, st, false);
      return;
    }
    var frases = ['«Mmm… eso no cuadra con la evidencia. Vuelve a mirar el código.»', '«Tampoco. Te presto mi lupa: lee la pista con atención.»'];
    q('#d-tras').innerHTML = '<div class="a-msg mal"><b class="t">✘ No es correcto</b>' + frases[st.err - 1] + (st.err === 2 ? '<br>🔎 ' + esc(p.pista) : '') + '</div>' +
      '<div class="a-pie"><span class="der"><button class="a-btn solid" id="d-otra" type="button">Intentar de nuevo</button></span></div>';
    q('#d-otra').addEventListener('click', function () { pintarCaso(c, i); });
  }
  function mostrarFin(c, i, p, st, yaEstaba) {
    var corr = A.respuestaCorrecta(p);
    var tras = q('#d-tras');
    if (yaEstaba) q('#d-reto').innerHTML = '<div class="a-q">' + esc(p.q) + '</div>';
    tras.innerHTML = (st.revelado
      ? '<div class="a-msg mal"><b class="t">Gatiel te lo explica</b>' + (corr ? 'Respuesta: <b>' + esc(corr) + '</b><br>' : '') + esc(p.ex) + '</div>'
      : '<div class="a-msg ok"><b class="t">✔ ¡Bien visto! +' + st.pts + ' pts</b>' + esc(p.ex) + '</div>') +
      '<div class="a-pie"><span class="der">' + (i < c.pasos.length - 1 ? '<button class="a-btn solid" id="d-sig" type="button">Siguiente paso: ' + ETAPA_ICO[c.pasos[i + 1].etapa] + ' ' + c.pasos[i + 1].etapa + ' →</button>' : '<button class="a-btn solid" id="d-cerrar" type="button">📁 Cerrar el caso</button>') + '</span></div>';
    var s = q('#d-sig'); if (s) s.addEventListener('click', function () { pintarCaso(c, i + 1); window.scrollTo({ top: 0, behavior: 'instant' }); });
    var k = q('#d-cerrar'); if (k) k.addEventListener('click', function () { cerrarCaso(c); });
    if (!yaEstaba) { var b = q('#d-sig') || q('#d-cerrar'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40); }
  }
  function cerrarCaso(c) {
    R.enviarPendientes();
    var e = estrellasDe(c), pts = c.pasos.reduce(function (a, p) { return a + ((D.r[p.id] || {}).pts || 0); }, 0);
    var sig = CASOS[c.n];
    A.modal(q('#a-capa'), c.ico, '¡Caso cerrado!',
      A.personaje('gatiel', ['«Lo resolvimos, pero con ayuda. Repasa la explicación de los pasos que costaron.»', '«¡Buen trabajo, colega! Casi sin errores.»', '«¡Impecable! Ni una pista. Eres un detective nato.»'][e - 1], 'idea') +
      '<p style="font-size:28px;margin:6px 0;color:var(--ac)">' + '★★★'.slice(0, e) + '<span style="opacity:.3">' + '★★★'.slice(0, 3 - e) + '</span></p><p>+' + pts + ' pts en este caso · total ' + D.pts + ' pts</p>',
      sig ? [['Siguiente expediente: ' + sig.titulo + ' →', true, function () { D.caso = sig.n - 1; guardar(); abrirCaso(); }], ['Ver los expedientes', false, tablero]]
          : [['🏅 Ver tu placa', true, placa]]);
  }
  function placa() {
    tablero();
    var tot = 0, ok1 = 0;
    CASOS.forEach(function (c) { c.pasos.forEach(function (p) { var s = D.r[p.id] || {}; tot++; if (s.fin && !s.err && !s.revelado) ok1++; }); });
    A.modal(q('#a-capa'), '🏅', 'Placa de detective: ' + esc(D.nom),
      A.personaje('gatiel', '«Cerraste los ' + CASOS.length + ' casos. Ahora sabes lo que hace un buen programador: <b>no adivina, prueba</b>. Antes del examen, haz siempre la prueba de escritorio.»', 'saludando') +
      '<p><b>' + D.pts + ' pts</b> · ' + ok1 + ' de ' + tot + ' pasos resueltos al primer intento</p>' +
      '<table><thead><tr><th>Caso</th><th class="num">Estrellas</th></tr></thead><tbody>' + CASOS.map(function (c) { var e = estrellasDe(c); return '<tr><td>' + c.ico + ' ' + esc(c.titulo) + '</td><td class="num">' + '★★★'.slice(0, e) + '☆☆☆'.slice(0, 3 - e) + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<p style="font-size:14px;margin-top:10px">¿Más práctica? Prueba la <a href="flota.html" style="color:var(--bi)">flota de Bit</a> o la <a href="copa.html" style="color:var(--te)">Copa Techi</a>.</p>',
      [['Volver', true, null]]);
  }

  window.__det = { estado: function () { return D; }, casos: CASOS, paso: function (ci, pi) { return paso(CASOS[ci], pi); } };
  inicio();
})();
