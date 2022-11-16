import type { Pos, ImageConfig, whiteboardSizeConfig } from './type'

/**
 * 获取距离
 */
export function getDistance(p1: Pos, p2: Pos): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// 获取中心点
export function getCenter(p1: Pos, p2: Pos): Pos {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  }
}

// 计算图片实际展示尺寸
export function calcImageRealSize(imageObj: HTMLImageElement, whiteboardSize: whiteboardSizeConfig): ImageConfig {
  let realWidth, realHeight

  const iw = imageObj.width
  const ih = imageObj.height
  const ww = whiteboardSize.width
  const wh = whiteboardSize.height
  // 横向
  const transverse = iw > ih
  // 非超大比例图片
  const isB = (ww * ih) / iw <= wh

  if (transverse && isB) {
    // 图片宽度大于屏幕宽度
    if (iw > ww) {
      realWidth = ww
      realHeight = (ww * ih) / iw
    } else {
      realWidth = iw
      realHeight = ih
    }
  } else {
    // 图片高度大于屏幕高度
    if (ih > wh) {
      realHeight = wh
      realWidth = (wh * iw) / ih
    } else {
      // 相同尺寸
      const same = iw === ih
      // 尺寸相等切都小于等于屏幕尺寸
      const areGreaterThan = same && iw <= ww && ih <= wh
      // 当图片储存都大于屏幕尺寸, 以屏幕尺寸最小值位值
      const getMin = ww > wh ? wh : ww
      realWidth = areGreaterThan ? iw : getMin
      realHeight = areGreaterThan ? ih : getMin
    }
  }

  return {
    x: (ww - realWidth) / 2,
    y: (wh - realHeight) / 2,
    width: realWidth,
    height: realHeight
  }
}

export function formatUrl(url: string): string {
  return /\?/.test(url) ? `${url}&${Date.now()}` : `${url}?${Date.now()}`
}
