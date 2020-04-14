import React, { ElementType } from 'react'
import styled from 'styled-components'

const IconWrapper = styled.div`
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`

export function Icon({
  icon,
  onClick,
}: {
  icon: JSX.Element
  onClick: () => void
}) {
  return <IconWrapper onClick={onClick}>{icon}</IconWrapper>
}

export * from './close'
