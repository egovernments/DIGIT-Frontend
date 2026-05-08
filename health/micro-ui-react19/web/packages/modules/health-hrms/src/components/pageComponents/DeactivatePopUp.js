import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Toast, Dropdown, FileUpload, FieldV1 } from "@egovernments/digit-ui-components";
import { convertEpochToDate } from "../../utils/utlis";

const DeactivatePopUp = ({ bussnessBtnLabel, label, onClose, onSubmit, reasonMsg }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading, data } = Digit.Hooks.useCommonMDMS(tenantId, "egov-hrms", ["DeactivationReason"]);

  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [date, setDate] = useState(convertEpochToDate(Date.now()));
  const [reason, setReason] = useState(null);
  const [order, setOrder] = useState(null);

  const handleSave = () => {
    if (!reason || reason.trim() === "") {
      setShowToast({
        key: "error",
        label: t("HCM_AM_COMMENT_REQUIRED_ERROR_TOAST_MESSAGE"),
        transitionTime: 3000,
      });
      return;
    }
    setShowToast(null);
    onSubmit(comment, date, reason, order);
  };

  return (
    <>
      <PopUp
        style={{ width: "700px" }}
        onClose={onClose}
        heading={t(label || `HR_COMMON_DEACTIVATED_EMPLOYEE_HEADER`)}
        children={[
          <div key="reason" className="comment-section">
            <div className="comment-label">
              {t(reasonMsg ? `HR_ACTIVATION_REASON` : `HR_DEACTIVATION_REASON`)}
              <span className="required"> *</span>
            </div>
            <Dropdown
              additionalWrapperClass=""
              description=""
              error=""
              errorStyle={null}
              inputRef={null}
              label={t(`HRMS_SELECT_OPTION`)}
              name="genders"
              onChange={() => {}}
              option={(data?.["egov-hrms"]?.DeactivationReason || []).map((ele) => ({
                ...ele,
                i18key: "EGOV_HRMS_DEACTIVATIONREASON_" + ele.code,
              }))}
              optionKey="code"
              optionsCustomStyle={{}}
              select={(e) => setReason(e.code)}
              t={t}
              type="dropdown"
            />
          </div>,
          <FieldV1
            key="order"
            label={t("HR_ENTER_ORDER_NO")}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            value={comment || ""}
          />,
          <FieldV1
            key="date"
            label={t("HR_EFFECTIVE_DATE")}
            type="date"
            populators={{ name: "date", disableTextField: true }}
            onChange={(e) => setDate(e)}
            disable={true}
            value={date}
          />,
          <FileUpload key="upload" label={t("TL_APPROVAL_UPLOAD_SUBHEAD")} showLabel uploadedFiles={[]} variant="uploadField" />,
          <FieldV1
            key="remarks"
            label={t("HR_ENTER_REMARKS")}
            onChange={(e) => setOrder(e.target.value)}
            type="text"
            value={order || ""}
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
            label={t(`CORE_COMMON_CLOSE`)}
            title={t(`CORE_COMMON_CLOSE`)}
            onClick={onClose}
          />,
          <Button
            isDisabled={!reason}
            key="submit-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            variation="primary"
            style={{ minWidth: "270px" }}
            label={t(bussnessBtnLabel)}
            title={t(bussnessBtnLabel)}
            onClick={handleSave}
          />,
        ]}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          onClose={() => setShowToast(null)}
        />
      )}
    </>
  );
};

export default DeactivatePopUp;
