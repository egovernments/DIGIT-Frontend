import React from "react";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const NoData = ({ t }) => (
  <div className="no-data">
    <p>{t(I18N_KEYS.COMMON.DSS_NO_DATA)}</p>
  </div>
);
export default NoData;
