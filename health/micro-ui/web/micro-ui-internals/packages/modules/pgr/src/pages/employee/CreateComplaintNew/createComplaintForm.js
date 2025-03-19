import { FormComposer, FormComposerV2, Header } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import debounce from 'lodash/debounce';
import {Toast} from '@egovernments/digit-ui-components'
import { formPayloadToCreateComplaint } from "../../../utils";

const navConfig =  [
    {
        name:"WO_Details",
        code:"COMMON_WO_DETAILS",
    },
    {
        name:"Terms_And_Conditions",
        code:"COMMON_TERMS_&_CONDITIONS",
    }
];

const CreateComplaintForm = ({createComplaintConfig, sessionFormData, setSessionFormData, clearSessionFormData, tenantId, preProcessData,}) => {
    const {t} = useTranslation();
    const [toast, setToast] = useState({show : false, label : "", type : ""});
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    let user = Digit.UserService.getUser();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [inputFormdata, setInputFormData] = useState([]);
    

    const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
        if (!_.isEqual(sessionFormData, formData)) {

            const ComplainantName = formData?.ComplainantName;
            const ComplaintDescription = formData?.description;
    
        if (ComplainantName && !ComplainantName.match(Digit.Utils.getPattern("Name"))) {
          if (!formState.errors.ComplainantName) {
            setError("ComplainantName", { type: "custom", message: t("CORE_COMMON_APPLICANT_NAME_INVALID") }, { shouldFocus: false });
          }
        } else {
          if (formState.errors.ComplainantName) {
            clearErrors("ComplainantName");
          }
        }

            setSessionFormData({ ...sessionFormData, ...formData });
        }
    }

    const handleToastClose = () => {
        setToast({show : false, label : "", type : ""});
    }

    const { mutate: CreateWOMutation } = Digit.Hooks.pgr.useCreateComplaint(tenantId);

    //remove Toast after 3s
    useEffect(()=>{
        if(toast?.show) {
        setTimeout(()=>{
            handleToastClose();
        },3000);
        }
    },[toast?.show]);


    const onFormSubmit = (_data) => {
        console.log("onFormSubmit", _data);
        setInputFormData(_data);
        console.log("setInputFormData", _data);
        const payload =  formPayloadToCreateComplaint(_data, tenantId, user?.info);
        handleResponseForCreateWO(payload);
        // setShowModal(true);
    }

    const handleResponseForCreateWO = async(payload) => {
        setIsButtonDisabled(true);
        await CreateWOMutation(payload, {
            onError: async (error, variables) => {
                setIsButtonDisabled(false);
                sendDataToResponsePage("FAILED_TO_CREATE_COMPLAINT",);
            },
            onSuccess: async (responseData, variables) => {
                if(responseData?.ResponseInfo?.Errors) {
                        setIsButtonDisabled(false)
                        setToast(()=>({show : true, label : t("FAILED_TO_CREATE_COMPLAINT"), type : "error"}));
                    }else{
                        setIsButtonDisabled(false);
                        sendDataToResponsePage("CS_COMMON_COMPLAINT_SUBMITTED", "CS_COMMON_TRACK_COMPLAINT_TEXT", "CS_PGR_COMPLAINT_NUMBER", responseData?.ServiceWrappers?.[0]?.service?.serviceRequestId );
                        clearSessionFormData();
                    }
            },
        });
    }

    // const modifyParams = {
    //     contractID,
    //     contractNumber,
    //     lineItems,
    //     contractAuditDetails,
    //     updateAction : isModify ? "EDIT" : "",
    // }

    // const OnModalSubmit = async (modalData) => {
    //     modalData = Digit.Utils.trimStringsInObject(modalData)
    //     const payload =  formPayloadToCreateComplaint(formData, tenantId, user?.info);
    //         handleResponseForCreateWO(payload);
        
    // };

    // const debouncedOnModalSubmit = Digit.Utils.debouncing(OnModalSubmit,500);

    const handleSubmit = (_data) => {
        // Call the debounced version of onModalSubmit
        // debouncedOnModalSubmit(_data);
      };

    const sendDataToResponsePage = (message, description, info, responseId) => {
        history.push({
          pathname: `/${window?.contextPath}/employee/pgr/complaint-success`,
          state : {
            message : message,
            description: description,
            info: info,
            responseId: responseId,
          }
        }); 
      }

      console.log("createComplaintForm", );

    return (
        <React.Fragment>
             {/* {
                showModal && 
                <WorkflowModal
                    closeModal={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    config={CreateComplaintConfig}
                    isDisabled={isButtonDisabled}
                />
            } */}
            {/* <Header styles={{fontSize: "32px"}}>{isModify ? t("COMMON_MODIFY_WO") : t("ACTION_TEST_CREATE_WO")}</Header> */}
                {
                    (
                    <FormComposerV2
                        onSubmit={onFormSubmit}
                        defaultValues={sessionFormData}
                        heading={t("")}
                        config={createComplaintConfig}
                        className={"custom-form"}
                        onFormValueChange={onFormValueChange}
                        isDisabled={false}
                        label={t("CORE_COMMON_SUBMIT")}
                    />
                    )
                }
               {toast?.show && <Toast type={toast?.type} label={toast?.label} isDleteBtn={true} onClose={handleToastClose} />}
        </React.Fragment>
    )
}

export default CreateComplaintForm;