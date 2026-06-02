import { ref, watch } from 'vue'

const menuAbierto = ref(false)

export function useMobileMenu() {
  const abrir = () => {
    menuAbierto.value = true
    document.body.style.overflow = 'hidden'
  }

  const cerrar = () => {
    menuAbierto.value = false
    document.body.style.overflow = ''
  }

  return { menuAbierto, abrir, cerrar }
}
