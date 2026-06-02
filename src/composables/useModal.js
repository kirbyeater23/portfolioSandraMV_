import { reactive } from 'vue'

const state = reactive({
  proyectoActivo: null,
  todosProyectos: []
})

export function useModal() {
  const abrirModal = (proyecto) => {
    state.proyectoActivo = proyecto
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      const overlay = document.querySelector('.modalSuperposicion')
      if (overlay) overlay.scrollTop = 0
    })
  }

  const cerrarModal = () => {
    state.proyectoActivo = null
    document.documentElement.style.overflow = ''
  }

  const irSiguienteProyecto = (id) => {
    const proyecto = state.todosProyectos.find(p => p.id === id)
    if (proyecto) abrirModal(proyecto)
  }

  return { state, abrirModal, cerrarModal, irSiguienteProyecto }
}
