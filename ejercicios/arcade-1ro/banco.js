/* ═══════════════════════════════════════════════════════════════
   BATIN · Arcade de 1° · BANCO DE DESAFÍOS
   Lo usan la Planilla de Bit y el Simulacro ICIENTEC de Techi.
   —  este es el archivo que se edita  —
   ═══════════════════════════════════════════════════════════════

   id    código único. Si cambias mucho un desafío, cámbiale el id.
   tema  'excel' · 'datos' (encuestas, codificación, tabulación, gráficos)
         'word' · 'ppt' · 'proyecto' (objetivos, hipótesis, viabilidad)
   nv    3 aplicar · 4 analizar · 5 evaluar · 6 crear
   sub   subtema corto: se agrupa en el panel (escríbelo siempre igual)
   pista se muestra con la lupa o el comodín
   ex    explicación que aparece después de responder

   TIPOS
   opcion     → op: [...]  ⚠ la PRIMERA opción es la correcta (se mezclan solas)
   valor      → acepta: ['30000', ...]  No importan mayúsculas, tildes, espacios,
                «Gs», el % ni coma/punto decimal. En fórmulas, «;» y «,» valen igual.
                Opcional: sufijo: '%', placeholder: '=…'
   ordenar    → lineas: [...] en el orden CORRECTO (el juego las desordena)
   clasificar → categorias: [...], items: [{ t, c }]
   traza      → tabla para completar: cols, filas. Lo que va entre { } lo escribe
                el estudiante; varias respuestas válidas se separan con |  {66,7|67}
   fragmento  → texto con partes para tocar entre [[ ]]; correcta: índice desde 0.
                marco: 'doc' (párrafo de Word) o 'diapo' (viñetas; cada \n es una)
   celda      → hoja + correcta: 'C7' (o ['B5','B8'] si vale más de una)

   VISUALES (opcionales, en cualquier tipo)
   hoja   { nombre, cols:['A','B'], desde:1, filas:[[...]], activa:'B6', barra:'=SUMA(B2:B5)' }
          Los números van sin comillas (se alinean a la derecha). Un texto que
          empieza con = se muestra como fórmula; con # como error.
   doc    { enc, titulo, parrafos:[...], pie }  («## Título» = título)
   diapo  { titulo, texto:[...], cargada:true, grafico }
   grafico{ tipo:'barras'|'torta'|'linea', titulo, datos:[['Sí',18],['No',12]], resaltar:'Sí', pct:true }
   vis    [{ etq:'Versión A', tipo:'diapo', ... }, ...]  para comparar dos visuales
   ═══════════════════════════════════════════════════════════════ */

window.AR_BANCO = [

/* ═════════════════════════ N3 · APLICAR ═════════════════════════ */

{ id: 'X3-01', tema: 'excel', nv: 3, tipo: 'valor', sub: 'SUMA y rangos',
  q: '¿Qué resultado muestra C5?',
  hoja: { cols: ['A', 'B', 'C'], desde: 1, filas: [['Curso', 'Alumnos', 'Compran chipa'], ['1° A', 32, 20], ['1° B', 28, 14], ['1° C', 30, 21], ['Total', '', '?']], activa: 'C5', barra: '=SUMA(C2:C4)' },
  acepta: ['55'],
  pista: 'El rango C2:C4 incluye C2, C3 y C4.',
  ex: '20 + 14 + 21 = 55.' },

{ id: 'X3-02', tema: 'excel', nv: 3, tipo: 'valor', sub: 'Porcentajes',
  q: 'D2 tiene formato de porcentaje con un decimal. ¿Qué muestra?',
  hoja: { cols: ['A', 'B', 'C', 'D'], desde: 1, filas: [['Curso', 'Alumnos', 'Compran chipa', '% que compra'], ['1° A', 32, 20, '?']], activa: 'D2', barra: '=C2/B2' },
  sufijo: '%', acepta: ['62,5', '62.5', '62,5%'],
  pista: 'Divide la parte por el total. El formato de porcentaje multiplica por 100.',
  ex: '20 / 32 = 0,625 → con formato porcentaje: 62,5 %.' },

{ id: 'X3-03', tema: 'excel', nv: 3, tipo: 'opcion', sub: 'Referencias relativas y absolutas',
  q: 'En D2 está la fórmula =C2/B2. Si la copias hacia abajo, ¿qué fórmula aparece en D4?',
  op: ['=C4/B4', '=C2/B2', '=C4/B2', '=D4/C4'],
  pista: 'Al copiar una fila hacia abajo, las referencias relativas bajan la misma cantidad de filas.',
  ex: 'De D2 a D4 bajaste 2 filas, así que C2 → C4 y B2 → B4. Por eso se llaman referencias relativas.' },

{ id: 'X3-04', tema: 'excel', nv: 3, tipo: 'valor', sub: 'CONTAR.SI',
  q: 'Las respuestas están codificadas: 1 = Sí, 2 = No. ¿Qué muestra B13?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Encuesta', '¿Usas la biblioteca?'], [1, 1], [2, 2], [3, 1], [4, 1], [5, 2], [6, 1], [7, 2], [8, 1], [9, 1], [10, 2], ['', ''], ['Sí', '?']], activa: 'B13', barra: '=CONTAR.SI(B2:B11;1)' },
  acepta: ['6'],
  pista: 'CONTAR.SI no suma: cuenta cuántas celdas cumplen el criterio (ser igual a 1).',
  ex: 'Hay seis celdas con el código 1 (encuestas 1, 3, 4, 6, 8 y 9).' },

{ id: 'X3-05', tema: 'excel', nv: 3, tipo: 'valor', sub: 'Función SI',
  q: '¿Qué palabra muestra C2?',
  hoja: { cols: ['A', 'B', 'C'], desde: 1, filas: [['Alumno', 'Puntaje', 'Situación'], ['Equipo Delta', 58, '?']], activa: 'C2', barra: '=SI(B2>=60;"Aprobado";"Recupera")' },
  acepta: ['Recupera'],
  pista: '¿58 es mayor o igual que 60?',
  ex: '58 >= 60 es FALSO, entonces SI devuelve el tercer argumento: «Recupera».' },

{ id: 'X3-06', tema: 'excel', nv: 3, tipo: 'valor', sub: 'SUMAR.SI',
  q: '¿Qué valor muestra B8?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Rubro', 'Monto (Gs)'], ['Materiales', 45000], ['Transporte', 20000], ['Materiales', 30000], ['Impresión', 15000], ['Transporte', 10000], ['', ''], ['Transporte', '?']], activa: 'B8', barra: '=SUMAR.SI(A2:A6;"Transporte";B2:B6)' },
  sufijo: 'Gs', acepta: ['30000', '30.000'],
  pista: 'Suma solo los montos de las filas donde la columna A dice «Transporte».',
  ex: '20.000 + 10.000 = 30.000 Gs. SUMAR.SI mira el criterio en A y suma lo que está en la misma fila de B.' },

{ id: 'X3-07', tema: 'excel', nv: 3, tipo: 'opcion', sub: 'Referencias relativas y absolutas',
  q: 'El total de alumnos está en C5. Quieres calcular en D2 el porcentaje de cada curso y copiar la fórmula hasta D4. ¿Qué escribes en D2?',
  op: ['=C2/$C$5', '=C2/C5', '=$C$2/$C$5', '=C5/C2'],
  pista: 'Al copiar, la parte de cada curso tiene que cambiar, pero el total tiene que quedarse quieto.',
  ex: 'C2 es relativa (cambia en cada fila) y $C$5 es absoluta (siempre apunta al total). Con =C2/C5, en D3 quedaría =C3/C6: una celda vacía.' },

