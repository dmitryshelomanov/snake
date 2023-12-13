import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

const root = document.querySelector('#root')!

export function renderGUI() {
  createRoot(root).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/alghorithm-editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}
