/* ═══════════════════════════════════════════════════════════════
   BATIN · OCA de Ofimática y Proyectos · 1° curso
   BANCO DE PREGUNTAS  —  este es el archivo que se edita
   ═══════════════════════════════════════════════════════════════

   CÓMO AGREGAR O CORREGIR UNA PREGUNTA
   ------------------------------------
   Cada pregunta es un bloque { ... } separado por coma.

   id    → código único (no repetir). Sirve para el panel de fallas.
           Si cambias mucho una pregunta, cámbiale el id.
   tema  → 'excel' | 'word' | 'ppt' | 'proyecto'
   sub   → subtema corto (aparece en el panel). Repite el MISMO texto
           para preguntas del mismo subtema, así se agrupan bien.
   n     → dificultad: 1 (dado 1-2), 2 (dado 3-4), 3 (dado 5-6)
   q     → la pregunta
   op    → opciones. ⚠ LA PRIMERA SIEMPRE ES LA CORRECTA.
           El juego las mezcla solo; no hace falta desordenarlas.
           No uses "todas las anteriores" ni "ninguna" (se mezclan).
   ex    → explicación que se muestra después de responder.
   v     → (opcional) visual: planilla, diapositiva o páginas de Word.
           Copia uno que ya exista y cambia los datos.

   Cuida que no quede una coma de más después del último bloque
   del tema anterior al cerrar el corchete ] — el navegador la tolera,
   pero es buena costumbre.
   ═══════════════════════════════════════════════════════════════ */

