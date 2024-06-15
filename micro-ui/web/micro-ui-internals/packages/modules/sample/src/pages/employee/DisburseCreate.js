
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import useCustomAPIMutationHook from "../../hooks/useCustomAPIMutationHook";
import { newConfig } from "../../configs/DisburseCreateConfig";



const DisburseCreate = () => {
  const [toastMessage, setToastMessage] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  // const { isLoading, data: projectType } = Digit.Hooks.useCustomMDMS("pg", "exchange", [{ name: "ExchangeServers" }]);
  const [gender, setGender] = useState("");
  const reqCreate = {
     url: `program-service/disburse/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  



  const mutation = useCustomAPIMutationHook(reqCreate);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };


  const onSubmit = async(data) => {
    console.log(data, "data");
    setToastMessage("Form submitted successfully!");
    await mutation.mutate(
      {
        // url: `/mukta/program-service/v1/program/_create`,
        // params: { tenantId: "pg.citya" },
        body: {
          "Disbursement": {
            "tenantId": tenantId,
            "programCode": data.program_code,
            "projectCode": data.project_code,
            "targetId": data.target_id,
            // "transactionId": "PI/2023-24/00001,BENF/2023-24/00001",
            "sanctionId": data.sanction_id,
            "accountCode": data.account_code,
            "netAmount": data.net_amount,
            "grossAmount": data.gross_amount,
            "individual": {
              "name": data.name,
              "email": data.email,
              "phone": data.phone,
              "pin": data.pin,
              "address": data.address
            },
            "status": {
              "statusCode": data.statusCode,
              "statusMessage": "string"
            },
            "additionalDetails": {}
          }
},
        config: {
          enable: true,
        },
      },
    );

    const configs = newConfig;

  };

  return (
    <div>
      <h1> Create Program</h1>
      <FormComposerV2
        label={t("Submit")}
        config={newConfig.map((config) => {
          return {
            ...config,


          };
        })}
        defaultValues={{}}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={{ marginRight: 0 }}

      />
        {/* Toast Component */}
        {toastMessage && (
        <div style={{ backgroundColor: "lightblue", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>
          <div>{toastMessage}</div>
        </div>
      )}
    </div>
  );
}

export default DisburseCreate;