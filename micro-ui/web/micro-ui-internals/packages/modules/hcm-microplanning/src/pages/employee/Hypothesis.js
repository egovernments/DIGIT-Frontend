import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Trash } from "@egovernments/digit-ui-svg-components";
import { ModalWrapper } from "../../components/Modal";
import { ButtonType1, ButtonType2, ModalHeading } from "../../components/CommonComponents";
import { Modal, Toast } from "@egovernments/digit-ui-components";
import { useMyContext } from "../../utils/context";
import { tourSteps } from "../../configs/tourSteps";

const page = "hypothesis";

const Hypothesis = ({ campaignType = "SMC", microplanData, setMicroplanData, checkDataCompletion, setCheckDataCompletion, currentPage, pages }) => {
  const { t } = useTranslation();

  // States
  const [editable, setEditable] = useState(true);
  const [modal, setModal] = useState("none");
  const [assumptions, setAssumptions] = useState([]);
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [itemForDeletion, setItemForDeletion] = useState();
  const [exampleOption, setExampleOption] = useState("");
  const [toast, setToast] = useState();
  const [autofillHypothesis, setAutofillHypothesis] = useState([]);
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
    if (microplanData && microplanData.hypothesis) {
      setAssumptions(microplanData.hypothesis);
    }
    let hypothesisAssumptionsList = state?.HypothesisAssumptions?.find((item) => item.campaignType === campaignType)?.assumptions;
    setAutofillHypothesisData(hypothesisAssumptionsList, microplanData?.hypothesis ? microplanData?.hypothesis : assumptions, setAssumptions);
  }, []);

  // UseEffect for checking completeness of data before moveing to next section
  useEffect(() => {
    if (!assumptions || checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    if (!microplanData?.hypothesis || !_.isEqual(assumptions, microplanData.hypothesis)) setModal("data-change-check");
    else updateData();
  }, [checkDataCompletion]);

  // // UseEffect to store current data
  // useEffect(() => {
  //   if (!assumptions || !setMicroplanData) return;
  //   setMicroplanData((previous) => ({ ...previous, hypothesis: assumptions }));
  // }, [assumptions]);

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
  const updateData = () => {
    if (!assumptions || !setMicroplanData) return;
    setMicroplanData((previous) => ({ ...previous, hypothesis: assumptions }));
    let check = assumptions.every((item) => Object.values(item).every((data) => data !== ""));
    check = check && assumptions.length !== 0;
    if (check) setCheckDataCompletion("valid");
    else setCheckDataCompletion("invalid");
  };
  const cancelUpdateData = () => {
    setCheckDataCompletion("false");
    setModal("none");
  };

  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "HypothesisAssumptions" }]);

  // useEffect to initialise the data from MDMS
  useEffect(() => {
    if (!data || !data["hcm-microplanning"]) return;
    let hypothesisAssumptions = state?.HypothesisAssumptions;
    if (!hypothesisAssumptions) return;
    const temp = hypothesisAssumptions.find((item) => item.campaignType === campaignType);
    if (!(temp && temp.assumptions)) return;
    setHypothesisAssumptionsList(temp.assumptions);
    setAutofillHypothesis(temp.assumptions);
    setExampleOption(temp.assumptions.length ? temp.assumptions[0] : "");
  }, [data]);

  // useEffect(()=>{
  // if(!autofillHypothesis) return;
  // setAutofillHypothesisData(autofillHypothesis, assumptions, setAssumptions)
  // },[autofillHypothesis])

  const closeModal = useCallback(() => {
    setModal("none");
  }, []);

  // Function to Delete an assumption
  const deleteAssumptionHandlerCallback = useCallback(() => {
    deleteAssumptionHandler(itemForDeletion, setItemForDeletion, setAssumptions, setHypothesisAssumptionsList, setToast, t);
    closeModal();
  }, [itemForDeletion, deleteAssumptionHandler, setItemForDeletion, setAssumptions, setHypothesisAssumptionsList, closeModal, setToast, t]);

  const sectionClass = `jk-header-btn-wrapper hypothesis-section ${editable ? "" : "non-editable-component"}`;
  return (
    <>
      <div className={sectionClass}>
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
          <div className="add-icon">
            <p>+</p>
          </div>
          <p>{t("ADD_ROW")}</p>
        </button>
        {/* delete conformation */}
        {modal === "delete-conformation" && (
          <Modal
            popupStyles={{ width: "fit-content", borderRadius: "0.25rem" }}
            popupModuleActionBarStyles={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-start",
              padding: 0,
              width: "100%",
              padding: "1rem",
            }}
            popupModuleMianStyles={{ padding: 0, margin: 0, maxWidth: "31.188rem" }}
            style={{
              flex: 1,
              backgroundColor: "white",
              border: "0.063rem solid rgba(244, 119, 56, 1)",
            }}
            headerBarMainStyle={{ padding: 0, margin: 0 }}
            headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("HEADING_DELETE_FILE_CONFIRMATION")} />}
            actionCancelLabel={t("YES")}
            actionCancelOnSubmit={deleteAssumptionHandlerCallback}
            actionSaveLabel={t("NO")}
            actionSaveOnSubmit={closeModal}
          >
            <div className="modal-body">
              <p className="modal-main-body-p">{t("HYPOTHESIS_INSTRUCTIONS_DELETE_ENTRY_CONFIRMATION")}</p>
            </div>
          </Modal>
        )}

        {toast && toast.state === "error" && (
          <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
        )}
      </div>
      {modal === "data-change-check" && (
        <Modal
          popupStyles={{ width: "fit-content", borderRadius: "0.25rem" }}
          popupModuleActionBarStyles={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            padding: 0,
            width: "100%",
            padding: "1rem",
          }}
          popupModuleMianStyles={{ padding: 0, margin: 0, maxWidth: "31.188rem" }}
          style={{
            flex: 1,
            backgroundColor: "white",
            border: "0.063rem solid rgba(244, 119, 56, 1)",
          }}
          headerBarMainStyle={{ padding: 0, margin: 0 }}
          headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("HEADING_DATA_WAS_UPDATED_WANT_TO_SAVE")} />}
          actionCancelLabel={t("YES")}
          actionCancelOnSubmit={updateData}
          actionSaveLabel={t("NO")}
          actionSaveOnSubmit={cancelUpdateData}
        >
          <div className="modal-body">
            <p className="modal-main-body-p">{t("HEADING_DATA_WAS_UPDATED_WANT_TO_SAVE")}</p>
          </div>
        </Modal>
      )}
    </>
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
              <p className="heading">{t("KEY")}</p>
            </div>
            <div className="value">
              <p className="heading">{t("VALUE")}</p>
            </div>
            <div className="invisible">
              <button className="delete-button invisible" onClick={() => deleteHandler(item)}>
                <div>
                  {" "}
                  <Trash width={"0.8rem"} height={"1rem"} fill={"rgba(244, 119, 56, 1)"} />
                </div>
                <p>{t("DELETE")}</p>
              </button>
            </div>
          </div>
          {assumptions.map((item, index) => (
            <div key={index} className={`${index === 0 ? "select-and-input-wrapper-first" : "select-and-input-wrapper"}`}>
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
                  <div>
                    {" "}
                    <Trash width={"0.8rem"} height={"1rem"} fill={"rgba(244, 119, 56, 1)"} />
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

const deleteAssumptionHandler = (item, setItemForDeletion, setAssumptions, setHypothesisAssumptionsList, setToast, t) => {
  let add = true;
  setAssumptions((previous) => {
    if (!previous.length) return [];
    if (previous?.length <= 1) {
      setToast({ state: "error", message: t("ERROR_CANNOT_DELETE_LAST_HYPOTHESIS") });
      add = false;
      return previous;
    }
    const filteredData = previous.filter((data) => data.id !== item.id);
    return filteredData || [];
  });
  if (add && item && item.key)
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

  useEffect(() => {
    if (item) setInputValue(item.value);
  }, [item]);

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

  return <input onFocus={Digit.Utils.microplan.inputScrollPrevention} type="number" step="0.01" value={inputValue} onChange={inputChangeHandler} disabled={disabled} />;
});

const setAutofillHypothesisData = (autofillHypothesis, assumptions, setAssumptions) => {
  if (assumptions?.length !== 0) return;
  let newAssumptions = [];
  for (let i in autofillHypothesis) {
    newAssumptions.push({
      id: i,
      key: autofillHypothesis[i],
      value: "",
    });
  }
  setAssumptions(newAssumptions);
};

export default Hypothesis;
