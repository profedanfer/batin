/* ═══════════════════════════════════════════
   BATIN · Sistema en Producción
   CONFIGURACIÓN
═══════════════════════════════════════════ */

window.SP_CONFIG = {

  /* URL de la aplicación web de Apps Script. Sirve la misma de la OCA
     (es el mismo Code.gs). Vacía = se guarda solo en este navegador. */
  endpoint: '',

  /* Cursos que aparecen al crear un equipo. */
  cursos: ['3° A', '3° B', '3° C'],

  /* Sala de ÁRBOLES (ABB). Ponla en true cuando ya la hayan visto en clase
     (después de la feria). Mientras esté en false, la sala no aparece. */
  arboles: false,

  /* Tiempo objetivo en minutos (0 = sin límite; solo se muestra el cronómetro).
     Si se pasa del tiempo, el juego sigue, pero el cronómetro se pone en rojo. */
  tiempoObjetivo: 0,

  /* Puntos: cada reto vale 'puntosReto'; se descuenta 'castigoError' por
     cada intento fallido y 'castigoPista' si se usó la pista. Nunca baja de 'minimoReto'. */
  puntosReto: 100,
  castigoError: 20,
  castigoPista: 20,
  minimoReto: 40

};
