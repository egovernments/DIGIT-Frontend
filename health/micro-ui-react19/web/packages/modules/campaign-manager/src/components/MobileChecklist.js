import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";

const MobileChecklist = ({ questions, campaignName, checklistRole, typeOfChecklist }) => {
  // Filter questions with parentId as null
  const topLevelQuestions = questions.filter((q) => q.parentId === null && q.isActive === true);

  return (
    <div className="mobile-screen">
      <div className="mobile-top-bar">
        <div className="mobile-menu-icon">&#9776;</div>
      </div>

      <div className="mobile-container">
        <div className="mobile-header">
          <h2 className="mobile-checklist-highlight" style={{ fontSize: "1.5rem" }}>
            {campaignName} {typeOfChecklist} {checklistRole}
          </h2>
          {/* <h1 className="mobile-checklist-highlight">{checklistRole}</h1> */}
          {/* <p className="mobile-description"></p> */}
        </div>

        <div className="mobile-questions">
          {topLevelQuestions.map((question, index) => (
            <div key={question.id} className="mobile-question-item">
              {/* <p className="mobile-question-number">Question {index + 1}
                {question.isRequired && <span className="mandatory-asterisk">*</span>}
              </p> */}
              <p className="mobile-question">
                {index + 1}
                {`)`} {question.title} {question.isRequired && <span className="mandatory-asterisk">*</span>}
              </p>
              {/* Only show options for SingleValueList and MultiValueList types */}
              {question.options &&
                question.options.length > 0 &&
                (question.type.code === "SingleValueList" || question.type.code === "MultiValueList") && (
                  <div className="mobile-options">
                    {question.options.map((option, index) => (
                      <div key={index} className="mobile-option-item">
                        {/* Conditionally render radio or checkbox based on question.type.code */}
                        {question.type.code === "SingleValueList" ? (
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            onClick={(e) => e.preventDefault()} // Prevents interaction
                          />
                        ) : (
                          <input
                            type="checkbox"
                            onClick={(e) => e.preventDefault()} // Prevents interaction
                          />
                        )}
                        <label className="mobile-answer">{option.label}</label>
                      </div>
                    ))}
                    <div style={{ height: "0.5rem" }}></div>
                  </div>
                )}
              {/* Text Input - Short Answer / String / Text */}
              {(question.type.code === "Short Answer" || question.type.code === "String" || question.type.code === "text") && (
                <div className="mobile-field-wrapper">
                  <FieldV1 withoutLabel={true} type="text" placeholder="Enter text..." value="" onChange={() => {}} disabled={true} />
                </div>
              )}

              {/* Textarea - Long Answer */}
              {(question.type.code === "Long Answer" || question.type.code === "Paragraph" || question.type.code === "textarea") && (
                <div className="mobile-field-wrapper">
                  <FieldV1
                    withoutLabel={true}
                    type="textarea"
                    placeholder="Enter detailed response..."
                    value=""
                    onChange={() => {}}
                    disabled={true}
                    populators={{ resizeSmart: true }}
                  />
                </div>
              )}

              {/* Number Input - Regular number field */}
              {(question.type.code === "Number" || question.type.code === "Integer" || question.type.code === "number") && (
                <div className="mobile-field-wrapper">
                  <FieldV1 withoutLabel={true} type="number" placeholder="Enter number..." value="" onChange={() => {}} disabled={true} />
                </div>
              )}

              {/* Numeric Stepper - +/- increment control using FieldV1 */}
              {(question.type.code === "Numeric" || question.type.code === "numeric") && (
                <div className="mobile-numeric-field">
                  <FieldV1 withoutLabel={true} type="numeric" value={question.value || "0"} onChange={() => {}} disabled={true} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileChecklist;
