import React, { useEffect, useState, Fragment, useMemo } from "react";
import { Dropdown, Card, FieldV1, LabelFieldPair, TextInput } from "@egovernments/digit-ui-components";

function DependentFieldsWrapper({ t, parentState, onExpressionChange, screenConfig, selectedFieldItem }) {
  // List of possible operators
  const OPERATORS = ["!==", ">=", "<=", "==", ">", "<"].sort((a, b) => b.length - a.length);
  /**
   * Parses an expression like "A.B==C" and extracts A, B, operator, C
   */
  function parseExpression(expression = "") {
    for (const operator of OPERATORS) {
      const idx = expression.indexOf(operator);
      if (idx !== -1) {
        const [field, value] = [expression.slice(0, idx), expression.slice(idx + operator.length)];
        const [selectedPage, selectedField] = field.split(".");
        return {
          selectedPage: { code: selectedPage, name: selectedPage } || "",
          selectedField: { code: selectedField, name: selectedField } || "",
          comparisonType: { code: operator, name: operator },
          fieldValue: value || "",
        };
      }
    }
    // Fallback: if no operator found
    return {
      selectedPage: {},
      selectedField: {},
      comparisonType: {},
      fieldValue: "",
    };
  }

  const currentExpressionFromConfig = selectedFieldItem?.visibilityCondition?.expression;

  const parsed = parseExpression(currentExpressionFromConfig);

  // State initialization
  const [selectedPage, setSelectedPage] = useState(parsed.selectedPage);
  const [selectedField, setSelectedField] = useState(parsed.selectedField);
  const [comparisonType, setComparisonType] = useState(parsed.comparisonType);
  const [fieldValue, setFieldValue] = useState(parsed.fieldValue);
  const currentPage = screenConfig?.[0]?.name;
  const currentTemplate = parentState?.currentTemplate;

  const pageOptions = useMemo(() => {
    const currentIndex = currentTemplate.findIndex((p) => p.name === currentPage);
    return currentTemplate.slice(0, currentIndex + 1).map((p) => ({
      code: p.name,
      name: p.name,
    }));
  }, [currentTemplate, currentPage]);

  const fieldOptions = useMemo(() => {
    const pageObj = currentTemplate.find((p) => p.name === selectedPage?.code)?.cards?.[0];
    if (!pageObj) return [];
    return pageObj.fields.map((f) => ({
      code: f.jsonPath,
      name: f.jsonPath,
      format: f.format,
      enums: f.dropDownOptions || [],
    }));
  }, [parentState?.currentTemplate, selectedPage?.code]);

  const selectedFieldObj = fieldOptions.find((f) => f.code === selectedField);

  useEffect(() => {
    if (selectedPage?.code && selectedField?.code && comparisonType?.code && fieldValue !== "") {
      const expression = `${selectedPage?.code}.${selectedField?.code}${comparisonType?.code}${fieldValue}`;
      onExpressionChange?.(expression);
    }
  }, [selectedPage?.code, selectedField?.code, comparisonType?.code, fieldValue, onExpressionChange]);

  return (
    <Card type="secondary">
      <LabelFieldPair vertical={true} removeMargin={true}>
        <p style={{ margin: "0px" }}>{t("HCM_SELECT_PAGE")}</p>
        <div className="digit-field" style={{ width: "100%" }}>
          <Dropdown
            option={pageOptions}
            optionKey="code"
            name="pageSelect"
            t={t}
            select={(e) => {
              setSelectedPage(e);
              setSelectedField({});
            }}
            selected={selectedPage}
          />
        </div>
      </LabelFieldPair>
      <LabelFieldPair vertical={true} removeMargin={true}>
        <p style={{ margin: "0px" }}>{t("HCM_SELECT_FIELD")}</p>
        <div className="digit-field" style={{ width: "100%" }}>
          <Dropdown
            option={fieldOptions}
            optionKey="code"
            name="fieldSelect"
            t={t}
            select={(e) => {
              setSelectedField(e);
              setFieldValue("");
            }}
            selected={selectedField}
            disabled={!selectedPage?.code}
          />
        </div>
      </LabelFieldPair>
      <LabelFieldPair vertical={true} removeMargin={true}>
        <p style={{ margin: "0px" }}>{t("HCM_COMPARISION_TYPE")}</p>
        <div className="digit-field" style={{ width: "100%" }}>
          <Dropdown
            option={[
              { code: "==", name: "equals to" },
              { code: "!==", name: "not equals to" },
              { code: ">=", name: "greater than or equals to" },
              { code: "<=", name: "less than or equals to" },
              { code: ">", name: "greater than" },
              { code: "<", name: "less than" },
            ]}
            optionKey="code"
            name="comparisonSelect"
            t={t}
            select={(e) => setComparisonType(e)}
            disabled={!selectedField?.code}
            selected={comparisonType}
          />
        </div>
      </LabelFieldPair>
      <LabelFieldPair vertical={true} removeMargin={true}>
        <p style={{ margin: "0px" }}>{t("HCM_SELECT_VALUE")}</p>
        <div className="digit-field" style={{ width: "100%" }}>
          {selectedFieldObj && selectedFieldObj.format === "dropdown" ? (
            <Dropdown
              label={t("Select Value")}
              option={selectedFieldObj.enums.map((en) => ({
                code: en.code,
                name: en.name,
              }))}
              optionKey="code"
              name="valueSelect"
              t={t}
              select={(e) => setFieldValue(e.code)}
              disabled={!selectedField?.code}
              selected={fieldValue}
            />
          ) : (
            <TextInput
              type="text"
              populators={{ name: "fieldValue" }}
              placeholder={t("Enter value")}
              value={fieldValue}
              onChange={(event) => setFieldValue(event.target.value)}
              disabled={!selectedField?.code}
            />
          )}
        </div>
      </LabelFieldPair>
    </Card>
  );
}

export default React.memo(DependentFieldsWrapper);
