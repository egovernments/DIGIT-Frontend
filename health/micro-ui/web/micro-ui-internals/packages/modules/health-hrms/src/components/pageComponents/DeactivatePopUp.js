import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, Toast, Dropdown, TextInput, FileUpload } from "@egovernments/digit-ui-components";

/**
 * Component to show a pop-up to allow the user to enter a comment before approving an attendance register.
 * The component shows a text area to enter the comment and a button to save the comment.
 * If the comment is empty, it shows a toast message to indicate an error.
 * If the comment is valid, it calls the onSubmit function with the comment as an argument.
 * @param {function} onClose - Function to call when the pop-up should be closed.
 * @param {function} onSubmit - Function to call when the comment is valid and should be submitted.
 * @returns {JSX.Element} - The pop-up component.
 */
const DeactivatePopUp = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading, isError, errors, data, ...rest } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "DeactivationReason");
  // state variables
  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    // data?.["egov-hrms"]?.DeactivationReason.map((ele) => {
    //     ele["i18key"] = "EGOV_HRMS_DEACTIVATIONREASON_" + ele.code;
    //     return ele;
    // })
  }, [data]);

  const handleTextAreaChange = (e) => {
    const inputValue = e.target.value;
    setComment(inputValue);
  };

  const handleSave = () => {
    if (!comment || comment.trim() === "") {
      // Show toast if comment is empty
      setShowToast({
        key: "error",
        label: t("HCM_AM_COMMENT_REQUIRED_ERROR_TOAST_MESSAGE"),
        transitionTime: 3000,
      });
      return;
    }
    // remove the toast if comment is valid
    setShowToast(null);
    // Call the onSubmit function with the valid comment
    onSubmit(comment);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <>
      <PopUp
        style={{ width: "700px" }}
        onClose={onClose}
        heading={t(`HR_COMMON_DEACTIVATED_EMPLOYEE_HEADER`)}
        children={[
          <div className="comment-section">
            <div className="comment-label">
              {t(`HR_DEACTIVATION_REASON`)}
              <span className="required"> *</span>
            </div>
            {/* <TextArea style={{ maxWidth: "100%" }} value={comment} onChange={handleTextAreaChange} onKeyPress={handleKeyPress} /> */}
            <Dropdown
              additionalWrapperClass=""
              defaultValue="FEMALE"
              description=""
              error=""
              errorStyle={null}
              inputRef={null}
              label="Select Option"
              name="genders"
              onChange={function noRefCheck() {}}
              option={data?.["egov-hrms"]?.DeactivationReason.map((ele) => {
                ele["i18key"] = "EGOV_HRMS_DEACTIVATIONREASON_" + ele.code;
                return ele;
              })}
              optionKey="code"
              optionsCustomStyle={{}}
              select={function noRefCheck() {}}
              t={t}
              type="dropdown"
            />
          </div>,

          <TextInput
            label={t("HR_DEACTIVATION_REASON")}
            showLabel
            onChange={(e) => {
              setComment(e.target.value);
            }}
            type="text"
            value={comment || ""}
          />,

          <TextInput
            showLabel
            label={t("HR_EFFECTIVE_DATE")}
            type="date"
            populators={{ name: "date" }}
            key="effective"
            onChange={(e) => {
              setDate(e);
            }}
            disable={false}
            value={date}
          />,

          <FileUpload label={t("TL_APPROVAL_UPLOAD_SUBHEAD")} showLabel uploadedFiles={[]} variant="uploadField" />,
          <TextInput
          label={t("HR_DEACTIVATION_REASON")}
          showLabel
          onChange={(e) => {
            setComment(e.target.value);
          }}
          type="text"
          value={comment || ""}
        />,
        ]}
        onOverlayClick={onClose}
        equalWidthButtons={true}
        footerChildren={[
          <Button
            key="close-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            style={{ minWidth: "270px" }}
            variation="secondary"
            label={t(`HCM_AM_CLOSE`)}
            title={t(`HCM_AM_CLOSE`)}
            onClick={onClose}
          />,
          <Button
            key="submit-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            variation="primary"
            style={{ minWidth: "270px" }}
            label={t(`HCM_AM_APPROVE`)}
            title={t(`HCM_AM_APPROVE`)}
            onClick={onSubmit}
          />,
        ]}
      />
      {showToast && <Toast style={{ zIndex: 10001 }} label={showToast.label} type={showToast.key} onClose={() => setShowToast(null)} />}
    </>
  );
};

export default DeactivatePopUp;
