import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, TextInput, SVG, LabelFieldPair, Close, Toast, CardLabel } from "@egovernments/digit-ui-react-components";

const LevelCards = ({ onSelect, formData, props }) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const [cardDetails, setCardDetails] = useState([{ level: "" }]);


  const closeToast = () => {
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleCreateNewLevelDetails = () => {
    setCardDetails((prevDetails) => [...prevDetails, { level: ""}]);
  };

  useEffect(() => {
    onSelect("levelcards", cardDetails);
  }, [cardDetails]);

  const handleDeleteRowDetails = (index) => {
    if (cardDetails.length > 1) {
      setCardDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails.splice(index, 1);
        return updatedDetails;
      });
    }
  };

  const handleLevelChange = (index, value) => {
    setCardDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index].level = value;
      return updatedDetails;
    });
  };


  return (
    <React.Fragment>
      {cardDetails.map((details, index) => (
        <div className="levelStyle">
            {cardDetails.length > 1 && (
              <div className="CloseButton" style={{ textAlign: 'right' }} onClick={() => handleDeleteRowDetails(index)}>
              <Close />
            </div>
            )}
        <LabelFieldPair card key={index} >
            <CardLabel style={{ marginTop: '0px'}}className="card-details">{t((`${"HCM_LEVEL "}${index+1}`))}</CardLabel>
            
            <TextInput  className= "field" style={{maxWidth: "540px"}} name={"levelcards"} value={details.level} onChange={(e) => handleLevelChange(index, e.target.value)} />
           
        </LabelFieldPair>
        </div>
      ))}
      <LabelFieldPair>
        <Button
          variation="secondary"
          label={`${t("ADD_LEVEL")}`}
          type="button"
          className="workbench-add-row-detail-btn"
          onButtonClick={handleCreateNewLevelDetails}
          style={{ fontSize: "1rem" }}
        />
      </LabelFieldPair>
      {showToast && <Toast warning={showToast.isWarning} label={showToast.label} isDleteBtn={"true"} onClose={() => setShowToast(false)} style={{ bottom: "8%" }} />}
    </React.Fragment>
    
  );
};

export default LevelCards;