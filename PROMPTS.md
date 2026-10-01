# Bitácora de Prompts · Práctica 1 (10 %)
**Estudiante:** N.º 19 · 3.er Año Software «B» · INDEL  
**Ejercicio:** 19 · TORNEO RELÁMPAGO  
**Docente:** Javier A. García Mineros  

---

## P0 · Prompt Cero: Que exista

**Prompt textual:**
```text
ROL: Sos un desarrollador senior de aplicaciones web.

CONTEXTO: Estoy construyendo una app llamada TORNEO RELÁMPAGO para el organizador estudiantil del torneo en el recreo escolar de 3° año.
El problema que resuelve es: Los torneos del recreo se arman en papel y la tabla siempre se pierde.

TAREA: Generá la primera versión funcional, con estas tres funciones y nada más:
1. Registrar equipos y jugadores.
2. Generar el calendario de partidos (fixture round-robin).
3. Tabla de posiciones que se recalcula con cada resultado (PJ, PG, PE, PP, GF, GC, DG, PTS).

RESTRICCIONES: en español, sin librerías de pago, sin login, sin base de datos en servidor todavía. Que se vea bien en un celular desde 320px. Código comentado en los puntos clave.

FORMATO DE SALIDA: los archivos completos, cada uno con su nombre.

CRITERIO DE ACEPTACIÓN: abro la app, registro 2 equipos, genero el calendario, guardo un marcador y veo la tabla actualizarse sin ningún error en consola.
```

- **Qué devolvió:** Estructura inicial con React, TypeScript y componentes básicos para equipos y fixture simple.
- **Qué acepté:** La arquitectura modular por componentes y el cálculo inicial de puntos.
- **Qué corregí a mano:** Los nombres de equipos permitían estar vacíos y la tabla se rompía si no había partidos jugados.
- **Evidencia:** `evidencias/E0-inicial.png`
- **Commit:** `git commit -m "P0: primera version generada con IA"`

---

## M1 · Función: Que sirva

**Prompt textual:**
```text
La app ya permite crear equipos y ver un fixture preliminar. Necesito agregar la edición rápida de marcadores con botones táctiles (+ / -) para celular y el recálculo instantáneo de la tabla aplicando criterios deportivos oficiales.

No reescribas lo que ya funciona. Dame únicamente:
1. La función calculateStandings con ordenamiento por Pts, DG, GF y enfrentamiento mutuo.
2. Una prueba manual de tres pasos para comprobar que quedó bien.
3. Qué podría romperse en el resto de la app por este cambio.
```

- **Qué devolvió:** Función `calculateStandings` con ordenamiento por puntos, diferencia de goles y goles a favor.
- **Qué acepté:** El algoritmo de ordenamiento y las etiquetas visuales para identificar al puntero.
- **Qué corregí a mano:** Agregué el criterio de tarjetas amarillas (Fair Play) como 5.° criterio de desempate para evitar sorteos arbitrarios.
- **Evidencia:** `evidencias/E1-antes.png` y `evidencias/E1-despues.png`
- **Commit:** `git commit -m "M1: funcion calendario y tabla recalculada en vivo"`

---

## M2 · Datos: Que recuerde

**Prompt textual:**
```text
Quiero que los datos del torneo (equipos, jugadores, partidos y goles) no se pierdan al cerrar la app o recargar la página.

Usá localStorage y explicame:
1. Dónde queda guardada la información exactamente (clave: 'torneo_relampago_data_v1').
2. Qué pasa si el usuario borra el caché o cambia de dispositivo.
3. Cómo hago para exportar los datos a un archivo JSON por si quiero respaldarlos y compartirlos con el docente.

Dame el código de guardar, leer, borrar y un torneo de ejemplo ya cargado para probar.
```

- **Qué devolvió:** Hook de sincronización con `localStorage` y funciones para descargar un archivo JSON con `Blob` y `URL.createObjectURL`.
- **Qué acepté:** La persistencia reactiva con `useEffect` y la clave de almacenamiento estructurada.
- **Qué corregí a mano:** Agregué validación de esquema en la importación para evitar que un archivo JSON corrupto rompa la app.
- **Evidencia:** `evidencias/E2-antes.png` y `evidencias/E2-despues.png`
- **Commit:** `git commit -m "M2: persistencia de datos y respaldo JSON"`

---

## M3 · Experiencia: Que se entienda

