import React, { useState, useEffect, useContext, useReducer, createContext } from "react";
import CreateQuestion from "./CreateQuestion";

const QuestionContext = createContext();

const CreateQuestionContext = ({ onSelect }) => {
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
        return state.filter((i) => i.key !== action?.payload?.index).map((i, n) => ({ ...i, key: n + 1 }));
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

  const initialState = [{ id: crypto.randomUUID(), parentId: null, level: 1, key: 1, title: null, type: {"code": "SingleValueList"}, value: null, isRequired: false }];

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
