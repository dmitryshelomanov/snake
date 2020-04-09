import styled from 'styled-components'

export const ControllPanel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  width: 100%;
  min-height: 50px;
  margin-top: 15px;
  flex-wrap: wrap;
  justify-content: flex-start;

  > button {
    margin-right: 15px;
    margin-bottom: 15px;
  }
`