**Prompt textual:**
```text
Ajustá la interfaz de Torneo Relámpago con estos requisitos, sin cambiar la lógica deportiva:
1. Se usa bien desde 320 px de ancho, con una sola mano y sin hacer zoom.
2. Contraste suficiente para leerse en el patio bajo el sol; texto nunca menor a 16 px en inputs.
3. Todos los campos con etiqueta visible, no solo con texto de ejemplo dentro.
4. Un solo botón principal por pantalla; los demás secundarios.
5. Estado vacío: qué se muestra cuando todavía no hay ningún dato, con una frase que invite a la primera acción.
6. Mensajes de éxito y de error visibles, en español, sin palabras técnicas.

Dame los cambios y decime cuál de los seis puntos NO pudiste cumplir y por qué.
```

- **Qué devolvió:** Rediseño con tema atlético de alto contraste (Dark Athletic con cian neón, oro y fucsia), barra inferior móvil fija y tarjetas vacías ilustradas.
- **Qué acepté:** La distribución móvil con un solo botón principal visible en cada pantalla.
- **Qué corregí a mano:** Ajusté el tamaño de los botones `+` y `-` a mínimo 44×44 px para toque táctil ergonómico con pulgar.
- **Evidencia:** `evidencias/E3-celular.png` y `evidencias/E3-vacio.png`
- **Commit:** `git commit -m "M3: experiencia de uso en celular y diseno ergonomico"`

---

## M4 · Robustez: Que no se rompa

**Prompt textual:**
```text
Actuá como tester de software, no como programador.

Dame diez formas concretas de romper esta app de torneos: campos vacíos, nombres duplicados, goles negativos, textos larguísimos, doble clic al guardar, fixture con 1 solo equipo, caracteres especiales.

Para cada una decime: qué pasaría hoy, qué debería pasar, y el código mínimo que lo evita. No cambies el diseño ni agregues funciones nuevas.
```

- **Qué devolvió:** Lista de 10 vectores de fallo con casos de prueba de borde.
- **Qué acepté:** Las validaciones de sanitización con `trim()`, límites de longitud y comprobación de duplicados case-insensitive.
- **Qué corregí a mano:** Implementé protección contra doble clic rápido en el botón de registrar resultado y bloqueo de números decimales en los goles con `Math.floor`.
- **Evidencia:** `evidencias/E4-error.png`
- **Commit:** `git commit -m "M4: validaciones y manejo de errores"`

---

## M5 · Inteligencia: Que piense (Sello de IA)

**Prompt textual:**
```text
Integrá una llamada a la API de Gemini dentro de la app para esta tarea concreta del Ejercicio 19:
"La IA arma el fixture equilibrado y aplica los criterios de desempate explicando cómo quedó cada posición."

Requisitos:
1. La respuesta debe venir como JSON con un esquema fijo (responseSchema), no como texto libre. Dame el esquema.
2. La app consume ese JSON y desglosa los desempates paso a paso en pantalla como datos estructurados.
3. La llave de API se lee de una variable de entorno en el backend Express (process.env.GEMINI_API_KEY).
4. Manejo de fallo: qué se muestra si la IA no responde o no hay internet (activar motor determinista de respaldo).
5. Un botón para copiar el informe formateado para pegarlo en el grupo de WhatsApp del recreo.
```

- **Qué devolvió:** Endpoint `/api/gemini/analyze-tournament` en Express usando `@google/genai` con modelo `gemini-3.8-flash` y `Type.OBJECT`.
- **Qué acepté:** El esquema estructurado con `tieBreakerExplanations`, `fixtureEquilibriumRating` y `championScenarios`.
- **Qué corregí a mano:** Creé la función `generateDeterministicAnalysis` en el servidor para que si no hay API key o no hay red, el sistema aplique las reglas matemáticas y devuelva el informe completo sin caídas.
- **Evidencia:** `evidencias/E5-json.png`, `evidencias/E5-app.png` y `evidencias/E5-falla.png`
- **Commit:** `git commit -m "M5: inteligencia con salida estructurada para desempates"`

---

## Cierre de la bitácora
- **Prompts que escribí en total:** 6 principales + 2 ajustes de refinamiento.
- **El prompt que más me sirvió y por qué:** El prompt de **M4 (Tester)**, porque me obligó a pensar en cómo romper mi propia app antes de considerarla terminada (goles negativos y nombres duplicados).
- **El error más caro que cometí:** Intentar llamar a Gemini desde el navegador al principio con librerías obsoletas; aprendí que la llave debe vivir protegida en el backend Express y que el SDK moderno es `@google/genai` con `ai.models.generateContent`.
- **Lo que haría distinto la próxima vez:** Escribir las pruebas manuales antes de escribir el primer componente visual.
