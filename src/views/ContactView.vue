<template>
  <header>
    <NavBar />
  </header>

  <main class="seccionContact">
    <h1 class="tituloContact">HABLEMOS*</h1>

    <div class="contenidoContact">
      <div class="textoContact">
        <img src="/assets/images/contact/puedoAyudarte.svg" alt="Puedo ayudarte a hacer tu idea realidad" />
      </div>

      <form class="formularioContact" id="formularioContact" novalidate @submit.prevent="enviarFormulario">
        <small class="etiquetaFormulario">RELLENA LOS DATOS</small>
        <div class="filaFormulario">
          <div class="campoFormulario">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" v-model="form.nombre" required />
          </div>
          <div class="campoFormulario">
            <label for="apellidos">Apellidos</label>
            <input type="text" id="apellidos" name="apellidos" v-model="form.apellidos" required />
          </div>
        </div>

        <div class="campoFormulario campoServicio">
          <label for="servicio">Servicio que buscas</label>
          <div class="selectWrapper">
            <select id="servicio" name="servicio" v-model="form.servicio">
              <option value="" disabled selected></option>
              <option value="editorial">Editorial</option>
              <option value="ilustracion">Ilustración</option>
              <option value="branding">Branding</option>
              <option value="motion">Motion</option>
            </select>
            <span class="selectArrow">&#8964;</span>
          </div>
        </div>

        <div class="campoFormulario">
          <label for="correo">Correo electrónico</label>
          <input type="email" id="correo" name="correo" v-model="form.correo" required />
        </div>

        <div class="campoFormulario">
          <label for="descripcion">Describe tu proyecto !</label>
          <textarea id="descripcion" name="descripcion" rows="5" v-model="form.descripcion"></textarea>
        </div>

        <button type="submit" class="botonEnviar" :disabled="enviando">
          {{ enviando ? 'ENVIANDO...' : 'TRABAJEMOS JUNTOS!' }}
        </button>
        <p
          id="mensajeFormulario"
          class="mensajeFormulario"
          v-if="mensajeTexto"
          :style="{ color: mensajeExito ? '#000' : '#f0c', display: 'block' }"
        >{{ mensajeTexto }}</p>
      </form>
    </div>
  </main>

  <SiteFooter />
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import emailjs from '@emailjs/browser'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { usePageAnimations } from '../composables/useAnimations.js'

const { aplicarAnimaciones, aplicarScramble, cleanup } = usePageAnimations()
onUnmounted(() => cleanup())

const form = reactive({ nombre: '', apellidos: '', correo: '', servicio: '', descripcion: '' })
const enviando = ref(false)
const mensajeTexto = ref('')
const mensajeExito = ref(false)

const EMAIL_PUBLIC_KEY   = 'vKBniLW7ARL_A5bNo'
const EMAIL_SERVICE_ID   = 'service_jc4yk3b'
const EMAIL_TEMPLATE_ID  = 'template_cqungre'

emailjs.init({ publicKey: EMAIL_PUBLIC_KEY })

async function enviarFormulario() {
  if (!form.nombre || !form.apellidos || !form.correo) {
    mensajeTexto.value = 'Por favor, rellena los campos obligatorios.'
    mensajeExito.value = false
    return
  }

  enviando.value = true
  try {
    await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, {
      from_name:  `${form.nombre} ${form.apellidos}`,
      from_email: form.correo,
      servicio:   form.servicio || 'No especificado',
      mensaje:    form.descripcion || 'Sin descripción',
      to_email:   'sandra.morcillo1@esdmadrid.es',
    })
    mensajeTexto.value = '¡Mensaje enviado! Te respondo pronto.'
    mensajeExito.value = true
    Object.assign(form, { nombre: '', apellidos: '', correo: '', servicio: '', descripcion: '' })
  } catch {
    mensajeTexto.value = 'Algo ha fallado. Escríbeme directamente a samavillac@gmail.com'
    mensajeExito.value = false
  } finally {
    enviando.value = false
  }
}

onMounted(async () => {
  document.title = 'Contact | Sandra Martínez Villacorta'
  await nextTick()
  aplicarAnimaciones()
  aplicarScramble()
})
</script>