{ id: 'X3-08', tema: 'datos', nv: 3, tipo: 'traza', sub: 'Tabla de frecuencias',
  q: 'Tabula la pregunta «¿Cuántas veces por semana compras en la cantina?» (1 = Nunca · 2 = 1 o 2 veces · 3 = Tres o más). Completa la tabla.',
  hoja: { nombre: 'Respuestas codificadas (12 encuestas)', cols: ['A', 'B', 'C', 'D', 'E', 'F'], desde: 1, filas: [[2, 3, 2, 1, 2, 2], [3, 1, 2, 3, 2, 1]] },
  cols: ['Código', 'Respuesta', 'Frecuencia', '%'],
  filas: [['1', 'Nunca', '{3}', '{25}'], ['2', '1 o 2 veces', '{6}', '{50}'], ['3', 'Tres o más', '{3}', '{25}'], ['', 'Total', '{12}', '100']],
  pista: 'Cuenta cuántas veces aparece cada código. El porcentaje es frecuencia ÷ total × 100.',
  ex: 'Código 1: 3 veces; código 2: 6; código 3: 3. Total 12. Porcentajes: 25 %, 50 % y 25 %.' },

{ id: 'X3-09', tema: 'datos', nv: 3, tipo: 'clasificar', sub: 'Tipos de pregunta',
  q: '¿Qué tipo de pregunta es cada una?',
  categorias: ['Cerrada', 'Abierta', 'Escala Likert'],
  items: [
    { t: '¿Usas el comedor? ( ) Sí ( ) No', c: 'Cerrada' },
    { t: '¿Qué cambiarías del comedor?', c: 'Abierta' },
    { t: '«La comida es saludable»: de 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo)', c: 'Escala Likert' },
    { t: '¿En qué curso estás? ( ) 1° ( ) 2° ( ) 3°', c: 'Cerrada' },
    { t: 'Cuéntanos una experiencia en el comedor', c: 'Abierta' }
  ],
  pista: 'Cerrada: opciones fijas. Abierta: se responde con palabras propias. Likert: grado de acuerdo en una escala.',
  ex: 'Las cerradas y las Likert se tabulan rápido; las abiertas dan matices pero hay que agruparlas antes de contarlas.' },

{ id: 'X3-10', tema: 'datos', nv: 3, tipo: 'valor', sub: 'Codificación',
  q: 'Libro de códigos: 1 = Sí · 2 = No · 9 = No responde. En la encuesta 7 la persona dejó la pregunta en blanco. ¿Qué cargas en la planilla?',
  acepta: ['9'],
  pista: 'Una celda vacía no se distingue de un dato que te olvidaste de cargar.',
  ex: 'Se carga 9: así sabes que la persona no respondió, y no que faltó cargar el dato.' },

{ id: 'X3-11', tema: 'datos', nv: 3, tipo: 'opcion', sub: 'Elegir el gráfico',
  q: 'Quieres comparar cuántos alumnos de 1°, 2° y 3° usan la biblioteca. ¿Qué gráfico usas?',
  op: ['Barras', 'Torta', 'Línea', 'Dispersión'],
  pista: 'Barras para comparar categorías, torta para partes de un todo, línea para cambios en el tiempo.',
  ex: 'Se comparan tres categorías (los cursos): barras. La línea serviría si fuera el uso a lo largo de los meses.' },

{ id: 'X3-12', tema: 'word', nv: 3, tipo: 'valor', sub: 'Saltos de sección y numeración',
  q: 'La portada está en la página 1 del archivo y no lleva número. El cuerpo empieza en la página 2 y su numeración arranca en 1. ¿Qué número se ve en la página 5 del archivo?',
  acepta: ['4'],
  pista: 'Página 2 del archivo = número 1. Sigue contando.',
  ex: 'Página 2 → 1, página 3 → 2, página 4 → 3, página 5 → 4.' },

{ id: 'X3-13', tema: 'word', nv: 3, tipo: 'opcion', sub: 'Estilos y tabla de contenido',
  q: 'Ya insertaste la tabla de contenido. Después agregaste la sección «Anexos» con el estilo Título 1. ¿Qué haces para que aparezca en el índice?',
  op: ['Actualizar la tabla de contenido (clic derecho → Actualizar campo)', 'Escribir «Anexos» a mano al final del índice', 'Borrar el índice y escribirlo de nuevo', 'Nada: Word lo agrega solo en el momento'],
  pista: 'El índice automático no cambia solo mientras escribes.',
  ex: 'La tabla de contenido se actualiza con un clic. Escribir a mano rompe el índice automático: la próxima vez que se actualice, se pierde.' },

{ id: 'X3-14', tema: 'ppt', nv: 3, tipo: 'opcion', sub: 'Gráficos para proyectar',
  q: 'Vas a proyectar en la feria un gráfico que hiciste en Excel. ¿Qué haces?',
  op: ['Lo rehaces con un solo mensaje: color solo en el dato importante y lo demás en gris', 'Lo copias y pegas tal como salió de Excel', 'Le agregas más etiquetas y colores para que se vea completo', 'Lo reemplazas por la tabla con todos los números'],
  pista: 'El público verá ese gráfico unos segundos, desde lejos, mientras alguien habla.',
  ex: 'Un gráfico de presentación comunica una idea de un vistazo. El de Excel sirve para analizar con tiempo.' },

{ id: 'X3-15', tema: 'ppt', nv: 3, tipo: 'opcion', sub: 'Texto en la diapositiva',
  q: '¿Qué haces con esta diapositiva?',
  diapo: { cargada: true, titulo: 'Metodología', texto: ['Para realizar este proyecto lo primero que hicimos fue reunirnos como equipo y pensar qué preguntas íbamos a hacer en la encuesta.', 'Después aplicamos la encuesta en papel a los tres cursos de primero durante la semana del 3 al 7 de junio.', 'Luego cargamos todas las respuestas en Excel y las tabulamos con fórmulas.'] },
  op: ['Dejo frases cortas o palabras clave y el detalle lo digo en voz alta', 'Achico la letra para que entre más texto', 'La dejo así y la leo en voz alta', 'Agrego una imagen de fondo para que no se vea tan vacía'],
  pista: 'Si se entiende todo sin que nadie hable, la diapositiva tiene demasiado texto.',
  ex: 'La diapositiva apoya lo que dices, no lo repite: «Encuesta en papel · 3 cursos · 3 al 7 de junio · tabulación en Excel».' },

{ id: 'X3-16', tema: 'excel', nv: 3, tipo: 'celda', sub: 'Datos mal cargados',
  q: '=SUMA(B2:B7) da 95, pero sumando a mano te da 120. Toca la celda culpable.',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Curso', 'Encuestas'], ['1° A', 20], ['1° B', 15], ['1° C', '25 alumnos'], ['2° A', 30], ['2° B', 10], ['2° C', 20], ['Total', 95]], activa: 'B8', barra: '=SUMA(B2:B7)' },
  correcta: 'B4',
  pista: 'SUMA ignora las celdas con texto. Mira cómo está alineado cada dato.',
  ex: '«25 alumnos» es texto, no número: SUMA lo salta. 120 − 95 = 25. En la celda va solo el número; la unidad va en el encabezado.' },

{ id: 'X3-17', tema: 'datos', nv: 3, tipo: 'valor', sub: 'Escala Likert',
  q: '«Me gustaría tener talleres los sábados» (1 = Totalmente en desacuerdo … 5 = Totalmente de acuerdo). ¿Qué muestra B7?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Encuesta', 'Respuesta'], [1, 4], [2, 5], [3, 3], [4, 4], [5, 4], ['Promedio', '?']], activa: 'B7', barra: '=PROMEDIO(B2:B6)' },
  acepta: ['4'],
  pista: 'Suma las cinco respuestas y divide entre 5.',
  ex: '(4 + 5 + 3 + 4 + 4) / 5 = 20 / 5 = 4: en promedio, «de acuerdo».' },

