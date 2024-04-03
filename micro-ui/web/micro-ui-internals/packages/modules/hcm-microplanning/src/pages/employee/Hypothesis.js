import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Trash } from "@egovernments/digit-ui-svg-components";
import { ModalWrapper } from "../../components/Modal";
import { ButtonType1, ButtonType2, ModalHeading } from "../../components/ComonComponents";

const initialAssumptions = [
  {
    id: 0,
    key: "",
    value: "",
  },
  {
    id: 1,
    key: "",
    value: "",
  },
];

const Hypothesis = ({ campaignType = "SMC" }) => {
  const { t } = useTranslation();

  // States
  const [modal, setModal] = useState("none");
  const [assumptions, setAssumptions] = useState(initialAssumptions);
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [itemForDeletion, setItemForDeletion] = useState();
  const [exampleOption, setExampleOption] = useState("");

    // Fetching data using custom MDMS hook
    const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [
      { name: "hypothesisAssumptions" },
    ]);

  // useEffect to initialise the data from MDMS
  useEffect(() => {
    if(!data || !data["hcm-microplanning"]) return;
    let hypothesisAssumptions = data["hcm-microplanning"]["hypothesisAssumptions"];
    if (!hypothesisAssumptions) return;

    const temp = hypothesisAssumptions.find((item) => item.campaignType === campaignType);
    if (!(temp && temp.assumptions)) return;

    setHypothesisAssumptionsList(temp.assumptions);
    setExampleOption(temp.assumptions.length ? temp.assumptions[0] : "");
  }, [data]);

  const closeModal = useCallback(() => {
    setModal("none");
  }, []);

  // Function to Delete an assumption
  const deleteAssumptionHandlerCallback = useCallback(() => {
    deleteAssumptionHandler(itemForDeletion, setItemForDeletion, setAssumptions, setHypothesisAssumptionsList);
    closeModal();
  }, [itemForDeletion, deleteAssumptionHandler, setItemForDeletion, setAssumptions, setHypothesisAssumptionsList, closeModal]);

  return (
    <div className="jk-header-btn-wrapper hypothesis-section">
      {/* NonInterractable Section */}
      <NonInterractableSection t={t} />
      {/* Interractable Section that includes the example as well as the assumptions */}
      <InterractableSection
        assumptions={assumptions}
        setAssumptions={setAssumptions}
        hypothesisAssumptionsList={hypothesisAssumptionsList}
        setHypothesisAssumptionsList={setHypothesisAssumptionsList}
        setModal={setModal}
        setItemForDeletion={setItemForDeletion}
        exampleOption={exampleOption}
        t={t}
      />
      <button className="add-button" onClick={() => addAssumptionsHandler(setAssumptions)}>
        <div className="add-icon"><p>+</p></div>
        <p>{t("ADD_ROW")}</p>
      </button>
      {/* delete conformation */}
      {modal === "delete-conformation" && (
        <ModalWrapper
          closeModal={closeModal}
          LeftButtonHandler={deleteAssumptionHandlerCallback}
          RightButtonHandler={closeModal}
          footerLeftButtonBody={<ButtonType1 text={t("YES")} />}
          footerRightButtonBody={<ButtonType2 text={t("NO")} />}
          header={<ModalHeading label={t("HEADING_DELETE_FILE_CONFIRMATION")} />}
          bodyText={t("HYPOTHESIS_INSTRUCTIONS_DELETE_ENTRY_CONFIRMATION")}
        />
      )}
    </div>
  );
};

// Function to add a new assumption
const addAssumptionsHandler = (setAssumptions) => {
  setAssumptions((previous) => [
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
      <h2 className="heading">{t("HEADING_HYPOTHESIS")}</h2>
      <p className="instruction">{t("INSTRUCTION_HYPOTHESIS")}</p>
    </div>
  );
});

