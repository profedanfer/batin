/* ═══════════════════════════════════════════
   BATIN · Arcade de 1° — 👩‍💻 Simulacro ICIENTEC con Techi
   · 4 stands que suben de nivel (config.js → feria):
     datos (N3) → informe (N4) → presentación (N5) → defensa (N6).
   · Un jurado de 3 criterios: Datos · Comunicación · Proyecto.
   · Contra reloj: responder rápido suma hasta +30 %.
   · Nervios: cada error suma 😬; con 3, la próxima pregunta tiene menos tiempo.
   · Comodines (uno de cada uno): pista de Techi, un minuto más, repregunta.
   · Por equipos: si uno falla, el jurado puede repreguntarle a otro (mitad de puntos).
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR, R = A.registro, esc = A.esc, q = A.q, qa = A.qa;
  var STANDS = A.CFG.feria || [{ nombre: 'Stand', ico: '📊', nv: 3, temas: ['excel'], preguntas: 3, segundos: 90 }];
  var BANCO = window.AR_BANCO || [], BY_ID = {}; BANCO.forEach(function (x) { BY_ID[x.id] = x; });
  var TOK = ['🟣', '🔵', '🟠', '🟢'];
  var JUR = {
    datos: { nom: 'Datos', ico: '📊', quien: 'Prof. Benítez', temas: ['excel', 'datos'] },
    com:   { nom: 'Comunicación', ico: '🗣️', quien: 'Lic. Ortiz', temas: ['word', 'ppt'] },
    proy:  { nom: 'Proyecto', ico: '🚀', quien: 'Ing. Ramírez', temas: ['proyecto'] }
  };
  var GUIA = {
    datos: ['../../cuestionarios/lab1-repaso-etapa1.html', 'el repaso de Excel de la 1ª etapa', '../../cuestionarios/formularios-guia-toma-datos.html', 'la guía de Formularios'],
    com: ['../../cuestionarios/word-guia-formato-profesional.html', 'la guía de Word', '../../cuestionarios/presentaciones-guia-comunicar.html', 'la guía de Presentaciones'],
    proy: ['../../proyectos/icientec1.html', 'Misión Primer Año (proyectos de 1°)']
  };
  var T = null, capa = null, reloj = null, nEq = 1;

  function criterio(tema) { for (var k in JUR) if (JUR[k].temas.indexOf(tema) >= 0) return k; return 'proy'; }
  function multi() { return T.equipos.length > 1; }
  function parar() { if (reloj) clearInterval(reloj); reloj = null; }

  /* ─── Inicio ─── */
  function inicio() {
    parar(); T = null;
    var fama = R.estado('feria-fama') || [];
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-kicker">// Arcade de 1° · simulacro de feria</div>' +
      '<h1 class="a-h1">👩‍💻 Simulacro ICIENTEC</h1>' +
      A.personaje('techi', '«Hoy es el día de la feria. Vas a recorrer <b>' + STANDS.length + ' stands</b>, cada uno más exigente: ' + STANDS.map(function (s) { return s.ico + ' <b>' + s.nombre + '</b> (N' + s.nv + ')'; }).join(', ') + '. Te evalúa un jurado de tres personas: una mira los <b>datos</b>, otra la <b>comunicación</b> y otra el <b>proyecto</b>. Respira: los nervios también cuentan.»', 'accion', 'var(--te)') +
      '<div class="a-card"><h3>Inscripción</h3>' +
        '<div style="font-size:13px;color:var(--texto2);margin-bottom:6px">¿Cuántos se presentan?</div>' +
        '<div class="a-seg" id="t-n" style="margin-bottom:12px">' + [1, 2, 3, 4].map(function (n) { return '<button type="button" data-n="' + n + '"' + (n === nEq ? ' class="act"' : '') + '>' + (n === 1 ? 'Solo' : n + ' equipos') + '</button>'; }).join('') + '</div>' +
        '<div class="a-fila" id="t-noms">' + A.indices(nEq).map(function (i) { return '<label class="a-campo">' + (nEq === 1 ? 'Tu nombre o el del proyecto' : TOK[i] + ' Equipo ' + (i + 1)) + '<input type="text" maxlength="30" data-eq="' + i + '"></label>'; }).join('') + '</div>' +
        '<div class="a-fila" style="margin-top:12px"><label class="a-campo">Curso' + A.selectorCursos('t-curso') + '</label><button class="a-btn solid xl" id="t-empezar" type="button">🎟️ Entrar a la feria</button></div>' +
      '</div>' +
      '<div class="a-card"><h3>Reglas</h3><p style="margin:0;line-height:1.75;color:var(--texto2)">⏱️ Cada pregunta tiene tiempo. Puntos = nivel (N3 = ' + A.puntos(3) + ' … N6 = ' + A.puntos(6) + ') + hasta 30 % por rapidez. 🔥 Dos aciertos seguidos dan +20 %. 😬 Cada error suma un nervio; con 3 nervios la próxima pregunta tiene 30 % menos de tiempo (un acierto te calma un poco). 🃏 Comodines, uno de cada uno: <b>🔎 Pregúntale a Techi</b> (pista), <b>⏱️ Pido un minuto</b> (+30 s) y <b>🔄 Repregunta</b> (cambia la pregunta). 👥 Por equipos, las preguntas se turnan; si un equipo falla, el jurado puede repreguntarle a otro por la mitad de los puntos.</p></div>' +
      (fama.length ? '<div class="a-card"><h3>🏆 Cuadro de honor (este navegador)</h3><table class="a-tabla" style="width:100%"><thead><tr><th>#</th><th>Nombre</th><th>Curso</th><th>Puntos</th><th>Distinción</th></tr></thead><tbody>' +
        fama.slice(0, 10).map(function (f, i) { return '<tr><td>' + (i + 1) + '</td><td style="text-align:left">' + esc(f.nom) + '</td><td>' + esc(f.curso) + '</td><td>' + f.pts + '</td><td>' + esc(f.dist) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '') +
      '</div><div id="a-capa"></div>';
    qa('#t-n button').forEach(function (b) { b.addEventListener('click', function () { nEq = Number(b.dataset.n); inicio(); }); });
    q('#t-empezar').addEventListener('click', function () {
      var noms = qa('#t-noms input').map(function (inp, i) { return inp.value.trim() || (nEq === 1 ? 'Expositor/a' : 'Equipo ' + (i + 1)); });
      nueva(noms, q('#t-curso').value);
    });
  }

  function armarStands(nEquipos) {
    var usados = {};
    return STANDS.map(function (st) {
      var n = (st.preguntas || 3) * nEquipos;
      function tomar(filtro) {
        var pool = A.mezclar(BANCO.filter(function (x) { return !usados[x.id] && filtro(x); }));
        return pool;
      }
      var sel = tomar(function (x) { return x.nv === st.nv && (st.temas || []).indexOf(x.tema) >= 0; }).slice(0, n);
      sel.forEach(function (x) { usados[x.id] = 1; });
      if (sel.length < n) { var m = tomar(function (x) { return x.nv === st.nv; }).slice(0, n - sel.length); m.forEach(function (x) { usados[x.id] = 1; }); sel = sel.concat(m); }
      if (sel.length < n) { var m2 = tomar(function (x) { return Math.abs(x.nv - st.nv) === 1; }).slice(0, n - sel.length); m2.forEach(function (x) { usados[x.id] = 1; }); sel = sel.concat(m2); }
      return { nombre: st.nombre, ico: st.ico, nv: st.nv, temas: st.temas || [], segundos: st.segundos || 90, ids: sel.map(function (x) { return x.id; }) };
    });
  }
  function nueva(noms, curso) {
    T = { id: 'feria-' + Date.now().toString(36) + A.azar(1e4).toString(36), curso: curso, stands: armarStands(noms.length), si: 0, k: 0,
      equipos: noms.map(function (n) { return { nom: n, pts: 0, ok: 0, n: 0, racha: 0, nervios: 0, com: { pista: true, tiempo: true, cambio: true }, jur: { datos: [0, 0], com: [0, 0], proy: [0, 0] } }; }) };
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">👩‍💻 Simulacro ICIENTEC</span><span class="a-chip" id="t-prog"></span><button class="a-btn sm" id="t-salir" type="button">✖ Salir</button></div>' +
      '<div class="t-marc" id="t-marc"></div><div id="t-esc"></div>' +
      '</div><div id="a-capa"></div>';
    capa = q('#a-capa');
    q('#t-salir').addEventListener('click', function () {
      A.modal(capa, '✖', '¿Salir de la feria?', '<p>La partida no se guarda. Las respuestas ya quedaron registradas para el panel.</p>', [['Sí, salir', true, function () { parar(); inicio(); window.scrollTo({ top: 0, behavior: 'instant' }); }], ['Seguir', false, null]]);
    });
    introStand();
  }

  /* ─── Marcador ─── */
  function marcador(activo) {
    q('#t-marc').innerHTML = T.equipos.map(function (e, i) {
      return '<div class="t-eq' + (i === activo ? ' act' : '') + '"><span class="nm">' + (multi() ? TOK[i] + ' ' : '🎤 ') + esc(e.nom) + '</span><span class="pts">' + e.pts + '</span>' +
        '<span class="det">' + e.ok + '/' + e.n + ' · ' + (e.racha >= 2 ? '🔥 ' : '') + '<span class="nerv" title="Nervios">' + '😬'.repeat(e.nervios) + '<span style="opacity:.25">' + '😬'.repeat(3 - e.nervios) + '</span></span></span>' +
        '<span class="comod">' + (e.com.pista ? '🔎' : '<s>🔎</s>') + (e.com.tiempo ? '⏱️' : '<s>⏱️</s>') + (e.com.cambio ? '🔄' : '<s>🔄</s>') + '</span></div>';
    }).join('');
    var st = T.stands[T.si];
    q('#t-prog').textContent = st && !T.fin ? st.ico + ' Stand ' + (T.si + 1) + ' de ' + T.stands.length + ' · pregunta ' + Math.min(st.ids.length, T.k + 1) + ' de ' + st.ids.length : '🏁 Premiación';
  }

  /* ─── Stand ─── */
  var FRASES = [
    '«Acá el jurado mira si sabes de dónde salen tus números. Fórmulas, porcentajes, tabulación: lo que está en tu planilla.»',
    '«Ahora revisan el informe: si cada cosa está en su sección, si los datos coinciden y si se puede encontrar algo sin perderse.»',
    '«La presentación: no se trata de mostrar todo, sino de que el público recuerde una idea. Acá se evalúa, no se recita.»',
    '«La defensa. El jurado te pide que construyas: una fórmula, un plan, una respuesta. Es el momento de mostrar que el proyecto es tuyo.»'
  ];
  function introStand() {
    parar();
    var st = T.stands[T.si];
    marcador(-1);
    q('#t-esc').innerHTML = '<div class="c-intro t-stand"><div class="c-ronda-n">Stand ' + (T.si + 1) + ' de ' + T.stands.length + '</div><div class="t-stand-ico">' + st.ico + '</div><h2>' + esc(st.nombre) + '</h2>' +
      '<div class="a-fila" style="justify-content:center;margin:6px 0 4px"><span class="a-chip ac">N' + st.nv + ' · ' + A.NIVEL_NOM[st.nv] + '</span><span class="a-chip">' + st.ids.length + ' preguntas</span><span class="a-chip">⏱️ ' + st.segundos + ' s cada una</span></div>' +
      A.personaje('techi', FRASES[T.si] || FRASES[FRASES.length - 1], T.si === 3 ? 'accion' : 'explicando', 'var(--te)') +
      '<div class="a-pie centro"><button class="a-btn solid xl" id="t-ir" type="button">Empezar el stand →</button></div></div>';
    q('#t-ir').addEventListener('click', pregunta);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function pregunta() {
    var st = T.stands[T.si];
    if (T.k >= st.ids.length) { finStand(); return; }
    jugar(BY_ID[st.ids[T.k]], T.k % T.equipos.length, false);
  }
  function cambiarReto(r) {
    var st = T.stands[T.si], usados = {};
    T.stands.forEach(function (s) { s.ids.forEach(function (id) { usados[id] = 1; }); });
    var pool = BANCO.filter(function (x) { return !usados[x.id] && x.nv === r.nv; });
    if (!pool.length) pool = BANCO.filter(function (x) { return x.id !== r.id && x.nv === r.nv; });
    var n = pool[A.azar(pool.length)];
    if (n) st.ids[T.k] = n.id;
    return n || r;
  }

  function jugar(r, ti, robo) {
    parar();
    var e = T.equipos[ti], st = T.stands[T.si], jur = JUR[criterio(r.tema)];
    marcador(ti);
    var total = st.segundos * 1000 * (!robo && e.nervios >= 3 ? 0.7 : 1), extra = 0;
    q('#t-esc').innerHTML =
      '<div class="t-cab"><span class="a-chip ac">N' + r.nv + ' · ' + A.NIVEL_NOM[r.nv] + '</span><span class="a-chip">' + A.TEMA[r.tema].ico + ' ' + A.TEMA[r.tema].nom + '</span><span class="a-chip">' + jur.ico + ' Pregunta ' + jur.quien + ' (' + jur.nom + ')</span>' +
        (multi() ? '<span class="a-chip' + (robo ? ' alerta' : '') + '">' + TOK[ti] + ' ' + (robo ? 'Repregunta a ' : 'Responde ') + esc(e.nom) + (robo ? ' · ½ puntos' : '') + '</span>' : '') +
        (!robo && e.nervios >= 3 ? '<span class="a-chip alerta">😬 ¡Nervios! −30 % de tiempo</span>' : '') +
        '<span class="t-reloj" id="t-seg"></span></div>' +
      '<div class="c-tiempo"><i id="t-barra"></i></div>' +
      (robo ? '' : '<div class="t-comod">' +
        '<button class="a-btn sm" id="t-c-pista" type="button"' + (e.com.pista && r.pista ? '' : ' disabled') + '>🔎 Pregúntale a Techi</button>' +
        '<button class="a-btn sm" id="t-c-tiempo" type="button"' + (e.com.tiempo ? '' : ' disabled') + '>⏱️ Pido un minuto (+30 s)</button>' +
        '<button class="a-btn sm" id="t-c-cambio" type="button"' + (e.com.cambio ? '' : ' disabled') + '>🔄 Repregunta</button></div>') +
      '<div class="a-reto"><div id="t-reto"></div><div id="t-tras"></div></div>';
    var ini = Date.now();
    var api = A.montarReto(q('#t-reto'), r, { revelar: !multi(), alResponder: function (ok, resp) {
      parar(); qa('.t-comod button').forEach(function (b) { b.disabled = true; });
      resultado(r, ti, robo, ok, resp, Date.now() - ini, total + extra);
    } });
    if (!robo) {
      q('#t-c-pista').addEventListener('click', function () { e.com.pista = false; api.pista(); this.disabled = true; marcador(ti); });
      q('#t-c-tiempo').addEventListener('click', function () { e.com.tiempo = false; extra += 30000; this.disabled = true; marcador(ti); });
      q('#t-c-cambio').addEventListener('click', function () { e.com.cambio = false; marcador(ti); jugar(cambiarReto(r), ti, false); });
    }
    reloj = setInterval(function () {
      var tot = total + extra, resta = tot - (Date.now() - ini), b = q('#t-barra'), s = q('#t-seg');
      if (b) { b.style.width = Math.max(0, Math.min(100, 100 * resta / tot)) + '%'; b.classList.toggle('poco', resta < 15000); }
      if (s) s.textContent = '⏱️ ' + A.mmss(resta);
      if (resta <= 0) { parar(); api.bloquear(); }
    }, 200);
  }

  function resultado(r, ti, robo, ok, resp, ms, total) {
    var e = T.equipos[ti], cr = criterio(r.tema), base = A.puntos(r.nv);
    R.registrar(T.id, T.curso, 'feria', e.nom, r, ok, resp, robo ? '[repregunta] ' : '');
    e.n++; e.jur[cr][1] += base;
    var tiempo = resp === '[tiempo agotado]';
    if (ok) {
      var rap = Math.max(0, 1 - ms / total), pts = base * (1 + 0.3 * rap);
      if (!robo && e.racha >= 1) pts *= 1.2;
      if (robo) pts /= 2;
      pts = Math.round(pts);
      e.pts += pts; e.ok++; e.racha = robo ? 0 : e.racha + 1; e.nervios = Math.max(0, e.nervios - 1);
      e.jur[cr][0] += robo ? base / 2 : base;
      revelar(r, true, pts, ti, robo);
      return;
    }
    e.racha = 0; if (!robo) e.nervios = Math.min(3, e.nervios + 1);
    var otros = T.equipos.map(function (x, i) { return i; }).filter(function (i) { return i !== ti; });
    if (multi() && !robo) {
      marcador(ti);
      q('#t-tras').innerHTML = '<div class="a-msg mal"><b class="t">' + (tiempo ? '⌛ Se acabó el tiempo' : '✘ No convence al jurado') + '</b>¿El jurado le repregunta a otro equipo? (mitad de puntos, sin comodines)</div>' +
        '<div class="a-pie">' + otros.map(function (i) { return '<button class="a-btn" type="button" data-robo="' + i + '">' + TOK[i] + ' ' + esc(T.equipos[i].nom) + '</button>'; }).join('') +
        '<span class="der"><button class="a-btn solid" type="button" id="t-nadie">Nadie: ver la respuesta</button></span></div>';
      qa('[data-robo]').forEach(function (b) { b.addEventListener('click', function () { jugar(r, Number(b.dataset.robo), true); }); });
      q('#t-nadie').addEventListener('click', function () { revelar(r, false, 0, ti, false, tiempo); });
      return;
    }
    revelar(r, false, 0, ti, robo, tiempo);
  }
  function revelar(r, ok, pts, ti, robo, tiempo) {
    marcador(ti);
    var corr = A.respuestaCorrecta(r), e = T.equipos[ti];
    var frase = ok ? (robo ? '«¡Bien rescatado!»' : e.racha >= 2 ? '«¡Vas en racha! El jurado está anotando.»' : '«¡Eso! Respuesta clara y fundamentada.»')
      : e.nervios >= 3 ? '«Respira hondo. El jurado no espera perfección: espera que sepas de dónde sale cada dato.»' : '«No pasa nada: lee la explicación, que esto mismo te lo pueden preguntar en la feria.»';
    q('#t-tras').innerHTML = (ok ? '<div class="a-msg ok"><b class="t">✔ ¡Correcto! +' + pts + ' pts' + (robo ? ' (repregunta)' : '') + '</b>' + esc(r.ex) + '</div>'
      : '<div class="a-msg mal"><b class="t">' + (tiempo ? '⌛ Se acabó el tiempo' : '✘ No era eso') + '</b>' + (corr ? 'Respuesta: <b>' + esc(corr) + '</b><br>' : '') + esc(r.ex) + '</div>') +
      A.personaje('techi', frase, ok ? 'idea' : 'explicando', 'var(--te)') +
      '<div class="a-pie"><span class="der"><button class="a-btn solid" id="t-sig" type="button">Siguiente →</button></span></div>';
    q('#t-sig').addEventListener('click', function () { T.k++; pregunta(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    var b = q('#t-sig'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40);
  }

  function finStand() {
    parar(); R.enviarPendientes();
    var st = T.stands[T.si], ultimo = T.si === T.stands.length - 1;
    var orden = T.equipos.slice().sort(function (a, b) { return b.pts - a.pts; });
    A.modal(capa, st.ico, 'Terminó: ' + st.nombre,
      (multi() ? '<table><thead><tr><th>Equipo</th><th class="num">Puntos</th><th class="num">Aciertos</th></tr></thead><tbody>' + orden.map(function (e) { return '<tr><td>' + TOK[T.equipos.indexOf(e)] + ' ' + esc(e.nom) + '</td><td class="num">' + e.pts + '</td><td class="num">' + e.ok + '/' + e.n + '</td></tr>'; }).join('') + '</tbody></table>'
        : '<p>Llevas <b>' + T.equipos[0].pts + ' pts</b> · ' + T.equipos[0].ok + ' de ' + T.equipos[0].n + ' respuestas correctas.</p>'),
      [[ultimo ? '🏅 Ir a la premiación' : 'Siguiente stand: ' + T.stands[T.si + 1].ico + ' ' + T.stands[T.si + 1].nombre + ' →', true, function () { if (ultimo) premiacion(); else { T.si++; T.k = 0; introStand(); } }]]);
  }

  /* ─── Premiación ─── */
  function maxPosible() {
    var por = T.stands.reduce(function (a, s) { return a + s.ids.length * A.puntos(s.nv); }, 0);
    return Math.round(por / T.equipos.length * 1.3);
  }
  function distincion(e, puesto) {
    if (multi()) return ['🥇 1er puesto', '🥈 2do puesto', '🥉 3er puesto', '🎖️ Mención de honor'][puesto];
    var p = e.pts / maxPosible();
    return p >= 0.75 ? '🥇 1er puesto' : p >= 0.6 ? '🥈 2do puesto' : p >= 0.45 ? '🥉 3er puesto' : p >= 0.3 ? '🎖️ Mención de honor' : '📜 Certificado de participación';
  }
  function rubrica(e) {
    return Object.keys(JUR).map(function (k) {
      var j = e.jur[k], p = j[1] ? Math.round(100 * j[0] / j[1]) : null;
      return '<div class="t-rub"><span class="l">' + JUR[k].ico + ' ' + JUR[k].nom + '</span><span class="b"><i style="width:' + (p || 0) + '%"></i></span><span class="v">' + (p == null ? '—' : p + ' %') + '</span></div>';
    }).join('');
  }
  function debil(e) {
    var peor = null, pv = 2;
    Object.keys(JUR).forEach(function (k) { var j = e.jur[k]; if (j[1]) { var p = j[0] / j[1]; if (p < pv) { pv = p; peor = k; } } });
    return pv < 0.7 ? peor : null;
  }
  function premiacion() {
    parar(); R.enviarPendientes(); T.fin = true;
    var orden = T.equipos.slice().sort(function (a, b) { return b.pts - a.pts; });
    var fama = R.estado('feria-fama') || [];
    orden.forEach(function (e, i) { fama.push({ nom: e.nom, curso: T.curso, pts: e.pts, dist: distincion(e, i).replace(/^\S+\s/, ''), f: A.ahora() }); });
    fama.sort(function (a, b) { return b.pts - a.pts; }); R.estado('feria-fama', fama.slice(0, 30));
    marcador(-1);
    q('#t-esc').innerHTML = '<div class="c-intro"><div class="c-ronda-n">Premiación · ICIENTEC (simulacro)</div><h2>🏅 Ceremonia de cierre</h2>' +
      A.personaje('techi', multi() ? '«¡Qué feria! El jurado ya deliberó. Miren su rúbrica: ahí está lo que tienen que reforzar antes de la feria de verdad.»' : '«¡Terminaste el recorrido! Mira la rúbrica del jurado: es un mapa de lo que te conviene repasar.»', 'saludando', 'var(--te)') +
      '<div class="t-diplomas">' + orden.map(function (e, i) {
        var d = debil(e), g = d ? GUIA[d] : null;
        return '<div class="t-dip' + (i === 0 ? ' p1' : '') + '"><div class="dist">' + distincion(e, i) + '</div><div class="nm">' + (multi() ? TOK[T.equipos.indexOf(e)] + ' ' : '') + esc(e.nom) + '</div>' +
          '<div class="pts">' + e.pts + ' pts · ' + e.ok + '/' + e.n + ' correctas</div>' + rubrica(e) +
          (g ? '<div class="rep">📌 Para reforzar <b>' + JUR[d].nom + '</b>: <a href="' + g[0] + '">' + g[1] + '</a>' + (g[2] ? ' y <a href="' + g[2] + '">' + g[3] + '</a>' : '') + '.</div>' : '<div class="rep">✨ Los tres criterios por encima del 70 %.</div>') +
          '</div>';
      }).join('') + '</div>' +
      '<div class="a-pie centro"><button class="a-btn solid xl" id="t-otra" type="button">Otra feria</button><a class="a-btn" href="index.html">🕹️ Volver al arcade</a></div></div>';
    q('#t-otra').addEventListener('click', inicio);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.__feria = { estado: function () { return T; } };
  inicio();
})();
