/* ═══════════════════════════════════════════════════════════════
   BATIN · Arcade de 2° · BANCO DE DESAFÍOS
   Lo usan la Flota de Bit y la Copa Techi.  —  este archivo se edita
   ═══════════════════════════════════════════════════════════════

   tema: 'pseudo' (pseudocódigo y prueba de escritorio) · 'vectores'
         'matrices' · 'python'
   nv:   3 aplicar · 4 analizar · 5 evaluar · 6 crear

   TIPOS
   opcion     → op: [...]  ⚠ la PRIMERA opción es la correcta (se mezclan solas)
   valor      → acepta: ['16', ...]  (no importan mayúsculas, espacios ni comas)
   linea      → code + correcta: número de línea (se hace clic en la línea)
   ordenar    → lineas: [...] en el orden CORRECTO (el juego las desordena)
   clasificar → categorias: [...], items: [{ t, c }]
   traza      → prueba de escritorio: cols: [...], filas: [[...], ...]
                Lo que va entre llaves {  } es lo que el estudiante completa.
   celdas     → una grilla para marcar: f, c (tamaño), valores (opcional),
                marcar: [[fila, col], ...] con índices desde 1

   PSeInt: los arreglos empiezan en 1 y la matriz se escribe m[f,c]
   (como en los ejercicios de clase). Python: las listas empiezan en 0.
   ═══════════════════════════════════════════════════════════════ */

