/* ═══════════════════════════════════════════════════════════════
   BATIN · Sistema en Producción · 3er curso — escape room
   SALAS Y RETOS  —  este es el archivo que se edita
   ═══════════════════════════════════════════════════════════════

   El caso: la biblioteca del colegio necesita un sistema de préstamos.
   Cada sala es una capa del mismo sistema. Al resolver todos los
   retos de una sala se obtiene una LLAVE y se abre la siguiente.

   TIPOS DE RETO
   -------------
   opcion     → op: [...]  ⚠ la PRIMERA opción es la correcta (se mezclan solas)
   valor      → acepta: ['5000', ...]  respuestas válidas (no importan
                mayúsculas, espacios de más, puntos de miles ni "Gs")
   ordenar    → lineas: [...] en el orden CORRECTO (el juego las desordena)
   clasificar → categorias: [...], items: [{ t: 'texto', c: 'categoría' }]
   sql        → solucion: 'SELECT ...'  (el juego compara el resultado
                de la consulta del equipo con el de la solución)
                cambio: true + verificar: 'SELECT ...' para UPDATE/INSERT/DELETE
                orden: true si el orden de las filas importa

   Campos comunes: id (único), sub (subtema), q (consigna),
   code {lang:'pseudo'|'py'|'java', txt}, pista, ex (explicación).
   ═══════════════════════════════════════════════════════════════ */

window.SP_CASO = {
  nombre: 'Biblioteca del colegio',
  cliente: 'Rosa, la bibliotecaria',
  pedido: 'Necesitamos un sistema para registrar los préstamos de libros, saber quién no devolvió y cobrar las multas por atraso. Hoy todo está en una planilla de Excel… y es un caos.'
};

/* Base de datos del caso (se carga en el navegador con SQLite) */
window.SP_BD = [
  "CREATE TABLE socios (id_socio INTEGER PRIMARY KEY, nombre TEXT NOT NULL, curso TEXT NOT NULL);",
  "CREATE TABLE libros (id_libro INTEGER PRIMARY KEY, titulo TEXT NOT NULL, autor TEXT NOT NULL, categoria TEXT NOT NULL, anio INTEGER);",
  "CREATE TABLE prestamos (id_prestamo INTEGER PRIMARY KEY, id_socio INTEGER NOT NULL REFERENCES socios(id_socio), id_libro INTEGER NOT NULL REFERENCES libros(id_libro), fecha_prestamo TEXT NOT NULL, fecha_devolucion TEXT);",
  "INSERT INTO socios VALUES (1,'María Benítez','3° A'),(2,'Juan Ortiz','3° A'),(3,'Sofía Giménez','2° B'),(4,'Diego Acosta','1° A'),(5,'Lucía Ramírez','3° B'),(6,'Mateo Duarte','2° A');",
  "INSERT INTO libros VALUES (1,'Yo el Supremo','Augusto Roa Bastos','Literatura',1974),(2,'Hijo de hombre','Augusto Roa Bastos','Literatura',1960),(3,'La babosa','Gabriel Casaccia','Literatura',1952),(4,'Python para principiantes','Ana Torres','Programación',2021),(5,'Java desde la consola','Luis Medina','Programación',2019),(6,'Bases de datos paso a paso','Carla Ruiz','Programación',2020),(7,'Historia del Paraguay','Varios autores','Historia',2015),(8,'Atlas escolar','Varios autores','Geografía',2018);",
  "INSERT INTO prestamos VALUES (1,1,4,'2026-09-01','2026-09-06'),(2,2,1,'2026-09-02','2026-09-12'),(3,1,6,'2026-09-08',NULL),(4,3,2,'2026-09-10','2026-09-15'),(5,4,7,'2026-09-15',NULL),(6,5,5,'2026-09-20','2026-09-25'),(7,2,3,'2026-09-22',NULL),(8,6,4,'2026-10-01','2026-10-04'),(9,1,8,'2026-10-02','2026-10-09'),(10,3,5,'2026-10-05',NULL);"
];

/* La planilla original de la bibliotecaria (sala de datos) */
window.SP_PLANILLA = {
  cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  filas: [
    ['N°', 'Socio', 'Curso', 'Libro', 'Autor', 'Préstamo', 'Devolución'],
    [1, 'María Benítez', '3° A', 'Python para principiantes', 'Ana Torres', '01/09/2026', '06/09/2026'],
    [2, 'Juan Ortiz', '3° A', 'Yo el Supremo', 'Augusto Roa Bastos', '02/09/2026', '12/09/2026'],
    [3, 'María Benítez', '3° A', 'Bases de datos paso a paso', 'Carla Ruiz', '08/09/2026', ''],
    [4, 'Sofía Giménez', '2° B', 'Hijo de hombre', 'Augusto Roa Bastos', '10/09/2026', '15/09/2026'],
    [5, 'Diego Acosta', '1° A', 'Historia del Paraguay', 'Varios autores', '15/09/2026', ''],
    [6, 'Lucía Ramírez', '3° B', 'Java desde la consola', 'Luis Medina', '20/09/2026', '25/09/2026'],
    [7, 'Juan Ortiz', '3° A', 'La babosa', 'Gabriel Casaccia', '22/09/2026', ''],
    [8, 'Mateo Duarte', '2° A', 'Python para principiantes', 'Ana Torres', '01/10/2026', '04/10/2026'],
    [9, 'Ma. Benítez', '3° A', 'Atlas escolar', 'Varios autores', '02/10/2026', '09/10/2026'],
    [10, 'Sofía Giménez', '2° B', 'Java desde la consola', 'Luis Medina', '05/10/2026', '']
  ]
};

