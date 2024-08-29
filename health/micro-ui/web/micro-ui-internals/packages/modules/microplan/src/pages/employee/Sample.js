import { FormComposer,Header, Loader } from '@egovernments/digit-ui-react-components'
import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { configChecklist } from '../../configs/SampleConfig'
const Checklist = (props) => {
    const { t } = useTranslation()
    const onSubmit = (data) => {
    }
    const tenant = Digit.ULBService.getStateId();
    const [showForm, setShowForm] = useState(false)
    const { isLoading, data: checklistData } = Digit.Hooks.useCustomMDMS(
        tenant,
        "works",
        [
            {
                "name": "ClosureChecklist"
            },
            {
                "name": "KickoffChecklist"
            }
        ]
    );
    
    if(isLoading) return <Loader />
    
  return (
    <React.Fragment>
        <Header styles={{ marginLeft: "15px" }}>{t("WORKS_CHECKLIST")}</Header>
        <FormComposer
            //heading={t("WORKS_KICKOFF_CHECKLIST")}
            label={t("CS_ACTION_DISPOSE")}
            //description={"Sample Description"}
            //text={"Sample Text"}
            config={configChecklist(t,setShowForm,showForm,checklistData).form.map((config) => {
                return {
                    ...config,
                    body: config?.body?.filter((a) => !a.hideInEmployee),
                };
            })}
            defaultValues={{}}
            onSubmit={onSubmit}
            fieldStyle={{ marginLeft: "0.5rem" }}
            showWrapperContainers={true}
            isDescriptionBold={true}
            noBreakLine={true}
            showFormInNav={true}
            showNavs={true}
            showMultipleCardsWithoutNavs={true}
            showMultipleCardsInNavs={false}
            labelBold={true}
        />
    </React.Fragment>
  )
}

export default Checklist