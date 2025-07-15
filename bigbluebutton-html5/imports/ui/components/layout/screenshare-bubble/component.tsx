import React from 'react'
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import ChatBubble from '../../chat/chat-graphql/chat-bubble/component';

const ScreenshareBubble = ({
  children
}) => {
  const fullscreen = layoutSelect((i : Layout) => i.fullscreen);
  const { element } = fullscreen;
  const isScreenshareFullScreen = (element === 'Screenshare');


  return (
    <>
      {isScreenshareFullScreen && <ChatBubble/>}
      {children}
    </>
  )
}

export default ScreenshareBubble