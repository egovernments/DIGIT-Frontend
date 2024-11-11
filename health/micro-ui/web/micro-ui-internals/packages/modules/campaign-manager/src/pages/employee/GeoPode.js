import { Card, Loader } from "@egovernments/digit-ui-components";
import { Button, ActionBar, TextInput, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { Svgicon } from "../../utils/Svgicon";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import FinalPopup from "../../components/FinalPopup";
import { isError } from "lodash";


const GeoPode = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchParams = new URLSearchParams(location.search);
    const hierarchyType = searchParams.get("hierarchyType");
    const defaultHierarchyType = searchParams.get("defaultHierarchyType")
    const newHierarchy = JSON.parse(searchParams.get("newHierarchy"));
    const [showFinalPopup, setShowFinalPopup] = useState(false);
    let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
    // const state = window.history.state;
    const state = location.state;

    let receivedData = state?.data?.boundaryHierarchy;
    const [boundaryData, setBoundaryData] = useState((receivedData === undefined ? [] : receivedData));
    const [newBoundaryData, setNewBoundaryData] = useState([]);
    const [firstPage, setFirstPage] = useState(true);
    const [showToast, setShowToast] = useState(null); // State to handle toast notifications
    const [showLoader, setShowLoader] = useState(false);
    const { mutateAsync: localisationMutateAsync } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, locale);

    const language = Digit.StoreData.getCurrentLanguage();
    const modulePrefix = "hcm";
    const stateCode = Digit.ULBService.getCurrentTenantId();
    const getModuleCode = (hierarchyType) => `boundary-${hierarchyType.toLowerCase().replace(/\s+/g, "_")}`;
    const moduleCode = getModuleCode(defaultHierarchyType);
    const { isLoading, data } = Digit.Services.useStore({
        stateCode,
        moduleCode,
        language,
        modulePrefix,
    });

    useEffect(() => {
        addLevel();
    }, []);
    const addLevel = () => {
        setNewBoundaryData((prevItems) => [...prevItems, { active: true, boundaryType: "", parentBoundaryType: "" }]);
    }
    const addLevelName = (name, index) => {
        setNewBoundaryData((prevItems) =>
            prevItems.map((item, id) =>
                id === index ? { ...item, boundaryType: name } : item))

    }
    const removeLevel = (index) => {
        setNewBoundaryData((prevItems) => {
            const filteredData = prevItems.filter((item, idx) => idx !== index);
            return filteredData;
        })
    }

    const callCreate = async () => {
        let defData = boundaryData;
        if (newHierarchy === true) {
            defData = [];
        }
        let flag = false;
        // Loop through each item in newBoundary to check for empty boundaryType
        newBoundaryData.forEach(item => {
            if (item.boundaryType === "") {
                const error = new Error("LEVELS_CANNOT_BE_EMPTY");
                throw error;
            }
        });
        const res = await Digit.CustomService.getResponse({
            url: `/boundary-service/boundary-hierarchy-definition/_create`,
            body: {
                BoundaryHierarchy: {
                    tenantId: tenantId,
                    hierarchyType: hierarchyType,
                    boundaryHierarchy: [...defData, ...newBoundaryData],
                }
            }
        });
        return res;

    }

    const generateFile = async () => {
        const res = await Digit.CustomService.getResponse({
            url: `/project-factory/v1/data/_generate`,
            body: {
            },
            params: {
                tenantId: tenantId,
                type: "boundaryManagement",
                forceUpdate: true,
                hierarchyType: hierarchyType,
                campaignId: "default"
            }
        });
        return res;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const createNewHierarchy = async () => {

        try {
            // setShowLoader(true);
            setShowToast({ label: "HIERARCHY_PLEASE_WAIT", isError: "info", transitionTime:100});
            const res = await callCreate();
            const res1 = await generateFile();
            const bh = res?.BoundaryHierarchy?.[0]?.boundaryHierarchy;
            const local = bh.map(item => ({
                code: `${hierarchyType}_${item.boundaryType}`.toUpperCase().replace(/\s+/g, "_"),
                message: item.boundaryType,
                module: `hcm-boundary-${hierarchyType.toLowerCase().replace(/\s+/g, "_")}`,
                locale: locale
            }));
            const localisationResult = await localisationMutateAsync(local);
            if (!localisationResult.success) {
                setShowToast({ label: "BOUNDARY_LOCALISATION_ERROR", isError: "error" });
                // return; // Exit if localization fails
            }
            setShowToast({ label: t("HIERARCHY_CREATED_SUCCESSFULLY"), isError: "success" });


            await sleep(2000);

            history.push(
                `/${window.contextPath}/employee/campaign/boundary/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
                {}
            );

        } catch (error) {
            // setShowToast({ label: error?.response?.data?.Errors?.[0]?.message ? error?.response?.data?.Errors?.[0]?.message : t("HIERARCHY_CREATION_FAILED"), isError: "error" });
            // setShowLoader(false);
            const errorMessage = error.message === "LEVELS_CANNOT_BE_EMPTY"
                ? t("LEVELS_CANNOT_BE_EMPTY")
                : error?.response?.data?.Errors?.[0]?.message || t("HIERARCHY_CREATION_FAILED");

            setShowToast({ label: errorMessage, isError: "error" });
        }
    }

    const goBackToBoundary = () => {
        history.push(
            `/${window.contextPath}/employee/campaign/boundary/home?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
            { data: state }
        );

    }

    const addParents = () => {
        setNewBoundaryData((prevItems) => {
            // Loop through the array starting from the second element
            return prevItems.map((item, idx) => {
                if (idx === 0) {
                    if (newHierarchy) item.parentBoundaryType = null;
                    else {
                        if (boundaryData.length === 0) item.parentBoundaryType = null;
                        else item.parentBoundaryType = boundaryData[boundaryData.length - 1].boundaryType;

                    }
                }
                if (idx > 0) {
                    item.parentBoundaryType = prevItems[idx - 1].boundaryType;
                }
                return item;
            });
        });

    }

    if (isLoading || showLoader) {
        return (
            <Loader />
        )
    }
    else {

        if (newHierarchy == false) {
            return (
                <React.Fragment>
                    {firstPage && !newHierarchy && <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>Boundary data from GeoPoDe</div>
                            <Button
                                icon={"Preview"}
                                type={"button"}
                                size={"large"}
                                variation={"secondary"}
                                label={t("PREVIEW_ON_MAP")}
                                onClick={() => {
                                    // setShowPopUp(true);
                                }}
                            />
                        </div>
                        <div style={{ height: "2rem" }}></div>
                        <div>
                            {boundaryData.map((item, index) => (
                                <div key={`boundary-${index}`}>
                                    <div style={{ fontWeight: "600", fontSize: "1.2rem" }}>
                                        {/* {item?.boundaryType} */}
                                        {`${t((defaultHierarchyType + "_" + item?.boundaryType).toUpperCase().replace(/\s+/g, "_"))}`}
                                    </div>
                                    <div style={{ height: "1rem" }}></div>
                                    <Card type={"primary"} variant={"form"} className={"question-card-container"} >
                                        <div style={{ display: "flex", gap: "2rem" }}>
                                            <Svgicon />
                                            <div style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
                                                {`${t((defaultHierarchyType + "_" + item?.boundaryType).toUpperCase().replace(/\s+/g, "_"))}`}{"-geojson.json"}
                                            </div>
                                        </div>
                                    </Card>
                                    <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
                                </div>
                            ))}
                        </div>
                    </Card>
                    }
                    {firstPage && newBoundaryData.length > 0 && (
                        <div>
                            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                                <div>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{t("NEWLY_ADDED_BOUNDARY_DATA")}</div>
                                    <div style={{ height: "2rem" }}>
                                    </div>
                                </div>
                                <div>
                                    {
                                        newBoundaryData.map((item, index) => (
                                            <div>
                                                <div style={{ display: "flex" }}>
                                                    <div style={{ width: "20rem", marginTop: "0.6rem", fontWeight: "600" }}>{t("LEVEL")} {boundaryData.length + index + 1}</div>
                                                    <div style={{ display: "flex", gap: "1rem" }}>
                                                        <TextInput
                                                            type={"text"}
                                                            populators={{
                                                                resizeSmart: false
                                                            }}
                                                            style={{ width: "27rem", display: "flex", justifyContent: "flex-end" }}
                                                            value={item?.boundaryType}
                                                            onChange={(event) => addLevelName(event.target.value, index)}
                                                            placeholder={""}
                                                        />
                                                        <div className="dustbin-icon" onClick={() => removeLevel(index)}>
                                                            <DustbinIcon />
                                                        </div>

                                                    </div>
                                                </div>
                                                <div style={{ height: "1.5rem" }}></div>
                                            </div>
                                        ))
                                    }
                                    <Button
                                        className="custom-class"
                                        icon="Add"
                                        iconFill=""
                                        label={t("ADD_HIERARCHY_LEVEL")}
                                        onClick={() => addLevel()}
                                        size="medium"
                                        title=""
                                        variation="teritiary"
                                        textStyles={{ width: 'unset' }}
                                    />
                                </div>
                                <div style={{height:"2rem"}}></div>
                            </Card>
    
                        </div>
                    )
                    }
                    <FinalPopup showFinalPopUp={showFinalPopup} setShowFinalPopup={setShowFinalPopup} addParents={addParents} createNewHierarchy={createNewHierarchy} />
                    <ActionBar
                        actionFields={[
                            <Button
                                icon="ArrowBack"
                                style={{ marginLeft: "3.5rem" }}
                                label={t("BACK")}
                                onClick={goBackToBoundary}
                                type="button"
                                variation="secondary"
                                textStyles={{ width: 'unset' }}
                            />,
                            <Button
                                icon="ArrowForward"
                                style={{ marginLeft: "auto" }}
                                isSuffix
                                label={t("NEXT")}
                                // onClick={goToPreview} 
                                onClick={() => { setShowFinalPopup(true) }}
                                type="button"
                                textStyles={{ width: 'unset' }}
                            />
                        ]}
                        className="custom-action-bar"
                        maxActionFieldsAllowed={5}
                        setactionFieldsToRight
                        sortActionFields
                        style={{}}
                    />

                    {showToast && <Toast label={showToast.label} type={showToast.isError} transitionTime={showToast?.transitionTime} onClose={() => setShowToast(null)} />}
                </React.Fragment>

            );
        }
        else {
            return (
                <React.Fragment>
                    {firstPage && (
                        <div>
                            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{t("CREATE_BOUNDARY_HIERARCHY")}</div>
                                </div>
                                <div style={{ height: "1.5rem" }}></div>
                                <div>
                                    {t("MSG")}
                                </div>
                                <div style={{ height: "2rem" }}></div>
                                <div>
                                    {
                                        newBoundaryData.map((item, index) => (
                                            <div>
                                                <div style={{ display: "flex" }}>
                                                    <div style={{ width: "20rem", marginTop: "0.6rem", fontWeight: "600" }}>{t("LEVEL")} {index + 1}</div>
                                                    <div style={{ display: "flex", gap: "1rem" }}>
                                                        <TextInput
                                                            type={"text"}
                                                            populators={{
                                                                resizeSmart: false
                                                            }}
                                                            style={{ width: "27rem", display: "flex", justifyContent: "flex-end" }}
                                                            value={item?.boundaryType}
                                                            onChange={(event) => addLevelName(event.target.value, index)}
                                                            placeholder={""}
                                                        />
                                                        <div className="dustbin-icon" onClick={() => removeLevel(index)}>
                                                            <DustbinIcon />
                                                        </div>

                                                    </div>
                                                </div>
                                                <div style={{ height: "1.5rem" }}></div>
                                            </div>
                                        ))
                                    }
                                    <Button
                                        className="custom-class"
                                        icon="Add"
                                        iconFill=""
                                        label={t("ADD_HIERARCHY_LEVEL")}
                                        onClick={() => addLevel()}
                                        size="medium"
                                        title=""
                                        variation="secondary"
                                        textStyles={{ width: 'unset' }}
                                    />
                                </div>
                            </Card>
                        </div>
                    )}
                    <FinalPopup showFinalPopUp={showFinalPopup} setShowFinalPopup={setShowFinalPopup} addParents={addParents} createNewHierarchy={createNewHierarchy} />
                    <ActionBar
                        actionFields={[
                            <Button
                                icon="ArrowBack"
                                style={{ marginLeft: "3.5rem" }}
                                label={t("Back")}
                                onClick={goBackToBoundary}
                                type="button"
                                variation="secondary"
                                textStyles={{ width: 'unset' }}
                            />,
                            <Button
                                icon="ArrowForward"
                                style={{ marginLeft: "auto" }}
                                isSuffix
                                label={t("Next")}
                                // onClick={goToPreview} 
                                onClick={() => { setShowFinalPopup(true) }}
                                type="button"
                                textStyles={{ width: 'unset' }}
                            />
                        ]}
                        className="custom-action-bar"
                        maxActionFieldsAllowed={5}
                        setactionFieldsToRight
                        sortActionFields
                        style={{}}
                    />
                    {showToast && <Toast label={showToast.label} type={showToast.isError} transitionTime={showToast?.transitionTime} onClose={() => setShowToast(null)} />}

                </React.Fragment>


            );
        }
    }

};


export default GeoPode;