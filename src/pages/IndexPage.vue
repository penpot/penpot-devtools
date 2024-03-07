<script setup>
import PageContainer from '~/components/PageContainer.vue'
import REPL from '~/components/REPL.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <PageContainer :title="t('repl')">
    <REPL />
  </PageContainer>
</template>

<i18n>
{
  "en": {
    "repl": "REPL"
  },
  "es": {
    "repl": "REPL"
  }
}
</i18n>
