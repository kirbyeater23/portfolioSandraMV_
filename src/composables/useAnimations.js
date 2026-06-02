import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const selectores = [
  '.cardProyecto',
  '.seccionServicios .columnaServicios',
  '.seccionServicios .columnaBio',
  '.cardWork',
  '.heroAboutFila',
  '.tituloAboutRosa',
  '.fotoColumna',
  '.bioColumna',
  '.tituloContact',
  '.textoContact',
  '.formularioContact',
]

export function usePageAnimations() {
  const scrollTriggers = []

  function animar(el) {
    if (el.dataset.animado) return
    el.dataset.animado = '1'
    const tween = gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
    })
    // Store reference so cleanup only kills this view's triggers
    if (tween.scrollTrigger) scrollTriggers.push(tween.scrollTrigger)
  }

  function aplicarAnimaciones() {
    selectores.forEach(s => gsap.utils.toArray(s).forEach(animar))
  }

  function aplicarScramble() {
    document.querySelectorAll('h1').forEach(el => {
      const htmlOriginal = el.innerHTML
      const textoFinal = el.textContent.trim()

      gsap.to(el, {
        duration: 1.2,
        scrambleText: {
          text: textoFinal,
          chars: 'upperCase',
          speed: 0.4,
          revealDelay: 0.2,
        },
        ease: 'none',
        onComplete: () => { el.innerHTML = htmlOriginal },
      })

      el.addEventListener('mouseenter', () => {
        gsap.killTweensOf(el)
        gsap.to(el, {
          duration: 0.7,
          scrambleText: { text: textoFinal, chars: 'upperCase', speed: 0.5 },
          ease: 'none',
          onComplete: () => { el.innerHTML = htmlOriginal },
        })
      })
    })
  }

  function cleanup() {
    scrollTriggers.forEach(st => st.kill())
    scrollTriggers.length = 0
  }

  return { aplicarAnimaciones, aplicarScramble, cleanup }
}
