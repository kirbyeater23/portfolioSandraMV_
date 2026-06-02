import { reactive } from 'vue'

const state = reactive({
  visible: false,
  imageSrc: '',
  videoSrc: '',
  mediaType: ''
})

export function useGallery() {
  const abrirGaleria = (src, type) => {
    if (type === 'video') {
      state.videoSrc = src
      state.imageSrc = ''
    } else {
      state.imageSrc = src
      state.videoSrc = ''
    }
    state.mediaType = type
    state.visible = true
  }

  const cerrarGaleria = () => {
    state.visible = false
    state.videoSrc = ''
    state.imageSrc = ''
  }

  return { state, abrirGaleria, cerrarGaleria }
}