window.OCA_BANCO = [

/* ─────────────────────────── EXCEL ─────────────────────────── */

{ id:'X01', tema:'excel', sub:'Estructura de la hoja', n:1,
  q:'¿Cómo se llama el cuadro donde se cruzan una fila y una columna?',
  op:['Celda','Rango','Hoja','Libro'],
  ex:'La celda es la unidad básica. Se nombra con la letra de la columna y el número de la fila, por ejemplo B3.' },

{ id:'X02', tema:'excel', sub:'Estructura de la hoja', n:1,
  q:'La celda marcada, ¿cómo se llama?',
  v:{tipo:'celdas', cols:['A','B','C','D'], desde:1,
     filas:[['','','',''],['','','',''],['','','',''],['','','','']], activa:'C3'},
  op:['C3','3C','Fila C, columna 3','C:3'],
  ex:'Primero va la letra de la COLUMNA y después el número de la FILA: C3.' },

{ id:'X03', tema:'excel', sub:'Fórmulas y operadores', n:1,
  q:'¿Con qué signo empieza SIEMPRE una fórmula en Excel?',
  op:['=','+','#','('],
  ex:'Sin el signo = Excel lo toma como texto y no calcula nada.' },

{ id:'X04', tema:'excel', sub:'Funciones básicas', n:1,
  q:'¿Qué calcula =SUMA(A1:A5)?',
  op:['La suma de A1, A2, A3, A4 y A5','Solo la suma de A1 y A5','A1 multiplicado por 5','El promedio de A1 a A5'],
  ex:'Los dos puntos (:) indican un RANGO: todas las celdas desde A1 hasta A5.' },

{ id:'X05', tema:'excel', sub:'Funciones básicas', n:1,
  q:'¿Qué resultado muestra la celda B6?',
  v:{tipo:'celdas', cols:['A','B'], desde:1,
     filas:[['Alumno','Puntos'],['Ana',12],['Luis',7],['Sofía',20],['Diego',15],['MÁXIMO','?']],
     activa:'B6', barra:'=MAX(B2:B5)'},
  op:['20','15','54','7'],
  ex:'MAX devuelve el valor más alto del rango. MIN devolvería 7; SUMA devolvería 54.' },

{ id:'X06', tema:'excel', sub:'Funciones básicas', n:1,
  q:'Para obtener la nota media de un grupo, ¿qué función usas?',
  op:['PROMEDIO','SUMA','MAX','CONTAR.SI'],
  ex:'PROMEDIO suma los valores y divide por la cantidad de valores.' },

{ id:'X07', tema:'excel', sub:'Estructura de la hoja', n:1,
  q:'¿Cuántas celdas abarca el rango A1:C1?',
  op:['3','1','2','4'],
  ex:'A1, B1 y C1: tres celdas en la misma fila.' },

{ id:'X08', tema:'excel', sub:'Fórmulas y operadores', n:2,
  q:'¿Qué resultado da la fórmula?',
  v:{tipo:'celdas', cols:['A','B','C'], desde:1, filas:[[4,3,'?']], activa:'C1', barra:'=A1+B1*2'},
  op:['10','14','9','24'],
  ex:'Primero se multiplica (3×2=6) y después se suma (4+6=10). Igual que en matemática.' },

{ id:'X09', tema:'excel', sub:'Fórmulas y operadores', n:2,
  q:'¿Y ahora, con paréntesis?',
  v:{tipo:'celdas', cols:['A','B','C'], desde:1, filas:[[4,3,'?']], activa:'C1', barra:'=(A1+B1)*2'},
  op:['14','10','9','24'],
  ex:'El paréntesis obliga a sumar primero: (4+3)=7, después 7×2=14.' },

{ id:'X10', tema:'excel', sub:'Referencias relativas y absolutas', n:2,
  q:'En C1 hay =A1+B1. Si arrastras la fórmula hacia abajo hasta C2, ¿qué queda en C2?',
  op:['=A2+B2','=A1+B1','=A1+B2','=B1+C1'],
  ex:'Las referencias relativas "se mueven" con la fórmula: al bajar una fila, A1 pasa a A2 y B1 a B2.' },

{ id:'X11', tema:'excel', sub:'Referencias relativas y absolutas', n:2,
  q:'En C2 hay =B2*$F$1. Si la copias a C3, ¿qué queda?',
  op:['=B3*$F$1','=B3*$F$2','=B2*$F$1','=C3*$G$2'],
  ex:'B2 es relativa y se mueve a B3. $F$1 es absoluta: el $ la deja fija.' },

{ id:'X12', tema:'excel', sub:'Referencias relativas y absolutas', n:2,
  q:'¿Para qué sirve el signo $ en $A$1?',
  op:['Para que la referencia no cambie al copiar la fórmula','Para que el resultado salga en guaraníes','Para sumar dinero','Para proteger la celda contra cambios'],
  ex:'El $ "ancla" la columna y la fila. No tiene nada que ver con el formato de moneda.' },

{ id:'X13', tema:'excel', sub:'Errores comunes', n:2,
  q:'¿Por qué aparece este error?',
  v:{tipo:'celdas', cols:['A','B','C'], desde:1, filas:[['Total','Cantidad','Promedio'],[150000,0,'#¡DIV/0!']], activa:'C2', barra:'=A2/B2'},
  op:['Porque se está dividiendo por cero','Porque falta el signo =','Porque el número es muy grande','Porque la columna es angosta'],
  ex:'B2 vale 0 y no se puede dividir por cero. Revisa que el divisor tenga datos.' },

{ id:'X14', tema:'excel', sub:'Funciones condicionales', n:2,
  q:'¿Qué hace =CONTAR.SI(B2:B31;"Sí")?',
  op:['Cuenta cuántas celdas de B2 a B31 dicen "Sí"','Suma los valores de las celdas que dicen "Sí"','Escribe "Sí" en todas las celdas','Muestra Sí o No según la condición'],
  ex:'CONTAR.SI cuenta celdas que cumplen un criterio. Es la función clave para tabular encuestas.' },

{ id:'X15', tema:'excel', sub:'Porcentajes', n:2,
  q:'De 120 encuestados, 30 respondieron "Sí". ¿Qué porcentaje es?',
  op:['25%','30%','40%','4%'],
  ex:'30 ÷ 120 = 0,25 → con formato porcentaje se ve 25%.' },

{ id:'X16', tema:'excel', sub:'Funciones condicionales', n:2,
  q:'¿Qué le falta a esta fórmula?',
  v:{tipo:'formula', texto:'=SI(B2>=60;"Aprobado")'},
  op:['Lo que debe mostrar si la condición NO se cumple','El signo $','Un segundo signo =','Las comillas en el 60'],
  ex:'SI tiene tres partes: condición ; valor si es verdadero ; valor si es falso. Sin la tercera, muestra FALSO.' },

{ id:'X17', tema:'excel', sub:'Funciones condicionales', n:3,
  q:'¿Qué muestra C2?',
  v:{tipo:'celdas', cols:['A','B','C'], desde:1, filas:[['Alumno','Puntaje','Situación'],['Marta',60,'?']], activa:'C2', barra:'=SI(B2>=60;"Aprobado";"Reprobado")'},
  op:['Aprobado','Reprobado','FALSO','#¡VALOR!'],
  ex:'>= significa "mayor O IGUAL". 60 es igual a 60, así que la condición se cumple.' },

{ id:'X18', tema:'excel', sub:'Referencias relativas y absolutas', n:3,
  q:'C2 calcula bien el porcentaje, pero al arrastrar hacia abajo aparece #¡DIV/0!. ¿Cómo debería ser la fórmula de C2?',
  v:{tipo:'celdas', cols:['A','B','C'], desde:1,
     filas:[['Respuesta','Cantidad','%'],['Sí',45,'75%'],['No',12,'#¡DIV/0!'],['No sé',3,'#¡DIV/0!'],['TOTAL',60,'']],
     activa:'C2', barra:'=B2/B5'},
  op:['=B2/$B$5','=$B$2/B5','=B2/B5*100','=SUMA(B2/B5)'],
  ex:'Al arrastrar, B5 se convierte en B6, B7… (celdas vacías). El total tiene que quedar fijo: $B$5.' },

{ id:'X19', tema:'excel', sub:'Funciones condicionales', n:3,
  q:'¿Qué calcula =SUMAR.SI(A2:A20;"1°";C2:C20)?',
  op:['Suma los valores de C solo en las filas donde A dice "1°"','Cuenta cuántos alumnos son de 1°','Suma toda la columna C','Suma la columna A si C dice "1°"'],
  ex:'SUMAR.SI: rango donde se busca el criterio ; criterio ; rango que se suma.' },

{ id:'X20', tema:'excel', sub:'Datos de encuesta', n:3,
  q:'CONTAR.SI(B2:B9;"Sí") da 2, pero hay más personas que dijeron que sí. ¿Por qué?',
  v:{tipo:'celdas', cols:['A','B'], desde:1,
     filas:[['Encuestado','¿Usa la biblioteca?'],[1,'Sí'],[2,'si'],[3,'SI '],[4,'No'],[5,'sí'],[6,'Sí'],[7,'no'],[8,'Si']]},
  op:['Las respuestas no están escritas de forma uniforme','CONTAR.SI no funciona con texto','Falta el signo $','Hay demasiadas filas'],
  ex:'"si", "SI " (con espacio) o "Si" sin tilde no siempre coinciden con "Sí". Antes de tabular hay que CODIFICAR: una sola forma para cada respuesta (o números: 1 = Sí, 2 = No).' },

{ id:'X21', tema:'excel', sub:'Gráficos', n:3,
  q:'Quieres mostrar qué porcentaje eligió cada una de 4 opciones de UNA pregunta (suman 100%). ¿Qué gráfico conviene?',
  op:['Circular o de barras','De líneas','De dispersión','Ninguno: mejor una tabla de 60 filas'],
  ex:'Partes de un total → circular (pocas categorías) o barras. Las líneas son para cambios en el tiempo.' },

{ id:'X22', tema:'excel', sub:'Gráficos', n:2,
  q:'Para mostrar cómo cambió la cantidad de visitas a la biblioteca mes a mes, ¿qué gráfico conviene?',
  op:['De líneas','Circular','De anillos','Ninguno'],
  ex:'Cuando el eje es el TIEMPO (meses, días), el gráfico de líneas muestra la tendencia.' },

{ id:'X23', tema:'excel', sub:'Datos de encuesta', n:3,
  q:'¿Cuál es la forma correcta de organizar las respuestas de una encuesta en Excel?',
  op:['Una fila por encuestado y una columna por pregunta','Una hoja por encuestado','Todas las respuestas en una sola celda','Una fila por pregunta y todo el texto junto'],
  ex:'Cada FILA es un caso (una persona) y cada COLUMNA una variable (una pregunta). Así se puede contar, filtrar y graficar.' },

{ id:'X24', tema:'excel', sub:'Funciones condicionales', n:3,
  q:'¿Qué cuenta =CONTAR.SI(C2:C31;">=60")?',
  op:['Cuántos valores son 60 o más','Cuántas celdas dicen ">=60"','La suma de las notas mayores a 60','Cuántos valores son menores a 60'],
  ex:'El criterio puede ser una comparación entre comillas: ">=60", "<10", "<>0".' },

{ id:'X25', tema:'excel', sub:'Porcentajes', n:3,
  q:'Hay 30 encuestados en B2:B31. ¿Qué fórmula da el porcentaje de "Sí"?',
  op:['=CONTAR.SI(B2:B31;"Sí")/30','=SUMA(B2:B31)/30','=CONTAR.SI(B2:B31)/"Sí"','=PROMEDIO("Sí")'],
  ex:'Parte ÷ total: cuántos dijeron Sí, dividido por todos los encuestados. Después se aplica formato %.' },

{ id:'X26', tema:'excel', sub:'Gráficos', n:2,
  q:'Un gráfico tiene barras pero no tiene título, ni nombres en los ejes, ni valores. ¿Cuál es el problema?',
  op:['Nadie puede interpretar qué muestra','Está mal porque debería ser circular','Ninguno, así se ve más limpio','Que las barras deberían ser 3D'],
  ex:'Un gráfico interpretable necesita título, ejes identificados y, si se puede, los valores o porcentajes.' },

/* ─────────────────────────── WORD ─────────────────────────── */

{ id:'W01', tema:'word', sub:'Estilos', n:1,
  q:'¿Qué es un ESTILO en Word?',
  op:['Un conjunto de formatos guardado con un nombre (fuente, tamaño, color, espaciado)','Un tipo de letra','Una plantilla de portada','El color de la página'],
  ex:'Al aplicar el estilo "Título 1", el texto toma todos esos formatos de una vez, y Word sabe que es un título.' },

{ id:'W02', tema:'word', sub:'Tabla de contenido', n:1,
  q:'Para que el índice automático (tabla de contenido) encuentre los títulos, ¿qué hay que usar?',
  op:['Los estilos Título 1, Título 2…','Negrita y tamaño 16','Subrayado','MAYÚSCULAS'],
  ex:'El índice automático se arma con los ESTILOS de título, no con el aspecto del texto.' },

{ id:'W03', tema:'word', sub:'Encabezado y pie', n:1,
  q:'¿Qué es el ENCABEZADO?',
  op:['La zona superior de la página que se repite en todas las páginas (de la sección)','El primer párrafo del informe','El título de la portada','La primera fila de una tabla'],
  ex:'Encabezado arriba, pie de página abajo. Lo que escribes ahí se repite automáticamente.' },

{ id:'W04', tema:'word', sub:'Estructura del informe', n:1,
  q:'¿Cuál es el orden correcto de las partes de un informe?',
  op:['Portada → Introducción → Metodología → Resultados → Conclusión','Portada → Conclusión → Resultados → Introducción','Introducción → Portada → Resultados → Metodología','Resultados → Metodología → Portada → Conclusión'],
  ex:'Primero se presenta el tema, después cómo se trabajó, qué se encontró y qué se concluye.' },

{ id:'W05', tema:'word', sub:'Saltos de página y de sección', n:1,
  q:'¿Para qué sirve un SALTO DE PÁGINA?',
  op:['Para que lo que sigue empiece en una página nueva','Para borrar una página','Para numerar las páginas','Para cambiar la orientación de la hoja'],
  ex:'Insertar → Salto de página (o Ctrl+Enter). Reemplaza al "Enter, Enter, Enter…".' },

{ id:'W06', tema:'word', sub:'Encabezado y pie', n:1,
  q:'¿Dónde se coloca normalmente el número de página?',
  op:['En el pie o en el encabezado de página','Escrito a mano al final de cada página','En la portada','En la tabla de contenido'],
  ex:'Insertar → Número de página: Word lo coloca en el pie o encabezado y lo actualiza solo.' },

{ id:'W07', tema:'word', sub:'Saltos de página y de sección', n:2,
  q:'Un compañero aprieta Enter muchas veces para que el capítulo empiece en la página siguiente. ¿Qué problema trae?',
  op:['Si agrega o borra texto arriba, todo se corre y el capítulo queda en cualquier lugar','Ninguno, es la forma correcta','Que la letra cambia de tamaño','Que el documento ocupa más memoria'],
  ex:'El salto de página "sostiene" el inicio del capítulo aunque edites lo anterior.' },

{ id:'W08', tema:'word', sub:'Tabla de contenido', n:2,
  q:'Agregaste un capítulo nuevo y el índice no lo muestra. ¿Qué haces?',
  op:['Clic en el índice → Actualizar tabla','Escribirlo a mano en el índice','Borrar el índice y escribirlo de nuevo a mano','Nada, no se puede'],
  ex:'El índice no se actualiza solo: hay que pedírselo (Referencias → Actualizar tabla). Hazlo siempre antes de entregar.' },

{ id:'W09', tema:'word', sub:'Tabla de contenido', n:2,
  q:'Un título escrito en negrita, tamaño 16, no aparece en el índice. ¿Por qué?',
  op:['Porque no tiene aplicado un estilo de Título','Porque es muy chico','Porque está en negrita','Porque el índice solo muestra 3 títulos'],
  ex:'Para Word, un texto grande en negrita sigue siendo "texto normal". Le falta el estilo Título 1 o 2.' },

{ id:'W10', tema:'word', sub:'Saltos de página y de sección', n:2,
  q:'¿Qué permite un SALTO DE SECCIÓN que NO permite un salto de página?',
  op:['Cambiar encabezado, pie, numeración u orientación desde ese punto','Empezar en una página nueva','Agregar una tabla','Cambiar el tamaño de letra'],
  ex:'El salto de página solo pasa de página. El de sección divide el documento en partes con configuración propia.' },

{ id:'W11', tema:'word', sub:'Estilos', n:2,
  q:'Si usas "Título 1" para los capítulos y "Título 2" para los subtemas, ¿cómo aparecen en el índice?',
  op:['Los Título 2 aparecen como subniveles debajo de su Título 1','Todos al mismo nivel','Solo aparecen los Título 2','Los Título 2 aparecen primero'],
  ex:'Los niveles de estilo arman la jerarquía del índice: 1 → capítulo, 2 → subtema, 3 → sub-subtema.' },

{ id:'W12', tema:'word', sub:'Encabezado y pie', n:2,
  q:'La portada muestra el número de página y no debería. ¿Qué opción usas?',
  v:{tipo:'paginas', pags:[{sec:1, pie:'1', txt:'PORTADA'},{sec:1, pie:'2', txt:'Introducción'},{sec:1, pie:'3', txt:'Metodología'}]},
  op:['"Primera página diferente" en el encabezado/pie','Borrar el número a mano','Poner el número en color blanco','Cambiar la fuente del pie'],
  ex:'Con "Primera página diferente" la portada queda sin encabezado ni pie, y las demás páginas siguen numeradas.' },

{ id:'W13', tema:'word', sub:'Estilos', n:2,
  q:'Haces clic derecho en el estilo "Título 1" → Modificar, y le pones color azul. ¿Qué pasa?',
  op:['Todos los títulos con ese estilo se vuelven azules','Solo cambia el título seleccionado','Cambia todo el documento a azul','No pasa nada hasta reiniciar Word'],
  ex:'Esa es la ventaja de los estilos: cambias una vez y se aplica en todo el documento.' },

{ id:'W14', tema:'word', sub:'Saltos de página y de sección', n:3,
  q:'Quieres el encabezado "Informe ICIENTEC" SOLO en la sección 2, pero también aparece en la sección 1. ¿Qué faltó?',
  v:{tipo:'paginas', pags:[{sec:1, enc:'Informe ICIENTEC', txt:'PORTADA'},{sec:1, enc:'Informe ICIENTEC', txt:'Índice'},{corte:true},{sec:2, enc:'Informe ICIENTEC', txt:'Introducción'},{sec:2, enc:'Informe ICIENTEC', txt:'Metodología'}]},
  op:['Desactivar "Vincular al anterior" en el encabezado de la sección 2','Insertar más saltos de página','Escribir el encabezado en cada página','Cambiar el estilo del título'],
  ex:'Por defecto, cada sección copia ("vincula") el encabezado de la anterior. Primero desvinculas en la sección 2 y después borras el texto de la sección 1.' },

{ id:'W15', tema:'word', sub:'Encabezado y pie', n:3,
  q:'Portada e índice ocupan 2 páginas. Quieres que la Introducción tenga el número 1. ¿Qué secuencia es correcta?',
  op:['Salto de sección (página siguiente) antes de la Introducción → desvincular el pie → Formato de número: iniciar en 1','Salto de página → escribir "1" a mano','Borrar la portada','Poner la Introducción como Título 1'],
  ex:'Sin salto de sección, todo el documento es una sola numeración. La sección nueva permite reiniciar en 1.' },

{ id:'W16', tema:'word', sub:'Saltos de página y de sección', n:3,
  q:'Una tabla muy ancha necesita una página HORIZONTAL en medio de un documento vertical. ¿Cómo se hace?',
  op:['Salto de sección antes y después de la tabla, y orientación horizontal solo en esa sección','Girar todo el documento a horizontal','Achicar la letra de la tabla a 6','Pegar la tabla como imagen torcida'],
  ex:'La orientación es una propiedad de la SECCIÓN. Por eso hacen falta dos saltos de sección.' },

{ id:'W17', tema:'word', sub:'Tabla de contenido', n:3,
  q:'¿Cuál es el orden correcto para tener un índice automático que funcione?',
  op:['Aplicar estilos de título → insertar la tabla de contenido → actualizarla al terminar','Insertar la tabla → escribir los títulos en negrita → imprimir','Escribir el índice a mano → aplicar estilos','Actualizar la tabla → aplicar estilos → insertar la tabla'],
  ex:'Sin estilos no hay nada que indexar. Y lo último antes de entregar: actualizar.' },

{ id:'W18', tema:'word', sub:'Tablas y gráficos', n:2,
  q:'Pegaste un gráfico de Excel en el informe. ¿Qué le falta para estar completo?',
  op:['Un título numerado y la fuente (ej.: "Figura 1. … Fuente: elaboración propia")','Un borde de colores','Que sea más grande que la página','Nada, el gráfico se explica solo'],
  ex:'Toda tabla o figura se numera, se titula y lleva la fuente, para poder mencionarla en el texto.' },

{ id:'W19', tema:'word', sub:'Estructura del informe', n:3,
  q:'"El 68% de los encuestados afirma que no encuentra los materiales a tiempo." ¿En qué parte del informe va?',
  op:['Resultados','Conclusión','Introducción','Portada'],
  ex:'Un dato obtenido de la encuesta es un RESULTADO. La conclusión interpreta: "por lo tanto, el proyecto es necesario".' },

{ id:'W20', tema:'word', sub:'Estructura del informe', n:2,
  q:'"Se aplicó una encuesta de 10 preguntas cerradas a 60 alumnos de 1° a 3°." ¿En qué parte va?',
  op:['Metodología','Resultados','Conclusión','Agradecimientos'],
  ex:'La metodología cuenta CÓMO se obtuvieron los datos: instrumento, a quiénes, cuántos.' },

{ id:'W21', tema:'word', sub:'Saltos de página y de sección', n:3,
  q:'Quieres que cada capítulo empiece en página nueva Y con encabezado distinto. ¿Qué salto usas?',
  op:['Salto de sección "Página siguiente"','Salto de sección "Continuo"','Salto de página','Salto de columna'],
  ex:'"Página siguiente" crea una sección nueva y además empieza en otra hoja. "Continuo" crea la sección en la misma hoja.' },

{ id:'W22', tema:'word', sub:'Estructura del informe', n:3,
  q:'¿Qué frase corresponde a la CONCLUSIÓN?',
  op:['"Los datos muestran que el sistema es necesario y viable con los recursos del colegio."','"Se encuestó a 60 alumnos."','"Gráfico 2: respuestas a la pregunta 4."','"El presente informe trata sobre…"'],
  ex:'La conclusión responde al objetivo usando los resultados. No repite datos sueltos ni presenta el tema.' },

/* ──────────────────────── POWERPOINT ──────────────────────── */

{ id:'P01', tema:'ppt', sub:'Tamaño de letra', n:1,
  q:'¿Cuál es el tamaño MÍNIMO recomendado para el texto de una diapositiva que se proyecta?',
  op:['24 pt','10 pt','14 pt','8 pt'],
  ex:'Por debajo de 24 pt, el fondo del aula no lee. Títulos: 36 pt o más.' },

{ id:'P02', tema:'ppt', sub:'Contraste según la sala', n:1,
  q:'La sala está MUY ILUMINADA. ¿Qué combinación conviene?',
  op:['Fondo oscuro y texto claro','Fondo claro y texto claro','Fondo oscuro y texto oscuro','Fondo blanco y texto amarillo'],
  ex:'Con mucha luz, el proyector "lava" los colores claros. Un fondo oscuro con letra clara mantiene el contraste.' },

{ id:'P03', tema:'ppt', sub:'Contraste según la sala', n:1,
  q:'La sala está OSCURA. ¿Qué combinación conviene?',
  op:['Fondo claro y letra oscura','Fondo oscuro y letra oscura','Fondo negro y letra azul oscuro','Fondo claro y letra amarilla'],
  ex:'En la sala oscura, un fondo claro con letra oscura se lee cómodo y no "desaparece" el texto.' },

{ id:'P04', tema:'ppt', sub:'Texto vs imagen', n:1,
  q:'¿Cuál es la función de una diapositiva en una presentación oral?',
  op:['Apoyar lo que dice quien presenta, con pocas palabras','Contener todo el texto para leerlo','Reemplazar al informe','Decorar el escenario'],
  ex:'La presentación no es un documento: lo importante lo dices tú, la diapositiva lo refuerza.' },

{ id:'P05', tema:'ppt', sub:'Contraste según la sala', n:1,
  q:'¿Cuál es el problema de esta diapositiva?',
  v:{tipo:'diapo', fondo:'#ffffff', color:'#f2e45c', titulo:'Resultados', texto:['El 68% usa la biblioteca','El 22% no la conoce']},
  op:['Muy poco contraste entre el texto y el fondo','La letra es muy grande','Tiene título','Tiene pocas viñetas'],
  ex:'Amarillo sobre blanco casi no se distingue. El contraste importa más que el color "lindo".' },

{ id:'P06', tema:'ppt', sub:'Jerarquía visual', n:1,
  q:'En una diapositiva, ¿qué debería verse más grande?',
  op:['El título','El texto del cuerpo','El número de diapositiva','El logo del colegio'],
  ex:'La jerarquía visual guía la mirada: primero el título, después la idea principal, después el detalle.' },

{ id:'P07', tema:'ppt', sub:'Contraste según la sala', n:2,
  q:'Vas a presentar en el patio techado, con MUCHA LUZ. ¿Qué diapositiva eliges?',
  op:[
    {t:'Fondo azul noche, texto blanco', d:{fondo:'#121a33', color:'#ffffff', titulo:'Nuestro proyecto', texto:['App de turnos para la cantina']}},
    {t:'Fondo blanco, texto gris claro', d:{fondo:'#ffffff', color:'#c8c8c8', titulo:'Nuestro proyecto', texto:['App de turnos para la cantina']}},
    {t:'Fondo amarillo, texto blanco', d:{fondo:'#f6e27a', color:'#ffffff', titulo:'Nuestro proyecto', texto:['App de turnos para la cantina']}},
    {t:'Fondo negro, texto azul oscuro', d:{fondo:'#0b0b0b', color:'#1d2c6b', titulo:'Nuestro proyecto', texto:['App de turnos para la cantina']}}
  ],
  ex:'Sala iluminada → fondo oscuro con texto claro. Las otras tienen bajo contraste o se "lavan" con la luz.' },

{ id:'P08', tema:'ppt', sub:'Texto vs imagen', n:2,
  q:'Una diapositiva tiene 12 viñetas largas. ¿Qué es lo mejor?',
  op:['Dejar solo las palabras clave, separar en más diapositivas o reemplazar por un esquema o imagen','Bajar la letra a 12 pt para que entre todo','Leerla completa en voz alta','Ponerle un fondo más llamativo'],
  ex:'Regla práctica: una idea por diapositiva y pocas líneas. Lo demás lo explicas tú.' },

{ id:'P09', tema:'ppt', sub:'Gráficos en la presentación', n:2,
  q:'Quieres mostrar que "el 68% está de acuerdo". ¿Qué es más efectivo?',
  op:['El número grande o un gráfico simple que lo destaque','La tabla completa de 60 encuestados','Un párrafo explicando la encuesta','Una captura de la planilla de Excel'],
  ex:'En la diapositiva va el dato que importa. La tabla completa queda para el informe o el anexo.' },

{ id:'P10', tema:'ppt', sub:'Fondos', n:2,
  q:'Usaste una foto muy colorida de fondo y el texto encima no se lee. ¿Qué haces?',
  op:['Oscurecer o aclarar la foto (o poner una franja sólida detrás del texto)','Poner el texto en otro color llamativo','Agrandar la foto','Ponerle sombra a la foto'],
  ex:'Un fondo "cargado" compite con el texto. Se baja su intensidad o se pone el texto sobre una zona lisa.' },

{ id:'P11', tema:'ppt', sub:'Jerarquía visual', n:2,
  q:'¿Cuántas tipografías (tipos de letra) conviene usar en una presentación?',
  op:['Una o dos','Una distinta por diapositiva','Cinco, para que sea variada','Todas las que tenga la computadora'],
  ex:'Muchas tipografías dan sensación de desorden. Una para títulos y otra para el texto alcanza.' },

{ id:'P12', tema:'ppt', sub:'Contraste según la sala', n:2,
  q:'¿Qué problema tiene usar texto rojo sobre fondo verde?',
  op:['Poco contraste y no lo distinguen las personas con daltonismo','Ninguno, son colores complementarios','Que se ve muy formal','Que ocupa más espacio'],
  ex:'Rojo/verde es la combinación más difícil para quienes tienen daltonismo, y además su luminosidad es parecida.' },

{ id:'P13', tema:'ppt', sub:'Texto vs imagen', n:2,
  q:'Estiraste una imagen chiquita para que ocupe toda la diapositiva y se ve borrosa. ¿Qué pasó?',
  op:['La imagen tiene poca resolución para ese tamaño','El proyector está mal','Falta un borde','PowerPoint no acepta imágenes grandes'],
  ex:'Una imagen de baja resolución se "pixela" al agrandarla. Busca una de mayor tamaño o úsala más chica.' },

{ id:'P14', tema:'ppt', sub:'Contraste según la sala', n:3,
  q:'Vas a presentar en el aula con las cortinas cerradas y la luz apagada. ¿Qué cambias en esta diapositiva?',
  v:{tipo:'diapo', fondo:'#0f1424', color:'#e8e8e8', titulo:'Viabilidad técnica', texto:['Contamos con 12 computadoras','Internet disponible en el laboratorio']},
  op:['Pasarla a fondo claro y letra oscura','Nada, el fondo oscuro sirve para todo','Bajar el tamaño de letra','Agregar una foto de fondo'],
  ex:'Sala oscura → fondo claro y letra oscura. Antes de presentar, conviene conocer la sala o llevar las dos versiones.' },

{ id:'P15', tema:'ppt', sub:'Coherencia informe–presentación', n:3,
  q:'En el informe dice 68%, pero en la presentación dice 70%. ¿Qué haces?',
  op:['Verificar en la planilla de Excel y corregir el que esté mal','Dejarlos así, la diferencia es chica','Redondear todo a 70%','Sacar el dato de la presentación'],
  ex:'Excel, Word y PPT tienen que decir lo mismo. La fuente de verdad es la planilla de datos.' },

{ id:'P16', tema:'ppt', sub:'Estructura de la presentación', n:3,
  q:'¿Cuál es un buen orden para presentar el proyecto en ICIENTEC?',
  op:['Problema → objetivo → cómo trabajamos → resultados → conclusión y viabilidad','Resultados → agradecimientos → problema','Integrantes → fotos del equipo → conclusión','Conclusión → problema → objetivo → metodología'],
  ex:'Es el mismo recorrido que el informe, pero contado en voz alta y con lo esencial.' },

{ id:'P17', tema:'ppt', sub:'Gráficos en la presentación', n:3,
  q:'Tienes un gráfico circular en 3D con 9 categorías. ¿Qué lo mejoraría?',
  op:['Pasarlo a barras ordenadas de mayor a menor, en 2D','Agregarle más colores','Hacerlo más grande sin cambiar nada','Girarlo para que se vea el 3D'],
  ex:'Con muchas categorías, el circular no se lee; el 3D además deforma las proporciones.' },

{ id:'P18', tema:'ppt', sub:'Texto vs imagen', n:3,
  q:'¿En qué caso conviene más una IMAGEN que texto?',
  op:['Para mostrar cómo luce el prototipo','Para dar una definición precisa','Para citar textual a un autor','Para mostrar la fórmula de un cálculo'],
  ex:'La imagen sirve para mostrar cómo es algo; el texto, para precisar. Cada uno donde rinde más.' },

{ id:'P19', tema:'ppt', sub:'Estructura de la presentación', n:2,
  q:'Durante la defensa, un integrante lee textual todo lo que dice la diapositiva. ¿Qué transmite al jurado?',
  op:['Que no domina el tema','Que se preparó muy bien','Que la diapositiva está bien hecha','Que respeta el tiempo'],
  ex:'Si el texto se lee, sobra quien presenta. Practica explicar con tus palabras usando la diapositiva como guía.' },

{ id:'P20', tema:'ppt', sub:'Jerarquía visual', n:3,
  q:'¿Qué problema tiene esta diapositiva?',
  v:{tipo:'diapo', fondo:'#ff2fa0', color:'#00ff00', titulo:'¡¡NUESTRO PROYECTO!!', texto:['Objetivo','Problema','Resultados','Conclusión','Equipo'], arcoiris:true},
  op:['Demasiados colores fuertes y sin jerarquía: todo grita a la vez','Tiene muy pocas viñetas','Le falta una animación','La letra es demasiado grande'],
  ex:'Una paleta de 2 o 3 colores, con uno solo para destacar, ordena la mirada.' },

/* ──────────────────────── PROYECTOS ──────────────────────── */

{ id:'J01', tema:'proyecto', sub:'Verbos de objetivos', n:1,
  q:'¿En qué forma verbal se redacta un objetivo?',
  op:['En infinitivo (determinar, diseñar, identificar…)','En pasado (determinamos…)','En futuro (determinaremos…)','En forma de pregunta'],
  ex:'Los objetivos empiezan con un verbo en infinitivo: terminan en -ar, -er, -ir.' },

{ id:'J02', tema:'proyecto', sub:'Verbos de objetivos', n:1,
  q:'¿Cuál de estos verbos sirve mejor para un objetivo porque se puede verificar?',
  op:['Determinar','Conocer','Entender','Saber'],
  ex:'"Conocer" o "entender" ocurren en la cabeza: no se pueden comprobar. "Determinar" produce un resultado que se puede mostrar.' },

{ id:'J03', tema:'proyecto', sub:'Hipótesis', n:1,
  q:'¿Qué estructura tiene una hipótesis bien formulada?',
  op:['Si [acción o causa], entonces [efecto esperado]','¿Será que [algo]?','Nosotros queremos [algo]','[Problema] es malo'],
  ex:'La hipótesis es una afirmación que se puede poner a prueba: "Si hacemos X, entonces pasará Y".' },

{ id:'J04', tema:'proyecto', sub:'Viabilidad', n:1,
  q:'¿Qué pregunta responde la viabilidad ECONÓMICA?',
  op:['¿Cuánto cuesta y de dónde sale el dinero?','¿Tenemos las computadoras necesarias?','¿Está permitido por la ley?','¿Les va a gustar a los usuarios?'],
  ex:'Económica: costos y financiamiento. Técnica: equipos y saberes. Legal: permisos y normas.' },

{ id:'J05', tema:'proyecto', sub:'Viabilidad', n:1,
  q:'¿Qué pregunta responde la viabilidad TÉCNICA?',
  op:['¿Tenemos los equipos, programas y conocimientos para hacerlo?','¿Cuánto dinero tenemos?','¿Necesitamos permiso de la dirección?','¿Cuántos usuarios lo van a usar?'],
  ex:'Es mirar con honestidad si contamos con lo técnico, o si lo podemos conseguir o aprender a tiempo.' },

{ id:'J06', tema:'proyecto', sub:'Viabilidad', n:1,
  q:'¿Qué pregunta responde la viabilidad LEGAL?',
  op:['¿Está permitido? ¿Necesitamos autorizaciones, cuidar datos personales o derechos de autor?','¿Cuánto cuesta el dominio?','¿Funciona en celulares?','¿Tenemos internet?'],
  ex:'Incluye permisos de la institución, autorización para usar fotos o datos de personas y respeto a licencias.' },

{ id:'J07', tema:'proyecto', sub:'Encuestas: para qué', n:2,
  q:'Encuesta: "Saber si los alumnos tienen dificultades para encontrar los materiales de estudio". ¿Para qué etapa sirve?',
  op:['Fundamentación (demostrar que el problema existe)','Desarrollo (definir funciones del sistema)','Evaluación (medir si el sistema funcionó)','Ninguna'],
  ex:'Antes de construir nada, la encuesta de fundamentación prueba con datos que el problema es real.' },

{ id:'J08', tema:'proyecto', sub:'Encuestas: para qué', n:2,
  q:'Encuesta: "Preguntar a los futuros usuarios qué funciones quieren que tenga la app". ¿Para qué etapa sirve?',
  op:['Desarrollo (definir requerimientos)','Fundamentación','Evaluación','Ninguna'],
  ex:'Ya sabemos que hay un problema; ahora la encuesta orienta CÓMO tiene que ser la solución.' },

{ id:'J09', tema:'proyecto', sub:'Encuestas: para qué', n:2,
  q:'Encuesta: "Medir si después de usar el sistema mejoró la satisfacción de los usuarios". ¿Para qué etapa sirve?',
  op:['Evaluación','Fundamentación','Desarrollo','Ninguna'],
  ex:'La encuesta de evaluación compara el antes y el después: ¿la solución resolvió el problema?' },

{ id:'J10', tema:'proyecto', sub:'Hipótesis', n:2,
  q:'¿Cuál es una hipótesis bien formulada?',
  op:['Si se implementa un sistema de turnos digital en la cantina, entonces disminuirá el tiempo de espera.','La cantina es muy lenta.','¿Será que una app ayuda a la cantina?','Si hacemos la app, todo va a mejorar.'],
  ex:'Tiene acción concreta (sistema de turnos) y efecto medible (tiempo de espera). "Todo va a mejorar" no se puede medir.' },

{ id:'J11', tema:'proyecto', sub:'Objetivo general y específicos', n:2,
  q:'¿Cuál es la diferencia entre el objetivo general y los específicos?',
  op:['El general dice qué se quiere lograr; los específicos son los pasos para lograrlo','El general es más corto','Los específicos se escriben al final del proyecto','No hay diferencia'],
  ex:'Si cumples todos los específicos, cumples el general. Son su desglose.' },

{ id:'J12', tema:'proyecto', sub:'Objetivo general y específicos', n:2,
  q:'Objetivo general: "Desarrollar una app de votación para el comité de alumnos". ¿Cuál es un buen objetivo ESPECÍFICO?',
  op:['Identificar los requerimientos de los usuarios mediante una encuesta','Conocer sobre votaciones','Que la app sea linda','Ganar ICIENTEC'],
  ex:'Es un paso concreto, con verbo verificable y un medio (la encuesta).' },

{ id:'J13', tema:'proyecto', sub:'Viabilidad', n:2,
  q:'El sistema va a mostrar fotos de los alumnos sin pedirles permiso. ¿Qué viabilidad está en riesgo?',
  op:['Legal','Técnica','Económica','Ninguna'],
  ex:'Las fotos y datos personales requieren autorización (y en menores, de los responsables).' },

{ id:'J14', tema:'proyecto', sub:'Planteamiento del problema', n:2,
  q:'¿Qué debe contener el planteamiento del problema?',
  op:['La situación real que se quiere cambiar, con datos que la muestren','La solución que vamos a programar','Los nombres del equipo','El presupuesto'],
  ex:'El problema describe lo que pasa, no lo que vamos a hacer. "No hay app" no es un problema; "los alumnos esperan 20 minutos en la fila" sí.' },

{ id:'J15', tema:'proyecto', sub:'Hipótesis', n:3,
  q:'Los datos muestran que la app NO redujo el tiempo de espera. ¿Qué haces con la hipótesis?',
  op:['Informar con honestidad que no se confirmó y analizar por qué','Cambiar los datos para que coincida','Borrar la hipótesis del informe','Decir que sí se confirmó'],
  ex:'Una hipótesis no confirmada no es un fracaso: es un resultado. Explicar el porqué es parte del aprendizaje.' },

{ id:'J16', tema:'proyecto', sub:'Verbos de objetivos', n:3,
  q:'"Conocer la opinión de los alumnos sobre la biblioteca". ¿Cuál es la mejor versión?',
  op:['Determinar el nivel de satisfacción de los alumnos de 1° con el servicio de la biblioteca mediante una encuesta','Conocer bien la opinión de todos los alumnos','Saber qué piensan los alumnos de la biblioteca','Investigar la biblioteca'],
  ex:'Verbo verificable + qué se mide + a quiénes + con qué instrumento.' },

{ id:'J17', tema:'proyecto', sub:'Preguntas de encuesta', n:3,
  q:'"¿No te parece que la cantina es pésima?" ¿Qué problema tiene esta pregunta?',
  op:['Induce la respuesta (está sesgada)','Es muy corta','Es una pregunta cerrada','Ninguno'],
  ex:'La pregunta ya trae la opinión. Una versión neutral: "¿Cómo calificarías el servicio de la cantina?" (con escala).' },

{ id:'J18', tema:'proyecto', sub:'Preguntas de encuesta', n:3,
  q:'"¿Te gusta la app y la usarías todos los días?" ¿Qué problema tiene?',
  op:['Son dos preguntas en una','Está en tuteo','Es una pregunta abierta','Es demasiado formal'],
  ex:'Alguien puede decir que le gusta, pero que no la usaría a diario. Se separa en dos preguntas.' },

{ id:'J19', tema:'proyecto', sub:'Hipótesis', n:3,
  q:'"Si se envían recordatorios por WhatsApp, entonces aumentará la entrega de tareas." ¿Qué es lo que el equipo CAMBIA (variable independiente)?',
  op:['El envío de recordatorios','La entrega de tareas','WhatsApp','Los alumnos'],
  ex:'Lo que se modifica va después del "Si". Lo que se espera medir (la entrega de tareas) va después del "entonces".' },

{ id:'J20', tema:'proyecto', sub:'Viabilidad', n:3,
  q:'Costos: dominio web 120.000 Gs + impresión de QR 80.000 Gs. Presupuesto: 150.000 Gs. ¿Es viable económicamente así como está?',
  v:{tipo:'celdas', cols:['A','B'], desde:1, filas:[['Concepto','Costo (Gs)'],['Dominio web',120000],['Impresión QR',80000],['TOTAL','?'],['Presupuesto',150000]], activa:'B4', barra:'=SUMA(B2:B3)'},
  op:['No: faltan 50.000 Gs; hay que ajustar el alcance o buscar financiamiento','Sí, alcanza justo','Sí, sobran 50.000 Gs','No se puede saber'],
  ex:'Total 200.000 > 150.000. Opciones reales: hosting gratuito sin dominio propio, imprimir menos QR, conseguir un aporte.' },

{ id:'J21', tema:'proyecto', sub:'Preguntas de encuesta', n:3,
  q:'Para fundamentar un problema de TODO el colegio, el equipo encuestó a 5 amigos. ¿Cuál es el problema?',
  op:['La muestra es muy chica y no representa a todo el colegio','Deberían haber encuestado a profesores solamente','Las encuestas no sirven para fundamentar','Ninguno'],
  ex:'Pocos casos y todos del mismo grupo: los resultados no se pueden generalizar. Conviene incluir distintos cursos.' },

{ id:'J22', tema:'proyecto', sub:'Encuestas: para qué', n:3,
  q:'¿En qué orden aparecen las encuestas a lo largo de un proyecto?',
  op:['Fundamentación → Desarrollo → Evaluación','Evaluación → Fundamentación → Desarrollo','Desarrollo → Evaluación → Fundamentación','Todas al mismo tiempo'],
  ex:'Primero pruebo que el problema existe, después diseño con los usuarios, al final evalúo si funcionó.' },

{ id:'J23', tema:'proyecto', sub:'Verbos de objetivos', n:2,
  q:'El objetivo es construir el prototipo de la app. ¿Qué verbo corresponde?',
  op:['Desarrollar','Identificar','Describir','Conocer'],
  ex:'Identificar o describir son pasos previos. Construir algo nuevo se expresa con desarrollar, diseñar o elaborar.' },

{ id:'J24', tema:'proyecto', sub:'Preguntas de encuesta', n:2,
  q:'"Totalmente de acuerdo / De acuerdo / Ni de acuerdo ni en desacuerdo / En desacuerdo / Totalmente en desacuerdo". ¿Qué tipo de pregunta es?',
  op:['Cerrada con escala (tipo Likert)','Abierta','De respuesta libre','Dicotómica (Sí/No)'],
  ex:'La escala Likert mide grado de acuerdo y se tabula fácil en Excel con CONTAR.SI.' },

{ id:'J25', tema:'proyecto', sub:'Preguntas de encuesta', n:2,
  q:'Tienes que tabular 100 encuestas rápido en Excel. ¿Qué tipo de preguntas te conviene?',
  op:['Cerradas (opciones fijas)','Abiertas','Todas abiertas y largas','Sin opciones'],
  ex:'Las cerradas se cuentan directo. Las abiertas sirven para explorar, pero hay que leerlas y codificarlas una por una.' },

{ id:'J26', tema:'proyecto', sub:'Objetivo general y específicos', n:3,
  q:'Objetivo general: "Evaluar la viabilidad de un sistema de préstamo de libros". ¿Cuál NO es un objetivo específico coherente?',
  op:['Programar la versión final del sistema con base de datos','Identificar la demanda de préstamos mediante una encuesta','Estimar los costos de implementación','Verificar las autorizaciones necesarias'],
  ex:'En 1° el proyecto llega hasta la viabilidad. Programar la versión final corresponde a etapas posteriores (2° y 3°).' }

];
