import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardLabelError, RadioButtons, SubmitBar } from "@egovernments/digit-ui-react-components";
import { LOCALIZATION_KEY } from "../../../constants/Localization";

// React 19: useHistory replaced by useNavigate; props.match.path replaced by navigate with absolute path
const ReasonPage = ({ parentRoute }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [valid, setValid] = useState(true);

  const onRadioChange = (value) => {
    const reopenDetails = Digit.SessionStorage.get(`reopen.${id}`) || {};
    Digit.SessionStorage.set(`reopen.${id}`, { ...reopenDetails, reason: value });
    setSelected(value);
  };

  const onSave = () => {
    if (selected === null) {
      setValid(false);
    } else {
      navigate(`${parentRoute}/upload-photo/${id}`);
    }
  };

  return (
    <Card>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_REOPEN}_COMPLAINT`)}</CardHeader>
      {!valid && <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ERROR_REOPEN_REASON`)}</CardLabelError>}
      <RadioButtons
        onSelect={onRadioChange}
        selectedOption={selected}
        options={[
          t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_ONE`),
          t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_TWO`),
          t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_THREE`),
          t(`${LOCALIZATION_KEY.CS_REOPEN}_OPTION_FOUR`),
        ]}
      />
      <SubmitBar label={t("CS_COMMON_NEXT")} onSubmit={onSave} />
    </Card>
  );
};

export default ReasonPage;
