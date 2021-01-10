import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import { combine } from 'effector'
import {
  $isEnabledCollisionDetect,
  $indexesVisible,
  $isLoggerEnabled,
  addUserToGame,
  removeUserFromGame,
  setIndexesVisible,
  setCollisionState,
  setLoggerState,
  $fps,
  changeFps,
  $needFillEmptyGraphsCellls,
  fillEmptyGraphCells,
} from '../../models/game'
import { $isUserInGame, $snakesIterator } from '../../models/snakes'
import {
  $customCodeIsEnabled,
  toggleCustomCode,
} from '../../models/custom-alghorithm'
import { Title, Checkbox } from '../common'
import { SettingsForSnake, Wrapper, SettingWrapper, Name } from './item'

export const NumberInput = styled.input.attrs({ type: 'number' })`
  border-radius: 0;
  width: 50px;
  margin-right: 15px;
  font-weight: bold;
`

const $state = combine({
  isEnabledCollisionDetect: $isEnabledCollisionDetect,
  isUserInGame: $isUserInGame,
  indexesVisible: $indexesVisible,
  isLoggerEnabled: $isLoggerEnabled,
  snakesIterator: $snakesIterator,
  fps: $fps,
  needFillEmptyGraphsCellls: $needFillEmptyGraphsCellls,
  customCodeIsEnabled: $customCodeIsEnabled,
})

export function Settings() {
  const {
    isEnabledCollisionDetect,
    isUserInGame,
    indexesVisible,
    isLoggerEnabled,
    snakesIterator,
    fps,
    needFillEmptyGraphsCellls,
    customCodeIsEnabled,
  } = useStore($state)

  const handleChangeUserInGameState = useCallback(() => {
    if (isUserInGame) {
      removeUserFromGame()
    } else {
      addUserToGame()
    }
  }, [isUserInGame])

  const checkboxes = [
    {
      id: 'collision',
      state: isEnabledCollisionDetect,
      change: setCollisionState,
      description: 'handle collision state',
    },
    {
      id: 'withUser',
      state: isUserInGame,
      change: handleChangeUserInGameState,
      description: 'add user (you) to game',
    },
    {
      id: 'indexesvisible',
      state: indexesVisible,
      change: setIndexesVisible,
      description: 'visible indexes',
    },
    {
      id: 'needFillEmptyGraphsCellls',
      state: needFillEmptyGraphsCellls,
      change: fillEmptyGraphCells,
      description: "fill graph's empty cells",
    },
    {
      id: 'logger',
      state: isLoggerEnabled,
      change: setLoggerState,
      description: 'show operations count in console',
    },
    {
      id: 'Enable custom code',
      state: customCodeIsEnabled,
      change: toggleCustomCode,
      description: 'If it it enabled - your code will run',
    },
  ]

  return (
    <>
      <Title>Common Settings</Title>
      <Wrapper>
        {checkboxes.map((it) => (
          <SettingWrapper>
            <Checkbox
              id={it.id}
              checked={it.state}
              onChange={() => {
                it.change()
              }}
            />
            <Name htmlFor={it.id}>{it.description}</Name>
          </SettingWrapper>
        ))}
        <SettingWrapper>
          <NumberInput
            max={120}
            min={1}
            step={2}
            value={fps}
            onChange={({ target }) => {
              changeFps(Number.parseInt(target.value))
            }}
          />
          <Name htmlFor="logger">FPS</Name>
        </SettingWrapper>
      </Wrapper>
      {snakesIterator
        .filter((id) => id !== 'user' && id !== '')
        .map((id) => (
          <SettingsForSnake snakeId={id} key={id} />
        ))}
    </>
  )
}
