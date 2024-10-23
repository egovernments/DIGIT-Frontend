import { Card, Loader } from "@egovernments/digit-ui-components";
import { Button, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import BoundaryPopup from "../../components/BoundaryPopup";

const config = {
  defaultHierarchyType: "DEFAULTBOUNDARY",
  hierarchyType: "DEMOONCONSOLE",
};
// const [config, setConfig] = useState({defaultHierarchyType: "DEFAULTBOUNDARY",
//   hierarchyType: "DEMOONCONSOLE"});

const Boundary = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [defaultHierarchyType, setDefaultHierarchyType] = useState(config?.defaultHierarchyType || searchParams.get("defaultHierarchyType"));
  const [hierarchyType, setHierarchyType] = useState(config?.hierarchyType || searchParams.get("hierarchyType"));
  
  const [showPopUp, setShowPopUp] = useState(false);
  const [geoPodeData, setGeoPodeData] = useState(false);
  const history = useHistory();
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const reqCriteriaResource = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: defaultHierarchyType,
      },
    },

  };
  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
  const rc = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "HCM-ADMIN-CONSOLE.HierarchySchema",
      },
    },
    changeQueryName: "SCHEMA_SEARCH",
  };
  const { isLoading1, data: mdms, isFetching1 } = Digit.Hooks.useCustomAPIHook(rc);
  const user = Digit.UserService.getUser();
  const user_name = user?.info?.userName;

  const rc1 = {
    url: `/health-hrms/employees/_search`,
    body: {
    },
    params: {
      tenantId: tenantId,
      codes: user_name,
      sortOrder: "ASC"

    },
    changeQueryName: user_name,
  }
  const { isLoading2, data:Employees, isFetching2 } = Digit.Hooks.useCustomAPIHook(rc1);
  
  const [authorized, setAuthorized] = useState(false);

  const getHierarchyTypes = React.useCallback((dataArray, campaign) => {
    return dataArray
      .filter(item => item.data.type === campaign)
      .map(item => item.data.hierarchytype)[0];
  }, []);

  // Separate useEffect for authorization check and hierarchy type updates
  useEffect(() => {
    if (!Employees?.Employees?.[0]?.assignments?.[0]?.department || !mdms) return;

    const dep = Employees.Employees[0].assignments[0].department;
    const arrayOfHier = mdms.mdms;

    if (dep === null) {
      setAuthorized(true);
      return;
    }

    const searchForDepInCampaign = (dataArray, dep) => {
      return dataArray.some(
        (item) => item.data.type === "campaign" && item.data.department.includes(dep)
      );
    };

    const result = searchForDepInCampaign(arrayOfHier, dep);
    
    if (result) {
      setAuthorized(true);
      
      // Get both hierarchy types at once to avoid multiple state updates
      const newHierarchyTypes = getHierarchyTypes(arrayOfHier, "campaign");
      const newDefHierarchyTypes = getHierarchyTypes(arrayOfHier, "default");

      // Only update if values have changed
      if (JSON.stringify(hierarchyType) !== JSON.stringify(newHierarchyTypes)) {
        setHierarchyType(newHierarchyTypes);
        callGenerate(newHierarchyTypes);
        // generateFile().catch(error => {
        //   console.error("Failed to generate file:", error);
        // });
      }
      
      if (JSON.stringify(defaultHierarchyType) !== JSON.stringify(newDefHierarchyTypes)) {
        setDefaultHierarchyType(newDefHierarchyTypes);
      }
    } else {
      setAuthorized(false);
    }
  }, [Employees, mdms, getHierarchyTypes]);
  

  const generateFile = async(hierarchyType)=>{
    const res = await Digit.CustomService.getResponse({
        url: `/project-factory/v1/data/_generate`,
        body: {
        },
        params: {
            tenantId: tenantId,
            type: "boundaryManagement",
            forceUpdate: true,
            hierarchyType: hierarchyType,
            campaignId: "default"
        }
    });
    return res;
}
  const callGenerate =async(hierarchyType)=>{
      const res = await generateFile(hierarchyType)
      return res;

  }

  useEffect(() => {
    if (data?.BoundaryHierarchy && data?.BoundaryHierarchy.length > 0) 
      {
        setGeoPodeData(true);
      }
  }, [data]);
  

  const [direct, setDirect] = useState(false);
  const [directView, setDirectView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Digit.CustomService.getResponse({
          url: `/boundary-service/boundary-hierarchy-definition/_search`,
          params: {},
          body: {
            BoundaryTypeHierarchySearchCriteria: {
              tenantId: tenantId,
              limit: 2,
              offset: 0,
              hierarchyType: hierarchyType,
            },
          },
        });
        if (res?.BoundaryHierarchy && res?.BoundaryHierarchy.length > 0) {
          setDirect(true);
          setDirectView(true);
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  const callGeoPode = (val) => {
    history.push(
      `/${window.contextPath}/employee/campaign/boundary/geopode?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}&newHierarchy=${val}`,
      { data: data }
    );
  };
  const callViewBoundary = () => {
    history.push(`/${window.contextPath}/employee/campaign/boundary/view-all-hierarchy`, { data: data });
  };
  const callDirectView = () => {
    history.push(
      `/${window.contextPath}/employee/campaign/boundary/view-hierarchy?defaultHierarchyType=${defaultHierarchyType}&hierarchyType=${hierarchyType}`,
      { data: data }
    );
  };

  const [toast, setToast] = useState(false);

  if (isFetching) return <Loader />;
  return (
    <React.Fragment>
      <BoundaryPopup showPopUp={showPopUp} setShowPopUp={setShowPopUp} callGeoPode={callGeoPode} geoPodeData={geoPodeData} />
      {toast &&
        <Toast label={t("USER_NOT_AUTHORISED")} type={"error"} onClose={() => setToast(false)} />}
      <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
        <div style={{ fontWeight: 700, fontSize: "2.5rem" }}>{t("BOUNDARY_DATA_MANAGEMENT")}</div>
        <div style={{ height: "2rem" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button
            type={"button"}
            size={"large"}
            // isDisabled={!authorized}
            variation={"secondary"}
            label={t("CREATE_NEW_BOUNDARY_DATA")}
            onClick={() => {
              if(authorized)
              {
              if (direct) {
                callDirectView();
              } else {
                setShowPopUp(true);
              }
            }
            else{
              setToast(true);

            }
            }}
            style={{ width: "38rem", height: "5rem" }}
            textStyles={{ fontSize: "1.5rem" }}
          />
          <Button
            type={"button"}
            size={"large"}
            isDisabled={!directView && !authorized}
            variation={"secondary"}
            label={t("EDIT_BOUNDARY_DATA")}
            onClick={() => {
              // setShowPopUp(false);
              if(authorized)
                {
                  callDirectView();
                }
                else{
                  setToast(true);
                }
            }}
            style={{ width: "38rem", height: "5rem" }}
            textStyles={{ fontSize: "1.5rem" }}
          />
          <Button
            type={"button"}
            size={"large"}
            variation={"secondary"}
            label={t("VIEW_EXISTING_BOUNDARY_DATA")}
            onClick={() => {
              // setShowPopUp(false);
              callViewBoundary();
            }}
            style={{ width: "38rem", height: "5rem" }}
            textStyles={{ fontSize: "1.5rem" }}
          />
        </div>
      </Card>
    </React.Fragment>
  );
};
export default Boundary;
