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
    Loader,
    Tag,
    Stepper,
    Footer,
    PopUp,
} from "@egovernments/digit-ui-components";
import { set } from "lodash";

const AbhaHelpDeskConsole = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("download"); // enroll | verify | download | check
    const [data, setData] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [abhaData, setAbhaData] = useState(null);
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [validOTP, setValidOTP] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [downloadOption, setDownloadOption] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(null);


    const fetchOtp = async () => {
        try {
            await mutation.mutateAsync(
                {
                    body: {
                        loginHint: "aadhaar",
                        value: aadhaarNumber,
                        otpSystem: "aadhaar",
                        test: {
                            tenantId: tenantId,
                        }
                    }
                },
                {
                    onSuccess: (data) => {
                        console.log("dddddddddddd", data);
                        setShowToast({ key: "success", label: t(data?.message || ""), transitionTime: 3000 });
                        setData(data);
                        setCurrentStep(2);
                    },
                    onError: (error) => {
                        setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
                    }
                }
            );
        } catch (error) {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
        }
    }


    const mutation = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/login/profile/request-otp",
    });

    const varifyOTP = async () => {
        try {
            await mutation2.mutateAsync(
                {
                    body: {
                        txnId: data?.txnId,
                        otpValue: validOTP,
                        otpSystem: "aadhaar",
                        loginHint: "aadhaar",
                        test: {
                            tenantId: tenantId,
                        },
                        userDownload: true
                    }
                },
                {
                    onSuccess: (data) => {
                        setAbhaData(data);
                        setCurrentStep(3);
                        setShowToast({ key: "success", label: t(data?.message), transitionTime: 3000 });

                    },
                    onError: (error) => {
                        console.log("error", error);
                        if (error?.response?.data?.Errors?.[0]?.code === "ABDM-1114") {
                            setShowPopUp(true);
                        } else {
                            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
                        }
                    }
                }
            );
        } catch (error) {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
        }
    }


    const mutation2 = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/login/profile/verify-otp",
    });

    const downloadFiles = async () => {
        try {
            const res = await Digit.CustomService.getResponse({
                url: `/hcm-abha/api/abha/card/fetch-v2`,
                body: {
                    abha_number: abhaData?.accounts?.[0]?.ABHANumber,
                    card_type: downloadOption?.code === "PNG" ? "getPngCard" : "getCard",
                    token: abhaData?.token,
                    refresh_token: abhaData?.refreshToken,
                    test: { tenantId },
                },
                userDownload: true
            });
            console.log("res", res);
            // res.data will be ArrayBuffer here
            const blob = new Blob([res?.data], {
                type: downloadOption?.code === "PNG" ? "image/png" : "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = downloadOption?.code === "PNG" ? "card.png" : "card.pdf";
            link.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
        }
    };


    const mutation3 = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/card/fetch-v2",
        config: { userDownload: true },
    });

    if (loading || mutation.isLoading || mutation2.isLoading || mutation3.isLoading) return <Loader page={true} variant={"PageLoader"} />;

    const steps = [
        t("Send Aadhaar OTP"),
        t("Verify & Enroll"),
        t("Request Login OTP"),
        t("Verify Login OTP"),
        t("Download Card"),
    ];

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
                    <Tag label={'Search'} className={"campaign-tag"} />
                    <Tag label={'Varify'} />
                    <Tag label={'Download'} />
                </div>

                <Stepper
                    customSteps={["SEND OTP", "VERIFY OTP", "DOWNLOAD CARD"]}
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
                                    {t("Login Id")}
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
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Abha Number")}
                                </div>
                                <TextInput
                                    name="otp"
                                    value={abhaData?.accounts?.[0]?.ABHANumber || ""}
                                    onChange={(e) => { }}
                                    label={t("ENTER_OTP")}
                                    placeholder={t("")}
                                />
                            </div>

                            <div style={{ display: "flex" }}>
                                <div style={{ width: "26%", fontWeight: "500", marginTop: "0.7rem" }}>
                                    {t("Download Option")}
                                </div>
                                <Dropdown
                                    option={[{ name: "PDF", code: "PDF" }, { name: "PNG", code: "PNG" }]}
                                    optionKey="name"
                                    selected={downloadOption}
                                    select={(value) => setDownloadOption(value)}
                                    t={t}
                                // disabled={disableEditing}
                                />
                            </div>
                        </>
                    )}
                </div>


            </Card>

            {showPopUp && (
                <PopUp
                    className='accessibility-pop-up'
                    onClose={() => setShowPopUp(false)}
                    heading={t(`ENROLL CITIZEN FOR ABHA?`)}
                    description={t(`NO ABHA RECORD WAS FOUND FOR THE ENTERED AADHAAR. DO YOU WANT TO START ENROLLMENT PROCESS NOW?`)}
                    children={[
                    ]}
                    onOverlayClick={() => setShowPopUp(false)}
                    footerChildren={[
                        <Button
                            className={"campaign-type-alert-button"}
                            type={"button"}
                            size={"large"}
                            variation={"secondary"}
                            label={t(`CANCEL`)}
                            onClick={() => setShowPopUp(false)}
                            // style={{ width: "160px" }}
                            title={t(`CANCEL`)}
                        />,
                        <Button
                            className={"campaign-type-alert-button"}
                            type={"button"}
                            size={"large"}
                            variation={"primary"}
                            title={t(`START ENROLLMENT`)}
                            label={t(`START ENROLLMENT`)}
                            // style={{ width: "160px" }}
                            onClick={() => {
                                history.push(`/${window.contextPath}/employee/pgr/abha-enroll`);
                            }} // Calls save function on click
                        //   isDisabled={!isChanged() || mutation.isLoading || disableEditing} // Disable if no changes are made or during API call
                        />,
                    ]}
                />
            )}

            {currentStep === 2 ? <Footer
                actionFields={[
                    <Button
                        style={{ margin: "1rem 0", minWidth: "16rem", alignItems: "center" }}
                        variation="secondary"
                        label={t("Resend OTP")}
                        title={t("Resend OTP")}
                        onClick={fetchOtp}
                    />,
                    <Button
                        style={{ margin: "1rem 0", minWidth: "16rem", alignItems: "center" }}
                        variation="primary"
                        label={t("VERIFY_OTP")}
                        title={t("SEND_OTP")}
                        onClick={varifyOTP}
                    />
                ]}
                className=""
                maxActionFieldsAllowed={5}
                setactionFieldsToRight
                sortActionFields
                style={{}}
            /> : <Footer
                actionFields={[
                    <Button
                        style={{ margin: "1rem 0", minWidth: "16rem", alignItems: "center" }}
                        variation="primary"
                        label={currentStep === 1 ? t("SEND_OTP") : t("DOWNLOAD_CARD")}
                        title={t("SEND_OTP")}
                        onClick={currentStep === 1 ? fetchOtp : downloadFiles}
                        isDisabled={(!aadhaarNumber || aadhaarNumber.length !== 12) && currentStep === 1}
                    />
                ]}
                className=""
                maxActionFieldsAllowed={5}
                setactionFieldsToRight
                sortActionFields
                style={{}}
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

export default AbhaHelpDeskConsole;
