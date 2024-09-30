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