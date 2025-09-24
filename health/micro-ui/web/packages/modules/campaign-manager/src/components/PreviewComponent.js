import React from 'react';
import { Card } from "@egovernments/digit-ui-components";

const Preview = ({ question, level = 1 }) => {
  return (
    <Card>
    <div >
      <div style={{fontWeight:"bold", marginBottom:"1rem" }}>{question.title}</div>
      {question.options && question.options.length > 0 && (
        <div className="preview-options">
          {question.options.map((option) => (
            <div key={option.id} className="preview-option">
              <span>{option.label}</span>
              {option.subQuestions && option.subQuestions.length > 0 && (
                <div className="preview-sub-questions">
                  {option.subQuestions.map((subQuestion) => (
                    <Preview
                      key={subQuestion.id}
                      question={subQuestion}
                      //level={level + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </Card>
  );
};

const PreviewComponent = ({questionsArray}) => {
  return (
    <div className="previewChecklist-app-container">
      {questionsArray.map((question) => (
        <Preview key={question.id} question={question} />
      ))}
    </div>
  );
};

export default PreviewComponent;