{ id: 'X3-18', tema: 'proyecto', nv: 3, tipo: 'valor', sub: 'Viabilidad económica',
  q: 'El proyecto necesita 3 carteles de 25.000 Gs y un dominio web de 120.000 Gs. ¿Cuánto cuesta en total?',
  sufijo: 'Gs', acepta: ['195000', '195.000'],
  pista: 'Primero multiplica los carteles, después suma el dominio.',
  ex: '3 × 25.000 = 75.000; 75.000 + 120.000 = 195.000 Gs.' },

/* ═════════════════════════ N4 · ANALIZAR ═════════════════════════ */

{ id: 'X4-01', tema: 'excel', nv: 4, tipo: 'celda', sub: 'Referencias relativas y absolutas',
  q: 'La columna D calcula el porcentaje de cada curso. Una de las fórmulas está mal. Tócala.',
  hoja: { cols: ['A', 'B', 'C', 'D'], desde: 1, filas: [['Curso', 'Alumnos', 'Desayunan', '% desayunan'], ['1° A', 32, 24, '=C2/B2'], ['1° B', 28, 14, '=C3/B3'], ['1° C', 30, 18, '=C4/B3'], ['2° A', 31, 20, '=C5/B5']] },
  correcta: 'D4',
  pista: 'En cada fila, las dos referencias deberían tener el MISMO número de fila.',
  ex: 'D4 divide C4 (1° C) por B3 (alumnos de 1° B): mezcla datos de dos cursos. Debería ser =C4/B4.' },

{ id: 'X4-02', tema: 'excel', nv: 4, tipo: 'opcion', sub: 'Errores en fórmulas',
  q: 'En D2 escribieron =C2/C5 y la copiaron hacia abajo. ¿Por qué aparece el error?',
  hoja: { cols: ['A', 'B', 'C', 'D'], desde: 1, filas: [['Curso', '', 'Votos', '% votos'], ['1° A', '', 20, '36%'], ['1° B', '', 14, '#¡DIV/0!'], ['1° C', '', 21, '#¡DIV/0!'], ['Total', '', 55, '']], activa: 'D3', barra: '=C3/C6' },
  op: ['La referencia al total se movió a C6, que está vacía; había que fijarla con $C$5', 'Excel no puede dividir números enteros', 'Faltan los paréntesis en la fórmula', 'Las celdas de la columna C tienen texto'],
  pista: 'Mira la barra de fórmulas de D3: ¿a qué celda está dividiendo?',
  ex: 'Al copiar, C5 se convirtió en C6 y C7 (vacías = 0). Dividir por 0 da #¡DIV/0!. Con =C2/$C$5 el total queda fijo.' },

{ id: 'X4-03', tema: 'excel', nv: 4, tipo: 'valor', sub: 'CONTAR.SI con criterio',
  q: 'Se consideran «satisfechos» los que respondieron 4 o 5. B10 muestra =CONTAR.SI(B2:B9;">=4"). ¿Qué PORCENTAJE de encuestados está satisfecho?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Encuesta', 'Satisfacción (1 a 5)'], [1, 5], [2, 3], [3, 4], [4, 2], [5, 4], [6, 5], [7, 1], [8, 4], ['Satisfechos', '?']], activa: 'B10', barra: '=CONTAR.SI(B2:B9;">=4")' },
  sufijo: '%', acepta: ['62,5', '62.5', '62,5%'],
  pista: 'Primero cuenta los 4 y los 5. Después divide por la cantidad de encuestas.',
  ex: 'Hay 5 respuestas >= 4 (5, 4, 4, 5, 4) de 8 encuestas: 5 / 8 = 62,5 %.' },

{ id: 'X4-04', tema: 'datos', nv: 4, tipo: 'opcion', sub: 'Limpieza de datos',
  q: 'En Google Forms la respuesta era de texto libre. =CONTAR.SI(B2:B31;"Sí") da 12, pero contando a mano hay 19 que dijeron que sí. ¿Qué pasó?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Encuesta', '¿Participarías?'], [1, 'Sí'], [2, 'Si'], [3, 'sí'], [4, 'si claro'], [5, 'No'], [6, 'SI']] },
  op: ['Las respuestas escritas distinto («Si», «si claro»…) no coinciden con el criterio; había que usar opciones cerradas o codificar', 'CONTAR.SI no funciona con texto', 'Hay que usar SUMA en lugar de CONTAR.SI', 'Google Forms borró algunas respuestas'],
  pista: 'CONTAR.SI no distingue mayúsculas, pero «Si» sin tilde y «si claro» no son exactamente «Sí».',
  ex: 'Por eso se diseña de atrás para adelante: con una pregunta cerrada (opciones Sí / No) o un código, cada respuesta queda escrita igual y se cuenta bien.' },

{ id: 'X4-05', tema: 'datos', nv: 4, tipo: 'fragmento', sub: 'Coherencia datos–informe', marco: 'doc',
  q: 'Compara con la planilla. ¿Qué parte del informe NO coincide con los datos?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['¿Usarías la app?', 'Frecuencia'], ['Sí', 18], ['No', 9], ['No sabe', 3], ['Total', 30]] },
  doc: { enc: 'Informe · Resultados' },
  texto: 'Se encuestó a [[30 estudiantes de 1°]]. De ellos, [[18 respondieron que sí]] usarían la app, lo que representa [[el 80 % del total]]. Solo [[3 personas no supieron qué responder]].',
  correcta: 2,
  pista: 'Calcula 18 dividido 30.',
  ex: '18 / 30 = 60 %, no 80 %. Un número equivocado en el informe hace dudar de todo el trabajo.' },

{ id: 'X4-06', tema: 'datos', nv: 4, tipo: 'opcion', sub: 'Muestra',
  q: 'Para saber si el colegio necesita un club de robótica, el equipo encuestó a los 15 integrantes del taller de robótica. El 100 % dijo que sí. ¿Qué problema tiene?',
  op: ['La muestra está sesgada: solo preguntaron a quienes ya les gusta la robótica', 'Faltó hacer un gráfico de torta', 'Quince personas son demasiadas', 'No hay ningún problema: el resultado es unánime'],
  pista: '¿Esas 15 personas representan a todos los alumnos del colegio?',
  ex: 'Si encuestas solo a un grupo que ya piensa igual, el resultado no representa al colegio. Hay que incluir alumnos de distintos cursos y turnos.' },

{ id: 'X4-07', tema: 'datos', nv: 4, tipo: 'opcion', sub: 'Preguntas abiertas',
  q: 'La pregunta abierta «¿Qué mejorarías del colegio?» recibió 60 respuestas distintas. ¿Cómo la tabulas?',
  op: ['Leo todas, armo categorías (infraestructura, horarios, comedor…), le doy un código a cada una y cuento', 'Copio las 60 respuestas en una diapositiva', 'Cuento cuántas palabras tiene cada respuesta', 'No se puede tabular: la saco del informe'],
  pista: 'Para contar, primero hay que agrupar las respuestas parecidas.',
  ex: 'Las respuestas abiertas se agrupan en categorías, se codifican y recién ahí se cuentan con CONTAR.SI.' },

{ id: 'X4-08', tema: 'word', nv: 4, tipo: 'clasificar', sub: 'Secciones del informe',
  q: '¿En qué sección del informe va cada frase?',
  categorias: ['Introducción', 'Metodología', 'Resultados', 'Conclusión'],
  items: [
    { t: 'Se aplicó un formulario de Google a 90 estudiantes de 1° entre el 3 y el 7 de junio.', c: 'Metodología' },
    { t: 'El 64 % de los encuestados no desayuna antes de clases.', c: 'Resultados' },
    { t: 'Muchos alumnos del turno mañana llegan sin desayunar y les cuesta concentrarse.', c: 'Introducción' },
    { t: 'Las respuestas se tabularon en Excel con CONTAR.SI.', c: 'Metodología' },
    { t: 'Los datos confirman la necesidad, por lo que el proyecto es pertinente.', c: 'Conclusión' }
  ],
  pista: 'Introducción: el problema. Metodología: cómo. Resultados: qué salió. Conclusión: qué significa.',
  ex: 'Separar bien las secciones permite que el jurado encuentre rápido lo que busca.' },

