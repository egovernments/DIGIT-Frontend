import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../configs/ComplaintCreateConfig";
import { transformCreateData } from "../../utils/createUtils";

const ComplaintCreate = ({ props }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();

  const transformData = (data, tenantId) => {
    const updatedData = {
      service: {
        serviceCode: `${data?.complaintType.serviceCode}`,
      },
    };
    return data;
  };
  // use this for call create or update
  const reqCriteria = {
    url: props?.isUpdate ? `/pgr-services/v2/_update` : `/pgr-services/v2/_create`,
    // url: "http://172.16.2.89:8080/pgr-services/pgr-service/request/_create",
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteria);

  // Handle form submission
  const handleCreate = async (data) => {
    if (props?.isUpdate) {
      data.complaintType = props?.data?.[0].complaintType;
      data.complaintName = props?.data?.[0].complaintName;
      data.complaintContactNumber = props?.data?.[0]?.complaintContactNumber;
      data.supervisorsName = props?.data?.[0].supervisorsName;
      data.supervisorsContactNumber = props?.data?.[0].supervisorsContactNumber;
      data.complaintDescription = props?.data?.[0]?.complaintDescription;
    }
    // Create the complaint payload with transformed data
    const complaint = transformData(data, tenantId);
    //call the createMutation for MB and route to response page on onSuccess or show error
    const onError = (resp) => {
      history.push(`/${window.contextPath}/employee/sample/response?isSuccess=false&tenantId=${tenantId}&complaintNumber=${resp.complaintNumber}`);
    };
    const onSuccess = (resp) => {
      history.push(`/${window.contextPath}/employee/sample/response?isSuccess=true&tenantId=${tenantId}&complaintNumber=${resp.complaintNumber}`);
    };
    mutation.mutate(
      {
        params: {},
        // body: { ...service },
        body: {
          PGREntity: {
            service: {
              complaintNumber: `${data?.complaintNumber}`,
              serviceCode: `${data?.complaintType?.serviceCode}`,
            },
          },
        },
        config: {
          enabled: true,
        },
      },
      {
        onError,
        onSuccess,
      }
    );
  };

  const onSubmit = (data) => {
    handleCreate(data);
  };

  return (
    <div>
      <Header> {t("New Complaint")}</Header>
      <FormComposerV2
        label={t("Submit Application")}
        config={newConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={{}}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data) => onSubmit(data)}
        fieldStyle={{ marginRight: 0 }}
      />
    </div>
  );
};

export default ComplaintCreate;