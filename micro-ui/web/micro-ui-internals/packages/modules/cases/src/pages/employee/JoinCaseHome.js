import React from "react";
import { Link } from "react-router-dom";

const JoinCaseHome = () => {
    return (
        <div>
            <p>Join a case here</p>
            <Link to="/pucar-ui/employee/cases/case-filing-search">
                <button>Join a Case</button>
            </Link>
        </div>
    );
};

export default JoinCaseHome;


