<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="container">
    <h1>{{ props.title }}</h1>
    <slot />
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>
