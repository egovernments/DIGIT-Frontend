import React from "react";
import ProductsPageComponent from "./ProductPageComponent";
import { Loader } from "@egovernments/digit-ui-components";

const ProductPage = () => {
  const { data: ProductsConfig , isLoading} = Digit.Hooks.useCustomMDMS(
    "default",
    "sandbox",
    [
      {
        name: "products",
      },
    ],
    {
      select: (data) => {
        return data?.["sandbox"]?.["products"]?.[0];
      },
    }
  );

  if(isLoading) return <Loader />  
  return (
    <ProductsPageComponent ProductsConfig={ProductsConfig} />
  );  
};

export default ProductPage;
