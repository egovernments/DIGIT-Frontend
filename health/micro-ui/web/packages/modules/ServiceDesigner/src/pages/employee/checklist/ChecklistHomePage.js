import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardSectionHeader,
  CardText,
} from "@egovernments/digit-ui-react-components";
import { Button, Loader, TextBlock, Toggle } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "../../../utils/tableStyles";
import { useChecklistConfigAPI } from "../../../hooks/useChecklistConfigAPI";

const ChecklistHomePage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedTab, setSelectedTab] = useState("MY_CHECKLIST");
  const [checklistData, setChecklistData] = useState([]);
  const {module, service} = Digit.Hooks.useQueryParams();

  // Use the new checklist config API hook
  const { searchChecklistConfigs } = useChecklistConfigAPI();
  const { data: checklistConfigs, isLoading: moduleListLoading } = searchChecklistConfigs(module, service);

  useEffect(() => {
    if(checklistConfigs)
    {
      const formatted = checklistConfigs.map((item, index) => ({
                id: item.id || index,
                name: item.data?.name,
                description: item?.data?.description || "-",
                questions: item.data?.data?.length || 0,
                createdDate: Digit.DateUtils.ConvertEpochToDate(item?.auditDetails?.createdTime) || "N/A",
              }));
      
              setChecklistData(formatted);
    }
  },[checklistConfigs])

  const tabOptions = [
    { name: "My Checklists", code: "MY_CHECKLIST", i18nKey: t("STUDIO_MY_CHECKLIST") },
  ];

  // DataTable columns configuration
  const columns = [
    {
      name: t("STUDIO_SNO"),
      selector: (row, index) => index + 1,
      width: "80px",
      sortable: false,
    },
    {
      name: t("STUDIO_CHECKLIST_NAME"),
      selector: (row) => row.name,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: "400" }}>{row.name}</div>
          <div style={{ fontSize: "12px", color: "#555" }}>
            {row.description}
          </div>
        </div>
      ),
      sortable: true,
    },
    // {
    //   name: t("STUDIO_QUESTIONS"),
    //   selector: (row) => row.questions,
    //   sortable: true,
    // },
    {
      name: t("STUDIO_CREATED_DATE"),
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: t("STUDIO_CREATED_ACTIONS"),
      cell: (row) => (
        <Button
          label={t("STUDIO_EDIT")}
          variation="secondary"
          size="small"
          onClick={() => history.push(`/${window.contextPath}/employee/servicedesigner/update-checklist?checklistName=${row.name}&module=${module}&service=${service}`)}
        />
      ),
      sortable: false,
    },
  ];



  if(moduleListLoading){
    return <Loader />
  }

  return (
    <React.Fragment>
      {/* <TextBlock header={t("STUDIO_CREATE_NEW_CHECKLIST")}/>
      <CardText>{t("CHECKLIST_HEADER_DESCRIPTION")}</CardText> */}
      <div style={{ fontSize: "2rem",
            fontWeight: 700,
            color: "#0B4B66",
            fontFamily: "Roboto condensed" }}>{t("STUDIO_CREATE_NEW_CHECKLIST")}</div> 
      
      <div style={{
              fontSize: "1rem",
              color: "#505A5F",
              margin: "1rem 0",
            }}>{t("CHECKLIST_HEADER_DESCRIPTION")}</div>
      <Card style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
              // className="custom-class"
              //icon="Delete"
              //iconFill=""
              label={t(`STUDIO_CREATE_NEW_CHECKLIST_SUB_HEADER`)}
              onClick={() =>
                (window.location.href = `/${window?.contextPath}/employee/servicedesigner/create-checklist?module=${module}&service=${service}`)
              }
              size="medium"
              style={{width: "100%", height: "5rem", border:"1px dashed #c84c0e", backgroundColor:"#fff", color:"#c84c0e", fontWeight:"500"}}
              title=""
              variation="secondary"
            />
        </div>
      </Card>
      <Card style={{paddingLeft:"2rem"}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          {/* <Toggle
            name="tabs"
            numberOfToggleItems={tabOptions.length}
            options={tabOptions}
            optionsKey="i18nKey"
            selectedOption={selectedTab}
            onSelect={(val) => setSelectedTab(val)}
            type="toggle"
          /> */}
          <div>
          <span style={{fontSize:"16px", fontWeight:"500", color: "rgba(11, 75, 102, 1)",}}>{t("STUDIO_MY_CHECKLIST")}</span>
          </div>
        </div>

        {moduleListLoading ? (
          <div style={{ padding: "1rem" }}>Loading...</div>
        ) : selectedTab === "MY_CHECKLIST" ? (
          checklistData.length > 0 ? (
            <div style={{ marginTop: "1rem" }}>
              <DataTable
                columns={columns}
                data={checklistData}
                customStyles={tableCustomStyle}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 20, 50]}
                noDataComponent={<div style={{ padding: "1rem", fontStyle: "italic" }}>{t("STUDIO_NO_CHECKLIST_AVAILABLE")}</div>}
                responsive
                highlightOnHover
                pointerOnHover
              />
            </div>
          ) : (
            <div style={{ fontStyle: "italic" }}>{t("STUDIO_NO_CHECKLIST_AVAILABLE")}</div>
          )
        ) : (
          <div style={{ padding: "1rem", color: "#666" }}>
           {t("STUDIO_NO_DATA_AVAILABLE")}
          </div>
        )}
      </Card>
    </React.Fragment>
  );
};

export default ChecklistHomePage;