window.AR_BANCO = [

/* ══════════ PSEUDOCÓDIGO Y PRUEBA DE ESCRITORIO ══════════ */
{ id: 'P-01', tema: 'pseudo', nv: 3, tipo: 'valor', sub: 'Asignación',
  q: '¿Qué escribe este algoritmo?',
  code: { lang: 'pseudo', txt: `Algoritmo intercambio
    Definir a, b Como Entero;
    a <- 7;
    b <- 3;
    a <- a + b;
    b <- a - b;
    a <- a - b;
    Escribir a, " ", b;
FinAlgoritmo` },
  acepta: ['3 7'],
  pista: 'Haz la prueba de escritorio línea por línea: cada asignación pisa el valor anterior.',
  ex: 'a = 10, después b = 10 − 3 = 7 y a = 10 − 7 = 3. Escribe «3 7»: los valores quedaron intercambiados sin usar una variable auxiliar.' },

{ id: 'P-02', tema: 'pseudo', nv: 3, tipo: 'traza', sub: 'Mientras',
  q: 'Completa la prueba de escritorio: ¿cuánto vale x al terminar cada vuelta?',
  code: { lang: 'pseudo', txt: `x <- 1;
Mientras x < 20 Hacer
    x <- x * 3;
FinMientras
Escribir x;` },
  cols: ['Vuelta', '¿x < 20 al empezar?', 'x al terminar la vuelta'],
  filas: [['1', 'Sí (1)', '{3}'], ['2', 'Sí (3)', '{9}'], ['3', 'Sí (9)', '{27}']],
  pista: 'En cada vuelta x se multiplica por 3. Después de la vuelta 3, ¿se sigue cumpliendo x < 20?',
  ex: '1 → 3 → 9 → 27. Con 27 la condición es falsa, el ciclo termina y se escribe 27.' },

{ id: 'P-03', tema: 'pseudo', nv: 3, tipo: 'valor', sub: 'Para',
  q: '¿Qué escribe? (separa los números con espacios)',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 10 Con Paso 3 Hacer
    Escribir Sin Saltar i, " ";
FinPara` },
  acepta: ['1 4 7 10'],
  pista: 'Empieza en 1 y suma 3 en cada vuelta, mientras no pase de 10.',
  ex: 'i toma 1, 4, 7 y 10. El 13 ya pasa el límite.' },

{ id: 'P-04', tema: 'pseudo', nv: 4, tipo: 'valor', sub: 'Ciclos anidados',
  q: '¿Qué valor escribe?',
  code: { lang: 'pseudo', txt: `c <- 0;
Para i <- 1 Hasta 4 Con Paso 1 Hacer
    Para j <- i Hasta 4 Con Paso 1 Hacer
        c <- c + 1;
    FinPara
FinPara
Escribir c;` },
  acepta: ['10', 'diez'],
  pista: 'Cuenta las vueltas del ciclo de adentro para cada i: con i = 1, j va de 1 a 4…',
  ex: 'Con i = 1 hay 4 vueltas, con i = 2 hay 3, con i = 3 hay 2 y con i = 4 hay 1: 4 + 3 + 2 + 1 = 10.' },

{ id: 'P-05', tema: 'pseudo', nv: 4, tipo: 'linea', sub: 'Acumulador',
  q: 'Debería escribir la suma de 1 hasta n, pero con n = 4 escribe 4 en vez de 10. ¿En qué línea está el error?',
  code: { lang: 'pseudo', txt: `Algoritmo suma
    Definir n, i, s Como Entero;
    Leer n;
    Para i <- 1 Hasta n Con Paso 1 Hacer
        s <- 0;
        s <- s + i;
    FinPara
    Escribir s;
FinAlgoritmo` },
  correcta: 5,
  pista: '¿Cuántas veces se ejecuta s <- 0?',
  ex: 's <- 0 está adentro del ciclo: en cada vuelta el acumulador vuelve a 0. Se inicializa una sola vez, antes del Para.' },

{ id: 'P-06', tema: 'pseudo', nv: 4, tipo: 'opcion', sub: 'Condiciones',
  q: 'Este algoritmo nunca escribe «Excelente», ni siquiera con nota 95. ¿Por qué?',
  code: { lang: 'pseudo', txt: `Si nota >= 60 Entonces
    Escribir "Aprobado";
SiNo
    Si nota >= 90 Entonces
        Escribir "Excelente";
    FinSi
FinSi` },
  op: ['Con 95 ya se cumple la primera condición (≥ 60). La de 90 solo se evalúa cuando la nota es menor que 60, y ahí nunca se cumple.',
       'Porque falta un SiNo después de «Excelente».',
       'Porque 95 no es mayor o igual que 90.',
       'Porque Escribir no funciona dentro de un SiNo.'],
  pista: 'Sigue el camino con nota = 95: ¿entra por el Entonces o por el SiNo?',
  ex: 'Las condiciones se revisan de la más exigente a la menos exigente: primero ≥ 90 y después ≥ 60.' },

{ id: 'P-07', tema: 'pseudo', nv: 5, tipo: 'opcion', sub: 'Elegir el ciclo',
  q: 'Hay que leer números y sumarlos hasta que el usuario ingrese 0. ¿Qué estructura conviene?',
  op: ['Mientras: no se sabe cuántos números van a venir; el 0 funciona como centinela que corta el ciclo.',
       'Para i <- 1 Hasta 10, porque nadie ingresa más de 10 números.',
       'Un Si, porque hay que preguntar si el número es 0.',
       'Segun, con un caso para cada número.'],
  pista: '¿Sabes de antemano cuántas vueltas tiene que dar el ciclo?',
  ex: 'El Para sirve cuando se conoce la cantidad de repeticiones. Con un centinela, la cantidad depende de los datos: Mientras (o Repetir).' },

{ id: 'P-08', tema: 'pseudo', nv: 5, tipo: 'opcion', sub: 'Evaluar algoritmos',
  q: 'Para hallar el mayor de 5 números (que pueden ser negativos), Ana inicia mayor <- 0 y Leo inicia mayor con el primer número leído. ¿Quién tiene razón?',
  op: ['Leo: si todos los números son negativos, Ana mostraría 0, que ni siquiera está entre los datos.',
       'Ana: empezar en 0 siempre funciona.',
       'Los dos dan siempre el mismo resultado.',
       'Ninguno: hay que iniciar mayor <- 100.'],
  pista: 'Prueba con los datos −5, −2, −8, −1, −3.',
  ex: 'El valor inicial del «mayor» debe ser un dato real: el primero de la lista. Así cualquier dato puede ganarle.' },

{ id: 'P-09', tema: 'pseudo', nv: 6, tipo: 'ordenar', sub: 'Construir el algoritmo',
  q: 'Arma el algoritmo que lee 5 números y escribe cuántos son pares.',
  lineas: ['Algoritmo pares', '    Definir i, n, c Como Entero;', '    c <- 0;', '    Para i <- 1 Hasta 5 Con Paso 1 Hacer', '        Leer n;', '        Si n MOD 2 = 0 Entonces', '            c <- c + 1;', '        FinSi', '    FinPara', '    Escribir "Pares: ", c;', 'FinAlgoritmo'],
  pista: 'Contador: se inicia antes del ciclo, se incrementa adentro del Si y se muestra después del ciclo.',
  ex: 'Patrón contador: inicializar → recorrer → preguntar → contar → mostrar al final.' },

{ id: 'P-10', tema: 'pseudo', nv: 4, tipo: 'traza', sub: 'Prueba de escritorio',
  q: 'Prueba de escritorio con los datos 8, 3 y 5. Completa la tabla.',
  code: { lang: 'pseudo', txt: `may <- 0;
Para i <- 1 Hasta 3 Con Paso 1 Hacer
    Leer n;
    Si n > may Entonces
        may <- n;
    FinSi
FinPara
Escribir may;` },
  cols: ['i', 'n', '¿n > may?', 'may'],
  filas: [['1', '8', '{Sí}', '{8}'], ['2', '3', '{No}', '{8}'], ['3', '5', '{No}', '{8}']],
  pista: 'may solo cambia cuando n es mayor que el may que hay en ese momento.',
  ex: 'El 8 queda como mayor desde la primera vuelta; el 3 y el 5 no lo superan. Escribe 8.' },

/* ══════════ VECTORES (PSeInt: índices desde 1) ══════════ */
{ id: 'V-01', tema: 'vectores', nv: 3, tipo: 'valor', sub: 'Acceso por índice',
  q: '¿Qué escribe?',
  code: { lang: 'pseudo', txt: `Dimension v[5];
v[1] <- 4;
v[2] <- 9;
v[3] <- 2;
v[4] <- 7;
v[5] <- 5;
Escribir v[2] + v[4];` },
  acepta: ['16'],
  pista: 'v[2] es el segundo elemento, no el tercero.',
  ex: 'v[2] = 9 y v[4] = 7: 9 + 7 = 16.' },

{ id: 'V-02', tema: 'vectores', nv: 3, tipo: 'traza', sub: 'Recorrer y acumular',
  q: 'v = [3, 8, 1, 6]. Completa la prueba de escritorio.',
  code: { lang: 'pseudo', txt: `s <- 0;
Para i <- 1 Hasta 4 Con Paso 1 Hacer
    s <- s + v[i];
FinPara
Escribir s;` },
  cols: ['i', 'v[i]', 's'],
  filas: [['1', '3', '{3}'], ['2', '8', '{11}'], ['3', '{1}', '{12}'], ['4', '{6}', '{18}']],
  pista: 'En cada vuelta, s suma el elemento de la posición i.',
  ex: '3 → 11 → 12 → 18. Escribe 18.' },

{ id: 'V-03', tema: 'vectores', nv: 3, tipo: 'valor', sub: 'Contar',
  q: 'v = [4, 9, 2, 7, 5, 8]. ¿Qué escribe?',
  code: { lang: 'pseudo', txt: `c <- 0;
Para i <- 1 Hasta 6 Con Paso 1 Hacer
    Si v[i] > 5 Entonces
        c <- c + 1;
    FinSi
FinPara
Escribir c;` },
  acepta: ['3', 'tres'],
  pista: 'Cuenta los elementos mayores que 5 (el 5 no cuenta).',
  ex: 'Son 9, 7 y 8: escribe 3.' },

{ id: 'V-04', tema: 'vectores', nv: 4, tipo: 'valor', sub: 'Invertir',
  q: 'v = [1, 2, 3, 4, 5]. ¿Cómo queda v? (separa con comas)',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 2 Con Paso 1 Hacer
    aux <- v[i];
    v[i] <- v[6 - i];
    v[6 - i] <- aux;
FinPara` },
  acepta: ['5, 4, 3, 2, 1'],
  pista: 'Con i = 1 se intercambian v[1] y v[5]; con i = 2, v[2] y v[4].',
  ex: 'Se intercambian los extremos hacia el centro; el del medio (v[3]) queda en su lugar: 5, 4, 3, 2, 1.' },

