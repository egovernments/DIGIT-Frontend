import React from 'react'

const ShgInbox = (props) => {
    const Inbox = Digit.ComponentRegistryService.getComponent("AttendenceMgmtInbox");
  return (
    <Inbox
    {...props} 
    />
  )
}

export default ShgInbox