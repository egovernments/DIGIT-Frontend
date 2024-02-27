import { Button, Card, Header } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { SVG, DownloadIcon } from "@egovernments/digit-ui-react-components";

const UploadBoundaryData = ({ props }) => {
  const { t } = useTranslation();
  return (
    <Card>
   <div className="workbench-bulk-upload">
          <Header className="digit-form-composer-sub-header">{t("WBH_UPLOAD_BOUNDARY")}</Header>
          <Button
            label={t("WBH_DOWNLOAD_TEMPLATE")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
            type="button"
            className="workbench-download-template-btn"
            // isDisabled={!selectedValue}
            // onButtonClick={callInputClick}
          />
          {/* <GenerateXlsx inputRef={inputRef} jsonData={filteredXlsxData} /> */}
          
        </div>
    </Card>
  );
};

export default UploadBoundaryData;
