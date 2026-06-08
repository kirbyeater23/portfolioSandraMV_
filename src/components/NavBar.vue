<template>
  <nav class="navegacionPrincipal">
    <RouterLink to="/" @click="cerrarModal"><img class="imagenLogo" src="/assets/images/imagenLogo.webp" alt="Logo // Home" /></RouterLink>
    <ul class="paginas">
      <RouterLink class="pagAnex" to="/work" @click="cerrarModal"><small>WORK</small></RouterLink>
      <RouterLink class="pagAnex" to="/about" @click="cerrarModal"><small>ABOUT</small></RouterLink>
      <RouterLink class="pagAnex" to="/contact" @click="cerrarModal"><small>CONTACT</small></RouterLink>
    </ul>
    <button type="button" class="menuHamburguesa" aria-label="Menú" @click="abrir">
      <span></span><span></span><span></span>
    </button>
  </nav>
</template>

<script setup>
import { useMobileMenu } from '../composables/useMobileMenu.js'
import { useModal } from '../composables/useModal.js'

const { abrir } = useMobileMenu()
const { cerrarModal } = useModal()
</script>
