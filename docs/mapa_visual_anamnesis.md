# Mapa Visual de la Pantalla de Anamnesis Dermatocosmiátrica

Este documento detalla la arquitectura visual, categorías, orden jerárquico y opciones interactivas de la vista de anamnesis (`AnamnesisHybridView.vue`).

---

## 📐 Estructura General

La interfaz está dividida en un diseño responsivo de dos columnas (en pantallas de escritorio y tablets en horizontal):
1. **Columna Principal (Izquierda, 8 cols)**: 4 categorías clínicas temáticas en tarjetas independientes colapsables sin números en los encabezados.
2. **Columna Lateral Sticky (Derecha, 4 cols)**: Resumen Clínico en Vivo (`Live Summary`), reactivo en tiempo real con alertas y perfil cutáneo (colapsado por defecto).

```
┌──────────────────────────────────────────────────────────┬────────────────────────┐
│  COLUMNA PRINCIPAL (Formulario Clínico)                  │  LATERAL STICKY        │
│                                                          │                        │
│  [1] Evaluación Cutánea & Fototipo             [ v / ^ ] │  Resumen Clínico       │
│  [2] Salud General & Antecedentes Médicos      [ v / ^ ] │  en Vivo               │
│  [3] Seguridad, Medicación & Contraindicaciones[ v / ^ ] │  (Alertas, fototipo,   │
│  [4] Hábitos & Estilo de Vida                  [ v / ^ ] │   biotipo, factores)   │
└──────────────────────────────────────────────────────────┴────────────────────────┘
```

---

## 🗂️ Categoría 1: Evaluación Cutánea & Fototipo

*Icono: `face` (ámbar) | Header colapsable*

### 1.1 Fototipo - Clasificación de Fitzpatrick
- **Label**: Alineado sobre la izquierda con badge de tipo activo (ej. `Fototipo 2`).
- **Opciones interactivas**: 6 óvalos continuos distribuidos uniformemente de punta a punta (`justify-between`), con color real representativo de la piel:
  - `1`: Piel muy clara / Alabastro (`#FDE4D0`)
  - `2`: Piel clara (`#F3C9A8`)
  - `3`: Piel clara a intermedia (`#DEB08E`)
  - `4`: Piel intermedia / Mediterránea (`#C58E6B`)
  - `5`: Piel oscura (`#8C5835`)
  - `6`: Piel negra (`#42281D`)
- **Leyenda inferior**: Texto descriptivo automático según la selección.

### 1.2 Biotipo Cutáneo (Selección única)
- **Formato**: En la misma línea horizontal (Label a la izquierda y selector segmentado continuo a la derecha, estilo `scale-row`).
- **Opciones**:
  - `Normal` | `Seca` | `Grasa` | `Mixta`

### 1.3 Condiciones de la Piel (Selección múltiple)
- **Formato**: Píldoras individuales (`32px` de alto, fondo suave inactivo, azul `primary` activo) con distribución simétrica expandida de 3 filas:
  - **Fila superior (3 columnas)**: `[ Sensible / Reactiva ]` `[ Deshidratada ]` `[ Acneica ]`
  - **Fila central (ancho completo)**: `[ Discromia (Hipopigmentaciones / hiperpigmentaciones) ]`
  - **Fila inferior (2 columnas)**: `[ Madura ]` `[ Fotoenvejecida ]`

### 1.4 Evaluación de Riesgos Locales (2 Columnas centradas)
- **¿Herpes Simple?**: `[ No | Sí ]` *(centrado en su columna)*
- **¿Cicatrización con queloides?**: `[ No | Sí ]` *(centrado en su columna)*

---

## 🗂️ Categoría 2: Salud General & Antecedentes Médicos

*Icono: `favorite` (verde azulado / teal) | Header colapsable*

