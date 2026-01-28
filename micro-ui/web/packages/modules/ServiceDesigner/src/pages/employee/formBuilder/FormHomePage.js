import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardSectionHeader,
  CardText,
} from "@egovernments/digit-ui-react-components";
import { Button, Loader, TextBlock, Toggle } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "../../../utils/tableStyles";

const FormHomePage = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedTab, setSelectedTab] = useState("MY_FORMS");
  const [formData, setFormsData] = useState([]);
  const {module, service} = Digit.Hooks.useQueryParams();
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfigurationDrafts",
        filters: {
          module: module,
          service: service,
        },
      },
    },
  };
  const { isLoading: moduleListLoading, data } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  useEffect(() => {
    if(data)
    {
      const draft = data?.mdms?.[0];
      if (draft && draft.data?.uiforms) {
        const formatted = draft.data.uiforms.map((form, index) => ({
          id: `${draft.id}_${index}`,
          name: form.formName,
          description: form.formDescription || "-",
          createdDate: Digit.DateUtils.ConvertEpochToDate(draft?.auditDetails?.createdTime) || "N/A",
          item: {
            id: `${draft.id}_${index}`,
            data: {
              module: module,
              service: service,
              formName: form.formName,
              formDescription: form.formDescription,
              formConfig: form.formConfig,
              isActive: form.isActive
            },
            auditDetails: draft.auditDetails
          }
        }));
        
        setFormsData(formatted);
      } else {
        setFormsData([]);
      }
    }
  },[data])

  const tabOptions = [
    { name: "My Forms", code: "MY_FORMS", i18nKey: t("STUDIO_MY_FORMS") },
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
      name: t("STUDIO_FORMS_NAME"),
      selector: (row) => row.name,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: "400" }}>{row.name}</div>
          <div style={{ fontSize: "12px", color: "#555", display: "none" }}>
            {row.description}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: t("STUDIO_CREATED_DATE"),
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: t("STUDIO_CREATED_ACTIONS"),
      cell: (row) => (
        <Button
          
          onClick={() => window.location.href = `/${window.contextPath}/employee/servicedesigner/form-builder?variant=app&masterName=FormBuilder&fieldType=FieldTypeMappingConfig&prefix=CMP-2025-07-24-006759&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=CMP-2025-07-24-006759&formId=default&projectType=Bednet&module=${row?.item?.data?.module}&service=${row?.item?.data?.service}&formName=${row?.name}&editMode=true`}
          label={t("STUDIO_EDIT")}
          variation="secondary"
          size="small"
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
      <div style={{ fontSize: "2rem",
            fontWeight: 700,
            color: "#0B4B66",
            fontFamily: "Roboto condensed" }}>{t("STUDIO_CREATE_NEW_FORMS_HEADER")}</div> 
      
      <div style={{
              fontSize: "1rem",
              color: "#505A5F",
              margin: "1rem 0",
            }}>{t("FORM_HEADER_DESCRIPTION")}</div>
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
              label={t(`STUDIO_CREATE_NEW_FORMS_SUB_HEADER`)}
              onClick={() =>
                (window.location.href = `/${window?.contextPath}/employee/servicedesigner/form-builder?variant=app&masterName=FormBuilder&fieldType=FieldTypeMappingConfig&prefix=CMP-2025-07-24-006759&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=CMP-2025-07-24-006759&formId=default&projectType=Bednet&module=${module}&service=${service}`)
              }
              size="medium"
              style={{width: "100%", height: "5rem", border:"1px dashed #c84c0e", backgroundColor:"#fff", color:"#c84c0e", fontWeight:"500"}}
              title=""
              variation="secondary"
            />
        </div>
      </Card>
      <Card style={{padding:"2rem"}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            //marginTop: "2rem",
            //marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <span style={{display:"none"}}>
          <Toggle
            name="tabs"
            numberOfToggleItems={tabOptions.length}
            options={tabOptions}
            optionsKey="i18nKey"
            selectedOption={selectedTab}
            onSelect={(val) => setSelectedTab(val)}
            type="toggle"
          />
          </span>
          <CardSectionHeader style={{marginBottom:"0px",marginTop:"0px",
          color: "#0B4B66",
          }}>{t("MY_FORMS")}</CardSectionHeader>
        </div>

        {moduleListLoading ? (
          <div style={{ padding: "1rem" }}>Loading...</div>
        ) : selectedTab === "MY_FORMS" ? (
          formData.length > 0 ? (
            <div style={{ marginTop: "1rem" }}>
              <DataTable
                columns={columns}
                data={formData}
                customStyles={tableCustomStyle}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 20, 50]}
                noDataComponent={<div style={{ padding: "1rem", fontStyle: "italic" }}>{t("STUDIO_NO_FORMS_AVAILABLE")}</div>}
                responsive
                highlightOnHover
                pointerOnHover
              />
            </div>
          ) : (
            <div style={{ padding: "1rem 0 0 0", fontStyle: "italic" }}>{t("STUDIO_NO_FORMS_AVAILABLE")}</div>
          )
        ) : (
          <div style={{ padding: "1rem 1rem 1rem 0", color: "#666" }}>
           {t("STUDIO_NO_DATA_AVAILABLE")}
          </div>
        )}
      </Card>
    </React.Fragment>
  );
};

export default FormHomePage;
