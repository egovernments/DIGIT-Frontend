import { Card, CardHeader, Switch, Toast, ToggleSwitch } from "@egovernments/digit-ui-components";
import React, { createContext, Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UploadDataMapping from "./UploadDataMapping";

const UploadDataMappingContext = createContext("UploadDataMappingContext");

export const useUploadDataMappingContext = () => {
  return useContext(UploadDataMappingContext);
};
function UploadDataMappingWrapper({ props: customProps, formData, currentCategories, onSelect }) {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const { id, draft, key, ...queryParams } = Digit.Hooks.useQueryParams();
  return (
    <Fragment>
      <UploadDataMappingContext.Provider value={{ formData: customProps }}>
        <Card className="dataMappingCard">
          <CardHeader>{t(`UPLOAD_DATA_MAPPING`)}</CardHeader>
          <div style={{ width: "100%" }}>
            <UploadDataMapping formData={customProps} currentCategories={currentCategories} onSelect={onSelect} />
          </div>
        </Card>
      </UploadDataMappingContext.Provider>
      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"} // Adjust based on your needs
          label={t(showToast.label)}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(false);
          }}
          isDleteBtn={true}
        />
      )}
    </Fragment>
  );
}

export default UploadDataMappingWrapper;
