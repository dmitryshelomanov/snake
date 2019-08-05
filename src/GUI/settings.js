import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import {
  $gameCollisionStateStore,
  $userInGameStore,
  $showAIPathToTargetStore,
  $indexesVisibleStore,
  $processedItemsVisibleStore,
  $enableLoggerStore,
  onSetCollisionState,
  onAddUserToGame,
  onRemoveUserFromGame,
  onSetAiPathVisibleToTarget,
  onSetIndexesVisible,
  onSetProcessedItemsVisible,
  onToggleLoggerState,
} from '../model'
import { Title, Checkbox } from './common'

export const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
`

export const SettingWrapper = styled.li`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  flex: 1 1 auto;
  margin-bottom: 5px;
  user-select: none;
`

export const Name = styled.label`
  font-size: 16px;
  text-align: left;
  flex: 1 1 auto;
  cursor: pointer;
`

export function Settings() {
  const collisionState = useStore($gameCollisionStateStore)
  const userInGameStore = useStore($userInGameStore)
  const showAIPathToTargetStore = useStore($showAIPathToTargetStore)
  const indexesVisibleStore = useStore($indexesVisibleStore)
  const processedItemsVisibleSate = useStore($processedItemsVisibleStore)
  const withLogger = useStore($enableLoggerStore)

  function onSetCollision() {
    onSetCollisionState(!collisionState)
  }

  function onSetAiPathVisible() {
    onSetAiPathVisibleToTarget(!showAIPathToTargetStore)
  }

  function onSetIndexesVisibleState() {
    onSetIndexesVisible(!indexesVisibleStore)
  }

  function onSetProcessedVisibleState() {
    onSetProcessedItemsVisible(!processedItemsVisibleSate)
  }

  function handleChangeUserInGameState() {
    if (userInGameStore) {
      onRemoveUserFromGame()
    } else {
      onAddUserToGame()
    }
  }

  function toggleLoggerState() {
    onToggleLoggerState(!withLogger)
  }

  return (
    <>
      <Title>Settings</Title>
      <Wrapper>
        <SettingWrapper>
          <Checkbox
            id="collision"
            checked={collisionState}
            onChange={onSetCollision}
          />
          <Name htmlFor="collision">handle collision state</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="withUser"
            checked={userInGameStore}
            onChange={handleChangeUserInGameState}
          />
          <Name htmlFor="withUser">add user (you) to game</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="path"
            checked={showAIPathToTargetStore}
            onChange={onSetAiPathVisible}
          />
          <Name htmlFor="path">show ai path to target</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="indexesvisible"
            checked={indexesVisibleStore}
            onChange={onSetIndexesVisibleState}
          />
          <Name htmlFor="indexesvisible">visible indexes</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="processed"
            checked={processedItemsVisibleSate}
            onChange={onSetProcessedVisibleState}
          />
          <Name htmlFor="processed">show processed cells</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="logger"
            checked={withLogger}
            onChange={toggleLoggerState}
          />
          <Name htmlFor="logger">show operations count in console</Name>
        </SettingWrapper>
      </Wrapper>
    </>
  )
}
