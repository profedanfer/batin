/* ═══════════════════════════════════════════════════════════════
   BATIN · Expedición Kernel · 3er curso
   REGIONES Y DESAFÍOS  —  este es el archivo que se edita
   ═══════════════════════════════════════════════════════════════

   NIVELES (taxonomía de Bloom, como en el sitio)
   nv: 3 = aplicar · 4 = analizar · 5 = evaluar · 6 = crear
   El dado decide el nivel: 1–2 → N3 · 3–4 → N4 · 5–6 → N5

   TIPOS DE DESAFÍO
   ----------------
   opcion     → op: [...]  ⚠ la PRIMERA opción es la correcta (se mezclan solas)
   valor      → acepta: ['22', ...]  respuestas válidas (no importan mayúsculas,
                espacios de más ni comas; "3, 1, 3.5" = "3 1 3.5")
   linea      → code + correcta: número de línea (se hace clic en la línea)
   ordenar    → lineas: [...] en el orden CORRECTO (el juego las desordena)
   clasificar → categorias: [...], items: [{ t: 'texto', c: 'categoría' }]
   sql        → solucion: 'SELECT ...'  (se compara el RESULTADO, no el texto)
                orden: true si importa el orden de las filas
                cambio: true + verificar: 'SELECT ...' para UPDATE/DELETE
   simular    → est: 'pila' | 'cola' | 'lista', fichas: [...], pasos: [...],
                ops: la solución, por ejemplo [['in','Ana'], ['out']]
                (lista: ['ini', x], ['fin', x], ['del', x])

   Campos comunes: id (único), nv, sub (subtema), q (consigna),
   code {lang:'java'|'sql'|'pseudo'|'txt', txt}, pista, ex (explicación).
   opcional: 'arboles' → solo aparece si en config.js arboles: true
   ═══════════════════════════════════════════════════════════════ */

/* Base de datos del Puerto SQL (se carga en el navegador con SQLite) */
window.EK_BD = [
  "CREATE TABLE colegios (id_colegio INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);",
  "CREATE TABLE jugadores (id_jugador INTEGER PRIMARY KEY, nombre TEXT NOT NULL, id_colegio INTEGER NOT NULL REFERENCES colegios(id_colegio), posicion TEXT NOT NULL, edad INTEGER NOT NULL);",
  "CREATE TABLE partidos (id_partido INTEGER PRIMARY KEY, fecha TEXT NOT NULL, id_local INTEGER NOT NULL REFERENCES colegios(id_colegio), id_visitante INTEGER NOT NULL REFERENCES colegios(id_colegio), goles_local INTEGER NOT NULL, goles_visitante INTEGER NOT NULL);",
  "CREATE TABLE goles (id_gol INTEGER PRIMARY KEY, id_partido INTEGER NOT NULL REFERENCES partidos(id_partido), id_jugador INTEGER NOT NULL REFERENCES jugadores(id_jugador), minuto INTEGER NOT NULL);",
  "INSERT INTO colegios VALUES (1,'Colegio Arandu','Asunción'),(2,'Liceo Ñandutí','Itauguá'),(3,'Colegio Yvága','Luque'),(4,'Instituto Tekove','San Lorenzo'),(5,'Colegio Mbaracayú','Asunción');",
  "INSERT INTO jugadores VALUES (1,'Lucas Giménez',1,'Delantero',17),(2,'Tomás Ayala',1,'Medio',16),(3,'Iván Rojas',1,'Arquero',17),(4,'Bruno Cáceres',2,'Delantero',18),(5,'Hugo Martínez',2,'Defensa',16),(6,'Elías Vera',3,'Delantero',15),(7,'Marcos Riveros',3,'Medio',17),(8,'Nicolás Paredes',4,'Delantero',16),(9,'Fabián López',4,'Defensa',18),(10,'Gustavo Insfrán',5,'Medio',17),(11,'Diego Franco',5,'Arquero',16),(12,'Julián Sosa',2,'Medio',17);",
  "INSERT INTO partidos VALUES (1,'2026-08-01',1,2,2,1),(2,'2026-08-01',3,4,0,0),(3,'2026-08-08',5,1,1,3),(4,'2026-08-08',2,3,2,2),(5,'2026-08-15',4,5,1,0),(6,'2026-08-15',1,3,1,1);",
  "INSERT INTO goles VALUES (1,1,1,12),(2,1,2,55),(3,1,4,70),(4,3,10,30),(5,3,1,5),(6,3,1,44),(7,3,2,80),(8,4,4,20),(9,4,12,61),(10,4,6,33),(11,4,7,89),(12,5,8,77),(13,6,1,18),(14,6,6,50);"
];

/* Planilla del taller (Fortaleza Normal) */
window.EK_PLANILLA = {
  titulo: 'Planilla del taller CeluTec',
  cols: ['N° orden', 'Fecha', 'Cliente', 'Teléfono', 'Celular', 'Técnico', 'Especialidad', 'Repuestos', 'Total'],
  filas: [
    ['101', '02/10', 'Carla Duarte', '0981 111 222', 'Galaxy A15', 'Pedro Núñez', 'Pantallas', 'Pantalla, Batería', '450.000'],
    ['102', '03/10', 'Raúl Benítez', '0982 333 444', 'Moto G24', 'Lía Ortiz', 'Placas', 'Conector de carga', '120.000'],
    ['103', '05/10', 'Carla Duarte', '0981 111 222', 'iPhone 11', 'Pedro Núñez', 'Pantallas', 'Pantalla', '600.000'],
    ['104', '06/10', 'Ana Ríos', '0983 555 666', 'Redmi 13', 'Pedro Núñez', 'Pantallas', 'Batería', '180.000']
  ]
};

