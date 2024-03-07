<script setup>
import IconPlay from './components/icons/IconPlay.vue'
import IconTree from './components/icons/IconTree.vue'
import IconBug from './components/icons/IconBug.vue'
import IconBase from './components/IconBase.vue'
import PenpotLogo from './components/PenpotLogo.vue'
import { useI18n } from 'vue-i18n'
import { useStatusStore } from './stores/status'

const statusStore = useStatusStore()

const { t } = useI18n()
</script>

<template>
  <header>
    <div class="logo">
      <PenpotLogo />
    </div>
    <nav>
      <router-link
        class="tab"
        active-class="active"
        to="/"
      >
        <IconBase>
          <IconPlay />
        </IconBase>
        {{ t('repl') }}
      </router-link>
      <router-link
        class="tab no-fill"
        active-class="active"
        to="/state"
      >
        <IconBase>
          <IconTree />
        </IconBase>
        {{ t('state') }}
      </router-link>
      <router-link
        class="tab no-fill"
        active-class="active"
        to="/options"
      >
        <IconBase>
          <IconBug />
        </IconBase>
        {{ t('options') }}
      </router-link>
    </nav>
    <div class="status">
      {{ statusStore.status }}
    </div>
  </header>
  <main>
    <router-view />
  </main>
  <div
    v-if="statusStore.status === 'disconnected'"
    class="veil"
  >
    {{ t('disconnected') }}
  </div>
</template>

<style scoped>
header {
  width: 100%;
  height: 100%;
  background-color: var(--db-secondary);
  display: flex;
  place-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo {
  margin-inline-start: 1rem;
}

.status {
  margin-inline-end: 1rem;
}

nav {
  display: flex;
  place-items: center;
  gap: 1rem;
  margin-inline-start: 1rem;
}

main {
  display: grid;
  width: 100%;
  height: 100%;
}

.tab {
  border: none;
  border-radius: 0.5rem;
  color: var(--df-primary);
  fill: var(--df-primary);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
}

.tab:hover {
  color: var(--da-primary);
  fill: var(--da-primary);
}

.tab:active, .tab.active {
  background-color: var(--db-tertiary);
  color: var(--da-primary);
  fill: var(--da-primary);
}

.no-fill, .no-fill:hover, .no-fill:active, .no-fill.active {
  fill: none;
}

.no-fill {
  stroke: var(--df-primary);
}

.no-fill:hover {
  stroke: var(--da-primary);
}

.no-fill:active, .no-fill.active {
  stroke: var(--da-primary);
}

.veil {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: var(--df-primary);
  display: grid;
  place-items: center;
}
</style>

<i18n>
{
  "en": {
    "repl": "REPL",
    "state": "State",
    "options": "Options",
    "disconnected": "Disconnected"
  },
  "es": {
    "repl": "REPL",
    "state": "Estado",
    "options": "Opciones",
    "disconnected": "Desconectado"
  }
}
</i18n>
