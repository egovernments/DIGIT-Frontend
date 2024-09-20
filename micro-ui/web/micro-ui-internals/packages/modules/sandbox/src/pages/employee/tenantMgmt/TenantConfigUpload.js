import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header, Toast } from "@egovernments/digit-ui-react-components";

const fieldStyle = { marginRight: 0 };

const TenantConfigUpload = () => {
  const defaultValue = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploadData, setUploadData] = useState([]); // State to store the uploaded data

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
            type: "bannerImage",
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
            type: "logoImage",
          },
          populators: {
            name: "logoUploader",
          },
        },
      ],
    },
  ];

  // Transform data function
  const transformCreateData = (documentsArray, defaultData) => {
    return {
      tenantConfig: {
        code: defaultData.code || tenantId,
        otpLength: defaultData.otpLength || "6",
        name: defaultData.name || "PG",
        languages: defaultData.languages || ["en_IN"],
        defaultLoginType: defaultData.defaultLoginType || "OTP",
        enableUserBasedLogin: defaultData.enableUserBasedLogin || true,
        additionalAttributes: defaultData.additionalAttributes || {},
        documents: documentsArray.map((doc) => ({
          tenantId: tenantId,
          type: doc.type,
          fileStoreId: doc.fileStoreId,
          url: "",
          isActive: true,
          auditDetails: {
            createdBy: null,
            lastModifiedBy: null,
            createdTime: null,
            lastModifiedTime: null,
          },
        })),
        isActive: defaultData.isActive || true,
        auditDetails: {
          createdBy: null,
          lastModifiedBy: null,
          createdTime: null,
          lastModifiedTime: null,
        },
      },
    };
  };

  // Handle form submission
  const onSubmit = (data) => {
    const documents = Object.keys(data).map((key) => {
      return {
        fileStoreId: data[key]?.fileStoreId,
        type: data[key]?.type,
      };
    });
    setUploadData(documents);
  };

  // Make API call when `uploadData` is updated
  useEffect(() => {
    if (uploadData.length > 0) {
      triggerCreate(uploadData, defaultValue);
    }
  }, [uploadData]);

  const triggerCreate = async (documentsArray, defaultData) => {
    try {
      const requestBody = transformCreateData(documentsArray, defaultData);

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
            setToastMessage(error.message || t("ERROR_MESSAGE"));
            setIsError(true);
            setShowToast(true);
          },
          onSuccess: () => {
            setToastMessage(t("SANDBOX_TENANT_CREATE_SUCCESS_TOAST"));
            setIsError(false);
            setShowToast(true);
          },
        }
      );
    } catch (error) {
      setToastMessage(error.message);
      setIsError(true);
      setShowToast(true);
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
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {}}
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
