import React, { useState } from 'react'
import { useStore } from 'effector-react'
import styled from 'styled-components'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-kuroir'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/theme-textmate'
import 'ace-builds/src-noconflict/theme-xcode'
import {
  $editorCode,
  changeEditorCode,
  $editorTheme,
  changeTheme,
} from '../models/custom-alghorithm'

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #fff;

  > #UNIQUE_ID_OF_DIV {
    width: 100% !important;
    height: 100% !important;
  }
`

const Select = styled.select`
  position: fixed;
  top: 25px;
  right: 25px;
  z-index: 9999;
`

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'terminal',
]

export function Editor() {
  const code = useStore($editorCode)
  const activeTheme = useStore($editorTheme)

  return (
    <Wrapper>
      <Select
        name="Theme"
        value={activeTheme}
        onChange={(it) => {
          changeTheme(it.target.value)
        }}
      >
        {themes.map((it) => (
          <option key={it} value={it} selected={it === activeTheme}>
            {it}
          </option>
        ))}
      </Select>
      <AceEditor
        value={code}
        onChange={(nextCode) => {
          changeEditorCode(nextCode)
        }}
        mode="javascript"
        theme={activeTheme}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: false }}
        fontSize={14}
        showPrintMargin
        showGutter
        highlightActiveLine
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </Wrapper>
  )
}
