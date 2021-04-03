<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >
    <q-input
      filled
      v-model="aspectoFisico"
      label="Aspecto Físico"
      lazy-rules
      :rules="aspectoFisicoRules"
      :counter="maxLengthAspectoFisico"
    />
    <q-card>
      <q-card-section>
        <div class="text-h6">Piel</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-input
            filled
            v-model="tipoPiel"
            label="Tipo"
            lazy-rules
            :rules="tipoPielRules"
            :counter="maxLengthTipoPiel"
            class="col-6"
          />
          <q-separator/>
          <q-input
            filled
            v-model="formaPiel"
            label="Forma"
            lazy-rules
            :rules="formaPielRules"
            :counter="maxLengthFormaPiel"
            class="col-6"
          />
        </div>
        <div class="row">
          <q-input
            filled
            v-model="disposicionPiel"
            label="Disposición"
            lazy-rules
            :rules="disposicionPielRules"
            :counter="maxLengthDisposicionPiel"
            class="col-6"
          />
          <q-separator/>
          <q-input
            filled
            v-model="distribucionLesionesPiel"
            label="Distribución de Lesiones"
            lazy-rules
            :rules="distribucionLesionesPielRules"
            :counter="maxLengthDistribucionLesionesPiel"
            class="col-6"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-h6">Lesión</div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          v-model="inicioLesion"
          label="Inicio"
          lazy-rules
          :rules="inicioLesionRules"
          :counter="maxLengthInicioLesion"
        />
        <q-input
          filled
          v-model="lugarInicioLesion"
          label="Lugar de Inicio"
          lazy-rules
          :rules="lugarInicioLesionRules"
          :counter="maxLengthLugarInicioLesion"
        />
        <q-input
          filled
          v-model="sintomasLesion"
          label="Síntomas"
          lazy-rules
          :rules="sintomasLesionRules"
          :counter="maxLengthSintomasLesion"
        />
        <q-input
          filled
          v-model="cambiosLesion"
          label="Cambios"
          lazy-rules
          :rules="cambiosLesionRules"
          :counter="maxLengthCambiosLesion"
        />
        <q-input
          filled
          v-model="factoresIncrementanSintomasLesion"
          label="Factores que Incrementan Síntomas"
          lazy-rules
          :rules="factoresIncrementanSintomasLesionRules"
          :counter="maxLengthFactoresIncrementanSintomasLesion"
        />
        <q-input
          filled
          v-model="tratamientosPosterioresLesion"
          label="Tratamientos Posteriores"
          lazy-rules
          :rules="tratamientosPosterioresLesionRules"
          :counter="maxLengthTratamientosPosterioresLesion"
        />
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ObservacionLesiones'
})
</script>

<style scoped>

</style>
