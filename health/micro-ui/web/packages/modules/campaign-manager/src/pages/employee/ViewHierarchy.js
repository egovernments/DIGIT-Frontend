import { Card, Uploader, Button, Footer, Toast, Loader, PopUp, AlertCard } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import XlsPreviewNew from "../../components/XlsPreviewNew";
import { Svgicon } from "../../utils/Svgicon";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { DustbinIcon } from "../../components/icons/DustbinIcon";
import * as XLSX from "xlsx";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import validateBoundaryExcelContent from "../../utils/validateBoundaryExcel";

const ViewHierarchy = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const defaultHierarchyType = searchParams.get("defaultHierarchyType");
  const hierarchyType = searchParams.get("hierarchyType");
  const locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const inputRef = useRef(null); // Ref to trigger file input
  const [defData, setDefData] = useState([]);
  const [hierData, setHierData] = useState([]);
  const [previewPage, setPreviewPage] = useState(false);
  const [firstPage, setFirstPage] = useState(true);
  const [fileUrl, setFileUrl] = useState("");
  const [fileData, setFileData] = useState({});
  const [fileStoreId, setFileStoreId] = useState("");
  const [fileName, setFileName] = useState("");
  const [showToast, setShowToast] = useState(null); // State to handle toast notifications
  const [dataCreateToast, setDataCreateToast] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disableFile, setDisableFile] = useState(true);
  const [dataCreationGoing, setDataCreationGoing] = useState(false);
  const [noOfRows, setNoOfRows] = useState(100);
  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(tenantId, CONSOLE_MDMS_MODULENAME, [{ name: "baseTimeOut" }]);
  const callSearch = async (hierarchy) => {
    const res = await Digit.CustomService.getResponse({
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId: tenantId,
          limit: 2,
          offset: 0,
          hierarchyType: hierarchy,
        },
      },
    });
    return res;
  };
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = "hcm";
  const stateCode = Digit.ULBService.getCurrentTenantId();
  const moduleCode = `boundary-${hierarchyType.toLowerCase()}`;
  const { isLoading, data } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  const [viewState, setViewState] = useState(false);
  const fetchData = async () => {
    try {
      const res = await callSearch(defaultHierarchyType);
      if (res?.BoundaryHierarchy?.[0]?.boundaryHierarchy) setDefData(res?.BoundaryHierarchy?.[0]?.boundaryHierarchy);
      const res1 = await callSearch(hierarchyType);
      if (res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy) setHierData(res1?.BoundaryHierarchy?.[0]?.boundaryHierarchy);
      setViewState(true);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);
  const generateTemplate = async () => {
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/data/_download`,
      body: {},
      params: {
        tenantId: tenantId,
        type: "boundaryManagement",
        hierarchyType: hierarchyType,
        campaignId: "default",
      },
    });
    return res;
  };
  const downloadExcelTemplate = async () => {
    // const res = await generateFile()
    const resFile = await generateTemplate();
    if (resFile && resFile?.GeneratedResource?.[0]?.fileStoreid) {
      // Splitting filename before .xlsx or .xls
      const fileNameWithoutExtension = hierarchyType;
      Digit.Utils.campaign.downloadExcelWithCustomName({
        fileStoreId: resFile?.GeneratedResource?.[0]?.fileStoreid,
        customName: fileNameWithoutExtension,
      });
      setShowPopUp(false);
    } else if (resFile && resFile?.GeneratedResource?.[0]?.status === "inprogress") {
      setShowToast({ label: t("PLEASE_WAIT_AND_RETRY_AFTER_SOME_TIME"), isError: "info" });
      setShowPopUp(false);
    } else {
      setShowToast({ label: t("PLEASE_WAIT_AND_RETRY_AFTER_SOME_TIME"), isError: "info" });
      setShowPopUp(false);
    }
  };

  const [uiValError, setUiValError] = useState(false);
  const [uiErrorMsg, setUiErrorMsg] = useState("");

  const handleUpload = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setFileName(file.name);
      // Check file extension
      const validExtensions = ["xls", "xlsx"];
      const fileExtension = file.name.split(".").pop().toLowerCase(); // Get the file extension

      if (!validExtensions.includes(fileExtension)) {
        setShowToast({ label: t("INVALID_FILE_FORMAT"), isError: "error" });
        setDisableFile(true);
        event.target.value = "";
        return; // Exit the function if the file is not valid
      }

      try {
        // Parse the file and validate its content
        const isValid = await validateBoundaryExcelContent(file, t);
        if (!isValid.success) {
          // setShowToast({ label: isValid.error, isError: "error" });
          setUiValError(true);
          setUiErrorMsg(isValid.error);
          setDisableFile(true);
          event.target.value = "";
          return; // Exit if validation fails
        }

        // Call function to upload the validated file to an API
        await uploadFileToAPI([file]);
        setDisableFile(false);
        setUiValError(false);
        setShowToast({ label: t("FILE_UPLOADED_SUCCESSFULLY"), isError: "success" });
      } catch (error) {
        event.target.value = "";
        setShowToast({
          label: error?.response?.data?.Errors?.[0]?.message || t("FILE_UPLOAD_FAILED"),
          isError: "error",
        });
      }
    }
  };

  const uploadFileToAPI = async (files) => {
    const module = "HCM";
    let file = files[0];
    let fileDataTemp = {};
    fileDataTemp.fileName = file?.name;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      // Assume the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON and count rows
      const rows = XLSX.utils.sheet_to_json(sheet);
      // After parsing locally, upload to API
      const response = await Digit.UploadServices.Filestorage(module, file, tenantId);
      fileDataTemp.fileStoreId = response?.data?.[0]?.fileStoreId;
      let fileStoreIdTemp = response?.data?.files?.[0]?.fileStoreId;
      setFileStoreId(response?.data?.files?.[0]?.fileStoreId);
      const { data: { fileStoreIds: fileUrlTemp } = {} } = await Digit.UploadServices.Filefetch([fileStoreIdTemp], tenantId);
      fileDataTemp.url = fileUrlTemp?.[0]?.url;
      setFileUrl(fileDataTemp?.url);
      setFileData(fileDataTemp);
    };
    reader.readAsArrayBuffer(file); // Read the file as an array buffer
  };

  const callCreateDataApi = async () => {
    setDisable(true);
    setDataCreationGoing(true);
    try {
      setDataCreateToast(true);

      const createResponse = await Digit.CustomService.getResponse({
        url: "/project-factory/v1/data/_create",
        params: {},
        body: {
          ResourceDetails: {
            tenantId: tenantId,
            type: "boundaryManagement",
            fileStoreId: fileStoreId,
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
          setDataCreateToast(false);
          navigate(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}`, {
            message: "ES_BOUNDARY_DATA_CREATED_SUCCESS_RESPONSE",
            preText: "ES_BOUNDARY_DATA__CREATED_SUCCESS_RESPONSE_PRE_TEXT",
            actionLabel: "CS_BOUNDARY_dATA_NEW_RESPONSE_ACTION",
            actionLink: `/${window.contextPath}/employee/campaign/boundary/data?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
            secondaryActionLabel: "CS_HOME",
            secondaryActionLink: `/${window?.contextPath}/employee`,
          });
          // setShowToast({ label: `${t("WBH_HIERARCHY_CREATED")}`, isError: "success" });
        } catch (pollError) {
          throw pollError; // Propagate polling errors to the outer catch block
        }
      }

      return createResponse;
    } catch (error) {
      setDisable(false);
      let label;

      // Handle known errors like polling timeout and max retries
      if (error.message === "Polling timeout" || error.message === "Max retries reached") {
        label = `${t("WBH_BOUNDARY_CREATION_TIMEOUT")}: ${t("WBH_OPERATION_INCOMPLETE")}`;
      } else {
        // Initialize the label with a failure message
        label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
        if (error?.message) label += `${t(error?.message)}`; // the message here is sent from the polling mechnism which sendds the error code from backend.
      }

      setShowToast({ label, isError: "error" });
      setDataCreationGoing(false);
      return {};
    }
  };

  // const pollForStatusCompletion = async (id, typeOfData) => {
  //   const pollInterval = 1000; // Poll every 1 second
  //   const maxRetries = 100; // Maximum number of retries
  //   let retries = 0;

  //   return new Promise((resolve, reject) => {
  //     const poll = async () => {
  //       try {

  //         if (retries >= maxRetries) {
  //           setDataCreationGoing(false);
  //           reject(new Error("Max retries reached"));
  //           return;
  //         }

  //         const searchResponse = await Digit.CustomService.getResponse({
  //           url: "/project-factory/v1/data/_search",
  //           params: {},
  //           body: {
  //             SearchCriteria: {
  //               id: [id],
  //               tenantId: tenantId,
  //               type: typeOfData
  //             }
  //           },
  //         });

  //         const status = searchResponse?.ResourceDetails?.status;

  //         if (status === "completed") {
  //           setShowToast({ label: `${t("WBH_HIERARCHY_STATUS_COMPLETED")}`, isError: "success" });
  //           setDataCreationGoing(false);
  //           resolve(true);
  //         } else if (status === "failed") {
  //           reject(new Error("Operation failed"));
  //         } else {
  //           retries++;
  //           setTimeout(poll, pollInterval);
  //         }
  //       } catch (error) {
  //         setDataCreationGoing(false);
  //         reject(error);
  //       }
  //     };

  //     // Start the polling
  //     poll().catch(reject);

  //     // Set a timeout for the entire polling operation
  //     const timeoutDuration = (maxRetries + 1) * pollInterval;
  //     setTimeout(() => {
  //       if (retries < maxRetries) {  // Only reject if not already resolved
  //         setDataCreationGoing(false);
  //         reject(new Error("Polling timeout"));
  //       }
  //     }, timeoutDuration);
  //   });
  // };
  const pollForStatusCompletion = async (id, typeOfData) => {
    // const pollInterval = 2000; // Poll every 1 second
    const maxRetries = 20; // Maximum number of retries
    let retries = 0;
    const baseDelay = baseTimeOut?.["HCM-ADMIN-CONSOLE"]?.baseTimeOut?.[0]?.baseTimeOut;
    const maxTime = baseTimeOut?.["HCM-ADMIN-CONSOLE"]?.baseTimeOut?.[0]?.maxTime;
    const pollInterval = Math.max(baseDelay * noOfRows, maxTime);

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // if (retries >= maxRetries) {
          //   setDataCreationGoing(false);
          //   reject(new Error("Max retries reached"));
          //   return;
          // }

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
          let errorString = searchResponse?.ResourceDetails?.[0]?.additionalDetails.error;
          let errorObject = {};
          let errorCode = "HIERARCHY_FAILED";
          if (errorString) errorObject = JSON.parse(errorString);
          if (errorObject) errorCode = errorObject.code;

          if (status === "completed") {
            setShowToast({ label: `${t("WBH_HIERARCHY_STATUS_COMPLETED")}`, isError: "success" });
            setDataCreationGoing(false);
            resolve(true);
          } else if (status === "failed") {
            reject(new Error(errorCode));
          } else {
            retries++;
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          // console.error("Error while polling:", error);
          retries++;
          setTimeout(poll, pollInterval);
        }
      };

      // Start the polling
      poll().catch(reject);

      // Set a timeout for the entire polling operation
      // const timeoutDuration = (maxRetries + 1) * pollInterval;
      // setTimeout(() => {
      //   if (retries < maxRetries) {
      //     // Only reject if not already resolved
      //     setDataCreationGoing(false);
      //     reject(new Error("Polling timeout"));
      //   }
      // }, timeoutDuration);
    });
  };

  const createData = async () => {
    const res = await callCreateDataApi();
  };
  const trimming = (val) => {
    return `${t((hierarchyType + "_" + val.trim().replace(/[\s_]+/g, "")).toUpperCase())}`;
  };

  const removeFile = () => {
    setFileName("");
    setDisableFile(true);
  };

  const [showPopUp, setShowPopUp] = useState(false);

  if (!viewState || isLoading) {
    return <Loader page={true} variant={"PageLoader"}/>;
  } else {
    return (
      <React.Fragment>
        {firstPage && (
          <div>
            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
              <div className="hierarchy-boundary-heading">
                {t(`HIERARCHY`)} {hierarchyType}
              </div>
              <div style={{ height: "2rem" }}></div>
              {hierData.map((hierItem, index) => {
                // Check if the index is less than defData length
                const isLessThanDefData = index < defData.length;

                if (isLessThanDefData) {
                  if (hierItem?.boundaryType === defData[index]?.boundaryType) {
                    return (
                      <div>
                        <div className="hierarchy-boundary-sub-heading2">{trimming(hierItem?.boundaryType)}</div>
                        <div style={{ height: "1rem" }}></div>
                        {/* <Card type={"primary"} variant={"form"} className={"question-card-container"} >
                                                    <div style={{display:"flex", gap:"2rem"}}>
                                                    <Svgicon />
                                                    <div style={{display:"flex", alignItems:"center", fontWeight:"600", fontFamily:"Roboto"}}>
                                                    {`${t(( hierarchyType + "_" + hierItem?.boundaryType).toUpperCase())}-geojson.json`}
                                                    </div>
                                                    </div>
                                                </Card> */}
                        <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }} key={index}>
                          <div className="hierarchy-boundary-sub-heading2">{trimming(hierItem?.boundaryType)}</div>
                          {/* <input
                                                ref={inputRef}
                                                type="file"
                                                style={{ display: "none" }}
@@ -485,232 +483,280 @@ const ViewHierarchy = () => {
                                                title=""
                                                variation="secondary"
                                              /> */}
                        </div>
                        <div style={{ height: "1rem" }}></div>
                        <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between" }} key={index}>
                        <div className="hierarchy-boundary-sub-heading2">{trimming(hierItem?.boundaryType)}</div>
                        {/* <Uploader
                                                        onUpload={() => {}}
                                                        showAsTags
                                                        uploadedFiles={[]}
                                                        variant="uploadFile"
                                                        style={{width:"50rem"}}
                                                    /> */}
                        {/* <input
                                            ref={inputRef}
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange} // Trigger file upload when a file is selected
                                          />
                                          <Button
                                            className="custom-class"
                                            icon="Upload"
                                            iconFill=""
                                            label={t("UPLOAD_GEOJSONS")}
                                            onClick={handleUpload}
                                            options={[]}
                                            optionsKey=""
                                            size="large"
                                            style={{}}
                                            title=""
                                            isDisabled={true}
                                            variation="secondary"
                                          /> */}
                      </div>
                      <div style={{ height: "1rem" }}></div>
                      <hr style={{ borderTop: "1px solid #ccc", margin: "1rem 0" }} />
                    </div>
                  );
                }
              })}
            </Card>
            <div style={{ height: "1rem" }}></div>
            <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="hierarchy-boundary-heading">{t("UPLOAD_EXCEL")}</div>
                <Button
                  className="custom-class"
                  icon="DownloadIcon"
                  iconFill=""
                  label={t("DOWNLOAD_EXCEL_TEMPLATE")}
                  onClick={() => {
                    setShowPopUp(true);
                  }}
                  options={[]}
                  optionsKey=""
                  size="small"
                  style={{}}
                  title=""
                  variation="link"
                />
              </div>
              <div>
                {disableFile && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: "600", fontSize: "1.2rem" }}>{t("UPLOAD_EXCEL_FOR_ALL_BOUNDARIES")}</div>
                    <input
                      ref={inputRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange} // Trigger file upload when a file is selected
                    />
                    <Button
                      className="custom-class"
                      icon="Upload"
                      iconFill=""
                      label={t("UPLOAD_EXCEL")}
                      onClick={handleUpload}
                      options={[]}
                      optionsKey=""
                      size="large"
                      style={{}}
                      title=""
                      variation="secondary"
                    />
                  </div>
                )}
                {!disableFile && (
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "20rem", gap: "1rem" }}>
                      <div style={{ marginRight: "10px" }}>{fileName}</div>
                      <div className="dustbin-icon" onClick={() => removeFile()} style={{ cursor: "pointer", marginTop: "1.15rem" }}>
                        <DustbinIcon />
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ height: "1rem" }}></div>
              </div>
              {uiValError && <AlertCard label="Info" text={uiErrorMsg} variant="error" style={{ maxWidth: "200rem" }} />}
              <div style={{ marginBottom: "0.5rem" }}></div>
            </Card>
            <div style={{ height: "3rem" }}></div>
            <Footer
              actionFields={[
                <Button
                  icon="ArrowBack"
                  style={{ marginLeft: "3.5rem" }}
                  label={t("COMMON_BACK")}
                  // isDisabled={true}
                  onClick={() => {
                    navigate(`/${window.contextPath}/employee/campaign/boundary/home`);
                  }}
                  type="button"
                  variation="secondary"
                  textStyles={{ width: "unset" }}
                />,
                <Button
                  icon="ArrowForward"
                  isDisabled={disableFile}
                  style={{ marginLeft: "auto" }}
                  isSuffix
                  label={t("CMN_BOUNDARY_REL_DATA_CREATE_PREVIEW")}
                  onClick={() => {
                    setPreviewPage(true);
                    setFirstPage(false);
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
          </div>
        )}
        {showPopUp && (
          <PopUp
            className={"popUpClass"}
            footerclassName={"popUpFooter"}
            type={"default"}
            // style={{width:"70%"}}
            heading={t("DOWNLOAD_EXCEL_TEMPLATE_FOR_BOUNDARY")}
            children={[]}
            onOverlayClick={() => {
              setShowPopUp(false);
            }}
            onClose={() => {
              setShowPopUp(false);
            }}
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("CLOSE")}
                onClick={() => {
                  setShowPopUp(false);
                }}
              />,
              <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("DOWNLOAD_TEMPLATE_BOUNDARY")}
                icon={"DownloadIcon"}
                onClick={downloadExcelTemplate}
              />,
            ]}
            sortFooterChildren={true}
          >
            <div style={{ fontWeight: "400", fontSize: "1.25rem", fontFamily: "Roboto", marginTop: "1rem", marginBottom: "1rem" }}>
              {t("BOUNDARY_DOWNLOAD_MESSAGE")}
            </div>
          </PopUp>
        )}
        {showToast && <Toast label={showToast.label} type={showToast.isError} onClose={() => setShowToast(null)} />}
        {previewPage && (
          <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
            <div className="hierarchy-boundary-heading">{t("CONFIRM_BOUNDARY_DATA")}</div>
            {!dataCreationGoing && (
              <XlsPreviewNew
                file={fileData}
                onDownload={() => {}}
                onBack={() => {
                  setShowPreview(false);
                  setUploadPage(true);
                }}
              />
            )}
            {dataCreationGoing &&<Loader page={true} variant={"PageLoader"}/>}
            <Footer
              actionFields={[
                <Button
                  icon="ArrowBack"
                  style={{ marginLeft: "3.5rem" }}
                  isDisabled={disable}
                  label={t("COMMON_BACK")}
                  onClick={() => {
                    setFirstPage(true);
                    setPreviewPage(false);
                  }}
                  type="button"
                  variation="secondary"
                  textStyles={{ width: "unset" }}
                />,
                <Button
                  icon="ArrowForward"
                  isDisabled={dataCreationGoing}
                  style={{ marginLeft: "auto" }}
                  isSuffix
                  label={t("CMN_BOUNDARY_REL_DATA_CREATE")}
                  onClick={() => {
                    createData();
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
          </Card>
        )}
      </React.Fragment>
    );
  }
};
export default ViewHierarchy;
