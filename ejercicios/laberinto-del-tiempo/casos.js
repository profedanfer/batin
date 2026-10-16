/* ═══════════════════════════════════════════════════════════════
   BATIN · Bit y el Laberinto del Tiempo · 2° curso
   CASOS Y PREGUNTAS  —  este es el archivo que se edita
   ═══════════════════════════════════════════════════════════════

   Cada CASO es un problema que se recorre en dos épocas:
     PASADO  → análisis: datos de entrada y salida, pseudocódigo,
               prueba de escritorio.
     FUTURO  → producción: el mismo problema en Python, qué muestra,
               dónde está el error, si coincide con el análisis.

   CÓMO EDITAR UNA PREGUNTA
   ------------------------
   id    → código único (no repetir). Si cambias mucho una pregunta,
           cámbiale el id para que el panel no mezcle datos.
   era   → 'pasado' o 'futuro'
   sub   → subtema corto; escríbelo siempre igual para que se agrupe.
   q     → la pregunta.
   code  → (opcional) { lang: 'pseudo' o 'py', txt: `...` }
           El texto va entre comillas invertidas ` `.
           Para marcar una línea que falta, escribe ______________
   op    → opciones. ⚠ LA PRIMERA SIEMPRE ES LA CORRECTA.
           El juego las mezcla solo.
   ex    → explicación que se muestra después de responder.
   ═══════════════════════════════════════════════════════════════ */

