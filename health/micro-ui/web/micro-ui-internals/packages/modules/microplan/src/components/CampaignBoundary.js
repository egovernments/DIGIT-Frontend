import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import SubBoundaryView from "./subBoundaryView";
import HeaderComp from "./HeaderComp";
import { Card } from "@egovernments/digit-ui-components";
import BoundaryKpi from "./BoundaryKpi";


const CampaignBoundary = ({ customProps }) => {
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
            "code": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
            "name": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
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
            "code": "MICROPLAN_MO_05_07_02_17_BOWLOH_TOWN_KUW1874",
            "name": "MICROPLAN_MO_05_07_02_17_BOWLOH_TOWN_KUW1874",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_07_02_16_BOWLOH_TOWN_KAJ1873",
            "name": "MICROPLAN_MO_05_07_02_16_BOWLOH_TOWN_KAJ1873",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
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
            "code": "MICROPLAN_MO_05_07_01_09_DOODWICKEN_TOWN1857",
            "name": "MICROPLAN_MO_05_07_01_09_DOODWICKEN_TOWN1857",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
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
        },
        {
            "code": "MICROPLAN_MO_05_06_04_TUZON",
            "name": "MICROPLAN_MO_05_06_04_TUZON",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_06_JEADE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_06_04_12_TUZON_DUBE_CAMP",
            "name": "MICROPLAN_MO_05_06_04_12_TUZON_DUBE_CAMP",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_06_04_TUZON",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_06_03_DIYANKPO",
            "name": "MICROPLAN_MO_05_06_03_DIYANKPO",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_06_JEADE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_06_03_09_DIYANKPO_MELINP1836",
            "name": "MICROPLAN_MO_05_06_03_09_DIYANKPO_MELINP1836",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
            "isRoot": false,
            "includeAllChildren": true
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
            "code": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
            "name": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_05_GREENVILLE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_05_04_16_SEEBEH_NYENNUE",
            "name": "MICROPLAN_MO_05_05_04_16_SEEBEH_NYENNUE",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
            "name": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_05_GREENVILLE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_05_03_07_SARPO_COMMUNITY1789",
            "name": "MICROPLAN_MO_05_05_03_07_SARPO_COMMUNITY1789",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
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
            "code": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
            "name": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_04_GBLONEE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_04_02_30_GBANNOH_TOWN_KP1768",
            "name": "MICROPLAN_MO_05_04_02_30_GBANNOH_TOWN_KP1768",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
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
            "code": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
            "name": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
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
            "code": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
            "name": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_05_02_BUTAW",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_05_02_03_10_QUIAH_TOWN_GBOM1673",
            "name": "MICROPLAN_MO_05_02_03_10_QUIAH_TOWN_GBOM1673",
            "type": "Village",
            "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_05_01__101",
            "name": "MICROPLAN_MO_05_01__101",
            "type": "District",
            "parent": "MICROPLAN_MO_05_SINOE",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_GRAND_GEDEH",
            "name": "MICROPLAN_MO_03_GRAND_GEDEH",
            "type": "Province",
            "parent": "MICROPLAN_MO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_07_TCHIEN",
            "name": "MICROPLAN_MO_03_07_TCHIEN",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
            "name": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_07_TCHIEN",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_07_05_13_TOFFOI_TOWN_GRE1069",
            "name": "MICROPLAN_MO_03_07_05_13_TOFFOI_TOWN_GRE1069",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
            "name": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_07_TCHIEN",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_07_04_35_SAYUOH_TOWN_GHA1056",
            "name": "MICROPLAN_MO_03_07_04_35_SAYUOH_TOWN_GHA1056",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_06_PUTU",
            "name": "MICROPLAN_MO_03_06_PUTU",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
            "name": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_06_PUTU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_06_02_20_WHITEMAN_CAMP_S914",
            "name": "MICROPLAN_MO_03_06_02_20_WHITEMAN_CAMP_S914",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_06_03_PENNOKON",
            "name": "MICROPLAN_MO_03_06_03_PENNOKON",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_06_PUTU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_06_03_17_KARLOWLEH_DOUBL931",
            "name": "MICROPLAN_MO_03_06_03_17_KARLOWLEH_DOUBL931",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_05_KONOBO",
            "name": "MICROPLAN_MO_03_05_KONOBO",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
            "name": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_05_KONOBO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_05_03_20_WULU_TOWN_VARGL893",
            "name": "MICROPLAN_MO_03_05_03_20_WULU_TOWN_VARGL893",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_04_GBAO",
            "name": "MICROPLAN_MO_03_04_GBAO",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
            "name": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_04_GBAO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_04_04_16_DARLUE_VILLAGE_817",
            "name": "MICROPLAN_MO_03_04_04_16_DARLUE_VILLAGE_817",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
            "name": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_04_GBAO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_04_03_09_GBARZON_POLAR_Z801",
            "name": "MICROPLAN_MO_03_04_03_09_GBARZON_POLAR_Z801",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_03_CAVALLA",
            "name": "MICROPLAN_MO_03_03_CAVALLA",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
            "name": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_03_CAVALLA",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_03_07_17_GBOLEKEN_TOWN_S765",
            "name": "MICROPLAN_MO_03_03_07_17_GBOLEKEN_TOWN_S765",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_02_B_HAI",
            "name": "MICROPLAN_MO_03_02_B_HAI",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
            "name": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_03_02_B_HAI",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_03_02_05_12_GIAH_TOWN_SANDY654",
            "name": "MICROPLAN_MO_03_02_05_12_GIAH_TOWN_SANDY654",
            "type": "Village",
            "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_03_01__54",
            "name": "MICROPLAN_MO_03_01__54",
            "type": "District",
            "parent": "MICROPLAN_MO_03_GRAND_GEDEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_GBARPOLU",
            "name": "MICROPLAN_MO_04_GBARPOLU",
            "type": "Province",
            "parent": "MICROPLAN_MO",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_06_KUNGBOR",
            "name": "MICROPLAN_MO_04_06_KUNGBOR",
            "type": "District",
            "parent": "MICROPLAN_MO_04_GBARPOLU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
            "name": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_04_06_KUNGBOR",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_06_02_70_CAMP_ALPHA_TOWN1629",
            "name": "MICROPLAN_MO_04_06_02_70_CAMP_ALPHA_TOWN1629",
            "type": "Village",
            "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_04_05_GBARMA",
            "name": "MICROPLAN_MO_04_05_GBARMA",
            "type": "District",
            "parent": "MICROPLAN_MO_04_GBARPOLU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
            "name": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_04_05_GBARMA",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_05_05_20_YANGARYAH_TOWN_1558",
            "name": "MICROPLAN_MO_04_05_05_20_YANGARYAH_TOWN_1558",
            "type": "Village",
            "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_04_04_BOPOLU",
            "name": "MICROPLAN_MO_04_04_BOPOLU",
            "type": "District",
            "parent": "MICROPLAN_MO_04_GBARPOLU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
            "name": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
            "type": "Locality",
            "parent": "MICROPLAN_MO_04_04_BOPOLU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_04_07_32_FARSUTA_MULBAH_1453",
            "name": "MICROPLAN_MO_04_04_07_32_FARSUTA_MULBAH_1453",
            "type": "Village",
            "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_04_03_BOKOMU",
            "name": "MICROPLAN_MO_04_03_BOKOMU",
            "type": "District",
            "parent": "MICROPLAN_MO_04_GBARPOLU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_02_BELLEH",
            "name": "MICROPLAN_MO_04_02_BELLEH",
            "type": "District",
            "parent": "MICROPLAN_MO_04_GBARPOLU",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
            "name": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
            "type": "Locality",
            "parent": "MICROPLAN_MO_04_02_BELLEH",
            "isRoot": false,
            "includeAllChildren": false
        },
        {
            "code": "MICROPLAN_MO_04_02_03_55_GOLITA_JOSEPH_W1201",
            "name": "MICROPLAN_MO_04_02_03_55_GOLITA_JOSEPH_W1201",
            "type": "Village",
            "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
            "isRoot": false,
            "includeAllChildren": true
        },
        {
            "code": "MICROPLAN_MO_04_01__81",
            "name": "MICROPLAN_MO_04_01__81",
            "type": "District",
            "parent": "MICROPLAN_MO_04_GBARPOLU",
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

    console.log("parents", parents);
    console.log("parent_group", parent_group);


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
                            arr={parent_group[bHierarchy[1]][0]}
                        />

                    </Card>) : (null)
            }

            {console.log("bHierarchy",bHierarchy)};

            {
            Array.isArray(bHierarchy) && bHierarchy.length > 1 && bHierarchy.filter((_, index) => ![0  , bHierarchy.length - 1].includes(index)).map((item, ind) => {
                //item-Country,Province,Locality,District,Village
                console.log("item", item);
                if (parent_group[item] && Array.isArray(parent_group[item])) {
                    return parent_group[item].map((item1, idx) => {
                        //item1-Province-[Sinoe],District-[Jedepo,Jeade]
                        console.log("item1", item1);
                        return Array.isArray(item1)  ? (  //changed
                            //make a super-comp that contains SubBoundary View
                            <Card key={`card_${ind}_${idx}`}>
                                <HeaderComp title={bHierarchy[ind + 2]} />
                                {item1.map((item2) => {
                                    //item2-parents name eg, sino etc
                                    console.log("item2",item2);
                                    return(
                                    <SubBoundaryView
                                        key={`${item2}_${idx}`}
                                        title={item2}
                                        arr={parents[item2]}
                                    />);
                                })
                                }
                                <div
                                    onClick={() => handleViewMore(ind + 1)}
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
