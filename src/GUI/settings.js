import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import {
  $gameCollisionStateStore,
  $userInGameStore,
  $indexesVisibleStore,
  $enableLoggerStore,
  $snakeIterator,
  $algorithmsStore,
  $heuristicsStore,
  onSetCollisionState,
  onAddUserToGame,
  onRemoveUserFromGame,
  onSetIndexesVisible,
  onToggleLoggerState,
  onUpdateSettingForSnake,
  onRemoveSnake,
} from '../model'
import { Title, Checkbox } from './common'
import {
  useSnakeColorState,
  useSnakeSetings,
  useSnakeIsCrahedState,
} from './use-snake'

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
  const algorithms = useStore($algorithmsStore)
  const heuristics = useStore($heuristicsStore)
  const {
    showProcessedCells,
    activeAlgorithm,
    activeHeuristic,
    showAIPathToTarget,
  } = useSnakeSetings(snakeId)
  const currentAlgorithm = algorithms.find((alg) => alg.id === activeAlgorithm)

  function removeSnake() {
    onRemoveSnake(snakeId)
  }

  return (
    <>
      <TitlesWrapper>
        <Title color={colors.head}>Settings for {snakeId}</Title>
        <p onClick={removeSnake}>remove</p>
      </TitlesWrapper>
      <Wrapper>
        <SettingWrapper>
          <Checkbox
            disabled={isCrash}
            id={`path-${snakeId}`}
            checked={showAIPathToTarget}
            onChange={() => {
              onUpdateSettingForSnake({
                snakeId,
                value: !showAIPathToTarget,
                settingName: 'showAIPathToTarget',
              })
            }}
          />
          <Name htmlFor={`path-${snakeId}`} color={colors.tail}>
            show ai path to target
          </Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            disabled={isCrash}
            id={`processed-${snakeId}`}
            checked={showProcessedCells}
            onChange={() => {
              onUpdateSettingForSnake({
                snakeId,
                value: !showProcessedCells,
                settingName: 'showProcessedCells',
              })
            }}
          />
          <Name htmlFor={`processed-${snakeId}`} color={colors.tail}>
            show processed cells
          </Name>
        </SettingWrapper>
        <SettingWrapper dir="column">
          <Select
            disabled={isCrash}
            onChange={({ target }) => {
              onUpdateSettingForSnake({
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
                onUpdateSettingForSnake({
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
  const collisionState = useStore($gameCollisionStateStore)
  const userInGameStore = useStore($userInGameStore)
  const indexesVisibleStore = useStore($indexesVisibleStore)
  const withLogger = useStore($enableLoggerStore)
  const snakeIterator = useStore($snakeIterator)

  function onSetCollision() {
    onSetCollisionState(!collisionState)
  }

  function onSetIndexesVisibleState() {
    onSetIndexesVisible(!indexesVisibleStore)
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
            checked={userInGameStore}
            onChange={handleChangeUserInGameState}
          />
          <Name htmlFor="withUser">add user (you) to game</Name>
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
            id="logger"
            checked={withLogger}
            onChange={toggleLoggerState}
          />
          <Name htmlFor="logger">show operations count in console</Name>
        </SettingWrapper>
      </Wrapper>
      {snakeIterator
        .filter((id) => id !== 'user')
        .map((id) => (
          <SettingsForSnake snakeId={id} key={id} />
        ))}
    </>
  )
}
