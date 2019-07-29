import React from 'react'
import { useStore } from 'effector-react'
import styled from 'styled-components'
import { $snakeIterator } from '../model'
import { Title, Name } from './common'
import { useSnakeIsCrahedState, useSnakeScoreState } from './use-snake'

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
`

export const Counter = styled.p`
  font-sixe: 12px;
`

export function ScoreItem({ snakeId }) {
  const score = useSnakeScoreState(snakeId)
  const isCrash = useSnakeIsCrahedState(snakeId)

  return (
    <Score isCrash={isCrash}>
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
