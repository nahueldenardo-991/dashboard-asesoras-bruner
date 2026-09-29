# Centro de marketing, contenidos y demanda

Página independiente: `marketing.html`. Publicación: GitHub Pages del repositorio actual.

## Datos y arquitectura

- Ingreso: el mismo `adminLogin` y la misma clave de gestión. Token solo en memoria; no hay claves nuevas ni claves en el código.
- Lectura comercial: `partnerDashboard`. Ventas, importes abonados, metas, desglose por curso/sede, serie diaria y procedencias son respuestas del backend vigente. No se recalculan inscripciones, ventas o cruces de teléfonos en marketing.
- Oferta: `upcomingCourses`. Se conservan los cupos y la deduplicación de inscriptos del backend. La capacidad visual reproduce gestión: máximo entre capacidad informada e inscriptos + disponibles. La fuente omite cursos marcados “Completo”; los suspendidos o devueltos sin cupos no se promocionan.
- Presentación de horarios, promociones y proyección: generada desde `index.html` y `gestion.html` mediante `node scripts/build-marketing-reference.cjs`. El módulo generado está versionado. Después de modificar las reglas comerciales originales, regenerarlo y ejecutar las pruebas de paridad.
- El panorama no muestra facturación, importes de ventas, rendimiento por sede ni comparación mensual. El ranking ordena inscripciones comerciales por cantidad (sin becas), nunca por importe. Precios y promociones del curso se conservan para redactar contenido.
- Carga independiente de comercial, cursos del mes seleccionado. Tiempo límite por consulta de 45 segundos. El ingreso termina al autenticar, sin esperar que las fuentes de datos funcionen. Una respuesta vieja no puede reemplazar el mes seleccionado posteriormente.
- Planificación local: `localStorage`, clave `bruner.marketing.v1`. No se envían contenidos a servidores. Las copias JSON se importan agregando IDs nuevos, sin sobrescribir IDs existentes. Una copia corrupta no se sobrescribe. El guardado solo ocurre por acción explícita.

No se modificaron `index.html`, `gestion.html`, Apps Script, funciones Netlify, permisos, claves ni planillas comerciales.

## Diagnóstico y límites de las fuentes

La estructura se inspeccionó en el Apps Script y en el proxy Netlify locales. La lectura de metadatos de las planillas activa e histórica mediante Google Drive devolvió 403: faltan permisos del conector para verificar su estructura en vivo. No se realizó ninguna escritura en Sheets.

Los datos comerciales conservan su fuente de verdad en los Sheets actuales. Según el código inspeccionado: `Cursos Disponibles`, `Inscriptos`, `Valores de cursos`, objetivos personales/grupales y el índice de procedencias son independientes de los futuros registros editoriales.

La procedencia vigente normaliza teléfonos, busca coincidencia exacta y usa últimos cuatro dígitos como respaldo, tomando fuentes fechadas desde junio de 2026. En la fecha más reciente, CATA tiene precedencia sobre las otras fuentes coincidentes. Marketing recibe este desglose; no introduce Mail ni Base fría. Cambiar esa regla en marketing produciría diferencias con gestión, por eso no se hizo.

No están disponibles consultas por comisión, conversión consulta/venta, atribución causal de ventas a contenidos, métricas automáticas de Instagram/WhatsApp, ni historial de ocupación. No se fabrican esos indicadores. Los resultados por contenido se registran manualmente indicando fuente y período. Las ventas por curso corresponden a todas las comisiones de ese nombre, no se atribuyen artificialmente a una sede/comisión.

## Reglas editoriales de la primera versión

- Suspendido/completo o sin cupos: no promocionar.
- Hasta 7 días con cupos: urgente y rojo.
- Hasta 20% de lugares disponibles (mínimo umbral 2): últimos cupos.
- 8–14 días o estado crítico: prioridad alta. El color temporal sigue los días, no una interpretación de la urgencia.
- Menos de 50% de ocupación, o sin cobertura y cero ventas del curso en el mes: prioridad media.
- Resto: informativo. Fecha/capacidad ausente: confirmar antes de programar.
- Cobertura: contenidos pendientes, en producción, para revisar o aprobados dentro de los próximos 14 días, en este dispositivo.
- Sugerencia semanal: hasta cinco propuestas; excluye cursos bloqueados y cursos cubiertos durante el período sugerido. El equipo puede editar, copiar, aceptar o descartar cada una. Tres contenidos por semana es un umbral editorial sugerido, no un objetivo comercial informado.
- Producidos: para revisar, aprobados o publicados. Cumplimiento: publicaciones realizadas hasta la fecha prevista / contenidos con fecha prevista hasta hoy, dentro del mes elegido.
- Las fechas operativas se calculan en Argentina. La proyección reutiliza el calendario de días hábiles y feriados existente en gestión.

## Planilla compartida propuesta — pendiente de autorización

Crear una planilla **“Bruner · Marketing y contenidos”**, separada de las comerciales. Verificar primero la estructura y acceso en vivo, los destinatarios y el alcance de los permisos. No crearla ni conectar escrituras hasta recibir autorización.

### Pestaña Contenidos

`id`, `fecha_planificada`, `codigo_curso`, `nombre_curso_referencia`, `sede_referencia`, `titulo`, `objetivo`, `plataforma`, `formato`, `responsable`, `estado`, `prioridad`, `promocion_utilizada`, `fecha_publicacion`, `enlace_publicacion`, `texto_guion`, `resultado_observado`, `observaciones`, `referencia`, `snapshot_preparacion`, `creado_en`, `actualizado_en`, `revision`.

