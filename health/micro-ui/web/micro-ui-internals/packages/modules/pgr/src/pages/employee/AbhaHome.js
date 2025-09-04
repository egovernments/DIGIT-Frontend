import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
    Loader,
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
    Footer,
} from "@egovernments/digit-ui-components";
import { set } from "lodash";

const AbhaHelpDeskConsole = () => {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("download"); // enroll | verify | download | check
    const [data, setData] = useState(null);
    const [abhaData, setAbhaData] = useState(null);
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [validOTP, setValidOTP] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [downloadOption, setDownloadOption] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, label: "", type: "" });

    useEffect(() => {
        if (toast?.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, label: "", type: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast?.show]);

    const handleToastClose = () => {
        setToast({ show: false, label: "", type: "" });
    };

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
                        console.log("data", data);
                        setData(data);
                        setCurrentStep(2);
                        setToast({ key: "success", label: t("success"), type: "success" });

                    },
                    onError: (error) => {
                        setToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }
                }
            );
        } catch (error) {
            setToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
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
                        }

                    }
                },
                {
                    onSuccess: (data) => {
                        console.log("data", data);
                        setAbhaData(data);
                        setCurrentStep(3);
                        setToast({ key: "success", label: t("success"), type: "success" });

                    },
                    onError: (error) => {
                        setToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }
                }
            );
        } catch (error) {
            setToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
        }
    }


    const mutation2 = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/login/profile/verify-otp",
    });

    const downloadFiles = async () => {
        console.log(downloadOption, "downloadOption");
        try {
            await mutation3.mutateAsync(
                {
                    body: {
                        abha_number: abhaData?.accounts?.[0]?.ABHANumber,
                        card_type: downloadOption?.code === "PNG" ? "getPngCard" : "getCard",
                        token: abhaData?.token,
                        refresh_token: abhaData?.refreshToken,
                        test: {
                            tenantId: tenantId,
                        }
                    }
                },
                {
                    onSuccess: (data) => {
                        console.log("data", data);
                        // setAbhaData(data);
                        // setCurrentStep(3);
                        setToast({ key: "success", label: t("success"), type: "success" });

                    },
                    onError: (error) => {
                        setToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }
                }
            );
        } catch (error) {
            setToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
        }
    }


    const mutation3 = Digit.Hooks.useCustomAPIMutationHook({
        url: "/hcm-abha/api/abha/card/fetch-v2",
    });

    if (loading || mutation.loading || mutation2.loading) return <Loader />;

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
                {t("CHECK ABHA ENROLLMENT")}
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
                    customSteps={["SEND OTP", "VARIFY OTP", "DOWNLOAD CARD"]}
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

            <Footer
                actionFields={[
                    <Button
                        style={{ margin: "1rem 0", minWidth: "16rem", alignItems: "center" }}
                        variation="primary"
                        label={currentStep === 1 ? t("SEND_OTP") : currentStep === 2 ? t("VERIFY_OTP") : t("DOWNLOAD_CARD")}
                        title={t("SEND_OTP")}
                        onClick={currentStep === 1 ? fetchOtp : currentStep == 2 ? varifyOTP : downloadFiles}
                        isDisabled={(!aadhaarNumber || aadhaarNumber.length !== 12) && currentStep === 1}
                    />
                ]}
                className=""
                maxActionFieldsAllowed={5}
                setactionFieldsToRight
                sortActionFields
                style={{}}
            />



            {toast.show && (
                <Toast
                    type={toast.type}
                    label={toast.label}
                    isDleteBtn={true}
                    onClose={handleToastClose}
                />
            )}
        </React.Fragment>
    );
};

export default AbhaHelpDeskConsole;
