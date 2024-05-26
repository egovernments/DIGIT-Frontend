import React, { useState, useEffect, useCallback, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Info, Trash } from "@egovernments/digit-ui-svg-components";
import { ModalWrapper } from "./Modal";
import { ButtonType1, CloseButton, ModalHeading } from "./CommonComponents";
import { Dropdown, Modal } from "@egovernments/digit-ui-components";
import { tourSteps } from "../configs/tourSteps";
import { useMyContext } from "../utils/context";
import { v4 as uuidv4 } from "uuid";
import { PlusWithSurroundingCircle } from "../icons/Svg";
import { PRIMARY_THEME_COLOR } from "../configs/constants";

const page = "ruleEngine";

const RuleEngine = ({ campaignType = "SMC", microplanData, setMicroplanData, checkDataCompletion, setCheckDataCompletion, currentPage, pages }) => {
  const { t } = useTranslation();

  // States
  const [editable, setEditable] = useState(true);
  const [modal, setModal] = useState("none");
  const [rules, setRules] = useState([]);
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [itemForDeletion, setItemForDeletion] = useState();
  const [exampleOption, setExampleOption] = useState("");
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [operators, setOperators] = useState([]);
  const [validationSchemas, setValidationSchemas] = useState([]);
  const [autofillData, setAutoFillData] = useState([]);
  const { state, dispatch } = useMyContext();

  // Set TourSteps
  useEffect(() => {
    const tourData = tourSteps(t)?.[page] || {};
    if (state?.tourStateData?.name === page) return;
    dispatch({
      type: "SETINITDATA",
      state: { tourStateData: tourData },
    });
  }, []);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (pages) {
      const previouspage = pages[currentPage?.id - 1];
      if (previouspage?.checkForCompleteness && !microplanData?.status?.[previouspage?.name]) setEditable(false);
      else setEditable(true);
    }
  }, []);

  // UseEffect for checking completeness of data before moveing to next section
  useEffect(() => {
    if (!rules || checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    // uncomment to activate data change save check
    // if (!microplanData?.ruleEngine || !_.isEqual(rules, microplanData.ruleEngine)) setModal("data-change-check");
    // else
    updateData(true);
  }, [checkDataCompletion]);

  // UseEffect to store current data
  useEffect(() => {
    if (!rules || !setMicroplanData) return;
    setMicroplanData((previous) => ({ ...previous, ruleEngine: rules }));
  }, [rules]);

  // UseEffect to add a event listener for keyboard
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modal]);

  const handleKeyPress = (event) => {
    // if (modal !== "upload-guidelines") return;
    if (["x", "Escape"].includes(event.key)) {
      // Perform the desired action when "x" or "esc" is pressed
      // if (modal === "upload-guidelines")
      setCheckDataCompletion("false");
      setModal("none");
    }
  };

  // check if data has changed or not
  const updateData = useCallback(
    (check) => {
      if (!rules || !setMicroplanData) return;
      if (check) {
        setMicroplanData((previous) => ({ ...previous, ruleEngine: rules }));
        let isValid = rules.every((item) => Object.values(item).every((data) => data !== ""));
        isValid = isValid && rules.length !== 0;
        if (isValid) setCheckDataCompletion("valid");
        else setCheckDataCompletion("invalid");
      } else {
        let isValid = microplanData?.ruleEngine?.every((item) => Object.values(item).every((data) => data !== ""));
        isValid = isValid && rules.length !== 0;
        if (isValid) setCheckDataCompletion("valid");
        else setCheckDataCompletion("invalid");
      }
    },
    [rules, setMicroplanData, microplanData, setCheckDataCompletion]
  );

  const cancelUpdateData = useCallback(() => {
    setCheckDataCompletion(false);
    setModal("none");
  }, [setCheckDataCompletion, setModal]);

  // useEffect to initialise the data from MDMS
  useEffect(() => {
    if (!state) return;
    let schemas = state?.Schemas;
    let hypothesisAssumptions = [];
    microplanData?.hypothesis?.forEach((item) => (item.key !== "" ? hypothesisAssumptions.push(item.key) : null));
    let ruleConfigureOutput = state?.RuleConfigureOutput;
    let UIConfiguration = state?.UIConfiguration;
    let ruleConfigureInputs = getRuleConfigInputsFromSchema(campaignType, microplanData, schemas) || [];
    let AutoFilledRuleConfigurationsList = state?.AutoFilledRuleConfigurations;
    AutoFilledRuleConfigurationsList = AutoFilledRuleConfigurationsList.find((item) => item.campaignType === campaignType)?.data;
    microplanData?.ruleEngine?.forEach((item) => {
      if (Object.values(item).every((e) => e != "")) ruleConfigureInputs.push(item?.output);
    });
    if (schemas) setValidationSchemas(schemas);

    let temp;
    setHypothesisAssumptionsList(hypothesisAssumptions);
    setExampleOption(hypothesisAssumptions.length ? hypothesisAssumptions[0] : "");
    let outputs;
    if (ruleConfigureOutput) temp = ruleConfigureOutput.find((item) => item.campaignType === campaignType);
    if (temp && temp.data) {
      let data = temp.data;
      microplanData?.ruleEngine?.forEach((item) => {
        data = data.filter((e) => e !== item?.output);
      });
      outputs = data;
      setOutputs(data);
    }

    if (ruleConfigureInputs) setInputs(ruleConfigureInputs);
    let operator;
    if (UIConfiguration) temp = UIConfiguration.find((item) => item.name === "ruleConfigure");
    if (temp && temp.ruleConfigureOperators) {
      temp = temp.ruleConfigureOperators.map((item) => item.name);
      operator = temp;
      setOperators(temp);
    }
    if (AutoFilledRuleConfigurationsList) setAutoFillData(AutoFilledRuleConfigurationsList);

    let filteredRules = [];
    if (microplanData && microplanData.ruleEngine && microplanData?.hypothesis) {
      const hypothesisAssumptions = microplanData?.hypothesis?.filter((item) => item.key !== "").map((item) => item.key) || [];
      if (hypothesisAssumptions.length !== 0) {
        setHypothesisAssumptionsList(hypothesisAssumptions);
        filteredRules = setRuleEngineDataFromSsn(microplanData.ruleEngine, hypothesisAssumptions, setRules);
      }
    }
    if (!AutoFilledRuleConfigurationsList || !outputs || !hypothesisAssumptions || !schemas) return;
    filteredRules = setAutoFillRules(
      AutoFilledRuleConfigurationsList,
      filteredRules,
      hypothesisAssumptions,
      outputs,
      operator,
      getRuleConfigInputsFromSchema(campaignType, microplanData, schemas),
      setInputs,
      setOutputs
    );
    if (filteredRules) setRules(filteredRules);
  }, []);

  const closeModal = useCallback(() => {
    setModal("none");
  }, [setModal]);

  // Function to Delete an assumption
  const deleteAssumptionHandlerCallback = useCallback(() => {
    deleteAssumptionHandler(itemForDeletion, setItemForDeletion, setRules, setOutputs, setInputs);
    closeModal();
  }, [itemForDeletion, deleteAssumptionHandler, setItemForDeletion, setRules, setOutputs, setInputs, closeModal]);

  const sectionClass = `jk-header-btn-wrapper rule-engine-section ${editable ? "" : "non-editable-component"}`;
  return (
    <>
      <div className={sectionClass}>
        <div className="rule-engine-body">
          {/* NonInterractable Section */}
          <NonInterractableSection t={t} />
          {/* Interractable Section that includes the example as well as the rules */}
          <InterractableSection
            rules={rules}
            setRules={setRules}
            hypothesisAssumptionsList={hypothesisAssumptionsList}
            setHypothesisAssumptionsList={setHypothesisAssumptionsList}
            setModal={setModal}
            setItemForDeletion={setItemForDeletion}
            exampleOption={exampleOption}
            inputs={inputs}
            setInputs={setInputs}
            outputs={outputs}
            setOutputs={setOutputs}
            operators={operators}
            setOperators={setOperators}
            t={t}
          />
          <button className="add-button" onClick={() => addRulesHandler(setRules)} aria-label="Add Rules" role="button">
            <PlusWithSurroundingCircle fill={PRIMARY_THEME_COLOR} width="1.05rem" height="1.05rem" />
            <p>{t("ADD_ROW")}</p>
          </button>
        </div>
        <RuleEngineInformation t={t} />
        {/* delete conformation */}
        {modal === "delete-conformation" && (
          <Modal
            popupStyles={{ borderRadius: "0.25rem", width: "31.188rem" }}
            popupModuleActionBarStyles={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-start",
              padding: 0,
              width: "100%",
              padding: "1rem",
            }}
            popupModuleMianStyles={{ padding: 0, margin: 0 }}
            style={{
              flex: 1,
              backgroundColor: "white",
              border: `0.063rem solid ${PRIMARY_THEME_COLOR}`,
            }}
            headerBarMainStyle={{ padding: 0, margin: 0 }}
            headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("HEADING_DELETE_FILE_CONFIRMATION")} />}
            actionCancelLabel={t("YES")}
            actionCancelOnSubmit={deleteAssumptionHandlerCallback}
            actionSaveLabel={t("NO")}
            actionSaveOnSubmit={closeModal}
          >
            <div className="modal-body">
              <p className="modal-main-body-p">{t("RULE_ENGINE_INSTRUCTIONS_DELETE_ENTRY_CONFIRMATION")}</p>
            </div>
          </Modal>
        )}
      </div>
      {/* // uncomment to activate data change save check
      {modal === "data-change-check" && (
        <Modal
          popupStyles={{ borderRadius: "0.25rem", width: "31.188rem" }}
          popupModuleActionBarStyles={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            padding: 0,
            width: "100%",
            padding: "0 0 1rem 1rem",
          }}
          popupModuleMianStyles={{ padding: 0, margin: 0 }}
          style={{
            flex: 1,
            backgroundColor: "white",
            border: `0.063rem solid ${PRIMARY_THEME_COLOR}`,
          }}
          headerBarMainStyle={{ padding: 0, margin: 0 }}
          headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("HEADING_DATA_WAS_UPDATED_WANT_TO_SAVE")} />}
          headerBarEnd={<CloseButton clickHandler={cancelUpdateData} style={{ padding: "0.4rem 0.8rem 0 0" }} />}
          actionCancelLabel={t("YES")}
          actionCancelOnSubmit={updateData.bind(null, true)}
          actionSaveLabel={t("NO")}
          actionSaveOnSubmit={() => updateData(false)}
        >
          <div className="modal-body">
            <p className="modal-main-body-p">{t("INSTRUCTION_DATA_WAS_UPDATED_WANT_TO_SAVE")}</p>
          </div>
        </Modal>
      )} */}
    </>
  );
};

