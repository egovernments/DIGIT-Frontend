import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import SubBoundaryView from "./subBoundaryView";

const CampaignBoundary = () => {
    const { dispatch, state } = useMyContext();
    const { t } = useTranslation();

    const selectedData = [
        {
            "code": "MICROPLAN_MO",
            "name": "MICROPLAN_MO",
            "type": "Country",
            "isRoot": true,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_SINOE",
            "name": "MICROPLAN_MO_05_SINOE",
            "type": "Province",
            "parent": "MICROPLAN_MO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_07_JEDEPO",
            "name": "MICROPLAN_MO_05_07_JEDEPO",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "name": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_07_JEDEPO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_07_03_14_POKPAKEN_TOWN_P1888",
            "name": "MICROPLAN_MO_05_07_03_14_POKPAKEN_TOWN_P1888",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_06_JEADE",
            "name": "MICROPLAN_MO_05_06_JEADE",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        }
    ];

    let parents = {};
    let parent_group = {};
    let dic1 = {};

    // Populate parents and parent_group
    for (const ob of selectedData) {
        if (!(ob['parent'] in parents)) {
            parents[ob['parent']] = [ob['code']];
        } else {
            parents[ob['parent']].push(ob['code']);
        }
    }

    for (const ob of parents) {
        if (!(ob['type'] in parent_group)) {
            parent_group[ob['type']] = [parents[ob['parent']]];
        } else {
            parent_group[ob['type']].push(parents[ob['parent']]);
        }
    }

    console.log("parents", parents);
    console.log("parent_group", parent_group);

    // Initialize boundaryHierarchy and bHierarchy as state
    const [boundaryHierarchy, setData] = useState(state["boundaryHierarchy"]);
    const [bHierarchy, setbHierarchy] = useState([]);

    useEffect(() => {
        if (!boundaryHierarchy || boundaryHierarchy.length === 0) return; // Make sure boundaryHierarchy is not empty

        let bH = [];
        let top = null;
        let dic = {};

        // Build parent-child hierarchy
        for (const ob of boundaryHierarchy) {
            let bType = ob["boundaryType"];
            let parent = ob["parentBoundaryType"];

            if (parent === null) {
                bH.splice(0, 0, bType);
                top = bType;
            }
            dic[parent] = bType;
        }

        // Traverse the hierarchy
        let prev = top;
        while (prev in dic) {
            bH.push(dic[prev]);
            prev = dic[prev];
        }

        setbHierarchy(bH); // Set the hierarchy in state

        // Populate dic1 for selectedData
        for (const ob of selectedData) {
            if (!(ob["type"] in dic1)) {
                dic1[ob["type"]] = [ob["code"]];
            } else {
                dic1[ob["type"]].push(ob["code"]);
            }
        }

    }, [boundaryHierarchy, selectedData]); // Dependencies include boundaryHierarchy and selectedData

    console.log("bHierarchy", bHierarchy);

    // Only render if bHierarchy has data
    return (
        <div>
            {bHierarchy.length > 0 ? (
                bHierarchy.filter((_, index) => index !== 0).map((item, ind) => {
                    if (parent_group[item]) {
                        console.log("item", item);
                        return parent_group[item].map((item1, idx) => {
                            console.log("item1", item1);
                            return item1.map((item2) => {
                                console.log("item2", item2);
                                return (
                                    <SubBoundaryView 
                                        key={`${item2}_${idx}`} // Adding a unique key for each item2
                                        title={item2} // Assuming item2 is the correct value
                                        arr={parents[item2]} // Use parents[item2] for arr
                                    />
                                );
                            });
                        });
                    }
                    return null;
                })
            ) : (
                <p>Loading hierarchy...</p>
            )}
            {bHierarchy.length > 1 && (
                <SubBoundaryView 
                    title={bHierarchy[1]} 
                    arr={["bjjkn", "ghkjm", "jkjoil"]} 
                />
            )}
        </div>
    );
    
};

export default CampaignBoundary;
