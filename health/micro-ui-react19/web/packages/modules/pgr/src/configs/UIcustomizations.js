import _ from "lodash";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CloseSvg, Close, Modal } from "@egovernments/digit-ui-react-components";
import { Button, FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";

// Kept local: pgr has no utils/i18nKeyConstants or utils/utlis module. Importing them
// made the whole pgr bundle fail to resolve, so initPGRComponents() threw and none of
// these customizations were ever registered on Digit.Customizations.commonUiConfig.
const convertDateToEpoch = (dateString) => Math.floor(new Date(dateString).getTime());

export const UICustomizations = {
  AssignCampaignInboxConfig: {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const body = data?.body || {};
      const formState = data?.state?.searchForm || {};

      const sharedFields = {};
      if (formState.projectType?.code) sharedFields.projectType = formState.projectType.code;
      if (formState.name?.trim()) sharedFields.name = formState.name.trim();
      if (formState.projectNumber?.trim()) sharedFields.projectNumber = formState.projectNumber.trim();
      if (formState.startDate) sharedFields.startDate = new Date(formState.startDate).getTime();
      if (formState.endDate) sharedFields.endDate = new Date(formState.endDate).getTime();

      // jurisdictionProjects is the untouched copy of the employee's jurisdictions.
      // Prefer it over body.Projects: when a config still points searchFormJsonPath at
      // requestBody.Projects, InboxSearchComposer spreads that array into a plain object
      // ({ "0": {...} }), which project search rejects with JsonMappingException.
      // Object.values normalises either shape back to a list.
      const asList = (value) => (Array.isArray(value) ? value : Object.values(value || {}));
      const allProjects = asList(body?.jurisdictionProjects).length ? asList(body?.jurisdictionProjects) : asList(body?.Projects);
      const baseProjects = allProjects.length ? allProjects : [{ tenantId }];

      const filteredProjects = formState.boundary?.code
        ? baseProjects.filter((project) => project?.address?.boundary === formState.boundary.code)
        : baseProjects;

      const Projects = (filteredProjects.length ? filteredProjects : baseProjects).map((project) => ({
        ...project,
        ...sharedFields,
      }));

      // Return a detached body. The composer keeps a reference to this same requestBody
      // and mutates it in place afterwards, so assigning onto data.body would let a
      // mangled shape reach the wire even though the query key was built from a valid
      // array - that is what made a second, failing project search fire.
      return { ...data, body: { ...body, Projects } };
    },

    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      // ResultsTable passes each flagged column through react-table's `Cell`, which
      // react-table renders as a component - so every cell gets its own hook scope and
      // hooks are safe here.
      const { id } = useParams();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || "health-project";
      const [toast, setToast] = useState(null);
      const [modalOpen, setModalOpen] = useState(false);
      const [sessionFormData, setSessionFormData] = useState({});
      const [refreshKey, setRefreshKey] = useState(Date.now());

      const { isLoading: isHRMSSearchLoading, data: hrmsData } = Digit.Hooks.hrms.useHRMSSearch({ codes: id }, tenantId);

      // Campaigns this employee is already assigned to
      const reqCri = {
        url: `/${projectContextPath}/staff/v1/_search`,
        params: {
          tenantId: tenantId,
          limit: 100,
          offset: 0,
        },
        body: {
          ProjectStaff: {
            staffId: hrmsData?.Employees?.[0]?.user?.userServiceUuid ? [hrmsData?.Employees?.[0]?.user?.userServiceUuid] : [],
          },
        },
        config: {
          enabled: !!hrmsData?.Employees?.[0]?.user?.userServiceUuid,
          select: (data) => {
            return data.ProjectStaff;
          },
        },
      };
      const { isLoading: isProjectStaffLoading, data: projectStaff, revalidate: revalidateProjectStaff } = Digit.Hooks.useCustomAPIHook(reqCri);

      const formConfig = {
        label: {
          heading: "ASSIGN_CAMPAIGN_MODAL_TITLE",
          submit: "CORE_COMMON_SUBMIT",
          cancel: "CORE_COMMON_CANCEL",
        },
        form: [
          {
            body: [
              {
                inline: true,
                label: "HR_CAMPAIGN_FROM_DATE_LABEL",
                isMandatory: true,
                key: "startDate",
                type: "date",
                populators: {
                  name: "startDate",
                  required: true,
                  error: "CORE_COMMON_REQUIRED_ERRMSG",
                  validation: {
                    min: new Date().toISOString().split("T")[0],
                  },
                },
              },
              {
                inline: true,
                label: "HR_CAMPAIGN_TO_DATE_LABEL",
                isMandatory: false,
                key: "endDate",
                type: "date",
                populators: {
                  name: "endDate",
                  required: false,
                  error: "CORE_COMMON_REQUIRED_ERRMSG",
                  validation: {
                    min: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                },
              },
            ],
          },
        ],
      };

      const createStaffMutation = Digit.Hooks.hrms.useHRMSStaffCreate(tenantId);
      const deleteStaffMutation = Digit.Hooks.hrms.useHRMSStaffDelete(tenantId);

      const validateFormData = (formData, config, t) => {
        const missingFields = [];

        config?.form?.forEach((section) => {
          section.body?.forEach((field) => {
            const key = field.key;
            const isRequired = field.isMandatory || field.populators?.required;

            if (isRequired && !formData[key]) {
              missingFields.push(t(field.label));
            }
          });
        });

        return missingFields;
      };

      const CloseBtn = (props) => {
        return (
          <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
            {props?.isMobileView ? (
              <CloseSvg />
            ) : (
              <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
                <Close />
              </div>
            )}
          </div>
        );
      };

      const Heading = (props) => {
        return <h1 className="heading-m">{props.heading}</h1>;
      };

      const handleToastClose = () => {
        setToast(null);
      };

      const onFormValueChange = (setValue, formData) => {
        if (!_.isEqual(sessionFormData, formData)) {
          setSessionFormData({ ...sessionFormData, ...formData });
        }
      };

      const createStaffService = async (payload) => {
        try {
          await createStaffMutation.mutateAsync(
            { projectStaff: payload },
            {
              onSuccess: async () => {
                setToast({ key: false, label: `${id} ${t("ASSIGNED_SUCCESSFULLY")}`, type: "success" });
                setRefreshKey(Date.now());
                await revalidateProjectStaff();
              },
              onError: async () => {
                setToast({ key: true, label: `${id} ${t("FAILED_TO_ASSIGN_CAMPAIGN")}`, type: "error" });
                setRefreshKey(Date.now());
                await revalidateProjectStaff();
              },
            }
          );
        } catch (error) {
          setToast({ key: true, label: `${id} ${t("FAILED_TO_ASSIGN_CAMPAIGN")}`, type: "error" });
        }
      };

      const handleModalSubmit = async () => {
        const missingFields = validateFormData(sessionFormData, formConfig, t);

        if (missingFields.length > 0) {
          setToast({ key: true, label: t("ES_COMMON_PLEASE_ENTER_ALL_MANDATORY_FIELDS"), type: "error" });
          return;
        }

        setModalOpen(false);
        await createStaffService({
          tenantId: tenantId,
          userId: hrmsData?.Employees?.[0]?.user?.userServiceUuid,
          projectId: row?.id,
          startDate: sessionFormData?.startDate ? convertDateToEpoch(sessionFormData?.startDate) : row?.startDate,
          endDate: sessionFormData?.endDate ? convertDateToEpoch(sessionFormData?.endDate) : row?.endDate,
        });
      };

      const existingAssignment = projectStaff?.find((staff) => staff?.projectId === row?.id);

      switch (key) {
        case "CAMPAIGN_START_DATE":
        case "CAMPAIGN_END_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem",
                wordWrap: "break-word",
                whiteSpace: "normal",
                overflowWrap: "break-word",
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "PROJECT_BOUNDARY_TYPE": {
          const hierarchy = hrmsData?.Employees?.[0]?.jurisdictions?.[0]?.hierarchy;
          if (!value) return <span>{t("CORE_COMMON_NA")}</span>;
          return <span>{hierarchy ? t(`${hierarchy}_${value}`) : t(value)}</span>;
        }

        case "PROJECT_BOUNDARY":
        case "PROJECT_TYPE":
          return value ? <span>{t(`${value}`)}</span> : <span>{t("CORE_COMMON_NA")}</span>;

        case "ASSIGNMENT":
          if (isHRMSSearchLoading || isProjectStaffLoading) {
            return <Loader />;
          }

          return (
            <React.Fragment>
              <Button
                key={refreshKey}
                variation={existingAssignment ? "secondary" : "primary"}
                label={existingAssignment ? t("UNASSIGN") : t("ASSIGN")}
                style={{ minWidth: "10rem" }}
                onClick={() => {
                  if (existingAssignment) {
                    deleteStaffMutation.mutateAsync(
                      { projectStaff: existingAssignment },
                      {
                        onSuccess: async () => {
                          setToast({ key: false, label: `${id} ${t("UNASSIGNED_SUCCESSFULLY")}`, type: "success" });
                          setRefreshKey(Date.now());
                          await revalidateProjectStaff();
                        },
                        onError: async () => {
                          setToast({ key: true, label: `${id} ${t("FAILED_TO_UNASSIGN_CAMPAIGN")}`, type: "error" });
                          setRefreshKey(Date.now());
                          await revalidateProjectStaff();
                        },
                      }
                    );
                    return;
                  }
                  setModalOpen(true);
                }}
              />
              {modalOpen && (
                <Modal
                  popupStyles={{ width: "48.438rem", borderRadius: "0.25rem", height: "fit-content" }}
                  headerBarMain={<Heading t={t} heading={t(formConfig.label.heading)} />}
                  headerBarEnd={<CloseBtn onClick={() => setModalOpen(false)} />}
                  actionSaveLabel={t(formConfig.label.submit)}
                  actionCancelLabel={t(formConfig.label.cancel)}
                  actionCancelOnSubmit={() => setModalOpen(false)}
                  actionSaveOnSubmit={handleModalSubmit}
                  formId="modal-action"
                >
                  <FormComposerV2
                    config={formConfig.form}
                    defaultValues={sessionFormData}
                    noBoxShadow
                    inline
                    childrenAtTheBottom
                    formId="modal-action"
                    onFormValueChange={onFormValueChange}
                  />
                </Modal>
              )}
              {toast && (
                <Toast error={toast.key} isDleteBtn={true} label={t(toast.label)} onClose={handleToastClose} type={toast.type} />
              )}
            </React.Fragment>
          );

        default:
          return t("CORE_COMMON_NA");
      }
    },
  },

  HRMSInboxConfig: {
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const searchForm = data?.state?.searchForm || {};
      const filterForm = data?.state?.filterForm || {};
      const tableForm = data?.state?.tableForm || {};

      const requestParam = {
        tenantId,
        limit: tableForm.limit ?? 10,
        offset: tableForm.offset ?? 0,
        sortBy: "lastModifiedTime",
        sortOrder: "DESC",
      };

      if (searchForm.names) requestParam.names = searchForm.names;
      if (searchForm.codes) requestParam.codes = searchForm.codes;
      if (searchForm.phone) requestParam.phone = searchForm.phone;

      const isActive = filterForm.isActive;
      if (isActive !== null && isActive !== undefined && isActive !== "") {
        requestParam.isActive = typeof isActive === "object" ? isActive.code : isActive;
      }

      const roles = filterForm.roles;
      if (roles && !(Array.isArray(roles) && roles.length === 0) && roles !== "") {
        if (Array.isArray(roles)) {
          requestParam.roles = roles.map((r) => (typeof r === "object" ? r.code : r)).join(",");
        } else if (typeof roles === "object") {
          requestParam.roles = roles.code;
        } else {
          requestParam.roles = roles;
        }
      }

      // egov-hrms /_search returns TotalCount = the number of rows on the page it just
      // returned (verified: it always mirrors `limit`), and /_count ignores every search
      // criterion, so neither reports a real total. ResultsTable derives pageCount from
      // that value, so pagination stopped dead at page 1. Report one row past the current
      // page while full pages keep coming back - the next-page arrow stays available, and
      // the count becomes exact on the last page, where a short page arrives.
      const limit = Number(requestParam.limit) || 10;
      const offset = Number(requestParam.offset) || 0;
      const select = (response) => {
        const rows = response?.Employees || [];
        return {
          ...response,
          TotalCount: offset + rows.length + (rows.length === limit ? 1 : 0),
        };
      };

      // params = GET query string; changeQueryName forces React Query key to change (body is always {} for HRMS GET)
      return {
        ...data,
        params: requestParam,
        config: { ...data?.config, select },
        changeQueryName: JSON.stringify(requestParam),
      };
    },

    additionalCustomizations: (row, key, column, value, t) => {
      switch (key) {
        case "HR_EMP_ID_LABEL":
          return (
            <Link
              to={`/${window?.contextPath}/employee/hrms/details/${row?.code}`}
              style={{ color: "#C84C0E", textDecoration: "underline" }}
            >
              {row?.code || t("CORE_COMMON_NA")}
            </Link>
          );

        case "HR_EMP_NAME_LABEL":
          return row?.user?.name || t("CORE_COMMON_NA");

        case "HR_ROLE_NO_LABEL":
          return row?.user?.roles?.length ?? 0;

        case "HR_JURIDICTIONS_LABEL": {
          const codes = row?.jurisdictions?.map((j) => j?.boundary).filter(Boolean);
          return codes?.length ? codes.join(", ") : t("CORE_COMMON_NA");
        }

        case "HR_DESG_LABEL":
          return row?.assignments?.[0]?.designation
            ? t(`COMMON_MASTERS_DESIGNATION_${row.assignments[0].designation}`)
            : t("CORE_COMMON_NA");

        case "HR_EMPLOYMENT_DEPARTMENT_LABEL":
          return row?.assignments?.[0]?.department
            ? t(`COMMON_MASTERS_DEPARTMENT_${row.assignments[0].department}`)
            : t("CORE_COMMON_NA");

        default:
          return null;
      }
    },
  },
};