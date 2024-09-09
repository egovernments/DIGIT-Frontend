import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Table } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Card, CardHeader, CardText, Loader, SVG } from "@egovernments/digit-ui-components";
import { setupMasterConfig } from "./config/setupMasterConfig";

const renderHierarchy = (categories) => {
  return (
    <ul>
      {categories.map((category, index) => (
        <li key={index}>
          <CardText className="setupMaster-subChild">{index + 1 + ") " + category.master}</CardText>
          {category.child && category.child.length > 0 && (
            <ul>
              {category.child.map((subCategory, subIndex) => (
                <li key={subIndex}>
                  <CardText>{String.fromCharCode(97 + subIndex) + ") " + subCategory.master}</CardText>
                  {subCategory.child && subCategory.child.length > 0 && (
                    <ul>
                      {subCategory.child.map((grandChild, grandIndex) => (
                        <li key={grandIndex}>
                          <CardText>{String.fromCharCode(97 + grandIndex) + ") " + grandChild.master}</CardText>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

const SetupMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const module = searchParams.get("module");
  const config = setupMasterConfig?.SetupMaster?.filter((item) => item.module === module)?.[0];
  const [showMaster, setShowMaster] = useState(false);
  const { isLoading: moduleMasterLoading, data: moduleMasterData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "sandbox-ui",
    [{ name: "ModuleMasterConfig" }],
    {
      select: (data) => {
        let xx = data?.["sandbox-ui"]?.ModuleMasterConfig?.filter((item) => item?.module === module)?.[0]?.master?.filter(
          (item) => item.type === "module" || item.type === "common" || item.type === "boundary"
        );
        let respData = xx.map((i) => ({
          masterName: t(i.code),
          type: t(i.type),
          description: t(`SANDBOX_MASTER_SETUP_DESC_${i.code}`),
        }));
        return respData;
        // console.log("FFSFAFS", data)
        // function categorizeData(data) {
        //   const result = {};

        //   data.forEach((item) => {
        //     const masterItems = item.master;
        //     masterItems.forEach((entry) => {
        //       const { code, type } = entry;

        //       // Initialize type category
        //       if (!result[type]) {
        //         result[type] = [];
        //       }

        //       // Extract code before and after the dot
        //       const [beforeDot, afterDot] = code.split(".");

        //       // Find or create the category before the dot
        //       let category = result[type].find((cat) => cat.master === beforeDot);
        //       if (!category) {
        //         category = { master: beforeDot, child: [] };
        //         result[type].push(category);
        //       }

        //       // If there is an afterDot, add it as a child
        //       if (afterDot) {
        //         category.child.push({ master: afterDot });
        //       } else {
        //         // If there is no dot, just add the item to the child array of its own category
        //         if (code !== beforeDot) {
        //           // Avoid adding items without dots
        //           category.child.push({ master: code });
        //         }
        //       }
        //     });
        //   });

        //   return result;
        // }

        // Transform the data
        // return categorizeData(data?.["sandbox-ui"]?.ModuleMasterConfig?.filter((item) => item?.module === module));
      },
      enabled: true,
    },
    true
  );

  const onClickRow = ({ original: row }) => {
    const value = row?.code;
    history.push(
      `/${window.contextPath}/employee/workbench/mdms-search-v2?moduleName=${value?.split(".")?.[0]}&masterName=${
        value?.split(".")?.[1]
      }&from=sandbox&screen=applicationManagement&action=view`
    );
  };

  if (moduleMasterLoading) {
    return <Loader />;
  }
  return (
    <Card className={"sandboxSetupMasterInfo"}>
      {!showMaster && (
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
              label={t(config.actionText)}
              variation={"secondary"}
              icon="ArrowForward"
              isSuffix={true}
              onClick={(e) => {
                e.preventDefault();
                setShowMaster(true);
              }}
            ></Button>
          </div>
        </>
      )}
      {showMaster && (
        <>
          <Header className="headerFlex" styles={{ fontSize: "32px" }}>
            <SVG.Announcement height={40} width={40} />
            {t(config?.header || "N/A")}
          </Header>
          <CardText>{t(config?.description)}</CardText>
          {/* {Object.keys(moduleMasterData)?.length > 0 &&
            Object.keys(moduleMasterData)?.map((item, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "0.5rem" }}>{t(item)}</span>
                {moduleMasterData?.[item]?.length > 0 &&
                  moduleMasterData?.[item]?.map((subItem, subIndex) => (
                    <li key={subIndex} style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "0.5rem" }}>{subIndex + 1}. </span>
                      <span style={{ marginRight: "0.5rem" }}>{t(subItem)}</span>
                      {subItem?.child?.length > 0 &&
                        subItem.child.map((grandChild, grandIndex) => (
                          <li key={grandIndex} style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ marginRight: "0.5rem" }}>{String.fromCharCode(97 + grandIndex)} . </span>
                            <span style={{ marginRight: "0.5rem" }}>{t(grandChild)}</span>
                          </li>
                        ))}
                    </li>
                  ))}
              </li>
            ))} */}
          {/* <div>
            {Object.entries(moduleMasterData).map(([type, categories], index) => (
              <div key={index}>
                <CardHeader className="setupMaster-subheading">{type.charAt(0).toUpperCase() + type.slice(1)}</CardHeader>
                {renderHierarchy(categories)}
              </div>
            ))}
          </div> */}
          <Table
            pageSizeLimit={50}
            className={"table"}
            t={t}
            customTableWrapperClassName={"dss-table-wrapper"}
            disableSort={true}
            autoSort={false}
            data={moduleMasterData}
            totalRecords={5}
            columns={[
              {
                Header: "Master",
                accessor: "masterName",
                id: "masterName",
              },
              {
                Header: "Type",
                accessor: "type",
                id: "type",
              },
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
          {/* <Table
            columns={[
              {
                Header: t("HR_EMP_ID_LABEL"),
                disableSortBy: true,
                Cell: ({ row }) => {
                  return <span className="link">Hello</span>;
                },
              },
              {
                Header: t("HR_EMP_NAME_LABEL"),
                disableSortBy: true,
                Cell: ({ row }) => {
                  // return GetCell(`${row.original?.user?.name}`);
                  return <span className="link">Hello</span>;
                },
              },
            ]}
            data={[{ label: "HR_EMP_NAME_LABEL" }, { label: "HELLO" }]}
            getCellProps={(cellInfo) => {
              return {
                style: {},
              };
            }}
          /> */}
          <div className="setupMasterSetupActionBar">
            <Button
              className="actionButton"
              label={t("SETUP_MASTER")}
              variation={"secondary"}
              icon="ArrowForward"
              isSuffix={true}
              onClick={(e) => {
                e.preventDefault();
                history.push(`/${window?.contextPath}/employee/sandbox/application-management/module?module=${module}`);
              }}
            ></Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default SetupMaster;
