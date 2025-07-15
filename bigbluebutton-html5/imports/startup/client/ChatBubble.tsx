import React, { Fragment } from 'react'
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';

const ChatBubble = ({
  children
}) => {
  const fullscreen = layoutSelect((i) => i.fullscreen);
  const { element } = fullscreen;
  const isScreenshareFullScreen = (element === 'Screenshare');

  console.log({isScreenshareFullScreen , fullscreen})

  return (
    <>
      {isScreenshareFullScreen && <div>ChatBubble</div>}
      {children}
    </>
  )
}

export default ChatBubble