import React, { Fragment } from 'react'
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';

const ChatBubble = ({
  children
}) => {
  const fullscreen = layoutSelect((i: Layout) => i.fullscreen);
  const { element } = fullscreen;
  const fullscreenContext = (element === 'ExternalVideo');

  console.log({fullscreenContext})

  return (
    <Fragment>
      {fullscreenContext && <div>ChatBubble</div>}
      {children}
    </Fragment>
  )
}

export default ChatBubble