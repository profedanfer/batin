/* ═══════════════════════════════════════════════════════════════
   BATIN · Arcade de 2° · LOS CASOS DE GATIEL (detective de código)
   Cada caso: una historia, el código sospechoso y 4 pasos que
   suben de nivel (interrogar → encontrar al culpable → corregir →
   comprobar). Los tipos de paso son los mismos del banco.js.
   ═══════════════════════════════════════════════════════════════ */

window.AR_CASOS = [

/* ══════════ CASO 1 ══════════ */
{ id: 'boletin', n: 1, titulo: 'El boletín que mintió', tema: 'pseudo', ico: '📄',
  denuncia: 'Juan sacó 1, 1 y 3 en las tres etapas. Su promedio real es 1,67… pero el sistema imprimió «Aprobado con 3». Juan está feliz; la directora, no.',
  testigo: { quien: 'techi', dice: 'Yo revisé los datos de entrada y están bien cargados. El problema tiene que estar en el cálculo.' },
  code: { lang: 'pseudo', txt: `Algoritmo boletin
    Definir n1, n2, n3, prom Como Real;
    Leer n1, n2, n3;
    prom <- n1 + n2 + n3 / 3;
    Si prom >= 2 Entonces
        Escribir "Aprobado con ", prom;
    SiNo
        Escribir "Reprobado con ", prom;
    FinSi
FinAlgoritmo` },
  pasos: [
  { id: 'D1-1', nv: 3, tipo: 'traza', sub: 'Interrogar: prueba de escritorio', etapa: 'Interrogar',
    q: 'Interroga a las variables con los datos de Juan (1, 1 y 3). Completa la prueba de escritorio de la línea 4.',
    cols: ['n1', 'n2', 'n3', 'n3 / 3', 'prom'],
    filas: [['1', '1', '3', '{1}', '{3}']],
    pista: 'La división se hace ANTES que las sumas.',
    ex: 'Primero n3 / 3 = 1 y después 1 + 1 + 1 = 3. ¡Por eso Juan «aprobó» con 3!' },
  { id: 'D1-2', nv: 4, tipo: 'linea', sub: 'Encontrar la línea culpable', etapa: 'Acusar',
    q: '¿Qué línea es la culpable? Haz clic en ella.',
    correcta: 4,
    pista: 'La condición de la línea 5 está bien: con un promedio real de 1,67 daría «Reprobado».',
    ex: 'La línea 4 calcula mal: por la precedencia de operadores, solo n3 se divide entre 3.' },
  { id: 'D1-3', nv: 5, tipo: 'opcion', sub: 'Elegir la corrección', etapa: 'Corregir',
    q: '¿Cuál es la corrección correcta de la línea culpable?',
    op: ['prom <- (n1 + n2 + n3) / 3;', 'prom <- n1 + n2 + n3 / 3.0;', 'prom <- (n1 + n2 + n3 / 3);', 'prom <- n1 / 3 + n2 + n3;'],
    pista: 'Hay que sumar las tres notas primero. ¿Qué hace que una operación se haga antes?',
    ex: 'Los paréntesis obligan a sumar antes de dividir. Escribir 3.0 no cambia la precedencia.' },
  { id: 'D1-4', nv: 4, tipo: 'valor', sub: 'Comprobar la corrección', etapa: 'Comprobar',
    q: 'Con la corrección, ¿qué palabra escribe ahora el boletín de Juan (1, 1 y 3)?',
    acepta: ['Reprobado', 'Reprobado con 1.67', 'Reprobado con 1,67'],
    pista: '(1 + 1 + 3) / 3 = ? ¿Es mayor o igual que 2?',
    ex: '(1 + 1 + 3) / 3 = 1,67, que es menor que 2: «Reprobado». Caso cerrado.' }
  ] },

/* ══════════ CASO 2 ══════════ */
{ id: 'cantina', n: 2, titulo: 'La cantina que cobra de más', tema: 'vectores', ico: '🥟',
  denuncia: 'María pidió solo 2 empanadas (5.000 Gs cada una) y el sistema le cobró 36.000 Gs. La fila de la cantina está furiosa.',
  testigo: { quien: 'bit', dice: 'Las cantidades se guardan en el vector cant, en el mismo orden que los precios: empanada, hamburguesa, jugo y chipa.' },
  code: { lang: 'pseudo', txt: `Algoritmo cantina
    Definir precios, cant, i, total Como Entero;
    Dimension precios[4], cant[4];
    precios[1] <- 5000;
    precios[2] <- 8000;
    precios[3] <- 3000;
    precios[4] <- 2000;
    Para i <- 1 Hasta 4 Con Paso 1 Hacer
        Leer cant[i];
    FinPara
    total <- 0;
    Para i <- 1 Hasta 4 Con Paso 1 Hacer
        total <- total + precios[i] * cant[1];
    FinPara
    Escribir "Total: ", total;
FinAlgoritmo` },
  pasos: [
  { id: 'D2-1', nv: 3, tipo: 'traza', sub: 'Interrogar: prueba de escritorio', etapa: 'Interrogar',
    q: 'María cargó cant = [2, 0, 0, 0]. Sigue el segundo Para y completa la tabla.',
    cols: ['i', 'precios[i]', 'cant[1]', 'total'],
    filas: [['1', '5000', '2', '{10000}'], ['2', '8000', '2', '{26000}'], ['3', '3000', '2', '{32000}'], ['4', '{2000}', '2', '{36000}']],
    pista: 'En cada vuelta se suma precios[i] × cant[1]. Fíjate qué índice tiene cant.',
    ex: 'Todos los precios se multiplican por 2, la cantidad de empanadas: 36.000.' },
  { id: 'D2-2', nv: 4, tipo: 'linea', sub: 'Encontrar la línea culpable', etapa: 'Acusar',
    q: '¿Qué línea es la culpable?',
    correcta: 13,
    pista: 'Cada precio debería multiplicarse por SU cantidad.',
    ex: 'La línea 13 usa siempre cant[1] en vez de cant[i].' },
  { id: 'D2-3', nv: 5, tipo: 'opcion', sub: 'Elegir la corrección', etapa: 'Corregir',
    q: '¿Cómo debe quedar la línea culpable?',
    op: ['total <- total + precios[i] * cant[i];', 'total <- precios[i] * cant[i];', 'total <- total + precios[1] * cant[i];', 'total <- total + precios[i] + cant[i];'],
    pista: 'Hay que acumular (total + …) y usar el mismo índice en los dos vectores.',
    ex: 'Sin «total +» cada vuelta pisa el total anterior; con precios[1] todo se cobra como empanada.' },
  { id: 'D2-4', nv: 4, tipo: 'valor', sub: 'Comprobar la corrección', etapa: 'Comprobar',
    q: 'Con la corrección, Dani carga cant = [0, 1, 3, 0]. ¿Cuánto le cobra ahora? (solo el número)',
    acepta: ['17000', 'Total: 17000'],
    pista: '1 hamburguesa y 3 jugos.',
    ex: '8.000 × 1 + 3.000 × 3 = 17.000 Gs. Caso cerrado.' }
  ] },

/* ══════════ CASO 3 ══════════ */
{ id: 'asientos', n: 3, titulo: 'El aula de los asientos fantasma', tema: 'matrices', ico: '🪑',
  denuncia: 'El sistema de asientos del aula dice que la fila 3 tiene 5 lugares libres… pero cada fila tiene solo 4 asientos. ¿Asientos fantasma?',
  testigo: { quien: 'techi', dice: 'Esta es la matriz s del aula: 1 es ocupado y 0 es libre. Yo misma la cargué.' },
  matriz: [[1, 0, 1, 1], [0, 0, 1, 0], [1, 1, 1, 0]],
  code: { lang: 'pseudo', txt: `Algoritmo asientos
    Dimension s[3,4];
    // s ya está cargada: 1 = ocupado, 0 = libre
    libres <- 0;
    Para f <- 1 Hasta 3 Con Paso 1 Hacer
        Para c <- 1 Hasta 4 Con Paso 1 Hacer
            Si s[f, c] = 0 Entonces
                libres <- libres + 1;
            FinSi
        FinPara
        Escribir "Fila ", f, ": ", libres, " libres";
    FinPara
FinAlgoritmo` },
  pasos: [
  { id: 'D3-1', nv: 3, tipo: 'celdas', sub: 'Interrogar: qué cuenta el Si', etapa: 'Interrogar',
    q: 'Marca los asientos que el Si de la línea 7 cuenta como libres.',
    f: 3, c: 4, valores: [[1, 0, 1, 1], [0, 0, 1, 0], [1, 1, 1, 0]],
    marcar: [[1, 2], [2, 1], [2, 2], [2, 4], [3, 4]],
    pista: 'El Si cuenta las celdas con 0.',
    ex: 'Hay 1 libre en la fila 1, 3 en la fila 2 y 1 en la fila 3.' },
  { id: 'D3-2', nv: 4, tipo: 'traza', sub: 'Interrogar: prueba de escritorio', etapa: 'Interrogar',
    q: '¿Cuánto vale libres cada vez que se ejecuta el Escribir?',
    cols: ['f', 'libres al escribir'],
    filas: [['1', '{1}'], ['2', '{4}'], ['3', '{5}']],
    pista: 'libres NO vuelve a 0 al cambiar de fila.',
    ex: 'El contador sigue sumando: 1, después 1 + 3 = 4, después 4 + 1 = 5. ¡Ahí están los asientos fantasma!' },
  { id: 'D3-3', nv: 4, tipo: 'linea', sub: 'Encontrar la línea culpable', etapa: 'Acusar',
    q: '¿Qué línea está en el lugar equivocado?',
    correcta: 4,
    pista: 'El contador debería empezar de nuevo en cada fila.',
    ex: 'libres <- 0 está antes del Para f: se ejecuta una sola vez para todo el algoritmo.' },
  { id: 'D3-4', nv: 5, tipo: 'opcion', sub: 'Elegir la corrección', etapa: 'Corregir',
    q: '¿Cuál es la corrección?',
    op: ['Mover libres <- 0 adentro del Para f, antes del Para c.',
         'Mover libres <- 0 adentro del Para c, antes del Si.',
         'Cambiar libres <- libres + 1 por libres <- 1.',
         'Cambiar la condición por s[f, c] = 1.'],
    pista: 'Si lo pones adentro del Para c, ¿cuánto puede valer como máximo?',
    ex: 'El contador se reinicia al empezar cada fila. Adentro del Para c se reiniciaría en cada asiento y nunca pasaría de 1.' }
  ] },

/* ══════════ CASO 4 ══════════ */
{ id: 'sorteo', n: 4, titulo: 'El sorteo sospechoso', tema: 'python', ico: '🎟️',
  denuncia: 'En el sorteo de la kermesse, cuando sale el número 1 gana Beto (¡que es el número 2!). Y cuando sale el 5, el programa explota. Ana jura que es una trampa.',
  testigo: { quien: 'bit', dice: 'La lista tiene a los 5 participantes en orden: Ana es el número 1, Beto el 2, Caro el 3, Dani el 4 y Eli el 5.' },
  code: { lang: 'py', txt: `participantes = ["Ana", "Beto", "Caro", "Dani", "Eli"]
numero = int(input("Número sorteado (1 a 5): "))
ganador = participantes[numero]
print("Ganó:", ganador)` },
  pasos: [
  { id: 'D4-1', nv: 3, tipo: 'valor', sub: 'Interrogar: qué muestra', etapa: 'Interrogar',
    q: 'Si sale el número 3, ¿quién gana según el programa?',
    acepta: ['Dani', 'Ganó: Dani'],
    pista: 'En Python, participantes[0] es Ana.',
    ex: 'participantes[3] es el cuarto elemento: Dani. Con 5, participantes[5] no existe: IndexError.' },
  { id: 'D4-2', nv: 4, tipo: 'linea', sub: 'Encontrar la línea culpable', etapa: 'Acusar',
    q: '¿Qué línea es la culpable?',
    correcta: 3,
    pista: 'Los números del sorteo empiezan en 1; los índices de la lista, en 0.',
    ex: 'La línea 3 usa el número del sorteo como índice, sin restar 1.' },
  { id: 'D4-3', nv: 5, tipo: 'opcion', sub: 'Elegir la corrección', etapa: 'Corregir',
    q: '¿Cuál es la corrección justa?',
    op: ['ganador = participantes[numero - 1]', 'ganador = participantes[numero + 1]', 'ganador = participantes[-numero]', 'ganador = participantes[numero] - 1'],
    pista: 'Con el 1 tiene que ganar Ana (índice 0), y con el 5, Eli (índice 4).',
    ex: 'numero - 1 traduce «del 1 al 5» a «del 0 al 4». Con -numero, el 1 haría ganar a Eli: también es injusto.' },
  { id: 'D4-4', nv: 6, tipo: 'ordenar', sub: 'Reconstruir el programa', etapa: 'Comprobar',
    q: 'Gatiel quiere un sorteo nuevo: primero se cargan los 5 nombres y después se sortea. Ordena las líneas.',
    lineas: ['participantes = []', 'for i in range(5):', '    nombre = input("Nombre: ")', '    participantes.append(nombre)', 'numero = int(input("Número sorteado (1 a 5): "))', 'print("Ganó:", participantes[numero - 1])'],
    pista: 'Lista vacía → ciclo de carga → número sorteado → resultado.',
    ex: 'La lista se crea vacía y se llena con append. El número se pide después de cargar los nombres. Caso cerrado.' }
  ] }
];
