import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";

const SearchCase = () => {
  const history = useHistory();
  const location = useLocation();
  const propData = location.state || {}; // Access the passed prop object
  const [dataParams, setDataParams] = Digit.Hooks.useSessionStorage("PUCAR_CASE_DATA", {});
 // TODO: will be converted to popup 
  useEffect(() => {
    //TODO: we have used session storage, check for alternate logic
    setDataParams({ caseData: propData })
  }, [propData]);

  const handleNavigate = (path, caseData) => {
    const contextPath = window?.contextPath || "";
    history.push({
      pathname: `/${contextPath}${path}`,
      state: propData, // Pass propData to the next route
    });
  };

  return (
    <div>
      <p style={{ margin: "5px" }} >
      {/* // TODO: TO REMOVE */}
        Case search screen 
      </p>
      <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
        <Button
          style={{ margin: "5px" }}
          label={"Proceed as advocate"} // TODO: LOCALISATION 
          onButtonClick={() => handleNavigate("/employee/cases/join-case-advocate")}
        >
        </Button>
        <Button
          style={{ margin: "5px" }}
          label={"Proceed as litigant"} // TODO: LOCALISATION
          onButtonClick={() => handleNavigate("/employee/cases/join-case-litigant")}
        >
        </Button>
      </div>
    </div>
  );
};
export default SearchCase;