{ id: 'X4-09', tema: 'word', nv: 4, tipo: 'opcion', sub: 'Tablas y figuras',
  q: 'Pegaron un gráfico en el informe sin título ni fuente, y el texto dice «como se ve abajo». ¿Qué es lo más correcto?',
  op: ['Ponerle título numerado («Figura 1. …») y fuente, y en el texto escribir «como se ve en la Figura 1»', 'Dejarlo así: el gráfico se entiende solo', 'Escribir el título dentro de la imagen con Paint', 'Agregar una flecha que señale el gráfico'],
  pista: 'Si el gráfico se mueve a otra página, «abajo» deja de ser verdad.',
  ex: 'Las figuras llevan título numerado y fuente (por ejemplo, «Elaboración propia con datos de la encuesta, 2026»). Así el texto puede referirse a ellas aunque se muevan.' },

{ id: 'X4-10', tema: 'word', nv: 4, tipo: 'ordenar', sub: 'Saltos de sección y numeración',
  q: 'Ordena los pasos para que la portada no tenga número y el cuerpo empiece en 1.',
  lineas: ['Insertar un salto de sección (página siguiente) al final de la portada', 'En el pie del cuerpo, desactivar «Vincular al anterior»', 'Configurar el formato de número para que empiece en 1', 'Exportar a PDF y revisar que la numeración no se haya movido'],
  pista: 'Primero hay que separar el documento en dos partes; después independizarlas.',
  ex: 'Salto de sección → desvincular → iniciar en 1 → revisar el PDF. El PDF es el último control antes de entregar.' },

{ id: 'X4-11', tema: 'ppt', nv: 4, tipo: 'fragmento', sub: 'Coherencia planilla–diapositiva', marco: 'diapo',
  q: 'Una viñeta de la diapositiva contradice la planilla. Tócala.',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['¿Cómo llegas al colegio?', '%'], ['Colectivo', '42%'], ['Moto', '25%'], ['A pie', '18%'], ['Auto', '15%']] },
  diapo: { titulo: '¿Cómo llegamos al colegio?' },
  texto: '[[Colectivo: 42 %]]\n[[Moto: 25 %]]\n[[A pie es la opción más usada]]\n[[Auto: 15 %]]',
  correcta: 2,
  pista: 'Busca cuál es el mayor porcentaje en la planilla.',
  ex: 'La opción más usada es el colectivo (42 %). Ir a pie (18 %) está en tercer lugar.' },

{ id: 'X4-12', tema: 'ppt', nv: 4, tipo: 'opcion', sub: 'Elegir el gráfico',
  q: 'Este gráfico se va a proyectar en la feria. ¿Cuál es su principal problema?',
  grafico: { tipo: 'torta', titulo: 'Actividad favorita en el recreo', pct: true, datos: [['Celular', 30], ['Fútbol', 22], ['Charlar', 18], ['Cantina', 12], ['Vóley', 8], ['Leer', 6], ['Otro', 4]] },
  op: ['Tiene demasiadas categorías para una torta: con barras ordenadas se compararía mejor', 'Le faltan colores llamativos', 'Debería ser un gráfico de línea', 'Los porcentajes deberían sumar más de 100'],
  pista: 'La torta funciona con pocas porciones. ¿Se distinguen las más chicas desde lejos?',
  ex: 'Con siete porciones parecidas, el ojo no compara ángulos. Las barras ordenadas de mayor a menor muestran el ranking de un vistazo.' },

{ id: 'X4-13', tema: 'proyecto', nv: 4, tipo: 'clasificar', sub: 'Tipos de viabilidad',
  q: '¿Qué viabilidad se pone en juego en cada caso?',
  categorias: ['Técnica', 'Legal', 'Económica'],
  items: [
    { t: '¿Hay computadoras con internet en el colegio para probar el sistema?', c: 'Técnica' },
    { t: '¿Hace falta permiso de los padres para sacar fotos a los alumnos?', c: 'Legal' },
    { t: 'El hosting cuesta 150.000 Gs al año y el comité aporta 100.000 Gs', c: 'Económica' },
    { t: 'Nadie del equipo usó nunca la plataforma elegida', c: 'Técnica' },
    { t: 'El sistema guardaría el número de cédula de cada alumno', c: 'Legal' },
    { t: 'Imprimir 300 afiches a color', c: 'Económica' }
  ],
  pista: 'Técnica: ¿sabemos y tenemos con qué? Legal: ¿está permitido? Económica: ¿alcanza la plata?',
  ex: 'Un mismo proyecto se evalúa con los tres criterios: si falla uno, hay que ajustar el alcance.' },

{ id: 'X4-14', tema: 'proyecto', nv: 4, tipo: 'opcion', sub: 'Alcance',
  q: 'Un equipo de 1° propone «una app para que toda la ciudad de Luque pida colectivos, lista en 3 meses». ¿Cuál es el problema principal?',
  op: ['El alcance no es realista para el tiempo, el equipo y los recursos disponibles', 'Luque no tiene colectivos', 'Es mejor hacer una página web que una app', 'Tres meses es demasiado tiempo'],
  pista: 'Piensa en quién lo hace, en cuánto tiempo y para cuánta gente.',
  ex: 'Un buen proyecto escolar resuelve un problema acotado y comprobable: por ejemplo, el horario de colectivos de la parada del colegio.' },

{ id: 'X4-15', tema: 'excel', nv: 4, tipo: 'valor', sub: 'Función SI',
  q: 'F1 tiene el presupuesto (150.000). ¿Qué muestra D2?',
  hoja: { cols: ['A', 'B', 'C', 'D', 'E', 'F'], desde: 1, filas: [['Opción', 'Costo', '', '', 'Presupuesto', 150000], ['Cartelería', 180000, '', '?', '', ''], ['Folletos', 90000, '', '', '', '']], activa: 'D2', barra: '=SI(B2<=$F$1;"Viable";"Revisar")' },
  acepta: ['Revisar'],
  pista: '¿180.000 es menor o igual que 150.000?',
  ex: '180.000 <= 150.000 es FALSO: «Revisar». En D3 (folletos, 90.000) daría «Viable», porque $F$1 queda fijo al copiar.' },

{ id: 'X4-16', tema: 'datos', nv: 4, tipo: 'traza', sub: 'Comparar grupos',
  q: '«¿Desayunas antes de venir?» Completa la tabla para comparar los dos turnos.',
  cols: ['Turno', 'Sí', 'No', 'Total', '% que NO desayuna'],
  filas: [['Mañana', 12, 18, '{30}', '{60}'], ['Tarde', 20, 5, '{25}', '{20}']],
  pista: 'El porcentaje se calcula sobre el total de CADA turno, no sobre el total general.',
  ex: 'Mañana: 18 / 30 = 60 %. Tarde: 5 / 25 = 20 %. El problema es tres veces mayor en el turno mañana: eso orienta el proyecto.' },

{ id: 'X4-17', tema: 'word', nv: 4, tipo: 'clasificar', sub: 'Estilos y tabla de contenido',
  q: 'Para que el índice salga bien, ¿qué estilo lleva cada línea?',
  categorias: ['Título 1', 'Título 2', 'Normal'],
  items: [
    { t: 'Resultados', c: 'Título 1' },
    { t: 'Resultados de la encuesta a 1° A', c: 'Título 2' },
    { t: 'El 64 % de los encuestados no desayuna antes de clases.', c: 'Normal' },
    { t: 'Metodología', c: 'Título 1' },
    { t: 'Instrumento: formulario de 10 preguntas', c: 'Título 2' }
  ],
  pista: 'Título 1 = capítulo. Título 2 = subtema dentro del capítulo. Los párrafos van en Normal.',
  ex: 'Saltarse niveles o poner un párrafo como título rompe la jerarquía del índice.' },

