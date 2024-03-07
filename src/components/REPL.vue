<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { default_extensions, complete_keymap } from '@nextjournal/clojure-mode'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { useREPLStore } from '~/stores/repl'
import IconPlay from './icons/IconPlay.vue'
import IconBase from './IconBase.vue'
import FormButton from './FormButton.vue'

const { t } = useI18n()

const replStore = useREPLStore()

const editor = ref(null)

const extensions = [
  ...default_extensions,
  keymap.of(complete_keymap),
  keymap.of({
    key: 'Ctrl-Enter',
    run: (view) => sendEval(view),
  }),
  keymap.of({
    key: 'Shift-Alt-ArrowUp',
    run: (view) => {
      const code = replStore.historyUp()
      if (code) {
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: code
          }
        })
        view.focus()
      }
    }
  }),
  keymap.of({
    key: 'Shift-Alt-ArrowDown',
    run: (view) => {
      const code = replStore.historyDown()
      if (code) {
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: code
          }
        })
        view.focus()
      }
    }
  }),
  oneDark,
]

const state = EditorState.create({
  doc: '(js/alert "Hello, World!")',
  extensions: extensions
})

let view = null

function sendEval(view) {
  const code = view.state.doc.toString()
  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: ''
    }
  })
  view.focus()
  replStore.runCode(code)
}

function onSubmit() {
  sendEval(view)
}

onMounted(() => {
  view = new EditorView({
    state: state,
    parent: editor.value,
    extensions: extensions
  })
})

onUnmounted(() => view.destroy())
</script>

<template>
  <div class="repl">
    <div class="actions">
      <FormButton
        type="submit"
        :title="t('run-title')"
        @click.prevent="onSubmit"
      >
        <IconBase>
          <IconPlay />
        </IconBase>
        {{ t('run') }}
      </FormButton>
    </div>
    <div
      ref="editor"
      class="editor"
    />
    <div class="result">
      <h3>{{ t('result') }}</h3>
      <pre class="output">
        {{ replStore.result }}
      </pre>
    </div>
  </div>
</template>

<style scoped>
.repl {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr 1fr;
}

.editor {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.result {
  padding: 1rem;
  background-color: var(--db-tertiary);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: auto;
}

.actions {
  margin-block-end: 0.5rem;
}
</style>

<i18n>
{
  "en": {
    "result": "Result",
    "run": "Run",
    "run-title": "Click Run or press Ctrl-Enter to evaluate code"
  },
  "es": {
    "result": "Resultado",
    "run": "Ejecutar",
    "run-title": "Haz clic en Ejecutar o presiona Ctrl-Enter para evaluar el código"
  }
}
</i18n>
