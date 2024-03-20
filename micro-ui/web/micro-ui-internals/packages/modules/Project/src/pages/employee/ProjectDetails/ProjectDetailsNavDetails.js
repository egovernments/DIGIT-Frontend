import React, { Fragment } from "react";


const ProjectDetailsNavDetails = ({activeLink, subProjects}) => {
    const ViewProjectComponent = Digit?.ComponentRegistryService?.getComponent("ViewProject"); 
    const ViewFinancialDetailsComponent = Digit?.ComponentRegistryService?.getComponent("ViewFinancialDetails"); 
    const ViewSubProjectsDetailsComponent = Digit?.ComponentRegistryService?.getComponent("ViewSubProjectsDetails");

    return (
        <>
        {
            (activeLink === "Project_Details") && (
                <ViewProjectComponent module="project" ></ViewProjectComponent>
            )
        }
                {
            (activeLink === "Financial_Details") && (
                <ViewFinancialDetailsComponent></ViewFinancialDetailsComponent>
            )
        }
        {
            (activeLink === "Sub_Projects_Details") && (
                <ViewSubProjectsDetailsComponent subProjects={subProjects}></ViewSubProjectsDetailsComponent>
            )
        }

        </>
    )
}

export default ProjectDetailsNavDetails;