{ id: 'X4-18', tema: 'proyecto', nv: 4, tipo: 'traza', sub: 'Viabilidad económica',
  q: 'Completa la planilla de costos del proyecto.',
  cols: ['Ítem', 'Cantidad', 'Precio unit. (Gs)', 'Subtotal (Gs)'],
  filas: [['Sensor de humedad', 3, 85000, '{255000|255.000}'], ['Hosting (1 año)', 1, 120000, '{120000|120.000}'], ['Carteles', 4, 15000, '{60000|60.000}'], ['TOTAL', '', '', '{435000|435.000}'], ['Presupuesto', '', '', 400000], ['Diferencia', '', '', '{-35000|-35.000|35000|35.000}']],
  pista: 'Subtotal = cantidad × precio. Diferencia = presupuesto − total.',
  ex: '255.000 + 120.000 + 60.000 = 435.000 Gs. Faltan 35.000 Gs: así como está, no es viable económicamente.' },

{ id: 'X4-19', tema: 'excel', nv: 4, tipo: 'opcion', sub: 'Gráficos desde la planilla',
  q: 'Seleccionaste A1:B5 y pediste un gráfico de barras, pero aparece una barra gigante que aplasta a las demás. ¿Por qué?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Respuesta', 'Frecuencia'], ['Sí', 18], ['No', 9], ['No sabe', 3], ['Total', 30]] },
  op: ['Incluiste la fila del Total: el gráfico la toma como una categoría más', 'Las barras no sirven para frecuencias', 'Faltó poner los datos en porcentaje', 'Excel siempre exagera la primera barra'],
  pista: '¿Qué filas tienen que estar en el gráfico? ¿Cuál sobra?',
  ex: 'El total no es una respuesta: hay que seleccionar A1:B4. Si no, aparece una barra «Total» igual a la suma de todas.' },

/* ═════════════════════════ N5 · EVALUAR ═════════════════════════ */

{ id: 'X5-01', tema: 'ppt', nv: 5, tipo: 'opcion', sub: 'Diseño de diapositivas',
  q: '¿Cuál de las dos versiones es mejor para la feria y por qué?',
  vis: [
    { etq: 'Versión A', tipo: 'diapo', cargada: true, titulo: 'Resultados', texto: ['Encuestamos a 90 alumnos de 1° y el 64 % respondió que no desayuna antes de clases', 'En el turno mañana el porcentaje fue más alto que en el turno tarde', 'El motivo más mencionado fue la falta de tiempo', 'También se mencionó que no tienen hambre a esa hora', 'Algunos dijeron que no les gusta lo que hay en su casa'] },
    { etq: 'Versión B', tipo: 'diapo', titulo: '6 de cada 10 llegan sin desayunar', grafico: { tipo: 'barras', pct: true, datos: [['No desayuna', 64], ['Desayuna', 36]], resaltar: 'No desayuna' } }
  ],
  op: ['B: tiene un mensaje principal y resalta el dato; el resto se dice en voz alta', 'A: tiene más información, así nadie se pierde nada', 'A: el público puede leerla mientras el equipo habla', 'Las dos son iguales de buenas: tienen los mismos datos'],
  pista: 'Una diapositiva apoya al que habla. ¿Cuál se entiende en tres segundos desde el fondo?',
  ex: 'La versión A compite con el expositor: el público lee y deja de escuchar. B deja una idea y el detalle se cuenta.' },

{ id: 'X5-02', tema: 'ppt', nv: 5, tipo: 'opcion', sub: 'Elegir el gráfico',
  q: 'En la pregunta se podían marcar varias opciones. El equipo puso esta torta y los porcentajes suman 120 %. ¿Qué evalúas?',
  grafico: { tipo: 'torta', titulo: '¿Qué taller te gustaría? (puedes marcar varios)', datos: [['Fútbol (45 %)', 45], ['Música (40 %)', 40], ['Robótica (35 %)', 35]] },
  op: ['La torta no sirve: con varias respuestas por persona las partes no forman un todo; van barras con el % de personas que eligió cada taller', 'Está bien: la torta reparte automáticamente', 'Hay que restar 20 % al taller más votado para que sume 100', 'Conviene un gráfico de línea'],
  pista: 'Una torta representa un todo que se reparte. ¿Cada persona está en una sola porción?',
  ex: 'Si cada persona puede elegir varias opciones, los porcentajes pueden pasar de 100. Las barras muestran «el 45 % eligió fútbol» sin fingir que es un reparto.' },

{ id: 'X5-03', tema: 'ppt', nv: 5, tipo: 'opcion', sub: 'Defensa oral',
  q: 'El jurado pregunta: «¿Cuántos alumnos del turno tarde respondieron?». Ese dato no lo tienen separado. ¿Qué responden?',
  op: ['«No lo tenemos separado: encuestamos a 90 en total, pero lo podemos calcular con la planilla.»', '«Más o menos la mitad.» (dicho con seguridad)', '«Ese dato no es importante para el proyecto.»', 'Quedarse en silencio y pasar a la siguiente diapositiva'],
  pista: 'Lo que se evalúa no es saberlo todo, sino cómo se responde.',
  ex: 'Admitir lo que no se tiene y ofrecer cómo obtenerlo muestra dominio del trabajo. Inventar un dato con seguridad falsa es lo peor que puede pasar en una defensa.' },

{ id: 'X5-04', tema: 'ppt', nv: 5, tipo: 'opcion', sub: 'Ensayo y tiempo',
  q: 'En el ensayo tardaron 8 minutos y tienen 3. Pasaron 5 minutos explicando cómo armaron la encuesta. ¿Qué ajuste es el mejor?',
  op: ['Resumir el proceso en una diapositiva y llegar antes al resultado y a la propuesta', 'Hablar más rápido', 'Sacar la diapositiva de resultados', 'Pedir al jurado más tiempo'],
  pista: 'Un error común es dedicar casi todo el tiempo al proceso y llegar apurado al resultado.',
  ex: 'La presentación es un argumento, no un inventario: problema → solución → beneficio. El proceso se resume y el detalle queda para las preguntas.' },

{ id: 'X5-05', tema: 'ppt', nv: 5, tipo: 'fragmento', sub: 'Coherencia Excel–Word–PPT', marco: 'diapo',
  q: 'La planilla, el informe y la diapositiva tienen que decir lo mismo. ¿Qué viñeta de la diapositiva NO se sostiene?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['¿Cómo prefieres recibir las tareas?', 'Frecuencia'], ['Grupo de WhatsApp', 41], ['Plataforma digital', 27], ['En el cuaderno', 22], ['Total', 90]] },
  doc: { enc: 'Informe · Resultados', parrafos: ['De los 90 encuestados, 41 prefieren recibir las tareas por el grupo de WhatsApp.'] },
  diapo: { titulo: '¿Cómo queremos recibir las tareas?' },
  texto: '[[Encuestamos a 90 alumnos]]\n[[Más de la mitad prefiere WhatsApp]]\n[[El cuaderno quedó último]]\n[[27 eligieron una plataforma digital]]',
  correcta: 1,
  pista: '¿Cuánto es 41 sobre 90? ¿Es más de la mitad?',
  ex: '41 / 90 = 45,6 %: es la opción más elegida, pero NO es más de la mitad. Lo correcto: «WhatsApp es la opción más elegida (46 %)».' },

{ id: 'X5-06', tema: 'datos', nv: 5, tipo: 'opcion', sub: 'Mejorar preguntas',
  q: 'A «¿Cuánto gastas en la cantina?» (abierta) respondieron «mucho», «5 mil», «depende» y «poco». ¿Cuál es la mejor corrección?',
  op: ['Hacerla cerrada con rangos: Menos de 5.000 Gs / 5.000 a 10.000 Gs / Más de 10.000 Gs por día', 'Dejarla abierta pero pedir que respondan bien', 'Cambiarla por «¿Gastas mucho en la cantina?»', 'Sacarla de la encuesta'],
  pista: 'Si después quieres contar y graficar, ¿qué tipo de pregunta te conviene?',
  ex: 'Con rangos claros, cada respuesta cae en una categoría y se tabula con CONTAR.SI. «¿Gastas mucho?» es ambigua: cada uno entiende «mucho» distinto.' },

