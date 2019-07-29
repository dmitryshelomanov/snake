import React from 'react'
import styled from 'styled-components'
import { ScoreBoard } from './score-board'
import { AlgorighmsList } from './algorightms-list'

export const Wrapper = styled.div`
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  cursor: default;
  width: 100%;
  min-height: 100px;
`

export function RightPanel() {
  return (
    <Wrapper>
      <ScoreBoard />
      <AlgorighmsList />
    </Wrapper>
  )
}
