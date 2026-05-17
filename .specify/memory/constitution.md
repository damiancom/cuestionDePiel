<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0 (initial ratification)
- Added sections: All (initial constitution)
  - Principle I: Simplicidad Primero
  - Principle II: Seguridad del Paciente
  - Principle III: Separación de Responsabilidades
  - Principle IV: UX Clínica Eficiente
  - Principle V: Consistencia Tecnológica
  - Section: Stack Tecnológico
  - Section: Flujo de Desarrollo
  - Section: Governance
- Removed sections: None
- Templates requiring updates:
  - plan-template.md ✅ (aligned, no changes needed)
  - spec-template.md ✅ (aligned, no changes needed)
  - tasks-template.md ✅ (aligned, no changes needed)
- Follow-up TODOs: None
-->

# Sistema Médico Vue — Constitution

## Core Principles

### I. Simplicidad Primero

Toda solución DEBE ser lo más simple y eficiente posible. No se permite
sobreingeniería ni abstracciones innecesarias. Cada componente, servicio o
función DEBE tener una razón clara para existir. Si una solución más simple
logra el mismo resultado, esa DEBE ser la opción elegida.

**Rationale**: Un sistema médico DEBE ser fácil de mantener y depurar.
La complejidad innecesaria introduce riesgos en un dominio donde la
fiabilidad es crítica.

### II. Seguridad del Paciente

Toda ruta que acceda a datos de pacientes DEBE estar protegida por
autenticación Firebase. Los tokens JWT DEBEN validarse en cada request al
backend. El sistema NUNCA DEBE exponer datos sensibles en logs, consola o
respuestas de error públicas. Las sesiones expiradas DEBEN redirigir
automáticamente al login.

**Rationale**: Los datos médicos son información sensible protegida por
regulaciones de privacidad. La seguridad no es opcional.

### III. Separación de Responsabilidades

La aplicación DEBE mantener una separación clara entre capas:

- **Páginas** (`src/pages/`): Lógica de UI y presentación
- **Servicios** (`src/services/`): Comunicación HTTP y autenticación
- **Router** (`src/router/`): Navegación y guards de acceso
- **Store** (`src/store/`): Estado compartido via Pinia
- **Componentes** (`src/components/`): Elementos reutilizables de UI

Ninguna capa DEBE asumir responsabilidades de otra. Los servicios API
NO DEBEN contener lógica de presentación. Las páginas NO DEBEN hacer
llamadas HTTP directas sin pasar por los servicios.

**Rationale**: La separación de capas facilita el testing, el
mantenimiento y la evolución independiente de cada parte.

### IV. UX Clínica Eficiente

La interfaz DEBE priorizar la velocidad de uso para el profesional médico.
Los formularios DEBEN ser claros, con validaciones visibles y mensajes en
español. La navegación DEBE ser predecible: listas → detalle → edición.
Los componentes Quasar DEBEN usarse de forma consistente en toda la app.

**Rationale**: Los profesionales de salud trabajan bajo presión de tiempo.
Una UI confusa o lenta impacta directamente la atención al paciente.

### V. Consistencia Tecnológica

Todo el frontend DEBE usar exclusivamente:

- **Vue 3** con Composition API o Options API (no mezclar dentro de un
  mismo componente sin justificación)
- **Quasar Framework** para componentes UI
- **Axios** para llamadas HTTP con interceptors centralizados
- **Firebase Auth** para autenticación
- **Pinia** para gestión de estado global

No se DEBEN introducir librerías adicionales sin justificación explícita
documentada.

**Rationale**: Un stack consistente reduce la curva de aprendizaje,
simplifica el debugging y evita conflictos entre dependencias.

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework UI | Vue 3 | ^3.4.21 |
| Component Library | Quasar | ^2.15.10 |
| HTTP Client | Axios | ^1.12.2 |
| Autenticación | Firebase Auth | ^12.10.0 |
| State Management | Pinia | ^2.1.7 |
| Router | Vue Router | ^4.3.0 |
| Build Tool | Vite (via @quasar/app-vite) | ^1.5.16 |
| PDF Generation | jsPDF + html2canvas | ^3.0.4 / ^1.4.1 |

**Idioma del código**: Comentarios y UI en español. Nombres de variables
y funciones en español o inglés según convención existente en cada archivo.

## Flujo de Desarrollo

1. Toda nueva feature DEBE comenzar con especificación clara del
   requerimiento antes de codificar.
2. Los cambios DEBEN verificarse localmente con `npx quasar dev` antes
   de considerar completos.
3. Los errores de API DEBEN manejarse con feedback visual al usuario
   (notificaciones Quasar).
4. Cada commit DEBE representar un cambio funcional y coherente.

## Governance

- Esta constitución es el documento rector del proyecto. Toda decisión de
  diseño o implementación DEBE ser consistente con estos principios.
- Las enmiendas requieren documentación explícita del cambio, la razón, y
  actualización de la versión según semver:
  - **MAJOR**: Cambio incompatible en principios o stack tecnológico
  - **MINOR**: Nuevo principio o expansión material de una sección
  - **PATCH**: Aclaraciones, correcciones de redacción
- En caso de conflicto entre velocidad de entrega y estos principios,
  los principios prevalecen.

**Version**: 1.0.0 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-11
