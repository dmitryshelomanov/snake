import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import { Title, Checkbox } from './common'
import { $algorithms, $heuristics } from '../models/algorithms'
import {
  useSnakeColorState,
  useSnakeSetings,
  useSnakeIsCrahedState,
} from './use-snake'
import {
  $collisionState,
  $indexesVisible,
  $isLoggerEnabled,
  addUserToGame,
  removeUserFromGame,
  setIndexesVisible,
  setCollisionState,
  setLoggerState,
} from '../models/game'
import {
  $isUserInGame,
  $snakesIterator,
  updateSettingForSnake,
  removeSnake,
} from '../models/snakes'

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
  flex-direction: ${(props) => props.dir || 'row'};
`

export const Name = styled.label`
  font-size: 16px;
  text-align: left;
  flex: 1 1 auto;
  cursor: pointer;
  color: ${(props) => props.color};
`

export const Select = styled.select`
  margin-top: 5px;
`

export const TitlesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & p {
    cursor: pointer;
    user-select: none;
  }
`

export function SettingsForSnake({ snakeId }) {
  const isCrash = useSnakeIsCrahedState(snakeId)
  const colors = useSnakeColorState(snakeId)
  const algorithms = useStore($algorithms)
  const heuristics = useStore($heuristics)
  const {
    showProcessedCells,
    activeAlgorithm,
    activeHeuristic,
    showAIPathToTarget,
  } = useSnakeSetings(snakeId)

  const currentAlgorithm = useMemo(
    () => algorithms.find((alg) => alg.id === activeAlgorithm),
    [algorithms, activeAlgorithm]
  )

  const removeSnakeHandler = useCallback(() => {
    removeSnake(snakeId)
  }, [snakeId])

  return (
    <>
      <TitlesWrapper>
        <Title color={colors.head}>Settings for {snakeId}</Title>
        <p onClick={removeSnakeHandler}>remove</p>
      </TitlesWrapper>
      <Wrapper>
        <SettingWrapper>
          <Checkbox
            disabled={isCrash}
            id={`path-${snakeId}`}
            checked={showAIPathToTarget}
            onChange={() => {
              updateSettingForSnake({
                snakeId,
                value: !showAIPathToTarget,
                settingName: 'showAIPathToTarget',
              })
            }}
          />
          <Name htmlFor={`path-${snakeId}`} color={colors.tail}>
            Show ai path to target
          </Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            disabled={isCrash}
            id={`processed-${snakeId}`}
            checked={showProcessedCells}
            onChange={() => {
              updateSettingForSnake({
                snakeId,
                value: !showProcessedCells,
                settingName: 'showProcessedCells',
              })
            }}
          />
          <Name htmlFor={`processed-${snakeId}`} color={colors.tail}>
            Show processed cells
          </Name>
        </SettingWrapper>
        <SettingWrapper dir="column">
          <Select
            disabled={isCrash}
            onChange={({ target }) => {
              updateSettingForSnake({
                snakeId,
                settingName: 'activeAlgorithm',
                value: target.value,
              })
            }}
          >
            {algorithms.map((alg) => (
              <option
                key={alg.id}
                selected={activeAlgorithm === alg.id}
                value={alg.id}
              >
                {alg.name}
              </option>
            ))}
          </Select>
          {currentAlgorithm.hasHeuristic && (
            <Select
              disabled={isCrash}
              onChange={({ target }) => {
                updateSettingForSnake({
                  snakeId,
                  settingName: 'activeHeuristic',
                  value: target.value,
                })
              }}
            >
              {heuristics.map((heuristic) => (
                <option
                  key={heuristic.id}
                  selected={activeHeuristic === heuristic.id}
                  value={heuristic.id}
                >
                  {heuristic.name}
                </option>
              ))}
            </Select>
          )}
        </SettingWrapper>
      </Wrapper>
    </>
  )
}

export function Settings() {
  const collisionState = useStore($collisionState)
  const userInGame = useStore($isUserInGame)
  const indexesVisible = useStore($indexesVisible)
  const withLogger = useStore($isLoggerEnabled)
  const snakeIterator = useStore($snakesIterator)

  const onSetCollision = useCallback(() => {
    setCollisionState(!collisionState)
  }, [collisionState])

  const onSetIndexesVisibleState = useCallback(() => {
    setIndexesVisible(!indexesVisible)
  }, [indexesVisible])

  const handleChangeUserInGameState = useCallback(() => {
    if (userInGame) {
      removeUserFromGame()
    } else {
      addUserToGame()
    }
  }, [userInGame])

  const toggleLogger = useCallback(() => {
    setLoggerState(!withLogger)
  }, [withLogger])

  return (
    <>
      <Title>Common Settings</Title>
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
            checked={userInGame}
            onChange={handleChangeUserInGameState}
          />
          <Name htmlFor="withUser">add user (you) to game</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            id="indexesvisible"
            checked={indexesVisible}
            onChange={onSetIndexesVisibleState}
          />
          <Name htmlFor="indexesvisible">visible indexes</Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox id="logger" checked={withLogger} onChange={toggleLogger} />
          <Name htmlFor="logger">show operations count in console</Name>
        </SettingWrapper>
      </Wrapper>
      {snakeIterator
        .filter((id) => id !== 'user' && id !== '')
        .map((id) => (
          <SettingsForSnake snakeId={id} key={id} />
        ))}
    </>
  )
}
