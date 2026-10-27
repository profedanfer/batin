/* ═══════════════════════════════════════════
   BATIN · Arcade de 1° — 🐱 Auditoría de Gatiel
   4 expedientes de proyectos ICIENTEC «con trampa».
   Cada uno: evidencia (planilla, informe, diapositiva) + 5 pasos:
   Calcular (N3) → Señalar (N4) → Analizar (N4) → Juzgar (N5) → Rehacer (N6)
   Solo, en equipo, o por relevos (2 a 4 equipos se turnan los pasos).
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR, R = A.registro, esc = A.esc, q = A.q, qa = A.qa;
  var CASOS = window.AR_CASOS || [];
  var D = null;   // estado de la auditoría
  var ETAPA_ICO = { Calcular: '🧮', 'Señalar': '☝️', Analizar: '🔍', Juzgar: '⚖️', Rehacer: '🛠️' };
  var TOK = ['🟣', '🔵', '🟠', '🟢'];
  var nEq = 1;

  function guardar() { if (D) R.estado(D.id, D); }
  function paso(c, i) { var p = {}, s = c.pasos[i]; for (var k in s) p[k] = s[k]; if (!p.tema) p.tema = c.tema; return p; }
  function pasosHechos(c) { return c.pasos.filter(function (p) { return D.r[p.id] && D.r[p.id].fin; }).length; }
  function casoCerrado(c) { return pasosHechos(c) === c.pasos.length; }
  function abierto(i) { return i === 0 || casoCerrado(CASOS[i - 1]); }
  function relevo() { return D.equipos.length > 1; }
  function eqAct() { return D.equipos[D.turno % D.equipos.length]; }
  function totalPts() { return D.equipos.reduce(function (a, e) { return a + e.pts; }, 0); }

  /* ─── Inicio ─── */
  function inicio() {
    D = null;
    var est = R.estados();
    var guardados = Object.keys(est).filter(function (k) { return k.indexOf('aud-') === 0; }).map(function (k) { return est[k]; })
      .sort(function (a, b) { return a.creada < b.creada ? 1 : -1; });
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-kicker">// Arcade de 1° · auditoría de proyectos</div>' +
      '<h1 class="a-h1">🐱 Gatiel audita la feria</h1>' +
      A.personaje('gatiel', '«Me nombraron auditor de ICIENTEC y tengo cuatro expedientes sobre la mesa: una encuesta que cuenta de menos, un informe que nadie encuentra, una diapositiva que no cuadra y un proyecto… digamos, ambicioso. En cada uno <b>los números, el informe y la presentación tienen que decir lo mismo</b>. Si no, algo se escondió. ¿Me ayudas?»', 'leyendo') +
      '<div class="a-card"><h3>Nueva auditoría</h3>' +
        '<div style="font-size:13px;color:var(--texto2);margin-bottom:6px">¿Cómo juegan?</div>' +
        '<div class="a-seg" id="d-n" style="margin-bottom:12px">' + [1, 2, 3, 4].map(function (n) { return '<button type="button" data-n="' + n + '"' + (n === nEq ? ' class="act"' : '') + '>' + (n === 1 ? 'Solo o un equipo' : 'Relevos: ' + n + ' equipos') + '</button>'; }).join('') + '</div>' +
        '<div class="a-fila" id="d-noms">' + A.indices(nEq).map(function (i) { return '<label class="a-campo">' + (nEq === 1 ? 'Auditor/a o equipo' : TOK[i] + ' Equipo ' + (i + 1)) + '<input type="text" maxlength="30" data-eq="' + i + '" placeholder="' + (nEq === 1 ? 'Tu nombre o el del equipo' : 'Nombre del equipo') + '"></label>'; }).join('') + '</div>' +
        '<div class="a-fila" style="margin-top:12px"><label class="a-campo">Curso' + A.selectorCursos('d-curso') + '</label>' +
        '<button class="a-btn solid" id="d-empezar" type="button">🔎 Abrir los expedientes</button></div></div>' +
      (guardados.length ? '<div class="a-card"><h3>Seguir una auditoría</h3>' + guardados.map(function (g) {
        var hechos = CASOS.filter(function (c) { return c.pasos.every(function (p) { return g.r[p.id] && g.r[p.id].fin; }); }).length;
        return '<div class="a-fila" style="align-items:center;margin-bottom:8px"><b style="flex:1;min-width:160px">🕵️ ' + g.equipos.map(function (e) { return esc(e.nom); }).join(' · ') + '</b><span class="a-chip">' + esc(g.curso) + '</span><span class="a-chip">📁 ' + hechos + '/' + CASOS.length + '</span><span class="a-chip">⭐ ' + g.equipos.reduce(function (a, e) { return a + e.pts; }, 0) + '</span><button class="a-btn sm solid" data-seguir="' + esc(g.id) + '" type="button">Seguir</button><button class="a-btn sm" data-borrar="' + esc(g.id) + '" type="button" aria-label="Borrar">🗑</button></div>';
      }).join('') + '</div>' : '') +
      '<div class="a-card"><h3>Cómo se audita</h3><p style="margin:0;line-height:1.75;color:var(--texto2)">Cada expediente tiene 5 pasos que suben de nivel: <b>🧮 calcular</b> con la planilla (N3), <b>☝️ señalar</b> el dato o la frase que no cierra (N4), <b>🔍 analizar</b> la causa (N4), <b>⚖️ juzgar</b> cuál es la mejor corrección (N5) y <b>🛠️ rehacer</b> la parte que falló (N6). Si te equivocas puedes volver a intentarlo, pero cada error baja los puntos. La 🔎 lupa da una pista (−' + (A.CFG.descuentoPista || 30) + ' %). Al tercer error, Gatiel te explica la respuesta. Para abrir un expediente hay que cerrar el anterior.<br>👥 <b>Relevos:</b> los equipos se turnan los pasos en el proyector; cada uno suma sus propios puntos.</p></div>' +
      '</div><div id="a-capa"></div>';
    qa('#d-n button').forEach(function (b) { b.addEventListener('click', function () { nEq = Number(b.dataset.n); inicio(); }); });
    q('#d-empezar').addEventListener('click', function () {
      var ins = qa('#d-noms input');
      if (nEq === 1 && !ins[0].value.trim()) { ins[0].focus(); return; }
      var eqs = ins.map(function (inp, i) { return { nom: inp.value.trim() || 'Equipo ' + (i + 1), pts: 0, ok1: 0 }; });
      D = { id: 'aud-' + Date.now().toString(36) + A.azar(1e4).toString(36), equipos: eqs, turno: 0, curso: q('#d-curso').value, creada: A.ahora(), r: {}, caso: 0 };
      guardar(); tablero();
    });
    qa('[data-seguir]').forEach(function (b) { b.addEventListener('click', function () { D = R.estado(b.dataset.seguir); if (D) tablero(); }); });
    qa('[data-borrar]').forEach(function (b) {
      b.addEventListener('click', function () {
        A.modal(q('#a-capa'), '🗑', '¿Borrar esta auditoría?', '<p>Se pierde el avance guardado en este navegador. Las respuestas ya registradas siguen en el panel.</p>',
          [['Sí, borrar', true, function () { R.estado(b.dataset.borrar, null); inicio(); }], ['Cancelar', false, null]]);
      });
    });
  }

  function hudEquipos() {
    return D.equipos.map(function (e, i) { return '<span class="a-chip' + (relevo() && i === D.turno % D.equipos.length ? ' ac' : '') + '">' + (relevo() ? TOK[i] + ' ' : '🕵️ ') + esc(e.nom) + ' · ⭐ ' + e.pts + '</span>'; }).join('');
  }

  /* ─── Tablero de expedientes ─── */
  function tablero() {
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">🐱 Expedientes de la feria</span>' + hudEquipos() + '<button class="a-btn sm" id="d-salir" type="button">💾 Guardar y salir</button></div>' +
      '<div class="d-casos">' + CASOS.map(function (c, i) {
        var h = pasosHechos(c), ab = abierto(i), cerr = casoCerrado(c);
        var est = cerr ? estrellasDe(c) : 0;
        return '<button type="button" class="d-caso' + (cerr ? ' cerrado' : '') + '" data-caso="' + i + '"' + (ab ? '' : ' disabled') + '>' +
          '<span class="sello">' + (cerr ? 'AUDITADO' : ab ? 'ABIERTO' : '🔒 BLOQUEADO') + '</span>' +
          '<span class="ico">' + c.ico + '</span><span class="num">Expediente ' + c.n + ' · ' + A.TEMA[c.tema].ico + ' ' + A.TEMA[c.tema].nom + '</span>' +
          '<span class="tt">' + esc(c.titulo) + '</span><span class="eqp">' + esc(c.equipo) + '</span>' +
          '<span class="pr">' + c.pasos.map(function (p) { return '<i class="' + (D.r[p.id] && D.r[p.id].fin ? 'si' : '') + '"></i>'; }).join('') + ' ' + h + '/' + c.pasos.length + (cerr ? ' · ' + '★★★'.slice(0, est) + '☆☆☆'.slice(0, 3 - est) : '') + '</span>' +
          '</button>';
      }).join('') + '</div>' +
      (CASOS.every(casoCerrado) ? '<div class="a-pie centro"><button class="a-btn solid xl" id="d-placa" type="button">🏅 Ver el certificado de auditoría</button></div>' : '') +
      '</div><div id="a-capa"></div>';
    q('#d-salir').addEventListener('click', function () { guardar(); inicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    qa('[data-caso]').forEach(function (b) { b.addEventListener('click', function () { D.caso = Number(b.dataset.caso); guardar(); abrirCaso(); }); });
    var pl = q('#d-placa'); if (pl) pl.addEventListener('click', certificado);
  }
  function estrellasDe(c) {
    var err = c.pasos.reduce(function (a, p) { var s = D.r[p.id] || {}; return a + (s.err || 0) + (s.pista ? 1 : 0); }, 0);
    return err === 0 ? 3 : err <= 2 ? 2 : 1;
  }

  /* ─── Un expediente ─── */
  function abrirCaso() {
    var c = CASOS[D.caso];
    var i = c.pasos.findIndex(function (p) { return !(D.r[p.id] && D.r[p.id].fin); });
    if (i < 0) i = c.pasos.length - 1;
    pintarCaso(c, i);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function tipoOculto(p) { return p.tipo === 'celda' ? 'hoja' : p.tipo === 'fragmento' ? (p.marco || 'doc') : ''; }
  function evidencia(c, p) {
    var oc = tipoOculto(p);
    return c.evidencia.map(function (e) {
      if (e.v.tipo === oc) return '<div class="d-ev oculta"><div class="lbl">' + esc(e.etq) + '</div><div class="a-ayuda">👉 Está en el desafío: trabaja sobre ella ahí.</div></div>';
      return '<div class="d-ev"><div class="lbl">' + esc(e.etq) + '</div>' + A.visual(e.v) + '</div>';
    }).join('');
  }
  function pintarCaso(c, i) {
    var p = paso(c, i), st = D.r[p.id] || (D.r[p.id] = { err: 0, pista: false, fin: false, pts: 0 });
    if (st.eq == null) st.eq = D.turno % D.equipos.length;
    var e = D.equipos[st.eq];
    var testigo = A.personaje(c.testigo.quien, '<i>Declaración del equipo:</i> «' + esc(c.testigo.dice) + '»', 'explicando', c.testigo.quien === 'bit' ? 'var(--bi)' : 'var(--te)');
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">' + c.ico + ' Expediente ' + c.n + ': ' + esc(c.titulo) + '</span><span id="d-hud">' + hudEquipos() + '</span><button class="a-btn sm" id="d-volver" type="button">📁 Expedientes</button></div>' +
      '<div class="d-grid">' +
        '<aside class="d-exp"><div class="d-denuncia"><b>🚨 La denuncia · ' + esc(c.equipo) + '</b>' + esc(c.denuncia) + '</div>' + testigo +
          '<div class="a-ayuda" style="margin:10px 0 4px">🧾 Evidencia</div>' + evidencia(c, p) +
        '</aside>' +
        '<section class="d-paso">' +
          '<div class="d-etapas">' + c.pasos.map(function (pp, k) { var s = D.r[pp.id]; return '<span class="' + (k === i ? 'act' : '') + (s && s.fin ? ' si' : '') + '">' + ETAPA_ICO[pp.etapa] + ' ' + pp.etapa + '</span>'; }).join('') + '</div>' +
          (relevo() ? '<div class="d-turno">' + TOK[st.eq] + ' Le toca a <b>' + esc(e.nom) + '</b></div>' : '') +
          '<div class="a-reto"><div class="a-reto-cab"><span class="a-chip ac">N' + p.nv + ' · ' + A.NIVEL_NOM[p.nv] + '</span><span class="a-chip">' + A.TIPO_NOM[p.tipo] + '</span>' +
            '<span class="der">' + (st.fin ? '✔ +' + st.pts + ' pts' : st.err ? '✘ ' + st.err + ' error' + (st.err === 1 ? '' : 'es') : '+' + A.puntos(p.nv) + ' pts') + '</span></div>' +
            '<div class="a-fila" style="margin-bottom:10px"><button class="a-btn sm" id="d-lupa" type="button"' + (st.pista || st.fin ? ' disabled' : '') + '>🔎 Usar la lupa (−' + (A.CFG.descuentoPista || 30) + ' %)</button></div>' +
            '<div id="d-reto"></div><div id="d-tras"></div></div>' +
        '</section>' +
      '</div></div><div id="a-capa"></div>';
    q('#d-volver').addEventListener('click', function () { guardar(); tablero(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    if (st.fin) { mostrarFin(c, i, p, st, true); return; }
    var api = A.montarReto(q('#d-reto'), p, { revelar: false, pista: st.pista, alResponder: function (ok, resp) { responder(c, i, p, st, ok, resp); } });
    q('#d-lupa').addEventListener('click', function () { st.pista = true; guardar(); api.pista(); this.disabled = true; });
  }
  function responder(c, i, p, st, ok, resp) {
    var e = D.equipos[st.eq];
    if (st.err === 0 && !st.registrado) { R.registrar(D.id, D.curso, 'auditoria', e.nom, p, ok, resp, st.pista ? '[pista] ' : ''); st.registrado = true; }
    if (ok) {
      var f = 1 - st.err * 0.25 - (st.pista ? (A.CFG.descuentoPista || 30) / 100 : 0);
      st.pts = Math.max(0, Math.round(A.puntos(p.nv) * Math.max(0.2, f)));
      st.fin = true; e.pts += st.pts; if (!st.err && !st.pista) e.ok1++;
      D.turno++; guardar();
      var hud = q('#d-hud'); if (hud) hud.innerHTML = hudEquipos();
      mostrarFin(c, i, p, st, false);
      return;
    }
    st.err++; guardar();
    if (st.err >= 3) {
      st.fin = true; st.pts = 0; st.revelado = true; D.turno++; guardar();
      var hud2 = q('#d-hud'); if (hud2) hud2.innerHTML = hudEquipos();
      mostrarFin(c, i, p, st, false);
      return;
    }
    var frases = ['«Mmm… eso no cuadra con la evidencia. Vuelve a mirar los números.»', '«Tampoco. Te presto mi lupa: lee la pista con atención.»'];
    q('#d-tras').innerHTML = '<div class="a-msg mal"><b class="t">✘ No es correcto</b>' + frases[st.err - 1] + (st.err === 2 && p.pista ? '<br>🔎 ' + esc(p.pista) : '') + '</div>' +
      '<div class="a-pie"><span class="der"><button class="a-btn solid" id="d-otra" type="button">Intentar de nuevo</button></span></div>';
    q('#d-otra').addEventListener('click', function () { pintarCaso(c, i); });
  }
  function mostrarFin(c, i, p, st, yaEstaba) {
    var corr = A.respuestaCorrecta(p);
    var tras = q('#d-tras');
    if (yaEstaba) q('#d-reto').innerHTML = '<div class="a-q">' + esc(p.q) + '</div>';
    var sig = i < c.pasos.length - 1;
    var prox = relevo() && sig ? ' · ' + TOK[D.turno % D.equipos.length] + ' sigue ' + esc(eqAct().nom) : '';
    tras.innerHTML = (st.revelado
      ? '<div class="a-msg mal"><b class="t">Gatiel te lo explica</b>' + (corr ? 'Respuesta: <b>' + esc(corr) + '</b><br>' : '') + esc(p.ex) + '</div>'
      : '<div class="a-msg ok"><b class="t">✔ ¡Bien visto! +' + st.pts + ' pts</b>' + esc(p.ex) + '</div>') +
      '<div class="a-pie"><span class="der">' + (sig ? '<button class="a-btn solid" id="d-sig" type="button">Siguiente: ' + ETAPA_ICO[c.pasos[i + 1].etapa] + ' ' + c.pasos[i + 1].etapa + prox + ' →</button>' : '<button class="a-btn solid" id="d-cerrar" type="button">📁 Cerrar el expediente</button>') + '</span></div>';
    var s = q('#d-sig'); if (s) s.addEventListener('click', function () { pintarCaso(c, i + 1); window.scrollTo({ top: 0, behavior: 'instant' }); });
    var k = q('#d-cerrar'); if (k) k.addEventListener('click', function () { cerrarCaso(c); });
    if (!yaEstaba) { var b = q('#d-sig') || q('#d-cerrar'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40); }
  }
  function cerrarCaso(c) {
    R.enviarPendientes();
    var e = estrellasDe(c), pts = c.pasos.reduce(function (a, p) { return a + ((D.r[p.id] || {}).pts || 0); }, 0);
    var sig = CASOS[c.n];
    A.modal(q('#a-capa'), c.ico, '¡Expediente auditado!',
      A.personaje('gatiel', ['«Lo resolvimos, pero con ayuda. Repasa la explicación de los pasos que costaron.»', '«¡Buen trabajo! Casi sin errores. Este equipo ya sabe qué corregir.»', '«¡Impecable! Ni una pista. Así audita un técnico de verdad.»'][e - 1], 'idea') +
      '<p style="font-size:28px;margin:6px 0;color:var(--ac)">' + '★★★'.slice(0, e) + '<span style="opacity:.3">' + '★★★'.slice(0, 3 - e) + '</span></p><p>+' + pts + ' pts en este expediente · total ' + totalPts() + ' pts</p>',
      sig ? [['Siguiente: ' + sig.titulo + ' →', true, function () { D.caso = sig.n - 1; guardar(); abrirCaso(); }], ['Ver los expedientes', false, tablero]]
          : [['🏅 Ver el certificado', true, certificado]]);
  }
  function certificado() {
    tablero();
    var tot = 0, ok1 = 0;
    CASOS.forEach(function (c) { c.pasos.forEach(function (p) { var s = D.r[p.id] || {}; tot++; if (s.fin && !s.err && !s.revelado && !s.pista) ok1++; }); });
    var orden = D.equipos.slice().sort(function (a, b) { return b.pts - a.pts; });
    A.modal(q('#a-capa'), '🏅', 'Certificado de auditoría',
      A.personaje('gatiel', '«Auditaste los ' + CASOS.length + ' expedientes. Ya sabes lo que un jurado mira primero: <b>que la planilla, el informe y la diapositiva digan lo mismo</b>. Revisa tu propio proyecto con estos mismos ojos antes de entregarlo.»', 'saludando') +
      '<p><b>' + totalPts() + ' pts</b> · ' + ok1 + ' de ' + tot + ' pasos al primer intento y sin lupa</p>' +
      (relevo() ? '<table><thead><tr><th>Equipo</th><th class="num">Puntos</th><th class="num">Al primer intento</th></tr></thead><tbody>' + orden.map(function (e, k) { return '<tr><td>' + (k === 0 ? '🏆 ' : '') + esc(e.nom) + '</td><td class="num">' + e.pts + '</td><td class="num">' + e.ok1 + '</td></tr>'; }).join('') + '</tbody></table>' : '') +
      '<table><thead><tr><th>Expediente</th><th class="num">Estrellas</th></tr></thead><tbody>' + CASOS.map(function (c) { var e = estrellasDe(c); return '<tr><td>' + c.ico + ' ' + esc(c.titulo) + '</td><td class="num">' + '★★★'.slice(0, e) + '☆☆☆'.slice(0, 3 - e) + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<p style="font-size:14px;margin-top:10px">¿Más? Prueba <a href="planilla.html" style="color:var(--bi)">la planilla de Bit</a> o el <a href="feria.html" style="color:var(--te)">simulacro ICIENTEC</a>.</p>',
      [['Volver', true, null]]);
  }

  window.__aud = { estado: function () { return D; }, casos: CASOS, paso: function (ci, pi) { return paso(CASOS[ci], pi); } };
  inicio();
})();
