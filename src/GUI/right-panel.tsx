import styled from 'styled-components'
import { ScoreBoard } from './score-board'
import { Settings } from './settings'

export const Wrapper = styled.div`
  padding: 20px;
  background-color: rgba(0, 0, 0, 1);
  color: #fff;
  border-radius: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  width: 100%;
  min-height: 100px;
  max-height: 80vh;
  overflow: auto;
  transition: 0.5s;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`

export function RightPanel() {
  return (
    <Wrapper>
      <ScoreBoard />
      <Settings />
    </Wrapper>
  )
}
