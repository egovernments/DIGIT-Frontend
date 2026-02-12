import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { addProductConfig } from "../../configs/addProductConfig";
import { Toast ,SVG} from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

function AddProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const { state } = useLocation();
  const { mutate: createProduct } = Digit.Hooks.campaign.useCreateProduct(tenantId);
  const { mutate: createProductVariant } = Digit.Hooks.campaign.useCreateProductVariant(tenantId);
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get('projectType');

  const checkValid = (formData) => {
    const target = formData?.["addProduct"];
    let isValid = false;
    if (target) {
      isValid = target?.some((i) => !i.name || !i.type || !i.variant);
      return !isValid;
    } else {
      return isValid;
    }
  };
  
  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

  const onSubmit = async (formData) => {
    const isValid = checkValid(formData);
    const invalidName = formData?.addProduct
      ?.map((i) => {
        if (i?.name?.length >= 1 && i?.name?.length < 101) {
          return true;
        } else {
          return false;
        }
      })
      ?.includes(false);


    const invalidVariant = formData?.addProduct
      ?.map((i) => {
        if (i?.variant?.length >= 2 && i?.variant?.length < 101) {
          return true;
        } else {
          return false;
        }
      })
      ?.includes(false);


    if (!isValid) {
      setShowToast({ key: "error", label: "CAMPAIGN_ADD_PRODUCT_MANDATORY_ERROR", isError: true });
      return;
    }


    if (invalidName) {
      setShowToast({ key: "error", label: "CAMPAIGN_PRODUCT_NAME_ERROR", isError: true });
      return;
    }

    if (invalidVariant) {
      setShowToast({ key: "error", label: "CAMPAIGN_PRODUCT_VARIANT_ERROR", isError: true });
      return;
    }

    const payloadData = formData?.["addProduct"]?.map((i) => ({
      tenantId: tenantId,
      type: i?.type?.code,
      name: i?.name,
    }));

    await createProduct(payloadData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", label: error, isError: true });
      },
      onSuccess: async (data) => {
        const resData = data?.Product;
        const usedCombinations = new Set();
        const variantPayload = resData.map((i) => {
          const target = formData?.["addProduct"]?.find((f) => {
            const combination = `${f.name}-${f.variant}`;
            if (f.name === i.name && !usedCombinations.has(combination)) {
              usedCombinations.add(combination);
              return true;
            }
            return false;
          });
          if (target) {
            return {
              tenantId: tenantId,
              productId: i?.id,
              variation: target?.variant,
              sku: `${target?.name} - ${target?.variant}`,
              additionalFields: {
                schema: "ProductVariant",
                version: 1,
                fields: [
                  {
                    value: projectType,
                    key: "projectType",
                  },
                ],
              },
            };
          }
          return;
        });
        
        if ((variantPayload || []).some((item) => item == null && item == undefined)) {
          setShowToast({ key: "error", label: "DUPLICATE_PRODUCT_VARIANT_ERROR", isError: true });
          return;
        }
        
        await createProductVariant(variantPayload, {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error, isError: true });
          },
          onSuccess: async (data) => {
            // Determine the correct return path based on where we came from
            const returnPath = getReturnPath();
            
            navigate(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
              state: {
                message: "ES_PRODUCT_CREATE_SUCCESS_RESPONSE",
                preText: "ES_PRODUCT_CREATE_SUCCESS_RESPONSE_PRE_TEXT",
                boldText: "ES_PRODUCT_CREATE_SUCCESS_RESPONSE_BOLD_TEXT",
                postText: "ES_PRODUCT_CREATE_SUCCESS_RESPONSE_POST_TEXT",
                actionLabel: "ES_PRODUCT_RESPONSE_ACTION",
                primaryActionIcon: "UndoIcon",
                actionLink: returnPath,
                isPrimaryIconSuffix: false,
                primaryActionVariation: "primary"
              },
            });
          },
        });
      },
    });
    return;
  };
  
  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    return;
  };

  // Helper function to construct return URL from session and state
  const getReturnPath = () => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    if (currentPath.includes('add-product') && currentSearch) {
      // Parse current URL params to check if they contain campaign info
      const urlParams = new URLSearchParams(currentSearch);
      if (urlParams.has('id') || urlParams.has('campaignId')) {
        // Update key to 8 for delivery rules step
        urlParams.set('key', '8');
        return `/${window.contextPath}/employee/campaign/setup-campaign?${urlParams.toString()}`;
      }
    }
  };

  const onSecondayActionClick = () => {
    
    // Preserve current campaign session data when navigating back
    const currentSessionData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA");
    

    
    // Get the return path
    const returnPath = getReturnPath();
    navigate(returnPath);
  };

  return (
    <div>
      <FormComposerV2
        showMultipleCardsWithoutNavs={true}
        label={t(I18N_KEYS.PAGES.ES_CAMPAIGN_ADD_PRODUCT_BUTTON)}
        config={addProductConfig?.map((config) => {
          return {
            ...config,
          };
        })}
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 0 }}
        noBreakLine={true}
        cardClassName={"page-padding-fix add-product-screen"}
        onFormValueChange={onFormValueChange}
        actionClassName={"addProductActionClass setup-campaign-action-bar"}
        showSecondaryLabel={true}
        secondaryLabel={t(I18N_KEYS.COMMON.HCM_BACK)}
        onSecondayActionClick={onSecondayActionClick}
        secondaryActionIcon={<SVG.ArrowBack />}
        primaryActionIconAsSuffix={true}
        primaryActionIcon={"CheckCircleOutline"}
      />

      {showToast && (
        <Toast
          type={showToast?.isError ? "error" : "success"}
          label={t(showToast?.label)}
          isDleteBtn={"true"}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default AddProduct;