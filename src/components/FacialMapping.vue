<template>
  <div class="facial-mapping-container q-gutter-y-md">
    <!-- Encabezado alineado con las demás pestañas -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="face" class="q-mr-sm" size="24px" />
          Análisis Facial
        </div>
        <div class="text-caption text-grey-8">
          Mapeo anatómico interactivo y protocolo de diagnóstico óptico (Luz Blanca • Luz Polarizada • Luz UV)
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal: Secciones Colapsables (Igual que Evaluación Cutánea y Salud & Hábitos) -->
      <div class="col-12 col-lg-8 q-gutter-y-md">

        <!-- ===================================================================== -->
        <!-- SECCIÓN COLAPSABLE: MAPA FACIAL INTERACTIVO                           -->
        <!-- ===================================================================== -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('mapaFacial')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="indigo-1" text-color="indigo-9" icon="face" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Mapa Facial Interactivo</div>
                <div class="text-caption text-grey-7">Rostro vectorial anatómico HD para marcación de zonas y trazos libres</div>
              </div>
            </div>
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-badge
                v-if="markers.length > 0"
                color="indigo"
                :label="`${markers.length} ${markers.length === 1 ? 'zona' : 'zonas'}`"
              />
              <q-btn
                flat
                round
                dense
                color="grey-7"
                :icon="collapsedSections.mapaFacial ? 'expand_more' : 'expand_less'"
                @click.stop="toggleSection('mapaFacial')"
              />
            </div>
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.mapaFacial">
              <q-separator />
              <q-card-section class="q-gutter-y-md">
                <!-- Barra de Herramientas del Mapa Facial -->
                <div class="hybrid-subitem q-pa-sm rounded-borders">
                  <div class="row items-center justify-between q-col-gutter-sm">
                    <!-- Selector de Modo (Pines vs Dibujo Libre) -->
                    <div class="col-12 col-sm-auto row items-center q-gutter-x-sm">
                      <span class="text-caption text-weight-medium text-grey-8">Herramienta:</span>
                      <q-btn-toggle
                        v-model="activeTool"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid"
                        toggle-color="primary"
                        color="grey-2"
                        text-color="grey-8"
                        :options="[
                          { label: 'Marcador (Pin)', value: 'pin', icon: 'place' },
                          { label: 'Dibujo Libre', value: 'draw', icon: 'gesture' }
                        ]"
                      />
                    </div>

                    <!-- Opciones de Dibujo Libre -->
                    <div v-if="activeTool === 'draw'" class="col-12 col-sm-auto row items-center q-gutter-x-sm">
                      <span class="text-caption text-weight-medium text-grey-8">Color:</span>
                      <div class="row q-gutter-x-xs items-center">
                        <q-btn
                          v-for="c in brushColors"
                          :key="c.hex"
                          round
                          dense
                          size="xs"
                          :style="{ backgroundColor: c.hex, border: brushColor === c.hex ? '2px solid #111' : '1px solid #ccc' }"
                          class="color-dot"
                          @click="brushColor = c.hex; isEraser = false"
                        >
                          <q-tooltip>{{ c.name }}</q-tooltip>
                        </q-btn>
                      </div>

                      <q-separator vertical inset class="q-mx-xs" />

                      <span class="text-caption text-weight-medium text-grey-8">Grosor:</span>
                      <q-slider
                        v-model="brushWidth"
                        :min="2"
                        :max="18"
                        :step="1"
                        style="width: 70px"
                        color="primary"
                        dense
                      />

                      <q-btn
                        flat
                        dense
                        round
                        size="sm"
                        :color="isEraser ? 'primary' : 'grey-7'"
                        icon="auto_fix_normal"
                        @click="isEraser = !isEraser"
                      >
                        <q-tooltip>Goma de borrar trazos</q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        dense
                        round
                        size="sm"
                        color="grey-7"
                        icon="undo"
                        :disable="canvasHistory.length === 0"
                        @click="undoStroke"
                      >
                        <q-tooltip>Deshacer último trazo</q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        dense
                        round
                        size="sm"
                        color="negative"
                        icon="layers_clear"
                        @click="clearCanvas"
                      >
                        <q-tooltip>Limpiar trazos libres</q-tooltip>
                      </q-btn>
                    </div>

                    <!-- Categoría por defecto cuando se usa Marcador (Pin) -->
                    <div v-else class="col-12 col-sm-auto row items-center q-gutter-x-xs">
                      <span class="text-caption text-weight-medium text-grey-8 q-mr-xs">Categoría rápida:</span>
                      <q-chip
                        v-for="cat in categories"
                        :key="cat.id"
                        clickable
                        dense
                        :outline="defaultCategoryId !== cat.id"
                        :color="cat.colorName"
                        text-color="white"
                        size="sm"
                        @click="defaultCategoryId = cat.id"
                      >
                        <q-icon :name="cat.icon" size="14px" class="q-mr-xs" />
                        {{ cat.shortLabel }}
                      </q-chip>
                    </div>
                  </div>
                </div>

                <!-- Contenido Principal: Lienzo de Cara + Puntos Marcados -->
                <div class="row q-col-gutter-md items-start">
                  <!-- Lienzo del Rostro -->
                  <div class="col-12 col-md-7">
                    <div class="hybrid-subitem overflow-hidden rounded-borders">
                      <div class="q-px-md q-py-xs bg-grey-1 row items-center justify-between border-bottom">
                        <span class="text-caption text-grey-8 flex items-center">
                          <q-icon :name="activeTool === 'pin' ? 'touch_app' : 'brush'" class="q-mr-xs" color="primary" />
                          {{ activeTool === 'pin' ? 'Hacé clic sobre una zona de la cara para marcarla' : 'Dibujá libremente sobre las zonas a tratar' }}
                        </span>
                        <q-toggle
                          v-model="showZoneGuides"
                          dense
                          size="xs"
                          color="primary"
                          label="Guías anatómicas"
                          class="text-caption text-grey-8"
                        />
                      </div>

                      <!-- Contenedor Interactivo del Rostro -->
                      <div
                        ref="faceContainerRef"
                        class="face-canvas-wrapper unselectable"
                        @click="handleFaceClick"
                      >
                        <!-- Vector HD Anatómico Detallado -->
                        <svg
                          viewBox="0 0 500 620"
                          class="face-background-svg"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <radialGradient id="skinGlow" cx="50%" cy="44%" r="48%">
                              <stop offset="0%" stop-color="#fffdfb" />
                              <stop offset="65%" stop-color="#fdf7f2" />
                              <stop offset="100%" stop-color="#f5ebe1" />
                            </radialGradient>

                            <linearGradient id="cheekShadeL" x1="0%" y1="0%" x2="100%" y2="50%">
                              <stop offset="0%" stop-color="#e8d5c4" stop-opacity="0.45" />
                              <stop offset="100%" stop-color="#fdf7f2" stop-opacity="0" />
                            </linearGradient>

                            <linearGradient id="cheekShadeR" x1="100%" y1="0%" x2="0%" y2="50%">
                              <stop offset="0%" stop-color="#e8d5c4" stop-opacity="0.45" />
                              <stop offset="100%" stop-color="#fdf7f2" stop-opacity="0" />
                            </linearGradient>

                            <linearGradient id="neckShade" x1="50%" y1="0%" x2="50%" y2="100%">
                              <stop offset="0%" stop-color="#e5d0be" stop-opacity="0.55" />
                              <stop offset="35%" stop-color="#f9f1ea" stop-opacity="0.2" />
                              <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                            </linearGradient>

                            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                              <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#5d4037" flood-opacity="0.08" />
                            </filter>
                          </defs>

                          <!-- Fondo clínico sutil -->
                          <rect width="500" height="620" fill="#fbfbf9" />

                          <!-- 1. Cuello, Trapecio y Clavículas -->
                          <g class="neck-and-shoulders" stroke="#546e7a" stroke-linecap="round" stroke-linejoin="round">
                            <path
                              d="M 192,438 C 194,485 182,530 105,562 L 395,562 C 318,530 306,485 308,438 Z"
                              fill="url(#neckShade)"
                              stroke="none"
                            />
                            <path d="M 192,438 C 194,488 182,532 95,568" fill="none" stroke-width="2" />
                            <path d="M 308,438 C 306,488 318,532 405,568" fill="none" stroke-width="2" />
                            <path d="M 205,465 C 218,512 236,545 244,565" fill="none" stroke="#90a4ae" stroke-width="1.3" stroke-dasharray="3,2" />
                            <path d="M 295,465 C 282,512 264,545 256,565" fill="none" stroke="#90a4ae" stroke-width="1.3" stroke-dasharray="3,2" />
                            <path d="M 125,568 Q 195,555 236,574" fill="none" stroke="#78909c" stroke-width="1.6" />
                            <path d="M 375,568 Q 305,555 264,574" fill="none" stroke="#78909c" stroke-width="1.6" />
                            <path d="M 238,570 Q 250,582 262,570" fill="none" stroke="#90a4ae" stroke-width="1.5" />
                          </g>

                          <!-- 2. Orejas Anatómicas (Izquierda y Derecha) -->
                          <g class="ears" stroke="#546e7a" fill="#f7ede4" stroke-linecap="round">
                            <path
                              d="M 134,238 C 110,226 98,252 104,288 C 109,318 122,340 142,334"
                              stroke-width="2"
                            />
                            <path d="M 129,250 C 115,246 110,268 115,292 C 119,310 128,322 137,320" fill="none" stroke="#8d6e63" stroke-width="1.2" opacity="0.6" />
                            <path d="M 124,274 C 118,282 122,298 132,302" fill="none" stroke="#8d6e63" stroke-width="1.1" opacity="0.5" />

                            <path
                              d="M 366,238 C 390,226 402,252 396,288 C 391,318 378,340 358,334"
                              stroke-width="2"
                            />
                            <path d="M 371,250 C 385,246 390,268 385,292 C 381,310 372,322 363,320" fill="none" stroke="#8d6e63" stroke-width="1.2" opacity="0.6" />
                            <path d="M 376,274 C 382,282 378,298 368,302" fill="none" stroke="#8d6e63" stroke-width="1.1" opacity="0.5" />
                          </g>

                          <!-- 3. Contorno Craneal y Línea Capilar Superior -->
                          <g class="cranium-hairline">
                            <path
                              d="M 132,228 C 122,125 170,48 250,48 C 330,48 378,125 368,228"
                              fill="#f3eae2"
                              stroke="#607d8b"
                              stroke-width="1.8"
                            />
                            <path d="M 155,105 Q 200,65 250,65 Q 300,65 345,105" fill="none" stroke="#b0bec5" stroke-width="1" />
                            <path d="M 142,140 Q 195,78 250,78 Q 305,78 358,140" fill="none" stroke="#cfd8dc" stroke-width="0.9" />
                          </g>

                          <!-- 4. Silueta Principal del Rostro -->
                          <path
                            d="M 250,82
                               C 324,82 368,136 368,226
                               C 368,288 356,348 334,394
                               C 314,434 280,468 250,470
                               C 220,468 186,434 166,394
                               C 144,348 132,288 132,226
                               C 132,136 176,82 250,82 Z"
                            fill="url(#skinGlow)"
                            stroke="#37474f"
                            stroke-width="2.4"
                            filter="url(#softShadow)"
                          />

                          <!-- Sombreado anatómico de pómulos y sienes -->
                          <path d="M 134,235 Q 155,295 190,340 Q 160,335 148,300 Z" fill="url(#cheekShadeL)" />
                          <path d="M 366,235 Q 345,295 310,340 Q 340,335 352,300 Z" fill="url(#cheekShadeR)" />

                          <!-- 5. Líneas de Mapeo Anatómico / Compartimentos Faciales -->
                          <g v-if="showZoneGuides" class="anatomical-guides" opacity="0.72">
                            <line x1="250" y1="68" x2="250" y2="480" stroke="#78909c" stroke-width="1" stroke-dasharray="5,5" />
                            <path d="M 138,162 Q 250,174 362,162" fill="none" stroke="#90a4ae" stroke-width="1.1" stroke-dasharray="4,4" />
                            <path d="M 226,166 L 232,216" fill="none" stroke="#90a4ae" stroke-width="1" stroke-dasharray="3,3" />
                            <path d="M 274,166 L 268,216" fill="none" stroke="#90a4ae" stroke-width="1" stroke-dasharray="3,3" />
                            <path
                              d="M 155,254 C 172,276 218,278 232,254"
                              fill="none"
                              stroke="#90a4ae"
                              stroke-width="1.1"
                              stroke-dasharray="3,3"
                            />
                            <path
                              d="M 268,254 C 282,278 328,276 345,254"
                              fill="none"
                              stroke="#90a4ae"
                              stroke-width="1.1"
                              stroke-dasharray="3,3"
                            />
                            <path d="M 140,268 Q 185,292 226,288" fill="none" stroke="#78909c" stroke-width="1.1" stroke-dasharray="4,4" />
                            <path d="M 360,268 Q 315,292 274,288" fill="none" stroke="#78909c" stroke-width="1.1" stroke-dasharray="4,4" />
                            <path d="M 150,332 Q 192,344 218,334" fill="none" stroke="#90a4ae" stroke-width="1" stroke-dasharray="4,4" />
                            <path d="M 350,332 Q 308,344 282,334" fill="none" stroke="#90a4ae" stroke-width="1" stroke-dasharray="4,4" />
                            <path d="M 225,318 C 204,344 196,374 202,406" fill="none" stroke="#607d8b" stroke-width="1.2" stroke-dasharray="4,3" />
                            <path d="M 275,318 C 296,344 304,374 298,406" fill="none" stroke="#607d8b" stroke-width="1.2" stroke-dasharray="4,3" />
                            <path d="M 212,388 C 206,418 208,442 214,458" fill="none" stroke="#90a4ae" stroke-width="1.1" stroke-dasharray="3,3" />
                            <path d="M 288,388 C 294,418 292,442 286,458" fill="none" stroke="#90a4ae" stroke-width="1.1" stroke-dasharray="3,3" />
                            <path d="M 216,422 Q 250,410 284,422" fill="none" stroke="#90a4ae" stroke-width="1.1" stroke-dasharray="3,3" />

                            <g fill="#546e7a" font-size="9" font-weight="600" text-anchor="middle" font-family="sans-serif" opacity="0.75">
                              <text x="250" y="128">FRENTE</text>
                              <text x="250" y="196">GLABELA</text>
                              <text x="154" y="218">SIEN</text>
                              <text x="346" y="218">SIEN</text>
                              <text x="182" y="308">PÓMULO</text>
                              <text x="318" y="308">PÓMULO</text>
                              <text x="174" y="372">MEJILLA</text>
                              <text x="326" y="372">MEJILLA</text>
                              <text x="250" y="284">DORSO NASAL</text>
                              <text x="250" y="446">MENTÓN</text>
                              <text x="250" y="518">CUELLO</text>
                            </g>
                          </g>

                          <!-- 6. Cejas Anatómicas con Trazo Pelo a Pelo -->
                          <g class="eyebrows">
                            <path
                              d="M 152,206 C 166,188 202,186 230,199 C 224,205 198,197 166,208 Z"
                              fill="#5d4037"
                              opacity="0.78"
                            />
                            <path d="M 154,205 Q 178,190 228,198" fill="none" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round" />

                            <path
                              d="M 348,206 C 334,188 298,186 270,199 C 276,205 302,197 334,208 Z"
                              fill="#5d4037"
                              opacity="0.78"
                            />
                            <path d="M 346,205 Q 322,190 272,198" fill="none" stroke="#3e2723" stroke-width="1.8" stroke-linecap="round" />
                          </g>

                          <!-- 7. Ojos Cerrados Relajados con Párpado y Pestañas -->
                          <g class="eyes-closed" fill="none" stroke-linecap="round">
                            <!-- Ojo Izquierdo -->
                            <path d="M 162,226 Q 195,212 226,228" stroke="#8d6e63" stroke-width="1.3" />
                            <path d="M 165,232 Q 195,222 224,233" stroke="#a1887f" stroke-width="0.9" />
                            <path d="M 164,238 Q 195,248 226,238" stroke="#37474f" stroke-width="2.2" />
                            <path d="M 168,240 L 164,246" stroke="#37474f" stroke-width="1.3" />
                            <path d="M 176,242 L 173,249" stroke="#37474f" stroke-width="1.3" />
                            <path d="M 185,243 L 183,251" stroke="#37474f" stroke-width="1.4" />
                            <path d="M 195,244 L 195,252" stroke="#37474f" stroke-width="1.4" />
                            <path d="M 205,243 L 206,251" stroke="#37474f" stroke-width="1.4" />
                            <path d="M 214,242 L 216,248" stroke="#37474f" stroke-width="1.3" />
                            <path d="M 222,240 L 225,245" stroke="#37474f" stroke-width="1.2" />
                            <path d="M 170,252 Q 196,260 222,248" stroke="#bcaaa4" stroke-width="1" stroke-dasharray="2,2" />

                            <!-- Ojo Derecho -->
                            <path d="M 274,228 Q 305,212 338,226" stroke="#8d6e63" stroke-width="1.3" />
                            <path d="M 276,233 Q 305,222 335,232" stroke="#a1887f" stroke-width="0.9" />
                            <path d="M 274,238 Q 305,248 336,238" stroke="#37474f" stroke-width="2.2" />
                            <path d="M 278,240 L 275,245" stroke="#37474f" stroke-width="1.2" />
                            <path d="M 286,242 L 284,248" stroke="#37474f" stroke-width="1.3" />
                            <path d="M 295,243 L 294,251" stroke="#37474f" stroke-width="1.4" />
                            <path d="M 305,244 L 305,252" stroke="#37474f" stroke-width="1.4" />
                            <path d="M 315,243 L 317,251" stroke="#37474f" stroke-width="1.4" />
                            <path d="M 324,242 L 327,249" stroke="#37474f" stroke-width="1.3" />
                            <path d="M 332,240 L 336,246" stroke="#37474f" stroke-width="1.3" />
                            <path d="M 278,248 Q 304,260 330,252" stroke="#bcaaa4" stroke-width="1" stroke-dasharray="2,2" />
                          </g>

                          <!-- 8. Nariz Anatómica (Dorso, Punta, Alas Nasales y Narinas) -->
                          <g class="nose" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M 236,216 C 239,252 237,292 232,318" stroke="#8d6e63" stroke-width="1.4" />
                            <path d="M 264,216 C 261,252 263,292 268,318" stroke="#8d6e63" stroke-width="1.4" />
                            <path d="M 244,324 C 247,321 253,321 256,324" fill="none" stroke="#78909c" stroke-width="1.5" />
                            <path d="M 246,334 C 248,336 252,336 254,334" fill="none" stroke="#455a64" stroke-width="2.2" />
                            <path d="M 239,330 C 241,334 245,334 246,331" fill="none" stroke="#37474f" stroke-width="2.4" />
                            <path d="M 261,330 C 259,334 255,334 254,331" fill="none" stroke="#37474f" stroke-width="2.4" />
                            <path d="M 234,324 C 230,328 232,334 238,333" fill="none" stroke="#546e7a" stroke-width="1.7" />
                            <path d="M 266,324 C 270,328 268,334 262,333" fill="none" stroke="#546e7a" stroke-width="1.7" />
                          </g>

                          <!-- 9. Filtro Labial -->
                          <g class="philtrum" stroke="#b0bec5" stroke-width="1.2" fill="none" stroke-linecap="round">
                            <path d="M 246,337 C 245,348 243,360 242,367" />
                            <path d="M 254,337 C 255,348 257,360 258,367" />
                          </g>

                          <!-- 10. Labios con Volumen y Definición Estética -->
                          <g class="lips">
                            <path
                              d="M 215,380 C 228,372 238,367 242,367 C 246,367 248,370 250,370 C 252,370 254,367 258,367 C 262,367 272,372 285,380 C 272,384 258,386 250,386 C 242,386 228,384 215,380 Z"
                              fill="#fce4ec"
                              stroke="#c2185b"
                              stroke-width="1.6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M 213,380 C 228,382 242,385 247,384 C 249,384 250,386 250,386 C 250,386 251,384 253,384 C 258,385 272,382 287,380"
                              fill="none"
                              stroke="#880e4f"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                            <circle cx="213" cy="380" r="1.5" fill="#880e4f" />
                            <circle cx="287" cy="380" r="1.5" fill="#880e4f" />
                            <path
                              d="M 215,380 C 222,398 236,408 250,408 C 264,408 278,398 285,380 C 275,385 262,387 250,387 C 238,387 225,385 215,380 Z"
                              fill="#fff0f5"
                              stroke="#c2185b"
                              stroke-width="1.6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path d="M 238,396 C 244,399 256,399 262,396" fill="none" stroke="#f48fb1" stroke-width="1.2" stroke-linecap="round" />
                            <path d="M 237,422 Q 250,427 263,422" fill="none" stroke="#cfd8dc" stroke-width="1.6" stroke-linecap="round" />
                          </g>

                          <!-- 11. Relieves y Pómulos -->
                          <g class="facial-contours" fill="none" stroke-linecap="round">
                            <path d="M 242,465 Q 250,470 258,465" stroke="#b0bec5" stroke-width="1.5" />
                            <path d="M 160,285 Q 185,295 210,290" stroke="#eceff1" stroke-width="1.5" stroke-dasharray="3,3" />
                            <path d="M 340,285 Q 315,295 290,290" stroke="#eceff1" stroke-width="1.5" stroke-dasharray="3,3" />
                          </g>
                        </svg>

                        <!-- Capa de Dibujo Libre (HTML5 Canvas) -->
                        <canvas
                          ref="drawCanvasRef"
                          class="draw-canvas-layer"
                          :class="{ 'canvas-active': activeTool === 'draw' }"
                          @mousedown="startDrawing"
                          @mousemove="draw"
                          @mouseup="stopDrawing"
                          @mouseleave="stopDrawing"
                          @touchstart.prevent="startDrawingTouch"
                          @touchmove.prevent="drawTouch"
                          @touchend.prevent="stopDrawing"
                        ></canvas>

                        <!-- Capa de Marcadores / Pines Interactivos -->
                        <div
                          v-for="(pin, index) in markers"
                          :key="pin.id"
                          class="face-pin"
                          :class="{ 'pin-selected': selectedMarkerId === pin.id }"
                          :style="{
                            left: `${pin.x}%`,
                            top: `${pin.y}%`,
                            backgroundColor: getCategoryColor(pin.category)
                          }"
                          @click.stop="onPinClick(pin)"
                        >
                          <span class="pin-number">{{ index + 1 }}</span>
                          <div class="pin-pulse" :style="{ borderColor: getCategoryColor(pin.category) }"></div>

                          <q-tooltip anchor="top middle" self="bottom middle" class="bg-grey-9 text-white shadow-3">
                            <div class="text-weight-bold">#{{ index + 1 }} · {{ pin.zone }}</div>
                            <div>{{ getCategoryLabel(pin.category) }}</div>
                            <div v-if="pin.note" class="text-caption text-grey-4">"{{ pin.note }}"</div>
                          </q-tooltip>
                        </div>
                      </div>

                      <!-- Leyenda rápida al pie del mapa -->
                      <div class="q-pa-xs bg-grey-1 row items-center justify-center q-gutter-x-sm text-caption text-grey-7 border-top">
                        <span class="row items-center"><span class="legend-dot" style="background: #e53935"></span> Acné</span>
                        <span class="row items-center"><span class="legend-dot" style="background: #f57c00"></span> Manchas</span>
                        <span class="row items-center"><span class="legend-dot" style="background: #8e24aa"></span> Arrugas</span>
                        <span class="row items-center"><span class="legend-dot" style="background: #1976d2"></span> Deshidratación</span>
                        <span class="row items-center"><span class="legend-dot" style="background: #2e7d32"></span> Tratamiento</span>
                      </div>
                    </div>
                  </div>

                  <!-- Lista de Puntos Marcados en el Rostro -->
                  <div class="col-12 col-md-5">
                    <div class="hybrid-subitem q-pa-md rounded-borders">
                      <div class="row items-center justify-between q-mb-sm">
                        <div class="text-subtitle2 text-weight-bold text-grey-9 flex items-center">
                          <q-icon name="place" class="q-mr-xs text-primary" size="18px" />
                          Puntos Marcados en el Rostro
                        </div>
                        <q-badge color="grey-3" text-color="grey-9" class="text-caption">
                          Total: {{ markers.length }}
                        </q-badge>
                      </div>

                      <!-- Estado Vacío -->
                      <div v-if="markers.length === 0" class="empty-state text-center q-pa-lg text-grey-6 bg-grey-1 rounded-borders">
                        <q-icon name="touch_app" size="36px" color="grey-5" class="q-mb-xs" />
                        <div class="text-body2 text-weight-medium">No hay zonas marcadas</div>
                        <div class="text-caption q-mt-xs">
                          Hacé clic directamente sobre la cara para agregar un marcador.
                        </div>
                      </div>

                      <!-- Lista de Marcadores -->
                      <div v-else class="markers-list q-gutter-y-xs" style="max-height: 440px; overflow-y: auto;">
                        <div
                          v-for="(marker, index) in markers"
                          :key="marker.id"
                          class="hybrid-subitem marker-item-card q-pa-sm rounded-borders"
                          :class="{ 'bg-blue-1 border-primary-subtle': selectedMarkerId === marker.id }"
                          @mouseenter="selectedMarkerId = marker.id"
                          @mouseleave="selectedMarkerId = null"
                        >
                          <div class="row items-center justify-between no-wrap">
                            <div class="row items-center no-wrap col-grow">
                              <div
                                class="marker-badge-circle q-mr-sm flex flex-center"
                                :style="{ backgroundColor: getCategoryColor(marker.category) }"
                              >
                                {{ index + 1 }}
                              </div>
                              <div class="col">
                                <div class="row items-center q-gutter-x-xs">
                                  <span class="text-body2 text-weight-medium text-grey-9">{{ marker.zone }}</span>
                                  <q-badge
                                    dense
                                    :style="{ backgroundColor: getCategoryLightBg(marker.category), color: getCategoryColor(marker.category) }"
                                    class="text-caption text-weight-medium"
                                  >
                                    {{ getCategoryLabel(marker.category) }}
                                  </q-badge>
                                  <q-badge v-if="marker.severity" outline color="grey-7" class="text-caption">
                                    {{ marker.severity }}
                                  </q-badge>
                                </div>
                                <div v-if="marker.note" class="text-caption text-grey-7 q-mt-xs" style="white-space: pre-line;">
                                  {{ marker.note }}
                                </div>
                              </div>
                            </div>

                            <div class="row items-center no-wrap q-ml-xs">
                              <q-btn flat round dense size="sm" color="primary" icon="edit" @click="editMarker(marker)">
                                <q-tooltip>Editar marcador</q-tooltip>
                              </q-btn>
                              <q-btn flat round dense size="sm" color="negative" icon="delete_outline" @click="deleteMarker(marker.id)">
                                <q-tooltip>Eliminar este punto</q-tooltip>
                              </q-btn>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- ===================================================================== -->
        <!-- SECCIONES 1, 2 Y 3: PROTOCOLO DE DIAGNÓSTICO ÓPTICO 50X               -->
        <!-- ===================================================================== -->
        <q-card
          v-for="sec in opticalProtocolSections"
          :key="sec.id"
          flat
          bordered
          class="hybrid-card"
        >
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection(sec.id)"
          >
            <div class="row items-center no-wrap">
              <q-avatar
                size="34px"
                :color="sec.avatarBg"
                :text-color="sec.avatarColor"
                :icon="sec.icon"
                class="q-mr-sm flex-shrink-0"
              />
              <div>
                <div class="text-subtitle1 text-weight-bold">{{ sec.title }}</div>
                <div class="text-caption text-grey-7">{{ sec.subtitle }}</div>
              </div>
            </div>
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-badge
                v-if="countSectionSelected(sec.id) > 0"
                :color="sec.badgeColor"
                :label="`${countSectionSelected(sec.id)} seleccionados`"
              />
              <q-btn
                flat
                round
                dense
                color="grey-7"
                :icon="collapsedSections[sec.id] ? 'expand_more' : 'expand_less'"
                @click.stop="toggleSection(sec.id)"
              />
            </div>
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections[sec.id]">
              <q-separator />
              <q-card-section>
                <q-markup-table flat bordered separator="cell" wrap-cells class="hybrid-table rounded-borders">
                  <thead>
                    <tr class="bg-grey-1 text-grey-8 text-left">
                      <th style="width: 40%; font-weight: 600;">{{ sec.col1Header }}</th>
                      <th style="width: 60%; font-weight: 600;">{{ sec.col3Header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in sec.rows" :key="row.key">
                      <!-- Columna 1: Criterio / Signo + Tooltip con Hallazgos / Correlación Clínica -->
                      <td class="align-top bg-white">
                        <div class="row items-center no-wrap q-gutter-x-xs">
                          <div class="text-body2 text-weight-medium text-grey-9 lh-snug">{{ row.title }}</div>
                          <span class="info-help-badge flex flex-center cursor-pointer">
                            ?
                            <q-tooltip
                              anchor="top middle"
                              self="bottom middle"
                              max-width="340px"
                              class="bg-grey-9 text-white q-pa-sm shadow-4"
                            >
                              <div class="text-weight-bold text-amber-3 q-mb-xs" style="font-size: 11px;">
                                {{ sec.col2Header }}
                              </div>
                              <ul class="q-pl-md q-my-none findings-list">
                                <li v-for="(bullet, bIdx) in row.findings" :key="bIdx" class="q-mb-xs" style="font-size: 12px;">
                                  {{ bullet }}
                                </li>
                              </ul>
                            </q-tooltip>
                          </span>
                        </div>
                        <div class="text-caption text-primary text-weight-medium q-mt-xs">{{ row.subtitle }}</div>
                      </td>
                      <!-- Columna 2: Registro / Marcación (Checkboxes) -->
                      <td class="align-top bg-white">
                        <div class="column q-gutter-y-xs">
                          <q-checkbox
                            v-for="opt in row.options"
                            :key="opt"
                            v-model="opticalSheet.checks[row.key]"
                            :val="opt"
                            :label="opt"
                            dense
                            color="primary"
                            class="text-body2 text-grey-9"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- ===================================================================== -->
        <!-- SECCIÓN 4: MAPEO ANATÓMICO Y REGISTRO RÁPIDO POR ZONAS                -->
        <!-- ===================================================================== -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('mapeoZonas')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="teal-1" text-color="teal-8" icon="grid_on" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">4. Mapeo Anatómico y Registro Rápido por Zonas</div>
                <div class="text-caption text-grey-7">Para marcar en gabinete según luz blanca, luz polarizada, luz UV y prioridad terapéutica</div>
              </div>
            </div>
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-badge
                v-if="countZonesSelected > 0"
                color="teal-8"
                :label="`${countZonesSelected} seleccionados`"
              />
              <q-btn
                flat
                round
                dense
                color="grey-7"
                :icon="collapsedSections.mapeoZonas ? 'expand_more' : 'expand_less'"
                @click.stop="toggleSection('mapeoZonas')"
              />
            </div>
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.mapeoZonas">
              <q-separator />
              <q-card-section>
                <q-markup-table flat bordered separator="cell" wrap-cells class="hybrid-table rounded-borders">
                  <thead>
                    <tr class="bg-grey-1 text-grey-8 text-left">
                      <th style="width: 18%; font-weight: 600;">ZONA ANATÓMICA</th>
                      <th style="width: 20%; font-weight: 600;">LUZ BLANCA (Superficie)</th>
                      <th style="width: 21%; font-weight: 600;">LUZ POLARIZADA (Vascular/Pig.)</th>
                      <th style="width: 21%; font-weight: 600;">LUZ UV (Porfirina/Sebo)</th>
                      <th style="width: 20%; font-weight: 600;">PRIORIDAD TERAPÉUTICA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="zone in anatomicalZonesTable" :key="zone.id">
                      <td class="bg-white text-body2 text-weight-medium text-grey-9 align-top">
                        {{ zone.label }}
                      </td>
                      <td class="align-top bg-white">
                        <div class="column q-gutter-y-xs">
                          <q-checkbox
                            v-for="opt in ['Poros', 'Arrugas', 'Descamación']"
                            :key="opt"
                            v-model="opticalSheet.zones[zone.id].luzBlanca"
                            :val="opt"
                            :label="opt"
                            dense
                            color="primary"
                            class="text-caption text-grey-9"
                          />
                        </div>
                      </td>
                      <td class="align-top bg-white">
                        <div class="column q-gutter-y-xs">
                          <q-checkbox
                            v-for="opt in ['Eritema', 'Telangiect.', 'Pigmentación melánica']"
                            :key="opt"
                            v-model="opticalSheet.zones[zone.id].luzPolarizada"
                            :val="opt"
                            :label="opt"
                            dense
                            color="primary"
                            class="text-caption text-grey-9"
                          />
                        </div>
                      </td>
                      <td class="align-top bg-white">
                        <div class="column q-gutter-y-xs">
                          <q-checkbox
                            v-for="opt in ['Rojo coral (+ + +)', 'Hiperqueratosis blanca', 'Fibras cian']"
                            :key="opt"
                            v-model="opticalSheet.zones[zone.id].luzUV"
                            :val="opt"
                            :label="opt"
                            dense
                            color="primary"
                            class="text-caption text-grey-9"
                          />
                        </div>
                      </td>
                      <td class="align-top bg-white">
                        <div class="column q-gutter-y-xs">
                          <q-checkbox
                            v-for="opt in ['Calmar / Reparar', 'Purificar / Desobstruir', 'Despigmentar / Antiage']"
                            :key="opt"
                            v-model="opticalSheet.zones[zone.id].prioridad"
                            :val="opt"
                            :label="opt"
                            dense
                            color="primary"
                            class="text-caption text-grey-9"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>

      <!-- Columna Lateral Sticky: Resumen en Vivo (Igual que Evaluación Cutánea y Salud & Hábitos) -->
      <div class="col-12 col-lg-4">
        <div class="sticky-summary">
          <q-card flat bordered class="live-summary-card">
            <q-card-section class="q-py-sm">
              <div class="row items-center no-wrap">
                <q-icon name="face" class="q-mr-xs text-primary flex-shrink-0" size="20px" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-primary">
                    Análisis Facial en Vivo
                  </div>
                  <div class="text-caption text-grey-7">
                    Síntesis de zonas marcadas y evaluación óptica 50X
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />

            <q-card-section class="q-gutter-y-sm">
              <!-- Zonas Marcadas en el Rostro -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8">ZONAS MARCADAS EN EL ROSTRO</div>
                <div v-if="markers.length > 0" class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="(m, idx) in markers"
                    :key="m.id"
                    color="indigo-1"
                    text-color="indigo-9"
                    class="q-pa-xs text-caption summary-badge"
                  >
                    <q-icon name="circle" size="6px" class="q-mr-xs text-indigo flex-shrink-0" />
                    <span>#{{ idx + 1 }} {{ m.zone }} ({{ getCategoryLabel(m.category) }})</span>
                  </q-badge>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">Sin zonas marcadas en el diagrama</div>
              </div>

              <q-separator />

              <!-- Luz Blanca Directa -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8">LUZ BLANCA DIRECTA</div>
                <div v-if="summaryBySection.luzBlanca.length > 0" class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="(item, idx) in summaryBySection.luzBlanca"
                    :key="idx"
                    color="grey-3"
                    text-color="grey-9"
                    class="q-pa-xs text-caption summary-badge"
                  >
                    {{ item }}
                  </q-badge>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">Sin hallazgos superficiales registrados</div>
              </div>

              <q-separator />

              <!-- Luz Polarizada Cruzada -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8">LUZ POLARIZADA CRUZADA</div>
                <div v-if="summaryBySection.luzPolarizada.length > 0" class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="(item, idx) in summaryBySection.luzPolarizada"
                    :key="idx"
                    color="blue-1"
                    text-color="primary"
                    class="q-pa-xs text-caption summary-badge"
                  >
                    {{ item }}
                  </q-badge>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">Sin patrones dérmicos registrados</div>
              </div>

              <q-separator />

              <!-- Luz UV / Wood -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8">LUZ UV / FLUORESCENCIA WOOD</div>
                <div v-if="summaryBySection.luzUV.length > 0" class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="(item, idx) in summaryBySection.luzUV"
                    :key="idx"
                    color="purple-1"
                    text-color="purple-9"
                    class="q-pa-xs text-caption summary-badge"
                  >
                    {{ item }}
                  </q-badge>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">Sin signos de fluorescencia registrados</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Barra inferior de acciones alineada con las demás pestañas -->
    <div class="row q-gutter-sm justify-end q-mt-lg">
      <q-btn flat label="Limpiar" @click="confirmClear" color="grey-8" class="minimal-btn" />
      <q-btn label="Guardar Análisis Facial" color="primary" @click="saveMapping" class="minimal-btn-save" />
      <q-btn outline :label="$q.screen.gt.xs ? 'Imprimir' : ''" color="primary" icon="print" @click="openPrintPreview" class="minimal-btn" />
    </div>

    <!-- Modal para Agregar / Editar Marcador en Rostro -->
    <q-dialog v-model="showMarkerDialog" persistent>
      <q-card style="min-width: 360px; max-width: 480px;" class="q-pa-md hybrid-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="place" class="q-mr-sm" />
            {{ editingMarker ? 'Editar Marcador' : 'Nueva Zona Facial' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-sm q-pt-md">
          <q-select
            v-model="currentMarkerForm.zone"
            :options="zoneOptions"
            use-input
            new-value-mode="add-unique"
            borderless
            dense
            class="minimal-input"
            label="Zona anatómica"
          >
            <template v-slot:prepend>
              <q-icon name="face" size="xs" color="grey-7" />
            </template>
          </q-select>

          <q-select
            v-model="currentMarkerForm.category"
            :options="categorySelectOptions"
            emit-value
            map-options
            borderless
            dense
            class="minimal-input"
            label="Tipo de alteración o procedimiento"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" :style="{ color: scope.opt.color }" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="q-pt-xs">
            <div class="text-caption text-grey-8 q-mb-xs">Severidad o Intensidad:</div>
            <q-btn-toggle
              v-model="currentMarkerForm.severity"
              spread
              no-caps
              dense
              rounded
              unelevated
              class="toggle-hybrid"
              toggle-color="primary"
              color="grey-2"
              text-color="grey-8"
              :options="[
                { label: 'Leve', value: 'Leve' },
                { label: 'Moderado', value: 'Moderado' },
                { label: 'Marcado', value: 'Marcado' }
              ]"
            />
          </div>

          <q-input
            v-model="currentMarkerForm.note"
            type="textarea"
            autogrow
            borderless
            dense
            label="Observación o tratamiento sugerido"
            placeholder="Ej: Comedones cerrados, aplicar peeling mandélico..."
            class="minimal-input q-mt-sm"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pt-sm">
          <q-btn flat label="Cancelar" color="grey-8" class="minimal-btn" v-close-popup />
          <q-btn
            v-if="editingMarker"
            flat
            label="Eliminar"
            color="negative"
            class="minimal-btn"
            @click="deleteCurrentEditingMarker"
          />
          <q-btn
            color="primary"
            :label="editingMarker ? 'Guardar Cambios' : 'Agregar Marcador'"
            class="minimal-btn-save"
            @click="submitMarkerForm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Diálogo de Vista Imprimible / Resumen -->
    <q-dialog v-model="showPrintDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="q-pa-lg">
        <q-card-section class="row items-center justify-between print-hide">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="print" class="q-mr-sm" />
            Vista Imprimible · Análisis Facial
          </div>
          <div class="row q-gutter-sm">
            <q-btn color="primary" icon="print" label="Imprimir ahora" class="minimal-btn-save" @click="triggerBrowserPrint" />
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="printable-content">
          <div class="row items-center justify-between border-bottom q-pb-md q-mb-md">
            <div>
              <div class="text-h6 text-weight-bold">FICHA TÉCNICA DE EVALUACIÓN DERMOCOSMIÁTRICA - ANALIZADOR 50X</div>
              <div class="text-caption text-grey-8">Protocolo de Diagnóstico Óptico: Luz Blanca Superficial • Luz Polarizada Profunda • Luz UV / Fluorescencia</div>
            </div>
            <div class="text-right text-caption text-grey-8">
              Paciente: <b>{{ patientName }}</b> | Fecha: <b>{{ currentDateFormatted }}</b>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-md" v-if="markers.length > 0">
            <div class="col-12">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Puntos Marcados en el Mapa Facial:</div>
              <div class="row q-gutter-sm">
                <q-badge
                  v-for="(m, i) in markers"
                  :key="m.id"
                  outline
                  color="dark"
                  class="q-pa-xs"
                >
                  #{{ i + 1 }} {{ m.zone }} ({{ getCategoryLabel(m.category) }}): {{ m.note || m.severity }}
                </q-badge>
              </div>
            </div>
          </div>

          <!-- Resumen de Selecciones 50X en Impresión -->
          <div v-for="sec in opticalProtocolSections" :key="sec.id" class="q-mb-md">
            <div class="text-subtitle2 text-weight-bold">{{ sec.title }} ({{ sec.subtitle }})</div>
            <div class="q-pl-sm text-caption">
              <div v-for="row in sec.rows" :key="row.key">
                <b>{{ row.title }}:</b>
                {{ opticalSheet.checks[row.key]?.length ? opticalSheet.checks[row.key].join(', ') : 'Sin selección' }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  patient: {
    type: Object,
    default: () => ({})
  }
});

const $q = useQuasar();

// Datos del paciente y fecha actual para impresión
const patientName = computed(() => {
  const n = props.patient?.name || '';
  const l = props.patient?.last_name || '';
  return `${n} ${l}`.trim() || 'Paciente';
});

const currentDateFormatted = computed(() => {
  return new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
});

// Control de secciones colapsables (todas colapsadas por defecto, incluyendo el mapa facial)
const collapsedSections = reactive({
  mapaFacial: true,
  luzBlanca: true,
  luzPolarizada: true,
  luzUV: true,
  mapeoZonas: true
});

function toggleSection(sectionKey) {
  collapsedSections[sectionKey] = !collapsedSections[sectionKey];
  if (sectionKey === 'mapaFacial' && !collapsedSections.mapaFacial) {
    nextTick(() => {
      initCanvas();
    });
  }
}

// Estado de guías y herramienta del mapa facial
const showZoneGuides = ref(true);
const activeTool = ref('pin');

// Categorías clínicas para pines del rostro
const categories = [
  { id: 'acne', label: 'Acné / Comedones / Pústulas', shortLabel: 'Acné', icon: 'grain', color: '#e53935', colorName: 'negative', lightBg: '#ffebee' },
  { id: 'manchas', label: 'Hiperpigmentación / Melasma', shortLabel: 'Manchas', icon: 'filter_vintage', color: '#f57c00', colorName: 'warning', lightBg: '#fff3e0' },
  { id: 'arrugas', label: 'Líneas de expresión / Arrugas', shortLabel: 'Arrugas', icon: 'timeline', color: '#8e24aa', colorName: 'purple', lightBg: '#f3e5f5' },
  { id: 'deshidratacion', label: 'Deshidratación / Piel seca', shortLabel: 'Deshidratación', icon: 'water_drop', color: '#1976d2', colorName: 'primary', lightBg: '#e3f2fd' },
  { id: 'sensibilidad', label: 'Rosácea / Eritema / Sensibilidad', shortLabel: 'Rosácea', icon: 'favorite_border', color: '#d81b60', colorName: 'pink', lightBg: '#fce4ec' },
  { id: 'flacidez', label: 'Flacidez / Pérdida de firmeza', shortLabel: 'Flacidez', icon: 'expand', color: '#00897b', colorName: 'teal', lightBg: '#e0f2f1' },
  { id: 'poros', label: 'Poros dilatados / Sebo', shortLabel: 'Poros', icon: 'scatter_plot', color: '#5e35b1', colorName: 'deep-purple', lightBg: '#ede7f6' },
  { id: 'tratamiento', label: 'Tratamiento aplicado / Sugerido', shortLabel: 'Tratamiento', icon: 'healing', color: '#2e7d32', colorName: 'positive', lightBg: '#e8f5e9' },
  { id: 'otro', label: 'Otra observación', shortLabel: 'Otra', icon: 'push_pin', color: '#546e7a', colorName: 'blue-grey', lightBg: '#eceff1' }
];

const categorySelectOptions = categories.map(c => ({
  value: c.id,
  label: c.label,
  icon: c.icon,
  color: c.color
}));

const defaultCategoryId = ref('acne');

function getCategoryColor(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.color : '#546e7a';
}

function getCategoryLightBg(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.lightBg : '#eceff1';
}

function getCategoryLabel(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.shortLabel : 'Observación';
}

// Zonas Anatómicas para el Selector de Pines
const zoneOptions = [
  'Frente superior',
  'Frente media',
  'Entrecejo (Glabella)',
  'Sien derecha',
  'Sien izquierda',
  'Contorno de ojos (Periocular)',
  'Pata de gallo derecha',
  'Pata de gallo izquierda',
  'Pómulo derecho (Región malar)',
  'Pómulo izquierdo (Región malar)',
  'Nariz / Zona T',
  'Mejilla derecha',
  'Mejilla izquierda',
  'Surco nasogeniano derecho',
  'Surco nasogeniano izquierdo',
  'Zona peribucal / Labios',
  'Mentón',
  'Línea mandibular / Óvalo facial',
  'Cuello',
  'Escote'
];

// ============================================================================
// DEFINICIÓN ESTRUCTURADA DE LA FICHA TÉCNICA ANALIZADOR 50X (SECCIONES 1 A 4)
// ============================================================================
const opticalProtocolSections = [
  {
    id: 'luzBlanca',
    title: '1. Luz Blanca Directa',
    subtitle: 'Superficie epidérmica, microrelieve y textura',
    icon: 'wb_sunny',
    avatarBg: 'blue-grey-1',
    avatarColor: 'blue-grey-8',
    badgeColor: 'blue-grey-8',
    col1Header: 'CRITERIO A OBSERVAR',
    col2Header: 'HALLAZGOS Y ALTERACIONES',
    col3Header: 'REGISTRO / MARCACIÓN',
    rows: [
      {
        key: 'microrelieve',
        title: 'Microrelieve y Cuadriculado Epidérmico',
        subtitle: '(Estructura y turgencia del estrato córneo)',
        findings: [
          'Patrón regular y fino (piel hidratada)',
          'Surcos aplanados / borrados (deshidratación/fotoenvejecimiento)',
          'Surcos acentuados / marcados / rugosidad táctil'
        ],
        options: [
          'Regular / Óptimo',
          'Deshidratado superficial',
          'Queratolítico / Áspero',
          'Líneas de expresión marcadas'
        ]
      },
      {
        key: 'ostiumsPoros',
        title: 'Ostiums Foliculares y Poros',
        subtitle: '(Dilatación y contenido superficial)',
        findings: [
          'Poros cerrados / discretos',
          'Dilatación perinasal / mejillas',
          'Comedones abiertos (oxidación melánica visible)',
          'Comedones cerrados (relieve sobreelevado)'
        ],
        options: [
          'Poros imperceptibles',
          'Ostiums dilatados grado I-II',
          'Comedones abiertos abundantes',
          'Quistes de milium / microquistes'
        ]
      },
      {
        key: 'descamacion',
        title: 'Descamación e Hiperqueratosis',
        subtitle: '(Cohesión corneo-epidérmica visible)',
        findings: [
          'Descamación lamelar o furfurácea fina',
          'Placas queratósicas localizadas',
          'Película lipídica superficial (brillo graso directo)'
        ],
        options: [
          'Sin descamación',
          'Descamación seca / tirantez',
          'Descamación mixta / seborreica',
          'Hiperqueratosis compacta'
        ]
      }
    ]
  },
  {
    id: 'luzPolarizada',
    title: '2. Luz Polarizada Cruzada',
    subtitle: 'Nivel dérmico, vascularización y pigmentación',
    icon: 'tonality',
    avatarBg: 'blue-1',
    avatarColor: 'blue-8',
    badgeColor: 'primary',
    col1Header: 'CRITERIO A OBSERVAR',
    col2Header: 'HALLAZGOS Y PATRONES DÉRMICOS',
    col3Header: 'REGISTRO / MARCACIÓN',
    rows: [
      {
        key: 'pigmentacionMelanica',
        title: 'Pigmentación Melánica Subepidérmica',
        subtitle: '(Manchas solares, melasma y PIH)',
        findings: [
          'Pigmentación reticular difusa (melasma mixto/dérmico)',
          'Máculas redondeadas delimitadas (lentigos solares)',
          'Hiperpigmentación postinflamatoria (PIH residual)',
          'Fondo pigmentario uniforme / sin acúmulos'
        ],
        options: [
          'Tono uniforme / sin máculas',
          'Máculas seniles / léntigos solares',
          'Melasma centrofacial / malar',
          'HPI activo post-acné'
        ]
      },
      {
        key: 'patronVascular',
        title: 'Patrón Vascular y Eritema Dérmico',
        subtitle: '(Microcirculación y sensibilidad dérmica)',
        findings: [
          'Eritema difuso homogéneo (reactividad / flushing)',
          'Telangiectasias lineales / arboriformes evidentes',
          'Fondo congestivo peri-lesional / vascularización fija',
          'Rosácea o reactividad de barrera alterada'
        ],
        options: [
          'Tono homogéneo normo-vascular',
          'Eritema difuso malar / nasal',
          'Telangiectasias alares / pómulos',
          'Eritema reactivo persistente'
        ]
      },
      {
        key: 'envejecimientoDermico',
        title: 'Marcadores de Envejecimiento Dérmico',
        subtitle: '(Matriz extracelular y soporte)',
        findings: [
          'Pérdida de densidad y grosor visual dérmico',
          'Líneas elastóticas / elastosis solar profunda',
          'Fibrosis o cicatrices distróficas atróficas'
        ],
        options: [
          'Soporte tisular firme',
          'Elastosis solar leve a moderada',
          'Cicatrices atróficas de acné (ice-pick / rolling)',
          'Adelgazamiento epidérmico'
        ]
      }
    ]
  },
  {
    id: 'luzUV',
    title: '3. Luz UV / Fluorescencia Tipo Wood',
    subtitle: 'Microbiota, porfirinas, sebo y contaminantes',
    icon: 'flare',
    avatarBg: 'purple-1',
    avatarColor: 'purple-9',
    badgeColor: 'purple-8',
    col1Header: 'SIGNO CROMÁTICO (FLUORESCENCIA)',
    col2Header: 'CORRELACIÓN CLÍNICA (OBSERVADO A 50X)',
    col3Header: 'REGISTRO DE SEVERIDAD Y ZONA',
    rows: [
      {
        key: 'puntosRojoCoral',
        title: 'Puntos Rojo Coral / Naranja Brillante',
        subtitle: '(★ Como en captura 50x)',
        findings: [
          'Coproporfirinas producidas por Cutibacterium acnes.',
          'Tapón folicular con sebo retenido y actividad bacteriana activa.',
          'Indicador directo de comedones inflamables y disbiosis folicular.'
        ],
        options: [
          'Ausente / Mínimo',
          'Leve (puntos aislados en nariz/mentón)',
          'Moderado (frecuente en zona T)',
          'Severo (confluente en mejillas/frente)'
        ]
      },
      {
        key: 'filamentosAzulCian',
        title: 'Filamentos / Fibras Azul Cian Brillante',
        subtitle: '(★ Como en captura 50x)',
        findings: [
          'Restos exógenos: microfibras de toallas, algodón, discos desmaquillantes o ropa que emiten intensa fluorescencia óptica.',
          'También puede indicar residuos cosméticos con blanqueadores o protectores solares reflectantes.'
        ],
        options: [
          'Sin restos exógenos',
          'Fibras textiles de toalla / disco de algodón',
          'Residuos de protector solar / cosmético',
          'Limpieza deficiente previa a consulta'
        ]
      },
      {
        key: 'fluorescenciaBlanca',
        title: 'Fluorescencia Blanca Brillante / Azulada',
        subtitle: '(Queratina y Estrato Córneo)',
        findings: [
          'Depósito compacto de células muertas queratinizadas.',
          'Piel engrosada, hiperqueratosis folicular, microdescamación deshidratada o tapón córneo estéril.'
        ],
        options: [
          'Fluorescencia suave homogénea (normal)',
          'Halo córneo hiperqueratósico periporo',
          'Tapones córneos secos sin porfirina',
          'Descamación blanquecina difusa'
        ]
      },
      {
        key: 'manchaUV',
        title: 'Acentuación Marrón Oscuro / Mancha UV',
        subtitle: '(★ Base de mácula en captura 50x)',
        findings: [
          'Absorción directa de la luz UV por la melanina.',
          'Delimita con gran nitidez el daño solar acumulado, manchas seniles y bordes del melasma profundo/epidérmico.'
        ],
        options: [
          'Sin acentuación visible',
          'Daño actínico / léntigos visibles solo en UV',
          'Mancha melánica definida (borde neto)',
          'Pigmento difuso en velo dérmico'
        ]
      }
    ]
  }
];

const anatomicalZonesTable = [
  { id: 'frenteGlabela', label: 'FRENTE Y GLABELA' },
  { id: 'narizAlar', label: 'NARIZ Y ZONA ALAR' },
  { id: 'mejillasPomulos', label: 'MEJILLAS / PÓMULOS' },
  { id: 'mentonMandibula', label: 'MENTÓN Y MANDÍBULA' },
  { id: 'peribucalLabios', label: 'ZONA PERIBUCAL / LABIOS' }
];

function createDefaultOpticalSheet() {
  return {
    checks: {
      microrelieve: [],
      ostiumsPoros: [],
      descamacion: [],
      pigmentacionMelanica: [],
      patronVascular: [],
      envejecimientoDermico: [],
      puntosRojoCoral: [],
      filamentosAzulCian: [],
      fluorescenciaBlanca: [],
      manchaUV: []
    },
    zones: {
      frenteGlabela: { luzBlanca: [], luzPolarizada: [], luzUV: [], prioridad: [] },
      narizAlar: { luzBlanca: [], luzPolarizada: [], luzUV: [], prioridad: [] },
      mejillasPomulos: { luzBlanca: [], luzPolarizada: [], luzUV: [], prioridad: [] },
      mentonMandibula: { luzBlanca: [], luzPolarizada: [], luzUV: [], prioridad: [] },
      peribucalLabios: { luzBlanca: [], luzPolarizada: [], luzUV: [], prioridad: [] }
    }
  };
}

const opticalSheet = reactive(createDefaultOpticalSheet());

function countSectionSelected(sectionId) {
  const sec = opticalProtocolSections.find(s => s.id === sectionId);
  if (!sec) return 0;
  return sec.rows.reduce((acc, r) => acc + (opticalSheet.checks[r.key]?.length || 0), 0);
}

const countZonesSelected = computed(() => {
  let total = 0;
  Object.values(opticalSheet.zones).forEach(z => {
    total += (z.luzBlanca?.length || 0) + (z.luzPolarizada?.length || 0) + (z.luzUV?.length || 0) + (z.prioridad?.length || 0);
  });
  return total;
});

const summaryBySection = computed(() => {
  const result = {
    luzBlanca: [],
    luzPolarizada: [],
    luzUV: []
  };
  opticalProtocolSections.forEach(sec => {
    sec.rows.forEach(row => {
      const checked = opticalSheet.checks[row.key] || [];
      checked.forEach(val => {
        result[sec.id].push(`${row.title}: ${val}`);
      });
    });
  });
  return result;
});

// ============================================================================
// MARCADORES INTERACTIVOS Y LIENZO DEL ROSTRO
// ============================================================================
const markers = ref([]);
const selectedMarkerId = ref(null);
const showMarkerDialog = ref(false);
const editingMarker = ref(null);

const currentMarkerForm = ref({
  x: 50,
  y: 50,
  zone: '',
  category: 'acne',
  severity: 'Moderado',
  note: ''
});

// Estado de Dibujo Libre (Canvas)
const faceContainerRef = ref(null);
const drawCanvasRef = ref(null);
const isDrawing = ref(false);
const brushColor = ref('#e53935');
const brushWidth = ref(4);
const isEraser = ref(false);
const canvasHistory = ref([]);

const brushColors = [
  { name: 'Rojo (Acné / Inflamación)', hex: '#e53935' },
  { name: 'Naranja (Manchas / Melasma)', hex: '#f57c00' },
  { name: 'Violeta (Líneas / Arrugas)', hex: '#8e24aa' },
  { name: 'Azul (Deshidratación)', hex: '#1976d2' },
  { name: 'Verde (Zona Tratada)', hex: '#2e7d32' }
];

// Detección automática de zona anatómica según coordenadas % (X, Y)
function detectAnatomicalZone(x, y) {
  if (y < 31) {
    if (y > 26 && x >= 43 && x <= 57) return 'Entrecejo (Glabella)';
    if (x < 35) return 'Sien derecha';
    if (x > 65) return 'Sien izquierda';
    return y < 21 ? 'Frente superior' : 'Frente media';
  }
  if (y >= 31 && y < 44) {
    if (x < 33) return 'Pata de gallo derecha';
    if (x > 67) return 'Pata de gallo izquierda';
    if (x >= 45 && x <= 55) return 'Nariz / Zona T';
    return 'Contorno de ojos (Periocular)';
  }
  if (y >= 44 && y < 58) {
    if (x >= 44 && x <= 56) return 'Nariz / Zona T';
    if (x < 44) return 'Pómulo derecho (Región malar)';
    return 'Pómulo izquierdo (Región malar)';
  }
  if (y >= 58 && y < 69) {
    if (x >= 42 && x <= 58) return 'Zona peribucal / Labios';
    if (x >= 36 && x < 42) return 'Surco nasogeniano derecho';
    if (x > 58 && x <= 64) return 'Surco nasogeniano izquierdo';
    if (x < 36) return 'Mejilla derecha';
    return 'Mejilla izquierda';
  }
  if (y >= 69 && y < 79) {
    if (x >= 40 && x <= 60) return 'Mentón';
    return 'Línea mandibular / Óvalo facial';
  }
  return 'Cuello';
}

function handleFaceClick(event) {
  if (activeTool.value !== 'pin') return;

  const container = faceContainerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const x = Math.round(((event.clientX - rect.left) / rect.width) * 1000) / 10;
  const y = Math.round(((event.clientY - rect.top) / rect.height) * 1000) / 10;

  editingMarker.value = null;
  currentMarkerForm.value = {
    x,
    y,
    zone: detectAnatomicalZone(x, y),
    category: defaultCategoryId.value,
    severity: 'Moderado',
    note: ''
  };
  showMarkerDialog.value = true;
}

function onPinClick(pin) {
  selectedMarkerId.value = pin.id;
  editMarker(pin);
}

function editMarker(marker) {
  editingMarker.value = marker;
  currentMarkerForm.value = {
    x: marker.x,
    y: marker.y,
    zone: marker.zone,
    category: marker.category,
    severity: marker.severity || 'Moderado',
    note: marker.note || ''
  };
  showMarkerDialog.value = true;
}

function submitMarkerForm() {
  if (!currentMarkerForm.value.zone) {
    currentMarkerForm.value.zone = 'Zona facial';
  }

  if (editingMarker.value) {
    const idx = markers.value.findIndex(m => m.id === editingMarker.value.id);
    if (idx !== -1) {
      markers.value[idx] = {
        ...markers.value[idx],
        ...currentMarkerForm.value
      };
    }
  } else {
    markers.value.push({
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      ...currentMarkerForm.value
    });
  }

  showMarkerDialog.value = false;
}

function deleteCurrentEditingMarker() {
  if (editingMarker.value) {
    deleteMarker(editingMarker.value.id);
    showMarkerDialog.value = false;
  }
}

function deleteMarker(id) {
  markers.value = markers.value.filter(m => m.id !== id);
}

function confirmClear() {
  $q.dialog({
    title: 'Limpiar evaluación',
    message: '¿Estás seguro de que deseás eliminar todas las marcas del rostro y reiniciar la ficha técnica 50X?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    markers.value = [];
    clearCanvas();
    Object.assign(opticalSheet, createDefaultOpticalSheet());
    $q.notify({ type: 'info', message: 'Se limpiaron todos los datos de la evaluación.' });
  });
}

// Persistencia en LocalStorage
function getStorageKey() {
  const pId = props.patient?.id || 'demo';
  return `facial_mapping_patient_${pId}`;
}

function saveMapping() {
  try {
    const key = getStorageKey();
    const dataToSave = {
      markers: markers.value,
      opticalSheet: JSON.parse(JSON.stringify(opticalSheet)),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));

    $q.notify({
      type: 'positive',
      message: 'Análisis facial guardado correctamente',
      icon: 'check_circle'
    });
  } catch (err) {
    console.error('Error al guardar mapeo facial:', err);
    $q.notify({
      type: 'negative',
      message: 'No se pudo guardar la información localmente.'
    });
  }
}

function loadSavedMapping() {
  try {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.markers) && parsed.markers.length > 0) {
        markers.value = parsed.markers;
      }
      if (parsed.opticalSheet) {
        if (parsed.opticalSheet.checks) {
          Object.assign(opticalSheet.checks, parsed.opticalSheet.checks);
        }
        if (parsed.opticalSheet.zones) {
          Object.assign(opticalSheet.zones, parsed.opticalSheet.zones);
        }
      }
    }
  } catch (err) {
    console.error('Error al cargar mapeo facial guardado:', err);
  }
}

