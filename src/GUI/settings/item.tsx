import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import { Title, Checkbox } from '../common'
import { $algorithms, $heuristics } from '../../models/algorithms'
import {
  useSnakeColorState,
  useSnakeSetings,
  useSnakeIsCrahedState,
} from '../use-snake'
import { updateSettingForSnake, removeSnake } from '../../models/snakes'
import { Icon, Close } from '../icons'

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

export function SettingsForSnake({ snakeId }: { snakeId: string }) {
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
            disabled={!!isCrash}
            id={`path-${snakeId}`}
            checked={showAIPathToTarget}
            onChange={() => {
              updateSettingForSnake({
                snakeId,
                settings: { showAIPathToTarget: !showAIPathToTarget },
              })
            }}
          />
          <Name htmlFor={`path-${snakeId}`} color={colors.tail}>
            Show ai path to target
          </Name>
        </SettingWrapper>
        <SettingWrapper>
          <Checkbox
            disabled={!!isCrash}
            id={`processed-${snakeId}`}
            checked={showProcessedCells}
            onChange={() => {
              updateSettingForSnake({
                snakeId,
                settings: { showProcessedCells: !showProcessedCells },
              })
            }}
          />
          <Name htmlFor={`processed-${snakeId}`} color={colors.tail}>
            Show processed cells
          </Name>
        </SettingWrapper>
        <SettingWrapper dir="column">
          <Select
            disabled={!!isCrash}
            onChange={({ target }) => {
              updateSettingForSnake({
                snakeId,
                settings: { activeAlgorithm: target.value },
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
          {currentAlgorithm && currentAlgorithm.hasHeuristic && (
            <Select
              disabled={!!isCrash}
              onChange={({ target }) => {
                updateSettingForSnake({
                  snakeId,
                  settings: { activeHeuristic: target.value },
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
