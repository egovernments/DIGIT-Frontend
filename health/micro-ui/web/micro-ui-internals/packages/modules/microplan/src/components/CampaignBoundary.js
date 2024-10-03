import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import SubBoundaryView from "./subBoundaryView";
import HeaderComp from "./HeaderComp";
import { Card } from "@egovernments/digit-ui-components";
import BoundaryKpi from "./BoundaryKpi";


const CampaignBoundary = ({customProps}) => {
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

    const selectedData1 = customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData;

    const selectedData=[
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
            "code": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
            "name": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
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
            "code": "MICROPLAN_MO_05_07_03_13_BEATUOKEN_DWEHN1887",
            "name": "MICROPLAN_MO_05_07_03_13_BEATUOKEN_DWEHN1887",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_12_BEATUOKEN_CHATT1886",
            "name": "MICROPLAN_MO_05_07_03_12_BEATUOKEN_CHATT1886",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_11_BEATUOKEN_BEATU1885",
            "name": "MICROPLAN_MO_05_07_03_11_BEATUOKEN_BEATU1885",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_10_BEATUOKEN",
            "name": "MICROPLAN_MO_05_07_03_10_BEATUOKEN",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_09_POKPAKEN_TOWN_K1883",
            "name": "MICROPLAN_MO_05_07_03_09_POKPAKEN_TOWN_K1883",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_08_POKPAKEN_TOWN_P1882",
            "name": "MICROPLAN_MO_05_07_03_08_POKPAKEN_TOWN_P1882",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_07_POKPAKEN_TOWN_S1881",
            "name": "MICROPLAN_MO_05_07_03_07_POKPAKEN_TOWN_S1881",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_06_POKPAKEN_TOWN",
            "name": "MICROPLAN_MO_05_07_03_06_POKPAKEN_TOWN",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_05_JOKOKEN_ROBERT_1879",
            "name": "MICROPLAN_MO_05_07_03_05_JOKOKEN_ROBERT_1879",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_04_JOKOKEN_SLAH_VI1878",
            "name": "MICROPLAN_MO_05_07_03_04_JOKOKEN_SLAH_VI1878",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_03_JOKOKEN_JOKOKEN",
            "name": "MICROPLAN_MO_05_07_03_03_JOKOKEN_JOKOKEN",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_02_JOKOKEN",
            "name": "MICROPLAN_MO_05_07_03_02_JOKOKEN",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_03_01__124",
            "name": "MICROPLAN_MO_05_07_03_01__124",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_03_JOKOKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
            "name": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_07_JEDEPO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
            "name": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_07_JEDEPO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_06_JEADE",
            "name": "MICROPLAN_MO_05_06_JEADE",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_05_GREENVILLE",
            "name": "MICROPLAN_MO_05_05_GREENVILLE",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_04_GBLONEE",
            "name": "MICROPLAN_MO_05_04_GBLONEE",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_03_DUGBE_RIVER",
            "name": "MICROPLAN_MO_05_03_DUGBE_RIVER",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_02_BUTAW",
            "name": "MICROPLAN_MO_05_02_BUTAW",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_01__101",
            "name": "MICROPLAN_MO_05_01__101",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        }
    ] 
    
    // Memoizing parents and parent_group to only compute once when selectedData changes
    
    const { parents, parent_group } = useMemo(() => {
        let parents = {};
        let parent_group = {};

        for (const ob of selectedData) {
            if (ob['parent']) {
                if (!(ob['parent'] in parents)) {
                    parents[ob['parent']] = [ob['code']];
                } else {
                    parents[ob['parent']].push(ob['code']);
                }
            }
        }

        for (const ob of selectedData) {
            const parentCodes = parents[ob['parent']]; // Get the array of codes for the parent
            if (!(ob['type'] in parent_group)) {
                parent_group[ob['type']] = [parentCodes]; // Initialize with the first unique array
            } else {
                const existingArrays = parent_group[ob['type']];
                if (!existingArrays.some(arr => JSON.stringify(arr) === JSON.stringify(parentCodes))) {
                    parent_group[ob['type']].push(parentCodes); // Add only if it's unique
                }
            }
        }

        return { parents, parent_group };
    }, [selectedData]);

    // Initialize boundaryHierarchy and bHierarchy as state
    const [boundaryHierarchy, setData] = useState(state["boundaryHierarchy"]);
    const [boundaryStatus, setBoundaryStatus] = useState(
        new Array(boundaryHierarchy.length).fill(true) // Creates an array filled with "True"
    );
    // const boundaryStatus=[false,false,false,false,true];





    const [bHierarchy, setbHierarchy] = useState([]);

    const [statusMap, setStatusMap] = useState({});
    useEffect(() => {
        if (selectedData && selectedData.length >= 0) {
            setStatusMap(() => Digit.Utils.microplanv1.createStatusMap(selectedData, boundaryHierarchy))
        }
    }, [boundaryHierarchy])

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
            if (parent_group[bHierarchy[ind]] && parent_group[bHierarchy[ind]].length > 2) {
                updatedBoundaryStatus[ind] = true; 
            } else {
                updatedBoundaryStatus[ind] = false; 
            }
        }
        
        setBoundaryStatus(updatedBoundaryStatus);





    }, [boundaryHierarchy]); // Only re-run when boundaryHierarchy changes
    
    return (
        <div>

            <BoundaryKpi data={statusMap} />
            {
                bHierarchy.length > 1 ?
                    (<Card>


                        <SubBoundaryView
                            title={bHierarchy[1]}
                            arr={parent_group[bHierarchy[1]]}
                        />

                    </Card>) : (null)
            }



            {bHierarchy.length > 1 && bHierarchy.slice(1, -1).map((item, ind) => {
                //item-Country,Province,Locality,District,Village
                if (parent_group[item] && Array.isArray(parent_group[item])) {
                    return parent_group[item].map((item1, idx) => {
                        //item1-Province-[Sinoe],District-[Jedepo,Jeade]
                        return Array.isArray(item1) && (!boundaryStatus[ind + 2]) ? (
                            //make a super-comp that contains SubBoundary View
                            <Card key={`card_${ind}_${idx}`}>
                                <HeaderComp title={bHierarchy[ind + 2]} />
                                {item1.map((item2) => (
                                    //item2-parents name eg, sino etc
                                    <SubBoundaryView
                                        key={`${item2}_${idx}`}
                                        title={item2}
                                        arr={parents[item2]}
                                    />
                                ))
                                }
                                <div
                                    onClick={() => handleViewMore(ind + 2)}
                                    className="view-more"
                                >
                                    View Less
                                </div>
                            </Card>
                        ) : (Array.isArray(item1) && (boundaryStatus[ind + 2])) ? (
                            <div key={`div_${ind}_${idx}`}>
                                <Card>
                                    <HeaderComp title={bHierarchy[ind + 2]} />
                                    {item1.filter(() => (idx == 0 || idx == 1)).map((item2) => (
                                        //item2-parents name eg, sino etc
                                        <SubBoundaryView
                                            key={`${item2}_${idx}`}
                                            title={item2}
                                            arr={parents[item2]}
                                        />
                                    ))
                                    }
                                    <div
                                        onClick={() => handleViewMore(ind + 2)}
                                        className="view-more"
                                    >
                                        View More
                                    </div>
                                </Card>




                            </div>



                        ) : (null)



                    });
                }
                return null;
            })}
        </div>
    );
};

export default CampaignBoundary;