// ----------------------------------------------------
// DIBUJO LIBRE (HTML5 Canvas)
// ----------------------------------------------------
function initCanvas() {
  if (!drawCanvasRef.value || !faceContainerRef.value) return;
  const canvas = drawCanvasRef.value;
  const container = faceContainerRef.value;

  canvas.width = container.clientWidth || 400;
  canvas.height = container.clientHeight || 500;
}

function getCanvasPos(event) {
  const canvas = drawCanvasRef.value;
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function getTouchPos(touch) {
  const canvas = drawCanvasRef.value;
  const rect = canvas.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function startDrawing(e) {
  if (activeTool.value !== 'draw') return;
  isDrawing.value = true;
  saveCanvasState();
  const ctx = drawCanvasRef.value.getContext('2d');
  const pos = getCanvasPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!isDrawing.value || activeTool.value !== 'draw') return;
  const ctx = drawCanvasRef.value.getContext('2d');
  const pos = getCanvasPos(e);

  ctx.lineWidth = brushWidth.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (isEraser.value) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = brushColor.value;
  }

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function startDrawingTouch(e) {
  if (activeTool.value !== 'draw' || !e.touches.length) return;
  isDrawing.value = true;
  saveCanvasState();
  const ctx = drawCanvasRef.value.getContext('2d');
  const pos = getTouchPos(e.touches[0]);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function drawTouch(e) {
  if (!isDrawing.value || activeTool.value !== 'draw' || !e.touches.length) return;
  const ctx = drawCanvasRef.value.getContext('2d');
  const pos = getTouchPos(e.touches[0]);

  ctx.lineWidth = brushWidth.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (isEraser.value) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = brushColor.value;
  }

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing() {
  if (!isDrawing.value) return;
  isDrawing.value = false;
}

function saveCanvasState() {
  const canvas = drawCanvasRef.value;
  if (!canvas) return;
  canvasHistory.value.push(canvas.toDataURL());
  if (canvasHistory.value.length > 15) {
    canvasHistory.value.shift();
  }
}

function undoStroke() {
  const canvas = drawCanvasRef.value;
  if (!canvas || canvasHistory.value.length === 0) return;
  const prevDataUrl = canvasHistory.value.pop();
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = prevDataUrl;
}

function clearCanvas() {
  const canvas = drawCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasHistory.value = [];
}

// Impresión / Vista Previa
const showPrintDialog = ref(false);

function openPrintPreview() {
  showPrintDialog.value = true;
}

function triggerBrowserPrint() {
  window.print();
}

onMounted(() => {
  loadSavedMapping();
  nextTick(() => {
    initCanvas();
  });
});
</script>

<style scoped>
.facial-mapping-container {
  width: 100%;
}

.hybrid-card {
  border-radius: 12px;
  border-color: #e0e0e0;
  background-color: #fafbfc;
}

.header-collapsible {
  background-color: #f1f5f9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.hybrid-subitem {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  word-break: break-word;
  overflow-wrap: break-word;
}

.hybrid-subitem:hover {
  border-color: #cbd5e1;
}

.border-primary-subtle {
  border-color: #bfdbfe !important;
}

.live-summary-card {
  border-radius: 12px;
  border-color: #d1d5db;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.live-summary-card :deep(.q-badge) {
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: break-word;
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

.summary-badge {
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.35;
  text-align: left;
  display: inline-flex;
  align-items: flex-start;
  max-width: 100%;
}

.toggle-hybrid {
  border: 1px solid #d0d7de;
  border-radius: 20px;
  overflow: hidden;
}

.toggle-hybrid :deep(.q-btn) {
  min-width: 50px;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 12.5px;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 12px;
  border: 1px solid #e0e4ea !important;
  box-shadow: none !important;
  font-size: 13.5px;
  padding: 4px 12px;
  transition: all 0.2s ease;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}

.minimal-btn,
.minimal-btn-save {
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  min-width: 90px;
  box-shadow: none;
  text-transform: none;
}

.minimal-btn-save {
  background: #1976d2;
  color: #fff;
  transition: background 0.15s;
}

.minimal-btn-save:hover {
  background: #125ea7;
}

.hybrid-table {
  border-color: #e2e8f0;
  background-color: #ffffff;
}

.face-canvas-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 500 / 620;
  min-height: 420px;
  max-height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbfbf9;
  overflow: hidden;
  cursor: crosshair;
}

.face-background-svg {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.draw-canvas-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.draw-canvas-layer.canvas-active {
  pointer-events: auto;
  cursor: crosshair;
}

.face-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.face-pin:hover,
.face-pin.pin-selected {
  transform: translate(-50%, -50%) scale(1.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 20;
}

.pin-number {
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.pin-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid;
  opacity: 0.6;
  animation: pulse-ring 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
  pointer-events: none;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: transform 0.1s;
}

.color-dot:hover {
  transform: scale(1.2);
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.border-top {
  border-top: 1px solid #e2e8f0;
}

.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}

.unselectable {
  -webkit-user-select: none;
  user-select: none;
}

.marker-badge-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.empty-state {
  border: 1px dashed #cbd5e1;
}

.align-top {
  vertical-align: top;
}

.findings-list li {
  line-height: 1.4;
}

.info-help-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #e3f2fd;
  color: #1565c0;
  border: 1px solid #90caf9;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.info-help-badge:hover {
  background-color: #1565c0;
  color: #ffffff;
  transform: scale(1.1);
}

@media print {
  .print-hide {
    display: none !important;
  }
}
</style>
