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
  } = useStore($state)

  const handleChangeUserInGameState = useCallback(() => {
    if (isUserInGame) {
      removeUserFromGame()
    } else {
      addUserToGame()
    }
  }, [isUserInGame])

  return (
    <>
      <Title>Common Settings</Title>
      <Wrapper>
        <SettingWrapper>
          <Checkbox
            id="collision"
            checked={isEnabledCollisionDetect}
            onChange={setCollisionState}
          />
          <Name htmlFor="collision">handle collision state</Name>
        </SettingWrapper>
        {/* <SettingWrapper>
          <Checkbox
            id="withUser"
            checked={isUserInGame}
            onChange={handleChangeUserInGameState}
          />
          <Name htmlFor="withUser">add user (you) to game</Name>
        </SettingWrapper> */}
        <SettingWrapper>
          <Checkbox
            id="indexesvisible"
            checked={indexesVisible}
            onChange={setIndexesVisible}
          />
          <Name htmlFor="indexesvisible">visible indexes</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="needFillEmptyGraphsCellls"
            checked={needFillEmptyGraphsCellls}
            onChange={fillEmptyGraphCells}
          />
          <Name htmlFor="needFillEmptyGraphsCellls">
            fill graph's empty cells
          </Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="logger"
            checked={isLoggerEnabled}
            onChange={setLoggerState}
          />
          <Name htmlFor="logger">show operations count in console</Name>
        </SettingWrapper>
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
