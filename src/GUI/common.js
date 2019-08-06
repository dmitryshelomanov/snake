import styled from 'styled-components'

export const Title = styled.h2`
  color: #fff;
  margin: 15px 0;
  padding: 0;
  font-weight: bold;
  color: ${(props) => props.color};
`

export const Name = styled.p`
  font-size: 16px;
  text-align: left;
  flex: 1 1 auto;
`

export const Radio = styled.input.attrs({ type: 'radio' })`
  margin: 0;
  margin-right: 15px;
`

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin: 0;
  margin-right: 15px;
`
