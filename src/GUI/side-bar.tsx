import React, { useState, useCallback } from 'react'
import { useStore } from 'effector-react'
import styled from 'styled-components'
import Draggable from 'react-draggable'
import { Link } from 'react-router-dom'
import { $gameState, play, stop, restart } from '../models/game'
import { addSnake, $snakesIterator } from '../models/snakes'
import { RightPanel } from './right-panel'
import { ControllPanel } from './control-pannel'
import { GAME_STATE } from '../config'

export const SideBarWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  cursor: move;

  & div {
    box-sizing: border-box;
  }
`

export const SideBarInner = styled.div`
  display: flex;
  position: relative;
  flex: 1 1 auto;
  flex-direction: column;
`

const Button = styled.button<any>`
  border: none;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  font-size: 90%;
  cursor: pointer;
  padding: 8px 15px;
  transition: 0.5s;
  outline: none;

  &:hover {
    background: #fff;
  }

  &:disabled {
    background: #fff;
    cursor: not-allowed;
  }

  &.isEditor {
    color: white;
    background: rgba(0, 0, 0, 0.6);
    margin-top: 12px;
    width: 100%;
  }
`

export function SideBar() {
  const [isVisibleBoard, setVisibleState] = useState(true)
  const gameState = useStore($gameState)
  const snakesIterator = useStore($snakesIterator)
  const isPlay = gameState === GAME_STATE.IS_PLAY
  const playOrPause = isPlay ? stop : play
  const text = isPlay ? 'pause' : 'play'

  const addSnakeToGame = useCallback(() => {
    addSnake({ snakeId: `ai-${snakesIterator.length + 1}`, isAi: true })
  }, [snakesIterator])

  const toggleBoardVisibleState = useCallback(() => {
    setVisibleState((prev) => !prev)
  }, [])

  return (
    <Draggable>
      <SideBarWrapper>
        <SideBarInner>
          {isVisibleBoard && <RightPanel />}
          <ControllPanel>
            <Button onClick={playOrPause}>{text}</Button>
            <Button onClick={restart}>restart</Button>
            <Button onClick={addSnakeToGame}>add snake</Button>
            <Button onClick={toggleBoardVisibleState}>
              {isVisibleBoard ? 'hide board' : 'show board'}
            </Button>
          </ControllPanel>
          {!isPlay && (
            <Link to="/alghorithm-editor" role="button">
              <Button className="isEditor">open editor</Button>
            </Link>
          )}
        </SideBarInner>
      </SideBarWrapper>
    </Draggable>
  )
}
