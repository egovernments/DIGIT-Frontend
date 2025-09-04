import { Button, Footer, TextInput, Toast, Card, Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import { Svgicon } from "../../utils/Svgicon";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FinalPopup from "../../components/FinalPopup";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";

const BoundaryRelationCreate = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const hierarchyType = searchParams.get("hierarchyType");
  const defaultHierarchyType = searchParams.get("defaultHierarchyType");
  const newHierarchy = JSON.parse(searchParams.get("newHierarchy"));
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  // const state = window.history.state;
  const state = location.state;

  let receivedData = state?.data?.boundaryHierarchy;
  const [boundaryData, setBoundaryData] = useState(receivedData === undefined ? [] : receivedData);
  const [newBoundaryData, setNewBoundaryData] = useState([]);
  const [firstPage, setFirstPage] = useState(true);
  const [creatingData, setCreatingData] = useState(false);
  const [showToast, setShowToast] = useState(null); // State to handle toast notifications
  const [showLoader, setShowLoader] = useState(false);
  const [fileStoreId, setFileStoreId] = useState(null);
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
  };
  const addLevelName = (name, index) => {
    setNewBoundaryData((prevItems) => prevItems.map((item, id) => (id === index ? { ...item, boundaryType: name } : item)));
  };
  const removeLevel = (index) => {
    setNewBoundaryData((prevItems) => {
      const filteredData = prevItems.filter((item, idx) => idx !== index);
      return filteredData;
    });
  };

  const callCreate = async () => {
    let defData = boundaryData;
    if (newHierarchy === true) {
      defData = [];
    }
    let flag = false;
    // Loop through each item in newBoundary to check for empty boundaryType
    newBoundaryData.forEach((item) => {
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
        },
      },
    });
    return res;
  };

  const generateFile = async () => {
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/data/_generate`,
      body: {},
      params: {
        tenantId: tenantId,
        type: "boundaryManagement",
        forceUpdate: true,
        hierarchyType: hierarchyType,
        campaignId: "default",
      },
    });
    return res;
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const generateTemplate = async () => {
    const hier = newHierarchy === false ? defaultHierarchyType : hierarchyType;
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/data/_download`,
      body: {},
      params: {
        tenantId: tenantId,
        type: "boundaryManagement",
        hierarchyType: hier,
        campaignId: "default",
      },
    });
    return res;
  };

  const pollForTemplateGeneration = async () => {
    const pollInterval = 2000; // Poll every 2 seconds
    const maxRetries = 200; // Maximum number of retries
    let retries = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          if (retries >= maxRetries) {
            reject(new Error("Max template generation retries reached"));
            return;
          }

          const resFile = await generateTemplate();

          // Case 1: We got a valid fileStoreId
          if (resFile?.GeneratedResource?.[0]?.fileStoreid) {
            resolve(resFile.GeneratedResource[0].fileStoreid);
            return;
          }
          // Case 2: Status is in progress, continue polling
          else if (resFile?.GeneratedResource?.[0]?.status === "inprogress") {
            retries++;
            setTimeout(poll, pollInterval);
          }
          // Case 3: Empty response or invalid response
          else {
            retries++;
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          retries++;
          setTimeout(poll, pollInterval);
        }
      };

      // Start the polling
      poll().catch(reject);

      // Set a timeout for the entire polling operation
      const timeoutDuration = (maxRetries + 1) * pollInterval;
      setTimeout(() => {
        if (retries < maxRetries) {
          reject(new Error("Template generation polling timeout"));
        }
      }, timeoutDuration);
    });
  };

  const downloadExcelTemplate = async () => {
    try {
      setShowToast({ label: t("TEMPLATE_GENERATION_IN_PROGRESS"), isError: "info" });

      const fid = await pollForTemplateGeneration();
      setFileStoreId(fid);
      setShowToast({ label: t("TEMPLATE_GENERATED_SUCCESSFULLY"), isError: "success" });
      return fid;
    } catch (error) {
      let errorMessage;
      if (error.message === "Template generation polling timeout" || error.message === "Max template generation retries reached") {
        errorMessage = "TEMPLATE_GENERATION_TIMEOUT";
      } else {
        errorMessage = "TEMPLATE_GENERATION_FAILED";
      }
      setShowToast({ label: t(errorMessage), isError: "error" });
      throw error; // Propagate the error to the calling function
    }
  };

  const pollForStatusCompletion = async (id, typeOfData) => {
    const pollInterval = 2000;
    const maxRetries = 200;
    let retries = 0;
    let pollTimer = null;
    let timeoutTimer = null;

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        if (pollTimer) clearTimeout(pollTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
      };

      const poll = async () => {
        try {
          if (retries >= maxRetries) {
            cleanup();
            reject(new Error("Max retries reached"));
            return;
          }

          const searchResponse = await Digit.CustomService.getResponse({
            url: "/project-factory/v1/data/_search",
            params: {},
            body: {
              SearchCriteria: {
                id: [id],
                tenantId: tenantId,
                type: typeOfData,
              },
            },
          });

          const status = searchResponse?.ResourceDetails?.[0]?.status;

          let errorString = searchResponse?.ResourceDetails?.[0]?.additionalDetails?.error;
          let errorObject = {};
          let errorCode = "HIERARCHY_FAILED";

          if (errorString) {
            try {
              errorObject = JSON.parse(errorString);
              if (errorObject) errorCode = errorObject.code;
            } catch (e) {
              console.error("Error parsing error string:", e);
            }
          }

          if (status === "completed") {
            cleanup();
            setShowToast({ label: `${t("WBH_HIERARCHY_STATUS_COMPLETED")}`, isError: "success" });
            resolve(true);
            return; // Add explicit return to stop further execution
          }

          // Only continue polling if status is not completed
          retries++;
          pollTimer = setTimeout(poll, pollInterval);
        } catch (error) {
          console.error("Polling error:", error);
          cleanup(); // Add cleanup here too
          reject(error); // Reject immediately on error instead of continuing to poll
          return;
        }
      };

      // Start polling
      poll().catch((error) => {
        cleanup();
        reject(error);
      });

      // Set overall timeout
      const timeoutDuration = (maxRetries + 1) * pollInterval;
      timeoutTimer = setTimeout(() => {
        cleanup();
        reject(new Error("Polling timeout"));
      }, timeoutDuration);
    });
  };

  const callCreateDataApi = async (fid) => {
    try {
      const createResponse = await Digit.CustomService.getResponse({
        url: "/project-factory/v1/data/_create",
        params: {},
        body: {
          ResourceDetails: {
            tenantId: tenantId,
            type: "boundaryManagement",
            fileStoreId: fid,
            action: "create",
            hierarchyType: hierarchyType,
            additionalDetails: {
              source: "boundary",
            },
            campaignId: "default",
          },
        },
      });

      const id = createResponse?.ResourceDetails?.id;
      const typeOfData = createResponse?.ResourceDetails?.type;

      if (id) {
        try {
          await pollForStatusCompletion(id, typeOfData);
        } catch (pollError) {
          throw pollError;
        }
      }

      return createResponse;
    } catch (error) {
      setDisable(false);
      let label;

      if (error.message === "Polling timeout" || error.message === "Max retries reached") {
        label = `${t("WBH_BOUNDARY_CREATION_TIMEOUT")}: ${t("WBH_OPERATION_INCOMPLETE")}`;
      } else {
        label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
        // if (error?.message) label += `${t(error?.message)}`;
      }

      setShowToast({ label, isError: "error" });
      return {};
    }
  };

  const trimming = (val) => {
    return val.trim().replace(/[\s_]+/g, "");
  };

  const createNewHierarchy = async () => {
    // first call the upsert
    // then call the create bouondary
    // then call the download
    // then call upload (if boudnary taken from geopode)
    try {
      setCreatingData(true);
      setShowToast({
        label: t("HIERARCHY_PLEASE_WAIT"),
        isError: "info",
        transitionTime: 100000,
      });

      const local = [
        ...boundaryData.map((item) => ({
          code: `${hierarchyType}_${trimming(item.boundaryType)}`.toUpperCase(),
          message: `${t((defaultHierarchyType + "_" + item?.boundaryType).toUpperCase())}`,
          module: `hcm-boundary-${hierarchyType.toLowerCase()}`,
          locale: locale,
        })),
        ...newBoundaryData.map((item) => ({
          code: `${hierarchyType}_${trimming(item.boundaryType)}`.toUpperCase(),
          message: item.boundaryType.trim(),
          module: `hcm-boundary-${hierarchyType.toLowerCase()}`,
          locale: locale,
        })),
      ];

      const localisationResult = await localisationMutateAsync(local);
      if (!localisationResult.success) {
        setShowToast({ label: t("BOUNDARY_LOCALISATION_ERROR"), isError: "error" });
      }

      const res = await callCreate();

      if (newHierarchy === true) {
        await sleep(2000); // wait for 2 seconds
      }

      // Template generation with retries
      const res11 = await downloadExcelTemplate();

      // Only proceed with data creation if template generation was successful
      if (newHierarchy === false) {
        const res22 = await callCreateDataApi(res11);
      }

      setShowToast({
        label: t("HIERARCHY_CREATED_SUCCESSFULLY"),
        isError: "success",
      });

      setCreatingData(false);

      await sleep(2000);
      navigate(`/${window.contextPath}/employee/campaign/boundary/data?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`, {
        replace: true,
      });
    } catch (error) {
      const errorMessage =
        error.message === "LEVELS_CANNOT_BE_EMPTY"
          ? t("LEVELS_CANNOT_BE_EMPTY")
          : t(error?.response?.data?.Errors?.[0]?.code) || t("HIERARCHY_CREATION_FAILED");

      setCreatingData(false);
      setShowToast({ label: errorMessage, isError: "error" });
      await sleep(2000);
      navigate(`/${window.contextPath}/employee/campaign/boundary/home`, {});
    }
  };
  const onConfirmClick = () => {
    addParents();
    createNewHierarchy();
  };

  const goBackToBoundary = () => {
    navigate(`/${window.contextPath}/employee/campaign/boundary/home?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`, {
      state: {
        data: state,
      },
    });
  };

  const addParents = () => {
    setNewBoundaryData((prevItems) => {
      // Loop through the array starting from the second element
      return prevItems.map((item, idx) => {
        item.boundaryType = trimming(item.boundaryType).toUpperCase();
        if (idx === 0) {
          if (newHierarchy) item.parentBoundaryType = null;
          else {
            if (boundaryData.length === 0) item.parentBoundaryType = null;
            else item.parentBoundaryType = boundaryData[boundaryData.length - 1].boundaryType;
          }
        }
        if (idx > 0) {
          item.parentBoundaryType = trimming(prevItems[idx - 1].boundaryType);
        }
        return item;
      });
    });
  };

  if (isLoading || showLoader) {
    return <Loader page={true} variant={"PageLoader"} />;
  } else {
    if (newHierarchy == false) {
      return (
        <React.Fragment>
          {firstPage && !newHierarchy && (
            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="hierarchy-boundary-heading">{t("BOUNDARY_DATA_FROM_GEOPODE")}</div>
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
                      {`${t((defaultHierarchyType + "_" + item?.boundaryType).toUpperCase())}`}
                    </div>
                    <div style={{ height: "1rem" }}></div>
                    <Card type={"primary"} variant={"form"} className={"question-card-container"}>
                      <div style={{ display: "flex", gap: "2rem" }}>
                        <Svgicon />
                        <div style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
                          {`${t((defaultHierarchyType + "_" + item?.boundaryType).toUpperCase())}`}
                          {"-geojson.json"}
                        </div>
                      </div>
                    </Card>
                    <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
                  </div>
                ))}
              </div>
            </Card>
          )}
          {firstPage && newBoundaryData.length > 0 && (
            <div>
              <div style={{ height: "1rem" }}></div>
              <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                <div>
                  <div className="hierarchy-boundary-heading">{t("NEWLY_ADDED_BOUNDARY_DATA")}</div>
                  <div style={{ height: "2rem" }}></div>
                </div>
                <div>
                  {newBoundaryData.map((item, index) => (
                    <div>
                      <div style={{ display: "flex" }}>
                        <div className="hierarchy-boundary-sub-heading">
                          {t("LEVEL")} {boundaryData.length + index + 1}
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <TextInput
                            type={"text"}
                            populators={{
                              resizeSmart: false,
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
                  ))}
                  <Button
                    className="custom-class"
                    icon="Add"
                    iconFill=""
                    label={t("ADD_HIERARCHY_LEVEL")}
                    onClick={() => addLevel()}
                    size="medium"
                    title=""
                    variation="teritiary"
                    textStyles={{ width: "unset" }}
                  />
                </div>
                <div style={{ height: "2rem" }}></div>
              </Card>
            </div>
          )}
          <FinalPopup showFinalPopUp={showFinalPopup} setShowFinalPopup={setShowFinalPopup} onConfirmClick={onConfirmClick} />
          <Footer
            actionFields={[
              <Button
                icon="ArrowBack"
                style={{ marginLeft: "3.5rem" }}
                label={t("COMMON_BACK")}
                onClick={goBackToBoundary}
                type="button"
                variation="secondary"
                textStyles={{ width: "unset" }}
              />,
              <Button
                icon="ArrowForward"
                style={{ marginLeft: "auto" }}
                isSuffix
                label={t("CMN_BOUNDARY_REL_CREATE")}
                // onClick={goToPreview}
                isDisabled={creatingData}
                onClick={() => {
                  const checkValid = newBoundaryData?.every((obj) => obj?.boundaryType);
                  if (checkValid) {
                    setShowFinalPopup(true);
                  } else {
                    setShowToast({ label: t("CMN_FILLORDELETE_CREATED_HIERARCHY"), isError: "error" });
                  }
                }}
                type="button"
                textStyles={{ width: "unset" }}
              />,
            ]}
            className="custom-action-bar"
            maxActionFieldsAllowed={5}
            setactionFieldsToRight
            sortActionFields
            style={{}}
          />
          {creatingData && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")} />}

          {showToast && (
            <Toast
              label={showToast.label}
              type={showToast.isError}
              transitionTime={showToast?.transitionTime || 5000}
              onClose={() => setShowToast(null)}
            />
          )}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {firstPage && (
            <div style={{ marginBottom: "2rem" }}>
              <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="hierarchy-boundary-heading">{t("CREATE_BOUNDARY_HIERARCHY")}</div>
                </div>
                <div style={{ height: "1.5rem" }}></div>
                <div>{t("BOUNDARY_HIERARCHY_INFO_MSG")}</div>
                <div style={{ height: "2rem" }}></div>
                <div>
                  {newBoundaryData.map((item, index) => (
                    <div>
                      <div style={{ display: "flex" }}>
                        <div className="hierarchy-boundary-sub-heading">
                          {t("LEVEL")} {index + 1}
                          {index === 0 && <span className="mandatory-span">*</span>}
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <TextInput
                            type={"text"}
                            populators={{
                              resizeSmart: false,
                            }}
                            style={{ width: "27rem", display: "flex", justifyContent: "flex-end" }}
                            value={item?.boundaryType}
                            onChange={(event) => addLevelName(event.target.value, index)}
                            placeholder={""}
                          />
                          {index !== 0 && (
                            <div className="dustbin-icon" onClick={() => removeLevel(index)}>
                              <DustbinIcon />
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ height: "1.5rem" }}></div>
                    </div>
                  ))}
                  <Button
                    className="custom-class"
                    icon="Add"
                    iconFill=""
                    label={t("ADD_HIERARCHY_LEVEL")}
                    onClick={() => addLevel()}
                    size="medium"
                    title=""
                    variation="secondary"
                    textStyles={{ width: "unset" }}
                  />
                </div>
              </Card>
            </div>
          )}
          <FinalPopup showFinalPopUp={showFinalPopup} setShowFinalPopup={setShowFinalPopup} onConfirmClick={onConfirmClick} />
          <Footer
            actionFields={[
              <Button
                icon="ArrowBack"
                style={{ marginLeft: "3.5rem" }}
                label={t("COMMON_BACK")}
                onClick={goBackToBoundary}
                type="button"
                variation="secondary"
                textStyles={{ width: "unset" }}
              />,
              <Button
                icon="ArrowForward"
                style={{ marginLeft: "auto" }}
                isSuffix
                label={t("CMN_BOUNDARY_REL_CREATE")}
                // onClick={goToPreview}
                isDisabled={creatingData}
                onClick={() => {
                  const checkValid = newBoundaryData?.every((obj) => obj?.boundaryType);
                  if (checkValid) {
                    setShowFinalPopup(true);
                  } else if (newBoundaryData?.some((obj) => obj?.boundaryType)) {
                    setShowToast({ label: t("CMN_FILLORDELETE_CREATED_HIERARCHY"), isError: "error" });
                  } else {
                    setShowToast({ label: t("CMN_ATLEAST_ONE_HIERARCHY"), isError: "error" });
                  }
                }}
                type="button"
                textStyles={{ width: "unset" }}
              />,
            ]}
            className="custom-action-bar"
            maxActionFieldsAllowed={5}
            setactionFieldsToRight
            sortActionFields
            style={{}}
          />
          {showToast && (
            <Toast
              label={showToast.label}
              type={showToast.isError}
              transitionTime={showToast?.transitionTime || 5000}
              onClose={() => setShowToast(null)}
            />
          )}
          {creatingData && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")} />}
        </React.Fragment>
      );
    }
  }
};

export default BoundaryRelationCreate;
