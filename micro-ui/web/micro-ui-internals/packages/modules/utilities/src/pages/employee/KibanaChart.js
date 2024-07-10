import React from "react";
import { useParams } from "react-router-dom";
import IFrameInterface from "./IFrameInterface";

const KibanaChart = ({ stateCode }) => {
  const { moduleName, pageName } = useParams();

  return <IFrameInterface moduleName={moduleName} pageName={pageName} stateCode={stateCode} />;
};

export default KibanaChart;
