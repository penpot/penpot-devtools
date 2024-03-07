import './style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { MessagingPlugin } from './plugins/messaging'
import App from './App.vue'

const routes = [
  { path: '/', component: () => import('./pages/IndexPage.vue') },
  { path: '/options', component: () => import('./pages/DebugOptionsPage.vue') },
  { path: '/state', component: () => import('./pages/StatePage.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const pinia = createPinia()

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
})

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(MessagingPlugin)
  .mount('#app')
