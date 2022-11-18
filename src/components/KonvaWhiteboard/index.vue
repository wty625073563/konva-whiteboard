<template>
  <div class="whiteboard-container">
    <div id="konvaContainer" ref="konvaContainer" touch-action></div>
  </div>
</template>

<script lang="ts">
import Konva from 'konva'
import type { Ref, PropType } from 'vue'
import { defineComponent, ref, onMounted } from 'vue'

import { TOOL_PEN, DEFAULT_SLIDE, DEFAULT_COLOR, TOOL_ERASER } from './config'
import { getDistance, getCenter, calcImageRealSize } from './tool'

import type { whiteboardSizeConfig, Pos } from './type'

export default defineComponent({
  props: {
    // whiteboard size
    size: {
      type: Object as PropType<whiteboardSizeConfig>,
      default: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    }
  },

  setup(props, ctx) {
    const konvaContainer: Ref = ref(null)

    // drawTools
    const activeTool: Ref = ref(TOOL_PEN)
    // Pen slide
    const activeSlide: Ref = ref(DEFAULT_SLIDE)

    const setTool = (tool: string) => (activeTool.value = tool)
    const setSlide = (slide: number) => (activeSlide.value = slide)

    /**
     * init
     */

    let stage: any = null
    let layer: any = null

    let isPinching: boolean = false

    let isDrag: boolean = false

    const toggleDragStatus = (drageStatus: boolean) => (isDrag = drageStatus)

    onMounted(() => {
      initWhiteboard()
    })

    const initWhiteboard = () => {
      initKonvaStage()
      initKonvaWhiteboard()
    }

    const initKonvaStage = () => {
      Konva.hitOnDragEnabled = true

      const { width, height } = props.size
      stage = new Konva.Stage({
        container: 'konvaContainer',
        width,
        height
      })

      layer = new Konva.Layer()
      stage.add(layer)

      listenerScaleByWheel()
      listenerScaleByPinch()
    }

    const listenerScaleByWheel = () => {
      // threshold
      const scaleThreshold = 1.1
      stage.on('wheel', (e: any) => {
        // stop default scrolling
        e.evt.preventDefault()

        const oldScale = stage.scaleX()
        const pointer = stage.getPointerPosition()

        let mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale
        }

        // how to scale? Zoom in? Or zoom out?
        const direction = e.evt.deltaY > 0 ? -1 : 1

        const newScale = direction > 0 ? oldScale * scaleThreshold : oldScale / scaleThreshold

        stage.scale({ x: newScale, y: newScale })

        stage.position({
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale
        })
      })
    }

    const listenerScaleByPinch = () => {
      let lastCenter: any = null
      let lastDist = 0
      stage.on('touchmove', (e: any) => {
        e.evt.preventDefault()
        let touch1 = e.evt.touches[0]
        let touch2 = e.evt.touches[1]

        if (!touch1 || !touch2) return
        isPinching = true
        if (stage.isDragging()) {
          stage.stopDrag()
        }

        const p1: Pos = {
          x: touch1.clientX,
          y: touch1.clientY
        }
        const p2: Pos = {
          x: touch2.clientX,
          y: touch2.clientY
        }

        if (!lastCenter) return (lastCenter = getCenter(p1, p2))

        const newCenter = getCenter(p1, p2)
        const dist = getDistance(p1, p2)

        if (!lastDist) {
          lastDist = dist
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX()
        }

        const scale = stage.scaleX() * (dist / lastDist)

        stage.scaleX(scale)
        stage.scaleY(scale)

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.x
        const dy = newCenter.y - lastCenter.y

        stage.position({
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy
        })

        lastDist = dist
        lastCenter = newCenter
      })

      stage.on('touchend', () => {
        lastDist = 0
        lastCenter = null
        isPinching = false
      })
    }

    // set background image
    const setWhiteboardBackground = (url: string) => {
      const baseImage = new Image()

      // baseImage.setAttribute('crossOrigin', '')

      baseImage.onload = () => {
        const img = new Konva.Image({
          ...calcImageRealSize(baseImage, props.size),
          image: baseImage,
          zIndex: 1
        })
        layer.add(img)
        img.zIndex(0)
      }
      baseImage.src = url
    }

    const changeDocumentMouseStyle = () => {
      konvaContainer.value.style.cursor = isDrag ? 'grabbing' : 'default'
    }

    // 初始化绘制面板
    const initKonvaWhiteboard = () => {
      const canvas = <HTMLCanvasElement>document.createElement('canvas')
      canvas.width = stage.width()
      canvas.height = stage.height()

      const control = new Konva.Image({
        image: canvas,
        x: 0,
        y: 0
      })
      layer.add(control)
      control.zIndex(0)

      const context = <CanvasRenderingContext2D>canvas.getContext('2d')
      context.lineJoin = 'round'
      context.strokeStyle = DEFAULT_COLOR
      context.lineWidth = DEFAULT_SLIDE

      let canDraw = false
      let lastPostion: any = null

      stage.on('mousedown touchstart', () => {
        if (isDrag) {
          canDraw = false
          stage.draggable(true)
          changeDocumentMouseStyle()
          return
        }

        if (isPinching) return (canDraw = false)

        canDraw = true

        stage.draggable(false)
        lastPostion = stage.getRelativePointerPosition()
      })

      stage.on('mouseup touchend', () => (canDraw = false))

      stage.on('mousemove touchmove', () => {
        if (isDrag) {
          canDraw = false
          stage.draggable(true)
          changeDocumentMouseStyle()
          return
        }

        if (isPinching) return (canDraw = false)

        if (!canDraw) return

        stage.draggable(false)

        const tool = activeTool.value
        if (tool === TOOL_PEN) {
          context.lineWidth = activeSlide.value
          context.globalCompositeOperation = 'source-over'
        } else if (tool === TOOL_ERASER) {
          context.lineWidth = 20
          context.globalCompositeOperation = 'destination-out'
        }

        context.beginPath()

        const p1: Pos = {
          x: lastPostion.x - control.x(),
          y: lastPostion.y - control.y()
        }
        context.moveTo(p1.x, p1.y)
        let pos = stage.getRelativePointerPosition()

        const p2: Pos = {
          x: pos.x - control.x(),
          y: pos.y - control.y()
        }
        context.lineTo(p2.x, p2.y)
        context.closePath()
        context.stroke()

        lastPostion = pos
        layer.batchDraw()
      })
    }

    const exportImage = (quality: number = 0.8) => {
      const base64 = stage.toDataURL({
        mimeType: 'image/jpeg',
        quality
      })

      return base64
    }

    ctx.expose({
      stage,
      setTool,
      setSlide,
      toggleDragStatus,
      setWhiteboardBackground,

      exportImage
    })

    return {
      konvaContainer
    }
  }
})
</script>

<style></style>
