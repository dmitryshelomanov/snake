import React, { useState } from 'react'
import { useStore } from 'effector-react'
import styled from 'styled-components'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import { $editorCode, changeEditorCode } from '../models/custom-alghorithm'

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

export function Editor() {
  const code = useStore($editorCode)

  return (
    <Wrapper>
      <AceEditor
        value={code}
        onChange={(nextCode) => {
          changeEditorCode(nextCode)
        }}
        mode="javascript"
        theme="tomorrow"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
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
