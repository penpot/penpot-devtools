<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '~/stores/state'
import StateTreeList from './StateTreeList.vue'
import IconArrow from './icons/IconArrow.vue'
import IconReload from './icons/IconReload.vue'
import IconBase from './IconBase.vue'

const { t } = useI18n()

const stateStore = useStateStore()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
})

const arrowDirection = computed(() => props.item.isExpanded ? 'down' : 'right')

function onToggle() {
  if (!props.item.isExpandable) return
  stateStore.toggle(props.item)
}

function onRefresh() {
  stateStore.refresh(props.item)
}
</script>

<template>
  <li class="item">
    <div
      class="line"
      :class="{ expanded: props.item.isExpanded }"
      @click="onToggle"
    >
      <div
        v-if="props.item.isExpandable"
        class="arrow"
      >
        <IconBase :size="'1.5rem'">
          <IconArrow
            :direction="arrowDirection"
          />
        </IconBase>
      </div>
      <div
        v-else
        class="arrow variable"
      >
        <IconBase :size="'1.5rem'">
          <IconArrow direction="right" />
        </IconBase>
      </div>
      <div class="name">
        {{ props.item.name }}
      </div>
      <div
        class="type"
        :class="props.item.type.replace(/:+/g, '-')"
        @click.stop="onRefresh"
      >
        <IconBase
          class="reload"
          :size="'0.5rem'"
        >
          <IconReload />
        </IconBase>
        {{ props.item.type }}
      </div>
      <div
        v-if="!props.item.isExpandable"
        class="value"
      >
        {{ props.item.value }}
      </div>
    </div>
    <ul
      v-if="props.item.isExpanded && props.item.state === 'loading'"
      class="loading"
    >
      {{ t('loading') }}
    </ul>
    <StateTreeList
      v-if="props.item.isExpanded && props.item.state === 'loaded'"
      :items="props.item.children"
    />
  </li>
</template>

<style scoped>
.item {
  list-style: none;
}

.type {
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--color-magenta);
}

.type, .value {
  margin-inline-start: 0.5rem;
}

.value {
  color: var(--da-primary);
}

.unknown-unknown {
  background-color: var(--color-red);
}

.cljs-map, .cljs-set, .cljs-list, .cljs-vector, .cljs-keyword, .cljs-uuid {
  background-color: var(--color-cyan);
}

.js-number, .js-string, .js-boolean, .js-array,
.js-object, .js-function, .js-undefined, .js-null {
  background-color: var(--color-purple);
}

.line {
  display: flex;
  align-items: center;
}

.name {
  color: var(--df-secondary);
}

.expanded .name {
  color: var(--df-primary);
}

.arrow {
  fill: var(--da-primary);
}

.arrow.variable {
  fill: var(--da-secondary);
}

.loading {
  padding: 0.5rem;
  padding-inline-start: 2rem;
  color: var(--color-magenta);
  border-radius: 0.25rem;
  display: flex;
  list-style: none;
}

.reload {
  fill: none;
  stroke: var(--df-primary);
}
.reload:hover {
  fill: none;
  stroke: var(--da-primary);
}

.name {

}
</style>

<i18n>
{
  "en": {
    "loading": "Loading..."
  },
  "es": {
    "loading": "Cargando..."
  }
}
</i18n>
