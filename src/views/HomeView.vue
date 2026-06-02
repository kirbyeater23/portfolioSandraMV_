<template>
  <header>
    <NavBar />
    <div class="landingHome">
      <div class="placeholderRectangulo videoGrandeEntrada">
        <video
          class="placeholderRectangulo videoGrandeEntrada"
          src="/assets/images/embody/cara.mp4"
          autoplay muted loop playsinline
        ></video>
      </div>
      <div class="textosHero">
        <h1><span class="colorRosa">*</span>DESIGN</h1>
        <h1>HAVING <em class="colorRosa">FUN</em></h1>
      </div>
    </div>
  </header>

  <main>
    <section class="seccionUltimos">
      <span class="etiquetaSeccion">LATEST</span>
      <div class="estructuraProyectos" id="gridProyectos">
        <article
          v-for="proyecto in ultimos"
          :key="proyecto.id"
          :class="['cardProyecto', proyecto.alineacion]"
          :data-id="proyecto.id"
          @click="abrirModal(proyecto)"
          style="cursor:pointer"
        >
          <div class="imagenProyecto placeholderRectangulo">
            <video
              v-if="esVideoCard(proyecto)"
              :src="srcCard(proyecto)"
              muted loop playsinline autoplay
              :style="{ objectPosition: proyecto.objectPosition || 'center' }"
            ></video>
            <img
              v-else
              :src="srcCard(proyecto)"
              :alt="proyecto.nombre"
              :style="{ objectPosition: proyecto.objectPosition || 'center' }"
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
    </section>

    <section class="seccionServicios">
      <div class="columnaServicios">
        <ul class="listaServiciosHome">
          <li><span class="destacado">*MOTION</span></li>
          <li><span class="destacado">BRANDING</span></li>
          <li><span class="destacado">ILLUSTRATION</span></li>
          <li><span class="destacado">EDITORIAL</span></li>
          <li><span class="destacado">WEB DESIGN</span></li>
        </ul>
      </div>
      <div class="columnaBio">
        <p class="bioServiciosHome">
          From concept to execution, illustration and web design — I create
          content that are engaging, thoughtful and full of character. My work
          spans branding, editorial, illustration and motion, always with an
          eye for detail and a love of typography.
        </p>
        <small></small>
        <RouterLink to="/contact" class="enlaceContacto"><small>// CONTACT ME</small></RouterLink>
      </div>
    </section>
  </main>

  <SiteFooter />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { useModal } from '../composables/useModal.js'
import { usePageAnimations } from '../composables/useAnimations.js'

const { state: modalState, abrirModal } = useModal()
const { aplicarAnimaciones, aplicarScramble, cleanup } = usePageAnimations()

const ultimos = ref([])

function srcCard(p) {
  return p.mediaCard || p.media
}
function esVideoCard(p) {
  return srcCard(p).endsWith('.mp4')
}

onUnmounted(() => cleanup())

onMounted(async () => {
  document.title = 'Sandra Martínez Villacorta | Kirbyeater'
  const res = await fetch(import.meta.env.BASE_URL + 'app/data/proyectos.json')
  const proyectos = await res.json()
  modalState.todosProyectos = proyectos
  ultimos.value = proyectos.slice(0, 3)

  await nextTick()
  aplicarAnimaciones()
  aplicarScramble()
})
</script>
