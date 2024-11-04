import React, { useState, useEffect, Fragment, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, DeleteIconv2, LabelFieldPair, AddIcon, CardText } from "@egovernments/digit-ui-react-components";
import { Dropdown, CheckBox, PopUp, Card, Button, Divider } from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities";
import { useFormulaContext } from "./FormulaConfigWrapper";
import _ from "lodash";

const FormulaConfiguration = ({ onSelect, category, customProps, formulas: initialFormulas,setShowToast,allMdmsFormulasForThisCategory }) => {
  const { t } = useTranslation();
  const [showPopUP, setShowPopUp] = useState(false);
  const [formulasPopUP, setFormulasPopUp] = useState(false);
  const [formulaToDelete, setFormulaToDelete] = useState(null);
  const [formulas, setFormulas] = useState(initialFormulas);
  const [selectedDeletedFormula, setSelectedDeletedFormula] = useState(null);
  const { formulaConfigValues, handleFormulaChange, setFormulaConfigValues, deletedFormulas, setDeletedFormulas, assumptionsInPlan } = useFormulaContext();
  const deletedFormulaCategories = useRef({});
  const isAddNewDisabled =
    !deletedFormulaCategories.current[category] ||
    deletedFormulaCategories.current[category].length === 0 ||
    deletedFormulaCategories.current[category].every((item) => !deletedFormulas.includes(item));

  const availableDeletedFormulas = Array.from(
    new Set((deletedFormulaCategories.current[category] || []).filter((item) => deletedFormulas.includes(item)))
  );

  useEffect(() => {
    setFormulas(initialFormulas);
  }, [initialFormulas]);

  const handleDeleteClick = (index, formula) => {
    if(formulas?.length ===1){
      setShowToast({
        key: "error",
        label: t("ERR_ATLEAST_ONE_MANDATORY_FORMULA"),
        transitionTime: 3000,
      })
      return;
    }
    setFormulaToDelete(formula);
    setShowPopUp(true);
  };

  const handleCancelDelete = () => {
    setShowPopUp(false);
  };

  const handleConfirmDelete = () => {
    if (formulaToDelete !== null) {
      const deletedFormula = formulas.find(operation => operation.output === formulaToDelete.output)

      //matching output for deleting a formula
      const updatedFormulas = formulas.filter(operation => {
        if (operation.output === formulaToDelete.output) {
          return false
        }
        return true
      })

      if (!deletedFormulaCategories.current[category]) {
        deletedFormulaCategories.current[category] = [];
      }
      deletedFormulaCategories.current[category].push(deletedFormula.output);

      setDeletedFormulas((prev) => [...prev, deletedFormula.output]);

      setFormulaConfigValues((prevValues) => prevValues.filter((value) => value.output !== deletedFormula.output));

      setFormulas(updatedFormulas);

      setFormulaToDelete(null);

      //cascade effect
      //at the end of this function we need to handle cascading effect of formula deletion
      //if this particular output is getting used in the below formulas then we need to clear that i.e., clearing this output from any list of inputs
      setFormulaConfigValues((prevValues) => {
        const deletedFormulaOutput = deletedFormula?.output;
        //now basically check whether this is getting used in any of the input or assumptionValue
        //if yes clear that
        const updatedFormulaValues = prevValues?.map(formula => {
          if (formula.input === deletedFormulaOutput && formula.assumptionValue === deletedFormulaOutput) {
            const updatedFormulaObj = {
              ...formula,
              input: "",
              assumptionValue: ""
            }
            return updatedFormulaObj
          }
          else if (formula.input === deletedFormulaOutput) {
            const updatedFormulaObj = {
              ...formula,
              input: ""
            }
            return updatedFormulaObj
          } else if (formula.assumptionValue === deletedFormulaOutput) {
            const updatedFormulaObj = {
              ...formula,
              assumptionValue: ""
            }
            return updatedFormulaObj
          } else {
            return formula
          }
        })
        return updatedFormulaValues
      })
    }

    setShowPopUp(false);
  };

  const addNewFormula = () => {
    if (selectedDeletedFormula) {
      const formulaToAdd = deletedFormulas.find((formula) => formula === selectedDeletedFormula.code);

      // **Check if it already exists**
      if (formulaToAdd && !formulas.some((formula) => formula.output === formulaToAdd)) {
        setFormulas([...formulas, { output: formulaToAdd, category: category, input: "", operatorName: "", assumptionValue: "" }]);
        setDeletedFormulas(deletedFormulas.filter((formula) => formula !== selectedDeletedFormula.code));

        if (deletedFormulaCategories.current[category]) {
          deletedFormulaCategories.current[category] = deletedFormulaCategories.current[category].filter((item) => item !== formulaToAdd);
        }

        // **Conditionally Add to formulaConfigValues if not already present**
        if (!formulaConfigValues.some((formula) => formula.output === formulaToAdd)) {
          setFormulaConfigValues((prevValues) => [
            ...prevValues,
            { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category }, // or an initial value
          ]);
        }

        setSelectedDeletedFormula(null);
        setFormulasPopUp(false);
      }
    }
  };
  const { filteredInputs, filteredOutputs, operators, assumptions } = customProps;

  //here only show items which are there in formulas state 
  // const filteredFormulas = formulaConfigValues.filter((formula) => formula.category === category)?.filter(formula => {
  //   const currentFormulasOutputs = formulas?.filter(item => item.category === category)?.map(item => item.output)
  //   // return formula?.output?.includes(currentFormulasOutputs)
  //   return currentFormulasOutputs?.includes(formula?.output)
    
  // })

  const filteredFormulas = formulaConfigValues.filter((formula) => formula.category === category);


  const filteredFormulaOutputs = filteredFormulas.map((formula) => formula.output);

  return (
    <>
      <Card className="middle-child">
        <Header className="uploader-sub-heading">{t(category)}</Header>
        <p className="mp-description">{t(`Please configure the formula with respect to the assumptions considered for resource estimation`)}</p>
      </Card>
      <Card>
        {filteredFormulas.map((formula, index) => {
          // Gather outputs from previous formulas
          const previousOutputs = filteredFormulas
            .slice(0, index) // Get outputs of all previous formulas
            .map((prevFormula) => prevFormula.output); // Extract outputs

          // Combine with filteredInputs for dropdown options
          const inputOptions = [
            ...filteredInputs.map((input) => ({ code: input, label: input })),
            ...previousOutputs.map((output) => ({ code: output, label: output })),
          ];

          const assumptionOptions = [
            ...assumptions.map((assumptionValue) => ({
              code: assumptionValue,
              label: assumptionValue,
            })),
            ...previousOutputs.map((output) => ({ code: output, label: output })),
            ...inputOptions
          ]
          return (
            <>
              <div>
                <Card type="secondary">
                  <LabelFieldPair className="formula-label-field">
                    <span>{`${t(formula.output)}`}</span>
                    <div className="equals-icon">=</div>
                    <Dropdown
                      variant="select-dropdown"
                      t={t}
                      isMandatory={true}
                      option={inputOptions}
                      select={(value) => {
                        handleFormulaChange(formula.output, "input", value, category);
                      }}
                      selected={() => ({ code: formula.input })}
                      optionKey="code"
                      showToolTip={true}
                      style={{ width: "20rem" }}
                    />

                    <Dropdown
                      variant="select-dropdown"
                      t={t}
                      isMandatory={false}
                      option={operators.map((operator) => ({
                        code: operator.operatorCode,
                        label: operator.operatorName,
                      }))}
                      select={(value) => {
                        handleFormulaChange(formula.output, "operatorName", { code: value.label }, category);
                      }}
                      selected={() => ({ label: formula.operatorName })}
                      optionKey="label"
                      showToolTip={true}
                      style={{ width: "10rem" }}
                    />
                    <Dropdown
                      variant="select-dropdown"
                      t={t}
                      isMandatory={false}
                      option={assumptionOptions}
                      select={(value) => {
                        handleFormulaChange(formula.output, "assumptionValue", value, category);
                      }}
                      selected={() => ({ code: formula.assumptionValue })}
                      optionKey="code"
                      showToolTip={true}
                      style={{ width: "15rem" }}
                    />
                    <Button
                      icon="Delete"
                      iconFill=""
                      label="Delete"
                      size=""
                      title=""
                      variation="secondary"
                      onClick={() => handleDeleteClick(index, formula)}
                    />
                  </LabelFieldPair>
                </Card>
                <CheckBox
                  className="custom-assumption-checkbox"
                  //key={field.key}
                  mainClassName={"checkboxOptionVariant"}
                  label={t("Show on Estimation Dashboard")}
                  checked={formula.showOnEstimationDashboard ? true : false}
                  onChange={(event) => handleFormulaChange(formula.output, "showOnEstimationDashboard", {code : !formula.showOnEstimationDashboard}, category)}
                  isLabelFirst={false}
                />
                <Divider className="" variant="small" />
              </div>

            </>
          );
        })}
        <Button
          icon="Add"
          label={t("ADD_NEW_FORMULA")}
          onClick={() => setFormulasPopUp(true)}
          variation="secondary"
          // isDisabled={isAddNewDisabled}
          isDisabled={false}
        />
        {showPopUP && (
          <PopUp
            className={"popUpClass"}
            type={"default"}
            heading={t("CONFIRM_TO_DELETE")}
            equalWidthButtons={true}
            children={[
              <div>
                <CardText style={{ margin: 0 }}>{t("PERMANENT_DELETE")}</CardText>
              </div>,
            ]}
            onOverlayClick={() => {
              setShowPopUp(false);
            }}
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("YES")}
                onClick={() => {
                  handleConfirmDelete();
                }}
              />,
              <Button type={"button"} size={"large"} variation={"primary"} label={t("NO")} onClick={handleCancelDelete} />,
            ]}
            sortFooterChildren={true}
            onClose={() => {
              setShowPopUp(false);
            }}
          ></PopUp>
        )}

        {formulasPopUP && (
          <PopUp
            className={"popUpClass"}
            type={"default"}
            heading={t("CONFIRM_NEW_FORMULA")}
            equalWidthButtons={true}
            children={[
              <Dropdown
                variant="select-dropdown"
                t={t}
                isMandatory={false}
                // option={availableDeletedFormulas.map((item) => ({ code: item }))}
                option={[...new Set(deletedFormulas?.filter(del=>allMdmsFormulasForThisCategory?.includes(del)))]?.map(item => ({ code: item }))}
                select={(value) => {
                  setSelectedDeletedFormula(value);
                }}
                selected={selectedDeletedFormula}
                optionKey="code"
                showToolTip={true}
                placeholder={t("SELECT_OPTION")}
                onChange={(e) => setSelectedDeletedFormula(e.target.value)}
                optionCardStyles={{ position: "relative" }}
              />,
            ]}
            onOverlayClick={() => {
              setFormulasPopUp(false);
            }}
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("YES")}
                onClick={() => {
                  addNewFormula();
                }}
              />,
              <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("NO")}
                onClick={() => {
                  setFormulasPopUp(false);
                }}
              />,
            ]}
            sortFooterChildren={true}
            onClose={() => {
              setFormulasPopUp(false);
            }}
          ></PopUp>
        )}
      </Card>
    </>
  );
};
export default FormulaConfiguration;
