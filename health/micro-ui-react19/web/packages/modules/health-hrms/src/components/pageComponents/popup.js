import { useTranslation } from "react-i18next";
import { PopUp, Button } from "@egovernments/digit-ui-components";

const ActionPopUp = ({ onClose, onSubmit, headingMsg }) => {
  const { t } = useTranslation();

  return (
    <PopUp
      style={{ width: "700px" }}
      onClose={onClose}
      heading={t(headingMsg)}
      children={[
        <div key="comment-section">
          <div className="comment-label">{t(`HR_READY_TO_SUBMIT_TEXT`)}</div>
        </div>,
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
          key="submit-button"
          className="campaign-type-alert-button"
          type="button"
          size="large"
          variation="primary"
          style={{ minWidth: "270px" }}
          label={t(`HR_COMMON_BUTTON_SUBMIT`)}
          title={t(`HR_COMMON_BUTTON_SUBMIT`)}
          onClick={onSubmit}
        />,
      ]}
    />
  );
};

export default ActionPopUp;