{ id: 'V-05', tema: 'vectores', nv: 4, tipo: 'linea', sub: 'Posición del mayor',
  q: 'Debería escribir la POSICIÓN del mayor, pero escribe números raros. ¿En qué línea está el error?',
  code: { lang: 'pseudo', txt: `Dimension v[6];
// v ya tiene 6 números cargados
pos <- 1;
Para i <- 2 Hasta 6 Con Paso 1 Hacer
    Si v[i] > v[pos] Entonces
        pos <- v[i];
    FinSi
FinPara
Escribir "El mayor está en la posición ", pos;` },
  correcta: 6,
  pista: '¿Qué se guarda en pos: el valor o el índice?',
  ex: 'pos tiene que guardar el índice: pos <- i. Al guardar v[i], la comparación v[pos] de la vuelta siguiente usa una posición equivocada.' },

{ id: 'V-06', tema: 'vectores', nv: 3, tipo: 'linea', sub: 'Rango de índices',
  q: 'Este algoritmo da error al ejecutarse en PSeInt. ¿En qué línea está?',
  code: { lang: 'pseudo', txt: `Dimension v[5];
Para i <- 0 Hasta 5 Con Paso 1 Hacer
    Leer v[i];
FinPara` },
  correcta: 2,
  pista: 'En PSeInt, ¿cuál es el primer índice de un vector?',
  ex: 'En PSeInt los índices de v[5] van de 1 a 5: v[0] no existe. El Para debe empezar en 1.' },