const RuleEngineInformation = ({ t }) => {
  return (
    <div className="information">
      <div className="information-heading">
        <Info fill={"rgba(52, 152, 219, 1)"} />
        <p>{t("INFO")}</p>
      </div>
      <div className="information-description">
        <p>{t("RULE_ENGINE_INFORMATION_DESCRIPTION")}</p>
      </div>
    </div>
  );
};

// Function to add a new assumption
const addRulesHandler = (setRules) => {
  let uuid = uuidv4();
  setRules((previous) => [
    ...previous,
    {
      id: uuid,
      // previous.length ? previous[previous.length - 1].id + 1 : 0,
      output: "",
      input: "",
      operator: "",
      assumptionValue: "",
      active : true
    },
  ]);
};

// Defination for NonInterractable Section
const NonInterractableSection = React.memo(({ t }) => {
  return (
    <div>
      <h2 className="heading">{t("HEADING_RULE_ENGINE")}</h2>
      <p className="instruction">{t("INSTRUCTION_RULE_ENGINE")}</p>
    </div>
  );
});

// Defination for NonInterractable Section
const InterractableSection = React.memo(
  ({
    rules,
    setRules,
    hypothesisAssumptionsList,
    setHypothesisAssumptionsList,
    setModal,
    setItemForDeletion,
    exampleOption,
    inputs,
    outputs,
    operators,
    setInputs,
    setOutputs,
    setOperators,
    t,
  }) => {
    const itemRefs = useRef([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const scrollContainerRef = useRef(null);
    const [renderCycle, setRenderCycle] = useState(0);

    useEffect(() => {
      if (expandedIndex !== null) {
        setRenderCycle(0); // Reset render cycle count when expandedIndex changes
      }
    }, [expandedIndex]);

    useEffect(() => {    
      // Scroll to the expanded item after the state has updated and the DOM has re-rendered
      if (renderCycle < 3) {
        setRenderCycle(prev => prev + 1); // Increment render cycle count
      } else if (expandedIndex !== null && itemRefs.current[expandedIndex]) {
        try {
          const parentElement = itemRefs.current[expandedIndex];
          const childElement = itemRefs.current[expandedIndex].children[1]; 
          
          if (parentElement) {
            const scrollContainer = scrollContainerRef.current;
            const parentRect = parentElement.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            
            // Calculate the offset from the top of the container
            const offset = parentRect.top - containerRect.top;
            
            // Scroll the container
            scrollContainer.scrollTo({
              top: scrollContainer.scrollTop + offset - 10,
              behavior: 'smooth'
            });
          }
  
          if (childElement) {
            childElement.focus();
          }
        } catch (error) {
          console.error("Error scrolling to element:", error);
        }
      }
    }, [renderCycle,expandedIndex]);

    useEffect(() => {
      if (expandedIndex !== null) {
        const observer = new MutationObserver(() => {
          setRenderCycle((prev) => prev + 1); // Trigger render cycle when the DOM changes
        });
  
        if (itemRefs.current[expandedIndex]) {
          observer.observe(itemRefs.current[expandedIndex], { childList: true, subtree: true });
        }
  
        return () => observer.disconnect();
      }
    }, [expandedIndex]);

    const toggleExpand = (index) => {
      setExpandedIndex(index === expandedIndex ? null : index);
    };

    // Handler for deleting an assumption on conformation
    const deleteHandler = useCallback(
      (item) => {
        setModal("delete-conformation");
        setItemForDeletion(item);
      },
      [setModal, setItemForDeletion]
    );

    return (
      <div className="user-input-section"ref={scrollContainerRef}>
        <Example exampleOption={exampleOption} t={t} />
        <div className="interactable-section">
          <div className="headerbar">
            <div className="value-input-key">
              <p className="heading">{t("VALUE")}</p>
            </div>
            <div className="equal-to-icon invisible">=</div>
            <div className="value-input-key">
              <p className="heading">{t("RULE_ENGINE_INPUT")}</p>
            </div>
            <div className="operator">
              <p className="heading">{t("RULE_ENGINE_OPERATOR")}</p>
            </div>
            <div className="value-input-key">
              <p className="heading">{t("KEY")}</p>
            </div>
            <div className="invisible">
              <button className="delete-button invisible" onClick={() => deleteHandler(item)} aria-label={t("DELETE")} role="button">
                <div>
                  <Trash width={"0.8rem"} height={"1rem"} fill={PRIMARY_THEME_COLOR} />
                </div>
                <p>{t("DELETE")}</p>
              </button>
            </div>
          </div>
          {rules.filter(item=>item.active).map((item, index) => (
            <div
              key={index}
              className={`${index === 0 ? "select-and-input-wrapper-first" : "select-and-input-wrapper"}`}
              ref={(el) => (itemRefs.current[index] = el)}
              onClick={() => toggleExpand(index)}
            >
              <div key={item.id} className="value-input-key">
                <Select
                  key={item.id}
                  item={item}
                  rules={rules}
                  setRules={setRules}
                  options={outputs}
                  setOptions={setOutputs}
                  toChange={"output"}
                  unique={true}
                  setInputs={setInputs}
                  t={t}
                />
              </div>

              <div className="equal-to-icon">=</div>

              <div className="value-input-key input">
                <Select
                  key={item.id}
                  item={item}
                  rules={rules}
                  setRules={setRules}
                  options={inputs}
                  setOptions={setInputs}
                  toChange={"input"}
                  unique={false}
                  setInputs={setInputs}
                  outputs={outputs}
                  t={t}
                />
              </div>
              <div className="operator">
                <Select
                  key={item.id}
                  item={item}
                  rules={rules}
                  setRules={setRules}
                  options={operators}
                  setOptions={setOperators}
                  toChange={"operator"}
                  unique={false}
                  setInputs={setInputs}
                  t={t}
                />
              </div>
              <div className="value-input-key">
                <Select
                  key={item.id}
                  item={item}
                  rules={rules}
                  setRules={setRules}
                  options={hypothesisAssumptionsList}
                  setOptions={setHypothesisAssumptionsList}
                  toChange={"assumptionValue"}
                  unique={false}
                  setInputs={setInputs}
                  t={t}
                />
              </div>
              <div>
                <button className="delete-button" onClick={() => deleteHandler(item)} aria-label={t("DELETE")} role="button">
                  <div>
                    <Trash width={"0.8rem"} height={"1rem"} fill={PRIMARY_THEME_COLOR} />
                  </div>
                  <p>{t("DELETE")}</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const Example = ({ exampleOption, t }) => {
  return (
    <div className="example">
      <p className="heading">{t("EXAMPLE")}</p>
      <div className="example-body">
        <div className="value-input-key">
          <p className="heading">{t("VALUE")}</p>
          <Dropdown
            variant="select-dropdown"
            t={t}
            isMandatory={false}
            option={[]}
            selected={null}
            optionKey="code"
            placeholder={t("SELECT_OPTION")}
          />
          <p className="heading">{t("RULE_ENGINE_VALUE_HELP_TEXT")}</p>
        </div>

        <div className="equal-to-icon">
          <p className="heading invisible">{"="}</p>

          <div className="equal-to-icon">=</div>
          <p className="heading invisible">{"="}</p>
        </div>

        <div className="value-input-key">
          <p className="heading">{t("RULE_ENGINE_INPUT")}</p>
          <Dropdown
            variant="select-dropdown"
            t={t}
            isMandatory={false}
            option={[]}
            selected={null}
            optionKey="code"
            placeholder={t("SELECT_OPTION")}
          />
          <p className="heading">{t("RULE_ENGINE_INPUT_HELP_TEXT")}</p>
        </div>
        <div className="operator">
          <p className="heading">{t("RULE_ENGINE_OPERATOR")}</p>
          <Dropdown
            variant="select-dropdown"
            t={t}
            isMandatory={false}
            option={[]}
            selected={null}
            optionKey="code"
            placeholder={t("SELECT_OPTION")}
          />
          <p className="heading">{t("RULE_ENGINE_OPERATOR_HELP_TEXT")}</p>
        </div>
        <div className="value-input-key">
          <p className="heading">{t("KEY")}</p>
          <Dropdown
            variant="select-dropdown"
            t={t}
            isMandatory={false}
            option={[]}
            selected={null}
            optionKey="code"
            placeholder={t("SELECT_OPTION")}
          />
          <p className="heading">{t("RULE_ENGINE_KEY_HELP_TEXT")}</p>
        </div>
      </div>
    </div>
  );
};

const deleteAssumptionHandler = (item, setItemForDeletion, setRules, setOutputs, setInputs) => {
  setRules((previous) => {
    if (!previous.length) return [];
    const filteredData = previous.filter((data) => data.id !== item.id);
    return filteredData || [];
  });
  if (item && item.output) {
    setOutputs((previous) => {
      if (!previous.includes(item.output)) return [...previous, item.output];
    });
    setInputs((previous) => {
      return previous.filter((e) => e !== item.output);
    });
  }
  setItemForDeletion();
};

const Select = React.memo(({ item, rules, setRules, disabled = false, options, setOptions, toChange, unique, setInputs, outputs, t }) => {
  const [selected, setSelected] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if (item) {
      if (outputs && outputs.some((e) => e === item?.input)) {
        if (rules.some((e) => e?.output === item?.input)) setSelected({ code: item[toChange] });
      } else setSelected({ code: item[toChange] });
    }
  }, [item]);

  useEffect(() => {
    if (!options) return;
    let filteredOptions = options.length ? options : [];
    let filteredOptionPlaceHolder = [];
    if (item && item[toChange] && !filteredOptions.includes(item[toChange])) {
      filteredOptionPlaceHolder = [item[toChange], ...filteredOptions];
    } else filteredOptionPlaceHolder = filteredOptions;

    if (toChange === "input") {
      filteredOptionPlaceHolder = filteredOptionPlaceHolder.filter((data) => data !== item.output);
    }
    setFilteredOptions(filteredOptionPlaceHolder);
  }, [options]);

  const selectChangeHandler = useCallback(
    (e) => {
      if (e.code === "SELECT_OPTION") return;
      const existingEntry = rules.find((item) => item[toChange] === e.code);
      if (existingEntry && unique) return;
      const newDataSegment = { ...item };
      newDataSegment[toChange] = e.code;
      setRules((previous) => {
        let filteredAssumptionsList = previous.map((data) => {
          if (data.id === item.id) return newDataSegment;
          return data;
        });
        return filteredAssumptionsList;
      });
      if (typeof setInputs === "function") {
        setInputs((previous) => {
          let temp = _.cloneDeep(previous);
          if (toChange === "output") {
            temp = temp.filter((item) => item !== selected?.code);
          }
          if (Object.values(newDataSegment).every((item) => item != "")) temp = [...temp, newDataSegment.output];
          return temp;
        });
      }
      if (unique)
        setOptions((previous) => {
          let newOptions = previous.filter((item) => item !== e.code);
          if (selected?.code && !newOptions.includes(selected?.code)) newOptions.unshift(selected?.code);
          return newOptions;
        });
    },
    [rules, item, selected, setRules, setOptions, setInputs]
  );

  return (
    // <select value={selected} onChange={selectChangeHandler} disabled={disabled}>
    //   <option value="" disabled>
    //     {t("SELECT_OPTION")}
    //   </option>
    //   {filteredOptions.map((item, index) => (
    //     <option key={item} id={index} value={item}>
    //       {t(item)}
    //     </option>
    //   ))}
    // </select>
    <Dropdown
      variant="select-dropdown"
      t={t}
      isMandatory={false}
      option={filteredOptions.map((item) => ({ code: item }))}
      selected={selected}
      select={selectChangeHandler}
      optionKey="code"
      placeholder={t("SELECT_OPTION")}
    />
  );
});

// get schema for validation
const getRuleConfigInputsFromSchema = (campaignType, microplanData, schemas) => {
  if (!schemas || !microplanData || !microplanData?.upload || !campaignType) return [];
  let sortData = [];
  if (!schemas) return;
  microplanData?.upload
    ?.filter((value) => value?.error === null)
    .forEach((value) => {
      sortData.push({ section:value?.section, fileType: value?.fileType });
    });
  const filteredSchemas =
    schemas?.filter((schema) => {
      if (schema.campaignType) {
        return schema.campaignType === campaignType && sortData.some((entry) => entry.section === schema.section && entry.fileType === schema.type);
      } else {
        return sortData.some((entry) => entry.section === schema.section && entry.fileType === schema.type);
      }
    }) || [];
  const finalData = filteredSchemas
    ?.map((item) =>
      Object.entries(item?.schema?.Properties || {}).reduce((acc, [key, value]) => {
        if (value?.isRuleConfigureInputs) {
          acc.push(key);
        }
        return acc;
      }, [])
    )
    .flatMap((item) => item)
    .filter((item) => !!item);
  return [...new Set(finalData)];
};

// This function adding the rules configures in MDMS with respect to the canpaign when rule section is empty
const setAutoFillRules = (autofillData, rules, hypothesisAssumptionsList, outputs, operators, inputs, setInputs, setOutputs) => {
  if (rules && rules.length !== 0) return rules;
  let newRules = [];
  const ruleOuputList = rules ? rules.map((item) => item?.output) : [];
  let rulePlusInputs;
  if (ruleOuputList) rulePlusInputs = [...inputs, ...ruleOuputList];
  else rulePlusInputs = inputs;
  autofillData.forEach((item) => {
    if (
      ruleOuputList?.includes(item?.output) ||
      !outputs?.includes(item?.output) ||
      !rulePlusInputs.includes(item?.input) ||
      !operators?.includes(item?.operator) ||
      !hypothesisAssumptionsList?.includes(item?.assumptionValue)
    )
      return;
    if (!item["id"]) {
      let uuid = uuidv4();
      item["id"] = uuid;
    }
      item.active = true;
    newRules.push(item);
    rulePlusInputs?.push(item?.output);
    ruleOuputList?.push(item?.output);
  });
  if (newRules.length !== 0) {
    let newOutputs = [];
    outputs.forEach((e) => {
      if (!ruleOuputList.includes(e)) {
        newOutputs.push(e);
      }
    });
    setOutputs(newOutputs);
    setInputs(rulePlusInputs);
    // setRules((previous) => [...previous, ...newRules]);
    return newRules;
  }
};

const setRuleEngineDataFromSsn = (rules, hypothesisAssumptions) => {
  if (rules && rules.length === 0) return;
  let newRules = [];
  let outputs = [];
  rules.forEach((item, index) => {
    if (!hypothesisAssumptions?.includes(item?.assumptionValue)) return;
    if (!item["id"]) {
      let uuid = uuidv4();
      item["id"] = uuid;
    }
    newRules.push(item);
    outputs.push(item.output);
  });
  // let filteredRules = [];
  // newRules.forEach((item) => {
  //   // if (!outputs?.includes(item?.input)) return;
  //   item["id"] = newRules.length;
  //   filteredRules.push(item);
  // });
  return newRules;
};
export default RuleEngine;
