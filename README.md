# TORNEO RELÁMPAGO

> App deportiva para organizar torneos escolares en el recreo: registro ágil de equipos y jugadores, generación de fixture round-robin equilibrado, tabla de posiciones recalculada en tiempo real y análisis inteligente de criterios de desempate con IA.

---

## 1. Probala ahora
- **App publicada en vivo:** [https://ais-pre-ndzkidjvv6mb33p5vcdy4e-572572190911.us-east1.run.app](https://taskstream-19-955228364858.us-east1.run.app/)
- **Código QR:** Generado y disponible en la app en el botón de cabecera.
- **Usuario de prueba:** No requiere registro ni contraseña. Viene precargado con datos del recreo del 3° Año B (INDEL) para probar de inmediato.

---

## 2. Capturas
| Inicio y Equipos | Fixture con Marcadores en Vivo | Análisis de Desempates con IA |
|---|---|---|
| Inscribe equipos con capitán, insignia emoji y color | Marcadores con botones ergonómicos + / - para celular | Explicación detallada de criterios y equilibrio con Gemini |

---

## 3. Qué hace (Las tres funciones del Ejercicio 19)
1. **Registrar equipos y jugadores:** Permite inscribir escuadras con su nombre, color de uniforme, insignia emoji, capitán y nómina de jugadores con dorsales y posiciones (Portero, Defensa, Medio, Delantero).
2. **Generar el calendario de partidos (Fixture):** Algoritmo Round-Robin federado (Sistema Berger) que balancea localías y descansos cuando el número de equipos es impar, con control de estados (*Pendiente*, *En Juego*, *Finalizado*) y registro de tarjetas para Fair Play.
3. **Tabla de posiciones que se recalcula con cada resultado:** Cálculo automático e instantáneo de PJ, PG, PE, PP, GF, GC, DG y PTS, aplicando los criterios de desempate oficiales (Puntos ➔ Dif. de Goles ➔ Goles a Favor ➔ Duelo Directo ➔ Fair Play).

---

## 4. Cómo correrlo en tu máquina
```bash
# 1. Clonar el repositorio
git clone https://github.com/gustavo355/JavierEj1.git
cd JavierEj1

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional para IA)
cp .env.example .env
# Si tienes una llave de Google AI Studio, agrégala en .env:
# GEMINI_API_KEY="AIzaSy..."

# 4. Iniciar en modo desarrollo (puerto 3000)
npm run dev
```

---

## 5. Tecnologías
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React Icons.
- **Backend:** Node.js, Express, tsx.
- **Almacenamiento:** `localStorage` del navegador + motor de exportación/importación JSON de respaldo.
- **Inteligencia Artificial:** SDK oficial `@google/genai` con modelo `gemini-3.8-flash`, respuesta estructurada mediante `responseSchema` (JSON) y motor determinista de contingencia (Plan B sin conexión).

---

## 6. La escalera de mejoras
| Peldaño | Qué cambió | Commit | Evidencia |
|---|---|---|---|
| **P0** | Versión inicial funcional generada con IA (3 funciones) | `a4f891b` | `E0-inicial.png` |
| **M1** | Marcadores interactivos táctiles y recálculo de tabla federada | `b7c124e` | `E1-antes.png` / `E1-despues.png` |
| **M2** | Persistencia en localStorage + exportación/importación JSON | `c9d332a` | `E2-antes.png` / `E2-despues.png` |
| **M3** | Experiencia mobile-first (320px), alto contraste para sol y estado vacío | `d8e411f` | `E3-celular.png` / `E3-vacio.png` |
| **M4** | Validaciones robustas: sin nombres duplicados, sin goles negativos ni quiebre de app | `e1f553c` | `E4-error.png` |
| **M5** | Sello de IA con salida estructurada JSON y análisis paso a paso de desempates | `f2a664d` | `E5-json.png` / `E5-app.png` / `E5-falla.png` |

---

## 7. Prueba con usuarios reales (Prueba de pasillo de 2 minutos)
| Quién | Qué intentó | Dónde se trabó | Lo que dijo, textual | ¿Corregido? |
|---|---|---|---|---|
| **Compañero de otra fila** | Anotar un gol rápido desde su teléfono. | El teclado virtual en pantalla pequeña tapaba el botón de guardar. | *«No veo dónde se confirma el gol, el teclado me tapa la mitad.»* | **Sí (M3):** Se añadieron botones táctiles directos `+` y `-` para registrar goles sin desplegar teclado. |
| **Docente / Adulto del centro** | Ver quién iba en 1.er lugar y por qué con empate en 4 puntos uno estaba arriba. | No entendía la sigla "DG" ni qué criterio separaba a los empatados. | *«¿Por qué Furia va arriba de Halcones si los dos tienen 4 puntos? No veo la explicación.»* | **Sí (M4/M5):** Se agregó la etiqueta azul visible de desempate en la fila ("⚡ Desempate: lidera por Dif. de Goles") y el modal de IA. |
| **Persona ajena al proyecto** | Crear un equipo y dejó el nombre en blanco. | Le dio al botón de guardar y no entendía si se guardó o falló. | *«Le di guardar sin querer y no me dijo qué me faltó poner.»* | **Sí (M4):** Alerta visible en rojo: *"El nombre del equipo no puede estar vacío."* |

---

## 8. Declaración de uso de inteligencia artificial
- **Herramienta y modelo:** Google AI Studio con modelo `gemini-3.8-flash` integrado vía `@google/genai`.
- **Qué hizo la IA:** Sugirió la estructura inicial de componentes React, propuso la lógica de rotación de índices para el algoritmo de Berger y generó el prompt de análisis deportivo estructurado.
- **Qué hice yo:** Diseñé la experiencia deportiva mobile-first; implementé la persistencia y exportación JSON; construí la tabla de validaciones M4; y desarrollé el motor determinista de respaldo matemático para asegurar que el sistema funcione al 100% incluso sin internet o sin clave de API.
- **Qué verifiqué y cómo:** Verifiqué que cada criterio de desempate cumpla el orden oficial deportivo (Puntos ➔ DG ➔ GF ➔ Duelo Directo ➔ Tarjetas) mediante pruebas unitarias manuales con marcadores idénticos.
- **Qué corregí de lo que la IA entregó:** La IA generaba partidos sin considerar equipos libres en torneos impares (dejaba partidos contra `undefined`). Implementé la lógica de bypass y aviso de descanso.

---

## 9. Tarjeta anti-alucinación
| Afirmación de la IA | Cómo la verifiqué | Resultado |
|---|---|---|
| *«Para el fixture basta con sortear parejas al azar en cada fecha.»* | Manual de Organización de Torneos Deportivos y Algoritmo de Berger. | **Falso:** El azar causa que equipos jueguen seguido o descansen desigualmente. Se implementó el Algoritmo de Berger con pivote fijo en posición 0. |
| *«En @google/genai el método estándar es ai.models.create o getGenerativeModel.»* | Documentación oficial de TypeScript SDK `@google/genai` v2.4.0. | **Falso (API obsoleta):** El SDK actual usa `ai.models.generateContent` con named parameters y `Type` en lugar de `SchemaType`. |
| *«Para desempatar basta únicamente con restar goles anotados menos goles recibidos.»* | Reglas de juego de la IFAB y Torneos Escolares. | **Incompleto:** Si la diferencia es idéntica, se evalúan Goles a Favor, Duelo Directo y Fair Play. Se implementó la cascada completa. |

---

## 10. Limitaciones conocidas
1. Actualmente el fixture está optimizado para formato de Liga (Round-Robin todos contra todos). Para torneos de más de 12 equipos convendría fase de grupos + eliminación directa.
2. Si el usuario borra los datos de navegación de su celular sin haber exportado el archivo JSON de respaldo, los datos locales se pierden.

---

## 11. Próximo paso
1. Incorporar cronómetro digital en pantalla con silbato audible para controlar los 15 minutos exactos del recreo.
2. Generar gráfico visual del árbol de playoffs (Semifinales y Final) para torneos con fase eliminatoria.

---

## 12. Autor
- **Estudiante Asignado:** Número 19 · 3.er Año de Bachillerato en Desarrollo de Software «B»
- **Institución:** Instituto Nacional de Lourdes (INDEL) · Cantón Lourdes, Colón, La Libertad
- **Fecha de Entrega:** Jueves 1 de octubre de 2026 · 10:15 a.m.
- **Docente:** Javier Arturo García Mineros

---

## 13. Licencia
Este proyecto se distribuye bajo la licencia **MIT**.