{ id: 'V-07', tema: 'vectores', nv: 5, tipo: 'opcion', sub: 'Desplazar elementos',
  q: 'Para insertar un dato en la posición 1 de un vector que tiene lugar libre al final, hay que correr todos los elementos un lugar. ¿En qué sentido conviene recorrer?',
  op: ['Desde el final hacia el principio (Con Paso −1): así cada valor se copia antes de que lo pisen.',
       'Desde el principio hacia el final: es el orden normal de un Para.',
       'Da lo mismo el sentido.',
       'No hace falta recorrer: se escribe v[1] <- dato y listo.'],
  pista: 'Prueba con [7, 8, 9, _] y copia v[1] en v[2] primero: ¿qué le pasa al 8?',
  ex: 'Si se recorre hacia adelante, v[2] <- v[1] pisa el 8 antes de moverlo. De atrás hacia adelante no se pierde nada.' },

{ id: 'V-08', tema: 'vectores', nv: 5, tipo: 'opcion', sub: 'Búsqueda',
  q: 'Hay que saber si una cédula está en un vector de 1000 cédulas. A recorre las 1000 posiciones con un Para. B usa Mientras i <= 1000 Y no encontrado. ¿Qué evalúas?',
  op: ['B es mejor: se detiene apenas la encuentra; A sigue recorriendo aunque ya la haya encontrado.',
       'A es mejor: el Para siempre es más rápido que el Mientras.',
       'Son iguales: los dos hacen siempre 1000 comparaciones.',
       'Ninguno sirve: para buscar hay que ordenar primero.'],
  pista: '¿Qué pasa si la cédula está en la posición 3?',
  ex: 'La búsqueda con bandera corta el ciclo al encontrar el dato. En el peor caso las dos hacen 1000 comparaciones, pero B casi siempre hace menos.' },

{ id: 'V-09', tema: 'vectores', nv: 6, tipo: 'ordenar', sub: 'Construir el algoritmo',
  q: 'Arma el algoritmo que cuenta cuántos elementos de v (5 números ya cargados) superan el promedio.',
  lineas: ['s <- 0; c <- 0;', 'Para i <- 1 Hasta 5 Con Paso 1 Hacer', '    s <- s + v[i];', 'FinPara', 'prom <- s / 5;', 'Para i <- 1 Hasta 5 Con Paso 1 Hacer', '    Si v[i] > prom Entonces', '        c <- c + 1;', '    FinSi', 'FinPara', 'Escribir c;'],
  pista: 'Hacen falta DOS recorridos: uno para calcular el promedio y otro para comparar con él.',
  ex: 'No se puede comparar con el promedio hasta haberlo calculado: primero se acumula, después se divide y recién ahí se cuenta.' },

{ id: 'V-10', tema: 'vectores', nv: 4, tipo: 'valor', sub: 'Desplazar elementos',
  q: 'v = [4, 6, 8, 10]. ¿Cómo queda v? (separa con comas)',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 3 Con Paso 1 Hacer
    v[i] <- v[i + 1];
FinPara` },
  acepta: ['6, 8, 10, 10'],
  pista: 'Cada posición recibe el valor de la siguiente. La última no se toca.',
  ex: 'Todo se corre un lugar a la izquierda (se «borra» el primero) y la última posición queda repetida: 6, 8, 10, 10.' },

/* ══════════ MATRICES (PSeInt: m[fila, columna], desde 1) ══════════ */
{ id: 'M-01', tema: 'matrices', nv: 3, tipo: 'celdas', sub: 'Diagonal',
  q: 'Marca las celdas de la matriz m[4,4] que quedan en 1.',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 4 Con Paso 1 Hacer
    m[i, i] <- 1;
FinPara` },
  f: 4, c: 4, marcar: [[1, 1], [2, 2], [3, 3], [4, 4]],
  pista: 'Fila y columna tienen el mismo número.',
  ex: 'm[i, i] recorre la diagonal principal: [1,1], [2,2], [3,3] y [4,4].' },

