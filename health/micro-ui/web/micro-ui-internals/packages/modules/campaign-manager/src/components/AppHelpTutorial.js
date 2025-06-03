import React, { useState,Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Button, PopUp, Tag } from "@egovernments/digit-ui-components";

const AppHelpTutorial = ({campaignName}) => {
  const { t } = useTranslation();
  const [showPopup,setShowPopup]=useState(false);
  


  return (
    <>
    <Button
    className="custom-class"
    icon="help"
    isSuffix={true}
    label={t("CAMP_HELP_TEXT")}
    onClick={()=>setShowPopup(true)}

    title="Help"
    variation="link"
  />
{showPopup&&<PopUp type={""} className={"camp-app-help-tutorial-popup"} onClose={()=>setShowPopup(false)}>Hi</PopUp>}
</>
);
};


export default AppHelpTutorial;