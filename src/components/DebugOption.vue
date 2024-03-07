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
    "pixel-grid": "Shows the pixel grid when you zoom in the workspace",
    "html-text": "Shows the hidden HTML text editing element"
  },
  "es": {
    "events": "Muestra cada evento emitido en la consola",
    "thumbnails": "Muestra un borde rosa alrededor de cada impostor (también llamado miniatura) en el espacio de trabajo",
    "pixel-grid": "Muestra la cuadrícula de píxeles cuando haces zoom en el espacio de trabajo",
    "html-text": "Muestra el elemento de edición de texto HTML oculto"
  }
}
</i18n>
