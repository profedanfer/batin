/* ═══════════════════════════════════════════════════════════════
   BATIN · Arcade de 1° · LOS EXPEDIENTES DE GATIEL (auditoría de la feria)
   Cada expediente es un proyecto de 1° «con trampa»: trae evidencia
   (planilla, informe y/o diapositiva) y 5 pasos que suben de nivel:
   Calcular (N3) → Señalar (N4) → Analizar (N4) → Juzgar (N5) → Rehacer (N6).
   Los tipos de paso son los mismos del banco.js.
   Todos los equipos, nombres y datos son inventados.
   ═══════════════════════════════════════════════════════════════ */

(function () {

/* ── Datos compartidos entre la evidencia y los pasos ── */
var HOJA_CANTINA = { tipo: 'hoja', nombre: 'Encuesta menú saludable · 1° B', cols: ['A', 'B'], desde: 1,
  filas: [['Encuesta', 'P1 (1 = Sí · 2 = No)'],
    [1, 1], [2, 2], [3, 1], [4, 'Sí'], [5, 1], [6, 2], [7, 'si'], [8, 1], [9, 2], [10, 1], [11, 'no'], [12, 1],
    ['', ''], ['Sí', '=CONTAR.SI(B2:B13;1)'], ['No', '=CONTAR.SI(B2:B13;2)'], ['Total', '=SUMA(B15:B16)']] };

var HOJA_PATIO = { tipo: 'hoja', nombre: 'Basura del patio (kg por semana)', cols: ['A', 'B', 'C'], desde: 1,
  filas: [['Material', 'Semana 1', 'Semana 4'], ['Plástico', 18, 11], ['Papel', 9, 8], ['Orgánico', 25, 24], ['Latas', 3, 2], ['Total', 55, 45]] };

var HOJA_COSTOS = { tipo: 'hoja', nombre: 'Costos CamGuard', cols: ['A', 'B', 'C', 'D'], desde: 1,
  filas: [['Ítem', 'Cantidad', 'Precio unit. (Gs)', 'Subtotal (Gs)'],
    ['Cámara IP', 4, 280000, '=B2*C2'], ['Computadora usada', 1, 1500000, '=B3*C3'], ['Licencia anual del software', 1, 600000, '=B4*C4'], ['Cartel informativo', 2, 25000, '=B5*C5'],
    ['TOTAL', '', '', '=SUMA(D2:D5)'], ['Presupuesto', '', '', 500000]] };

window.AR_CASOS = [

/* ══════════ EXPEDIENTE 1 ══════════ */
{ id: 'cantina', n: 1, titulo: 'La encuesta que contó de menos', tema: 'datos', ico: '🥗',
  equipo: 'Los Nutribits · 1° B',
  denuncia: 'El equipo asegura en su informe que «la gran mayoría del curso» quiere un menú saludable en la cantina. La profe contó las encuestas en papel a mano… y los números de la planilla no le cierran.',
  testigo: { quien: 'techi', dice: 'Codificamos 1 = Sí y 2 = No. Cada uno cargó en su casa las encuestas que le tocaron. ¿Tan grave puede ser?' },
  evidencia: [
    { etq: '📊 Planilla', v: HOJA_CANTINA },
    { etq: '📄 Informe · Resultados', v: { tipo: 'doc', enc: 'Los Nutribits · Informe ICIENTEC', parrafos: ['## 3. Resultados', 'Se aplicaron 12 encuestas en papel a alumnos de 1° B. Al tabular, 6 estudiantes respondieron que sí comprarían el menú, es decir, la gran mayoría del curso. Por eso se propone ofrecer un menú saludable a prueba.'] } }
  ],
  pasos: [
  { id: 'G1-1', nv: 3, tipo: 'traza', sub: 'CONTAR.SI y SUMA', etapa: 'Calcular',
    q: 'Calcula lo que muestran las fórmulas de la planilla tal como está cargada.',
    cols: ['Celda', 'Fórmula', 'Resultado'],
    filas: [['B15', '=CONTAR.SI(B2:B13;1)', '{6}'], ['B17', '=SUMA(B15:B16)', '{9}']],
    pista: 'CONTAR.SI(…;1) cuenta solo las celdas que contienen el NÚMERO 1. Un texto como «Sí» no es el número 1.',
    ex: 'B15 = 6 y B16 = 3, así que B17 = 9. Pero hay 12 encuestas: ¡3 respuestas quedaron fuera de la cuenta!' },
  { id: 'G1-2', nv: 4, tipo: 'celda', sub: 'Datos mal codificados', etapa: 'Señalar',
    q: 'Toca una celda que en realidad es un «Sí», pero que CONTAR.SI no está contando.',
    hoja: HOJA_CANTINA, correcta: ['B5', 'B8'],
    pista: 'Busca las celdas donde se escribió una palabra en vez del código. Mira también cómo se alinean: los números van a la derecha.',
    ex: 'B5 («Sí») y B8 («si») son respuestas afirmativas cargadas como texto. B12 («no») es el mismo problema, pero para el No.' },
  { id: 'G1-3', nv: 4, tipo: 'fragmento', sub: 'Conclusiones que exageran', etapa: 'Analizar', marco: 'doc',
    q: 'Aunque arreglen el conteo, hay una afirmación del informe que estos datos NO permiten hacer. Tócala.',
    doc: { enc: 'Los Nutribits · Informe ICIENTEC', titulo: '3. Resultados' },
    texto: 'Se aplicaron [[12 encuestas en papel a alumnos de 1° B]]. Al tabular, [[6 estudiantes respondieron que sí]] comprarían el menú, es decir, [[la gran mayoría del curso]]. Por eso [[se propone ofrecer un menú saludable a prueba]].',
    correcta: 2,
    pista: '¿A cuántas personas encuestaron? ¿Cuántos alumnos tiene un curso de 1°? ¿Se puede hablar por todos?',
    ex: 'Con 12 encuestados no se puede hablar del «curso» entero, y menos de una «gran mayoría». Lo correcto es decir cuántos de los encuestados y qué porcentaje.' },
  { id: 'G1-4', nv: 5, tipo: 'opcion', sub: 'Limpieza de la base de datos', etapa: 'Juzgar',
    q: '¿Cuál es la MEJOR forma de arreglar la planilla?',
    op: ['Reemplazar «Sí» y «si» por 1 y «no» por 2, y validar la columna para que solo acepte 1 o 2',
      'Cambiar la fórmula por =CONTAR.SI(B2:B13;"Sí")',
      'Borrar las filas que tienen texto, para que no molesten',
      'Contar a mano y escribir el número final en B15'],
    pista: 'La solución tiene que corregir los datos de hoy y evitar que el error vuelva a pasar mañana.',
    ex: 'Recodificar recupera las 3 respuestas, y la validación impide que se repita. Cambiar el criterio a "Sí" dejaría afuera a todos los 1; borrar filas pierde datos; un número escrito a mano no se actualiza.' },
  { id: 'G1-5', nv: 6, tipo: 'valor', sub: 'Fórmula de porcentaje copiable', etapa: 'Rehacer',
    q: 'Ya corregida la planilla, escribe en C15 la fórmula del porcentaje de «Sí» sobre el total (B17), de manera que al copiarla a C16 siga funcionando.',
    placeholder: '=…',
    acepta: ['=B15/$B$17', '=B15/B$17', '=B15/$B$17*100', '=B15/B$17*100', '=B15*100/$B$17', '=B15*100/B$17', '=(B15/$B$17)*100', '=(B15/B$17)*100'],
    pista: 'El total está siempre en B17: esa referencia no se tiene que mover al copiar. ¿Qué signo la fija?',
    ex: '=B15/$B$17. Con los datos corregidos queda 8 de 12 = 66,7 % de Sí y 4 de 12 = 33,3 % de No. El informe debería decir: «8 de los 12 encuestados (66,7 %) comprarían el menú».' }
  ] },

/* ══════════ EXPEDIENTE 2 ══════════ */
{ id: 'informe', n: 2, titulo: 'El informe que nadie encuentra', tema: 'word', ico: '📄',
  equipo: 'Ruta Segura · 1° A',
  denuncia: 'El jurado recibió un informe de 14 páginas sin índice, con la portada numerada y los resultados metidos en la metodología. «Así no se puede evaluar», dijo.',
  testigo: { quien: 'bit', dice: 'Los títulos los hicieron poniendo negrita y tamaño 16 a mano. Se ven lindos… pero para Word son texto normal.' },
  evidencia: [
    { etq: '📄 Informe · página 4', v: { tipo: 'doc', enc: 'Ruta Segura · Informe ICIENTEC', parrafos: ['## METODOLOGÍA', 'Para conocer cómo cruzan la calle los alumnos, se observó la salida del colegio durante 5 días y se aplicó un formulario a 75 estudiantes. El 52 % cruza fuera de la senda peatonal. Las respuestas se tabularon en Excel con CONTAR.SI.'], pie: '4' } }
  ],
  pasos: [
  { id: 'G2-1', nv: 3, tipo: 'opcion', sub: 'Estilos y tabla de contenido', etapa: 'Calcular',
    q: 'El jurado pide un índice automático. ¿Qué tiene que hacer el equipo PRIMERO?',
    op: ['Aplicar los estilos Título 1 y Título 2 a cada título del informe',
      'Insertar la tabla de contenido desde Referencias',
      'Escribir el índice a mano con los números de página',
      'Poner todos los títulos en mayúsculas y subrayados'],
    pista: 'La tabla de contenido no inventa nada: arma la lista con lo que Word reconoce como títulos.',
    ex: 'Sin estilos, Word no sabe qué es un título. Primero se aplican Título 1 / Título 2 y recién después se inserta la tabla de contenido.' },
  { id: 'G2-2', nv: 4, tipo: 'fragmento', sub: 'Secciones del informe', etapa: 'Señalar', marco: 'doc',
    q: 'En la Metodología se coló un RESULTADO. Tócalo.',
    doc: { enc: 'Ruta Segura · Informe ICIENTEC', titulo: 'Metodología' },
    texto: 'Para conocer cómo cruzan la calle los alumnos, [[se observó la salida del colegio durante 5 días]] y [[se aplicó un formulario a 75 estudiantes]]. [[El 52 % cruza fuera de la senda peatonal]]. Las respuestas [[se tabularon en Excel con CONTAR.SI]].',
    correcta: 2,
    pista: 'La metodología cuenta CÓMO se obtuvieron los datos. Un resultado dice QUÉ se encontró.',
    ex: '«El 52 % cruza fuera de la senda» es un hallazgo: va en Resultados. Lo demás describe el procedimiento.' },
  { id: 'G2-3', nv: 4, tipo: 'clasificar', sub: 'Secciones del informe', etapa: 'Analizar',
    q: 'Ayuda a reordenar el informe: ¿en qué sección va cada frase?',
    categorias: ['Introducción', 'Metodología', 'Resultados', 'Conclusión'],
    items: [
      { t: 'Cada día unos 300 alumnos cruzan la ruta frente al colegio, donde no hay semáforo.', c: 'Introducción' },
      { t: 'Se contaron los cruces fuera de la senda entre las 11:30 y las 12:00.', c: 'Metodología' },
      { t: 'La mayoría de los cruces fuera de la senda ocurre en los primeros 10 minutos de la salida.', c: 'Resultados' },
      { t: 'El 52 % de los encuestados cruza fuera de la senda peatonal.', c: 'Resultados' },
      { t: 'Los datos muestran que el problema es real y justifican señalizar el cruce.', c: 'Conclusión' }
    ],
    pista: 'Introducción = el problema y su contexto. Metodología = cómo se midió. Resultados = qué salió. Conclusión = qué significa.',
    ex: 'El contexto abre el informe, el procedimiento va en Metodología, los datos encontrados en Resultados y la interpretación final en la Conclusión.' },
  { id: 'G2-4', nv: 5, tipo: 'opcion', sub: 'Saltos de sección y numeración', etapa: 'Juzgar',
    q: 'Insertaron un salto de sección después de la portada, pero la portada sigue con el número 1 y la introducción con el 2. ¿Qué falta?',
    op: ['En el pie de la segunda sección, desactivar «Vincular al anterior» y hacer que la numeración empiece en 1',
      'Cambiar el salto de sección por un salto de página',
      'Borrar a mano el número de la portada, aunque se borre en todo el documento',
      'Escribir los números de página a mano en cada hoja'],
    pista: 'Word no avisa: aunque haya dos secciones, el pie de la segunda sigue «pegado» al de la primera.',
    ex: 'El salto de sección separa el formato, pero hay que desvincular el pie y configurar el formato de número para que el cuerpo empiece en 1. Con un salto de página no se puede.' },
  { id: 'G2-5', nv: 6, tipo: 'ordenar', sub: 'Estructura del informe', etapa: 'Rehacer',
    q: 'Arma la estructura final del informe de Ruta Segura, de la primera a la última parte.',
    lineas: ['Portada', 'Tabla de contenido', 'Introducción (problema y objetivos)', 'Metodología', 'Resultados (tablas y figuras)', 'Conclusión', 'Referencias bibliográficas', 'Anexos (el formulario aplicado)'],
    pista: 'Lo que el lector necesita para orientarse va primero; lo que respalda (fuentes, el formulario) va al final.',
    ex: 'Portada → índice → introducción → metodología → resultados → conclusión → referencias → anexos. Los anexos cierran el informe porque son material de respaldo.' }
  ] },

/* ══════════ EXPEDIENTE 3 ══════════ */
{ id: 'patio', n: 3, titulo: 'La diapositiva que no cuadra', tema: 'ppt', ico: '🖥️',
  equipo: 'EcoPatio · 1° C',
  denuncia: 'En el ensayo general, un profesor dijo que el gráfico no coincide con la planilla y que desde el fondo del aula «no se entiende nada». Faltan dos días para la feria.',
  testigo: { quien: 'techi', dice: 'Pegamos el gráfico tal cual salió de Excel y escribimos todo lo que hicimos en la diapositiva, para no olvidarnos.' },
  evidencia: [
    { etq: '📊 Planilla', v: HOJA_PATIO },
    { etq: '🖥️ Diapositiva 4', v: { tipo: 'diapo', cargada: true, titulo: 'Resultados obtenidos en el proyecto de reciclaje del patio durante las 4 semanas de trabajo',
      texto: ['El plástico bajó de 18 a 11 kg', 'El orgánico es el que más bajó', 'El total pasó de 55 a 45 kg', 'Las latas casi no cambiaron'],
      grafico: { tipo: 'torta', titulo: 'Semana 1', datos: [['Plástico', 18], ['Papel', 9], ['Orgánico', 25], ['Latas', 3]], pct: true } } }
  ],
  pasos: [
  { id: 'G3-1', nv: 3, tipo: 'valor', sub: 'Porcentaje de variación', etapa: 'Calcular',
    q: 'Según la planilla, ¿en qué porcentaje bajó el TOTAL de basura de la semana 1 a la semana 4? (Redondea a un decimal.)',
    sufijo: '%',
    acepta: ['18,2', '18.2', '18,18', '18', '18,2 %'],
    pista: 'Primero la diferencia (55 − 45). Después divide esa diferencia por el valor INICIAL.',
    ex: '(55 − 45) / 55 = 10 / 55 = 0,1818… → 18,2 %. Se divide por el valor de partida, no por el final.' },
  { id: 'G3-2', nv: 4, tipo: 'fragmento', sub: 'Coherencia planilla–diapositiva', etapa: 'Señalar', marco: 'diapo',
    q: 'Una de las viñetas de la diapositiva contradice la planilla. Tócala.',
    diapo: { titulo: 'Resultados obtenidos en el proyecto de reciclaje del patio durante las 4 semanas de trabajo', cargada: true },
    texto: '[[El plástico bajó de 18 a 11 kg]]\n[[El orgánico es el que más bajó]]\n[[El total pasó de 55 a 45 kg]]\n[[Las latas casi no cambiaron]]',
    correcta: 1,
    pista: 'Calcula cuántos kilos bajó cada material y compara.',
    ex: 'El orgánico bajó solo 1 kg (25 → 24). El que más bajó fue el plástico: 7 kg (18 → 11).' },
  { id: 'G3-3', nv: 4, tipo: 'opcion', sub: 'Elegir el gráfico', etapa: 'Analizar',
    q: 'Quieren mostrar cómo cambió CADA material entre la semana 1 y la semana 4. ¿Qué gráfico conviene?',
    op: ['Barras agrupadas: semana 1 y semana 4 lado a lado para cada material',
      'Dos tortas, una por semana, una al lado de la otra',
      'Una sola torta con los datos de la semana 4',
      'La tabla completa de la planilla pegada en la diapositiva'],
    pista: 'La torta sirve para mostrar partes de un todo. Acá se quiere COMPARAR cantidades.',
    ex: 'Las barras agrupadas permiten comparar de un vistazo cada material antes y después. Dos tortas obligan a comparar ángulos, y una tabla no se lee desde el fondo.' },
  { id: 'G3-4', nv: 5, tipo: 'opcion', sub: 'Título que comunica', etapa: 'Juzgar',
    q: '¿Cuál es el MEJOR título para la diapositiva de resultados?',
    op: ['El plástico del patio bajó 39 % en un mes', 'Resultados obtenidos en el proyecto de reciclaje del patio', 'Gráfico de reciclaje', '¡Reciclar es muy importante!'],
    pista: 'Un buen título ya dice el mensaje principal, con un dato que se pueda comprobar en la planilla.',
    ex: '(18 − 11) / 18 = 38,9 % ≈ 39 %. Un título-mensaje deja al público con la idea principal aunque no lea nada más.' },
  { id: 'G3-5', nv: 6, tipo: 'ordenar', sub: 'Estructura de la presentación', etapa: 'Rehacer',
    q: 'Rehaz la presentación de EcoPatio: ordena las cuatro diapositivas para que cuenten una historia.',
    lineas: ['El problema: el patio junta 55 kg de basura por semana', 'Lo que hicimos: basureros diferenciados en 4 pasillos', 'El resultado: el plástico bajó 39 % en un mes', 'Lo que sigue: llevarlo a todo el colegio con el centro de estudiantes'],
    pista: 'Primero el porqué, después el cómo y por último el para qué.',
    ex: 'Problema → solución → resultado → próximo paso. La audiencia necesita entender por qué importa antes de ver lo que hicieron.' }
  ] },

/* ══════════ EXPEDIENTE 4 ══════════ */
{ id: 'camguard', n: 4, titulo: 'El proyecto imposible', tema: 'proyecto', ico: '🚀',
  equipo: 'CamGuard · 1° A',
  denuncia: 'El anteproyecto propone cámaras con reconocimiento facial que registren la asistencia de todo el colegio y publiquen en Instagram quién llega tarde. Presupuesto: 500.000 Gs. Plazo: 3 meses.',
  testigo: { quien: 'techi', dice: 'Nadie del equipo programó nunca reconocimiento facial, pero lo podemos aprender con videos. Las cámaras las compramos con lo que junte la kermés.' },
  evidencia: [
    { etq: '📊 Costos', v: HOJA_COSTOS },
    { etq: '📄 Justificación', v: { tipo: 'doc', enc: 'CamGuard · Anteproyecto', parrafos: ['## Justificación', 'Las llegadas tarde son un problema: según la dirección, 1 de cada 5 alumnos llega tarde al menos una vez por semana. Es una idea muy innovadora que todos los colegios del mundo ya usan, y reemplazará por completo al registro de asistencia.'] } }
  ],
  pasos: [
  { id: 'G4-1', nv: 3, tipo: 'valor', sub: 'Presupuesto con fórmulas', etapa: 'Calcular',
    q: '¿Qué valor muestra D6 (=SUMA(D2:D5))? Primero resuelve los subtotales de la columna D.',
    sufijo: 'Gs',
    acepta: ['3270000', '3.270.000'],
    pista: 'Cada subtotal es cantidad × precio. Después suma los cuatro.',
    ex: '1.120.000 + 1.500.000 + 600.000 + 50.000 = 3.270.000 Gs. ¡Más de seis veces el presupuesto!' },
  { id: 'G4-2', nv: 4, tipo: 'clasificar', sub: 'Tipos de viabilidad', etapa: 'Señalar',
    q: 'Gatiel anotó los riesgos del proyecto. ¿A qué viabilidad afecta cada uno?',
    categorias: ['Técnica', 'Legal', 'Económica'],
    items: [
      { t: 'Nadie del equipo sabe programar reconocimiento facial', c: 'Técnica' },
      { t: 'Publicar en Instagram quién llega tarde, con su foto', c: 'Legal' },
      { t: 'Faltan 2.770.000 Gs para comprar todo', c: 'Económica' },
      { t: 'Guardar imágenes de la cara de menores de edad sin permiso', c: 'Legal' },
      { t: 'La red del colegio no soporta 4 cámaras transmitiendo', c: 'Técnica' },
      { t: 'La licencia del software hay que pagarla todos los años', c: 'Económica' }
    ],
    pista: 'Técnica: ¿podemos hacerlo con lo que sabemos y tenemos? Legal: ¿está permitido y respeta derechos? Económica: ¿alcanza la plata?',
    ex: 'Fallan las tres: falta conocimiento y red (técnica), se exponen datos e imágenes de menores (legal) y el costo supera el presupuesto en 2.770.000 Gs (económica).' },
  { id: 'G4-3', nv: 4, tipo: 'fragmento', sub: 'Justificar con datos', etapa: 'Analizar', marco: 'doc',
    q: 'No todo está mal: ¿qué parte de la justificación SÍ sirve, porque muestra con un dato que el problema existe?',
    doc: { enc: 'CamGuard · Anteproyecto', titulo: 'Justificación' },
    texto: 'Las llegadas tarde son un problema: [[según la dirección, 1 de cada 5 alumnos llega tarde al menos una vez por semana]]. [[Es una idea muy innovadora]] que [[todos los colegios del mundo ya usan]], y [[reemplazará por completo al registro de asistencia]].',
    correcta: 0,
    pista: 'Busca algo que se pueda comprobar y que tenga una fuente, no una opinión ni una promesa.',
    ex: 'El dato de la dirección tiene fuente y muestra la magnitud del problema. «Muy innovadora» es opinión, «todos los colegios del mundo» no se puede sostener y «reemplazará por completo» es una promesa sin respaldo.' },
  { id: 'G4-4', nv: 5, tipo: 'opcion', sub: 'Veredicto de viabilidad', etapa: 'Juzgar',
    q: '¿Cuál es el veredicto MÁS justo para la matriz de viabilidad?',
    op: ['No es viable así: falla en lo técnico, lo legal y lo económico; hay que reducir el alcance',
      'Es viable si consiguen 2.770.000 Gs más con otra kermés',
      'Es viable porque la idea es innovadora y el problema existe',
      'No es viable porque la tecnología no sirve para resolver problemas del colegio'],
    pista: 'Un veredicto se apoya en los tres criterios, no en uno solo. Y una conclusión exagerada también es un error.',
    ex: 'Conseguir plata no resuelve lo legal ni lo técnico. Que el problema exista no vuelve viable cualquier solución. Y la tecnología sí puede ayudar, con un alcance realista.' },
  { id: 'G4-5', nv: 6, tipo: 'opcion', sub: 'Rediseñar el alcance', etapa: 'Rehacer',
    q: 'Rediseña el alcance. ¿Qué versión resuelve los TRES problemas a la vez?',
    op: ['Un formulario de Google para que cada preceptor registre las llegadas tarde y una planilla que calcule el porcentaje por curso, sin fotos ni datos públicos (costo: 0 Gs)',
      'Una sola cámara con reconocimiento facial en la entrada, para que cueste menos',
      'Publicar en Instagram la lista de los que llegan tarde, solo con nombre y sin fotos',
      'Contratar a una empresa que instale el sistema completo y lo mantenga'],
    pista: 'Revisa cada opción con las tres preguntas: ¿lo sabemos hacer?, ¿está permitido?, ¿nos alcanza?',
    ex: 'El formulario + planilla usa lo que el equipo ya sabe (técnica), no expone a nadie (legal) y no cuesta nada (económica). Las otras opciones siguen fallando en al menos un criterio.' }
  ] }

];
})();
