import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Table } from "@egovernments/digit-ui-react-components";
import { Button, Card, CardHeader, CardText, Loader, PopUp, SVG } from "@egovernments/digit-ui-components";
import { useHistory, useLocation } from "react-router-dom";
import { setupMasterConfig } from "./config/setupMasterConfig";

const SetupMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const { isLoading, data, refetch } = Digit.Hooks.useAccessControl();
  const module = searchParams.get("module");
  const key = searchParams.get("key");
  const [showPopUp, setShowPopUp] = useState(null);
  const [filters, setFilters] = useState(null);
  const [isUserExist, setIsUserExist] = useState(null);
  const config = useMemo(() => {
    return setupMasterConfig(isUserExist)?.SetupMaster?.filter((item) => item.module === module)?.[0];
  }, [module, isUserExist]);

  const { isLoading: moduleMasterLoading, data: moduleMasterData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "sandbox-ui",
    [{ name: "ModuleMasterConfig" }],
    {
      // cacheTime: 0,
      // staleTime: 0,
      select: (data) => {
        let respStructure = data?.["sandbox-ui"]?.ModuleMasterConfig?.filter((item) => item?.module === module)?.[0]?.master?.filter(
          (item) => item.type === "module" || item.type === "common"
        );
        const respData = respStructure.map((i) => ({
          masterName: t(i.code),
          // type: t(i.type),
          description: t(`SANDBOX_MASTER_SETUP_DESC_${i.code}`),
        }));
        const moduleMasterPayload = respStructure
          ?.filter((i) => i.type === "common" || i.type === "module")
          ?.map((item) => {
            return {
              moduleName: item?.code?.split(".")?.[0],
              masterDetails: [
                {
                  name: item?.code?.split(".")?.[1],
                },
              ],
            };
          });
        return { respData, moduleMasterPayload };
      },
      enabled: true,
    }
    // true
  );

  useEffect(() => {
    if (!moduleMasterLoading && moduleMasterData?.moduleMasterPayload) {
      setFilters(moduleMasterData?.moduleMasterPayload);
    }
  }, [moduleMasterData, moduleMasterLoading]);

  const { isLoading: masterCountLoading, data: masterCount } = Digit.Hooks.sandbox.useGetMasterDataCount({
    tenantId: tenantId,
    filter: filters,
    config: {
      enabled: Boolean(filters),
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        if (_.isEmpty(data?.MdmsRes)) {
          return false;
        }
        const resp = data?.MdmsRes;
        const checkMasterDataCompleteness = Object.values(resp).every((category) =>
          Object.values(category).every((items) => items.every((item) => parseInt(item.count) > 0))
        );

        return checkMasterDataCompleteness;
      },
    },
  });

  useEffect(() => {
    if (!masterCountLoading) {
      setIsUserExist(masterCount);
    }
  }, [masterCountLoading, masterCount]);

  const { mutate: useDefaultMasterHandler } = Digit.Hooks.sandbox.useDefaultMasterHandler(tenantId);

  const handleSetupMaster = async () => {
    await useDefaultMasterHandler(
      {
        module: module,
        onlySchemas: false,
      },
      {
        onError: (error, variables) => {
          console.log(error);
          setShowPopUp({
            key: "error",
            alertHeading: "DEFAULT_MASTER_SETUP_ERROR",
            description: "DEFAULT_MASTER_SETUP_ERROR_DESC",
            subHeading: "DEFAULT_MASTER_SETUP_ERROR_SUBH",
            heading: "DEFAULT_MASTER_SETUP_ERROR_HEAD",
            secondaryText: "DEFAULT_MASTER_SETUP_ERROR_TEXT",
            iconFill: "red",
            customIcon: "",
            buttonLabel: "DEFAULT_MASTER_SETUP_ERROR_BUTTON_LABEL",
          });
        },
        onSuccess: async (data) => {
          refetch();
          setShowPopUp({
            key: "success",
            // label: "DEFAULT_MASTER_SETUP_SUCCESS", message: "DEFAULT_MASTER_SETUP_SUCCESS_MESSAGE",
            alertHeading: "DEFAULT_MASTER_SETUP_SUCCESS_ALERT",
            description: "DEFAULT_MASTER_SETUP_SUCCESS_DESC",
            subHeading: "DEFAULT_MASTER_SETUP_SUCCESS_SUBH",
            heading: "DEFAULT_MASTER_SETUP_SUCCESS_HEAD",
            secondaryText: "DEFAULT_MASTER_SETUP_SUCCESS_TEXT",
            iconFill: "green",
            customIcon: "CheckCircle",
            buttonLabel: "DEFAULT_MASTER_SUCCESS_BUTTON_LABEL",
          });
        },
      }
    );
  };

  if (moduleMasterLoading || masterCountLoading || isUserExist === null) {
    return <Loader />;
  }
  return (
    <Card className={"sandboxSetupMasterInfo"}>
      {key === "about" && (
        <>
          <Header className="headerFlex" styles={{ fontSize: "32px" }}>
            <SVG.Announcement height={40} width={40} />
            {t(config?.header || "N/A")}
          </Header>
          <CardText>{t(config?.description)}</CardText>
          {config?.features?.length > 0 && <CardHeader className="subHeader"> {t("FEATURES")}</CardHeader>}
          {config?.features?.length > 0 &&
            config?.features?.map((item, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "0.5rem" }}>{index + 1}. </span>
                <span style={{ marginRight: "0.5rem" }}>{t(item.name)}</span>
              </li>
            ))}
          <div className="setupMasterSetupActionBar">
            <Button
              className="actionButton"
              label={isUserExist ? t(`EDIT_MASTER`) : t(config.actionText)}
              variation={"secondary"}
              icon="ArrowForward"
              isSuffix={true}
              onClick={(e) => {
                e.preventDefault();
                history.push(`/${window?.contextPath}/employee/sandbox/application-management/setup-master?module=${module}&key=masterDetail`);
              }}
            ></Button>
          </div>
        </>
      )}
      {key === "masterDetail" && (
        <>
          <Header className="headerFlex" styles={{ fontSize: "32px" }}>
            <SVG.Announcement height={40} width={40} />
            {t(config?.header || "N/A")}
          </Header>
          <CardText>{t(config?.masterDescription)}</CardText>
          <Table
            pageSizeLimit={50}
            className={"table"}
            t={t}
            customTableWrapperClassName={"dss-table-wrapper"}
            disableSort={true}
            autoSort={false}
            data={moduleMasterData?.respData}
            totalRecords={5}
            columns={[
              {
                Header: "Master",
                accessor: "masterName",
                id: "masterName",
              },
              // {
              //   Header: "Type",
              //   accessor: "type",
              //   id: "type",
              // },
              {
                Header: "Description",
                accessor: "description",
                id: "description",
              },
            ]}
            isPaginationRequired={false}
            manualPagination={false}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  padding: "20px 18px",
                  fontSize: "16px",
                  whiteSpace: "normal",
                },
              };
            }}
          />
          {showPopUp && (
            <PopUp
              className={`setupMasterPopUp ${showPopUp?.key === "error" ? "error" : ""}`}
              type={"alert"}
              showIcon={t(showPopUp?.showIcon)}
              heading={t(showPopUp?.heading)}
              subHeading={t(showPopUp?.subHeading)}
              description={t(showPopUp?.description)}
              alertHeading={t(showPopUp?.alertHeading)}
              children={[<div> {t(showPopUp?.secondaryText)} </div>]}
              iconFill={showPopUp?.iconFill}
              customIcon={showPopUp?.customIcon}
              onOverlayClick={() => {}}
              alertMessage={" "}
              footerChildren={[
                <Button
                  type={"button"}
                  size={"large"}
                  variation={"secondary"}
                  label={t(showPopUp?.buttonLabel)}
                  onClick={() => history.push(`/${window?.contextPath}/employee`)}
                />,
              ]}
              equalWidthButtons={true}
            />
          )}
          <div className="setupMasterSetupActionBar">
            <Button
              className="actionButton"
              label={isUserExist ? t("EDIT_MASTER") : t("SETUP_MASTER")}
              variation={"primary"}
              // icon="ArrowForward"
              isSuffix={true}
              onClick={(e) => {
                e.preventDefault();
                if (isUserExist) {
                  history.push(`/${window?.contextPath}/employee/sandbox/application-management/module?module=${module}`);
                } else {
                  handleSetupMaster();
                }
              }}
            ></Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default SetupMaster;
