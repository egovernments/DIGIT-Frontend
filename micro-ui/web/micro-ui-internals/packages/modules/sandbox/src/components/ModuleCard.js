import React from 'react'
import { BreakLine, Button, Card, CardHeader } from '@egovernments/digit-ui-components'

const ModuleCard = ({ label, className, buttonLabel, onButtonClick }) => {

    return (
        <Card className={className}>
            <div className="complaint-links-container">
                <div className="header" style={{}}>
                    <span className="text removeHeight">{label}</span>
                    <span className="logo removeBorderRadiusLogo"></span>
                </div>
                <div className="body" style={{ margin: "0px", padding: "0px" }}>
                    <div className="links-wrapper" style={{ width: "80%" }}>
                    </div>
                </div>
            </div>
            <Button className="sandbox-module-button" variation="secondary" label={buttonLabel} onClick={onButtonClick} />
        </Card>
    )
}

export default ModuleCard