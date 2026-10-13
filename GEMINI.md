# Memoria de Diseño UI/UX y Estándares Frontend — Cuestión de Piel

Toda modificación, refactorización o nueva funcionalidad en el frontend (`cuestionDePiel`) **DEBE** respetar estrictamente este sistema de diseño normalizado.

---

## 1. Arquitectura de Layout y Navegación (Sidebar de Aplicación)

- **Estructura Base (`src/layouts/MainLayout.vue`)**:
  - Layout Quasar: `<q-layout view="hHh lpR fFf">`.
  - **Cabecera Superior (`.minimal-header`)**:
    - Fondo blanco (`#ffffff`), texto primario (`#1976d2`), borde inferior `1px solid #e0e4ea`, sin sombra (`box-shadow: none`).
    - Izquierda: Botón hamburguesa (`icon="menu"`, visible en desktop `gt-sm`) para colapsar/expandir el sidebar + Avatar del centro (`/centro-avatar.png`) + Título `"Cuestión de piel"` (`text-weight-bold text-primary text-subtitle1`) + Badge `Workspace` (`color="blue-1" text-color="primary"`) con subtítulo `"Panel Dermatocosmiátrico"`.
    - Derecha: Avatar del usuario, nombre en `text-primary text-caption text-weight-medium` y botón de cerrar sesión (`icon="logout"`).
  - **Sidebar Lateral Izquierdo (`q-drawer.app-sidebar-drawer`)**:
    - Visible en desktop (`v-if="$q.screen.gt.sm"`), ancho `230px`, fondo `#ffffff`, borde derecho `1px solid #e0e4ea`.
    - Navegación dividida en **3 bloques temáticos** con encabezados `text-caption text-weight-bold text-grey-6`:
      1. **CLÍNICA**: `Pacientes` (`/pacientes`), `Alta Paciente` (`/pacientes/nuevo`), `Agenda` (`/agenda`).
      2. **ATENCIÓN**: `Servicios` (`/servicios`), `Consentimiento` (`/consentimiento`).
      3. **GESTIÓN**: `Productos` (`/catalogo`), `Ventas` (`/ventas`), `Mensajes` (`/mensajes-whatsapp`), `Proveedores` (`/proveedores`).
    - **Ítems del Sidebar (`.sidebar-item`)**:
      - Geometría: `border-radius: 8px`, color base `#475569`.
      - Hover: `background-color: #f4f6fa`, `color: #1976d2`.
      - Estado Activo (`.sidebar-item-active`): `background-color: #eaf1fb !important`, `color: #1976d2 !important`, `font-weight: 600`.
  - **Navegación Móvil (`lt-md`)**:
    - Barra inferior (`q-footer.minimal-footer`) con `q-tabs` y `q-route-tab`.

- **Encabezado Estándar de Páginas (`<q-page padding>`)**:
  - Contenedor: `<div class="row items-center justify-between q-mb-md q-col-gutter-sm">`.
  - **Bloque Izquierdo (Título)**:
    - Fila con `<q-icon name="..." size="24px" color="primary" class="q-mr-sm" />` + `<div class="text-h5 text-primary text-weight-bold ellipsis">Título</div>`.
    - Debajo: Subtítulo o contador en `<div class="text-caption text-grey-7">...</div>`.
  - **Bloque Derecho (Buscador y Acciones)**:
    - `<div class="col-12 col-sm-auto row items-center q-gutter-sm">` con el buscador `.minimal-search-input` a la izquierda y el botón primario `.minimal-btn-save` a la derecha.

---

## 2. Paleta de Colores Oficial (Tono Celeste / Azul Institucional)

Configurada en `src/css/quasar.variables.scss` y `src/App.vue`:

