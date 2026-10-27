/* ═══════════════════════════════════════════
   BATIN · Arcade de 1° — 🤖 La planilla de Bit (juego de territorio)
   · Tablero = una hoja de cálculo (A1:F6).
   · En su turno, cada equipo elige el riesgo: N3 (1 celda) … N6 (4 celdas).
   · Si resuelve el desafío, conquista escribiendo una referencia (C4)
     o un rango (B2:D2, B2:C3). Si lo escribe mal: #¡REF!
   · Desde N5 se pueden tomar celdas de otro equipo (menos las $ fijas).
   · Puntos: 1 por celda · +2 por celda fx · +4 por fila o columna completa.
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR, R = A.registro, esc = A.esc, q = A.q, qa = A.qa;
  var PC = A.CFG.planilla || {};
  var NC = Math.min(26, PC.columnas || 6), NF = PC.filas || 6, RONDAS = PC.rondas || 6;
  var PREMIO = PC.premio || { 3: 1, 4: 2, 5: 3, 6: 4 }, ROBAR = PC.robarDesde || 5;
  var N_FX = PC.celdasFx == null ? 3 : PC.celdasFx, N_FIJAS = PC.celdasFijas == null ? 2 : PC.celdasFijas, BONUS = PC.bonusLinea == null ? 4 : PC.bonusLinea;
  var BANCO = window.AR_BANCO || [];
  var LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, NC).split('');
  var TOK = ['🟣', '🔵', '🟠', '🟢'], COL = ['var(--ga)', 'var(--bi)', 'var(--te)', 'var(--ok)'], INI = ['①', '②', '③', '④'];
  var REF_RETO = { id: 'REF-RANGO', tema: 'excel', nv: 3, sub: 'Escribir referencias y rangos' };
  var P = null, capa = null, reloj = null, bitT = null;
  var modoSel = 'bit', nEq = 2, segSel = PC.segundos || 0;

  function todas() { var a = []; for (var f = 1; f <= NF; f++) LET.forEach(function (c) { a.push(c + f); }); return a; }

  /* ─── Puntaje ─── */
  function lineas(i) {
    var n = 0;
    for (var f = 1; f <= NF; f++) if (LET.every(function (c) { return P.celdas[c + f].d === i; })) n++;
    LET.forEach(function (c) { var ok = true; for (var f = 1; f <= NF; f++) if (P.celdas[c + f].d !== i) ok = false; if (ok) n++; });
    return n;
  }
  function puntaje(i) {
    var cel = 0, fx = 0;
    todas().forEach(function (k) { var x = P.celdas[k]; if (x.d === i) { cel++; if (x.t === 'fx') fx++; } });
    return { cel: cel, fx: fx, lin: lineas(i), pts: cel + 2 * fx + BONUS * lineas(i) };
  }
  function libres() { return todas().filter(function (k) { return P.celdas[k].d == null; }).length; }

  /* ─── Rangos ─── */
  function colN(c) { return LET.indexOf(c); }
  function parsear(txt) {
    var s = String(txt || '').toUpperCase().replace(/\s+/g, '').replace(/^=/, '');
    var m = /^\$?([A-Z])\$?(\d{1,2})(?::\$?([A-Z])\$?(\d{1,2}))?$/.exec(s);
    if (!m) return { err: 'ref', s: s };
    var c1 = colN(m[1]), f1 = Number(m[2]), c2 = m[3] ? colN(m[3]) : c1, f2 = m[4] ? Number(m[4]) : f1;
    if (c1 < 0 || c2 < 0 || f1 < 1 || f2 < 1 || f1 > NF || f2 > NF) return { err: 'fuera', s: s };
    var cs = [], a = Math.min(c1, c2), b = Math.max(c1, c2), x = Math.min(f1, f2), y = Math.max(f1, f2);
    for (var f = x; f <= y; f++) for (var c = a; c <= b; c++) cs.push(LET[c] + f);
    return { celdas: cs, s: s, rango: !!m[3] };
  }
  function nombreRango(cs) {
    if (cs.length === 1) return cs[0];
    return cs[0] + ':' + cs[cs.length - 1];
  }
  /* ¿Qué pasaría si el equipo i toma estas celdas con nivel nv? */
  function evaluar(i, cs, nv) {
    var max = PREMIO[nv] || 1, prob = null, gana = 0;
    if (cs.length > max) return { err: 'valor', msg: 'El rango tiene ' + cs.length + ' celdas y tu premio es de ' + max + '.' };
    cs.forEach(function (k) {
      var x = P.celdas[k];
      if (x.d == null) { gana++; return; }
      if (x.d === i) return;
      if (x.t === 'fijo') prob = prob || { err: 'na', msg: k + ' es una celda fija ($) de ' + P.equipos[x.d].nom + ': no se puede robar.' };
      else if (nv < ROBAR) prob = prob || { err: 'na', msg: k + ' ya es de ' + P.equipos[x.d].nom + '. Para robar celdas hace falta un desafío N' + ROBAR + ' o más.' };
      else gana++;
    });
    if (prob) return prob;
    if (!gana) return { err: 'nulo', msg: 'Todas esas celdas ya son tuyas: no ganarías nada.' };
    return { ok: true, gana: gana };
  }

  /* ─── Inicio ─── */
  function inicio() {
    parar(); if (bitT) clearTimeout(bitT); P = null;
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-kicker">// Arcade de 1° · juego de territorio</div>' +
      '<h1 class="a-h1">🤖 La planilla de Bit</h1>' +
      A.personaje('bit', '«Esta hoja de cálculo es un territorio: <b>A1:' + LET[NC - 1] + NF + '</b>. En tu turno eliges cuánto arriesgas: un desafío N3 te deja tomar 1 celda; uno N6, ¡un rango de 4! Pero ojo: para conquistar tienes que <b>escribir la referencia o el rango como en Excel</b> (C4, B2:D2, B2:C3). Si lo escribes mal, te sale <b>#¡REF!</b> y yo me río un poquito.»', 'accion', 'var(--bi)') +
      '<div class="a-card"><h3>Nueva partida</h3>' +
        '<div class="a-fila" style="margin-bottom:12px"><div class="a-seg" id="p-modo"><button type="button" data-m="bit"' + (modoSel === 'bit' ? ' class="act"' : '') + '>🤖 Contra Bit</button><button type="button" data-m="eq"' + (modoSel === 'eq' ? ' class="act"' : '') + '>👥 Entre equipos</button></div>' +
        (modoSel === 'eq' ? '<div class="a-seg" id="p-n">' + [2, 3, 4].map(function (n) { return '<button type="button" data-n="' + n + '"' + (n === nEq ? ' class="act"' : '') + '>' + n + ' equipos</button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="a-fila" id="p-noms">' + A.indices(modoSel === 'bit' ? 1 : nEq).map(function (i) { return '<label class="a-campo">' + (modoSel === 'bit' ? 'Tu nombre o el del equipo' : TOK[i] + ' Equipo ' + (i + 1)) + '<input type="text" maxlength="30" data-eq="' + i + '"></label>'; }).join('') + '</div>' +
        '<div class="a-fila" style="margin-top:12px"><label class="a-campo">Curso' + A.selectorCursos('p-curso') + '</label>' +
        '<label class="a-campo">⏱️ Tiempo por desafío<select id="p-seg">' + [[0, 'Sin límite'], [120, '2 minutos'], [90, '90 segundos'], [60, '60 segundos']].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === segSel ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
        '<button class="a-btn solid xl" id="p-empezar" type="button">📊 Abrir la planilla</button></div></div>' +
      '<div class="a-card"><h3>Reglas</h3><div class="p-reglas">' +
        '<div><b>🎚️ Elige el riesgo</b>N3 → 1 celda · N4 → hasta 2 · N5 → hasta 3 · N6 → hasta 4. Desde N' + ROBAR + ' puedes tomar celdas de otro equipo.</div>' +
        '<div><b>✍️ Escribe para conquistar</b>Una celda (<code>C4</code>) o un rango (<code>B2:D2</code>, <code>B2:C3</code>). Un error de escritura da <code>#¡REF!</code>: tienes una segunda oportunidad y, si vuelves a fallar, pierdes la jugada.</div>' +
        '<div><b>🏅 Puntos</b>1 por celda · <span class="p-mini fx">fx</span> +2 · fila o columna completa +' + BONUS + ' · <span class="p-mini fijo">$</span> la celda fija no se puede robar.</div>' +
        '<div><b>⏳ Final</b>' + RONDAS + ' jugadas por equipo o hasta que no quede ninguna celda libre.</div>' +
      '</div></div>' +
      '</div><div id="a-capa"></div>';
    qa('#p-modo button').forEach(function (b) { b.addEventListener('click', function () { modoSel = b.dataset.m; inicio(); }); });
    qa('#p-n button').forEach(function (b) { b.addEventListener('click', function () { nEq = Number(b.dataset.n); inicio(); }); });
    q('#p-empezar').addEventListener('click', function () {
      segSel = Number(q('#p-seg').value) || 0;
      var noms = qa('#p-noms input').map(function (inp, i) { return inp.value.trim() || (modoSel === 'bit' ? 'Jugador/a' : 'Equipo ' + (i + 1)); });
      if (modoSel === 'bit') noms.push('Bit');
      nueva(noms, q('#p-curso').value);
    });
  }
  function nueva(noms, curso) {
    var celdas = {}, ks = A.mezclar(todas());
    todas().forEach(function (k) { celdas[k] = { d: null, t: '' }; });
    ks.slice(0, N_FX).forEach(function (k) { celdas[k].t = 'fx'; });
    ks.slice(N_FX, N_FX + N_FIJAS).forEach(function (k) { celdas[k].t = 'fijo'; });
    P = { id: 'plan-' + Date.now().toString(36) + A.azar(1e4).toString(36), curso: curso, seg: segSel, celdas: celdas, turno: 0, jugadas: 0, fin: false, ultima: [],
      equipos: noms.map(function (n, i) { return { nom: n, cpu: modoSel === 'bit' && i === noms.length - 1, ok: 0, n: 0, refOk: 0, refN: 0, vistos: {}, temaUlt: '' }; }) };
    pantalla(); turno();
  }

  /* ─── Pantalla ─── */
  function pantalla() {
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">🤖 La planilla de Bit</span><span class="a-chip" id="p-ronda"></span><button class="a-btn sm" id="p-salir" type="button">✖ Salir</button></div>' +
      '<div class="p-marc" id="p-marc"></div>' +
      '<div class="p-grid"><div class="p-hoja-wrap" id="p-hoja"></div><div class="p-mesa" id="p-mesa"></div></div>' +
      '</div><div id="a-capa"></div>';
    capa = q('#a-capa');
    q('#p-salir').addEventListener('click', function () {
      A.modal(capa, '✖', '¿Salir de la partida?', '<p>La partida no se guarda. Las respuestas ya quedaron registradas para el panel.</p>', [['Sí, salir', true, function () { parar(); if (bitT) clearTimeout(bitT); inicio(); window.scrollTo({ top: 0, behavior: 'instant' }); }], ['Seguir jugando', false, null]]);
    });
  }
  function pintar(resaltar, preview) {
    var hl = {}, pv = {};
    (resaltar || P.ultima || []).forEach(function (k) { hl[k] = 1; });
    (preview || []).forEach(function (k) { pv[k] = 1; });
    var h = '<div class="p-hoja" style="grid-template-columns: 34px repeat(' + NC + ', minmax(0, 1fr))"><span class="p-esq"></span>';
    LET.forEach(function (c) { h += '<span class="p-col">' + c + '</span>'; });
    for (var f = 1; f <= NF; f++) {
      h += '<span class="p-fil">' + f + '</span>';
      LET.forEach(function (c) {
        var k = c + f, x = P.celdas[k], cls = 'p-cel', est = '';
        if (x.d != null) { cls += ' tomada'; est = '--pc:' + COL[x.d]; }
        if (x.t) cls += ' ' + x.t;
        if (hl[k]) cls += ' nueva';
        if (pv[k]) cls += ' prev';
        h += '<span class="' + cls + '"' + (est ? ' style="' + est + '"' : '') + ' aria-label="' + (x.d != null ? 'de ' + esc(P.equipos[x.d].nom) : 'libre') + (x.t === 'fx' ? ', fx' : x.t === 'fijo' ? ', fija' : '') + '">' +
          (x.t === 'fx' ? '<i class="m">fx</i>' : x.t === 'fijo' ? '<i class="m">$</i>' : '') + (x.d != null ? '<b>' + INI[x.d] + '</b>' : '') + '</span>';
      });
    }
    q('#p-hoja').innerHTML = h + '</div><div class="a-ayuda">' + LET[0] + '1:' + LET[NC - 1] + NF + ' · <span class="p-mini fx">fx</span> +2 puntos · <span class="p-mini fijo">$</span> fija: no se puede robar · ' + libres() + ' celdas libres</div>';
    q('#p-marc').innerHTML = P.equipos.map(function (e, i) {
      var s = puntaje(i);
      return '<div class="p-eq' + (i === P.turno && !P.fin ? ' act' : '') + '" style="--pc:' + COL[i] + '"><span class="tk">' + INI[i] + '</span><span class="nm">' + (e.cpu ? '🤖 ' : TOK[i] + ' ') + esc(e.nom) + '</span><span class="pts">' + s.pts + '</span>' +
        '<span class="det">' + s.cel + ' celdas · ' + s.fx + ' fx · ' + s.lin + ' líneas' + (e.cpu ? '' : ' · ✍️ ' + e.refOk + '/' + e.refN) + '</span></div>';
    }).join('');
    var r = Math.min(RONDAS, Math.floor(P.jugadas / P.equipos.length) + 1);
    q('#p-ronda').textContent = P.fin ? 'Partida terminada' : '🔁 Ronda ' + r + ' de ' + RONDAS;
  }
  function parar() { if (reloj) clearInterval(reloj); reloj = null; }

  /* ─── Turno ─── */
  function turno() {
    parar();
    if (P.jugadas >= RONDAS * P.equipos.length || libres() === 0) { final(); return; }
    var e = P.equipos[P.turno];
    pintar();
    if (e.cpu) { turnoBit(); return; }
    var m = q('#p-mesa');
    var puedeRobar = todas().some(function (k) { var x = P.celdas[k]; return x.d != null && x.d !== P.turno && x.t !== 'fijo'; });
    m.innerHTML = '<div class="p-turno" style="--pc:' + COL[P.turno] + '">' + TOK[P.turno] + ' Turno de <b>' + esc(e.nom) + '</b></div>' +
      A.personaje('bit', '¿Cuánto arriesgas? Mientras más alto el nivel, más grande el rango que puedes conquistar.', 'idea', 'var(--bi)') +
      '<div class="p-niveles">' + [3, 4, 5, 6].map(function (nv) {
        return '<button type="button" class="p-nv" data-nv="' + nv + '"><span class="n">N' + nv + '</span><span class="l">' + A.NIVEL_NOM[nv] + '</span><span class="g">' + (PREMIO[nv] === 1 ? '1 celda' : 'hasta ' + PREMIO[nv] + ' celdas') + (nv >= ROBAR ? (puedeRobar ? ' · 🏴‍☠️ puede robar' : ' · puede robar') : '') + '</span></button>';
      }).join('') + '</div>';
    qa('.p-nv', m).forEach(function (b) { b.addEventListener('click', function () { desafio(Number(b.dataset.nv)); }); });
  }
  function elegirReto(e, nv) {
    var pool = BANCO.filter(function (x) { return x.nv === nv; });
    if (!pool.length) pool = BANCO;
    var min = Math.min.apply(null, pool.map(function (x) { return e.vistos[x.id] || 0; }));
    var cand = pool.filter(function (x) { return (e.vistos[x.id] || 0) === min; });
    var otro = cand.filter(function (x) { return x.tema !== e.temaUlt; });
    if (otro.length) cand = otro;
    var r = cand[A.azar(cand.length)]; e.vistos[r.id] = (e.vistos[r.id] || 0) + 1; e.temaUlt = r.tema;
    return r;
  }
  function desafio(nv) {
    var e = P.equipos[P.turno], r = elegirReto(e, nv), m = q('#p-mesa');
    m.innerHTML = '<div class="p-turno" style="--pc:' + COL[P.turno] + '">' + TOK[P.turno] + ' <b>' + esc(e.nom) + '</b> <span class="a-chip ac">N' + nv + ' · ' + A.NIVEL_NOM[nv] + '</span><span class="a-chip">' + A.TEMA[r.tema].ico + ' ' + A.TEMA[r.tema].nom + '</span><span class="a-chip">🏁 premio: ' + (PREMIO[nv] === 1 ? '1 celda' : 'hasta ' + PREMIO[nv]) + '</span></div>' +
      (P.seg ? '<div class="c-tiempo"><i id="p-barra"></i></div>' : '') +
      '<div class="a-reto"><div id="p-reto"></div><div id="p-tras"></div></div>';
    var api = A.montarReto(q('#p-reto'), r, { revelar: true, alResponder: function (ok, resp) {
      parar();
      e.n++; if (ok) e.ok++;
      R.registrar(P.id, P.curso, 'planilla', e.nom, r, ok, resp);
      var corr = A.respuestaCorrecta(r);
      q('#p-tras').innerHTML = (ok ? '<div class="a-msg ok"><b class="t">✔ ¡Correcto! Ahora conquista hasta ' + PREMIO[nv] + ' celda' + (PREMIO[nv] > 1 ? 's' : '') + '</b>' + esc(r.ex) + '</div>'
        : '<div class="a-msg mal"><b class="t">✘ No es correcto: esta vez no conquistas</b>' + (corr ? 'Respuesta: <b>' + esc(corr) + '</b><br>' : '') + esc(r.ex) + '</div>') +
        '<div class="a-pie"><span class="der"><button class="a-btn solid" id="p-seguir" type="button">' + (ok ? '✍️ Escribir mi rango' : 'Pasar el turno →') + '</button></span></div>';
      q('#p-seguir').addEventListener('click', function () { if (ok) conquistar(nv, 0); else siguiente(); });
      var b = q('#p-seguir'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40);
    } });
    if (P.seg) {
      var ini = Date.now(), tot = P.seg * 1000;
      reloj = setInterval(function () {
        var resta = tot - (Date.now() - ini), b = q('#p-barra');
        if (b) { b.style.width = Math.max(0, 100 * resta / tot) + '%'; b.classList.toggle('poco', resta < 15000); }
        if (resta <= 0) { parar(); api.bloquear(); }
      }, 200);
    }
  }

  /* ─── Escribir el rango ─── */
  function conquistar(nv, intentosRef) {
    var e = P.equipos[P.turno], m = q('#p-mesa'), max = PREMIO[nv];
    pintar([]);
    m.innerHTML = '<div class="p-turno" style="--pc:' + COL[P.turno] + '">' + TOK[P.turno] + ' <b>' + esc(e.nom) + '</b> conquista <span class="a-chip ac">hasta ' + max + ' celda' + (max > 1 ? 's' : '') + '</span>' + (nv >= ROBAR ? '<span class="a-chip">🏴‍☠️ puede robar</span>' : '') + '</div>' +
      A.personaje('bit', intentosRef ? '«Segunda oportunidad. Recuerda: <b>letra de columna + número de fila</b>, y un rango se escribe con <b>dos puntos</b> entre la primera y la última celda.»' : 'Mira la hoja y escribe <b>una referencia</b> (como <code>D3</code>) o <b>un rango</b> (como <code>B2:B' + Math.min(NF, 1 + max) + '</code>). Puede ser una fila, una columna o un rectángulo.', intentosRef ? 'explicando' : 'idea', 'var(--bi)') +
      '<div class="p-escribir"><span class="eq">=</span><input id="p-rango" type="text" autocomplete="off" spellcheck="false" placeholder="B2:C3" aria-label="Referencia o rango a conquistar"><button class="a-btn solid" id="p-tomar" type="button">📥 Tomar</button></div>' +
      '<div id="p-err"></div>';
    var inp = q('#p-rango'); inp.focus();
    function tomar() {
      var v = inp.value.trim(); if (!v) { inp.focus(); return; }
      var pr = parsear(v);
      if (pr.err) {
        e.refN++;
        R.registrar(P.id, P.curso, 'planilla', e.nom, REF_RETO, false, v);
        var expl = pr.err === 'fuera' ? 'Esa celda no existe en esta hoja: las columnas van de ' + LET[0] + ' a ' + LET[NC - 1] + ' y las filas de 1 a ' + NF + '.'
          : 'Así no se escribe una referencia. Primero la LETRA de la columna y después el NÚMERO de la fila (B3, no 3B). Para un rango, dos puntos entre la primera y la última celda: B2:D2 (no B2-D2, ni B2;D2).';
        if (intentosRef >= 1) {
          A.modal(capa, '💥', '#¡REF!', '<p>Escribiste <code>' + esc(v) + '</code>.</p><p>' + expl + '</p><p><b>Perdiste la jugada.</b></p>', [['Pasar el turno', true, siguiente]]);
        } else {
          A.modal(capa, '⚠️', '#¡REF!', '<p>Escribiste <code>' + esc(v) + '</code>.</p><p>' + expl + '</p><p>Bit te da <b>una segunda oportunidad</b>.</p>', [['Intentar de nuevo', true, function () { conquistar(nv, 1); }]]);
        }
        return;
      }
      var ev = evaluar(P.turno, pr.celdas, nv);
      if (ev.err) {
        var cod = { valor: '#¡VALOR!', na: '#N/A', nulo: '#¡NULO!' }[ev.err];
        pintar([], pr.celdas);
        q('#p-err').innerHTML = '<div class="a-msg mal"><b class="t">' + cod + '</b>' + esc(ev.msg) + ' Elige otro rango.</div>';
        inp.select();
        return;
      }
      e.refN++; e.refOk++;
      R.registrar(P.id, P.curso, 'planilla', e.nom, REF_RETO, true, v);
      var antes = puntaje(P.turno).pts, robadas = [];
      pr.celdas.forEach(function (k) { var x = P.celdas[k]; if (x.d != null && x.d !== P.turno) robadas.push(k); x.d = P.turno; });
      P.ultima = pr.celdas;
      var desp = puntaje(P.turno);
      pintar();
      A.modal(capa, '📥', '=' + pr.s, '<p><b>' + esc(e.nom) + '</b> conquista ' + pr.celdas.length + ' celda' + (pr.celdas.length > 1 ? 's' : '') + ': ' + pr.celdas.join(', ') + '.</p>' +
        (robadas.length ? '<p>🏴‍☠️ Robó ' + robadas.join(', ') + '.</p>' : '') +
        '<p>Puntos: ' + antes + ' → <b>' + desp.pts + '</b>' + (desp.lin ? ' · ' + desp.lin + ' línea' + (desp.lin > 1 ? 's' : '') + ' completa' + (desp.lin > 1 ? 's' : '') : '') + '</p>',
        [['Seguir', true, siguiente]]);
    }
    q('#p-tomar').addEventListener('click', tomar);
    inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tomar(); } });
    inp.addEventListener('input', function () { q('#p-err').innerHTML = ''; });
  }
  function siguiente() {
    P.jugadas++; P.turno = (P.turno + 1) % P.equipos.length;
    turno();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ─── Bit juega ─── */
  function mejorJugada(i, nv) {
    var mejor = [], mejorV = -1, max = PREMIO[nv];
    for (var c1 = 0; c1 < NC; c1++) for (var f1 = 1; f1 <= NF; f1++)
      for (var w = 1; w <= max; w++) for (var hh = 1; hh * w <= max; hh++) {
        if (c1 + w > NC || f1 + hh - 1 > NF) continue;
        var cs = []; for (var f = f1; f < f1 + hh; f++) for (var c = c1; c < c1 + w; c++) cs.push(LET[c] + f);
        if (evaluar(i, cs, nv).err) continue;
        var antes = puntaje(i).pts, guard = cs.map(function (k) { return P.celdas[k].d; });
        var rivales = P.equipos.map(function (x, j) { return j === i ? 0 : puntaje(j).pts; });
        cs.forEach(function (k) { P.celdas[k].d = i; });
        var v = puntaje(i).pts - antes + P.equipos.reduce(function (a, x, j) { return j === i ? a : a + (rivales[j] - puntaje(j).pts); }, 0);
        cs.forEach(function (k, n) { P.celdas[k].d = guard[n]; });
        v += Math.random() * 0.5;
        if (v > mejorV) { mejorV = v; mejor = cs; }
      }
    return mejor;
  }
  function turnoBit() {
    var i = P.turno, bit = P.equipos[i], m = q('#p-mesa');
    var nv = [4, 4, 5, 3, 6, 5][A.azar(6)];
    var prob = (PC.aciertoBit || 0.7) + (nv === 3 ? 0.15 : nv === 4 ? 0.05 : nv === 5 ? -0.05 : -0.15);
    m.innerHTML = '<div class="p-turno" style="--pc:' + COL[i] + '">🤖 Turno de Bit <span class="a-chip ac">elige N' + nv + '</span></div>' + A.personaje('bit', '«Arriesgo N' + nv + '… resolviendo el desafío…» 🤔', 'trabajando', 'var(--bi)');
    bitT = setTimeout(function () {
      if (Math.random() > prob) {
        m.innerHTML = '<div class="p-turno" style="--pc:' + COL[i] + '">🤖 Turno de Bit</div>' + A.personaje('bit', '«¡Fallé el desafío N' + nv + '! Hasta los robots se equivocan. Te toca.»', 'explicando', 'var(--bi)') +
          '<div class="a-pie"><span class="der"><button class="a-btn solid" id="p-yo" type="button">Mi turno →</button></span></div>';
        q('#p-yo').addEventListener('click', siguiente);
        return;
      }
      var cs = mejorJugada(i, nv);
      if (!cs.length) { siguiente(); return; }
      var robadas = cs.filter(function (k) { return P.celdas[k].d != null && P.celdas[k].d !== i; });
      cs.forEach(function (k) { P.celdas[k].d = i; });
      P.ultima = cs;
      pintar();
      var rg = nombreRango(cs);
      m.innerHTML = '<div class="p-turno" style="--pc:' + COL[i] + '">🤖 Turno de Bit</div>' +
        A.personaje('bit', '«Resolví el N' + nv + ' y escribo <code class="p-code">=' + rg + '</code>' + (cs.length > 1 ? ': son ' + cs.length + ' celdas, de ' + cs[0] + ' a ' + cs[cs.length - 1] : '') + '.' + (robadas.length ? ' ¡Y te robo ' + robadas.join(', ') + '! 🏴‍☠️' : '') + '»', 'ok', 'var(--bi)') +
        '<div class="a-pie"><span class="der"><button class="a-btn solid" id="p-yo" type="button">Mi turno →</button></span></div>';
      q('#p-yo').addEventListener('click', siguiente);
    }, 1100);
  }

  /* ─── Final ─── */
  function final() {
    P.fin = true; parar(); R.enviarPendientes();
    P.ultima = []; pintar();
    var orden = P.equipos.map(function (e, i) { return { e: e, i: i, s: puntaje(i) }; }).sort(function (a, b) { return b.s.pts - a.s.pts; });
    var g = orden[0], empate = orden.length > 1 && orden[1].s.pts === g.s.pts;
    var tit = empate ? '¡Empate!' : g.e.cpu ? '¡Ganó Bit!' : '¡' + g.e.nom + ' domina la planilla!';
    A.modal(capa, empate ? '🤝' : g.e.cpu ? '🤖' : '🏆', tit,
      A.personaje('bit', g.e.cpu ? '«Esta vez la planilla es mía. Pero mira la columna ✍️: cada rango bien escrito es un punto a tu favor en el examen. ¡Revancha!»' : '«¡Bien jugado! Rangos limpios, sin un solo #¡REF! de más. Así se trabaja en Excel.»', g.e.cpu ? 'ok' : 'saludando', 'var(--bi)') +
      '<table><thead><tr><th>Equipo</th><th class="num">Celdas</th><th class="num">fx</th><th class="num">Líneas</th><th class="num">Desafíos</th><th class="num">Rangos ✍️</th><th class="num">Puntos</th></tr></thead><tbody>' +
      orden.map(function (o) { return '<tr><td>' + INI[o.i] + ' ' + esc(o.e.nom) + '</td><td class="num">' + o.s.cel + '</td><td class="num">' + o.s.fx + '</td><td class="num">' + o.s.lin + '</td><td class="num">' + (o.e.cpu ? '—' : o.e.ok + '/' + o.e.n) + '</td><td class="num">' + (o.e.cpu ? '—' : o.e.refOk + '/' + o.e.refN) + '</td><td class="num"><b>' + o.s.pts + '</b></td></tr>'; }).join('') +
      '</tbody></table>',
      [['Otra partida', true, inicio], ['Ver la planilla', false, null]]);
    q('#p-mesa').innerHTML = '<div class="a-pie"><button class="a-btn solid" type="button" id="p-otra">Otra partida</button></div>';
    q('#p-otra').addEventListener('click', inicio);
  }

  window.__plan = { estado: function () { return P; }, parsear: parsear, evaluar: evaluar, puntaje: puntaje };
  inicio();
})();
