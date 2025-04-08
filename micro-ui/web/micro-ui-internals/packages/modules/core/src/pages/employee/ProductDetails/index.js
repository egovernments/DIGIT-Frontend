import React from "react";
import ProductDetailsComponent from "./ProductDetailsComponent";
import { Loader } from "@egovernments/digit-ui-components";

const ProductDetails = () => {

  const { data: detailsconfig , isLoading} = Digit.Hooks.useCustomMDMS(
    "default",
    "tl",
    [
      {
        name: "productDetails",
      },
    ],
    {
      enabled: true,
      staleTime: 0,
      cacheTime: 0,
      select: (data) => {
        return data?.["tl"]?.["productDetails"];
      },
    }
  );

  if(isLoading) return <Loader variant={"PageLoader"} />
  return (
    <ProductDetailsComponent config={detailsconfig}/>
  );
    
};

export default ProductDetails;
