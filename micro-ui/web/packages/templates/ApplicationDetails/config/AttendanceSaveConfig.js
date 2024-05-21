import { Dropdown, Loader } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'

const getModalConfig = ({
    t,
    approverList:approvers,
    selectedApprover,
    setSelectedApprover,
}) => {

    let checkConditions = true

    return {
        label: {
            heading: `ATM_EDIT_MUSTER`,
            submit: `ATM_RESUBMIT`,
            cancel: "WORKS_CANCEL",
        },
        form: [
            {
                body: [
                    {
                        label: !checkConditions ? null : t("WORKS_ASSIGNEE_NAME"),
                        //placeholder: !checkConditions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
                        isMandatory: false,
                        type: "goToDefaultCase",
                        populators: !checkConditions ? null : (
                             <Dropdown
                                name={"approver"}
                                option={approvers}
                                autoComplete="off"
                                optionKey="nameOfEmp"
                                id="fieldInspector"
                                select={setSelectedApprover}
                                selected={selectedApprover}
                                optionCardStyles={{"top":"2.3rem"}}
                            />
                        ),
                    },
                    {
                        label: t("WF_COMMON_COMMENTS"),
                        type: "textarea",
                        populators: {
                            name: "comments",
                        },
                    },
                ]
            }
        ]
    }
}

export default getModalConfig