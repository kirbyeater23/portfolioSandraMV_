<template>
  <div
    :class="['visorGaleria', { visorGaleriaVisible: galleryState.visible }]"
    @click="cerrarGaleria"
  >
    <img
      class="visorGaleriaImg"
      :src="galleryState.imageSrc"
      alt=""
      :style="{ display: galleryState.mediaType === 'image' ? 'block' : 'none' }"
    />
    <video
      class="visorGaleriaVideo"
      ref="videoEl"
      :src="galleryState.videoSrc || undefined"
      controls
      playsinline
      :style="{ display: galleryState.mediaType === 'video' ? 'block' : 'none' }"
      @click.stop
    ></video>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGallery } from '../composables/useGallery.js'

const { state: galleryState, cerrarGaleria } = useGallery()
const videoEl = ref(null)

watch(() => galleryState.visible, (visible) => {
  if (visible && galleryState.mediaType === 'video' && videoEl.value) {
    videoEl.value.play()
  }
  if (!visible && videoEl.value) {
    videoEl.value.pause()
  }
})

// ESC key to close
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarGaleria()
  })
}
</script>
