/* ═══════════════════════════════════════════
   BATIN · Arcade de 2° · CONFIGURACIÓN
═══════════════════════════════════════════ */

window.AR_CONFIG = {

  /* URL de la aplicación web de Apps Script (el mismo Code.gs de la OCA).
     Vacía = se guarda solo en este navegador. */
  endpoint: '',

  /* Cursos que aparecen al empezar. */
  cursos: ['2° A', '2° B', '2° C'],

  /* Puntos por nivel de Bloom (3 aplicar · 4 analizar · 5 evaluar · 6 crear) */
  puntosNivel: { 3: 100, 4: 150, 5: 200, 6: 250 },

  /* 🐱 Gatiel detective: % que se descuenta por cada lupa (pista) */
  descuentoPista: 30,

  /* 🤖 La flota de Bit */
  flota: {
    tamano: 6,                 // tablero de 6 × 6
    barcos: [3, 2, 2, 1],      // largo de cada barco
    subirNivelCada: 3          // cada 3 aciertos, los desafíos suben de nivel
  },

  /* 👩‍💻 Copa Techi: rondas, nivel, cantidad de preguntas y segundos por pregunta */
  copa: [
    { nombre: 'Calentamiento', nv: 3, preguntas: 5, segundos: 75 },
    { nombre: 'Análisis',      nv: 4, preguntas: 5, segundos: 100 },
    { nombre: 'Evaluación',    nv: 5, preguntas: 4, segundos: 120 },
    { nombre: 'Gran final',    nv: 6, preguntas: 3, segundos: 180 }
  ]

};
