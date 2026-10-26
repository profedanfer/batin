# Expedición Kernel · BATIN · 3er curso

Juego de repaso para el examen: **normalización, SQL, estructuras de datos y Java en consola**. Todos los desafíos son de nivel N3 o superior (aplicar, analizar, evaluar, crear) y se basan en casos.

**La historia.** Un apagón borró el Kernel del colegio. Para recuperarlo hay que cruzar cuatro regiones:

| Región | Tema | Caso |
|---|---|---|
| 🏰 Fortaleza Normal | Normalización | Planilla del taller de celulares CeluTec |
| ⚓ Puerto SQL | Bases de datos | Torneo Intercolegial: consultas **reales** en el navegador |
| 🏝️ Archipiélago de Estructuras | Algorítmica 3 | Cantina, editor, playlist y turnos del centro de salud |
| 🌋 Volcán Java | Programación | Compilador humano: qué imprime, dónde está el error, armar el código |

## Dos modos

**Expedición** (solo, o de 2 a 4 equipos por turnos en el proyector)
- 🎲 Se tira el dado: 1–2 → desafío N3 · 3–4 → N4 · 5–6 → N5. Si responden bien, avanzan lo que salió. Si fallan, no avanzan y ven la explicación y la respuesta correcta.
- Casillas: 🎁 cofre (comodín al azar), 🐛 bug (un N3: si fallan, retroceden 2), 🌪️ tormenta (el próximo desafío es N5 y vale el doble), 🌀 portal (un N5 opcional: si aciertan, saltan 3).
- **Guardián** al final de cada región: un caso de 3 pasos (N4–N6). No se puede pasar de largo con el dado. Si fallan un paso, no ven la respuesta: lo reintentan en el próximo turno.
- Comodines: 💡 pista (descuenta 30 % de los puntos), ✂️ 50/50, 🎲 volver a tirar.
- Gana el primer equipo que llega al Kernel. La partida se guarda y se puede seguir otro día (en la misma computadora y navegador).

**Simulacro de examen** (individual)
- 15 preguntas al azar de los temas elegidos, con 30 minutos. Sin pistas y sin ver si acertaron hasta entregar.
- Al final: nota de 1 a 5, aciertos por tema, qué repasar primero y la explicación de cada pregunta.
- Las preguntas pesan según el nivel (N3 = 1 punto, N4 = 2, N5 y N6 = 3).

## Configuración (`config.js`)

- `escala`: el % mínimo para cada nota. Viene con 60 % para el 2; **ajústala a tu exigencia**.
- `preguntas` y `minutos`: el tamaño y el tiempo del simulacro.
- `arboles: true`: suma desafíos de ABB al Archipiélago, cuando ya los hayan visto.
- `cursos`, puntos por nivel, comodines iniciales y bonos.

## Editar el contenido (`desafios.js`)

- En las preguntas de opción múltiple, **la primera opción es la correcta** (el juego las mezcla).
- En los SQL, el juego compara el **resultado**: cualquier consulta equivalente vale. Los errores de escritura no cuentan como intento.
- En «simular», la solución son las operaciones (`ops`). Vale cualquier forma de llegar al mismo estado final.
- Todo fue verificado: SQL en SQLite y Java compilado y ejecutado con javac.

## SQL necesita internet

El motor SQL (sql.js) se carga desde internet, igual que en los laboratorios. Sin conexión, el juego evita los desafíos SQL. Si toca uno, deja saltarlo sin que cuente.

## Panel (`panel.html`)

Muestra:
- los aciertos por **región y nivel** (una grilla N3–N6 con colores);
- los desafíos con más fallas y la respuesta equivocada más común;
- la tabla de **simulacros**, con la nota de cada estudiante.

Se puede filtrar por curso y por modo, y descargar en CSV.

## Registro en Google Sheets (opcional)

Usa el **mismo `Code.gs`** de la OCA: pon la misma URL en `config.js` → `endpoint`. Las respuestas se envían en tandas, con `modo` = `expedicion` o `simulacro`, `tema` = región y `sub` = subtema + nivel.
