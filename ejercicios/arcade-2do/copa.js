/* ═══════════════════════════════════════════
   BATIN · Arcade de 2° — 👩‍💻 Copa Techi (torneo relámpago)
   · Rondas que suben de nivel (config.js → copa).
   · Contra reloj: responder rápido suma bonus; la racha multiplica.
   · Por equipos: si un equipo falla, otro puede robar la pregunta.
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR, R = A.registro, esc = A.esc, q = A.q, qa = A.qa;
  var RONDAS = A.CFG.copa || [{ nombre: 'Ronda', nv: 3, preguntas: 5, segundos: 60 }];
  var BANCO = window.AR_BANCO || [];
  var TOK = ['🟣', '🔵', '🟠', '🟢'];
  var C = null, capa = null, reloj = null, nEq = 1;

  function multi() { return C.equipos.length > 1; }
  function mult(e) { return e.racha >= 4 ? 2 : e.racha >= 2 ? 1.5 : 1; }

  /* ─── Inicio ─── */
  function inicio() {
    parar(); C = null;
    var fama = R.estado('copa-fama') || [];
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-kicker">// Arcade de 2° · torneo relámpago</div>' +
      '<h1 class="a-h1">👩‍💻 Copa Techi</h1>' +
      A.personaje('techi', '«Bienvenidos a la Copa. Son ' + RONDAS.length + ' rondas y cada una es más exigente: ' + RONDAS.map(function (r) { return '<b>' + r.nombre + '</b> (N' + r.nv + ')'; }).join(', ') + '. Responder rápido suma puntos extra y si encadenas aciertos, ¡tu racha multiplica! Tienes un comodín ⚡ que duplica una pregunta.»', 'accion', 'var(--te)') +
      '<div class="a-card"><h3>Inscripción</h3>' +
        '<div style="font-size:13px;color:var(--texto2);margin-bottom:6px">¿Cuántos compiten?</div>' +
        '<div class="a-seg" id="c-n" style="margin-bottom:12px">' + [1, 2, 3, 4].map(function (n) { return '<button type="button" data-n="' + n + '"' + (n === nEq ? ' class="act"' : '') + '>' + (n === 1 ? 'Solo' : n + ' equipos') + '</button>'; }).join('') + '</div>' +
        '<div class="a-fila" id="c-noms">' + A.indices(nEq).map(function (i) { return '<label class="a-campo">' + (nEq === 1 ? 'Tu nombre' : TOK[i] + ' Equipo ' + (i + 1)) + '<input type="text" maxlength="30" data-eq="' + i + '"></label>'; }).join('') + '</div>' +
        '<div class="a-fila" style="margin-top:12px"><label class="a-campo">Curso' + A.selectorCursos('c-curso') + '</label><button class="a-btn solid xl" id="c-empezar" type="button">🏁 ¡Que empiece la Copa!</button></div>' +
      '</div>' +
      '<div class="a-card"><h3>Reglas</h3><p style="margin:0;line-height:1.75;color:var(--texto2)">⏱️ Cada pregunta tiene tiempo. Puntos = nivel (N3 = ' + A.puntos(3) + ', N4 = ' + A.puntos(4) + ', N5 = ' + A.puntos(5) + ', N6 = ' + A.puntos(6) + ') + bonus por rapidez (hasta 50 %). 🔥 Racha: 2 aciertos seguidos ×1,5; 4 seguidos ×2. ⚡ Comodín: una vez por partida, duplica una pregunta. 👥 Por equipos, las preguntas se turnan; si un equipo falla, otro puede <b>robarla</b> por la mitad de los puntos.</p></div>' +
      (fama.length ? '<div class="a-card"><h3>🏆 Salón de la fama (este navegador)</h3><table class="a-tabla" style="width:100%"><thead><tr><th>#</th><th>Nombre</th><th>Curso</th><th>Puntos</th><th>Aciertos</th></tr></thead><tbody>' +
        fama.slice(0, 10).map(function (f, i) { return '<tr><td>' + (i + 1) + '</td><td style="text-align:left">' + esc(f.nom) + '</td><td>' + esc(f.curso) + '</td><td>' + f.pts + '</td><td>' + f.ok + '/' + f.n + '</td></tr>'; }).join('') + '</tbody></table></div>' : '') +
      '</div><div id="a-capa"></div>';
    qa('#c-n button').forEach(function (b) { b.addEventListener('click', function () { nEq = Number(b.dataset.n); inicio(); }); });
    q('#c-empezar').addEventListener('click', function () {
      var noms = qa('#c-noms input').map(function (inp, i) { return inp.value.trim() || (nEq === 1 ? 'Jugador/a' : 'Equipo ' + (i + 1)); });
      nueva(noms, q('#c-curso').value);
    });
  }

  function nueva(noms, curso) {
    var usados = {};
    var rondas = RONDAS.map(function (rd) {
      var pool = A.mezclar(BANCO.filter(function (x) { return x.nv === rd.nv && !usados[x.id]; }));
      var n = Math.min(pool.length, noms.length > 1 ? Math.max(rd.preguntas, noms.length) : rd.preguntas);
      var sel = pool.slice(0, n); sel.forEach(function (x) { usados[x.id] = 1; });
      return { nombre: rd.nombre, nv: rd.nv, segundos: rd.segundos, ids: sel.map(function (x) { return x.id; }) };
    });
    C = { id: 'copa-' + Date.now().toString(36) + A.azar(1e4).toString(36), curso: curso, rondas: rondas, ronda: 0, i: 0, k: 0,
      equipos: noms.map(function (n) { return { nom: n, pts: 0, ok: 0, n: 0, racha: 0, mejorRacha: 0, comodin: true }; }) };
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">👩‍💻 Copa Techi</span><span class="a-chip" id="c-ronda"></span><button class="a-btn sm" id="c-salir" type="button">✖ Salir</button></div>' +
      '<div class="c-marcador" id="c-marc"></div><div id="c-mesa"></div></div><div id="a-capa"></div>';
    capa = q('#a-capa');
    q('#c-salir').addEventListener('click', function () { inicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    introRonda();
  }
  var BY_ID = {}; BANCO.forEach(function (x) { BY_ID[x.id] = x; });

  function marcador(activo) {
    var orden = C.equipos.map(function (e, i) { return i; });
    q('#c-marc').innerHTML = orden.map(function (i) {
      var e = C.equipos[i];
      return '<div class="c-eq' + (i === activo ? ' act' : '') + '"><span class="nm">' + (multi() ? TOK[i] + ' ' : '') + esc(e.nom) + '</span><span class="pts">' + e.pts + '</span>' +
        '<span class="det">' + (e.racha >= 2 ? '🔥 ×' + String(mult(e)).replace('.', ',') : '·') + ' ' + (e.comodin ? '⚡' : '<s>⚡</s>') + '</span></div>';
    }).join('');
    var rd = C.rondas[C.ronda];
    q('#c-ronda').classList.toggle('oculto', !rd); q('#c-ronda').textContent = rd ? 'Ronda ' + (C.ronda + 1) + '/' + C.rondas.length + ' · ' + rd.nombre + ' · ' + (Math.min(C.i + 1, rd.ids.length)) + '/' + rd.ids.length : '';
  }

  function introRonda() {
    var rd = C.rondas[C.ronda];
    marcador(-1);
    if (!rd.ids.length) { siguienteRonda(); return; }
    var frases = {
      3: '«Primera ronda: <b>aplicar</b>. Seguir el código, calcular, marcar celdas. ¡A calentar!»',
      4: '«Ahora <b>analizar</b>: encontrar errores, comparar, seguir ciclos anidados. Lee con calma.»',
      5: '«Ronda de <b>evaluar</b>: ya no alcanza con que funcione, hay que decidir cuál solución es mejor y por qué.»',
      6: '«¡La gran final! Aquí se <b>crea</b>: arma algoritmos completos, línea por línea.»'
    };
    q('#c-mesa').innerHTML = '<div class="c-intro"><div class="c-ronda-n">Ronda ' + (C.ronda + 1) + '</div><h2>' + esc(rd.nombre) + '</h2><span class="a-chip ac">N' + rd.nv + ' · ' + A.NIVEL_NOM[rd.nv] + ' · ' + rd.ids.length + ' preguntas · ' + rd.segundos + ' s cada una</span>' +
      A.personaje('techi', frases[rd.nv] || '', rd.nv >= 5 ? 'idea' : 'explicando', 'var(--te)') +
      '<button class="a-btn solid xl" id="c-go" type="button">▶ Empezar la ronda</button></div>';
    q('#c-go').addEventListener('click', pregunta);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function pregunta() {
    var rd = C.rondas[C.ronda], r = BY_ID[rd.ids[C.i]];
    var ti = (C.k) % C.equipos.length, e = C.equipos[ti];
    jugar(r, ti, false);
  }

  /* Juega la pregunta r para el equipo ti (robo = segunda oportunidad de otro equipo) */
  function jugar(r, ti, robo, yaElegida) {
    var rd = C.rondas[C.ronda], e = C.equipos[ti];
    marcador(ti);
    var total = rd.segundos * 1000, ini = Date.now(), doble = false;
    q('#c-mesa').innerHTML = '<div class="a-reto">' +
      '<div class="a-reto-cab">' + (multi() ? '<span class="a-chip ac">' + TOK[ti] + ' ' + esc(e.nom) + (robo ? ' · ¡robo!' : '') + '</span>' : '') + '<span class="a-chip">N' + r.nv + ' · ' + A.NIVEL_NOM[r.nv] + '</span><span class="a-chip">' + A.TEMA[r.tema].ico + ' ' + A.TEMA[r.tema].nom + '</span>' +
      (!robo && e.comodin ? '<button class="a-btn sm" id="c-com" type="button">⚡ Usar comodín (×2)</button>' : '') +
      '<span class="der" id="c-seg"></span></div>' +
      '<div class="c-tiempo"><i id="c-barra"></i></div>' +
      '<div id="c-reto"></div><div id="c-tras"></div></div>';
    var api = A.montarReto(q('#c-reto'), r, { revelar: !multi(), alResponder: function (ok, resp) { parar(); var cb2 = q('#c-com'); if (cb2) cb2.disabled = true; resultado(r, ti, robo, ok, resp, Date.now() - ini, total, doble); } });
    var cb = q('#c-com'); if (cb) cb.addEventListener('click', function () { e.comodin = false; doble = true; cb.disabled = true; cb.textContent = '⚡ ×2 activado'; marcador(ti); });
    parar();
    reloj = setInterval(function () {
      var resta = total - (Date.now() - ini), bar = q('#c-barra'), seg = q('#c-seg');
      if (!bar) { parar(); return; }
      bar.style.width = Math.max(0, resta / total * 100) + '%';
      bar.classList.toggle('poco', resta < 10000);
      seg.textContent = '⏱ ' + Math.max(0, Math.ceil(resta / 1000)) + ' s';
      if (resta <= 0) { parar(); api.bloquear(); }
    }, 200);
  }
  function parar() { if (reloj) clearInterval(reloj); reloj = null; }

  function resultado(r, ti, robo, ok, resp, ms, total, doble) {
    var e = C.equipos[ti], pts = 0;
    e.n++;
    R.registrar(C.id, C.curso, 'copa', e.nom, r, ok, resp, robo ? '[robo] ' : '');
    if (ok) {
      e.ok++; e.racha++; e.mejorRacha = Math.max(e.mejorRacha, e.racha);
      var base = A.puntos(r.nv), bonus = Math.round(base * 0.5 * Math.max(0, (total - ms) / total));
      pts = Math.round((base + bonus) * mult(e) * (doble ? 2 : 1) * (robo ? 0.5 : 1));
      e.pts += pts;
    } else e.racha = 0;
    marcador(ti);
    var tras = q('#c-tras'), corr = A.respuestaCorrecta(r);
    var otros = C.equipos.map(function (x, i) { return i; }).filter(function (i) { return i !== ti; });
    var tiempo = resp === '[tiempo agotado]';
    if (!ok && multi() && !robo) {
      tras.innerHTML = '<div class="a-msg mal"><b class="t">' + (tiempo ? '⏱ ¡Se acabó el tiempo!' : '✘ ¡Incorrecto!') + '</b>¿Algún equipo quiere <b>robar</b> la pregunta? (vale la mitad)</div>' +
        '<div class="a-pie">' + otros.map(function (i) { return '<button class="a-btn" type="button" data-robo="' + i + '">' + TOK[i] + ' ' + esc(C.equipos[i].nom) + ' roba</button>'; }).join('') +
        '<span class="der"><button class="a-btn solid" type="button" id="c-nadie">Nadie: ver la respuesta</button></span></div>';
      qa('[data-robo]').forEach(function (b) { b.addEventListener('click', function () { jugar(r, Number(b.dataset.robo), true); }); });
      q('#c-nadie').addEventListener('click', function () { revelar(r, false, 0, tiempo); });
      return;
    }
    revelar(r, ok, pts, tiempo, e);
  }
  function revelar(r, ok, pts, tiempo, e) {
    var tras = q('#c-tras'), corr = A.respuestaCorrecta(r);
    tras.innerHTML = (ok ? '<div class="a-msg ok"><b class="t">✔ ¡Correcto! +' + pts + ' pts' + (e && e.racha >= 2 ? ' · 🔥 racha de ' + e.racha : '') + '</b>' + esc(r.ex) + '</div>'
      : '<div class="a-msg mal"><b class="t">' + (tiempo ? '⏱ Tiempo agotado' : '✘ No era esa') + '</b>' + (corr ? 'Respuesta: <b>' + esc(corr) + '</b><br>' : '') + esc(r.ex) + '</div>') +
      '<div class="a-pie"><span class="der"><button class="a-btn solid" id="c-sig" type="button">Siguiente →</button></span></div>';
    q('#c-sig').addEventListener('click', avanzar);
    var b = q('#c-sig'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40);
  }
  function avanzar() {
    var rd = C.rondas[C.ronda];
    C.i++; C.k++;
    if (C.i < rd.ids.length) { pregunta(); window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    siguienteRonda();
  }
  function siguienteRonda() {
    R.enviarPendientes();
    C.ronda++; C.i = 0;
    if (C.ronda >= C.rondas.length) { final(); return; }
    var orden = C.equipos.slice().sort(function (a, b) { return b.pts - a.pts; });
    A.modal(capa, '🏁', 'Fin de la ronda ' + C.ronda,
      (multi() ? '<table><thead><tr><th>Equipo</th><th class="num">Puntos</th></tr></thead><tbody>' + orden.map(function (e) { return '<tr><td>' + TOK[C.equipos.indexOf(e)] + ' ' + esc(e.nom) + '</td><td class="num">' + e.pts + '</td></tr>'; }).join('') + '</tbody></table>'
        : '<p>Llevas <b>' + C.equipos[0].pts + ' puntos</b> y ' + C.equipos[0].ok + ' de ' + C.equipos[0].n + ' aciertos.</p>'),
      [['Siguiente ronda →', true, introRonda]]);
  }
  function final() {
    parar();
    var orden = C.equipos.slice().sort(function (a, b) { return b.pts - a.pts; });
    var med = ['🥇', '🥈', '🥉', '4°'];
    if (!multi()) {
      var e = C.equipos[0], fama = R.estado('copa-fama') || [];
      fama.push({ nom: e.nom, curso: C.curso, pts: e.pts, ok: e.ok, n: e.n, fecha: A.ahora() });
      fama.sort(function (a, b) { return b.pts - a.pts; }); R.estado('copa-fama', fama.slice(0, 30));
    }
    var g = orden[0];
    q('#c-mesa').innerHTML = '<div class="c-intro"><div class="c-ronda-n">Copa Techi</div><h2>🏆 ' + (multi() ? '¡' + esc(g.nom) + ' gana la Copa!' : '¡Terminaste la Copa!') + '</h2>' +
      A.personaje('techi', multi() ? '«¡Qué final! Recuerden: lo que importa para el examen es entender por qué cada respuesta es correcta. Repasen las que robaron o fallaron.»' : '«Hiciste ' + g.pts + ' puntos con ' + g.ok + ' de ' + g.n + ' aciertos y una mejor racha de ' + g.mejorRacha + '. ' + (g.ok / Math.max(1, g.n) >= 0.7 ? '¡Estás listo/a para el examen!' : 'Repasa con Gatiel las pruebas de escritorio y vuelve a intentarlo.') + '»', 'saludando', 'var(--te)') +
      '<div class="c-podio">' + orden.map(function (e, i) { return '<div class="p p' + (i + 1) + '"><span class="m">' + med[i] + '</span><b>' + (multi() ? TOK[C.equipos.indexOf(e)] + ' ' : '') + esc(e.nom) + '</b><span>' + e.pts + ' pts</span><small>' + e.ok + '/' + e.n + ' · racha ' + e.mejorRacha + '</small></div>'; }).join('') + '</div>' +
      '<div class="a-pie centro"><button class="a-btn solid" id="c-otra" type="button">Otra Copa</button><a class="a-btn" href="index.html">Volver al arcade</a></div></div>';
    marcador(-1);
    q('#c-otra').addEventListener('click', inicio);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.__copa = { estado: function () { return C; }, banco: BY_ID };
  inicio();
})();
