import React from 'react';

const MobileChecklist = ({ questions, campaignName, checklistRole, typeOfChecklist }) => {
  // Filter questions with parentId as null
  const topLevelQuestions = questions.filter(q => q.parentId === null && q.isActive === true);

  return (
    <div className="mobile-screen">

      <div className="mobile-container">

        <div className="mobile-questions">
          {topLevelQuestions.map((question, index) => (
            <div key={question.id} className="mobile-question-item">
              {/* <p className="mobile-question-number">Question {index + 1}
                {question.isRequired && <span className="mandatory-asterisk">*</span>}
              </p> */}
              <p className="mobile-question">{index + 1}{`)`} {question.title} {question.isRequired && <span className="mandatory-asterisk">*</span>}</p>
              {question.options && question.options.length > 0 && question.type.code !== "Text" && (
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
                        <input type="checkbox"
                          onClick={(e) => e.preventDefault()} // Prevents interaction
                        />
                      )}
                      <label className="mobile-answer">{option.label}</label>
                    </div>
                  ))}
                  <div style={{height:"0.5rem"}}></div>
                </div>
              )}
              {question.type.code === "Short Answer" && 
              (
                <label className="mobile-answer">{question.value}</label>
              )}
              {question.type.code === "Text" && 
              (
                <div className="mobile-text-input">
                  <input
                    type="text"
                    placeholder={question.value || "Enter text here"}
                    disabled={true}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#f5f5f5"
                    }}
                  />
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
