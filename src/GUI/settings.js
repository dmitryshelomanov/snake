import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import {
  $gameCollisionStateStore,
  $userInGameStore,
  onSetCollisionState,
  onAddUserToGame,
  onRemoveUserFromGame,
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

  function onSetCollision() {
    onSetCollisionState(!collisionState)
  }

  function handleChangeUserInGameState() {
    if (userInGameStore) {
      onRemoveUserFromGame()
    } else {
      onAddUserToGame()
    }
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
      </Wrapper>
    </>
  )
}
