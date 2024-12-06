import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../configs/NewComplaintsConfig";
import { transformCreateData } from "../../utils/createUtils";
import ComplainPopup from "../../components/ComplainPopUp";



const NewComplaint = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();


  const reqCreate = {
    url: `/pgr-services/pgr-service/request/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async(data) => {
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `/pgr-services/pgr-serive/request/_create`,
        params: {},
        body: {
          PGREntity: {
            service: {
              // complaintNumber: `${data?.complaintNumber}`,
              serviceCode: `${data?.complaintType?.serviceCode}`,
            },
          },
        },
        config: {
          enable: true,
        },
      },
      {
        onSuccess: async (result) => {
          console.log("result" , result);
          history.push(
            `/${window.contextPath}/employee/campaign/response?complaintNumber=${result?.complaintNumber}&isSuccess=${true}`,
            {
              message: "Complaint Submitted",
              text: "Complaint Submitted",
              info:"The notification along with your complaint number is sent to your complainant’s mobile number. Complainant can track the complaint status using mobile or web app.",
              actionLabel: "Go Back To Home",
              actionLink: `/${window.contextPath}/employee`,
            }
          );
        },
        onError: (error, result) => {
          history.push(
            `/${window.contextPath}/employee/sample/response?complaintNumber=${result?.complaintNumber}&isSuccess=${falses}`,
            {
              message: "Complaint Submitted",
              text: "Complaint Submitted",
              info:"The notification along with your complaint number is sent to your complainant’s mobile number. Complainant can track the complaint status using mobile or web app.",
              actionLabel: "Go Back To Home",
              actionLink: `/${window.contextPath}/employee`,
            }
          );
        }}
    );
  };
  return (
    <div>
      <Header> {t("New Complaints")}</Header>
      <ComplainPopup showPopUp={false} header={"resolve"} ></ComplainPopup>
      <FormComposerV2
        label={t("Submit Application")}
        config={newConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={{}}
        onFormValueChange ={ (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={{ marginRight: 0 }}
      />
       
    </div>
  );
}

export default NewComplaint;