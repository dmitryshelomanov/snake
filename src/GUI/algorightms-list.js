import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import {
  $algorithmsStore,
  onChangeAlgorithm,
  onChangeHeuristic,
} from '../model'
import { Title, Radio } from './common'

export const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
`

export const Algorighm = styled.li`
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

export const ListWrapper = styled.div``

export const Item = styled.div`
  display: flex;
  flex-direction: column;

  ${ListWrapper} {
    margin-left: 25px;
  }
`

export function List({ list = [], active, onChange, name }) {
  function changeHeuristic(algId) {
    return ({ target }) => {
      onChangeHeuristic({ algId, heuristicId: target.id })
    }
  }

  return (
    <ListWrapper>
      {list.map((alg) => {
        const algWithHeuristicIsActive = alg.heuristic && active == alg.id

        return (
          <Item key={alg.id}>
            <Algorighm>
              <Radio
                id={alg.id}
                name={name}
                checked={active === alg.id}
                onChange={onChange}
              />
              <Name htmlFor={alg.id}>{alg.name}</Name>
            </Algorighm>
            {algWithHeuristicIsActive && (
              <List
                list={alg.heuristic}
                onChange={changeHeuristic(alg.id)}
                active={alg.activeHeuristic}
                name={`heuristic-${alg.id}`}
              />
            )}
          </Item>
        )
      })}
    </ListWrapper>
  )
}

export function AlgorighmsList() {
  const { active, list } = useStore($algorithmsStore)

  function onChange({ target }) {
    onChangeAlgorithm(target.id)
  }

  return (
    <>
      <Title>Algorighms list</Title>
      <Wrapper>
        <List active={active} list={list} onChange={onChange} name="alg-list" />
      </Wrapper>
    </>
  )
}
