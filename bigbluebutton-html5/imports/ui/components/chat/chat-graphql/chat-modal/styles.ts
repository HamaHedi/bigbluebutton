import styled from 'styled-components'
import { colorGray } from '/imports/ui/stylesheets/styled-components/palette'

const ChatModal = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 300px;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  z-index: 1000;
  border: 1px solid ${colorGray};
`

const ChatHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  margin-bottom: 15px;
  i{
    font-size: 20px;
    cursor: pointer;
  }
`

export default {
    ChatModal,
    ChatHeader
}