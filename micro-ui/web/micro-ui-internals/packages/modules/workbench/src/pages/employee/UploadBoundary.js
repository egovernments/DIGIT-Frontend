import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";

import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const UploadBoundary = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="wbh-header">
        <Header styles={{ marginLeft: "15px" }} className="works-header-search">
          {t("WBH_UPLOAD_BOUNDARY")}
        </Header>
      </div>
    </React.Fragment>
  );
};

export default UploadBoundary;
