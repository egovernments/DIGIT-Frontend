import React ,{ useState, Fragment} from "react";
import {
  Button,
  Modal,
  TextInput,
  Close,
  CloseSvg,
  Card,
  LabelFieldPair
} from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const ProjectBeneficiaryModal = ({
  onClose,
  projectId,
  tenantId,
  onSuccess
}) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  
  // Internal state
  const [productVariantId, setProductVariantId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search functionality
  const variantSearchCriteria = {
    url: "/product/variant/v1/_search",
    config: { enable: true },
  };

  const variantSearchMutation = Digit.Hooks.useCustomAPIMutationHook(variantSearchCriteria);

  const handleVariantSearch = async () => {
    if (!productVariantId.trim()) {
      setShowToast({ label: "WBH_PLEASE_ENTER_PRODUCT_VARIANT_ID", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      return;
    }

    setIsSearching(true);
    try {
      await variantSearchMutation.mutate(
        {
          params: {
            tenantId,
            limit: 10,
            offset: 0,
          },
          body: {
            ProductVariant: {
              id: [productVariantId.trim()],
            },
            apiOperation: "SEARCH"
          },
        },
        {
          onSuccess: (data) => {
            if (data?.ProductVariant && data?.ProductVariant?.length > 0) {
              setSearchResult(data.ProductVariant[0]);
            } else {
              setSearchResult(null);
              setShowToast({ label: "WBH_PRODUCT_VARIANT_NOT_FOUND", isError: true });
              setTimeout(() => setShowToast(null), 5000);
            }
            setIsSearching(false);
          },
          onError: () => {
            setSearchResult(null);
            setShowToast({ label: "WBH_PRODUCT_VARIANT_SEARCH_FAILED", isError: true });
            setTimeout(() => setShowToast(null), 5000);
            setIsSearching(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ label: "WBH_PRODUCT_VARIANT_SEARCH_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      setIsSearching(false);
    }
  };

  // Create functionality
  const createResourceCriteria = {
    url: `${url}/resource/v1/_create`,
    config: false,
  };

  const createMutation = Digit.Hooks.useCustomAPIMutationHook(createResourceCriteria);

  const handleSubmit = async () => {
    if (!searchResult) return;

    setIsSubmitting(true);
    try {
      await createMutation.mutate(
        {
          body: {
            ProjectResource: {
              tenantId,
              projectId,
              resource: {
                productVariantId: searchResult.id,
                type: "BENEFICIARY", // Default type for beneficiary
              },
            },
          },
        },
        {
          onSuccess: () => {
            setShowToast({ label: "WBH_PROJECT_BENEFICIARY_ADDED_SUCCESSFULLY", isError: false });
            setTimeout(() => {
              onSuccess && onSuccess();
              onClose();
            }, 1500);
          },
          onError: (resp) => {
            const label = resp?.response?.data?.Errors?.[0]?.code || "WBH_PROJECT_BENEFICIARY_FAILED";
            setShowToast({ isError: true, label });
            setTimeout(() => setShowToast(null), 5000);
            setIsSubmitting(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_BENEFICIARY_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    setProductVariantId(event.target.value);
    if (searchResult) {
      setSearchResult(null);
    }
  };

  const handleClose = () => {
    setProductVariantId("");
    setSearchResult(null);
    setShowToast(null);
    onClose();
  };

  const CloseBtn = (props) => {
    return (
      <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
        {props?.isMobileView ? (
          <CloseSvg />
        ) : (
          <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
            <Close />
          </div>
        )}
      </div>
    );
  };

  const Heading = (props) => {
    return <h1 className="heading-m">{props.heading}</h1>;
  };

  const productVariantDisplayData = searchResult ? (
    <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <strong>{t("PRODUCT_VARIANT_ID")}:</strong>
          <div>{searchResult.id || "NA"}</div>
        </div>
        <div>
          <strong>{t("SKU")}:</strong>
          <div>{searchResult.sku || "NA"}</div>
        </div>
        <div>
          <strong>{t("MASTER_LANDING_SCREEN_PRODUCT_VARIANT")}:</strong>
          <div>{searchResult.variation || "NA"}</div>
        </div>
        <div>
          <strong>{t("PRODUCT_ID")}:</strong>
          <div>{searchResult.productId || "NA"}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Modal
        className="project-beneficiary-modal"
        popupStyles={{ maxWidth: "800px", width: "70%" }}
        formId="modal-action"
        headerBarMain={<Heading t={t} heading={t("WBH_ASSIGN_PROJECT_BENEFICIARY")} />}
        headerBarEnd={<CloseBtn onClick={handleClose} />}
        actionSaveLabel={t("CORE_COMMON_SUBMIT")}
        actionCancelLabel={t("CORE_COMMON_CANCEL")}
        actionCancelOnSubmit={handleClose}
        actionSaveOnSubmit={handleSubmit}
        isDisabled={!searchResult || isSubmitting}
      >
        <Card style={{ boxShadow: "none" }}>
          <LabelFieldPair>
            <TextInput 
              name={"productVariantId"} 
              placeholder={`${t("PRODUCT_VARIANT_ID")}`} 
              value={productVariantId} 
              onChange={handleInputChange} 
              disabled={isSearching || isSubmitting}
            />
          </LabelFieldPair>
          <Button 
            label={`${t("WBH_ACTION_SEARCH")}`} 
            type="button" 
            onButtonClick={handleVariantSearch}
            isDisabled={isSearching || isSubmitting || !productVariantId.trim()}
          />
          {productVariantDisplayData}
        </Card>
      </Modal>
      
      {showToast && (
        <Toast 
          label={showToast.label} 
          type={showToast?.isError ? "error" : "success"} 
          onClose={() => setShowToast(null)} 
        />
      )}
    </>
  );
};

export default ProjectBeneficiaryModal;