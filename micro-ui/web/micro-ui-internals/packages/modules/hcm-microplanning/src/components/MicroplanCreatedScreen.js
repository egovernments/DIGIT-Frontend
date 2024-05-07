import React from "react";
import { ActionBar, ArrowForward, Banner } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { ArrowBack, FileDownload } from "@egovernments/digit-ui-svg-components";
import { convertJsonToXlsx } from "../utils/jsonToExcelBlob";
import { Button } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

const MicroplanCreatedScreen = ({ microplanData, ...props }) => {
  const { t } = useTranslation();
  const history = useHistory()

  const downloadMicroplan = () => {
    try {
      if (!microplanData?.microplanPreview) return;
      let data = _.cloneDeep(microplanData?.microplanPreview);
      data[0] = data[0].map((item) => t(item));
      for (let i in data) {
        data[i] = data[i].map((item) => (item ? item : t("NO_DATA")));
      }

      let blob = convertJsonToXlsx({ [microplanData?.microplanDetails?.name ]: data }, { skipHeader: true });

      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileNameParts = microplanData?.microplanDetails?.name;
      if (!fileNameParts) {
        return;
      }

      link.download = fileNameParts;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      
    }
  };

  const clickGoToHCM = ()=>{
    history.replace(`/workbench-ui/employee/campaign/setup-campaign`);
  }

  const clickGoHome = ()=>{
    history.replace(`/microplan-ui/employee/microplanning/select-campaign`);
  }

  return (
    <div className="">
      <div className="microplan-success-screen">
        <div>
          <Banner
            message={t("MICROPLAN_GENERATED_SUCCESSFULLY")}
            whichSvg="tick"
            applicationNumber={ microplanData?.planConfigurationId?microplanData.planConfigurationId:t("ES_COMMON_NA")}
            info={t("MICROPLAN_GENERATED_SUCCESSFULLY_ID_LABEL")}
            successful={true}
            headerStyles={{ fontWeight: "700", fontFamily: " Roboto Condensed", fontSize: "2.5rem" }}
          />
        </div>
        <p>{t("MICROPLAN_GENERATED_SUCCESSFULLY_DESCRIPTIION")}</p>
        <div className="button-container">
          <Button label={t("DOWNLOAD_MICROPLAN")} variation="secondary" onButtonClick={downloadMicroplan} icon={<FileDownload width={"1.5rem"} height={"1.5rem"} fill={"rgba(244, 119, 56, 1)"}/>} isSuffix={false} />
        </div>
      </div>

      <ActionBar className={`custom-action-bar-success-screen`}>
        {/* Back button */} 
        <Button
          type="button"
          className="custom-button custom-button-left-icon"
          label={t("GO_BACK_HOME")}
          onButtonClick={clickGoHome}
          isSuffix={false}
          variation={"secondary"}
          icon={<ArrowBack className={"icon"} width={"1.5rem"} height={"1.5rem"} fill={"rgba(244, 119, 56, 1)"} />}
        />
        {/* Next/Submit button */}
        <Button
          type="button"
          className="custom-button"
          label={t("GO_TO_HCM")}
          onButtonClick={clickGoToHCM}
          isSuffix={true}
          variation={"primary"}
          textStyles={{ padding: 0, margin: 0 }}
        />
      </ActionBar>
    </div>
  );
};

export default MicroplanCreatedScreen;
