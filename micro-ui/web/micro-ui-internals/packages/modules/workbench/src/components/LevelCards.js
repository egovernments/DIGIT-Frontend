import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, TextInput, SVG, LabelFieldPair, Close, CardLabel, DeleteIconv2 , AddFilled } from "@egovernments/digit-ui-react-components";
import { COLOR_FILL } from "../utils/contants";
import { Toast } from "@egovernments/digit-ui-components";

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
    setCardDetails((prevDetails) => [...prevDetails, { level: "" }]);
  };

  useEffect(() => {
    if(formData?.levelcards === null){
      setCardDetails([{ level: "" }]);
    }
  }, [formData]);

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
          
          <LabelFieldPair card key={index}>
            <CardLabel style={{ marginTop: "0px" }} className="card-details">
              {t("HCM_LEVEL") + " " + (index + 1)}
              <span className="mandatory-span">*</span>
            </CardLabel>
            <TextInput
              className="field"
              style={{ maxWidth: "540px" }}
              name={"levelcards"}
              value={details.level}
              onChange={(e) => handleLevelChange(index, e.target.value)}
            />
            {cardDetails.length > 1 && (
            
            <Button
              variation="secondary"
              label={`${t("DELETE_LEVEL")}`}
              type="button"
              className="CloseLevelButton"
              icon={<DeleteIconv2 styles={{ height: "1.5rem", width: "1.5rem" }} fill={COLOR_FILL} />}
              onButtonClick={() => handleDeleteRowDetails(index)} 
              style={{ fontSize: "1rem" }}
            />
           
          )}
          </LabelFieldPair>
        </div>
      ))}
      <LabelFieldPair>
        <Button
          variation="secondary"
          label={`${t("WBH_ADD_LEVEL")}`}
          type="button"
          className="workbench-add-row-detail-btn"
          icon={<AddFilled style={{ height: "1.8rem", width: "1.8rem"}} fill={COLOR_FILL} />}
          onButtonClick={handleCreateNewLevelDetails}
          style={{ fontSize: "1rem" }}
        />
      </LabelFieldPair>
      {showToast && (
        <Toast
          type={showToast?.type}
          label={showToast?.label}
          isDleteBtn={"true"}
          onClose={() => setShowToast(false)}
          style={{ bottom: "8%" }}
        />
      )}
    </React.Fragment>
  );
};

export default LevelCards;