{ id: 'X5-07', tema: 'datos', nv: 5, tipo: 'opcion', sub: 'Conclusiones válidas',
  q: '30 de 40 encuestados (75 %) dijeron que usarían la app. El equipo concluye: «El 75 % del colegio (600 alumnos) usará la app». ¿Qué evalúas?',
  op: ['Exagera: solo puede decir que el 75 % de los 40 encuestados dijo que la usaría', 'Es correcto: el porcentaje está bien calculado', 'Debería decir el 80 % para redondear', 'Es correcto si lo pone en negrita'],
  pista: 'Fíjate en dos cosas: a quiénes se preguntó y qué verbo usaron («usarían» vs «usará»).',
  ex: 'Un resultado de 40 personas no se traslada automáticamente a 600, y decir que «usaría» no es lo mismo que usarla. La conclusión tiene que respetar el alcance de los datos.' },

{ id: 'X5-08', tema: 'excel', nv: 5, tipo: 'opcion', sub: 'Referencias relativas y absolutas',
  q: 'Cuatro compañeros escribieron en D2 la fórmula del porcentaje, para copiarla hasta D4 (el total está en C5 y hoy vale 55). ¿Cuál es la MEJOR?',
  op: ['=C2/$C$5', '=C2/55', '=C2/C5', '=C2/SUMA(C2:C4)'],
  pista: 'Piensa qué pasa al copiarla y qué pasa si mañana se corrige un dato.',
  ex: '=C2/55 funciona hoy, pero si cambia un dato el total escrito a mano queda viejo. =C2/C5 y =C2/SUMA(C2:C4) se desplazan al copiar. Con $C$5 todo se actualiza y se puede copiar.' },

{ id: 'X5-09', tema: 'datos', nv: 5, tipo: 'opcion', sub: 'Limpieza de la base de datos',
  q: 'Así quedó la columna «Edad» de la encuesta. ¿Qué mejora propones?',
  hoja: { cols: ['A', 'B'], desde: 1, filas: [['Encuesta', 'Edad'], [1, 15], [2, 16], [3, '15 años'], [4, 14], [5, 'quince'], [6, 16]] },
  op: ['Corregir las celdas a números y, en el formulario, validar que la edad sea un número entre 13 y 20', 'Dejarla así: se entiende igual', 'Promediar solo las celdas que son números', 'Borrar la columna Edad'],
  pista: 'Corrige lo que ya pasó y evita que vuelva a pasar.',
  ex: 'Con texto mezclado, PROMEDIO y CONTAR.SI dan resultados falsos. La validación en el formulario impide el error desde el origen.' },

{ id: 'X5-10', tema: 'word', nv: 5, tipo: 'opcion', sub: 'Redactar conclusiones',
  q: 'Objetivo: «Determinar si los alumnos de 1° necesitan recordatorios de tareas». Resultados: 68 % olvidó al menos una tarea el último mes; 81 % usa WhatsApp a diario; solo 40 % tiene datos móviles siempre. ¿Cuál es la mejor conclusión?',
  op: ['La necesidad existe (68 % olvidó tareas). Como WhatsApp es el canal más usado y no todos tienen datos siempre, conviene empezar con recordatorios por WhatsApp antes que con una app', 'Todos los alumnos olvidan las tareas, así que la app será un éxito', 'Concluimos que la tecnología es muy importante en la educación actual', 'El 81 % usa WhatsApp, por lo tanto el 81 % necesita la app'],
  pista: 'Una buena conclusión responde al objetivo con los datos, sin inventar ni generalizar.',
  ex: 'Responde al objetivo, cita el dato clave y usa los otros resultados para decidir. Las demás exageran, no responden o mezclan datos que no se relacionan.' },

{ id: 'X5-11', tema: 'word', nv: 5, tipo: 'opcion', sub: 'Revisión antes de entregar',
  q: 'Esta tabla va en el informe. ¿Cuál es la observación MÁS importante antes de entregarlo?',
  tabla: { cols: ['Motivo para no desayunar', '%'], filas: [['Falta de tiempo', '38'], ['No tengo hambre', '27'], ['No hay nada en casa', '21'], ['Otro', '18']] },
  op: ['Los porcentajes suman 104 %: hay un error de cálculo o de redondeo que hay que revisar en la planilla', 'La tabla debería tener bordes de colores', 'Conviene cambiar la fuente de la tabla', 'Habría que centrar los títulos de las columnas'],
  pista: 'Suma la columna de porcentajes.',
  ex: '38 + 27 + 21 + 18 = 104. Un error en los datos pesa mucho más que cualquier detalle de formato. (Y la tabla también necesita título y fuente.)' },

{ id: 'X5-12', tema: 'proyecto', nv: 5, tipo: 'opcion', sub: 'Viabilidad económica',
  q: 'Costos: carteles 60.000 Gs + dominio web 120.000 Gs + 3 sensores de 85.000 Gs. Presupuesto: 400.000 Gs. ¿Qué evalúas?',
  op: ['No es viable así: faltan 35.000 Gs; con un subdominio gratuito el costo baja a 315.000 Gs y entra en el presupuesto', 'Es viable: sobran 35.000 Gs', 'No es viable de ninguna manera: hay que abandonar el proyecto', 'Es viable porque 400.000 es un número redondo'],
  pista: 'Suma todo (los sensores son 3) y compara con el presupuesto. Después busca qué gasto se puede reemplazar.',
  ex: '60.000 + 120.000 + 255.000 = 435.000 Gs. Faltan 35.000. Evaluar no es solo decir «no»: es proponer un ajuste realista.' },

{ id: 'X5-13', tema: 'proyecto', nv: 5, tipo: 'opcion', sub: 'Viabilidad legal',
  q: 'Propuesta: cámaras que graban el patio para saber quién tira basura y publican las fotos en Instagram. ¿Qué evalúas?',
  op: ['No es viable legalmente así: expone la imagen de menores sin consentimiento; se puede medir la basura sin identificar a nadie', 'Es viable: el patio es un lugar público', 'Es viable si las fotos se publican sin nombres', 'El único problema es el costo de las cámaras'],
  pista: '¿Se respetan los datos personales y la imagen de los alumnos?',
  ex: 'La imagen de una persona es un dato personal, y más si es menor de edad. El objetivo (menos basura) se puede medir pesando la basura, sin vigilar a nadie.' },

{ id: 'X5-14', tema: 'proyecto', nv: 5, tipo: 'opcion', sub: 'Hipótesis y datos',
  q: 'Hipótesis: «Si se colocan basureros diferenciados en cada pasillo, entonces disminuirá la basura en el patio». Antes: 12 kg por semana. Después de 1 semana: 11,5 kg. ¿Qué evalúas?',
  op: ['La diferencia es muy chica (0,5 kg, unos 4 %) y es una sola semana: no alcanza para confirmarla; hay que medir más semanas', 'La hipótesis queda confirmada: la basura bajó', 'La hipótesis es falsa: tendría que haber bajado a 0', 'Hay que cambiar la hipótesis para que coincida con el resultado'],
  pista: '¿Cuánto bajó en porcentaje? ¿Una semana alcanza para sacar conclusiones?',
  ex: '0,5 / 12 ≈ 4 %. Una variación tan pequeña en una sola medición puede ser casualidad. Ajustar la hipótesis a los datos después de verlos sería hacer trampa.' },

