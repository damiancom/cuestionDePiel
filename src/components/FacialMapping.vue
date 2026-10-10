<template>
  <div class="facial-mapping-container">
    <!-- Header / Título -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="face" class="q-mr-sm" size="26px" />
          Mapa Facial y Análisis Clínico
        </div>
        <div class="text-caption text-grey-8">
          Marque alteraciones cutáneas, zonas de tratamiento y observaciones clínicas directamente sobre el rostro
        </div>
      </div>
      <div class="row q-gutter-xs q-mt-xs-sm">
        <q-btn
          flat
          dense
          color="secondary"
          icon="auto_fix_high"
          label="Cargar demo"
          class="q-px-sm"
          @click="loadDemoData"
        >
          <q-tooltip>Cargar marcas de ejemplo para demostración</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          color="grey-7"
          icon="delete_outline"
          label="Limpiar"
          class="q-px-sm"
          @click="confirmClear"
          :disable="markers.length === 0 && !hasCanvasDrawings"
        >
          <q-tooltip>Borrar todas las marcas y dibujos</q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          dense
          class="q-px-md minimal-btn-save"
          @click="saveMapping"
        >
          <q-tooltip>Guardar mapeo (Modo demostración en cliente)</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Barra de Herramientas Principal -->
    <q-card flat bordered class="q-pa-sm q-mb-md bg-grey-1 rounded-borders">
      <div class="row items-center justify-between q-col-gutter-sm">
        <!-- Modo de Marcado (Marcador vs Pincel) -->
        <div class="col-12 col-sm-6 col-md-5">
          <q-btn-toggle
            v-model="activeTool"
            spread
            dense
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="grey-8"
            class="shadow-1"
            :options="[
              { label: 'Marcadores', value: 'pin', icon: 'place' },
              { label: 'Pincel libre', value: 'draw', icon: 'brush' }
            ]"
          />
        </div>

        <!-- Toggle de Guías Anatómicas -->
        <div class="col-12 col-sm-6 col-md-4 text-center">
          <q-btn
            flat
            dense
            no-caps
            :color="showAnatomicalGuides ? 'primary' : 'grey-7'"
            :icon="showAnatomicalGuides ? 'visibility' : 'visibility_off'"
            :label="showAnatomicalGuides ? 'Guías anatómicas visibles' : 'Mostrar guías anatómicas'"
            class="q-px-sm bg-white shadow-1 rounded-borders"
            @click="showAnatomicalGuides = !showAnatomicalGuides"
          >
            <q-tooltip>Muestra u oculta líneas de referencia de compartimentos anatómicos faciales</q-tooltip>
          </q-btn>
        </div>

        <!-- Contador y Ayuda rápida -->
        <div class="col-12 col-md-3 row items-center justify-end q-gutter-x-sm">
          <q-badge color="primary" outline class="q-pa-xs text-caption">
            <q-icon name="place" size="14px" class="q-mr-xs" />
            {{ markers.length }} {{ markers.length === 1 ? 'zona marcada' : 'zonas marcadas' }}
          </q-badge>
          <q-btn
            flat
            round
            dense
            size="sm"
            color="grey-7"
            icon="help_outline"
          >
            <q-tooltip class="text-body2" max-width="300px">
              <b>Modo Marcadores:</b> Hacé clic en cualquier zona del rostro para agregar una alteración o tratamiento.<br/><br/>
              <b>Modo Pincel:</b> Dibujá círculos o delimitá zonas a mano alzada.<br/><br/>
              <b>Guías anatómicas:</b> Activá las zonas clínicas punteadas de referencia.
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Barra de herramientas adicional para modo Pincel -->
      <div v-if="activeTool === 'draw'" class="row items-center q-gutter-sm q-mt-xs q-pt-xs border-top">
        <span class="text-caption text-weight-medium text-grey-8">Color del trazo:</span>
        <div class="row q-gutter-xs items-center">
          <div
            v-for="color in brushColors"
            :key="color"
            class="color-dot cursor-pointer"
            :style="{ backgroundColor: color, border: brushColor === color ? '2px solid #000' : '1px solid #ccc' }"
            @click="brushColor = color; isEraser = false"
          />
        </div>
        <q-separator vertical class="q-mx-xs" />
        <span class="text-caption text-weight-medium text-grey-8">Grosor:</span>
        <q-btn-toggle
          v-model="brushWidth"
          dense
          flat
          size="sm"
          :options="[
            { label: 'Fino', value: 2 },
            { label: 'Medio', value: 4 },
            { label: 'Grueso', value: 7 }
          ]"
        />
        <q-separator vertical class="q-mx-xs" />
        <q-btn
          dense
          flat
          size="sm"
          :color="isEraser ? 'negative' : 'grey-8'"
          icon="auto_fix_normal"
          label="Borrador"
          @click="isEraser = !isEraser"
        />
        <q-btn
          dense
          flat
          size="sm"
          color="grey-7"
          icon="undo"
          label="Deshacer trazo"
          @click="undoLastStroke"
          :disable="drawingHistory.length === 0"
        />
      </div>

      <!-- Barra de categoría rápida para modo Marcador -->
      <div v-else class="row items-center q-gutter-xs q-mt-xs q-pt-xs border-top">
        <span class="text-caption text-weight-medium text-grey-8 q-mr-xs">Preseleccionar tipo:</span>
        <div class="row q-gutter-xs items-center">
          <q-chip
            v-for="cat in categories"
            :key="cat.id"
            dense
            clickable
            :selected="defaultCategoryId === cat.id"
            :color="defaultCategoryId === cat.id ? cat.colorName : 'grey-2'"
            :text-color="defaultCategoryId === cat.id ? 'white' : 'grey-9'"
            class="text-caption"
            @click="defaultCategoryId = cat.id"
          >
            <q-icon :name="cat.icon" size="14px" class="q-mr-xs" />
            {{ cat.shortLabel }}
          </q-chip>
        </div>
      </div>
    </q-card>

    <!-- Contenido en Dos Columnas: Cara Interactiva + Panel Clínico -->
    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Izquierda: Cara Interactiva HD -->
      <div class="col-12 col-lg-6 flex flex-center">
        <q-card flat bordered class="face-card relative-position overflow-hidden shadow-2">
          <!-- Guía superior de instrucciones rápidas -->
          <div class="face-hint text-center text-caption q-pa-xs bg-grey-2 text-grey-7">
            <q-icon :name="activeTool === 'pin' ? 'touch_app' : 'draw'" size="16px" class="q-mr-xs" />
            {{ activeTool === 'pin' ? 'Hacé clic sobre el rostro para marcar una zona' : 'Dibujá sobre el rostro para delimitar zonas' }}
          </div>

          <!-- Contenedor del Rostro -->
          <div
            ref="faceContainerRef"
            class="face-canvas-wrapper relative-position"
            @click="onFaceClick"
          >
            <!-- Diagrama Vectorial SVG HD Anatómico -->
            <svg
              viewBox="0 0 500 620"
              class="face-background-svg unselectable"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="skinBase" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff"/>
                  <stop offset="100%" stop-color="#fdfcfb"/>
                </linearGradient>
              </defs>

              <!-- 1. Cuello, Hombros y Clavículas -->
              <g class="neck-decollete" stroke="#455a64" stroke-width="1.8" fill="none" stroke-linecap="round">
                <!-- Hombros y caída exterior -->
                <path d="M 125,505 C 100,535 50,575 10,610" />
                <path d="M 375,505 C 400,535 450,575 490,610" />
                <!-- Músculos del cuello (Esternocleidomastoideo) -->
                <path d="M 195,475 C 195,515 180,560 160,595" stroke="#78909c" stroke-width="1.4" />
                <path d="M 305,475 C 305,515 320,560 340,595" stroke="#78909c" stroke-width="1.4" />
                <path d="M 215,485 C 225,530 235,565 240,580" stroke="#b0bec5" stroke-width="1.2" stroke-dasharray="2,3" />
                <path d="M 285,485 C 275,530 265,565 260,580" stroke="#b0bec5" stroke-width="1.2" stroke-dasharray="2,3" />
                <!-- Fosa yugular / Hueco supraesternal -->
                <path d="M 238,582 Q 250,590 262,582" stroke="#78909c" stroke-width="1.6" />
                <!-- Clavículas -->
                <path d="M 235,586 C 190,588 120,600 65,615" stroke="#607d8b" stroke-width="1.8" />
                <path d="M 265,586 C 310,588 380,600 435,615" stroke="#607d8b" stroke-width="1.8" />
              </g>

              <!-- 2. Silueta del Cabello (Estilo recogido pulcro clínico) -->
              <g class="hair-silhouette" fill="#f5f7f8" stroke="#37474f" stroke-width="1.8" stroke-linecap="round">
                <!-- Volumen general del cabello -->
                <path d="M 130,225 C 95,140 145,50 250,42 C 355,50 405,140 370,225 C 378,255 375,290 366,325 C 362,310 360,260 355,230 C 350,150 320,80 250,75 C 180,80 150,150 145,230 C 140,260 138,310 134,325 C 125,290 122,255 130,225 Z" fill="#eceff1" />
                <!-- Raya central y líneas de mechones -->
                <path d="M 250,45 C 250,75 250,105 250,120" stroke="#78909c" stroke-width="1.5" />
                <path d="M 250,75 C 220,78 185,100 160,135" stroke="#90a4ae" stroke-width="1.2" fill="none" />
                <path d="M 250,75 C 280,78 315,100 340,135" stroke="#90a4ae" stroke-width="1.2" fill="none" />
                <path d="M 250,95 C 210,105 175,135 155,170" stroke="#b0bec5" stroke-width="1.2" fill="none" />
                <path d="M 250,95 C 290,105 325,135 345,170" stroke="#b0bec5" stroke-width="1.2" fill="none" />
                <!-- Nacimiento frontal del cabello -->
                <path d="M 148,205 C 158,155 195,125 250,123 C 305,125 342,155 352,205" fill="none" stroke="#546e7a" stroke-width="1.6" />
              </g>

              <!-- 3. Orejas con Detalle Anatómico -->
              <g class="ears" stroke="#455a64" stroke-width="1.8" fill="#fdfcfb" stroke-linecap="round" stroke-linejoin="round">
                <!-- Oreja Izquierda -->
                <path d="M 144,215 C 115,225 106,265 112,305 C 116,330 130,348 145,345 C 146,335 145,320 145,310" />
                <path d="M 124,242 C 118,260 120,290 126,305 C 128,310 134,312 136,308" fill="none" stroke="#78909c" stroke-width="1.3" />
                <path d="M 132,260 C 127,270 127,285 133,292" fill="none" stroke="#90a4ae" stroke-width="1.2" />
                <path d="M 144,272 C 139,274 137,280 142,284" fill="none" stroke="#78909c" stroke-width="1.4" />

                <!-- Oreja Derecha -->
                <path d="M 356,215 C 385,225 394,265 388,305 C 384,330 370,348 355,345 C 354,335 355,320 355,310" />
                <path d="M 376,242 C 382,260 380,290 374,305 C 372,310 366,312 364,308" fill="none" stroke="#78909c" stroke-width="1.3" />
                <path d="M 368,260 C 373,270 373,285 367,292" fill="none" stroke="#90a4ae" stroke-width="1.2" />
                <path d="M 356,272 C 361,274 363,280 358,284" fill="none" stroke="#78909c" stroke-width="1.4" />
              </g>

              <!-- 4. Contorno Facial / Mandíbula y Mentón -->
              <g class="face-oval">
                <path
                  d="M 148,205 C 140,250 142,305 152,345 C 162,390 188,445 225,480 C 238,492 262,492 275,480 C 312,445 338,390 348,345 C 358,305 360,250 352,205 C 342,155 305,125 250,123 C 195,125 158,155 148,205 Z"
                  fill="url(#skinBase)"
                  stroke="#263238"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>

              <!-- 5. Guías Anatómicas Clínicas (Punteadas de Referencia) -->
              <g v-if="showAnatomicalGuides" class="anatomical-guides" stroke="#00acc1" stroke-width="1.1" stroke-dasharray="3,3" opacity="0.75" fill="none">
                <!-- Región Frontal Superior y Media -->
                <path d="M 170,162 C 210,154 290,154 330,162" />
                <path d="M 180,188 C 215,182 285,182 320,188" />
                <!-- Entrecejo / Glabella -->
                <rect x="235" y="174" width="30" height="34" rx="4" />
                <!-- Región Temporal (Sienes) -->
                <ellipse cx="160" cy="225" rx="14" ry="22" />
                <ellipse cx="340" cy="225" rx="14" ry="22" />
                <!-- Región Malar / Pómulos -->
                <ellipse cx="185" cy="305" rx="28" ry="18" transform="rotate(-15 185 305)" />
                <ellipse cx="315" cy="305" rx="28" ry="18" transform="rotate(15 315 305)" />
                <!-- Surcos Nasogenianos -->
                <path d="M 224,348 C 215,372 212,398 216,420" />
                <path d="M 276,348 C 285,372 288,398 284,420" />
                <!-- Región Mentoniana (Mentón) -->
                <ellipse cx="250" cy="460" rx="26" ry="16" />
                <!-- Línea Mandibular -->
                <path d="M 165,395 C 195,445 225,465 250,470 C 275,465 305,445 335,395" />
              </g>

              <!-- 6. Cejas Realistas con Micro-trazos de Pelitos -->
              <g class="eyebrows" stroke="#37474f" stroke-linecap="round">
                <!-- Ceja Izquierda -->
                <path d="M 172,198 C 190,186 214,186 230,196" fill="none" stroke-width="3.5" />
                <path d="M 230,196 L 232,192 M 228,197 L 229,190 M 224,196 L 224,188 M 218,194 L 217,186 M 212,191 L 210,184 M 205,188 L 202,183 M 198,187 L 194,183 M 190,188 L 185,185 M 182,191 L 176,190 M 174,196 L 168,196" stroke-width="1.3" />

                <!-- Ceja Derecha -->
                <path d="M 328,198 C 310,186 286,186 270,196" fill="none" stroke-width="3.5" />
                <path d="M 270,196 L 268,192 M 272,197 L 271,190 M 276,196 L 276,188 M 282,194 L 283,186 M 288,191 L 290,184 M 295,188 L 298,183 M 302,187 L 306,183 M 310,188 L 315,185 M 318,191 L 324,190 M 326,196 L 332,196" stroke-width="1.3" />
              </g>

              <!-- 7. Ojos y Pestañas Serenamente Cerrados -->
              <g class="eyes" stroke="#263238" stroke-linecap="round">
                <!-- OJO IZQUIERDO -->
                <path d="M 180,217 C 193,211 211,212 222,219" fill="none" stroke="#78909c" stroke-width="1.3" />
                <path d="M 172,230 C 185,241 212,241 228,229" fill="none" stroke="#263238" stroke-width="2.6" />
                <path d="M 176,233 Q 173,239 171,244" stroke-width="1.2" stroke="#37474f" />
                <path d="M 183,237 Q 181,245 180,250" stroke-width="1.3" stroke="#37474f" />
                <path d="M 191,240 Q 191,248 190,253" stroke-width="1.3" stroke="#37474f" />
                <path d="M 200,240 Q 201,249 202,254" stroke-width="1.4" stroke="#37474f" />
                <path d="M 209,239 Q 212,247 214,252" stroke-width="1.3" stroke="#37474f" />
                <path d="M 218,235 Q 223,243 226,247" stroke-width="1.3" stroke="#37474f" />
                <path d="M 225,230 Q 230,236 234,239" stroke-width="1.2" stroke="#37474f" />
                <path d="M 182,238 C 195,246 210,246 220,238" fill="none" stroke="#b0bec5" stroke-width="1" />
                <path d="M 180,248 C 196,258 214,257 226,248" fill="none" stroke="#cfd8dc" stroke-width="1.1" stroke-dasharray="2,2" />

                <!-- OJO DERECHO -->
                <path d="M 320,217 C 307,211 289,212 278,219" fill="none" stroke="#78909c" stroke-width="1.3" />
                <path d="M 328,230 C 315,241 288,241 272,229" fill="none" stroke="#263238" stroke-width="2.6" />
                <path d="M 324,233 Q 327,239 329,244" stroke-width="1.2" stroke="#37474f" />
                <path d="M 317,237 Q 319,245 320,250" stroke-width="1.3" stroke="#37474f" />
                <path d="M 309,240 Q 309,248 310,253" stroke-width="1.3" stroke="#37474f" />
                <path d="M 300,240 Q 299,249 298,254" stroke-width="1.4" stroke="#37474f" />
                <path d="M 291,239 Q 288,247 286,252" stroke-width="1.3" stroke="#37474f" />
                <path d="M 282,235 Q 277,243 274,247" stroke-width="1.3" stroke="#37474f" />
                <path d="M 275,230 Q 270,236 266,239" stroke-width="1.2" stroke="#37474f" />
                <path d="M 318,238 C 305,246 290,246 280,238" fill="none" stroke="#b0bec5" stroke-width="1" />
                <path d="M 320,248 C 304,258 286,257 274,248" fill="none" stroke="#cfd8dc" stroke-width="1.1" stroke-dasharray="2,2" />
              </g>

              <!-- 8. Nariz Anatómica y Alares -->
              <g class="nose" stroke-linecap="round">
                <path d="M 242,225 C 243,260 242,295 241,315" fill="none" stroke="#b0bec5" stroke-width="1.2" />
                <path d="M 258,225 C 257,260 258,295 259,315" fill="none" stroke="#cfd8dc" stroke-width="1" stroke-dasharray="3,3" />
                <!-- Punta nasal -->
                <path d="M 244,324 C 247,321 253,321 256,324" fill="none" stroke="#78909c" stroke-width="1.5" />
                <!-- Columela -->
                <path d="M 246,334 C 248,336 252,336 254,334" fill="none" stroke="#455a64" stroke-width="2.2" />
                <!-- Narinas -->
                <path d="M 239,330 C 241,334 245,334 246,331" fill="none" stroke="#37474f" stroke-width="2.4" />
                <path d="M 261,330 C 259,334 255,334 254,331" fill="none" stroke="#37474f" stroke-width="2.4" />
                <!-- Aletas nasales -->
                <path d="M 234,324 C 230,328 232,334 238,333" fill="none" stroke="#546e7a" stroke-width="1.7" />
                <path d="M 266,324 C 270,328 268,334 262,333" fill="none" stroke="#546e7a" stroke-width="1.7" />
              </g>

              <!-- 9. Filtro Labial (Filtrum) -->
              <g class="philtrum" stroke="#b0bec5" stroke-width="1.2" fill="none" stroke-linecap="round">
                <path d="M 246,337 C 245,348 243,360 242,367" />
                <path d="M 254,337 C 255,348 257,360 258,367" />
              </g>

              <!-- 10. Labios con Volumen y Definición Estética -->
              <g class="lips">
                <!-- Labio Superior -->
                <path
                  d="M 215,380 C 228,372 238,367 242,367 C 246,367 248,370 250,370 C 252,370 254,367 258,367 C 262,367 272,372 285,380 C 272,384 258,386 250,386 C 242,386 228,384 215,380 Z"
                  fill="#fce4ec"
                  stroke="#c2185b"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Línea interlabial con tubérculo central -->
                <path
                  d="M 213,380 C 228,382 242,385 247,384 C 249,384 250,386 250,386 C 250,386 251,384 253,384 C 258,385 272,382 287,380"
                  fill="none"
                  stroke="#880e4f"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <circle cx="213" cy="380" r="1.5" fill="#880e4f" />
                <circle cx="287" cy="380" r="1.5" fill="#880e4f" />
                <!-- Labio Inferior -->
                <path
                  d="M 215,380 C 222,398 236,408 250,408 C 264,408 278,398 285,380 C 275,385 262,387 250,387 C 238,387 225,385 215,380 Z"
                  fill="#fff0f5"
                  stroke="#c2185b"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M 238,396 C 244,399 256,399 262,396" fill="none" stroke="#f48fb1" stroke-width="1.2" stroke-linecap="round" />
                <!-- Surco mentolabial -->
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

              <!-- Tooltip descriptivo en hover -->
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
        </q-card>
      </div>

      <!-- Columna Derecha: Resumen de Zonas Marcadas y Plan de Tratamiento -->
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="q-pa-md minimal-card">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center">
              <q-icon name="list_alt" class="q-mr-xs text-primary" size="20px" />
              Zonas y Alteraciones Registradas
            </div>
            <q-badge color="grey-3" text-color="grey-9" class="text-caption">
              Total: {{ markers.length }}
            </q-badge>
          </div>

          <!-- Estado Vacío -->
          <div v-if="markers.length === 0" class="empty-state text-center q-pa-lg text-grey-6 bg-grey-1 rounded-borders">
            <q-icon name="touch_app" size="42px" color="grey-5" class="q-mb-xs" />
            <div class="text-weight-medium">No hay zonas marcadas en el rostro</div>
            <div class="text-caption q-mt-xs">
              Hacé clic directamente sobre la cara para agregar un marcador, o utilizá el botón <b>"Cargar demo"</b>.
            </div>
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Cargar ejemplo para demostración"
              icon="auto_fix_high"
              class="q-mt-sm"
              @click="loadDemoData"
            />
          </div>

          <!-- Lista de Marcadores -->
          <div v-else class="markers-list q-gutter-y-xs q-mb-md" style="max-height: 380px; overflow-y: auto;">
            <q-card
              v-for="(marker, index) in markers"
              :key="marker.id"
              flat
              bordered
              class="marker-item-card transition-all"
              :class="{ 'marker-item-active': selectedMarkerId === marker.id }"
              @mouseenter="selectedMarkerId = marker.id"
              @mouseleave="selectedMarkerId = null"
            >
              <div class="row items-center justify-between no-wrap q-pa-sm">
                <!-- Número e Icono -->
                <div class="row items-center no-wrap col-grow">
                  <div
                    class="marker-badge-circle q-mr-sm flex flex-center"
                    :style="{ backgroundColor: getCategoryColor(marker.category) }"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="col">
                    <div class="row items-center q-gutter-x-xs no-wrap">
                      <span class="text-weight-bold text-grey-9">{{ marker.zone }}</span>
                      <q-badge
                        dense
                        :style="{ backgroundColor: getCategoryLightBg(marker.category), color: getCategoryColor(marker.category) }"
                        class="text-caption text-weight-medium"
                      >
                        <q-icon :name="getCategoryIcon(marker.category)" size="12px" class="q-mr-xs" />
                        {{ getCategoryLabel(marker.category) }}
                      </q-badge>
                      <q-badge v-if="marker.severity" outline color="grey-7" class="text-caption">
                        {{ marker.severity }}
                      </q-badge>
                    </div>
                    <div v-if="marker.note" class="text-caption text-grey-8 q-mt-xs" style="white-space: pre-line;">
                      {{ marker.note }}
                    </div>
                  </div>
                </div>

                <!-- Botones de Acción -->
                <div class="row items-center no-wrap q-ml-sm">
                  <q-btn
                    flat
                    round
                    dense
                    size="sm"
                    color="primary"
                    icon="edit"
                    @click="editMarker(marker)"
                  >
                    <q-tooltip>Editar marcador</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    size="sm"
                    color="negative"
                    icon="delete_outline"
                    @click="deleteMarker(marker.id)"
                  >
                    <q-tooltip>Eliminar este punto</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card>
          </div>

          <q-separator class="q-my-md" />

          <!-- Conclusiones y Plan Terapéutico General -->
          <div class="q-gutter-y-sm">
            <div class="text-subtitle2 text-weight-bold text-grey-9 flex items-center">
              <q-icon name="assignment_turned_in" class="q-mr-xs text-primary" size="18px" />
              Diagnóstico General y Plan Terapéutico
            </div>
            <q-input
              v-model="generalNotes"
              type="textarea"
              outlined
              dense
              rows="3"
              placeholder="Ej: Biotipo cutáneo graso con tendencia acneica en zona T y melasma malar leve. Se indica rutina con niacinamida, ácido salicílico y fotoprotección diaria..."
              class="minimal-input"
            />
          </div>

          <!-- Botón de Acción Final -->
          <div class="row justify-end q-mt-md q-gutter-sm">
            <q-btn
              outline
              dense
              color="primary"
              icon="print"
              label="Vista para imprimir"
              class="q-px-sm"
              @click="openPrintPreview"
            />
            <q-btn
              color="primary"
              dense
              icon="check_circle"
              label="Guardar Ficha Facial"
              class="q-px-md minimal-btn-save"
              @click="saveMapping"
            />
          </div>
        </q-card>
      </div>
    </div>

    <!-- Modal para Agregar / Editar Marcador -->
    <q-dialog v-model="showMarkerDialog" persistent>
      <q-card style="min-width: 360px; max-width: 480px;" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary flex items-center">
            <q-icon name="place" class="q-mr-sm" />
            {{ editingMarker ? 'Editar Marcador' : 'Nueva Zona Facial' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-sm q-pt-md">
          <!-- Zona Facial -->
          <q-select
            v-model="currentMarkerForm.zone"
            :options="zoneOptions"
            use-input
            new-value-mode="add-unique"
            outlined
            dense
            label="Zona anatómica"
            hint="Elegí o escribí la zona del rostro"
          >
            <template v-slot:prepend>
              <q-icon name="face" size="xs" color="grey-7" />
            </template>
          </q-select>

          <!-- Categoría / Alteración -->
          <q-select
            v-model="currentMarkerForm.category"
            :options="categorySelectOptions"
            emit-value
            map-options
            outlined
            dense
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

          <!-- Severidad / Grado -->
          <div class="q-pt-xs">
            <div class="text-caption text-grey-8 q-mb-xs">Severidad o Intensidad:</div>
            <q-btn-toggle
              v-model="currentMarkerForm.severity"
              spread
              dense
              rounded
              unelevated
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

          <!-- Observaciones clínicas / Tratamiento -->
          <q-input
            v-model="currentMarkerForm.note"
            type="textarea"
            outlined
            dense
            rows="2"
            label="Observación o tratamiento sugerido"
            placeholder="Ej: Comedones cerrados, aplicar peeling mandélico..."
            class="q-mt-sm"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pt-sm">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            v-if="editingMarker"
            flat
            label="Eliminar"
            color="negative"
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
            Vista Imprimible · Ficha de Mapeo Facial
          </div>
          <div class="row q-gutter-sm">
            <q-btn color="primary" icon="print" label="Imprimir ahora" @click="triggerBrowserPrint" />
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="printable-content">
          <div class="row items-center justify-between border-bottom q-pb-md q-mb-md">
            <div>
              <div class="text-h5 text-weight-bold">CENTRO DERMATOCOSMÉTICO</div>
              <div class="text-subtitle2 text-grey-8">Ficha de Evaluación y Diagnóstico Facial</div>
            </div>
            <div class="text-right text-caption text-grey-7">
              Fecha: {{ currentDateFormatted }}<br />
              Paciente: <b>{{ patientName }}</b>
            </div>
          </div>

          <div class="row q-col-gutter-lg items-center">
            <div class="col-12 col-sm-6 text-center">
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Mapa del Rostro</div>
              <div style="max-width: 300px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 8px; background: #fff;">
                <svg viewBox="0 0 500 620" style="width: 100%; height: auto;">
                  <use href="#printFaceSvg" />
                </svg>
                <div class="text-caption text-grey-7 q-mt-xs">Diagrama Vectorial Anatómico ({{ markers.length }} marcas)</div>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Detalle de Alteraciones Identificadas:</div>
              <q-list dense separator bordered class="rounded-borders">
                <q-item v-for="(m, i) in markers" :key="m.id">
                  <q-item-section avatar style="min-width: 30px;">
                    <q-badge :style="{ backgroundColor: getCategoryColor(m.category) }">{{ i + 1 }}</q-badge>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ m.zone }} ({{ getCategoryLabel(m.category) }})</q-item-label>
                    <q-item-label caption v-if="m.note">{{ m.note }}</q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="m.severity">
                    <span class="text-caption">{{ m.severity }}</span>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-mt-md">
                <div class="text-subtitle2 text-weight-bold">Conclusiones y Plan de Tratamiento:</div>
                <div class="q-pa-sm bg-grey-1 rounded-borders text-body2" style="border: 1px solid #e0e0e0; min-height: 60px;">
                  {{ generalNotes || 'Sin observaciones adicionales registradas.' }}
                </div>
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

