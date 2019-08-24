import React from 'react'
import { useStore } from 'effector-react'
import styled from 'styled-components'
import { $snakeIterator } from '../model'
import { Title, Name } from './common'
import {
  useSnakeIsCrahedState,
  useSnakeScoreState,
  useSnakeColorState,
} from './use-snake'

export const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
`

export const Score = styled.li`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  flex: 1 1 auto;
  text-decoration: ${(props) => (props.isCrash ? 'line-through' : 'none')};
  color: ${(props) => props.color};
  position: relative;
  align-items: center;
`

export const DroppedOutBlock = styled.div`
  position: absolute;
  background-color: #f7f7f787;
  color: #000;
  font-weight: bold;
  width: 100%;
  text-align: center;
  font-size: 13px;
`

export const Counter = styled.p`
  font-sixe: 12px;
`

export function ScoreItem({ snakeId }) {
  const score = useSnakeScoreState(snakeId)
  const isCrash = useSnakeIsCrahedState(snakeId)
  const colors = useSnakeColorState(snakeId)

  return (
    <Score isCrash={isCrash} color={colors.head}>
      <DroppedOutBlock hidden={!isCrash}>Dropped out !</DroppedOutBlock>
      <Name>{snakeId}</Name>
      <Counter>{score}</Counter>
    </Score>
  )
}

export function ScoreBoard() {
  const snakesIds = useStore($snakeIterator)

  return (
    <>
      <Title>Score board</Title>
      <Wrapper>
        {snakesIds.map((snakeId) => (
          <ScoreItem snakeId={snakeId} key={snakeId} />
        ))}
      </Wrapper>
    </>
  )
}
