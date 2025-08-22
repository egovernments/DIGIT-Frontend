import React, { Fragment, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, RadioButtons, Card, Toast ,Divider} from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";

const SecurityPopUp = ({ onClose, census, onSuccess, disableEditing=false}) => {
  const { state } = useMyContext();
  const { t } = useTranslation();

  // Sort questions by 'id' in ascending order
  const questions = state.securityQuestions.sort((a, b) => a.id - b.id);

  // Initialize answers with the existing security details from additionalDetails if available
  const [answers, setAnswers] = useState({});
  const [initialAnswers, setInitialAnswers] = useState({});
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    if (census?.additionalDetails?.securityDetails) {
      setAnswers(census.additionalDetails.securityDetails);

      // Store initial answers to compare later
      setInitialAnswers(census.additionalDetails.securityDetails);
    }
  }, [census]);

  // Function to handle radio button selection
  const handleOptionChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Close the toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(null), 5000);
    }
  }, [showToast]);

  // Prepare the updated census data when saving
  const updatedCensus = {
    ...census,
    additionalDetails: {
      ...census?.additionalDetails,
      securityDetails: answers, // Update the security details
    },
  };

  // Check if the answers have changed from the initial values
  const isChanged = React.useMemo(() => {
    if (!answers || !initialAnswers) return false;
    return Object.keys(answers).some(
      (key) => answers[key] !== initialAnswers[key]
    );
  }, [answers, initialAnswers]);

  // Use the custom mutation hook
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/census-service/_update`,
    body: {
      Census: updatedCensus, // Sending back the modified Census array
    },
  });

  // Function to save answers and trigger API call
  const handleSave = async () => {
    await mutation.mutate(
      { body: updatedCensus },
      {
        onSuccess: (data) => {
          onSuccess && onSuccess(data); // Call the onSuccess callback if provided
          onClose();
        },
        onError: (error) => {
          setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
        }
      }
    );
  };

  return (
    <>
      <PopUp
        onClose={onClose}
        heading={t(`HCM_MICROPLAN_VILLAGE_SECURITY_LEVEL_LABEL`)}
        onOverlayClick={onClose}
        children={[
          <Card type="secondary" key="security-card">
            <div>
              {/* Loop through the sorted questions */}
              {questions.map((q, index) => (
                <div>
                                  <div
                  key={q.id}
                  style={{
                    marginBottom: index !== questions.length - 1 ? "1rem" : "0", // No margin after the last question
                  }}
                >
                  <div className="security-question-label">
                    {t(q.question)}
                  </div>
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
                        gap: "1.5rem",  // Adds space between the radio buttons
                      }}
                      onSelect={(value) => handleOptionChange(q.id, value)}
                      disabled={disableEditing}
                    />
                  </div>
                </div>
                {index !== questions.length - 1 && <Divider className={"questions-divider"} variant="small" />}
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
            title={t(`HCM_MICROPLAN_VILLAGE_SECURITY_CLOSE_LABEL`)}
            label={t(`HCM_MICROPLAN_VILLAGE_SECURITY_CLOSE_LABEL`)}
            onClick={onClose}
          />,
          <Button
            key="save-button"
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"large"}
            variation={"primary"}
            title={t(`HCM_MICROPLAN_VILLAGE_SECURITY_SAVE_LABEL`)}
            label={t(`HCM_MICROPLAN_VILLAGE_SECURITY_SAVE_LABEL`)}
            onClick={handleSave} // Calls save function on click
            isDisabled={!isChanged || mutation.isLoading || disableEditing} // Disable if no changes are made or during API call
          />,
        ]}
      />
      {showToast && (
        <Toast style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          error={showToast.key === "error"}
          onClose={() => setShowToast(null)}
        />
      )}
    </>
  );
};

export default SecurityPopUp;
