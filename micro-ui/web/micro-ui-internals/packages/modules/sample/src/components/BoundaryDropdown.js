import React, { useState, useEffect ,Fragment} from "react";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { ErrorMessage, FieldV1 , Stepper , TextBlock ,Card, Dropdown } from "@egovernments/digit-ui-components";

const BoundaryDropdown = ({ onSelect, formData, control, formState, ...props }) => {
    const tenantId = Digit.ULBService.getStateId();
    const { isLoading, data: BoundaryConfig } = Digit.Hooks.useCustomMDMS(tenantId, "RAINMAKER-PGR", [{ name: "BoundaryConfig" }] ,
      {
        select: (data) => {
          console.log("dcd" ,data?.["RAINMAKER-PGR"]?.BoundaryConfig );
          return data?.["RAINMAKER-PGR"]?.BoundaryConfig?.[0];
        },
      },
    );
  const { t } = useTranslation();

  console.log("hiii", BoundaryConfig);

  const reqCriteria = {
    url: `/boundary-service/boundary/boundary-relationships/_search`,
    changeQueryName: `${BoundaryConfig?.hierarchy}`,
    params:{
      hierarchyType: BoundaryConfig?.hierarchy,
      boundaryType : BoundaryConfig?.hierarchyLevel,
      tenantId: tenantId


    },
    // body: {
    //   BoundaryTypeHierarchySearchCriteria: {
    //     tenantId: tenantId,
    //     limit: 2,
    //     offset: 0,
    //     hierarchyType: BoundaryConfig?.hierarchy,
    //   },
    // },
  };

  const { isLoading: hierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  console.log("hhh" ,hierarchy );



  return (
    <>
      <LabelFieldPair className="name-container-label" style={{ display: "flex" }}>
        <div className="name-container">
          <span>{BoundaryConfig?.hierarchyLevel}</span>
          <span className="mandatory-span">*</span>
        </div>
        <Dropdown
                  style={{width : "30%"}}
                  t={t}
                  option={[
                    {
                      code: "Myself",
                      name: "Myself",
                    },
                    {
                      code: "Another User",
                      name: "Another User",
                    },
                  ]}
                  optionKey={"code"}
                  // selected={type}
                  // select={(value) => {
                  //   setStartValidation(true);
                  //   handleChange(value);
                  // }}
                  
                />
      </LabelFieldPair>
    </>
  );
};

export default BoundaryDropdown;