{ id: 'M-02', tema: 'matrices', nv: 4, tipo: 'celdas', sub: 'Antidiagonal',
  q: 'Marca las celdas de m[4,4] que quedan en 1.',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 4 Con Paso 1 Hacer
    m[i, 5 - i] <- 1;
FinPara` },
  f: 4, c: 4, marcar: [[1, 4], [2, 3], [3, 2], [4, 1]],
  pista: 'Calcula la columna para cada fila: con i = 1, la columna es 5 − 1 = 4.',
  ex: 'Es la diagonal secundaria: [1,4], [2,3], [3,2] y [4,1].' },

{ id: 'M-03', tema: 'matrices', nv: 3, tipo: 'valor', sub: 'Acceso m[f,c]',
  q: 'Con esta matriz m, ¿qué escribe Escribir m[2,3] + m[3,1]?',
  tabla: { cols: ['', 'col 1', 'col 2', 'col 3'], filas: [['fila 1', 2, 5, 1], ['fila 2', 7, 3, 8], ['fila 3', 4, 6, 9]] },
  acepta: ['12'],
  pista: 'Primero la fila y después la columna.',
  ex: 'm[2,3] = 8 (fila 2, columna 3) y m[3,1] = 4: 8 + 4 = 12.' },

{ id: 'M-04', tema: 'matrices', nv: 4, tipo: 'valor', sub: 'Recorrer una fila',
  q: 'Con la misma matriz (2 5 1 / 7 3 8 / 4 6 9), ¿qué escribe?',
  code: { lang: 'pseudo', txt: `s <- 0;
Para j <- 1 Hasta 3 Con Paso 1 Hacer
    s <- s + m[2, j];
FinPara
Escribir s;` },
  tabla: { cols: ['', 'col 1', 'col 2', 'col 3'], filas: [['fila 1', 2, 5, 1], ['fila 2', 7, 3, 8], ['fila 3', 4, 6, 9]] },
  acepta: ['18'],
  pista: 'La fila queda fija en 2; lo que cambia es la columna j.',
  ex: 'Suma la fila 2: 7 + 3 + 8 = 18.' },

{ id: 'M-05', tema: 'matrices', nv: 4, tipo: 'celdas', sub: 'Condiciones con índices',
  q: 'Marca las celdas de m[4,4] que quedan en 1.',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 4 Con Paso 1 Hacer
    Para j <- 1 Hasta 4 Con Paso 1 Hacer
        Si i = 1 O i = 4 O j = 1 O j = 4 Entonces
            m[i, j] <- 1;
        FinSi
    FinPara
FinPara` },
  f: 4, c: 4, marcar: [[1, 1], [1, 2], [1, 3], [1, 4], [2, 1], [2, 4], [3, 1], [3, 4], [4, 1], [4, 2], [4, 3], [4, 4]],
  pista: 'Primera fila, última fila, primera columna o última columna.',
  ex: 'Es el borde de la matriz: 12 celdas. Las 4 del centro quedan sin tocar.' },

{ id: 'M-06', tema: 'matrices', nv: 4, tipo: 'celdas', sub: 'Triangular',
  q: 'Marca las celdas de m[4,4] que quedan en 1.',
  code: { lang: 'pseudo', txt: `Para i <- 1 Hasta 4 Con Paso 1 Hacer
    Para j <- 1 Hasta 4 Con Paso 1 Hacer
        Si j > i Entonces
            m[i, j] <- 1;
        FinSi
    FinPara
FinPara` },
  f: 4, c: 4, marcar: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]],
  pista: 'La columna tiene que ser mayor que la fila: ¿qué pasa en la diagonal?',
  ex: 'Son las celdas por encima de la diagonal principal (triangular superior), sin la diagonal: 6 celdas.' },

