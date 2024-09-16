import React, { useState, useEffect, useContext, useReducer, createContext, act } from "react";
import CreateQuestion from "./CreateQuestion";
import { temp_data, CreateChecklist } from "../pages/employee/CreateChecklist";
import data_hook from "../hooks/data_hook";
const QuestionContext = createContext();

const CreateQuestionContext = ({ onSelect, ...props }) => {
  // const { t } = useTranslation();
  const state = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("type");
  const projectName = searchParams.get("name");
  const flow = searchParams.get("flow");
  const role = searchParams.get("role");
  const locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  
  const { defaultData, setDefaultData } = data_hook();

  // Reducer function
  const questionDataReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_OPTIONS":
        return state.map((item, index) => {
          if (item.id === action?.payload?.field?.id) {
            return {
              ...item,
              options: action?.payload?.options,
            };
          }
          return { ...item };
        });
        break;
      case "UPDATE_QUESTION_DATA":
        console.log("gpt ", action.payload);
        return [...action.payload];
      case "ADD_QUESTION":
        return [
          ...state,
          {
            id: crypto.randomUUID(),
            level: action?.payload?.level,
            parentId: action?.payload?.parent?.id ? action?.payload?.parent?.id : null,
            key: state?.length + 1,
            title: null,
            type: {"code": "SingleValueList"},
            value: null,
            isRequired: false,
          },
        ];
        break;
      case "ADD_SUB_QUESTION":
        return [
          ...state,
          {
            id: crypto.randomUUID(),
            level: action?.payload?.level,
            parentId: action?.payload?.optionId,
            key: state?.length + 1,
            title: null,
            type: {"code": "SingleValueList"},
            value: null,
            isRequired: false,
          },
        ];
        break; 
      case "DELETE_QUESTION":
        console.log("cur cur cur", state);
        let id = action?.payload?.id;
        console.log("id id id", id);
        const deleteQuestionAndSubquestions = (state, questionId)=> {
          // Recursive function to find and delete subquestions based on option ids
          const findRelatedSubquestions = (questions, optionIds) => {
            return questions.reduce((acc, question) => {
              // If the current question's parentId matches any of the optionIds
              if (optionIds.includes(question.parentId)) {
                // Add the current question's id to the list of ids to delete
                let relatedIds = [question.id];
        
                // Check if the current question has options
                if (question.options && question.options.length > 0) {
                  const newOptionIds = question.options.map(option => option.id);
                  // Recursively find and delete subquestions related to the current question's options
                  relatedIds = relatedIds.concat(findRelatedSubquestions(questions, newOptionIds));
                }
        
                return [...acc, ...relatedIds];
              }
              return acc;
            }, []);
          };
        
          // Get the question to be deleted
          const questionToDelete = state.find(q => q.id === questionId);
        
          if (!questionToDelete) {
            console.log("Question not found");
            return state;
          }
        
          // Start by collecting IDs of the question's options (if any)
          let idsToDelete = [questionId]; // Start with the main question's ID
        
          if (questionToDelete.options && questionToDelete.options.length > 0) {
            const optionIds = questionToDelete.options.map(option => option.id);
            // Find and delete subquestions related to the options' ids
            idsToDelete = idsToDelete.concat(findRelatedSubquestions(state, optionIds));
          }
        
          // Filter out the questions whose ids are in idsToDelete
          const newState = state.filter(question => !idsToDelete.includes(question.id));
        
          // Print the updated state for verification
          // console.log("Updated state:", JSON.stringify(newState, null, 2));
        
          return newState;
        }
        const newState = deleteQuestionAndSubquestions(state, id);
        state = newState;
        return state

        
        // return state.filter((i) => i.key !== action?.payload?.index).map((i, n) => ({ ...i, key: n + 1 }));
        break;
      case "UPDATE_QUESTION":
        let dependencyParent = null;
        console.log("state initial is", state);
        let tempState = state.map((i) => {
          if (i.id === action?.payload?.id) {
            if (action?.payload?.target === "dependency") {
              dependencyParent = i?.id;
            }
            return {
              ...i,
              // level: action?.payload?.level,
              // parentId: action?.payload?.parent?.id ? action?.payload?.parent?.id : null,
              [action?.payload?.target]:
                action?.payload?.target === "isRequired" || action?.payload?.target === "isRegex" || action?.payload?.target === "dependency"
                  ? action?.payload?.data.target.checked
                  : action?.payload?.data,
            };
          }
          return {
            ...i,
          };
        });
        console.log("intial tempstate is", tempState);

        if (action?.payload?.target === "dependency" && action?.payload?.data?.target?.checked === true) {
          return [
            ...tempState,
            {
              id: crypto.randomUUID(),
              parentId: dependencyParent,
              level: action?.payload?.level + 1,
              key: state?.length + 1,
              title: null,
              type: null,
              value: null,
              isRequired: false,
            },
          ];
        } else if (action?.payload?.target === "dependency" && action?.payload?.data?.target?.checked !== true) {
          return tempState.filter((i) => i.parentId !== dependencyParent);
        } else {
          console.log("new returned is", tempState);
          return tempState;
        }
        break;
      default:
        return state;
    }
  };

  
  const [initialState, setInitialState] = useState( [{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: {"code": "SingleValueList"}, value: null, isRequired: false }])
  useEffect(()=>{
    setInitialState(props?.props?.data);
    console.log("data changed");
    console.log("data changed props are:", props?.props?.data);

  },[props]);

  useEffect(()=>{
    console.log("the template data is setting", initialState);
    if(initialState.length!=0)
    {
      console.log("updated data bc", initialState);
      dispatchQuestionData({
        type: "UPDATE_QUESTION_DATA",
        payload: props?.props?.data,
      });
    }
  }, [initialState]);

  const [questionData, dispatchQuestionData] = useReducer(questionDataReducer, initialState);

  useEffect(() => {
    onSelect("createQuestion", {
      questionData,
    });
  }, [questionData]);

  return (
    <QuestionContext.Provider value={{ questionData, dispatchQuestionData }}>
      <CreateQuestion initialQuestionData={questionData} level={1} onSelect={onSelect} />
    </QuestionContext.Provider>
  );
};

export default CreateQuestionContext;
export { QuestionContext };
