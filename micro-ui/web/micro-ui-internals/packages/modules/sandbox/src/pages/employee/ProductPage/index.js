import React from "react";
import ProductsPageComponent from "./ProductPageComponent";
import { Loader } from "@egovernments/digit-ui-components";

const ProductPage = () => {
  const { data: detailsConfig, isLoading } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "sandbox",
    [
      {
        name: "ProductDetails",
      },
    ],
    {
      select: (data) => {
        return data?.["sandbox"]?.["ProductDetails"];
      },
    }
  );

  const preferredOrder = [
    "PGR",
    "TL",
    "PT",
    "OBPS",
    "mCollect",
    "Finance",
    "WS",
    "BND",
    "FSM",
    "Firenoc",
    "SURVEY",
  ];

  const sortedDetails = React.useMemo(() => {
    if (!detailsConfig) return [];
    return [...detailsConfig].sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.module);
      const indexB = preferredOrder.indexOf(b.module);
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });
  }, [detailsConfig]);

  if (isLoading) return <Loader variant="PageLoader" />;
  
  return <ProductsPageComponent detailsConfig={sortedDetails} />;
};

export default ProductPage;