{ id: 'X5-15', tema: 'proyecto', nv: 5, tipo: 'clasificar', sub: 'Objetivos',
  q: 'Revisa los objetivos específicos del equipo. ¿Cuáles están bien formulados?',
  categorias: ['Bien formulado', 'Hay que reescribirlo'],
  items: [
    { t: 'Determinar el porcentaje de alumnos de 1° que no desayuna antes de clases', c: 'Bien formulado' },
    { t: 'Conocer bien el tema del desayuno', c: 'Hay que reescribirlo' },
    { t: 'Diseñar un formulario de 8 preguntas cerradas para 1° A, B y C', c: 'Bien formulado' },
    { t: 'Que los alumnos coman mejor', c: 'Hay que reescribirlo' },
    { t: 'Calcular el costo de un combo saludable con precios de 3 proveedores', c: 'Bien formulado' }
  ],
  pista: 'Un objetivo empieza con un verbo en infinitivo y se puede verificar si se cumplió.',
  ex: '«Conocer bien» no se puede comprobar y «que los alumnos coman mejor» es un deseo, no una acción del equipo. Los bien formulados dicen qué, de quién y cómo.' },

{ id: 'X5-16', tema: 'ppt', nv: 5, tipo: 'opcion', sub: 'Gráficos para proyectar',
  q: 'La sala de la feria es grande. La diapositiva tiene letra de 12 pt y un gráfico de Excel con 8 etiquetas y leyenda. ¿Qué ajuste priorizas?',
  op: ['Agrandar el texto (24 pt o más) y simplificar el gráfico a las categorías que importan, con el dato clave resaltado', 'Usar fondo oscuro para que se vea moderno', 'Agregar una animación al gráfico', 'Imprimir la diapositiva y repartirla'],
  pista: 'Imagina al último de la fila: ¿qué alcanza a leer?',
  ex: 'Lo primero es que se lea y se entienda desde lejos. El estilo viene después.' },

/* ═════════════════════════ N6 · CREAR ═════════════════════════ */

{ id: 'X6-01', tema: 'excel', nv: 6, tipo: 'valor', sub: 'Fórmulas copiables',
  q: 'Escribe la fórmula para D2: porcentaje del curso sobre el total de C5, que se pueda copiar hasta D4.',
  hoja: { cols: ['A', 'B', 'C', 'D'], desde: 1, filas: [['Curso', '', 'Votos', '%'], ['1° A', '', 20, '?'], ['1° B', '', 14, ''], ['1° C', '', 21, ''], ['Total', '', 55, '']], activa: 'D2' },
  placeholder: '=…',
  acepta: ['=C2/$C$5', '=C2/C$5', '=C2/$C$5*100', '=C2/C$5*100', '=C2*100/$C$5', '=C2*100/C$5', '=(C2/$C$5)*100', '=(C2/C$5)*100'],
  pista: 'La parte cambia en cada fila; el total no. ¿Con qué signo se fija una referencia?',
  ex: '=C2/$C$5 (con formato porcentaje). También vale =C2/C$5: lo único que no se puede mover al copiar hacia abajo es la fila del total.' },

{ id: 'X6-02', tema: 'excel', nv: 6, tipo: 'valor', sub: 'Función SI',
  q: 'E8 tiene el costo total y E9 el presupuesto. Escribe en E10 una fórmula que muestre «Viable» si el costo no supera el presupuesto, y «Ajustar» si lo supera.',
  placeholder: '=SI(…)',
  acepta: ['=SI(E8<=E9;"Viable";"Ajustar")', '=SI(E9>=E8;"Viable";"Ajustar")', '=SI(E8>E9;"Ajustar";"Viable")', '=SI(E9<E8;"Ajustar";"Viable")'],
  pista: '=SI(prueba lógica; valor si es verdadero; valor si es falso). Los textos van entre comillas.',
  ex: '=SI(E8<=E9;"Viable";"Ajustar"). Si cambia un precio, el veredicto se actualiza solo: así la planilla trabaja por ti.' },

{ id: 'X6-03', tema: 'excel', nv: 6, tipo: 'valor', sub: 'SUMAR.SI',
  q: 'Los rubros están en A2:A9 y los montos en B2:B9. Escribe la fórmula que sume solo los gastos de «Materiales».',
  placeholder: '=…',
  acepta: ['=SUMAR.SI(A2:A9;"Materiales";B2:B9)', '=SUMAR.SI($A$2:$A$9;"Materiales";$B$2:$B$9)', '=SUMAR.SI(A2:A9;"materiales";B2:B9)'],
  pista: 'SUMAR.SI(dónde busco; qué busco; qué sumo).',
  ex: '=SUMAR.SI(A2:A9;"Materiales";B2:B9). El criterio va entre comillas porque es texto.' },

{ id: 'X6-04', tema: 'excel', nv: 6, tipo: 'valor', sub: 'CONTAR.SI con criterio',
  q: 'Las respuestas de satisfacción (1 a 5) están en B2:B21. Escribe la fórmula que cuente a los satisfechos (4 o más).',
  placeholder: '=…',
  acepta: ['=CONTAR.SI(B2:B21;">=4")', '=CONTAR.SI(B2:B21;">3")', '=CONTAR.SI($B$2:$B$21;">=4")', '=CONTAR.SI($B$2:$B$21;">3")'],
  pista: 'Cuando el criterio es una comparación, va entre comillas: ">=4".',
  ex: '=CONTAR.SI(B2:B21;">=4"). Para el porcentaje se divide por la cantidad de respuestas.' },

{ id: 'X6-05', tema: 'datos', nv: 6, tipo: 'ordenar', sub: 'Diseño de encuestas',
  q: 'Una encuesta se diseña «de atrás para adelante». Ordena el plan del equipo.',
  lineas: ['Definir qué necesitamos saber (el objetivo de la encuesta)', 'Decidir cómo vamos a procesar cada dato (contar, promediar, graficar)', 'Redactar las preguntas con sus opciones y códigos', 'Probar con un piloto de 2 o 3 personas y corregir', 'Aplicarla explicando para qué es y pidiendo consentimiento', 'Tabular en Excel y graficar los resultados'],
  pista: 'Primero se decide qué se quiere saber y cómo se va a procesar; recién después se escriben las preguntas.',
  ex: 'Si decides cómo vas a procesar antes de escribir, eliges el tipo de pregunta correcto. El piloto atrapa los errores antes de gastar las respuestas «de verdad».' },

{ id: 'X6-06', tema: 'datos', nv: 6, tipo: 'ordenar', sub: 'Del dato al mensaje',
  q: 'Llegaron 90 respuestas al formulario. Ordena el camino hasta la diapositiva de resultados.',
  lineas: ['Descargar las respuestas a una planilla de Excel', 'Limpiar y codificar los datos (Sí = 1, No = 2…)', 'Tabular con CONTAR.SI', 'Calcular los porcentajes', 'Hacer un gráfico con un solo mensaje', 'Escribir el hallazgo en el informe y en la diapositiva'],
  pista: 'No se puede contar lo que no está limpio, ni graficar lo que no está contado.',
  ex: 'Limpiar antes de contar evita errores como el de «Sí» vs «si». El mismo dato tiene que llegar igual al informe y a la diapositiva.' },

{ id: 'X6-07', tema: 'datos', nv: 6, tipo: 'opcion', sub: 'Diseño de encuestas',
  q: 'Necesitas saber cuánto tardan en llegar al colegio para hacer un gráfico de barras. ¿Qué pregunta diseñas?',
  op: ['¿Cuánto tardas en llegar? ( ) Menos de 15 min ( ) 15 a 30 min ( ) 31 a 60 min ( ) Más de 60 min', '¿Cuánto tardas en llegar? ( ) 0 a 15 min ( ) 15 a 30 min ( ) 30 a 60 min ( ) 60 o más', '¿Cuánto tardas en llegar al colegio?', '¿No te parece que tardas demasiado en llegar? ( ) Sí ( ) No'],
  pista: 'Revisa los límites: alguien que tarda justo 15 o 30 minutos, ¿en qué opción marca?',
  ex: 'En la segunda, 15 y 30 minutos aparecen en dos opciones a la vez (rangos superpuestos). La abierta da respuestas difíciles de tabular y la última es tendenciosa.' },

