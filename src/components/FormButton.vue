<template>
  <button v-bind="$attrs">
    <slot />
  </button>
</template>

<style scoped>
button {
  background-color: var(--db-tertiary);
  border: none;
  border-radius: 0.5rem;
  color: var(--df-primary);
  fill: var(--df-primary);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 1rem;
}

button:hover {
  background-color: var(--db-quaternary);
  color: var(--da-primary);
  fill: var(--da-primary);
}

button:active {
  background-color: var(--color-primary-darker);
}
</style>
