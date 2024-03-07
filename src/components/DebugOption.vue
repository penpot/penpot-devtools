<script setup>
import { useOptionsStore } from '~/stores/options'
import { useI18n } from 'vue-i18n'
import FormInput from './FormInput.vue'

const { t } = useI18n()

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
})

const optionsStore = useOptionsStore()

function onChange() {
  optionsStore.toggle(props.option)
}
</script>

<template>
  <div class="option">
    <div class="title">
      <FormInput
        :checked="props.option.enabled"
        type="checkbox"
        label-position="end"
        @input="onChange()"
      >
        <h3>{{ props.option.id }}</h3>
      </FormInput>
    </div>
    <!-- eslint-disable-next-line -->
    <p>{{ t(props.option.id) }}</p>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  text-transform: capitalize;
}

.option {
  box-sizing: border-box;
  background-color: var(--db-tertiary);
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>

<i18n>
{
  "en": {
    "events": "Shows every emitted event in the console",
    "thumbnails": "Shows a pink border around every imposter (also called thumbnail) in the workspace",
    "disable-thumbnail-cache": "Disables the thumbnail cache",
    "force-frame-thumbnails": "Forces the display of frame imposters",
    "pixel-grid": "Shows the pixel grid when you zoom in the workspace",
    "html-text": "Shows the hidden HTML text editing element",
    "grid-cells": "Shows colored grid cells",
    "grid-layout": "Shows grid layout",
    "bounding-boxes": "Shows bounding boxes",
    "handlers": "Shows debug handlers",
    "history-overlay": "Shows a history overlay with the undo/redo stack",
    "layout-content-bounds": "Shows layout content bounds",
    "layout-drop-zones": "Shows layout drop zones",
    "layout-lines": "Shows layout lines",
    "selection-center": "Shows the center of the selection",
    "shape-panel": "Shows the shape panel",
    "shape-titles": "Shows shape titles",
    "show-export-metadata": "Shows export metadata",
    "show-touched": "Shows touched elements",
    "simple-selection": "Shows simple selection",
    "text-outline": "Shows text outline"
  },
  "es": {
    "events": "Muestra cada evento emitido en la consola",
    "thumbnails": "Muestra un borde rosa alrededor de cada impostor (también llamado miniatura) en el espacio de trabajo",
    "disable-thumbnail-cache": "Deshabilita la caché de miniaturas",
    "force-frame-thumbnails": "Fuerza la visualización de los impostores de los frames",
    "pixel-grid": "Muestra la cuadrícula de píxeles cuando haces zoom en el espacio de trabajo",
    "html-text": "Muestra el elemento de edición de texto HTML oculto",
    "grid-cells": "Muestra celdas de cuadrícula de colores",
    "grid-layout": "Muestra el diseño de cuadrícula",
    "bounding-boxes": "Muestra cuadros delimitadores",
    "handlers": "Muestra manejadores de depuración",
    "history-overlay": "Muestra una superposición de historial con la pila de deshacer/rehacer",
    "layout-content-bounds": "Muestra límites de contenido de diseño",
    "layout-drop-zones": "Muestra zonas de caída de diseño",
    "layout-lines": "Muestra líneas de diseño",
    "selection-center": "Muestra el centro de la selección",
    "shape-panel": "Muestra el panel de formas",
    "shape-titles": "Muestra los títulos de las formas",
    "show-export-metadata": "Muestra metadatos de exportación",
    "show-touched": "Muestra elementos tocados",
    "simple-selection": "Muestra la selección simple",
    "text-outline": "Muestra el contorno del texto"
  }
}
</i18n>
