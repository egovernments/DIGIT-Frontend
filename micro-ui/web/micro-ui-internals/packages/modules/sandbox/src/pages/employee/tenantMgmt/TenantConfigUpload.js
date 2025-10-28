import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header, Toast } from "@egovernments/digit-ui-react-components";
import { TenantConfigSearch } from "../../../../../../libraries/src/services/elements/TenantConfigService";


const fieldStyle = { marginRight: 0 };

const TenantConfigUpload = () => {
  const defaultValue = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploadData, setUploadData] = useState([]); // State to store the uploaded data
  const [tenantDocument, setDocuments] = useState([]);

  

  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/tenant-management/tenant/config/_update`,
    params: {},
    config: {
      enable: false,
    },
  });


  // Configuration for the form with two uploaders
  const config = [
    {
      head: null,
      body: [
        {
          type: "component",
          component: "ConfigUploaderComponent",
          key: "ConfigUploaderComponent",
          withoutLabel: true,
          disable: false,
          customProps: {
            module: "Sandbox",
            type: "bannerUrl",
          },
          populators: {
            name: "configUploader",
          },
        },
        {
          type: "component",
          component: "LogoUploaderComponent",
          key: "LogoUploaderComponent",
          withoutLabel: true,
          disable: false,
          customProps: {
            module: "Sandbox",
            type: "logoUrl",
          },
          populators: {
            name: "logoUploader",
          },
        },
      ],
    },
  ];


  // Handle form submission
  const onSubmit = (data) => {   
    const documents = Object.keys(data).map((key) => {
      return {
        fileStoreId: data[key]?.fileStoreId,
        type: data[key]?.type,
      };
    });

    const isBannerUndefined = documents.find(doc => doc.type === "bannerUrl")?.fileStoreId === undefined;
    const isLogoUndefined = documents.find(doc => doc.type === "logoUrl")?.fileStoreId === undefined;
  
    if (isBannerUndefined && isLogoUndefined) {
      setToastMessage(t("BOTH_FILESTOREIDS_ARE_UNDEFINED"));
      setIsError(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return; 
    }

    setUploadData(documents);
  };


  // Make API call when `uploadData` is updated
  useEffect(() => {
    if (uploadData.length > 0) {
      triggerCreate(uploadData,tenantDocument);
    }

  }, [uploadData]);

  useEffect(()=>{
    const fetchData =async ()=>{
      const tenantConfigs = await TenantConfigSearch.tenant(tenantId);
      const tenantConfigSearch = tenantConfigs?.tenantConfigs ? tenantConfigs?.tenantConfigs : null;
      // Assuming the structure you provided, we extract the documents array
      setDocuments(tenantConfigSearch);
    }
    fetchData();
  },[])
  


  const  transformData=(inputData, requestData)  =>{
    // Iterate over the input data to update fileStoreId in requestData
    inputData.forEach(input => {
        requestData[0].documents.forEach(doc => {
            if (doc.type === input.type) {
                doc.fileStoreId = input.fileStoreId;
            }
        });
    });
    requestData["tenantConfig"] = requestData["0"];
    delete requestData["0"];
    return requestData;
}


  const triggerCreate = async (documentsArray, tenantDocument) => {
    try {
      const requestBody = transformData(documentsArray, tenantDocument);
      // Assuming the mutation for API call is defined elsewher
      await mutation.mutate(
        {
          url: `/tenant-management/tenant/config/_update`,
          body: requestBody,
          config: {
            enable: true,
          },
        },
        {
          onError: (error) => {
            setToastMessage(error.message || t("CONFIG_UPLOAD_ERROR_MESSAGE"));
            setIsError(true);
            setShowToast(true);
          },
          onSuccess: () => {
            setToastMessage(t("CONFIG_UPLOAD_SUCCESSFUL_TOAST_MESSAGE"));
            setIsError(false);
            setShowToast(true);
            setTimeout(() => {
              closeToast();
              history.push(`/${window?.contextPath}/employee`);
            }, 3000);
          },
        }
      );
    } catch (error) {
      setToastMessage(error.message);
      setIsError(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  return (
    <div>
      <Header> {t("UPLOAD_LABEL_BANNER_CONFIGS")}</Header>
      <FormComposerV2
        label={t("SANDBOX_CONFIG_UPLOAD_DONE")}
        config={config}
        defaultValues={defaultValue}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => { }}
        onSubmit={(data) => onSubmit(data)}
        fieldStyle={fieldStyle}
        noBreakLine={true}
      />
      {showToast && (
        <Toast
          error={isError}
          label={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default TenantConfigUpload;
