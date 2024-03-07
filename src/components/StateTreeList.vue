<script setup>
import StateTreeItem from './StateTreeItem.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ul>
    <StateTreeItem
      v-for="item in props.items"
      :key="item.id"
      :item="item"
    />
  </ul>
</template>
