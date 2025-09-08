import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import {
    Card,
    LabelFieldPair,
    Button,
    Toast,
    TextInput,
    HeaderComponent,
    ActionBar,
    Header,
    Dropdown,
    Tag,
    Stepper,
    Loader,
    Footer,
    PopUp,
} from "@egovernments/digit-ui-components";
import { set } from "lodash";
import { use } from "react";

const AbhaEnrollPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("download"); // enroll | verify | download | check
    const [data, setData] = useState(null);
    const userInfo = Digit.UserService.getUser();
    const [showPopUp, setShowPopUp] = useState(true);
    const [abhaData, setAbhaData] = useState(null);
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [validOTP, setValidOTP] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(null);


    const fetchOtp = async () => {
        setLoading(true);
        try {
            await mutation.mutateAsync(
                {
                    body: {
                        aadhaarNumber: aadhaarNumber,
                        tenantId: tenantId,
                    },
                },
                {
                    onSuccess: (data) => {
                        setLoading(false);
                        setData(data);
                        setCurrentStep(2);
                        setShowToast({ key: "success", label: t(data?.message), transitionTime: 3000 });
                    },
                    onError: (error) => {
                        setLoading(false);
                        setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
                    },
                }
            );
        } catch (error) {
            setLoading(false);
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
        }
    };

    const mutation = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/create/send-aadhaar-otp",
    });

    const varifyAndEnroll = async () => {
        setLoading(true);
        try {
            await mutation2.mutateAsync(
                {
                    body: {
                        txnId: data?.txnId,
                        Otp: validOTP,
                        mobile: mobileNumber,
                        tenantId: tenantId,
                        clientReferenceId: crypto.randomUUID(),
                        localityCode: "ABHA_TEST_BOUNDARY_3_MO_01_01_05_ANCUABE_SEDE_5",
                        hcmAuthToken: userInfo?.access_token,
                        userId: userInfo?.info?.id,
                        userUuid: userInfo?.info?.uuid,
                    },
                },
                {
                    onSuccess: (data) => {
                        setLoading(false);
                        setAbhaData(data);

                        history.push({
                            pathname: `/${window.contextPath}/employee/pgr/enroll-success`,
                            state: {
                                message: "ABHA_ENROLLMENT_SUCCESSFUL",
                                info: `Abha Number : ${data?.abhaNumber}, IndividualId : ${data?.individualId}`
                            }
                        });
                    },
                    onError: (error) => {
                        setLoading(false);
                        setShowPopUp(true);
                        setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
                    },
                }
            );
        } catch (error) {
            setLoading(false);
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
        }
    };

    const mutation2 = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/create/verify-aadhaar-otp-v2",
    });

    if (loading) return <Loader page={true} variant={"PageLoader"} />;;

    return (
        <React.Fragment  >
            <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
                {t("ABHA HELP-DESK CONSOLE")}
            </HeaderComponent>
            {/* Page Header */}
            <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: "#f39c12" }}>
                    {t("WHETHER CITIZEN IS ENROLLED FOR ABHA OR NOT")}
                </p>
            </div>



            <Card style={{ padding: "20px", marginBottom: "20px" }}>
                {/* Tabs */}
                <HeaderComponent style={{ color: "#f39c12" }}>
                    {t("Aadhar Discovery")}
                </HeaderComponent>

                <div style={{ display: "flex", gap: "24px", marginBottom: "1.5rem" }}>
                    <Tag label={'Enroll'} className={"campaign-tag"} />
                    <Tag label={'Varify'} />
                    <Tag label={'Download'} />
                </div>

                <Stepper
                    customSteps={["SEND AADHAR OTP", "VERIFY AND ENROLL"]}
                    currentStep={currentStep}
                    onStepClick={(currentStep) => { }}
                    direction={"horizontal"}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {currentStep === 1 && (
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                {t("AADHAR NUMBER")}
                            </div>
                            <TextInput
                                style={{ alignItems: "center" }}
                                name="aadhaarNumber"
                                value={aadhaarNumber || ""}
                                onChange={(e) => setAadhaarNumber(e.target.value)}
                                disabled={false}
                                label={t("AADHAR NUMBER")}
                                placeholder={t("ENTER_VALID_AADHAAR")}
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Transaction Id")}
                                </div>
                                <TextInput
                                    name="otp"
                                    value={data?.txnId}
                                    onChange={(e) => { }}
                                    label={t("ENTER_OTP")}
                                    placeholder={t("")}
                                />
                            </div>

                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Enter OTP")}
                                </div>
                                <TextInput
                                    name="mobile"
                                    onChange={(e) => { setValidOTP(e.target.value) }}
                                    label={t("MOBILE_NUMBER")}
                                    placeholder={t("ENTER VALID OTP RECIEVED ON MOBILE")}
                                />
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Enter Mobile Number")}
                                </div>
                                <TextInput
                                    name="mobile"
                                    onChange={(e) => { setMobileNumber(e.target.value) }}
                                    label={t("MOBILE_NUMBER")}
                                    placeholder={t("ENTER MOBILE NUMBER REGISTERED WITH AADHAAR")}
                                />
                            </div>
                        </>
                    )}

                </div>


            </Card>

            {currentStep === 1 ? <Footer
                actionFields={[
                    <Button
                        key="main"
                        type={"button"}
                        size={"large"}
                        variation={"primary"}
                        label={currentStep === 1 ? t("SEND_OTP") : t("VARIFY AND ENROLL")}
                        title={t("SEND_OTP")}
                        onClick={fetchOtp}
                        isDisabled={(!aadhaarNumber || aadhaarNumber.length !== 12) && currentStep === 1}
                    />,

                ]}
                setactionFieldsToRight
            /> : <Footer
                actionFields={[
                    <Button
                        key={"secondary"}
                        type={"button"}
                        size={"large"}
                        variation={"secondary"}
                        label={t("Resend OTP")}
                        title={t("Resend OTP")}
                        onClick={fetchOtp} // example action
                    />,
                    <Button
                        key="main"
                        type={"button"}
                        size={"large"}
                        variation={"primary"}
                        label={currentStep === 1 ? t("SEND_OTP") : t("VARIFY AND ENROLL")}
                        title={t("SEND_OTP")}
                        onClick={varifyAndEnroll}
                        isDisabled={(!aadhaarNumber || aadhaarNumber.length !== 12) && currentStep === 1}
                    />,

                ]}
                setactionFieldsToRight
            />}


            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    // error={showToast.key === "error"}
                    transitionTime={showToast.transitionTime}
                    onClose={() => setShowToast(null)}
                />
            )}
        </React.Fragment>
    );
};

export default AbhaEnrollPage;
