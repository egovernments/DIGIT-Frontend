import React, { useEffect, useMemo, Fragment, useState } from "react";
import { TextInput, Dropdown, RadioButtons, Button, FieldV1 } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useCustomT } from "./useCustomT";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import FiltersRenderer from "../../../components/FiltersRenderer";
import DependentFieldsWrapper from "./DependentFieldsWrapper";
import { useAppConfigContext } from "./AppConfigurationWrapper";

const getDefaultRules = (key) => {
  switch (key) {
    case "minAge":
      return [
        {
          type: "compare",
          compareWith: "toArray.maxAge",
          operator: "<=",
          message: "MIN_AGE_MUST_BE_LESS_OR_EQUALTO_MAX_AGE",
        },
      ];

    case "maxAge":
      return [
        {
          type: "compare",
          compareWith: "toArray.minAge",
          operator: ">=",
          message: "MAX_AGE_MUST_BE_GREATER_OR_EQUALTO_MIN_AGE",
        },
      ];

    case "min":
      return [
        {
          type: "compare",
          compareWith: "toArray.max",
          operator: "<=",
          message: "MIN_MUST_BE_LESS_OR_EQUALTO_MAX",
        },
      ];

    case "max":
      return [
        {
          type: "compare",
          compareWith: "toArray.min",
          operator: ">=",
          message: "MAX_MUST_BE_GREATER_OR_EQUALTO_MIN",
        },
      ];

    case "minLength":
      return [
        {
          type: "compare",
          compareWith: "toArray.maxLength",
          operator: "<=",
          message: "MIN_LENGTH_MUST_BE_LESS_OR_EQUALTO_MAX_LENGTH",
        },
      ];

    case "maxLength":
      return [
        {
          type: "compare",
          compareWith: "toArray.minLength",
          operator: ">=",
          message: "MAX_LENGTH_MUST_BE_GREATER_OR_EQUALTO_MIN",
        },
      ];

    default:
      return [];
  }
};

