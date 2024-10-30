import React, { useState, useEffect, Fragment, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, DeleteIconv2, AddIcon, CardText, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Dropdown, FieldV1, PopUp, Card, Button, Divider } from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities";
import { useMyContext } from "../utils/context";
import { useAssumptionContext } from "./HypothesisWrapper";



const Hypothesis = ({ category, assumptions: initialAssumptions }) => {

  const { t } = useTranslation();
  const [showPopUP, setShowPopUp] = useState(false)
  const [assumptionsPopUP, setAssumptionsPopUp] = useState(false)
  const [assumptionToDelete, setAssumptionToDelete] = useState(null)
  const [assumptions, setAssumptions] = useState(initialAssumptions);
  const [selectedDeletedAssumption, setSelectedDeletedAssumption] = useState(null);
  const { assumptionValues, handleAssumptionChange, setAssumptionValues, setDeletedAssumptions, deletedAssumptions } = useAssumptionContext();
  const deletedAssumptionCategories = useRef({});
  const isAddNewDisabled = !deletedAssumptionCategories.current[category] ||
    deletedAssumptionCategories.current[category].length === 0 ||
    deletedAssumptionCategories.current[category].every(item => !deletedAssumptions.includes(item));

  const availableDeletedAssumptions = Array.from(new Set(
    (deletedAssumptionCategories.current[category] || []).filter(item =>
      deletedAssumptions.includes(item)
    )
  ));

  useEffect(() => {
    setAssumptions(initialAssumptions)
  }, [initialAssumptions])



  const handleDeleteClick = (index) => {
    setAssumptionToDelete(index);
    setShowPopUp(true);
  };

  const handleCancelDelete = () => {
    setShowPopUp(false);
  };


  const handleConfirmDelete = () => {
    if (assumptionToDelete !== null) {
      const deletedAssumption = assumptions[assumptionToDelete];
      const updatedAssumptions = assumptions.filter((_, i) => i !== assumptionToDelete);

      if (!deletedAssumptionCategories.current[category]) {
        deletedAssumptionCategories.current[category] = [];
      }
      deletedAssumptionCategories.current[category].push(deletedAssumption);

      setDeletedAssumptions(prev => [...prev, deletedAssumption]);
      setAssumptionValues((prevValues) =>
        prevValues.filter((value) => value.key !== deletedAssumption)
      );


      setAssumptions(updatedAssumptions);

      setAssumptionToDelete(null);
    }

    setShowPopUp(false);
  };


  const addNewAssumption = () => {
    if (selectedDeletedAssumption) {
      const assumptionToAdd = deletedAssumptions.find(assumption => assumption === selectedDeletedAssumption.code);

      // **Check if it already exists**
      if (assumptionToAdd && !assumptions.includes(assumptionToAdd)) {
        setAssumptions([...assumptions, assumptionToAdd]);
        setDeletedAssumptions(deletedAssumptions.filter((assumption) => assumption !== selectedDeletedAssumption.code));

        if (deletedAssumptionCategories.current[category]) {
          deletedAssumptionCategories.current[category] = deletedAssumptionCategories.current[category].filter(
            (item) => item !== assumptionToAdd
          );
        }

        // **Conditionally Add to assumptionValues if not already present**
        if (!assumptionValues.some(assumption => assumption.key === assumptionToAdd)) {
          setAssumptionValues(prevValues => [
            ...prevValues,
            { source: "MDMS", key: assumptionToAdd, value: null, } // or an initial value
          ]);
        }

        setSelectedDeletedAssumption(null);
        setAssumptionsPopUp(false);
      }
    }
  };



  return (
    <>

      <Card className="middle-child">
        <Header className="uploader-sub-heading">{t(category)}</Header>
        <p className="mp-description">{t(`RESOURCE_CALCULATION`)}</p>
      </Card>


      <Card>

        {assumptions.map((item, index) => {

          return (
            <LabelFieldPair className="mp-hypothesis-label-field" key={index}>
              <div className="assumption-label">
                <span>{`${t(item)}`}
                  <span className="mandatory-span">*</span>
                </span>
              </div>


              <div className="fieldv1-deleteIcon-container">
                <FieldV1
                  type="number"
                  name={item}
                  value={assumptionValues.find((assumption) => assumption.key === item)?.value || ""}
                  error={""}
                  style={{ marginBottom: "0", }}
                  populators={{ name: item }}
                  id={index}
                  onChange={(event) => {

                    handleAssumptionChange(category, event, item);

                  }}
                />
                <div className="hypothesis-delete-button">
                  <DeleteIconv2 />
                  <span style={{ color: "#B91900", textDecoration: "Underline" }} onClick={() => handleDeleteClick(index)}>{t("DELETE")}</span>
                </div>

              </div>
            </LabelFieldPair>

          )
        })}

        <Divider
          className=""
          variant="small"
        />

        <Button
          icon="Add"
          label={t("ADD_ASSUMPTION")}
          onClick={() => setAssumptionsPopUp(true)}
          variation="secondary"
          isDisabled={isAddNewDisabled}

        />
        {showPopUP && <PopUp
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
            setShowPopUp(false)
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("YES")}
              onClick={() => {
                handleConfirmDelete()
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("NO")}
              onClick={handleCancelDelete}
            />,
          ]}
          sortFooterChildren={true}
          onClose={() => {
            setShowPopUp(false);
          }}
        ></PopUp>}

        {assumptionsPopUP && <PopUp
          className={"popUpClass"}
          type={"default"}
          heading={t("CONFIRM_NEW_ASSUMPTION")}
          equalWidthButtons={true}
          children={[
            <Dropdown
              variant="select-dropdown"
              t={t}
              isMandatory={false}
              option={availableDeletedAssumptions.map(item => ({ code: item }))}
              select={(value) => {
                setSelectedDeletedAssumption(value)
              }}
              selected={selectedDeletedAssumption}
              optionKey="code"
              showToolTip={true}
              placeholder={t("SELECT_OPTION")}
              onChange={(e) => setSelectedDeletedAssumption(e.target.value)}
              optionCardStyles={{ position: "relative" }}
            />
          ]}
          onOverlayClick={() => {
            setAssumptionsPopUp(false)
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("NO")}
              onClick={() => {
                setAssumptionsPopUp(false)
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("YES")}
              onClick={() => {
                addNewAssumption()
              }}
            />,

          ]}
          sortFooterChildren={true}
          onClose={() => {
            setAssumptionsPopUp(false)
          }}
        ></PopUp>}
      </Card>
    </>


  )




}

export default Hypothesis;