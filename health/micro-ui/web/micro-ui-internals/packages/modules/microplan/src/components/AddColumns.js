import React, { useState, useEffect } from "react";
import { LabelFieldPair, FieldV1, Button, Card, TextInput, PopUp } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useAddColContext } from "./AddColumnsWrapper";
import { Header } from "@egovernments/digit-ui-components";

const AddColumns = ({ colValues: initialColValues, setShowToast }) => {
  const { t } = useTranslation();
  const { addNewCol, deleteCol, setColValues: setColValuesWrapper, setColumnsToDelete, setShowDeletePopup } = useAddColContext();
  const [newColValue, setNewColValue] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [colValues, setColValues] = useState(initialColValues);

  useEffect(() => {
    setColValues(initialColValues);
  }, [initialColValues]);

  useEffect(() => {
    setColValuesWrapper(colValues)
  }, [colValues]);

  // Reset the newColValue when popup is closed
  useEffect(() => {
    setNewColValue(null)
  }, [showPopUp]);


  return (
    <Card>
      <Header className="summary-main-heading">{t("MP_ADD_NEW_COLUMNS_HEADER")} </Header>
      {colValues?.map((item, index) => (
        <LabelFieldPair key={index} className="mp-hypothesis-label-field addColumnsScreen" style={{ alignItems: "center" }}>
          <div className="assumption-label">
            <span className="assumption-label-icon-wrapper">
              <span className="assumption-label-icon-wrapper-label">{`${t(`MP_COLUMN_ADDITION`)} ${index+1}`}</span>
            </span>
          </div>

          <div className="fieldv1-deleteIcon-container addColumnsScreen">
          <FieldV1
              type="text"
              name={`field-${index}`}
              value={item.value || ""}
              placeholder="Enter value"
              onChange={(e) => setColValues((prev) =>
                prev.map((col) => col.key === item.key ? { ...col, value: e.target.value } : col)
              )}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
              }}
            />
            <div className="hypothesis-delete-button">
              <Button
                icon="Delete"
                label={t("DELETE")}
                title={t("DELETE")}
                onClick={() => { setColumnsToDelete(item.key); setShowDeletePopup(true) }}
                variation="link"
                isDisabled={!colValues || colValues.length <= 1}
              />
            </div>
          </div>
        </LabelFieldPair>
      ))}
      <Button
        icon="Add"
        title={t("MP_ADD_NEW_COL_BUTTON")}
        label={t("MP_ADD_NEW_COL_BUTTON")}
        onClick={() => setShowPopUp(true)}
        variation="secondary"
        isDisabled={false}
      />
      {showPopUp && (
        <PopUp
          className={"popUpClass new-assumption-pop"}
          type={"default"}
          heading={t("MP_ADD_NEW_COLUMN")}
          equalWidthButtons={true}
          children={
            [(
              <LabelFieldPair className="new-assumption-pop">
                <span className="bold-column">{t(`MP_COL_NAME`)}</span>
                <TextInput
                  name="name"
                  value={newColValue}
                  onChange={(e) => (setNewColValue(e.target.value))}
                />
              </LabelFieldPair>
            )
            ]
          }
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CANCEL")}
              title={t("CANCEL")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ADD")}
              title={t("ADD")}
              onClick={() => {
                addNewCol(`MP_COL_NAME_${colValues.length + 1}`, newColValue)
                setShowPopUp(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
          onClose={() => {
            setShowPopUp(false);
          }}
        ></PopUp>
      )}
    </Card>
  );
};

export default AddColumns;
