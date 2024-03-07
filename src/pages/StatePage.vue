<script setup>
import { onMounted } from 'vue'
import { useStateStore } from '~/stores/state'
import PageContainer from '~/components/PageContainer.vue'
import StateTreeItem from '~/components/StateTreeItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const stateStore = useStateStore()

onMounted(() => stateStore.refresh())
</script>

<template>
  <PageContainer :title="t('state')">
    <div class="state">
      <!--
      <FormInput v-model="stateStore.filter" type="text">
        {{ t('filter') }}
      </FormInput>
      -->
      <StateTreeItem :item="stateStore.state" />
    </div>
  </PageContainer>
</template>

<style scoped>

</style>

<i18n>
{
  "en": {
    "state": "State",
    "filter": "Filter"
  },
  "es": {
    "state": "Estado",
    "filter": "Filtro"
  }
}
</i18n>
