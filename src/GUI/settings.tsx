import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import { combine } from 'effector'
import { Title, Checkbox } from './common'
import { $algorithms, $heuristics } from '../models/algorithms'
import {
  useSnakeColorState,
  useSnakeSetings,
  useSnakeIsCrahedState,
} from './use-snake'
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
} from '../models/game'
import {
  $isUserInGame,
  $snakesIterator,
  updateSettingForSnake,
  removeSnake,
} from '../models/snakes'
import { Icon, Close } from './icons'

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

export const NumberInput = styled.input.attrs({ type: 'number' })`
  border-radius: 0;
  width: 50px;
  margin-right: 15px;
  font-weight: bold;
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
        <Icon
          icon={<Close color={colors.head} />}
          onClick={removeSnakeHandler}
        />
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
