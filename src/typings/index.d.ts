declare type Coords = [number, number]

declare module '*.png' {
  const content: string
  export default content
}
