/* ═══════════════════════════════════════════
   BATIN · Arcade de 1° · CONFIGURACIÓN
═══════════════════════════════════════════ */

window.AR_CONFIG = {

  /* URL de la aplicación web de Apps Script (el mismo Code.gs de la OCA).
     Vacía = se guarda solo en este navegador. */
  endpoint: '',

  /* Cursos que aparecen al empezar. */
  cursos: ['1° A', '1° B', '1° C'],

  /* Puntos por nivel de Bloom (3 aplicar · 4 analizar · 5 evaluar · 6 crear) */
  puntosNivel: { 3: 100, 4: 150, 5: 200, 6: 250 },

  /* 🐱 Auditoría de Gatiel: % que se descuenta por cada lupa (pista) */
  descuentoPista: 30,

  /* 🤖 La planilla de Bit */
  planilla: {
    columnas: 6,                     // A … F
    filas: 6,                        // 1 … 6
    rondas: 6,                       // jugadas por equipo
    premio: { 3: 1, 4: 2, 5: 3, 6: 4 },   // cuántas celdas puede tomar según el nivel
    robarDesde: 5,                   // desde este nivel se pueden tomar celdas de otro equipo
    celdasFx: 3,                     // celdas «fx»: valen +2
    celdasFijas: 2,                  // celdas «$»: una vez tomadas no se pueden robar
    bonusLinea: 4,                   // fila o columna completa del mismo equipo
    segundos: 0,                     // tiempo por desafío (0 = sin límite)
    aciertoBit: 0.7                  // probabilidad de que Bit acierte su desafío
  },

  /* 👩‍💻 Simulacro ICIENTEC: los stands, su nivel, preguntas por equipo y segundos */
  feria: [
    { nombre: 'Stand de datos',        ico: '📊', nv: 3, temas: ['excel', 'datos'],            preguntas: 3, segundos: 90 },
    { nombre: 'Revisión del informe',  ico: '📄', nv: 4, temas: ['word', 'excel', 'datos'],    preguntas: 3, segundos: 110 },
    { nombre: 'La presentación',       ico: '🖥️', nv: 5, temas: ['ppt', 'datos', 'proyecto'], preguntas: 3, segundos: 130 },
    { nombre: 'Defensa ante el jurado', ico: '🎤', nv: 6, temas: ['proyecto', 'ppt', 'word'],  preguntas: 2, segundos: 170 }
  ]

};
