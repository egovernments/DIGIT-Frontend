import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Info, Trash } from "@egovernments/digit-ui-svg-components";
import { ModalWrapper } from "../../components/Modal";
import { ButtonType1, ModalHeading } from "../../components/ComonComponents";

const initialRules = [
  {
    id: 0,
    output: "",
    input: "",
    operator: "",
    assumptionValue: "",
  },
  {
    id: 1,
    output: "",
    input: "",
    operator: "",
    assumptionValue: "",
  },
];

const RuleEngine = ({ campaignType = "SMC", microplanData, setMicroplanData, checkDataCompletion, setCheckDataCompletion,  currentPage, pages, }) => {
  const { t } = useTranslation();

  // States
  const [editable, setEditable] = useState(true);
  const [modal, setModal] = useState("none");
  const [rules, setRules] = useState(initialRules);
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [itemForDeletion, setItemForDeletion] = useState();
  const [exampleOption, setExampleOption] = useState("");
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [operators, setOperators] = useState([]);

  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [
    { name: "UIConfiguration" },
    { name: "RuleConfigureInputs" },
    { name: "RuleConfigureOutput" },
    // { name: "HypothesisAssumptions" },
  ]);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (!microplanData || !microplanData.ruleEngine) return;
    let hypothesisAssumptions = [];
    microplanData?.hypothesis?.forEach((item) => (item.key !== "" ? hypothesisAssumptions.push(item.key) : null));
    if (!hypothesisAssumptions) return;
    setHypothesisAssumptionsList(hypothesisAssumptions);
    setRules(microplanData.ruleEngine);

    if (!pages) return;
    const previouspage = pages[currentPage?.id - 1];
    if (previouspage?.checkForCompleteness && !microplanData?.status[previouspage?.name]) setEditable(false);
    else setEditable(true);
  }, []);

  // UseEffect for checking completeness of data before moveing to next section
  useEffect(() => {
    if (!rules || checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    let check = rules.every((item) => Object.values(item).every((data) => data !== ""));
    check = check && rules.length !== 0;
    if (check) setCheckDataCompletion("valid");
    else setCheckDataCompletion("invalid");
  }, [checkDataCompletion]);

  // UseEffect to store current data
  useEffect(() => {
    if (!rules || !setMicroplanData) return;
    setMicroplanData((previous) => ({ ...previous, ruleEngine: rules }));
  }, [rules]);

  // useEffect to initialise the data from MDMS
  useEffect(() => {
    if (!data || !data["hcm-microplanning"]) return;
    // let hypothesisAssumptions = data["hcm-microplanning"]["HypothesisAssumptions"];
    let hypothesisAssumptions = [];
    microplanData?.hypothesis?.forEach((item) => (item.key !== "" ? hypothesisAssumptions.push(item.key) : null));
    let ruleConfigureOutput = data["hcm-microplanning"]["RuleConfigureOutput"];
    let ruleConfigureInputs = data["hcm-microplanning"]["RuleConfigureInputs"];
    let UIConfiguration = data["hcm-microplanning"]["UIConfiguration"];
    if (!hypothesisAssumptions) return;
    if (!ruleConfigureOutput) return;
    if (!ruleConfigureInputs) return;
    if (!UIConfiguration) return;

    let temp;
    // let temp = hypothesisAssumptions.find((item) => item.campaignType === campaignType);
    // if (!(temp && temp.assumptions)) return;
    setHypothesisAssumptionsList(hypothesisAssumptions);
    setExampleOption(hypothesisAssumptions.length ? hypothesisAssumptions[0] : "");

    if (ruleConfigureOutput) temp = ruleConfigureOutput.find((item) => item.campaignType === campaignType);
    if (!(temp && temp.data)) return;
    setOutputs(temp.data);

    if (ruleConfigureInputs) temp = ruleConfigureInputs.find((item) => item.campaignType === campaignType);
    if (!(temp && temp.data)) return;
    setInputs(temp.data);

    if (UIConfiguration) temp = UIConfiguration.find((item) => item.name === "ruleConfigure");
    if (!(temp && temp.ruleConfigureOperators)) return;
    temp = temp.ruleConfigureOperators.map((item) => item.name);
    setOperators(temp);
  }, [data]);

  const closeModal = useCallback(() => {
    setModal("none");
  }, [data]);

  // Function to Delete an assumption
  const deleteAssumptionHandlerCallback = useCallback(() => {
    deleteAssumptionHandler(itemForDeletion, setItemForDeletion, setRules, setHypothesisAssumptionsList);
    closeModal();
  }, [itemForDeletion, deleteAssumptionHandler, setItemForDeletion, setRules, setHypothesisAssumptionsList, closeModal]);

  return (
    <div className={`jk-header-btn-wrapper rule-engine-section ${editable?"":"non-editable-component"}`}>
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
        <button className="add-button" onClick={() => addAssumptionsHandler(setRules)}>
          <div className="add-icon">
            <p>+</p>
          </div>
          <p>{t("ADD_ROW")}</p>
        </button>
      </div>
      <RuleEngineInformation t={t} />
      {/* delete conformation */}
      {modal === "delete-conformation" && (
        <ModalWrapper
          closeModal={closeModal}
          LeftButtonHandler={deleteAssumptionHandlerCallback}
          RightButtonHandler={closeModal}
          footerLeftButtonBody={<ButtonType1 text={t("YES")} />}
          footerRightButtonBody={<ButtonType1 text={t("NO")} />}
          header={<ModalHeading label={t("HEADING_DELETE_FILE_CONFIRMATION")} />}
          bodyText={t("RULE_ENGINE_INSTRUCTIONS_DELETE_ENTRY_CONFIRMATION")}
        />
      )}
    </div>
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
const addAssumptionsHandler = (setRules) => {
  setRules((previous) => [
    ...previous,
    {
      id: previous.length ? previous[previous.length - 1].id + 1 : 0,
      key: "",
      value: "",
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
    // Handler for deleting an assumption on conformation
    const deleteHandler = useCallback(
      (item) => {
        setModal("delete-conformation");
        setItemForDeletion(item);
      },
      [setModal, setItemForDeletion]
    );

    return (
      <div className="user-input-section">
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
              <button className="delete-button invisible" onClick={() => deleteHandler(item)}>
                <Trash width={"0.8rem"} height={"1rem"} fill={"rgba(244, 119, 56, 1)"} />
                <p>{t("DELETE")}</p>
              </button>
            </div>
          </div>
          {rules.map((item, index) => (
            <div key={index} className={`${index === 0 ? "select-and-input-wrapper-first" : "select-and-input-wrapper"}`}>
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
                  t={t}
                />
              </div>

              <div className="equal-to-icon">=</div>

              <div className="value-input-key">
                <Select
                  key={item.id}
                  item={item}
                  rules={rules}
                  setRules={setRules}
                  options={inputs}
                  setOptions={setInputs}
                  toChange={"input"}
                  unique={true}
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
                  unique={true}
                  t={t}
                />
              </div>
              <div>
                <button className="delete-button" onClick={() => deleteHandler(item)}>
                  <Trash width={"0.8rem"} height={"1rem"} fill={"rgba(244, 119, 56, 1)"} />
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
          <select value={exampleOption} disabled>
            {/* <option value={exampleOption} disabled>
              {t(exampleOption)}
            </option> */}
            {/* {hypothesisAssumptionsList.map((item, index) => (
              <option key={item} id={index} value={item}>
                {t(item)}
              </option>
            ))} */}
          </select>
          <p className="heading">{t(" ")}</p>
        </div>

        <div className="equal-to-icon">
          <p className="heading invisible">{"="}</p>

          <div className="equal-to-icon">=</div>
          <p className="heading invisible">{"="}</p>
        </div>

        <div className="value-input-key">
          <p className="heading">{t("RULE_ENGINE_INPUT")}</p>
          <select value={exampleOption} disabled>
            {/* <option value={exampleOption} disabled>
              {t(exampleOption)}
            </option> */}
            {/* {hypothesisAssumptionsList.map((item, index) => (
              <option key={item} id={index} value={item}>
                {t(item)}
              </option>
            ))} */}
          </select>
          <p className="heading">{t("RULE_ENGINE_INPUT_HELP_TEXT")}</p>
        </div>
        <div className="operator">
          <p className="heading">{t("RULE_ENGINE_OPERATOR")}</p>
          <select value={exampleOption} disabled>
            {/* <option value={exampleOption} disabled>
              {t(exampleOption)}
            </option> */}
            {/* {hypothesisAssumptionsList.map((item, index) => (
              <option key={item} id={index} value={item}>
                {t(item)}
              </option>
            ))} */}
          </select>
          <p className="heading">{t("RULE_ENGINE_OPERATOR_HELP_TEXT")}</p>
        </div>
        <div className="value-input-key">
          <p className="heading">{t("KEY")}</p>
          <select value={exampleOption} disabled>
            {/* <option value={exampleOption} disabled>
              {t(exampleOption)}
            </option> */}
            {/* {hypothesisAssumptionsList.map((item, index) => (
              <option key={item} id={index} value={item}>
                {t(item)}
              </option>
            ))} */}
          </select>
          <p className="heading">{t("RULE_ENGINE_KEY_HELP_TEXT")}</p>
        </div>
      </div>
    </div>
  );
};

const deleteAssumptionHandler = (item, setItemForDeletion, setRules, setHypothesisAssumptionsList, unique) => {
  setRules((previous) => {
    if (!previous.length) return [];
    const filteredData = previous.filter((data) => data.id !== item.id);
    return filteredData || [];
  });
  if (item && item.key)
    setHypothesisAssumptionsList((previous) => {
      if (!previous.includes(item.key)) return [...previous, item.key];
      return previous;
    });
  setItemForDeletion();
};

const Select = React.memo(({ item, rules, setRules, disabled = false, options, setOptions, toChange, unique, t }) => {
  const [selected, setSelected] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if (item) setSelected(item[toChange]);
  }, [item]);

  useEffect(() => {
    if (!options) return;
    const filteredOptions = options.length ? options : [t("SELECT_OPTION")];
    if (item && item[toChange] && !filteredOptions.includes(item[toChange])) {
      setFilteredOptions([item[toChange], ...filteredOptions]);
    } else setFilteredOptions(filteredOptions);
  }, [options]);

  const selectChangeHandler = useCallback(
    (e) => {
      const existingEntry = rules.find((item) => item[toChange] === e.target.value);
      if (existingEntry && unique) return;
      const newDataSegment = { ...item };
      newDataSegment[toChange] = e.target.value;
      setRules((previous) => {
        let filteredAssumptionsList = previous.map((data) => {
          if (data.id === item.id) return newDataSegment;
          return data;
        });
        return filteredAssumptionsList;
      });
      if (unique)
        setOptions((previous) => {
          let newOptions = previous.filter((item) => item !== e.target.value);
          if (selected && !newOptions.includes(selected)) newOptions.unshift(selected);
          return newOptions;
        });
    },
    [rules, item, selected, setRules, setOptions]
  );

  return (
    <select value={selected} onChange={selectChangeHandler} disabled={disabled}>
      <option value="" disabled>
        {t("SELECT_OPTION")}
      </option>
      {filteredOptions.map((item, index) => (
        <option key={item} id={index} value={item}>
          {t(item)}
        </option>
      ))}
    </select>
  );
});

export default RuleEngine;
