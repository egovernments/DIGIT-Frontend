import { FormComposerV2, Header, Toast } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import {transformCreateEstimateData} from '../../utils/createEstimateUtils'
import { estimateConfig } from '../../configs/CreateEstimateConfig';

const EstimateCreate = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const [toast, setToast] = useState({ show: false, error: false, message: "" });
    const [formKey, setFormKey] = useState(0);


    const reqCreate = {
      url: `/mdms-v2/v2/_create/digitAssignment.estimate`,
      params: {},
      body: {},
      config: {
        enable: false,
      },
    };

    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

    const onSubmit = async (data) => {
        // let flag = true
        // data.estimateDetails.forEach((detail) => {
        //   console.log(detail)
        //   detail.map((item) => {
        //     console.log(item)
        //   })
        // })
        await mutation.mutate(
          {
            url: `/mdms-v2/v2/_create/digitAssignment.estimate`,
            params: {},
            body: transformCreateEstimateData(data),
            config: {
              enable: true,
            },
          }, {
            onSuccess: () => {
              setToast({ show: true, error: false, message: t("CREATE_ESTIMATE_SUCCESS") });
              // logic to clear data
              setFormKey(prevkey => prevkey + 1)
            },
            onError: () => {
              setToast({ show: true, error: true, message: t("CREATE_ESTIMATE_FAILURE") });
            },
          }
        ) 
    }
  return (
    <div>
        <Header>{t("CREATE_ESTIMATE")}</Header>
        <FormComposerV2
          key={formKey}
          label={t("SUBMIT_BUTTON")} 
          config={estimateConfig.map((config) => {
            return {
                ...config,
            }
          })}
          defaultValues={{}}
          onSubmit={(data,) => onSubmit(data, )}       
        />
        {toast.show && 
            <Toast 
              error={toast.error} 
              label={toast.message} 
              onClose={() => setToast({ show: false, error: false, message: "" })}
              isDleteBtn={true}
            />}
    </div>

  )
}

export default EstimateCreate