window.LAB_CASOS = [

/* ════════════════════ CASO 1 · VARIABLES ════════════════════ */
{ id: 1, titulo: 'La cantina', tema: 'Variables, entrada y salida',
  enunciado: 'La cantina del colegio vende empanadas a 5.000 Gs. Se ingresa cuántas empanadas compra un alumno y el programa muestra el total a pagar.',
  preguntas: [

  { id:'C1P1', era:'pasado', sub:'Datos de entrada y salida',
    q:'¿Cuál es el dato de ENTRADA de este problema?',
    op:['La cantidad de empanadas','El total a pagar','El precio de cada empanada','El nombre de la cantina'],
    ex:'La entrada es lo que el usuario ingresa. El precio es un dato fijo y el total es la salida.' },

  { id:'C1P2', era:'pasado', sub:'Datos de entrada y salida',
    q:'¿Cuál es la SALIDA de este problema?',
    op:['El total a pagar','La cantidad de empanadas','El precio de cada empanada','La cantidad de alumnos'],
    ex:'La salida es el resultado que el algoritmo muestra: el total, que se obtiene a partir de la entrada.' },

  { id:'C1P3', era:'pasado', sub:'Constantes y variables',
    q:'El precio (5.000 Gs) no cambia mientras se ejecuta el algoritmo. ¿Cómo conviene tratarlo?',
    op:['Como una constante: se asigna una sola vez al inicio','Como un dato de entrada que se pide cada vez','Como la salida del algoritmo','No hace falta guardarlo en ningún lado'],
    ex:'Guardarlo en una constante (o en una variable que se asigna una vez) evita repetir el número y facilita cambiarlo si sube el precio.' },

  { id:'C1P4', era:'pasado', sub:'Pseudocódigo',
    q:'¿Qué línea falta en el algoritmo?',
    code:{ lang:'pseudo', txt:
`Algoritmo Cantina
    precio <- 5000
    Escribir "¿Cuántas empanadas?"
    Leer cantidad
    ______________
    Escribir "Total: ", total
FinAlgoritmo` },
    op:['total <- cantidad * precio','Leer total','total <- cantidad + precio','Escribir cantidad * 5'],
    ex:'Entre leer y mostrar va el PROCESO: calcular el total. Sumar cantidad + precio no da lo que hay que pagar.' },

  { id:'C1P5', era:'pasado', sub:'Prueba de escritorio',
    q:'Prueba de escritorio: si el alumno compra 3 empanadas, ¿qué valor debe tener total?',
    op:['15000','5003','3','8000'],
    ex:'3 × 5000 = 15000. Este es el valor esperado: en el futuro, el programa en Python tiene que dar lo mismo.' },

  { id:'C1F1', era:'futuro', sub:'Tipos de datos',
    q:'El alumno escribe 3. ¿Qué pasa al ejecutar?',
    code:{ lang:'py', txt:
`cantidad = input("¿Cuántas empanadas? ")
total = cantidad * 5000
print("Total:", total)` },
    op:['Muestra el 3 repetido 5000 veces, porque cantidad es texto','Muestra Total: 15000','Da error de sintaxis','Muestra Total: 5003'],
    ex:'input() SIEMPRE devuelve texto. Texto × número repite el texto. Por eso la prueba de escritorio (15000) no coincide.' },

  { id:'C1F2', era:'futuro', sub:'Tipos de datos',
    q:'¿Cómo se corrige la primera línea para que cantidad sea un número?',
    op:['cantidad = int(input("¿Cuántas empanadas? "))','cantidad = input(int("¿Cuántas empanadas? "))','cantidad = str(input("¿Cuántas empanadas? "))','int cantidad = input("¿Cuántas empanadas? ")'],
    ex:'Primero se lee el texto con input() y después se lo convierte a entero con int(). El orden importa: int(input(...)).' },

  { id:'C1F3', era:'futuro', sub:'Salida con print',
    q:'¿Qué se muestra en pantalla?',
    code:{ lang:'py', txt:
`precio = 5000
cantidad = 4
total = cantidad * precio
print("Total:", total, "Gs")` },
    op:['Total: 20000 Gs','Total:20000Gs','Total: total Gs','Total: 4 * 5000 Gs'],
    ex:'print separa con un espacio lo que recibe separado por comas. Lo que va entre comillas se muestra tal cual; total sin comillas muestra su valor.' },

  { id:'C1F4', era:'futuro', sub:'Nombres de variables',
    q:'Este programa da error. ¿Por qué?',
    code:{ lang:'py', txt:
`precio = 5000
cantidad = int(input("Cantidad: "))
total = cantidad * Precio
print(total)` },
    op:['NameError: Precio con mayúscula no existe; la variable es precio','Falta el signo $ antes de precio','int no se puede usar con input','print necesita comillas'],
    ex:'Python distingue mayúsculas de minúsculas: precio y Precio son dos nombres distintos, y Precio nunca se creó.' },

  { id:'C1F5', era:'futuro', sub:'Del análisis al código',
    q:'Con el programa ya corregido, lo ejecutamos con 3 y muestra 15000, igual que la prueba de escritorio. ¿Qué significa?',
    op:['Que el programa pasa esa prueba, pero conviene probar otros valores (0, 1, uno grande)','Que el programa ya no puede tener ningún error','Que no hace falta probar con otros valores','Que el análisis estaba mal'],
    ex:'Que coincida con el análisis da confianza, pero una sola prueba no alcanza: los errores suelen aparecer con valores límite.' }
  ]
},

/* ════════════════════ CASO 2 · CONDICIONES ════════════════════ */
{ id: 2, titulo: '¿Aprueba?', tema: 'Condiciones (if / else)',
  enunciado: 'Se ingresan los puntos de 3 trabajos prácticos (de 0 a 100 cada uno). El programa calcula el promedio y muestra «Aprobado» si es 60 o más; si no, «Reprobado».',
  preguntas: [

  { id:'C2P1', era:'pasado', sub:'Datos de entrada y salida',
    q:'¿Cuántos datos de ENTRADA tiene el problema?',
    op:['3: los puntos de cada trabajo','1: el promedio','4: las tres notas y el resultado','2: Aprobado y Reprobado'],
    ex:'El promedio se CALCULA (proceso) y el mensaje se MUESTRA (salida). Lo que se ingresa son las tres notas.' },

  { id:'C2P2', era:'pasado', sub:'Condiciones',
    q:'¿Cuál es la condición correcta para aprobar?',
    op:['promedio >= 60','promedio > 60','promedio = 60','promedio <= 60'],
    ex:'Con 60 exactos también se aprueba: por eso va >= (mayor o igual). Con >, quien saca justo 60 reprueba.' },

  { id:'C2P3', era:'pasado', sub:'Pseudocódigo',
    q:'¿Qué error tiene el cálculo del promedio?',
    code:{ lang:'pseudo', txt:
`Leer n1, n2, n3
promedio <- n1 + n2 + n3 / 3
Si promedio >= 60 Entonces
    Escribir "Aprobado"
SiNo
    Escribir "Reprobado"
FinSi` },
    op:['Faltan paréntesis: solo n3 se divide por 3','No tiene ningún error','Debería dividir por 2','Falta mostrar el promedio'],
    ex:'La división se hace antes que la suma. Lo correcto es (n1 + n2 + n3) / 3.' },

  { id:'C2P4', era:'pasado', sub:'Prueba de escritorio',
    q:'Prueba de escritorio con n1 = 50, n2 = 60 y n3 = 70. ¿Qué debe mostrar el algoritmo corregido?',
    op:['Aprobado (promedio 60)','Reprobado (promedio 59)','Aprobado (promedio 180)','Reprobado (promedio 50)'],
    ex:'(50 + 60 + 70) / 3 = 60, y 60 >= 60 es verdadero.' },

  { id:'C2P5', era:'pasado', sub:'Casos de prueba',
    q:'¿Qué datos de prueba sirven MEJOR para revisar si la condición está bien escrita?',
    op:['Notas que den un promedio de exactamente 60','Tres notas de 100','Tres notas de 0','Notas que den un promedio de 85'],
    ex:'Los errores se esconden en el borde: probar con 59, 60 y 61 muestra enseguida si usaste > o >=.' },

  { id:'C2F1', era:'futuro', sub:'Indentación',
    q:'¿Qué pasa al ejecutar este código?',
    code:{ lang:'py', txt:
`promedio = 72
if promedio >= 60:
print("Aprobado")
else:
    print("Reprobado")` },
    op:['IndentationError: el print del if debe ir con sangría','Muestra Aprobado','Muestra Reprobado','Muestra Aprobado y Reprobado'],
    ex:'En Python la sangría (espacios al inicio) indica qué está dentro del if. Sin ella, el bloque queda vacío y da error.' },

  { id:'C2F2', era:'futuro', sub:'Salida con print',
    q:'¿Qué muestra?',
    code:{ lang:'py', txt:
`n1, n2, n3 = 50, 60, 70
promedio = (n1 + n2 + n3) / 3
print(promedio)` },
    op:['60.0','60','180','70'],
    ex:'La división / en Python siempre da un decimal (float), aunque el resultado sea exacto. Coincide con la prueba de escritorio: 60.' },

  { id:'C2F3', era:'futuro', sub:'Condiciones',
    q:'El análisis decía que con 60 se aprueba. ¿Qué muestra este código y qué hay que cambiar?',
    code:{ lang:'py', txt:
`promedio = 60
if promedio > 60:
    print("Aprobado")
else:
    print("Reprobado")` },
    op:['Muestra Reprobado; hay que usar >=','Muestra Aprobado; está bien','Muestra Reprobado; hay que usar ==','Da error; falta un paréntesis'],
    ex:'El código no respeta el análisis: 60 > 60 es falso. Con >= la salida coincide con lo que se diseñó.' },

  { id:'C2F4', era:'futuro', sub:'Condiciones',
    q:'Este if da SyntaxError. ¿Por qué?',
    code:{ lang:'py', txt:
`if promedio = 60:
    print("Justo")` },
    op:['= asigna un valor; para comparar se usa ==','Falta el else','60 debería ir entre comillas','print va sin paréntesis'],
    ex:'En el pseudocódigo a veces se compara con =, pero en Python = guarda un valor y == compara.' },

  { id:'C2F5', era:'futuro', sub:'Condiciones',
    q:'¿Qué muestra con p = 95?',
    code:{ lang:'py', txt:
`p = 95
if p >= 60:
    print("Aprobado")
elif p >= 90:
    print("Excelente")` },
    op:['Solo Aprobado','Solo Excelente','Aprobado y Excelente','Nada'],
    ex:'Con if / elif se ejecuta solo la PRIMERA condición verdadera. Para que aparezca Excelente, el >= 90 tiene que ir primero.' }
  ]
},

/* ════════════════════ CASO 3 · FOR ════════════════════ */
{ id: 3, titulo: 'La rifa del curso', tema: 'Ciclo for',
  enunciado: 'El curso vende rifas durante 5 días. Cada día se ingresa cuántas rifas se vendieron y, al final, el programa muestra el total vendido.',
  preguntas: [

  { id:'C3P1', era:'pasado', sub:'Elegir la repetición',
    q:'Se sabe de antemano que son 5 días. ¿Qué estructura conviene?',
    op:['Para (repetición con cantidad conocida)','Mientras sin condición de salida','Si / SiNo','Ninguna: se escribe Leer cinco veces seguidas'],
    ex:'Cuando se sabe cuántas vueltas son, Para (for) es la opción más clara. Copiar cinco Leer funciona, pero no sirve si mañana son 30 días.' },

  { id:'C3P2', era:'pasado', sub:'Contadores y acumuladores',
    q:'Para ir sumando las ventas de cada día, ¿qué se necesita?',
    op:['Un acumulador que empiece en 0','Un contador que empiece en 1','Una constante','Un dato de entrada más'],
    ex:'El acumulador va sumando valores que cambian (las ventas). El contador suma de a 1 (cuenta cosas).' },

  { id:'C3P3', era:'pasado', sub:'Pseudocódigo',
    q:'¿Qué línea falta dentro del ciclo?',
    code:{ lang:'pseudo', txt:
`total <- 0
Para dia <- 1 Hasta 5 Con Paso 1 Hacer
    Leer vendidas
    ______________
FinPara
Escribir total` },
    op:['total <- total + vendidas','total <- vendidas','vendidas <- total + 1','total <- total + 1'],
    ex:'total <- vendidas pisa el valor anterior; total + 1 cuenta días, no rifas. El acumulador suma lo leído en cada vuelta.' },

  { id:'C3P4', era:'pasado', sub:'Prueba de escritorio',
    q:'Prueba de escritorio con ventas 4, 0, 6, 2 y 3. ¿Cuánto vale total al terminar?',
    op:['15','3','5','6'],
    ex:'0 + 4 = 4 → +0 = 4 → +6 = 10 → +2 = 12 → +3 = 15.' },

  { id:'C3P5', era:'pasado', sub:'Contadores y acumuladores',
    q:'Si se olvida la línea «total <- 0» antes del Para, ¿qué problema aparece?',
    op:['Se suma sobre una variable sin valor inicial: da error o un resultado incorrecto','Ninguno: las variables empiezan en 0 solas','El ciclo Para no se ejecuta','El ciclo se repite 6 veces'],
    ex:'Todo acumulador o contador necesita un valor inicial antes del ciclo. Es uno de los errores de análisis más comunes.' },

  { id:'C3F1', era:'futuro', sub:'range',
    q:'¿Qué números muestra (uno por línea)?',
    code:{ lang:'py', txt:
`for dia in range(5):
    print(dia)` },
    op:['0, 1, 2, 3, 4','1, 2, 3, 4, 5','0, 1, 2, 3, 4, 5','Solo el 5'],
    ex:'range(5) empieza en 0 y termina ANTES del 5: cinco vueltas, del 0 al 4.' },

  { id:'C3F2', era:'futuro', sub:'range',
    q:'Para mostrar desde «Día 1» hasta «Día 5», ¿qué va en el range?',
    code:{ lang:'py', txt:
`for dia in range(______):
    print("Día", dia)` },
    op:['range(1, 6)','range(1, 5)','range(5)','range(0, 5)'],
    ex:'range(inicio, fin) incluye el inicio y NO incluye el fin. Para llegar hasta 5, el fin tiene que ser 6.' },

  { id:'C3F3', era:'futuro', sub:'Contadores y acumuladores',
    q:'Según el análisis, las ventas se tienen que acumular. ¿Qué muestra este código y cuál es el error?',
    code:{ lang:'py', txt:
`total = 0
for dia in range(1, 6):
    vendidas = dia * 2
    total = vendidas
print(total)` },
    op:['Muestra 10; debería ser total = total + vendidas (daría 30)','Muestra 30; está bien','Muestra 0; falta inicializar total','Da error de sintaxis'],
    ex:'total = vendidas reemplaza el valor en cada vuelta y solo queda el último (10). El análisis decía acumular.' },

  { id:'C3F4', era:'futuro', sub:'Indentación',
    q:'Se ingresan 4, 0, 6, 2 y 3. ¿Qué muestra?',
    code:{ lang:'py', txt:
`total = 0
for dia in range(1, 6):
    vendidas = int(input("Vendidas: "))
total = total + vendidas
print(total)` },
    op:['3, porque la suma quedó fuera del for','15','0','Da IndentationError'],
    ex:'La sangría decide qué está dentro del for. La suma se ejecuta una sola vez, al final, con la última venta: no coincide con la prueba de escritorio (15).' },

  { id:'C3F5', era:'futuro', sub:'Salida con print',
    q:'¿Qué se muestra (una línea por vuelta)?',
    code:{ lang:'py', txt:
`total = 0
for i in range(1, 4):
    total = total + i
    print(i, total)` },
    op:['1 1 · 2 3 · 3 6','1 1 · 2 2 · 3 3','1 3 · 2 3 · 3 6','Solo 6'],
    ex:'El print está dentro del for: muestra el valor de i y el total acumulado en cada vuelta. Es una prueba de escritorio hecha por Python.' }
  ]
},

/* ════════════════════ CASO 4 · WHILE ════════════════════ */
{ id: 4, titulo: 'El ahorro para la promo', tema: 'Ciclo while',
  enunciado: 'Para el viaje de promoción, cada alumno ahorra. Cada semana se ingresa cuánto ahorró, hasta llegar a la meta de 100.000 Gs. Al final, el programa muestra cuántas semanas tardó.',
  preguntas: [

  { id:'C4P1', era:'pasado', sub:'Elegir la repetición',
    q:'No se sabe cuántas semanas van a ser. ¿Qué estructura conviene?',
    op:['Mientras: repite mientras se cumpla una condición','Para de 1 a 10','Si / SiNo','Ninguna'],
    ex:'Mientras (while) se usa cuando la cantidad de vueltas depende de lo que va pasando, no de un número fijo.' },

  { id:'C4P2', era:'pasado', sub:'Condiciones',
    q:'¿Cuál es la condición correcta del Mientras?',
    op:['Mientras ahorrado < 100000','Mientras ahorrado = 100000','Mientras ahorrado > 100000','Mientras semanas < 100000'],
    ex:'Se sigue pidiendo MIENTRAS todavía no se llegó a la meta. Cuando ahorrado llega a 100000 o más, la condición es falsa y el ciclo termina.' },

  { id:'C4P3', era:'pasado', sub:'Contadores y acumuladores',
    q:'En este algoritmo, ¿qué papel cumplen semanas y ahorrado?',
    op:['semanas es un contador (suma 1) y ahorrado es un acumulador (suma lo ingresado)','Los dos son contadores','Los dos son constantes','semanas es un acumulador y ahorrado es un contador'],
    ex:'El contador cuenta vueltas; el acumulador suma cantidades que cambian.' },

  { id:'C4P4', era:'pasado', sub:'Bucle sin fin',
    q:'¿Por qué este algoritmo nunca termina?',
    code:{ lang:'pseudo', txt:
`ahorrado <- 0
semanas <- 0
Mientras ahorrado < 100000 Hacer
    Leer monto
    semanas <- semanas + 1
FinMientras
Escribir semanas` },
    op:['ahorrado nunca cambia: falta ahorrado <- ahorrado + monto','Falta inicializar semanas','La condición debería usar >','Falta un Escribir dentro del ciclo'],
    ex:'Dentro de un Mientras, algo tiene que acercar la condición a ser falsa. Si ahorrado no cambia, siempre es menor que 100000.' },

  { id:'C4P5', era:'pasado', sub:'Prueba de escritorio',
    q:'Prueba de escritorio con ahorros semanales de 30000, 40000 y 50000. ¿Cuántas semanas tarda?',
    op:['3','2','1','4'],
    ex:'Semana 1: 30000. Semana 2: 70000 (todavía < 100000). Semana 3: 120000: llegó a la meta. Son 3 semanas.' },

  { id:'C4F1', era:'futuro', sub:'Salida con print',
    q:'¿Qué muestra?',
    code:{ lang:'py', txt:
`ahorrado = 0
semanas = 0
while ahorrado < 100000:
    ahorrado = ahorrado + 40000
    semanas = semanas + 1
print(semanas, ahorrado)` },
    op:['3 120000','2 80000','3 100000','4 160000'],
    ex:'40000 → 80000 (sigue) → 120000 (ya no es < 100000). Tres vueltas, y el ahorro se pasa de la meta.' },

  { id:'C4F2', era:'futuro', sub:'Bucle sin fin',
    q:'¿Qué pasa al ejecutar este código?',
    code:{ lang:'py', txt:
`x = 10
while x > 0:
    print(x)` },
    op:['Muestra 10 sin parar: x nunca cambia (bucle infinito)','Muestra 10, 9, 8 … hasta 1','Muestra 10 una sola vez','Da error'],
    ex:'Falta x = x - 1 dentro del while. Es el mismo error del pasado, ahora en Python.' },

  { id:'C4F3', era:'futuro', sub:'Validación de datos',
    q:'El usuario escribe 7, después 0 y después 4. ¿Cuántas veces se le pide la nota en total?',
    code:{ lang:'py', txt:
`nota = int(input("Nota (1 a 5): "))
while nota < 1 or nota > 5:
    nota = int(input("Inválida. Nota (1 a 5): "))
print("Nota guardada:", nota)` },
    op:['3','1','2','4'],
    ex:'Una vez antes del while (7), y dos dentro: 0 (sigue siendo inválida) y 4 (válida, termina).' },

  { id:'C4F4', era:'futuro', sub:'Validación de datos',
    q:'En ese mismo código, ¿por qué se usa or y no and?',
    op:['Porque una nota es inválida si es menor a 1 O mayor a 5, y no puede ser las dos cosas a la vez','Porque and no existe en Python','Porque or es más rápido','Da igual: funcionan igual'],
    ex:'Con and, la condición nunca sería verdadera y el programa aceptaría cualquier número.' },

  { id:'C4F5', era:'futuro', sub:'Del análisis al código',
    q:'Con las entradas de la prueba de escritorio (30000, 40000, 50000), ¿la salida coincide con el análisis?',
    code:{ lang:'py', txt:
`ahorrado = 0
semanas = 0
while ahorrado < 100000:
    monto = int(input("Monto: "))
    ahorrado = ahorrado + monto
    semanas = semanas + 1
print("Semanas:", semanas)` },
    op:['Sí: muestra Semanas: 3','No: muestra Semanas: 2','No: muestra Semanas: 4','No: el ciclo nunca termina'],
    ex:'El código hace exactamente lo que se analizó: acumula, cuenta y se detiene al llegar a la meta.' }
  ]
},

/* ════════════════════ CASO 5 · LISTAS ════════════════════ */
{ id: 5, titulo: 'Las notas del grupo', tema: 'Listas (arreglos)',
  enunciado: 'Las notas finales de un grupo (escala de 1 a 5) están en una lista. Se quiere saber el promedio, la nota más alta y cuántos aprobaron (nota 2 o más).',
  preguntas: [

  { id:'C5P1', era:'pasado', sub:'Arreglos',
    q:'¿Por qué conviene guardar las notas en un arreglo y no en variables sueltas (nota1, nota2…)?',
    op:['Porque se pueden recorrer con un ciclo, sin importar cuántas sean','Porque ocupan menos espacio en pantalla','Porque así no hace falta ningún ciclo','Porque las variables sueltas no aceptan números'],
    ex:'Con un arreglo, el mismo ciclo sirve para 5 notas o para 40. Con variables sueltas habría que escribir una línea por alumno.' },

  { id:'C5P2', era:'pasado', sub:'Prueba de escritorio',
    q:'Las notas son 3, 5, 1, 4 y 2. ¿Cuánto vale cont al terminar?',
    code:{ lang:'pseudo', txt:
`cont <- 0
Para i <- 1 Hasta 5 Hacer
    Si notas[i] >= 2 Entonces
        cont <- cont + 1
    FinSi
FinPara` },
    op:['4','3','5','2'],
    ex:'Cumplen la condición 3, 5, 4 y 2. Solo el 1 queda afuera. cont es un contador de aprobados.' },

  { id:'C5P3', era:'pasado', sub:'Máximo',
    q:'Para buscar la nota más alta, ¿con qué valor conviene empezar la variable mayor?',
    op:['Con el primer elemento del arreglo','Con 100','Con el último índice','Con la cantidad de elementos'],
    ex:'Si empieza con un valor que no está en los datos (como 100), puede quedar como «más alta» aunque nadie la haya sacado.' },

  { id:'C5P4', era:'pasado', sub:'Datos de entrada y salida',
    q:'¿Cuáles son las SALIDAS de este problema?',
    op:['El promedio, la nota más alta y la cantidad de aprobados','La lista de notas','Solo el promedio','Las notas ordenadas de menor a mayor'],
    ex:'La lista es la entrada. Las salidas son los tres resultados que pide el enunciado.' },

  { id:'C5P5', era:'pasado', sub:'Contadores y acumuladores',
    q:'Para calcular el promedio del arreglo, ¿qué hace falta?',
    op:['Un acumulador que sume todas las notas y dividir por la cantidad de elementos','Tomar el elemento del medio','Usar el contador de aprobados','Dividir la nota más alta por 2'],
    ex:'Promedio = suma de todos los valores ÷ cantidad de valores.' },

  { id:'C5F1', era:'futuro', sub:'Índices',
    q:'¿Qué muestra?',
    code:{ lang:'py', txt:
`notas = [3, 5, 1, 4, 2]
print(notas[1])` },
    op:['5','3','1','Da error'],
    ex:'En Python los índices empiezan en 0: notas[0] es 3 y notas[1] es 5.' },

  { id:'C5F2', era:'futuro', sub:'Índices',
    q:'¿Qué pasa al ejecutar?',
    code:{ lang:'py', txt:
`notas = [3, 5, 1, 4, 2]
print(notas[5])` },
    op:['IndexError: el último índice es 4','Muestra 2','Muestra 5','Muestra None'],
    ex:'Una lista de 5 elementos tiene índices del 0 al 4. Pedir la posición 5 es salirse de la lista.' },

  { id:'C5F3', era:'futuro', sub:'Del análisis al código',
    q:'¿Qué muestra? ¿Coincide con la prueba de escritorio del pasado?',
    code:{ lang:'py', txt:
`notas = [3, 5, 1, 4, 2]
aprobados = 0
for n in notas:
    if n >= 2:
        aprobados = aprobados + 1
print(aprobados)` },
    op:['4, coincide con el análisis','3, no coincide','5, porque cuenta todas','1, porque cuenta los reprobados'],
    ex:'for n in notas recorre cada nota sin usar índices. El resultado es el mismo que dio el contador del pseudocódigo.' },

  { id:'C5F4', era:'futuro', sub:'Funciones de listas',
    q:'¿Qué muestra?',
    code:{ lang:'py', txt:
`notas = [3, 5, 1, 4, 2]
print(sum(notas) / len(notas))` },
    op:['3.0','15','5','3'],
    ex:'sum suma todos los elementos (15) y len cuenta cuántos hay (5). 15 / 5 = 3.0.' },

  { id:'C5F5', era:'futuro', sub:'Máximo',
    q:'Este código debía mostrar la nota más alta. ¿Qué muestra y qué está mal?',
    code:{ lang:'py', txt:
`notas = [3, 5, 1, 4, 2]
mayor = notas[0]
for n in notas:
    if n < mayor:
        mayor = n
print(mayor)` },
    op:['Muestra 1: la comparación debería ser n > mayor','Muestra 5: está bien','Muestra 3: no recorre la lista','Da error: falta len'],
    ex:'Con < se queda con el menor. Para el máximo, mayor se reemplaza cuando aparece un número MÁS GRANDE.' }
  ]
}

];
