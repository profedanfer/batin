# Bit y el Laberinto del Tiempo · BATIN · 2° curso

Juego de laberinto para Algorítmica 2 + Python. Se juega en la compu (individual o en parejas). En el celular funciona deslizando el dedo o con los botones de flechas.

## La idea

Cada **caso** es un problema que existe en dos épocas:

- **⏳ Pasado · Análisis:** datos de entrada y salida, pseudocódigo, condiciones, prueba de escritorio.
- **🚀 Futuro · Producción:** el mismo problema en Python: qué muestra, dónde falla, si coincide con el análisis.

Para resolver el caso hay que recoger **todos los fragmentos de las dos épocas**.

## Reglas

| Elemento | Qué hace |
|---|---|
| 🌀 Portal (túneles laterales) | Para viajar de una época a la otra hay que **responder bien**. Si fallas, se cierra 6 segundos. |
| ❓ Esferas | Hacen una pregunta. Si aciertas, los bugs huyen 7 segundos y puedes atraparlos. |
| 🐞 Bugs | Son errores típicos. Si te atrapan, pierdes una vida y te explican qué error son. |
| Vidas | 3 por caso (se cambia en `config.js`). |

**Bugs del pasado:** Dato olvidado · Condición al revés · Sin inicializar · Bucle sin fin.
**Bugs del futuro:** IndentationError · TypeError · NameError · IndexError.

**Controles:** flechas o W A S D · `P` o `Esc` para pausar · A/B/C/D o 1-4 para responder · Enter para continuar.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | El juego |
| `panel.html` | Panel de fallas (para la profe) |
| `casos.js` | **Los casos y las preguntas. Es el archivo que se edita.** |
| `config.js` | Cursos, vidas, velocidad de los bugs y la URL de la planilla |
| `juego.js`, `registro.js`, `lab.css` | Motor, registro y estilos; no hace falta tocarlos |

## Editar o agregar preguntas (`casos.js`)

- **La primera opción siempre es la correcta.** El juego las mezcla solo.
- Cada caso tiene preguntas de `era: 'pasado'` y de `era: 'futuro'`. Conviene que **hablen del mismo problema**: esa es la gracia del juego.
- El código va entre comillas invertidas `` ` `` y respeta los espacios. Para marcar una línea que falta, escribe `______________`.
- Hoy hay 5 casos con 10 preguntas cada uno (5 del pasado y 5 del futuro). **Todo el código Python fue ejecutado** para verificar las respuestas.
- Si una pregunta tiene código Python y la cambias, ejecútala antes para confirmar la respuesta.

| Caso | Tema |
|---|---|
| 1 · La cantina | Variables, entrada y salida |
| 2 · ¿Aprueba? | Condiciones (if / else) |
| 3 · La rifa del curso | Ciclo for |
| 4 · El ahorro para la promo | Ciclo while |
| 5 · Las notas del grupo | Listas |

## Panel de fallas

Compara **pasado vs. futuro** en cada caso. Si el análisis va bien pero el código no, el problema está en la traducción del pseudocódigo a Python (y al revés). También muestra subtemas y preguntas más fallados, con la respuesta equivocada más elegida, y qué bugs atrapan más.

## Registro en Google Sheets (opcional)

Usa **el mismo `Code.gs` de la OCA**. Si ya lo tienes implementado, copia la misma URL `/exec` en `config.js` → `endpoint`. Las filas del laberinto se distinguen porque en la columna `modo` dice `laberinto` y en `tema` dice `pasado` o `futuro`.

Se guarda: curso, alias, caso, pregunta, época, si acertó y qué opción eligió. Nada de nombres completos: por eso se pide un alias.
