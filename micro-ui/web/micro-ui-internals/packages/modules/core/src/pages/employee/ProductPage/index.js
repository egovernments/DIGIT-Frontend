import React from "react";
import ProductsPageComponent from "./ProductPageComponent";
import { Loader } from "@egovernments/digit-ui-components";


const ProductPage = () => {

 
  const { data: detailsConfig , isLoading} = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCitizenCurrentTenant(),
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



  if(isLoading) return <Loader />  
  return (
    <ProductsPageComponent detailsConfig = {detailsConfig} />
  );  
};

export default ProductPage;
