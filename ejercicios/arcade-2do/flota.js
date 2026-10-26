/* ═══════════════════════════════════════════
   BATIN · Arcade de 2° — 🤖 La flota de Bit (batalla naval de matrices)
   · Cada desafío resuelto = 1 disparo (2 si es N5 o N6).
   · Para disparar hay que escribir la celda: tablero[f,c] en PSeInt
     (desde 1) o tablero[f][c] en Python (desde 0).
   · Los desafíos suben de nivel cada N aciertos.
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR, R = A.registro, esc = A.esc, q = A.q, qa = A.qa;
  var FC = A.CFG.flota || {};
  var N = FC.tamano || 6, BARCOS = FC.barcos || [3, 2, 2, 1], SUBIR = FC.subirNivelCada || 3;
  var BANCO = window.AR_BANCO || [];
  var F = null, capa = null, bitT = null;

  /* ─── Tableros ─── */
  function colocar() {
    for (var intento = 0; intento < 500; intento++) {
      var ocup = {}, barcos = [], fallo = false;
      for (var b = 0; b < BARCOS.length && !fallo; b++) {
        var L = BARCOS[b], puesto = false;
        for (var t = 0; t < 100 && !puesto; t++) {
          var hor = Math.random() < 0.5, f = 1 + A.azar(hor ? N : N - L + 1), c = 1 + A.azar(hor ? N - L + 1 : N), celdas = [];
          for (var k = 0; k < L; k++) celdas.push(hor ? [f, c + k] : [f + k, c]);
          var choca = celdas.some(function (p) { for (var df = -1; df <= 1; df++) for (var dc = -1; dc <= 1; dc++) if (ocup[(p[0] + df) + ',' + (p[1] + dc)]) return true; return false; });
          if (!choca) { celdas.forEach(function (p) { ocup[p[0] + ',' + p[1]] = 1; }); barcos.push(celdas.map(function (p) { return p[0] + ',' + p[1]; })); puesto = true; }
        }
        if (!puesto) fallo = true;
      }
      if (!fallo) return barcos;
    }
    return [['1,1', '1,2', '1,3'], ['3,1', '4,1'], ['6,5', '6,6'], ['4,4']];
  }
  function barcoDe(eq, k) { for (var i = 0; i < eq.barcos.length; i++) if (eq.barcos[i].indexOf(k) >= 0) return i; return -1; }
  function hundido(eq, i) { return eq.barcos[i].every(function (k) { return eq.tiros[k] === 'tocado'; }); }
  function restantes(eq) { return eq.barcos.reduce(function (a, b) { return a + b.filter(function (k) { return eq.tiros[k] !== 'tocado'; }).length; }, 0); }
  function nivel(eq) { return Math.min(6, 3 + Math.floor(eq.aciertos / SUBIR)); }
  function notacion(f, c, modo) { return modo === 'py' ? 'tablero[' + (f - 1) + '][' + (c - 1) + ']' : 'tablero[' + f + ',' + c + ']'; }

  /* ─── Inicio ─── */
  var modoSel = 'bit';
  function inicio() {
    F = null; if (bitT) clearTimeout(bitT);
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-kicker">// Arcade de 2° · batalla naval de matrices</div>' +
      '<h1 class="a-h1">🤖 La flota de Bit</h1>' +
      A.personaje('bit', '«Escondí mi flota en un tablero de ' + N + '×' + N + '. ¡Es una matriz! Para dispararme, primero resuelve un desafío. Después escribe la celda como en el código: <b>tablero[f,c]</b> si te toca PSeInt (se cuenta desde 1) o <b>tablero[f][c]</b> si te toca Python (se cuenta desde 0). Si te equivocas de índice… ¡el disparo se desvía!»', 'accion', 'var(--bi)') +
      '<div class="a-card"><h3>Nueva batalla</h3>' +
        '<div class="a-fila" style="margin-bottom:12px"><div class="a-seg" id="f-modo"><button type="button" data-m="bit"' + (modoSel === 'bit' ? ' class="act"' : '') + '>🤖 Contra Bit</button><button type="button" data-m="2"' + (modoSel === '2' ? ' class="act"' : '') + '>👥 Equipo contra equipo</button></div></div>' +
        '<div class="a-fila"><label class="a-campo">' + (modoSel === 'bit' ? 'Tu nombre o el del equipo' : 'Equipo 1') + '<input type="text" id="f-n1" maxlength="30"></label>' +
        (modoSel === '2' ? '<label class="a-campo">Equipo 2<input type="text" id="f-n2" maxlength="30"></label>' : '') +
        '<label class="a-campo">Curso' + A.selectorCursos('f-curso') + '</label>' +
        '<button class="a-btn solid" id="f-empezar" type="button">⚓ Zarpar</button></div></div>' +
      '<div class="a-card"><h3>Reglas</h3><p style="margin:0;line-height:1.7;color:var(--texto2)">🎯 Desafío correcto = 1 disparo · N5 o N6 = <b>2 disparos</b>. ✘ Si fallas, pierdes el turno. 📈 Cada ' + SUBIR + ' aciertos, los desafíos suben de nivel (N3 → N4 → N5 → N6). 🚢 Barcos: ' + BARCOS.join(', ') + ' casillas. Gana quien hunde primero toda la flota enemiga.</p></div>' +
      '</div><div id="a-capa"></div>';
    qa('#f-modo button').forEach(function (b) { b.addEventListener('click', function () { modoSel = b.dataset.m; inicio(); }); });
    q('#f-empezar').addEventListener('click', function () {
      var n1 = q('#f-n1').value.trim() || (modoSel === 'bit' ? 'Capitán/a' : 'Equipo 1');
      var n2 = modoSel === '2' ? (q('#f-n2').value.trim() || 'Equipo 2') : 'Bit';
      nueva(modoSel, n1, n2, q('#f-curso').value);
    });
  }
  function nueva(modo, n1, n2, curso) {
    function eq(nom, cpu) { return { nom: nom, cpu: !!cpu, barcos: colocar(), tiros: {}, aciertos: 0, n: 0, disparos: 0, precisos: 0, vistos: {} }; }
    F = { id: 'flota-' + Date.now().toString(36) + A.azar(1e4).toString(36), modo: modo, curso: curso, equipos: [eq(n1), eq(n2, modo === 'bit')], turno: 0, fase: 'reto', tirosQuedan: 0, reto: null, log: [], fin: false };
    pantalla();
    nuevoTurno();
  }

  /* ─── Pantalla ─── */
  function pantalla() {
    raiz.innerHTML = '<div class="a-wrap">' +
      '<div class="a-hud"><span class="tit">🤖 La flota de Bit</span><span class="a-chip" id="f-marcador"></span><button class="a-btn sm" id="f-salir" type="button">✖ Salir</button></div>' +
      '<div class="f-grid"><div class="f-mares" id="f-mares"></div><div class="f-mesa" id="f-mesa"></div></div>' +
      '</div><div id="a-capa"></div>';
    capa = q('#a-capa');
    q('#f-salir').addEventListener('click', function () { if (bitT) clearTimeout(bitT); inicio(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  }
  function rival(i) { return F.equipos[1 - i]; }
  function pintarMares() {
    var act = F.equipos[F.turno], html = '';
    var orden = F.modo === 'bit' ? [1, 0] : [1 - F.turno, F.turno];
    orden.forEach(function (i) {
      var e = F.equipos[i], propio = F.modo === 'bit' && i === 0;
      var objetivo = !F.fin && !act.cpu && i !== F.turno && F.fase === 'disparo';
      html += '<div class="f-mar' + (objetivo ? ' objetivo' : '') + (propio ? ' propio' : '') + '"><div class="f-mar-tit">' + (propio ? '🛡️ Tu flota' : '🌊 Mar de ' + esc(e.nom)) +
        ' <span>· ' + restantes(e) + ' casillas de barco a flote</span></div>' +
        '<div class="f-tab" style="grid-template-columns: auto repeat(' + N + ', minmax(0, 1fr))"><span></span>';
      for (var c = 1; c <= N; c++) html += '<span class="ix">' + c + '</span>';
      for (var f = 1; f <= N; f++) {
        html += '<span class="ix">' + f + '</span>';
        for (var c2 = 1; c2 <= N; c2++) {
          var k = f + ',' + c2, t = e.tiros[k], b = barcoDe(e, k), cls = '', cont = '';
          if (t === 'agua') { cls = 'agua'; cont = '•'; }
          else if (t === 'tocado') { cls = hundido(e, b) ? 'hundido' : 'tocado'; cont = hundido(e, b) ? '☠' : '✹'; }
          else if ((propio || F.fin) && b >= 0) { cls = 'barco'; }
          var puede = objetivo && !t;
          html += '<button type="button" class="f-cel ' + cls + '"' + (puede ? ' data-tiro="' + k + '"' : ' disabled') + ' aria-label="Fila ' + f + ', columna ' + c2 + (t ? ', ' + t : '') + '">' + cont + '</button>';
        }
      }
      html += '</div></div>';
    });
    q('#f-mares').innerHTML = html;
    qa('[data-tiro]').forEach(function (b) { b.addEventListener('click', function () { pedirNotacion(b.dataset.tiro); }); });
    q('#f-marcador').textContent = F.equipos.map(function (e) { return e.nom + ': ' + (BARCOS.reduce(function (a, b) { return a + b; }, 0) - restantes(rival(F.equipos.indexOf(e)))) + ' ✹'; }).join(' · ');
  }

  /* ─── Turno ─── */
  function nuevoTurno() {
    var e = F.equipos[F.turno];
    pintarMares();
    if (e.cpu) { turnoBit(); return; }
    var nv = nivel(e);
    var pool = BANCO.filter(function (x) { return x.nv === nv; });
    if (!pool.length) pool = BANCO;
    var min = Math.min.apply(null, pool.map(function (x) { return e.vistos[x.id] || 0; }));
    var cand = pool.filter(function (x) { return (e.vistos[x.id] || 0) === min; });
    var r = cand[A.azar(cand.length)]; e.vistos[r.id] = (e.vistos[r.id] || 0) + 1;
    F.reto = r; F.fase = 'reto';
    var m = q('#f-mesa');
    var tiros = nv >= 5 ? 2 : 1;
    m.innerHTML = '<div class="f-turno">' + (F.modo === '2' ? '🎮 Turno de <b>' + esc(e.nom) + '</b>' : '🎮 Tu turno') + ' <span class="a-chip ac">N' + nv + ' · ' + A.NIVEL_NOM[nv] + '</span><span class="a-chip">' + A.TEMA[r.tema].ico + ' ' + A.TEMA[r.tema].nom + '</span><span class="a-chip">🎯 premio: ' + tiros + ' disparo' + (tiros > 1 ? 's' : '') + '</span></div>' +
      '<div class="a-reto"><div id="f-reto"></div><div id="f-tras"></div></div>';
    A.montarReto(q('#f-reto'), r, { revelar: true, alResponder: function (ok, resp) {
      e.n++; if (ok) e.aciertos++;
      R.registrar(F.id, F.curso, 'flota', e.nom, r, ok, resp);
      var corr = A.respuestaCorrecta(r);
      var subio = ok && e.aciertos % SUBIR === 0 && nivel(e) <= 6 && e.aciertos > 0 && nivel(e) !== nv;
      q('#f-tras').innerHTML = (ok ? '<div class="a-msg ok"><b class="t">✔ ¡Correcto! Ganas ' + tiros + ' disparo' + (tiros > 1 ? 's' : '') + '</b>' + esc(r.ex) + (subio ? '<br><b>📈 ¡Subes a N' + nivel(e) + '!</b>' : '') + '</div>'
        : '<div class="a-msg mal"><b class="t">✘ No es correcto: pierdes el disparo</b>' + (corr ? 'Respuesta: <b>' + esc(corr) + '</b><br>' : '') + esc(r.ex) + '</div>') +
        '<div class="a-pie"><span class="der"><button class="a-btn solid" id="f-seguir" type="button">' + (ok ? '🎯 A disparar' : 'Pasar el turno →') + '</button></span></div>';
      q('#f-seguir').addEventListener('click', function () {
        if (ok) { F.tirosQuedan = tiros; faseDisparo(); } else finTurno();
      });
      var b = q('#f-seguir'); if (b && b.scrollIntoView) setTimeout(function () { b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 40);
    } });
  }
  function faseDisparo() {
    F.fase = 'disparo';
    var e = F.equipos[F.turno];
    F.notacion = Math.random() < 0.5 ? 'ps' : 'py';
    q('#f-mesa').innerHTML = '<div class="f-turno">🎯 ' + esc(e.nom) + ': te quedan <b>' + F.tirosQuedan + '</b> disparo' + (F.tirosQuedan > 1 ? 's' : '') + '</div>' +
      A.personaje('bit', 'Elige una celda en el <b>mar de ' + esc(rival(F.turno).nom) + '</b>. Esta vez tendrás que escribirla en <b>' + (F.notacion === 'py' ? 'Python: tablero[f][c], contando desde 0' : 'PSeInt: tablero[f,c], contando desde 1') + '</b>.', 'idea', 'var(--bi)');
    pintarMares();
    var mar = q('.f-mar.objetivo'); if (mar && mar.scrollIntoView) mar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function pedirNotacion(k) {
    var p = k.split(',').map(Number), py = F.notacion === 'py';
    ultimaNot = '';
    A.modal(capa, '🎯', 'Fila ' + p[0] + ', columna ' + p[1],
      '<p>Escribe esta celda en <b>' + (py ? 'Python' : 'PSeInt') + '</b>' + (py ? ' (los índices empiezan en 0)' : ' (los índices empiezan en 1)') + ':</p>' +
      '<input class="a-tiro" id="f-not" type="text" autocomplete="off" spellcheck="false" placeholder="' + (py ? 'tablero[ ][ ]' : 'tablero[ , ]') + '">',
      [['🔥 ¡Fuego!', true, function () { disparar(k, ultimaNot); }], ['Elegir otra celda', false, null]]);
    var inp = q('#f-not'); inp.focus();
    inp.addEventListener('input', function () { ultimaNot = inp.value; });
    inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); ultimaNot = inp.value; q('#a-capa [data-mb="0"]').click(); } });
  }
  var ultimaNot = '';
  function validar(txt, f, c, py) {
    var s = String(txt).replace(/\s+/g, '').toLowerCase(), m;
    if (py) { m = /^tablero\[(\d+)\]\[(\d+)\]$/.exec(s); return !!m && Number(m[1]) === f - 1 && Number(m[2]) === c - 1; }
    m = /^tablero\[(\d+),(\d+)\]$/.exec(s); return !!m && Number(m[1]) === f && Number(m[2]) === c;
  }
  function disparar(k, txt) {
    var e = F.equipos[F.turno], en = rival(F.turno), p = k.split(',').map(Number), py = F.notacion === 'py';
    var bien = validar(txt, p[0], p[1], py);
    ultimaNot = '';
    e.disparos++; if (bien) e.precisos++;
    R.registrar(F.id, F.curso, 'flota', e.nom, { id: py ? 'IDX-PY' : 'IDX-PS', tema: 'matrices', nv: 3, sub: py ? 'Índices tablero[f][c] en Python' : 'Índices tablero[f,c] en PSeInt' }, bien, txt || '(vacío)');
    F.tirosQuedan--;
    if (!bien) {
      A.modal(capa, '💨', '¡Disparo desviado!', '<p>Escribiste <code>' + esc(txt || '(nada)') + '</code>, pero la celda elegida en ' + (py ? 'Python' : 'PSeInt') + ' es <b><code>' + notacion(p[0], p[1], py ? 'py' : 'ps') + '</code></b>.</p><p style="font-size:14px">' + (py ? 'En Python se cuenta desde 0: fila ' + p[0] + ' → índice ' + (p[0] - 1) + ', columna ' + p[1] + ' → índice ' + (p[1] - 1) + '. Y cada índice va en sus propios corchetes.' : 'En PSeInt se cuenta desde 1 y la matriz se escribe [fila,columna] en un solo par de corchetes.') + '</p>',
        [['Seguir', true, despuesDeTiro]]);
      return;
    }
    var b = barcoDe(en, k);
    en.tiros[k] = b >= 0 ? 'tocado' : 'agua';
    pintarMares();
    var res = b < 0 ? ['💧', '¡Agua!', 'No había nada en <code>' + notacion(p[0], p[1], py ? 'py' : 'ps') + '</code>.'] : hundido(en, b) ? ['☠️', '¡Hundido!', 'Hundiste un barco de ' + en.barcos[b].length + ' casilla' + (en.barcos[b].length > 1 ? 's' : '') + '.'] : ['💥', '¡Tocado!', 'Le diste a un barco en <code>' + notacion(p[0], p[1], py ? 'py' : 'ps') + '</code>.'];
    if (restantes(en) === 0) { victoria(F.turno); return; }
    A.modal(capa, res[0], res[1], '<p>' + res[2] + '</p>', [['Seguir', true, despuesDeTiro]]);
  }
  function despuesDeTiro() {
    if (F.fin) return;
    if (F.tirosQuedan > 0) faseDisparo(); else finTurno();
  }
  function finTurno() {
    F.turno = 1 - F.turno; F.fase = 'reto';
    nuevoTurno();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ─── Bit dispara ─── */
  function turnoBit() {
    var bit = F.equipos[1], yo = F.equipos[0];
    var m = q('#f-mesa');
    m.innerHTML = '<div class="f-turno">🤖 Turno de Bit</div>' + A.personaje('bit', '«Calculando coordenadas…» 🤔', 'idea', 'var(--bi)');
    bitT = setTimeout(function () {
      var k = elegirBit(yo), p = k.split(',').map(Number), b = barcoDe(yo, k), py = Math.random() < 0.5;
      yo.tiros[k] = b >= 0 ? 'tocado' : 'agua';
      bit.disparos++;
      pintarMares();
      var txt = b < 0 ? '¡Agua! 💧' : hundido(yo, b) ? '¡Hundí tu barco! ☠️' : '¡Tocado! 💥';
      m.innerHTML = '<div class="f-turno">🤖 Turno de Bit</div>' +
        A.personaje('bit', '«Disparo a <b><code>' + notacion(p[0], p[1], py ? 'py' : 'ps') + '</code></b> (' + (py ? 'Python' : 'PSeInt') + ')… ' + txt + '»<br><small>Esa es la fila ' + p[0] + ', columna ' + p[1] + ' de tu flota.</small>', b >= 0 ? 'ok' : 'explicando', 'var(--bi)') +
        '<div class="a-pie"><span class="der"><button class="a-btn solid" id="f-yo" type="button">Mi turno →</button></span></div>';
      if (restantes(yo) === 0) { victoria(1); return; }
      q('#f-yo').addEventListener('click', finTurno);
    }, 900);
  }
  function elegirBit(yo) {
    var libres = [], cand = [];
    for (var f = 1; f <= N; f++) for (var c = 1; c <= N; c++) if (!yo.tiros[f + ',' + c]) libres.push([f, c]);
    Object.keys(yo.tiros).forEach(function (k) {
      if (yo.tiros[k] !== 'tocado' || hundido(yo, barcoDe(yo, k))) return;
      var p = k.split(',').map(Number);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var f = p[0] + d[0], c = p[1] + d[1]; if (f >= 1 && f <= N && c >= 1 && c <= N && !yo.tiros[f + ',' + c]) cand.push(f + ',' + c); });
    });
    if (cand.length) return cand[A.azar(cand.length)];
    var par = libres.filter(function (p) { return (p[0] + p[1]) % 2 === 0; });
    var lista = par.length ? par : libres;
    var x = lista[A.azar(lista.length)]; return x[0] + ',' + x[1];
  }

  /* ─── Fin ─── */
  function victoria(i) {
    F.fin = true; R.enviarPendientes();
    if (bitT) clearTimeout(bitT);
    pintarMares();
    var g = F.equipos[i], humanos = F.equipos.filter(function (e) { return !e.cpu; });
    var gana = g.cpu ? '¡Bit hundió tu flota!' : (F.modo === 'bit' ? '¡Hundiste la flota de Bit!' : '¡' + esc(g.nom) + ' gana la batalla!');
    A.modal(capa, g.cpu ? '🤖' : '🏆', gana,
      A.personaje('bit', g.cpu ? '«Esta vez gané yo… pero mira tus aciertos: cada desafío es un disparo. ¡Revancha!»' : '«¡Bien jugado! Encontraste mis barcos con índices perfectos.»', g.cpu ? 'ok' : 'saludando', 'var(--bi)') +
      '<table><thead><tr><th></th><th class="num">Desafíos</th><th class="num">Disparos bien escritos</th></tr></thead><tbody>' +
      humanos.map(function (e) { return '<tr><td>' + esc(e.nom) + '</td><td class="num">' + e.aciertos + ' / ' + e.n + '</td><td class="num">' + e.precisos + ' / ' + e.disparos + '</td></tr>'; }).join('') +
      '</tbody></table>',
      [['Otra batalla', true, inicio], ['Ver los tableros', false, null]]);
    q('#f-mesa').innerHTML = '<div class="a-pie"><button class="a-btn solid" type="button" id="f-otra">Otra batalla</button></div>';
    q('#f-otra').addEventListener('click', inicio);
  }

  window.__flota = { estado: function () { return F; }, notacion: notacion };
  inicio();
})();