// Guías anatómicas de compartimentos faciales (toggle)
const showAnatomicalGuides = ref(false);

// Herramienta activa: 'pin' (marcador) | 'draw' (pincel)
const activeTool = ref('pin');

// Categorías clínicas
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

function getCategoryIcon(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.icon : 'place';
}

function getCategoryLabel(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.shortLabel : 'Observación';
}

// Zonas Anatómicas para el Selector
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

// Estado de Marcadores
const markers = ref([]);
const selectedMarkerId = ref(null);
const generalNotes = ref('');

// Diálogo de Marcador
const showMarkerDialog = ref(false);
const editingMarker = ref(null);
const pendingCoords = ref({ x: 50, y: 50 });

const currentMarkerForm = reactive({
  zone: '',
  category: 'acne',
  severity: 'Moderado',
  note: ''
});

// Referencias de Contenedor y Canvas
const faceContainerRef = ref(null);
const drawCanvasRef = ref(null);

// Estado de Dibujo Libre (Pincel)
const brushColors = ['#e53935', '#8e24aa', '#1976d2', '#2e7d32', '#f57c00', '#212121'];
const brushColor = ref('#e53935');
const brushWidth = ref(4);
const isEraser = ref(false);
const isDrawing = ref(false);
const hasCanvasDrawings = ref(false);
const drawingHistory = ref([]);

