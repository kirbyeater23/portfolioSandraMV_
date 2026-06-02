import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import WorkView from './views/WorkView.vue'
import AboutView from './views/AboutView.vue'
import ContactView from './views/ContactView.vue'
import '../assets/sass/main.scss'

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/work', component: WorkView },
    { path: '/about', component: AboutView },
    { path: '/contact', component: ContactView },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

createApp(App).use(router).mount('#app')