window.SP_SALAS = [

/* ═══════════════ 1 · REQUERIMIENTOS ═══════════════ */
{ id: 'req', n: 1, nombre: 'Requerimientos', area: 'Proyectos', ico: '📋', guia: 'techi',
  intro: 'Rosa ya nos contó qué necesita. Antes de tocar una sola tabla, hay que entender bien el pedido y ver si el proyecto es viable.',
  llave: { valor: '4', txt: 'requerimientos funcionales' },
  retos: [
  { id: 'S1-R1', tipo: 'clasificar', sub: 'Requerimientos',
    q: 'Clasifica lo que pidió Rosa: ¿es algo que el sistema HACE (funcional) o una condición de CÓMO debe funcionar (no funcional)?',
    categorias: ['Funcional', 'No funcional'],
    items: [
      { t: 'Registrar un préstamo', c: 'Funcional' },
      { t: 'Registrar una devolución', c: 'Funcional' },
      { t: 'Buscar libros por autor', c: 'Funcional' },
      { t: 'Calcular la multa por atraso', c: 'Funcional' },
      { t: 'Responder en menos de 2 segundos', c: 'No funcional' },
      { t: 'Funcionar en el navegador sin instalar nada', c: 'No funcional' },
      { t: 'Verse bien también en el celular', c: 'No funcional' }
    ],
    pista: 'Funcional = una acción que el usuario puede hacer con el sistema. No funcional = rapidez, compatibilidad, facilidad de uso…',
    ex: 'Los requerimientos funcionales describen QUÉ hace el sistema; los no funcionales, con qué calidad lo hace. Hay 4 funcionales: esa es la llave de esta sala.' },

  { id: 'S1-R2', tipo: 'opcion', sub: 'Objetivos',
    q: '¿Cuál es el objetivo general mejor redactado para el proyecto?',
    op: ['Desarrollar un sistema web que registre los préstamos y devoluciones de la biblioteca del colegio y calcule las multas por atraso.',
         'Conocer cómo funciona la biblioteca del colegio.',
         'Hacer una aplicación linda y moderna para la biblioteca.',
         'Que la bibliotecaria trabaje más contenta.'],
    pista: 'Un buen objetivo empieza con un verbo verificable y dice qué, para quién y para qué.',
    ex: '«Conocer» no se puede verificar, «linda» no se puede medir y «más contenta» no depende solo del sistema.' },

  { id: 'S1-R3', tipo: 'clasificar', sub: 'Viabilidad',
    q: 'Clasifica cada dato según el tipo de viabilidad que analiza.',
    categorias: ['Técnica', 'Económica', 'Legal'],
    items: [
      { t: 'El laboratorio tiene 12 computadoras con navegador', c: 'Técnica' },
      { t: 'El equipo ya sabe SQL y Python', c: 'Técnica' },
      { t: 'El hosting en GitHub Pages no tiene costo', c: 'Económica' },
      { t: 'Imprimir carnés con código QR cuesta 150.000 Gs', c: 'Económica' },
      { t: 'Guardar nombres y cursos de alumnos requiere autorización de la dirección', c: 'Legal' },
      { t: 'No se pueden publicar fotos de los socios sin permiso', c: 'Legal' }
    ],
    pista: 'Técnica: ¿tenemos con qué y sabemos cómo? Económica: ¿cuánto cuesta? Legal: ¿está permitido?',
    ex: 'La viabilidad se analiza en las tres dimensiones. Un proyecto técnicamente posible puede no ser legal o no tener presupuesto.' },

  { id: 'S1-R4', tipo: 'opcion', sub: 'Encuestas',
    q: 'Cuando el sistema esté funcionando, quieren saber si redujo el tiempo de atención en la biblioteca. ¿Qué encuesta corresponde?',
    op: ['De evaluación: comparar el antes y el después con los usuarios',
         'De fundamentación: demostrar que el problema existe',
         'De desarrollo: preguntar qué funciones quieren',
         'Ninguna: si el sistema funciona, no hace falta preguntar'],
    pista: 'En 1° aprendieron tres momentos de una encuesta en un proyecto.',
    ex: 'Fundamentación → antes de construir. Desarrollo → mientras se diseña. Evaluación → después de implementar, para medir si resolvió el problema.' }
  ]
},

/* ═══════════════ 2 · DATOS ═══════════════ */
{ id: 'datos', n: 2, nombre: 'La planilla', area: 'Ofimática', ico: '📊', guia: 'bit',
  intro: 'Rosa nos mandó su planilla de Excel. Antes de diseñar la base de datos, hay que entender qué tiene… y qué problemas trae.',
  planilla: true,
  llave: { valor: '4', txt: 'préstamos sin devolver' },
  retos: [
  { id: 'S2-D1', tipo: 'valor', sub: 'Lectura de datos', planilla: true,
    q: 'Mirando la planilla: ¿cuántos préstamos siguen SIN devolver?',
    acepta: ['4', 'cuatro'],
    pista: 'Un préstamo sin devolver tiene la columna G (Devolución) vacía.',
    ex: 'Son las filas 3, 5, 7 y 10: la celda de devolución está vacía. Esa es la llave de esta sala.' },

  { id: 'S2-D2', tipo: 'opcion', sub: 'Funciones', planilla: true,
    q: '¿Qué fórmula cuenta los préstamos SIN devolver?',
    op: ['=CONTAR.SI(G2:G11;"")', '=CONTAR(G2:G11)', '=SUMA(G2:G11)', '=CONTAR.SI(G2:G11;"vacío")'],
    pista: 'CONTAR solo cuenta celdas con números (y las fechas son números).',
    ex: 'CONTAR.SI con criterio "" cuenta las celdas vacías. CONTAR(G2:G11) da 6: cuenta las fechas, o sea, los que SÍ se devolvieron.' },

  { id: 'S2-D3', tipo: 'opcion', sub: 'Calidad de datos', planilla: true,
    q: '=CONTAR.SI(B2:B11;"María Benítez") da 2, pero María tiene 3 préstamos. ¿Por qué?',
    op: ['En la fila 9 el nombre está escrito «Ma. Benítez»',
         'CONTAR.SI no funciona con nombres que tienen tilde',
         'El rango debería empezar en B1',
         'Uno de sus préstamos todavía no se devolvió'],
    pista: 'Revisa la columna B fila por fila.',
    ex: 'Para Excel, «Ma. Benítez» es otra persona. En una base de datos esto se evita identificando a cada socio con un código (id_socio) y escribiendo su nombre una sola vez.' },

  { id: 'S2-D4', tipo: 'opcion', sub: 'Gráficos',
    q: 'Rosa quiere ver qué categoría de libros se presta más (Literatura, Programación, Historia, Geografía). ¿Qué gráfico conviene?',
    op: ['De barras, ordenadas de mayor a menor', 'De líneas', 'De dispersión', 'Circular en 3D con efecto de sombra'],
    pista: 'Se comparan cantidades entre categorías, no un cambio en el tiempo.',
    ex: 'Las barras comparan cantidades entre categorías. Las líneas son para mostrar cambios en el tiempo, y el 3D deforma las proporciones.' }
  ]
},

/* ═══════════════ 3 · MODELO ═══════════════ */
{ id: 'modelo', n: 3, nombre: 'El modelo de datos', area: 'Normalización', ico: '🧩', guia: 'gatiel',
  intro: 'La planilla repite datos y se contradice. Hay que diseñar tablas que guarden cada dato una sola vez.',
  llave: { valor: '3', txt: 'tablas del modelo' },
  retos: [
  { id: 'S3-M1', tipo: 'opcion', sub: 'Anomalías', planilla: true,
    q: 'El curso de María aparece en 3 filas. Si pasa a 3° B y solo se corrige una fila, ¿qué pasa?',
    op: ['Los datos se contradicen: María figura en dos cursos (anomalía de actualización)',
         'Nada: Excel corrige las otras filas automáticamente',
         'Se borran los préstamos de María',
         'Se duplica el libro prestado'],
    pista: 'Piensa qué dice la planilla después del cambio a medias.',
    ex: 'Cuando un dato se repite, cada cambio hay que hacerlo en muchos lugares. Si se olvida uno, aparecen contradicciones. Normalizar evita esto.' },

  { id: 'S3-M2', tipo: 'opcion', sub: 'Primera forma normal',
    q: 'Un compañero propone esta tabla. ¿Qué forma normal NO cumple?',
    tabla: { cols: ['id_socio', 'nombre', 'libros_prestados'], filas: [[1, 'María Benítez', 'Python para principiantes, Atlas escolar'], [2, 'Juan Ortiz', 'Yo el Supremo, La babosa']] },
    op: ['1FN: la columna libros_prestados tiene varios valores en una sola celda',
         '2FN: el nombre depende de una parte de la clave',
         '3FN: el nombre depende de otro campo que no es clave',
         'Las cumple todas: está bien diseñada'],
    pista: 'La primera forma normal exige valores atómicos.',
    ex: '1FN: cada celda guarda un solo valor. Una lista separada por comas no se puede consultar ni contar bien.' },

  { id: 'S3-M3', tipo: 'clasificar', sub: 'Normalización',
    q: 'Reparte los campos de la planilla en las tres tablas del modelo.',
    categorias: ['Socios', 'Libros', 'Préstamos'],
    items: [
      { t: 'nombre', c: 'Socios' },
      { t: 'curso', c: 'Socios' },
      { t: 'titulo', c: 'Libros' },
      { t: 'autor', c: 'Libros' },
      { t: 'categoria', c: 'Libros' },
      { t: 'fecha_prestamo', c: 'Préstamos' },
      { t: 'fecha_devolucion', c: 'Préstamos' },
      { t: 'id_socio (clave foránea)', c: 'Préstamos' },
      { t: 'id_libro (clave foránea)', c: 'Préstamos' }
    ],
    pista: 'Pregúntate: ¿este dato describe a la persona, al libro o al hecho de prestar?',
    ex: 'Socios y Libros guardan datos que no cambian con cada préstamo. Préstamos registra el hecho y se relaciona con los otros dos por claves foráneas. Son 3 tablas: esa es la llave.' },

  { id: 'S3-M4', tipo: 'opcion', sub: 'Relaciones',
    q: 'Un socio puede tener muchos préstamos y cada préstamo es de un solo socio. ¿Cómo se representa?',
    op: ['Relación 1:N; la clave foránea id_socio va en la tabla Préstamos',
         'Relación 1:N; la clave foránea id_prestamo va en la tabla Socios',
         'Relación N:M; hace falta una cuarta tabla intermedia',
         'Relación 1:1; las dos tablas comparten la misma clave primaria'],
    pista: 'La clave foránea va en el lado «muchos».',
    ex: 'En una relación 1:N, la clave foránea va del lado N. Si fuera en Socios, haría falta una columna por préstamo.' },

  { id: 'S3-M5', tipo: 'opcion', sub: 'Tercera forma normal',
    q: 'Quieren agregar la editorial. ¿Qué problema tiene esta tabla?',
    tabla: { cols: ['id_libro', 'titulo', 'id_editorial', 'nombre_editorial', 'ciudad_editorial'], filas: [[1, 'Yo el Supremo', 3, 'Servilibro', 'Asunción'], [2, 'Hijo de hombre', 3, 'Servilibro', 'Asunción']] },
    op: ['No cumple 3FN: nombre y ciudad dependen de id_editorial, no del libro (dependencia transitiva)',
         'No cumple 1FN: hay celdas con varios valores',
         'No tiene clave primaria',
         'Está bien: todos los datos son del libro'],
    pista: '¿De qué campo dependen realmente nombre_editorial y ciudad_editorial?',
    ex: 'Hay una dependencia transitiva: id_libro → id_editorial → nombre y ciudad. Se crea una tabla Editoriales y en Libros queda solo id_editorial.' }
  ]
},

/* ═══════════════ 4 · SQL ═══════════════ */
{ id: 'sql', n: 4, nombre: 'Consultas SQL', area: 'Bases de datos', ico: '🗄️', guia: 'bit',
  intro: 'La base de datos ya está creada y cargada. Rosa necesita respuestas: escribe las consultas y ejecútalas de verdad.',
  esquema: true,
  llave: { valor: '4', txt: 'socios con préstamos pendientes' },
  retos: [
  { id: 'S4-Q1', tipo: 'sql', sub: 'SELECT y WHERE',
    q: 'Muestra el título y el autor de los libros de la categoría Programación.',
    solucion: "SELECT titulo, autor FROM libros WHERE categoria = 'Programación';",
    pista: "Escribe la categoría exactamente igual que en la tabla, con tilde: 'Programación'.",
    ex: 'SELECT elige las columnas; WHERE filtra las filas. Los textos van entre comillas simples.' },

  { id: 'S4-Q2', tipo: 'sql', sub: 'GROUP BY',
    q: '¿Cuántos libros hay en cada categoría? Muestra la categoría y la cantidad.',
    solucion: 'SELECT categoria, COUNT(*) FROM libros GROUP BY categoria;',
    pista: 'COUNT(*) cuenta filas; GROUP BY agrupa por el campo que quieres resumir.',
    ex: 'GROUP BY forma un grupo por cada categoría y COUNT(*) cuenta las filas de cada grupo.' },

  { id: 'S4-Q3', tipo: 'sql', sub: 'JOIN',
    q: 'Muestra el nombre de los socios que tienen préstamos SIN devolver.',
    solucion: 'SELECT s.nombre FROM socios s JOIN prestamos p ON s.id_socio = p.id_socio WHERE p.fecha_devolucion IS NULL;',
    pista: 'Une socios con prestamos por id_socio. Un préstamo sin devolver tiene fecha_devolucion IS NULL (no se usa = NULL).',
    ex: 'JOIN une las tablas por la clave. Para preguntar por un valor vacío en SQL se usa IS NULL. Son 4 socios: esa es la llave.' },

  { id: 'S4-Q4', tipo: 'sql', sub: 'UPDATE', cambio: true,
    q: "Diego devolvió hoy el libro. Registra la devolución del préstamo número 5 con la fecha '2026-10-15'.",
    solucion: "UPDATE prestamos SET fecha_devolucion = '2026-10-15' WHERE id_prestamo = 5;",
    verificar: 'SELECT id_prestamo, fecha_devolucion FROM prestamos ORDER BY id_prestamo;',
    pista: 'UPDATE tabla SET campo = valor WHERE condición. ¡Sin WHERE se cambian TODAS las filas!',
    ex: 'El WHERE es lo más importante de un UPDATE: sin él, se marcarían como devueltos todos los préstamos.' },

  { id: 'S4-Q5', tipo: 'opcion', sub: 'DDL e integridad',
    q: '¿Qué definición garantiza que no se pueda registrar un préstamo de un socio que no existe?',
    code: { lang: 'sql', txt:
`-- A
id_socio INTEGER NOT NULL REFERENCES socios(id_socio)
-- B
id_socio INTEGER
-- C
id_socio TEXT UNIQUE
-- D
id_socio INTEGER DEFAULT 0` },
    op: ['A: clave foránea que referencia a socios', 'B: un entero cualquiera', 'C: un texto único', 'D: un entero con valor por defecto 0'],
    pista: 'Se busca integridad referencial.',
    ex: 'REFERENCES crea la clave foránea: el motor rechaza un id_socio que no exista en la tabla socios. NOT NULL además obliga a cargarlo.' }
  ]
},

/* ═══════════════ 5 · LÓGICA ═══════════════ */
{ id: 'logica', n: 5, nombre: 'La multa', area: 'Algoritmos y Python', ico: '🧮', guia: 'techi',
  intro: 'Regla de la biblioteca: el préstamo dura 7 días. Por cada día de atraso, la multa es de 1.000 Gs. Primero el algoritmo, después Python.',
  llave: { valor: '5', txt: 'miles de guaraníes de multa en la prueba' },
  retos: [
  { id: 'S5-L1', tipo: 'ordenar', sub: 'Pseudocódigo',
    q: 'Ordena las líneas del algoritmo que calcula la multa.',
    lineas: ['Leer dias', 'atraso <- dias - 7', 'Si atraso > 0 Entonces', '    multa <- atraso * 1000', 'SiNo', '    multa <- 0', 'FinSi', 'Escribir "Multa: ", multa'],
    pista: 'Entrada → proceso → salida. La condición decide si hay multa.',
    ex: 'Primero se lee el dato, después se calcula el atraso, la condición decide la multa y al final se muestra.' },

  { id: 'S5-L2', tipo: 'valor', sub: 'Prueba de escritorio',
    q: 'Prueba de escritorio: un socio devuelve el libro a los 12 días. ¿Cuánto es la multa (en guaraníes)?',
    acepta: ['5000'],
    pista: 'atraso = 12 − 7.',
    ex: '12 − 7 = 5 días de atraso × 1000 = 5000 Gs. La llave es 5.' },

  { id: 'S5-L3', tipo: 'opcion', sub: 'Python',
    q: 'Un compañero pasó el algoritmo a Python así. Con 4 días, ¿qué muestra y qué falta?',
    code: { lang: 'py', txt:
`dias = 4
atraso = dias - 7
multa = atraso * 1000
print("Multa:", multa)` },
    op: ['Muestra Multa: -3000; falta el if que deja la multa en 0 si no hay atraso',
         'Muestra Multa: 0; está bien',
         'Muestra Multa: 4000',
         'Da error porque atraso es negativo'],
    pista: 'Haz la cuenta: 4 − 7.',
    ex: 'Al traducir, se perdió la condición del algoritmo. Por eso la prueba de escritorio también se hace con casos sin atraso.' },

  { id: 'S5-L4', tipo: 'valor', sub: 'Python',
    q: '¿Qué muestra este programa?',
    code: { lang: 'py', txt:
`dias_prestados = [5, 10, 7, 15]
total = 0
for d in dias_prestados:
    if d > 7:
        total = total + (d - 7) * 1000
print(total)` },
    acepta: ['11000'],
    pista: 'Solo suman los préstamos de más de 7 días: el de 10 y el de 15.',
    ex: '(10 − 7) × 1000 + (15 − 7) × 1000 = 3000 + 8000 = 11000.' }
  ]
},

/* ═══════════════ 6 · ESTRUCTURAS ═══════════════ */
{ id: 'estructuras', n: 6, nombre: 'Estructuras de datos', area: 'Algorítmica 3', ico: '🧱', guia: 'gatiel',
  intro: 'El sistema tiene que manejar reservas, deshacer errores y recorrer préstamos. Cada problema pide la estructura adecuada.',
  llave: { valor: '3', txt: 'personas en la cola de reservas' },
  retos: [
  { id: 'S6-E1', tipo: 'opcion', sub: 'Colas',
    q: 'Cola de reservas de «Yo el Supremo»: llegan Ana, Luis y Sofía, en ese orden. Se atiende a una persona y después llega Diego. ¿Quién es el próximo en ser atendido?',
    op: ['Luis', 'Ana', 'Sofía', 'Diego'],
    pista: 'Cola = FIFO: el primero que entra es el primero que sale.',
    ex: 'Sale Ana (la primera). Quedan Luis, Sofía y Diego: 3 personas, y el próximo es Luis. La llave es 3.' },

  { id: 'S6-E2', tipo: 'opcion', sub: 'Pilas',
    q: 'Rosa hace, en este orden: registra el préstamo 11, registra el préstamo 12 y borra al socio 6. Después presiona «Deshacer» dos veces. ¿Qué se deshace?',
    op: ['Primero el borrado del socio 6 y después el préstamo 12',
         'Primero el préstamo 11 y después el préstamo 12',
         'Primero el préstamo 12 y después el préstamo 11',
         'Solo el préstamo 11'],
    pista: 'Deshacer funciona como una pila: LIFO.',
    ex: 'La última acción guardada es la primera que se deshace. Por eso «Deshacer» se implementa con una pila.' },

  { id: 'S6-E3', tipo: 'opcion', sub: 'Elegir la estructura',
    q: '¿Por qué las reservas deben ir en una COLA y no en una PILA?',
    op: ['Porque así se atiende primero a quien reservó primero; con una pila, el último en reservar se llevaría el libro',
         'Porque una cola ocupa menos memoria que una pila',
         'Porque en una pila no se pueden guardar nombres',
         'Da igual: las dos atienden en el mismo orden'],
    pista: 'Piensa en quién se lleva el libro en cada caso.',
    ex: 'La estructura se elige por el comportamiento que necesita el problema: en las reservas, justicia por orden de llegada (FIFO).' },

  { id: 'S6-E4', tipo: 'opcion', sub: 'Listas enlazadas',
    q: 'Los préstamos activos están en una lista enlazada. Se devuelve el préstamo 7. ¿Qué hay que cambiar para sacarlo de la lista?',
    code: { lang: 'txt', txt: 'inicio → [3] → [7] → [10] → null' },
    op: ['Que el nodo 3 apunte al nodo 10',
         'Mover todos los nodos una posición a la izquierda',
         'Que el nodo 10 apunte al nodo 3',
         'Borrar el nodo 3 y el nodo 7'],
    pista: 'En una lista enlazada no se mueven datos: se cambian enlaces.',
    ex: 'Basta con «saltar» el nodo: el siguiente de 3 pasa a ser 10. En un arreglo, en cambio, habría que desplazar los elementos.' },

  { id: 'S6-E5', tipo: 'valor', sub: 'Complejidad',
    q: 'Se busca un libro por código en un arreglo NO ordenado de 1000 libros, con búsqueda secuencial. En el peor caso, ¿cuántas comparaciones se hacen?',
    acepta: ['1000', 'mil'],
    pista: 'El peor caso es que el libro esté al final, o que no esté.',
    ex: 'La búsqueda secuencial es O(n): en el peor caso revisa los n elementos. Con 1000 libros, 1000 comparaciones.' }
  ]
},

/* ═══════════════ 7 · JAVA ═══════════════ */
{ id: 'java', n: 7, nombre: 'Java en consola', area: 'Programación', ico: '☕', guia: 'bit',
  intro: 'La versión final de la multa se hace en Java, en consola. Lee el código con atención: Java no perdona un punto y coma.',
  llave: { valor: '2', txt: 'préstamos con atraso' },
  retos: [
  { id: 'S7-J1', tipo: 'opcion', sub: 'Lectura de código',
    q: 'El usuario escribe 10. ¿Qué muestra?',
    code: { lang: 'java', txt:
`import java.util.Scanner;

public class Multa {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dias = sc.nextInt();
        int atraso = dias - 7;
        int multa = 0;
        if (atraso > 0) {
            multa = atraso * 1000;
        }
        System.out.println("Multa: " + multa);
    }
}` },
    op: ['Multa: 3000', 'Multa: 10000', 'Multa: atraso * 1000', 'Multa: 0'],
    pista: 'Haz la prueba de escritorio: dias = 10.',
    ex: 'atraso = 3, entra al if y multa = 3000. El + une el texto con el valor de la variable.' },

  { id: 'S7-J2', tipo: 'opcion', sub: 'Tipos de datos',
    q: 'Esta línea no compila. ¿Por qué?',
    code: { lang: 'java', txt: 'int multa = 1500.5;' },
    op: ['Porque 1500.5 es un double y no entra en un int sin convertirlo',
         'Porque falta el punto y coma',
         'Porque multa es una palabra reservada',
         'Porque los int no pueden pasar de 1000'],
    pista: 'En Java cada variable tiene un tipo fijo.',
    ex: 'Java es de tipado estático: no deja guardar un decimal en un entero porque se perdería información. Habría que usar double o convertir con (int).' },

  { id: 'S7-J3', tipo: 'ordenar', sub: 'Ciclos y arreglos',
    q: 'Ordena las líneas para sumar todas las multas del arreglo y mostrar el total.',
    lang: 'java',
    lineas: ['int[] multas = {0, 3000, 8000};', 'int total = 0;', 'for (int i = 0; i < multas.length; i++) {', '    total = total + multas[i];', '}', 'System.out.println("Total: " + total);'],
    pista: 'Declarar → inicializar el acumulador → recorrer → mostrar.',
    ex: 'Es el mismo acumulador de 2°, ahora con la sintaxis de Java: tipo declarado, llaves y length.' },

  { id: 'S7-J4', tipo: 'valor', sub: 'Ciclos y arreglos',
    q: '¿Qué número muestra?',
    code: { lang: 'java', txt:
`int[] dias = {5, 10, 7, 15};
int conAtraso = 0;
for (int i = 0; i < dias.length; i++) {
    if (dias[i] > 7) {
        conAtraso++;
    }
}
System.out.println(conAtraso);` },
    acepta: ['2', 'dos'],
    pista: 'conAtraso++ suma 1. ¿Cuántos valores son mayores que 7?',
    ex: 'Solo 10 y 15 superan los 7 días: 2 préstamos con atraso. Esa es la llave.' },

  { id: 'S7-J5', tipo: 'opcion', sub: 'De Python a Java',
    q: '¿Cuál es el equivalente en Java de este ciclo de Python?',
    code: { lang: 'py', txt: 'for i in range(5):\n    print(i)' },
    op: ['for (int i = 0; i < 5; i++) { System.out.println(i); }',
         'for (int i = 1; i <= 5; i++) { System.out.println(i); }',
         'for i in range(5) { System.out.println(i); }',
         'while (i < 5) { System.out.println(i); }'],
    pista: 'range(5) va del 0 al 4.',
    ex: 'range(5) empieza en 0 y no incluye el 5: en Java, i = 0; i < 5; i++. La opción con while no declara ni incrementa i.' },

  { id: 'S7-J6', tipo: 'opcion', sub: 'Lectura de código',
    q: '¿Qué muestra esta línea?',
    code: { lang: 'java', txt: 'System.out.println("Total: " + 2 + 3);' },
    op: ['Total: 23', 'Total: 5', 'Total: 2 + 3', 'Da error de compilación'],
    pista: 'Java evalúa de izquierda a derecha, y texto + número da texto.',
    ex: '"Total: " + 2 da "Total: 2" (texto) y después + 3 lo pega: "Total: 23". Para sumar primero: "Total: " + (2 + 3).' }
  ]
},

/* ═══════════════ 8 · ÁRBOLES (se activa en config.js) ═══════════════ */
{ id: 'arboles', n: 8, nombre: 'El índice de libros', area: 'Algorítmica 3', ico: '🌳', guia: 'gatiel', opcional: 'arboles',
  intro: 'La biblioteca creció y buscar por código tarda demasiado. Vamos a organizar los códigos en un árbol binario de búsqueda (ABB).',
  llave: { valor: '3', txt: 'comparaciones para encontrar el 40' },
  retos: [
  { id: 'S8-A1', tipo: 'opcion', sub: 'Inserción en ABB',
    q: 'Se insertan los códigos 50, 30, 70, 20, 40 y 60, en ese orden, en un ABB vacío. ¿Cuál es el hijo izquierdo de 30?',
    op: ['20', '40', '50', '60'],
    pista: 'Menor va a la izquierda, mayor a la derecha. El 50 es la raíz.',
    ex: '50 es la raíz; 30 va a su izquierda; 20 (menor que 50 y que 30) queda a la izquierda de 30; 40 a la derecha de 30.' },

  { id: 'S8-A2', tipo: 'valor', sub: 'Recorridos',
    q: 'En ese mismo árbol, escribe el recorrido INORDEN (separado por espacios).',
    acepta: ['20 30 40 50 60 70'],
    pista: 'Inorden: izquierdo → raíz → derecho.',
    ex: 'En un ABB, el recorrido inorden siempre devuelve los valores ordenados de menor a mayor.' },

  { id: 'S8-A3', tipo: 'valor', sub: 'Búsqueda en ABB',
    q: '¿Cuántas comparaciones hacen falta para encontrar el 40?',
    acepta: ['3', 'tres'],
    pista: 'Empieza en la raíz y cuenta cada nodo que visitas.',
    ex: '50 (es menor, voy a la izquierda) → 30 (es mayor, voy a la derecha) → 40 (¡encontrado!). 3 comparaciones: esa es la llave.' },

  { id: 'S8-A4', tipo: 'opcion', sub: 'Eficiencia',
    q: 'Si los códigos se insertan ya ordenados (10, 20, 30, 40, 50…), ¿qué le pasa al árbol?',
    op: ['Se degenera en una lista: todos quedan a la derecha y la búsqueda vuelve a ser lenta',
         'Queda perfectamente balanceado',
         'No se puede insertar en orden',
         'Se transforma en una pila'],
    pista: 'Inserta 10, 20 y 30 en papel y mira la forma que queda.',
    ex: 'Un ABB solo es eficiente si está balanceado. Insertando en orden se pierde la ventaja: la búsqueda pasa a ser O(n).' }
  ]
},

/* ═══════════════ 9 · DEFENSA ═══════════════ */
{ id: 'defensa', n: 9, nombre: 'La defensa', area: 'Proyectos', ico: '🎤', guia: 'gatiel',
  intro: 'El sistema está listo. Ahora el jurado pregunta. No alcanza con que funcione: hay que justificar cada decisión.',
  llave: { valor: '✓', txt: 'sistema defendido' },
  retos: [
  { id: 'S9-F1', tipo: 'opcion', sub: 'Justificar decisiones',
    q: 'Jurado: «¿Por qué no dejaron todo en una sola planilla, si era más fácil?»',
    op: ['Porque en la planilla los datos se repetían y se contradecían; en la base de datos cada dato se guarda una vez y se relaciona por claves',
         'Porque Excel es un programa viejo',
         'Porque la profesora nos pidió usar SQL',
         'Porque una base de datos se ve más profesional'],
    pista: 'Recuerda lo que encontraron en la sala de la planilla.',
    ex: 'Una buena defensa responde con evidencia del propio proyecto: «Ma. Benítez» y el curso repetido eran problemas reales.' },

  { id: 'S9-F2', tipo: 'opcion', sub: 'Justificar decisiones',
    q: 'Jurado: «Con 50.000 libros, la búsqueda por código va a ser lenta. ¿Qué proponen?»',
    op: ['Organizar los códigos para no recorrer todo: un índice o un árbol de búsqueda balanceado en lugar de la búsqueda secuencial',
         'Comprar una computadora más rápida',
         'Pedir a los usuarios que esperen',
         'Dividir los libros en varias planillas de Excel'],
    pista: 'La sala de estructuras habla de O(n).',
    ex: 'La respuesta técnica cambia el algoritmo, no el hardware: de O(n) a una búsqueda que descarta la mitad de los datos en cada paso.' },

  { id: 'S9-F3', tipo: 'opcion', sub: 'Evaluación del sistema',
    q: 'Jurado: «¿Cómo demuestran que el sistema mejoró la atención en la biblioteca?»',
    op: ['Con datos: el tiempo de atención antes y después, y una encuesta de evaluación tabulada',
         'Porque a la bibliotecaria le gustó',
         'Porque el sistema no tiene errores',
         'Porque usamos tecnología moderna'],
    pista: 'Una afirmación se defiende con evidencia medible.',
    ex: 'Es el circuito de 1° aplicado al sistema real: los datos de la evaluación son la prueba.' },

  { id: 'S9-F4', tipo: 'opcion', sub: 'Documentación',
    q: 'Jurado: «¿Qué documento le dejan a Rosa para que pueda usar el sistema sola?»',
    op: ['El manual de usuario, con pasos y capturas de cada tarea',
         'La documentación técnica con el modelo de datos y el código',
         'El informe de viabilidad',
         'El script SQL de creación de tablas'],
    pista: 'Rosa no es programadora.',
    ex: 'La documentación técnica es para quien mantiene el sistema; el manual de usuario, para quien lo usa. Son dos documentos distintos.' },

  { id: 'S9-F5', tipo: 'opcion', sub: 'Ética profesional',
    q: 'En la demostración, el sistema calcula mal una multa delante del jurado. ¿Qué es lo más profesional?',
    op: ['Reconocer el error, mostrar con qué prueba se detecta y explicar cómo se corrige',
         'Decir que es un problema de la computadora del colegio',
         'Cambiar de tema rápido',
         'Decir que ese caso nunca va a pasar'],
    pista: 'El jurado evalúa al técnico, no solo al sistema.',
    ex: 'Ningún sistema es perfecto. Un técnico se nota en cómo detecta, explica y corrige sus errores.' }
  ]
}

];
