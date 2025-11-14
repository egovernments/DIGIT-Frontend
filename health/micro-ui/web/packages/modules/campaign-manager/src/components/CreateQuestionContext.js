import React, { useState, useEffect, useContext, useReducer, createContext, act } from "react";
import CreateQuestion from "./CreateQuestion";
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
        if(action?.payload && action?.payload.length>0) 
          {
            return [...action.payload];
          }
        else return state;
      case "CLEAR_DATA":
        const newState = state.map(item => {
          // Set isActive to false for all previous items
          return { ...item, isActive: false };
        });
        const updatedState = [
          ...newState,
          {
            ...action.payload[0],
          }
        ];
        return updatedState;

      case "ADD_QUESTION":
        if(action?.payload?.level>3) return state;
        return [
          ...state,
          {
            id: crypto.randomUUID(),
            level: action?.payload?.level,
            parentId: action?.payload?.parent?.id ? action?.payload?.parent?.id : null,
            key: state?.length + 1,
            title: null,
            type: { "code": "SingleValueList" },
            value: null,
            isRequired: true,
            isActive: true
          },
        ];
        break;
      case "ADD_SUB_QUESTION":
        if(action?.payload?.level>3) return state
        return [
          ...state,
          {
            id: crypto.randomUUID(),
            level: action?.payload?.level,
            parentId: action?.payload?.optionId,
            key: state?.length + 1,
            title: null,
            type: { "code": "SingleValueList" },
            value: null,
            isRequired: true,
            isActive: true
          },
        ];
        break;
      case "DELETE_QUESTION":
        return state.map((i) => {
          if (i.id === action?.payload?.id) {
            // Return a new object with isActive set to false
            return { ...i, isActive: false };
          }
          // Return the original object if the id doesn't match
          return i;
        });
      case "UPDATE_REQUIRED":
        return state.map((i) => {
          if (i.id === action?.payload?.id) {
            // Return a new object with the updated isRequired property
            return { ...i, isRequired: !i.isRequired };
          }
          // Return the original object if the id doesn't match
          return i;
        });

      case "UPDATE_QUESTION":
        let dependencyParent = null;
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
              isRequired: true,
            },
          ];
        } else if (action?.payload?.target === "dependency" && action?.payload?.data?.target?.checked !== true) {
          return tempState.filter((i) => i.parentId !== dependencyParent);
        } else {
          return tempState;
        }
        break;
      default:
        return state;
    }
  };
  // const [initialState, setInitialState] = useState([{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: { "code": "SingleValueList" }, value: null, isRequired: false }])

  const [initialState, setInitialState] = useState(()=>{
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions ?  JSON.parse(savedQuestions) : [{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: { "code": "SingleValueList" }, value: null, isRequired: false, isActive: true }]
  })
  
  const [typeOfCall, setTypeOfCall] = useState(null);
  const [questionData, dispatchQuestionData] = useReducer(questionDataReducer, initialState);

  useEffect(() => {
    // Avoid dispatch if props haven't changed
    if (props?.props?.data !== 0) {  
      // Dispatch only if the data is different
      setTypeOfCall(props?.props?.typeOfCall);
      if(props?.props?.typeOfCall === "clear")
      {
        dispatchQuestionData({
          type: "CLEAR_DATA",
          payload: props?.props?.data
        })

      }
      else{
        dispatchQuestionData({
          type: "UPDATE_QUESTION_DATA",
          payload: props?.props?.data,
        });

      }
      
  
    }
  }, [props?.props?.data]); // Ensure that the initialState is included in the dependency array
  
  useEffect(() => {
    onSelect("createQuestion", {
      questionData,
    });
    if(!(questionData.length === 1 && questionData?.[0].title===null))
    {
      localStorage.setItem("questions", JSON.stringify(questionData));

    } 
    // setInitialState(localStorage.getItem("questions"))
  }, [questionData]);


  return (
    <QuestionContext.Provider value={{ questionData, dispatchQuestionData }}>
      <CreateQuestion initialQuestionData={questionData} level={1} onSelect={onSelect} typeOfCall={typeOfCall} />
    </QuestionContext.Provider>
  );
};

export default CreateQuestionContext;
export { QuestionContext };
