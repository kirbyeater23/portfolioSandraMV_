<template>
  <div class="carga" ref="cargaEl">
    <div class="cargaMain" ref="cargaMainEl">
      <img src="/assets/images/favicon.svg" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const cargaEl = ref(null)
const cargaMainEl = ref(null)

onMounted(() => {
  const carga = cargaEl.value
  const cargaMain = cargaMainEl.value
  if (!carga || !cargaMain) return

  const contenidoOriginal = cargaMain.innerHTML
  for (let i = 0; i < 83; i++) {
    cargaMain.innerHTML += contenidoOriginal
  }

  const imgs = cargaMain.querySelectorAll('img')
  const imagenesInicio = gsap.utils.toArray('.cargaMain > img:nth-child(-n + 11)')
  const tl = gsap.timeline()

  gsap.set('body', { autoAlpha: 1 })
  gsap.set(cargaMain, { transformOrigin: '50% 50%' })
  gsap.set(imgs, { opacity: 0, xPercent: -50, yPercent: -50 })
  gsap.set(imagenesInicio, {
    x: function (i) { return i * 10 - 50 }
  })

  tl.set(imgs, { opacity: 0 })
  tl.to(imgs, {
    opacity: 1,
    x: function (i) { return (i / 2 + 10) * Math.cos(i * 5) },
    y: function (i) { return (i / 2 + 10) * Math.sin(i * 5) },
    scale: function (i) { return 0.5 + i / 500 },
    ease: 'elastic.out(1.2, 0.5)',
    duration: 3,
    stagger: 0.005,
  })
  tl.to(cargaMain, { rotation: 360, duration: 4, ease: 'none' }, '<')
  tl.to(carga, {
    opacity: 0,
    duration: 1.2,
    pointerEvents: 'none',
    onComplete: () => { carga.remove() }
  }, '<2.4')
})
</script>
