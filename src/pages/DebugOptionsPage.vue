<script setup>
import { useOptionsStore } from '~/stores/options';
import PageContainer from '~/components/PageContainer.vue'
import DebugOption from '~/components/DebugOption.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const optionsStore = useOptionsStore()
</script>

<template>
  <PageContainer :title="t('options')">
    <div class="options">
      <DebugOption
        v-for="option in optionsStore.options"
        :key="option.id"
        :option="option"
      />
    </div>
  </PageContainer>
</template>

<style scoped>
.container {
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.5rem;
}
</style>

<i18n>
{
  "en": {
    "options": "Options"
  },
  "es": {
    "options": "Opciones"
  }
}
</i18n>
