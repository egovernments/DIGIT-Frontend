import React from "react";
import ProductDetailsComponent from "./ProductDetailsComponent";
import { Loader } from "@egovernments/digit-ui-components";
import { useParams } from "react-router-dom";


const ProductDetails = () => {
  const { module } = useParams();

  const { data: config , isLoading} = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "sandbox",
    [
      {
        name: "ProductDetails",
        filter: `[?(@.module=='${module}')]`

      },
    ],
    {
      select: (data) => {
        return data?.["sandbox"]?.["ProductDetails"];
      },
    }
  );
  if(isLoading) return <Loader variant={"PageLoader"} />;

  return (
    <ProductDetailsComponent config={config} module={module}/>
  );
    
};

export default ProductDetails;
