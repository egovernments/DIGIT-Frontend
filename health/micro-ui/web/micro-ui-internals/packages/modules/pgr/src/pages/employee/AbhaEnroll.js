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
    AlertCard
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
                                message: "ABHA Enrollment Successful",
                                description: "Citizen has been successfully enrolled into ABHA system.",
                                // info: `Abha Number : ${data?.abhaNumber}, IndividualId : ${data?.individualId}`,
                                responses: [
                                    `ABHA Number: ${data?.abhaNumber}`,
                                    `Patient ID: ${data?.individualId}`
                                ]
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
            <p style={{ fontSize: "20px", color: "#787878", marginTop: "0", marginBottom: "1.5rem" }}>
                {t("Enroll a citizen into the ABHA (Ayushman Bharat Health Account) system by verifying Aadhaar and linking a mobile number.")}
            </p>



            <Card style={{ padding: "20px", marginBottom: "20px" }}>
                {/* Tabs */}
                <HeaderComponent >
                    {t("Aadhaar Verification for Enrollment")}
                </HeaderComponent>

                <p style={{ fontSize: "20px", color: "#787878", marginTop: "0", marginBottom: "1.5rem" }}>
                    {t("Please enter the Aadhaar number to send an OTP. Once verified, link the registered mobile number to create a new ABHA ID.")}
                </p>

                <div style={{ display: "flex", gap: "24px", marginBottom: "1.5rem" }}>
                    <Tag label={'Enroll'} className={"campaign-tag"} />
                    <Tag label={'Verify'} />
                    <Tag label={'Download'} />
                </div>

                <Stepper
                    customSteps={["Send Aadhar OTP", "Verify and Enroll"]}
                    currentStep={currentStep}
                    onStepClick={(currentStep) => { }}
                    direction={"horizontal"}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {currentStep === 1 && (
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                {t("Aadhar Number")}
                            </div>
                            <TextInput
                                style={{ alignItems: "center" }}
                                name="aadhaarNumber"
                                value={aadhaarNumber || ""}
                                onChange={(e) => setAadhaarNumber(e.target.value)}
                                disabled={false}
                                label={t("AADHAR NUMBER")}
                                placeholder={t("Enter valid 12 digit Aadhar Number")}
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <>

                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Enter OTP")}
                                </div>
                                <TextInput
                                    name="mobile"
                                    onChange={(e) => { setValidOTP(e.target.value) }}
                                    label={t("MOBILE_NUMBER")}
                                    placeholder={t("Enter OTP received on Aadhaar linked mobile number")}
                                />
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Enter Aadhar linked Mobile Number")}
                                </div>
                                <TextInput
                                    name="mobile"
                                    onChange={(e) => { setMobileNumber(e.target.value) }}
                                    label={t("MOBILE_NUMBER")}
                                    placeholder={t("Enter Mobile Number linked with Aadhaar")}
                                />
                            </div>
                            <AlertCard
                                populators={{
                                    name: "infocard",
                                }}
                                variant="default"
                                text={t('The mobile number becomes the citizen’s primary channel for login, consent, and health record notifications in ABDM.')}
                            />
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
                        label={currentStep === 1 ? t("Send OTP") : t("Verify and Enroll")}
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
                        label={currentStep === 1 ? t("send OTP") : t("Verify and Enroll")}
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