{ id: 'M-07', tema: 'matrices', nv: 4, tipo: 'linea', sub: 'Recorrer una columna',
  q: 'Debería sumar la COLUMNA 2 de una matriz de 3×3. ¿En qué línea está el error?',
  code: { lang: 'pseudo', txt: `s <- 0;
Para i <- 1 Hasta 3 Con Paso 1 Hacer
    s <- s + m[2, i];
FinPara
Escribir "Suma de la columna 2: ", s;` },
  correcta: 3,
  pista: 'En m[f, c], ¿cuál es el número que queda fijo para recorrer una columna?',
  ex: 'm[2, i] recorre la FILA 2. Para la columna 2 la fila es la que cambia: m[i, 2].' },

{ id: 'M-08', tema: 'matrices', nv: 4, tipo: 'opcion', sub: 'Recorrido por filas',
  q: 'Una matriz tiene 3 filas y 4 columnas. ¿Cómo se recorre fila por fila?',
  op: ['Para i <- 1 Hasta 3 afuera (filas) y Para j <- 1 Hasta 4 adentro (columnas), usando m[i, j].',
       'Para i <- 1 Hasta 4 afuera y Para j <- 1 Hasta 3 adentro, usando m[i, j].',
       'Un solo Para i <- 1 Hasta 12, usando m[i, i].',
       'Para i <- 1 Hasta 3 afuera y Para j <- 1 Hasta 4 adentro, usando m[j, i].'],
  pista: 'El ciclo de afuera cambia más lento: es el que «elige la fila».',
  ex: 'El ciclo externo recorre las filas y, para cada fila, el interno recorre todas sus columnas. El primer índice siempre es la fila.' },

{ id: 'M-09', tema: 'matrices', nv: 5, tipo: 'opcion', sub: 'Transpuesta',
  q: 'Para transponer una matriz cuadrada sin usar otra, Leo recorre TODAS las celdas e intercambia m[i, j] con m[j, i]. ¿Qué pasa?',
  op: ['Cada par se intercambia dos veces y la matriz queda igual. Hay que recorrer solo las celdas con j > i.',
       'Funciona perfecto: así se transpone.',
       'Da error porque m[j, i] no existe.',
       'Queda la matriz invertida de arriba hacia abajo.'],
  pista: 'Mira qué pasa con m[1,2]: se intercambia con m[2,1] y… ¿más tarde?',
  ex: 'Con i = 1, j = 2 se intercambian; con i = 2, j = 1 se vuelven a intercambiar. Recorriendo solo arriba de la diagonal, cada par se cambia una vez.' },

{ id: 'M-10', tema: 'matrices', nv: 6, tipo: 'ordenar', sub: 'Construir el algoritmo',
  q: 'Arma el algoritmo que escribe la suma de cada fila de una matriz m[3,4].',
  lineas: ['Para i <- 1 Hasta 3 Con Paso 1 Hacer', '    s <- 0;', '    Para j <- 1 Hasta 4 Con Paso 1 Hacer', '        s <- s + m[i, j];', '    FinPara', '    Escribir "Fila ", i, ": ", s;', 'FinPara'],
  pista: 'El acumulador tiene que volver a 0 al empezar cada fila, y el total se escribe al terminar esa fila.',
  ex: 's <- 0 va adentro del ciclo de filas y antes del de columnas; el Escribir va después de recorrer las columnas de esa fila.' },

{ id: 'M-11', tema: 'matrices', nv: 5, tipo: 'celdas', sub: 'Analizar un recorrido',
  q: 'Esta matriz guarda los asientos del aula (1 = ocupado). Marca las celdas que cuenta el algoritmo.',
  code: { lang: 'pseudo', txt: `c <- 0;
Para i <- 1 Hasta 3 Con Paso 1 Hacer
    Para j <- 1 Hasta 4 Con Paso 1 Hacer
        Si m[i, j] = 0 Y j MOD 2 = 0 Entonces
            c <- c + 1;
        FinSi
    FinPara
FinPara` },
  f: 3, c: 4, valores: [[1, 0, 0, 1], [0, 1, 1, 0], [0, 0, 1, 1]],
  marcar: [[1, 2], [2, 4], [3, 2]],
  pista: 'Las dos condiciones a la vez: el asiento está libre (0) Y la columna es par.',
  ex: 'Columnas pares: 2 y 4. Libres en esas columnas: [1,2], [2,4] y [3,2]. c termina en 3.' },