### 2.1 Patologías Evaluadas (Grilla 2 columnas / Tarjetas expandibles)
Cada ítem cuenta con un toggle `[ No | Sí ]` y, al seleccionar **Sí**, despliega un campo de texto para especificar diagnóstico/medicación:
- Cardiopatías
- Hipertensión arterial
- Diabetes
- Problemas tiroideos
- Trastornos autoinmunes / cicatrización
- Epilepsia / problemas neurológicos
- Enfermedades renales
- Alteraciones de la coagulación

### 2.2 Antecedentes Familiares
- **Campo de texto libre**: `Antecedentes familiares relevantes` (diabetes, hipertensión, afecciones cutáneas familiares).

### 2.3 Alergias Conocidas (Grilla 2 columnas / Desplegable con detalle)
Toggles `[ No | Sí ]` que habilitan detalle de sustancia, alimento o metal:
- Medicamentos
- Cosméticos / reactivos
- Metales (níquel u otros)
- Alimentos
- Otras alergias

### 2.4 Historia Ginecológica (Filas completas)
Toggles `[ No | Sí ]` integrados:
- Embarazo o período de lactancia activo *(con alerta de color rosa)*
- Uso de anticonceptivos
- Climaterio / Menopausia

---

## 🗂️ Categoría 3: Seguridad, Medicación & Contraindicaciones

*Icono: `security` (rojo / negative) | Header colapsable*

### 3.1 Contraindicaciones Críticas de Gabinete (Bloque destacado en rojo)
Toggles de validación estricta `[ No | Sí ⚠️ ]`:
- Marcapasos o desfibrilador interno
- Implantes metálicos en zona de tratamiento
- Cáncer o antecedentes oncológicos recientes
- Infección activa o lesión abierta en zona de trabajo

### 3.2 Medicación y Suplementos (Grilla 2 columnas con despliegue de detalle)
Toggles `[ No | Sí ]` que abren campo para fármaco, tiempo y dosis:
- Anticoagulantes
- Isotretinoína (Roaccutan u orales derivados)
- Corticoides (orales o tópicos prolongados)
- Fotosensibilizantes
- Otros fármacos o suplementos diarios

### 3.3 Cirugías & Tratamientos Estéticos Previos (Campos de texto en 2 columnas)
- `Cirugías generales`: Quirúrgicas previas, cesárea, etc.
- `Tratamientos estéticos`: Láser, rellenos, toxina botulínica, peelings en los últimos 2 años.

---

## 🗂️ Categoría 4: Hábitos & Estilo de Vida

*Icono: `self_improvement` (azul) | Header colapsable*

### 4.1 Hábitos Cotidianos (3 columnas centradas)
- **¿Fuma?**: `[ No | Sí ]` *(centrado)*
- **¿Consume alcohol?**: `[ No | Sí ]` *(centrado)*
- **Agua adecuada (2L)**: `[ No | Sí ]` *(centrado)*

### 4.2 Escalas de Bienestar y Rutina (Label a la izquierda, toggle segmentado a la derecha)
- **Actividad física**: `[ Sedentaria | Moderada | Intensa ]`
- **Calidad del sueño**: `[ Mala | Regular | Buena ]`
- **Nivel de estrés**: `[ Bajo | Medio | Alto ]`

### 4.3 Cuidado & Exposición Solar (2 columnas de texto)
- `Uso de protector solar`: Frecuencia, FPS, reaplicación.
- `Exposición solar habitual`: Ocupación, actividades al aire libre, camas solares.

---

## 📋 Resumen Clínico en Vivo (Sidebar Sticky)

*Colapsable por defecto (`expand_more`)*

1. **Alertas de Seguridad**: Detección automática en rojo/naranja ante marcapasos, metales, oncología, isotretinoína, embarazo, etc.
2. **Perfil Cutáneo**:
   - Fototipo activo con su badge de color real.
   - Biotipo cutáneo (`Normal`, `Seca`, `Grasa`, `Mixta`).
   - Badges de condiciones de la piel detectadas.
3. **Factores de Estilo de Vida**:
   - Consumo de agua, tabaco, alcohol y nivel de estrés.
4. **Resumen Rápido para Rutina**:
   - Tarjeta sintética con los datos clave para derivar directamente al generador de rutina cosmética.