// Diálogo de impresión
const showPrintDialog = ref(false);
const patientName = computed(() => {
  if (props.patient?.name) {
    return `${props.patient.name} ${props.patient.last_name || ''}`;
  }
  return 'Paciente';
});

const currentDateFormatted = computed(() => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
});

// Detección automática de zona anatómica precisa según proporciones del rostro
function estimateZone(x, y) {
  if (y < 30) {
    if (x > 40 && x < 60 && y > 24) return 'Entrecejo (Glabella)';
    return 'Frente superior';
  }
  if (y >= 30 && y < 44) {
    if (x < 33) return 'Sien derecha';
    if (x > 67) return 'Sien izquierda';
    if (x < 42) return 'Pata de gallo derecha';
    if (x > 58) return 'Pata de gallo izquierda';
    return 'Contorno de ojos (Periocular)';
  }
  if (y >= 44 && y < 58) {
    if (x < 38) return 'Pómulo derecho (Región malar)';
    if (x > 62) return 'Pómulo izquierdo (Región malar)';
    return 'Nariz / Zona T';
  }
  if (y >= 58 && y < 68) {
    if (x < 40) return 'Surco nasogeniano derecho';
    if (x > 60) return 'Surco nasogeniano izquierdo';
    return 'Zona peribucal / Labios';
  }
  if (y >= 68 && y < 82) {
    if (x < 36 || x > 64) return 'Línea mandibular / Óvalo facial';
    return 'Mentón';
  }
  return 'Cuello';
}

