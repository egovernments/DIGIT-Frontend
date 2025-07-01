import React from "react";
import ProductDetailsComponent from "./ProductDetailsComponent";
import ProductDetailsComponentUpdated from "./ProductDetailsComponentUpdated";
import { Loader } from "@egovernments/digit-ui-components";
import { useParams } from "react-router-dom";


const ProductDetails = ({  isUpdated = false }) => {
  const { module } = useParams();
  const { data: config, isLoading } = Digit.Hooks.useCustomMDMS(
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
  if (isLoading) return <Loader variant={"PageLoader"} />;

  if(isUpdated){
    return (
      <ProductDetailsComponentUpdated config={config} module={module} />
    );

  }

  return (
    <ProductDetailsComponent config={config} module={module} />
  );

};

export default ProductDetails;
