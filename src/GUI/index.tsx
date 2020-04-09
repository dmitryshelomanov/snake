import React from 'react'
import ReactDom from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import { SideBar } from './side-bar'

const GlobalStyle = createGlobalStyle`
  body, canvas {
    background: #fff;
  }

  @media (prefers-color-scheme: dark) {
    body, canvas {
      background: #19212b;
    }
  }
`

function App() {
  return (
    <>
      <GlobalStyle />
      <SideBar />
    </>
  )
}

const root = document.querySelector('#root')

export function renderGUI() {
  ReactDom.render(<App />, root)
}
