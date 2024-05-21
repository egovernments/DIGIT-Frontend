import { Dropdown, Loader } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'

const getModalConfig = ({
    t,
    approvers,
    selectedApprover,
    setSelectedApprover,
    approverLoading = false,
    isModify
}) => {

    let checkConditions = true



    return {
        label: {
            heading: isModify?`EXP_UPDATE_AND_FORWARD`:`EXP_CREATE_AND_FORWARD`,
            submit: `EXP_FORWARD`,
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
                            approverLoading ? <Loader /> : <Dropdown
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