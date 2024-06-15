import { Button } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import React from "react";
import { Link } from "react-router-dom";

const JoinCaseHome = () => {
    const history = useHistory();
    const handleNavigate = (path) => {
        const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
        history.push(`/${contextPath}${path}`);
    };
    return (
        <div>
            <p>Join a case here</p>
            <Button
                label={"Join a Case"}
                onButtonClick={() => handleNavigate("/employee/cases/case-filing-search")}
            >
            </Button>
        </div>
    );
};

export default JoinCaseHome;