// Clic sobre el rostro en modo marcador
function onFaceClick(event) {
  if (activeTool.value !== 'pin') return;

  if (!faceContainerRef.value) return;
  const rect = faceContainerRef.value.getBoundingClientRect();
  const rawX = ((event.clientX - rect.left) / rect.width) * 100;
  const rawY = ((event.clientY - rect.top) / rect.height) * 100;

  const x = Math.max(4, Math.min(96, Math.round(rawX * 10) / 10));
  const y = Math.max(4, Math.min(96, Math.round(rawY * 10) / 10));

  pendingCoords.value = { x, y };
  editingMarker.value = null;

  // Sugerir zona automática y categoría por defecto
  currentMarkerForm.zone = estimateZone(x, y);
  currentMarkerForm.category = defaultCategoryId.value;
  currentMarkerForm.severity = 'Moderado';
  currentMarkerForm.note = '';

  showMarkerDialog.value = true;
}

// Clic sobre un pin existente
function onPinClick(pin) {
  editMarker(pin);
}

function editMarker(marker) {
  editingMarker.value = marker;
  currentMarkerForm.zone = marker.zone;
  currentMarkerForm.category = marker.category;
  currentMarkerForm.severity = marker.severity || 'Moderado';
  currentMarkerForm.note = marker.note || '';
  showMarkerDialog.value = true;
}