| Token / Variable | Valor Hex / RGB | Uso Obligatorio |
| :--- | :--- | :--- |
| **Primary (`$primary`)** | `#1976d2` | Color institucional principal: títulos, íconos principales, botones primarios (`.minimal-btn-save`), bordes en foco, indicadores de pestañas activas. |
| **Primary Hover** | `#125ea7` | Hover en botones primarios (`.minimal-btn-save:hover`). |
| **Primary Soft / Tint** | `#eaf1fb` | Ítem activo del sidebar, hover de filas en tablas y listas cebra, fondos suaves informativos (`bg-blue-1`). |
| **Primary Focus Ring** | `rgba(25, 118, 210, 0.1)` | Sombra exterior de foco (`box-shadow: 0 0 0 3px ...`) en `.minimal-input:focus-within`. |
| **Secondary (`$secondary`)** | `#26a69a` | Acciones secundarias complementarias (ej. exportación/descarga). |
| **Positive (`$positive`)** | `#21ba45` | Confirmaciones de éxito, Consentimiento vigente (`Consentimiento OK`), botones de WhatsApp. |
| **Negative (`$negative`)** | `#c10015` (Hover `#9a0011`) | Botones de eliminación (`.minimal-btn-delete`), alertas críticas, consentimiento faltante. |
| **Warning (`$warning`)** | `#f2c037` | Estados pendientes o desactualizados. |
| **Fondo de Aplicación** | `#f8f9fa` | Color de fondo general en `body`. Texto principal en `#1f2937`. |
| **Superficie de Tarjetas** | `#ffffff` / `#f9fafb` | `.minimal-card` (`#ffffff`, borde `#e0e4ea`, radio `12px`) y `.minimal-create-card` (`#f9fafb`, borde `#ececec`, radio `16px`). |

---

## 3. Ficha del Paciente: Dossier Clínico Estructurado (`PatientDetail.vue`)

- **Disposición en Desktop**:
  - **Columna Izquierda (`col-12 col-md-4 col-lg-3 gt-sm`)**: Tarjeta `.patient-sidebar` (`position: sticky; top: 20px; border-radius: 14px;`), colapsable con botón `chevron_left` (`toggleSidebar`) para permitir expandir el área clínica al 100% (`col-12`).
  - **Columna Derecha (`col-12 col-md-8 col-lg-9` o `col-12` al colapsar)**: Tarjeta principal con las pestañas clínicas.
- **Estructura Interna del Dossier del Paciente (3 Bloques Temáticos)**:
  1. **Bloque Identidad**: Contenedor `q-pa-sm bg-grey-1 rounded-borders text-center` con Nombre y Apellido (`text-subtitle1 text-weight-bold text-primary`), Edad calculada y Fecha de nacimiento (`dd/mm/yyyy`).
  2. **Bloque `CONTACTO`**: Título `text-caption text-weight-bold text-grey-6`, Celular con ícono `smartphone` y botón directo a WhatsApp (`fa-brands fa-whatsapp`), Teléfono fijo (si existe), Dirección + Localidad (`location_on`), y E-mail (`email`).
  3. **Bloque `CLÍNICA`**: Título `text-caption text-weight-bold text-grey-6`, Profesión y Nota adicional (`white-space: pre-wrap`).
  4. **Pie del Dossier**: Badge interactivo de estado de Consentimiento Informado, `ID: {{ patient.id }}` y botón `"Editar Perfil"` (`class="full-width minimal-btn-save"`).
- **Orden Oficial de Pestañas Clínicas**:
  1. `salud-habitos` — **Antecedentes Clínicos**
  2. `evaluacion-cutanea` — **Evaluación Cosmiátrica**
  3. `mapeo_facial` — **Análisis Facial**
  4. `rutina` — **Rutina**
  5. `sesiones` — **Sesiones**
  6. `consentimiento` — **Consentimiento**
  7. `mensajes` — **Mensajes** (visible si el paciente tiene teléfono cargado)

---

## 4. Tablas y Listas: Efecto Cebra (Zebra Striping) Normalizado

Definido globalmente en `src/App.vue`. Aplica a todas las tablas Quasar (`.q-table`) y a todas las listas con clase `.zebra-list`:

