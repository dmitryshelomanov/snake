import { memo } from 'react'
import { useUnit } from 'effector-react'
import styled from 'styled-components'
import { $snakesIterator } from '../models/snakes'
import { Title, Name } from './common'
import {
  useSnakeIsCrashedState,
  useSnakeScoreState,
  useSnakeColorState,
} from './use-snake'

export const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
`

export const Score = styled.li<{ isCrash: boolean }>`
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
  font-size: 12px;
`

export const ScoreItem = memo(({ snakeId }: { snakeId: string }) => {
  const score = useSnakeScoreState(snakeId)
  const isCrash = useSnakeIsCrashedState(snakeId)
  const colors = useSnakeColorState(snakeId)

  return (
    <Score isCrash={Boolean(isCrash)} color={colors.head}>
      <DroppedOutBlock hidden={!isCrash}>Dropped out !</DroppedOutBlock>
      <Name>{snakeId}</Name>
      <Counter>{score}</Counter>
    </Score>
  )
})

export const ScoreBoard = memo(() => {
  const snakesIds = useUnit($snakesIterator)

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
})
