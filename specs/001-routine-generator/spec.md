# Feature Specification: Generador de Rutinas

**Feature Branch**: `001-routine-generator`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "necesito hacer una pantalla en la seccion de paciente para realizar una rutina y descarla en pdf, guardarla en un servicio y poder recuperarla desp. Hay una ejemplo de lo que necesito en .../public/generador_rutina_v1.html y puedes construirla sobre .../src/components/RoutineGenerator.vue"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Creación y Edición de Rutinas (Priority: P1)

Como profesional de la salud, quiero poder crear y editar una rutina de cuidado de la piel para un paciente, agregando pasos y productos, para personalizar su tratamiento.

**Why this priority**: Es la funcionalidad principal (núcleo) de la pantalla. Sin poder armar una rutina con sus productos, el resto de las funcionalidades no tienen sentido.

**Independent Test**: Can be fully tested by creating a routine in the UI, adding multiple steps (AM/PM) and products, and verifying the state updates correctly without errors.

**Acceptance Scenarios**:

1. **Given** que estoy en la pantalla "Generador de Rutina" de un paciente, **When** hago clic en "Agregar Producto" en la sección AM, **Then** se añade un nuevo campo para ingresar un producto en esa sección.
2. **Given** que tengo productos en la rutina, **When** modifico los textos de los productos o las indicaciones, **Then** la vista previa se actualiza en tiempo real o al cambiar al modo de vista previa.

---

### User Story 2 - Descarga de Rutina en PDF (Priority: P1)

Como profesional de la salud, quiero poder descargar la rutina generada en un formato PDF, para podérsela enviar o imprimir al paciente.

**Why this priority**: El PDF es el entregable principal que el paciente se lleva para seguir su tratamiento.

**Independent Test**: Can be fully tested by clicking the "Descargar PDF" button after creating a routine and verifying that a PDF file is downloaded containing the correct information and styling.

**Acceptance Scenarios**:

1. **Given** una rutina con al menos un producto, **When** hago clic en "Descargar PDF", **Then** el sistema procesa la vista actual y descarga un archivo PDF legible y con el formato adecuado.

---

### User Story 3 - Guardar y Recuperar Rutina (Priority: P1)

Como profesional de la salud, quiero poder guardar la rutina creada en el servidor asociado al paciente y recuperarla en consultas futuras, para poder llevar un seguimiento de su tratamiento y hacer modificaciones rápidas sin empezar de cero.

**Why this priority**: Es fundamental para la persistencia de datos y el historial clínico del paciente en el sistema.

**Independent Test**: Can be fully tested by clicking a "Guardar" button, verifying a successful API request, and then reloading the page to ensure the routine is fetched and populated correctly.

**Acceptance Scenarios**:

1. **Given** una nueva rutina creada, **When** hago clic en "Guardar Rutina", **Then** el sistema envía los datos al backend y confirma que se ha guardado exitosamente.
2. **Given** que un paciente tiene una rutina guardada previamente, **When** ingreso a la sección "Generador de Rutina" de ese paciente, **Then** el sistema carga automáticamente la última rutina guardada.

---

### Edge Cases

- ¿Qué pasa cuando el usuario intenta descargar un PDF de una rutina completamente vacía? (Debería permitirlo pero mostrarse vacío, o mostrar una alerta).
- ¿Cómo maneja el sistema errores de red al intentar guardar o recuperar la rutina desde el backend? (Debería mostrar un mensaje de error amigable y permitir reintentar).
- ¿Qué pasa si el texto de un producto o indicación es extremadamente largo? (El diseño en la UI y en el PDF debe manejar saltos de línea sin romperse).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir iniciar una nueva rutina con una estructura predefinida (ej. Sección AM, Sección PM, etc.).
- **FR-002**: El sistema DEBE permitir agregar y eliminar dinámicamente pasos/productos a cada sección de la rutina.
- **FR-003**: El sistema DEBE proveer un botón o acción para alternar entre "Modo Edición" y "Modo Vista Previa" (o un diseño que muestre ambas si corresponde).
- **FR-004**: El sistema DEBE utilizar las librerías `jspdf` y `html2canvas` para generar un archivo PDF desde el cliente a partir del contenido de la rutina.
- **FR-005**: El sistema DEBE conectarse con la API/servicio configurado (via Axios) para persistir el JSON o estructura de la rutina asociada al `patientId` actual.
- **FR-006**: El sistema DEBE hacer un GET a la inicialización del componente para verificar si existe una rutina guardada para el `patientId` y poblar el formulario de ser así.

### Key Entities *(include if feature involves data)*

- **Rutina**: Representa el plan de cuidado asignado a un paciente. 
   - Atributos clave: `id_paciente`, `fecha_creacion`, `secciones` (AM, PM, etc.), `productos` dentro de cada sección (nombre, indicaciones).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las rutinas generadas se pueden descargar en formato PDF y el diseño se asemeja al prototipo en `generador_rutina_v1.html`.
- **SC-002**: El usuario puede crear, guardar y recargar la página recuperarando los datos de la rutina sin pérdida de información (100% data retention rate on reload).
- **SC-003**: Las llamadas al servicio de guardar (POST/PUT) y recuperar (GET) responden de manera exitosa y manejan errores adecuadamente.
