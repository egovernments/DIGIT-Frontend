import React, { useState, useEffect, Fragment, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, DeleteIconv2, LabelFieldPair, AddIcon, CardText, InfoBannerIcon } from "@egovernments/digit-ui-react-components";
import { Dropdown, CheckBox, PopUp, Card, Button, Divider, TooltipWrapper, TextInput } from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities";
import { useFormulaContext } from "./FormulaConfigWrapper";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";


const FormulaConfiguration = ({ onSelect, category, customProps, formulas: initialFormulas, setShowToast, allMdmsFormulasForThisCategory }) => {
  const { t } = useTranslation();
  const [showPopUP, setShowPopUp] = useState(false);
  const [formulasPopUP, setFormulasPopUp] = useState(false);
  const [formulaToDelete, setFormulaToDelete] = useState(null);
  const [formulas, setFormulas] = useState(initialFormulas);
  const [selectedDeletedFormula, setSelectedDeletedFormula] = useState(null);
  const {
    formulaConfigValues,
    handleFormulaChange,
    setFormulaConfigValues,
    deletedFormulas,
    setDeletedFormulas,
    assumptionsInPlan,
    defautFormula,
    setDefaultFormula,
  } = useFormulaContext();
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
    if (formulas?.length === 1 && category !== "CAMPAIGN_VEHICLES") {
      setShowToast({
        key: "error",
        label: t("ERR_ATLEAST_ONE_MANDATORY_FORMULA"),
        transitionTime: 3000,
      });
      return;
    }
    setFormulaToDelete(formula);
    setShowPopUp(formula?.source || true);
  };

  const handleCancelDelete = () => {
    setShowPopUp(false);
    setSelectedDeletedFormula(null);
  };

  const handleConfirmDelete = () => {
    if (formulaToDelete !== null) {
      const deletedFormula = formulas.find((operation) => operation.output === formulaToDelete.output);

      //matching output for deleting a formula
      const updatedFormulas = formulas.filter((operation) => {
        if (operation.output === formulaToDelete.output) {
          return false;
        }
        return true;
      });

      if (!deletedFormulaCategories.current[category]) {
        deletedFormulaCategories.current[category] = [];
      }
      deletedFormulaCategories?.current[category].push(deletedFormula?.output);

      setDeletedFormulas((prev) => [...prev, deletedFormula?.output]);

      setFormulaConfigValues((prevValues) => prevValues.filter((value) => value.output !== deletedFormula?.output));

      setFormulas(updatedFormulas);

      setFormulaToDelete(null);

      //cascade effect
      //at the end of this function we need to handle cascading effect of formula deletion
      //if this particular output is getting used in the below formulas then we need to clear that i.e., clearing this output from any list of inputs
      setFormulaConfigValues((prevValues) => {
        const deletedFormulaOutput = deletedFormula?.output;
        //now basically check whether this is getting used in any of the input or assumptionValue
        //if yes clear that
        const updatedFormulaValues = prevValues?.map((formula) => {
          if (formula.input === deletedFormulaOutput && formula.assumptionValue === deletedFormulaOutput) {
            const updatedFormulaObj = {
              ...formula,
              input: "",
              assumptionValue: "",
            };
            return updatedFormulaObj;
          } else if (formula.input === deletedFormulaOutput) {
            const updatedFormulaObj = {
              ...formula,
              input: "",
            };
            return updatedFormulaObj;
          } else if (formula.assumptionValue === deletedFormulaOutput) {
            const updatedFormulaObj = {
              ...formula,
              assumptionValue: "",
            };
            return updatedFormulaObj;
          } else {
            return formula;
          }
        });
        return updatedFormulaValues;
      });
    }

    setShowPopUp(false);
  };

  const addNewFormula = () => {
    if (selectedDeletedFormula?.code === "NEW_FORMULA") {
      const formulaToAdd = selectedDeletedFormula;
      if (formulaToAdd && !formulas.some((formula) => formula.output === formulaToAdd)) {
        setFormulas([
          ...formulas,
          { source: "CUSTOM", output: formulaToAdd?.name, category: category, input: "", operatorName: "", assumptionValue: "" },
        ]);

        if (!formulaConfigValues.some((formula) => formula.output === formulaToAdd)) {
          // setFormulaConfigValues((prevValues) => [
          //   ...prevValues,
          //   { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category }, // or an initial value
          // ]);

          //pushing but maintaining the order
          // setFormulaConfigValues((prevValues) => {
          //   // Find the index where the new formula should be inserted
          //   const insertIndex = prevValues.findIndex(
          //     (item) => item.category > category
          //   );

          //   // If no matching category is found, insert at the end of the array
          //   const newValues =
          //     insertIndex === -1
          //       ? [...prevValues, { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category }]
          //       : [
          //           ...prevValues.slice(0, insertIndex),
          //           { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category },
          //           ...prevValues.slice(insertIndex)
          //         ];

          //   return newValues;
          // });

          //pushing but maintaining the order
          setFormulaConfigValues((prevValues) => {
            // Define the new formula object
            const newFormula = {
              source: "CUSTOM",
              output: formulaToAdd?.name,
              input: "",
              operatorName: "",
              assumptionValue: "",
              category: category,
              showOnEstimationDashboard: true, // Default to true; adjust as needed
            };

            // Find the last index of the specified category by reversing the array
            const lastIndexInCategory = [...prevValues].reverse().findIndex((item) => item.category === category);

            // Calculate the correct insertion index in the original array
            const insertIndex = lastIndexInCategory === -1 ? prevValues.length : prevValues.length - lastIndexInCategory;

            // Insert the new formula at the determined index, maintaining grouped categories
            const newValues = [...prevValues.slice(0, insertIndex), newFormula, ...prevValues.slice(insertIndex)];

            return newValues;
          });
        }
      }
      setSelectedDeletedFormula(null);
      setFormulasPopUp(false);
    } else if (selectedDeletedFormula) {
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
          // setFormulaConfigValues((prevValues) => [
          //   ...prevValues,
          //   { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category }, // or an initial value
          // ]);

          //pushing but maintaining the order
          // setFormulaConfigValues((prevValues) => {
          //   // Find the index where the new formula should be inserted
          //   const insertIndex = prevValues.findIndex(
          //     (item) => item.category > category
          //   );

          //   // If no matching category is found, insert at the end of the array
          //   const newValues =
          //     insertIndex === -1
          //       ? [...prevValues, { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category }]
          //       : [
          //           ...prevValues.slice(0, insertIndex),
          //           { source: "MDMS", output: formulaToAdd, input: "", operatorName: "", assumptionValue: "", category: category },
          //           ...prevValues.slice(insertIndex)
          //         ];

          //   return newValues;
          // });

          //pushing but maintaining the order
          setFormulaConfigValues((prevValues) => {
            // Define the new formula object
            const newFormula = {
              source: "MDMS",
              output: formulaToAdd,
              input: "",
              operatorName: "",
              assumptionValue: "",
              category: category,
              showOnEstimationDashboard: true, // Default to true; adjust as needed
            };

            // Find the last index of the specified category by reversing the array
            const lastIndexInCategory = [...prevValues].reverse().findIndex((item) => item.category === category);

            // Calculate the correct insertion index in the original array
            const insertIndex = lastIndexInCategory === -1 ? prevValues.length : prevValues.length - lastIndexInCategory;

            // Insert the new formula at the determined index, maintaining grouped categories
            const newValues = [...prevValues.slice(0, insertIndex), newFormula, ...prevValues.slice(insertIndex)];

            return newValues;
          });
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
  const handleUpdateField = (value, name) => {
    setSelectedDeletedFormula((prev) => ({
      ...prev,
      name: value,
    }));
  };
  return (
    <>
      <Card className="middle-child">
        <Header className="uploader-sub-heading">{t(`FORMULA_HEADER_${category}`)}</Header>
        {category === "FORMULA_CAMPAIGN_VEHICLES" ? (
          <p className="mp-description">{t(`FORMULA_VEHICLE_DESCRIPTION`)}</p>
        ) : (
          <p className="mp-description">{t(`FORMULA_CONFIGURATION_DESCRIPTION`)}</p>
        )}
      </Card>
      <Card>
        {filteredFormulas.map((formula, index) => {
          const currentIndex = formulaConfigValues.findIndex((f) => f.output === formula.output);
          const previousOutputs = currentIndex !== -1 ? formulaConfigValues.slice(0, currentIndex).map((prevFormula) => prevFormula.output) : [];

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
            ...inputOptions,
          ];

          const dropdownOptions = [
            ...filteredInputs.map((input) => ({ code: input, label: input })),
            ...previousOutputs.map((output) => ({ code: output, label: output })),
            ...assumptions.map((assumptionValue) => ({
              code: assumptionValue,
              label: assumptionValue,
            })),
          ];
          return (
            <>
              <div>
                <Card type="secondary">
                  <LabelFieldPair className="formula-label-field">
                    <span className="assumption-label-icon-wrapper">
                      <span className="assumption-label-icon-wrapper-label">{`${t(formula.output)}`}</span>
                      {category === "CAMPAIGN_VEHICLES" || formula?.source === "CUSTOM" ? null : (
                        <span className="icon-wrapper">
                          <TooltipWrapper
                            content={t(`FORMULA_MESSAGE_FOR_${formula.output}`)}
                            children={<InfoOutline fill={"#C84C0E"} width={"1.25rem"} height={"1.25rem"} />}
                          />
                        </span>
                      )}
                    </span>
                    <div className="equals-icon">=</div>
                    <Dropdown
                      variant="select-dropdown"
                      t={t}
                      isMandatory={true}
                      option={dropdownOptions}
                      select={(value) => {
                        handleFormulaChange(formula.output, "input", value, category);
                      }}
                      selected={() => (dropdownOptions?.find((i) => i.code === formula.input) ? { code: formula.input } : "")}
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
                      option={dropdownOptions}
                      select={(value) => {
                        handleFormulaChange(formula.output, "assumptionValue", value, category);
                      }}
                      selected={() => (dropdownOptions?.find((i) => i.code === formula.assumptionValue) ? { code: formula.assumptionValue } : "")}
                      optionKey="code"
                      showToolTip={true}
                      style={{ width: "15rem" }}
                    />
                    <Button
                      icon="Delete"
                      iconFill=""
                      label={t("DELETE")}
                      title={t("DELETE")}
                      size=""
                      style={{ padding: "0px" }}
                      variation="secondary"
                      onClick={() => handleDeleteClick(index, formula)}
                    />
                  </LabelFieldPair>
                </Card>
                <CheckBox
                  className="custom-assumption-checkbox"
                  //key={field.key}
                  mainClassName={"checkboxOptionVariant"}
                  label={t("SHOW_ON_ESTIMATION_DASHBOARD")}
                  checked={formula.showOnEstimationDashboard ? true : false}
                  onChange={(event) =>
                    handleFormulaChange(formula.output, "showOnEstimationDashboard", { code: !formula.showOnEstimationDashboard }, category)
                  }
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
          title={t("ADD_NEW_FORMULA")}
          onClick={() => setFormulasPopUp(true)}
          variation="secondary"
          // isDisabled={isAddNewDisabled}
          isDisabled={false}
        />
        {showPopUP && (
          <PopUp
            className={"popUpClass"}
            type={"default"}
            heading={t("FOR_CONFIRM_TO_DELETE")}
            equalWidthButtons={true}
            children={[
              <div>
                <CardText style={{ margin: 0 }}>
                  {showPopUP === "CUSTOM" ? (
                    t(`FORMULA_PERMANENT_DELETE_CUSTOM`)
                  ) : (
                    <>
                      {t("FOR_PERMANENT_DELETE")} <b>{t(`ADD_FORMULA`)}</b> {t(`BUTTON`)}
                    </>
                  )}
                </CardText>
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
                title={t("YES")}
                onClick={() => {
                  handleConfirmDelete();
                }}
              />,
              <Button type={"button"} size={"large"} variation={"primary"} label={t("NO")} title={t("NO")} onClick={handleCancelDelete} />,
            ]}
            sortFooterChildren={true}
            onClose={() => {
              setShowPopUp(false);
            }}
          ></PopUp>
        )}

        {formulasPopUP && (
          <PopUp
            className={"popUpClass new-assumption-pop"}
            type={"default"}
            heading={t("CONFIRM_NEW_FORMULA")}
            equalWidthButtons={true}
            children={[
              <LabelFieldPair className="new-assumption-pop">
                <span className="bold">{t(`SELECT_FORMULA`)}</span>
                <Dropdown
                  variant="select-dropdown"
                  t={t}
                  isMandatory={false}
                  // option={availableDeletedFormulas.map((item) => ({ code: item }))}
                  option={[
                    ...new Set(deletedFormulas?.filter((del) => allMdmsFormulasForThisCategory?.includes(del))),
                    ...defautFormula,
                  ]?.map((item) => ({ code: item }))}
                  select={(value) => {
                    setSelectedDeletedFormula(value);
                  }}
                  selected={selectedDeletedFormula}
                  optionKey="code"
                  showToolTip={true}
                  placeholder={t("SELECT_OPTION")}
                  onChange={(e) => setSelectedDeletedFormula(e.target.value)}
                />
              </LabelFieldPair>,
              selectedDeletedFormula?.code === "NEW_FORMULA" && (
                <LabelFieldPair className="new-assumption-pop">
                  <span className="bold">{t(`FORMULA_NAME`)}</span>
                  <TextInput
                    name="name"
                    value={selectedDeletedFormula?.name || ""}
                    onChange={(event) => handleUpdateField(event.target.value, "name")}
                  />
                </LabelFieldPair>
              ),
            ]}
            onOverlayClick={() => {
              setFormulasPopUp(false);
              setSelectedDeletedFormula(null);
            }}
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("CANCEL")}
                title={t("CANCEL")}
                onClick={() => {
                  setFormulasPopUp(false);
                  setSelectedDeletedFormula(null);
                }}
              />,
              <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("ADD")}
                title={t("ADD")}
                onClick={() => {
                  if(!selectedDeletedFormula){
                    setShowToast({
                      key: "error",
                      label: t("ERR_FORMULA_SELECT_OPTION"),
                      transitionTime: 3000,
                      style: {
                        zIndex: 1000000,
                      },
                    });
                    return;
                  }if(!selectedDeletedFormula?.name && selectedDeletedFormula?.code === "NEW_FORMULA"){
                    setShowToast({
                      key: "error",
                      label: t("ERR_FORMULA_ENTER_FORMULA_NAME"),
                      transitionTime: 3000,
                      style: {
                        zIndex: 1000000,
                      },
                    });
                    return;

                  }
                  if (selectedDeletedFormula?.code === "NEW_FORMULA" && !selectedDeletedFormula) {
                    setShowToast({
                      key: "error",
                      label: t("PLS_ENTER_FORMULA_NAME"),
                      transitionTime: 3000,
                      style: {
                        zIndex: 1000000,
                      },
                    });
                    return;
                  }

                  if (selectedDeletedFormula?.code === "NEW_FORMULA" && selectedDeletedFormula?.name?.trim()?.length === 0) {
                    setShowToast({
                      key: "error",
                      label: t("INVALID_FORMULA_NAME"),
                      transitionTime: 3000,
                      style: {
                        zIndex: 1000000,
                      },
                    });
                    return;
                  }
             
                  // if (selectedDeletedFormula?.code === "NEW_FORMULA" && !(selectedDeletedFormula?.name && /^(?=.*[a-zA-Z])[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(selectedDeletedFormula?.name))) {
                  //   setShowToast({
                  //     key: "error",
                  //     label: t("MP_FORMULA_NAME_INVALID") ,
                  //     transitionTime: 3000,
                  //     style: {
                  //       zIndex: 1000000
                  //     }
                  //   });
                  //   return
                  // }

                  if (selectedDeletedFormula?.code === "NEW_FORMULA" && selectedDeletedFormula?.name?.length > 100) {
                    setShowToast({
                      key: "error",
                      label: t("SELECT_FORMULA_NAME_LONG_THAN_100"),
                      transitionTime: 3000,
                      style: {
                        zIndex: 1000000,
                      },
                    });
                    return;
                  }
                  if (category !== "FORMULA_CAMPAIGN_VEHICLES" && filteredFormulas.some((i) => i.output === selectedDeletedFormula?.name)) {
                    setShowToast({
                      key: "error",
                      label: t("FORMULA_ALREADY_PRESENT"),
                      transitionTime: 3000,
                      style: {
                        zIndex: 1000000,
                      },
                    });
                    return;
                  }

                  addNewFormula();
                }}
              />,
            ]}
            sortFooterChildren={true}
            onClose={() => {
              setFormulasPopUp(false);
              setSelectedDeletedFormula(null);
            }}
          ></PopUp>
        )}
      </Card>
    </>
  );
};
export default FormulaConfiguration;
