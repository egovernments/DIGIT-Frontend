import React, { useState } from "react";
import { Button, PopUp, TextInput, Toast, Loader } from "@egovernments/digit-ui-components";
import { enrolmentTimeWithSession } from "../utils/time_conversion";

// Proper React component so hooks work correctly (additionalCustomizations is called as a function, not a component)
const AttendeeAssignCell = ({ row, t }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isTag, setIsTag] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");

  const { mutate: createMapping } = Digit.Hooks.payments.useCreateAttendeeFromRegister({ tenantId });
  const { registerId, sessionType } = Digit.Hooks.useQueryParams();

  const handleCreate = () => {
    setLoading(true);
    const sessionTypeNum = Number(sessionType);
    const validSessionType = sessionTypeNum === 0 || sessionTypeNum === 2 ? sessionTypeNum : 2;
    createMapping(
      {
        attendees: [
          {
            registerId,
            individualId: row.id,
            enrollmentDate: enrolmentTimeWithSession(validSessionType, new Date().getTime()),
            tenantId: row.tenantId,
            ...(tag !== "" ? { tag } : {}),
          },
        ],
      },
      {
        onSuccess: () => {
          setTag("");
          setLoading(false);
          setIsTag(false);
          setOpenPopUp(false);
          setToast({
            key: "success",
            label: `${t("HCM_AM_NEW_EMPLOYEE")} (${row.name?.givenName || ""}) ${t("HCM_AM_ENROLLED")}`,
            transitionTime: 3000,
          });
          setTimeout(() => window.history.back(), 800);
        },
        onError: (error) => {
          setLoading(false);
          setTag("");
          setIsTag(false);
          setOpenPopUp(false);
          const errorMessage = error?.response?.data?.Errors?.[0]?.message;
          setToast({ key: "error", label: t(errorMessage), type: "error" });
        },
      }
    );
  };

  if (loading) return <Loader />;

  return (
    <>
      <Button
        variation="primary"
        label={t("HCM_AM_ASSIGN_BT")}
        style={{ minWidth: "10rem" }}
        onClick={() => setOpenPopUp(true)}
      />
      {toast && (
        <Toast
          label={toast.label}
          type={toast.type || toast.key}
          transitionTime={toast.transitionTime}
          isDleteBtn={true}
          onClose={() => setToast(null)}
        />
      )}
      {openPopUp && (
        <PopUp
          style={{ minWidth: "500px" }}
          heading={t("HCM_AM_ACTION_NEEDED_TEAM_CODE")}
          onClose={() => { setTag(""); setIsTag(false); setOpenPopUp(false); }}
          onOverlayClick={() => { setTag(""); setIsTag(false); setOpenPopUp(false); }}
          footerChildren={[
            <Button
              key="tag-btn"
              type="button"
              size="large"
              variation="primary"
              label={t(isTag ? "HCM_AM_CLOSE_BT" : "HCM_AM_ENTER_TAG")}
              onClick={() => {
                if (isTag) { setTag(""); setOpenPopUp(false); setIsTag(false); }
                else { setIsTag(true); }
              }}
            />,
            <Button
              key="assign-btn"
              type="button"
              size="large"
              variation="primary"
              label={t("HCM_AM_ASSIGN_BT")}
              onClick={handleCreate}
            />,
          ]}
          sortFooterChildren={true}
        >
          {!isTag
            ? <div>{t("HCM_AM_INFO_TAG_CODE_MSG")}</div>
            : <div>
                <span>{t("HCM_AM_TAG_LABEL")}</span>
                <TextInput
                  type="text"
                  name="title"
                  placeholder={t("HCM_AM_ENTER_TEAM_CODE")}
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>
          }
        </PopUp>
      )}
    </>
  );
};

// how to call these -> Digit?.Customizations?.commonUiConfig?.[moduleName]
// these functions act as middlewares called by InboxSearchComposer (dev-53)

export const UICustomizations = {
  AttendeeSearchInboxConfig: {
    // preProcess is called by InboxSearchComposer on every state change.
    // Mirrors the React 17 preProcess: body uses mobileNumber[], name.givenName, username[], boundaryCode.
    // limit/offset stay in params only; changeQueryName carries pagination into the query key.
    preProcess: (data) => {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const tableForm = data?.state?.tableForm || {};
      const searchForm = data?.state?.searchForm || {};
      const filterForm = data?.state?.filterForm || {};

      const limit = tableForm.limit ?? 10;
      const offset = tableForm.offset ?? 0;

      data.params = {
        ...data.params,
        tenantId,
        limit,
        offset,
        sortOrder: "asc",
      };

      const Individual = {};

      if (searchForm.phone && String(searchForm.phone).trim() !== "") {
        Individual.mobileNumber = [String(searchForm.phone)];
      }
      if (searchForm.names && String(searchForm.names).trim() !== "") {
        Individual.name = { givenName: searchForm.names };
      }
      if (searchForm.codes && String(searchForm.codes).trim() !== "") {
        Individual.username = [searchForm.codes];
      }

      const urlBoundaryCode = new URLSearchParams(window.location.search).get("boundaryCode");
      const boundaryCode =
        filterForm.AttendeeBoundaryComponent ||
        Digit?.SessionStorage.get("selectedBoundary")?.code ||
        urlBoundaryCode;
      if (boundaryCode && String(boundaryCode).trim() !== "") {
        Individual.boundaryCode = boundaryCode;
      }

      data.body = { Individual };

      // changeQueryName includes pagination so query key changes on limit/offset changes
      data.changeQueryName = JSON.stringify({ Individual, limit, offset });

      return data;
    },

    additionalCustomizations: (row, key, column, value, t) => {
      switch (key) {
        case "HCM_HR_EMP_NAME_LABEL":
          return value ? `${value}` : t("ES_COMMON_NA");

        case "HCM_HR_EMP_MOBILE_LABEL":
          return value ? `${value}` : t("ES_COMMON_NA");

        case "HCM_HR_ROLE_NO_LABEL":
          return Array.isArray(value) && value.length > 0 ? value.length : t("ES_COMMON_NA");

        case "HCM_HR_JURIDICTIONS_LABEL":
          return value ? t(value) : t("ES_COMMON_NA");

        case "HCM_ASSIGNMENT":
          return <AttendeeAssignCell row={row} t={t} />;

        default:
          return null;
      }
    },
  },
};
