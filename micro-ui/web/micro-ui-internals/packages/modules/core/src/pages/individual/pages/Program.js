import React from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";

const Program = ({}) => {
  // const Program=[]
  const { isLoading, data: programData } = Digit.Hooks.useCustomMDMS("pg", "mseva", [{ name: "Program" }], {
    select: (data) => {
      return data?.["mseva"]?.Program;
    },
  });
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="">
      
      {programData?.map((prog) => {
        return <div>code : {prog?.code}</div>;
      })}
    </div>
  );
};

export default Program;