// Defination for NonInterractable Section
const InterractableSection = React.memo(
  ({ assumptions, setAssumptions, hypothesisAssumptionsList, setHypothesisAssumptionsList, setModal, setItemForDeletion, exampleOption, t }) => {
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
            <div className="key">
              <p className="heading" >{t("KEY")}</p>
            </div>
            <div className="value">
              <p className="heading">{t("VALUE")}</p>
            </div>
            <div className="invisible">
              <button className="delete-button invisible" onClick={() => deleteHandler(item)}>
                <Trash width={"0.8rem"} height={"1rem"} fill={"rgba(244, 119, 56, 1)"} />
                <p>{t("DELETE")}</p>
              </button>
            </div>
          </div>
          {assumptions.map((item,index) => (
            <div className={`${index === 0?"select-and-input-wrapper-first":"select-and-input-wrapper" }`}>
              <div className="key">
                <Select
                  key={item.id}
                  item={item}
                  assumptions={assumptions}
                  setAssumptions={setAssumptions}
                  options={hypothesisAssumptionsList}
                  setOptions={setHypothesisAssumptionsList}
                  t={t}
                />
              </div>
              <div className="value">
                <Input key={item.id} item={item} assumptions={assumptions} setAssumptions={setAssumptions} />
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
        <div className="key">
          <p className="heading">{t("KEY")}</p>
          <select value={exampleOption} disabled>
            <option value={exampleOption} disabled>
              {t(exampleOption)}
            </option>
            {/* {hypothesisAssumptionsList.map((item, index) => (
              <option key={item} id={index} value={item}>
                {t(item)}
              </option>
            ))} */}
          </select>
          <p className="heading">{t("HYPOTHESIS_KEY_HELP_TEXT")}</p>
        </div>
        <div className="value">
          <p className="heading">{t("VALUE")}</p>
          <input disabled />
          <p className="heading">{t("HYPOTHESIS_VALUE_HELP_TEXT")}</p>
        </div>
      </div>
    </div>
  );
};

const deleteAssumptionHandler = (item, setItemForDeletion, setAssumptions, setHypothesisAssumptionsList) => {
  setAssumptions((previous) => {
    if (!previous.length) return [];
    const filteredData = previous.filter((data) => data.id !== item.id);
    return filteredData || [];
  });
  if (item && item.key)
    setHypothesisAssumptionsList((previous) => {
      if (!previous.includes(item.key)) return [...previous, item.key];
      return previous; // Return previous array if key already exists
    });
  setItemForDeletion();
};

const Select = React.memo(({ item, assumptions, setAssumptions, disabled = false, options, setOptions, t }) => {
  const [selected, setSelected] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if (item) setSelected(item.key);
  }, [item]);

  useEffect(() => {
    if (!options) return;
    const filteredOptions = options.length ? options : [t("SELECT_OPTION")];
    if (item && item.key && !filteredOptions.includes(item.key)) {
      setFilteredOptions([item.key, ...filteredOptions]);
    } else setFilteredOptions(filteredOptions);
  }, [options]);

  const selectChangeHandler = useCallback(
    (e) => {
      const existingEntry = assumptions.find((item) => item.key === e.target.value);
      if (existingEntry) return;
      const newDataSegment = {
        id: item.id,
        key: e.target.value,
        value: item.value,
      };
      setAssumptions((previous) => {
        let filteredAssumptionsList = previous.map((data) => {
          if (data.id === item.id) return newDataSegment;
          return data;
        });
        return filteredAssumptionsList;
      });

      setOptions((previous) => {
        let newOptions = previous.filter((item) => item !== e.target.value);
        if (selected && !newOptions.includes(selected)) newOptions.unshift(selected);
        return newOptions;
      });
    },
    [assumptions, item, selected, setAssumptions, setOptions]
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

const Input = React.memo(({ item, setAssumptions, disabled = false }) => {
  const [inputValue, setInputValue] = useState("");

  const inputChangeHandler = useCallback(
    (e) => {
      if ((e.target.value <= 0 || e.target.value / 1000 >= 1) && e.target.value !== "") return;
      let value;
      const decimalIndex = e.target.value.indexOf(".");
      if (decimalIndex !== -1) {
        const numDecimals = e.target.value.length - decimalIndex - 1;
        if (numDecimals > 2) {
          value = parseFloat(e.target.value.substring(0, decimalIndex + 3));
        } else {
          value = parseFloat(e.target.value);
        }
      } else value = parseFloat(e.target.value);

      setInputValue(!isNaN(value) ? value : "");
      const newDataSegment = {
        id: item.id,
        key: item.key,
        value: !isNaN(value) ? value : "",
      };
      setAssumptions((previous) => {
        let filteredAssumptionsList = previous.map((data) => {
          if (data.id === item.id) {
            return newDataSegment;
          }
          return data;
        });
        return filteredAssumptionsList;
      });
    },
    [item, setAssumptions]
  );

  return <input type="number" step="0.01" value={inputValue} onChange={inputChangeHandler} disabled={disabled} />;
});

export default Hypothesis;

