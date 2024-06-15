import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/casesSearchConfig";
import { useHistory } from "react-router-dom";

const Vakalath = () => {
  const history = useHistory();
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ""; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  const selectedCase = window.Digit.SessionStorage.get("PUCAR_CASE_DATA");

  const reqCreate = {
    url: `/case/case/v1/_update`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  function transformCreateData(data) {
    data.workflow.action = "SAVE_DRAFT";
    return {
      cases: data,
    };
  }

  const onSubmit = async (data) => {
    await mutation.mutate(
      {
        url: `/case/case/v1/_update`,
        params: { tenantId: "pg" },
        body: transformCreateData(data),
        config: {
          enable: true,
        },
      },
      {
        onSuccess: async (result) => {
          history.push(`/${window?.contextPath}/employee/cases/advocate-join-case`);
        },
        onError: (result) => {
          setShowToast({ key: "error", label: t("ERROR_WHILE_SUBMITING") });
          history.push(`/${window?.contextPath}/employee/cases/advocate-join-case`);
        },
      }
    );
  };

  return (
    <div>
      Vakalath Display Page
      <button
        onClick={() => onSubmit(selectedCase?.caseData)}
        style={{
          backgroundColor: "#007e7e",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          margin: "2px",
        }}
      >
        E-Sign
      </button>
    </div>
  );
};
export default Vakalath;