### Pestaña Ideas

`id`, `idea`, `codigo_curso`, `formato`, `objetivo`, `prioridad`, `referencia`, `responsable`, `estado`, `fecha_sugerida`, `observaciones`, `creado_en`, `actualizado_en`, `revision`.

El código de curso es la referencia estable. Nombres, sede y snapshot preservan el contexto de una pieza histórica; nunca sustituyen precios o disponibilidad comercial en vivo. El snapshot permite advertir cambios de fecha/precio/estado/cupos.

Para colaboración se necesita un endpoint autenticado exclusivo de marketing, validación de estados/fechas/enlaces, bloqueo de edición concurrente por revisión y respaldo antes de migrar copias locales. El backend solo podrá escribir en esa nueva planilla. No debe adquirir permisos de escritura sobre ventas, objetivos, precios o cupos. Los generadores seguirán sin publicar en redes ni guardar propuestas automáticamente.

## Verificación y publicación

```sh
node scripts/build-marketing-reference.cjs
node --check marketing/app.js
node --check marketing/core.js
node --check marketing/reference.js
node scripts/test-marketing.mjs
git diff --exit-code -- index.html gestion.html netlify/functions/bruner.ts
```

La suite valida fechas inválidas y cambios de año, semáforos en 7/8/14/15 días, sobreocupación, suspendidos/completos, cobertura, promociones idénticas a asesoras, datos faltantes y sintaxis de los paneles anteriores. Las pruebas de navegador se ejecutan con un servidor aislado y datos explícitamente sintéticos fuera del repositorio; no se publican cuentas, sesiones o fixtures de prueba.

Antes de cada publicación: probar login, Actualizar, aislamiento de fallas, filtros, copiar, guardado, propuestas, biblioteca y tamaños de escritorio/celular. Incrementar la versión en HTML e imports de módulos. Publicar solo los archivos de marketing y documentación; nunca agregar archivos locales de credenciales ni Apps Script ignorado.

## Actualización 20260928-4

Se retiraron los indicadores de facturación, toda la comparación mensual y los bloques de rendimiento por curso/sede. Se agregó ranking por cantidad de inscripciones comerciales del mes, sin importes, y contador de publicaciones en Panorama: total, Instagram, WhatsApp y cursos comunicados. El botón Registrar publicación abre el editor con estado Publicado y fecha de hoy, pero no guarda hasta confirmar. Los contadores se actualizan al guardar, editar, eliminar, importar o cambiar de mes. Se usa la fecha real de publicación, incluso si la planificación pertenece a otro mes. El guardado local existente se conserva.

## Actualización 20260928-5: Instagram

Se incorporan ocho publicaciones/reels de septiembre de @bruner.instituto, consultados mediante la interfaz de Instagram y contrastados con el listado Publicadas de Meta Business Suite. `marketing/instagram-snapshot.json` contiene únicamente descripciones, enlaces y fechas de esas publicaciones; no incluye sesiones, credenciales, conversaciones ni estadísticas privadas. Es una captura puntual y no una conexión automática. No incluye historias, anuncios ni históricos de otros meses. El panel muestra explícitamente fecha de revisión y alcance.

`instagram.js` identifica cursos por palabras clave normalizadas (acentos y mayúsculas), deja sin identificar las descripciones ambiguas, admite varias coincidencias por publicación y nunca infiere una comisión/sede. Convierte las fechas a Argentina. Une el registro verificado con las publicaciones locales sin modificar el almacenamiento local; deduplica por identificador de enlace Instagram, incluso entre rutas `/p/` y `/reel/` y parámetros de seguimiento. Los datos verificados determinan la fecha real de un duplicado. Panorama muestra detalle y enlaces, y Producción usa el mismo total publicado.

Para actualizar esta captura se debe volver a consultar el listado Publicadas de la cuenta, verificar fechas y enlaces y reemplazar el JSON sin incorporar mensajes ni datos privados. Actualizar datos recarga la captura publicada, no consulta Meta directamente. Una sincronización permanente requiere una integración autenticada de Meta en un servidor; nunca colocar tokens en GitHub Pages. No se creó ninguna integración, credencial o tarea programada.

Verificación adicional: `node scripts/test-instagram.mjs` (palabras clave, fechas en cambio de mes, deduplicación y conteos del registro real).

## Actualización 20260928-6: insights privados

El botón Insights de Instagram abre un visor de copias privadas en el navegador, independiente del acceso a las fuentes comerciales. Las métricas NO se incorporan al repositorio ni a los recursos públicos de GitHub Pages. Se guardan bajo `bruner.marketing.privateInsights.v1` en el navegador que importa la copia. Esto no constituye un almacén compartido ni una integración automática con Meta. El visor local no permite consultar métricas de otro dispositivo.

El visor muestra el período observado en Instagram, fecha de consulta, métricas de cuenta, porcentajes por formato y audiencia, y una tabla ordenable/filtrable por curso con métricas de piezas verificadas. Cuenta y contenido conservan su fuente y alcance de consulta: no se suman alcances de piezas como personas únicas, no se equipara el período móvil con el mes comercial, ni se calculan métricas no observadas. Cero es distinto de dato ausente (—).

Importación de JSON validado mediante archivo o pegado, exportación local, sin llamadas de red desde el módulo de insights. Se rechazan cuentas diferentes, valores negativos/no numéricos, porcentajes fuera de rango, URLs externas y publicaciones duplicadas. Solo se conservan campos admitidos; no se importan credenciales. La copia real queda fuera del repositorio. Pruebas: `node scripts/test-insights.mjs`, con datos sintéticos.
