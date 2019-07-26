import React from 'react'
import ReactDom from 'react-dom'

function App() {
  return <div>Hello parsel</div>
}

const root = document.querySelector('#root')

export function renderGUI() {
  ReactDom.render(<App />, root)
}
