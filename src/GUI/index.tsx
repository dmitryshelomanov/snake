import React from 'react'
import ReactDom from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { SideBar } from './side-bar'
import { Editor } from './editor'

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
  ReactDom.render(
    <BrowserRouter>
      <Route path="/" component={App} />
      <Route path="/alghorithm-editor" component={Editor} />
    </BrowserRouter>,
    root
  )
}
