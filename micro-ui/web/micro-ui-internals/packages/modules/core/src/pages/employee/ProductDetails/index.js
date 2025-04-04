import React from "react";
import ProductDetailsComponent from "./ProductDetailsComponent";
import { detailsConfig } from "./DetailsConfig";

const ProductDetails = () => {
  return (
    <ProductDetailsComponent config={detailsConfig}/>
  );
    
};

export default ProductDetails;
