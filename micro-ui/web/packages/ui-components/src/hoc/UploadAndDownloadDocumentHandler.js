import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import LabelFieldPair from "../atoms/LabelFieldPair";
import CardLabel from "../atoms/CardLabel";
import CardLabelError from "../atoms/CardLabelError";
import CitizenInfoLabel from "../atoms/CitizenInfoLabel";
import HeaderComponent from "../atoms/HeaderComponent";
import MultiUploadWrapper from "../molecules/MultiUploadWrapper";
import TextInput from "../atoms/TextInput";
import { getRegex } from "../utils/uploadFileComposerUtils";
import { useParams } from "react-router-dom";
import { Button, CustomSVG } from "../atoms";

const UploadAndDownloadDocumentHandler = ({
  schemaCode,
  config,
  Controller,
  control,
  register,
  formData,
  errors,
  localePrefix,
  customClass,
  previewConfig,
  action = "APPLY",
  flow,
  templateUrl
}) => {
  if(previewConfig) flow = "APPLY"
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getStateId();
  const { module, service } = useParams();
  let moduleName = `${module?.toLowerCase()}.${service?.toLowerCase()}`;
  const { serviceCode, applicationNumber:applicationNo = "" } = Digit.Hooks.useQueryParams();

  const isMobile = window.Digit.Utils.browser.isMobile();

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const serviceconfigrequestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode,
        filters:{
          module:module
        }
      },
    },
  };
  const { isLoading, data:serviceconfig } = Digit.Hooks.useCustomAPIHook(serviceconfigrequestCriteria);

  const downloadPdf = (blob, fileName) => {
    if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        window.mSewaApp.downloadBase64File(base64data, fileName);
      };
    } else {
      const link = document.createElement("a");
      // create a blobURI pointing to our Blob
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    }
  };

  const handleTemplateDownload = async ({ item, tenantId, t }) => {
    try {
      const state = tenantId;
  
      if (item?.templateDownloadURL) {
        window.open(item.templateDownloadURL, "_blank");
      } else if (item?.templatePDFKey) {
        const {
          templatePDFKey,
        } = item;

        let params = {
          tenantId,
          serviceCode,
          applicationNumber: formData?.applicationNumber || applicationNo,
          pdfKey: templatePDFKey
        }
  
        try {
          const response = await Digit.CustomService.getResponse({
            templateUrl,
            params,
            method: "POST",
            useCache: false,
            userDownload: true,
            headers: {
              Accept: "application/pdf",
            },
          });
  
          downloadPdf(
            new Blob([response.data], { type: "application/pdf" }),
            `${applicationNo}.pdf`
          );
        } catch (err) {
          console.error(err);
          Digit.Toast.error(t("TEMPLATE_DOWNLOAD_FAILED"));
        }
  
        const dummyPayload = { sample: "value" };
        const response = await Digit.PaymentService.generatePdf(
          state,
          dummyPayload,
          item.templatePDFKey
        );
  
        const fileStore = await Digit.PaymentService.printReciept(state, {
          fileStoreIds: response.filestoreIds[0],
        });
  
        const fileUrl = fileStore?.[response.filestoreIds[0]];
        if (fileUrl) {
          window.open(fileUrl, "_blank");
        }
      }
    } catch (err) {
      console.error("Template download error", err);
    }
  };

  let docData = serviceconfig ? serviceconfig?.mdms?.filter((ob) => ob?.uniqueIdentifier.toLowerCase() === moduleName)?.[0]?.data?.documents?.[0].actions : [];
  if(previewConfig) docData = previewConfig?.[0]?.actions;
  const docConfig = docData?.[0];

  const updatedDocuments = docConfig?.documents?.flatMap((doc) => {
    if (doc.templatePDFKey || doc.templateDownloadURL) {
      // Return both original and a modified copy with cleared template keys
      return [
        doc,
        {
          ...doc,
          templatePDFKey: "",
          templateDownloadURL: ""
        }
      ];
    }
    return [doc]; // Just the original if no keys present
  });
  
  if (!docConfig && flow !== "WORKFLOW" && !previewConfig) return null;

  return (
    <React.Fragment>
      {flow === "WORKFLOW" &&
        <Controller
          name={`${config?.populators?.name}`}
          control={control}
          rules={{ required: false }}
          render={({ onChange, ref, value = [] }) => {
            function getFileStoreData(filesData) {
              const numberOfFiles = filesData.length;
              let finalDocumentData = [];
              if (numberOfFiles > 0) {
                filesData.forEach((value) => {
                  finalDocumentData.push({
                    fileName: value?.[0],
                    fileStoreId: value?.[1]?.fileStoreId?.fileStoreId,
                    documentType: value?.[1]?.file?.type,
                  });
                });
              }
              onChange(numberOfFiles > 0 ? filesData : []);
            }
            return (
              <MultiUploadWrapper
                t={t}
                module="works"
                tenantId={Digit.ULBService.getCurrentTenantId()}
                getFormState={getFileStoreData}
                showHintBelow={config?.populators?.showHintBelow ? true : false}
                setuploadedstate={value}
                allowedFileTypesRegex={getRegex(config?.populators?.allowedFileTypes)}
                allowedMaxSizeInMB={config?.populators?.maxSizeInMB}
                hintText={t(config?.populators?.hintText)}
                maxFilesAllowed={config?.populators?.maxFilesAllowed}
                extraStyleName={{ padding: "0.5rem" }}
              />
            );
          }}
        />
      }
      {flow !== "WORKFLOW" && updatedDocuments?.map((item, index) => {
        if (!item?.active) return null;
        
        if(previewConfig) {
          return (
            <div key={index} style={{
              width: "100%", 
              display: "flex", 
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              {/* Field Label - Full text with proper wrapping */}
              {item.code && (
                <CardLabel className="bolder" style={{ 
                  fontSize: "14px", 
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  lineHeight: "1.5",
                  maxWidth: "100%",
                  overflowWrap: "break-word",
                  wordBreak: "break-word"
                }}>
                  {(item?.templatePDFKey || item?.templateDownloadURL) 
                    ? `${t(item?.code)} (Download)` 
                    : `${t(item?.code)} (Upload)`}
                  {item?.isMandatory ? " * " : null}
                </CardLabel>
              )}

              {/* Download Section */}
              {(item?.templatePDFKey || item?.templateDownloadURL) && (
                <div className={`digit-upload-wrapper ${customClass || ""}`} 
                  style={{ 
                    padding: "1rem", 
                    border: "1px solid #D6D5D4", 
                    borderRadius: "8px", 
                    backgroundColor: "#FAFAFA", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    gap: "0.75rem",
                    maxWidth: isMobile ? "100%" : "310px"
                  }}>
                  <CustomSVG.PDFSvg width={"40"} height={"40"} />
                  <Button
                    label={t("DOWNLOAD")}
                    variation="secondary"
                    icon={"FileDownload"}
                    type="button"
                    style={{ width: isMobile ? "-webkit-fill-available" : "auto" }}
                    onClick={() => handleTemplateDownload({ item, tenantId, t })}
                  />
                </div>
              )}

              {/* Upload Section */}
              {!(item?.templatePDFKey || item?.templateDownloadURL) && (
                <div style={{ maxWidth: isMobile ? "100%" : "600px" }}>
                  {item?.showTextInput && (
                    <TextInput
                      style={{ marginBottom: "16px" }}
                      name={`${config?.name}.${item?.name}_name`}
                      placeholder={t("ES_COMMON_ENTER_NAME")}
                      inputRef={register({ minLength: 2 })}
                    />
                  )}
                  
                  <MultiUploadWrapper
                    t={t}
                    module="DigitStudio"
                    getFormState={() => {}}
                    setuploadedstate={[]}
                    showHintBelow={Boolean(item?.hintText)}
                    hintText={item?.hintText}
                    allowedFileTypesRegex={getRegex(item?.allowedFileTypes)}
                    allowedMaxSizeInMB={item?.maxSizeInMB || 5}
                    maxFilesAllowed={item?.maxFilesAllowed || 1}
                    customErrorMsg={item?.customErrorMsg}
                    customClass={customClass}
                    tenantId={Digit.ULBService.getCurrentTenantId()}
                  />
                  
                  {errors?.[`${config?.name}`]?.[`${item?.name}`] && (
                    <CardLabelError style={{ fontSize: "12px" }}>
                      {t(config?.error)}
                    </CardLabelError>
                  )}
                </div>
              )}
            </div>
          );
        }
        
        // Non-preview mode (original flow)
        return (
          <LabelFieldPair key={index} style={isMobile ? {} : { alignItems: item?.showTextInput ? "flex-start" : "center" }}>
            {item.code && (
              <div style={{ display: "flex", gap: "1.5rem", width:isMobile? "100%" :"30%" }}>
                <CardLabel className="bolder" style={{ marginTop: item?.showTextInput ? "10px" : "", width: "100%", marginBottom:"0px" }}>
                  {(item?.templatePDFKey || item?.templateDownloadURL) ? t(`${localePrefix}_${item?.code}_DOWNLOAD`) : t(`${localePrefix}_${item?.code}_UPLOAD`)} {item?.isMandatory ? " * " : null}
                </CardLabel>
              </div>
            )}

            {(item?.code && (
              item?.templatePDFKey || item?.templateDownloadURL) && (
                <div style={{width: isMobile? "100%": ""}}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", width: "100%", marginBottom:"0.5px" }}>

                  <div className={`digit-upload-wrapper ${customClass || ""}`} style={{ flex: 1, padding: "1rem", border: "1px solid #D6D5D4", borderRadius: "8px", backgroundColor: "#FAFAFA", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                    <CustomSVG.PDFSvg width={"40"} height={"40"} />
                    <Button
                      label={"Download"}
                      variation="secondary"
                      icon={"FileDownload"}
                      type="button"
                      style={{width: isMobile ? "-webkit-fill-available" : ""}}
                      onClick={() => handleTemplateDownload({ item, tenantId, t })}
                    />
                  </div>
                </div>
                </div>
            ))}

           { item?.showTextInput || !(item?.templatePDFKey || item?.templateDownloadURL)  && <div className="digit-field" style={isMobile ? {} : {width:"563px"}}>
              {item?.showTextInput && (
                <TextInput
                  style={{ marginBottom: "16px" }}
                  name={`${config?.name}.${item?.name}_name`}
                  placeholder={t("ES_COMMON_ENTER_NAME")}
                  inputRef={register({ minLength: 2 })}
                />
              )}

              {!(item?.templatePDFKey || item?.templateDownloadURL) && <div style={{ marginBottom: "24px" }}>
                <Controller
                  render={({ value = [], onChange }) => {
                    function getFileStoreData(filesData) {
                      let finalDocumentData = [];
                      filesData.forEach((value) => {
                        finalDocumentData.push({
                          fileName: value?.[0],
                          fileStoreId: value?.[1]?.fileStoreId?.fileStoreId,
                          documentType: value?.[1]?.file?.type,
                        });
                      });
                      onChange(finalDocumentData.length ? filesData : []);
                    }

                    return (
                      <MultiUploadWrapper
                        t={t}
                        module="DigitStudio"
                        getFormState={getFileStoreData}
                        setuploadedstate={value}
                        showHintBelow={Boolean(item?.hintText)}
                        hintText={item?.hintText}
                        allowedFileTypesRegex={getRegex(item?.allowedFileTypes)}
                        allowedMaxSizeInMB={item?.maxSizeInMB || 5}
                        maxFilesAllowed={item?.maxFilesAllowed || 1}
                        customErrorMsg={item?.customErrorMsg}
                        customClass={customClass}
                        tenantId={Digit.ULBService.getCurrentTenantId()}
                      />
                    );
                  }}
                  rules={{
                    validate: (value) => !(item?.isMandatory && (!value || value.length === 0)),
                  }}
                  defaultValue={formData?.[item?.name]}
                  name={`${config?.name}.${item?.name}`}
                  control={control}
                />
                {errors?.[`${config?.name}`]?.[`${item?.name}`] && (
                  <CardLabelError style={{ fontSize: "12px" }}>
                    {t(config?.error)}
                  </CardLabelError>
                )}
              </div>}
            </div>}
          </LabelFieldPair>
        );
      })}
    </React.Fragment>
  );
};

UploadAndDownloadDocumentHandler.propTypes = {
  schemaCode: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  Controller: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  localePrefix: PropTypes.string.isRequired,
  customClass: PropTypes.string,
};

export default UploadAndDownloadDocumentHandler;
