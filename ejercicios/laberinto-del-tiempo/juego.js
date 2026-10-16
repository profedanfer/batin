/* ═══════════════════════════════════════════
   BATIN · Bit y el Laberinto del Tiempo — motor del juego
   · El mismo laberinto existe en dos épocas: PASADO (análisis) y FUTURO (Python).
   · Hay que recoger todos los fragmentos de las DOS épocas para resolver el caso.
   · Para viajar de una época a otra se cruza el PORTAL (túnel lateral):
     solo se abre si respondes bien una pregunta.
   · Las esferas «?» dan PODER (los bugs huyen) si respondes bien.
   · Los bugs son errores típicos: si te atrapan, te explican qué error son.
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var CASOS = window.LAB_CASOS || [];
  var CFG = window.LAB_CONFIG || {};
  var REG = window.LabRegistro;
  var raiz = document.getElementById('lab');
  if (!raiz) return;

  /* ─────────── Laberinto (19 × 21) ───────────
     #  pared     .  fragmento     o  esfera de poder     P  inicio de Bit
     T  portal    -  puerta de la casa     G  casa de los bugs     X  vacío */
  var MAPA = [
    '###################',
    '#........#........#',
    '#o##.###.#.###.##o#',
    '#.................#',
    '#.##.#.#####.#.##.#',
    '#....#...#...#....#',
    '####.### # ###.####',
    'XXX#.#       #.#XXX',
    '####.# ##-## #.####',
    'T   .  #GGG#  .   T',
    '####.# ##### #.####',
    'XXX#.#       #.#XXX',
    '####.# ##### #.####',
    '#........#........#',
    '#.##.###.#.###.##.#',
    '#o.#.....P.....#.o#',
    '##.#.#.#####.#.#.##',
    '#....#...#...#....#',
    '#.######.#.######.#',
    '#.................#',
    '###################'
  ];
  var W = 19, H = 21;
  var DIRS = { izq: [-1, 0], der: [1, 0], arr: [0, -1], aba: [0, 1] };
  var OPU = { izq: 'der', der: 'izq', arr: 'aba', aba: 'arr' };
  var LISTA_DIRS = ['arr', 'izq', 'aba', 'der'];
  var INICIO = buscar('P');
  var SALIDA_BUG = { x: 9, y: 7 };
  var CASA = [{ x: 8.1, y: 9 }, { x: 9, y: 9 }, { x: 9.9, y: 9 }, { x: 9, y: 9 }];
  var ESQUINAS = [{ x: W - 2, y: 1 }, { x: 1, y: 1 }, { x: W - 2, y: H - 2 }, { x: 1, y: H - 2 }];

  var ERAS = {
    pasado: {
      nom: 'Pasado', sub: 'Análisis', otra: 'futuro',
      bugs: [
        { id: 'dato',    letra: 'D', nom: 'Dato olvidado',      c: '#c2410c',
          txt: 'Te faltó un dato de entrada en el análisis. Si no lo pides al principio, después no hay con qué calcular.' },
        { id: 'cond',    letra: '<', nom: 'Condición al revés', c: '#a16207',
          txt: 'Usaste < donde iba >, o > donde iba >=. Revisa siempre el caso límite: el valor justo del borde.' },
        { id: 'init',    letra: '0', nom: 'Sin inicializar',    c: '#7c3aed',
          txt: 'Un contador o acumulador que no empieza en 0 arrastra basura: la cuenta o la suma no son confiables.' },
        { id: 'sinfin',  letra: '∞', nom: 'Bucle sin fin',      c: '#be185d',
          txt: 'Dentro del Mientras nada hace que la condición llegue a ser falsa. El algoritmo nunca termina.' }
      ]
    },
    futuro: {
      nom: 'Futuro', sub: 'Producción', otra: 'pasado',
      bugs: [
        { id: 'indent',  letra: 'I', nom: 'IndentationError',   c: '#dc2626',
          txt: 'La sangría (los espacios al inicio) dice qué está dentro del if, for o while. Si falta o sobra, Python no entiende el bloque.' },
        { id: 'type',    letra: 'T', nom: 'TypeError',          c: '#0e7490',
          txt: 'Mezclaste tipos: texto con número. input() siempre devuelve texto; conviértelo con int() antes de calcular.' },
        { id: 'name',    letra: 'N', nom: 'NameError',          c: '#4d7c0f',
          txt: 'Usaste una variable que no existe: un nombre mal escrito o con otra mayúscula (precio no es Precio).' },
        { id: 'index',   letra: '[', nom: 'IndexError',         c: '#9333ea',
          txt: 'Pediste una posición que la lista no tiene. En una lista de 5 elementos, los índices van de 0 a 4.' }
      ]
    }
  };

  var VEL_BIT = 6.2;
  var DUR_PODER = 7;
  var BLOQUEO_PORTAL = 6;

  /* ─────────── Utilidades ─────────── */
  function buscar(ch) { for (var y = 0; y < H; y++) { var x = MAPA[y].indexOf(ch); if (x >= 0) return { x: x, y: y }; } return null; }
  function celda(x, y) { if (y < 0 || y >= H || x < 0 || x >= W) return 'X'; return MAPA[y][x]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function escT(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function azar(n) { return Math.floor(Math.random() * n); }
  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function q(sel) { return raiz.querySelector(sel); }
  function qa(sel) { return Array.prototype.slice.call(raiz.querySelectorAll(sel)); }
  function ahora() { return new Date().toISOString(); }

  var K_HECHOS = 'batin_lab2_hechos';
  function hechos() { try { return JSON.parse(localStorage.getItem(K_HECHOS) || '{}'); } catch (e) { return {}; } }
  function marcarHecho(id, pts) { var h = hechos(); if (!h[id] || h[id] < pts) h[id] = pts; try { localStorage.setItem(K_HECHOS, JSON.stringify(h)); } catch (e) {} }

  /* ─────────── Estado ─────────── */
  var S = null;
  var cv, ctx, TS = 24, DPR = 1, C = {};
  var ultimo = 0, rafId = 0, relojAnim = 0;
  var preferencia = { alias: '', curso: '' };

  function nuevoMundo(era) {
    var dots = {}, pel = {}, n = 0;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var c = MAPA[y][x];
      if (c === '.') { dots[x + ',' + y] = 1; n++; }
      if (c === 'o') { pel[x + ',' + y] = 1; n++; }
    }
    return {
      dots: dots, pel: pel, total: n, quedan: n, tiempo: 0,
      bugs: ERAS[era].bugs.map(function (b, i) {
        return { id: b.id, i: i, x: 9, y: 9, t: 0, dir: null, estado: 'casa', espera: 1 + i * 3, asustado: false };
      })
    };
  }

  /* ═════════════ INICIO ═════════════ */
  function pantallaInicio() {
    detener();
    S = null;
    raiz.setAttribute('data-era', 'pasado');
    var h = hechos();
    var cursos = CFG.cursos && CFG.cursos.length ? CFG.cursos : ['2° A', '2° B'];
    var sel = preferencia.caso || 0;
    raiz.innerHTML = '' +
      '<div class="l-inicio">' +
        '<span class="l-kicker">BATIN · 2° curso · Algorítmica 2 + Python</span>' +
        '<h1 class="l-h1">Bit y el Laberinto del Tiempo</h1>' +
        '<p class="l-lead">Cada caso es un problema que existe en dos épocas. En el pasado lo analizas; en el futuro verificas que el código en Python haga lo que analizaste. Para resolverlo, tienes que limpiar el laberinto en las dos.</p>' +
        '<div class="l-eras">' +
          '<div class="l-era-card pasado"><h3>⏳ PASADO · Análisis</h3><p>Datos de entrada y salida, pseudocódigo, condiciones y pruebas de escritorio.</p></div>' +
          '<div class="l-era-card futuro"><h3>🚀 FUTURO · Producción</h3><p>El mismo problema en Python: qué muestra, dónde falla y si coincide con el análisis.</p></div>' +
        '</div>' +
        '<div class="l-card"><h3>Quién juega</h3><div class="l-fila">' +
          '<label class="l-campo">Tu alias<input type="text" id="l-alias" maxlength="20" autocomplete="off" value="' + esc(preferencia.alias) + '" placeholder="por ejemplo: Ninja404"><small>Un apodo, no tu nombre completo.</small></label>' +
          '<label class="l-campo">Curso<select id="l-curso">' + cursos.map(function (c) { return '<option' + (c === preferencia.curso ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></label>' +
        '</div></div>' +
        '<div class="l-card"><h3>Elige el caso</h3><div class="l-casos">' +
          CASOS.map(function (c, i) {
            return '<button type="button" class="l-caso" data-caso="' + i + '" aria-pressed="' + (i === sel) + '">' +
              '<span class="n">CASO ' + c.id + '</span><span class="t">' + esc(c.titulo) + '</span><span class="s">' + esc(c.tema) + '</span>' +
              (h[c.id] ? '<span class="hecho">✔ resuelto · ' + h[c.id] + ' pts</span>' : '') + '</button>';
          }).join('') +
        '</div></div>' +
        '<div class="l-card"><h3>Cómo se juega</h3><div class="l-reglas">' +
          regla('🤖', '<b>Mueve a Bit</b> con las flechas o <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>. En el celular, desliza el dedo o usa los botones.') +
          regla('✨', '<b>Recoge todos los fragmentos</b> del pasado <b>y</b> del futuro para resolver el caso.') +
          regla('🌀', '<b>El portal del tiempo</b> está en los túneles laterales. Para cruzarlo hay que responder bien.') +
          regla('❓', '<b>Las esferas «?»</b> te hacen una pregunta. Si aciertas, los bugs huyen y puedes atraparlos.') +
          regla('🐞', '<b>Los bugs son errores típicos.</b> Si uno te atrapa, pierdes una vida y te explica qué error es.') +
          regla('⏸', '<b>Pausa</b> con <kbd>P</kbd> o <kbd>Esc</kbd>.') +
        '</div></div>' +
        '<div class="l-fila" style="margin-top:22px;justify-content:space-between">' +
          '<a class="l-btn" href="panel.html">📊 Panel de fallas</a>' +
          '<button class="l-btn solid" id="l-jugar" type="button" style="font-size:16px;padding:14px 28px">Entrar al laberinto →</button>' +
        '</div>' +
      '</div>';

    qa('.l-caso').forEach(function (b) {
      b.addEventListener('click', function () {
        qa('.l-caso').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        sel = Number(b.dataset.caso);
      });
    });
    q('#l-jugar').addEventListener('click', function () {
      var alias = (q('#l-alias').value || '').trim();
      if (!alias) { q('#l-alias').focus(); q('#l-alias').placeholder = 'Escribe un alias para empezar'; return; }
      preferencia = { alias: alias, curso: q('#l-curso').value, caso: sel };
      iniciarCaso(sel);
    });
  }
  function regla(ico, txt) { return '<div class="l-regla"><span class="ico">' + ico + '</span><span>' + txt + '</span></div>'; }

  /* ═════════════ CASO ═════════════ */
  function iniciarCaso(idx) {
    var caso = CASOS[idx];
    S = {
      id: 'L' + Date.now().toString(36) + azar(1e6).toString(36),
      fecha: ahora(), alias: preferencia.alias, curso: preferencia.curso,
      casoIdx: idx, caso: caso, vidas: CFG.vidas || 3, puntos: 0,
      era: 'pasado', mundos: { pasado: nuevoMundo('pasado'), futuro: nuevoMundo('futuro') },
      bit: { x: INICIO.x, y: INICIO.y, t: 0, dir: null, next: null, inv: 0 },
      poder: 0, bloqueo: 0, fase: 'intro', aviso: '', avisoT: 0, quieto: true,
      resp: [], vistas: {}, falladas: {}, atrapadas: {}, ultimaQ: null, cerrada: false
    };
    pantallaJuego();
    modalChico('⏳', 'Caso ' + caso.id + ' · ' + esc(caso.titulo),
      '<div class="m-enun"><b>El problema:</b> ' + esc(caso.enunciado) + '</div>' +
      '<p style="margin-top:12px">Empiezas en el <b>pasado</b>, analizando. Cuando cruces el portal, vas a ver el mismo problema en <b>Python</b>.</p>',
      [['Entrar al laberinto →', true, function () { S.fase = 'jugando'; aviso('Usa las flechas', 2.2); }]]);
  }

  /* ═════════════ PANTALLA DE JUEGO ═════════════ */
  function pantallaJuego() {
    raiz.innerHTML = '' +
      '<div class="l-juego">' +
        '<div class="l-hud">' +
          '<span class="tit">Caso ' + S.caso.id + ' · ' + esc(S.caso.titulo) + '<small>' + esc(S.alias) + ' · ' + esc(S.curso) + '</small></span>' +
          '<span class="l-chip era" id="h-era"></span>' +
          '<span class="l-chip" id="h-vidas"></span>' +
          '<span class="l-chip" id="h-puntos"></span>' +
          '<span class="l-chip poder oculto" id="h-poder"></span>' +
          '<span class="l-chip oculto" id="h-bloqueo"></span>' +
          '<button class="l-btn sm" id="h-pausa" type="button">⏸ Pausa</button>' +
          '<button class="l-btn sm" id="h-salir" type="button">✕ Salir</button>' +
        '</div>' +
        '<div class="l-zona" id="l-zona"><canvas id="l-canvas" aria-label="Laberinto del tiempo"></canvas><div class="l-aviso" id="l-aviso"></div>' +
          '<div class="l-pad" id="l-pad"><button class="up" data-d="arr" aria-label="Arriba">▲</button><button class="left" data-d="izq" aria-label="Izquierda">◀</button><button class="down" data-d="aba" aria-label="Abajo">▼</button><button class="right" data-d="der" aria-label="Derecha">▶</button></div>' +
        '</div>' +
        '<aside class="l-lateral">' +
          '<div class="l-box"><h4>El problema</h4><p>' + esc(S.caso.enunciado) + '</p></div>' +
          '<div class="l-box"><h4>Fragmentos</h4><div class="l-prog" id="h-prog"></div></div>' +
          '<div class="l-box"><h4 id="h-bugs-tit">Bugs</h4><div class="l-bugs" id="h-bugs"></div></div>' +
          '<div class="l-box l-ayuda">🌀 El portal está en los túneles de los costados.<br>❓ Las esferas dan poder si aciertas.</div>' +
        '</aside>' +
      '</div>' +
      '<div id="l-capa"></div>';

    cv = q('#l-canvas');
    ctx = cv.getContext('2d');
    // Acomodar la página para que el HUD quede justo debajo del menú
    var nav = document.querySelector('.batin-nav');
    var altoNav = nav ? nav.getBoundingClientRect().height : 0;
    window.scrollTo({ top: Math.max(0, raiz.getBoundingClientRect().top + window.scrollY - altoNav), behavior: 'instant' });
    leerColores();
    ajustar();
    hud();
    q('#h-pausa').addEventListener('click', alternarPausa);
    q('#h-salir').addEventListener('click', function () {
      if (S.fase === 'fin') { pantallaInicio(); return; }
      var antes = S.fase; S.fase = 'pausa';
      modalChico('🚪', '¿Salir del caso?', '<p>Se guarda lo que respondiste hasta ahora.</p>', [
        ['Seguir jugando', false, function () { S.fase = antes === 'pausa' ? 'jugando' : antes; }],
        ['Salir', true, function () { cerrarPartida('salió'); pantallaInicio(); }]
      ]);
    });
    qa('#l-pad button').forEach(function (b) {
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); girar(b.dataset.d); });
    });
    tactil();
    arrancar();
  }

  function leerColores() {
    var cs = getComputedStyle(raiz);
    ['--naranja', '--azul', '--bg', '--bg2', '--bg3', '--bg4', '--texto', '--texto2', '--texto3', '--borde3', '--texto-fuerte'].forEach(function (v) {
      C[v.slice(2)] = cs.getPropertyValue(v).trim() || '#888';
    });
    C.claro = document.documentElement.dataset.tema === 'claro';
  }
  document.addEventListener('batin-tema', function () { if (S) leerColores(); });

  function ajustar() {
    if (!cv) return;
    var zona = q('#l-zona');
    var ancho = zona.clientWidth || 600;
    var nav = document.querySelector('.batin-nav');
    var altoNav = nav ? nav.getBoundingClientRect().height : 0;
    var hudEl = q('.l-hud');
    var altoHud = hudEl ? hudEl.getBoundingClientRect().height + 24 : 60;
    var tactilVisible = window.matchMedia('(pointer: coarse)').matches;
    var alto = window.innerHeight - altoNav - altoHud - (tactilVisible ? 140 : 24);
    var porAlto = Math.floor(Math.max(alto, 300) / H);
    TS = Math.max(14, Math.min(Math.floor(ancho / W), porAlto, 40));
    DPR = window.devicePixelRatio || 1;
    cv.width = W * TS * DPR; cv.height = H * TS * DPR;
    cv.style.width = (W * TS) + 'px'; cv.style.height = (H * TS) + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', function () { if (S && cv) ajustar(); });

  /* ─────────── HUD ─────────── */
  function hud() {
    if (!S || !q('#h-era')) return;
    var era = ERAS[S.era];
    raiz.setAttribute('data-era', S.era);
    q('#h-era').textContent = (S.era === 'pasado' ? '⏳ ' : '🚀 ') + era.nom + ' · ' + era.sub;
    q('#h-vidas').textContent = '🤖 × ' + S.vidas;
    q('#h-puntos').textContent = S.puntos + ' pts';
    var hp = q('#h-poder');
    hp.classList.toggle('oculto', S.poder <= 0);
    hp.textContent = '⚡ ' + Math.ceil(S.poder) + ' s';
    var hb = q('#h-bloqueo');
    hb.classList.toggle('oculto', S.bloqueo <= 0);
    hb.textContent = '🔒 portal ' + Math.ceil(S.bloqueo) + ' s';
    var mp = S.mundos.pasado, mf = S.mundos.futuro;
    q('#h-prog').innerHTML =
      '<span>⏳ Pasado</span><span class="bar pasado"><i style="width:' + Math.round(100 * (mp.total - mp.quedan) / mp.total) + '%"></i></span><span class="num">' + mp.quedan + '</span>' +
      '<span>🚀 Futuro</span><span class="bar futuro"><i style="width:' + Math.round(100 * (mf.total - mf.quedan) / mf.total) + '%"></i></span><span class="num">' + mf.quedan + '</span>';
    q('#h-bugs-tit').textContent = 'Bugs del ' + era.nom.toLowerCase();
    q('#h-bugs').innerHTML = era.bugs.map(function (b) { return '<span><i style="background:' + b.c + '">' + esc(b.letra) + '</i>' + esc(b.nom) + '</span>'; }).join('');
  }

  function aviso(txt, seg) { S.aviso = txt; S.avisoT = seg || 1.2; var a = q('#l-aviso'); if (a) a.textContent = txt; }

  /* ─────────── Bucle ─────────── */
  function arrancar() { detener(); ultimo = performance.now(); rafId = requestAnimationFrame(cuadro); }
  function detener() { if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  function cuadro(t) {
    var dt = Math.min(0.05, (t - ultimo) / 1000);
    ultimo = t;
    relojAnim += dt;
    if (S && S.fase === 'jugando') actualizar(dt);
    if (S && S.avisoT > 0) { S.avisoT -= dt; if (S.avisoT <= 0) { S.aviso = ''; var a = q('#l-aviso'); if (a) a.textContent = S.fase === 'pausa' ? '⏸ Pausa' : ''; } }
    if (S && cv) dibujar();
    rafId = requestAnimationFrame(cuadro);
  }

  var hudT = 0;
  function actualizar(dt) {
    var m = S.mundos[S.era];
    m.tiempo += dt;
    if (S.bit.inv > 0) S.bit.inv -= dt;
    if (S.poder > 0) { S.poder -= dt; if (S.poder <= 0) { S.poder = 0; m.bugs.forEach(function (b) { b.asustado = false; }); } }
    if (S.bloqueo > 0) S.bloqueo = Math.max(0, S.bloqueo - dt);

    moverBit(dt);
    if (S.fase !== 'jugando') return;
    var velBug = (4.3 + 0.25 * S.casoIdx) * (CFG.velocidadBugs || 1);
    m.bugs.forEach(function (b) { moverBug(b, dt, velBug, m); });
    colisiones(m);

    hudT += dt;
    if (hudT > 0.25) { hudT = 0; hud(); }
  }

  /* ─────────── Movimiento ─────────── */
  function libreBit(x, y) {
    var c = celda(x, y);
    if (c === '#' || c === 'X' || c === '-' || c === 'G') return false;
    if (c === 'T' && S.bloqueo > 0) return false;
    return true;
  }
  function libreBug(x, y) {
    var c = celda(x, y);
    return !(c === '#' || c === 'X' || c === '-' || c === 'G' || c === 'T');
  }

  function girar(d) {
    if (!S || !DIRS[d]) return;
    S.bit.next = d;
    if (S.quieto && S.fase === 'jugando') { S.quieto = false; S.avisoT = 0.01; }
  }

  function moverBit(dt) {
    var b = S.bit;
    // Media vuelta inmediata
    if (b.next && b.dir && b.next === OPU[b.dir] && b.t > 0) {
      var d0 = DIRS[b.dir];
      b.x += d0[0]; b.y += d0[1]; b.t = 1 - b.t; b.dir = b.next;
    }
    var dist = VEL_BIT * dt;
    var vueltas = 0;
    while (dist > 0 && vueltas++ < 6) {
      if (b.t === 0) {
        if (b.next && libreBit(b.x + DIRS[b.next][0], b.y + DIRS[b.next][1])) b.dir = b.next;
        else if (!b.dir || !libreBit(b.x + DIRS[b.dir][0], b.y + DIRS[b.dir][1])) { b.dir = null; return; }
      }
      var falta = 1 - b.t;
      if (dist < falta) { b.t += dist; return; }
      dist -= falta;
      var d = DIRS[b.dir];
      b.x += d[0]; b.y += d[1]; b.t = 0;
      if (llegaBit()) return;
    }
  }

  // Devuelve true si hay que cortar el movimiento (portal, pregunta, fin)
  function llegaBit() {
    var b = S.bit, m = S.mundos[S.era], k = b.x + ',' + b.y;
    if (m.dots[k]) { delete m.dots[k]; m.quedan--; S.puntos += 10; if (comprobarFin()) return true; }
    if (m.pel[k]) {
      delete m.pel[k]; m.quedan--;
      if (comprobarFin()) return true;
      pregunta('poder', function (ok) {
        if (ok) {
          S.puntos += 100; S.poder = DUR_PODER;
          m.bugs.forEach(function (g) { if (g.estado === 'activo') { g.asustado = true; if (g.dir && g.t > 0) { var d = DIRS[g.dir]; g.x += d[0]; g.y += d[1]; g.t = 1 - g.t; g.dir = OPU[g.dir]; } } });
          aviso('⚡ ¡Poder! Atrapa los bugs', 1.4);
        } else aviso('Sin poder esta vez', 1.2);
      });
      return true;
    }
    if (celda(b.x, b.y) === 'T' && ((b.x === 0 && b.dir === 'izq') || (b.x === W - 1 && b.dir === 'der'))) {
      var otra = ERAS[S.era].otra;
      pregunta('portal', function (ok) {
        if (ok) {
          S.puntos += 150;
          S.era = otra;
          S.poder = 0;
          S.mundos[S.era].bugs.forEach(function (g) { g.asustado = false; });
          b.x = (b.x === 0) ? W - 1 : 0; b.t = 0; b.inv = 1.6;
          leerColores(); hud();
          aviso(otra === 'futuro' ? '🚀 Futuro · Producción' : '⏳ Pasado · Análisis', 1.6);
        } else {
          b.dir = OPU[b.dir]; b.next = b.dir; S.bloqueo = BLOQUEO_PORTAL;
          aviso('🔒 El portal se cerró', 1.4);
        }
      });
      return true;
    }
    return false;
  }

  function dist2(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }

  function moverBug(g, dt, vel, m) {
    if (g.estado === 'casa') {
      g.espera -= dt;
      if (g.espera <= 0) { g.estado = 'activo'; g.x = SALIDA_BUG.x; g.y = SALIDA_BUG.y; g.t = 0; g.dir = Math.random() < 0.5 ? 'izq' : 'der'; g.asustado = false; }
      return;
    }
    var dist = vel * (g.asustado ? 0.55 : 1) * dt, vueltas = 0;
    while (dist > 0 && vueltas++ < 6) {
      if (g.t === 0) decidirBug(g, m);
      if (!g.dir) return;
      var falta = 1 - g.t;
      if (dist < falta) { g.t += dist; return; }
      dist -= falta;
      var d = DIRS[g.dir];
      g.x += d[0]; g.y += d[1]; g.t = 0;
    }
  }

  function decidirBug(g, m) {
    var ops = LISTA_DIRS.filter(function (d) { return d !== OPU[g.dir] && libreBug(g.x + DIRS[d][0], g.y + DIRS[d][1]); });
    if (!ops.length) ops = LISTA_DIRS.filter(function (d) { return libreBug(g.x + DIRS[d][0], g.y + DIRS[d][1]); });
    if (!ops.length) { g.dir = null; return; }
    if (g.asustado || (g.i === 3 && Math.random() < 0.45)) { g.dir = ops[azar(ops.length)]; return; }
    var b = S.bit, obj;
    var disperso = (m.tiempo % 27) < 6;
    if (disperso) obj = ESQUINAS[g.i];
    else if (g.i === 0) obj = { x: b.x, y: b.y };
    else if (g.i === 1) { var d = DIRS[b.dir || 'izq']; obj = { x: b.x + d[0] * 4, y: b.y + d[1] * 4 }; }
    else if (g.i === 2) obj = dist2(g, b) > 49 ? { x: b.x, y: b.y } : ESQUINAS[g.i];
    else obj = { x: b.x, y: b.y };
    var mejor = null, md = Infinity;
    ops.forEach(function (d) {
      var p = { x: g.x + DIRS[d][0], y: g.y + DIRS[d][1] }, dd = dist2(p, obj);
      if (dd < md || (dd === md && Math.random() < 0.5)) { md = dd; mejor = d; }
    });
    g.dir = mejor;
  }

  function posRender(e) { var d = e.dir ? DIRS[e.dir] : [0, 0]; return { x: e.x + d[0] * e.t, y: e.y + d[1] * e.t }; }

  function colisiones(m) {
    var pb = posRender(S.bit);
    for (var i = 0; i < m.bugs.length; i++) {
      var g = m.bugs[i];
      if (g.estado !== 'activo') continue;
      var pg = posRender(g);
      if (dist2(pb, pg) < 0.42) {
        if (g.asustado) {
          g.estado = 'casa'; g.espera = 4; g.asustado = false; g.dir = null; g.t = 0;
          S.puntos += 200; aviso('🐞 ¡Bug atrapado! +200', 1);
        } else if (S.bit.inv <= 0) { atrapado(g); return; }
      }
    }
  }

  function atrapado(g) {
    var info = ERAS[S.era].bugs[g.i];
    S.vidas--;
    S.atrapadas[info.id] = (S.atrapadas[info.id] || 0) + 1;
    S.fase = 'modal';
    hud();
    var ultima = S.vidas <= 0;
    modalChico('<span style="display:inline-flex;width:72px;height:72px;border-radius:50%;align-items:center;justify-content:center;background:' + info.c + ';color:#fff;font-family:var(--font-mono);font-weight:700;font-size:34px">' + esc(info.letra) + '</span>',
      'Te atrapó: ' + esc(info.nom),
      '<p>' + esc(info.txt) + '</p>' + (ultima ? '<p style="margin-top:10px"><b>No te quedan vidas.</b></p>' : '<p style="margin-top:10px">Te quedan ' + S.vidas + ' ' + (S.vidas === 1 ? 'vida' : 'vidas') + '.</p>'),
      [[ultima ? 'Ver resultado' : 'Seguir →', true, function () {
        if (ultima) { terminar(false); return; }
        reiniciarPosiciones();
        S.fase = 'jugando';
        aviso('¡Sigue!', 0.9);
      }]]);
  }

  function reiniciarPosiciones() {
    var b = S.bit;
    b.x = INICIO.x; b.y = INICIO.y; b.t = 0; b.dir = null; b.next = null; b.inv = 2;
    S.poder = 0;
    S.mundos[S.era].bugs.forEach(function (g, i) { g.estado = 'casa'; g.espera = 1.5 + i * 2; g.asustado = false; g.dir = null; g.t = 0; });
  }

  function comprobarFin() {
    if (S.mundos.pasado.quedan === 0 && S.mundos.futuro.quedan === 0) { terminar(true); return true; }
    var m = S.mundos[S.era];
    if (m.quedan === 0 && !m.avisado) {
      m.avisado = true;
      aviso(S.era === 'pasado' ? '✔ Pasado limpio · cruza al futuro' : '✔ Futuro limpio · vuelve al pasado', 2.2);
    }
    return false;
  }

  /* ─────────── Preguntas ─────────── */
  function elegirPregunta(era) {
    var pool = S.caso.preguntas.filter(function (p) { return p.era === era; });
    var noVistas = pool.filter(function (p) { return !S.vistas[p.id]; });
    if (noVistas.length) return noVistas[azar(noVistas.length)];
    var fall = pool.filter(function (p) { return S.falladas[p.id] && p.id !== S.ultimaQ; });
    if (fall.length) return fall[azar(fall.length)];
    var resto = pool.filter(function (p) { return p.id !== S.ultimaQ; });
    return (resto.length ? resto : pool)[azar((resto.length ? resto : pool).length)];
  }

  var KW = {
    py: ['for', 'in', 'if', 'elif', 'else', 'while', 'print', 'input', 'int', 'str', 'range', 'len', 'sum', 'or', 'and', 'not', 'True', 'False'],
    pseudo: ['Algoritmo', 'FinAlgoritmo', 'Leer', 'Escribir', 'Si', 'Entonces', 'SiNo', 'FinSi', 'Para', 'Hasta', 'Con', 'Paso', 'Hacer', 'FinPara', 'Mientras', 'FinMientras', 'Dimension']
  };
  function resaltar(linea, lang) {
    var partes = [], re = /"[^"]*"/g, mm, ult = 0;
    while ((mm = re.exec(linea))) { partes.push({ t: linea.slice(ult, mm.index) }); partes.push({ t: mm[0], s: 1 }); ult = re.lastIndex; }
    partes.push({ t: linea.slice(ult) });
    var rk = new RegExp('\\b(' + KW[lang].join('|') + ')\\b', 'g');
    return partes.map(function (p) {
      if (p.s) return '<span class="str">' + escT(p.t) + '</span>';
      return escT(p.t)
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>')
        .replace(rk, '<span class="kw">$1</span>')
        .replace(/_{4,}/g, function (x) { return '<span class="hueco">' + x + '</span>'; });
    }).join('');
  }
  function bloqueCodigo(code) {
    var lineas = code.txt.split('\n');
    return '<div class="codigo ' + (code.lang === 'py' ? 'py' : 'pseudo') + '"><table>' +
      lineas.map(function (l, i) { return '<tr><td class="ln">' + (i + 1) + '</td><td>' + (resaltar(l, code.lang === 'py' ? 'py' : 'pseudo') || ' ') + '</td></tr>'; }).join('') +
      '</table></div>';
  }

  function pregunta(motivo, alTerminar) {
    S.fase = 'modal';
    var p = elegirPregunta(S.era);
    S.ultimaQ = p.id;
    S.vistas[p.id] = (S.vistas[p.id] || 0) + 1;
    var orden = mezclar(p.op.map(function (_, i) { return i; }));
    var letras = 'ABCD';
    var era = ERAS[S.era];
    var mot = motivo === 'portal'
      ? '🌀 Portal: si aciertas, viajas al ' + (era.otra === 'futuro' ? 'futuro' : 'pasado')
      : '❓ Si aciertas, los bugs huyen ' + DUR_PODER + ' segundos';
    var html = '<div class="l-velo"><div class="l-modal" role="dialog" aria-modal="true">' +
      '<div class="m-cab"><span class="l-chip era">' + (S.era === 'pasado' ? '⏳ ' : '🚀 ') + era.nom + ' · ' + era.sub + '</span><span class="l-chip">' + esc(p.sub) + '</span><span class="m-motivo">' + mot + '</span></div>' +
      '<div class="m-q">' + esc(p.q) + '</div>' +
      (p.code ? bloqueCodigo(p.code) : '') +
      '<div class="m-ops">' + orden.map(function (idx, k) {
        return '<button type="button" class="op" data-idx="' + idx + '"><span class="k">' + letras[k] + '</span><span>' + esc(p.op[idx]) + '</span></button>';
      }).join('') + '</div>' +
      '<div id="m-ver"></div>' +
      '<div class="m-pie"><button class="l-btn solid oculto" id="m-seguir" type="button">Continuar →</button></div>' +
      '</div></div>';
    q('#l-capa').innerHTML = html;
    var respondida = false, acerto = false;
    function responder(idx) {
      if (respondida) return;
      respondida = true;
      acerto = idx === 0;
      if (!acerto) S.falladas[p.id] = true; else delete S.falladas[p.id];
      S.resp.push({ t: ahora(), qid: p.id, era: S.era, sub: p.sub, caso: S.caso.id, ok: acerto, elegida: String(p.op[idx]).slice(0, 120), motivo: motivo });
      guardarProgreso();
      qa('.op').forEach(function (b) {
        b.disabled = true;
        var i = Number(b.dataset.idx);
        if (i === 0) b.classList.add('bien'); else if (i === idx) b.classList.add('mal');
      });
      var res = acerto
        ? (motivo === 'portal' ? '✔ ¡Correcto! El portal se abre.' : '✔ ¡Correcto! Tienes poder.')
        : (motivo === 'portal' ? '✘ Incorrecto. El portal se cierra unos segundos.' : '✘ Incorrecto. Esta vez no hay poder.');
      q('#m-ver').innerHTML = '<div class="m-ver' + (acerto ? '' : ' mal') + '"><b>' + res + '</b>' + esc(p.ex) + '</div>';
      var s = q('#m-seguir'); s.classList.remove('oculto'); s.focus();
    }
    qa('.op').forEach(function (b) { b.addEventListener('click', function () { responder(Number(b.dataset.idx)); }); });
    q('#m-seguir').addEventListener('click', function () {
      cerrarCapa();
      S.fase = 'jugando';
      alTerminar(acerto);
      hud();
    });
    teclasModal = function (ev) {
      if (respondida) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); q('#m-seguir').click(); } return; }
      var pos = 'ABCD'.indexOf(ev.key.toUpperCase());
      if (pos < 0 && /^[1-4]$/.test(ev.key)) pos = Number(ev.key) - 1;
      var bs = qa('.op');
      if (pos >= 0 && bs[pos]) { ev.preventDefault(); bs[pos].click(); }
    };
  }

  /* Modal simple con botones [texto, principal, accion] */
  var teclasModal = null;
  function modalChico(ico, tit, cuerpo, botones) {
    q('#l-capa').innerHTML = '<div class="l-velo"><div class="l-modal chico" role="dialog" aria-modal="true">' +
      '<div class="m-gran">' + ico + '</div><h2>' + tit + '</h2>' + cuerpo +
      '<div class="m-pie">' + botones.map(function (b, i) { return '<button type="button" class="l-btn' + (b[1] ? ' solid' : '') + '" data-b="' + i + '">' + b[0] + '</button>'; }).join('') + '</div>' +
      '</div></div>';
    qa('#l-capa [data-b]').forEach(function (el) {
      el.addEventListener('click', function () { var b = botones[Number(el.dataset.b)]; cerrarCapa(); b[2](); });
    });
    var principal = q('#l-capa .l-btn.solid'); if (principal) principal.focus();
    teclasModal = function (ev) { if (ev.key === 'Enter' && principal) { ev.preventDefault(); principal.click(); } };
  }
  function cerrarCapa() { var c = q('#l-capa'); if (c) c.innerHTML = ''; teclasModal = null; }

  /* ─────────── Fin del caso ─────────── */
  function partidaParaRegistro(resultado) {
    return {
      id: S.id, fecha: S.fecha, curso: S.curso, alias: S.alias, caso: S.caso.id,
      resultado: resultado, puntos: S.puntos, respuestas: S.resp, atrapadas: S.atrapadas
    };
  }
  function guardarProgreso() { if (S) REG.actual.guardar(partidaParaRegistro('en curso')); }

  var estadoEnvio = '';
  function cerrarPartida(resultado) {
    if (!S || S.cerrada) return Promise.resolve();
    S.cerrada = true;
    if (!S.resp.length && !Object.keys(S.atrapadas).length) { REG.actual.borrar(); return Promise.resolve(); }
    estadoEnvio = 'Guardando…';
    return REG.registrarFin(partidaParaRegistro(resultado)).then(function (r) {
      estadoEnvio = {
        'sin-endpoint': '💾 Guardado en este navegador.',
        'enviado': '💾 Guardado y ☁️ enviado a la planilla.',
        'sin-conexion': '💾 Guardado en este navegador. ☁️ Se enviará cuando haya conexión.',
        'nada': '💾 Guardado en este navegador.'
      }[r] || '💾 Guardado.';
      var el = q('#m-envio'); if (el) el.textContent = estadoEnvio;
    });
  }

  function terminar(gano) {
    S.fase = 'fin';
    if (gano) { S.puntos += 500 + S.vidas * 100; marcarHecho(S.caso.id, S.puntos); }
    hud();
    cerrarPartida(gano ? 'resuelto' : 'sin vidas');
    var cuenta = function (era) {
      var r = S.resp.filter(function (x) { return x.era === era; });
      return { ok: r.filter(function (x) { return x.ok; }).length, tot: r.length };
    };
    var cp = cuenta('pasado'), cf = cuenta('futuro');
    var hay = CASOS[S.casoIdx + 1];
    var botones = [];
    if (gano && hay) botones.push(['Caso ' + hay.id + ' →', true, function () { preferencia.caso = S.casoIdx + 1; iniciarCaso(S.casoIdx + 1); }]);
    if (!gano) botones.push(['Reintentar', true, function () { iniciarCaso(S.casoIdx); }]);
    botones.push(['Elegir caso', botones.length === 0, function () { pantallaInicio(); }]);
    var fila = function (n, c) { return '<tr><td>' + n + '</td><td class="num">' + c.ok + ' / ' + c.tot + '</td><td class="num">' + (c.tot ? Math.round(100 * c.ok / c.tot) + '%' : '—') + '</td></tr>'; };
    var lectura = '';
    if (cp.tot && cf.tot) {
      var pp = cp.ok / cp.tot, pf = cf.ok / cf.tot;
      if (pp - pf >= 0.3) lectura = 'Analizas bien, pero al llegar al código algo se pierde. Repasa cómo se traduce el pseudocódigo a Python.';
      else if (pf - pp >= 0.3) lectura = 'Lees bien el código, pero el análisis previo te cuesta más. Practica datos de entrada, salida y pruebas de escritorio.';
    }
    modalChico(gano ? '🏁' : '🪫', gano ? '¡Caso resuelto!' : 'Se acabaron las vidas',
      '<p><b>' + S.puntos + ' puntos</b></p>' +
      '<table class="fin-tabla"><thead><tr><th>Época</th><th class="num">Aciertos</th><th class="num">%</th></tr></thead><tbody>' +
      fila('⏳ Pasado · Análisis', cp) + fila('🚀 Futuro · Producción', cf) + '</tbody></table>' +
      (lectura ? '<div class="m-enun" style="margin-top:14px">' + lectura + '</div>' : '') +
      '<div class="estado-envio" id="m-envio">' + esc(estadoEnvio) + '</div>',
      botones);
  }

  /* ─────────── Pausa ─────────── */
  function alternarPausa() {
    if (!S) return;
    if (S.fase === 'jugando') { S.fase = 'pausa'; var a = q('#l-aviso'); if (a) a.textContent = '⏸ Pausa'; }
    else if (S.fase === 'pausa' && !q('#l-capa').innerHTML) { S.fase = 'jugando'; var a2 = q('#l-aviso'); if (a2) a2.textContent = ''; ultimo = performance.now(); }
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden && S && S.fase === 'jugando') alternarPausa(); });

  /* ─────────── Entrada ─────────── */
  var TECLAS = { ArrowLeft: 'izq', ArrowRight: 'der', ArrowUp: 'arr', ArrowDown: 'aba', a: 'izq', d: 'der', w: 'arr', s: 'aba', A: 'izq', D: 'der', W: 'arr', S: 'aba' };
  document.addEventListener('keydown', function (ev) {
    if (!S) return;
    var tag = (ev.target && ev.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (teclasModal && q('#l-capa') && q('#l-capa').innerHTML) { teclasModal(ev); return; }
    if (ev.key === 'p' || ev.key === 'P' || ev.key === 'Escape') { ev.preventDefault(); alternarPausa(); return; }
    var d = TECLAS[ev.key];
    if (d) { ev.preventDefault(); girar(d); }
  });

  function tactil() {
    var x0 = 0, y0 = 0, activo = false;
    cv.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; activo = true; }, { passive: true });
    cv.addEventListener('touchmove', function (e) {
      if (!activo) return;
      var t = e.touches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
      e.preventDefault();
      girar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'der' : 'izq') : (dy > 0 ? 'aba' : 'arr'));
      x0 = t.clientX; y0 = t.clientY;
    }, { passive: false });
    cv.addEventListener('touchend', function () { activo = false; });
  }

  /* ═════════════ DIBUJO ═════════════ */
  function alpha(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return hex;
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  }

  function dibujar() {
    var era = S.era, col = era === 'pasado' ? C.naranja : C.azul, m = S.mundos[era], t = TS;
    ctx.clearRect(0, 0, W * t, H * t);
    ctx.fillStyle = C.bg2; ctx.fillRect(0, 0, W * t, H * t);
    ctx.fillStyle = alpha(col, 0.05); ctx.fillRect(0, 0, W * t, H * t);

    // Textura: renglones de cuaderno (pasado) o cuadrícula de terminal (futuro)
    ctx.strokeStyle = alpha(col, C.claro ? 0.09 : 0.07); ctx.lineWidth = 1;
    ctx.beginPath();
    for (var yy = 1; yy < H; yy++) { ctx.moveTo(0, yy * t + 0.5); ctx.lineTo(W * t, yy * t + 0.5); }
    if (era === 'futuro') for (var xx = 1; xx < W; xx++) { ctx.moveTo(xx * t + 0.5, 0); ctx.lineTo(xx * t + 0.5, H * t); }
    ctx.stroke();

    // Paredes
    var grosor = Math.max(2, t * 0.09);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var c = MAPA[y][x];
      if (c === 'X') { ctx.fillStyle = alpha(col, C.claro ? 0.2 : 0.16); ctx.fillRect(x * t, y * t, t, t); continue; }
      if (c !== '#') continue;
      ctx.fillStyle = alpha(col, C.claro ? 0.2 : 0.16);
      ctx.fillRect(x * t, y * t, t, t);
      ctx.strokeStyle = col; ctx.lineWidth = grosor;
      ctx.beginPath();
      if (abierto(x, y - 1)) { ctx.moveTo(x * t, y * t + grosor / 2); ctx.lineTo((x + 1) * t, y * t + grosor / 2); }
      if (abierto(x, y + 1)) { ctx.moveTo(x * t, (y + 1) * t - grosor / 2); ctx.lineTo((x + 1) * t, (y + 1) * t - grosor / 2); }
      if (abierto(x - 1, y)) { ctx.moveTo(x * t + grosor / 2, y * t); ctx.lineTo(x * t + grosor / 2, (y + 1) * t); }
      if (abierto(x + 1, y)) { ctx.moveTo((x + 1) * t - grosor / 2, y * t); ctx.lineTo((x + 1) * t - grosor / 2, (y + 1) * t); }
      ctx.stroke();
    }
    // Puerta de la casa
    ctx.strokeStyle = C.texto3; ctx.lineWidth = Math.max(2, t * 0.12);
    ctx.beginPath(); ctx.moveTo(9 * t + 2, 8.55 * t); ctx.lineTo(10 * t - 2, 8.55 * t); ctx.stroke();

    // Fragmentos
    ctx.fillStyle = C.texto2;
    Object.keys(m.dots).forEach(function (k) {
      var p = k.split(','), cx = (+p[0] + 0.5) * t, cy = (+p[1] + 0.5) * t;
      if (era === 'pasado') { var s = t * 0.16; ctx.fillRect(cx - s / 2, cy - s / 2, s, s); }
      else { ctx.beginPath(); ctx.arc(cx, cy, t * 0.09, 0, 7); ctx.fill(); }
    });
    // Esferas de pregunta
    var pulso = 0.85 + 0.15 * Math.sin(relojAnim * 5);
    Object.keys(m.pel).forEach(function (k) {
      var p = k.split(','), cx = (+p[0] + 0.5) * t, cy = (+p[1] + 0.5) * t;
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, t * 0.34 * pulso, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(t * 0.46) + 'px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', cx, cy + 1);
    });

    // Portales
    var otraCol = era === 'pasado' ? C.azul : C.naranja;
    [0, W - 1].forEach(function (px) {
      var cx = (px + 0.5) * t, cy = 9.5 * t;
      if (S.bloqueo > 0) {
        ctx.fillStyle = C.texto3; ctx.font = Math.round(t * 0.6) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔒', cx, cy);
        return;
      }
      for (var r = 0; r < 3; r++) {
        ctx.strokeStyle = alpha(otraCol, 0.9 - r * 0.25); ctx.lineWidth = Math.max(1.5, t * 0.07);
        ctx.beginPath();
        var a0 = relojAnim * (2 + r) + r;
        ctx.arc(cx, cy, t * (0.42 - r * 0.11), a0, a0 + 4.2);
        ctx.stroke();
      }
    });

    // Bugs
    m.bugs.forEach(function (g) {
      var info = ERAS[era].bugs[g.i], pos;
      if (g.estado === 'casa') pos = { x: CASA[g.i].x, y: CASA[g.i].y + Math.sin(relojAnim * 4 + g.i) * 0.12 };
      else pos = posRender(g);
      var colorBug = info.c;
      if (g.asustado) colorBug = (S.poder < 2 && Math.floor(relojAnim * 6) % 2) ? '#e8ecf3' : '#5b6b8c';
      dibujarBug((pos.x + 0.5) * t, (pos.y + 0.5) * t, t, colorBug, g.asustado ? '!' : info.letra, g.dir, g.estado === 'casa' ? 0.75 : 1);
    });

    // Bit
    var pb = posRender(S.bit);
    if (!(S.bit.inv > 0 && Math.floor(relojAnim * 10) % 2)) dibujarBit((pb.x + 0.5) * t, (pb.y + 0.5) * t, t, S.bit.dir || 'der', col);

    if (S.fase === 'pausa') { ctx.fillStyle = alpha(C.claro ? '#ffffff' : '#000000', 0.45); ctx.fillRect(0, 0, W * t, H * t); }
  }

  function abierto(x, y) { var c = celda(x, y); return c !== '#' && c !== 'X'; }

  function dibujarBit(cx, cy, t, dir, col) {
    var s = t * 0.78, r = s * 0.28, x = cx - s / 2, y = cy - s / 2 + t * 0.04;
    // antena
    ctx.strokeStyle = '#1d2533'; ctx.lineWidth = Math.max(1, t * 0.05);
    ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx, y - t * 0.14); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, y - t * 0.16, t * 0.07, 0, 7); ctx.fill();
    // cabeza
    redondo(x, y, s, s * 0.9, r);
    ctx.fillStyle = '#eef2f7'; ctx.fill();
    ctx.strokeStyle = '#1d2533'; ctx.lineWidth = Math.max(1.2, t * 0.05); ctx.stroke();
    // visor
    var vx = x + s * 0.13, vy = y + s * 0.22, vw = s * 0.74, vh = s * 0.44;
    redondo(vx, vy, vw, vh, vh * 0.35); ctx.fillStyle = '#16202e'; ctx.fill();
    // ojos que miran hacia donde va
    var d = DIRS[dir] || [1, 0], ox = d[0] * vw * 0.1, oy = d[1] * vh * 0.14;
    ctx.fillStyle = '#5fd4ff';
    ctx.beginPath(); ctx.arc(vx + vw * 0.32 + ox, vy + vh * 0.5 + oy, vh * 0.2, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(vx + vw * 0.68 + ox, vy + vh * 0.5 + oy, vh * 0.2, 0, 7); ctx.fill();
  }

  function dibujarBug(cx, cy, t, color, letra, dir, escala) {
    var rx = t * 0.34 * escala, ry = t * 0.4 * escala;
    ctx.save();
    ctx.translate(cx, cy);
    var ang = { arr: 0, der: Math.PI / 2, aba: Math.PI, izq: -Math.PI / 2 }[dir] || 0;
    ctx.rotate(ang);
    // patas
    ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, t * 0.05);
    ctx.beginPath();
    var mov = Math.sin(relojAnim * 14) * t * 0.04;
    [-0.22, 0.02, 0.24].forEach(function (k, i) {
      var yy = k * t * escala, m = (i % 2 ? mov : -mov);
      ctx.moveTo(-rx * 0.8, yy); ctx.lineTo(-rx * 1.35, yy + m - t * 0.05);
      ctx.moveTo(rx * 0.8, yy); ctx.lineTo(rx * 1.35, yy - m - t * 0.05);
    });
    // antenas
    ctx.moveTo(-rx * 0.3, -ry * 0.9); ctx.lineTo(-rx * 0.7, -ry * 1.35);
    ctx.moveTo(rx * 0.3, -ry * 0.9); ctx.lineTo(rx * 0.7, -ry * 1.35);
    ctx.stroke();
    // cuerpo
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.stroke();
    // línea del caparazón
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(0, -ry * 0.55); ctx.lineTo(0, ry * 0.9); ctx.stroke();
    ctx.restore();
    // letra (sin rotar, para que se lea)
    ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(t * 0.4 * escala) + 'px ' + (C.mono || 'monospace');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(letra, cx, cy + 1);
  }

  function redondo(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ─────────── Arranque ─────────── */
  // Si la última vez se cerró la pestaña a mitad de un caso, se registra lo respondido
  var previa = REG.actual.leer();
  if (previa && previa.respuestas && previa.respuestas.length) { previa.resultado = 'sin terminar'; REG.registrarFin(previa); }
  else REG.actual.borrar();
  if (REG.pendientes()) REG.enviarPendientes();

  // Para pruebas automáticas
  window.__lab = { estado: function () { return S; }, girar: girar };

  pantallaInicio();
})();