{ id: 'X6-08', tema: 'word', nv: 6, tipo: 'ordenar', sub: 'Redactar resultados',
  q: 'Arma el párrafo de resultados en un orden lógico, de lo general a lo particular.',
  lineas: ['Respondieron 90 de los 105 estudiantes de 1° (86 %).', 'De ellos, 58 (64 %) no desayunan antes de clases.', 'Entre quienes no desayunan, el motivo más citado es la falta de tiempo (41 de 58).', 'La Figura 1 muestra los demás motivos, ninguno mencionado por más de 10 estudiantes.'],
  pista: 'Primero cuántos respondieron, después el hallazgo principal, después el detalle y la referencia a la figura.',
  ex: 'Del total al hallazgo, del hallazgo al detalle. Así el lector nunca se pregunta «¿sobre cuántos?».' },

{ id: 'X6-09', tema: 'word', nv: 6, tipo: 'ordenar', sub: 'Redactar la introducción',
  q: 'Arma la introducción del informe con estas cuatro oraciones.',
  lineas: ['En el turno mañana, muchos alumnos llegan al colegio sin haber comido nada.', 'Según una encuesta preliminar a 1° A, 6 de cada 10 no desayunan antes de clases.', 'Este proyecto tiene como objetivo evaluar la viabilidad de un kiosco de desayunos saludables.', 'El informe presenta la metodología, los resultados de la encuesta y el estudio de viabilidad.'],
  pista: 'Contexto → problema con un dato → objetivo → qué va a encontrar el lector.',
  ex: 'Una introducción lleva al lector del problema general al objetivo, y le anticipa cómo está organizado el informe.' },

{ id: 'X6-10', tema: 'ppt', nv: 6, tipo: 'ordenar', sub: 'Ensayo y tiempo',
  q: 'Falta una semana para la feria. Ordena el plan de preparación de la defensa.',
  lineas: ['Escribir en una frase la idea central que el jurado tiene que recordar', 'Ordenar las diapositivas: problema → solución → beneficio', 'Ensayar en voz alta con cronómetro', 'Recortar lo que hace pasar de los 3 minutos', 'Hacer un simulacro con compañeros que hagan preguntas no anticipadas'],
  pista: 'Primero el mensaje, después el orden, después el tiempo y al final la prueba con público.',
  ex: 'Si la idea central está clara, todo lo demás se ordena alrededor de ella. El simulacro va al final porque prueba la presentación ya terminada.' },

{ id: 'X6-11', tema: 'ppt', nv: 6, tipo: 'opcion', sub: 'Defensa oral',
  q: 'Proponen una app de recordatorios. El jurado pregunta: «Si el 60 % no tiene datos móviles siempre, ¿cómo los va a ayudar una app?». ¿Qué respuesta construyen?',
  op: ['«Es cierto, por eso la primera etapa usa mensajes de WhatsApp, que el 81 % abre a diario, y la app vendrá después si funciona.»', '«Todos van a tener datos dentro de poco.»', '«La app funciona igual, no se preocupe.»', '«Ese dato no lo tuvimos en cuenta, así que no sabemos.»'],
  pista: 'Una buena respuesta reconoce el dato, usa otro dato propio y ajusta la propuesta.',
  ex: 'Reconocer la limitación y mostrar cómo el proyecto ya la tiene en cuenta convence más que negarla o rendirse.' },

{ id: 'X6-12', tema: 'proyecto', nv: 6, tipo: 'ordenar', sub: 'Objetivos',
  q: 'Proyecto «Kiosco saludable». Ordena los objetivos específicos en el orden en que se van a cumplir.',
  lineas: ['Diagnosticar los hábitos de consumo de los alumnos mediante una encuesta', 'Identificar productos saludables accesibles con 3 proveedores locales', 'Calcular el costo y el precio de venta de un combo saludable', 'Evaluar la aceptación del combo con una prueba de una semana'],
  pista: 'No se puede calcular el precio sin saber qué se va a vender, ni evaluar la aceptación sin un combo.',
  ex: 'Diagnosticar → identificar → calcular → evaluar. Cada objetivo usa lo que produjo el anterior.' },

{ id: 'X6-13', tema: 'proyecto', nv: 6, tipo: 'opcion', sub: 'Hipótesis',
  q: 'Problema: en 1° B se entregan a tiempo pocas tareas. ¿Qué hipótesis construyes para poder comprobarla en un mes?',
  op: ['Si se envía un recordatorio por WhatsApp la noche anterior, entonces aumentará el porcentaje de tareas entregadas en fecha en 1° B durante 4 semanas', 'Los recordatorios son muy útiles para los alumnos', 'Si usamos la tecnología, entonces la educación va a mejorar', '¿Los recordatorios ayudan a entregar las tareas?'],
  pista: 'Si… (lo que vas a cambiar), entonces… (lo que vas a medir). Además: ¿a quiénes y por cuánto tiempo?',
  ex: 'Tiene causa, efecto medible (porcentaje de entregas en fecha), población (1° B) y plazo (4 semanas). Las otras son opiniones, generalidades o preguntas.' },

{ id: 'X6-14', tema: 'proyecto', nv: 6, tipo: 'opcion', sub: 'Alcance',
  q: 'Idea original: «Sistema de turnos médicos para todo Paraguay». Equipo de 1°, 4 meses, sin presupuesto. ¿Qué alcance construyen?',
  op: ['Un formulario de turnos para la enfermería del colegio, probado durante un mes con los alumnos de 1°', 'Una app de turnos para los hospitales de Central', 'El mismo sistema, pero solo para Asunción', 'Un sistema para todo Paraguay, pero con menos funciones'],
  pista: 'Achicar no es solo reducir el territorio: tiene que entrar en el tiempo, en lo que saben y en lo que cuesta.',
  ex: 'Un problema cercano, usuarios a los que se puede encuestar y herramientas que ya conocen. Las otras siguen siendo enormes para un equipo de 1°.' },

{ id: 'X6-15', tema: 'proyecto', nv: 6, tipo: 'ordenar', sub: 'Planteamiento del problema',
  q: 'Arma el planteamiento del problema en orden.',
  lineas: ['Qué pasa: 52 % de los alumnos cruza la ruta fuera de la senda peatonal', 'A quiénes afecta y dónde: alumnos del colegio, a la salida del turno mañana', 'Por qué importa: el tránsito es intenso y no hay semáforo', 'Pregunta de investigación: ¿qué señalización ayudaría a que crucen por la senda?'],
  pista: 'Del hecho con su dato, al alcance, a la importancia, y se cierra con la pregunta.',
  ex: 'El planteamiento muestra el problema con datos, lo delimita, justifica por qué vale la pena y termina en la pregunta que guiará el proyecto.' },

{ id: 'X6-16', tema: 'proyecto', nv: 6, tipo: 'clasificar', sub: 'Matriz de viabilidad',
  q: 'Arma la matriz de viabilidad del «Kiosco saludable»: ¿cada dato muestra que el proyecto se puede hacer o que hay que ajustar algo?',
  categorias: ['Viable', 'Ajustar'],
  items: [
    { t: 'Técnica: el equipo sabe usar Excel para llevar ventas y stock', c: 'Viable' },
    { t: 'Legal: vender alimentos necesita autorización de la dirección', c: 'Ajustar' },
    { t: 'Económica: la inversión es 450.000 Gs y el comité aporta 500.000 Gs', c: 'Viable' },
    { t: 'Técnica: no hay heladera para guardar los productos', c: 'Ajustar' },
    { t: 'Económica: con 1.500 Gs de ganancia por combo, la inversión se recupera con 300 combos', c: 'Viable' }
  ],
  pista: 'Lee cada dato: ¿es una condición que ya está cubierta o un obstáculo que hay que resolver antes de empezar?',
  ex: 'Una matriz honesta muestra lo que ya está resuelto y lo que falta (permiso, heladera). Eso no tumba el proyecto: define las tareas pendientes.' }

];
