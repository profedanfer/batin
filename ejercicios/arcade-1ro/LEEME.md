# Arcade de 1° · BATIN

Tres juegos para repasar **Laboratorio 1** con **Gatiel, Bit y Techi**: Excel, encuestas y tabulación, el informe en Word, la presentación y la viabilidad del proyecto (Planes2026, 1ª y 2ª etapa). Todos los desafíos son de nivel **N3 a N6**.

| Juego | Personaje | Cómo se juega | Uso |
|---|---|---|---|
| `auditoria.html` | 🐱 Gatiel | 4 expedientes de proyectos ICIENTEC con errores (la encuesta que contó de menos, el informe que nadie encuentra, la diapositiva que no cuadra, el proyecto imposible). Cada uno trae planilla, informe y/o diapositiva, y 5 pasos: calcular (N3) → señalar (N4) → analizar (N4) → juzgar (N5) → rehacer (N6). | Solo, un equipo, o **relevos** de 2 a 4 equipos que se turnan los pasos. El avance se guarda. |
| `planilla.html` | 🤖 Bit | Juego de territorio sobre una hoja A1:F6. Cada equipo elige el riesgo (N3 = 1 celda … N6 = rango de 4); si acierta, conquista **escribiendo la referencia o el rango** (`C4`, `B2:D2`, `B2:C3`). Error de escritura = `#¡REF!` (una segunda oportunidad y después pierde la jugada). Desde N5 se puede robar. Celdas `fx` +2, celdas `$` no se pueden robar, fila o columna completa +4. | Contra Bit, o 2 a 4 equipos en el proyector. |
| `feria.html` | 👩‍💻 Techi | Simulacro ICIENTEC: 4 stands contra reloj (datos N3 → informe N4 → presentación N5 → defensa N6), jurado de 3 criterios (Datos, Comunicación, Proyecto), nervios 😬, comodines (pista, +30 s, repregunta) y repregunta a otro equipo por la mitad de los puntos. Al final: puesto, rúbrica por criterio y qué guía de BATIN repasar. | Solo (con cuadro de honor) o 2 a 4 equipos. |

`index.html` es la portada con los tres juegos y `panel.html` el panel de fallas para la profe.

## Editar el contenido

- **`banco.js`**: los 69 desafíos que usan la planilla de Bit y el simulacro (por nivel: 18 N3 · 19 N4 · 16 N5 · 16 N6). Las instrucciones de cada tipo están arriba del archivo.
- **`casos.js`**: los 4 expedientes de Gatiel (20 pasos).
- **Tipos de desafío:** opción múltiple, respuesta escrita (también fórmulas), ordenar, clasificar, completar una tabla, **señalar una frase** en un informe o una diapositiva (`fragmento`) y **tocar una celda** de una planilla (`celda`).
- **Visuales:** planilla tipo Excel, página de Word, diapositiva y gráficos de barras, torta o línea (en grises, con un solo color de acento: se imprimen bien en blanco y negro).
- **Opción múltiple:** la **primera opción es la correcta**; el juego las mezcla.
- **Fórmulas:** se escriben con `;` como en el Excel en español, pero también se acepta `,`. No importan mayúsculas ni espacios. Si una fórmula tiene otras formas válidas, agrégalas a `acepta`.
- **Verificación:** las 89 respuestas correctas se comprobaron automáticamente contra el motor, y todas las cuentas se revisaron a mano.

## Configuración (`config.js`)

- Cursos y puntos por nivel.
- Gatiel: el descuento por usar la lupa.
- Planilla: tamaño de la hoja, rondas, premio por nivel, desde qué nivel se roba, cuántas celdas `fx` y `$`, bonus por línea, tiempo por desafío y qué tan bien juega Bit.
- Simulacro: los stands, con su nivel, temas, preguntas por equipo y segundos.

## Panel (`panel.html`)

- Aciertos por **tema y nivel** (en Excel N3 se cuentan también los rangos escritos en la planilla de Bit).
- Los desafíos con más fallas y la respuesta equivocada más común.
- Un resumen por estudiante o equipo, filtro por curso y juego, y descarga en CSV.

## Google Sheets (opcional)

Usa el **mismo `Code.gs`** de la OCA: hay que poner la URL en `config.js` → `endpoint`. En la planilla, la columna `modo` queda como `auditoria`, `planilla` o `feria`.

Todos los equipos, nombres y datos de los casos son inventados.
