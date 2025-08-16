import React from "react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";


const ProjectBeneficiaryComponent = (props) => {
  const { t } = useTranslation();
  const [projectResource, setProjectResource] = useState(null);
  const [variantDetails, setVariantDetails] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

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
      });

      setProduct(res);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProduct(null);
    } finally {
      setIsProductLoading(false);
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

  //to convert epoch to date
  projectResource?.ProjectResources.forEach((row) => {
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
  ];

  return (
    <ReusableTableWrapper
      title="PROJECT_RESOURCE"
      data={mappedProjectVariant || []}
      columns={columns}
      isLoading={isLoading || isVariantLoading || isProductLoading}
      noDataMessage="NO_PROJECT_RESOURCE"
    />
  );
};

export default ProjectBeneficiaryComponent;
