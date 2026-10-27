/* BATIN · Arcade de 1° — portada */
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
    '<div class="a-kicker">// 1° curso · Laboratorio 1 · juegos de repaso</div>' +
    '<h1 class="a-h1">🕹️ Arcade de 1°</h1>' +
    '<p class="a-lead"><b>Gatiel, Bit y Techi</b> trajeron un juego cada uno para repasar lo de todo el año: <b>Excel, encuestas y tabulación, el informe en Word, la presentación y la viabilidad del proyecto</b>. Nada de preguntas de memoria: los desafíos van de N3 (aplicar) a N6 (crear), con planillas, informes y diapositivas de verdad.</p>' +
    A.personaje('techi', '«En la feria nadie te pregunta qué es una celda. Te preguntan de dónde sale tu 62 %, por qué tu gráfico es una torta y si tu proyecto se puede hacer. Para eso son estos juegos. ¿Empezamos?»', 'saludando', 'var(--te)') +
    '<div class="a-juegos">' +
      tarjeta('auditoria.html', 'Gatiel', 'var(--ga)', '../../img/gatiel_leyendo.png', '🐱', 'Gatiel audita la feria', 'auditoría',
        'Cuatro proyectos «con trampa»: una encuesta que cuenta de menos, un informe que nadie encuentra, una diapositiva que no cuadra y un proyecto imposible. Calcula, señala lo que no cierra, juzga y rehaz.',
        ['🕵️ expedientes', 'planilla + informe + PPT', 'solo o por relevos']) +
      tarjeta('planilla.html', 'Bit', 'var(--bi)', '../../img/bit_motivando.png', '🤖', 'La planilla de Bit', 'territorio',
        'La hoja de cálculo es el tablero. Elige el riesgo (N3 = 1 celda … N6 = un rango de 4), resuelve el desafío y conquista escribiendo el rango como en Excel. Un error y te sale #¡REF!',
        ['🗺️ estrategia', 'referencias y rangos', 'contra Bit o 2–4 equipos']) +
      tarjeta('feria.html', 'Techi', 'var(--te)', '../../img/techi_accion.png', '👩‍💻', 'Simulacro ICIENTEC', 'feria contra reloj',
        'Cuatro stands que suben de nivel: datos, informe, presentación y defensa ante el jurado. Comodines, nervios, repreguntas entre equipos y una rúbrica final que te dice qué reforzar.',
        ['⏱️ contra reloj', 'jurado de 3 criterios', 'solo o 2–4 equipos']) +
    '</div>' +
    '<div class="a-card"><h3>¿Qué se repasa?</h3><div class="a-fila" style="align-items:center">' +
      Object.keys(A.TEMA).map(function (k) { return '<span class="a-chip">' + A.TEMA[k].ico + ' ' + A.TEMA[k].nom + '</span>'; }).join('') +
      '<span style="color:var(--texto2);font-size:14px">· en las fórmulas se usa «;» para separar argumentos, como en el Excel en español.</span></div></div>' +
    '<p style="margin-top:18px;font-size:13px;color:var(--texto3)">Tus respuestas se guardan en este navegador. <a href="panel.html" style="color:var(--juego)">Panel de fallas (docente)</a> · ¿Algo más tranquilo? <a href="../oca-ofimatica/index.html" style="color:var(--juego)">La OCA de la Ofimática</a></p>' +
    '</div>';
})();
