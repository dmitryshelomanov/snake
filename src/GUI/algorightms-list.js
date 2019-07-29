import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import { $algorithmsStore, onChangeAlgorithm } from '../model'
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

export function AlgorighmsList() {
  const { active, list } = useStore($algorithmsStore)

  function onChange({ target }) {
    onChangeAlgorithm(target.id)
  }

  return (
    <>
      <Title>Algorighms list</Title>
      <Wrapper>
        {list.map((alg) => (
          <Algorighm key={alg.id}>
            <Radio
              id={alg.id}
              name="algo"
              checked={active === alg.id}
              onChange={onChange}
            />
            <Name htmlFor={alg.id}>{alg.name}</Name>
          </Algorighm>
        ))}
      </Wrapper>
    </>
  )
}
