import { Button } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

const SearchCase = () => {
  const history = useHistory();
  const location = useLocation();
  const propData = location.state || {}; // Access the passed prop object


  const handleNavigate = (path,caseData) => {
    const contextPath = window?.contextPath || "";
    history.push({
      pathname: `/${contextPath}${path}`,
      state: caseData
    });
  };

  return (
    <div>
      <p style={{margin : "5px"}} >
      Case search screen
      </p>
      <div style={{display : "flex", flexDirection : "row", padding : "10px"}}>
      <Button
      style={{margin : "5px"}}
      label={"Proceed as advocate"}
      onButtonClick={() => handleNavigate("/employee/cases/join-case-advocate")}
      >
      </Button>
      <Button
      style={{margin : "5px"}}
      label={"Proceed as litigant"}
      onButtonClick={() => handleNavigate("/employee/cases/join-case-litigant")}
      >
      </Button>
      </div>
    </div>
  );
};
export default SearchCase;
