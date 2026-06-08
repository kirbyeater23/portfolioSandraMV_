<template>
  <header>
    <NavBar />
  </header>

  <main class="seccionWork">
    <div class="filtrosWork">
      <template v-for="(f, i) in filtros" :key="f.valor">
        <span v-if="i > 0" class="separadorFiltro">//</span>
        <button
          :class="['filtroBtn', { filtroActivo: filtroActivo === f.valor }]"
          :data-filtro="f.valor"
          @click="cambiarFiltro(f.valor)"
        >{{ f.etiqueta }}</button>
      </template>
    </div>

    <div class="gridWork" id="gridWork">
      <article
        v-for="proyecto in proyectosFiltrados"
        :key="proyecto.id"
        :class="['cardWork', `cardWork--${proyecto.tamano}`]"
        :data-categoria="proyecto.categoria"
        :data-id="proyecto.id"
        style="cursor:pointer"
        @click="abrirModal(proyecto)"
      >
        <div
          class="imagenWork placeholderRectangulo"
          :style="proyecto.alturaImagen ? { height: proyecto.alturaImagen } : {}"
        >
          <video
            v-if="esVideoCard(proyecto)"
            :src="srcCard(proyecto)"
            muted loop playsinline
            :style="{ objectFit: proyecto.fitImagen || 'cover', objectPosition: proyecto.objectPosition || 'center' }"
          ></video>
          <img
            v-else
            :src="srcCard(proyecto)"
            :alt="proyecto.nombre"
            :style="{ objectFit: proyecto.fitImagen || 'cover', objectPosition: proyecto.objectPosition || 'center' }"
          />
        </div>
        <div class="infoProyecto">
          <div class="nombreDescripcion">
            <div class="infoCardNombre"><h3>{{ proyecto.nombre }}</h3></div>
            <div class="infoCardDescripcion"><h4>{{ proyecto.descripcion }}</h4></div>
          </div>
          <div class="infoCardCliente"><h5>// {{ proyecto.cliente }}</h5></div>
        </div>
      </article>
    </div>
  </main>

  <SiteFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { useModal } from '../composables/useModal.js'
import { usePageAnimations } from '../composables/useAnimations.js'

const { state: modalState, abrirModal } = useModal()
const { aplicarAnimaciones, aplicarScramble, cleanup } = usePageAnimations()

const proyectos = ref([])
const filtroActivo = ref('all')

const filtros = [
  { valor: 'all', etiqueta: 'ALL' },
  { valor: 'editorial', etiqueta: 'EDITORIAL' },
  { valor: 'ilustracion', etiqueta: 'ILUSTRACION' },
  { valor: 'branding', etiqueta: 'BRANDING' },
  { valor: 'motion', etiqueta: 'MOTION' },
]

const proyectosFiltrados = computed(() => {
  if (filtroActivo.value === 'all') return proyectos.value
  const term = filtroActivo.value.toLowerCase()
  return proyectos.value.filter(p => {
    const cat = (p.categoria || '').toLowerCase()
    const tags = (p.tags || []).join(' ').toLowerCase()
    return cat.includes(term) || tags.includes(term)
  })
})

function srcCard(p) { return p.mediaCard || p.media }
function esVideoCard(p) { return srcCard(p).endsWith('.mp4') }

async function cambiarFiltro(valor) {
  filtroActivo.value = valor
  cardActual = null
  if (pensante) gsap.to(pensante, { opacity: 0, scale: 0.85, duration: 0.1 })
  await nextTick()
  aplicarAnimaciones()
}

// "Pensante" character animation on desktop
let pensante = null
let cardActual = null
let cursorX = 0, cursorY = 0
let saltoId = null

function saltar() {
  const ox = (Math.random() - 0.5) * 120 + 20
  const oy = -(Math.random() * 100 + 30)
  gsap.to(pensante, { x: cursorX + ox, y: cursorY + oy, duration: 0.06, ease: 'none' })
  saltoId = setTimeout(saltar, Math.random() * 220 + 80)
}

function onMouseMove(e) { cursorX = e.clientX; cursorY = e.clientY }

function onMouseOver(e) {
  const card = e.target.closest('.cardWork')
  if (card && card !== cardActual) {
    cardActual = card
    gsap.to(pensante, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' })
    clearTimeout(saltoId)
    saltar()
  } else if (!card && cardActual) {
    cardActual = null
    clearTimeout(saltoId)
    saltoId = null
    gsap.to(pensante, { opacity: 0, scale: 0.85, duration: 0.2 })
  }
}

onMounted(async () => {
  document.title = 'Work | Sandra Martínez Villacorta'

  // Pensante: se inicializa antes del fetch, igual que en el original
  if (!window.matchMedia('(pointer: coarse)').matches) {
    pensante = document.createElement('img')
    pensante.src = 'assets/images/pensante.png'
    pensante.style.cssText = 'position:fixed;top:0;left:0;width:160px;height:auto;pointer-events:none;opacity:0;z-index:50;'
    document.body.appendChild(pensante)
    gsap.set(pensante, { x: 0, y: 0, scale: 0.85 })
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
  }

  const res = await fetch(import.meta.env.BASE_URL + 'app/data/proyectos.json')
  const data = await res.json()
  proyectos.value = data
  modalState.todosProyectos = data

  await nextTick()
  aplicarAnimaciones()
  aplicarScramble()
})

onUnmounted(() => {
  cleanup()
  clearTimeout(saltoId)
  if (pensante) {
    pensante.remove()
    pensante = null
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseover', onMouseOver)
})

// Re-apply scroll animations after filter changes render
watch(proyectosFiltrados, async () => {
  await nextTick()
  aplicarAnimaciones()
})
</script>

