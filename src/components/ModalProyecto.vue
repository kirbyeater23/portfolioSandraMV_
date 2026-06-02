<template>
  <div
    ref="overlayEl"
    :class="['modalSuperposicion', { modalVisible: !!modalState.proyectoActivo }]"
    @click="handleOverlayClick"
  >
    <button class="modalCerrar" @click.stop="cerrarModal">×</button>

    <div v-if="proyecto" ref="innerEl">
      <!-- Portada -->
      <div class="modalPortada">
        <div :class="['modalPortadaMedio', { modalVacio: !proyecto.media }]">
          <template v-if="proyecto.media">
            <div v-if="esVideo(proyecto.media)" class="mediaVideo">
              <video :src="proyecto.media" muted loop playsinline autoplay></video>
              <button class="botonAudioVideo" type="button" aria-label="Activar audio" @click.stop="toggleAudio($event)">AUDIO OFF</button>
            </div>
            <img v-else :src="proyecto.media" :alt="proyecto.nombre" />
          </template>
        </div>
        <div class="modalPortadaInfo">
          <span class="modalEtiquetas">{{ tagsStr }}</span>
          <h1 class="modalTitulo">{{ proyecto.nombre }}</h1>
        </div>
      </div>

      <!-- Info básica -->
      <div class="modalInfoBasica">
        <div class="modalDato">
          <small class="modalEtiquetaDato">CLIENTE</small>
          <span>{{ proyecto.cliente }}</span>
        </div>
        <div class="modalDato">
          <small class="modalEtiquetaDato">AÑO</small>
          <span>{{ proyecto.anio }}</span>
        </div>
        <div class="modalDato">
          <small class="modalEtiquetaDato">CATEGORÍA</small>
          <span>{{ proyecto.categoria }}</span>
        </div>
        <div class="modalDato">
          <small class="modalEtiquetaDato">DESCRIPCIÓN</small>
          <span>{{ proyecto.descripcionCorta }}</span>
        </div>
      </div>

      <!-- 01 Preview -->
      <div class="modalSeccion">
        <small class="modalApartado">01 — PREVIEW</small>
        <div :class="['modalImagenCompleta', { modalVacio: !proyecto.imagen1 }]">
          <MediaEl v-if="proyecto.imagen1" :src="proyecto.imagen1" />
        </div>
      </div>

      <!-- 02 Concepto -->
      <div class="modalSeccion">
        <small class="modalApartado">02 — CONCEPTO</small>
        <div class="modalConceptoRejilla">
          <div :class="['modalConceptoImagen', { modalVacio: !proyecto.imagen2 }]">
            <MediaEl v-if="proyecto.imagen2" :src="proyecto.imagen2" @audio-toggle="toggleAudio" />
          </div>
          <div class="modalConceptoTexto">
            <h2>{{ proyecto.concepto }}</h2>
            <p>{{ proyecto.descripcionLarga }}</p>
            <span class="modalAsterisco">*</span>
          </div>
        </div>
      </div>

      <!-- Cita -->
      <div v-if="proyecto.cita" class="modalCita">
        <blockquote class="modalCitaTexto">{{ proyecto.cita }}</blockquote>
        <p class="modalCitaApoyo">{{ proyecto.citaTexto }}</p>
      </div>

      <!-- Proceso -->
      <div class="modalProceso">
        <div class="modalProcesoTexto">
          <h3>{{ proyecto.procesoTitulo }}</h3>
          <p>{{ proyecto.procesoTexto }}</p>
        </div>
        <div :class="['modalProcesoImagen', { modalVacio: !proyecto.imagen3 }]">
          <MediaEl v-if="proyecto.imagen3" :src="proyecto.imagen3" @audio-toggle="toggleAudio" />
        </div>
      </div>

      <!-- 03 Galería -->
      <div class="modalSeccion">
        <small class="modalApartado">03 — GALERÍA</small>
        <div class="modalGaleriaRejilla">
          <div
            v-for="(src, i) in imagenesGaleria"
            :key="i"
            class="modalGaleriaElemento"
            @click.stop="abrirEnLightbox(src)"
          >
            <MediaEl :src="src" @audio-toggle="toggleAudio" />
          </div>
        </div>
      </div>

      <!-- Siguiente proyecto -->
      <div
        v-if="proyecto.siguienteProyecto && proyectoSiguiente"
        class="modalSiguiente"
        style="cursor:pointer"
        @click.stop="irSiguienteProyecto(proyectoSiguiente.id)"
      >
        <small class="modalEtiquetaDato">SIGUIENTE TRABAJO</small>
        <h2 class="modalSiguienteTitulo">→ {{ proyecto.siguienteProyecto }}*</h2>
      </div>
      <div
        v-else-if="proyecto.siguienteProyecto"
        class="modalSiguiente"
      >
        <small class="modalEtiquetaDato">SIGUIENTE TRABAJO</small>
        <h2 class="modalSiguienteTitulo">→ {{ proyecto.siguienteProyecto }}*</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useModal } from '../composables/useModal.js'
