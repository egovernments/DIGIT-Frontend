import { Loader, FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { newConfig } from "../../configs/SampleAdvancedSearchConfig";


const convertToDependenyConfig = (config = []) => {
  const newConfig = {
    form: [...config],
  };
  return newConfig;
};

const AdvancedCreate = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const reqCriteriaCreate = {
    url: `/contract/v1/_create`,
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaCreate);
  const navigate = useNavigate();
  const [dept, setDept] = useState("");
  const requestCriteria = {
    url: "/egov-hrms/employees/_search",
    body: {},
    params: {
      // tenantId:tenantId,
      tenantId: "pg.citya",
      limit: 10,
      offset: 0,
      sortOrder: "ASC",
      // departments: ADM
      // roles: SYSTEM,EMPLOYEE
    },
    config: {
      select: (data) => data?.Employees?.map((e) => ({ code: e?.code, name: e?.user?.name })),
    },
  };
  const requestCriteria1 = {
    url: "/egov-hrms/employees/_search",
    body: {},
    changeQueryName: `custom-${dept}`,
    params: {
      // tenantId:tenantId,
      tenantId: "pg.citya",
      limit: 10,
      offset: 0,
      sortOrder: "ASC",
      departments: dept,
      // roles: SYSTEM,EMPLOYEE
    },
    config: {
      enabled: dept?.length > 0,
      cacheTime: 0,
      select: (data) => data?.Employees?.map((e) => ({ code: e?.code, name: e?.user?.name })),
    },
  };
  const { isLoading, data: empData = [] } = Digit.Hooks.useCustomAPIHook(requestCriteria);
  const { isLoading: isLoadingEmpData, data: filteredEmpData = [], revalidate } = Digit.Hooks.useCustomAPIHook(requestCriteria1);

  const onSubmit = (data) => {
    ///
    const onError = (resp) => {
      navigate(`/${window.contextPath}/employee/sample/response?isSuccess=${false}`, { message: "TE_CREATION_FAILED" });
    };

    const onSuccess = (resp) => {
      navigate(`/${window.contextPath}/employee/sample/response?appNo=${resp.contracts[0].supplementNumber}&isSuccess=${true}`, {
        message: isEdit ? "TE_EDIT_SUCCESS" : "TE_CREATION_SUCCESS",
        showID: true,
        label: "REVISED_WO_NUMBER",
      });
    };

    mutation.mutate(
      {
        params: {},
        body: {
          contract: {
            ...data,
          },
          workflow: {
            action: "CREATE",

            comment: null,
          },
        },
      },
      {
        onError,
        onSuccess,
      }
    );
  };

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = newConfig ? newConfig : newConfig;
  const updatedConfig = useMemo(() => {
    const processedConfig = Digit.Utils.preProcessMDMSConfig(t, convertToDependenyConfig(configs), {
      updateDependent: [
        {
          key: "nameOfOfficerInCharge",
          value: [filteredEmpData],
        },
        {
          key: "referenceOfficer",
          value: [empData],
        },
      ],
    });
        return processedConfig?.form;
  }, [empData, filteredEmpData]);

  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    if (dept == "" && formData?.department?.code) {
      setDept(formData?.department?.code);
      revalidate();
    }
  };
  return (
    <FormComposerV2
      heading={t("Application Heading")}
      label={t("Submit Bar")}
      description={"Description"}
      text={"Sample Text if required"}
      config={updatedConfig.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      defaultValues={{}}
      onFormValueChange={onFormValueChange}
      onSubmit={onSubmit}
      fieldStyle={{ marginRight: 0 }}
    />
  );
};

export default AdvancedCreate;
