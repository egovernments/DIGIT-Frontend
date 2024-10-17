import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, RadioButtons, Card } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";

const SecurityPopUp = ({ onClose }) => {

  const { state } = useMyContext();
  const { t } = useTranslation();

  // Sort questions by 'id' in ascending order
  const questions = state.securityQuestions.sort((a, b) => a.id - b.id);

  const [answers, setAnswers] = useState({});

  // Function to handle radio button selection
  const handleOptionChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <PopUp
      onClose={onClose}
      heading={t(`HCM_MICROPLAN_VILLAGE_SECURITY_LEVEL_LABEL`)}
      onOverlayClick={onClose}
      children={[
        <Card type="secondary">
          <div>
            {/* Loop through the sorted questions */}
            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  marginBottom: index !== questions.length - 1 ? "1rem" : "0", // No margin after the last question
                  marginTop: "1rem"
                }}
              >
                <label style={{ marginBottom: "1rem", display: "block" }}>
                  {q.question} {q.required && "*"}
                </label>
                <div >  {/* Add margin for space between label and options */}
                  <RadioButtons
                    isMandatory={q.required}
                    options={q.values?.map(item => ({
                      code: item,
                      value: item,
                    }))}
                    optionsKey="code"
                    selectedOption={answers[q.id]}
                    style={{
                      display: "flex",
                      flexDirection: "column",  // Makes sure options appear in a vertical direction (each in a new line)
                      gap: "1rem",  // Adds space between the radio buttons
                    }}
                    onSelect={(value) => handleOptionChange(q.id, value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ]}
      footerChildren={[
        <Button
          key="close-button"
          className={"campaign-type-alert-button"}
          type={"button"}
          size={"large"}
          variation={"secondary"}
          label={t(`HCM_MICROPLAN_VILLAGE_SECURITY_CLOSE_LABEL`)}
          onClick={onClose}
        />,
        <Button
          key="save-button"
          className={"campaign-type-alert-button"}
          type={"button"}
          size={"large"}
          variation={"primary"}
          label={t(`HCM_MICROPLAN_VILLAGE_SECURITY_SAVE_LABEL`)}
          onClick={() => {
            console.log("User Answers:", answers);
            onClose();
          }}
        />,
      ]}
    />
  );
};

export default SecurityPopUp;
