/* eslint-disable no-undef */
import foodIcon from '../GUI/assets/apple.png'
import brickIcon from '../GUI/assets/brick.png'

export const assets = {
  apple: new Image(),
  brick: new Image(),
}

function loadImage(name: string, url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image()

    image.addEventListener('load', () => {
      resolve(image)
      // @ts-ignore
      assets[name] = image
    })

    image.src = url
  })
}

export function loadAssets() {
  return Promise.all([
    loadImage('apple', foodIcon),
    loadImage('brick', brickIcon),
  ])
}
