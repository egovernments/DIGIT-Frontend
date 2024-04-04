// import { ActionBar, FormComposerV2 } from "@egovernments/digit-ui-react-components";
// import { ActionBar, Button, Stepper} from "@egovernments/digit-ui-components";
import { ActionBar, Stepper, Toast } from "@egovernments/digit-ui-components";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { timeLineOptions } from "../../configs/timeLineOptions.json";
import Upload from "./Upload";
import Hypothesis from "./Hypothesis";
import RuleEngine from "./RuleEngine";
import { Button } from "@egovernments/digit-ui-react-components";
import { ArrowBack, ArrowForward } from "@egovernments/digit-ui-svg-components";
import Navigator from "../../components/Nagivator";

export const components = {
  Upload,
  Hypothesis,
  RuleEngine,
};

// Main component for creating a microplan
const CreateMicroplan = () => {
  // States
  const [microplanData, setMicroplanData] = useState();

  const { t } = useTranslation();

  // useEffect to store data in session storage
  useEffect(() => {
    if (!microplanData) return;
    Digit.SessionStorage.set("microplanData", microplanData);
  }, [microplanData]);

  // useEffect to store data in session storage
  useEffect(() => {
    const data = Digit.SessionStorage.get("microplanData");
    setMicroplanData(data);
  }, []);

  return (
    <div className="create-microplan">
      <Navigator config={timeLineOptions} checkDataCompleteness={true} stepNavigationActive={true} components={components} childProps={{microplanData, setMicroplanData}}/>
    </div>
  );
};

export default CreateMicroplan;
