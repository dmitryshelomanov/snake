import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import { $gameCollisionStateStore, onSetCollisionState } from '../model'
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

  function onSetCollision() {
    onSetCollisionState(!collisionState)
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
      </Wrapper>
    </>
  )
}