/* ══════════ PYTHON (listas: índices desde 0) ══════════ */
{ id: 'Y-01', tema: 'python', nv: 3, tipo: 'valor', sub: 'Índices de listas',
  q: '¿Qué muestra?',
  code: { lang: 'py', txt: `notas = [4, 2, 5, 3]
print(notas[1] + notas[-1])` },
  acepta: ['5'],
  pista: 'En Python el primer índice es 0, y −1 es el último.',
  ex: 'notas[1] = 2 (el segundo) y notas[-1] = 3 (el último): 5.' },

{ id: 'Y-02', tema: 'python', nv: 3, tipo: 'valor', sub: 'if / elif / else',
  q: '¿Qué muestra?',
  code: { lang: 'py', txt: `x = 10
if x % 3 == 0:
    print("A")
elif x > 5:
    print("B")
else:
    print("C")` },
  acepta: ['B'],
  pista: '10 % 3 es el resto de dividir 10 entre 3.',
  ex: '10 % 3 = 1, así que la primera condición es falsa; 10 > 5 es verdadera: muestra B (y ya no revisa el else).' },

{ id: 'Y-03', tema: 'python', nv: 3, tipo: 'valor', sub: 'for y range',
  q: '¿Qué muestra?',
  code: { lang: 'py', txt: `total = 0
for n in range(2, 9, 3):
    total += n
print(total)` },
  acepta: ['15'],
  pista: 'range(2, 9, 3) empieza en 2, salta de a 3 y NO incluye el 9.',
  ex: 'n toma 2, 5 y 8: 2 + 5 + 8 = 15.' },

{ id: 'Y-04', tema: 'python', nv: 3, tipo: 'traza', sub: 'while',
  q: 'Completa la prueba de escritorio.',
  code: { lang: 'py', txt: `n = 5
f = 1
while n > 1:
    f = f * n
    n = n - 1
print(f)` },
  cols: ['Vuelta', 'n al empezar', 'f al terminar', 'n al terminar'],
  filas: [['1', '5', '{5}', '{4}'], ['2', '4', '{20}', '{3}'], ['3', '3', '{60}', '{2}'], ['4', '2', '{120}', '{1}']],
  pista: 'Primero se multiplica f por n y después n baja en 1.',
  ex: 'Calcula 5! = 5 · 4 · 3 · 2 = 120. Con n = 1 el ciclo termina.' },

{ id: 'Y-05', tema: 'python', nv: 4, tipo: 'valor', sub: 'Métodos de listas',
  q: '¿Qué muestra?',
  code: { lang: 'py', txt: `lista = [3, 1, 4]
lista.append(1)
lista.insert(0, 5)
lista.remove(1)
print(lista)` },
  acepta: ['[5, 3, 4, 1]', '5, 3, 4, 1'],
  pista: 'remove() borra solo la PRIMERA aparición del valor.',
  ex: '[3, 1, 4] → [3, 1, 4, 1] → [5, 3, 1, 4, 1] → se borra el primer 1 → [5, 3, 4, 1].' },

{ id: 'Y-06', tema: 'python', nv: 4, tipo: 'linea', sub: 'Tipos de datos',
  q: 'El programa se cae en la línea 2 con TypeError, pero la causa está antes. ¿Qué línea hay que corregir?',
  code: { lang: 'py', txt: `edad = input("Edad: ")
if edad >= 18:
    print("Mayor de edad")` },
  correcta: 1,
  pista: '¿Qué tipo de dato devuelve input()?',
  ex: 'input() siempre devuelve texto (str), y no se puede comparar texto con 18. Se corrige con edad = int(input("Edad: ")).' },

{ id: 'Y-07', tema: 'python', nv: 4, tipo: 'opcion', sub: 'De PSeInt a Python',
  q: 'En PSeInt: Para i <- 1 Hasta 5 … Escribir v[i]. ¿Cuál es el equivalente en Python, si v es una lista de 5 elementos?',
  op: ['for i in range(5):  print(v[i])',
       'for i in range(1, 5):  print(v[i])',
       'for i in range(1, 6):  print(v[i])',
       'for i in range(5):  print(v[i + 1])'],
  pista: 'En Python los índices de una lista de 5 elementos van de 0 a 4.',
  ex: 'range(5) da 0, 1, 2, 3, 4: exactamente los índices válidos. range(1, 6) llega a v[5], que no existe (IndexError), y range(1, 5) se saltea el primero.' },

