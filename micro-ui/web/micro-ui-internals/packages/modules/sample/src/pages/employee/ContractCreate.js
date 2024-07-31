import { FormComposerV2, Header } from '@egovernments/digit-ui-react-components';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { contractConfig } from '../../configs/CreateContractConfig';
import { transformCreateContractData } from '../../utils/createContractUtils';

const ContractCreate = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const reqCreate = {
      url: `/mdms-v2/v2/_create/digitAssignment.contract`,
      params: {},
      body: {},
      config: {
        enable: false,
      },
    };

    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

    const onSubmit = async (data) => {
        console.log(data);
        await mutation.mutate(
          {
            url: `/mdms-v2/v2/_create/digitAssignment.contract`,
            params: { tenantId },
            body: transformCreateContractData(data),
            config: {
              enable: true,
            },
          }
        ) 
    }
  return (
    <div>
        <Header>{t("CREATE_ESTIMATE")}</Header>
        <FormComposerV2
          label={t("SUBMIT_BUTTON")} 
          config={contractConfig.map((config) => {
            return {
                ...config,
            }
          })}
          defaultValues={{}}
          onSubmit={(data,) => onSubmit(data, )}       
        />
    </div>

  )
}

export default ContractCreate