import React, { useState ,useEffect, Fragment} from "react";

import { useTranslation } from "react-i18next";
import { Button, Loader, SVG, Header } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";
import ProjectBeneficiaryModal from "./ProjectBeneficiaryModal";
import ConfirmationDialog from "./ConfirmationDialog";

const ProjectBeneficiaryComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  // State for modals and operations
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deletionDetails, setDeletionDetails] = useState({
    projectId: null,
    resourceId: null,
    id: null,
  });

  // State for data
  const [projectResource, setProjectResource] = useState(null);
  const [variantDetails, setVariantDetails] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);

  // Fetch project resources using Digit.CustomService.getResponse
  const fetchProjectResources = async () => {
    if (!props.projectId || !tenantId) {
      setProjectResource(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await Digit.CustomService.getResponse({
        url: `${url}/resource/v1/_search?offset=0&tenantId=${tenantId}&limit=10`,
        body: {
          ProjectResource: {
            projectId: [props.projectId],
          },
          apiOperation: "SEARCH"
        },
      });

      setProjectResource(res);
    } catch (error) {
      console.error("Error fetching project resources:", error);
      setProjectResource(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product variants using Digit.CustomService.getResponse
  const fetchProductVariants = async (productVariantIds) => {
    if (!productVariantIds || productVariantIds.length === 0) {
      setVariantDetails(null);
      return;
    }

    setIsVariantLoading(true);
    try {
      const res = await Digit.CustomService.getResponse({
        url: "/product/variant/v1/_search",
        body: {
          ProductVariant: {
            id: productVariantIds,
          },
          apiOperation: "SEARCH"
        },
          params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
      });

      setVariantDetails(res);
    } catch (error) {
      console.error("Error fetching product variants:", error);
      setVariantDetails(null);
    } finally {
      setIsVariantLoading(false);
    }
  };

  // Fetch products using Digit.CustomService.getResponse
  const fetchProducts = async (productIds) => {
    if (!productIds || productIds.length === 0) {
      setProduct(null);
      return;
    }

    setIsProductLoading(true);
    try {
      const res = await Digit.CustomService.getResponse({
        url: "/product/v1/_search",
        body: {
          Product: {
            id: productIds,
          },
          apiOperation: "SEARCH"
        },
         params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0,
    },
      });

      setProduct(res);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProduct(null);
    } finally {
      setIsProductLoading(false);
    }
  };

  // Delete mutation hook
  const deleteResourceCriteria = {
    url: `${url}/resource/v1/_delete`,
    config: false,
  };

  const deleteMutation = Digit.Hooks.useCustomAPIMutationHook(deleteResourceCriteria);

  // Modal handlers
  const closeModal = () => {
    setShowModal(false);
    setShowPopup(false);
  };

  const handleBeneficiaryAdded = () => {
    fetchProjectResources();
  };

  // Handle beneficiary delinking
  const handleProjectResourceDelete = async (projectId, resourceId, id, confirmed) => {
    try {
      setShowPopup(false);
      if (confirmed) {
        const ProjectResource = {
          tenantId,
          id,
          projectId,
          resource: {
            productVariantId: resourceId,
            type: "BENEFICIARY",
          },
          ...deletionDetails,
        };
        // Clean up extra properties
        delete ProjectResource?.productVariantId;
        delete ProjectResource?.productId;
        delete ProjectResource?.sku;
        delete ProjectResource?.variation;
        delete ProjectResource?.resourceType;
        delete ProjectResource?.productName;
        delete ProjectResource?.manufacturer;
        delete ProjectResource?.productType;

        await deleteMutation.mutate(
          {
            body: {
              ProjectResource,
            },
          },
          {
            onSuccess: () => {
              fetchProjectResources();
              setShowToast({ key: "success", label: "WBH_PROJECT_BENEFICIARY_DELETED_SUCCESSFULLY" });
              setTimeout(() => setShowToast(null), 5000);
            },
            onError: (resp) => {
              const label = resp?.response?.data?.Errors?.[0]?.code;
              setShowToast({ isError: true, label });
              setTimeout(() => setShowToast(null), 5000);
            },
          }
        );
      }
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_BENEFICIARY_DELETION_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
    }
  };

  // Fetch project resources when component mounts or projectId changes
  useEffect(() => {
    fetchProjectResources();
  }, [props.projectId, tenantId]);

  // Fetch product variants when project resources are loaded
  useEffect(() => {
    if (projectResource && projectResource?.ProjectResources?.length > 0) {
      const productVariantIds = projectResource.ProjectResources
        .map((row) => row.resource?.productVariantId)
        .filter(Boolean);
      
      if (productVariantIds.length > 0) {
        fetchProductVariants(productVariantIds);
      } else {
        setVariantDetails(null);
      }
    } else {
      setVariantDetails(null);
    }
  }, [projectResource]);

  // Fetch products when variant details are loaded
  useEffect(() => {
    if (variantDetails && variantDetails?.ProductVariant?.length > 0) {
      const productIds = variantDetails.ProductVariant
        .map((row) => row.productId)
        .filter(Boolean);
      
      if (productIds.length > 0) {
        fetchProducts(productIds);
      } else {
        setProduct(null);
      }
    } else {
      setProduct(null);
    }
  }, [variantDetails]);

  const userMap = {};
  variantDetails?.ProductVariant?.forEach((productVariant) => {
    userMap[productVariant.id] = productVariant;
  });

  const mappedProjectVariant = projectResource?.ProjectResources?.map((resource) => {
    const productVariantInfo = userMap[resource.resource?.productVariantId];
    const productInfo = product?.Product?.find((p) => p.id === productVariantInfo?.productId);

    return {
      ...resource,
      productVariantId: resource.resource?.productVariantId || "NA",
      productId: productVariantInfo?.productId || "NA",
      sku: productVariantInfo?.sku || "NA",
      variation: productVariantInfo?.variation || "NA",
      resourceType: resource.resource?.type || "NA",
      productName: productInfo?.name || "NA",
      manufacturer: productInfo?.manufacturer || "NA",
      productType: productInfo?.type || "NA",
    };
  }) || [];

  const isValidTimestamp = (timestamp) => timestamp !== 0 && !isNaN(timestamp);

  // Convert epoch to date
  projectResource?.ProjectResources?.forEach((row) => {
    row.formattedStartDate = isValidTimestamp(row.startDate) ? Digit.DateUtils.ConvertEpochToDate(row.startDate) : "NA";
    row.formattedEndDate = isValidTimestamp(row.endDate) ? Digit.DateUtils.ConvertEpochToDate(row.endDate) : "NA";
  });

  const columns = [
    { label: t("PROJECT_RESOURCE_ID"), key: "id" },
    { label: t("PRODUCT_VARIANT_ID"), key: "productVariantId" },
    { label: t("PRODUCT_ID"), key: "productId" },
    { label: t("SKU"), key: "sku" },
    { label: t("MASTER_LANDING_SCREEN_PRODUCT_VARIANT"), key: "variation" },
    { label: t("HCM_PRODUCT_TYPE"), key: "resourceType" },
    { label: t("NAME"), key: "productName" },
    { label: t("MANUFACTURER"), key: "manufacturer" },
    { label: t("PRODUCT_TYPE"), key: "productType" },
    { label: t("WBH_DELETE_ACTION"), key: "deleteAction" },
  ];

  if (isLoading || isVariantLoading || isProductLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("PROJECT_RESOURCE")}</Header>

      <div>
        <Button 
          label={t("WBH_ADD_PROJECT_BENEFICIARY")} 
          type="button" 
          variation={"secondary"} 
          onButtonClick={() => setShowModal(true)} 
        />

        {showModal && (
          <ProjectBeneficiaryModal
            onClose={closeModal}
            projectId={props.projectId}
            tenantId={tenantId}
            onSuccess={handleBeneficiaryAdded}
          />
        )}

        {showPopup && (
          <ConfirmationDialog
            t={t}
            heading={"WBH_DELETE_POPUP_HEADER"}
            closeModal={closeModal}
            onSubmit={(confirmed) => 
              handleProjectResourceDelete(
                deletionDetails.projectId, 
                deletionDetails.resourceId, 
                deletionDetails.id, 
                confirmed
              )
            }
          />
        )}

        {showToast && (
          <Toast 
            label={showToast.label} 
            type={showToast?.isError ? "error" : "success"} 
            onClose={() => setShowToast(null)} 
          />
        )}

        <ReusableTableWrapper
          title="PROJECT_RESOURCE"
          data={mappedProjectVariant || []}
          columns={columns}
          isLoading={isLoading || isVariantLoading || isProductLoading}
          noDataMessage="NO_PROJECT_RESOURCE"
          customCellRenderer={{
            deleteAction: (row) => (
              <Button
                label={`${t("WBH_DELETE_ACTION")}`}
                type="button"
                variation="secondary"
                icon={<SVG.Delete width={"28"} height={"28"} />}
                onButtonClick={() => {
                  setDeletionDetails({
                    projectId: row.projectId,
                    resourceId: row.productVariantId,
                    id: row.id,
                    ...row,
                  });
                  setShowPopup(true);
                }}
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ProjectBeneficiaryComponent;