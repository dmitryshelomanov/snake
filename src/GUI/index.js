import React from 'react'
import ReactDom from 'react-dom'
import { SideBar } from './side-bar'

function App() {
  return <SideBar />
}

const root = document.querySelector('#root')

export function renderGUI() {
  ReactDom.render(<App />, root)
}