{ id: 'Y-08', tema: 'python', nv: 4, tipo: 'valor', sub: 'Matrices en Python',
  q: '¿Qué muestra?',
  code: { lang: 'py', txt: `m = [[1, 2, 3],
     [4, 5, 6]]
print(m[1][0] + m[0][2])` },
  acepta: ['7'],
  pista: 'm[1] es la SEGUNDA fila; m[1][0] es su primer elemento.',
  ex: 'm[1][0] = 4 y m[0][2] = 3: 7. En Python se escribe m[f][c] y se cuenta desde 0.' },

{ id: 'Y-09', tema: 'python', nv: 5, tipo: 'opcion', sub: 'Validar datos',
  q: 'Hay que repetir la pregunta mientras la nota NO esté entre 1 y 5. ¿Qué condición es correcta?',
  op: ['while nota < 1 or nota > 5:',
       'while nota < 1 and nota > 5:',
       'while nota >= 1 and nota <= 5:',
       'while nota != 1 or nota != 5:'],
  pista: 'Una nota inválida es la que está por debajo de 1 O por encima de 5.',
  ex: 'Con and la condición nunca es verdadera (ningún número es menor que 1 y mayor que 5 a la vez). La tercera repite justo con las notas válidas.' },

{ id: 'Y-10', tema: 'python', nv: 5, tipo: 'opcion', sub: 'Evaluar código',
  q: 'Con notas = [4, 5, 5] y suma = 14, Ana escribe promedio = suma / len(notas) y Leo, promedio = suma // len(notas). ¿Quién calcula bien el promedio?',
  op: ['Ana: / da 4.666…; // es división entera y da 4.',
       'Leo: // es la división «doble», más precisa.',
       'Los dos dan 4.67.',
       'Ninguno: len() cuenta letras, no elementos.'],
  pista: 'En Python, // descarta la parte decimal.',
  ex: '/ es la división real; // es la división entera (como DIV en otros lenguajes).' },

{ id: 'Y-11', tema: 'python', nv: 6, tipo: 'ordenar', sub: 'Construir el programa',
  q: 'Arma el programa: carga 3 notas en una lista y después muestra la mayor.',
  lineas: ['notas = []', 'for i in range(3):', '    nota = int(input("Nota: "))', '    notas.append(nota)', 'print("Mayor:", max(notas))'],
  pista: 'La lista vacía se crea antes del ciclo; append agrega adentro; el resultado se muestra al final.',
  ex: 'Patrón cargar → procesar: el print va fuera del for, si no mostraría el mayor después de cada carga.' },

{ id: 'Y-12', tema: 'python', nv: 4, tipo: 'traza', sub: 'Recorrer con índices',
  q: 'Completa la prueba de escritorio.',
  code: { lang: 'py', txt: `v = [2, 7, 4]
for i in range(len(v)):
    v[i] = v[i] * 2 + i
print(v)` },
  cols: ['i', 'v[i] antes', 'v[i] después'],
  filas: [['0', '2', '{4}'], ['1', '{7}', '{15}'], ['2', '4', '{10}']],
  pista: 'range(len(v)) da 0, 1 y 2. Ojo: se suma i, no 1.',
  ex: '2·2 + 0 = 4, 7·2 + 1 = 15, 4·2 + 2 = 10. Muestra [4, 15, 10].' },

{ id: 'Y-13', tema: 'python', nv: 5, tipo: 'linea', sub: 'Ciclo infinito',
  q: 'Este programa no termina nunca. ¿En qué línea está el problema?',
  code: { lang: 'py', txt: `i = 0
suma = 0
while i < 5:
    suma = suma + i
i = i + 1
print(suma)` },
  correcta: 5,
  pista: 'En Python, la sangría decide qué está adentro del while.',
  ex: 'i = i + 1 no tiene sangría: queda fuera del while, i nunca cambia y el ciclo es infinito. Hay que indentarla.' },

{ id: 'Y-14', tema: 'python', nv: 3, tipo: 'clasificar', sub: 'Tipos de datos',
  q: 'Clasifica cada valor según su tipo en Python.',
  categorias: ['int', 'float', 'str', 'bool'],
  items: [{ t: '42', c: 'int' }, { t: '3.5', c: 'float' }, { t: '"42"', c: 'str' }, { t: 'True', c: 'bool' }, { t: 'input("Edad: ")', c: 'str' }, { t: '7 / 2', c: 'float' }, { t: '7 // 2', c: 'int' }],
  pista: 'Las comillas hacen texto. La barra / siempre da decimal.',
  ex: 'input() devuelve siempre str; 7 / 2 = 3.5 (float) y 7 // 2 = 3 (int).' }
];