import { useGallery } from '../composables/useGallery.js'
import MediaEl from './MediaEl.vue'

const { state: modalState, cerrarModal, irSiguienteProyecto } = useModal()
const { abrirGaleria } = useGallery()

const overlayEl = ref(null)
const innerEl = ref(null)
let modalScrollTriggers = []

const proyecto = computed(() => modalState.proyectoActivo)

const tagsStr = computed(() => {
  if (!proyecto.value) return ''
  const t = proyecto.value.tags
  return Array.isArray(t) ? t.join(' // ') : (t || '')
})

const proyectoSiguiente = computed(() => {
  if (!proyecto.value?.siguienteProyecto) return null
  return modalState.todosProyectos.find(x => x.nombre === proyecto.value.siguienteProyecto) || null
})

const imagenesGaleria = computed(() => {
  if (!proyecto.value) return []
  const imgs = []
  let i = 4
  while (proyecto.value[`imagen${i}`] !== undefined) {
    imgs.push(proyecto.value[`imagen${i}`])
    i++
  }
  return imgs.filter(src => src && src.trim())
})

function esVideo(src) {
  return src && src.trim().endsWith('.mp4')
}

function abrirEnLightbox(src) {
  const type = esVideo(src) ? 'video' : 'image'
  abrirGaleria(src.trim(), type)
}

function toggleAudio(e) {
  const botonAudio = e.target.closest?.('.botonAudioVideo') || (e.target.classList?.contains('botonAudioVideo') ? e.target : null)
  if (!botonAudio) return

  const video = botonAudio.closest('.mediaVideo')?.querySelector('video')
  if (!video) return

  const activarAudio = video.muted
  document.querySelectorAll('.mediaVideo video').forEach(v => {
    if (v !== video) v.muted = true
  })
  document.querySelectorAll('.botonAudioVideo').forEach(b => {
    if (b !== botonAudio) {
      b.textContent = 'AUDIO OFF'
      b.setAttribute('aria-label', 'Activar audio')
    }
  })

  video.muted = !activarAudio
  if (activarAudio) video.volume = 1
  botonAudio.textContent = activarAudio ? 'AUDIO ON' : 'AUDIO OFF'
  botonAudio.setAttribute('aria-label', activarAudio ? 'Silenciar audio' : 'Activar audio')
  video.play()
}

function handleOverlayClick(e) {
  // Audio button clicks are handled by toggleAudio via event delegation
  const botonAudio = e.target.closest('.botonAudioVideo')
  if (botonAudio) {
    toggleAudio(e)
    return
  }
}

const selectoresModal = [
  '.modalInfoBasica', '.modalSeccion', '.modalImagenCompleta',
  '.modalConceptoRejilla', '.modalCita', '.modalProceso',
  '.modalGaleriaRejilla', '.modalSiguiente',
]

function animarModal(overlay) {
  modalScrollTriggers.forEach(st => st.kill())
  modalScrollTriggers = []

  selectoresModal.forEach(s => {
    overlay.querySelectorAll(s).forEach(el => {
      gsap.set(el, { opacity: 0, y: 40 })
      const st = ScrollTrigger.create({
        trigger: el,
        scroller: overlay,
        start: 'top 90%',
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }),
      })
      modalScrollTriggers.push(st)
    })
  })
}

watch(() => modalState.proyectoActivo, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    await nextTick()
    await nextTick()
    const overlay = overlayEl.value
    if (!overlay) return
    gsap.from(overlay, { opacity: 0, y: 500, duration: 1, ease: 'power2.out' })
    await nextTick()
    animarModal(overlay)
  } else if (!newVal) {
    modalScrollTriggers.forEach(st => st.kill())
    modalScrollTriggers = []
  }
})
</script>
