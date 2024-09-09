import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Button, PopUp, Toast } from "@egovernments/digit-ui-components";
import { useHistory, useLocation } from "react-router-dom";
import { moduleMasterConfig } from "./config/moduleMasterConfig";

const ModuleMasterTable = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const module = searchParams.get("module");
  const config = moduleMasterConfig(module);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showPopUp, setShowPopUp] = useState(true);
  const { mutate: useDefaultMasterHandler } = Digit.Hooks.sandbox.useDefaultMasterHandler(tenantId);
  const [showToast, setShowToast] = useState(null);
  const onClickRow = ({ original: row }) => {
    const value = row?.code;
    const type = row?.type;
    if (type === "boundary") {
      history.push(
        `/${window.contextPath}/employee/workbench/upload-boundary?hierarchyType=${value}&from=sandbox&module=${module}`
      );
    } else {
      history.push(
        `/${window.contextPath}/employee/workbench/mdms-search-v2?moduleName=${value?.split(".")?.[0]}&masterName=${
          value?.split(".")?.[1]
        }&from=sandbox&screen=applicationManagement&action=view`
      );
    }
  };
  const handleMasterData = async (check) => {
    await useDefaultMasterHandler(
      {
        module: module,
        onlySchemas: check,
      },
      {
        onError: (error, variables) => {
          console.log(error);
          setShowPopUp(false);
          setShowToast({ key: "error", label: check ? "MANNUAL_MASTER_SETUP_ERROR" : "DEFAULT_MASTER_SETUP_ERROR", isError: true });
        },
        onSuccess: async (data) => {
          setShowPopUp(false);
          setShowToast({ key: "success", label: check ? "MANNUAL_MASTER_SETUP_SUCCESS" : "DEFAULT_MASTER_SETUP_SUCCESS" });
        },
      }
    );
  };
  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t(config?.moduleMasterConfig?.[0]?.label || "N/A")}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer
          configs={config?.moduleMasterConfig?.[0]}
          additionalConfig={{
            resultsTable: {
              onClickRow,
            },
          }}
        ></InboxSearchComposer>
      </div>
      {showPopUp && (
        <PopUp
          type={"default"}
          className={"masterHandlerPopup"}
          footerclassName={"masterHandlerPopUpFooter"}
          heading={t("SANDBOX_SETUP_MASTER_MODAL_HEADER")}
          children={[<div>{t("SANDBOX_SETUP_MASTER_MODAL_TEXT")}</div>]}
          onOverlayClick={() => {}}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("SANDBOX_MANNUAL_MASTER_LOAD")}
              onClick={() => {
                handleMasterData(true);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("SANDBOX_DEFAULT_MASTER_LOAD")}
              onClick={() => {
                handleMasterData(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
          onClose={() => {}}
        ></PopUp>
      )}
      {showToast && (
        <Toast
          type={showToast?.isError ? "error" : "success"}
          // error={showToast?.isError}
          label={t(showToast?.label)}
          isDleteBtn={"true"}
          onClose={() => setShowToast(false)}
        />
      )}
    </React.Fragment>
  );
};

export default ModuleMasterTable;
