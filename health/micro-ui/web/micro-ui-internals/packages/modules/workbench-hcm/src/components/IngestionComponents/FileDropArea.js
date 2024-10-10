import React, { useState, useRef, useEffect } from 'react';
import { ActionBar, Button, Header, Loader, SubmitBar, Toast} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import GenerateXlsx from '../GenerateXlsx';
import { useHistory } from "react-router-dom";
import { facilityJsonData } from '../../constants/facilityJsonData';
import { oujsonData } from '../../constants/ouJsonData';
import { userJsonData } from '../../constants/userJsonData';


function FileDropArea ({ingestionType}) {
  const { t } = useTranslation();
  const history = useHistory();
  const [isDragActive, setIsDragActive] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [response, setResponse] = useState(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const fileInputRef = useRef(null);
  const templateFile= useRef(null);
  const callInputClick = async (event) => {
    templateFile.current.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  function formatString(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  }
  const handleFileInput = (e) => {
    e.preventDefault();
  setIsDragActive(false);

  const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    if (files.length === 1 && droppedFile===null) {
      const file = files[0];
      const fileName = file.name;
  
  
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setDroppedFile({ name: fileName, file: file });
      } else {
        // Showing a toast message indicating that only EXCEL files are allowed.
        setShowToast({
          label: t("WORKBENCH_ONLY_EXCEL_FILE"),
          isError: true,
        });
        closeToast();
      }
    } else {
      // Showing a toast message indicating that only one file is allowed at a time.
      setShowToast({
        label: t("WORKBENCH_ONLY_ONE_FILE"),
        isError: true,
      });
      closeToast();
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleRemoveFile = () => {
    setDroppedFile(null);
    // You can also perform any additional cleanup or actions here.
  };

  const responseToast = () => {

    if (response?.ResponseInfo?.status == "Success" ) {
      const toastMessage = "Your request has been forwarded and it's under progress";
      const additionalMessage = `\nIngestion Number is ${response?.ingestionNumber}. You can check in the inbox.`;
      const completedMessage = toastMessage + additionalMessage;
      setShowToast({
        label: completedMessage,
        isError: false,
      });
      closeToast();
    }
     else {
      setShowToast({
        label: t("WORKBENCH_INGESTION_FAILED"),
        isError: true,
      });
      closeToast();
     }
  }
 useEffect (() => {
  if (response) { // Check if response is not null or undefined
    responseToast();
  }
 },[response])
  
  const onsubmit = async () => {
    if (droppedFile?.file == null) {
      setShowToast({
        label: t("WORKBENCH_CHOOSE_FILE"),
        isError: true,
      });
      closeToast();
    }
    else {

      setIsLoading(true);
      try{
      const formData = new FormData();
      formData.append("file", droppedFile.file);
      formData.append(
        "tenantId", Digit.ULBService.getCurrentTenantId()
      );
      formData.append(
         "module", "pgr"
      );
      const data = await Digit.IngestionService.fileStore(formData);

        const searchParams = {
          ingestionType: ingestionType,
          fileStoreId: data?.data?.files[0]?.fileStoreId
        };
        const allData = await Digit.IngestionService.ingest(searchParams,Digit.ULBService.getCurrentTenantId());
        setResponse(allData);

        history.push({
          pathname: `/${window.contextPath}/employee/hcmworkbench/response`,
          state: { responseData: allData }
        });

    }
    catch(error){
        // Handle errors here
        console.error(error);
        setShowToast({
          label: t("WORKBENCH_ERROR_INGESTION"),
          isError: true,
        });
        closeToast();
      } finally {
        setIsLoading(false); // Set loading state to false when ingestion completes (either success or failure)
      }
  }
  }

  function returnApplicableJson(ingestionType) {
    switch (ingestionType) {
      case "facility":
        return facilityJsonData;
      case "OU":
        return oujsonData;
      case "user":
        return userJsonData;
      case "boundary":
        return oujsonData;
      case "project":
        return oujsonData;
      default:
        return null;
    }
  }

  return (
    <div>
      <Header>{formatString(ingestionType)} {t("WORKBENCH_INGESTION")}</Header>
      <div className={`drop-area ${isDragActive ? 'active' : ''}`} onDragEnter={handleDragEnter} onDragOver={(e) => e.preventDefault()} onDragLeave={handleDragLeave} onDrop={handleFileInput}>
        {droppedFile ? (
          <div>
          <p className="drag-drop-tag">File: {droppedFile.name}</p>
          <button className="remove-button" onClick={handleRemoveFile }>{t("WORKBENCH_REMOVE")}</button>
          </div>
        ) : (
          <div>
          <p className="drag-drop-tag">{t("WORKBENCH_DRAG_AND_DROP")}</p>
          <button className="upload-file-button" onClick={handleButtonClick}>{t("WORKBENCH_BROWSE_FILES")}</button>
        <input 
  type="file" 
  ref={fileInputRef} 
  style={{ display: 'none' }} 
  accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  
        onChange={handleFileInput} />
          </div>
        )}
         {isLoading && <Loader message="Fetching data, please wait..." />} 
      {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)} />}
        {/* {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>} */}
      </div>
      <ActionBar className="action-bar">
        <Button 
        className="action-bar-button"
        label={"Download template"}
        variation="secondary"
        onButtonClick={callInputClick}>
        </Button>
        {<GenerateXlsx inputRef={templateFile} jsonData={returnApplicableJson(ingestionType)} ingestionType={ingestionType} />}
      <SubmitBar label={t("WORKBENCH_SUBMIT")} 
      onSubmit={onsubmit}
      />
      </ActionBar>
    </div>
  );
}

export default FileDropArea;
