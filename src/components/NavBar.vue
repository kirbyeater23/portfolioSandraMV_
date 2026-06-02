<template>
  <nav class="navegacionPrincipal">
    <RouterLink to="/"><img class="imagenLogo" src="/assets/images/imagenLogo.webp" alt="Logo // Home" /></RouterLink>
    <ul class="paginas">
      <RouterLink class="pagAnex" to="/work"><small>WORK</small></RouterLink>
      <RouterLink class="pagAnex" to="/about"><small>ABOUT</small></RouterLink>
      <RouterLink class="pagAnex" to="/contact"><small>CONTACT</small></RouterLink>
    </ul>
    <button type="button" class="menuHamburguesa" aria-label="Menú" @click="abrir">
      <span></span><span></span><span></span>
    </button>
  </nav>
</template>

<script setup>
import { useMobileMenu } from '../composables/useMobileMenu.js'
const { abrir } = useMobileMenu()
</script>
