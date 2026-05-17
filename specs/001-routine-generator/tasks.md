# Tasks: Generador de Rutinas

**Input**: Design documents from `/specs/001-routine-generator/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. Dependencias de jspdf y html2canvas ya están instaladas. No hay tareas críticas de setup adicionales.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Refactor basic HTML structure from `public/generador_rutina_v1.html` to Vue template and styles in `src/components/RoutineGenerator.vue`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Creación y Edición de Rutinas (Priority: P1) 🎯 MVP

**Goal**: Como profesional de la salud, quiero poder crear y editar una rutina de cuidado de la piel para un paciente, agregando pasos y productos, para personalizar su tratamiento.

**Independent Test**: Can be fully tested by creating a routine in the UI, adding multiple steps (AM/PM) and products, and verifying the state updates correctly without errors.

### Implementation for User Story 1

- [x] T002 [US1] Implement reactive state (`RoutineState`, `RoutineStep`) and add/remove logic in `src/components/RoutineGenerator.vue`
- [x] T003 [US1] Implement Edit and Preview toggle modes rendering logic in `src/components/RoutineGenerator.vue`
- [x] T004 [US1] Add "Rutina" tab and integrate RoutineGenerator component in `src/pages/PatientDetail.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Descarga de Rutina en PDF (Priority: P1)

**Goal**: Como profesional de la salud, quiero poder descargar la rutina generada en un formato PDF, para podérsela enviar o imprimir al paciente.

**Independent Test**: Can be fully tested by clicking the "Descargar PDF" button after creating a routine and verifying that a PDF file is downloaded containing the correct information and styling.

### Implementation for User Story 2

- [x] T005 [US2] Implement PDF generation logic (export HTML to canvas and download) using `jspdf` and `html2canvas` in `src/components/RoutineGenerator.vue`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Guardar y Recuperar Rutina (Priority: P1)

**Goal**: Como profesional de la salud, quiero poder guardar la rutina creada en el servidor asociado al paciente y recuperarla en consultas futuras, para poder llevar un seguimiento de su tratamiento.

**Independent Test**: Can be fully tested by clicking a "Guardar" button, verifying a successful API request, and then reloading the page to ensure the routine is fetched and populated correctly.

### Implementation for User Story 3

- [x] T006 [P] [US3] Modify `src/components/RoutineGenerator.vue` to accept initial routine prop and emit save events.
- [x] T007 [US3] Implement logic to map and format frontend routine models to API string payloads (in `day_routine` and `night_routine`) in `src/pages/PatientDetail.vue`
- [x] T008 [US3] Wire up fetch (`onMounted`) and save (`guardarApoyo`) actions to the RoutineGenerator component in `src/pages/PatientDetail.vue`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Code cleanup and styling fine-tuning across the new component

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. They should mostly be implemented sequentially based on the numbering.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Depends on User Story 1 (UI needs to exist to print PDF).
- **User Story 3 (P1)**: Depends on User Story 1 (Data needs to exist to save it).

### Parallel Opportunities

- T006 can be done in parallel once US1 is finished, while US2 is being implemented.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CRITICAL)
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently in the browser.

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently 
4. Add User Story 3 → Test independently
