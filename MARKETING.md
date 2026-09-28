# Centro de marketing, contenidos y demanda

Página independiente: `marketing.html`. Publicación: GitHub Pages del repositorio actual.

## Datos y arquitectura

- Ingreso: el mismo `adminLogin` y la misma clave de gestión. Token solo en memoria; no hay claves nuevas ni claves en el código.
- Lectura comercial: `partnerDashboard`. Ventas, importes abonados, metas, desglose por curso/sede, serie diaria y procedencias son respuestas del backend vigente. No se recalculan inscripciones, ventas o cruces de teléfonos en marketing.
- Oferta: `upcomingCourses`. Se conservan los cupos y la deduplicación de inscriptos del backend. La capacidad visual reproduce gestión: máximo entre capacidad informada e inscriptos + disponibles. La fuente omite cursos marcados “Completo”; los suspendidos o devueltos sin cupos no se promocionan.
- Presentación de horarios, promociones y proyección: generada desde `index.html` y `gestion.html` mediante `node scripts/build-marketing-reference.cjs`. El módulo generado está versionado. Después de modificar las reglas comerciales originales, regenerarlo y ejecutar las pruebas de paridad.
- La facturación aquí es el monto abonado en las ventas, como en gestión; no se confunde con los ingresos efectivos del reporte de cobros.
- Carga independiente de comercial, cursos y cada mes histórico. Tiempo límite por consulta de 45 segundos. El ingreso termina al autenticar, sin esperar que las fuentes de datos funcionen. Una respuesta vieja no puede reemplazar el mes seleccionado posteriormente.
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
