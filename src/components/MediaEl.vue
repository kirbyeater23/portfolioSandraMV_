<template>
  <div v-if="esVideo" class="mediaVideo">
    <video :src="src" muted loop playsinline autoplay></video>
    <button
      class="botonAudioVideo"
      type="button"
      aria-label="Activar audio"
      @click.stop="$emit('audio-toggle', $event)"
    >AUDIO OFF</button>
  </div>
  <img v-else :src="src" :alt="alt" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
})

defineEmits(['audio-toggle'])

const esVideo = computed(() => props.src && props.src.trim().endsWith('.mp4'))
</script>
