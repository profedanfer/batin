# Sistema en Producción · BATIN · 3er curso

Escape room integrador, por equipos de 3 o 4. El caso: la **biblioteca del colegio** necesita un sistema de préstamos. Cada sala es una capa del mismo sistema; al resolver todos sus retos se obtiene una **llave** y se abre la siguiente. Con todas las llaves, el sistema "sale a producción".

## Las salas

| Sala | Área | Qué se hace |
|---|---|---|
| 1 · Requerimientos | Proyectos | Funcionales y no funcionales, objetivo, viabilidad, tipo de encuesta |
| 2 · La planilla | Ofimática | Leer la planilla de la bibliotecaria, CONTAR.SI, datos inconsistentes, gráficos |
| 3 · El modelo de datos | Normalización | Anomalías, 1FN, repartir campos en tablas, relación 1:N, 3FN |
| 4 · Consultas SQL | Bases de datos | **Consultas reales** que se ejecutan en el navegador: WHERE, GROUP BY, JOIN, UPDATE |
| 5 · La multa | Algoritmos y Python | Ordenar el pseudocódigo, prueba de escritorio, leer Python |
| 6 · Estructuras de datos | Algorítmica 3 | Cola de reservas, pila de "deshacer", lista enlazada, búsqueda O(n) |
| 7 · Java en consola | Programación | Scanner, tipos, ciclos con arreglos, de Python a Java, concatenación |
| 8 · El índice de libros | Algorítmica 3 | **Árboles (ABB)** — oculta hasta que la actives |
| 9 · La defensa | Proyectos | El jurado pregunta: justificar decisiones, evidencia, documentación, ética |

Todos los datos son coherentes entre salas: la planilla de la sala 2 es la misma información que la base de datos de la sala 4, y la multa de la sala 5 es la que se programa en Java en la sala 7.

## Activar la sala de árboles (después de la feria)

En `config.js` cambia `arboles: false` por `arboles: true` y sube el archivo. La sala aparece entre Java y la defensa.

## Tipos de reto

- **Elige** (opción múltiple): si se equivocan, esa opción queda tachada y pueden seguir probando.
- **Responde**: escriben el valor (no importan mayúsculas, puntos de miles ni «Gs»).
- **Ordena**: suben y bajan líneas de código. Desde el segundo intento fallido, se marcan en color las que están bien.
- **Clasifica**: ubican cada elemento en su categoría. Desde el segundo intento fallido, se marcan los mal ubicados.
- **SQL en vivo**: la consulta se ejecuta sobre la base de la biblioteca y se compara con el resultado esperado. Los errores de escritura **no** descuentan puntos; un resultado equivocado, sí. Con «Ver datos» pueden mirar las tablas sin penalización.

**Puntos:** 100 por reto, −20 por cada intento fallido, −20 si piden la pista (mínimo 40). Se cambia en `config.js`.

## Guardado

El progreso de cada equipo se guarda solo en el navegador. Si no terminan en una clase, la próxima vez eligen su equipo en «Continuar». El cronómetro solo corre mientras juegan. Si quieres ponerles un tiempo objetivo, usa `tiempoObjetivo` en `config.js`: el cronómetro se pone en rojo al pasarlo.

**Importante:** el equipo tiene que seguir en la **misma computadora y el mismo navegador**.

## La sala SQL necesita internet

El motor SQL (sql.js) se carga desde internet, igual que en tus laboratorios de SQL. Sin conexión, la sala lo avisa y permite saltar el reto sin puntos, para no trabar el juego.

## Editar el contenido (`salas.js`)

- En las preguntas de opción múltiple, **la primera opción es la correcta** (el juego las mezcla).
- En los retos SQL, la `solucion` define el resultado correcto: el juego compara resultados, no el texto de la consulta. Cualquier consulta equivalente vale.
- Todo el código fue verificado ejecutándolo: SQL en SQLite, Python con Python y Java compilado con javac.

## Panel

`panel.html` muestra:

- **por sala**: % resuelto al primer intento, intentos promedio y pistas;
- **los retos que más intentos necesitaron**, con la primera respuesta equivocada más común;
- **el progreso de cada equipo** en esa computadora.

## Registro en Google Sheets (opcional)

Usa el mismo `Code.gs` de la OCA: pon la misma URL en `config.js` → `endpoint`. Cada sala terminada se envía como un bloque. En la planilla, `modo` = `escape`, `tema` = sala, `n` = intentos, y `elegida` = la primera respuesta equivocada (con `[pista]` si la pidieron).
