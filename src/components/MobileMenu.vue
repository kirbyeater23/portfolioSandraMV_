<template>
  <div :class="['menuMovilOverlay', { menuMovilVisible: menuAbierto }]">
    <div class="menuMovilCabecera">
      <RouterLink to="/"><img class="imagenLogo" src="/assets/images/imagenLogo.webp" alt="Logo" /></RouterLink>
      <button class="menuMovilCerrar" aria-label="Cerrar menú" @click="cerrar">×</button>
    </div>
    <hr class="menuMovilSeparador" />
    <div class="menuMovilCuerpo">
      <nav class="menuMovilNav">
        <RouterLink to="/" :class="['menuMovilEnlace', { menuMovilActivo: ruta === '/' }]" @click="cerrar">HOME</RouterLink>
        <RouterLink to="/work" :class="['menuMovilEnlace', { menuMovilActivo: ruta === '/work' }]" @click="cerrar">WORK</RouterLink>
        <RouterLink to="/about" :class="['menuMovilEnlace', { menuMovilActivo: ruta === '/about' }]" @click="cerrar">ABOUT</RouterLink>
        <RouterLink to="/contact" :class="['menuMovilEnlace menuMovilEnlaceContact', { menuMovilActivo: ruta === '/contact' }]" @click="cerrar">CONTACT</RouterLink>
      </nav>
      <p class="menuMovilAsterisco">*</p>
      <div class="menuMovilServicios">
        <p>Motion · Branding · Ilustración</p>
        <p>Editorial · Diseño Web</p>
      </div>
    </div>
    <div class="menuMovilPie">
      <hr class="menuMovilSeparador" />
      <div class="menuMovilPieContenido">
        <div class="menuMovilRedes">
          <a href="https://www.instagram.com/kirbyeater23/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/in/sandra-martínez-villacorta-61a30a294/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <p class="menuMovilEmailPie">samavillac@gmail.com</p>
      </div>
      <p class="menuMovilCreditos">WEBSITE BY SANDRA MARTÍNEZ VILLACORTA</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMobileMenu } from '../composables/useMobileMenu.js'

const route = useRoute()
const ruta = computed(() => route.path)
const { menuAbierto, cerrar } = useMobileMenu()
</script>
