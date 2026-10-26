/* BATIN · Arcade de 2° — portada */
(function () {
  'use strict';
  var raiz = document.getElementById('ar'); if (!raiz || !window.AR) return;
  var A = window.AR;
  function tarjeta(href, quien, color, img, emo, titulo, rol, txt, tags) {
    return '<a class="a-juego" href="' + href + '" style="--jc:' + color + '">' +
      '<div class="top"><img src="' + img + '" alt="" onerror="this.outerHTML=\'<span class=&quot;emo&quot;>' + emo + '</span>\'"></div>' +
      '<div class="quien">' + quien + ' · ' + rol + '</div><h2>' + titulo + '</h2><p>' + txt + '</p>' +
      '<div class="tags">' + tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
      '<div class="ir">Jugar →</div></a>';
  }
  raiz.innerHTML = '<div class="a-wrap">' +
    '<div class="a-kicker">// 2° curso · repaso para el examen · juegos</div>' +
    '<h1 class="a-h1">🕹️ Arcade de 2°</h1>' +
    '<p class="a-lead">Se viene el examen y en BATIN se armó el arcade. <b>Gatiel, Bit y Techi</b> trajeron un juego cada uno para que repases lo mismo desde tres ángulos: <b>pseudocódigo y prueba de escritorio, vectores, matrices y Python</b>. Los desafíos van de N3 (aplicar) a N6 (crear).</p>' +
    A.personaje('techi', '«En el examen no alcanza con memorizar: te van a pedir seguir un algoritmo, encontrar un error y decidir cuál solución es mejor. Por eso cada juego sube de nivel. ¿Empezamos?»', 'saludando', 'var(--te)') +
    '<div class="a-juegos">' +
      tarjeta('detective.html', 'Gatiel', 'var(--ga)', '../../img/gatiel_leyendo.png', '🐱', 'Gatiel, detective de código', 'detective',
        'Cuatro misterios del colegio: un boletín que miente, una cantina que cobra de más, asientos fantasma y un sorteo trucho. Interroga a las variables, acusa a la línea culpable y corrige el código.',
        ['🕵️ historia', 'prueba de escritorio', 'solo o en equipo']) +
      tarjeta('flota.html', 'Bit', 'var(--bi)', '../../img/bit_motivando.png', '🤖', 'La flota de Bit', 'batalla naval',
        'Batalla naval sobre una matriz. Cada desafío resuelto te da un disparo, pero hay que escribir la celda bien: tablero[f,c] en PSeInt o tablero[f][c] en Python. Contra Bit o equipo contra equipo.',
        ['🎯 suerte + saber', 'índices', '1 o 2 equipos']) +
      tarjeta('copa.html', 'Techi', 'var(--te)', '../../img/techi_accion.png', '👩‍💻', 'Copa Techi', 'torneo relámpago',
        'Cuatro rondas contra el reloj: calentamiento (N3), análisis (N4), evaluación (N5) y la gran final (N6). Rachas que multiplican, un comodín y el salón de la fama.',
        ['⏱️ contra reloj', 'ranking', 'hasta 4 equipos']) +
    '</div>' +
    '<div class="a-card"><h3>¿Qué se repasa?</h3><div class="a-fila" style="align-items:center">' +
      Object.keys(A.TEMA).map(function (k) { return '<span class="a-chip">' + A.TEMA[k].ico + ' ' + A.TEMA[k].nom + '</span>'; }).join('') +
      '<span style="color:var(--texto2);font-size:14px">· en PSeInt los índices empiezan en 1 (m[f,c]); en Python, en 0 (m[f][c]).</span></div></div>' +
    '<p style="margin-top:18px;font-size:13px;color:var(--texto3)">Tus respuestas se guardan en este navegador. <a href="panel.html" style="color:var(--juego)">Panel de fallas (docente)</a> · ¿Quieres más? <a href="../laberinto-del-tiempo/index.html" style="color:var(--juego)">Bit y el Laberinto del Tiempo</a></p>' +
    '</div>';
})();
