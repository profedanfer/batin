# La OCA de la Ofimática · BATIN · 1° curso

Juego de tablero (63 casillas) para repasar Excel, Word, PowerPoint y Proyectos. Se juega por equipos en el proyector, desde un solo dispositivo.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | El juego |
| `panel.html` | Panel de fallas (para la profe) |
| `preguntas.js` | **El banco de preguntas. Es el único archivo que hace falta tocar para el contenido.** |
| `config.js` | Cursos, tiempo por defecto y la URL de la planilla |
| `juego.js`, `registro.js`, `oca.css` | Motor, registro y estilos; no hace falta tocarlos |

Va dentro de `ejercicios/oca-ofimatica/` en el repo, y usa `../../batin.css` y `../../batin.js`.

## Reglas en una línea

El dado marca cuánto avanzan **y** la dificultad (1-2 fácil, 3-4 media, 5-6 difícil). La casilla de destino decide el tema. Si aciertan, avanzan; si fallan, se quedan.

| Casilla | Qué representa | Efecto |
|---|---|---|
| 🦢 Ocas (5, 9, 14…59) | Un atajo de teclado | Saltan a la siguiente oca y tiran otra vez |
| 🌉 6 Puente | Referencia absoluta `$A$1` | Van a la 12 y tiran otra vez |
| 🛏️ 19 Posada | Diapositiva de 200 palabras | Pierden 1 turno |
| 🎲 26 Dados | Hipótesis «Si… entonces…» | Van a la 53 y tiran otra vez |
| 🕳️ 31 Pozo | `#¡DIV/0!` por no fijar el total | Pierden 2 turnos |
| 🌀 42 Laberinto | Títulos sin estilos: no hay índice | Vuelven a la 30 |
| ⛓️ 52 Cárcel | Encabezado sin salto de sección | Pierden 2 turnos |
| 🎲 53 Dados | Datos bien codificados | Tiran otra vez |
| 🔌 58 Apagón | No guardaste | Vuelven a la 40 |
| 🏁 63 Meta | | Hay que llegar justo; si sobra, rebotan |

**Teclado:** barra espaciadora = tirar el dado · A/B/C/D (o 1-4) = responder · Enter = continuar.
**Anular pregunta:** si una pregunta tiene un error, la anulas y no cuenta.
**Sala oscura:** el botón pasa el juego a fondo claro y letra oscura (la misma regla que enseñamos en PowerPoint). Es el mismo botón ☀️/🌙 del menú de BATIN: cambia todo el sitio.

## Editar preguntas (`preguntas.js`)

- **La primera opción siempre es la correcta.** El juego las mezcla solo.
- `id` único. Si cambias mucho una pregunta, cámbiale el id, así el panel no mezcla datos viejos y nuevos.
- `sub` agrupa en el panel: escribe el subtema siempre igual.
- `n`: 1, 2 o 3. Conviene mantener preguntas de los tres niveles en cada tema.
- Para agregar una con planilla, diapositiva o páginas de Word, copia una que ya tenga `v:` y cambia los datos.

Hoy hay 94 preguntas: Excel 26, Word 22, PowerPoint 20, Proyectos 26.

## Dónde se guardan las partidas

1. **Siempre** en el navegador de la computadora donde se jugó. El panel las muestra con "Este navegador".
2. **Opcional:** en una planilla de tu Google Drive, para juntar los datos de todas las computadoras.

Si se cierra el navegador a mitad de partida, al volver a abrir el juego ofrece continuarla.

## Registro en Google Sheets (opcional, 10 minutos)

1. Crea una planilla nueva en tu Drive, por ejemplo "OCA · registro".
2. Menú **Extensiones → Apps Script**. Borra lo que aparece y pega el contenido de `Code.gs`.
3. Cambia `CLAVE_PANEL` por una clave tuya. **No la pongas en el repo**: queda solo en el Apps Script.
4. **Implementar → Nueva implementación → Tipo: Aplicación web.**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Autoriza los permisos que pide Google y copia la URL que termina en `/exec`.
6. Pégala en `config.js` → `endpoint: 'https://script.google.com/macros/s/…/exec'` y sube `config.js` al repo.
7. En el panel, elige "Planilla de Google", escribe tu clave y presiona Cargar.

La planilla crea sola dos hojas: `respuestas` (una fila por respuesta) y `partidas`. Si una partida llega dos veces, no se duplica.

**Qué se guarda:** curso, nombre del equipo, pregunta, tema, si acertó y qué opción eligió. Nada de nombres completos ni datos personales: conviene que los equipos usen nombres de equipo, no de alumnos.