const ErrorComponent = ({ error }) => <span style={{ color: "red" }}>{error}</span>;
const computeError = (field, currentField, t) => {
  let error = "";
   const attr = t(field.label);
  const valueStr = currentField?.[field?.bindTo];

  // 1. Pattern Validation
  const pattern = field?.validation?.pattern;

  if (pattern) {
    try {
      const regex = new RegExp(pattern);
      if (!regex.test(valueStr)) {
        error = `${attr}: ${t('PATTERN_VALIDATION_FAILED')}`;
        return error;
      }
    } catch (e) {
      console.warn(`Invalid regex pattern: ${pattern}`);
      return t('INVALID_REGEX_PATTERN');
    }
  }

  // 2. Generic Rule Support (e.g. defined in config)
  const rules = field?.validation?.rules || getDefaultRules(field.bindTo?.split(".")?.[1] ? field.bindTo?.split(".")?.[1] : field.bindTo);
  if (field?.type == "number") {
    const value = Number(valueStr);

    for (const rule of rules) {
      const { compareWith, operator, message } = rule;

      const compareValue = currentField?.[compareWith];

      if (compareValue !== undefined && compareValue !== null && compareValue !== "") {
        const compareNum = Number(compareValue);
         // Skip comparison if either number is NaN
        if (isNaN(value) || isNaN(compareNum)) {
          continue;
        }

        switch (operator) {
          case ">":
            if (!(value > compareNum)) error = message || `${attr} must be > ${compareWith}`;
            break;
          case "<":
            if (!(value < compareNum)) error = message || `${attr} must be < ${compareWith}`;
            break;
          case ">=":
            if (!(value >= compareNum)) error = message || `${attr} must be >= ${compareWith}`;
            break;
          case "<=":
            if (!(value <= compareNum)) error = message || `${attr} must be <= ${compareWith}`;
            break;
          case "===":
            if (!(value === compareNum)) error = message || `${attr} must equal ${compareWith}`;
            break;
          // Add more operators as needed
        }
      }
    }
  }

  return error || "";
};
export const RenderConditionalField = ({
  cField,
  cIndex,
  cArray,
  setDrawerState,
  updateLocalization,
  state,
  drawerState,
  AppScreenLocalisationConfig,
  disabled,
  parentState,
  handleExpressionChange,
  screenConfig,
  selectedField,
}) => {
  const { t } = useTranslation();
  const { state: appState, setFieldError, clearFieldError } = useAppConfigContext();
  const useT = useCustomT();
  
  // Track if field has been touched
  const [isTouched, setIsTouched] = useState(false);
  
  const isLocalisable = AppScreenLocalisationConfig?.fields
    ?.find((i) => i.fieldType === (drawerState?.appType || drawerState?.type))
    ?.localisableProperties?.includes(cField?.bindTo?.split(".")?.at(-1));
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  
  const errorKey = useMemo(() => `${drawerState?.jsonPath || drawerState?.id || "field"}::${cField?.bindTo || "bind"}`, [
    drawerState?.jsonPath,
    drawerState?.id,
    cField?.bindTo,
  ]);
  
  const currentError = appState?.errorMap?.[errorKey] || "";
  const evaluatedError = useMemo(() => computeError(cField, drawerState, t), [cField, drawerState]);

  // Only show error if field has been touched and has content
  const fieldValue = typeof drawerState?.[cField?.bindTo] === "boolean" ? null : drawerState?.[cField?.bindTo];
  const hasContent = fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
  const shouldShowError = isTouched && hasContent && evaluatedError && evaluatedError !== "";

  useEffect(() => {
    // Only validate if field has been touched
    if (isTouched) {
      if (evaluatedError && evaluatedError !== currentError) {
        setFieldError(errorKey, evaluatedError);
      } else if (!evaluatedError && currentError) {
        clearFieldError(errorKey);
      }
    }
  }, [evaluatedError, errorKey, isTouched, currentError, setFieldError, clearFieldError]);

  switch (cField?.type) {
    case "text":
    case "number":
    case "date":
    case "time":
      return (
        <div style={{ width: "100%" }}>
          <FieldV1
            type={cField?.type}
            label={cField?.label}
            withoutLabel={Boolean(!cField?.label)}
            value={isLocalisable ? useT(drawerState?.[cField?.bindTo]) : drawerState?.[cField?.bindTo] === true ? "" : drawerState?.[cField?.bindTo]}
            config={{
              step: "",
            }}
            onBlur={() => {
              // Mark as touched when user leaves the field
              setIsTouched(true);
            }}
            onChange={(event) => {
              const value = event.target.value;
              
              // Mark as touched when user starts typing
              if (!isTouched && value) {
                setIsTouched(true);
              }
              
              if (isLocalisable) {
                updateLocalization(
                  drawerState?.[cField.bindTo] && drawerState?.[cField.bindTo] !== true
                    ? drawerState?.[cField.bindTo]
                    : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${cField.bindTo}_${
                        drawerState?.jsonPath || drawerState?.id
                      }`,
                  Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                  value
                );
                setDrawerState((prev) => ({
                  ...prev,
                  [cField?.bindTo]:
                    drawerState?.[cField.bindTo] && drawerState?.[cField.bindTo] !== true
                      ? drawerState?.[cField.bindTo]
                      : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${cField.bindTo}_${
                          drawerState?.jsonPath || drawerState?.id
                        }`,
                }));
              } else {
                setDrawerState((prev) => ({
                  ...prev,
                  [cField?.bindTo]: value,
                }));
              }
            }}
            populators={{ fieldPairClassName: "drawer-toggle-conditional-field" }}
            disabled={disabled}
          />
          {shouldShowError && (
            <div style={{ 
              color: "red", 
              fontSize: "0.875rem", 
              marginTop: "0.25rem",
              pointerEvents: "none" // Prevents blocking interactions
            }}>
              {t(currentError)}
            </div>
          )}
        </div>
      );
    case "options":
      return (
        <div
          style={{ padding: "1.5rem", border: "1px solid #c84c0e", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {(drawerState?.[cField?.bindTo] || []).map((item, index) => (
            <div style={{ display: "flex", gap: "1rem" }} key={item.code || index}>
              <TextInput
                isRequired={true}
                className=""
                type={"text"}
                name="title"
                value={useT(item?.name)}
                onChange={(event) => {
                  setDrawerState((prev) => ({
                    ...prev,
                    [cField?.bindTo]: prev?.[cField?.bindTo]?.map((i) => {
                      if (i.code && i.code === item.code) {
                        updateLocalization(
                          item?.name ? item?.name : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${item?.code}`,
                          Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                          event.target.value
                        );
                        return {
                          ...i,
                          name: item?.name
                            ? item?.name
                            : `${projectType}_${state?.currentScreen?.parent}_${state?.currentScreen?.name}_${item?.code}`,
                        };
                      }
                      return i;
                    }),
                  }));
                  return;
                }}
                placeholder={""}
                disabled={disabled}
              />
              <div
                onClick={() =>
                  setDrawerState((prev) => ({
                    ...prev,
                    [cField?.bindTo]: prev?.[cField?.bindTo]?.filter((i) => i.code !== item.code),
                  }))
                }
                style={{
                  cursor: "pointer",
                  fontWeight: "600",
                  marginLeft: "1rem",
                  fontSize: "1rem",
                  color: "#c84c0e",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <DustbinIcon />
              </div>
            </div>
          ))}

          <Button
            type={"button"}
            icon="AddIcon"
            size={"small"}
            variation={"teritiary"}
            label={t("ADD_OPTIONS")}
            disabled={disabled}
            onClick={() =>
              setDrawerState((prev) => ({
                ...prev,
                [cField?.bindTo]: prev?.[cField?.bindTo]
                  ? [
                      ...prev?.[cField?.bindTo],
                      {
                        code: crypto.randomUUID(),
                        name: "",
                      },
                    ]
                  : [
                      {
                        code: crypto.randomUUID(),
                        name: "",
                      },
                    ],
              }))
            }
          />
        </div>
      );
    case "dropdown":
      return (
        <Dropdown
          variant={""}
          t={t}
          option={cField?.options || []}
          disabled={disabled}
          optionKey={cField?.optionKey || "code"}
          selected={cField?.options?.find((i) => i.code === drawerState?.[cField?.bindTo]) || {}}
          select={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              [cField?.bindTo]: value?.code,
            }));
          }}
        />
      );
    case "MdmsDropdown":
      return (
        <Dropdown
          variant={""}
          t={t}
          disabled={disabled}
          option={cField?.mdmsOptions || []}
          optionKey={"schemaCode"}
          selected={(cField?.mdmsOptions || []).find((i) => i.schemaCode === drawerState?.[cField?.bindTo]) || {}}
          select={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              [cField?.bindTo]: value?.schemaCode,
            }));
          }}
        />
      );
    case "radioOptions":
      return (
        <RadioButtons
          options={cField?.options}
          disabled={disabled}
          additionalWrapperClass="app-config-radio"
          selectedOption={cField?.options?.find((i) => i.pattern === drawerState?.[cField?.bindTo])}
          onSelect={(value) => {
            setDrawerState((prev) => ({
              ...prev,
              [cField?.bindTo]: value?.pattern,
            }));
          }}
          optionsKey="code"
        />
      );
    case "filters":
      return <FiltersRenderer cField={cField} drawerState={drawerState} setDrawerState={setDrawerState} t={t} disabled={disabled} />;

    case "dependencyFieldWrapper":
      return (
        <DependentFieldsWrapper
          t={t}
          currentState={state}
          parentState={parentState}
          onExpressionChange={handleExpressionChange}
          screenConfig={screenConfig}
          selectedFieldItem={selectedField}
        />
      );
    default:
      return null;
  }
};
