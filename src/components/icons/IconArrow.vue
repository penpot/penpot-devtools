<script setup>
import { computed } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'right'
  }
})

const rotation = computed(() => {
  switch (props.direction) {
    case 'up':
      return 270
    case 'down':
      return 90
    case 'left':
      return 180
    case 'right':
    default:
      return 0
  }
})
</script>
<template>
  <path
    d="m6 12 4-4-4-4"
    :transform="`rotate(${rotation} 8 8)`"
  />
</template>
