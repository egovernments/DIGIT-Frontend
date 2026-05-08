import { TelePhone, CheckPoint } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const PendingAtLME = ({ name, isCompleted, mobile, text, customChild }) => {
  const { t } = useTranslation();
  return (
    <CheckPoint
      label={t("CS_COMMON_PENDINGATLME")}
      isCompleted={isCompleted}
      customChild={
        <div>
          {name && mobile ? <TelePhone mobile={mobile} text={`${text} ${name}`} /> : null}
          {customChild}
        </div>
      }
    />
  );
};

export default PendingAtLME;
