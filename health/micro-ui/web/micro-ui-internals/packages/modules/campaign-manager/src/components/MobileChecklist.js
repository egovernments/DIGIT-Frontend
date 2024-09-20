import React from 'react';

const MobileChecklist = ({ questions, checklistName , typeOfChecklist}) => {
  console.log("the questions are as follows", questions, checklistName, typeOfChecklist);
  // Filter questions with parentId as null
  const topLevelQuestions = questions.filter(q => q.parentId === null);

  return (
    <div className="mobile-screen">
      <div className="mobile-top-bar">
        <div className="mobile-menu-icon">&#9776;</div>
      </div>

      <div className="mobile-container">
        <div className="mobile-header">
          <h2 className='mobile-checklist-highlight'>{typeOfChecklist}</h2>
          <h1 className="mobile-checklist-highlight">{checklistName}</h1>
          <p className="mobile-description">
          </p>
        </div>
        
        <div className="mobile-questions">
          {topLevelQuestions.map(question => (
            <div key={question.id} className="mobile-question-item">
              <p className="mobile-question">{question.title}</p>
              {question.options && question.options.length > 0 && (
                <div className="mobile-options">
                  {question.options.map((option, index) => (
                    <p key={index} className="mobile-answer">{option.label}</p>
                  ))}
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