- **Filas Impares (`odd`)**: `background-color: #ffffff;`
- **Filas Pares (`even`)**: `background-color: #f4f6fa;`
- **Hover sobre Fila (`tr:hover`, `.zebra-list .q-item:hover`)**: `background-color: #eaf1fb !important;`
- **Reglas estrictas**:
  - **Nunca** sobreescribir el color de fondo de filas ni el `tr:hover` en bloques `<style scoped>` de páginas individuales.
  - En listas (`<q-list>`), agregar siempre la clase `zebra-list` para mantener la misma alternancia visual.
  - Cabeceras de tabla (`thead th`): texto en mayúsculas (`12px–13px`), `font-weight: 700`, color `#6b7280`, borde inferior `#e8edf5`.

---

## 5. Botones: Colores, Geometría y Disposición

Definidos globalmente en `src/App.vue`:

- **Geometría Común (`.minimal-btn`, `.minimal-btn-save`, `.minimal-btn-delete`)**:
  - `border-radius: 8px`
  - `font-weight: 500`
  - `font-size: 15px`
  - `min-width: 90px` (en pantallas `< 600px`: `min-width: auto; padding: 6px 12px;`)
  - `box-shadow: none`
  - `text-transform: none` (nunca texto todo en mayúsculas)
- **Variantes de Botón**:
  1. **Primario / Guardar / Crear (`.minimal-btn-save`)**:
     - Fondo `#1976d2`, texto `#ffffff`, hover `#125ea7`.
     - Uso: Guardar formularios, crear registros (`+ Agregar`, `Nuevo...`), confirmar modales.
  2. **Destructivo / Eliminar (`.minimal-btn-delete`)**:
     - Fondo `#c10015 !important`, texto `#ffffff !important`, hover `#9a0011 !important`.
     - Uso: Confirmación de borrado o acciones destructivas.
  3. **Secundario / Cancelar (`.minimal-btn`)**:
     - Propiedades Quasar: `flat color="grey-8" class="minimal-btn"`.
     - Uso: Cancelar edición, cerrar diálogos, acciones secundarias neutras.
- **Disposición de Botones en Formularios y Diálogos**:
  - Alineados siempre a la **derecha**: `<div class="row q-gutter-sm justify-end q-mt-md">` o `<q-card-actions align="right" class="minimal-actions">`.
  - Orden obligatorio de izquierda a derecha:
    1. **Cancelar** (`flat color="grey-8" class="minimal-btn"`)
    2. **Acción Principal** (`color="primary" class="minimal-btn-save"` o `color="negative" class="minimal-btn-delete"`)

---

## 6. Formato Normalizado de Inputs y Buscadores

Definidos globalmente en `src/App.vue`:

1. **Inputs de Formulario (`.minimal-input`)**:
   - **Props obligatorias en `<q-input>` y `<q-select>`**: `borderless dense class="minimal-input"`.
   - **Prohibido** usar la prop `outlined` junto con `.minimal-input` (evita bordes dobles).
   - **Estilo visual**:
     - Fondo: `#f8fafc !important`
     - Borde: `1px solid #e0e4ea !important`
     - Radio: `border-radius: 12px`
     - Padding interno: `4px 12px`
     - Tamaño de fuente: `15px`
   - **Estado Focus (`.minimal-input:focus-within`)**:
     - Borde: `border-color: #1976d2 !important`
     - Fondo: `background: #ffffff !important`
     - Halo: `box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important`

2. **Buscadores y Filtros de Cabecera (`.minimal-search-input`)**:
   - **Props obligatorias**: `dense borderless class="minimal-search-input"`.
   - **Estilo visual**:
     - Fondo transparente (`background: transparent !important`), sin caja cerrada.
     - Línea inferior en `.q-field__control`: `border-bottom: 1.5px solid #e0e4ea !important`, `border-radius: 0 !important`, `padding: 0 12px !important`.
     - Dimensiones: `min-width: 140px; max-width: 240px;` (en móvil `< 600px`: `flex: 1; max-width: none;`).
   - **Estado Focus (`.minimal-search-input:focus-within .q-field__control`)**:
     - `border-color: #1976d2 !important`.
