<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { v4 as uuid } from 'uuid'

const props = defineProps({
  id: {
    type: String,
    default: () => uuid()
  },
  labelPosition: {
    type: String,
    default: 'start'
  }
})
</script>

<template>
  <label
    v-if="props.labelPosition === 'start'"
    :for="id"
    class="label start"
  ><slot /></label>
  <input
    :id="id"
    v-bind="$attrs"
  >
  <label
    v-if="props.labelPosition === 'end'"
    :for="id"
    class="label end"
  ><slot /></label>
</template>

<style scoped>
input[type="text"],
input[type="password"],
input[type="email"],
input[type="search"] {
  border-radius: 0.25rem;
  border: 0;
  padding: 0.25rem 0.5rem;
  color: var(--df-primary);
  background-color: var(--db-quaternary);
  outline: 1px solid var(--da-primary);
}
input::selection {
  background-color: var(--da-tertiary);
  color: var(--df-primary);
}

.label {

}

.start {
  margin-inline-end: 0.5rem;
}

.end {
  margin-inline-start: 0.5rem;
}
</style>
