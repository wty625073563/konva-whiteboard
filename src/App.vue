<script setup lang="ts">
import { onMounted, ref } from 'vue'

import KonvaWhiteboard from './components/KonvaWhiteboard/index.vue'
import { TOOL_PEN, TOOL_ERASER } from './components/KonvaWhiteboard/config'

const uploadImg = ref()
const konvaWhiteboard = ref()

const changeTool = (tool: string) => {
  konvaWhiteboard.value.setTool(tool)
}

const exportImage = () => {
  const base64 = konvaWhiteboard.value.exportImage()

  const img = new Image()
  img.src = base64
  const newWin: any = window.open('', '_blank')
  newWin.document.write(img.outerHTML)
  newWin.document.title = 'export image'
  newWin.document.close()
}

onMounted(() => {
  uploadImg.value.addEventListener('change', () => {
    Array.from(uploadImg.value.files, (file: any) => {
      const url = URL.createObjectURL(file)
      konvaWhiteboard.value.setWhiteboardBackground(url)
    })
  })
})
</script>

<template>
  <main id="app">
    <ul class="menu">
      <li @click="changeTool(TOOL_PEN)">
        <i class="bx bxs-pen"></i>
        <span>Pen</span>
      </li>
      <li @click="changeTool(TOOL_ERASER)">
        <i class="bx bxs-eraser"></i>
        <span>Eraser</span>
      </li>
      <li>
        <i class="bx bxs-image"></i>
        <span>Import Image</span>
        <input class="upload" type="file" ref="uploadImg" name="background" accept="image/png, image/jpeg" />
      </li>

      <li @click="exportImage">
        <i class="bx bxs-file-export"></i>
        <span>Export Image</span>
      </li>
    </ul>

    <KonvaWhiteboard ref="konvaWhiteboard" />
  </main>
</template>

<style scoped>
.menu {
  display: flex;
  align-items: center;
  justify-content: space-around;

  width: 40%;
  padding: 10px 20px;
  background-color: rgba(56, 55, 55, 0.753);

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.menu li {
  display: flex;
  align-items: center;
  flex-direction: column;

  color: #fff;
  font-size: 14px;

  position: relative;
  cursor: pointer;
}

.bx {
  font-size: 20px;
}

.menu li span {
  margin-top: 8px;
}

.upload {
  opacity: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}
</style>
