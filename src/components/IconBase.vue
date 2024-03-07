<script setup>
const props = defineProps({
  size: {
    type: String,
    default: '1rem'
  }
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    :width="props.size"
    :height="props.size"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <slot />
  </svg>
</template>
