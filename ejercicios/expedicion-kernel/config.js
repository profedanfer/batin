/* ═══════════════════════════════════════════
   BATIN · Expedición Kernel
   CONFIGURACIÓN
═══════════════════════════════════════════ */

window.EK_CONFIG = {

  /* URL de la aplicación web de Apps Script. Sirve la misma de la OCA
     (es el mismo Code.gs). Vacía = se guarda solo en este navegador. */
  endpoint: '',

  /* Cursos que aparecen al crear una partida. */
  cursos: ['3° A', '3° B', '3° C'],

  /* Desafíos de ÁRBOLES (ABB) en el Archipiélago. Ponlo en true cuando
     ya los hayan visto en clase. */
  arboles: false,

  /* Puntos por nivel de Bloom. La tormenta duplica; la pista descuenta un %. */
  puntosNivel: { 3: 100, 4: 150, 5: 200, 6: 250 },
  descuentoPista: 30,      // % que se descuenta si usan la pista
  bonoGuardian: 200,       // al vencer a un guardián
  bonoBug: 50,             // al aplastar un bug

  /* Comodines con los que arranca cada jugador o equipo. */
  comodinesIniciales: { pista: 1, mitad: 0, dado: 0 },

  /* SIMULACRO DE EXAMEN */
  simulacro: {
    preguntas: 15,         // cantidad de preguntas
    minutos: 30,           // tiempo (0 = sin límite)
    /* Peso de cada pregunta según el nivel */
    peso: { 3: 1, 4: 2, 5: 3, 6: 3 },
    /* Escala de notas: % mínimo para cada nota. Ajústala a tu exigencia. */
    escala: [
      { desde: 0,  nota: 1 },
      { desde: 60, nota: 2 },
      { desde: 70, nota: 3 },
      { desde: 80, nota: 4 },
      { desde: 90, nota: 5 }
    ]
  }

};
