import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, RadioButtons, Card } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";

const SecurityPopUp = ({ onClose, census }) => {
  const { state } = useMyContext();
  const { t } = useTranslation();

  // Sort questions by 'id' in ascending order
  const questions = state.securityQuestions.sort((a, b) => a.id - b.id);

  // Initialize answers with the existing security details from additionalDetails if available
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (census?.additionalDetails?.securityDetails) {
      setAnswers(census.additionalDetails.securityDetails);
    }
  }, [census]);

  // Function to handle radio button selection
  const handleOptionChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Prepare the updated census data when saving
  const updatedCensus = {
    ...census,
    additionalDetails: {
      ...census?.additionalDetails,
      securityDetails: answers, // Update the security details
    },
  };

  // Use the custom mutation hook
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/census-service/_update`,
    body: {
      Census: updatedCensus, // Sending back the modified Census array
    },
  });

  // Function to save answers and trigger API call
  const handleSave = async () => {
    await mutation.mutate();
  };

  useEffect(() => {
    if (!mutation.isLoading && mutation.data) {
      onClose(); // Close popup after saving
    }
  }, [mutation.data, mutation.isLoading, onClose]);

  return (
    <PopUp
      onClose={onClose}
      heading={t(`HCM_MICROPLAN_VILLAGE_SECURITY_LEVEL_LABEL`)}
      onOverlayClick={onClose}
      children={[
        <Card type="secondary" key="security-card">
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
                <div> {/* Add margin for space between label and options */}
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
          onClick={handleSave} // Calls save function on click
          isLoading={mutation.isLoading} // Disable button during API call
        />,
      ]}
    />
  );
};

export default SecurityPopUp;
