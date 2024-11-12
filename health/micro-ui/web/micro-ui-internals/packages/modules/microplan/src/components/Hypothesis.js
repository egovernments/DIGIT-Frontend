import React, { useState, useEffect, Fragment, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, DeleteIconv2, AddIcon, CardText, LabelFieldPair, InfoBannerIcon } from "@egovernments/digit-ui-react-components";
import { Dropdown, FieldV1, PopUp, Card, Button, Divider, TooltipWrapper, TextInput } from "@egovernments/digit-ui-components";
import { PRIMARY_COLOR } from "../utils/utilities";
import { useMyContext } from "../utils/context";
import { useAssumptionContext } from "./HypothesisWrapper";

const Hypothesis = ({ category, assumptions: initialAssumptions, setShowToast, allMdmsAssumptionsForThisCategory }) => {
  const { state, dispatch } = useMyContext();
  const { t } = useTranslation();
  const [showPopUP, setShowPopUp] = useState(false);
  const [assumptionsPopUP, setAssumptionsPopUp] = useState(false);
  const [assumptionToDelete, setAssumptionToDelete] = useState(null);
  const [assumptions, setAssumptions] = useState(initialAssumptions);
  const [selectedDeletedAssumption, setSelectedDeletedAssumption] = useState(null);
  const {
    assumptionValues,
    handleAssumptionChange,
    setAssumptionValues,
    setDeletedAssumptions,
    deletedAssumptions,
    defautAssumptions,
    setDefautAssumptions,
  } = useAssumptionContext();
  const deletedAssumptionCategories = useRef({});
  const isAddNewDisabled =
    !deletedAssumptionCategories.current[category] ||
    deletedAssumptionCategories.current[category].length === 0 ||
    deletedAssumptionCategories.current[category].every((item) => !deletedAssumptions.includes(item));

  const availableDeletedAssumptions = Array.from(
    new Set((deletedAssumptionCategories.current[category] || []).filter((item) => deletedAssumptions.includes(item)))
  );

  useEffect(() => {
    setAssumptions(initialAssumptions);
  }, [initialAssumptions]);

  const handleDeleteClick = (index) => {
    if (assumptions?.length === 1 && category !== "CAMPAIGN_VEHICLES") {
      //atleast one assumption in each category has to be mandatory to support draft functionality
      setShowToast({
        key: "error",
        label: t("ERR_ATLEAST_ONE_MANDATORY_FIELD"),
        transitionTime: 3000,
      });
      return;
    }
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

      setDeletedAssumptions((prev) => [...prev, deletedAssumption]);
      setAssumptionValues((prevValues) => prevValues.filter((value) => value.key !== deletedAssumption));

      setAssumptions(updatedAssumptions);

      setAssumptionToDelete(null);
    }

    setShowPopUp(false);
  };

  const addNewAssumption = () => {
    if (category === "CAMPAIGN_VEHICLES") {
      const assumptionToAdd = {
        ...selectedDeletedAssumption,
        source: "CUSTOM",
        category: category,
        value: null,
        key: selectedDeletedAssumption?.model,
      };
      setAssumptions([...assumptions, assumptionToAdd?.key]);
      if (!assumptionValues.some((assumption) => assumption.key === assumptionToAdd)) {
        setAssumptionValues((prevValues) => [
          ...prevValues,
          { source: "CUSTOM", key: selectedDeletedAssumption?.model, value: null, category: category }, // or an initial value
        ]);
      }

      setSelectedDeletedAssumption(null);
      setAssumptionsPopUp(false);
    } else if (selectedDeletedAssumption?.code === "NEW_ASSUMPTION") {
      const assumptionToAdd = selectedDeletedAssumption;
      setAssumptions([...assumptions, assumptionToAdd?.name]);
      if (!assumptionValues.some((assumption) => assumption.key === assumptionToAdd)) {
        setAssumptionValues((prevValues) => [
          ...prevValues,
          { source: "CUSTOM", key: assumptionToAdd?.name, value: null, category: category }, // or an initial value
        ]);
      }

      setSelectedDeletedAssumption(null);
      setAssumptionsPopUp(false);
    } else if (selectedDeletedAssumption) {
      const assumptionToAdd = deletedAssumptions.find((assumption) => assumption === selectedDeletedAssumption.code);

      // **Check if it already exists**
      if (assumptionToAdd && !assumptions.includes(assumptionToAdd)) {
        setAssumptions([...assumptions, assumptionToAdd]);
        setDeletedAssumptions(deletedAssumptions.filter((assumption) => assumption !== selectedDeletedAssumption.code));

        if (deletedAssumptionCategories.current[category]) {
          deletedAssumptionCategories.current[category] = deletedAssumptionCategories.current[category].filter((item) => item !== assumptionToAdd);
        }

        // **Conditionally Add to assumptionValues if not already present**
        if (!assumptionValues.some((assumption) => assumption.key === assumptionToAdd)) {
          setAssumptionValues((prevValues) => [
            ...prevValues,
            { source: "MDMS", key: assumptionToAdd, value: null }, // or an initial value
          ]);
        }

        setSelectedDeletedAssumption(null);
        setAssumptionsPopUp(false);
      }
    }
  };

  const handleUpdateField = (value, name) => {
    setSelectedDeletedAssumption((prev) => {
      return {
        ...prev,
        name: value,
      };
    });
  };

  return (
    <>
      <Card className="middle-child">
        <Header className="uploader-sub-heading">{t(category)}</Header>
        <p className="mp-description">{t(`RESOURCE_CALCULATION`)}</p>
      </Card>

      <Card>
        {assumptions.map((item, index) => {
          const sourceCheck = assumptionValues?.find((i) => i?.key === item)?.source;
          return (
            <LabelFieldPair className="mp-hypothesis-label-field" style={{ alignItems: "center"}} key={index}>
              <div className="assumption-label">
                <span>
                  {`${t(item)}`}
                  {/* {category === "CAMPAIGN_VEHICLES" || sourceCheck === "CUSTOM" ? null : <span className="mandatory-span">*</span>} */}
                  {category === "CAMPAIGN_VEHICLES" || sourceCheck === "CUSTOM" ? null : (
                    <span className="icon-wrapper">
                      <TooltipWrapper content={t(`HYPOTHESIS_MESSAGE_FOR_${item}`)} children={<InfoBannerIcon fill={"#C84C0E"} />} />
                    </span>
                  )}
                </span>
              </div>

              <div className="fieldv1-deleteIcon-container">
                <FieldV1
                  type="number"
                  name={item}
                  value={assumptionValues.find((assumption) => assumption.key === item)?.value || ""}
                  error={""}
                  style={{ marginBottom: "0" }}
                  populators={{ name: item }}
                  id={index}
                  placeholder={category === "CAMPAIGN_VEHICLES" ? t(`MP_ENTER_ASSUMPTION_${category}`) : t("MP_ENTER_ASSUMPTION")}
                  onChange={(event) => {
                    handleAssumptionChange(category, event, item);
                  }}
                />
                <div className="hypothesis-delete-button">
                  <DeleteIconv2 />
                  <span style={{ color: "#B91900", textDecoration: "Underline" }} onClick={() => handleDeleteClick(index)}>
                    {t("DELETE")}
                  </span>
                </div>
              </div>
            </LabelFieldPair>
          );
        })}

        <Divider className="" variant="small" />

        <Button
          icon="Add"
          label={category === "CAMPAIGN_VEHICLES" ? t(`ADD_ASSUMPTION_${category}`) : t("ADD_ASSUMPTION")}
          onClick={() => setAssumptionsPopUp(true)}
          variation="secondary"
          // isDisabled={isAddNewDisabled}
          isDisabled={false}
        />
        {showPopUP && (
          <PopUp
            className={"popUpClass"}
            type={"default"}
            heading={t("HYP_CONFIRM_TO_DELETE")}
            equalWidthButtons={true}
            children={[
              <div>
                <CardText style={{ margin: 0 }}>{t("HYP_PERMANENT_DELETE")}</CardText>
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

        {assumptionsPopUP && (
          <PopUp
            className={"popUpClass new-assumption-pop"}
            type={"default"}
            heading={t(category === "CAMPAIGN_VEHICLES" ? `CONFIRM_NEW_ASSUMPTION_${category}` : "CONFIRM_NEW_ASSUMPTION")}
            equalWidthButtons={true}
            children={
              category === "CAMPAIGN_VEHICLES"
                ? [
                    <LabelFieldPair className="new-assumption-pop">
                      <span className="bold">{t(`CHOOSE_VEHICLE`)}</span>
                      <Dropdown
                        variant="select-dropdown"
                        t={t}
                        isMandatory={false}
                        option={[...(state?.VehicleDetails || [])]}
                        select={(value) => {
                          setSelectedDeletedAssumption(value);
                        }}
                        selected={selectedDeletedAssumption}
                        optionKey="model"
                        showToolTip={true}
                        style={{ maxWidth: "100%" }}
                        placeholder={t("SELECT_OPTION")}
                        onChange={(e) => setSelectedDeletedAssumption(e.target.value)}
                        optionCardStyles={{ position: "relative" }}
                      />
                    </LabelFieldPair>,
                  ]
                : [
                    <LabelFieldPair className="new-assumption-pop">
                      <span className="bold">{t(`CHOOSE_ASSUMPTION`)}</span>
                      <Dropdown
                        variant="select-dropdown"
                        t={t}
                        isMandatory={false}
                        option={[
                          ...new Set(deletedAssumptions?.filter((del) => allMdmsAssumptionsForThisCategory?.includes(del))),
                          ...defautAssumptions,
                        ]?.map((item) => ({ code: item }))}
                        select={(value) => {
                          setSelectedDeletedAssumption(value);
                        }}
                        selected={selectedDeletedAssumption}
                        optionKey="code"
                        showToolTip={true}
                        style={{ maxWidth: "100%" }}
                        placeholder={t("SELECT_OPTION")}
                        onChange={(e) => setSelectedDeletedAssumption(e.target.value)}
                        optionCardStyles={{ position: "relative" }}
                      />
                    </LabelFieldPair>,
                    selectedDeletedAssumption?.code === "NEW_ASSUMPTION" && (
                      <LabelFieldPair className="new-assumption-pop">
                        <span className="bold">{t(`ASSUMPTION_NAME`)}</span>
                        <TextInput
                          name="name"
                          value={selectedDeletedAssumption?.name || ""}
                          onChange={(event) => handleUpdateField(event.target.value, "name")}
                        />
                      </LabelFieldPair>
                    ),
                  ]
            }
            onOverlayClick={() => {
              setAssumptionsPopUp(false);
            }}
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("NO")}
                onClick={() => {
                  setAssumptionsPopUp(false);
                }}
              />,
              <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("YES")}
                onClick={() => {
                  addNewAssumption();
                }}
              />,
            ]}
            sortFooterChildren={true}
            onClose={() => {
              setAssumptionsPopUp(false);
            }}
          ></PopUp>
        )}
      </Card>
    </>
  );
};

export default Hypothesis;
