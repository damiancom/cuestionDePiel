<template>
  <q-page padding class="calculator-page">
    <!-- Encabezado de la página -->
    <div class="row items-center justify-between q-mb-md q-col-gutter-sm">
      <div class="col-12 col-md-7">
        <div class="row items-center no-wrap">
          <q-icon name="calculate" size="32px" color="primary" class="q-mr-sm" style="flex-shrink: 0;" />
          <div>
            <div class="text-h5 text-primary text-weight-bold">
              Calculadora de Costos y Precios
            </div>
            <div class="text-caption text-grey-7">
              Fórmula de absorción impositiva para Venta Directa y Mercado Libre (MeLi)
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="col-12 col-md-5 row items-center justify-end q-gutter-sm">

        <q-btn
          outline
          color="primary"
          icon="inventory_2"
          label="Catálogo"
          dense
          class="q-px-sm"
          @click="showProductSelector = true"
        >
          <q-tooltip>Cargar costo desde un producto del catálogo</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          color="grey-7"
          icon="restart_alt"
          @click="resetDefaults"
        >
          <q-tooltip>Restablecer valores de referencia</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Banner si hay producto seleccionado del catálogo -->
    <q-banner
      v-if="selectedProduct"
      rounded
      class="bg-blue-1 text-primary q-mb-md border-primary"
      dense
    >
      <template #avatar>
        <q-icon name="local_offer" color="primary" />
      </template>
      <div class="row items-center justify-between">
        <div>
          Calculando para: <strong>{{ selectedProduct.name }}</strong> ({{ selectedProduct.brand_name || 'Sin marca' }})
          <span v-if="selectedProduct.selling_price" class="text-grey-8 q-ml-sm">
            — P. Venta actual: ${{ formatNumber(selectedProduct.selling_price) }}
          </span>
        </div>
        <div class="row items-center q-gutter-xs">
          <q-btn
            dense
            size="sm"
            color="positive"
            icon="save"
            label="Aplicar al Catálogo"
            @click="applyPriceToProduct"
            :loading="savingProductPrice"
          >
            <q-tooltip>Guardar el precio sugerido (${{ formatNumber(activeCalculated.precioFinal) }}) en el catálogo</q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            round
            size="sm"
            icon="close"
            color="grey-7"
            @click="selectedProduct = null"
          />
        </div>
      </div>
    </q-banner>

    <!-- SELECTOR DE CANAL DE VENTA (VENTA DIRECTA vs MERCADO LIBRE) -->
    <q-card flat bordered class="q-pa-sm q-mb-md channel-card">
      <div class="row items-center justify-between q-col-gutter-sm">
        <div class="col-12 col-sm-auto row items-center">
          <span class="text-subtitle2 text-weight-bold text-grey-9 q-mr-md">Canal de Venta:</span>
          <q-btn-toggle
            v-model="saleChannel"
            no-caps
            rounded
            unelevated
            :toggle-color="saleChannel === 'meli' ? 'amber-9' : 'primary'"
            color="grey-2"
            text-color="grey-8"
            toggle-text-color="white"
            :options="[
              { label: 'Venta Directa / Mostrador', value: 'direct', icon: 'storefront' },
              { label: 'Mercado Libre (MeLi)', value: 'meli', icon: 'shopping_bag' }
            ]"
          />
        </div>

        <div class="col-12 col-sm text-right">
          <q-badge
            v-if="saleChannel === 'meli'"
            color="amber-2"
            text-color="brown-10"
            class="q-pa-xs text-weight-medium"
          >
            💛 Cargo MeLi ({{ meliCommissionPct }}%) + Alícuota Ganancias ({{ gananciasPct }}%)
          </q-badge>
          <q-badge
            v-else
            color="blue-1"
            text-color="primary"
            class="q-pa-xs text-weight-medium"
          >
            🏢 Absorción impositiva tradicional (Ganancias sobre utilidad)
          </q-badge>
        </div>
      </div>
    </q-card>

    <div class="row q-col-gutter-lg">
        <!-- COLUMNA IZQUIERDA: INPUTS -->
        <div class="col-12 col-lg-5">
          <q-card flat bordered class="q-pa-md calculator-card shadow-1">
            <div class="row items-center q-mb-md">
              <q-icon name="tune" color="primary" size="22px" class="q-mr-xs" />
              <div class="text-subtitle1 text-weight-bold text-grey-9">
                Ingreso de Datos
              </div>
            </div>

            <!-- Selector de Moneda -->
            <div class="q-mb-md">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
                Moneda de Compra del Producto:
              </div>
              <q-btn-toggle
                v-model="currency"
                spread
                no-caps
                rounded
                unelevated
                toggle-color="primary"
                color="grey-2"
                text-color="grey-8"
                toggle-text-color="white"
                :options="[
                  { label: 'Pesos Argentinos ($ ARS)', value: 'ARS', icon: 'payments' },
                  { label: 'Dólares (u$s USD)', value: 'USD', icon: 'attach_money' }
                ]"
              />
            </div>

            <!-- Costo en Pesos -->
            <div v-if="currency === 'ARS'" class="q-mb-md">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
                Costo Unitario (con IVA no recuperable) [$]:
              </div>
              <q-input
                v-model.number="costARS"
                type="number"
                min="0"
                step="any"
                outlined
                dense
                prefix="$"
                placeholder="10000"
                class="input-highlight"
              >
                <template #append>
                  <q-icon name="shopping_bag" color="grey-6" />
                </template>
              </q-input>
            </div>

            <!-- Costo en Dólares -->
            <div v-else class="q-mb-md">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
                    Costo Unitario en dólares:
                  </div>
                  <q-input
                    v-model.number="costUSD"
                    type="number"
                    min="0"
                    step="any"
                    outlined
                    dense
                    prefix="u$s"
                    placeholder="9.00"
                    class="input-highlight"
                  >
                    <template #append>
                      <q-icon name="monetization_on" color="grey-6" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-caption text-weight-medium text-grey-8">Valor Dólar ($):</span>
                    <q-btn
                      flat
                      dense
                      size="xs"
                      color="primary"
                      icon="sync"
                      label="Dólar Blue"
                      :loading="fetchingDollar"
                      @click="fetchDolarBlue"
                    >
                      <q-tooltip>Consultar cotización online del dólar blue</q-tooltip>
                    </q-btn>
                  </div>
                  <q-input
                    v-model.number="dollarRate"
                    type="number"
                    min="0"
                    step="any"
                    outlined
                    dense
                    prefix="$"
                    placeholder="1550"
                  />
                </div>
              </div>

              <!-- Costo convertido a pesos -->
              <div class="row items-center justify-between q-mt-sm q-pa-sm bg-grey-1 rounded-borders border-light">
                <span class="text-caption text-grey-7">Costo en Pesos (u$s {{ formatNumber(costUSD) }} × ${{ formatNumber(dollarRate) }}):</span>
                <span class="text-weight-bold text-primary font-mono text-body2">
                  ${{ formatNumber(effectiveCostARS) }}
                </span>
              </div>
            </div>

            <!-- Margen de Utilidad Objetivo -->
            <div class="q-mb-md">
              <div class="row items-center justify-between q-mb-xs">
                <div class="text-caption text-weight-medium text-grey-8">
                  Margen de Utilidad Objetivo (%):
                </div>
                <q-badge color="primary" class="text-subtitle2 q-px-sm">
                  {{ profitMarginPct }}% limpio {{ profitMarginBase === 'cost' ? 's/ costo' : 's/ neto' }}
                </q-badge>
              </div>

              <div class="row q-col-gutter-xs items-center q-mb-xs">
                <div class="col-7">
                  <q-input
                    v-model.number="profitMarginPct"
                    type="number"
                    min="1"
                    max="999"
                    step="1"
                    outlined
                    dense
                    suffix="%"
                    placeholder="20"
                  />
                </div>
                <div class="col-5">
                  <q-btn-toggle
                    v-model="profitMarginBase"
                    spread
                    dense
                    no-caps
                    rounded
                    unelevated
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    toggle-text-color="white"
                    class="border-light text-caption"
                    :options="[
                      { label: 'S/ Costo', value: 'cost' },
                      { label: 'S/ Neto', value: 'net' }
                    ]"
                  />
                </div>
              </div>

              <!-- Presets rápidos de margen -->
              <div class="row items-center q-gutter-xs q-mt-xs">
                <span class="text-caption text-grey-6 q-mr-xs">Accesos rápidos:</span>
                <q-btn
                  v-for="preset in [15, 20, 25, 30, 35, 40, 50]"
                  :key="preset"
                  dense
                  unelevated
                  size="sm"
                  :color="profitMarginPct === preset ? 'primary' : 'grey-2'"
                  :text-color="profitMarginPct === preset ? 'white' : 'grey-8'"
                  :label="`${preset}%`"
                  @click="profitMarginPct = preset"
                  class="q-px-xs"
                />
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                * Ganancia neta real en mano:
                <strong class="text-positive">${{ formatNumber(activeTargetProfitARS) }}</strong>
                ({{ profitMarginBase === 'cost' ? 'calculada sobre el costo de compra' : 'calculada sobre el precio neto de venta' }}).
              </div>
            </div>

            <!-- CONFIGURACIÓN ESPECÍFICA MERCADO LIBRE (Colapsable con Chevron) -->
            <q-expansion-item
              v-if="saleChannel === 'meli'"
              dense
              icon="shopping_bag"
              label="Parámetros Mercado Libre"
              :caption="`Cargo ${meliCommissionPct}% s/ publicado • Envío ($${formatNumber(meliShippingCost)}) si ≥ $${formatNumber(meliShippingThreshold)}`"
              header-class="text-weight-bold text-brown-10 bg-amber-2 rounded-borders"
              class="border-amber rounded-borders q-mb-md overflow-hidden bg-amber-1"
            >
              <div class="q-pa-sm">
                <div class="row q-col-gutter-sm">
                  <!-- Cargo por Vender MeLi -->
                  <div class="col-12 col-sm-6">
                    <div class="text-caption text-weight-medium text-grey-9 q-mb-xs">Cargo por vender MeLi (%):</div>
                    <q-input
                      v-model.number="meliCommissionPct"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      outlined
                      dense
                      suffix="%"
                      bg-color="white"
                    />
                    <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 11px;">
                      Aplicado siempre sobre el precio final publicado (con IVA)
                    </div>
                  </div>
                </div>

                <!-- BLOQUE ENVÍO GRATIS MERCADO ENVÍOS -->
                <div class="q-mt-sm q-pa-sm bg-white rounded-borders border-amber-light">
                  <div class="row items-center justify-between q-mb-xs">
                    <div class="row items-center">
                      <q-icon name="local_shipping" color="primary" size="18px" class="q-mr-xs" />
                      <span class="text-caption text-weight-bold text-grey-9">Envío Gratis Mercado Envíos:</span>
                    </div>
                    <q-badge
                      :color="activeCalculated.costoEnvioMeli > 0 ? 'positive' : 'grey-6'"
                      :label="activeCalculated.costoEnvioMeli > 0 ? `📦 Aplica Envío (+$${formatNumber(activeCalculated.costoEnvioMeli)})` : '📦 Sin costo vendedor ($0)'"
                    />
                  </div>

                  <div class="row q-col-gutter-xs q-mt-xs">
                    <div class="col-6">
                      <div class="text-caption text-grey-8">Umbral Envío Gratis ($):</div>
                      <q-input
                        v-model.number="meliShippingThreshold"
                        type="number"
                        min="0"
                        step="500"
                        outlined
                        dense
                        prefix="$"
                        bg-color="white"
                      />
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey-8">Costo de Envío a Pagar ($):</div>
                      <q-input
                        v-model.number="meliShippingCost"
                        type="number"
                        min="0"
                        step="500"
                        outlined
                        dense
                        prefix="$"
                        bg-color="white"
                      />
                    </div>
                  </div>
                  <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 11px;">
                    ⚡ Modo automático: el envío se aplica cuando el precio publicado es igual o mayor a ${{ formatNumber(meliShippingThreshold) }}.
                  </div>
                </div>

                <!-- Nota explicativa transparente sobre deducción en Ganancias -->
                <div class="q-mt-sm q-pa-xs bg-amber-05 rounded-borders text-caption text-brown-10">
                  <div class="row items-start no-wrap">
                    <q-icon name="verified_user" color="amber-10" size="16px" class="q-mr-xs q-mt-xs" />
                    <div>
                      <strong>Base de Ganancias (35%):</strong>
                      {{ deductCostInGanancias ? 'Deduce Costo, IIBB y plataforma.' : 'En tu caso, la base imponible NO descuenta el costo de adquisición: se calcula deduciendo únicamente los IIBB y lo abonado a MeLi (cargo + envío).' }}
                    </div>
                  </div>
                </div>
              </div>
            </q-expansion-item>

            <!-- Montos Fijos de Impuestos (Colapsable) -->
            <q-expansion-item
              icon="receipt_long"
              label="Alícuotas de Impuestos Aplicadas"
              :caption="`IIBB (${iibbPct}%), IVA (${ivaPct}%), Ganancias (${gananciasPct}%)${deductCostInGanancias ? '' : ' • Sin deducir costo'}`"
              header-class="text-weight-medium text-primary bg-grey-1 rounded-borders"
              class="border-light rounded-borders q-mt-md"
              dense
            >
              <div class="q-pa-sm bg-white">
                <div class="row q-col-gutter-sm">
                  <!-- IIBB -->
                  <div class="col-12 col-sm-4">
                    <div class="text-caption text-weight-medium text-grey-8">IIBB efectivo:</div>
                    <q-input
                      v-model.number="iibbPct"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      outlined
                      dense
                      suffix="%"
                    />
                  </div>

                  <!-- IVA -->
                  <div class="col-12 col-sm-4">
                    <div class="text-caption text-weight-medium text-grey-8">Alícuota IVA:</div>
                    <q-input
                      v-model.number="ivaPct"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      outlined
                      dense
                      suffix="%"
                    />
                  </div>

                  <!-- Ganancias -->
                  <div class="col-12 col-sm-4">
                    <div class="text-caption text-weight-medium text-grey-8">
                      Alícuota Ganancias:
                    </div>
                    <q-input
                      v-model.number="gananciasPct"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      outlined
                      dense
                      suffix="%"
                    />
                  </div>
                </div>

                <!-- Selector Deducción de Costo en Ganancias -->
                <div class="row items-center justify-between q-mt-sm q-pt-sm border-top">
                  <div>
                    <div class="text-caption text-weight-medium text-grey-8">Deducir Costo de Compra en Ganancias:</div>
                    <div class="text-caption text-grey-6" style="font-size: 11px;">
                      {{ deductCostInGanancias ? 'El costo se resta de la base imponible' : 'No se descuenta el costo (Tu caso configurado)' }}
                    </div>
                  </div>
                  <q-btn-toggle
                    v-model="deductCostInGanancias"
                    dense
                    no-caps
                    rounded
                    unelevated
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    toggle-text-color="white"
                    class="border-light"
                    :options="[
                      { label: 'No descontar costo (Tu caso)', value: false },
                      { label: 'Descontar costo', value: true }
                    ]"
                  />
                </div>

                <!-- Factores Multiplicadores -->
                <div class="q-mt-sm q-pa-sm bg-blue-1 rounded-borders text-caption text-primary">
                  <div class="row items-center justify-between">
                    <span>Factor Multiplicador Neto:</span>
                    <span class="font-mono text-weight-bold">{{ formatDecimal(factorNeto, 4) }}x</span>
                  </div>
                  <div class="row items-center justify-between q-mt-xs">
                    <span>Factor Multiplicador Final (con IVA):</span>
                    <span class="font-mono text-weight-bold text-body2">{{ formatDecimal(factorFinal, 4) }}x</span>
                  </div>
                </div>

                <div class="text-right q-mt-xs">
                  <q-btn
                    flat
                    dense
                    size="xs"
                    color="grey-7"
                    label="Restablecer impuestos estándar"
                    @click="resetTaxes"
                  />
                </div>
              </div>
            </q-expansion-item>
          </q-card>
        </div>

        <!-- COLUMNA DERECHA: RESULTADOS -->
        <div class="col-12 col-lg-7">
          <q-banner
            v-if="divisorInvalido"
            class="bg-negative text-white rounded-borders q-mb-md"
          >
            <template #avatar>
              <q-icon name="error" color="white" />
            </template>
            <strong>Combinación impositiva inviable:</strong>
            La suma de la comisión ({{ saleChannel === 'meli' ? meliCommissionPct + '%' : '0%' }}), IIBB, Ganancias y el margen supera el 100% de la capacidad de absorción del precio. Por favor reduzca el margen deseado o ajuste las alícuotas.
          </q-banner>

          <!-- HERO CARD: PRECIO FINAL SUGERIDO -->
          <q-card
            flat
            bordered
            class="q-pa-md calculator-hero-card shadow-2 q-mb-md"
            :class="{ 'meli-hero-card': saleChannel === 'meli' }"
          >
            <div class="row items-center justify-between">
              <span class="text-caption text-uppercase text-weight-bolder tracking-wide" :class="saleChannel === 'meli' ? 'text-brown-10' : 'text-primary'">
                {{ saleChannel === 'meli' ? 'Precio a Publicar en Mercado Libre (con IVA)' : 'Precio Final al Público (con IVA)' }}
              </span>
              <div class="row items-center q-gutter-xs">
                <q-badge v-if="saleChannel === 'meli' && activeCalculated.costoEnvioMeli > 0" color="purple-8" class="q-px-sm text-caption">
                  📦 Incluye Envío Gratis ($+{{ formatNumber(activeCalculated.costoEnvioMeli) }})
                </q-badge>
                <q-badge :color="saleChannel === 'meli' ? 'amber-9' : 'positive'" class="q-px-sm text-caption">
                  {{ saleChannel === 'meli' ? '💛 Precio Optimizado MeLi' : 'Cubre Costo + 100% Impuestos' }}
                </q-badge>
              </div>
            </div>

            <div class="row items-baseline justify-between q-mt-sm">
              <div
                class="text-h3 text-weight-bolder font-mono price-display"
                :class="saleChannel === 'meli' ? 'text-amber-10' : 'text-grey-9'"
              >
                ${{ formatNumber(activeCalculated.precioFinal) }}
              </div>
              <q-btn
                flat
                dense
                round
                :color="saleChannel === 'meli' ? 'amber-10' : 'primary'"
                icon="content_copy"
                @click="copyToClipboard(activeCalculated.precioFinal)"
              >
                <q-tooltip>Copiar precio final</q-tooltip>
              </q-btn>
            </div>

            <q-separator class="q-my-md" />

            <!-- KPI BOXES -->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <div class="kpi-box">
                  <div class="text-caption text-grey-7">Ganancia Neta Final</div>
                  <div class="text-h6 text-positive text-weight-bold font-mono">
                    ${{ formatNumber(activeCalculated.gananciaLimpia) }}
                  </div>
                  <div class="text-caption text-positive">
                    {{ profitMarginPct }}% libre {{ profitMarginBase === 'cost' ? 's/ costo' : 's/ neto' }}
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="kpi-box">
                  <div class="text-caption text-grey-7">Precio Neto (sin IVA)</div>
                  <div class="text-h6 text-primary text-weight-bold font-mono">
                    ${{ formatNumber(activeCalculated.precioNeto) }}
                  </div>
                  <div class="text-caption text-grey-6">
                    Base de facturación
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="kpi-box">
                  <div class="text-caption text-grey-7">Deducciones / Impuestos</div>
                  <div class="text-h6 text-orange-9 text-weight-bold font-mono">
                    ${{ formatNumber(activeTotalDeductions) }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ saleChannel === 'meli' ? (activeCalculated.costoEnvioMeli > 0 ? 'MeLi (Com+Env) + Gan + IIBB + IVA' : 'MeLi + Gan + IIBB + IVA') : 'IIBB + Ganancias + IVA' }}
                  </div>
                </div>
              </div>
            </div>
          </q-card>

          <!-- TARJETA COMPARATIVA: VENTA DIRECTA VS MERCADO LIBRE -->
          <q-card flat bordered class="q-pa-md q-mb-md bg-grey-1 rounded-borders border-light">
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center">
                <q-icon name="compare_arrows" color="primary" size="20px" class="q-mr-xs" />
                <span class="text-subtitle2 text-weight-bold text-grey-9">
                  Comparativa de Canales (Para este producto):
                </span>
              </div>
              <span class="text-caption text-grey-6">Costo: ${{ formatNumber(effectiveCostARS) }}</span>
            </div>

            <div class="row q-col-gutter-sm text-center">
              <!-- Local -->
              <div class="col-12 col-sm-6">
                <div class="q-pa-sm bg-white rounded-borders border-light">
                  <div class="text-caption text-weight-bold text-primary">🏪 Venta Directa (Mostrador)</div>
                  <div class="text-h6 text-weight-bolder text-grey-9 font-mono q-my-xs">
                    ${{ formatNumber(comparisonData.direct.precioFinal) }}
                  </div>
                  <div class="text-caption text-positive">
                    Ganancia Limpia: <strong>${{ formatNumber(comparisonData.direct.gananciaLimpia) }}</strong>
                  </div>
                </div>
              </div>

              <!-- MeLi -->
              <div class="col-12 col-sm-6">
                <div class="q-pa-sm bg-amber-05 rounded-borders border-amber">
                  <div class="text-caption text-weight-bold text-brown-10">💛 Mercado Libre (MeLi)</div>
                  <div class="text-h6 text-weight-bolder text-amber-10 font-mono q-my-xs">
                    ${{ formatNumber(comparisonData.meli.precioFinal) }}
                  </div>
                  <div class="text-caption text-positive">
                    Ganancia Limpia: <strong>${{ formatNumber(comparisonData.meli.gananciaLimpia) }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-caption text-grey-7 q-mt-xs text-center">
              Diferencia para cubrir comisión de MeLi ({{ meliCommissionPct }}%){{ comparisonData.meli.costoEnvioMeli > 0 ? ' + envío ($' + formatNumber(comparisonData.meli.costoEnvioMeli) + ')' : '' }} y sus impuestos derivados:
              <strong>+${{ formatNumber(comparisonData.difference) }}</strong> (+{{ comparisonData.diffPct }}%)
            </div>
          </q-card>

          <!-- BARRA DE COMPOSICIÓN DEL PRECIO -->
          <q-card flat bordered class="q-pa-md q-mb-md">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Composición del Precio Final ($100%):
            </div>
            <div class="distribution-bar row no-wrap overflow-hidden rounded-borders">
              <div class="dist-segment bg-blue-7" :style="{ width: pctCosto + '%' }">
                <q-tooltip>Costo de Adquisición: {{ pctCosto }}% (${{ formatNumber(effectiveCostARS) }})</q-tooltip>
              </div>
              <div class="dist-segment bg-positive" :style="{ width: pctGanancia + '%' }">
                <q-tooltip>Ganancia Limpia: {{ pctGanancia }}% (${{ formatNumber(activeCalculated.gananciaLimpia) }})</q-tooltip>
              </div>
              <div v-if="saleChannel === 'meli'" class="dist-segment bg-amber-8" :style="{ width: pctMeli + '%' }">
                <q-tooltip>{{ activeCalculated.costoEnvioMeli > 0 ? 'Total MeLi (Cargo + Envío)' : 'Cargo por vender MeLi' }}: {{ pctMeli }}% (${{ formatNumber(activeCalculated.totalAbonadoMeli) }})</q-tooltip>
              </div>
              <div class="dist-segment bg-orange-7" :style="{ width: pctImpuestos + '%' }">
                <q-tooltip>Impuestos Totales: {{ pctImpuestos }}% (${{ formatNumber(activeTotalTaxesOnly) }})</q-tooltip>
              </div>
            </div>

            <div class="row justify-between text-caption text-grey-7 q-mt-xs">
              <div class="row items-center">
                <span class="legend-dot bg-blue-7 q-mr-xs"></span>
                Costo: <strong>{{ pctCosto }}%</strong>
              </div>
              <div class="row items-center">
                <span class="legend-dot bg-positive q-mr-xs"></span>
                Ganancia Limpia: <strong>{{ pctGanancia }}%</strong>
              </div>
              <div v-if="saleChannel === 'meli'" class="row items-center">
                <span class="legend-dot bg-amber-8 q-mr-xs"></span>
                {{ activeCalculated.costoEnvioMeli > 0 ? 'Total MeLi (Cargo + Envío)' : 'Cargo por vender MeLi' }}: <strong>{{ pctMeli }}%</strong>
              </div>
              <div class="row items-center">
                <span class="legend-dot bg-orange-7 q-mr-xs"></span>
                Impuestos: <strong>{{ pctImpuestos }}%</strong>
              </div>
            </div>
          </q-card>

          <!-- DESGLOSE DETALLADO PASO A PASO -->
          <q-card flat bordered class="q-pa-none overflow-hidden q-mb-md">
            <q-toolbar class="bg-grey-1 text-grey-9 border-bottom">
              <q-icon name="list_alt" size="20px" class="q-mr-xs text-primary" />
              <q-toolbar-title class="text-subtitle2 text-weight-bold">
                {{ saleChannel === 'meli' ? 'Desglose de Venta en Mercado Libre (MeLi)' : 'Desglose según Planilla de Referencia' }}
              </q-toolbar-title>
            </q-toolbar>

            <q-list separator dense class="text-body2">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Costo Unitario (con IVA no recuperable)</q-item-label>
                  <q-item-label caption>
                    {{ currency === 'USD' ? `u$s ${formatNumber(costUSD)} × $${formatNumber(dollarRate)}` : 'Costo de compra o fabricación' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bold font-mono text-grey-9">
                  ${{ formatNumber(effectiveCostARS) }}
                </q-item-section>
              </q-item>

              <!-- Fila Cargo por Vender MeLi (Si está activo) -->
              <q-item v-if="saleChannel === 'meli'" class="bg-amber-05">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-brown-10">Cargo por vender Mercado Libre</q-item-label>
                  <q-item-label caption>
                    {{ meliCommissionPct }}% retenido por MeLi sobre el precio publicado (${{ formatNumber(activeCalculated.precioFinal) }})
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bolder font-mono text-brown-10 text-subtitle2">
                  ${{ formatNumber(activeCalculated.montoMeli) }}
                </q-item-section>
              </q-item>

              <!-- Fila Costo de Envío MeLi (Si aplica) -->
              <q-item v-if="saleChannel === 'meli' && activeCalculated.costoEnvioMeli > 0" class="bg-amber-05">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-brown-10">Costo de Envío Mercado Envíos</q-item-label>
                  <q-item-label caption>
                    Envío gratis obligatorio absorbido por el vendedor al superar ${{ formatNumber(meliShippingThreshold) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bolder font-mono text-brown-10 text-subtitle2">
                  ${{ formatNumber(activeCalculated.costoEnvioMeli) }}
                </q-item-section>
              </q-item>

              <!-- Fila Total Abonado a MeLi -->
              <q-item v-if="saleChannel === 'meli'" class="bg-amber-1 border-light">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-brown-10">Total Abonado a Mercado Libre (Comisión + Envío)</q-item-label>
                  <q-item-label caption>Monto total deducido por Mercado Libre en la liquidación</q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bolder font-mono text-brown-10 text-subtitle2">
                  ${{ formatNumber(activeCalculated.totalAbonadoMeli) }}
                </q-item-section>
              </q-item>

              <q-item class="bg-yellow-05">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-brown-9">Precio Neto (sin IVA)</q-item-label>
                  <q-item-label caption>Precio al que debes vender sin considerar el IVA</q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bolder font-mono text-brown-9 text-subtitle2">
                  ${{ formatNumber(activeCalculated.precioNeto) }}
                </q-item-section>
              </q-item>

              <q-item class="bg-orange-05">
                <q-item-section>
                  <q-item-label class="text-weight-medium">Monto de Ingresos Brutos</q-item-label>
                  <q-item-label caption>Impuesto de IIBB retenido/pagado sobre el neto ({{ iibbPct }}%)</q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-medium font-mono text-orange-9">
                  ${{ formatNumber(activeCalculated.montoIIBB) }}
                </q-item-section>
              </q-item>

              <q-item :class="saleChannel === 'meli' ? 'bg-amber-1' : 'bg-blue-1'">
                <q-item-section>
                  <q-item-label class="text-weight-bolder" :class="saleChannel === 'meli' ? 'text-brown-10' : 'text-primary'">
                    {{ saleChannel === 'meli' ? 'PRECIO FINAL A PUBLICAR EN MELI (con IVA)' : 'PRECIO FINAL AL PÚBLICO (con IVA)' }}
                  </q-item-label>
                  <q-item-label caption :class="saleChannel === 'meli' ? 'text-brown-9' : 'text-primary'">
                    Precio final que verá tu cliente en la publicación
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bolder font-mono text-h6" :class="saleChannel === 'meli' ? 'text-amber-10' : 'text-primary'">
                  ${{ formatNumber(activeCalculated.precioFinal) }}
                </q-item-section>
              </q-item>

              <q-item class="bg-orange-05">
                <q-item-section>
                  <q-item-label class="text-weight-medium">Monto de IVA Debito Fiscal</q-item-label>
                  <q-item-label caption>El {{ ivaPct }}% que se adiciona al precio neto</q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-medium font-mono text-orange-9">
                  ${{ formatNumber(activeCalculated.montoIVA) }}
                </q-item-section>
              </q-item>

              <q-item class="bg-orange-05">
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    Provisión Impuesto a las Ganancias ({{ gananciasPct }}%):
                  </q-item-label>
                  <q-item-label caption>
                    {{ gananciasPct }}% sobre Base Imponible: ${{ formatNumber(activeCalculated.baseGanancias) }} (Venta neta - IIBB{{ saleChannel === 'meli' ? ' - MeLi' : '' }}{{ deductCostInGanancias ? ' - Costo' : ' [sin deducir costo]' }})
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-medium font-mono text-negative">
                  ${{ formatNumber(activeCalculated.impuestoGanancias) }}
                </q-item-section>
              </q-item>

              <q-item class="bg-green-1">
                <q-item-section>
                  <q-item-label class="text-weight-bolder text-positive">Ganancia Neta Final (después de Ganancias)</q-item-label>
                  <q-item-label caption class="text-positive">
                    Tu ganancia limpia en mano (exactamente el {{ profitMarginPct }}% {{ profitMarginBase === 'cost' ? 'sobre el costo de compra' : 'del precio neto' }})
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bolder font-mono text-positive text-subtitle2">
                  ${{ formatNumber(activeCalculated.gananciaLimpia) }}
                </q-item-section>
              </q-item>

              <q-item class="bg-grey-1">
                <q-item-section>
                  <q-item-label class="text-weight-medium text-grey-8">Ganancia Neta Teórica por Unidad</q-item-label>
                  <q-item-label caption>Utilidad antes del impacto de Ganancias</q-item-label>
                </q-item-section>
                <q-item-section side class="text-weight-bold font-mono text-grey-8">
                  ${{ formatNumber(activeCalculated.gananciaTeorica) }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <!-- COMPROBACIÓN -->
          <q-card flat bordered class="q-pa-md bg-grey-1 rounded-borders">
            <div class="row items-center q-mb-xs">
              <q-icon name="verified" color="positive" size="18px" class="q-mr-xs" />
              <span class="text-caption text-weight-bold text-grey-9">
                Comprobación Matemática de Margen:
              </span>
            </div>
            <div class="text-caption text-grey-8">
              Ganancia Neta Final (${{ formatNumber(activeCalculated.gananciaLimpia) }}) ÷ {{ profitMarginBase === 'cost' ? 'Costo de Adquisición' : 'Precio Neto' }} (${{ formatNumber(profitMarginBase === 'cost' ? effectiveCostARS : activeCalculated.precioNeto) }})
              = <strong class="text-positive font-mono">{{ formatDecimal(activeCalculated.comprobacionPct, 2) }}%</strong>.
              Garantiza el <strong>{{ profitMarginPct }}%</strong> limpio exacto de rentabilidad {{ profitMarginBase === 'cost' ? 'sobre el costo' : 'sobre el neto' }} en {{ saleChannel === 'meli' ? 'Mercado Libre' : 'Venta Directa' }}.
            </div>
          </q-card>
        </div>
      </div>

      <!-- SIMULADOR DE ESCENARIOS DE MARGEN -->
      <div class="q-mt-xl">
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <div class="text-subtitle1 text-weight-bold text-primary">
              Simulador Rápido de Márgenes de Ganancia ({{ saleChannel === 'meli' ? 'Mercado Libre' : 'Venta Directa' }})
            </div>
            <div class="text-caption text-grey-7">
              Compara el precio final al público y tu ganancia limpia para el costo actual (${{ formatNumber(effectiveCostARS) }}):
            </div>
          </div>
        </div>

        <q-card flat bordered class="overflow-hidden">
          <q-markup-table dense flat class="scenarios-table">
            <thead>
              <tr class="bg-grey-2 text-grey-8">
                <th class="text-left">Margen Neto</th>
                <th class="text-right">Precio Neto (sin IVA)</th>
                <th class="text-right">Precio Final al Público</th>
                <th class="text-right">Ganancia Neta Final</th>
                <th class="text-right">Markup s/ Costo</th>
                <th class="text-center">Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="scen in marginScenarios"
                :key="scen.margin"
                :class="{ 'active-scenario-row': scen.margin === profitMarginPct }"
              >
                <td class="text-left text-weight-bold">
                  <q-badge
                    :color="scen.margin === profitMarginPct ? (saleChannel === 'meli' ? 'amber-9' : 'primary') : 'grey-4'"
                    :text-color="scen.margin === profitMarginPct ? 'white' : 'grey-9'"
                  >
                    {{ scen.margin }}%
                  </q-badge>
                </td>
                <td class="text-right font-mono">${{ formatNumber(scen.precioNeto) }}</td>
                <td class="text-right font-mono text-weight-bold" :class="saleChannel === 'meli' ? 'text-amber-10' : 'text-primary'">${{ formatNumber(scen.precioFinal) }}</td>
                <td class="text-right font-mono text-positive text-weight-bold">${{ formatNumber(scen.gananciaLimpia) }}</td>
                <td class="text-right font-mono text-grey-8">+{{ scen.markupSobreCosto }}%</td>
                <td class="text-center">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    :color="scen.margin === profitMarginPct ? (saleChannel === 'meli' ? 'amber-9' : 'primary') : 'grey-7'"
                    :label="scen.margin === profitMarginPct ? 'Activo' : 'Usar este'"
                    @click="profitMarginPct = scen.margin"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </div>

    <!-- DIÁLOGO PARA SELECCIONAR PRODUCTO DEL CATÁLOGO -->
    <q-dialog v-model="showProductSelector">
      <q-card style="width: 550px; max-width: 95vw;">
        <q-toolbar class="bg-primary text-white">
          <q-icon name="inventory_2" size="20px" class="q-mr-xs" />
          <q-toolbar-title class="text-subtitle1">
            Seleccionar Producto del Catálogo
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-md">
            Elige un producto para cargar su costo de compra automáticamente:
          </div>

          <q-input
            v-model="productSearch"
            outlined
            dense
            clearable
            placeholder="Buscar por nombre o marca..."
            class="q-mb-md"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-spinner-dots v-if="loadingProducts" size="40px" color="primary" class="q-my-md text-center block" />

          <q-list v-else separator bordered class="rounded-borders product-pick-list">
            <q-item
              v-for="p in filteredCatalogProducts"
              :key="p.id"
              clickable
              v-ripple
              @click="selectCatalogProduct(p)"
            >
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ p.name }}</q-item-label>
                <q-item-label caption>{{ p.brand_name || 'Sin marca' }} • {{ p.category_name || 'Sin categoría' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-caption text-grey-7">P. Costo:</div>
                <div class="text-weight-bold text-primary font-mono">
                  {{ p.purchase_price != null ? '$' + formatNumber(p.purchase_price) : 'Sin costo' }}
                </div>
              </q-item-section>
            </q-item>
            <q-item v-if="filteredCatalogProducts.length === 0">
              <q-item-section class="text-center text-grey-6 q-pa-md">
                No se encontraron productos con costo registrado.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { RecommendedProductsAPI } from '../services/api';

const $q = useQuasar();

// --- CANAL DE VENTA ---
const saleChannel = ref('direct'); // 'direct' | 'meli'
const meliCommissionPct = ref(15.0); // 15% cargo por vender MeLi
const meliShippingThreshold = ref(33000); // $33.000 umbral envío gratis obligatorio
const meliShippingCost = ref(7000); // $7.000 costo de envío que absorbe el vendedor

// --- ESTADO PRINCIPAL (VALORES POR DEFECTO DE LA PLANILLA) ---
const currency = ref('ARS'); // 'ARS' o 'USD'
const costARS = ref(10000);
const costUSD = ref(9);
const dollarRate = ref(1550);
const profitMarginPct = ref(20); // 20%
const profitMarginBase = ref('cost'); // 'cost' (sobre costo de compra) | 'net' (sobre precio neto)

// --- MONTOS FIJOS / ALÍCUOTAS IMPOSITIVAS ---
const iibbPct = ref(5.0);
const ivaPct = ref(21.0);
const gananciasPct = ref(35.0); // Alícuota única de Impuesto a las Ganancias
const deductCostInGanancias = ref(false); // false por defecto (el usuario no puede descontar el costo de compra en Ganancias)

// --- ESTADOS SECUNDARIOS ---
const fetchingDollar = ref(false);
const showProductSelector = ref(false);
const loadingProducts = ref(false);
const catalogProducts = ref([]);
const productSearch = ref('');
const selectedProduct = ref(null);
const savingProductPrice = ref(false);

// --- CÁLCULO REUTILIZABLE CORE ---
function executeFormula(
  costo,
  margenPct,
  iibbP,
  ivaP,
  ganP,
  isMeli = false,
  meliComP = 15.0,
  marginBase = 'cost',
  shippingThreshold = 33000,
  shippingCostAmount = 7000,
  deductCost = false
) {
  const m = (parseFloat(margenPct) || 0) / 100;
  const iibbRate = (parseFloat(iibbP) || 0) / 100;
  const ivaRate = (parseFloat(ivaP) || 0) / 100;
  const gRate = (parseFloat(ganP) || 0) / 100;
  const c = parseFloat(costo) || 0;

  if (c <= 0) {
    return {
      divisor: 0,
      precioNeto: 0,
      montoMeli: 0,
      costoEnvioMeli: 0,
      totalAbonadoMeli: 0,
      baseGanancias: 0,
      montoIIBB: 0,
      montoIVA: 0,
      precioFinal: 0,
      gananciaTeorica: 0,
      impuestoGanancias: 0,
      gananciaLimpia: 0,
      comprobacionPct: 0,
      envioAplicado: false
    };
  }

  // Coeficiente de comisión de MeLi respecto al precio neto (Pn):
  // La comisión de MeLi se aplica siempre sobre el precio publicado con IVA (Pf = Pn * (1 + ivaRate))
  const meliRate = isMeli ? (parseFloat(meliComP) || 0) / 100 : 0;
  const kMeliPn = isMeli ? meliRate * (1 + ivaRate) : 0;

  // Criterio impositivo de Ganancias:
  // Base Imponible de Ganancias = Pn - (deductCost ? c : 0) - montoIIBB - totalAbonadoMeli
  // Ganancia Limpia en mano = Pn - montoIIBB - totalAbonadoMeli - impuestoGanancias - c
  //
  // Para obtener la ganancia limpia objetivo G:
  //   Si deductCost === true:
  //     Base Ganancias = G / (1 - gRate)
  //     Pn * (1 - iibbRate - kMeliPn) - E = c + G / (1 - gRate)
  //
  //   Si deductCost === false (caso del usuario, la base no descuenta costo):
  //     Base Ganancias = (c + G) / (1 - gRate)
  //     Pn * (1 - iibbRate - kMeliPn) - E = (c + G) / (1 - gRate)

  const factorG = 1 - gRate > 0 ? m / (1 - gRate) : 0;

  // Divisor respecto al precio neto Pn:
  const divisorPn = marginBase === 'cost'
    ? 1 - iibbRate - kMeliPn
    : 1 - iibbRate - kMeliPn - factorG;

  // Divisor equivalente respecto al precio final Pf:
  const divisor = divisorPn / (1 + ivaRate);

  if (divisorPn <= 0 || divisor <= 0) {
    return {
      divisor,
      precioNeto: 0,
      montoMeli: 0,
      costoEnvioMeli: 0,
      totalAbonadoMeli: 0,
      baseGanancias: 0,
      montoIIBB: 0,
      montoIVA: 0,
      precioFinal: 0,
      gananciaTeorica: 0,
      impuestoGanancias: 0,
      gananciaLimpia: 0,
      comprobacionPct: 0,
      envioAplicado: false
    };
  }

  const resolverPn = (E) => {
    if (marginBase === 'cost') {
      const numerador = deductCost
        ? c * (1 + factorG) + E
        : (c * (1 + m)) / (1 - gRate) + E;
      return numerador / divisorPn;
    } else {
      const numerador = deductCost
        ? c + E
        : c / (1 - gRate) + E;
      return numerador / divisorPn;
    }
  };

  let costoEnvio = 0;
  let envioAplicado = false;

  if (isMeli) {
    const threshold = parseFloat(shippingThreshold) || 33000;
    const costAmount = parseFloat(shippingCostAmount) || 7000;

    // Modo siempre automático: se evalúa si el precio sin envío supera o iguala el umbral
    const pnSinEnvio = resolverPn(0);
    const pfSinEnvio = pnSinEnvio * (1 + ivaRate);
    if (pfSinEnvio >= threshold) {
      costoEnvio = costAmount;
      envioAplicado = true;
    } else {
      costoEnvio = 0;
      envioAplicado = false;
    }
  }

  const precioNeto = resolverPn(costoEnvio);
  const precioFinal = precioNeto * (1 + ivaRate);
  const montoIVA = precioFinal - precioNeto;
  const montoIIBB = precioNeto * iibbRate;

  const montoMeli = isMeli ? precioFinal * meliRate : 0;
  const totalAbonadoMeli = isMeli ? montoMeli + costoEnvio : 0;

  // Base imponible de Ganancias:
  // Si deductCost === true: deduce c
  // Si deductCost === false (tu caso): NO deduce c
  const baseGanancias = Math.max(0, precioNeto - (deductCost ? c : 0) - montoIIBB - totalAbonadoMeli);
  const impuestoGanancias = baseGanancias * gRate;
  const gananciaLimpia = precioNeto - montoIIBB - totalAbonadoMeli - impuestoGanancias - c;
  const gananciaTeorica = gananciaLimpia + impuestoGanancias;

  const comprobacionPct = marginBase === 'cost'
    ? (c > 0 ? (gananciaLimpia / c) * 100 : 0)
    : (precioNeto > 0 ? (gananciaLimpia / precioNeto) * 100 : 0);

  return {
    divisor,
    precioNeto,
    montoMeli,
    costoEnvioMeli: costoEnvio,
    totalAbonadoMeli,
    baseGanancias,
    montoIIBB,
    montoIVA,
    precioFinal,
    gananciaTeorica,
    impuestoGanancias,
    gananciaLimpia,
    comprobacionPct,
    envioAplicado
  };
}

// --- COSTOS EFECTIVOS ---
const effectiveCostARS = computed(() => {
  if (currency.value === 'USD') {
    const u = parseFloat(costUSD.value) || 0;
    const d = parseFloat(dollarRate.value) || 0;
    return u * d;
  }
  return parseFloat(costARS.value) || 0;
});

const activeTargetProfitARS = computed(() => {
  const c = effectiveCostARS.value;
  const m = (parseFloat(profitMarginPct.value) || 0) / 100;
  if (profitMarginBase.value === 'cost') {
    return c * m;
  }
  return activeCalculated.value?.gananciaLimpia || 0;
});

// --- CÁLCULO PRINCIPAL ---
const activeCalculated = computed(() => {
  const c = effectiveCostARS.value;
  const isMeli = saleChannel.value === 'meli';
  return executeFormula(
    c,
    profitMarginPct.value,
    iibbPct.value,
    ivaPct.value,
    gananciasPct.value,
    isMeli,
    meliCommissionPct.value,
    profitMarginBase.value,
    meliShippingThreshold.value,
    meliShippingCost.value,
    deductCostInGanancias.value
  );
});

// Divisor y Factores
const divisorInvalido = computed(() => activeCalculated.value.divisor <= 0);

const factorNeto = computed(() => {
  const d = activeCalculated.value.divisor;
  return d > 0 ? 1 / d : 0;
});

const factorFinal = computed(() => {
  const iva = (parseFloat(ivaPct.value) || 0) / 100;
  return factorNeto.value * (1 + iva);
});

// Total Deducciones / Impuestos Activo
const activeTotalDeductions = computed(() => {
  const c = activeCalculated.value;
  return (c.montoMeli || 0) + (c.costoEnvioMeli || 0) + (c.montoIIBB || 0) + (c.impuestoGanancias || 0) + (c.montoIVA || 0);
});

const activeTotalTaxesOnly = computed(() => {
  const c = activeCalculated.value;
  return (c.montoIIBB || 0) + (c.impuestoGanancias || 0) + (c.montoIVA || 0);
});

// Porcentajes de Distribución sobre Precio Final
const pctCosto = computed(() => {
  const final = activeCalculated.value?.precioFinal || 0;
  if (final <= 0) return 0;
  return Math.round((effectiveCostARS.value / final) * 100);
});

const pctGanancia = computed(() => {
  const final = activeCalculated.value?.precioFinal || 0;
  if (final <= 0) return 0;
  return Math.round(((activeCalculated.value?.gananciaLimpia || 0) / final) * 100);
});

const pctMeli = computed(() => {
  const final = activeCalculated.value?.precioFinal || 0;
  if (final <= 0 || saleChannel.value !== 'meli') return 0;
  return Math.round(((activeCalculated.value?.totalAbonadoMeli || 0) / final) * 100);
});

const pctImpuestos = computed(() => {
  const final = activeCalculated.value?.precioFinal || 0;
  if (final <= 0) return 0;
  return Math.max(0, 100 - pctCosto.value - pctGanancia.value - pctMeli.value);
});

// --- DATOS DE COMPARATIVA (LOCAL vs MELI) ---
const comparisonData = computed(() => {
  const c = effectiveCostARS.value;
  const directRes = executeFormula(
    c,
    profitMarginPct.value,
    iibbPct.value,
    ivaPct.value,
    gananciasPct.value,
    false,
    meliCommissionPct.value,
    profitMarginBase.value,
    meliShippingThreshold.value,
    meliShippingCost.value,
    deductCostInGanancias.value
  );
  const meliRes = executeFormula(
    c,
    profitMarginPct.value,
    iibbPct.value,
    ivaPct.value,
    gananciasPct.value,
    true,
    meliCommissionPct.value,
    profitMarginBase.value,
    meliShippingThreshold.value,
    meliShippingCost.value,
    deductCostInGanancias.value
  );

  const diff = meliRes.precioFinal - directRes.precioFinal;
  const diffPct = directRes.precioFinal > 0 ? Math.round((diff / directRes.precioFinal) * 100) : 0;

  return {
    direct: directRes,
    meli: meliRes,
    difference: diff > 0 ? diff : 0,
    diffPct: diffPct > 0 ? diffPct : 0
  };
});

// --- SIMULADOR DE ESCENARIOS DE MARGEN ---
const marginScenarios = computed(() => {
  const costo = effectiveCostARS.value;
  if (costo <= 0) return [];

  const margins = [15, 20, 25, 30, 35, 40, 50];
  const isMeli = saleChannel.value === 'meli';

  return margins.map((mPct) => {
    const res = executeFormula(
      costo,
      mPct,
      iibbPct.value,
      ivaPct.value,
      gananciasPct.value,
      isMeli,
      meliCommissionPct.value,
      profitMarginBase.value,
      meliShippingThreshold.value,
      meliShippingCost.value,
      deductCostInGanancias.value
    );
    const markupSobreCosto = costo > 0 ? Math.round(((res.precioFinal - costo) / costo) * 100) : 0;

    return {
      margin: mPct,
      precioNeto: res.precioNeto,
      precioFinal: res.precioFinal,
      gananciaLimpia: res.gananciaLimpia,
      markupSobreCosto
    };
  });
});

// --- HELPERS Y ACCIONES ---
function formatNumber(val) {
  if (val == null || isNaN(val)) return '0,00';
  return Number(val).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDecimal(val, digits = 4) {
  if (val == null || isNaN(val)) return '0';
  return Number(val).toLocaleString('es-AR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function resetDefaults() {
  currency.value = 'ARS';
  costARS.value = 10000;
  costUSD.value = 9;
  dollarRate.value = 1550;
  profitMarginPct.value = 20;
  saleChannel.value = 'direct';
  meliCommissionPct.value = 15.0;
  resetTaxes();
  selectedProduct.value = null;
  $q.notify({ color: 'info', message: 'Valores restablecidos de referencia', icon: 'restart_alt', timeout: 1500 });
}

function resetTaxes() {
  iibbPct.value = 5.0;
  ivaPct.value = 21.0;
  gananciasPct.value = 35.0;
  meliCommissionPct.value = 15.0;
  deductCostInGanancias.value = false;
}

async function fetchDolarBlue() {
  fetchingDollar.value = true;
  try {
    const response = await axios.get('https://dolarapi.com/v1/dolares/blue', { timeout: 4000 });
    if (response.data && response.data.venta) {
      dollarRate.value = response.data.venta;
      $q.notify({
        color: 'positive',
        message: `Cotización Dólar Blue: $${response.data.venta}`,
        icon: 'check'
      });
    }
  } catch (err) {
    console.warn('Error consultando DolarAPI:', err);
    $q.notify({
      color: 'warning',
      message: 'No se pudo consultar cotización online. Ingrese el valor manualmente.',
      icon: 'warning'
    });
  } finally {
    fetchingDollar.value = false;
  }
}

function copyToClipboard(val) {
  if (!val) return;
  const text = formatNumber(val);
  navigator.clipboard?.writeText(text);
  $q.notify({
    color: 'positive',
    message: `Precio copiado al portapapeles: $${text}`,
    icon: 'content_copy',
    timeout: 1800
  });
}

// Catálogo
async function loadProducts() {
  loadingProducts.value = true;
  try {
    const res = await RecommendedProductsAPI.list();
    catalogProducts.value = res.data || [];
  } catch (err) {
    console.error('Error cargando catálogo:', err);
  } finally {
    loadingProducts.value = false;
  }
}

const filteredCatalogProducts = computed(() => {
  const query = productSearch.value.trim().toLowerCase();
  return catalogProducts.value.filter((p) => {
    if (!query) return true;
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.brand_name && p.brand_name.toLowerCase().includes(query))
    );
  });
});

function selectCatalogProduct(product) {
  selectedProduct.value = product;
  showProductSelector.value = false;

  if (product.purchase_price != null && product.purchase_price > 0) {
    currency.value = 'ARS';
    costARS.value = Number(product.purchase_price);
    $q.notify({
      color: 'positive',
      message: `Costo cargado de ${product.name}: $${formatNumber(product.purchase_price)}`,
      icon: 'check'
    });
  } else {
    $q.notify({
      color: 'info',
      message: `Seleccionaste ${product.name}. Ingresa el costo de compra.`,
      icon: 'info'
    });
  }
}

async function applyPriceToProduct() {
  if (!selectedProduct.value || !activeCalculated.value?.precioFinal) return;

  savingProductPrice.value = true;
  try {
    const roundedPrice = Math.round(activeCalculated.value.precioFinal * 100) / 100;
    await RecommendedProductsAPI.update(selectedProduct.value.id, {
      ...selectedProduct.value,
      selling_price: roundedPrice,
      purchase_price: effectiveCostARS.value
    });

    selectedProduct.value.selling_price = roundedPrice;
    selectedProduct.value.purchase_price = effectiveCostARS.value;

    $q.notify({
      color: 'positive',
      message: `Precio de venta guardado en catálogo: $${formatNumber(roundedPrice)}`,
      icon: 'check'
    });
  } catch (err) {
    console.error('Error actualizando precio del producto:', err);
    $q.notify({
      color: 'negative',
      message: 'No se pudo actualizar el precio en el catálogo',
      icon: 'error'
    });
  } finally {
    savingProductPrice.value = false;
  }
}

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.calculator-page {
  max-width: 1250px;
  margin: 0 auto;
}

.channel-card {
  border-radius: 10px;
  background: #fbfcfe;
}

.calculator-card {
  border-radius: 12px;
  border-color: #e5e9f0;
}

.calculator-hero-card {
  border-radius: 14px;
  background: linear-gradient(145deg, #ffffff, #f7faff);
  border: 2px solid #e1eaf7;
}

.meli-hero-card {
  background: linear-gradient(145deg, #fffdf7, #fff9e6);
  border: 2px solid #ffe082;
}

.price-display {
  letter-spacing: -0.5px;
}

.kpi-box {
  background: #ffffff;
  border: 1px solid #e8edf5;
  border-radius: 10px;
  padding: 10px 14px;
}

.font-mono {
  font-family: 'Roboto Mono', monospace, -apple-system, BlinkMacSystemFont;
}

.input-highlight :deep(.q-field__control) {
  background: #fbfdff;
}

.border-light {
  border: 1px solid #eef2f7;
}

.border-primary {
  border: 1px solid #90caf9;
}

.border-amber {
  border: 1px solid #ffe082;
}

.border-bottom {
  border-bottom: 1px solid #edf2f7;
}

.border-top {
  border-top: 1px solid #e2e8f0;
}

.bg-amber-05 {
  background-color: #fffbf0;
}

.distribution-bar {
  height: 14px;
  background: #edf2f7;
  display: flex;
}

.dist-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.scenarios-table :deep(th) {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 10px 12px;
}

.scenarios-table :deep(td) {
  font-size: 14px;
  padding: 8px 12px;
}

.active-scenario-row td {
  background-color: #eff6ff !important;
  font-weight: 600;
}

.product-pick-list {
  max-height: 380px;
  overflow-y: auto;
}

</style>
