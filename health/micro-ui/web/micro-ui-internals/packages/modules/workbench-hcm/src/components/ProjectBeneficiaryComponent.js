import React from "react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";


const ProjectBeneficiaryComponent = (props) => {
  const { t } = useTranslation();
  const [productIds, setProductIds] = useState([]);
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const requestCriteria = {
    url: `${url}/resource/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },

    body: {
      ProjectResource: {
        projectId: [props.projectId],
      },
      // apiOperation: "SEARCH"
    },
    config: {
      enabled: props.projectId ? true : false,
    },
  };

  const { isLoading, data: projectResource } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const [userIds, setUserIds] = useState([]);

  useEffect(() => {
    // Extract productVariantIds and save them in the state
    if (projectResource && projectResource?.ProjectResources?.length > 0) {
      const productVariantIdsArray = projectResource?.ProjectResources.map((row) => row.resource?.productVariantId);
      setUserIds(productVariantIdsArray);
    }
  }, [projectResource]);

  const productVariantRequest = {
    url: "/product/variant/v1/_search",
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },
    body: {
      ProductVariant: {
        id: userIds,
      },
    },
    config: {
      enabled: userIds.length > 0 ? true : false,
    },
  };

  const { isLoading: VariantLoading, data: variantDetails } = Digit.Hooks.useCustomAPIHook(productVariantRequest);

  useEffect(() => {
    // Extract product IDs from variantDetails and save them in the state
    if (variantDetails && variantDetails?.ProductVariant.length > 0) {
      const ProductIdArray = variantDetails.ProductVariant.map((row) => row.productId);
      setProductIds(ProductIdArray);
    }
  }, [variantDetails]);

  const productRequest = {
    url: "/product/v1/_search",
    changeQueryName: productIds,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },
    body: {
      Product: {
        id: productIds,
      },
    },
    config: {
      enabled: Boolean(productIds?.length),
    },
  };

  const { data: product } = Digit.Hooks.useCustomAPIHook(productRequest);

  const userMap = {};
  variantDetails?.ProductVariant?.forEach((productVariant) => {
    userMap[productVariant.id] = productVariant;
  });

  const mappedProjectVariant = projectResource?.ProjectResources.map((resource) => {
    const productVariantInfo = userMap[resource.resource?.productVariantId];
    const productInfo = product?.Product?.find((p) => p.id === productVariantInfo?.productId);

    if (productVariantInfo && productInfo) {
      return {
        ...resource,
        productVariant: {
          ...productVariantInfo,
          product: productInfo,
        },
      };
    } else {
      // Handle the case where productVariant or product info is not found for a productVariantId
      return {
        ...resource,
        productVariant: null,
      };
    }
  });

  const isValidTimestamp = (timestamp) => timestamp !== 0 && !isNaN(timestamp);

  //to convert epoch to date
  projectResource?.ProjectResources.forEach((row) => {
    row.formattedStartDate = isValidTimestamp(row.startDate) ? Digit.DateUtils.ConvertEpochToDate(row.startDate) : "NA";
    row.formattedEndDate = isValidTimestamp(row.endDate) ? Digit.DateUtils.ConvertEpochToDate(row.endDate) : "NA";
  });

  const columns = [
    { label: t("PROJECT_RESOURCE_ID"), key: "id" },
    { label: t("PRODUCT_VARIANT_ID"), key: "resource.productVariantId" },
    { label: t("PRODUCT_ID"), key: "productVariant.productId" },
    { label: t("SKU"), key: "productVariant.sku" },
    { label: t("MASTER_LANDING_SCREEN_PRODUCT_VARIANT"), key: "productVariant.variation" },
    { label: t("HCM_PRODUCT_TYPE"), key: "resource.type" },
    { label: t("NAME"), key: "productVariant.product.name" },
    { label: t("MANUFACTURER"), key: "productVariant.product.manufacturer" },
    { label: t("PRODUCT_TYPE"), key: "productVariant.product.type" },
  ];

  const getDetailFromProductVariant = (row, key) => {
    const productVariantDetail = row.productVariant || {};

    // Helper function to traverse nested keys
    const getValue = (object, nestedKey) => {
      const keys = nestedKey.split(".");
      return keys.reduce((acc, curr) => acc?.[curr], object);
    };

    // Check if the key is nested
    const value = getValue(row, key);

    // Handle boolean values
    if (typeof value === "boolean") {
      return value?.toString();
    }

    // Check if the value exists, otherwise return 'NA'
    return value !== undefined ? value?.toString() : "NA";
  };

  return (
    <ReusableTableWrapper
      title="PROJECT_RESOURCE"
      data={mappedProjectVariant || []}
      columns={columns}
      isLoading={isLoading}
      noDataMessage="NO_PROJECT_RESOURCE"
      getNestedValue={getDetailFromProductVariant}
    />
  );
};

export default ProjectBeneficiaryComponent;