function submitMarkerForm() {
  if (!currentMarkerForm.zone) {
    $q.notify({ type: 'warning', message: 'Por favor seleccioná o escribí la zona anatómica.' });
    return;
  }

  if (editingMarker.value) {
    // Actualizar existente
    const idx = markers.value.findIndex(m => m.id === editingMarker.value.id);
    if (idx !== -1) {
      markers.value[idx] = {
        ...markers.value[idx],
        zone: currentMarkerForm.zone,
        category: currentMarkerForm.category,
        severity: currentMarkerForm.severity,
        note: currentMarkerForm.note
      };
    }
  } else {
    // Agregar nuevo marcador
    markers.value.push({
      id: Date.now() + Math.random().toString(36).substr(2, 4),
      x: pendingCoords.value.x,
      y: pendingCoords.value.y,
      zone: currentMarkerForm.zone,
      category: currentMarkerForm.category,
      severity: currentMarkerForm.severity,
      note: currentMarkerForm.note
    });
  }

  showMarkerDialog.value = false;
  editingMarker.value = null;
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

// Cargar ejemplo demostrativo alineado al rostro HD
function loadDemoData() {
  markers.value = [
    {
      id: 'demo-1',
      x: 50,
      y: 25,
      zone: 'Frente superior',
      category: 'arrugas',
      severity: 'Moderado',
      note: 'Líneas dinámicas al gesticular. Sugerido: Toxina botulínica o péptidos tensores.'
    },
    {
      id: 'demo-2',
      x: 36,
      y: 49,
      zone: 'Pómulo derecho (Región malar)',
      category: 'manchas',
      severity: 'Marcado',
      note: 'Melasma solar epidérmico. Plan: Peeling químico despigmentante (tranexámico/mandélico) y FPS 50+.'
    },
    {
      id: 'demo-3',
      x: 50,
      y: 53,
      zone: 'Nariz / Zona T',
      category: 'poros',
      severity: 'Moderado',
      note: 'Comedones abiertos y exceso de sebo. Sugerido: Higiene ultrasónica + ácido salicílico 2%.'
    },
    {
      id: 'demo-4',
      x: 65,
      y: 38,
      zone: 'Contorno de ojos (Periocular)',
      category: 'deshidratacion',
      severity: 'Leve',
      note: 'Líneas finas por deshidratación periocular. Sugerido: Contorno con ácido hialurónico fraccionado.'
    },
    {
      id: 'demo-5',
      x: 50,
      y: 74,
      zone: 'Mentón',
      category: 'acne',
      severity: 'Leve',
      note: 'Pápulas inflamatorias en fase de resolución perimenstrual.'
    }
  ];

  generalNotes.value =
    'Paciente consulta para evaluación dermatocosmiátrica. Presenta biotipo cutáneo combinado con fotoenvejecimiento incipiente, melasma malar derecho y comedones en zona T.\n\nPlan recomendado:\n1. Higiene profunda de choque con espátula ultrasónica.\n2. Sesiones de peeling despigmentante combinado.\n3. Rutina domiciliaria con antioxidante diurno y renovador nocturno.';

  $q.notify({
    type: 'positive',
    message: 'Ejemplo de evaluación facial cargado exitosamente',
    icon: 'auto_fix_high'
  });
}

function confirmClear() {
  $q.dialog({
    title: 'Limpiar marcas',
    message: '¿Estás seguro de que deseás eliminar todas las marcas y dibujos del rostro?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    markers.value = [];
    clearCanvas();
    $q.notify({ type: 'info', message: 'Se eliminaron las marcas.' });
  });
}

// Persistencia en LocalStorage (Modo Demostración)
function getStorageKey() {
  const pId = props.patient?.id || 'demo';
  return `facial_mapping_patient_${pId}`;
}

function saveMapping() {
  try {
    const key = getStorageKey();
    const dataToSave = {
      markers: markers.value,
      generalNotes: generalNotes.value,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));

    $q.notify({
      type: 'positive',
      message: 'Mapeo facial guardado correctamente (Modo demostración)',
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
      if (parsed.generalNotes) {
        generalNotes.value = parsed.generalNotes;
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
  hasCanvasDrawings.value = true;
}

function stopDrawing() {
  if (isDrawing.value) {
    isDrawing.value = false;
    const ctx = drawCanvasRef.value?.getContext('2d');
    if (ctx) ctx.closePath();
  }
}

function startDrawingTouch(e) {
  if (activeTool.value !== 'draw' || e.touches.length === 0) return;
  isDrawing.value = true;
  saveCanvasState();
  const ctx = drawCanvasRef.value.getContext('2d');
  const pos = getTouchPos(e.touches[0]);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function drawTouch(e) {
  if (!isDrawing.value || activeTool.value !== 'draw' || e.touches.length === 0) return;
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
  hasCanvasDrawings.value = true;
}

function saveCanvasState() {
  if (!drawCanvasRef.value) return;
  const canvas = drawCanvasRef.value;
  drawingHistory.value.push(canvas.toDataURL());
  if (drawingHistory.value.length > 15) {
    drawingHistory.value.shift();
  }
}

function undoLastStroke() {
  if (!drawCanvasRef.value || drawingHistory.value.length === 0) return;
  const canvas = drawCanvasRef.value;
  const ctx = canvas.getContext('2d');
  const previousState = drawingHistory.value.pop();

  if (previousState) {
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      hasCanvasDrawings.value = drawingHistory.value.length > 0;
    };
  } else {
    clearCanvas();
  }
}

function clearCanvas() {
  if (!drawCanvasRef.value) return;
  const canvas = drawCanvasRef.value;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory.value = [];
  hasCanvasDrawings.value = false;
}

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
  window.addEventListener('resize', initCanvas);
});
</script>

<style scoped>
.facial-mapping-container {
  max-width: 1200px;
  margin: 0 auto;
}

.face-card {
  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  border-radius: 12px;
}

.face-hint {
  border-bottom: 1px solid #e0e0e0;
  font-size: 11px;
}

.face-canvas-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 500 / 620;
  min-height: 460px;
  max-height: 580px;
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
  border-top: 1px solid #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.unselectable {
  -webkit-user-select: none;
  user-select: none;
}

.marker-item-card {
  border-radius: 8px;
  background: #ffffff;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.marker-item-card:hover,
.marker-item-active {
  background-color: #f5f9ff;
  border-color: #1976d2;
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
  border: 1px dashed #bdbdbd;
}

@media print {
  .print-hide {
    display: none !important;
  }
}
</style>
