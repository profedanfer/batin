# Arcade de 2° · BATIN

Tres juegos para repasar antes del examen, con **Gatiel, Bit y Techi**. Cubren **pseudocódigo y prueba de escritorio, vectores, matrices y Python**, y todos los desafíos son de nivel N3 a N6.

Convención de índices (igual que en los ejercicios de clase):
- **PSeInt:** los índices empiezan en 1 y la matriz se escribe `m[f,c]`.
- **Python:** los índices empiezan en 0 y la matriz se escribe `m[f][c]`.

| Juego | Personaje | Cómo se juega | Uso |
|---|---|---|---|
| `detective.html` | 🐱 Gatiel | 4 casos con historia: el boletín, la cantina, el aula y el sorteo. Cada caso tiene 4 pasos que suben de nivel: interrogar (prueba de escritorio) → acusar (la línea culpable) → corregir (elegir el arreglo) → comprobar. | Solo o en equipo. La investigación se guarda para seguir otro día. |
| `flota.html` | 🤖 Bit | Batalla naval en una matriz de 6×6. Un desafío correcto da 1 disparo, y uno N5 o N6 da 2. Para disparar se escribe la celda en PSeInt (`tablero[f,c]`) o en Python (`tablero[f][c]`); si el índice está mal, el disparo se desvía. Cada 3 aciertos, los desafíos suben de nivel. | Contra Bit, o equipo contra equipo en el proyector. |
| `copa.html` | 👩‍💻 Techi | 4 rondas contra reloj: N3 → N4 → N5 → final N6. Suman la rapidez, la racha y un comodín ×2. Por equipos, si uno falla, otro puede robar la pregunta por la mitad de los puntos. | Solo (con salón de la fama) o de 2 a 4 equipos. |

`index.html` es la portada con los tres juegos.

## Editar el contenido

- **`banco.js`:** son los desafíos que usan la flota y la copa.
- **`casos.js`:** son los casos del detective.
- **Tipos de desafío:** opción múltiple, respuesta escrita, clic en la línea, ordenar líneas, clasificar, **prueba de escritorio** (`traza`: lo que va entre `{ }` lo completa el estudiante) y **marcar celdas** de una matriz (`celdas`).
- **Opción múltiple:** la **primera opción es la correcta**; el juego las mezcla.
- **Verificación:** todo el Python se ejecutó y todo el pseudocódigo se comprobó traduciéndolo.

## Configuración (`config.js`)

- Cursos y puntos por nivel.
- Del detective: el descuento por usar la lupa.
- De la flota: el tamaño del tablero, los barcos y cada cuántos aciertos suben de nivel los desafíos.
- De la copa: las rondas, con su nivel, la cantidad de preguntas y los segundos.

## Panel (`panel.html`)

- Aciertos por **tema y nivel**. En Matrices N3 se cuentan también los disparos de la flota bien o mal escritos.
- Los desafíos con más fallas y la respuesta equivocada más común.
- Un resumen por estudiante o equipo.
- Se puede filtrar por curso y por juego, y descargar en CSV.

## Google Sheets (opcional)

Usa el **mismo `Code.gs`** de la OCA: hay que poner la URL en `config.js` → `endpoint`. En la planilla, la columna `modo` queda como `detective`, `flota` o `copa`.