window.EK_REGIONES = [

/* ══════════════════════ 1 · FORTALEZA NORMAL ══════════════════════ */
{ id: 'normal', n: 1, nombre: 'Fortaleza Normal', area: 'Normalización', ico: '🏰', guia: 'techi',
  intro: 'El taller CeluTec guarda todo en una sola planilla y el Kernel no puede leerla. Antes de consultar datos, hay que ordenarlos: anomalías, dependencias y formas normales.',
  planilla: true,
  eventos: { 2: 'cofre', 3: 'portal', 5: 'bug', 7: 'tormenta' },
  guardian: { nombre: 'El Guardián de las Formas', ico: '🗿',
    intro: 'Para salir de la fortaleza hay que normalizar un caso nuevo, de punta a punta: el registro de bandas del festival del colegio.',
    retos: ['GF-1', 'GF-2', 'GF-3'] },
  retos: [
  { id: 'F-01', nv: 3, tipo: 'clasificar', sub: 'Anomalías',
    q: 'Mira la planilla de CeluTec. Clasifica cada situación según la anomalía que provoca.',
    categorias: ['Inserción', 'Actualización', 'Eliminación'],
    items: [
      { t: 'Carla cambia de número y hay que corregirlo en varias filas.', c: 'Actualización' },
      { t: 'Contratan a una técnica nueva, pero no se la puede registrar hasta que tenga una reparación.', c: 'Inserción' },
      { t: 'Se borra la orden 102 y se pierde que Lía Ortiz trabaja en el taller.', c: 'Eliminación' },
      { t: 'Pedro pasa a especializarse en baterías: hay que cambiar tres filas.', c: 'Actualización' },
      { t: 'No se puede cargar un repuesto nuevo al catálogo si nadie lo usó todavía.', c: 'Inserción' }
    ],
    pista: 'Inserción: no puedo agregar algo sin inventar otros datos. Actualización: el mismo dato está repetido. Eliminación: al borrar, pierdo información que no quería perder.',
    ex: 'Las tres anomalías vienen de lo mismo: datos de distintas entidades (cliente, técnico, repuesto) mezclados en una sola tabla.' },

  { id: 'F-02', nv: 3, tipo: 'opcion', sub: '1FN',
    q: 'En la orden 101, la celda Repuestos dice «Pantalla, Batería». ¿Qué regla rompe y cómo se corrige?',
    op: ['Rompe la 1FN: el valor no es atómico. Cada repuesto de la orden va en su propia fila de una tabla ORDEN_REPUESTO.',
         'Rompe la 2FN: se corrige creando las columnas Repuesto1 y Repuesto2.',
         'Rompe la 3FN: el repuesto depende del técnico.',
         'No rompe nada: separar con comas está permitido si se documenta.'],
    pista: 'La 1FN pide que cada celda tenga un solo valor y que no haya grupos repetidos.',
    ex: 'Repuesto1, Repuesto2… sigue siendo un grupo repetido: ¿y si la orden lleva tres repuestos? La solución es una tabla intermedia ORDEN_REPUESTO(id_orden, id_repuesto, cantidad).' },

  { id: 'F-03', nv: 3, tipo: 'clasificar', sub: 'Repartir campos',
    q: 'Reparte los datos de la planilla en tres tablas.',
    categorias: ['CLIENTE', 'ORDEN', 'TÉCNICO'],
    items: [
      { t: 'Nombre del cliente', c: 'CLIENTE' },
      { t: 'Teléfono del cliente', c: 'CLIENTE' },
      { t: 'Fecha', c: 'ORDEN' },
      { t: 'Celular que trajo a reparar', c: 'ORDEN' },
      { t: 'Total cobrado', c: 'ORDEN' },
      { t: 'Nombre del técnico', c: 'TÉCNICO' },
      { t: 'Especialidad', c: 'TÉCNICO' }
    ],
    pista: 'Pregúntate de quién es cada dato: ¿de la persona, del técnico o de esa reparación en particular?',
    ex: 'El celular va en ORDEN porque Carla trajo dos celulares distintos en dos órdenes. ORDEN se une con CLIENTE y TÉCNICO mediante id_cliente e id_tecnico.' },

  { id: 'F-04', nv: 4, tipo: 'opcion', sub: '3FN',
    q: 'Un compañero propone ORDEN(id_orden, fecha, id_cliente, id_tecnico, especialidad_tecnico, total). ¿Qué problema tiene?',
    op: ['Dependencia transitiva: especialidad depende del técnico, no de la orden. Viola la 3FN; la especialidad va en TÉCNICO.',
         'Dependencia parcial: viola la 2FN porque la clave es compuesta.',
         'Viola la 1FN porque tiene más de cinco columnas.',
         'Ninguno: está en 3FN porque todas las columnas tienen un solo valor.'],
    pista: 'id_orden → id_tecnico → especialidad. ¿Ves la cadena?',
    ex: 'Cuando un atributo no clave depende de otro atributo no clave (id_tecnico → especialidad), hay dependencia transitiva. Se saca a la tabla de la que realmente depende.' },

  { id: 'F-05', nv: 4, tipo: 'opcion', sub: '2FN',
    q: 'ORDEN_REPUESTO(id_orden, id_repuesto, nombre_repuesto, cantidad) tiene clave (id_orden, id_repuesto). ¿Qué forma normal viola?',
    op: ['La 2FN: nombre_repuesto depende solo de id_repuesto, que es una parte de la clave.',
         'La 1FN: tiene una clave compuesta.',
         'La 3FN: cantidad depende de nombre_repuesto.',
         'Ninguna: todas las columnas dependen de la clave.'],
    pista: 'La 2FN solo puede romperse cuando la clave es compuesta. ¿Algún dato depende de una sola parte de la clave?',
    ex: 'Es una dependencia parcial. nombre_repuesto va a REPUESTO(id_repuesto, nombre, precio) y en ORDEN_REPUESTO quedan solo id_orden, id_repuesto y cantidad.' },

  { id: 'F-06', nv: 4, tipo: 'clasificar', sub: 'Dependencias funcionales',
    q: 'Analiza el modelo del taller: ¿de qué determinante depende cada dato?',
    categorias: ['id_orden', 'id_cliente', 'id_tecnico', '(id_orden, id_repuesto)'],
    items: [
      { t: 'fecha', c: 'id_orden' },
      { t: 'total', c: 'id_orden' },
      { t: 'teléfono', c: 'id_cliente' },
      { t: 'nombre del cliente', c: 'id_cliente' },
      { t: 'especialidad', c: 'id_tecnico' },
      { t: 'cantidad de un repuesto en una orden', c: '(id_orden, id_repuesto)' }
    ],
    pista: 'Para cada dato, pregúntate: «si conozco ___, ¿conozco este dato sin dudas?».',
    ex: 'Cada grupo de dependencias termina siendo una tabla: el determinante es la clave primaria.' },

  { id: 'F-07', nv: 4, tipo: 'opcion', sub: 'Clave primaria',
    q: '¿Cuál es la clave primaria adecuada para ORDEN_REPUESTO(id_orden, id_repuesto, cantidad)?',
    op: ['La compuesta (id_orden, id_repuesto).',
         'id_orden, porque cada orden es única.',
         'id_repuesto, porque cada repuesto es único.',
         'cantidad, porque cambia en cada fila.'],
    pista: 'La orden 101 lleva pantalla y batería: ¿cuántas filas tiene la orden 101 en esta tabla?',
    ex: 'id_orden se repite (una fila por repuesto) y id_repuesto también (el mismo repuesto aparece en muchas órdenes). Solo el par identifica cada fila.' },

  { id: 'F-08', nv: 5, tipo: 'opcion', sub: 'Evaluar diseños',
    q: 'Diseño A: CLIENTE, ORDEN, TÉCNICO, REPUESTO y ORDEN_REPUESTO. Diseño B: una sola tabla ORDEN(id, fecha, cliente, teléfono, técnico, repuesto1, repuesto2, repuesto3, total). ¿Cuál conviene al taller y por qué?',
    op: ['A: elimina la redundancia y permite cualquier cantidad de repuestos por orden.',
         'B: es mejor porque con una sola tabla nunca hace falta un JOIN.',
         'B: repuesto1, 2 y 3 cumplen la 1FN porque cada celda tiene un solo valor.',
         'Son equivalentes: los dos están en 3FN.'],
    pista: '¿Qué pasa en B si una orden lleva cuatro repuestos? ¿Y si Carla cambia de teléfono?',
    ex: 'B tiene un grupo repetido (repuesto1..3) y repite los datos del cliente y del técnico. Ahorrarse un JOIN no compensa los datos inconsistentes.' },

  { id: 'F-09', nv: 5, tipo: 'opcion', sub: 'Relación N:M',
    q: 'Hasta ahora cada orden tiene un técnico. Desde el mes que viene, una orden puede tener varios técnicos. ¿Qué cambio al modelo es el correcto?',
    op: ['Quitar id_tecnico de ORDEN y crear ORDEN_TECNICO(id_orden, id_tecnico).',
         'Agregar id_orden a la tabla TÉCNICO.',
         'Guardar varios id separados por coma en ORDEN.id_tecnico.',
         'Agregar a ORDEN las columnas id_tecnico2 e id_tecnico3.'],
    pista: 'Muchas órdenes por técnico y muchos técnicos por orden: es una relación muchos a muchos.',
    ex: 'Una relación N:M siempre se resuelve con una tabla intermedia, cuya clave es el par de claves foráneas.' },

  { id: 'F-10', nv: 5, tipo: 'opcion', sub: 'Datos derivados',
    q: 'En CeluTec, el total de una orden es exactamente la suma de precio × cantidad de sus repuestos, y también se guarda en ORDEN.total. ¿Qué evalúas?',
    op: ['Es un dato derivado: si cambia un repuesto y nadie actualiza el total, queda inconsistente. Conviene calcularlo con una consulta.',
         'Está bien: guardar el total siempre es obligatorio en 3FN.',
         'Viola la 1FN porque el total es un número grande.',
         'Hay que guardarlo también en CLIENTE, para tener más copias.'],
    pista: 'Si un dato se puede calcular a partir de otros, guardarlo es otra forma de redundancia.',
    ex: 'Con SUM(precio * cantidad) y un JOIN se obtiene el total siempre correcto. Guardarlo se justifica solo por rendimiento, y obliga a actualizarlo en cada cambio.' },

  /* Guardián */
  { id: 'GF-1', nv: 4, tipo: 'clasificar', sub: 'Guardián · dependencias', guardian: true,
    q: 'Festival de bandas. Tabla PARTICIPACION(id_banda, id_integrante, nombre_banda, genero, nombre_integrante, curso, instrumento), con clave (id_banda, id_integrante). ¿De qué depende cada atributo?',
    categorias: ['id_banda', 'id_integrante', '(id_banda, id_integrante)'],
    items: [
      { t: 'nombre_banda', c: 'id_banda' },
      { t: 'genero', c: 'id_banda' },
      { t: 'nombre_integrante', c: 'id_integrante' },
      { t: 'curso', c: 'id_integrante' },
      { t: 'instrumento (el que toca en esa banda)', c: '(id_banda, id_integrante)' }
    ],
    pista: 'Ana toca la guitarra en Los Bits y el teclado en otra banda: ¿de qué depende el instrumento?',
    ex: 'El instrumento es lo único que depende de la clave completa; el resto depende solo de una parte.' },

  { id: 'GF-2', nv: 5, tipo: 'opcion', sub: 'Guardián · forma normal', guardian: true,
    q: 'Festival de bandas. En PARTICIPACION(id_banda, id_integrante, nombre_banda, genero, nombre_integrante, curso, instrumento), con clave (id_banda, id_integrante): nombre_banda y genero dependen de id_banda; nombre_integrante y curso, de id_integrante; instrumento, de la clave completa. ¿En qué forma normal está?',
    op: ['Solo en 1FN: tiene dependencias parciales (nombre_banda depende solo de id_banda), así que no llega a 2FN.',
         'En 3FN, porque tiene clave compuesta.',
         'En 2FN, porque no hay dependencias transitivas.',
         'En ninguna, porque las claves compuestas no están permitidas.'],
    pista: 'Primero revisa la 2FN: ¿hay atributos que dependan de una parte de la clave?',
    ex: 'Para estar en 2FN, todo atributo no clave debe depender de la clave completa. Aquí, cuatro de los cinco atributos dependen de una sola parte.' },

  { id: 'GF-3', nv: 6, tipo: 'clasificar', sub: 'Guardián · diseño 3FN', guardian: true,
    q: 'Festival de bandas: cada banda tiene nombre, género y una canción; cada integrante tiene nombre y curso; y cada integrante toca un instrumento en cada banda en la que participa. Diseña el modelo en 3FN: ubica cada atributo en su tabla.',
    categorias: ['BANDA', 'INTEGRANTE', 'PARTICIPACION'],
    items: [
      { t: 'nombre_banda', c: 'BANDA' },
      { t: 'genero', c: 'BANDA' },
      { t: 'canción que presenta la banda', c: 'BANDA' },
      { t: 'nombre_integrante', c: 'INTEGRANTE' },
      { t: 'curso', c: 'INTEGRANTE' },
      { t: 'instrumento', c: 'PARTICIPACION' }
    ],
    pista: 'Cada determinante del paso 1 se convierte en la clave de una tabla.',
    ex: 'BANDA(id_banda, nombre, genero, cancion) · INTEGRANTE(id_integrante, nombre, curso) · PARTICIPACION(id_banda, id_integrante, instrumento). Sin parciales ni transitivas: 3FN.' }
  ]
},

/* ══════════════════════ 2 · PUERTO SQL ══════════════════════ */
{ id: 'sql', n: 2, nombre: 'Puerto SQL', area: 'Bases de datos', ico: '⚓', guia: 'bit',
  intro: 'En el puerto está la base de datos del Torneo Intercolegial. El Kernel necesita respuestas, y solo las da una consulta bien escrita. Las consultas se ejecutan de verdad.',
  sql: true,
  eventos: { 1: 'cofre', 3: 'bug', 4: 'portal', 6: 'tormenta', 8: 'cofre' },
  guardian: { nombre: 'El Capitán del Puerto', ico: '🏴‍☠️',
    intro: 'El capitán solo deja zarpar a quien arme la tabla del torneo: goles de local, el goleador y los partidos ganados por cada colegio.',
    retos: ['GS-1', 'GS-2', 'GS-3'] },
  retos: [
  { id: 'S-01', nv: 3, tipo: 'sql', sub: 'WHERE y ORDER BY', orden: true,
    q: 'Muestra el nombre y la edad de los delanteros, del más joven al mayor.',
    solucion: "SELECT nombre, edad FROM jugadores WHERE posicion = 'Delantero' ORDER BY edad;",
    pista: "WHERE posicion = 'Delantero' … ORDER BY edad (de menor a mayor es el orden por defecto).",
    ex: "SELECT nombre, edad FROM jugadores WHERE posicion = 'Delantero' ORDER BY edad;" },

  { id: 'S-02', nv: 3, tipo: 'sql', sub: 'GROUP BY',
    q: '¿Cuántos jugadores tiene cada colegio? Muestra id_colegio y la cantidad.',
    solucion: 'SELECT id_colegio, COUNT(*) FROM jugadores GROUP BY id_colegio;',
    pista: 'COUNT(*) cuenta filas; GROUP BY arma un grupo por cada colegio.',
    ex: 'SELECT id_colegio, COUNT(*) AS cantidad FROM jugadores GROUP BY id_colegio;' },

  { id: 'S-03', nv: 3, tipo: 'sql', sub: 'WHERE',
    q: 'Muestra todos los datos de los partidos que terminaron empatados.',
    solucion: 'SELECT * FROM partidos WHERE goles_local = goles_visitante;',
    pista: 'Se pueden comparar dos columnas entre sí en el WHERE.',
    ex: 'SELECT * FROM partidos WHERE goles_local = goles_visitante;  → partidos 2, 4 y 6.' },

  { id: 'S-04', nv: 3, tipo: 'sql', sub: 'AND / <>',
    q: 'Muestra nombre y posición de los jugadores de 17 años o más que no son arqueros.',
    solucion: "SELECT nombre, posicion FROM jugadores WHERE edad >= 17 AND posicion <> 'Arquero';",
    pista: "Dos condiciones que se deben cumplir a la vez: AND. «Distinto de» en SQL es <>.",
    ex: "SELECT nombre, posicion FROM jugadores WHERE edad >= 17 AND posicion <> 'Arquero';  → 6 jugadores." },

  { id: 'S-05', nv: 4, tipo: 'sql', sub: 'JOIN',
    q: 'Muestra el nombre de cada jugador junto al nombre de su colegio.',
    solucion: 'SELECT j.nombre, c.nombre FROM jugadores j JOIN colegios c ON j.id_colegio = c.id_colegio;',
    pista: 'Las dos tablas se unen por id_colegio. Como las dos tienen «nombre», usa alias: j.nombre, c.nombre.',
    ex: 'SELECT j.nombre, c.nombre FROM jugadores j JOIN colegios c ON j.id_colegio = c.id_colegio;' },

  { id: 'S-06', nv: 4, tipo: 'sql', sub: 'JOIN + GROUP BY',
    q: 'Muestra el nombre y la cantidad de goles de cada jugador que marcó al menos un gol.',
    solucion: 'SELECT j.nombre, COUNT(*) FROM goles g JOIN jugadores j ON g.id_jugador = j.id_jugador GROUP BY j.id_jugador;',
    pista: 'Cada fila de goles es un gol. Une goles con jugadores y agrupa por jugador.',
    ex: 'SELECT j.nombre, COUNT(*) AS goles FROM goles g JOIN jugadores j ON g.id_jugador = j.id_jugador GROUP BY j.id_jugador;  → 8 goleadores.' },

  { id: 'S-07', nv: 4, tipo: 'sql', sub: 'HAVING',
    q: 'Muestra el nombre de los colegios cuyos jugadores suman más de 2 goles en total.',
    solucion: 'SELECT c.nombre FROM goles g JOIN jugadores j ON g.id_jugador = j.id_jugador JOIN colegios c ON j.id_colegio = c.id_colegio GROUP BY c.id_colegio HAVING COUNT(*) > 2;',
    pista: 'goles → jugadores → colegios. Una condición sobre un COUNT va en HAVING, no en WHERE.',
    ex: 'Se necesitan dos JOIN y HAVING COUNT(*) > 2 → Arandu (6), Ñandutí (3) y Yvága (3).' },

  { id: 'S-08', nv: 4, tipo: 'linea', sub: 'WHERE vs HAVING',
    q: 'Esta consulta da error. ¿En qué línea está el problema? Haz clic en ella.',
    code: { lang: 'sql', txt:
'SELECT id_colegio, COUNT(*) AS cantidad\nFROM jugadores\nWHERE COUNT(*) > 2\nGROUP BY id_colegio;' },
    correcta: 3,
    pista: 'WHERE filtra filas antes de agrupar. ¿Ya existe COUNT(*) en ese momento?',
    ex: 'Las funciones de agregado no pueden ir en WHERE. Se escribe HAVING COUNT(*) > 2 después del GROUP BY.' },

  { id: 'S-09', nv: 4, tipo: 'valor', sub: 'Predecir resultados',
    q: 'Sin ejecutarla: ¿cuántas filas devuelve esta consulta? Mira la tabla partidos con «Ver datos».',
    code: { lang: 'sql', txt: 'SELECT * FROM partidos\nWHERE id_local = 1 OR id_visitante = 1;' },
    acepta: ['3', 'tres'],
    pista: 'El colegio 1 (Arandu) puede jugar de local o de visitante.',
    ex: 'Arandu jugó los partidos 1 (local), 3 (visitante) y 6 (local): 3 filas.' },

  { id: 'S-10', nv: 5, tipo: 'sql', sub: 'LEFT JOIN',
    q: 'Muestra el nombre de los jugadores que todavía no marcaron ningún gol.',
    solucion: 'SELECT j.nombre FROM jugadores j LEFT JOIN goles g ON j.id_jugador = g.id_jugador WHERE g.id_gol IS NULL;',
    pista: 'Con LEFT JOIN aparecen todos los jugadores; los que no tienen gol quedan con NULL. También sirve NOT IN (SELECT id_jugador FROM goles).',
    ex: 'SELECT j.nombre FROM jugadores j LEFT JOIN goles g ON j.id_jugador = g.id_jugador WHERE g.id_gol IS NULL;  → Iván, Hugo, Fabián y Diego.' },

  { id: 'S-11', nv: 5, tipo: 'sql', sub: 'Subconsulta',
    q: 'Muestra nombre y edad de los jugadores mayores que el promedio de edad del torneo.',
    solucion: 'SELECT nombre, edad FROM jugadores WHERE edad > (SELECT AVG(edad) FROM jugadores);',
    pista: 'Primero calcula el promedio con SELECT AVG(edad) FROM jugadores, y usa esa consulta dentro del WHERE.',
    ex: 'El promedio es 16,67. La subconsulta se escribe entre paréntesis: WHERE edad > (SELECT AVG(edad) FROM jugadores) → 7 jugadores.' },

  { id: 'S-12', nv: 5, tipo: 'sql', sub: 'UPDATE', cambio: true,
    q: 'Error de carga: el partido 2 no fue 0 a 0, Tekove (visitante) ganó 0 a 1. Corrige solo ese partido.',
    solucion: 'UPDATE partidos SET goles_visitante = 1 WHERE id_partido = 2;',
    verificar: 'SELECT * FROM partidos;',
    pista: 'UPDATE tabla SET columna = valor WHERE … ¡Sin WHERE se cambian todos los partidos!',
    ex: 'UPDATE partidos SET goles_visitante = 1 WHERE id_partido = 2;' },

  { id: 'S-13', nv: 5, tipo: 'opcion', sub: 'Evaluar consultas',
    q: 'Un compañero quiere la cantidad de jugadores por colegio, con el nombre del colegio. ¿Qué evalúas de su consulta?',
    code: { lang: 'sql', txt: 'SELECT c.nombre, COUNT(*)\nFROM colegios c JOIN jugadores j\n  ON c.id_colegio = j.id_colegio;' },
    op: ['Le falta GROUP BY c.id_colegio: sin él, junta todo en una sola fila (12) en vez de una por colegio.',
         'Está bien: COUNT(*) siempre agrupa solo por la primera columna.',
         'Le falta un WHERE COUNT(*) > 0.',
         'El JOIN está mal: debería unir por nombre.'],
    pista: 'Sin GROUP BY, ¿cuántos grupos arma COUNT(*)?',
    ex: 'En SQLite la consulta corre, pero devuelve una sola fila con 12 jugadores y un nombre cualquiera. Con GROUP BY c.id_colegio se obtiene una fila por colegio.' },

  /* Guardián */
  { id: 'GS-1', nv: 4, tipo: 'sql', sub: 'Guardián · goles de local', guardian: true,
    q: 'Para cada colegio que jugó de local, muestra su nombre y el total de goles que hizo de local.',
    solucion: 'SELECT c.nombre, SUM(p.goles_local) FROM partidos p JOIN colegios c ON p.id_local = c.id_colegio GROUP BY c.id_colegio;',
    pista: 'Une partidos con colegios por id_local y suma goles_local agrupando por colegio.',
    ex: 'SELECT c.nombre, SUM(p.goles_local) FROM partidos p JOIN colegios c ON p.id_local = c.id_colegio GROUP BY c.id_colegio;' },

  { id: 'GS-2', nv: 5, tipo: 'sql', sub: 'Guardián · el goleador', guardian: true,
    q: 'Muestra solo al goleador del torneo: su nombre y su cantidad de goles.',
    solucion: 'SELECT j.nombre, COUNT(*) FROM goles g JOIN jugadores j ON g.id_jugador = j.id_jugador GROUP BY j.id_jugador ORDER BY COUNT(*) DESC LIMIT 1;',
    pista: 'Lo mismo que «goles por jugador», ordenado de mayor a menor… y quedarse con la primera fila (LIMIT 1).',
    ex: 'GROUP BY + ORDER BY COUNT(*) DESC + LIMIT 1 → Lucas Giménez, 4 goles.' },

  { id: 'GS-3', nv: 6, tipo: 'sql', sub: 'Guardián · partidos ganados', guardian: true,
    q: 'Arma la tabla de partidos ganados: el nombre de TODOS los colegios y cuántos partidos ganó cada uno (incluidos los que tienen 0).',
    solucion: 'SELECT c.nombre, COUNT(p.id_partido) FROM colegios c LEFT JOIN partidos p ON (p.id_local = c.id_colegio AND p.goles_local > p.goles_visitante) OR (p.id_visitante = c.id_colegio AND p.goles_visitante > p.goles_local) GROUP BY c.id_colegio;',
    pista: 'LEFT JOIN desde colegios, con una condición ON que diga «ganó de local O ganó de visitante». COUNT(p.id_partido) no cuenta los NULL.',
    ex: 'Arandu 2, Tekove 1 y el resto 0. La clave es poner la condición de victoria dentro del ON del LEFT JOIN: si va en el WHERE, desaparecen los colegios con 0.' }
  ]
},

/* ══════════════════════ 3 · ARCHIPIÉLAGO DE ESTRUCTURAS ══════════════════════ */
{ id: 'estructuras', n: 3, nombre: 'Archipiélago de Estructuras', area: 'Algorítmica 3', ico: '🏝️', guia: 'gatiel',
  intro: 'Cada isla funciona con una estructura distinta: la cantina hace cola, el editor apila, la playlist se enlaza. Si eliges mal la estructura, el sistema se hunde.',
  eventos: { 2: 'bug', 3: 'cofre', 5: 'portal', 7: 'tormenta' },
  guardian: { nombre: 'La Guardiana de los Turnos', ico: '🐙',
    intro: 'El centro de salud del barrio perdió su sistema de turnos. La guardiana te pide simularlo, analizarlo y diseñar cómo invertir la cola.',
    retos: ['GE-1', 'GE-2', 'GE-3'] },
  retos: [
  { id: 'E-01', nv: 3, tipo: 'simular', sub: 'Cola', est: 'cola',
    q: 'Cola de la cantina. Simula exactamente lo que pasa:',
    pasos: ['Llegan Ana, Beto y Caro (en ese orden).', 'Se atiende a una persona.', 'Llega Dani.', 'Se atiende a una persona.'],
    fichas: ['Ana', 'Beto', 'Caro', 'Dani'],
    ops: [['in', 'Ana'], ['in', 'Beto'], ['in', 'Caro'], ['out'], ['in', 'Dani'], ['out']],
    pista: 'Cola = FIFO: el primero que llega es el primero que sale. Se encola al final y se atiende por el frente.',
    ex: 'Salen Ana y Beto (en ese orden) y en la cola quedan Caro (frente) y Dani (final).' },

  { id: 'E-02', nv: 3, tipo: 'simular', sub: 'Pila', est: 'pila',
    q: 'El botón «Deshacer» de un editor usa una pila. Simula:',
    pasos: ['Escribes «hola», después «mundo» y después «!».', 'Aprietas Ctrl+Z dos veces.', 'Escribes «?».'],
    fichas: ['hola', 'mundo', '!', '?'],
    ops: [['in', 'hola'], ['in', 'mundo'], ['in', '!'], ['out'], ['out'], ['in', '?']],
    pista: 'Pila = LIFO: Ctrl+Z deshace lo último que hiciste.',
    ex: 'Se deshacen «!» y «mundo». En la pila quedan «hola» (fondo) y «?» (cima).' },

  { id: 'E-03', nv: 3, tipo: 'valor', sub: 'Pila',
    q: 'Pila vacía. Se ejecuta: apilar(5), apilar(8), desapilar(), apilar(3), apilar(9), desapilar(), apilar(1). Escribe la pila de la CIMA al FONDO, separada por comas.',
    acepta: ['1, 3, 5'],
    pista: 'Dibújala: cada desapilar saca el último que entró.',
    ex: 'Después de 5, 8 sale el 8; luego entran 3 y 9, sale el 9; entra el 1. Cima → fondo: 1, 3, 5.' },

  { id: 'E-04', nv: 3, tipo: 'valor', sub: 'Lista enlazada',
    q: 'Lista: cabeza → 4 → 7 → 2. Se ejecuta: insertar 9 al inicio, eliminar el 7, insertar 5 al final. Escribe la lista desde la cabeza, separada por comas.',
    acepta: ['9, 4, 2, 5'],
    pista: 'Insertar al inicio cambia la cabeza. Eliminar el 7 hace que el 4 apunte al 2.',
    ex: '9 → 4 → 7 → 2, luego 9 → 4 → 2, y por último 9 → 4 → 2 → 5.' },

  { id: 'E-05', nv: 3, tipo: 'simular', sub: 'Lista enlazada', est: 'lista',
    q: 'Playlist enlazada (empieza vacía). Simula:',
    pasos: ['Agrega «Intro» al final.', 'Agrega «Coro» al final.', 'Agrega «Puente» al inicio.', 'Elimina «Intro».', 'Agrega «Final» al final.'],
    fichas: ['Intro', 'Coro', 'Puente', 'Final'],
    ops: [['fin', 'Intro'], ['fin', 'Coro'], ['ini', 'Puente'], ['del', 'Intro'], ['fin', 'Final']],
    pista: 'Elige la canción y después dónde va. Para eliminar, haz clic en la ✕ del nodo.',
    ex: 'Queda: Puente → Coro → Final.' },

  { id: 'E-06', nv: 4, tipo: 'clasificar', sub: 'Elegir la estructura',
    q: 'Analiza cada caso y elige la estructura que mejor lo resuelve.',
    categorias: ['Pila', 'Cola', 'Lista enlazada'],
    items: [
      { t: 'Botón «Atrás» del navegador', c: 'Pila' },
      { t: 'Impresora compartida del laboratorio', c: 'Cola' },
      { t: 'Playlist donde se insertan canciones en el medio', c: 'Lista enlazada' },
      { t: 'Verificar que los paréntesis de una fórmula estén balanceados', c: 'Pila' },
      { t: 'Turnos de la ventanilla de inscripciones', c: 'Cola' },
      { t: 'Vagones de un tren que se enganchan y desenganchan en cualquier lugar', c: 'Lista enlazada' }
    ],
    pista: '¿Sale el último que entró (pila), el primero que llegó (cola) o se inserta en cualquier lugar (lista)?',
    ex: 'La pregunta clave es por dónde entra y por dónde sale cada elemento.' },

  { id: 'E-07', nv: 4, tipo: 'valor', sub: 'Pila · paréntesis',
    q: 'Se verifica «{ ( [ ] ) ( }» con una pila: cada apertura se apila y, en cada cierre, se desapila y se compara. Contando los símbolos desde 1, ¿en qué posición se detecta el error?',
    acepta: ['7', 'siete', 'la 7', 'posicion 7', 'posición 7'],
    pista: 'Símbolos: 1 {  2 (  3 [  4 ]  5 )  6 (  7 }. Sigue la pila símbolo por símbolo.',
    ex: 'Al llegar al 7 («}») la cima es «(», que no le corresponde: error en la posición 7.' },

  { id: 'E-08', nv: 4, tipo: 'opcion', sub: 'Lista · insertar',
    q: 'Para insertar «nuevo» después de «actual», un compañero invirtió las dos últimas líneas. ¿Qué pasa?',
    code: { lang: 'pseudo', txt: 'nuevo ← crearNodo("X")\nactual.siguiente ← nuevo\nnuevo.siguiente ← actual.siguiente' },
    op: ['nuevo termina apuntándose a sí mismo y se pierde el resto de la lista.',
         'Funciona igual: el orden de las asignaciones no importa.',
         'El nodo nuevo queda al principio de la lista.',
         'Da error porque nuevo.siguiente todavía no existe.'],
    pista: 'Después de la línea 2, ¿a quién apunta actual.siguiente? Esa es la dirección que se copia en la línea 3.',
    ex: 'El orden correcto es: primero nuevo.siguiente ← actual.siguiente (así no se pierde el resto) y después actual.siguiente ← nuevo.' },

  { id: 'E-09', nv: 4, tipo: 'linea', sub: 'Pila en Java',
    q: 'Esta pila con arreglo compila, pero tiene un error de lógica. ¿En qué línea está?',
    code: { lang: 'java', txt:
'int[] pila = new int[5];\nint tope = -1;\n// apilar 7\ntope++;\npila[tope] = 7;\n// desapilar\nint x = pila[tope];\ntope++;\nSystem.out.println("Sale: " + x);' },
    correcta: 8,
    pista: 'Después de desapilar, ¿el tope sube o baja?',
    ex: 'Al desapilar, el tope tiene que bajar: tope--. Con tope++ la pila «crece» en cada desapilar.' },

  { id: 'E-10', nv: 5, tipo: 'opcion', sub: 'Eficiencia de una cola',
    q: 'Una cola guarda los turnos en un arreglo. Cada vez que atiende, corre todos los elementos un lugar a la izquierda. Con 10 000 turnos en espera, ¿qué evalúas?',
    op: ['Atender cuesta O(n): conviene una cola circular (índices frente y final) o una lista enlazada, que atienden en O(1).',
         'Está bien: correr los elementos es O(1).',
         'Conviene usar una pila, que es más rápida.',
         'El problema se resuelve con un arreglo más grande.'],
    pista: 'Para atender a una persona, ¿cuántos elementos se mueven?',
    ex: 'Mover n elementos en cada atención es O(n). Con dos índices que avanzan (y vuelven al inicio), atender es O(1).' },

  { id: 'E-11', nv: 5, tipo: 'opcion', sub: 'Pila con lista',
    q: 'Dos estudiantes implementan la pila del botón «Atrás» con una lista enlazada simple. Ana inserta y quita por la cabeza. Beto inserta y quita por el final, sin puntero al último nodo. ¿Qué solución es mejor?',
    op: ['La de Ana: apilar y desapilar por la cabeza es O(1); Beto recorre toda la lista en cada operación (O(n)).',
         'La de Beto: el final es el lugar natural de la cima.',
         'Son iguales: una lista siempre es O(1).',
         'Ninguna: una pila no se puede hacer con listas.'],
    pista: 'Para llegar al último nodo sin puntero al final, ¿qué hay que hacer?',
    ex: 'La cima de la pila tiene que estar donde la operación es barata: en la cabeza.' },

  /* Árboles: aparecen solo con arboles: true en config.js */
  { id: 'A-01', nv: 3, tipo: 'valor', sub: 'ABB · recorridos', opcional: 'arboles',
    q: 'En un ABB vacío se insertan, en orden: 50, 30, 70, 20, 40, 60. Escribe el recorrido PREORDEN, separado por comas.',
    acepta: ['50, 30, 20, 40, 70, 60'],
    pista: 'Preorden: raíz, subárbol izquierdo, subárbol derecho.',
    ex: 'Raíz 50; a la izquierda 30 (con 20 y 40); a la derecha 70 (con 60). Preorden: 50, 30, 20, 40, 70, 60.' },

  { id: 'A-02', nv: 4, tipo: 'valor', sub: 'ABB · búsqueda', opcional: 'arboles',
    q: 'En ese mismo ABB, ¿cuántos nodos se comparan para encontrar el 60, contando el 60?',
    acepta: ['3', 'tres'],
    pista: 'Empieza en la raíz y en cada nodo decide: ¿izquierda o derecha?',
    ex: '50 (60 es mayor → derecha), 70 (60 es menor → izquierda), 60. Son 3 comparaciones.' },

  { id: 'A-03', nv: 4, tipo: 'opcion', sub: 'ABB · degenerado', opcional: 'arboles',
    q: 'Si en un ABB se insertan 10, 20, 30, 40 y 50 en ese orden, ¿qué pasa?',
    op: ['Se degenera en una «lista»: cada nodo tiene solo hijo derecho y buscar cuesta O(n).',
         'Queda perfectamente balanceado.',
         'El 50 queda como raíz.',
         'Da error porque los datos ya estaban ordenados.'],
    pista: 'Dibújalo: ¿hacia qué lado va cada número nuevo?',
    ex: 'Un ABB solo es rápido (O(log n)) si está balanceado. Con datos ordenados se vuelve una cadena.' },

  { id: 'A-04', nv: 5, tipo: 'opcion', sub: 'ABB · eliminar', opcional: 'arboles',
    q: 'Hay que eliminar del ABB un nodo que tiene dos hijos. ¿Cuál es la forma correcta?',
    op: ['Reemplazarlo por su sucesor inorden (el menor del subárbol derecho) y eliminar ese sucesor.',
         'Borrarlo junto con todos sus descendientes.',
         'Subir siempre el hijo izquierdo y descartar el derecho.',
         'Reemplazarlo por la raíz del árbol.'],
    pista: '¿Qué valor puede ocupar su lugar sin romper la regla «menores a la izquierda, mayores a la derecha»?',
    ex: 'El sucesor inorden (o el predecesor: el mayor del subárbol izquierdo) mantiene el orden del ABB.' },

  /* Guardiana */
  { id: 'GE-1', nv: 4, tipo: 'simular', sub: 'Guardiana · cola', est: 'cola', guardian: true,
    q: 'Centro de salud. Simula la cola de turnos:',
    pasos: ['Llegan Ema, Fede y Gabi.', 'Se atiende a una persona.', 'Llega Hugo.', 'Se atiende a una persona.', 'Se atiende a una persona.'],
    fichas: ['Ema', 'Fede', 'Gabi', 'Hugo'],
    ops: [['in', 'Ema'], ['in', 'Fede'], ['in', 'Gabi'], ['out'], ['in', 'Hugo'], ['out'], ['out']],
    pista: 'Primero en llegar, primero en ser atendido.',
    ex: 'Atendidos: Ema, Fede y Gabi. Queda Hugo.' },

  { id: 'GE-2', nv: 4, tipo: 'valor', sub: 'Guardiana · pila + cola', guardian: true,
    q: 'Cola C = [frente] 1, 2, 3, 4 [final]. Se desencola todo y se apila cada elemento en una pila P. Después se desapila todo y se encola en C. ¿Cómo queda C desde el frente? (sepáralos con comas)',
    acepta: ['4, 3, 2, 1'],
    pista: 'El 1 entra primero a la pila, así que queda en el fondo…',
    ex: 'La pila invierte el orden: sale 4, 3, 2, 1, y así vuelven a la cola.' },

  { id: 'GE-3', nv: 6, tipo: 'ordenar', sub: 'Guardiana · diseñar el algoritmo', guardian: true,
    q: 'Diseña el algoritmo que invierte una cola C usando una pila P: ordena las líneas.',
    lineas: ['Mientras no colaVacia(C) hacer', '    apilar(P, desencolar(C))', 'FinMientras', 'Mientras no pilaVacia(P) hacer', '    encolar(C, desapilar(P))', 'FinMientras'],
    pista: 'Primero se vacía la cola dentro de la pila; después se vacía la pila dentro de la cola.',
    ex: 'Dos ciclos, uno para cada estructura. Es O(n): cada elemento entra y sale una vez de cada una.' }
  ]
},

/* ══════════════════════ 4 · VOLCÁN JAVA ══════════════════════ */
{ id: 'java', n: 4, nombre: 'Volcán Java', area: 'Programación', ico: '🌋', guia: 'bit',
  intro: 'El Kernel está en el cráter, escrito en Java. Aquí eres el compilador humano: predices qué imprime cada programa, encuentras el error antes de que explote y armas el código final.',
  eventos: { 1: 'portal', 3: 'cofre', 4: 'bug', 6: 'tormenta', 8: 'bug' },
  guardian: { nombre: 'El Dragón del Cráter', ico: '🐉',
    intro: 'El dragón cuida el programa de la cantina. Para recuperar el Kernel hay que entenderlo, encontrar su bug y escribir la versión final.',
    retos: ['GJ-1', 'GJ-2', 'GJ-3'] },
  retos: [
  { id: 'J-01', nv: 3, tipo: 'valor', sub: 'División entera',
    q: '¿Qué imprime? Escribe cada línea separada por comas.',
    code: { lang: 'java', txt: 'int a = 7, b = 2;\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println((double) a / b);' },
    acepta: ['3, 1, 3.5'],
    pista: 'int / int da un int (se descarta la parte decimal). % es el resto.',
    ex: '7 / 2 = 3 (división entera), 7 % 2 = 1, y (double) 7 / 2 = 3.5 porque se convierte antes de dividir.' },

  { id: 'J-02', nv: 3, tipo: 'valor', sub: 'Concatenación',
    q: '¿Qué imprime?',
    code: { lang: 'java', txt: 'System.out.println(1 + 2 + "3" + 4 + 5);' },
    acepta: ['3345'],
    pista: 'Java evalúa de izquierda a derecha. Cuando aparece un String, todo lo que sigue se concatena.',
    ex: '1 + 2 = 3 (suma), luego 3 + "3" = "33", "33" + 4 = "334", "334" + 5 = "3345".' },

  { id: 'J-03', nv: 3, tipo: 'valor', sub: 'Ciclo for',
    q: '¿Qué imprime?',
    code: { lang: 'java', txt: 'int suma = 0;\nfor (int i = 1; i <= 10; i += 3) {\n    suma += i;\n}\nSystem.out.println(suma);' },
    acepta: ['22'],
    pista: 'Haz la prueba de escritorio: ¿qué valores toma i?',
    ex: 'i vale 1, 4, 7 y 10. 1 + 4 + 7 + 10 = 22.' },

  { id: 'J-04', nv: 3, tipo: 'linea', sub: 'Error de compilación',
    q: 'Este código (dentro del main) no compila. ¿En qué línea está el error?',
    code: { lang: 'java', txt: 'Scanner sc = new Scanner(System.in);\nSystem.out.print("Edad: ");\nString edad = sc.nextInt();\nSystem.out.println("Tienes " + edad);' },
    correcta: 3,
    pista: '¿Qué tipo de dato devuelve nextInt()?',
    ex: 'nextInt() devuelve un int y no se puede guardar en un String. Lo correcto es int edad = sc.nextInt();' },

  { id: 'J-05', nv: 3, tipo: 'ordenar', sub: 'Arreglos y ciclos',
    q: 'Ordena las líneas para que el programa muestre el mayor valor del arreglo.',
    lineas: ['int[] v = {4, 9, 2, 7};', 'int mayor = v[0];', 'for (int i = 1; i < v.length; i++) {', '    if (v[i] > mayor) {', '        mayor = v[i];', '    }', '}', 'System.out.println("Mayor: " + mayor);'],
    pista: 'Primero el arreglo, después el candidato a mayor, el ciclo que compara y, al final, la salida.',
    ex: 'Patrón «máximo»: se arranca con el primer elemento y se reemplaza cada vez que aparece uno mayor.' },

  { id: 'J-06', nv: 4, tipo: 'linea', sub: 'Error en ejecución',
    q: 'El programa compila, pero se cae al ejecutarlo. ¿En qué línea está la CAUSA del error?',
    code: { lang: 'java', txt: 'int[] notas = {4, 5, 3, 2};\nint suma = 0;\nfor (int i = 0; i <= notas.length; i++) {\n    suma += notas[i];\n}\nSystem.out.println(suma / notas.length);' },
    correcta: 3,
    pista: 'Los índices de un arreglo de 4 elementos van de 0 a 3.',
    ex: 'Con i <= notas.length el ciclo llega a i = 4 y notas[4] lanza ArrayIndexOutOfBoundsException en la línea 4. La causa es la condición de la línea 3: debe ser i < notas.length.' },

  { id: 'J-07', nv: 4, tipo: 'opcion', sub: 'Comparar String',
    q: 'El usuario escribe kernel, pero el programa responde «Incorrecta». ¿Por qué?',
    code: { lang: 'java', txt: 'String clave = sc.nextLine();\nif (clave == "kernel") {\n    System.out.println("Correcta");\n} else {\n    System.out.println("Incorrecta");\n}' },
    op: ['== compara si son el mismo objeto, no el texto. Hay que usar clave.equals("kernel").',
         'nextLine() no lee letras, solo números.',
         'Falta un punto y coma después del if.',
         'Las comillas dobles no sirven para String en Java.'],
    pista: 'Con int, == compara valores. Con String, compara referencias.',
    ex: 'El texto que se lee por teclado es otro objeto, aunque diga lo mismo. Para comparar el contenido se usa equals (o equalsIgnoreCase).' },

  { id: 'J-08', nv: 4, tipo: 'opcion', sub: 'Scanner',
    q: 'El usuario escribe 17 y aprieta Enter, pero el programa no espera el nombre: nombre queda vacío. ¿Qué pasa?',
    code: { lang: 'java', txt: 'System.out.print("Edad: ");\nint edad = sc.nextInt();\nSystem.out.print("Nombre: ");\nString nombre = sc.nextLine();' },
    op: ['nextInt() deja el Enter en el búfer y nextLine() lo toma como una línea vacía. Se agrega un sc.nextLine() antes de leer el nombre.',
         'nextLine() solo funciona si se usa antes que nextInt() en todo el programa.',
         'Hay que declarar nombre como int.',
         'Scanner no puede leer dos datos seguidos.'],
    pista: '¿Qué hay en el búfer justo después de leer el 17?',
    ex: 'nextInt() lee solo los dígitos; el salto de línea queda esperando y nextLine() lo consume. Un sc.nextLine() extra «limpia» ese Enter.' },

  { id: 'J-09', nv: 4, tipo: 'valor', sub: 'Ciclo while',
    q: '¿Qué imprime?',
    code: { lang: 'java', txt: 'int n = 345, s = 0;\nwhile (n > 0) {\n    s += n % 10;\n    n /= 10;\n}\nSystem.out.println(s);' },
    acepta: ['12'],
    pista: 'n % 10 da el último dígito; n /= 10 lo quita.',
    ex: 'Suma los dígitos: 5 + 4 + 3 = 12.' },

  { id: 'J-10', nv: 4, tipo: 'valor', sub: 'Ciclos anidados',
    q: '¿Qué imprime? (escríbelo en una sola línea, con los espacios)',
    code: { lang: 'java', txt: 'for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print(j);\n    }\n    System.out.print(" ");\n}' },
    acepta: ['1 12 123'],
    pista: 'El ciclo de adentro llega hasta i, y después se imprime un espacio.',
    ex: 'i = 1 → «1 », i = 2 → «12 », i = 3 → «123 ». Salida: 1 12 123' },

  { id: 'J-11', nv: 5, tipo: 'opcion', sub: 'Evaluar código',
    q: 'Hay que calcular el promedio de 9, 8 y 8. ¿Qué versión es correcta y por qué?',
    code: { lang: 'java', txt: '// Versión A\nint suma = 9 + 8 + 8;\ndouble prom = suma / 3;\n\n// Versión B\nint suma = 9 + 8 + 8;\ndouble prom = suma / 3.0;' },
    op: ['B: en A, suma / 3 es una división entera (25 / 3 = 8) y recién después se guarda como 8.0.',
         'A: guardar en double ya alcanza para tener decimales.',
         'Las dos dan 8.33, porque prom es double.',
         'Ninguna: hay que usar Math.round.'],
    pista: 'La división se hace ANTES de guardar el resultado. ¿De qué tipo son 25 y 3?',
    ex: 'A da 8.0 y B da 8.333…: con un operando double (3.0) la división es decimal.' },

  { id: 'J-12', nv: 5, tipo: 'opcion', sub: 'Elegir el ciclo',
    q: 'Hay que pedir una nota por teclado hasta que esté entre 1 y 5. ¿Qué estructura es la más adecuada?',
    op: ['do-while: pide al menos una vez y repite mientras la nota sea inválida.',
         'Un for de 1 a 5.',
         'Un if con else, que vuelve a pedir una sola vez.',
         'Un switch con un caso por cada nota.'],
    pista: 'No sabemos cuántas veces se va a equivocar el usuario, pero hay que pedirla al menos una vez.',
    ex: 'do { nota = sc.nextInt(); } while (nota < 1 || nota > 5);  El for sirve cuando se conoce la cantidad de repeticiones.' },

  /* Dragón */
  { id: 'GJ-1', nv: 4, tipo: 'valor', sub: 'Dragón · prueba de escritorio', guardian: true,
    q: 'Programa de la cantina. El usuario escribe 2, 3, 3 y 0. ¿Qué imprime la ÚLTIMA línea?',
    code: { lang: 'java', txt: 'Scanner sc = new Scanner(System.in);\nint[] precios = {5000, 8000, 3000};\nString[] productos = {"Empanada", "Hamburguesa", "Jugo"};\nint total = 0;\nint op = sc.nextInt();\nwhile (op != 0) {\n    total += precios[op - 1];\n    System.out.println("+ " + productos[op - 1]);\n    op = sc.nextInt();\n}\nSystem.out.println("Total: " + total);' },
    acepta: ['Total: 14000', '14000'],
    pista: 'La opción 2 es precios[1]. Ojo: el índice es op - 1.',
    ex: 'Opción 2 → 8000, 3 → 3000, 3 → 3000. Total: 14000.' },

  { id: 'GJ-2', nv: 5, tipo: 'linea', sub: 'Dragón · error de lógica', guardian: true,
    q: 'La cantina quiere un 10 % de descuento cuando el total supera 20 000. Este agregado tiene un error de lógica. ¿En qué línea?',
    code: { lang: 'java', txt: 'if (total > 20000) {\n    total = total * 10 / 100;\n}\nSystem.out.println("A pagar: " + total);' },
    correcta: 2,
    pista: 'Con un total de 30 000, ¿cuánto debería pagar? ¿Cuánto calcula esta línea?',
    ex: 'total * 10 / 100 es el descuento, no lo que se paga. Lo correcto es total = total - total * 10 / 100 (o total * 90 / 100).' },

  { id: 'GJ-3', nv: 5, tipo: 'ordenar', sub: 'Dragón · versión final', guardian: true,
    q: 'Arma la versión final: lee opciones hasta el 0, cuenta los productos válidos (1 a 3) y avisa cuando la opción no existe.',
    lineas: ['int cantidad = 0, op = sc.nextInt();', 'while (op != 0) {', '    if (op >= 1 && op <= 3) {', '        cantidad++;', '    } else {', '        System.out.println("Opción inválida");', '    }', '    op = sc.nextInt();', '}', 'System.out.println("Productos: " + cantidad);'],
    pista: 'La nueva lectura va al final del while, fuera del if. La salida va después de cerrar el ciclo.',
    ex: 'Patrón «lectura anticipada»: se lee antes del ciclo y otra vez al final de cada vuelta.' }
  ]
}
];
