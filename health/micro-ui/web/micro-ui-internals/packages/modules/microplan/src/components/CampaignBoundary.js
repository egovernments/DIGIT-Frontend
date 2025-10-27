import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import SubBoundaryView from "./subBoundaryView";
import HeaderComp from "./HeaderComp";
import { Card, Button } from "@egovernments/digit-ui-components";
import BoundaryKpi from "./BoundaryKpi";
import { Header } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

const CampaignBoundary = ({ customProps, setupCompleted }) => {
  const { dispatch, state } = useMyContext();
  const { t } = useTranslation();



  const handleViewMore = (ind) => {
    // Create a copy of the boundaryStatus array
    const updatedBoundaryStatus = [...boundaryStatus];
    // Update the ind + 1 position to false
    if (boundaryStatus[ind]) {
      updatedBoundaryStatus[ind] = false;
    } else {
      updatedBoundaryStatus[ind] = true;
    }
    // Set the updated array in the state
    setBoundaryStatus(updatedBoundaryStatus);
    // Set showAllItems to true to show all items
  };
  // const selectedData = [
  //     {
  //         "code": "MICROPLAN_MO",
  //         "name": "MICROPLAN_MO",
  //         "type": "Country",
  //         "isRoot": true,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_SINOE",
  //         "name": "MICROPLAN_MO_05_SINOE",
  //         "type": "Province",
  //         "parent": "MICROPLAN_MO",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_07_JEDEPO",
  //         "name": "MICROPLAN_MO_05_07_JEDEPO",
  //         "type": "District",
  //         "parent": "MICROPLAN_MO_05_SINOE",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
  //         "name": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
  //         "type": "Locality",
  //         "parent": "MICROPLAN_MO_05_07_JEDEPO",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
  //         "name": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
  //         "type": "Village",
  //         "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
  //         "isRoot": false,
  //         "includeAllChildren": true
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_07_03_14_POKPAKEN_TOWN_P1888",
  //         "name": "MICROPLAN_MO_05_07_03_14_POKPAKEN_TOWN_P1888",
  //         "type": "Village",
  //         "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
  //         "isRoot": false,
  //         "includeAllChildren": true
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_06_JEADE",
  //         "name": "MICROPLAN_MO_05_06_JEADE",
  //         "type": "District",
  //         "parent": "MICROPLAN_MO_05_SINOE",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_06_03_DIYANKPO",
  //         "name": "MICROPLAN_MO_05_06_03_DIYANKPO",
  //         "type": "Locality",
  //         "parent": "MICROPLAN_MO_05_06_JEADE",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_06_03_09_DIYANKPO_MELINP1836",
  //         "name": "MICROPLAN_MO_05_06_03_09_DIYANKPO_MELINP1836",
  //         "type": "Village",
  //         "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
  //         "isRoot": false,
  //         "includeAllChildren": true
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_05_GREENVILLE",
  //         "name": "MICROPLAN_MO_05_05_GREENVILLE",
  //         "type": "District",
  //         "parent": "MICROPLAN_MO_05_SINOE",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
  //         "name": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
  //         "type": "Locality",
  //         "parent": "MICROPLAN_MO_05_05_GREENVILLE",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_05_05_04_16_SEEBEH_NYENNUE",
  //         "name": "MICROPLAN_MO_05_05_04_16_SEEBEH_NYENNUE",
  //         "type": "Village",
  //         "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
  //         "isRoot": false,
  //         "includeAllChildren": true
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_GBARPOLU",
  //         "name": "MICROPLAN_MO_04_GBARPOLU",
  //         "type": "Province",
  //         "parent": "MICROPLAN_MO",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_06_KUNGBOR",
  //         "name": "MICROPLAN_MO_04_06_KUNGBOR",
  //         "type": "District",
  //         "parent": "MICROPLAN_MO_04_GBARPOLU",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
  //         "name": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
  //         "type": "Locality",
  //         "parent": "MICROPLAN_MO_04_06_KUNGBOR",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_06_02_70_CAMP_ALPHA_TOWN1629",
  //         "name": "MICROPLAN_MO_04_06_02_70_CAMP_ALPHA_TOWN1629",
  //         "type": "Village",
  //         "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
  //         "isRoot": false,
  //         "includeAllChildren": true
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_05_GBARMA",
  //         "name": "MICROPLAN_MO_04_05_GBARMA",
  //         "type": "District",
  //         "parent": "MICROPLAN_MO_04_GBARPOLU",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
  //         "name": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
  //         "type": "Locality",
  //         "parent": "MICROPLAN_MO_04_05_GBARMA",
  //         "isRoot": false,
  //         "includeAllChildren": false
  //     },
  //     {
  //         "code": "MICROPLAN_MO_04_05_05_20_YANGARYAH_TOWN_1558",
  //         "name": "MICROPLAN_MO_04_05_05_20_YANGARYAH_TOWN_1558",
  //         "type": "Village",
  //         "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
  //         "isRoot": false,
  //         "includeAllChildren": true
  //     }
  // ]

  const [selectedData, setSelectedData] = useState(customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData);
  const history = useHistory();

  useEffect(() => {
    if (customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData) {
      setSelectedData(customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData);
    }
  }, [customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData]);

  // Memoizing parents and parent_group to only compute once when selectedData changes

  const { parents, parent_group } = useMemo(() => {
    if (!selectedData) {
      return { parents: null, parent_group: null };
    }
    let parents = {};
    let parent_group = {};

    for (const ob of selectedData) {
      if (ob["parent"]) {
        if (!(ob["parent"] in parents)) {
          parents[ob["parent"]] = [ob["code"]];
        } else {
          parents[ob["parent"]].push(ob["code"]);
        }
      }
    }

    for (const ob of selectedData) {
      const parentCodes = parents[ob["parent"]]; // Get the array of codes for the parent
      if (!parentCodes) {
        continue;
      }

      // If the type is not yet in parent_group, initialize it with the elements of parentCodes
      if (!(ob["type"] in parent_group)) {
        parent_group[ob["type"]] = [...parentCodes]; // Spread the elements of parentCodes directly
      } else {
        const existingCodes = parent_group[ob["type"]];

        // Check if any element from parentCodes already exists in the parent_group[ob['type']]
        parentCodes.forEach((code) => {
          if (!existingCodes.includes(code)) {
            parent_group[ob["type"]].push(code); // Add the code only if it's not already present
          }
        });
      }
    }

    return { parents, parent_group };
  }, [selectedData]);

  // Initialize boundaryHierarchy and bHierarchy as state
  const [boundaryHierarchy, setData] = useState(state?.["boundaryHierarchy"]);
  const [boundaryStatus, setBoundaryStatus] = useState(
    new Array(boundaryHierarchy.length).fill(true) // Creates an array filled with "True"
  );
  // const boundaryStatus=[false,false,false,false,true];

  const [bHierarchy, setbHierarchy] = useState([]);

  const [statusMap, setStatusMap] = useState({});
  useEffect(() => {
    if (selectedData && selectedData?.length >= 0) {
      setStatusMap(() => Digit.Utils.microplanv1.createStatusMap(selectedData, boundaryHierarchy));
    }
  }, [boundaryHierarchy]);

  // Prevent unnecessary useEffect calls
  useEffect(() => {
    if (!boundaryHierarchy || boundaryHierarchy.length === 0) return;

    let bH = [];
    let top = null;
    let dic = {};
    for (const ob of boundaryHierarchy) {
      let bType = ob["boundaryType"];
      let parent = ob["parentBoundaryType"];

      if (parent === null) {
        bH.unshift(bType); // Push top element to the start
        top = bType;
      }
      dic[parent] = bType;
    }

    let prev = top;
    while (prev in dic) {
      bH.push(dic[prev]);
      prev = dic[prev];
    }

    setbHierarchy(bH);

    const updatedBoundaryStatus = [...boundaryStatus]; // Create a copy of boundaryStatus

    for (const ind in bHierarchy) {
      if (parent_group?.[bHierarchy?.[ind]] && parent_group?.[bHierarchy[ind]]?.length > 2) {
        updatedBoundaryStatus[ind] = true;
      } else {
        updatedBoundaryStatus[ind] = false;
      }
    }

    setBoundaryStatus(updatedBoundaryStatus);
  }, [boundaryHierarchy]); // Only re-run when boundaryHierarchy changes

  const editHandler = () => {
    const urlParams = Digit.Hooks.useQueryParams();
    urlParams.key = '3';
    const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
    history.push(updatedUrl);
  }
  const isEditable = setupCompleted === 'true' ? false : true;


  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <BoundaryKpi data={statusMap} heading={t("CAMPAIGN_BOUNDARY")} />
      {bHierarchy.length > 1 ? (
        <div className="mp-margin-bottom">
          <SubBoundaryView style={{ background: "#fff" }} title={bHierarchy?.[1]} arr={parent_group?.[bHierarchy?.[1]]} editHandler={editHandler} isEditable={isEditable} headerStyle={{fontSize:"1.6rem"}} />
        </div>
      ) : null}

      {bHierarchy.length > 1 &&
        bHierarchy.slice(1, -1).map((item, ind) => {
          return (
            <div key={`header_${ind}`}>
              <Card className="middle-child">
                <div className="mp-header-container" style={{ marginBottom: "0px" }}>
                  <Header className="summary-sub-heading">{t(`MP_${bHierarchy[ind + 2].toUpperCase()}`)}</Header>
                  {!(setupCompleted === "true") && (
                    <Button
                      label={t("WBH_EDIT")}
                      title={t("WBH_EDIT")}
                      variation="secondary"
                      icon={"Edit"}
                      type="button"
                      size="medium"
                      onClick={(e) => {
                        editHandler();
                      }}
                    />
                  )}
                </div>
                {/* <HeaderComp title={bHierarchy[ind + 2]} /> */}
                {parent_group?.[item]?.map((item1, idx) =>
                  Array.isArray(parents?.[item1]) && boundaryStatus?.[ind + 2] && (idx === 0 || idx === 1) ? (
                    <SubBoundaryView style={{ marginBottom: "0px" }} key={`${item1}_${idx}`} title={item1} arr={parents?.[item1]} />
                  ) : Array.isArray(parents?.[item1]) && !boundaryStatus?.[ind + 2] ? (
                    <SubBoundaryView style={{ marginBottom: "0px" }} key={`${item1}_${idx}`} title={item1} arr={parents?.[item1]} />
                  ) : null
                ) || null}
                {boundaryStatus?.[ind + 2] && parent_group[item]?.length > 2 ? (
                  <Button
                    label={t("VIEW_MORE")}
                    title={t("VIEW_MORE")}
                    onClick={() => handleViewMore(ind + 2)}
                    variation="link"
                    icon="ArrowDropDown"
                    size="medium"
                    isSuffix={true}
                  />
                ) : !boundaryStatus?.[ind + 2] ? (
                  <Button
                    isSuffix={true}
                    label={t("VIEW_LESS")}
                    title={t("VIEW_LESS")}
                    icon="ArrowDropUp"
                    onClick={() => handleViewMore(ind + 2)}
                    variation="link"
                    size="medium"
                  />
                ) : null}
              </Card>
            </div>
          );
        })}
    </div>
  );
};

export default CampaignBoundary;
