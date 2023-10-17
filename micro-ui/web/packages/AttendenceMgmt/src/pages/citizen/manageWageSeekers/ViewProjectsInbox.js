import React from 'react'

const ViewProjectsInbox = (props) => {
    const Inbox = Digit.ComponentRegistryService.getComponent("ViewProjects");
    return (
        <Inbox
            {...props}
        />
    )
}

export default ViewProjectsInbox