/* ═══════════════════════════════════════════
   BATIN · OCA de Ofimática y Proyectos — motor del juego
   Reglas:
   · El dado marca cuánto puedes avanzar Y la dificultad:
       1-2 → fácil · 3-4 → media · 5-6 → difícil
   · La casilla de destino decide el tema de la pregunta.
   · Aciertas → avanzas. Fallas → te quedas.
   · Casillas especiales = errores típicos (o buenas prácticas).
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var BANCO = window.OCA_BANCO || [];
  var CFG = window.OCA_CONFIG || {};
  var REG = window.OcaRegistro;
  var raiz = document.getElementById('oca');
  if (!raiz) return;

  /* ─────────── Datos fijos ─────────── */
  var TEMAS = {
    excel:    { nom: 'Excel',      letra: 'X', v: '--t-excel' },
    word:     { nom: 'Word',       letra: 'W', v: '--t-word' },
    ppt:      { nom: 'PowerPoint', letra: 'P', v: '--t-ppt' },
    proyecto: { nom: 'Proyectos',  letra: '★', v: '--t-proyecto' }
  };
  var ORDEN_TEMAS = ['excel', 'word', 'ppt', 'proyecto'];
  var NIVEL_NOM = { 1: 'Fácil', 2: 'Media', 3: 'Difícil' };

  var FICHAS = [
    { c: '#e8650a', f: '●' }, { c: '#3b9de8', f: '▲' }, { c: '#9b6bff', f: '■' },
    { c: '#2f9e64', f: '◆' }, { c: '#c99400', f: '★' }, { c: '#d6336c', f: '✚' }
  ];

  var META = 63;
  var OCAS = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59];
  var TIPS_OCA = {
    5:  'Ctrl + G guarda el archivo (en algunos programas, Ctrl + S). Guarda seguido.',
    9:  'Ctrl + Z deshace el último cambio. Tu mejor amigo cuando algo sale mal.',
    14: 'En Excel, F4 agrega los $ a la referencia que estás escribiendo: A1 → $A$1.',
    18: 'En Word, Ctrl + Enter inserta un salto de página. Chau a los Enter repetidos.',
    23: 'En PowerPoint, F5 inicia la presentación desde la primera diapositiva.',
    27: 'Ctrl + C copia y Ctrl + V pega. Ctrl + X corta.',
    32: 'En PowerPoint, Mayús + F5 presenta desde la diapositiva en la que estás.',
    36: 'En Excel, Alt + = inserta la función SUMA automáticamente.',
    41: 'Ctrl + Inicio te lleva al principio del documento o de la hoja.',
    45: 'En una tabla de Word, Tab en la última celda agrega una fila nueva.',
    50: 'Ctrl + P abre la vista de impresión: revisa antes de imprimir.',
    54: 'Presentando, la tecla B pone la pantalla en negro para que te miren a ti.',
    59: 'En Excel, Ctrl + Mayús + flecha selecciona hasta el final de los datos.'
  };
  var ESP = {
    6:  { ico: '🌉', nom: 'Puente', a: 12, extra: true,
          tit: '¡Puente $A$1!',
          txt: 'La referencia absoluta no se mueve aunque arrastres la fórmula. Cruzas firme a la casilla 12.',
          efecto: '→ casilla 12 · tiras otra vez' },
    19: { ico: '🛏️', nom: 'Posada', pierde: 1,
          tit: 'Posada: la diapositiva de 200 palabras',
          txt: 'Pusiste todo el texto en la diapositiva y el público se durmió… y tu equipo también.',
          efecto: 'Pierdes 1 turno' },
    26: { ico: '🎲', nom: 'Dados', a: 53, extra: true,
          tit: '¡De dado a dado!',
          txt: 'Hipótesis bien planteada: «Si… entonces…». Cuando sabes qué quieres probar, el proyecto avanza solo.',
          efecto: '→ casilla 53 · tiras otra vez' },
    31: { ico: '🕳️', nom: 'Pozo', pierde: 2,
          tit: 'El pozo #¡DIV/0!',
          txt: 'Arrastraste la fórmula del porcentaje sin fijar el total con $ y la columna se llenó de errores.',
          efecto: 'Pierdes 2 turnos' },
    42: { ico: '🌀', nom: 'Laberinto', a: 30,
          tit: 'Laberinto sin estilos',
          txt: 'Escribiste los títulos en negrita, sin estilos de Título. El índice automático no los encuentra… y tú tampoco.',
          efecto: 'Vuelves a la casilla 30' },
    52: { ico: '⛓️', nom: 'Cárcel', pierde: 2,
          tit: 'Cárcel del encabezado',
          txt: 'El encabezado «Informe ICIENTEC» aparece hasta en la portada: faltó el salto de sección y desvincular.',
          efecto: 'Pierdes 2 turnos' },
    53: { ico: '🎲', nom: 'Dados', extra: true,
          tit: 'Dados: datos limpios',
          txt: 'Respuestas bien codificadas en la planilla: CONTAR.SI funciona a la primera.',
          efecto: 'Tiras otra vez' },
    58: { ico: '🔌', nom: 'Apagón', a: 40,
          tit: 'Apagón',
          txt: 'Se cortó la luz y no habías guardado. Vuelves a tu último respaldo.',
          efecto: 'Vuelves a la casilla 40' }
  };

  /* ─────────── Utilidades ─────────── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function q(sel) { return raiz.querySelector(sel); }
  function qa(sel) { return Array.prototype.slice.call(raiz.querySelectorAll(sel)); }
  function azar(n) { return Math.floor(Math.random() * n); }
  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function fmtNum(v) { return typeof v === 'number' ? v.toLocaleString('es-PY') : v; }
  function tcolor(tema) { return 'var(' + TEMAS[tema].v + ')'; }
  function ficha(eq, extra) {
    return '<span class="ficha" style="--c:' + eq.c + '" title="' + esc(eq.nombre) + '"' + (extra || '') + '>' + eq.f + '</span>';
  }
  function hoyISO() { return new Date().toISOString(); }
  function nuevoId() { return 'P' + Date.now().toString(36) + azar(1e6).toString(36); }

  /* Sala = tema del sitio BATIN.
     Sala iluminada → modo oscuro · Sala oscura → modo claro.
     El botón de la OCA y el ☀️/🌙 del menú hacen lo mismo. */
  function salaGuardada() { return document.documentElement.dataset.tema === 'claro' ? 'oscura' : 'iluminada'; }
  function pintarSala(s) {
    raiz.setAttribute('data-sala', s);
    qa('[data-sala-btn]').forEach(function (b) { b.textContent = s === 'oscura' ? '☀️ Sala iluminada' : '🌙 Sala oscura'; });
  }
  function ponerSala(s) {
    if (typeof window.batinAplicarTema === 'function') window.batinAplicarTema(s === 'oscura' ? 'claro' : 'oscuro', true);
    else {
      if (s === 'oscura') document.documentElement.dataset.tema = 'claro'; else delete document.documentElement.dataset.tema;
      try { localStorage.setItem('batin-tema', s === 'oscura' ? 'claro' : 'oscuro'); } catch (e) {}
    }
    pintarSala(s);
  }
  function alternarSala() { ponerSala(salaGuardada() === 'oscura' ? 'iluminada' : 'oscura'); }
  document.addEventListener('batin-tema', function () { pintarSala(salaGuardada()); });

  /* ─────────── Estado ─────────── */
  var S = null;           // estado de la partida en curso
  var reloj = null;       // intervalo del temporizador
  var ocupado = false;    // bloquea clics durante animaciones

  function guardar() { if (S) REG.actual.guardar(S); }

  function temaDeCasilla(c) {
    var t = S.temas;
    return t[(c - 1) % t.length];
  }

  function log(txt) {
    S.log.unshift(txt);
    if (S.log.length > 40) S.log.length = 40;
  }

  /* ═════════════ PANTALLA DE INICIO ═════════════ */
  function pantallaInicio() {
    S = null;
    var previa = REG.actual.leer();
    var cursos = (CFG.cursos && CFG.cursos.length) ? CFG.cursos : ['1° A', '1° B'];
    var cuenta = {};
    BANCO.forEach(function (p) { cuenta[p.tema] = (cuenta[p.tema] || 0) + 1; });

    var html = '' +
      '<div class="o-inicio">' +
      '<div class="o-fila" style="justify-content:space-between;align-items:center">' +
        '<span class="o-kicker">BATIN · 1° curso · Laboratorio</span>' +
        '<button class="o-btn sm" data-sala-btn type="button"></button>' +
      '</div>' +
      '<h1 class="o-h1">La OCA de la Ofimática</h1>' +
      '<p class="o-lead">Excel, Word, PowerPoint y Proyectos en un tablero de 63 casillas. ' +
      'El dado decide cuánto pueden avanzar y qué tan difícil es la pregunta; la respuesta decide si avanzan.</p>';

    if (previa && previa.fase !== 'fin') {
      html += '<div class="o-aviso">' +
        '<span>Hay una partida sin terminar de <b>' + esc(previa.curso) + '</b> (' + previa.equipos.length + ' equipos, ' + previa.resp.length + ' respuestas).</span>' +
        '<span style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="o-btn solid sm" id="o-seguir" type="button">Continuar</button>' +
        '<button class="o-btn sm" id="o-cerrar-previa" type="button">Guardarla y empezar otra</button></span></div>';
    }

    html += '<div class="o-card"><h3>PARTIDA</h3><div class="o-fila">' +
      '<label class="o-campo">Curso<select id="o-curso">' +
        cursos.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') +
      '</select></label>' +
      '<label class="o-campo">Tiempo para responder<select id="o-tiempo">' +
        [[0, 'Sin límite'], [45, '45 segundos'], [60, '1 minuto'], [90, '1 minuto y medio']].map(function (o) {
          return '<option value="' + o[0] + '"' + (o[0] === (CFG.tiempoPorDefecto || 0) ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') +
      '</select></label>' +
      '<label class="o-campo">Cantidad de equipos<select id="o-n-eq">' +
        [2, 3, 4, 5, 6].map(function (n) { return '<option' + (n === 4 ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
      '</select></label>' +
      '</div></div>';

    html += '<div class="o-card"><h3>EQUIPOS</h3><div class="o-equipos" id="o-equipos"></div></div>';

    html += '<div class="o-card"><h3>TEMAS EN JUEGO</h3><div class="o-fila">' +
      ORDEN_TEMAS.map(function (t) {
        return '<label class="o-chk" style="--tc:' + tcolor(t) + '"><input type="checkbox" value="' + t + '" checked data-tema>' +
          '<span class="sw" style="color:' + tcolor(t) + ';font-family:var(--font-mono,monospace);font-weight:700">' + TEMAS[t].letra + '</span> ' +
          TEMAS[t].nom + ' <small style="color:var(--o-txt3)">(' + (cuenta[t] || 0) + ')</small></label>';
      }).join('') +
      '</div></div>';

    html += '<div class="o-card"><h3>CÓMO SE JUEGA</h3><div class="o-reglas">' +
      regla('🎲', '<b>El dado</b> marca cuánto pueden avanzar y la dificultad: 1-2 fácil, 3-4 media, 5-6 difícil.') +
      regla('🎯', '<b>La casilla de destino</b> decide el tema. Aciertan → avanzan. Fallan → se quedan.') +
      regla('🦢', '<b>De oca a oca:</b> saltan a la siguiente oca, aprenden un atajo y tiran otra vez.') +
      regla('🌉', '<b>Puente y dados:</b> buenas prácticas que adelantan.') +
      regla('🕳️', '<b>Pozo, posada, cárcel, laberinto y apagón:</b> errores típicos que atrasan.') +
      regla('🏁', '<b>Meta, casilla 63:</b> hay que llegar justo; si sobra, rebotan hacia atrás.') +
      '</div></div>';

    html += '<div class="o-fila" style="margin-top:24px;justify-content:space-between">' +
      '<a class="o-btn" href="panel.html">📊 Panel de fallas</a>' +
      '<button class="o-btn solid" id="o-empezar" type="button" style="font-size:16px;padding:14px 28px">¡A jugar! →</button>' +
      '</div></div>';

    raiz.innerHTML = html;
    pintarSala(salaGuardada());

    var nEq = q('#o-n-eq');
    function pintarEquipos() {
      var cont = q('#o-equipos');
      var previos = qa('#o-equipos input').map(function (i) { return i.value; });
      var n = Number(nEq.value);
      var h = '';
      for (var i = 0; i < n; i++) {
        var nom = previos[i] || ('Equipo ' + (i + 1));
        h += '<label class="o-eq-input">' + ficha({ c: FICHAS[i].c, f: FICHAS[i].f, nombre: nom }) +
          '<input type="text" maxlength="24" value="' + esc(nom) + '" aria-label="Nombre del equipo ' + (i + 1) + '"></label>';
      }
      cont.innerHTML = h;
    }
    nEq.addEventListener('change', pintarEquipos);
    pintarEquipos();

    q('[data-sala-btn]').addEventListener('click', alternarSala);
    q('#o-empezar').addEventListener('click', empezar);
    var seguir = q('#o-seguir');
    if (seguir) seguir.addEventListener('click', function () { S = previa; pantallaJuego(); });
    var cerrarPrevia = q('#o-cerrar-previa');
    if (cerrarPrevia) cerrarPrevia.addEventListener('click', function () {
      S = previa;
      cerrarPartida(false).then(function () { REG.actual.borrar(); pantallaInicio(); });
    });
  }

  function regla(ico, txt) { return '<div class="o-regla"><span class="ico">' + ico + '</span><span>' + txt + '</span></div>'; }

  function empezar() {
    var temas = qa('[data-tema]').filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
    if (!temas.length) { alert('Elige al menos un tema.'); return; }
    var nombres = qa('#o-equipos input').map(function (i, k) { return (i.value || '').trim() || ('Equipo ' + (k + 1)); });
    S = {
      id: nuevoId(),
      fecha: hoyISO(),
      curso: q('#o-curso').value,
      modo: 'aula',
      tiempo: Number(q('#o-tiempo').value) || 0,
      temas: temas,
      equipos: nombres.map(function (n, i) { return { nombre: n, c: FICHAS[i].c, f: FICHAS[i].f, pos: 0, pierde: 0, ok: 0, mal: 0 }; }),
      turno: 0,
      fase: 'tirar',
      dado: null,
      actual: null,
      usadas: [],
      resp: [],
      log: [],
      ganador: null
    };
    log('Comienza la partida de ' + S.curso + '.');
    guardar();
    pantallaJuego();
  }

  /* ═════════════ PANTALLA DE JUEGO ═════════════ */
  function pantallaJuego() {
    raiz.innerHTML = '' +
      '<div class="o-juego">' +
        '<div class="o-barra">' +
          '<span class="o-titulo">La OCA de la Ofimática<small>' + esc(S.curso) + '</small></span>' +
          '<button class="o-btn sm" data-sala-btn type="button"></button>' +
          '<button class="o-btn sm" id="o-full" type="button">⛶ Pantalla completa</button>' +
          '<button class="o-btn sm" id="o-terminar" type="button">⏹ Terminar partida</button>' +
        '</div>' +
        '<div><div class="tablero" id="o-tablero"></div><div class="salida" id="o-salida"></div></div>' +
        '<aside class="lateral">' +
          '<div class="turno-box" id="o-turno"></div>' +
          '<div class="lista-eq" id="o-lista"></div>' +
          '<div class="leyenda">' + S.temas.map(function (t) {
            return '<span style="--tc:' + tcolor(t) + '"><i class="sw">' + TEMAS[t].letra + '</i>' + TEMAS[t].nom + '</span>';
          }).join('') + '</div>' +
          '<div class="bitacora" id="o-bitacora" aria-live="polite"></div>' +
        '</aside>' +
      '</div>' +
      '<div id="o-capa"></div>';

    pintarSala(salaGuardada());
    q('[data-sala-btn]').addEventListener('click', alternarSala);
    q('#o-full').addEventListener('click', pantallaCompleta);
    q('#o-terminar').addEventListener('click', function () {
      if (S.fase === 'fin') { mostrarFin(); return; }
      if (confirm('¿Terminar la partida ahora? Se guarda lo jugado hasta aquí.')) cerrarPartida(true);
    });

    pintarTodo();

    if (S.fase === 'pregunta' && S.actual) mostrarPregunta();
    else if (S.fase === 'fin') mostrarFin();
    else if (S.fase === 'mover') {
      // Se recargó la página a mitad de un movimiento: se retoma
      var eq = S.equipos[S.turno];
      if (S.mov) mover(eq, S.mov).then(function () { S.mov = null; aplicarCasilla(eq); });
      else aplicarCasilla(eq);
    }
    else revisarPierdeTurno();
  }

  function pantallaCompleta() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (raiz.requestFullscreen) raiz.requestFullscreen();
    } catch (e) {}
  }

  function pintarTodo() { pintarTablero(); pintarTurno(); pintarLista(); pintarBitacora(); }

  function celdaGrid(c) {
    var i = c - 1, fila = Math.floor(i / 9), col = i % 9;
    if (fila % 2 === 1) col = 8 - col;            // serpentina
    return { row: 7 - fila, col: col + 1 };
  }

  function pintarTablero(destino) {
    var h = '';
    for (var c = 1; c <= META; c++) {
      var g = celdaGrid(c), tema = temaDeCasilla(c), clases = 'cas', esp = '', nom = '';
      if (c === META) { clases += ' meta especial'; esp = '🏁'; nom = 'Meta'; }
      else if (OCAS.indexOf(c) >= 0) { clases += ' especial'; esp = '🦢'; nom = 'Oca'; }
      else if (ESP[c]) { clases += ' especial'; esp = ESP[c].ico; nom = ESP[c].nom; }
      if (destino === c) clases += ' destino';
      var aqui = S.equipos.filter(function (e) { return e.pos === c; });
      h += '<div class="' + clases + '" data-c="' + c + '" style="grid-row:' + g.row + ';grid-column:' + g.col + ';--tc:' + tcolor(tema) + '">' +
        '<span class="num">' + c + '</span>' +
        (c === META ? '' : '<span class="letra">' + TEMAS[tema].letra + '</span>') +
        (esp ? '<span class="esp">' + esp + '</span><span class="esp-nom">' + nom + '</span>' : '') +
        '<span class="fichas">' + aqui.map(function (e) { return ficha(e); }).join('') + '</span>' +
        '</div>';
    }
    q('#o-tablero').innerHTML = h;
    var enSalida = S.equipos.filter(function (e) { return e.pos === 0; });
    q('#o-salida').innerHTML = enSalida.length ? 'SALIDA → ' + enSalida.map(function (e) { return ficha(e); }).join('') : '';
  }

  function pintarTurno() {
    var eq = S.equipos[S.turno];
    var box = q('#o-turno');
    box.style.setProperty('--c', eq.c);
    var puede = S.fase === 'tirar';
    box.innerHTML = '<div class="lbl">Turno de</div>' +
      '<div class="eq">' + ficha(eq) + '<span>' + esc(eq.nombre) + '</span></div>' +
      dadoHTML(S.dado) +
      '<button class="o-btn solid btn-tirar" id="o-tirar" type="button"' + (puede ? '' : ' disabled') + '>🎲 Tirar el dado</button>' +
      '<div class="nivel-guia">1-2 fácil · 3-4 media · 5-6 difícil<br><small>(barra espaciadora para tirar)</small></div>';
    q('#o-tirar').addEventListener('click', tirar);
  }

  var PUNTOS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  function dadoHTML(v, rueda) {
    var on = PUNTOS[v] || [];
    var h = '<div class="dado' + (rueda ? ' rueda' : '') + '" id="o-dado" role="img" aria-label="' + (v ? 'Dado: ' + v : 'Dado sin tirar') + '">';
    for (var i = 0; i < 9; i++) h += '<i' + (on.indexOf(i) >= 0 ? ' class="on"' : '') + '></i>';
    return h + '</div>';
  }

  function pintarLista() {
    q('#o-lista').innerHTML = S.equipos.map(function (e, i) {
      return '<div class="it' + (i === S.turno && S.fase !== 'fin' ? ' act' : '') + '">' + ficha(e) +
        '<span class="nm">' + esc(e.nombre) + '</span>' +
        (e.pierde ? '<span class="pt">pierde ' + e.pierde + '</span>' : '') +
        '<span class="ps">' + (e.pos || 'S') + '</span></div>';
    }).join('');
  }

  function pintarBitacora() {
    q('#o-bitacora').innerHTML = S.log.slice(0, 12).map(function (l) { return '<p>' + l + '</p>'; }).join('');
  }

  /* ─────────── Turnos ─────────── */
  function siguienteTurno() {
    S.turno = (S.turno + 1) % S.equipos.length;
    S.dado = null;
    S.fase = 'tirar';
    guardar();
    pintarTodo();
    revisarPierdeTurno();
  }

  function revisarPierdeTurno() {
    if (S.fase !== 'tirar') return;
    var eq = S.equipos[S.turno];
    if (eq.pierde > 0) {
      // Si todos los equipos están castigados, se descuenta igual para no trabar el juego
      eq.pierde--;
      log(ficha(eq) + ' ' + esc(eq.nombre) + ' pierde este turno.');
      guardar();
      pintarLista(); pintarBitacora();
      modalSimple('⏳', esc(eq.nombre) + ' pierde este turno',
        eq.pierde ? 'Le queda ' + eq.pierde + ' turno más de castigo.' : 'En la próxima vuelta vuelve a jugar.',
        'Siguiente equipo →', siguienteTurno, eq.c);
    }
  }

  function tirar() {
    if (ocupado || S.fase !== 'tirar') return;
    ocupado = true;
    var dado = q('#o-dado');
    dado.classList.add('rueda');
    var vueltas = 0;
    var t = setInterval(function () {
      var v = 1 + azar(6);
      dado.outerHTML = dadoHTML(v, true);
      dado = q('#o-dado');
      if (++vueltas >= 9) {
        clearInterval(t);
        var final = 1 + azar(6);
        S.dado = final;
        dado.outerHTML = dadoHTML(final);
        ocupado = false;
        prepararPregunta(final);
      }
    }, 70);
  }

  function destinoCon(pos, d) {
    var c = pos, dir = 1;
    for (var k = 0; k < d; k++) { if (c === META) dir = -1; c += dir; }
    return c;
  }

  function elegirPregunta(tema, nivel) {
    var pool = BANCO.filter(function (p) { return p.tema === tema; });
    if (!pool.length) return null;
    var libres = pool.filter(function (p) { return S.usadas.indexOf(p.id) < 0; });
    if (!libres.length) {
      // Se usaron todas las de este tema: se liberan
      S.usadas = S.usadas.filter(function (id) { return !pool.some(function (p) { return p.id === id; }); });
      libres = pool;
    }
    for (var dist = 0; dist <= 2; dist++) {
      var cand = libres.filter(function (p) { return Math.abs(p.n - nivel) === dist; });
      if (cand.length) return cand[azar(cand.length)];
    }
    return libres[azar(libres.length)];
  }

  function prepararPregunta(d) {
    var eq = S.equipos[S.turno];
    var destino = destinoCon(eq.pos, d);
    var nivel = d <= 2 ? 1 : d <= 4 ? 2 : 3;
    var tema = temaDeCasilla(destino);
    var p = elegirPregunta(tema, nivel);
    if (!p) { alert('No hay preguntas del tema ' + tema + '. Revisa preguntas.js'); return; }
    S.usadas.push(p.id);
    S.actual = { qid: p.id, dado: d, destino: destino, nivel: nivel, orden: mezclar(p.op.map(function (_, i) { return i; })), respondida: null };
    S.fase = 'pregunta';
    guardar();
    pintarTurno();
    pintarTablero(destino);
    mostrarPregunta();
  }

  /* ─────────── Visuales (planilla, diapositiva, páginas) ─────────── */
  function parseRef(ref) {
    var m = /^([A-Z]+)(\d+)$/.exec(ref || '');
    return m ? { col: m[1], fila: Number(m[2]) } : null;
  }

  function visual(v) {
    if (!v || !v.tipo) return '';

    if (v.tipo === 'formula') {
      return '<div class="xl solo-fx"><div class="fx"><span class="f">fx</span><span class="val">' + esc(v.texto) + '</span></div></div>';
    }

    if (v.tipo === 'celdas') {
      var act = parseRef(v.activa), desde = v.desde || 1;
      var h = '<div class="xl">';
      if (v.barra || act) {
        h += '<div class="fx"><span class="ref">' + esc(v.activa || '') + '</span><span class="f">fx</span><span class="val">' + esc(v.barra || '') + '</span></div>';
      }
      h += '<table><thead><tr><th></th>' + v.cols.map(function (c) {
        return '<th' + (act && act.col === c ? ' class="act"' : '') + '>' + esc(c) + '</th>';
      }).join('') + '</tr></thead><tbody>';
      v.filas.forEach(function (fila, i) {
        var nf = desde + i;
        h += '<tr><th' + (act && act.fila === nf ? ' class="act"' : '') + '>' + nf + '</th>';
        v.cols.forEach(function (c, j) {
          var val = fila[j];
          var cls = [];
          if (typeof val === 'number') cls.push('num');
          if (typeof val === 'string' && val.charAt(0) === '#') cls.push('err');
          if (act && act.col === c && act.fila === nf) cls.push('act');
          h += '<td' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + esc(fmtNum(val == null ? '' : val)) + '</td>';
        });
        h += '</tr>';
      });
      return h + '</tbody></table></div>';
    }

    if (v.tipo === 'diapo') {
      var txt = Array.isArray(v.texto) ? v.texto : (v.texto ? [v.texto] : []);
      return '<div class="diapo' + (v.arcoiris ? ' arcoiris' : '') + '" style="background:' + esc(v.fondo || '#fff') + ';color:' + esc(v.color || '#111') + '">' +
        '<div class="dt">' + esc(v.titulo || '') + '</div>' +
        (txt.length ? '<ul>' + txt.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '</div>';
    }

    if (v.tipo === 'paginas') {
      var ultimaSec = null;
      return '<div class="pags">' + v.pags.map(function (pg) {
        if (pg.corte) return '<div class="corte">SALTO DE SECCIÓN</div>';
        var etiqueta = pg.sec && pg.sec !== ultimaSec ? '<span class="sec">Sección ' + pg.sec + '</span>' : '';
        ultimaSec = pg.sec;
        return '<div class="pag">' + etiqueta +
          '<div class="en">' + esc(pg.enc || '') + '</div>' +
          '<div class="cu">' + esc(pg.txt || '') + '</div>' +
          '<div class="pi">' + esc(pg.pie || '') + '</div></div>';
      }).join('') + '</div>';
    }
    return '';
  }

  /* ─────────── Pregunta ─────────── */
  function preguntaPorId(id) { for (var i = 0; i < BANCO.length; i++) if (BANCO[i].id === id) return BANCO[i]; return null; }

  function mostrarPregunta() {
    var A = S.actual, p = preguntaPorId(A.qid), eq = S.equipos[S.turno];
    if (!p) { S.actual = null; S.fase = 'tirar'; guardar(); pintarTodo(); return; }
    var letras = ['A', 'B', 'C', 'D', 'E', 'F'];
    var h = '<div class="velo"><div class="modal" role="dialog" aria-modal="true" style="--tc:' + tcolor(p.tema) + '">' +
      '<div class="m-cab">' + ficha(eq) + '<b style="color:var(--o-txt)">' + esc(eq.nombre) + '</b>' +
        '<span class="chip">' + TEMAS[p.tema].letra + ' · ' + TEMAS[p.tema].nom + '</span>' +
        '<span class="chip" style="--tc:var(--o-txt2)">' + esc(p.sub) + '</span>' +
        '<span class="chip" style="--tc:var(--o-txt2)">🎲 ' + A.dado + ' · ' + NIVEL_NOM[A.nivel] + '</span>' +
        '<span>Si aciertan → casilla ' + A.destino + '</span>' +
        (S.tiempo ? '<span class="reloj" id="o-reloj">' + S.tiempo + '</span>' : '') +
      '</div>' +
      '<div class="m-q">' + esc(p.q) + '</div>' +
      (p.v ? '<div class="m-vis">' + visual(p.v) + '</div>' : '') +
      '<div class="m-ops">' + A.orden.map(function (idx, k) {
        var o = p.op[idx];
        var cont = (typeof o === 'object') ? '<span class="cont">' + visual(Object.assign({ tipo: 'diapo' }, o.d)) + '<span>' + esc(o.t) + '</span></span>'
                                           : '<span class="cont">' + esc(o) + '</span>';
        return '<button class="op" type="button" data-idx="' + idx + '"><span class="k">' + letras[k] + '</span>' + cont + '</button>';
      }).join('') + '</div>' +
      '<div id="o-ver"></div>' +
      '<div class="m-pie"><button class="o-btn sm izq" id="o-anular" type="button" title="Si la pregunta tiene un error, se descarta sin contar">Anular pregunta</button>' +
        '<button class="o-btn solid oca-hidden" id="o-seguir-q" type="button">Continuar →</button></div>' +
      '</div></div>';
    q('#o-capa').innerHTML = h;
    qa('.op').forEach(function (b) { b.addEventListener('click', function () { responder(Number(b.dataset.idx)); }); });
    q('#o-anular').addEventListener('click', anular);
    q('#o-seguir-q').addEventListener('click', despuesDeResponder);

    if (A.respondida !== null && A.respondida !== undefined) { marcar(A.respondida); return; }
    iniciarReloj();
  }

  function iniciarReloj() {
    pararReloj();
    if (!S.tiempo) return;
    var quedan = S.tiempo;
    reloj = setInterval(function () {
      quedan--;
      var r = q('#o-reloj');
      if (r) { r.textContent = quedan; r.classList.toggle('poco', quedan <= 10); }
      if (quedan <= 0) { pararReloj(); responder(-1); }
    }, 1000);
  }
  function pararReloj() { if (reloj) { clearInterval(reloj); reloj = null; } }

  function responder(idx) {
    var A = S.actual;
    if (!A || (A.respondida !== null && A.respondida !== undefined)) return;
    pararReloj();
    var p = preguntaPorId(A.qid), eq = S.equipos[S.turno];
    var ok = idx === 0;
    A.respondida = idx;
    var elegida = idx < 0 ? '(se acabó el tiempo)' : (typeof p.op[idx] === 'object' ? p.op[idx].t : p.op[idx]);
    S.resp.push({ t: hoyISO(), eq: eq.nombre, qid: p.id, tema: p.tema, sub: p.sub, n: p.n, ok: ok, elegida: String(elegida).slice(0, 120) });
    if (ok) eq.ok++; else eq.mal++;
    guardar();
    marcar(idx);
  }

  function marcar(idx) {
    var p = preguntaPorId(S.actual.qid);
    var ok = idx === 0;
    qa('.op').forEach(function (b) {
      b.disabled = true;
      var i = Number(b.dataset.idx);
      if (i === 0) b.classList.add('bien');
      else if (i === idx) b.classList.add('mal');
    });
    q('#o-ver').innerHTML = '<div class="m-veredicto' + (ok ? '' : ' mal') + '"><b class="tit">' +
      (ok ? '✔ ¡Correcto! Avanzan a la casilla ' + S.actual.destino : (idx < 0 ? '⏱ Se acabó el tiempo. Se quedan donde están.' : '✘ Incorrecto. Se quedan donde están.')) +
      '</b>' + esc(p.ex) + '</div>';
    q('#o-anular').classList.add('oca-hidden');
    var b = q('#o-seguir-q');
    b.classList.remove('oca-hidden');
    b.focus();
  }

  function anular() {
    if (!confirm('¿Anular esta pregunta? No cuenta como acierto ni como error y el equipo vuelve a tirar.')) return;
    pararReloj();
    log('Pregunta ' + esc(S.actual.qid) + ' anulada.');
    S.actual = null; S.dado = null; S.fase = 'tirar';
    guardar();
    cerrarCapa();
    pintarTodo();
  }

  function cerrarCapa() { var c = q('#o-capa'); if (c) c.innerHTML = ''; }

  function despuesDeResponder() {
    var A = S.actual, eq = S.equipos[S.turno];
    cerrarCapa();
    S.actual = null;
    if (A.respondida !== 0) {
      log(ficha(eq) + ' ' + esc(eq.nombre) + ' falló (' + TEMAS[preguntaPorId(A.qid).tema].nom + ').');
      siguienteTurno();
      return;
    }
    log(ficha(eq) + ' ' + esc(eq.nombre) + ' acertó y avanza a la ' + A.destino + '.');
    S.fase = 'mover';
    S.mov = A.dado;
    guardar();
    mover(eq, A.dado).then(function () { S.mov = null; return aplicarCasilla(eq); });
  }

  function mover(eq, pasos) {
    ocupado = true;
    var dir = 1, k = 0;
    return new Promise(function (resolve) {
      (function paso() {
        if (k >= pasos) { ocupado = false; resolve(); return; }
        if (eq.pos === META) dir = -1;
        eq.pos += dir; k++;
        pintarTablero(); pintarLista();
        var cel = q('.cas[data-c="' + eq.pos + '"]');
        if (cel) cel.classList.add('pisa');
        setTimeout(paso, 170);
      })();
    });
  }

  function saltar(eq, a) { eq.pos = a; pintarTablero(); pintarLista(); var cel = q('.cas[data-c="' + a + '"]'); if (cel) cel.classList.add('pisa'); }

  function aplicarCasilla(eq) {
    var c = eq.pos;
    guardar();
    if (c === META) return ganar(eq);

    var oca = OCAS.indexOf(c);
    if (oca >= 0) {
      var sig = OCAS[oca + 1] || META;
      modalSimple('🦢', '¡De oca a oca!', '<b>Atajo:</b> ' + esc(TIPS_OCA[c] || ''),
        sig === META ? '¡Al jardín de la oca! →' : 'Saltar a la ' + sig + ' y tirar otra vez →', function () {
          saltar(eq, sig);
          log(ficha(eq) + ' de oca a oca hasta la ' + sig + '.');
          if (sig === META) { ganar(eq); return; }
          otraVez();
        }, eq.c, '→ casilla ' + sig + ' · tiras otra vez');
      return;
    }

    var e = ESP[c];
    if (!e) { siguienteTurno(); return; }
    modalSimple(e.ico, e.tit, esc(e.txt), 'Continuar →', function () {
      if (e.a) { saltar(eq, e.a); }
      if (e.pierde) { eq.pierde += e.pierde; }
      log(ficha(eq) + ' ' + esc(eq.nombre) + ' cayó en ' + e.nom + ': ' + esc(e.efecto) + '.');
      if (eq.pos === META) { ganar(eq); return; }
      if (e.extra) otraVez(); else siguienteTurno();
    }, eq.c, e.efecto);
  }

  function otraVez() {
    S.dado = null; S.fase = 'tirar';
    guardar();
    pintarTodo();
  }

  function modalSimple(ico, tit, txt, boton, alCerrar, color, efecto) {
    q('#o-capa').innerHTML = '<div class="velo"><div class="modal esp-modal" role="dialog" aria-modal="true" style="--tc:' + (color || 'var(--o-acento)') + '">' +
      '<div class="gran">' + ico + '</div><h2>' + tit + '</h2><p>' + txt + '</p>' +
      (efecto ? '<div class="efecto">' + esc(efecto) + '</div>' : '') +
      '<div class="m-pie" style="justify-content:center"><button class="o-btn solid" id="o-ok" type="button">' + boton + '</button></div>' +
      '</div></div>';
    var b = q('#o-ok');
    b.focus();
    b.addEventListener('click', function () { cerrarCapa(); alCerrar(); });
  }

  /* ─────────── Fin de la partida ─────────── */
  function ganar(eq) {
    S.ganador = eq.nombre;
    log('🏁 ' + ficha(eq) + ' ' + esc(eq.nombre) + ' llegó a la meta.');
    cerrarPartida(true);
  }

  function partidaParaRegistro() {
    return {
      id: S.id, fecha: S.fecha, curso: S.curso, modo: S.modo || 'aula',
      ganador: S.ganador, terminada: true,
      equipos: S.equipos.map(function (e) { return { nombre: e.nombre, pos: e.pos, ok: e.ok, mal: e.mal }; }),
      respuestas: S.resp
    };
  }

  var estadoEnvio = '';
  function cerrarPartida(mostrar) {
    pararReloj();
    S.fase = 'fin';
    guardar();
    estadoEnvio = 'Guardando…';
    var pr = REG.registrarFin(partidaParaRegistro()).then(function (r) {
      estadoEnvio = {
        'sin-endpoint': '💾 Guardada en este navegador. (Para que llegue a tu planilla, configura el endpoint en config.js.)',
        'enviado':      '💾 Guardada en este navegador y ☁️ enviada a la planilla.',
        'sin-conexion': '💾 Guardada en este navegador. ☁️ Sin conexión: se enviará la próxima vez que se abra el juego con internet.',
        'nada':         '💾 Guardada en este navegador.'
      }[r] || '💾 Guardada.';
      var el = q('#o-estado-envio'); if (el) el.textContent = estadoEnvio;
    });
    if (mostrar) { pintarTodo(); mostrarFin(); }
    return pr;
  }

  function mostrarFin() {
    var rank = S.equipos.slice().sort(function (a, b) { return b.pos - a.pos || b.ok - a.ok; });
    var porTema = {};
    S.resp.forEach(function (r) {
      var t = porTema[r.tema] || (porTema[r.tema] = { ok: 0, tot: 0 });
      t.tot++; if (r.ok) t.ok++;
    });
    var filas = ORDEN_TEMAS.filter(function (t) { return porTema[t]; }).map(function (t) {
      var d = porTema[t], pct = Math.round(100 * d.ok / d.tot);
      return '<tr><td><b style="color:' + tcolor(t) + '">' + TEMAS[t].letra + '</b> ' + TEMAS[t].nom + '</td>' +
        '<td class="num">' + d.ok + ' / ' + d.tot + '</td><td class="num">' + pct + '%</td>' +
        '<td><div class="barra-pct"><i style="width:' + pct + '%"></i></div></td></tr>';
    }).join('');

    q('#o-capa').innerHTML = '<div class="velo"><div class="modal" role="dialog" aria-modal="true">' +
      '<div class="esp-modal"><div class="gran">🏁</div><h2>' + (S.ganador ? '¡Ganó ' + esc(S.ganador) + '!' : 'Partida terminada') + '</h2></div>' +
      '<div class="fin-podio">' + rank.map(function (e, i) {
        return '<div class="it"><b>' + (i + 1) + '°</b>' + ficha(e) + '<span>' + esc(e.nombre) + '</span>' +
          '<span class="ps">casilla ' + (e.pos || 'S') + ' · ' + e.ok + ' ✔ · ' + e.mal + ' ✘</span></div>';
      }).join('') + '</div>' +
      (filas ? '<h3 style="font-family:var(--font-title,sans-serif);font-size:13px;margin-top:10px">ACIERTOS POR TEMA EN ESTA PARTIDA</h3>' +
        '<table class="tabla-res"><thead><tr><th>Tema</th><th class="num">Aciertos</th><th class="num">%</th><th></th></tr></thead><tbody>' + filas + '</tbody></table>' : '') +
      '<div class="estado-envio" id="o-estado-envio">' + esc(estadoEnvio) + '</div>' +
      '<div class="m-pie"><button class="o-btn izq" id="o-ver-tab" type="button">Ver el tablero</button>' +
        '<a class="o-btn" href="panel.html">📊 Panel de fallas</a>' +
        '<button class="o-btn solid" id="o-nueva" type="button">Nueva partida</button></div>' +
      '</div></div>';
    q('#o-ver-tab').addEventListener('click', cerrarCapa);
    q('#o-nueva').addEventListener('click', function () { REG.actual.borrar(); pantallaInicio(); window.scrollTo(0, 0); });
  }

  /* ─────────── Teclado (para manejar desde el escritorio del proyector) ─────────── */
  document.addEventListener('keydown', function (ev) {
    if (!S) return;
    var tag = (ev.target && ev.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    var capa = q('#o-capa');
    var hayModal = capa && capa.innerHTML;
    if (!hayModal && S.fase === 'tirar' && (ev.code === 'Space' || ev.key === ' ')) { ev.preventDefault(); tirar(); return; }
    if (hayModal && S.fase === 'pregunta' && S.actual && (S.actual.respondida === null || S.actual.respondida === undefined)) {
      var k = ev.key.toUpperCase(), pos = 'ABCDEF'.indexOf(k);
      if (pos < 0 && /^[1-6]$/.test(ev.key)) pos = Number(ev.key) - 1;
      var botones = qa('.op');
      if (pos >= 0 && botones[pos]) { ev.preventDefault(); botones[pos].click(); }
    }
  });

  /* Reintentar envíos pendientes al abrir */
  if (REG.pendientes()) REG.enviarPendientes();

  pintarSala(salaGuardada());
  pantallaInicio();
})();
