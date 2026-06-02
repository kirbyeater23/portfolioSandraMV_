<template>
  <LoadingScreen />
  <div class="cursorPunto" ref="cursorPuntoEl"></div>
  <MobileMenu />
  <RouterView />
  <ModalProyecto />
  <GalleryViewer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import LoadingScreen from './components/LoadingScreen.vue'
import MobileMenu from './components/MobileMenu.vue'
import ModalProyecto from './components/ModalProyecto.vue'
import GalleryViewer from './components/GalleryViewer.vue'

const cursorPuntoEl = ref(null)

onMounted(() => {
  // Custom cursor
  const colorCursor = '#FF00CC'
  const puntoRadio = 4
  const cursorPunto = cursorPuntoEl.value

  if (cursorPunto) {
    gsap.set(cursorPunto, {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: colorCursor,
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 9999,
      pointerEvents: 'none'
    })
  }

  // Cursor trail segments
  const numSegmentos = 5
  const poolSegmentos = []
  for (let i = 0; i < numSegmentos; i++) {
    const seg = document.createElement('div')
    document.body.appendChild(seg)
    gsap.set(seg, {
      position: 'fixed',
      left: 0,
      top: 0,
      height: 2,
      width: 0,
      backgroundColor: colorCursor,
      transformOrigin: '0% 50%',
      opacity: 0,
      zIndex: 9998,
      pointerEvents: 'none'
    })
    poolSegmentos.push(seg)
  }

  let segIdx = 0
  let prevX = null, prevY = null
  let segStartX = null, segStartY = null
  let acumulado = 0
  const cadaPx = 18

  window.addEventListener('mousemove', (e) => {
    const cx = e.clientX
    const cy = e.clientY

    if (cursorPunto) {
      gsap.to(cursorPunto, { x: cx - puntoRadio, y: cy - puntoRadio, duration: 0.06, ease: 'none' })
    }

    if (prevX === null) {
      prevX = cx; prevY = cy
      segStartX = cx; segStartY = cy
      return
    }

    const dx = cx - prevX, dy = cy - prevY
    const dist = Math.sqrt(dx * dx + dy * dy)
    acumulado += dist

    if (acumulado >= cadaPx) {
      const angle = Math.atan2(cy - segStartY, cx - segStartX) * (180 / Math.PI)
      const longitud = Math.sqrt((cx - segStartX) ** 2 + (cy - segStartY) ** 2)
      const seg = poolSegmentos[segIdx % numSegmentos]
      segIdx++
      gsap.killTweensOf(seg)
      gsap.set(seg, { x: segStartX, y: segStartY - 1, width: longitud, rotation: angle, opacity: 1 })
      gsap.to(seg, { opacity: 0, duration: 0.5, ease: 'power1.out' })
      segStartX = cx; segStartY = cy
      acumulado = 0
    }

    prevX = cx; prevY = cy
  })

  // Pull-to-refresh on mobile
  if (window.matchMedia('(pointer: coarse)').matches) {
    let inicioY = 0
    let puedeRecargar = false

    function hayCapaAbierta() {
      return (
        document.querySelector('.modalSuperposicion.modalVisible') ||
        document.querySelector('.menuMovilOverlay.menuMovilVisible')
      )
    }

    function estaEscribiendo(elemento) {
      return elemento.closest('input, textarea, select')
    }

    window.addEventListener('touchstart', (e) => {
      puedeRecargar =
        window.scrollY === 0 &&
        !hayCapaAbierta() &&
        !estaEscribiendo(e.target)
      if (puedeRecargar) inicioY = e.touches[0].clientY
    }, { passive: true })

    window.addEventListener('touchmove', (e) => {
      if (!puedeRecargar || window.scrollY !== 0) return
      const distancia = e.touches[0].clientY - inicioY
      if (distancia > 120) {
        puedeRecargar = false
        window.location.reload()
      }
    }, { passive: true })

    window.addEventListener('touchend', () => { puedeRecargar = false })
  }
})
</script>
