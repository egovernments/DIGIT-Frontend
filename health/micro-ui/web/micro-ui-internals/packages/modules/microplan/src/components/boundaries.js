export const boundaries = () => {
  return [
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
        "code": "MICROPLAN_MO_05_07_02_15_BOWLOH_TOWN_SAY1872",
        "name": "MICROPLAN_MO_05_07_02_15_BOWLOH_TOWN_SAY1872",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_14_BOWLOH_TOWN_BOW1871",
        "name": "MICROPLAN_MO_05_07_02_14_BOWLOH_TOWN_BOW1871",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_13_BOWLOH_TOWN",
        "name": "MICROPLAN_MO_05_07_02_13_BOWLOH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_12_SAYBLIYAH_TOWN_1869",
        "name": "MICROPLAN_MO_05_07_02_12_SAYBLIYAH_TOWN_1869",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_11_SAYBLIYAH_TOWN_1868",
        "name": "MICROPLAN_MO_05_07_02_11_SAYBLIYAH_TOWN_1868",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_10_SAYBLIYAH_TOWN_1867",
        "name": "MICROPLAN_MO_05_07_02_10_SAYBLIYAH_TOWN_1867",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_09_SAYBLIYAH_TOWN",
        "name": "MICROPLAN_MO_05_07_02_09_SAYBLIYAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_08_FREE_TOWN_DUCOR1865",
        "name": "MICROPLAN_MO_05_07_02_08_FREE_TOWN_DUCOR1865",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_07_FREE_TOWN_JARPU1864",
        "name": "MICROPLAN_MO_05_07_02_07_FREE_TOWN_JARPU1864",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_06_FREE_TOWN_JEHKE1863",
        "name": "MICROPLAN_MO_05_07_02_06_FREE_TOWN_JEHKE1863",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_05_FREE_TOWN_WORDA1862",
        "name": "MICROPLAN_MO_05_07_02_05_FREE_TOWN_WORDA1862",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_04_FREE_TOWN_ROCK_1861",
        "name": "MICROPLAN_MO_05_07_02_04_FREE_TOWN_ROCK_1861",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_03_FREE_TOWN_FREE_1860",
        "name": "MICROPLAN_MO_05_07_02_03_FREE_TOWN_FREE_1860",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_02_FREE_TOWN",
        "name": "MICROPLAN_MO_05_07_02_02_FREE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_02_DUCORFREE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_02_01__123",
        "name": "MICROPLAN_MO_05_07_02_01__123",
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
        "code": "MICROPLAN_MO_05_07_01_08_DOODWICKEN_TOWN1856",
        "name": "MICROPLAN_MO_05_07_01_08_DOODWICKEN_TOWN1856",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_07_DOODWICKEN_TOWN1855",
        "name": "MICROPLAN_MO_05_07_01_07_DOODWICKEN_TOWN1855",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_06_DOODWICKEN_TOWN1854",
        "name": "MICROPLAN_MO_05_07_01_06_DOODWICKEN_TOWN1854",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_05_DOODWICKEN_TOWN1853",
        "name": "MICROPLAN_MO_05_07_01_05_DOODWICKEN_TOWN1853",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_04_DOODWICKEN_TOWN1852",
        "name": "MICROPLAN_MO_05_07_01_04_DOODWICKEN_TOWN1852",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_03_DOODWICKEN_TOWN1851",
        "name": "MICROPLAN_MO_05_07_01_03_DOODWICKEN_TOWN1851",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_02_DOODWICKEN_TOWN1850",
        "name": "MICROPLAN_MO_05_07_01_02_DOODWICKEN_TOWN1850",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_07_01_DOODWICKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_07_01_01__122",
        "name": "MICROPLAN_MO_05_07_01_01__122",
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
        "code": "MICROPLAN_MO_05_06_04_11_TUZON_CASSAVA_V1847",
        "name": "MICROPLAN_MO_05_06_04_11_TUZON_CASSAVA_V1847",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_10_TUZON_WRALAKPO",
        "name": "MICROPLAN_MO_05_06_04_10_TUZON_WRALAKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_09_TUZON_PLUWEN",
        "name": "MICROPLAN_MO_05_06_04_09_TUZON_PLUWEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_08_TUZON_DORDROKEN",
        "name": "MICROPLAN_MO_05_06_04_08_TUZON_DORDROKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_07_TUZON_JERRY_TOE1843",
        "name": "MICROPLAN_MO_05_06_04_07_TUZON_JERRY_TOE1843",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_06_TUZON_SACKOR_VI1842",
        "name": "MICROPLAN_MO_05_06_04_06_TUZON_SACKOR_VI1842",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_05_TUZON_SACKOR_VI1841",
        "name": "MICROPLAN_MO_05_06_04_05_TUZON_SACKOR_VI1841",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_04_TUZON_MONEY_CAM1840",
        "name": "MICROPLAN_MO_05_06_04_04_TUZON_MONEY_CAM1840",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_03_TUZON_TUZON",
        "name": "MICROPLAN_MO_05_06_04_03_TUZON_TUZON",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_02_TUZON",
        "name": "MICROPLAN_MO_05_06_04_02_TUZON",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_04_TUZON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_04_01__121",
        "name": "MICROPLAN_MO_05_06_04_01__121",
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
        "code": "MICROPLAN_MO_05_06_03_08_DIYANKPO_WIAHSU1835",
        "name": "MICROPLAN_MO_05_06_03_08_DIYANKPO_WIAHSU1835",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_07_DIYANKPO_JOPLOK1834",
        "name": "MICROPLAN_MO_05_06_03_07_DIYANKPO_JOPLOK1834",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_06_DIYANKPO_NEEPOI1833",
        "name": "MICROPLAN_MO_05_06_03_06_DIYANKPO_NEEPOI1833",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_05_DIYANKPO_WRENEW1832",
        "name": "MICROPLAN_MO_05_06_03_05_DIYANKPO_WRENEW1832",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_04_DIYANKPO_KONWON1831",
        "name": "MICROPLAN_MO_05_06_03_04_DIYANKPO_KONWON1831",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_03_DIYANKPO_DIYANK1830",
        "name": "MICROPLAN_MO_05_06_03_03_DIYANKPO_DIYANK1830",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_02_DIYANKPO",
        "name": "MICROPLAN_MO_05_06_03_02_DIYANKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_03_01__120",
        "name": "MICROPLAN_MO_05_06_03_01__120",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_03_DIYANKPO",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "name": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_06_JEADE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_06_02_21_GOVERNMENT_CAMP1827",
        "name": "MICROPLAN_MO_05_06_02_21_GOVERNMENT_CAMP1827",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_20_GOVERNMENT_CAMP1826",
        "name": "MICROPLAN_MO_05_06_02_20_GOVERNMENT_CAMP1826",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_19_GOVERNMENT_CAMP1825",
        "name": "MICROPLAN_MO_05_06_02_19_GOVERNMENT_CAMP1825",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_18_GOVERNMENT_CAMP1824",
        "name": "MICROPLAN_MO_05_06_02_18_GOVERNMENT_CAMP1824",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_17_GOVERNMENT_CAMP1823",
        "name": "MICROPLAN_MO_05_06_02_17_GOVERNMENT_CAMP1823",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_16_GOVERNMENT_CAMP1822",
        "name": "MICROPLAN_MO_05_06_02_16_GOVERNMENT_CAMP1822",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_15_GOVERNMENT_CAMP1821",
        "name": "MICROPLAN_MO_05_06_02_15_GOVERNMENT_CAMP1821",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_14_GOVERNMENT_CAMP1820",
        "name": "MICROPLAN_MO_05_06_02_14_GOVERNMENT_CAMP1820",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_13_GOVERNMENT_CAMP1819",
        "name": "MICROPLAN_MO_05_06_02_13_GOVERNMENT_CAMP1819",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_12_GOVERNMENT_CAMP1818",
        "name": "MICROPLAN_MO_05_06_02_12_GOVERNMENT_CAMP1818",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_11_GOVERNMENT_CAMP1817",
        "name": "MICROPLAN_MO_05_06_02_11_GOVERNMENT_CAMP1817",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_10_GOVERNMENT_CAMP1816",
        "name": "MICROPLAN_MO_05_06_02_10_GOVERNMENT_CAMP1816",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_09_GOVERNMENT_CAMP1815",
        "name": "MICROPLAN_MO_05_06_02_09_GOVERNMENT_CAMP1815",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_08_GOVERNMENT_CAMP1814",
        "name": "MICROPLAN_MO_05_06_02_08_GOVERNMENT_CAMP1814",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_07_GOVERNMENT_CAMP1813",
        "name": "MICROPLAN_MO_05_06_02_07_GOVERNMENT_CAMP1813",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_06_GOVERNMENT_CAMP1812",
        "name": "MICROPLAN_MO_05_06_02_06_GOVERNMENT_CAMP1812",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_05_GOVERNMENT_CAMP1811",
        "name": "MICROPLAN_MO_05_06_02_05_GOVERNMENT_CAMP1811",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_04_GOVERNMENT_CAMP1810",
        "name": "MICROPLAN_MO_05_06_02_04_GOVERNMENT_CAMP1810",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_03_GOVERNMENT_CAMP1809",
        "name": "MICROPLAN_MO_05_06_02_03_GOVERNMENT_CAMP1809",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_02_GOVERNMENT_CAMP1808",
        "name": "MICROPLAN_MO_05_06_02_02_GOVERNMENT_CAMP1808",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_02_01__119",
        "name": "MICROPLAN_MO_05_06_02_01__119",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_06_02_GOVERNMENT_CAMP",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_06_01__118",
        "name": "MICROPLAN_MO_05_06_01__118",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_06_JEADE",
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
        "code": "MICROPLAN_MO_05_05_04_15_SEEBEH_BANNAH",
        "name": "MICROPLAN_MO_05_05_04_15_SEEBEH_BANNAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_14_SEEBEH_DIOH_TOW1803",
        "name": "MICROPLAN_MO_05_05_04_14_SEEBEH_DIOH_TOW1803",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_13_SEEBEH_SEEBEH",
        "name": "MICROPLAN_MO_05_05_04_13_SEEBEH_SEEBEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_12_SEEBEH",
        "name": "MICROPLAN_MO_05_05_04_12_SEEBEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_11_PO__RIVER_NEW_K1800",
        "name": "MICROPLAN_MO_05_05_04_11_PO__RIVER_NEW_K1800",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_10_PO__RIVER_PO__R1799",
        "name": "MICROPLAN_MO_05_05_04_10_PO__RIVER_PO__R1799",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_09_PO__RIVER",
        "name": "MICROPLAN_MO_05_05_04_09_PO__RIVER",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_08_CONGO_TOWN_TEAH1797",
        "name": "MICROPLAN_MO_05_05_04_08_CONGO_TOWN_TEAH1797",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_07_CONGO_TOWN_GEEK1796",
        "name": "MICROPLAN_MO_05_05_04_07_CONGO_TOWN_GEEK1796",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_06_CONGO_TOWN_CONG1795",
        "name": "MICROPLAN_MO_05_05_04_06_CONGO_TOWN_CONG1795",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_05_DOWN_TOWN_RED_H1794",
        "name": "MICROPLAN_MO_05_05_04_05_DOWN_TOWN_RED_H1794",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_04_DOWN_TOWN_FISH_1793",
        "name": "MICROPLAN_MO_05_05_04_04_DOWN_TOWN_FISH_1793",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_03_DOWN_TOWN_DOWN_1792",
        "name": "MICROPLAN_MO_05_05_04_03_DOWN_TOWN_DOWN_1792",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_02_DOWN_TOWN",
        "name": "MICROPLAN_MO_05_05_04_02_DOWN_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_04_F_J_GRANTE_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_04_01__117",
        "name": "MICROPLAN_MO_05_05_04_01__117",
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
        "code": "MICROPLAN_MO_05_05_03_06_SARPO_COMMUNITY1788",
        "name": "MICROPLAN_MO_05_05_03_06_SARPO_COMMUNITY1788",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_03_05_SARPO_COMMUNITY1787",
        "name": "MICROPLAN_MO_05_05_03_05_SARPO_COMMUNITY1787",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_03_04_SARPO_COMMUNITY1786",
        "name": "MICROPLAN_MO_05_05_03_04_SARPO_COMMUNITY1786",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_03_03_SARPO_COMMUNITY1785",
        "name": "MICROPLAN_MO_05_05_03_03_SARPO_COMMUNITY1785",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_03_02_SARPO_COMMUNITY1784",
        "name": "MICROPLAN_MO_05_05_03_02_SARPO_COMMUNITY1784",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_03_01__116",
        "name": "MICROPLAN_MO_05_05_03_01__116",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "name": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GREENVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_02_13_WULUE_TOWN_BAIL1782",
        "name": "MICROPLAN_MO_05_05_02_13_WULUE_TOWN_BAIL1782",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_12_WULUE_TOWN_BLUN1781",
        "name": "MICROPLAN_MO_05_05_02_12_WULUE_TOWN_BLUN1781",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_11_WULUE_TOWN_WULU1780",
        "name": "MICROPLAN_MO_05_05_02_11_WULUE_TOWN_WULU1780",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_10_WULUE_TOWN",
        "name": "MICROPLAN_MO_05_05_02_10_WULUE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_09_LEXINGTON_TOWNS1778",
        "name": "MICROPLAN_MO_05_05_02_09_LEXINGTON_TOWNS1778",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_08_LEXINGTON_TOWNS1777",
        "name": "MICROPLAN_MO_05_05_02_08_LEXINGTON_TOWNS1777",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_07_LEXINGTON_TOWNS1776",
        "name": "MICROPLAN_MO_05_05_02_07_LEXINGTON_TOWNS1776",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_06_LEXINGTON_TOWNS1775",
        "name": "MICROPLAN_MO_05_05_02_06_LEXINGTON_TOWNS1775",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_05_LEXINGTON_TOWNS1774",
        "name": "MICROPLAN_MO_05_05_02_05_LEXINGTON_TOWNS1774",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_04_LEXINGTON_TOWNS1773",
        "name": "MICROPLAN_MO_05_05_02_04_LEXINGTON_TOWNS1773",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_03_LEXINGTON_TOWNS1772",
        "name": "MICROPLAN_MO_05_05_02_03_LEXINGTON_TOWNS1772",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_02_LEXINGTON_TOWNS1771",
        "name": "MICROPLAN_MO_05_05_02_02_LEXINGTON_TOWNS1771",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_02_01__115",
        "name": "MICROPLAN_MO_05_05_02_01__115",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_05_02_LEXINGTON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_05_01__114",
        "name": "MICROPLAN_MO_05_05_01__114",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GREENVILLE",
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
        "code": "MICROPLAN_MO_05_04_02_29_GBANNOH_TOWN_JL1767",
        "name": "MICROPLAN_MO_05_04_02_29_GBANNOH_TOWN_JL1767",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_28_GBANNOH_TOWN_GB1766",
        "name": "MICROPLAN_MO_05_04_02_28_GBANNOH_TOWN_GB1766",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_27_GBANNOH_TOWN",
        "name": "MICROPLAN_MO_05_04_02_27_GBANNOH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_26_DUOH_TOWN_JAYOH",
        "name": "MICROPLAN_MO_05_04_02_26_DUOH_TOWN_JAYOH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_25_DUOH_TOWN_DUOH_1763",
        "name": "MICROPLAN_MO_05_04_02_25_DUOH_TOWN_DUOH_1763",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_24_DUOH_TOWN_QUIAH",
        "name": "MICROPLAN_MO_05_04_02_24_DUOH_TOWN_QUIAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_23_DUOH_TOWN",
        "name": "MICROPLAN_MO_05_04_02_23_DUOH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_22_CEETA_TOWN_TUEH",
        "name": "MICROPLAN_MO_05_04_02_22_CEETA_TOWN_TUEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_21_CEETA_TOWN_SUEH",
        "name": "MICROPLAN_MO_05_04_02_21_CEETA_TOWN_SUEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_20_CEETA_TOWN_CEET1758",
        "name": "MICROPLAN_MO_05_04_02_20_CEETA_TOWN_CEET1758",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_19_CEETA_TOWN_KAYW1757",
        "name": "MICROPLAN_MO_05_04_02_19_CEETA_TOWN_KAYW1757",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_18_CEETA_TOWN_PANW1756",
        "name": "MICROPLAN_MO_05_04_02_18_CEETA_TOWN_PANW1756",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_17_CEETA_TOWN",
        "name": "MICROPLAN_MO_05_04_02_17_CEETA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_16_KARLOR_TOWN_SAY1754",
        "name": "MICROPLAN_MO_05_04_02_16_KARLOR_TOWN_SAY1754",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_15_KARLOR_TOWN_KAR1753",
        "name": "MICROPLAN_MO_05_04_02_15_KARLOR_TOWN_KAR1753",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_14_KARLOR_TOWN_GBA1752",
        "name": "MICROPLAN_MO_05_04_02_14_KARLOR_TOWN_GBA1752",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_13_KARLOR_TOWN",
        "name": "MICROPLAN_MO_05_04_02_13_KARLOR_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_12_SEETHUN_JUARYEN1750",
        "name": "MICROPLAN_MO_05_04_02_12_SEETHUN_JUARYEN1750",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_11_SEETHUN_JUARYEN1749",
        "name": "MICROPLAN_MO_05_04_02_11_SEETHUN_JUARYEN1749",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_10_SEETHUN_JUARYEN1748",
        "name": "MICROPLAN_MO_05_04_02_10_SEETHUN_JUARYEN1748",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_09_SEETHUN_JUARYEN1747",
        "name": "MICROPLAN_MO_05_04_02_09_SEETHUN_JUARYEN1747",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_08_SEETHUN_JUARYEN1746",
        "name": "MICROPLAN_MO_05_04_02_08_SEETHUN_JUARYEN1746",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_07_SEETHUN_JUARYEN1745",
        "name": "MICROPLAN_MO_05_04_02_07_SEETHUN_JUARYEN1745",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_06_SEETHUN_JUARYEN1744",
        "name": "MICROPLAN_MO_05_04_02_06_SEETHUN_JUARYEN1744",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_05_SEETHUN_JUARYEN1743",
        "name": "MICROPLAN_MO_05_04_02_05_SEETHUN_JUARYEN1743",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_04_SEETHUN_JUARYEN1742",
        "name": "MICROPLAN_MO_05_04_02_04_SEETHUN_JUARYEN1742",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_03_TOGBAVILLE_CITY1741",
        "name": "MICROPLAN_MO_05_04_02_03_TOGBAVILLE_CITY1741",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_02_TOGBAVILLE_CITY1740",
        "name": "MICROPLAN_MO_05_04_02_02_TOGBAVILLE_CITY1740",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_02_01__113",
        "name": "MICROPLAN_MO_05_04_02_01__113",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_04_02_TOGBAVILLE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_04_01__112",
        "name": "MICROPLAN_MO_05_04_01__112",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_GBLONEE",
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
        "code": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "name": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_07_08_TWAH_TOWN_TWAH_1737",
        "name": "MICROPLAN_MO_05_03_07_08_TWAH_TOWN_TWAH_1737",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_07_TWAH_TOWN",
        "name": "MICROPLAN_MO_05_03_07_07_TWAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_06_SEETHUN_JUARYEN1735",
        "name": "MICROPLAN_MO_05_03_07_06_SEETHUN_JUARYEN1735",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_05_SEETHUN_JUARYEN1734",
        "name": "MICROPLAN_MO_05_03_07_05_SEETHUN_JUARYEN1734",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_04_SEETHUN_JUARYEN1733",
        "name": "MICROPLAN_MO_05_03_07_04_SEETHUN_JUARYEN1733",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_03_SEETHUN_JUARYEN1732",
        "name": "MICROPLAN_MO_05_03_07_03_SEETHUN_JUARYEN1732",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_02_SEETHUN_JUARYEN1731",
        "name": "MICROPLAN_MO_05_03_07_02_SEETHUN_JUARYEN1731",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_07_01__111",
        "name": "MICROPLAN_MO_05_03_07_01__111",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_07_MENWAH_WALKER_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "name": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_06_07_NANA_KRU_CHEAPO1729",
        "name": "MICROPLAN_MO_05_03_06_07_NANA_KRU_CHEAPO1729",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_06_NANA_KRU_JARBOP1728",
        "name": "MICROPLAN_MO_05_03_06_06_NANA_KRU_JARBOP1728",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_05_NANA_KRU_GBATEA1727",
        "name": "MICROPLAN_MO_05_03_06_05_NANA_KRU_GBATEA1727",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_04_NANA_KRU_KING_W1726",
        "name": "MICROPLAN_MO_05_03_06_04_NANA_KRU_KING_W1726",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_03_NANA_KRU_NANA_K1725",
        "name": "MICROPLAN_MO_05_03_06_03_NANA_KRU_NANA_K1725",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_02_NANA_KRU",
        "name": "MICROPLAN_MO_05_03_06_02_NANA_KRU",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_06_01__110",
        "name": "MICROPLAN_MO_05_03_06_01__110",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_06_JSD_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "name": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_05_20_WALKPEKPO_GMAKE1722",
        "name": "MICROPLAN_MO_05_03_05_20_WALKPEKPO_GMAKE1722",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_19_WALKPEKPO_GMAKE1721",
        "name": "MICROPLAN_MO_05_03_05_19_WALKPEKPO_GMAKE1721",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_18_WALKPEKPO_GMAKE1720",
        "name": "MICROPLAN_MO_05_03_05_18_WALKPEKPO_GMAKE1720",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_17_WALKPEKPO_WALKP1719",
        "name": "MICROPLAN_MO_05_03_05_17_WALKPEKPO_WALKP1719",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_16_WALKPEKPO",
        "name": "MICROPLAN_MO_05_03_05_16_WALKPEKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_15_KABADA_KUNWIAH",
        "name": "MICROPLAN_MO_05_03_05_15_KABADA_KUNWIAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_14_KABADA_POLAY_TO1716",
        "name": "MICROPLAN_MO_05_03_05_14_KABADA_POLAY_TO1716",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_13_KABADA_KABADA",
        "name": "MICROPLAN_MO_05_03_05_13_KABADA_KABADA",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_12_KABADA",
        "name": "MICROPLAN_MO_05_03_05_12_KABADA",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_11_ATLANTIC_CAMP_W1713",
        "name": "MICROPLAN_MO_05_03_05_11_ATLANTIC_CAMP_W1713",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_10_ATLANTIC_CAMP_J1712",
        "name": "MICROPLAN_MO_05_03_05_10_ATLANTIC_CAMP_J1712",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_09_ATLANTIC_CAMP_A1711",
        "name": "MICROPLAN_MO_05_03_05_09_ATLANTIC_CAMP_A1711",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_08_ATLANTIC_CAMP_S1710",
        "name": "MICROPLAN_MO_05_03_05_08_ATLANTIC_CAMP_S1710",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_07_ATLANTIC_CAMP",
        "name": "MICROPLAN_MO_05_03_05_07_ATLANTIC_CAMP",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_06_KARQUEKPO_SWENP1708",
        "name": "MICROPLAN_MO_05_03_05_06_KARQUEKPO_SWENP1708",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_05_KARQUEKPO_KIKPO",
        "name": "MICROPLAN_MO_05_03_05_05_KARQUEKPO_KIKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_04_KARQUEKPO_KLOWE1706",
        "name": "MICROPLAN_MO_05_03_05_04_KARQUEKPO_KLOWE1706",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_03_KARQUEKPO_TITIY1705",
        "name": "MICROPLAN_MO_05_03_05_03_KARQUEKPO_TITIY1705",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_02_KARQUEKPO_KARQU1704",
        "name": "MICROPLAN_MO_05_03_05_02_KARQUEKPO_KARQU1704",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_05_01__109",
        "name": "MICROPLAN_MO_05_03_05_01__109",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_05_KARQUEKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "name": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_04_10_KWAITUOH_JUARYE1702",
        "name": "MICROPLAN_MO_05_03_04_10_KWAITUOH_JUARYE1702",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_09_KWAITUOH_JUARYE1701",
        "name": "MICROPLAN_MO_05_03_04_09_KWAITUOH_JUARYE1701",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_08_KWAITUOH_JUARYE1700",
        "name": "MICROPLAN_MO_05_03_04_08_KWAITUOH_JUARYE1700",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_07_KWAITUOH_JUARYE1699",
        "name": "MICROPLAN_MO_05_03_04_07_KWAITUOH_JUARYE1699",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_06_KWAITUOH_JUARYE1698",
        "name": "MICROPLAN_MO_05_03_04_06_KWAITUOH_JUARYE1698",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_05_KWAITUOH_JUARYE1697",
        "name": "MICROPLAN_MO_05_03_04_05_KWAITUOH_JUARYE1697",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_04_KWAITUOH_JUARYE1696",
        "name": "MICROPLAN_MO_05_03_04_04_KWAITUOH_JUARYE1696",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_03_KWAITUOH_JUARYE1695",
        "name": "MICROPLAN_MO_05_03_04_03_KWAITUOH_JUARYE1695",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_02_KWAITUOH_JUARYE1694",
        "name": "MICROPLAN_MO_05_03_04_02_KWAITUOH_JUARYE1694",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_04_01__108",
        "name": "MICROPLAN_MO_05_03_04_01__108",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_04_JUARYEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "name": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_03_08_SETTRA_KRU_GEEK1692",
        "name": "MICROPLAN_MO_05_03_03_08_SETTRA_KRU_GEEK1692",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_07_SETTRA_KRU_NUA_1691",
        "name": "MICROPLAN_MO_05_03_03_07_SETTRA_KRU_NUA_1691",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_06_SETTRA_KRU_KLOG1690",
        "name": "MICROPLAN_MO_05_03_03_06_SETTRA_KRU_KLOG1690",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_05_SETTRA_KRU_NYAN1689",
        "name": "MICROPLAN_MO_05_03_03_05_SETTRA_KRU_NYAN1689",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_04_SETTRA_KRU_WLOK1688",
        "name": "MICROPLAN_MO_05_03_03_04_SETTRA_KRU_WLOK1688",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_03_SETTRA_KRU_SETT1687",
        "name": "MICROPLAN_MO_05_03_03_03_SETTRA_KRU_SETT1687",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_02_SETTRA_KRU",
        "name": "MICROPLAN_MO_05_03_03_02_SETTRA_KRU",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_03_01__107",
        "name": "MICROPLAN_MO_05_03_03_01__107",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_03_EDWARD_MEMORIAL_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "name": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_02_10_KWITATUZON_TOWN1684",
        "name": "MICROPLAN_MO_05_03_02_10_KWITATUZON_TOWN1684",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_09_KWITATUZON_TOWN1683",
        "name": "MICROPLAN_MO_05_03_02_09_KWITATUZON_TOWN1683",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_08_KWITATUZON_TOWN1682",
        "name": "MICROPLAN_MO_05_03_02_08_KWITATUZON_TOWN1682",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_07_KWITATUZON_TOWN1681",
        "name": "MICROPLAN_MO_05_03_02_07_KWITATUZON_TOWN1681",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_06_KWITATUZON_TOWN1680",
        "name": "MICROPLAN_MO_05_03_02_06_KWITATUZON_TOWN1680",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_05_KWITATUZON_TOWN1679",
        "name": "MICROPLAN_MO_05_03_02_05_KWITATUZON_TOWN1679",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_04_KWITATUZON_TOWN1678",
        "name": "MICROPLAN_MO_05_03_02_04_KWITATUZON_TOWN1678",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_03_KWITATUZON_TOWN1677",
        "name": "MICROPLAN_MO_05_03_02_03_KWITATUZON_TOWN1677",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_02_KWITATUZON_TOWN1676",
        "name": "MICROPLAN_MO_05_03_02_02_KWITATUZON_TOWN1676",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_02_01__106",
        "name": "MICROPLAN_MO_05_03_02_01__106",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_03_02_KWITATUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_03_01__105",
        "name": "MICROPLAN_MO_05_03_01__105",
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
        "code": "MICROPLAN_MO_05_02_03_09_QUIAH_TOWN_QUIA1672",
        "name": "MICROPLAN_MO_05_02_03_09_QUIAH_TOWN_QUIA1672",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_08_GRIGSBY_FARM_KA1671",
        "name": "MICROPLAN_MO_05_02_03_08_GRIGSBY_FARM_KA1671",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_07_GRIGSBY_FARM_PO1670",
        "name": "MICROPLAN_MO_05_02_03_07_GRIGSBY_FARM_PO1670",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_06_GRIGSBY_FARM_CE1669",
        "name": "MICROPLAN_MO_05_02_03_06_GRIGSBY_FARM_CE1669",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_05_GRIGSBY_FARM_DA1668",
        "name": "MICROPLAN_MO_05_02_03_05_GRIGSBY_FARM_DA1668",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_04_GRIGSBY_FARM_KA1667",
        "name": "MICROPLAN_MO_05_02_03_04_GRIGSBY_FARM_KA1667",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_03_GRIGSBY_FARM_GR1666",
        "name": "MICROPLAN_MO_05_02_03_03_GRIGSBY_FARM_GR1666",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_02_GRIGSBY_FARM_KW1665",
        "name": "MICROPLAN_MO_05_02_03_02_GRIGSBY_FARM_KW1665",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_03_01__104",
        "name": "MICROPLAN_MO_05_02_03_01__104",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_03_GRIGSBY_FARM_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "name": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_02_BUTAW",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_02_02_32_GEEKLOH",
        "name": "MICROPLAN_MO_05_02_02_32_GEEKLOH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_31_NAH_VILLAGE_GBE1662",
        "name": "MICROPLAN_MO_05_02_02_31_NAH_VILLAGE_GBE1662",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_30_NAH_VILLAGE_BOR1661",
        "name": "MICROPLAN_MO_05_02_02_30_NAH_VILLAGE_BOR1661",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_29_NAH_VILLAGE_QUI1660",
        "name": "MICROPLAN_MO_05_02_02_29_NAH_VILLAGE_QUI1660",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_28_NAH_VILLAGE_NAH1659",
        "name": "MICROPLAN_MO_05_02_02_28_NAH_VILLAGE_NAH1659",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_27_NAH_VILLAGE",
        "name": "MICROPLAN_MO_05_02_02_27_NAH_VILLAGE",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_26_PUMKPOH_JLAH_TO1657",
        "name": "MICROPLAN_MO_05_02_02_26_PUMKPOH_JLAH_TO1657",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_25_PUMKPOH_MENWAH",
        "name": "MICROPLAN_MO_05_02_02_25_PUMKPOH_MENWAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_24_PUMKPOH_BUKRAH_1655",
        "name": "MICROPLAN_MO_05_02_02_24_PUMKPOH_BUKRAH_1655",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_23_PUMKPOH_PAJIBO_1654",
        "name": "MICROPLAN_MO_05_02_02_23_PUMKPOH_PAJIBO_1654",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_22_PUMKPOH_MONGER_1653",
        "name": "MICROPLAN_MO_05_02_02_22_PUMKPOH_MONGER_1653",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_21_PUMKPOH_PUMKPOH",
        "name": "MICROPLAN_MO_05_02_02_21_PUMKPOH_PUMKPOH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_20_PUMKPOH",
        "name": "MICROPLAN_MO_05_02_02_20_PUMKPOH",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_19_SEEDOR_JARYENNE1650",
        "name": "MICROPLAN_MO_05_02_02_19_SEEDOR_JARYENNE1650",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_18_SEEDOR_NIGERIA_1649",
        "name": "MICROPLAN_MO_05_02_02_18_SEEDOR_NIGERIA_1649",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_17_SEEDOR_PLUESONN1648",
        "name": "MICROPLAN_MO_05_02_02_17_SEEDOR_PLUESONN1648",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_16_SEEDOR_SARPEE",
        "name": "MICROPLAN_MO_05_02_02_16_SEEDOR_SARPEE",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_15_SEEDOR_SEEDOR",
        "name": "MICROPLAN_MO_05_02_02_15_SEEDOR_SEEDOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_14_SEEDOR_TUPEE_VI1645",
        "name": "MICROPLAN_MO_05_02_02_14_SEEDOR_TUPEE_VI1645",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_13_SEEDOR",
        "name": "MICROPLAN_MO_05_02_02_13_SEEDOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_12_GVL_CAMP_CHEA_T1643",
        "name": "MICROPLAN_MO_05_02_02_12_GVL_CAMP_CHEA_T1643",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_11_GVL_CAMP_GVL_CA1642",
        "name": "MICROPLAN_MO_05_02_02_11_GVL_CAMP_GVL_CA1642",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_10_GVL_CAMP",
        "name": "MICROPLAN_MO_05_02_02_10_GVL_CAMP",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_09_JAY_TEAH_TOWN_P1640",
        "name": "MICROPLAN_MO_05_02_02_09_JAY_TEAH_TOWN_P1640",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_08_JAY_TEAH_TOWN_B1639",
        "name": "MICROPLAN_MO_05_02_02_08_JAY_TEAH_TOWN_B1639",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_07_JAY_TEAH_TOWN_T1638",
        "name": "MICROPLAN_MO_05_02_02_07_JAY_TEAH_TOWN_T1638",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_06_JAY_TEAH_TOWN_J1637",
        "name": "MICROPLAN_MO_05_02_02_06_JAY_TEAH_TOWN_J1637",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_05_JAY_TEAH_TOWN_S1636",
        "name": "MICROPLAN_MO_05_02_02_05_JAY_TEAH_TOWN_S1636",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_04_JAY_TEAH_TOWN_B1635",
        "name": "MICROPLAN_MO_05_02_02_04_JAY_TEAH_TOWN_B1635",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_03_JAY_TEAH_TOWN_S1634",
        "name": "MICROPLAN_MO_05_02_02_03_JAY_TEAH_TOWN_S1634",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_02_JAY_TEAH_TOWN",
        "name": "MICROPLAN_MO_05_02_02_02_JAY_TEAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_02_01__103",
        "name": "MICROPLAN_MO_05_02_02_01__103",
        "type": "Village",
        "parent": "MICROPLAN_MO_05_02_02_BUTAW_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_05_02_01__102",
        "name": "MICROPLAN_MO_05_02_01__102",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_02_BUTAW",
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
        "code": "MICROPLAN_MO_04_06_02_69_CAMP_ALPHA_TOWN1628",
        "name": "MICROPLAN_MO_04_06_02_69_CAMP_ALPHA_TOWN1628",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_68_CAMP_ALPHA_TOWN1627",
        "name": "MICROPLAN_MO_04_06_02_68_CAMP_ALPHA_TOWN1627",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_67_CAMP_ALPHA_TOWN1626",
        "name": "MICROPLAN_MO_04_06_02_67_CAMP_ALPHA_TOWN1626",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_66_AMTEH_CAMP_ABU_1625",
        "name": "MICROPLAN_MO_04_06_02_66_AMTEH_CAMP_ABU_1625",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_65_AMTEH_CAMP_GOI_1624",
        "name": "MICROPLAN_MO_04_06_02_65_AMTEH_CAMP_GOI_1624",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_64_AMTEH_CAMP_GBAH",
        "name": "MICROPLAN_MO_04_06_02_64_AMTEH_CAMP_GBAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_63_AMTEH_CAMP_AMTE1622",
        "name": "MICROPLAN_MO_04_06_02_63_AMTEH_CAMP_AMTE1622",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_62_AMTEH_CAMP",
        "name": "MICROPLAN_MO_04_06_02_62_AMTEH_CAMP",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_61_TIMAH_TOWN_GABR1620",
        "name": "MICROPLAN_MO_04_06_02_61_TIMAH_TOWN_GABR1620",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_60_TIMAH_TOWN_MONE1619",
        "name": "MICROPLAN_MO_04_06_02_60_TIMAH_TOWN_MONE1619",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_59_TIMAH_TOWN_BANA1618",
        "name": "MICROPLAN_MO_04_06_02_59_TIMAH_TOWN_BANA1618",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_58_TIMAH_TOWN_SLC",
        "name": "MICROPLAN_MO_04_06_02_58_TIMAH_TOWN_SLC",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_57_TIMAH_TOWN_TIMA1616",
        "name": "MICROPLAN_MO_04_06_02_57_TIMAH_TOWN_TIMA1616",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_56_TIMAH_TOWN",
        "name": "MICROPLAN_MO_04_06_02_56_TIMAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_55_SAFULAH_BETHEL",
        "name": "MICROPLAN_MO_04_06_02_55_SAFULAH_BETHEL",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_54_SAFULAH_KODUWAW1613",
        "name": "MICROPLAN_MO_04_06_02_54_SAFULAH_KODUWAW1613",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_53_SAFULAH_DOMAMAN1612",
        "name": "MICROPLAN_MO_04_06_02_53_SAFULAH_DOMAMAN1612",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_52_SAFULAH_SAFULAH",
        "name": "MICROPLAN_MO_04_06_02_52_SAFULAH_SAFULAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_51_SAFULAH_JAWAJEH1610",
        "name": "MICROPLAN_MO_04_06_02_51_SAFULAH_JAWAJEH1610",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_50_SAFULAH",
        "name": "MICROPLAN_MO_04_06_02_50_SAFULAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_49_ZUIE_TOWN_GLAY",
        "name": "MICROPLAN_MO_04_06_02_49_ZUIE_TOWN_GLAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_48_ZUIE_TOWN_BONOD1607",
        "name": "MICROPLAN_MO_04_06_02_48_ZUIE_TOWN_BONOD1607",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_47_ZUIE_TOWN_GAGAM1606",
        "name": "MICROPLAN_MO_04_06_02_47_ZUIE_TOWN_GAGAM1606",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_46_ZUIE_TOWN_ZUIE_1605",
        "name": "MICROPLAN_MO_04_06_02_46_ZUIE_TOWN_ZUIE_1605",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_45_ZUIE_TOWN",
        "name": "MICROPLAN_MO_04_06_02_45_ZUIE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_44_BEATHOU_GODEE",
        "name": "MICROPLAN_MO_04_06_02_44_BEATHOU_GODEE",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_43_BEATHOU_FALLING1602",
        "name": "MICROPLAN_MO_04_06_02_43_BEATHOU_FALLING1602",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_42_BEATHOU_TAIWAY",
        "name": "MICROPLAN_MO_04_06_02_42_BEATHOU_TAIWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_41_BEATHOU_BEADEN",
        "name": "MICROPLAN_MO_04_06_02_41_BEATHOU_BEADEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_40_BEATHOU_GONSUA",
        "name": "MICROPLAN_MO_04_06_02_40_BEATHOU_GONSUA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_39_BEATHOU_FALLAH",
        "name": "MICROPLAN_MO_04_06_02_39_BEATHOU_FALLAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_38_BEATHOU_BEATHOU",
        "name": "MICROPLAN_MO_04_06_02_38_BEATHOU_BEATHOU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_37_BEATHOU",
        "name": "MICROPLAN_MO_04_06_02_37_BEATHOU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_36_MBARMA_THOMAS_C1595",
        "name": "MICROPLAN_MO_04_06_02_36_MBARMA_THOMAS_C1595",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_35_MBARMA_SATURDAY1594",
        "name": "MICROPLAN_MO_04_06_02_35_MBARMA_SATURDAY1594",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_34_MBARMA_SUPER_PO1593",
        "name": "MICROPLAN_MO_04_06_02_34_MBARMA_SUPER_PO1593",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_33_MBARMA_OLDMAN_K1592",
        "name": "MICROPLAN_MO_04_06_02_33_MBARMA_OLDMAN_K1592",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_32_MBARMA_MOSES_VI1591",
        "name": "MICROPLAN_MO_04_06_02_32_MBARMA_MOSES_VI1591",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_31_MBARMA_DUAH_VIL1590",
        "name": "MICROPLAN_MO_04_06_02_31_MBARMA_DUAH_VIL1590",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_30_MBARMA_SAVANNA_1589",
        "name": "MICROPLAN_MO_04_06_02_30_MBARMA_SAVANNA_1589",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_29_MBARMA_MANNAH_V1588",
        "name": "MICROPLAN_MO_04_06_02_29_MBARMA_MANNAH_V1588",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_28_MBARMA_JINKPO_V1587",
        "name": "MICROPLAN_MO_04_06_02_28_MBARMA_JINKPO_V1587",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_27_MBARMA_MBARMA",
        "name": "MICROPLAN_MO_04_06_02_27_MBARMA_MBARMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_26_MBARMA",
        "name": "MICROPLAN_MO_04_06_02_26_MBARMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_25_GALAHUN_BORBORH1584",
        "name": "MICROPLAN_MO_04_06_02_25_GALAHUN_BORBORH1584",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_24_GALAHUN_FAYAMA",
        "name": "MICROPLAN_MO_04_06_02_24_GALAHUN_FAYAMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_23_GALAHUN_GALAHUN",
        "name": "MICROPLAN_MO_04_06_02_23_GALAHUN_GALAHUN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_22_GALAHUN_JAWAJEH1581",
        "name": "MICROPLAN_MO_04_06_02_22_GALAHUN_JAWAJEH1581",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_21_GALAHUN",
        "name": "MICROPLAN_MO_04_06_02_21_GALAHUN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_20_NORMOR_TOWN_LYN1579",
        "name": "MICROPLAN_MO_04_06_02_20_NORMOR_TOWN_LYN1579",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_19_NORMOR_TOWN_ULC",
        "name": "MICROPLAN_MO_04_06_02_19_NORMOR_TOWN_ULC",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_18_NORMOR_TOWN_WON1577",
        "name": "MICROPLAN_MO_04_06_02_18_NORMOR_TOWN_WON1577",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_17_NORMOR_TOWN_NOR1576",
        "name": "MICROPLAN_MO_04_06_02_17_NORMOR_TOWN_NOR1576",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_16_NORMOR_TOWN_SMI1575",
        "name": "MICROPLAN_MO_04_06_02_16_NORMOR_TOWN_SMI1575",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_15_NORMOR_TOWN",
        "name": "MICROPLAN_MO_04_06_02_15_NORMOR_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_14_KORTEE_VILLAGE_1573",
        "name": "MICROPLAN_MO_04_06_02_14_KORTEE_VILLAGE_1573",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_13_KORTEE_VILLAGE_1572",
        "name": "MICROPLAN_MO_04_06_02_13_KORTEE_VILLAGE_1572",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_12_KORTEE_VILLAGE_1571",
        "name": "MICROPLAN_MO_04_06_02_12_KORTEE_VILLAGE_1571",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_11_KORTEE_VILLAGE_1570",
        "name": "MICROPLAN_MO_04_06_02_11_KORTEE_VILLAGE_1570",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_10_KORTEE_VILLAGE_1569",
        "name": "MICROPLAN_MO_04_06_02_10_KORTEE_VILLAGE_1569",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_09_KORTEE_VILLAGE_1568",
        "name": "MICROPLAN_MO_04_06_02_09_KORTEE_VILLAGE_1568",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_08_KORTEE_VILLAGE_1567",
        "name": "MICROPLAN_MO_04_06_02_08_KORTEE_VILLAGE_1567",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_07_KORTEE_VILLAGE_1566",
        "name": "MICROPLAN_MO_04_06_02_07_KORTEE_VILLAGE_1566",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_06_KORTEE_VILLAGE",
        "name": "MICROPLAN_MO_04_06_02_06_KORTEE_VILLAGE",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_05_KUNGBOR_BORBORB1564",
        "name": "MICROPLAN_MO_04_06_02_05_KUNGBOR_BORBORB1564",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_04_KUNGBOR_KUNGBOR",
        "name": "MICROPLAN_MO_04_06_02_04_KUNGBOR_KUNGBOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_03_KUNGBOR_DANIEL_1562",
        "name": "MICROPLAN_MO_04_06_02_03_KUNGBOR_DANIEL_1562",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_02_KUNGBOR",
        "name": "MICROPLAN_MO_04_06_02_02_KUNGBOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_02_01__100",
        "name": "MICROPLAN_MO_04_06_02_01__100",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_06_02_KUNGBOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_06_01__99",
        "name": "MICROPLAN_MO_04_06_01__99",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_06_KUNGBOR",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_04_05_05_19_YANGARYAH_TOWN_1557",
        "name": "MICROPLAN_MO_04_05_05_19_YANGARYAH_TOWN_1557",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_18_YANGARYAH_TOWN_1556",
        "name": "MICROPLAN_MO_04_05_05_18_YANGARYAH_TOWN_1556",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_17_YANGARYAH_TOWN_1555",
        "name": "MICROPLAN_MO_04_05_05_17_YANGARYAH_TOWN_1555",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_16_YANGARYAH_TOWN_1554",
        "name": "MICROPLAN_MO_04_05_05_16_YANGARYAH_TOWN_1554",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_15_YANGARYAH_TOWN_1553",
        "name": "MICROPLAN_MO_04_05_05_15_YANGARYAH_TOWN_1553",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_14_YANGARYAH_TOWN_1552",
        "name": "MICROPLAN_MO_04_05_05_14_YANGARYAH_TOWN_1552",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_13_YANGARYAH_TOWN_1551",
        "name": "MICROPLAN_MO_04_05_05_13_YANGARYAH_TOWN_1551",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_12_YANGARYAH_TOWN_1550",
        "name": "MICROPLAN_MO_04_05_05_12_YANGARYAH_TOWN_1550",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_11_YANGARYAH_TOWN_1549",
        "name": "MICROPLAN_MO_04_05_05_11_YANGARYAH_TOWN_1549",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_10_YANGARYAH_TOWN_1548",
        "name": "MICROPLAN_MO_04_05_05_10_YANGARYAH_TOWN_1548",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_09_YANGARYAH_TOWN_1547",
        "name": "MICROPLAN_MO_04_05_05_09_YANGARYAH_TOWN_1547",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_08_YANGARYAH_TOWN_1546",
        "name": "MICROPLAN_MO_04_05_05_08_YANGARYAH_TOWN_1546",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_07_YANGARYAH_TOWN_1545",
        "name": "MICROPLAN_MO_04_05_05_07_YANGARYAH_TOWN_1545",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_06_YANGARYAH_TOWN_1544",
        "name": "MICROPLAN_MO_04_05_05_06_YANGARYAH_TOWN_1544",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_05_YANGARYAH_TOWN_1543",
        "name": "MICROPLAN_MO_04_05_05_05_YANGARYAH_TOWN_1543",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_04_YANGARYAH_TOWN_1542",
        "name": "MICROPLAN_MO_04_05_05_04_YANGARYAH_TOWN_1542",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_03_YANGARYAH_TOWN_1541",
        "name": "MICROPLAN_MO_04_05_05_03_YANGARYAH_TOWN_1541",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_02_YANGARYAH_TOWN",
        "name": "MICROPLAN_MO_04_05_05_02_YANGARYAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_05_01__98",
        "name": "MICROPLAN_MO_04_05_05_01__98",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_05_YANGARYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "name": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_04_17_BALLAH_BASSA_TO1538",
        "name": "MICROPLAN_MO_04_05_04_17_BALLAH_BASSA_TO1538",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_16_BALLAH_BASSA_TO1537",
        "name": "MICROPLAN_MO_04_05_04_16_BALLAH_BASSA_TO1537",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_15_BALLAH_BASSA_TO1536",
        "name": "MICROPLAN_MO_04_05_04_15_BALLAH_BASSA_TO1536",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_14_BALLAH_BASSA_TO1535",
        "name": "MICROPLAN_MO_04_05_04_14_BALLAH_BASSA_TO1535",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_13_BALLAH_BASSA_TO1534",
        "name": "MICROPLAN_MO_04_05_04_13_BALLAH_BASSA_TO1534",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_12_BALLAH_BASSA_TO1533",
        "name": "MICROPLAN_MO_04_05_04_12_BALLAH_BASSA_TO1533",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_11_WEASUA_TOWN_GBU1532",
        "name": "MICROPLAN_MO_04_05_04_11_WEASUA_TOWN_GBU1532",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_10_WEASUA_TOWN_GBU1531",
        "name": "MICROPLAN_MO_04_05_04_10_WEASUA_TOWN_GBU1531",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_09_WEASUA_TOWN_SEN1530",
        "name": "MICROPLAN_MO_04_05_04_09_WEASUA_TOWN_SEN1530",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_08_WEASUA_TOWN_GBA1529",
        "name": "MICROPLAN_MO_04_05_04_08_WEASUA_TOWN_GBA1529",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_07_WEASUA_TOWN_KIS1528",
        "name": "MICROPLAN_MO_04_05_04_07_WEASUA_TOWN_KIS1528",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_06_WEASUA_TOWN_ZIA1527",
        "name": "MICROPLAN_MO_04_05_04_06_WEASUA_TOWN_ZIA1527",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_05_WEASUA_TOWN_POR1526",
        "name": "MICROPLAN_MO_04_05_04_05_WEASUA_TOWN_POR1526",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_04_WEASUA_TOWN_FIN1525",
        "name": "MICROPLAN_MO_04_05_04_04_WEASUA_TOWN_FIN1525",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_03_WEASUA_TOWN_WEA1524",
        "name": "MICROPLAN_MO_04_05_04_03_WEASUA_TOWN_WEA1524",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_02_WEASUA_TOWN",
        "name": "MICROPLAN_MO_04_05_04_02_WEASUA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_04_01__97",
        "name": "MICROPLAN_MO_04_05_04_01__97",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_04_WEASUA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "name": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_03_51_VAYE_TOWN_JOHNS1521",
        "name": "MICROPLAN_MO_04_05_03_51_VAYE_TOWN_JOHNS1521",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_50_VAYE_TOWN_DUODE1520",
        "name": "MICROPLAN_MO_04_05_03_50_VAYE_TOWN_DUODE1520",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_49_VAYE_TOWN_HILTO1519",
        "name": "MICROPLAN_MO_04_05_03_49_VAYE_TOWN_HILTO1519",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_48_VAYE_TOWN_PARKE1518",
        "name": "MICROPLAN_MO_04_05_03_48_VAYE_TOWN_PARKE1518",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_47_VAYE_TOWN_SENOD1517",
        "name": "MICROPLAN_MO_04_05_03_47_VAYE_TOWN_SENOD1517",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_46_VAYE_TOWN_DOMAG1516",
        "name": "MICROPLAN_MO_04_05_03_46_VAYE_TOWN_DOMAG1516",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_45_VAYE_TOWN_FARMA1515",
        "name": "MICROPLAN_MO_04_05_03_45_VAYE_TOWN_FARMA1515",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_44_VAYE_TOWN_DEWAH1514",
        "name": "MICROPLAN_MO_04_05_03_44_VAYE_TOWN_DEWAH1514",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_43_VAYE_TOWN_MABOI1513",
        "name": "MICROPLAN_MO_04_05_03_43_VAYE_TOWN_MABOI1513",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_42_VAYE_TOWN_GBALL1512",
        "name": "MICROPLAN_MO_04_05_03_42_VAYE_TOWN_GBALL1512",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_41_VAYE_TOWN_TINDO1511",
        "name": "MICROPLAN_MO_04_05_03_41_VAYE_TOWN_TINDO1511",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_40_VAYE_TOWN_DARBO1510",
        "name": "MICROPLAN_MO_04_05_03_40_VAYE_TOWN_DARBO1510",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_39_VAYE_TOWN_VAYE_1509",
        "name": "MICROPLAN_MO_04_05_03_39_VAYE_TOWN_VAYE_1509",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_38_VAYE_TOWN",
        "name": "MICROPLAN_MO_04_05_03_38_VAYE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_37_BEATOE_TOWN_DOR1507",
        "name": "MICROPLAN_MO_04_05_03_37_BEATOE_TOWN_DOR1507",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_36_BEATOE_TOWN_AIR1506",
        "name": "MICROPLAN_MO_04_05_03_36_BEATOE_TOWN_AIR1506",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_35_BEATOE_TOWN_RUB1505",
        "name": "MICROPLAN_MO_04_05_03_35_BEATOE_TOWN_RUB1505",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_34_BEATOE_TOWN_TOE1504",
        "name": "MICROPLAN_MO_04_05_03_34_BEATOE_TOWN_TOE1504",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_33_BEATOE_TOWN_B_T1503",
        "name": "MICROPLAN_MO_04_05_03_33_BEATOE_TOWN_B_T1503",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_32_BEATOE_TOWN_COL1502",
        "name": "MICROPLAN_MO_04_05_03_32_BEATOE_TOWN_COL1502",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_31_BEATOE_TOWN_WAL1501",
        "name": "MICROPLAN_MO_04_05_03_31_BEATOE_TOWN_WAL1501",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_30_BEATOE_TOWN_MEC1500",
        "name": "MICROPLAN_MO_04_05_03_30_BEATOE_TOWN_MEC1500",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_29_BEATOE_TOWN_DUO1499",
        "name": "MICROPLAN_MO_04_05_03_29_BEATOE_TOWN_DUO1499",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_28_BEATOE_TOWN_GBA1498",
        "name": "MICROPLAN_MO_04_05_03_28_BEATOE_TOWN_GBA1498",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_27_BEATOE_TOWN_BAS1497",
        "name": "MICROPLAN_MO_04_05_03_27_BEATOE_TOWN_BAS1497",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_26_BEATOE_TOWN_BIG1496",
        "name": "MICROPLAN_MO_04_05_03_26_BEATOE_TOWN_BIG1496",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_25_BEATOE_TOWN_VAJ1495",
        "name": "MICROPLAN_MO_04_05_03_25_BEATOE_TOWN_VAJ1495",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_24_BEATOE_TOWN_ARM1494",
        "name": "MICROPLAN_MO_04_05_03_24_BEATOE_TOWN_ARM1494",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_23_BEATOE_TOWN_BEA1493",
        "name": "MICROPLAN_MO_04_05_03_23_BEATOE_TOWN_BEA1493",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_22_BEATOE_TOWN",
        "name": "MICROPLAN_MO_04_05_03_22_BEATOE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_21_ZUO_TOWN_CASSEL1491",
        "name": "MICROPLAN_MO_04_05_03_21_ZUO_TOWN_CASSEL1491",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_20_ZUO_TOWN_GBALLA1490",
        "name": "MICROPLAN_MO_04_05_03_20_ZUO_TOWN_GBALLA1490",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_19_ZUO_TOWN_TOEDEN1489",
        "name": "MICROPLAN_MO_04_05_03_19_ZUO_TOWN_TOEDEN1489",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_18_ZUO_TOWN_JAJUA_1488",
        "name": "MICROPLAN_MO_04_05_03_18_ZUO_TOWN_JAJUA_1488",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_17_ZUO_TOWN_JIMMY_1487",
        "name": "MICROPLAN_MO_04_05_03_17_ZUO_TOWN_JIMMY_1487",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_16_ZUO_TOWN_ZUO_MI1486",
        "name": "MICROPLAN_MO_04_05_03_16_ZUO_TOWN_ZUO_MI1486",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_15_ZUO_TOWN_MOMOSE1485",
        "name": "MICROPLAN_MO_04_05_03_15_ZUO_TOWN_MOMOSE1485",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_14_ZUO_TOWN_ZUO_TO1484",
        "name": "MICROPLAN_MO_04_05_03_14_ZUO_TOWN_ZUO_TO1484",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_13_ZUO_TOWN",
        "name": "MICROPLAN_MO_04_05_03_13_ZUO_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_12_GBARMA_TOWN_VP_1482",
        "name": "MICROPLAN_MO_04_05_03_12_GBARMA_TOWN_VP_1482",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_11_GBARMA_TOWN_MAR1481",
        "name": "MICROPLAN_MO_04_05_03_11_GBARMA_TOWN_MAR1481",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_10_GBARMA_TOWN_MAS1480",
        "name": "MICROPLAN_MO_04_05_03_10_GBARMA_TOWN_MAS1480",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_09_GBARMA_TOWN_YEM1479",
        "name": "MICROPLAN_MO_04_05_03_09_GBARMA_TOWN_YEM1479",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_08_GBARMA_TOWN_DOM1478",
        "name": "MICROPLAN_MO_04_05_03_08_GBARMA_TOWN_DOM1478",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_07_GBARMA_TOWN_TAW1477",
        "name": "MICROPLAN_MO_04_05_03_07_GBARMA_TOWN_TAW1477",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_06_GBARMA_TOWN_ITI1476",
        "name": "MICROPLAN_MO_04_05_03_06_GBARMA_TOWN_ITI1476",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_05_GBARMA_TOWN_MUS1475",
        "name": "MICROPLAN_MO_04_05_03_05_GBARMA_TOWN_MUS1475",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_04_GBARMA_TOWN_KAR1474",
        "name": "MICROPLAN_MO_04_05_03_04_GBARMA_TOWN_KAR1474",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_03_GBARMA_TOWN_GBA1473",
        "name": "MICROPLAN_MO_04_05_03_03_GBARMA_TOWN_GBA1473",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_02_GBARMA_TOWN",
        "name": "MICROPLAN_MO_04_05_03_02_GBARMA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_03_01__96",
        "name": "MICROPLAN_MO_04_05_03_01__96",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_03_GBARMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "name": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_02_16_SMITH_TOWN_ZUBA1470",
        "name": "MICROPLAN_MO_04_05_02_16_SMITH_TOWN_ZUBA1470",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_15_SMITH_TOWN_NAWA1469",
        "name": "MICROPLAN_MO_04_05_02_15_SMITH_TOWN_NAWA1469",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_14_SMITH_TOWN_MATT1468",
        "name": "MICROPLAN_MO_04_05_02_14_SMITH_TOWN_MATT1468",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_13_SMITH_TOWN_SMIT1467",
        "name": "MICROPLAN_MO_04_05_02_13_SMITH_TOWN_SMIT1467",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_12_SMITH_TOWN",
        "name": "MICROPLAN_MO_04_05_02_12_SMITH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_11_TARKPOIMA_TOWN_1465",
        "name": "MICROPLAN_MO_04_05_02_11_TARKPOIMA_TOWN_1465",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_10_TARKPOIMA_TOWN_1464",
        "name": "MICROPLAN_MO_04_05_02_10_TARKPOIMA_TOWN_1464",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_09_TARKPOIMA_TOWN_1463",
        "name": "MICROPLAN_MO_04_05_02_09_TARKPOIMA_TOWN_1463",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_08_TARKPOIMA_TOWN_1462",
        "name": "MICROPLAN_MO_04_05_02_08_TARKPOIMA_TOWN_1462",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_07_TARKPOIMA_TOWN_1461",
        "name": "MICROPLAN_MO_04_05_02_07_TARKPOIMA_TOWN_1461",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_06_TARKPOIMA_TOWN_1460",
        "name": "MICROPLAN_MO_04_05_02_06_TARKPOIMA_TOWN_1460",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_05_TARKPOIMA_TOWN_1459",
        "name": "MICROPLAN_MO_04_05_02_05_TARKPOIMA_TOWN_1459",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_04_TARKPOIMA_TOWN_1458",
        "name": "MICROPLAN_MO_04_05_02_04_TARKPOIMA_TOWN_1458",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_03_TARKPOIMA_TOWN_1457",
        "name": "MICROPLAN_MO_04_05_02_03_TARKPOIMA_TOWN_1457",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_02_TARKPOIMA_TOWN",
        "name": "MICROPLAN_MO_04_05_02_02_TARKPOIMA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_02_01__95",
        "name": "MICROPLAN_MO_04_05_02_01__95",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_05_02_TARKPOIMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_05_01__94",
        "name": "MICROPLAN_MO_04_05_01__94",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_04_04_07_31_FARSUTA_MEDINA",
        "name": "MICROPLAN_MO_04_04_07_31_FARSUTA_MEDINA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_30_FARSUTA_FARSUTA",
        "name": "MICROPLAN_MO_04_04_07_30_FARSUTA_FARSUTA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_29_FARSUTA",
        "name": "MICROPLAN_MO_04_04_07_29_FARSUTA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_28_GBARQUOITA_DABB1449",
        "name": "MICROPLAN_MO_04_04_07_28_GBARQUOITA_DABB1449",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_27_GBARQUOITA_MONO1448",
        "name": "MICROPLAN_MO_04_04_07_27_GBARQUOITA_MONO1448",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_26_GBARQUOITA_WEED1447",
        "name": "MICROPLAN_MO_04_04_07_26_GBARQUOITA_WEED1447",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_25_GBARQUOITA_KLC",
        "name": "MICROPLAN_MO_04_04_07_25_GBARQUOITA_KLC",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_24_GBARQUOITA_ZOPO1445",
        "name": "MICROPLAN_MO_04_04_07_24_GBARQUOITA_ZOPO1445",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_23_GBARQUOITA_KPO_1444",
        "name": "MICROPLAN_MO_04_04_07_23_GBARQUOITA_KPO_1444",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_22_GBARQUOITA_GUYA1443",
        "name": "MICROPLAN_MO_04_04_07_22_GBARQUOITA_GUYA1443",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_21_GBARQUOITA_GBAR1442",
        "name": "MICROPLAN_MO_04_04_07_21_GBARQUOITA_GBAR1442",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_20_GBARQUOITA",
        "name": "MICROPLAN_MO_04_04_07_20_GBARQUOITA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_19_JAMES_VARMAH_TA1440",
        "name": "MICROPLAN_MO_04_04_07_19_JAMES_VARMAH_TA1440",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_18_JAMES_VARMAH_TA1439",
        "name": "MICROPLAN_MO_04_04_07_18_JAMES_VARMAH_TA1439",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_17_JAMES_VARMAH_TA1438",
        "name": "MICROPLAN_MO_04_04_07_17_JAMES_VARMAH_TA1438",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_16_JAMES_VARMAH_TA1437",
        "name": "MICROPLAN_MO_04_04_07_16_JAMES_VARMAH_TA1437",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_15_JAMES_VARMAH_TA1436",
        "name": "MICROPLAN_MO_04_04_07_15_JAMES_VARMAH_TA1436",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_14_JAMES_VARMAH_TA1435",
        "name": "MICROPLAN_MO_04_04_07_14_JAMES_VARMAH_TA1435",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_13_JAMES_VARMAH_TA1434",
        "name": "MICROPLAN_MO_04_04_07_13_JAMES_VARMAH_TA1434",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_12_JAMES_VARMAH_TA1433",
        "name": "MICROPLAN_MO_04_04_07_12_JAMES_VARMAH_TA1433",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_11_JAMES_VARMAH_TA1432",
        "name": "MICROPLAN_MO_04_04_07_11_JAMES_VARMAH_TA1432",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_10_JAMES_VARMAH_TA1431",
        "name": "MICROPLAN_MO_04_04_07_10_JAMES_VARMAH_TA1431",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_09_JAMES_VARMAH_TA1430",
        "name": "MICROPLAN_MO_04_04_07_09_JAMES_VARMAH_TA1430",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_08_JAMES_VARMAH_TA1429",
        "name": "MICROPLAN_MO_04_04_07_08_JAMES_VARMAH_TA1429",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_07_JAMES_VARMAH_TA1428",
        "name": "MICROPLAN_MO_04_04_07_07_JAMES_VARMAH_TA1428",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_06_JAMES_VARMAH_TA1427",
        "name": "MICROPLAN_MO_04_04_07_06_JAMES_VARMAH_TA1427",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_05_JAMES_VARMAH_TA1426",
        "name": "MICROPLAN_MO_04_04_07_05_JAMES_VARMAH_TA1426",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_04_JAMES_VARMAH_TA1425",
        "name": "MICROPLAN_MO_04_04_07_04_JAMES_VARMAH_TA1425",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_03_JAMES_VARMAH_TA1424",
        "name": "MICROPLAN_MO_04_04_07_03_JAMES_VARMAH_TA1424",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_02_JAMES_VARMAH_TA1423",
        "name": "MICROPLAN_MO_04_04_07_02_JAMES_VARMAH_TA1423",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_07_01__93",
        "name": "MICROPLAN_MO_04_04_07_01__93",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_07_EMIRATES_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "name": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_06_33_BOMBORMA_SUMO_T1421",
        "name": "MICROPLAN_MO_04_04_06_33_BOMBORMA_SUMO_T1421",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_32_BOMBORMA_KAMA_T1420",
        "name": "MICROPLAN_MO_04_04_06_32_BOMBORMA_KAMA_T1420",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_31_BOMBORMA_WARNER1419",
        "name": "MICROPLAN_MO_04_04_06_31_BOMBORMA_WARNER1419",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_30_BOMBORMA_KONNE_1418",
        "name": "MICROPLAN_MO_04_04_06_30_BOMBORMA_KONNE_1418",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_29_BOMBORMA_GISSI_1417",
        "name": "MICROPLAN_MO_04_04_06_29_BOMBORMA_GISSI_1417",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_28_BOMBORMA_BOMBOR1416",
        "name": "MICROPLAN_MO_04_04_06_28_BOMBORMA_BOMBOR1416",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_27_BOMBORMA",
        "name": "MICROPLAN_MO_04_04_06_27_BOMBORMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_26_SAWMILL_DARMOTA",
        "name": "MICROPLAN_MO_04_04_06_26_SAWMILL_DARMOTA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_25_SAWMILL_GOTOMA",
        "name": "MICROPLAN_MO_04_04_06_25_SAWMILL_GOTOMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_24_SAWMILL_SAO_VIL1412",
        "name": "MICROPLAN_MO_04_04_06_24_SAWMILL_SAO_VIL1412",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_23_SAWMILL_MOIBILI1411",
        "name": "MICROPLAN_MO_04_04_06_23_SAWMILL_MOIBILI1411",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_22_SAWMILL_KENEMU",
        "name": "MICROPLAN_MO_04_04_06_22_SAWMILL_KENEMU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_21_SAWMILL_ARTHUR_1409",
        "name": "MICROPLAN_MO_04_04_06_21_SAWMILL_ARTHUR_1409",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_20_SAWMILL_BOLOYAL1408",
        "name": "MICROPLAN_MO_04_04_06_20_SAWMILL_BOLOYAL1408",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_19_SAWMILL_NORRIS_1407",
        "name": "MICROPLAN_MO_04_04_06_19_SAWMILL_NORRIS_1407",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_18_SAWMILL_KONNEH_1406",
        "name": "MICROPLAN_MO_04_04_06_18_SAWMILL_KONNEH_1406",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_17_SAWMILL_SAWMILL",
        "name": "MICROPLAN_MO_04_04_06_17_SAWMILL_SAWMILL",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_16_SAWMILL",
        "name": "MICROPLAN_MO_04_04_06_16_SAWMILL",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_15_SMALL_HENRY_TOW1403",
        "name": "MICROPLAN_MO_04_04_06_15_SMALL_HENRY_TOW1403",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_14_SMALL_HENRY_TOW1402",
        "name": "MICROPLAN_MO_04_04_06_14_SMALL_HENRY_TOW1402",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_13_SMALL_HENRY_TOW1401",
        "name": "MICROPLAN_MO_04_04_06_13_SMALL_HENRY_TOW1401",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_12_SMALL_HENRY_TOW1400",
        "name": "MICROPLAN_MO_04_04_06_12_SMALL_HENRY_TOW1400",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_11_SMALL_HENRY_TOW1399",
        "name": "MICROPLAN_MO_04_04_06_11_SMALL_HENRY_TOW1399",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_10_SMALL_HENRY_TOW1398",
        "name": "MICROPLAN_MO_04_04_06_10_SMALL_HENRY_TOW1398",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_09_SMALL_HENRY_TOW1397",
        "name": "MICROPLAN_MO_04_04_06_09_SMALL_HENRY_TOW1397",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_08_BAMBUTA_TOWN_CO1396",
        "name": "MICROPLAN_MO_04_04_06_08_BAMBUTA_TOWN_CO1396",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_07_BAMBUTA_TOWN_CH1395",
        "name": "MICROPLAN_MO_04_04_06_07_BAMBUTA_TOWN_CH1395",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_06_BAMBUTA_TOWN_WE1394",
        "name": "MICROPLAN_MO_04_04_06_06_BAMBUTA_TOWN_WE1394",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_05_BAMBUTA_TOWN_CO1393",
        "name": "MICROPLAN_MO_04_04_06_05_BAMBUTA_TOWN_CO1393",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_04_BAMBUTA_TOWN_DA1392",
        "name": "MICROPLAN_MO_04_04_06_04_BAMBUTA_TOWN_DA1392",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_03_BAMBUTA_TOWN_BA1391",
        "name": "MICROPLAN_MO_04_04_06_03_BAMBUTA_TOWN_BA1391",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_02_BAMBUTA_TOWN",
        "name": "MICROPLAN_MO_04_04_06_02_BAMBUTA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_06_01__92",
        "name": "MICROPLAN_MO_04_04_06_01__92",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_06_BAMBUTA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "name": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_05_41_MANNAH_TOWN_WHI1388",
        "name": "MICROPLAN_MO_04_04_05_41_MANNAH_TOWN_WHI1388",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_40_MANNAH_TOWN_FIN1387",
        "name": "MICROPLAN_MO_04_04_05_40_MANNAH_TOWN_FIN1387",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_39_MANNAH_TOWN_VAN1386",
        "name": "MICROPLAN_MO_04_04_05_39_MANNAH_TOWN_VAN1386",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_38_MANNAH_TOWN_KON1385",
        "name": "MICROPLAN_MO_04_04_05_38_MANNAH_TOWN_KON1385",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_37_MANNAH_TOWN_DOI1384",
        "name": "MICROPLAN_MO_04_04_05_37_MANNAH_TOWN_DOI1384",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_36_MANNAH_TOWN_KPA1383",
        "name": "MICROPLAN_MO_04_04_05_36_MANNAH_TOWN_KPA1383",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_35_MANNAH_TOWN_VAR1382",
        "name": "MICROPLAN_MO_04_04_05_35_MANNAH_TOWN_VAR1382",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_34_MANNAH_TOWN_MAL1381",
        "name": "MICROPLAN_MO_04_04_05_34_MANNAH_TOWN_MAL1381",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_33_MANNAH_TOWN_MAN1380",
        "name": "MICROPLAN_MO_04_04_05_33_MANNAH_TOWN_MAN1380",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_32_MANNAH_TOWN",
        "name": "MICROPLAN_MO_04_04_05_32_MANNAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_31_GARGAMA_TOWN_FA1378",
        "name": "MICROPLAN_MO_04_04_05_31_GARGAMA_TOWN_FA1378",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_30_GARGAMA_TOWN_VO1377",
        "name": "MICROPLAN_MO_04_04_05_30_GARGAMA_TOWN_VO1377",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_29_GARGAMA_TOWN_KO1376",
        "name": "MICROPLAN_MO_04_04_05_29_GARGAMA_TOWN_KO1376",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_28_GARGAMA_TOWN_EK1375",
        "name": "MICROPLAN_MO_04_04_05_28_GARGAMA_TOWN_EK1375",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_27_GARGAMA_TOWN_VO1374",
        "name": "MICROPLAN_MO_04_04_05_27_GARGAMA_TOWN_VO1374",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_26_GARGAMA_TOWN_CA1373",
        "name": "MICROPLAN_MO_04_04_05_26_GARGAMA_TOWN_CA1373",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_25_GARGAMA_TOWN_O_1372",
        "name": "MICROPLAN_MO_04_04_05_25_GARGAMA_TOWN_O_1372",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_24_GARGAMA_TOWN_SA1371",
        "name": "MICROPLAN_MO_04_04_05_24_GARGAMA_TOWN_SA1371",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_23_GARGAMA_TOWN_WH1370",
        "name": "MICROPLAN_MO_04_04_05_23_GARGAMA_TOWN_WH1370",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_22_GARGAMA_TOWN_GA1369",
        "name": "MICROPLAN_MO_04_04_05_22_GARGAMA_TOWN_GA1369",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_21_GARGAMA_TOWN",
        "name": "MICROPLAN_MO_04_04_05_21_GARGAMA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_20_JALLAHLONE_TOWN1367",
        "name": "MICROPLAN_MO_04_04_05_20_JALLAHLONE_TOWN1367",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_19_JALLAHLONE_TOWN1366",
        "name": "MICROPLAN_MO_04_04_05_19_JALLAHLONE_TOWN1366",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_18_JALLAHLONE_TOWN1365",
        "name": "MICROPLAN_MO_04_04_05_18_JALLAHLONE_TOWN1365",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_17_JALLAHLONE_TOWN1364",
        "name": "MICROPLAN_MO_04_04_05_17_JALLAHLONE_TOWN1364",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_16_JALLAHLONE_TOWN1363",
        "name": "MICROPLAN_MO_04_04_05_16_JALLAHLONE_TOWN1363",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_15_JALLAHLONE_TOWN1362",
        "name": "MICROPLAN_MO_04_04_05_15_JALLAHLONE_TOWN1362",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_14_JALLAHLONE_TOWN1361",
        "name": "MICROPLAN_MO_04_04_05_14_JALLAHLONE_TOWN1361",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_13_JALLAHLONE_TOWN1360",
        "name": "MICROPLAN_MO_04_04_05_13_JALLAHLONE_TOWN1360",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_12_JALLAHLONE_TOWN1359",
        "name": "MICROPLAN_MO_04_04_05_12_JALLAHLONE_TOWN1359",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_11_JALLAHLONE_TOWN1358",
        "name": "MICROPLAN_MO_04_04_05_11_JALLAHLONE_TOWN1358",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_10_JALLAHLONE_TOWN1357",
        "name": "MICROPLAN_MO_04_04_05_10_JALLAHLONE_TOWN1357",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_09_JALLAHLONE_TOWN1356",
        "name": "MICROPLAN_MO_04_04_05_09_JALLAHLONE_TOWN1356",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_08_JALLAHLONE_TOWN1355",
        "name": "MICROPLAN_MO_04_04_05_08_JALLAHLONE_TOWN1355",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_07_JALLAHLONE_TOWN1354",
        "name": "MICROPLAN_MO_04_04_05_07_JALLAHLONE_TOWN1354",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_06_JALLAHLONE_TOWN1353",
        "name": "MICROPLAN_MO_04_04_05_06_JALLAHLONE_TOWN1353",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_05_JALLAHLONE_TOWN1352",
        "name": "MICROPLAN_MO_04_04_05_05_JALLAHLONE_TOWN1352",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_04_JALLAHLONE_TOWN1351",
        "name": "MICROPLAN_MO_04_04_05_04_JALLAHLONE_TOWN1351",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_03_JALLAHLONE_TOWN1350",
        "name": "MICROPLAN_MO_04_04_05_03_JALLAHLONE_TOWN1350",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_02_JALLAHLONE_TOWN1349",
        "name": "MICROPLAN_MO_04_04_05_02_JALLAHLONE_TOWN1349",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_05_01__91",
        "name": "MICROPLAN_MO_04_04_05_01__91",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_05_GOKALA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "name": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_04_30_TUMUQULIA_TOWN_1347",
        "name": "MICROPLAN_MO_04_04_04_30_TUMUQULIA_TOWN_1347",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_29_TUMUQULIA_TOWN_1346",
        "name": "MICROPLAN_MO_04_04_04_29_TUMUQULIA_TOWN_1346",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_28_TUMUQULIA_TOWN_1345",
        "name": "MICROPLAN_MO_04_04_04_28_TUMUQULIA_TOWN_1345",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_27_TUMUQULIA_TOWN_1344",
        "name": "MICROPLAN_MO_04_04_04_27_TUMUQULIA_TOWN_1344",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_26_TUMUQULIA_TOWN_1343",
        "name": "MICROPLAN_MO_04_04_04_26_TUMUQULIA_TOWN_1343",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_25_TUMUQULIA_TOWN_1342",
        "name": "MICROPLAN_MO_04_04_04_25_TUMUQULIA_TOWN_1342",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_24_TUMUQULIA_TOWN_1341",
        "name": "MICROPLAN_MO_04_04_04_24_TUMUQULIA_TOWN_1341",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_23_TUMUQULIA_TOWN_1340",
        "name": "MICROPLAN_MO_04_04_04_23_TUMUQULIA_TOWN_1340",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_22_TUMUQULIA_TOWN_1339",
        "name": "MICROPLAN_MO_04_04_04_22_TUMUQULIA_TOWN_1339",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_21_TUMUQULIA_TOWN",
        "name": "MICROPLAN_MO_04_04_04_21_TUMUQULIA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_20_GBALASUA_BARBU_1337",
        "name": "MICROPLAN_MO_04_04_04_20_GBALASUA_BARBU_1337",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_19_GBALASUA_YARKPO1336",
        "name": "MICROPLAN_MO_04_04_04_19_GBALASUA_YARKPO1336",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_18_GBALASUA_GIAYAM1335",
        "name": "MICROPLAN_MO_04_04_04_18_GBALASUA_GIAYAM1335",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_17_GBALASUA_ALFRED1334",
        "name": "MICROPLAN_MO_04_04_04_17_GBALASUA_ALFRED1334",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_16_GBALASUA_GBALAS1333",
        "name": "MICROPLAN_MO_04_04_04_16_GBALASUA_GBALAS1333",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_15_GBALASUA",
        "name": "MICROPLAN_MO_04_04_04_15_GBALASUA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_14_GBARYAMAH_TOWN_1331",
        "name": "MICROPLAN_MO_04_04_04_14_GBARYAMAH_TOWN_1331",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_13_GBARYAMAH_TOWN_1330",
        "name": "MICROPLAN_MO_04_04_04_13_GBARYAMAH_TOWN_1330",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_12_GBARYAMAH_TOWN_1329",
        "name": "MICROPLAN_MO_04_04_04_12_GBARYAMAH_TOWN_1329",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_11_GBARYAMAH_TOWN_1328",
        "name": "MICROPLAN_MO_04_04_04_11_GBARYAMAH_TOWN_1328",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_10_GBARYAMAH_TOWN_1327",
        "name": "MICROPLAN_MO_04_04_04_10_GBARYAMAH_TOWN_1327",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_09_GBARYAMAH_TOWN_1326",
        "name": "MICROPLAN_MO_04_04_04_09_GBARYAMAH_TOWN_1326",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_08_GBARYAMAH_TOWN_1325",
        "name": "MICROPLAN_MO_04_04_04_08_GBARYAMAH_TOWN_1325",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_07_GBARYAMAH_TOWN_1324",
        "name": "MICROPLAN_MO_04_04_04_07_GBARYAMAH_TOWN_1324",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_06_GBARYAMAH_TOWN_1323",
        "name": "MICROPLAN_MO_04_04_04_06_GBARYAMAH_TOWN_1323",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_05_GBARYAMAH_TOWN_1322",
        "name": "MICROPLAN_MO_04_04_04_05_GBARYAMAH_TOWN_1322",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_04_GBARYAMAH_TOWN_1321",
        "name": "MICROPLAN_MO_04_04_04_04_GBARYAMAH_TOWN_1321",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_03_GBARYAMAH_TOWN_1320",
        "name": "MICROPLAN_MO_04_04_04_03_GBARYAMAH_TOWN_1320",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_02_GBARYAMAH_TOWN",
        "name": "MICROPLAN_MO_04_04_04_02_GBARYAMAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_04_01__90",
        "name": "MICROPLAN_MO_04_04_04_01__90",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_04_GBARYAMAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "name": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_03_31_GAINKPAIN_GBAYA1317",
        "name": "MICROPLAN_MO_04_04_03_31_GAINKPAIN_GBAYA1317",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_30_GAINKPAIN_KARMO1316",
        "name": "MICROPLAN_MO_04_04_03_30_GAINKPAIN_KARMO1316",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_29_GAINKPAIN_BOY_Z1315",
        "name": "MICROPLAN_MO_04_04_03_29_GAINKPAIN_BOY_Z1315",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_28_GAINKPAIN_GAINK1314",
        "name": "MICROPLAN_MO_04_04_03_28_GAINKPAIN_GAINK1314",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_27_GAINKPAIN",
        "name": "MICROPLAN_MO_04_04_03_27_GAINKPAIN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_26_GBELETTA_MARVO_1312",
        "name": "MICROPLAN_MO_04_04_03_26_GBELETTA_MARVO_1312",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_25_GBELETTA_MOAH_V1311",
        "name": "MICROPLAN_MO_04_04_03_25_GBELETTA_MOAH_V1311",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_24_GBELETTA_KERKUL1310",
        "name": "MICROPLAN_MO_04_04_03_24_GBELETTA_KERKUL1310",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_23_GBELETTA_ZORMU",
        "name": "MICROPLAN_MO_04_04_03_23_GBELETTA_ZORMU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_22_GBELETTA_TAWALA1308",
        "name": "MICROPLAN_MO_04_04_03_22_GBELETTA_TAWALA1308",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_21_GBELETTA_GBELET1307",
        "name": "MICROPLAN_MO_04_04_03_21_GBELETTA_GBELET1307",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_20_GBELETTA",
        "name": "MICROPLAN_MO_04_04_03_20_GBELETTA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_19_SMALL_BONG_COUN1305",
        "name": "MICROPLAN_MO_04_04_03_19_SMALL_BONG_COUN1305",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_18_SMALL_BONG_COUN1304",
        "name": "MICROPLAN_MO_04_04_03_18_SMALL_BONG_COUN1304",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_17_SMALL_BONG_COUN1303",
        "name": "MICROPLAN_MO_04_04_03_17_SMALL_BONG_COUN1303",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_16_SMALL_BONG_COUN1302",
        "name": "MICROPLAN_MO_04_04_03_16_SMALL_BONG_COUN1302",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_15_SMALL_BONG_COUN1301",
        "name": "MICROPLAN_MO_04_04_03_15_SMALL_BONG_COUN1301",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_14_SMALL_BONG_COUN1300",
        "name": "MICROPLAN_MO_04_04_03_14_SMALL_BONG_COUN1300",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_13_BACKYARD_COMMUN1299",
        "name": "MICROPLAN_MO_04_04_03_13_BACKYARD_COMMUN1299",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_12_BACKYARD_COMMUN1298",
        "name": "MICROPLAN_MO_04_04_03_12_BACKYARD_COMMUN1298",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_11_BACKYARD_COMMUN1297",
        "name": "MICROPLAN_MO_04_04_03_11_BACKYARD_COMMUN1297",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_10_BACKYARD_COMMUN1296",
        "name": "MICROPLAN_MO_04_04_03_10_BACKYARD_COMMUN1296",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_09_BACKYARD_COMMUN1295",
        "name": "MICROPLAN_MO_04_04_03_09_BACKYARD_COMMUN1295",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_08_BACKYARD_COMMUN1294",
        "name": "MICROPLAN_MO_04_04_03_08_BACKYARD_COMMUN1294",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_07_BACKYARD_COMMUN1293",
        "name": "MICROPLAN_MO_04_04_03_07_BACKYARD_COMMUN1293",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_06_BACKYARD_COMMUN1292",
        "name": "MICROPLAN_MO_04_04_03_06_BACKYARD_COMMUN1292",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_05_BACKYARD_COMMUN1291",
        "name": "MICROPLAN_MO_04_04_03_05_BACKYARD_COMMUN1291",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_04_BACKYARD_COMMUN1290",
        "name": "MICROPLAN_MO_04_04_03_04_BACKYARD_COMMUN1290",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_03_BACKYARD_COMMUN1289",
        "name": "MICROPLAN_MO_04_04_03_03_BACKYARD_COMMUN1289",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_02_BACKYARD_COMMUN1288",
        "name": "MICROPLAN_MO_04_04_03_02_BACKYARD_COMMUN1288",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_03_01__89",
        "name": "MICROPLAN_MO_04_04_03_01__89",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_03_HENRY_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "name": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_02_14_COLEMAN_VILLAGE1286",
        "name": "MICROPLAN_MO_04_04_02_14_COLEMAN_VILLAGE1286",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_13_COLEMAN_VILLAGE1285",
        "name": "MICROPLAN_MO_04_04_02_13_COLEMAN_VILLAGE1285",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_12_COLEMAN_VILLAGE1284",
        "name": "MICROPLAN_MO_04_04_02_12_COLEMAN_VILLAGE1284",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_11_COLEMAN_VILLAGE1283",
        "name": "MICROPLAN_MO_04_04_02_11_COLEMAN_VILLAGE1283",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_10_COLEMAN_VILLAGE1282",
        "name": "MICROPLAN_MO_04_04_02_10_COLEMAN_VILLAGE1282",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_09_COLEMAN_VILLAGE1281",
        "name": "MICROPLAN_MO_04_04_02_09_COLEMAN_VILLAGE1281",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_08_TOTOQUELEH_LOWO1280",
        "name": "MICROPLAN_MO_04_04_02_08_TOTOQUELEH_LOWO1280",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_07_TOTOQUELEH_K_J_1279",
        "name": "MICROPLAN_MO_04_04_02_07_TOTOQUELEH_K_J_1279",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_06_TOTOQUELEH_GBAR1278",
        "name": "MICROPLAN_MO_04_04_02_06_TOTOQUELEH_GBAR1278",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_05_TOTOQUELEH_PORL1277",
        "name": "MICROPLAN_MO_04_04_02_05_TOTOQUELEH_PORL1277",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_04_TOTOQUELEH_YAND1276",
        "name": "MICROPLAN_MO_04_04_02_04_TOTOQUELEH_YAND1276",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_03_TOTOQUELEH_TOTO1275",
        "name": "MICROPLAN_MO_04_04_02_03_TOTOQUELEH_TOTO1275",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_02_TOTOQUELEH",
        "name": "MICROPLAN_MO_04_04_02_02_TOTOQUELEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_02_01__88",
        "name": "MICROPLAN_MO_04_04_02_01__88",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_04_02_TOTOQUELEH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_04_01__87",
        "name": "MICROPLAN_MO_04_04_01__87",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "name": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_BOKOMU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_02_69_BORLIA_NYALUWAI",
        "name": "MICROPLAN_MO_04_03_02_69_BORLIA_NYALUWAI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_68_BORLIA_KONIYEAP1270",
        "name": "MICROPLAN_MO_04_03_02_68_BORLIA_KONIYEAP1270",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_67_BORLIA_ALFRED_T1269",
        "name": "MICROPLAN_MO_04_03_02_67_BORLIA_ALFRED_T1269",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_66_BORLIA_BORLIA",
        "name": "MICROPLAN_MO_04_03_02_66_BORLIA_BORLIA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_65_BORLIA",
        "name": "MICROPLAN_MO_04_03_02_65_BORLIA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_64_PALAKWELLEH_KPA1266",
        "name": "MICROPLAN_MO_04_03_02_64_PALAKWELLEH_KPA1266",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_63_PALAKWELLEH_DOR1265",
        "name": "MICROPLAN_MO_04_03_02_63_PALAKWELLEH_DOR1265",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_62_PALAKWELLEH_PAL1264",
        "name": "MICROPLAN_MO_04_03_02_62_PALAKWELLEH_PAL1264",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_61_PALAKWELLEH",
        "name": "MICROPLAN_MO_04_03_02_61_PALAKWELLEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_60_GELEYANSIASU_GB1262",
        "name": "MICROPLAN_MO_04_03_02_60_GELEYANSIASU_GB1262",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_59_GELEYANSIASU_FA1261",
        "name": "MICROPLAN_MO_04_03_02_59_GELEYANSIASU_FA1261",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_58_GELEYANSIASU_VA1260",
        "name": "MICROPLAN_MO_04_03_02_58_GELEYANSIASU_VA1260",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_57_GELEYANSIASU_KE1259",
        "name": "MICROPLAN_MO_04_03_02_57_GELEYANSIASU_KE1259",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_56_GELEYANSIASU_SO1258",
        "name": "MICROPLAN_MO_04_03_02_56_GELEYANSIASU_SO1258",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_55_GELEYANSIASU_GE1257",
        "name": "MICROPLAN_MO_04_03_02_55_GELEYANSIASU_GE1257",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_54_GELEYANSIASU",
        "name": "MICROPLAN_MO_04_03_02_54_GELEYANSIASU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_53_KOLOGBANDI_NEAK1255",
        "name": "MICROPLAN_MO_04_03_02_53_KOLOGBANDI_NEAK1255",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_52_KOLOGBANDI_GOMU",
        "name": "MICROPLAN_MO_04_03_02_52_KOLOGBANDI_GOMU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_51_KOLOGBANDI_GBAN1253",
        "name": "MICROPLAN_MO_04_03_02_51_KOLOGBANDI_GBAN1253",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_50_KOLOGBANDI_TAIN1252",
        "name": "MICROPLAN_MO_04_03_02_50_KOLOGBANDI_TAIN1252",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_49_KOLOGBANDI_KOLO1251",
        "name": "MICROPLAN_MO_04_03_02_49_KOLOGBANDI_KOLO1251",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_48_KOLOGBANDI",
        "name": "MICROPLAN_MO_04_03_02_48_KOLOGBANDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_47_KPAYEAKWELLEH_G1249",
        "name": "MICROPLAN_MO_04_03_02_47_KPAYEAKWELLEH_G1249",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_46_KPAYEAKWELLEH_G1248",
        "name": "MICROPLAN_MO_04_03_02_46_KPAYEAKWELLEH_G1248",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_45_KPAYEAKWELLEH_P1247",
        "name": "MICROPLAN_MO_04_03_02_45_KPAYEAKWELLEH_P1247",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_44_KPAYEAKWELLEH_S1246",
        "name": "MICROPLAN_MO_04_03_02_44_KPAYEAKWELLEH_S1246",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_43_KPAYEAKWELLEH_G1245",
        "name": "MICROPLAN_MO_04_03_02_43_KPAYEAKWELLEH_G1245",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_42_KPAYEAKWELLEH_Q1244",
        "name": "MICROPLAN_MO_04_03_02_42_KPAYEAKWELLEH_Q1244",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_41_KPAYEAKWELLEH_G1243",
        "name": "MICROPLAN_MO_04_03_02_41_KPAYEAKWELLEH_G1243",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_40_KPAYEAKWELLEH_F1242",
        "name": "MICROPLAN_MO_04_03_02_40_KPAYEAKWELLEH_F1242",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_39_KPAYEAKWELLEH_G1241",
        "name": "MICROPLAN_MO_04_03_02_39_KPAYEAKWELLEH_G1241",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_38_KPAYEAKWELLEH_V1240",
        "name": "MICROPLAN_MO_04_03_02_38_KPAYEAKWELLEH_V1240",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_37_KPAYEAKWELLEH_G1239",
        "name": "MICROPLAN_MO_04_03_02_37_KPAYEAKWELLEH_G1239",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_36_KPAYEAKWELLEH_K1238",
        "name": "MICROPLAN_MO_04_03_02_36_KPAYEAKWELLEH_K1238",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_35_KPAYEAKWELLEH",
        "name": "MICROPLAN_MO_04_03_02_35_KPAYEAKWELLEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_34_GBARNGAGAI_GBOK1236",
        "name": "MICROPLAN_MO_04_03_02_34_GBARNGAGAI_GBOK1236",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_33_GBARNGAGAI_GBOK1235",
        "name": "MICROPLAN_MO_04_03_02_33_GBARNGAGAI_GBOK1235",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_32_GBARNGAGAI_GBOK1234",
        "name": "MICROPLAN_MO_04_03_02_32_GBARNGAGAI_GBOK1234",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_31_GBARNGAGAI_GBOK1233",
        "name": "MICROPLAN_MO_04_03_02_31_GBARNGAGAI_GBOK1233",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_30_GBARNGAGAI_GBOK1232",
        "name": "MICROPLAN_MO_04_03_02_30_GBARNGAGAI_GBOK1232",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_29_GBARNGAGAI_GBOK1231",
        "name": "MICROPLAN_MO_04_03_02_29_GBARNGAGAI_GBOK1231",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_28_GBARNGAGAI_GBOK1230",
        "name": "MICROPLAN_MO_04_03_02_28_GBARNGAGAI_GBOK1230",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_27_GBARNGAGAI_GBOK1229",
        "name": "MICROPLAN_MO_04_03_02_27_GBARNGAGAI_GBOK1229",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_26_GBARNGAGAI_GBOK1228",
        "name": "MICROPLAN_MO_04_03_02_26_GBARNGAGAI_GBOK1228",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_25_GBARNGAGAI_GBOK1227",
        "name": "MICROPLAN_MO_04_03_02_25_GBARNGAGAI_GBOK1227",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_24_GBARNGAGAI_GBOK1226",
        "name": "MICROPLAN_MO_04_03_02_24_GBARNGAGAI_GBOK1226",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_23_GBARNGAGAI_GBOK1225",
        "name": "MICROPLAN_MO_04_03_02_23_GBARNGAGAI_GBOK1225",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_22_GBARNGAGAI_GBOK1224",
        "name": "MICROPLAN_MO_04_03_02_22_GBARNGAGAI_GBOK1224",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_21_MORLAKOLLEH_POR1223",
        "name": "MICROPLAN_MO_04_03_02_21_MORLAKOLLEH_POR1223",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_20_MORLAKOLLEH_TON1222",
        "name": "MICROPLAN_MO_04_03_02_20_MORLAKOLLEH_TON1222",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_19_MORLAKOLLEH_SAY1221",
        "name": "MICROPLAN_MO_04_03_02_19_MORLAKOLLEH_SAY1221",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_18_MORLAKOLLEH_DOK1220",
        "name": "MICROPLAN_MO_04_03_02_18_MORLAKOLLEH_DOK1220",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_17_MORLAKOLLEH_JEN1219",
        "name": "MICROPLAN_MO_04_03_02_17_MORLAKOLLEH_JEN1219",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_16_MORLAKOLLEH_KIN1218",
        "name": "MICROPLAN_MO_04_03_02_16_MORLAKOLLEH_KIN1218",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_15_MORLAKOLLEH_MOR1217",
        "name": "MICROPLAN_MO_04_03_02_15_MORLAKOLLEH_MOR1217",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_14_MORLAKOLLEH",
        "name": "MICROPLAN_MO_04_03_02_14_MORLAKOLLEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_13_BELLEKPALAMU_ZU1215",
        "name": "MICROPLAN_MO_04_03_02_13_BELLEKPALAMU_ZU1215",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_12_BELLEKPALAMU_MA1214",
        "name": "MICROPLAN_MO_04_03_02_12_BELLEKPALAMU_MA1214",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_11_BELLEKPALAMU_GU1213",
        "name": "MICROPLAN_MO_04_03_02_11_BELLEKPALAMU_GU1213",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_10_BELLEKPALAMU_GB1212",
        "name": "MICROPLAN_MO_04_03_02_10_BELLEKPALAMU_GB1212",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_09_BELLEKPALAMU_BE1211",
        "name": "MICROPLAN_MO_04_03_02_09_BELLEKPALAMU_BE1211",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_08_BELLEKPALAMU",
        "name": "MICROPLAN_MO_04_03_02_08_BELLEKPALAMU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_07_GBARNGAY_TOWN_G1209",
        "name": "MICROPLAN_MO_04_03_02_07_GBARNGAY_TOWN_G1209",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_06_GBARNGAY_TOWN_N1208",
        "name": "MICROPLAN_MO_04_03_02_06_GBARNGAY_TOWN_N1208",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_05_GBARNGAY_TOWN_M1207",
        "name": "MICROPLAN_MO_04_03_02_05_GBARNGAY_TOWN_M1207",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_04_GBARNGAY_TOWN_M1206",
        "name": "MICROPLAN_MO_04_03_02_04_GBARNGAY_TOWN_M1206",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_03_GBARNGAY_TOWN_W1205",
        "name": "MICROPLAN_MO_04_03_02_03_GBARNGAY_TOWN_W1205",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_02_GBARNGAY_TOWN",
        "name": "MICROPLAN_MO_04_03_02_02_GBARNGAY_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_02_01__86",
        "name": "MICROPLAN_MO_04_03_02_01__86",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_03_02_GBARNGAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_03_01__85",
        "name": "MICROPLAN_MO_04_03_01__85",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_BOKOMU",
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
        "code": "MICROPLAN_MO_04_02_03_54_GOLITA_KARSO_VI1200",
        "name": "MICROPLAN_MO_04_02_03_54_GOLITA_KARSO_VI1200",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_53_GOLITA_CONGO",
        "name": "MICROPLAN_MO_04_02_03_53_GOLITA_CONGO",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_52_GOLITA_GOLITA",
        "name": "MICROPLAN_MO_04_02_03_52_GOLITA_GOLITA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_51_GOLITA",
        "name": "MICROPLAN_MO_04_02_03_51_GOLITA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_50_KALATA_LEMO_VIL1196",
        "name": "MICROPLAN_MO_04_02_03_50_KALATA_LEMO_VIL1196",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_49_KALATA_SENEE_VI1195",
        "name": "MICROPLAN_MO_04_02_03_49_KALATA_SENEE_VI1195",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_48_KALATA_MULBAH_B1194",
        "name": "MICROPLAN_MO_04_02_03_48_KALATA_MULBAH_B1194",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_47_KALATA_KALATA",
        "name": "MICROPLAN_MO_04_02_03_47_KALATA_KALATA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_46_KALATA",
        "name": "MICROPLAN_MO_04_02_03_46_KALATA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_45_GUWORMA_KAWEE_V1191",
        "name": "MICROPLAN_MO_04_02_03_45_GUWORMA_KAWEE_V1191",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_44_GUWORMA_LEBAH_V1190",
        "name": "MICROPLAN_MO_04_02_03_44_GUWORMA_LEBAH_V1190",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_43_GUWORMA_WILL_WI1189",
        "name": "MICROPLAN_MO_04_02_03_43_GUWORMA_WILL_WI1189",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_42_GUWORMA_PAR_YAR1188",
        "name": "MICROPLAN_MO_04_02_03_42_GUWORMA_PAR_YAR1188",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_41_GUWORMA_JORJORM1187",
        "name": "MICROPLAN_MO_04_02_03_41_GUWORMA_JORJORM1187",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_40_GUWORMA_GUWORMA",
        "name": "MICROPLAN_MO_04_02_03_40_GUWORMA_GUWORMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_39_GUWORMA",
        "name": "MICROPLAN_MO_04_02_03_39_GUWORMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_38_SASSAHUN_MOYEA_1184",
        "name": "MICROPLAN_MO_04_02_03_38_SASSAHUN_MOYEA_1184",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_37_SASSAHUN_LALESU1183",
        "name": "MICROPLAN_MO_04_02_03_37_SASSAHUN_LALESU1183",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_36_SASSAHUN_BARSE_1182",
        "name": "MICROPLAN_MO_04_02_03_36_SASSAHUN_BARSE_1182",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_35_SASSAHUN_SASSAH1181",
        "name": "MICROPLAN_MO_04_02_03_35_SASSAHUN_SASSAH1181",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_34_SASSAHUN",
        "name": "MICROPLAN_MO_04_02_03_34_SASSAHUN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_33_GATIMA_SAMULAHU1179",
        "name": "MICROPLAN_MO_04_02_03_33_GATIMA_SAMULAHU1179",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_32_GATIMA_BAH_VILL1178",
        "name": "MICROPLAN_MO_04_02_03_32_GATIMA_BAH_VILL1178",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_31_GATIMA_MONDEGO",
        "name": "MICROPLAN_MO_04_02_03_31_GATIMA_MONDEGO",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_30_GATIMA_GATIMA",
        "name": "MICROPLAN_MO_04_02_03_30_GATIMA_GATIMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_29_GATIMA",
        "name": "MICROPLAN_MO_04_02_03_29_GATIMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_28_GBEYANKAI_TOWER1174",
        "name": "MICROPLAN_MO_04_02_03_28_GBEYANKAI_TOWER1174",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_27_GBEYANKAI_NAWAN1173",
        "name": "MICROPLAN_MO_04_02_03_27_GBEYANKAI_NAWAN1173",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_26_GBEYANKAI_GBANS1172",
        "name": "MICROPLAN_MO_04_02_03_26_GBEYANKAI_GBANS1172",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_25_GBEYANKAI_MAWAN1171",
        "name": "MICROPLAN_MO_04_02_03_25_GBEYANKAI_MAWAN1171",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_24_GBEYANKAI_GBEYA1170",
        "name": "MICROPLAN_MO_04_02_03_24_GBEYANKAI_GBEYA1170",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_23_GBEYANKAI",
        "name": "MICROPLAN_MO_04_02_03_23_GBEYANKAI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_22_LOWOMA_GBODGOLO",
        "name": "MICROPLAN_MO_04_02_03_22_LOWOMA_GBODGOLO",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_21_LOWOMA_KOGOHUN",
        "name": "MICROPLAN_MO_04_02_03_21_LOWOMA_KOGOHUN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_20_LOWOMA_MEIHUN",
        "name": "MICROPLAN_MO_04_02_03_20_LOWOMA_MEIHUN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_19_LOWOMA_KELORWAH",
        "name": "MICROPLAN_MO_04_02_03_19_LOWOMA_KELORWAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_18_LOWOMA_GBADOMA",
        "name": "MICROPLAN_MO_04_02_03_18_LOWOMA_GBADOMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_17_LOWOMA_MAMAHUN",
        "name": "MICROPLAN_MO_04_02_03_17_LOWOMA_MAMAHUN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_16_LOWOMA_NDAGBAYA1162",
        "name": "MICROPLAN_MO_04_02_03_16_LOWOMA_NDAGBAYA1162",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_15_LOWOMA_NENE_WIW1161",
        "name": "MICROPLAN_MO_04_02_03_15_LOWOMA_NENE_WIW1161",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_14_LOWOMA_LOWOMA",
        "name": "MICROPLAN_MO_04_02_03_14_LOWOMA_LOWOMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_13_LOWOMA",
        "name": "MICROPLAN_MO_04_02_03_13_LOWOMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_12_KONDESU_NAGIWAN",
        "name": "MICROPLAN_MO_04_02_03_12_KONDESU_NAGIWAN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_11_KONDESU_PULUMA",
        "name": "MICROPLAN_MO_04_02_03_11_KONDESU_PULUMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_10_KONDESU_SAND_BE1156",
        "name": "MICROPLAN_MO_04_02_03_10_KONDESU_SAND_BE1156",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_09_KONDESU_WAI_WAI1155",
        "name": "MICROPLAN_MO_04_02_03_09_KONDESU_WAI_WAI1155",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_08_KONDESU_POTOR_P1154",
        "name": "MICROPLAN_MO_04_02_03_08_KONDESU_POTOR_P1154",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_07_KONDESU_WAI_WAI1153",
        "name": "MICROPLAN_MO_04_02_03_07_KONDESU_WAI_WAI1153",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_06_KONDESU_JENNEHK1152",
        "name": "MICROPLAN_MO_04_02_03_06_KONDESU_JENNEHK1152",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_05_KONDESU_TARNUE_1151",
        "name": "MICROPLAN_MO_04_02_03_05_KONDESU_TARNUE_1151",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_04_KONDESU_VICTOR_1150",
        "name": "MICROPLAN_MO_04_02_03_04_KONDESU_VICTOR_1150",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_03_KONDESU_KONDESU",
        "name": "MICROPLAN_MO_04_02_03_03_KONDESU_KONDESU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_02_KONDESU",
        "name": "MICROPLAN_MO_04_02_03_02_KONDESU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_03_01__84",
        "name": "MICROPLAN_MO_04_02_03_01__84",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_03_KONDESU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "name": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_BELLEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_02_75_TOIKEI_VASSALA",
        "name": "MICROPLAN_MO_04_02_02_75_TOIKEI_VASSALA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_74_TOIKEI_JOEDOEBO1145",
        "name": "MICROPLAN_MO_04_02_02_74_TOIKEI_JOEDOEBO1145",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_73_TOIKEI_WOMBOI_V1144",
        "name": "MICROPLAN_MO_04_02_02_73_TOIKEI_WOMBOI_V1144",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_72_TOIKEI_TOIKEI",
        "name": "MICROPLAN_MO_04_02_02_72_TOIKEI_TOIKEI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_71_TOIKEI",
        "name": "MICROPLAN_MO_04_02_02_71_TOIKEI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_70_KPAWOLOZU_MABUE1141",
        "name": "MICROPLAN_MO_04_02_02_70_KPAWOLOZU_MABUE1141",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_69_KPAWOLOZU_TARNU1140",
        "name": "MICROPLAN_MO_04_02_02_69_KPAWOLOZU_TARNU1140",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_68_KPAWOLOZU_KPAWO1139",
        "name": "MICROPLAN_MO_04_02_02_68_KPAWOLOZU_KPAWO1139",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_67_KPAWOLOZU",
        "name": "MICROPLAN_MO_04_02_02_67_KPAWOLOZU",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_66_JAIKEI_KENATA",
        "name": "MICROPLAN_MO_04_02_02_66_JAIKEI_KENATA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_65_JAIKEI_KPONIWAY",
        "name": "MICROPLAN_MO_04_02_02_65_JAIKEI_KPONIWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_64_JAIKEI_JAIKEI",
        "name": "MICROPLAN_MO_04_02_02_64_JAIKEI_JAIKEI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_63_JAIKEI",
        "name": "MICROPLAN_MO_04_02_02_63_JAIKEI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_62_BALOMA_TUMA_KAW1133",
        "name": "MICROPLAN_MO_04_02_02_62_BALOMA_TUMA_KAW1133",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_61_BALOMA_BALOMA",
        "name": "MICROPLAN_MO_04_02_02_61_BALOMA_BALOMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_60_BALOMA",
        "name": "MICROPLAN_MO_04_02_02_60_BALOMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_59_CAMP_PEWEE_1_CA1130",
        "name": "MICROPLAN_MO_04_02_02_59_CAMP_PEWEE_1_CA1130",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_58_CAMP_PEWEE_1_CA1129",
        "name": "MICROPLAN_MO_04_02_02_58_CAMP_PEWEE_1_CA1129",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_57_CAMP_PEWEE_1",
        "name": "MICROPLAN_MO_04_02_02_57_CAMP_PEWEE_1",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_56_MONVORDOR_GBAGI1127",
        "name": "MICROPLAN_MO_04_02_02_56_MONVORDOR_GBAGI1127",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_55_MONVORDOR_CAMP_1126",
        "name": "MICROPLAN_MO_04_02_02_55_MONVORDOR_CAMP_1126",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_54_MONVORDOR_MURPH1125",
        "name": "MICROPLAN_MO_04_02_02_54_MONVORDOR_MURPH1125",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_53_MONVORDOR_KARNI1124",
        "name": "MICROPLAN_MO_04_02_02_53_MONVORDOR_KARNI1124",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_52_MONVORDOR_MONVO1123",
        "name": "MICROPLAN_MO_04_02_02_52_MONVORDOR_MONVO1123",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_51_SAKPEDEH_CAMP_U1122",
        "name": "MICROPLAN_MO_04_02_02_51_SAKPEDEH_CAMP_U1122",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_50_SAKPEDEH_CAMP_G1121",
        "name": "MICROPLAN_MO_04_02_02_50_SAKPEDEH_CAMP_G1121",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_49_SAKPEDEH_SAKPED1120",
        "name": "MICROPLAN_MO_04_02_02_49_SAKPEDEH_SAKPED1120",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_48_SAKPEDEH",
        "name": "MICROPLAN_MO_04_02_02_48_SAKPEDEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_47_BELLE_YELLA_MAL1118",
        "name": "MICROPLAN_MO_04_02_02_47_BELLE_YELLA_MAL1118",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_46_BELLE_YELLA_NAT1117",
        "name": "MICROPLAN_MO_04_02_02_46_BELLE_YELLA_NAT1117",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_45_BELLE_YELLA_JAM1116",
        "name": "MICROPLAN_MO_04_02_02_45_BELLE_YELLA_JAM1116",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_44_BELLE_YELLA_MR_1115",
        "name": "MICROPLAN_MO_04_02_02_44_BELLE_YELLA_MR_1115",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_43_BELLE_YELLA_GAL1114",
        "name": "MICROPLAN_MO_04_02_02_43_BELLE_YELLA_GAL1114",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_42_BELLE_YELLA_KOR1113",
        "name": "MICROPLAN_MO_04_02_02_42_BELLE_YELLA_KOR1113",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_41_BELLE_YELLA_PET1112",
        "name": "MICROPLAN_MO_04_02_02_41_BELLE_YELLA_PET1112",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_40_BELLE_YELLA_HAR1111",
        "name": "MICROPLAN_MO_04_02_02_40_BELLE_YELLA_HAR1111",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_39_BELLE_YELLA_BEL1110",
        "name": "MICROPLAN_MO_04_02_02_39_BELLE_YELLA_BEL1110",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_38_BELLE_YELLA",
        "name": "MICROPLAN_MO_04_02_02_38_BELLE_YELLA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_37_KONDESU_JUNCTIO1108",
        "name": "MICROPLAN_MO_04_02_02_37_KONDESU_JUNCTIO1108",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_36_KONDESU_JUNCTIO1107",
        "name": "MICROPLAN_MO_04_02_02_36_KONDESU_JUNCTIO1107",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_35_KONDESU_JUNCTIO1106",
        "name": "MICROPLAN_MO_04_02_02_35_KONDESU_JUNCTIO1106",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_34_KONDESU_JUNCTIO1105",
        "name": "MICROPLAN_MO_04_02_02_34_KONDESU_JUNCTIO1105",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_33_KONDESU_JUNCTIO1104",
        "name": "MICROPLAN_MO_04_02_02_33_KONDESU_JUNCTIO1104",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_32_KONDESU_JUNCTIO1103",
        "name": "MICROPLAN_MO_04_02_02_32_KONDESU_JUNCTIO1103",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_31_KONDESU_JUNCTIO1102",
        "name": "MICROPLAN_MO_04_02_02_31_KONDESU_JUNCTIO1102",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_30_KONDESU_JUNCTIO1101",
        "name": "MICROPLAN_MO_04_02_02_30_KONDESU_JUNCTIO1101",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_29_KONDESU_JUNCTIO1100",
        "name": "MICROPLAN_MO_04_02_02_29_KONDESU_JUNCTIO1100",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_28_KONDESU_JUNCTIO1099",
        "name": "MICROPLAN_MO_04_02_02_28_KONDESU_JUNCTIO1099",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_27_KONDESU_JUNCTIO1098",
        "name": "MICROPLAN_MO_04_02_02_27_KONDESU_JUNCTIO1098",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_26_FASSAMA_KARPEE_1097",
        "name": "MICROPLAN_MO_04_02_02_26_FASSAMA_KARPEE_1097",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_25_FASSAMA_JUNIOR_1096",
        "name": "MICROPLAN_MO_04_02_02_25_FASSAMA_JUNIOR_1096",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_24_FASSAMA_JAMES_T1095",
        "name": "MICROPLAN_MO_04_02_02_24_FASSAMA_JAMES_T1095",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_23_FASSAMA_CAMP_IS1094",
        "name": "MICROPLAN_MO_04_02_02_23_FASSAMA_CAMP_IS1094",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_22_FASSAMA_ZIMBABW1093",
        "name": "MICROPLAN_MO_04_02_02_22_FASSAMA_ZIMBABW1093",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_21_FASSAMA_EDDOE_V1092",
        "name": "MICROPLAN_MO_04_02_02_21_FASSAMA_EDDOE_V1092",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_20_FASSAMA_ARKU_VI1091",
        "name": "MICROPLAN_MO_04_02_02_20_FASSAMA_ARKU_VI1091",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_19_FASSAMA_GREENLA1090",
        "name": "MICROPLAN_MO_04_02_02_19_FASSAMA_GREENLA1090",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_18_FASSAMA_SOUTH_A1089",
        "name": "MICROPLAN_MO_04_02_02_18_FASSAMA_SOUTH_A1089",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_17_FASSAMA_CANADA",
        "name": "MICROPLAN_MO_04_02_02_17_FASSAMA_CANADA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_16_FASSAMA_NEW_YOR1087",
        "name": "MICROPLAN_MO_04_02_02_16_FASSAMA_NEW_YOR1087",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_15_FASSAMA_SMALL_M1086",
        "name": "MICROPLAN_MO_04_02_02_15_FASSAMA_SMALL_M1086",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_14_FASSAMA_CONGO",
        "name": "MICROPLAN_MO_04_02_02_14_FASSAMA_CONGO",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_13_FASSAMA_POLIEA",
        "name": "MICROPLAN_MO_04_02_02_13_FASSAMA_POLIEA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_12_FASSAMA_MR__BRO1083",
        "name": "MICROPLAN_MO_04_02_02_12_FASSAMA_MR__BRO1083",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_11_FASSAMA_GATEWAY1082",
        "name": "MICROPLAN_MO_04_02_02_11_FASSAMA_GATEWAY1082",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_10_FASSAMA_LARRY_V1081",
        "name": "MICROPLAN_MO_04_02_02_10_FASSAMA_LARRY_V1081",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_09_FASSAMA_JTI",
        "name": "MICROPLAN_MO_04_02_02_09_FASSAMA_JTI",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_08_FASSAMA_CITY_UN1079",
        "name": "MICROPLAN_MO_04_02_02_08_FASSAMA_CITY_UN1079",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_07_FASSAMA_ZAMAH",
        "name": "MICROPLAN_MO_04_02_02_07_FASSAMA_ZAMAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_06_FASSAMA_GATEWAY1077",
        "name": "MICROPLAN_MO_04_02_02_06_FASSAMA_GATEWAY1077",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_05_FASSAMA_MAPUWAY",
        "name": "MICROPLAN_MO_04_02_02_05_FASSAMA_MAPUWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_04_FASSAMA_JAPAN",
        "name": "MICROPLAN_MO_04_02_02_04_FASSAMA_JAPAN",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_03_FASSAMA_FASSAMA",
        "name": "MICROPLAN_MO_04_02_02_03_FASSAMA_FASSAMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_02_FASSAMA",
        "name": "MICROPLAN_MO_04_02_02_02_FASSAMA",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_02_01__83",
        "name": "MICROPLAN_MO_04_02_02_01__83",
        "type": "Village",
        "parent": "MICROPLAN_MO_04_02_02_FASSAMA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_04_02_01__82",
        "name": "MICROPLAN_MO_04_02_01__82",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_BELLEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_01__81",
        "name": "MICROPLAN_MO_04_01__81",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GBARPOLU",
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
        "code": "MICROPLAN_MO_03_07_05_12_TOFFOI_TOWN_GRE1068",
        "name": "MICROPLAN_MO_03_07_05_12_TOFFOI_TOWN_GRE1068",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_11_TOFFOI_TOWN_COR1067",
        "name": "MICROPLAN_MO_03_07_05_11_TOFFOI_TOWN_COR1067",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_10_TOFFOI_TOWN_BAW1066",
        "name": "MICROPLAN_MO_03_07_05_10_TOFFOI_TOWN_BAW1066",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_09_TOFFOI_TOWN_YOU1065",
        "name": "MICROPLAN_MO_03_07_05_09_TOFFOI_TOWN_YOU1065",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_08_TOFFOI_TOWN_KRA1064",
        "name": "MICROPLAN_MO_03_07_05_08_TOFFOI_TOWN_KRA1064",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_07_TOFFOI_TOWN_MAN1063",
        "name": "MICROPLAN_MO_03_07_05_07_TOFFOI_TOWN_MAN1063",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_06_TOFFOI_TOWN_BEE1062",
        "name": "MICROPLAN_MO_03_07_05_06_TOFFOI_TOWN_BEE1062",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_05_TOFFOI_TOWN_TOF1061",
        "name": "MICROPLAN_MO_03_07_05_05_TOFFOI_TOWN_TOF1061",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_04_TOFFOI_TOWN_JEL1060",
        "name": "MICROPLAN_MO_03_07_05_04_TOFFOI_TOWN_JEL1060",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_03_TOFFOI_TOWN_GBE1059",
        "name": "MICROPLAN_MO_03_07_05_03_TOFFOI_TOWN_GBE1059",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_02_TOFFOI_TOWN",
        "name": "MICROPLAN_MO_03_07_05_02_TOFFOI_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_05_TOFFOI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_05_01__80",
        "name": "MICROPLAN_MO_03_07_05_01__80",
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
        "code": "MICROPLAN_MO_03_07_04_34_SAYUOH_TOWN_BEN1055",
        "name": "MICROPLAN_MO_03_07_04_34_SAYUOH_TOWN_BEN1055",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_33_SAYUOH_TOWN_CHE1054",
        "name": "MICROPLAN_MO_03_07_04_33_SAYUOH_TOWN_CHE1054",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_32_SAYUOH_TOWN_DOR1053",
        "name": "MICROPLAN_MO_03_07_04_32_SAYUOH_TOWN_DOR1053",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_31_SAYUOH_TOWN_MIS1052",
        "name": "MICROPLAN_MO_03_07_04_31_SAYUOH_TOWN_MIS1052",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_30_SAYUOH_TOWN_KAL1051",
        "name": "MICROPLAN_MO_03_07_04_30_SAYUOH_TOWN_KAL1051",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_29_SAYUOH_TOWN_SAY1050",
        "name": "MICROPLAN_MO_03_07_04_29_SAYUOH_TOWN_SAY1050",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_28_SAYUOH_TOWN_BAN1049",
        "name": "MICROPLAN_MO_03_07_04_28_SAYUOH_TOWN_BAN1049",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_27_SAYUOH_TOWN_TAI1048",
        "name": "MICROPLAN_MO_03_07_04_27_SAYUOH_TOWN_TAI1048",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_26_SAYUOH_TOWN_JEM1047",
        "name": "MICROPLAN_MO_03_07_04_26_SAYUOH_TOWN_JEM1047",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_25_SAYUOH_TOWN_WUL1046",
        "name": "MICROPLAN_MO_03_07_04_25_SAYUOH_TOWN_WUL1046",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_24_SAYUOH_TOWN_GOL1045",
        "name": "MICROPLAN_MO_03_07_04_24_SAYUOH_TOWN_GOL1045",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_23_SAYUOH_TOWN_BEN1044",
        "name": "MICROPLAN_MO_03_07_04_23_SAYUOH_TOWN_BEN1044",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_22_SAYUOH_TOWN",
        "name": "MICROPLAN_MO_03_07_04_22_SAYUOH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_21_KANNEH_COMMUNIT1042",
        "name": "MICROPLAN_MO_03_07_04_21_KANNEH_COMMUNIT1042",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_20_KANNEH_COMMUNIT1041",
        "name": "MICROPLAN_MO_03_07_04_20_KANNEH_COMMUNIT1041",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_19_KANNEH_COMMUNIT1040",
        "name": "MICROPLAN_MO_03_07_04_19_KANNEH_COMMUNIT1040",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_18_KANNEH_COMMUNIT1039",
        "name": "MICROPLAN_MO_03_07_04_18_KANNEH_COMMUNIT1039",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_17_KANNEH_COMMUNIT1038",
        "name": "MICROPLAN_MO_03_07_04_17_KANNEH_COMMUNIT1038",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_16_KANNEH_COMMUNIT1037",
        "name": "MICROPLAN_MO_03_07_04_16_KANNEH_COMMUNIT1037",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_15_KANNEH_COMMUNIT1036",
        "name": "MICROPLAN_MO_03_07_04_15_KANNEH_COMMUNIT1036",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_14_KANNEH_COMMUNIT1035",
        "name": "MICROPLAN_MO_03_07_04_14_KANNEH_COMMUNIT1035",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_13_KANNEH_COMMUNIT1034",
        "name": "MICROPLAN_MO_03_07_04_13_KANNEH_COMMUNIT1034",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_12_KANNEH_COMMUNIT1033",
        "name": "MICROPLAN_MO_03_07_04_12_KANNEH_COMMUNIT1033",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_11_KANNEH_COMMUNIT1032",
        "name": "MICROPLAN_MO_03_07_04_11_KANNEH_COMMUNIT1032",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_10_KANNEH_COMMUNIT1031",
        "name": "MICROPLAN_MO_03_07_04_10_KANNEH_COMMUNIT1031",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_09_KANNEH_COMMUNIT1030",
        "name": "MICROPLAN_MO_03_07_04_09_KANNEH_COMMUNIT1030",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_08_KANNEH_COMMUNIT1029",
        "name": "MICROPLAN_MO_03_07_04_08_KANNEH_COMMUNIT1029",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_07_KANNEH_COMMUNIT1028",
        "name": "MICROPLAN_MO_03_07_04_07_KANNEH_COMMUNIT1028",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_06_KANNEH_COMMUNIT1027",
        "name": "MICROPLAN_MO_03_07_04_06_KANNEH_COMMUNIT1027",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_05_KANNEH_COMMUNIT1026",
        "name": "MICROPLAN_MO_03_07_04_05_KANNEH_COMMUNIT1026",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_04_KANNEH_COMMUNIT1025",
        "name": "MICROPLAN_MO_03_07_04_04_KANNEH_COMMUNIT1025",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_03_KANNEH_COMMUNIT1024",
        "name": "MICROPLAN_MO_03_07_04_03_KANNEH_COMMUNIT1024",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_02_KANNEH_COMMUNIT1023",
        "name": "MICROPLAN_MO_03_07_04_02_KANNEH_COMMUNIT1023",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_04_01__79",
        "name": "MICROPLAN_MO_03_07_04_01__79",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_04_KANNEH_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "name": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_07_03_32_KUMAH_TOWN_VICT1021",
        "name": "MICROPLAN_MO_03_07_03_32_KUMAH_TOWN_VICT1021",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_31_KUMAH_TOWN_JELL1020",
        "name": "MICROPLAN_MO_03_07_03_31_KUMAH_TOWN_JELL1020",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_30_KUMAH_TOWN_ALPH1019",
        "name": "MICROPLAN_MO_03_07_03_30_KUMAH_TOWN_ALPH1019",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_29_KUMAH_TOWN_BASS1018",
        "name": "MICROPLAN_MO_03_07_03_29_KUMAH_TOWN_BASS1018",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_28_KUMAH_TOWN_PENN1017",
        "name": "MICROPLAN_MO_03_07_03_28_KUMAH_TOWN_PENN1017",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_27_KUMAH_TOWN_KUMA1016",
        "name": "MICROPLAN_MO_03_07_03_27_KUMAH_TOWN_KUMA1016",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_26_KUMAH_TOWN_ZAYB1015",
        "name": "MICROPLAN_MO_03_07_03_26_KUMAH_TOWN_ZAYB1015",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_25_KUMAH_TOWN_JAIB1014",
        "name": "MICROPLAN_MO_03_07_03_25_KUMAH_TOWN_JAIB1014",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_24_KUMAH_TOWN_GBAR1013",
        "name": "MICROPLAN_MO_03_07_03_24_KUMAH_TOWN_GBAR1013",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_23_KUMAH_TOWN_TETE1012",
        "name": "MICROPLAN_MO_03_07_03_23_KUMAH_TOWN_TETE1012",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_22_KUMAH_TOWN_PELL1011",
        "name": "MICROPLAN_MO_03_07_03_22_KUMAH_TOWN_PELL1011",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_21_KUMAH_TOWN_JARB1010",
        "name": "MICROPLAN_MO_03_07_03_21_KUMAH_TOWN_JARB1010",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_20_KUMAH_TOWN_TCHI1009",
        "name": "MICROPLAN_MO_03_07_03_20_KUMAH_TOWN_TCHI1009",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_19_KUMAH_TOWN",
        "name": "MICROPLAN_MO_03_07_03_19_KUMAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_18_GORBOWRAGBA_COM1007",
        "name": "MICROPLAN_MO_03_07_03_18_GORBOWRAGBA_COM1007",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_17_GORBOWRAGBA_COM1006",
        "name": "MICROPLAN_MO_03_07_03_17_GORBOWRAGBA_COM1006",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_16_GORBOWRAGBA_COM1005",
        "name": "MICROPLAN_MO_03_07_03_16_GORBOWRAGBA_COM1005",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_15_GORBOWRAGBA_COM1004",
        "name": "MICROPLAN_MO_03_07_03_15_GORBOWRAGBA_COM1004",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_14_GORBOWRAGBA_COM1003",
        "name": "MICROPLAN_MO_03_07_03_14_GORBOWRAGBA_COM1003",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_13_GORBOWRAGBA_COM1002",
        "name": "MICROPLAN_MO_03_07_03_13_GORBOWRAGBA_COM1002",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_12_GORBOWRAGBA_COM1001",
        "name": "MICROPLAN_MO_03_07_03_12_GORBOWRAGBA_COM1001",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_11_GORBOWRAGBA_COM1000",
        "name": "MICROPLAN_MO_03_07_03_11_GORBOWRAGBA_COM1000",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_10_GORBOWRAGBA_COM999",
        "name": "MICROPLAN_MO_03_07_03_10_GORBOWRAGBA_COM999",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_09_GORBOWRAGBA_COM998",
        "name": "MICROPLAN_MO_03_07_03_09_GORBOWRAGBA_COM998",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_08_GORBOWRAGBA_COM997",
        "name": "MICROPLAN_MO_03_07_03_08_GORBOWRAGBA_COM997",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_07_GORBOWRAGBA_COM996",
        "name": "MICROPLAN_MO_03_07_03_07_GORBOWRAGBA_COM996",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_06_GORBOWRAGBA_COM995",
        "name": "MICROPLAN_MO_03_07_03_06_GORBOWRAGBA_COM995",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_05_GORBOWRAGBA_COM994",
        "name": "MICROPLAN_MO_03_07_03_05_GORBOWRAGBA_COM994",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_04_GORBOWRAGBA_COM993",
        "name": "MICROPLAN_MO_03_07_03_04_GORBOWRAGBA_COM993",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_03_GORBOWRAGBA_COM992",
        "name": "MICROPLAN_MO_03_07_03_03_GORBOWRAGBA_COM992",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_02_GORBOWRAGBA_COM991",
        "name": "MICROPLAN_MO_03_07_03_02_GORBOWRAGBA_COM991",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_03_01__78",
        "name": "MICROPLAN_MO_03_07_03_01__78",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_03_GORBOWRAGBA",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "name": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_07_02_57_ZMHS_COMMUNITY_989",
        "name": "MICROPLAN_MO_03_07_02_57_ZMHS_COMMUNITY_989",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_56_ZMHS_COMMUNITY_988",
        "name": "MICROPLAN_MO_03_07_02_56_ZMHS_COMMUNITY_988",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_55_ZMHS_COMMUNITY_987",
        "name": "MICROPLAN_MO_03_07_02_55_ZMHS_COMMUNITY_987",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_54_ZMHS_COMMUNITY_986",
        "name": "MICROPLAN_MO_03_07_02_54_ZMHS_COMMUNITY_986",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_53_ZMHS_COMMUNITY_985",
        "name": "MICROPLAN_MO_03_07_02_53_ZMHS_COMMUNITY_985",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_52_ZMHS_COMMUNITY_984",
        "name": "MICROPLAN_MO_03_07_02_52_ZMHS_COMMUNITY_984",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_51_ZMHS_COMMUNITY_983",
        "name": "MICROPLAN_MO_03_07_02_51_ZMHS_COMMUNITY_983",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_50_ZMHS_COMMUNITY_982",
        "name": "MICROPLAN_MO_03_07_02_50_ZMHS_COMMUNITY_982",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_49_ZMHS_COMMUNITY_981",
        "name": "MICROPLAN_MO_03_07_02_49_ZMHS_COMMUNITY_981",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_48_ZMHS_COMMUNITY_980",
        "name": "MICROPLAN_MO_03_07_02_48_ZMHS_COMMUNITY_980",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_47_ZMHS_COMMUNITY_979",
        "name": "MICROPLAN_MO_03_07_02_47_ZMHS_COMMUNITY_979",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_46_ZMHS_COMMUNITY_978",
        "name": "MICROPLAN_MO_03_07_02_46_ZMHS_COMMUNITY_978",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_45_ZMHS_COMMUNITY_977",
        "name": "MICROPLAN_MO_03_07_02_45_ZMHS_COMMUNITY_977",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_44_ZMHS_COMMUNITY_976",
        "name": "MICROPLAN_MO_03_07_02_44_ZMHS_COMMUNITY_976",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_43_ZMHS_COMMUNITY_975",
        "name": "MICROPLAN_MO_03_07_02_43_ZMHS_COMMUNITY_975",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_42_ZMHS_COMMUNITY_974",
        "name": "MICROPLAN_MO_03_07_02_42_ZMHS_COMMUNITY_974",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_41_ZMHS_COMMUNITY_973",
        "name": "MICROPLAN_MO_03_07_02_41_ZMHS_COMMUNITY_973",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_40_ZMHS_COMMUNITY_972",
        "name": "MICROPLAN_MO_03_07_02_40_ZMHS_COMMUNITY_972",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_39_ZMHS_COMMUNITY",
        "name": "MICROPLAN_MO_03_07_02_39_ZMHS_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_38_TODDY_VILLE_JEN970",
        "name": "MICROPLAN_MO_03_07_02_38_TODDY_VILLE_JEN970",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_37_TODDY_VILLE_DOU969",
        "name": "MICROPLAN_MO_03_07_02_37_TODDY_VILLE_DOU969",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_36_TODDY_VILLE_CAN968",
        "name": "MICROPLAN_MO_03_07_02_36_TODDY_VILLE_CAN968",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_35_TODDY_VILLE_BLE967",
        "name": "MICROPLAN_MO_03_07_02_35_TODDY_VILLE_BLE967",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_34_TODDY_VILLE_JEN966",
        "name": "MICROPLAN_MO_03_07_02_34_TODDY_VILLE_JEN966",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_33_TODDY_VILLE_TOD965",
        "name": "MICROPLAN_MO_03_07_02_33_TODDY_VILLE_TOD965",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_32_TODDY_VILLE_PEN964",
        "name": "MICROPLAN_MO_03_07_02_32_TODDY_VILLE_PEN964",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_31_TODDY_VILLE_KRA963",
        "name": "MICROPLAN_MO_03_07_02_31_TODDY_VILLE_KRA963",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_30_TODDY_VILLE_GOR962",
        "name": "MICROPLAN_MO_03_07_02_30_TODDY_VILLE_GOR962",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_29_TODDY_VILLE_FDA961",
        "name": "MICROPLAN_MO_03_07_02_29_TODDY_VILLE_FDA961",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_28_TODDY_VILLE_CHE960",
        "name": "MICROPLAN_MO_03_07_02_28_TODDY_VILLE_CHE960",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_27_TODDY_VILLE_BAR959",
        "name": "MICROPLAN_MO_03_07_02_27_TODDY_VILLE_BAR959",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_26_TODDY_VILLE",
        "name": "MICROPLAN_MO_03_07_02_26_TODDY_VILLE",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_25_TRIANGLE_COMMUN957",
        "name": "MICROPLAN_MO_03_07_02_25_TRIANGLE_COMMUN957",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_24_TRIANGLE_COMMUN956",
        "name": "MICROPLAN_MO_03_07_02_24_TRIANGLE_COMMUN956",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_23_TRIANGLE_COMMUN955",
        "name": "MICROPLAN_MO_03_07_02_23_TRIANGLE_COMMUN955",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_22_TRIANGLE_COMMUN954",
        "name": "MICROPLAN_MO_03_07_02_22_TRIANGLE_COMMUN954",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_21_TRIANGLE_COMMUN953",
        "name": "MICROPLAN_MO_03_07_02_21_TRIANGLE_COMMUN953",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_20_TRIANGLE_COMMUN952",
        "name": "MICROPLAN_MO_03_07_02_20_TRIANGLE_COMMUN952",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_19_TRIANGLE_COMMUN951",
        "name": "MICROPLAN_MO_03_07_02_19_TRIANGLE_COMMUN951",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_18_TRIANGLE_COMMUN950",
        "name": "MICROPLAN_MO_03_07_02_18_TRIANGLE_COMMUN950",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_17_TRIANGLE_COMMUN949",
        "name": "MICROPLAN_MO_03_07_02_17_TRIANGLE_COMMUN949",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_16_TRIANGLE_COMMUN948",
        "name": "MICROPLAN_MO_03_07_02_16_TRIANGLE_COMMUN948",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_15_TRIANGLE_COMMUN947",
        "name": "MICROPLAN_MO_03_07_02_15_TRIANGLE_COMMUN947",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_14_TRIANGLE_COMMUN946",
        "name": "MICROPLAN_MO_03_07_02_14_TRIANGLE_COMMUN946",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_13_TRIANGLE_COMMUN945",
        "name": "MICROPLAN_MO_03_07_02_13_TRIANGLE_COMMUN945",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_12_TRIANGLE_COMMUN944",
        "name": "MICROPLAN_MO_03_07_02_12_TRIANGLE_COMMUN944",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_11_NAO_COMMUNITY_N943",
        "name": "MICROPLAN_MO_03_07_02_11_NAO_COMMUNITY_N943",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_10_NAO_COMMUNITY_K942",
        "name": "MICROPLAN_MO_03_07_02_10_NAO_COMMUNITY_K942",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_09_NAO_COMMUNITY_G941",
        "name": "MICROPLAN_MO_03_07_02_09_NAO_COMMUNITY_G941",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_08_NAO_COMMUNITY_E940",
        "name": "MICROPLAN_MO_03_07_02_08_NAO_COMMUNITY_E940",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_07_NAO_COMMUNITY_M939",
        "name": "MICROPLAN_MO_03_07_02_07_NAO_COMMUNITY_M939",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_06_NAO_COMMUNITY_Z938",
        "name": "MICROPLAN_MO_03_07_02_06_NAO_COMMUNITY_Z938",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_05_NAO_COMMUNITY_K937",
        "name": "MICROPLAN_MO_03_07_02_05_NAO_COMMUNITY_K937",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_04_NAO_COMMUNITY_G936",
        "name": "MICROPLAN_MO_03_07_02_04_NAO_COMMUNITY_G936",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_03_NAO_COMMUNITY_B935",
        "name": "MICROPLAN_MO_03_07_02_03_NAO_COMMUNITY_B935",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_02_NAO_COMMUNITY",
        "name": "MICROPLAN_MO_03_07_02_02_NAO_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_02_01__77",
        "name": "MICROPLAN_MO_03_07_02_01__77",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_07_01__76",
        "name": "MICROPLAN_MO_03_07_01__76",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_03_06_03_16_KARLOWLEH_POLO",
        "name": "MICROPLAN_MO_03_06_03_16_KARLOWLEH_POLO",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_15_KARLOWLEH_JARWL929",
        "name": "MICROPLAN_MO_03_06_03_15_KARLOWLEH_JARWL929",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_14_KARLOWLEH_WREGB928",
        "name": "MICROPLAN_MO_03_06_03_14_KARLOWLEH_WREGB928",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_13_KARLOWLEH_JOHN_927",
        "name": "MICROPLAN_MO_03_06_03_13_KARLOWLEH_JOHN_927",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_12_KARLOWLEH_DUO_T926",
        "name": "MICROPLAN_MO_03_06_03_12_KARLOWLEH_DUO_T926",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_11_KARLOWLEH_KARLO925",
        "name": "MICROPLAN_MO_03_06_03_11_KARLOWLEH_KARLO925",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_10_KARLOWLEH",
        "name": "MICROPLAN_MO_03_06_03_10_KARLOWLEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_09_PENNOKON_TOWN_F923",
        "name": "MICROPLAN_MO_03_06_03_09_PENNOKON_TOWN_F923",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_08_PENNOKON_TOWN_G922",
        "name": "MICROPLAN_MO_03_06_03_08_PENNOKON_TOWN_G922",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_07_PENNOKON_TOWN_B921",
        "name": "MICROPLAN_MO_03_06_03_07_PENNOKON_TOWN_B921",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_06_PENNOKON_TOWN_P920",
        "name": "MICROPLAN_MO_03_06_03_06_PENNOKON_TOWN_P920",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_05_PENNOKON_TOWN_P919",
        "name": "MICROPLAN_MO_03_06_03_05_PENNOKON_TOWN_P919",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_04_PENNOKON_TOWN_G918",
        "name": "MICROPLAN_MO_03_06_03_04_PENNOKON_TOWN_G918",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_03_PENNOKON_TOWN_P917",
        "name": "MICROPLAN_MO_03_06_03_03_PENNOKON_TOWN_P917",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_02_PENNOKON_TOWN",
        "name": "MICROPLAN_MO_03_06_03_02_PENNOKON_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_03_01__75",
        "name": "MICROPLAN_MO_03_06_03_01__75",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_03_PENNOKON",
        "isRoot": false,
        "includeAllChildren": true
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
        "code": "MICROPLAN_MO_03_06_02_19_WHITEMAN_CAMP_G913",
        "name": "MICROPLAN_MO_03_06_02_19_WHITEMAN_CAMP_G913",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_18_WHITEMAN_CAMP_C912",
        "name": "MICROPLAN_MO_03_06_02_18_WHITEMAN_CAMP_C912",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_17_WHITEMAN_CAMP_A911",
        "name": "MICROPLAN_MO_03_06_02_17_WHITEMAN_CAMP_A911",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_16_WHITEMAN_CAMP_W910",
        "name": "MICROPLAN_MO_03_06_02_16_WHITEMAN_CAMP_W910",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_15_WHITEMAN_CAMP_T909",
        "name": "MICROPLAN_MO_03_06_02_15_WHITEMAN_CAMP_T909",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_14_WHITEMAN_CAMP_J908",
        "name": "MICROPLAN_MO_03_06_02_14_WHITEMAN_CAMP_J908",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_13_WHITEMAN_CAMP_S907",
        "name": "MICROPLAN_MO_03_06_02_13_WHITEMAN_CAMP_S907",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_12_WHITEMAN_CAMP_W906",
        "name": "MICROPLAN_MO_03_06_02_12_WHITEMAN_CAMP_W906",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_11_WHITEMAN_CAMP_D905",
        "name": "MICROPLAN_MO_03_06_02_11_WHITEMAN_CAMP_D905",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_10_WHITEMAN_CAMP_C904",
        "name": "MICROPLAN_MO_03_06_02_10_WHITEMAN_CAMP_C904",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_09_WHITEMAN_CAMP",
        "name": "MICROPLAN_MO_03_06_02_09_WHITEMAN_CAMP",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_08_JARWODEE_TOWN_Z902",
        "name": "MICROPLAN_MO_03_06_02_08_JARWODEE_TOWN_Z902",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_07_JARWODEE_TOWN_T901",
        "name": "MICROPLAN_MO_03_06_02_07_JARWODEE_TOWN_T901",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_06_JARWODEE_TOWN_N900",
        "name": "MICROPLAN_MO_03_06_02_06_JARWODEE_TOWN_N900",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_05_JARWODEE_TOWN_S899",
        "name": "MICROPLAN_MO_03_06_02_05_JARWODEE_TOWN_S899",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_04_JARWODEE_TOWN_K898",
        "name": "MICROPLAN_MO_03_06_02_04_JARWODEE_TOWN_K898",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_03_JARWODEE_TOWN_J897",
        "name": "MICROPLAN_MO_03_06_02_03_JARWODEE_TOWN_J897",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_02_JARWODEE_TOWN",
        "name": "MICROPLAN_MO_03_06_02_02_JARWODEE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_02_01__74",
        "name": "MICROPLAN_MO_03_06_02_01__74",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_06_02_JARWODEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_06_01__73",
        "name": "MICROPLAN_MO_03_06_01__73",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_PUTU",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_03_05_03_19_WULU_TOWN_TUGLO892",
        "name": "MICROPLAN_MO_03_05_03_19_WULU_TOWN_TUGLO892",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_18_WULU_TOWN_WULU_891",
        "name": "MICROPLAN_MO_03_05_03_18_WULU_TOWN_WULU_891",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_17_WULU_TOWN",
        "name": "MICROPLAN_MO_03_05_03_17_WULU_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_16_KOTOMIE_KONOBO_889",
        "name": "MICROPLAN_MO_03_05_03_16_KOTOMIE_KONOBO_889",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_15_KOTOMIE_CHEA_VI888",
        "name": "MICROPLAN_MO_03_05_03_15_KOTOMIE_CHEA_VI888",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_14_KOTOMIE_KOTOMIE",
        "name": "MICROPLAN_MO_03_05_03_14_KOTOMIE_KOTOMIE",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_13_KOTOMIE",
        "name": "MICROPLAN_MO_03_05_03_13_KOTOMIE",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_12_BOUNDARY_2_DELA885",
        "name": "MICROPLAN_MO_03_05_03_12_BOUNDARY_2_DELA885",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_11_BOUNDARY_2_BROW884",
        "name": "MICROPLAN_MO_03_05_03_11_BOUNDARY_2_BROW884",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_10_BOUNDARY_2_PETE883",
        "name": "MICROPLAN_MO_03_05_03_10_BOUNDARY_2_PETE883",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_09_BOUNDARY_2_YENN882",
        "name": "MICROPLAN_MO_03_05_03_09_BOUNDARY_2_YENN882",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_08_BOUNDARY_2_TORH881",
        "name": "MICROPLAN_MO_03_05_03_08_BOUNDARY_2_TORH881",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_07_BOUNDARY_2_DWEH880",
        "name": "MICROPLAN_MO_03_05_03_07_BOUNDARY_2_DWEH880",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_06_BOUNDARY_2_GARY879",
        "name": "MICROPLAN_MO_03_05_03_06_BOUNDARY_2_GARY879",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_05_BOUNDARY_2_YALL878",
        "name": "MICROPLAN_MO_03_05_03_05_BOUNDARY_2_YALL878",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_04_BOUNDARY_2_SINN877",
        "name": "MICROPLAN_MO_03_05_03_04_BOUNDARY_2_SINN877",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_03_BOUNDARY_2_BOUN876",
        "name": "MICROPLAN_MO_03_05_03_03_BOUNDARY_2_BOUN876",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_02_BOUNDARY_2_BOUN875",
        "name": "MICROPLAN_MO_03_05_03_02_BOUNDARY_2_BOUN875",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_03_01_BOUNDARY_2",
        "name": "MICROPLAN_MO_03_05_03_01_BOUNDARY_2",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_03_BOUNDARY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "name": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_05_KONOBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_05_02_55_AMERICA_TOWN_TW873",
        "name": "MICROPLAN_MO_03_05_02_55_AMERICA_TOWN_TW873",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_54_AMERICA_TOWN_NY872",
        "name": "MICROPLAN_MO_03_05_02_54_AMERICA_TOWN_NY872",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_53_AMERICA_TOWN_JA871",
        "name": "MICROPLAN_MO_03_05_02_53_AMERICA_TOWN_JA871",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_52_AMERICA_TOWN_AM870",
        "name": "MICROPLAN_MO_03_05_02_52_AMERICA_TOWN_AM870",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_51_AMERICA_TOWN",
        "name": "MICROPLAN_MO_03_05_02_51_AMERICA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_50_BARLIKEN_TOWN_B868",
        "name": "MICROPLAN_MO_03_05_02_50_BARLIKEN_TOWN_B868",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_49_BARLIKEN_TOWN",
        "name": "MICROPLAN_MO_03_05_02_49_BARLIKEN_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_48_HEADQUARTER_CVI866",
        "name": "MICROPLAN_MO_03_05_02_48_HEADQUARTER_CVI866",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_47_HEADQUARTER_CVI865",
        "name": "MICROPLAN_MO_03_05_02_47_HEADQUARTER_CVI865",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_46_HEADQUARTER_CVI864",
        "name": "MICROPLAN_MO_03_05_02_46_HEADQUARTER_CVI864",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_45_HEADQUARTER_CVI863",
        "name": "MICROPLAN_MO_03_05_02_45_HEADQUARTER_CVI863",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_44_NEW_CREEK_TOWN_862",
        "name": "MICROPLAN_MO_03_05_02_44_NEW_CREEK_TOWN_862",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_43_NEW_CREEK_TOWN_861",
        "name": "MICROPLAN_MO_03_05_02_43_NEW_CREEK_TOWN_861",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_42_NEW_CREEK_TOWN_860",
        "name": "MICROPLAN_MO_03_05_02_42_NEW_CREEK_TOWN_860",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_41_NEW_CREEK_TOWN",
        "name": "MICROPLAN_MO_03_05_02_41_NEW_CREEK_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_40_KOA_TOWN_ZD_CAM858",
        "name": "MICROPLAN_MO_03_05_02_40_KOA_TOWN_ZD_CAM858",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_39_KOA_TOWN_PA_MOO857",
        "name": "MICROPLAN_MO_03_05_02_39_KOA_TOWN_PA_MOO857",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_38_KOA_TOWN_GLAY_T856",
        "name": "MICROPLAN_MO_03_05_02_38_KOA_TOWN_GLAY_T856",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_37_KOA_TOWN_ZARR_T855",
        "name": "MICROPLAN_MO_03_05_02_37_KOA_TOWN_ZARR_T855",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_36_KOA_TOWN_KOA_TO854",
        "name": "MICROPLAN_MO_03_05_02_36_KOA_TOWN_KOA_TO854",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_35_KOA_TOWN",
        "name": "MICROPLAN_MO_03_05_02_35_KOA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_34_TARLOKEN_TEMPO",
        "name": "MICROPLAN_MO_03_05_02_34_TARLOKEN_TEMPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_33_TARLOKEN_GARLEO",
        "name": "MICROPLAN_MO_03_05_02_33_TARLOKEN_GARLEO",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_32_TARLOKEN_YEOH_T850",
        "name": "MICROPLAN_MO_03_05_02_32_TARLOKEN_YEOH_T850",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_31_TARLOKEN_CLOTEL849",
        "name": "MICROPLAN_MO_03_05_02_31_TARLOKEN_CLOTEL849",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_30_TARLOKEN_BAO_TO848",
        "name": "MICROPLAN_MO_03_05_02_30_TARLOKEN_BAO_TO848",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_29_TARLOKEN_TARLOK847",
        "name": "MICROPLAN_MO_03_05_02_29_TARLOKEN_TARLOK847",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_28_TARLOKEN",
        "name": "MICROPLAN_MO_03_05_02_28_TARLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_27_BILLIBO_TOWN_TW845",
        "name": "MICROPLAN_MO_03_05_02_27_BILLIBO_TOWN_TW845",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_26_BILLIBO_TOWN_TW844",
        "name": "MICROPLAN_MO_03_05_02_26_BILLIBO_TOWN_TW844",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_25_BILLIBO_TOWN_BI843",
        "name": "MICROPLAN_MO_03_05_02_25_BILLIBO_TOWN_BI843",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_24_BILLIBO_TOWN",
        "name": "MICROPLAN_MO_03_05_02_24_BILLIBO_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_23_BARWU_TOWN_FLAH841",
        "name": "MICROPLAN_MO_03_05_02_23_BARWU_TOWN_FLAH841",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_22_BARWU_TOWN_GBAR840",
        "name": "MICROPLAN_MO_03_05_02_22_BARWU_TOWN_GBAR840",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_21_BARWU_TOWN_DRUW839",
        "name": "MICROPLAN_MO_03_05_02_21_BARWU_TOWN_DRUW839",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_20_BARWU_TOWN_PEAH",
        "name": "MICROPLAN_MO_03_05_02_20_BARWU_TOWN_PEAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_19_BARWU_TOWN_GARG837",
        "name": "MICROPLAN_MO_03_05_02_19_BARWU_TOWN_GARG837",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_18_BARWU_TOWN_BARW836",
        "name": "MICROPLAN_MO_03_05_02_18_BARWU_TOWN_BARW836",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_17_BARWU_TOWN",
        "name": "MICROPLAN_MO_03_05_02_17_BARWU_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_16_DWEH_TOWN_GLAYG834",
        "name": "MICROPLAN_MO_03_05_02_16_DWEH_TOWN_GLAYG834",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_15_DWEH_TOWN_BUWAY",
        "name": "MICROPLAN_MO_03_05_02_15_DWEH_TOWN_BUWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_14_DWEH_TOWN_WHYBO",
        "name": "MICROPLAN_MO_03_05_02_14_DWEH_TOWN_WHYBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_13_DWEH_TOWN_DELAY831",
        "name": "MICROPLAN_MO_03_05_02_13_DWEH_TOWN_DELAY831",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_12_DWEH_TOWN_DROUG830",
        "name": "MICROPLAN_MO_03_05_02_12_DWEH_TOWN_DROUG830",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_11_DWEH_TOWN_DEHJA829",
        "name": "MICROPLAN_MO_03_05_02_11_DWEH_TOWN_DEHJA829",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_10_DWEH_TOWN_WLABO",
        "name": "MICROPLAN_MO_03_05_02_10_DWEH_TOWN_WLABO",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_09_DWEH_TOWN_BANGL827",
        "name": "MICROPLAN_MO_03_05_02_09_DWEH_TOWN_BANGL827",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_08_DWEH_TOWN_DOWAH826",
        "name": "MICROPLAN_MO_03_05_02_08_DWEH_TOWN_DOWAH826",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_07_DWEH_TOWN_QUAYE825",
        "name": "MICROPLAN_MO_03_05_02_07_DWEH_TOWN_QUAYE825",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_06_DWEH_TOWN_JUWAR824",
        "name": "MICROPLAN_MO_03_05_02_06_DWEH_TOWN_JUWAR824",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_05_DWEH_TOWN_DWEH_823",
        "name": "MICROPLAN_MO_03_05_02_05_DWEH_TOWN_DWEH_823",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_04_DWEH_TOWN",
        "name": "MICROPLAN_MO_03_05_02_04_DWEH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_03_ZIAH_TOWN_ZIAH_821",
        "name": "MICROPLAN_MO_03_05_02_03_ZIAH_TOWN_ZIAH_821",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_02_ZIAH_TOWN",
        "name": "MICROPLAN_MO_03_05_02_02_ZIAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_02_01__72",
        "name": "MICROPLAN_MO_03_05_02_01__72",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_05_02_KONOBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_05_01__71",
        "name": "MICROPLAN_MO_03_05_01__71",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_05_KONOBO",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_03_04_04_15_DARLUE_VILLAGE",
        "name": "MICROPLAN_MO_03_04_04_15_DARLUE_VILLAGE",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_14_GBOE_GEEWON_ABE815",
        "name": "MICROPLAN_MO_03_04_04_14_GBOE_GEEWON_ABE815",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_13_GBOE_GEEWON_LAW814",
        "name": "MICROPLAN_MO_03_04_04_13_GBOE_GEEWON_LAW814",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_12_GBOE_GEEWON_GBA813",
        "name": "MICROPLAN_MO_03_04_04_12_GBOE_GEEWON_GBA813",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_11_GBOE_GEEWON_JER812",
        "name": "MICROPLAN_MO_03_04_04_11_GBOE_GEEWON_JER812",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_10_GBOE_GEEWON_PAN811",
        "name": "MICROPLAN_MO_03_04_04_10_GBOE_GEEWON_PAN811",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_09_GBOE_GEEWON_ZAR810",
        "name": "MICROPLAN_MO_03_04_04_09_GBOE_GEEWON_ZAR810",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_08_GBOE_GEEWON_MAD809",
        "name": "MICROPLAN_MO_03_04_04_08_GBOE_GEEWON_MAD809",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_07_GBOE_GEEWON_ZAM808",
        "name": "MICROPLAN_MO_03_04_04_07_GBOE_GEEWON_ZAM808",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_06_GBOE_GEEWON_CHA807",
        "name": "MICROPLAN_MO_03_04_04_06_GBOE_GEEWON_CHA807",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_05_GBOE_GEEWON_ZEA806",
        "name": "MICROPLAN_MO_03_04_04_05_GBOE_GEEWON_ZEA806",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_04_GBOE_GEEWON_ZEA805",
        "name": "MICROPLAN_MO_03_04_04_04_GBOE_GEEWON_ZEA805",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_03_GBOE_GEEWON_GBO804",
        "name": "MICROPLAN_MO_03_04_04_03_GBOE_GEEWON_GBO804",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_02_GBOE_GEEWON",
        "name": "MICROPLAN_MO_03_04_04_02_GBOE_GEEWON",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_04_01__70",
        "name": "MICROPLAN_MO_03_04_04_01__70",
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
        "code": "MICROPLAN_MO_03_04_03_08_GBARZON_POLAR_S800",
        "name": "MICROPLAN_MO_03_04_03_08_GBARZON_POLAR_S800",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_07_GBARZON_POLAR_J799",
        "name": "MICROPLAN_MO_03_04_03_07_GBARZON_POLAR_J799",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_06_GBARZON_POLAR_K798",
        "name": "MICROPLAN_MO_03_04_03_06_GBARZON_POLAR_K798",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_05_GBARZON_POLAR_Z797",
        "name": "MICROPLAN_MO_03_04_03_05_GBARZON_POLAR_Z797",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_04_GBARZON_POLAR_C796",
        "name": "MICROPLAN_MO_03_04_03_04_GBARZON_POLAR_C796",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_03_GBARZON_POLAR_G795",
        "name": "MICROPLAN_MO_03_04_03_03_GBARZON_POLAR_G795",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_02_GBARZON_POLAR",
        "name": "MICROPLAN_MO_03_04_03_02_GBARZON_POLAR",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_03_01__69",
        "name": "MICROPLAN_MO_03_04_03_01__69",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_03_POLAR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "name": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_04_GBAO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_04_02_26_GBARZON_JARWODE792",
        "name": "MICROPLAN_MO_03_04_02_26_GBARZON_JARWODE792",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_25_GBARZON_JARWODE791",
        "name": "MICROPLAN_MO_03_04_02_25_GBARZON_JARWODE791",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_24_GBARZON_JARWODE790",
        "name": "MICROPLAN_MO_03_04_02_24_GBARZON_JARWODE790",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_23_GBARZON_JARWODE789",
        "name": "MICROPLAN_MO_03_04_02_23_GBARZON_JARWODE789",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_22_GBARZON_JARWODE788",
        "name": "MICROPLAN_MO_03_04_02_22_GBARZON_JARWODE788",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_21_GBARZON_JARWODE787",
        "name": "MICROPLAN_MO_03_04_02_21_GBARZON_JARWODE787",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_20_GBARZON_JARWODE786",
        "name": "MICROPLAN_MO_03_04_02_20_GBARZON_JARWODE786",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_19_GBARZON_JARWODE785",
        "name": "MICROPLAN_MO_03_04_02_19_GBARZON_JARWODE785",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_18_GBARZON_JARWODE784",
        "name": "MICROPLAN_MO_03_04_02_18_GBARZON_JARWODE784",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_17_GBARZON_JARWODE783",
        "name": "MICROPLAN_MO_03_04_02_17_GBARZON_JARWODE783",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_16_GBARZON_JARWODE782",
        "name": "MICROPLAN_MO_03_04_02_16_GBARZON_JARWODE782",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_15_GBARZON_TOWN_SA781",
        "name": "MICROPLAN_MO_03_04_02_15_GBARZON_TOWN_SA781",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_14_GBARZON_TOWN_KO780",
        "name": "MICROPLAN_MO_03_04_02_14_GBARZON_TOWN_KO780",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_13_GBARZON_TOWN_GO779",
        "name": "MICROPLAN_MO_03_04_02_13_GBARZON_TOWN_GO779",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_12_GBARZON_TOWN_GB778",
        "name": "MICROPLAN_MO_03_04_02_12_GBARZON_TOWN_GB778",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_11_GBARZON_TOWN",
        "name": "MICROPLAN_MO_03_04_02_11_GBARZON_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_10_ZLEH_TOWN_PARBO776",
        "name": "MICROPLAN_MO_03_04_02_10_ZLEH_TOWN_PARBO776",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_09_ZLEH_TOWN_VENEN775",
        "name": "MICROPLAN_MO_03_04_02_09_ZLEH_TOWN_VENEN775",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_08_ZLEH_TOWN_WULOT774",
        "name": "MICROPLAN_MO_03_04_02_08_ZLEH_TOWN_WULOT774",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_07_ZLEH_TOWN_POUH_773",
        "name": "MICROPLAN_MO_03_04_02_07_ZLEH_TOWN_POUH_773",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_06_ZLEH_TOWN_TOWAH772",
        "name": "MICROPLAN_MO_03_04_02_06_ZLEH_TOWN_TOWAH772",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_05_ZLEH_TOWN_GAYE_771",
        "name": "MICROPLAN_MO_03_04_02_05_ZLEH_TOWN_GAYE_771",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_04_ZLEH_TOWN_GBAYE770",
        "name": "MICROPLAN_MO_03_04_02_04_ZLEH_TOWN_GBAYE770",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_03_ZLEH_TOWN_ZLEH_769",
        "name": "MICROPLAN_MO_03_04_02_03_ZLEH_TOWN_ZLEH_769",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_02_ZLEH_TOWN",
        "name": "MICROPLAN_MO_03_04_02_02_ZLEH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_02_01__68",
        "name": "MICROPLAN_MO_03_04_02_01__68",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_04_02_GBARZON_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_04_01__67",
        "name": "MICROPLAN_MO_03_04_01__67",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_04_GBAO",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_03_03_07_16_GBOLEKEN_TOWN_D764",
        "name": "MICROPLAN_MO_03_03_07_16_GBOLEKEN_TOWN_D764",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_15_GBOLEKEN_TOWN_F763",
        "name": "MICROPLAN_MO_03_03_07_15_GBOLEKEN_TOWN_F763",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_14_GBOLEKEN_TOWN_G762",
        "name": "MICROPLAN_MO_03_03_07_14_GBOLEKEN_TOWN_G762",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_13_GBOLEKEN_TOWN_Z761",
        "name": "MICROPLAN_MO_03_03_07_13_GBOLEKEN_TOWN_Z761",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_12_GBOLEKEN_TOWN_D760",
        "name": "MICROPLAN_MO_03_03_07_12_GBOLEKEN_TOWN_D760",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_11_GBOLEKEN_TOWN_W759",
        "name": "MICROPLAN_MO_03_03_07_11_GBOLEKEN_TOWN_W759",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_10_GBOLEKEN_TOWN_J758",
        "name": "MICROPLAN_MO_03_03_07_10_GBOLEKEN_TOWN_J758",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_09_GBOLEKEN_TOWN_Z757",
        "name": "MICROPLAN_MO_03_03_07_09_GBOLEKEN_TOWN_Z757",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_08_GBOLEKEN_TOWN_S756",
        "name": "MICROPLAN_MO_03_03_07_08_GBOLEKEN_TOWN_S756",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_07_GBOLEKEN_TOWN_S755",
        "name": "MICROPLAN_MO_03_03_07_07_GBOLEKEN_TOWN_S755",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_06_GBOLEKEN_TOWN_D754",
        "name": "MICROPLAN_MO_03_03_07_06_GBOLEKEN_TOWN_D754",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_05_GBOLEKEN_TOWN_G753",
        "name": "MICROPLAN_MO_03_03_07_05_GBOLEKEN_TOWN_G753",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_04_GBOLEKEN_TOWN_G752",
        "name": "MICROPLAN_MO_03_03_07_04_GBOLEKEN_TOWN_G752",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_03_GBOLEKEN_TOWN_G751",
        "name": "MICROPLAN_MO_03_03_07_03_GBOLEKEN_TOWN_G751",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_02_GBOLEKEN_TOWN",
        "name": "MICROPLAN_MO_03_03_07_02_GBOLEKEN_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_07_01__66",
        "name": "MICROPLAN_MO_03_03_07_01__66",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_07_GBOLEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "name": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_06_16_ZAI_TOWN_PERER_748",
        "name": "MICROPLAN_MO_03_03_06_16_ZAI_TOWN_PERER_748",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_15_ZAI_TOWN_KANGBE747",
        "name": "MICROPLAN_MO_03_03_06_15_ZAI_TOWN_KANGBE747",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_14_ZAI_TOWN_ESTHER746",
        "name": "MICROPLAN_MO_03_03_06_14_ZAI_TOWN_ESTHER746",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_13_ZAI_TOWN_TARLUE745",
        "name": "MICROPLAN_MO_03_03_06_13_ZAI_TOWN_TARLUE745",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_12_ZAI_TOWN_FLAHN_744",
        "name": "MICROPLAN_MO_03_03_06_12_ZAI_TOWN_FLAHN_744",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_11_ZAI_TOWN_QUIAH_743",
        "name": "MICROPLAN_MO_03_03_06_11_ZAI_TOWN_QUIAH_743",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_10_ZAI_TOWN_KOHU_V742",
        "name": "MICROPLAN_MO_03_03_06_10_ZAI_TOWN_KOHU_V742",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_09_ZAI_TOWN_ONE_MA741",
        "name": "MICROPLAN_MO_03_03_06_09_ZAI_TOWN_ONE_MA741",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_08_ZAI_TOWN_KOON_V740",
        "name": "MICROPLAN_MO_03_03_06_08_ZAI_TOWN_KOON_V740",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_07_ZAI_TOWN_SOWAKE739",
        "name": "MICROPLAN_MO_03_03_06_07_ZAI_TOWN_SOWAKE739",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_06_ZAI_TOWN_BASSA_738",
        "name": "MICROPLAN_MO_03_03_06_06_ZAI_TOWN_BASSA_738",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_05_ZAI_TOWN_GWEIN_737",
        "name": "MICROPLAN_MO_03_03_06_05_ZAI_TOWN_GWEIN_737",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_04_ZAI_TOWN_BARTEH736",
        "name": "MICROPLAN_MO_03_03_06_04_ZAI_TOWN_BARTEH736",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_03_ZAI_TOWN_ZAI_TO735",
        "name": "MICROPLAN_MO_03_03_06_03_ZAI_TOWN_ZAI_TO735",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_02_ZAI_TOWN",
        "name": "MICROPLAN_MO_03_03_06_02_ZAI_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_06_01__65",
        "name": "MICROPLAN_MO_03_03_06_01__65",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_06_ZAI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "name": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_05_11_TUZON_TOWN_DOEB732",
        "name": "MICROPLAN_MO_03_03_05_11_TUZON_TOWN_DOEB732",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_10_TUZON_TOWN_BIG_731",
        "name": "MICROPLAN_MO_03_03_05_10_TUZON_TOWN_BIG_731",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_09_TUZON_TOWN_GOLY730",
        "name": "MICROPLAN_MO_03_03_05_09_TUZON_TOWN_GOLY730",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_08_TUZON_TOWN_JALO729",
        "name": "MICROPLAN_MO_03_03_05_08_TUZON_TOWN_JALO729",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_07_TUZON_TOWN_CHEA728",
        "name": "MICROPLAN_MO_03_03_05_07_TUZON_TOWN_CHEA728",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_06_TUZON_TOWN_CHEA727",
        "name": "MICROPLAN_MO_03_03_05_06_TUZON_TOWN_CHEA727",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_05_TUZON_TOWN_KAHN726",
        "name": "MICROPLAN_MO_03_03_05_05_TUZON_TOWN_KAHN726",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_04_TUZON_TOWN_SOLO725",
        "name": "MICROPLAN_MO_03_03_05_04_TUZON_TOWN_SOLO725",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_03_TUZON_TOWN_TUZO724",
        "name": "MICROPLAN_MO_03_03_05_03_TUZON_TOWN_TUZO724",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_02_TUZON_TOWN",
        "name": "MICROPLAN_MO_03_03_05_02_TUZON_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_05_01__64",
        "name": "MICROPLAN_MO_03_03_05_01__64",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_05_TUZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "name": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_04_16_JANZON_TOWN_GOA721",
        "name": "MICROPLAN_MO_03_03_04_16_JANZON_TOWN_GOA721",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_15_JANZON_TOWN_KAH720",
        "name": "MICROPLAN_MO_03_03_04_15_JANZON_TOWN_KAH720",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_14_JANZON_TOWN_SOL719",
        "name": "MICROPLAN_MO_03_03_04_14_JANZON_TOWN_SOL719",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_13_JANZON_TOWN_DUB718",
        "name": "MICROPLAN_MO_03_03_04_13_JANZON_TOWN_DUB718",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_12_JANZON_TOWN_GLA717",
        "name": "MICROPLAN_MO_03_03_04_12_JANZON_TOWN_GLA717",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_11_JANZON_TOWN_BAN716",
        "name": "MICROPLAN_MO_03_03_04_11_JANZON_TOWN_BAN716",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_10_JANZON_TOWN_BOE715",
        "name": "MICROPLAN_MO_03_03_04_10_JANZON_TOWN_BOE715",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_09_JANZON_TOWN_OLD714",
        "name": "MICROPLAN_MO_03_03_04_09_JANZON_TOWN_OLD714",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_08_JANZON_TOWN_NEW713",
        "name": "MICROPLAN_MO_03_03_04_08_JANZON_TOWN_NEW713",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_07_JANZON_TOWN_BAY712",
        "name": "MICROPLAN_MO_03_03_04_07_JANZON_TOWN_BAY712",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_06_JANZON_TOWN_JAN711",
        "name": "MICROPLAN_MO_03_03_04_06_JANZON_TOWN_JAN711",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_05_JANZON_TOWN_BAN710",
        "name": "MICROPLAN_MO_03_03_04_05_JANZON_TOWN_BAN710",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_04_JANZON_TOWN_BRO709",
        "name": "MICROPLAN_MO_03_03_04_04_JANZON_TOWN_BRO709",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_03_JANZON_TOWN_DIA708",
        "name": "MICROPLAN_MO_03_03_04_03_JANZON_TOWN_DIA708",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_02_JANZON_TOWN",
        "name": "MICROPLAN_MO_03_03_04_02_JANZON_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_04_01__63",
        "name": "MICROPLAN_MO_03_03_04_01__63",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_04_JANZON_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "name": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_03_22_BEH_TOWN_GRADY_705",
        "name": "MICROPLAN_MO_03_03_03_22_BEH_TOWN_GRADY_705",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_21_BEH_TOWN_VLEGEE704",
        "name": "MICROPLAN_MO_03_03_03_21_BEH_TOWN_VLEGEE704",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_20_BEH_TOWN_GEYAH_703",
        "name": "MICROPLAN_MO_03_03_03_20_BEH_TOWN_GEYAH_703",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_19_BEH_TOWN_MIDDLE702",
        "name": "MICROPLAN_MO_03_03_03_19_BEH_TOWN_MIDDLE702",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_18_BEH_TOWN_DEBOR_701",
        "name": "MICROPLAN_MO_03_03_03_18_BEH_TOWN_DEBOR_701",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_17_BEH_TOWN_KPOWEI700",
        "name": "MICROPLAN_MO_03_03_03_17_BEH_TOWN_KPOWEI700",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_16_BEH_TOWN_TOGBAL699",
        "name": "MICROPLAN_MO_03_03_03_16_BEH_TOWN_TOGBAL699",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_15_BEH_TOWN_BODUO_698",
        "name": "MICROPLAN_MO_03_03_03_15_BEH_TOWN_BODUO_698",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_14_BEH_TOWN_BEH_TO697",
        "name": "MICROPLAN_MO_03_03_03_14_BEH_TOWN_BEH_TO697",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_13_BEH_TOWN_SINKON696",
        "name": "MICROPLAN_MO_03_03_03_13_BEH_TOWN_SINKON696",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_12_BEH_TOWN_WLUBOR695",
        "name": "MICROPLAN_MO_03_03_03_12_BEH_TOWN_WLUBOR695",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_11_BEH_TOWN_SAYDEE694",
        "name": "MICROPLAN_MO_03_03_03_11_BEH_TOWN_SAYDEE694",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_10_BEH_TOWN_GLOKPA693",
        "name": "MICROPLAN_MO_03_03_03_10_BEH_TOWN_GLOKPA693",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_09_BEH_TOWN_BASSA_692",
        "name": "MICROPLAN_MO_03_03_03_09_BEH_TOWN_BASSA_692",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_08_BEH_TOWN_JULUTU691",
        "name": "MICROPLAN_MO_03_03_03_08_BEH_TOWN_JULUTU691",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_07_BEH_TOWN_JULUTU690",
        "name": "MICROPLAN_MO_03_03_03_07_BEH_TOWN_JULUTU690",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_06_BEH_TOWN_KPAI_T689",
        "name": "MICROPLAN_MO_03_03_03_06_BEH_TOWN_KPAI_T689",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_05_BEH_TOWN_GLEPLA688",
        "name": "MICROPLAN_MO_03_03_03_05_BEH_TOWN_GLEPLA688",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_04_BEH_TOWN_COMPOU687",
        "name": "MICROPLAN_MO_03_03_03_04_BEH_TOWN_COMPOU687",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_03_BEH_TOWN_ZAZA_V686",
        "name": "MICROPLAN_MO_03_03_03_03_BEH_TOWN_ZAZA_V686",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_02_BEH_TOWN",
        "name": "MICROPLAN_MO_03_03_03_02_BEH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_03_01__62",
        "name": "MICROPLAN_MO_03_03_03_01__62",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_03_BEH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "name": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_02_28_PENUNEWEN_BAYE_683",
        "name": "MICROPLAN_MO_03_03_02_28_PENUNEWEN_BAYE_683",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_27_PENUNEWEN_YOUGE682",
        "name": "MICROPLAN_MO_03_03_02_27_PENUNEWEN_YOUGE682",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_26_PENUNEWEN_PENUN681",
        "name": "MICROPLAN_MO_03_03_02_26_PENUNEWEN_PENUN681",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_25_PENUNEWEN_VORWB680",
        "name": "MICROPLAN_MO_03_03_02_25_PENUNEWEN_VORWB680",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_24_PENUNEWEN_JAYOR679",
        "name": "MICROPLAN_MO_03_03_02_24_PENUNEWEN_JAYOR679",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_23_PENUNEWEN",
        "name": "MICROPLAN_MO_03_03_02_23_PENUNEWEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_22_BARGBLOR_TOWN_T677",
        "name": "MICROPLAN_MO_03_03_02_22_BARGBLOR_TOWN_T677",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_21_BARGBLOR_TOWN_N676",
        "name": "MICROPLAN_MO_03_03_02_21_BARGBLOR_TOWN_N676",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_20_BARGBLOR_TOWN_J675",
        "name": "MICROPLAN_MO_03_03_02_20_BARGBLOR_TOWN_J675",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_19_BARGBLOR_TOWN_G674",
        "name": "MICROPLAN_MO_03_03_02_19_BARGBLOR_TOWN_G674",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_18_BARGBLOR_TOWN_D673",
        "name": "MICROPLAN_MO_03_03_02_18_BARGBLOR_TOWN_D673",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_17_BARGBLOR_TOWN_P672",
        "name": "MICROPLAN_MO_03_03_02_17_BARGBLOR_TOWN_P672",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_16_BARGBLOR_TOWN_G671",
        "name": "MICROPLAN_MO_03_03_02_16_BARGBLOR_TOWN_G671",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_15_BARGBLOR_TOWN_C670",
        "name": "MICROPLAN_MO_03_03_02_15_BARGBLOR_TOWN_C670",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_14_BARGBLOR_TOWN_J669",
        "name": "MICROPLAN_MO_03_03_02_14_BARGBLOR_TOWN_J669",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_13_BARGBLOR_TOWN_S668",
        "name": "MICROPLAN_MO_03_03_02_13_BARGBLOR_TOWN_S668",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_12_BARGBLOR_TOWN_C667",
        "name": "MICROPLAN_MO_03_03_02_12_BARGBLOR_TOWN_C667",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_11_BARGBLOR_TOWN_B666",
        "name": "MICROPLAN_MO_03_03_02_11_BARGBLOR_TOWN_B666",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_10_BARGBLOR_TOWN_O665",
        "name": "MICROPLAN_MO_03_03_02_10_BARGBLOR_TOWN_O665",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_09_BARGBLOR_TOWN_H664",
        "name": "MICROPLAN_MO_03_03_02_09_BARGBLOR_TOWN_H664",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_08_BARGBLOR_TOWN_T663",
        "name": "MICROPLAN_MO_03_03_02_08_BARGBLOR_TOWN_T663",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_07_BARGBLOR_TOWN_T662",
        "name": "MICROPLAN_MO_03_03_02_07_BARGBLOR_TOWN_T662",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_06_BARGBLOR_TOWN_D661",
        "name": "MICROPLAN_MO_03_03_02_06_BARGBLOR_TOWN_D661",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_05_BARGBLOR_TOWN_B660",
        "name": "MICROPLAN_MO_03_03_02_05_BARGBLOR_TOWN_B660",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_04_BARGBLOR_TOWN_M659",
        "name": "MICROPLAN_MO_03_03_02_04_BARGBLOR_TOWN_M659",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_03_BARGBLOR_TOWN_Z658",
        "name": "MICROPLAN_MO_03_03_02_03_BARGBLOR_TOWN_Z658",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_02_BARGBLOR_TOWN",
        "name": "MICROPLAN_MO_03_03_02_02_BARGBLOR_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_02_01__61",
        "name": "MICROPLAN_MO_03_03_02_01__61",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_03_02_BARGBLOR_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_03_01__60",
        "name": "MICROPLAN_MO_03_03_01__60",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_03_02_05_11_GIAH_TOWN_MOSSI653",
        "name": "MICROPLAN_MO_03_02_05_11_GIAH_TOWN_MOSSI653",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_10_GIAH_TOWN_BEEKE652",
        "name": "MICROPLAN_MO_03_02_05_10_GIAH_TOWN_BEEKE652",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_09_GIAH_TOWN_GIAH_651",
        "name": "MICROPLAN_MO_03_02_05_09_GIAH_TOWN_GIAH_651",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_08_GIAH_TOWN",
        "name": "MICROPLAN_MO_03_02_05_08_GIAH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_07_B_HAI_TARWAY_TO649",
        "name": "MICROPLAN_MO_03_02_05_07_B_HAI_TARWAY_TO649",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_06_B_HAI_TARWAY_TO648",
        "name": "MICROPLAN_MO_03_02_05_06_B_HAI_TARWAY_TO648",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_05_B_HAI_TARWAY_TO647",
        "name": "MICROPLAN_MO_03_02_05_05_B_HAI_TARWAY_TO647",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_04_B_HAI_TARWAY_TO646",
        "name": "MICROPLAN_MO_03_02_05_04_B_HAI_TARWAY_TO646",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_03_B_HAI_TARWAY_TO645",
        "name": "MICROPLAN_MO_03_02_05_03_B_HAI_TARWAY_TO645",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_02_B_HAI_TARWAY_TO644",
        "name": "MICROPLAN_MO_03_02_05_02_B_HAI_TARWAY_TO644",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_05_01__59",
        "name": "MICROPLAN_MO_03_02_05_01__59",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_05_B_HAI_TARWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "name": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_04_25_NORBEH_GOLD_CAM642",
        "name": "MICROPLAN_MO_03_02_04_25_NORBEH_GOLD_CAM642",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_24_NORBEH_GOLD_CAM641",
        "name": "MICROPLAN_MO_03_02_04_24_NORBEH_GOLD_CAM641",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_23_NORBEH_GOLD_CAM640",
        "name": "MICROPLAN_MO_03_02_04_23_NORBEH_GOLD_CAM640",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_22_NORBEH_GOLD_CAM639",
        "name": "MICROPLAN_MO_03_02_04_22_NORBEH_GOLD_CAM639",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_21_NORBEH_GOLD_CAM638",
        "name": "MICROPLAN_MO_03_02_04_21_NORBEH_GOLD_CAM638",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_20_NICKO_TOWN_B_HA637",
        "name": "MICROPLAN_MO_03_02_04_20_NICKO_TOWN_B_HA637",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_19_NICKO_TOWN_NICK636",
        "name": "MICROPLAN_MO_03_02_04_19_NICKO_TOWN_NICK636",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_18_NICKO_TOWN_GOYE635",
        "name": "MICROPLAN_MO_03_02_04_18_NICKO_TOWN_GOYE635",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_17_NICKO_TOWN",
        "name": "MICROPLAN_MO_03_02_04_17_NICKO_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_16_TOE_TOWN_ALBERT633",
        "name": "MICROPLAN_MO_03_02_04_16_TOE_TOWN_ALBERT633",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_15_TOE_TOWN_LATHER632",
        "name": "MICROPLAN_MO_03_02_04_15_TOE_TOWN_LATHER632",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_14_TOE_TOWN_ZLEH_V631",
        "name": "MICROPLAN_MO_03_02_04_14_TOE_TOWN_ZLEH_V631",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_13_TOE_TOWN_JULU_V630",
        "name": "MICROPLAN_MO_03_02_04_13_TOE_TOWN_JULU_V630",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_12_TOE_TOWN_GANYAN629",
        "name": "MICROPLAN_MO_03_02_04_12_TOE_TOWN_GANYAN629",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_11_TOE_TOWN_SAYDEE628",
        "name": "MICROPLAN_MO_03_02_04_11_TOE_TOWN_SAYDEE628",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_10_TOE_TOWN_EDWARD627",
        "name": "MICROPLAN_MO_03_02_04_10_TOE_TOWN_EDWARD627",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_09_TOE_TOWN_JUNIOR626",
        "name": "MICROPLAN_MO_03_02_04_09_TOE_TOWN_JUNIOR626",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_08_TOE_TOWN_TOMMY_625",
        "name": "MICROPLAN_MO_03_02_04_08_TOE_TOWN_TOMMY_625",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_07_TOE_TOWN_QUAYEE624",
        "name": "MICROPLAN_MO_03_02_04_07_TOE_TOWN_QUAYEE624",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_06_TOE_TOWN_KPELLE623",
        "name": "MICROPLAN_MO_03_02_04_06_TOE_TOWN_KPELLE623",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_05_TOE_TOWN_JAMES_622",
        "name": "MICROPLAN_MO_03_02_04_05_TOE_TOWN_JAMES_622",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_04_TOE_TOWN_SAYEEB621",
        "name": "MICROPLAN_MO_03_02_04_04_TOE_TOWN_SAYEEB621",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_03_TOE_TOWN_TOE_TO620",
        "name": "MICROPLAN_MO_03_02_04_03_TOE_TOWN_TOE_TO620",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_02_TOE_TOWN",
        "name": "MICROPLAN_MO_03_02_04_02_TOE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_04_01__58",
        "name": "MICROPLAN_MO_03_02_04_01__58",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_04_TOE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "name": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_03_11_PLOE_JOZON_TOWN617",
        "name": "MICROPLAN_MO_03_02_03_11_PLOE_JOZON_TOWN617",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_10_PLOE_JOZON_TOWN616",
        "name": "MICROPLAN_MO_03_02_03_10_PLOE_JOZON_TOWN616",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_09_PLOE_JOZON_TOWN615",
        "name": "MICROPLAN_MO_03_02_03_09_PLOE_JOZON_TOWN615",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_08_PLOE_JOZON_TOWN614",
        "name": "MICROPLAN_MO_03_02_03_08_PLOE_JOZON_TOWN614",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_07_PLOE_JOZON_TOWN613",
        "name": "MICROPLAN_MO_03_02_03_07_PLOE_JOZON_TOWN613",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_06_PLOE_JOZON_TOWN612",
        "name": "MICROPLAN_MO_03_02_03_06_PLOE_JOZON_TOWN612",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_05_PLOE_JOZON_TOWN611",
        "name": "MICROPLAN_MO_03_02_03_05_PLOE_JOZON_TOWN611",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_04_PLOE_JOZON_TOWN610",
        "name": "MICROPLAN_MO_03_02_03_04_PLOE_JOZON_TOWN610",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_03_PLOE_JOZON_TOWN609",
        "name": "MICROPLAN_MO_03_02_03_03_PLOE_JOZON_TOWN609",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_02_PLOE_JOZON_TOWN608",
        "name": "MICROPLAN_MO_03_02_03_02_PLOE_JOZON_TOWN608",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_03_01__57",
        "name": "MICROPLAN_MO_03_02_03_01__57",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_03_DUOGEE_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "name": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_02_15_KOKO_VILLAGE_RO606",
        "name": "MICROPLAN_MO_03_02_02_15_KOKO_VILLAGE_RO606",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_14_KOKO_VILLAGE_BE605",
        "name": "MICROPLAN_MO_03_02_02_14_KOKO_VILLAGE_BE605",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_13_KOKO_VILLAGE_JA604",
        "name": "MICROPLAN_MO_03_02_02_13_KOKO_VILLAGE_JA604",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_12_KOKO_VILLAGE_GO603",
        "name": "MICROPLAN_MO_03_02_02_12_KOKO_VILLAGE_GO603",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_11_KOKO_VILLAGE_JO602",
        "name": "MICROPLAN_MO_03_02_02_11_KOKO_VILLAGE_JO602",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_10_KOKO_VILLAGE_KO601",
        "name": "MICROPLAN_MO_03_02_02_10_KOKO_VILLAGE_KO601",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_09_KOKO_VILLAGE_QU600",
        "name": "MICROPLAN_MO_03_02_02_09_KOKO_VILLAGE_QU600",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_08_KOKO_VILLAGE",
        "name": "MICROPLAN_MO_03_02_02_08_KOKO_VILLAGE",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_07_DUOGEE_TOWN_KAR598",
        "name": "MICROPLAN_MO_03_02_02_07_DUOGEE_TOWN_KAR598",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_06_DUOGEE_TOWN_SEN597",
        "name": "MICROPLAN_MO_03_02_02_06_DUOGEE_TOWN_SEN597",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_05_DUOGEE_TOWN_SHE596",
        "name": "MICROPLAN_MO_03_02_02_05_DUOGEE_TOWN_SHE596",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_04_DUOGEE_TOWN_DUO595",
        "name": "MICROPLAN_MO_03_02_02_04_DUOGEE_TOWN_DUO595",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_03_DUOGEE_TOWN_TIA594",
        "name": "MICROPLAN_MO_03_02_02_03_DUOGEE_TOWN_TIA594",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_02_DUOGEE_TOWN",
        "name": "MICROPLAN_MO_03_02_02_02_DUOGEE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_02_01__56",
        "name": "MICROPLAN_MO_03_02_02_01__56",
        "type": "Village",
        "parent": "MICROPLAN_MO_03_02_02_DOUGEE_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_03_02_01__55",
        "name": "MICROPLAN_MO_03_02_01__55",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
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
        "code": "MICROPLAN_MO_02_GRAND_KRU",
        "name": "MICROPLAN_MO_02_GRAND_KRU",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_TREHN",
        "name": "MICROPLAN_MO_02_06_TREHN",
        "type": "District",
        "parent": "MICROPLAN_MO_02_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "name": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_08_13_OLD_KARLAWAKEN_589",
        "name": "MICROPLAN_MO_02_06_08_13_OLD_KARLAWAKEN_589",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_12_OLD_KARLAWAKEN_588",
        "name": "MICROPLAN_MO_02_06_08_12_OLD_KARLAWAKEN_588",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_11_OLD_KARLAWAKEN_587",
        "name": "MICROPLAN_MO_02_06_08_11_OLD_KARLAWAKEN_587",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_10_OLD_KARLAWAKEN_586",
        "name": "MICROPLAN_MO_02_06_08_10_OLD_KARLAWAKEN_586",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_09_OLD_KARLAWAKEN_585",
        "name": "MICROPLAN_MO_02_06_08_09_OLD_KARLAWAKEN_585",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_08_OLD_KARLAWAKEN_584",
        "name": "MICROPLAN_MO_02_06_08_08_OLD_KARLAWAKEN_584",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_07_OLD_KARLAWAKEN_583",
        "name": "MICROPLAN_MO_02_06_08_07_OLD_KARLAWAKEN_583",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_06_OLD_KARLAWAKEN_582",
        "name": "MICROPLAN_MO_02_06_08_06_OLD_KARLAWAKEN_582",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_05_OLD_KARLAWAKEN_581",
        "name": "MICROPLAN_MO_02_06_08_05_OLD_KARLAWAKEN_581",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_04_OLD_KARLAWAKEN",
        "name": "MICROPLAN_MO_02_06_08_04_OLD_KARLAWAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_03_GBLEBO_TOWN_GBL579",
        "name": "MICROPLAN_MO_02_06_08_03_GBLEBO_TOWN_GBL579",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_02_GBLEBO_TOWN",
        "name": "MICROPLAN_MO_02_06_08_02_GBLEBO_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_08_01__53",
        "name": "MICROPLAN_MO_02_06_08_01__53",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_08_GBLEBO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "name": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_07_10_DOUGBO_GBARKEN",
        "name": "MICROPLAN_MO_02_06_07_10_DOUGBO_GBARKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_09_DOUGBO_GEDEBO",
        "name": "MICROPLAN_MO_02_06_07_09_DOUGBO_GEDEBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_08_DOUGBO_DOUGBO",
        "name": "MICROPLAN_MO_02_06_07_08_DOUGBO_DOUGBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_07_SORROKEN_CITY_W573",
        "name": "MICROPLAN_MO_02_06_07_07_SORROKEN_CITY_W573",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_06_SORROKEN_CITY_G572",
        "name": "MICROPLAN_MO_02_06_07_06_SORROKEN_CITY_G572",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_05_SORROKEN_CITY_S571",
        "name": "MICROPLAN_MO_02_06_07_05_SORROKEN_CITY_S571",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_04_NEWAKEN_CITY_DI570",
        "name": "MICROPLAN_MO_02_06_07_04_NEWAKEN_CITY_DI570",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_03_NEWAKEN_CITY_NE569",
        "name": "MICROPLAN_MO_02_06_07_03_NEWAKEN_CITY_NE569",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_02_NEWAKEN_CITY",
        "name": "MICROPLAN_MO_02_06_07_02_NEWAKEN_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_07_01__52",
        "name": "MICROPLAN_MO_02_06_07_01__52",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_07_NEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "name": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_06_15_KPOIKEN_KPOIKEN",
        "name": "MICROPLAN_MO_02_06_06_15_KPOIKEN_KPOIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_14_KPOIKEN_SAYWONK565",
        "name": "MICROPLAN_MO_02_06_06_14_KPOIKEN_SAYWONK565",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_13_KPOIKEN_CHANGBE564",
        "name": "MICROPLAN_MO_02_06_06_13_KPOIKEN_CHANGBE564",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_12_KPOIKEN_KULODEH",
        "name": "MICROPLAN_MO_02_06_06_12_KPOIKEN_KULODEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_11_KPOIKEN_QUENKEN",
        "name": "MICROPLAN_MO_02_06_06_11_KPOIKEN_QUENKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_10_KPOIKEN_FOLOKEN",
        "name": "MICROPLAN_MO_02_06_06_10_KPOIKEN_FOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_09_KPOIKEN",
        "name": "MICROPLAN_MO_02_06_06_09_KPOIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_08_GBONOWINE_KWEBI559",
        "name": "MICROPLAN_MO_02_06_06_08_GBONOWINE_KWEBI559",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_07_GBONOWINE_SANGB558",
        "name": "MICROPLAN_MO_02_06_06_07_GBONOWINE_SANGB558",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_06_GBONOWINE_GBONO557",
        "name": "MICROPLAN_MO_02_06_06_06_GBONOWINE_GBONO557",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_05_GBONOWINE_SAWKE556",
        "name": "MICROPLAN_MO_02_06_06_05_GBONOWINE_SAWKE556",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_04_GBONOWINE",
        "name": "MICROPLAN_MO_02_06_06_04_GBONOWINE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_03_BEHWAN_CITY_BEH554",
        "name": "MICROPLAN_MO_02_06_06_03_BEHWAN_CITY_BEH554",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_02_BEHWAN_CITY",
        "name": "MICROPLAN_MO_02_06_06_02_BEHWAN_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_06_01__51",
        "name": "MICROPLAN_MO_02_06_06_01__51",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_06_BEHWAN_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "name": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_05_07_MIDDLE_TOWN_MID551",
        "name": "MICROPLAN_MO_02_06_05_07_MIDDLE_TOWN_MID551",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_06_MIDDLE_TOWN_WED550",
        "name": "MICROPLAN_MO_02_06_05_06_MIDDLE_TOWN_WED550",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_05_MIDDLE_TOWN_WAT549",
        "name": "MICROPLAN_MO_02_06_05_05_MIDDLE_TOWN_WAT549",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_04_MIDDLE_TOWN_JLO548",
        "name": "MICROPLAN_MO_02_06_05_04_MIDDLE_TOWN_JLO548",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_03_MIDDLE_TOWN_BIG547",
        "name": "MICROPLAN_MO_02_06_05_03_MIDDLE_TOWN_BIG547",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_02_MIDDLE_TOWN",
        "name": "MICROPLAN_MO_02_06_05_02_MIDDLE_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_05_01__50",
        "name": "MICROPLAN_MO_02_06_05_01__50",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_05_NIFA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "name": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_04_19_COFFIBEE_COFFIB544",
        "name": "MICROPLAN_MO_02_06_04_19_COFFIBEE_COFFIB544",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_18_COFFIBEE_DARPLO543",
        "name": "MICROPLAN_MO_02_06_04_18_COFFIBEE_DARPLO543",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_17_COFFIBEE_NEW_GB542",
        "name": "MICROPLAN_MO_02_06_04_17_COFFIBEE_NEW_GB542",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_16_COFFIBEE_OLD_GB541",
        "name": "MICROPLAN_MO_02_06_04_16_COFFIBEE_OLD_GB541",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_15_COFFIBEE_TENDEN540",
        "name": "MICROPLAN_MO_02_06_04_15_COFFIBEE_TENDEN540",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_14_COFFIBEE",
        "name": "MICROPLAN_MO_02_06_04_14_COFFIBEE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_13_PENNUKEN_NEMIAH538",
        "name": "MICROPLAN_MO_02_06_04_13_PENNUKEN_NEMIAH538",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_12_PENNUKEN_PENNUK537",
        "name": "MICROPLAN_MO_02_06_04_12_PENNUKEN_PENNUK537",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_11_PENNUKEN_ZOLUBE536",
        "name": "MICROPLAN_MO_02_06_04_11_PENNUKEN_ZOLUBE536",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_10_PENNUKEN_GLOPLU535",
        "name": "MICROPLAN_MO_02_06_04_10_PENNUKEN_GLOPLU535",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_09_PENNUKEN_JLATIK534",
        "name": "MICROPLAN_MO_02_06_04_09_PENNUKEN_JLATIK534",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_08_PENNUKEN",
        "name": "MICROPLAN_MO_02_06_04_08_PENNUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_07_WILISONVILLE_TU532",
        "name": "MICROPLAN_MO_02_06_04_07_WILISONVILLE_TU532",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_06_WILISONVILLE_GB531",
        "name": "MICROPLAN_MO_02_06_04_06_WILISONVILLE_GB531",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_05_WILISONVILLE_SL530",
        "name": "MICROPLAN_MO_02_06_04_05_WILISONVILLE_SL530",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_04_WILISONVILLE_JL529",
        "name": "MICROPLAN_MO_02_06_04_04_WILISONVILLE_JL529",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_03_WILISONVILLE_WI528",
        "name": "MICROPLAN_MO_02_06_04_03_WILISONVILLE_WI528",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_02_WILISONVILLE",
        "name": "MICROPLAN_MO_02_06_04_02_WILISONVILLE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_04_01__49",
        "name": "MICROPLAN_MO_02_06_04_01__49",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_04_NEMIAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "name": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_03_09_NYANBO_JLODEH",
        "name": "MICROPLAN_MO_02_06_03_09_NYANBO_JLODEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_08_NYANBO_PIDDY",
        "name": "MICROPLAN_MO_02_06_03_08_NYANBO_PIDDY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_07_NYANBO_NYANBO",
        "name": "MICROPLAN_MO_02_06_03_07_NYANBO_NYANBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_06_NYANBO",
        "name": "MICROPLAN_MO_02_06_03_06_NYANBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_05_GENOYAH_CITY_YE521",
        "name": "MICROPLAN_MO_02_06_03_05_GENOYAH_CITY_YE521",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_04_GENOYAH_CITY_NE520",
        "name": "MICROPLAN_MO_02_06_03_04_GENOYAH_CITY_NE520",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_03_GENOYAH_CITY_GE519",
        "name": "MICROPLAN_MO_02_06_03_03_GENOYAH_CITY_GE519",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_02_GENOYAH_CITY",
        "name": "MICROPLAN_MO_02_06_03_02_GENOYAH_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_03_01__48",
        "name": "MICROPLAN_MO_02_06_03_01__48",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_03_GENOYAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "name": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_02_17_TUWAKEN_1_TUWAK516",
        "name": "MICROPLAN_MO_02_06_02_17_TUWAKEN_1_TUWAK516",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_16_TUWAKEN_1_TUWAK515",
        "name": "MICROPLAN_MO_02_06_02_16_TUWAKEN_1_TUWAK515",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_15_TUWAKEN_1_BACHE514",
        "name": "MICROPLAN_MO_02_06_02_15_TUWAKEN_1_BACHE514",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_14_TUWAKEN_1_TEBEK513",
        "name": "MICROPLAN_MO_02_06_02_14_TUWAKEN_1_TEBEK513",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_13_WETEKEN_1_WETEK512",
        "name": "MICROPLAN_MO_02_06_02_13_WETEKEN_1_WETEK512",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_12_WETEKEN_1_WETEK511",
        "name": "MICROPLAN_MO_02_06_02_12_WETEKEN_1_WETEK511",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_11_WETEKEN_1",
        "name": "MICROPLAN_MO_02_06_02_11_WETEKEN_1",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_10_NEW_GARRAWAY_PU509",
        "name": "MICROPLAN_MO_02_06_02_10_NEW_GARRAWAY_PU509",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_09_NEW_GARRAWAY_MA508",
        "name": "MICROPLAN_MO_02_06_02_09_NEW_GARRAWAY_MA508",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_08_NEW_GARRAWAY_GB507",
        "name": "MICROPLAN_MO_02_06_02_08_NEW_GARRAWAY_GB507",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_07_NEW_GARRAWAY_HO506",
        "name": "MICROPLAN_MO_02_06_02_07_NEW_GARRAWAY_HO506",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_06_NEW_GARRAWAY_SA505",
        "name": "MICROPLAN_MO_02_06_02_06_NEW_GARRAWAY_SA505",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_05_NEW_GARRAWAY_ME504",
        "name": "MICROPLAN_MO_02_06_02_05_NEW_GARRAWAY_ME504",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_04_NEW_GARRAWAY_MI503",
        "name": "MICROPLAN_MO_02_06_02_04_NEW_GARRAWAY_MI503",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_03_NEW_GARRAWAY_NE502",
        "name": "MICROPLAN_MO_02_06_02_03_NEW_GARRAWAY_NE502",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_02_NEW_GARRAWAY",
        "name": "MICROPLAN_MO_02_06_02_02_NEW_GARRAWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_02_01__47",
        "name": "MICROPLAN_MO_02_06_02_01__47",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_06_02_GARRAWAY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_06_01__46",
        "name": "MICROPLAN_MO_02_06_01__46",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_LOWER_JLOH",
        "name": "MICROPLAN_MO_02_05_LOWER_JLOH",
        "type": "District",
        "parent": "MICROPLAN_MO_02_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "name": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_04_07_BOTRA_UNITED_BA498",
        "name": "MICROPLAN_MO_02_05_04_07_BOTRA_UNITED_BA498",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_04_06_BOTRA_DIOH_CITY",
        "name": "MICROPLAN_MO_02_05_04_06_BOTRA_DIOH_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_04_05_BOTRA_BOTRA",
        "name": "MICROPLAN_MO_02_05_04_05_BOTRA_BOTRA",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_04_04_BOTRA",
        "name": "MICROPLAN_MO_02_05_04_04_BOTRA",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_04_03_NIFU_CITY_NIFU_494",
        "name": "MICROPLAN_MO_02_05_04_03_NIFU_CITY_NIFU_494",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_04_02_NIFU_CITY",
        "name": "MICROPLAN_MO_02_05_04_02_NIFU_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_04_01__45",
        "name": "MICROPLAN_MO_02_05_04_01__45",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_04_NIFU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "name": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_03_08_NEROH_KARH",
        "name": "MICROPLAN_MO_02_05_03_08_NEROH_KARH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_07_NEROH_WESSEHPO",
        "name": "MICROPLAN_MO_02_05_03_07_NEROH_WESSEHPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_06_NEROH_NEROH",
        "name": "MICROPLAN_MO_02_05_03_06_NEROH_NEROH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_05_NEROH",
        "name": "MICROPLAN_MO_02_05_03_05_NEROH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_04_SOBO_CITY_PITTA487",
        "name": "MICROPLAN_MO_02_05_03_04_SOBO_CITY_PITTA487",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_03_SOBO_CITY_SOBO_486",
        "name": "MICROPLAN_MO_02_05_03_03_SOBO_CITY_SOBO_486",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_02_SOBO_CITY",
        "name": "MICROPLAN_MO_02_05_03_02_SOBO_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_03_01__44",
        "name": "MICROPLAN_MO_02_05_03_01__44",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_03_SOBO_COMMUNITY_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "name": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_02_22_VALLA_ROCK_FIEL483",
        "name": "MICROPLAN_MO_02_05_02_22_VALLA_ROCK_FIEL483",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_21_VALLA_ROCK_FIEL482",
        "name": "MICROPLAN_MO_02_05_02_21_VALLA_ROCK_FIEL482",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_20_VALLA_ROCK_FIEL481",
        "name": "MICROPLAN_MO_02_05_02_20_VALLA_ROCK_FIEL481",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_19_WESSEH_TOWN_KIT480",
        "name": "MICROPLAN_MO_02_05_02_19_WESSEH_TOWN_KIT480",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_18_WESSEH_TOWN_BAS479",
        "name": "MICROPLAN_MO_02_05_02_18_WESSEH_TOWN_BAS479",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_17_WESSEH_TOWN_SLO478",
        "name": "MICROPLAN_MO_02_05_02_17_WESSEH_TOWN_SLO478",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_16_WESSEH_TOWN_WES477",
        "name": "MICROPLAN_MO_02_05_02_16_WESSEH_TOWN_WES477",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_15_WESSEH_TOWN",
        "name": "MICROPLAN_MO_02_05_02_15_WESSEH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_14_NROKWIA_WLOKRI",
        "name": "MICROPLAN_MO_02_05_02_14_NROKWIA_WLOKRI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_13_NROKWIA_KUNNIE",
        "name": "MICROPLAN_MO_02_05_02_13_NROKWIA_KUNNIE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_12_NROKWIA_KLADIA",
        "name": "MICROPLAN_MO_02_05_02_12_NROKWIA_KLADIA",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_11_NROKWIA_NROKWIA",
        "name": "MICROPLAN_MO_02_05_02_11_NROKWIA_NROKWIA",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_10_NROKWIA",
        "name": "MICROPLAN_MO_02_05_02_10_NROKWIA",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_09_DAYKPO_SOBOBO",
        "name": "MICROPLAN_MO_02_05_02_09_DAYKPO_SOBOBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_08_DAYKPO_BETU",
        "name": "MICROPLAN_MO_02_05_02_08_DAYKPO_BETU",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_07_DAYKPO_DAYKPO",
        "name": "MICROPLAN_MO_02_05_02_07_DAYKPO_DAYKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_06_DAYKPO",
        "name": "MICROPLAN_MO_02_05_02_06_DAYKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_05_JEKWIKEN_JEKWIK466",
        "name": "MICROPLAN_MO_02_05_02_05_JEKWIKEN_JEKWIK466",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_04_JEKWIKEN_DARGBE465",
        "name": "MICROPLAN_MO_02_05_02_04_JEKWIKEN_DARGBE465",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_03_JEKWIKEN_FELORK464",
        "name": "MICROPLAN_MO_02_05_02_03_JEKWIKEN_FELORK464",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_02_JEKWIKEN",
        "name": "MICROPLAN_MO_02_05_02_02_JEKWIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_02_01__43",
        "name": "MICROPLAN_MO_02_05_02_01__43",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_05_02_SASS_TOWN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_05_01__42",
        "name": "MICROPLAN_MO_02_05_01__42",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_DORBOR",
        "name": "MICROPLAN_MO_02_04_DORBOR",
        "type": "District",
        "parent": "MICROPLAN_MO_02_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "name": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_04_12_WEAYAN_TOWN_SEE460",
        "name": "MICROPLAN_MO_02_04_04_12_WEAYAN_TOWN_SEE460",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_11_WEAYAN_TOWN_WEA459",
        "name": "MICROPLAN_MO_02_04_04_11_WEAYAN_TOWN_WEA459",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_10_WEAYAN_TOWN",
        "name": "MICROPLAN_MO_02_04_04_10_WEAYAN_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_09_BOLLOH_JLATIKEN457",
        "name": "MICROPLAN_MO_02_04_04_09_BOLLOH_JLATIKEN457",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_08_BOLLOH_JLATIKEN456",
        "name": "MICROPLAN_MO_02_04_04_08_BOLLOH_JLATIKEN456",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_07_BOLLOH_JLATIKEN455",
        "name": "MICROPLAN_MO_02_04_04_07_BOLLOH_JLATIKEN455",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_06_BOLLOH_JLATIKEN454",
        "name": "MICROPLAN_MO_02_04_04_06_BOLLOH_JLATIKEN454",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_05_DOESWEN_TOWN_WA453",
        "name": "MICROPLAN_MO_02_04_04_05_DOESWEN_TOWN_WA453",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_04_DOESWEN_TOWN_AT452",
        "name": "MICROPLAN_MO_02_04_04_04_DOESWEN_TOWN_AT452",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_03_DOESWEN_TOWN_DO451",
        "name": "MICROPLAN_MO_02_04_04_03_DOESWEN_TOWN_DO451",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_02_DOESWEN_TOWN",
        "name": "MICROPLAN_MO_02_04_04_02_DOESWEN_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_01__41",
        "name": "MICROPLAN_MO_02_04_04_01__41",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_DOESWEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "name": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_03_09_NIMEYOUVILLE_BE448",
        "name": "MICROPLAN_MO_02_04_03_09_NIMEYOUVILLE_BE448",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_08_NIMEYOUVILLE_NI447",
        "name": "MICROPLAN_MO_02_04_03_08_NIMEYOUVILLE_NI447",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_07_NIMEYOUVILLE",
        "name": "MICROPLAN_MO_02_04_03_07_NIMEYOUVILLE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_06_WARKPO_NIPLAIKP445",
        "name": "MICROPLAN_MO_02_04_03_06_WARKPO_NIPLAIKP445",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_05_WARKPO_WARKPO",
        "name": "MICROPLAN_MO_02_04_03_05_WARKPO_WARKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_04_WARKPO",
        "name": "MICROPLAN_MO_02_04_03_04_WARKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_03_NEWTOWN_COMMUNI442",
        "name": "MICROPLAN_MO_02_04_03_03_NEWTOWN_COMMUNI442",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_02_NEWTOWN_COMMUNI441",
        "name": "MICROPLAN_MO_02_04_03_02_NEWTOWN_COMMUNI441",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_01__40",
        "name": "MICROPLAN_MO_02_04_03_01__40",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_BOLLOH_NEWTOWN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "name": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_02_11_JARKAKPO_KLAYDE439",
        "name": "MICROPLAN_MO_02_04_02_11_JARKAKPO_KLAYDE439",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_10_JARKAKPO_KAYKPO",
        "name": "MICROPLAN_MO_02_04_02_10_JARKAKPO_KAYKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_09_JARKAKPO_JARKAK437",
        "name": "MICROPLAN_MO_02_04_02_09_JARKAKPO_JARKAK437",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_08_JARKAKPO",
        "name": "MICROPLAN_MO_02_04_02_08_JARKAKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_07_BARFORWIN_BOLLO435",
        "name": "MICROPLAN_MO_02_04_02_07_BARFORWIN_BOLLO435",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_06_BARFORWIN_BARFO434",
        "name": "MICROPLAN_MO_02_04_02_06_BARFORWIN_BARFO434",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_05_BARFORWIN",
        "name": "MICROPLAN_MO_02_04_02_05_BARFORWIN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_04_NYANKUNPO_PUTU_432",
        "name": "MICROPLAN_MO_02_04_02_04_NYANKUNPO_PUTU_432",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_03_NYANKUNPO_NYANK431",
        "name": "MICROPLAN_MO_02_04_02_03_NYANKUNPO_NYANK431",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_02_NYANKUNPO",
        "name": "MICROPLAN_MO_02_04_02_02_NYANKUNPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_01__39",
        "name": "MICROPLAN_MO_02_04_02_01__39",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_NYANKUNPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_01__38",
        "name": "MICROPLAN_MO_02_04_01__38",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_BUAH",
        "name": "MICROPLAN_MO_02_03_BUAH",
        "type": "District",
        "parent": "MICROPLAN_MO_02_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "name": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_05_17_PARLUKEN_BOLUWI427",
        "name": "MICROPLAN_MO_02_03_05_17_PARLUKEN_BOLUWI427",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_16_PARLUKEN_JUDANY426",
        "name": "MICROPLAN_MO_02_03_05_16_PARLUKEN_JUDANY426",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_15_PARLUKEN_MA_MAR425",
        "name": "MICROPLAN_MO_02_03_05_15_PARLUKEN_MA_MAR425",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_14_PARLUKEN_E_MAN_424",
        "name": "MICROPLAN_MO_02_03_05_14_PARLUKEN_E_MAN_424",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_13_PARLUKEN_SARTIK423",
        "name": "MICROPLAN_MO_02_03_05_13_PARLUKEN_SARTIK423",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_12_PARLUKEN_CAMP_S422",
        "name": "MICROPLAN_MO_02_03_05_12_PARLUKEN_CAMP_S422",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_11_PARLUKEN_PLACE_421",
        "name": "MICROPLAN_MO_02_03_05_11_PARLUKEN_PLACE_421",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_10_PARLUKEN_CAMP_S420",
        "name": "MICROPLAN_MO_02_03_05_10_PARLUKEN_CAMP_S420",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_09_PARLUKEN_CHWNBO419",
        "name": "MICROPLAN_MO_02_03_05_09_PARLUKEN_CHWNBO419",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_08_PARLUKEN_CAMP_S418",
        "name": "MICROPLAN_MO_02_03_05_08_PARLUKEN_CAMP_S418",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_07_PARLUKEN_JLABAK417",
        "name": "MICROPLAN_MO_02_03_05_07_PARLUKEN_JLABAK417",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_06_PARLUKEN_PARLUK416",
        "name": "MICROPLAN_MO_02_03_05_06_PARLUKEN_PARLUK416",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_05_PARLUKEN",
        "name": "MICROPLAN_MO_02_03_05_05_PARLUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_04_WROPLUKEN_WROPL414",
        "name": "MICROPLAN_MO_02_03_05_04_WROPLUKEN_WROPL414",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_03_WROPLUKEN_GBARK413",
        "name": "MICROPLAN_MO_02_03_05_03_WROPLUKEN_GBARK413",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_02_WROPLUKEN",
        "name": "MICROPLAN_MO_02_03_05_02_WROPLUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_05_01__37",
        "name": "MICROPLAN_MO_02_03_05_01__37",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_05_PONNOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "name": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_04_09_PLANPLANKEN",
        "name": "MICROPLAN_MO_02_03_04_09_PLANPLANKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_08_PLANPLANKEN_SAR409",
        "name": "MICROPLAN_MO_02_03_04_08_PLANPLANKEN_SAR409",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_07_PLANPLANKEN_WRE408",
        "name": "MICROPLAN_MO_02_03_04_07_PLANPLANKEN_WRE408",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_06_PLANPLANKEN_WOL407",
        "name": "MICROPLAN_MO_02_03_04_06_PLANPLANKEN_WOL407",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_05_PLANPLANKEN_PLA406",
        "name": "MICROPLAN_MO_02_03_04_05_PLANPLANKEN_PLA406",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_04_JERBOKEN_JLATEK405",
        "name": "MICROPLAN_MO_02_03_04_04_JERBOKEN_JLATEK405",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_03_JERBOKEN_JERBOK404",
        "name": "MICROPLAN_MO_02_03_04_03_JERBOKEN_JERBOK404",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_02_JERBOKEN",
        "name": "MICROPLAN_MO_02_03_04_02_JERBOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_01__36",
        "name": "MICROPLAN_MO_02_03_04_01__36",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_TARLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "name": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_03_08_JABLAKEN_SARKPA401",
        "name": "MICROPLAN_MO_02_03_03_08_JABLAKEN_SARKPA401",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_07_JABLAKEN_GBASUL400",
        "name": "MICROPLAN_MO_02_03_03_07_JABLAKEN_GBASUL400",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_06_JABLAKEN_JABLAK399",
        "name": "MICROPLAN_MO_02_03_03_06_JABLAKEN_JABLAK399",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_05_JABLAKEN",
        "name": "MICROPLAN_MO_02_03_03_05_JABLAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_04_DWEKEN_PHILIDEP397",
        "name": "MICROPLAN_MO_02_03_03_04_DWEKEN_PHILIDEP397",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_03_DWEKEN_DWEKEN",
        "name": "MICROPLAN_MO_02_03_03_03_DWEKEN_DWEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_02_DWEKEN",
        "name": "MICROPLAN_MO_02_03_03_02_DWEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_01__35",
        "name": "MICROPLAN_MO_02_03_03_01__35",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_DWEKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "name": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_02_17_ANAKEN_ANAKEN",
        "name": "MICROPLAN_MO_02_03_02_17_ANAKEN_ANAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_16_ANAKEN",
        "name": "MICROPLAN_MO_02_03_02_16_ANAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_15_SMITHVILLE_SMIT391",
        "name": "MICROPLAN_MO_02_03_02_15_SMITHVILLE_SMIT391",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_14_SMITHVILLE",
        "name": "MICROPLAN_MO_02_03_02_14_SMITHVILLE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_13_SIAKEN_TAYBUE",
        "name": "MICROPLAN_MO_02_03_02_13_SIAKEN_TAYBUE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_12_SIAKEN_TARWROKE388",
        "name": "MICROPLAN_MO_02_03_02_12_SIAKEN_TARWROKE388",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_11_SIAKEN_SIAKEN",
        "name": "MICROPLAN_MO_02_03_02_11_SIAKEN_SIAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_10_SIAKEN",
        "name": "MICROPLAN_MO_02_03_02_10_SIAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_09_DIAYOKEN_WOLOKE385",
        "name": "MICROPLAN_MO_02_03_02_09_DIAYOKEN_WOLOKE385",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_08_DIAYOKEN_DIAYOK384",
        "name": "MICROPLAN_MO_02_03_02_08_DIAYOKEN_DIAYOK384",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_07_DIAYOKEN_TUBUVI383",
        "name": "MICROPLAN_MO_02_03_02_07_DIAYOKEN_TUBUVI383",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_06_DIAYOKEN",
        "name": "MICROPLAN_MO_02_03_02_06_DIAYOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_05_CHENWRIKEN_WROP381",
        "name": "MICROPLAN_MO_02_03_02_05_CHENWRIKEN_WROP381",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_04_CHENWRIKEN_TARK380",
        "name": "MICROPLAN_MO_02_03_02_04_CHENWRIKEN_TARK380",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_03_CHENWRIKEN_CHEN379",
        "name": "MICROPLAN_MO_02_03_02_03_CHENWRIKEN_CHEN379",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_02_CHENWRIKEN",
        "name": "MICROPLAN_MO_02_03_02_02_CHENWRIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_01__34",
        "name": "MICROPLAN_MO_02_03_02_01__34",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_BUAH_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_01__33",
        "name": "MICROPLAN_MO_02_03_01__33",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "name": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "type": "District",
        "parent": "MICROPLAN_MO_02_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "name": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_07_20_KWEYEKEN_KAYBOR",
        "name": "MICROPLAN_MO_02_02_07_20_KWEYEKEN_KAYBOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_19_KWEYEKEN_MUYANK374",
        "name": "MICROPLAN_MO_02_02_07_19_KWEYEKEN_MUYANK374",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_18_KWEYEKEN_TUPOKE373",
        "name": "MICROPLAN_MO_02_02_07_18_KWEYEKEN_TUPOKE373",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_17_KWEYEKEN_KWEYEK372",
        "name": "MICROPLAN_MO_02_02_07_17_KWEYEKEN_KWEYEK372",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_16_KWEYEKEN",
        "name": "MICROPLAN_MO_02_02_07_16_KWEYEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_15_GBLABLOKEN_TARP370",
        "name": "MICROPLAN_MO_02_02_07_15_GBLABLOKEN_TARP370",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_14_GBLABLOKEN_JLAR369",
        "name": "MICROPLAN_MO_02_02_07_14_GBLABLOKEN_JLAR369",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_13_GBLABLOKEN_GBLA368",
        "name": "MICROPLAN_MO_02_02_07_13_GBLABLOKEN_GBLA368",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_12_GBLABLOKEN",
        "name": "MICROPLAN_MO_02_02_07_12_GBLABLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_11_GENEKEN_WEDABOB366",
        "name": "MICROPLAN_MO_02_02_07_11_GENEKEN_WEDABOB366",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_10_GENEKEN_DENTIKE365",
        "name": "MICROPLAN_MO_02_02_07_10_GENEKEN_DENTIKE365",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_09_GENEKEN_GENEKEN",
        "name": "MICROPLAN_MO_02_02_07_09_GENEKEN_GENEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_08_GENEKEN",
        "name": "MICROPLAN_MO_02_02_07_08_GENEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_07_ZOLOKEN_KWELEKE362",
        "name": "MICROPLAN_MO_02_02_07_07_ZOLOKEN_KWELEKE362",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_06_ZOLOKEN_ZOLOKEN",
        "name": "MICROPLAN_MO_02_02_07_06_ZOLOKEN_ZOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_05_ZOLOKEN",
        "name": "MICROPLAN_MO_02_02_07_05_ZOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_04_GBANKEN_YLATWEN",
        "name": "MICROPLAN_MO_02_02_07_04_GBANKEN_YLATWEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_03_GBANKEN_GBANKEN",
        "name": "MICROPLAN_MO_02_02_07_03_GBANKEN_GBANKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_02_GBANKEN",
        "name": "MICROPLAN_MO_02_02_07_02_GBANKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_07_01__32",
        "name": "MICROPLAN_MO_02_02_07_01__32",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_07_GBANKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "name": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_06_07_NEWCESS_BELLORK355",
        "name": "MICROPLAN_MO_02_02_06_07_NEWCESS_BELLORK355",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_06_NEWCESS_GBANKEN354",
        "name": "MICROPLAN_MO_02_02_06_06_NEWCESS_GBANKEN354",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_05_NEWCESS_NEWCESS",
        "name": "MICROPLAN_MO_02_02_06_05_NEWCESS_NEWCESS",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_04_NEWCESS",
        "name": "MICROPLAN_MO_02_02_06_04_NEWCESS",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_03_GRAND_CESS_CITY351",
        "name": "MICROPLAN_MO_02_02_06_03_GRAND_CESS_CITY351",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_02_GRAND_CESS_CITY350",
        "name": "MICROPLAN_MO_02_02_06_02_GRAND_CESS_CITY350",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_06_01__31",
        "name": "MICROPLAN_MO_02_02_06_01__31",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_06_RALLY_TIME_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "name": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_05_15_BIG_FLENEKEN_WU348",
        "name": "MICROPLAN_MO_02_02_05_15_BIG_FLENEKEN_WU348",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_14_BIG_FLENEKEN_BI347",
        "name": "MICROPLAN_MO_02_02_05_14_BIG_FLENEKEN_BI347",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_13_TOPOH_BIG_SUEN",
        "name": "MICROPLAN_MO_02_02_05_13_TOPOH_BIG_SUEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_12_TOPOH_TOPOH",
        "name": "MICROPLAN_MO_02_02_05_12_TOPOH_TOPOH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_11_TOPOH",
        "name": "MICROPLAN_MO_02_02_05_11_TOPOH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_10_WAKPEKEN_SEATOR",
        "name": "MICROPLAN_MO_02_02_05_10_WAKPEKEN_SEATOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_09_WAKPEKEN_WAKPEK342",
        "name": "MICROPLAN_MO_02_02_05_09_WAKPEKEN_WAKPEK342",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_08_WAKPEKEN",
        "name": "MICROPLAN_MO_02_02_05_08_WAKPEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_07_ZONE_ONE_HOSPIT340",
        "name": "MICROPLAN_MO_02_02_05_07_ZONE_ONE_HOSPIT340",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_06_ZONE_ONE_HOSPIT339",
        "name": "MICROPLAN_MO_02_02_05_06_ZONE_ONE_HOSPIT339",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_05_ZONE_ONE_HOSPIT338",
        "name": "MICROPLAN_MO_02_02_05_05_ZONE_ONE_HOSPIT338",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_04_ZONE_ONE_HOSPIT337",
        "name": "MICROPLAN_MO_02_02_05_04_ZONE_ONE_HOSPIT337",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_03_ZONE_ONE_HOSPIT336",
        "name": "MICROPLAN_MO_02_02_05_03_ZONE_ONE_HOSPIT336",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_02_ZONE_ONE_HOSPIT335",
        "name": "MICROPLAN_MO_02_02_05_02_ZONE_ONE_HOSPIT335",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_05_01__30",
        "name": "MICROPLAN_MO_02_02_05_01__30",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "name": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_04_15_TUPAKEN_CHANGBE333",
        "name": "MICROPLAN_MO_02_02_04_15_TUPAKEN_CHANGBE333",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_14_TUPAKEN_SORROKE332",
        "name": "MICROPLAN_MO_02_02_04_14_TUPAKEN_SORROKE332",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_13_TUPAKEN_TUPAKEN",
        "name": "MICROPLAN_MO_02_02_04_13_TUPAKEN_TUPAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_12_TUPAKEN",
        "name": "MICROPLAN_MO_02_02_04_12_TUPAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_11_GBEBOR_PANWENKE329",
        "name": "MICROPLAN_MO_02_02_04_11_GBEBOR_PANWENKE329",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_10_GBEBOR_UPPER_NE328",
        "name": "MICROPLAN_MO_02_02_04_10_GBEBOR_UPPER_NE328",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_09_GBEBOR_ISLAND_N327",
        "name": "MICROPLAN_MO_02_02_04_09_GBEBOR_ISLAND_N327",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_08_GBEBOR_DEGBLAKE326",
        "name": "MICROPLAN_MO_02_02_04_08_GBEBOR_DEGBLAKE326",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_07_GBEBOR_GBEBOR",
        "name": "MICROPLAN_MO_02_02_04_07_GBEBOR_GBEBOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_06_GBEBOR",
        "name": "MICROPLAN_MO_02_02_04_06_GBEBOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_05_JUDUKEN_TOWN_DU323",
        "name": "MICROPLAN_MO_02_02_04_05_JUDUKEN_TOWN_DU323",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_04_JUDUKEN_TOWN_GB322",
        "name": "MICROPLAN_MO_02_02_04_04_JUDUKEN_TOWN_GB322",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_03_JUDUKEN_TOWN_JU321",
        "name": "MICROPLAN_MO_02_02_04_03_JUDUKEN_TOWN_JU321",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_02_JUDUKEN_TOWN",
        "name": "MICROPLAN_MO_02_02_04_02_JUDUKEN_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_04_01__29",
        "name": "MICROPLAN_MO_02_02_04_01__29",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_04_JUDUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "name": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_03_14_SOLOKPO_TARAWA_318",
        "name": "MICROPLAN_MO_02_02_03_14_SOLOKPO_TARAWA_318",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_13_SOLOKPO_JAKAKPO",
        "name": "MICROPLAN_MO_02_02_03_13_SOLOKPO_JAKAKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_12_SOLOKPO_SOBOBO",
        "name": "MICROPLAN_MO_02_02_03_12_SOLOKPO_SOBOBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_11_SOLOKPO_SOLOKPO",
        "name": "MICROPLAN_MO_02_02_03_11_SOLOKPO_SOLOKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_10_SOLOKPO",
        "name": "MICROPLAN_MO_02_02_03_10_SOLOKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_09_KLOFUEH_TOGBAKL313",
        "name": "MICROPLAN_MO_02_02_03_09_KLOFUEH_TOGBAKL313",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_08_KLOFUEH_JLATEKP312",
        "name": "MICROPLAN_MO_02_02_03_08_KLOFUEH_JLATEKP312",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_07_KLOFUEH_KLOFUEH",
        "name": "MICROPLAN_MO_02_02_03_07_KLOFUEH_KLOFUEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_06_KLOFUEH",
        "name": "MICROPLAN_MO_02_02_03_06_KLOFUEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_05_BAILAKPO_FUNKPO",
        "name": "MICROPLAN_MO_02_02_03_05_BAILAKPO_FUNKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_04_BAILAKPO_BONGAL308",
        "name": "MICROPLAN_MO_02_02_03_04_BAILAKPO_BONGAL308",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_03_BAILAKPO_BAILAK307",
        "name": "MICROPLAN_MO_02_02_03_03_BAILAKPO_BAILAK307",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_02_BAILAKPO",
        "name": "MICROPLAN_MO_02_02_03_02_BAILAKPO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_01__28",
        "name": "MICROPLAN_MO_02_02_03_01__28",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_PICNECESS_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "name": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_02_12_GENWIEN_CITY_DW304",
        "name": "MICROPLAN_MO_02_02_02_12_GENWIEN_CITY_DW304",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_11_GENWIEN_CITY_OT303",
        "name": "MICROPLAN_MO_02_02_02_11_GENWIEN_CITY_OT303",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_10_GENWIEN_CITY_GE302",
        "name": "MICROPLAN_MO_02_02_02_10_GENWIEN_CITY_GE302",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_09_GENWIEN_CITY",
        "name": "MICROPLAN_MO_02_02_02_09_GENWIEN_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_08_JOPLOKEN_CITY_T300",
        "name": "MICROPLAN_MO_02_02_02_08_JOPLOKEN_CITY_T300",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_07_JOPLOKEN_CITY_K299",
        "name": "MICROPLAN_MO_02_02_02_07_JOPLOKEN_CITY_K299",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_06_JOPLOKEN_CITY_J298",
        "name": "MICROPLAN_MO_02_02_02_06_JOPLOKEN_CITY_J298",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_05_JOPLOKEN_CITY",
        "name": "MICROPLAN_MO_02_02_02_05_JOPLOKEN_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_04_FILORKEN_CITY_G296",
        "name": "MICROPLAN_MO_02_02_02_04_FILORKEN_CITY_G296",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_03_FILORKEN_CITY_F295",
        "name": "MICROPLAN_MO_02_02_02_03_FILORKEN_CITY_F295",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_02_FILORKEN_CITY",
        "name": "MICROPLAN_MO_02_02_02_02_FILORKEN_CITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_01__27",
        "name": "MICROPLAN_MO_02_02_02_01__27",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBALAKPO_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_01__26",
        "name": "MICROPLAN_MO_02_02_01__26",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_01__25",
        "name": "MICROPLAN_MO_02_01__25",
        "type": "District",
        "parent": "MICROPLAN_MO_02_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_MARYLAND",
        "name": "MICROPLAN_MO_01_MARYLAND",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_PLEEBO",
        "name": "MICROPLAN_MO_01_06_PLEEBO",
        "type": "District",
        "parent": "MICROPLAN_MO_01_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "name": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_06_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_06_47_HOSPITAL_CAMP_C290",
        "name": "MICROPLAN_MO_01_06_06_47_HOSPITAL_CAMP_C290",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_46_HOSPITAL_CAMP_C289",
        "name": "MICROPLAN_MO_01_06_06_46_HOSPITAL_CAMP_C289",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_45_HOSPITAL_CAMP_C288",
        "name": "MICROPLAN_MO_01_06_06_45_HOSPITAL_CAMP_C288",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_44_HOSPITAL_CAMP_C287",
        "name": "MICROPLAN_MO_01_06_06_44_HOSPITAL_CAMP_C287",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_43_GEDETARBO_8_GED286",
        "name": "MICROPLAN_MO_01_06_06_43_GEDETARBO_8_GED286",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_42_GEDETARBO_7_GED285",
        "name": "MICROPLAN_MO_01_06_06_42_GEDETARBO_7_GED285",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_41_GEDETARBO_6_RUB284",
        "name": "MICROPLAN_MO_01_06_06_41_GEDETARBO_6_RUB284",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_40_GEDETARBO_5_TOG283",
        "name": "MICROPLAN_MO_01_06_06_40_GEDETARBO_5_TOG283",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_39_GEDETARBO_4_NEM282",
        "name": "MICROPLAN_MO_01_06_06_39_GEDETARBO_4_NEM282",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_38_GEDETARBO_3_HEL281",
        "name": "MICROPLAN_MO_01_06_06_38_GEDETARBO_3_HEL281",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_37_GEDETARBO_2_NEP280",
        "name": "MICROPLAN_MO_01_06_06_37_GEDETARBO_2_NEP280",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_36_GEDETARBO_1",
        "name": "MICROPLAN_MO_01_06_06_36_GEDETARBO_1",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_35_GBOLOBO_BESSIKE278",
        "name": "MICROPLAN_MO_01_06_06_35_GBOLOBO_BESSIKE278",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_34_GBOLOBO_BESSIKE277",
        "name": "MICROPLAN_MO_01_06_06_34_GBOLOBO_BESSIKE277",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_33_GBOLOBO_BESSIKE276",
        "name": "MICROPLAN_MO_01_06_06_33_GBOLOBO_BESSIKE276",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_32_GBOLOBO_BESSIKE275",
        "name": "MICROPLAN_MO_01_06_06_32_GBOLOBO_BESSIKE275",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_31_GBOLOBO_BESSIKE274",
        "name": "MICROPLAN_MO_01_06_06_31_GBOLOBO_BESSIKE274",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_30_GBOLOBO_BESSIKE273",
        "name": "MICROPLAN_MO_01_06_06_30_GBOLOBO_BESSIKE273",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_29_GBOLOBO_BESSIKE272",
        "name": "MICROPLAN_MO_01_06_06_29_GBOLOBO_BESSIKE272",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_28_PLEEBO_ZONE_11A271",
        "name": "MICROPLAN_MO_01_06_06_28_PLEEBO_ZONE_11A271",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_27_PLEEBO_ZONE_11A270",
        "name": "MICROPLAN_MO_01_06_06_27_PLEEBO_ZONE_11A270",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_26_PLEEBO_ZONE_11A269",
        "name": "MICROPLAN_MO_01_06_06_26_PLEEBO_ZONE_11A269",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_25_PLEEBO_ZONE_11A268",
        "name": "MICROPLAN_MO_01_06_06_25_PLEEBO_ZONE_11A268",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_24_PLEEBO_ZONE_11A267",
        "name": "MICROPLAN_MO_01_06_06_24_PLEEBO_ZONE_11A267",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_23_PLEEBO_ZONE_11A266",
        "name": "MICROPLAN_MO_01_06_06_23_PLEEBO_ZONE_11A266",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_22_PLEEBO_ZONE_11A265",
        "name": "MICROPLAN_MO_01_06_06_22_PLEEBO_ZONE_11A265",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_21_PLEEBO_ZONE_7A_264",
        "name": "MICROPLAN_MO_01_06_06_21_PLEEBO_ZONE_7A_264",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_20_PLEEBO_ZONE_7A_263",
        "name": "MICROPLAN_MO_01_06_06_20_PLEEBO_ZONE_7A_263",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_19_PLEEBO_ZONE_7A_262",
        "name": "MICROPLAN_MO_01_06_06_19_PLEEBO_ZONE_7A_262",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_18_PLEEBO_ZONE_7A_261",
        "name": "MICROPLAN_MO_01_06_06_18_PLEEBO_ZONE_7A_261",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_17_PLEEBO_ZONE_7A_260",
        "name": "MICROPLAN_MO_01_06_06_17_PLEEBO_ZONE_7A_260",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_16_PLEEBO_ZONE_7A_259",
        "name": "MICROPLAN_MO_01_06_06_16_PLEEBO_ZONE_7A_259",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_15_PLEEBO_ZONE_7A_258",
        "name": "MICROPLAN_MO_01_06_06_15_PLEEBO_ZONE_7A_258",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_14_PLEEBO_ZONE_7A",
        "name": "MICROPLAN_MO_01_06_06_14_PLEEBO_ZONE_7A",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_13__24",
        "name": "MICROPLAN_MO_01_06_06_13__24",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_12_PLEEBO_ZONE_3A_255",
        "name": "MICROPLAN_MO_01_06_06_12_PLEEBO_ZONE_3A_255",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_11_PLEEBO_ZONE_3A_254",
        "name": "MICROPLAN_MO_01_06_06_11_PLEEBO_ZONE_3A_254",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_10_PLEEBO_ZONE_3A_253",
        "name": "MICROPLAN_MO_01_06_06_10_PLEEBO_ZONE_3A_253",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_09_PLEEBO_ZONE_3A_252",
        "name": "MICROPLAN_MO_01_06_06_09_PLEEBO_ZONE_3A_252",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_08_PLEEBO_ZONE_3A_251",
        "name": "MICROPLAN_MO_01_06_06_08_PLEEBO_ZONE_3A_251",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_07_PLEEBO_ZONE_3A",
        "name": "MICROPLAN_MO_01_06_06_07_PLEEBO_ZONE_3A",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_06_PLEEBO_ZONE_1A_249",
        "name": "MICROPLAN_MO_01_06_06_06_PLEEBO_ZONE_1A_249",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_05_PLEEBO_ZONE_1A_248",
        "name": "MICROPLAN_MO_01_06_06_05_PLEEBO_ZONE_1A_248",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_04_PLEEBO_ZONE_1A_247",
        "name": "MICROPLAN_MO_01_06_06_04_PLEEBO_ZONE_1A_247",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_03_PLEEBO_ZONE_1A_246",
        "name": "MICROPLAN_MO_01_06_06_03_PLEEBO_ZONE_1A_246",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_02_PLEEBO_ZONE_1A_245",
        "name": "MICROPLAN_MO_01_06_06_02_PLEEBO_ZONE_1A_245",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_06_01_PLEEBO_ZONE_1A",
        "name": "MICROPLAN_MO_01_06_06_01_PLEEBO_ZONE_1A",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_06_PLEEBO_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "name": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_06_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_05_11_GBLOKEN_DEBLEKE243",
        "name": "MICROPLAN_MO_01_06_05_11_GBLOKEN_DEBLEKE243",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_10_GBLOKEN_SADEKEN",
        "name": "MICROPLAN_MO_01_06_05_10_GBLOKEN_SADEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_09_GBLOKEN_NIKPACH241",
        "name": "MICROPLAN_MO_01_06_05_09_GBLOKEN_NIKPACH241",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_08_GBLOKEN_SEDEKEN",
        "name": "MICROPLAN_MO_01_06_05_08_GBLOKEN_SEDEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_07_GBLOKEN_GBAKEN",
        "name": "MICROPLAN_MO_01_06_05_07_GBLOKEN_GBAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_06_GBLOKEN_SOLOKEN",
        "name": "MICROPLAN_MO_01_06_05_06_GBLOKEN_SOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_05_GBLOKEN_TUMBIAK237",
        "name": "MICROPLAN_MO_01_06_05_05_GBLOKEN_TUMBIAK237",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_04_GBLOKEN_KWILOKE236",
        "name": "MICROPLAN_MO_01_06_05_04_GBLOKEN_KWILOKE236",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_03_GBLOKEN_GBLOKEN",
        "name": "MICROPLAN_MO_01_06_05_03_GBLOKEN_GBLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_02_GBLOKEN",
        "name": "MICROPLAN_MO_01_06_05_02_GBLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_05_01__23",
        "name": "MICROPLAN_MO_01_06_05_01__23",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_05_GBLOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "name": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_06_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_04_10_OLD_SODOKEN_CAM232",
        "name": "MICROPLAN_MO_01_06_04_10_OLD_SODOKEN_CAM232",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_09_OLD_SODOKEN_GOL231",
        "name": "MICROPLAN_MO_01_06_04_09_OLD_SODOKEN_GOL231",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_08_OLD_SODOKEN_WAT230",
        "name": "MICROPLAN_MO_01_06_04_08_OLD_SODOKEN_WAT230",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_07_OLD_SODOKEN_GBE229",
        "name": "MICROPLAN_MO_01_06_04_07_OLD_SODOKEN_GBE229",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_06_OLD_SODOKEN_MOP228",
        "name": "MICROPLAN_MO_01_06_04_06_OLD_SODOKEN_MOP228",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_05_OLD_SODOKEN_NEW227",
        "name": "MICROPLAN_MO_01_06_04_05_OLD_SODOKEN_NEW227",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_04_OLD_SODOKEN_GBO226",
        "name": "MICROPLAN_MO_01_06_04_04_OLD_SODOKEN_GBO226",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_03_OLD_SODOKEN_OLD225",
        "name": "MICROPLAN_MO_01_06_04_03_OLD_SODOKEN_OLD225",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_02_OLD_SODOKEN",
        "name": "MICROPLAN_MO_01_06_04_02_OLD_SODOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_04_01__22",
        "name": "MICROPLAN_MO_01_06_04_01__22",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_04_OLD_SODOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "name": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_06_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_03_10_RTK_TENDEKEN",
        "name": "MICROPLAN_MO_01_06_03_10_RTK_TENDEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_09_RTK_CAVALLA_KUN221",
        "name": "MICROPLAN_MO_01_06_03_09_RTK_CAVALLA_KUN221",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_08_RTK_TUOKPEKEN",
        "name": "MICROPLAN_MO_01_06_03_08_RTK_TUOKPEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_07_RTK_JLOBOKEN",
        "name": "MICROPLAN_MO_01_06_03_07_RTK_JLOBOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_06_RTK_BLAGEKEN",
        "name": "MICROPLAN_MO_01_06_03_06_RTK_BLAGEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_05_RTK_GEKOEKEN",
        "name": "MICROPLAN_MO_01_06_03_05_RTK_GEKOEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_04_RTK_GENIKEN",
        "name": "MICROPLAN_MO_01_06_03_04_RTK_GENIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_03_RTK_RTK",
        "name": "MICROPLAN_MO_01_06_03_03_RTK_RTK",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_02_RTK",
        "name": "MICROPLAN_MO_01_06_03_02_RTK",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_03_01__21",
        "name": "MICROPLAN_MO_01_06_03_01__21",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "name": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_06_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_06_02_07_BARRAKEN_NEW_GB212",
        "name": "MICROPLAN_MO_01_06_02_07_BARRAKEN_NEW_GB212",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_06_BARRAKEN_REFUGE211",
        "name": "MICROPLAN_MO_01_06_02_06_BARRAKEN_REFUGE211",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_05_BARRAKEN_WEAH_V210",
        "name": "MICROPLAN_MO_01_06_02_05_BARRAKEN_WEAH_V210",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_04_BARRAKEN_OLD_LA209",
        "name": "MICROPLAN_MO_01_06_02_04_BARRAKEN_OLD_LA209",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_03_BARRAKEN_BARRAK208",
        "name": "MICROPLAN_MO_01_06_02_03_BARRAKEN_BARRAK208",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_02_BARRAKEN",
        "name": "MICROPLAN_MO_01_06_02_02_BARRAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_02_01__20",
        "name": "MICROPLAN_MO_01_06_02_01__20",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_06_02_BARRAKEN_CLINIC__FIXED_DP_",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_06_01__19",
        "name": "MICROPLAN_MO_01_06_01__19",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_06_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_05_KALUWAY__2",
        "name": "MICROPLAN_MO_01_05_KALUWAY__2",
        "type": "District",
        "parent": "MICROPLAN_MO_01_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "name": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_05_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_05_04_13_YEDIAKEN_YORKEN204",
        "name": "MICROPLAN_MO_01_05_04_13_YEDIAKEN_YORKEN204",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_12_YEDIAKEN_YORKEN",
        "name": "MICROPLAN_MO_01_05_04_12_YEDIAKEN_YORKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_11_YEDIAKEN_YOBLOK202",
        "name": "MICROPLAN_MO_01_05_04_11_YEDIAKEN_YOBLOK202",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_10_YEDIAKEN_JOHNSO201",
        "name": "MICROPLAN_MO_01_05_04_10_YEDIAKEN_JOHNSO201",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_09_YEDIAKEN_YEDERO200",
        "name": "MICROPLAN_MO_01_05_04_09_YEDIAKEN_YEDERO200",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_08_YEDIAKEN_NYEONW199",
        "name": "MICROPLAN_MO_01_05_04_08_YEDIAKEN_NYEONW199",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_07_YEDIAKEN_GBON",
        "name": "MICROPLAN_MO_01_05_04_07_YEDIAKEN_GBON",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_06_YEDIAKEN_GBISO",
        "name": "MICROPLAN_MO_01_05_04_06_YEDIAKEN_GBISO",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_05_YEDIAKEN_GBAWIL196",
        "name": "MICROPLAN_MO_01_05_04_05_YEDIAKEN_GBAWIL196",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_04_YEDIAKEN_WELEKE195",
        "name": "MICROPLAN_MO_01_05_04_04_YEDIAKEN_WELEKE195",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_03_YEDIAKEN_YEDIAK194",
        "name": "MICROPLAN_MO_01_05_04_03_YEDIAKEN_YEDIAK194",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_02_YEDIAKEN",
        "name": "MICROPLAN_MO_01_05_04_02_YEDIAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_04_01__18",
        "name": "MICROPLAN_MO_01_05_04_01__18",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_04_YEDIAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "name": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_05_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_05_03_13_MANOLU_BIG_TOWN191",
        "name": "MICROPLAN_MO_01_05_03_13_MANOLU_BIG_TOWN191",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_12_MANOLU_BIG_TOWN190",
        "name": "MICROPLAN_MO_01_05_03_12_MANOLU_BIG_TOWN190",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_11_MANOLU_BIG_TOWN189",
        "name": "MICROPLAN_MO_01_05_03_11_MANOLU_BIG_TOWN189",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_10_MANOLU_BIG_TOWN188",
        "name": "MICROPLAN_MO_01_05_03_10_MANOLU_BIG_TOWN188",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_09_MANOLU_BIG_TOWN187",
        "name": "MICROPLAN_MO_01_05_03_09_MANOLU_BIG_TOWN187",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_08_MANOLU_BIG_TOWN186",
        "name": "MICROPLAN_MO_01_05_03_08_MANOLU_BIG_TOWN186",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_07_MANOLU_BIG_TOWN185",
        "name": "MICROPLAN_MO_01_05_03_07_MANOLU_BIG_TOWN185",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_06_MANOLU_BIG_TOWN184",
        "name": "MICROPLAN_MO_01_05_03_06_MANOLU_BIG_TOWN184",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_05_MANOLU_BIG_TOWN183",
        "name": "MICROPLAN_MO_01_05_03_05_MANOLU_BIG_TOWN183",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_04_MANOLU_BIG_TOWN182",
        "name": "MICROPLAN_MO_01_05_03_04_MANOLU_BIG_TOWN182",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_03_MANOLU_BIG_TOWN181",
        "name": "MICROPLAN_MO_01_05_03_03_MANOLU_BIG_TOWN181",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_02_MANOLU_BIG_TOWN180",
        "name": "MICROPLAN_MO_01_05_03_02_MANOLU_BIG_TOWN180",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_03_01__17",
        "name": "MICROPLAN_MO_01_05_03_01__17",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_03_MANOLU_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_BONIKEN",
        "name": "MICROPLAN_MO_01_05_02_BONIKEN",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_05_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_05_02_08_BONIKEN_DOLOKEN",
        "name": "MICROPLAN_MO_01_05_02_08_BONIKEN_DOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_07_BONIKEN_WLOWIEN",
        "name": "MICROPLAN_MO_01_05_02_07_BONIKEN_WLOWIEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_06_BONIKEN_GIANT_T176",
        "name": "MICROPLAN_MO_01_05_02_06_BONIKEN_GIANT_T176",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_05_BONIKEN_HENONGB175",
        "name": "MICROPLAN_MO_01_05_02_05_BONIKEN_HENONGB175",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_04_BONIKEN_TUGBAKE174",
        "name": "MICROPLAN_MO_01_05_02_04_BONIKEN_TUGBAKE174",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_03_BONIKEN_BONIKEN",
        "name": "MICROPLAN_MO_01_05_02_03_BONIKEN_BONIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_02_BONIKEN",
        "name": "MICROPLAN_MO_01_05_02_02_BONIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_02_01__16",
        "name": "MICROPLAN_MO_01_05_02_01__16",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_05_02_BONIKEN",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_05_01__15",
        "name": "MICROPLAN_MO_01_05_01__15",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_05_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_04_KALUWAY__1",
        "name": "MICROPLAN_MO_01_04_KALUWAY__1",
        "type": "District",
        "parent": "MICROPLAN_MO_01_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "name": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_04_KALUWAY__1",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_04_03_09_POUGBAKEN_TYETE169",
        "name": "MICROPLAN_MO_01_04_03_09_POUGBAKEN_TYETE169",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_08_POUGBAKEN_POMUK168",
        "name": "MICROPLAN_MO_01_04_03_08_POUGBAKEN_POMUK168",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_07_POUGBAKEN_WUIUK167",
        "name": "MICROPLAN_MO_01_04_03_07_POUGBAKEN_WUIUK167",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_06_POUGBAKEN_ANDER166",
        "name": "MICROPLAN_MO_01_04_03_06_POUGBAKEN_ANDER166",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_05_POUGBAKEN_GBAKE165",
        "name": "MICROPLAN_MO_01_04_03_05_POUGBAKEN_GBAKE165",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_04_POUGBAKEN_TOCHO164",
        "name": "MICROPLAN_MO_01_04_03_04_POUGBAKEN_TOCHO164",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_03_POUGBAKEN_POUGB163",
        "name": "MICROPLAN_MO_01_04_03_03_POUGBAKEN_POUGB163",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_02_POUGBAKEN",
        "name": "MICROPLAN_MO_01_04_03_02_POUGBAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_03_01__14",
        "name": "MICROPLAN_MO_01_04_03_01__14",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_03_POUGBAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "name": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_04_KALUWAY__1",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_04_02_23_KARLOKEN_GEDEBO160",
        "name": "MICROPLAN_MO_01_04_02_23_KARLOKEN_GEDEBO160",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_22_KARLOKEN_GEDEBO159",
        "name": "MICROPLAN_MO_01_04_02_22_KARLOKEN_GEDEBO159",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_21_KARLOKEN_GEDEBO158",
        "name": "MICROPLAN_MO_01_04_02_21_KARLOKEN_GEDEBO158",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_20_KARLOKEN_GEDOBO157",
        "name": "MICROPLAN_MO_01_04_02_20_KARLOKEN_GEDOBO157",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_19_KARLOKEN_GEDOBO156",
        "name": "MICROPLAN_MO_01_04_02_19_KARLOKEN_GEDOBO156",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_18_KARLOKEN_GEDEBO155",
        "name": "MICROPLAN_MO_01_04_02_18_KARLOKEN_GEDEBO155",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_17_KARLOKEN_GEDEBO154",
        "name": "MICROPLAN_MO_01_04_02_17_KARLOKEN_GEDEBO154",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_16_KARLOKEN_DORROB153",
        "name": "MICROPLAN_MO_01_04_02_16_KARLOKEN_DORROB153",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_15_KARLOKEN_DORROB152",
        "name": "MICROPLAN_MO_01_04_02_15_KARLOKEN_DORROB152",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_14_KARLOKEN_DORROB151",
        "name": "MICROPLAN_MO_01_04_02_14_KARLOKEN_DORROB151",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_13_KARLOKEN_DORROB150",
        "name": "MICROPLAN_MO_01_04_02_13_KARLOKEN_DORROB150",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_12_KARLOKEN_DORROB149",
        "name": "MICROPLAN_MO_01_04_02_12_KARLOKEN_DORROB149",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_11_KARLOKEN_DORROB148",
        "name": "MICROPLAN_MO_01_04_02_11_KARLOKEN_DORROB148",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_10_KARLOKEN_GEDEBO147",
        "name": "MICROPLAN_MO_01_04_02_10_KARLOKEN_GEDEBO147",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_09_KARLOKEN_GEDEBO146",
        "name": "MICROPLAN_MO_01_04_02_09_KARLOKEN_GEDEBO146",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_08_KARLOKEN_GEDEBO145",
        "name": "MICROPLAN_MO_01_04_02_08_KARLOKEN_GEDEBO145",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_07_KARLOKEN_KARLOK144",
        "name": "MICROPLAN_MO_01_04_02_07_KARLOKEN_KARLOK144",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_06_KARLOKEN_GIO_VA143",
        "name": "MICROPLAN_MO_01_04_02_06_KARLOKEN_GIO_VA143",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_05_KARLOKEN_GEDERO142",
        "name": "MICROPLAN_MO_01_04_02_05_KARLOKEN_GEDERO142",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_04_KARLOKEN_GEDERO141",
        "name": "MICROPLAN_MO_01_04_02_04_KARLOKEN_GEDERO141",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_03_KARLOKEN_GEAKEN",
        "name": "MICROPLAN_MO_01_04_02_03_KARLOKEN_GEAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_02_KARLOKEN",
        "name": "MICROPLAN_MO_01_04_02_02_KARLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_02_01__13",
        "name": "MICROPLAN_MO_01_04_02_01__13",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_04_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_04_01__12",
        "name": "MICROPLAN_MO_01_04_01__12",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_04_KALUWAY__1",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_HARPER",
        "name": "MICROPLAN_MO_01_03_HARPER",
        "type": "District",
        "parent": "MICROPLAN_MO_01_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "name": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_07_09_ROCK_TOWN_LITTL136",
        "name": "MICROPLAN_MO_01_03_07_09_ROCK_TOWN_LITTL136",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_08_ROCK_TOWN_LITTL135",
        "name": "MICROPLAN_MO_01_03_07_08_ROCK_TOWN_LITTL135",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_07_ROCK_TOWN_LITTL134",
        "name": "MICROPLAN_MO_01_03_07_07_ROCK_TOWN_LITTL134",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_06_ROCK_TOWN_NMAKL133",
        "name": "MICROPLAN_MO_01_03_07_06_ROCK_TOWN_NMAKL133",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_05_ROCK_TOWN_MIDDL132",
        "name": "MICROPLAN_MO_01_03_07_05_ROCK_TOWN_MIDDL132",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_04_ROCK_TOWN_GYIGB131",
        "name": "MICROPLAN_MO_01_03_07_04_ROCK_TOWN_GYIGB131",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_03_ROCK_TOWN_ROCK_130",
        "name": "MICROPLAN_MO_01_03_07_03_ROCK_TOWN_ROCK_130",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_02_ROCK_TOWN",
        "name": "MICROPLAN_MO_01_03_07_02_ROCK_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_07_01__11",
        "name": "MICROPLAN_MO_01_03_07_01__11",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_07_ROCK_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "name": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_06_33_JJ_DOSSEN_COMMU127",
        "name": "MICROPLAN_MO_01_03_06_33_JJ_DOSSEN_COMMU127",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_32_JJ_DOSSEN_COMMU126",
        "name": "MICROPLAN_MO_01_03_06_32_JJ_DOSSEN_COMMU126",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_31_JJ_DOSSEN_COMMU125",
        "name": "MICROPLAN_MO_01_03_06_31_JJ_DOSSEN_COMMU125",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_30_JJ_DOSSEN_COMMU124",
        "name": "MICROPLAN_MO_01_03_06_30_JJ_DOSSEN_COMMU124",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_29_JJ_DOSSEN_COMMU123",
        "name": "MICROPLAN_MO_01_03_06_29_JJ_DOSSEN_COMMU123",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_28_JJ_DOSSEN_COMMU122",
        "name": "MICROPLAN_MO_01_03_06_28_JJ_DOSSEN_COMMU122",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_27_JJ_DOSSEN_COMMU121",
        "name": "MICROPLAN_MO_01_03_06_27_JJ_DOSSEN_COMMU121",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_26_JJ_DOSSEN_COMMU120",
        "name": "MICROPLAN_MO_01_03_06_26_JJ_DOSSEN_COMMU120",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_25_JJ_DOSSEN_COMMU119",
        "name": "MICROPLAN_MO_01_03_06_25_JJ_DOSSEN_COMMU119",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_24_JJ_DOSSEN_COMMU118",
        "name": "MICROPLAN_MO_01_03_06_24_JJ_DOSSEN_COMMU118",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_23_JJ_DOSSEN_COMMU117",
        "name": "MICROPLAN_MO_01_03_06_23_JJ_DOSSEN_COMMU117",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_22_JJ_DOSSEN_COMMU116",
        "name": "MICROPLAN_MO_01_03_06_22_JJ_DOSSEN_COMMU116",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_21_JJ_DOSSEN_COMMU115",
        "name": "MICROPLAN_MO_01_03_06_21_JJ_DOSSEN_COMMU115",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_20_JJ_DOSSEN_COMMU114",
        "name": "MICROPLAN_MO_01_03_06_20_JJ_DOSSEN_COMMU114",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_19_JJ_DOSSEN_COMMU113",
        "name": "MICROPLAN_MO_01_03_06_19_JJ_DOSSEN_COMMU113",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_18_JJ_DOSSEN_COMMU112",
        "name": "MICROPLAN_MO_01_03_06_18_JJ_DOSSEN_COMMU112",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_17_JJ_DOSSEN_COMMU111",
        "name": "MICROPLAN_MO_01_03_06_17_JJ_DOSSEN_COMMU111",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_16_JJ_DOSSEN_COMMU110",
        "name": "MICROPLAN_MO_01_03_06_16_JJ_DOSSEN_COMMU110",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_15_JJ_DOSSEN_COMMU109",
        "name": "MICROPLAN_MO_01_03_06_15_JJ_DOSSEN_COMMU109",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_14_JJ_DOSSEN_COMMU108",
        "name": "MICROPLAN_MO_01_03_06_14_JJ_DOSSEN_COMMU108",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_13_JJ_DOSSEN_COMMU107",
        "name": "MICROPLAN_MO_01_03_06_13_JJ_DOSSEN_COMMU107",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_12_JJ_DOSSEN_COMMU106",
        "name": "MICROPLAN_MO_01_03_06_12_JJ_DOSSEN_COMMU106",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_11_JJ_DOSSEN_COMMU105",
        "name": "MICROPLAN_MO_01_03_06_11_JJ_DOSSEN_COMMU105",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_10_JJ_DOSSEN_COMMU104",
        "name": "MICROPLAN_MO_01_03_06_10_JJ_DOSSEN_COMMU104",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_09_JJ_DOSSEN_COMMU103",
        "name": "MICROPLAN_MO_01_03_06_09_JJ_DOSSEN_COMMU103",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_08_JJ_DOSSEN_COMMU102",
        "name": "MICROPLAN_MO_01_03_06_08_JJ_DOSSEN_COMMU102",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_07_JJ_DOSSEN_COMMU101",
        "name": "MICROPLAN_MO_01_03_06_07_JJ_DOSSEN_COMMU101",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_06_JJ_DOSSEN_COMMU100",
        "name": "MICROPLAN_MO_01_03_06_06_JJ_DOSSEN_COMMU100",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_05_JJ_DOSSEN_COMMU99",
        "name": "MICROPLAN_MO_01_03_06_05_JJ_DOSSEN_COMMU99",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_04_JJ_DOSSEN_COMMU98",
        "name": "MICROPLAN_MO_01_03_06_04_JJ_DOSSEN_COMMU98",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_03_JJ_DOSSEN_COMMU97",
        "name": "MICROPLAN_MO_01_03_06_03_JJ_DOSSEN_COMMU97",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_02_JJ_DOSSEN_COMMU96",
        "name": "MICROPLAN_MO_01_03_06_02_JJ_DOSSEN_COMMU96",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_06_01__10",
        "name": "MICROPLAN_MO_01_03_06_01__10",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "name": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_05_14_PULLAH_COMMUNIT94",
        "name": "MICROPLAN_MO_01_03_05_14_PULLAH_COMMUNIT94",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_13_PULLAH_COMMUNIT93",
        "name": "MICROPLAN_MO_01_03_05_13_PULLAH_COMMUNIT93",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_12_PULLAH_COMMUNIT92",
        "name": "MICROPLAN_MO_01_03_05_12_PULLAH_COMMUNIT92",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_11_PULLAH_COMMUNIT91",
        "name": "MICROPLAN_MO_01_03_05_11_PULLAH_COMMUNIT91",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_10_PULLAH_COMMUNIT90",
        "name": "MICROPLAN_MO_01_03_05_10_PULLAH_COMMUNIT90",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_09_PULLAH_COMMUNIT89",
        "name": "MICROPLAN_MO_01_03_05_09_PULLAH_COMMUNIT89",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_08_PULLAH_COMMUNIT88",
        "name": "MICROPLAN_MO_01_03_05_08_PULLAH_COMMUNIT88",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_07_PULLAH_COMMUNIT87",
        "name": "MICROPLAN_MO_01_03_05_07_PULLAH_COMMUNIT87",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_06_PULLAH_COMMUNIT86",
        "name": "MICROPLAN_MO_01_03_05_06_PULLAH_COMMUNIT86",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_05_PULLAH_COMMUNIT85",
        "name": "MICROPLAN_MO_01_03_05_05_PULLAH_COMMUNIT85",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_04_PULLAH_COMMUNIT84",
        "name": "MICROPLAN_MO_01_03_05_04_PULLAH_COMMUNIT84",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_03_PULLAH_COMMUNIT83",
        "name": "MICROPLAN_MO_01_03_05_03_PULLAH_COMMUNIT83",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_02_PULLAH_COMMUNIT82",
        "name": "MICROPLAN_MO_01_03_05_02_PULLAH_COMMUNIT82",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_05_01__09",
        "name": "MICROPLAN_MO_01_03_05_01__09",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "name": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_04_07_CAVALLA_TOWN_KA80",
        "name": "MICROPLAN_MO_01_03_04_07_CAVALLA_TOWN_KA80",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_06_CAVALLA_TOWN_KA79",
        "name": "MICROPLAN_MO_01_03_04_06_CAVALLA_TOWN_KA79",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_05_CAVALLA_TOWN_SE78",
        "name": "MICROPLAN_MO_01_03_04_05_CAVALLA_TOWN_SE78",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_04_CAVALLA_TOWN_WO77",
        "name": "MICROPLAN_MO_01_03_04_04_CAVALLA_TOWN_WO77",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_03_CAVALLA_TOWN_CA76",
        "name": "MICROPLAN_MO_01_03_04_03_CAVALLA_TOWN_CA76",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_02_CAVALLA_TOWN",
        "name": "MICROPLAN_MO_01_03_04_02_CAVALLA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_04_01__08",
        "name": "MICROPLAN_MO_01_03_04_01__08",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "name": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_03_12_YOOKUDI_TANGBAL73",
        "name": "MICROPLAN_MO_01_03_03_12_YOOKUDI_TANGBAL73",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_11_YOOKUDI_JEDEBIA72",
        "name": "MICROPLAN_MO_01_03_03_11_YOOKUDI_JEDEBIA72",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_10_YOOKUDI_WOLIPLK71",
        "name": "MICROPLAN_MO_01_03_03_10_YOOKUDI_WOLIPLK71",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_09_YOOKUDI_DUOKUDI",
        "name": "MICROPLAN_MO_01_03_03_09_YOOKUDI_DUOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_08_YOOKUDI_POOSIKE69",
        "name": "MICROPLAN_MO_01_03_03_08_YOOKUDI_POOSIKE69",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_07_YOOKUDI_KUDEKUD68",
        "name": "MICROPLAN_MO_01_03_03_07_YOOKUDI_KUDEKUD68",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_06_YOOKUDI_YOOPIDI",
        "name": "MICROPLAN_MO_01_03_03_06_YOOKUDI_YOOPIDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_05_YOOKUDI_LIBSUCO",
        "name": "MICROPLAN_MO_01_03_03_05_YOOKUDI_LIBSUCO",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_04_YOOKUDI_PEDEBO",
        "name": "MICROPLAN_MO_01_03_03_04_YOOKUDI_PEDEBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_03_YOOKUDI_YOOKUDI",
        "name": "MICROPLAN_MO_01_03_03_03_YOOKUDI_YOOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_02_YOOKUDI",
        "name": "MICROPLAN_MO_01_03_03_02_YOOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_03_01__07",
        "name": "MICROPLAN_MO_01_03_03_01__07",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "name": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_03_02_06_FISH_TOWN_TUPAK61",
        "name": "MICROPLAN_MO_01_03_02_06_FISH_TOWN_TUPAK61",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_02_05_FISH_TOWN_BOHLU60",
        "name": "MICROPLAN_MO_01_03_02_05_FISH_TOWN_BOHLU60",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_02_04_FISH_TOWN_PONWI59",
        "name": "MICROPLAN_MO_01_03_02_04_FISH_TOWN_PONWI59",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_02_03_FISH_TOWN_GBOKU58",
        "name": "MICROPLAN_MO_01_03_02_03_FISH_TOWN_GBOKU58",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_02_02_FISH_TOWN_FISH_57",
        "name": "MICROPLAN_MO_01_03_02_02_FISH_TOWN_FISH_57",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_02_01__06",
        "name": "MICROPLAN_MO_01_03_02_01__06",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_03_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_03_01__05",
        "name": "MICROPLAN_MO_01_03_01__05",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_03_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_02_BARROBO_WHOJAH",
        "name": "MICROPLAN_MO_01_02_BARROBO_WHOJAH",
        "type": "District",
        "parent": "MICROPLAN_MO_01_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "name": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_02_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_02_04_08_NEWAKEN_SEATOR",
        "name": "MICROPLAN_MO_01_02_04_08_NEWAKEN_SEATOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_07_NEWAKEN_SAWTOKE53",
        "name": "MICROPLAN_MO_01_02_04_07_NEWAKEN_SAWTOKE53",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_06_NEWAKEN_SARGLOK52",
        "name": "MICROPLAN_MO_01_02_04_06_NEWAKEN_SARGLOK52",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_05_NEWAKEN_JARGLOK51",
        "name": "MICROPLAN_MO_01_02_04_05_NEWAKEN_JARGLOK51",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_04_NEWAKEN_SAWTOKE50",
        "name": "MICROPLAN_MO_01_02_04_04_NEWAKEN_SAWTOKE50",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_03_NEWAKEN_SOLOKEN",
        "name": "MICROPLAN_MO_01_02_04_03_NEWAKEN_SOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_02_NEWAKEN_NEWAKEN",
        "name": "MICROPLAN_MO_01_02_04_02_NEWAKEN_NEWAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_04_01__04",
        "name": "MICROPLAN_MO_01_02_04_01__04",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "name": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_02_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_02_03_14_JULUKEN_SMALL_J46",
        "name": "MICROPLAN_MO_01_02_03_14_JULUKEN_SMALL_J46",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_13_JULUKEN_BESSIKE45",
        "name": "MICROPLAN_MO_01_02_03_13_JULUKEN_BESSIKE45",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_12_JULUKEN_FULA_CA44",
        "name": "MICROPLAN_MO_01_02_03_12_JULUKEN_FULA_CA44",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_11_JULUKEN_TAPOLIN43",
        "name": "MICROPLAN_MO_01_02_03_11_JULUKEN_TAPOLIN43",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_10_JULUKEN_TUGBAKE42",
        "name": "MICROPLAN_MO_01_02_03_10_JULUKEN_TUGBAKE42",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_09_JULUKEN_KPLOWAK41",
        "name": "MICROPLAN_MO_01_02_03_09_JULUKEN_KPLOWAK41",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_08_JULUKEN_GORTIKE40",
        "name": "MICROPLAN_MO_01_02_03_08_JULUKEN_GORTIKE40",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_07_JULUKEN_GORTUKE39",
        "name": "MICROPLAN_MO_01_02_03_07_JULUKEN_GORTUKE39",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_06_JULUKEN_MARTUKE38",
        "name": "MICROPLAN_MO_01_02_03_06_JULUKEN_MARTUKE38",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_05_JULUKEN_JULUKEN37",
        "name": "MICROPLAN_MO_01_02_03_05_JULUKEN_JULUKEN37",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_04_JULUKEN_DWEJAH",
        "name": "MICROPLAN_MO_01_02_03_04_JULUKEN_DWEJAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_03_JULUKEN_JULUKEN",
        "name": "MICROPLAN_MO_01_02_03_03_JULUKEN_JULUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_02_JULUKEN",
        "name": "MICROPLAN_MO_01_02_03_02_JULUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_03_01__03",
        "name": "MICROPLAN_MO_01_02_03_01__03",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "name": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_02_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_02_02_09_GLOFAKEN_GWELEK32",
        "name": "MICROPLAN_MO_01_02_02_09_GLOFAKEN_GWELEK32",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_08_GLOFAKEN_GESSAK31",
        "name": "MICROPLAN_MO_01_02_02_08_GLOFAKEN_GESSAK31",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_07_GLOFAKEN_GBAKEN",
        "name": "MICROPLAN_MO_01_02_02_07_GLOFAKEN_GBAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_06_GLOFAKEN_SAWKEN",
        "name": "MICROPLAN_MO_01_02_02_06_GLOFAKEN_SAWKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_05_GLOFAKEN_CHILIK28",
        "name": "MICROPLAN_MO_01_02_02_05_GLOFAKEN_CHILIK28",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_04_GLOFAKEN_DUGBOK27",
        "name": "MICROPLAN_MO_01_02_02_04_GLOFAKEN_DUGBOK27",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_03_GLOFAKEN_GLOFAK26",
        "name": "MICROPLAN_MO_01_02_02_03_GLOFAKEN_GLOFAK26",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_02_GLOFAKEN",
        "name": "MICROPLAN_MO_01_02_02_02_GLOFAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_02_01__02",
        "name": "MICROPLAN_MO_01_02_02_01__02",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_02_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_02_01__01",
        "name": "MICROPLAN_MO_01_02_01__01",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_02_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_01_BARROBO_FARJAH",
        "name": "MICROPLAN_MO_01_01_BARROBO_FARJAH",
        "type": "District",
        "parent": "MICROPLAN_MO_01_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "name": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_01_BARROBO_FARJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_01_02_08_FELOKEN_KPANNIS22",
        "name": "MICROPLAN_MO_01_01_02_08_FELOKEN_KPANNIS22",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_07_FELOKEN_GBARKLI21",
        "name": "MICROPLAN_MO_01_01_02_07_FELOKEN_GBARKLI21",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_06_FELOKEN_BIG_JAY20",
        "name": "MICROPLAN_MO_01_01_02_06_FELOKEN_BIG_JAY20",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_05_FELOKEN_FELOKEN",
        "name": "MICROPLAN_MO_01_01_02_05_FELOKEN_FELOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_04_FELOKEN_BULTIKE18",
        "name": "MICROPLAN_MO_01_01_02_04_FELOKEN_BULTIKE18",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_03_FELOKEN_FISHTOW17",
        "name": "MICROPLAN_MO_01_01_02_03_FELOKEN_FISHTOW17",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_02_FELOKEN",
        "name": "MICROPLAN_MO_01_01_02_02_FELOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_02_01_",
        "name": "MICROPLAN_MO_01_01_02_01_",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_02_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "name": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_01_01_BARROBO_FARJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_01_01_09_GBARWILIKEN_TEN14",
        "name": "MICROPLAN_MO_01_01_01_09_GBARWILIKEN_TEN14",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_08_GBARWILIKEN_KAR13",
        "name": "MICROPLAN_MO_01_01_01_08_GBARWILIKEN_KAR13",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_07_GBARWILIKEN_GBA12",
        "name": "MICROPLAN_MO_01_01_01_07_GBARWILIKEN_GBA12",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_06_GBARWILIKEN_GUT11",
        "name": "MICROPLAN_MO_01_01_01_06_GBARWILIKEN_GUT11",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_05_GBARWILIKEN_ROC10",
        "name": "MICROPLAN_MO_01_01_01_05_GBARWILIKEN_ROC10",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_04_GBARWILIKEN_TEA9",
        "name": "MICROPLAN_MO_01_01_01_04_GBARWILIKEN_TEA9",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_03_GBARWILIKEN_MAR8",
        "name": "MICROPLAN_MO_01_01_01_03_GBARWILIKEN_MAR8",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_02_GBARWILIKEN_GWI7",
        "name": "MICROPLAN_MO_01_01_01_02_GBARWILIKEN_GWI7",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_01_01_01_01_GBARWILIKEN",
        "name": "MICROPLAN_MO_01_01_01_01_GBARWILIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_01_01_01_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_06_SINOE",
        "name": "MICROPLAN_MO_06_SINOE",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_07_JEDEPO",
        "name": "MICROPLAN_MO_06_07_JEDEPO",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_07_03_JOKOKEN_CLINIC",
        "name": "MICROPLAN_MO_06_07_03_JOKOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_07_JEDEPO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_07_02_DUCORFREE_CLINIC",
        "name": "MICROPLAN_MO_06_07_02_DUCORFREE_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_07_JEDEPO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_07_01_DOODWICKEN_CLINIC",
        "name": "MICROPLAN_MO_06_07_01_DOODWICKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_07_JEDEPO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_06_JEADE",
        "name": "MICROPLAN_MO_06_06_JEADE",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_06_04_TUZON",
        "name": "MICROPLAN_MO_06_06_04_TUZON",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_06_JEADE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_06_03_DIYANKPO",
        "name": "MICROPLAN_MO_06_06_03_DIYANKPO",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_06_JEADE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_06_02_GOVERNMENT_CAMP",
        "name": "MICROPLAN_MO_06_06_02_GOVERNMENT_CAMP",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_06_JEADE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_06_01__122",
        "name": "MICROPLAN_MO_06_06_01__122",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_06_JEADE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_05_GREENVILLE",
        "name": "MICROPLAN_MO_06_05_GREENVILLE",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_05_04_F_J_GRANTE_HOSPITAL",
        "name": "MICROPLAN_MO_06_05_04_F_J_GRANTE_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_05_GREENVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "name": "MICROPLAN_MO_06_05_03_ST__JOSEPH_CATHOLIC_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_05_GREENVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_05_02_LEXINGTON_CLINIC",
        "name": "MICROPLAN_MO_06_05_02_LEXINGTON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_05_GREENVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_05_01__118",
        "name": "MICROPLAN_MO_06_05_01__118",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_05_GREENVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_04_GBLONEE",
        "name": "MICROPLAN_MO_06_04_GBLONEE",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_04_02_TOGBAVILLE_CLINIC",
        "name": "MICROPLAN_MO_06_04_02_TOGBAVILLE_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_04_GBLONEE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_04_01__116",
        "name": "MICROPLAN_MO_06_04_01__116",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_04_GBLONEE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "name": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_07_MENWAH_WALKER_CLINIC",
        "name": "MICROPLAN_MO_06_03_07_MENWAH_WALKER_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_06_JSD_CLINIC",
        "name": "MICROPLAN_MO_06_03_06_JSD_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_05_KARQUEKPO_CLINIC",
        "name": "MICROPLAN_MO_06_03_05_KARQUEKPO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_04_JUARYEN_CLINIC",
        "name": "MICROPLAN_MO_06_03_04_JUARYEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_03_EDWARD_MEMORIAL_CLINIC",
        "name": "MICROPLAN_MO_06_03_03_EDWARD_MEMORIAL_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_02_KWITATUZON_CLINIC",
        "name": "MICROPLAN_MO_06_03_02_KWITATUZON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_03_01__109",
        "name": "MICROPLAN_MO_06_03_01__109",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_03_DUGBE_RIVER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_02_BUTAW",
        "name": "MICROPLAN_MO_06_02_BUTAW",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_02_03_GRIGSBY_FARM_CLINIC",
        "name": "MICROPLAN_MO_06_02_03_GRIGSBY_FARM_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_02_BUTAW",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_02_02_BUTAW_CLINIC",
        "name": "MICROPLAN_MO_06_02_02_BUTAW_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_02_BUTAW",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_02_01__106",
        "name": "MICROPLAN_MO_06_02_01__106",
        "type": "Locality",
        "parent": "MICROPLAN_MO_06_02_BUTAW",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_06_01__105",
        "name": "MICROPLAN_MO_06_01__105",
        "type": "District",
        "parent": "MICROPLAN_MO_06_SINOE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_GBARPOLU",
        "name": "MICROPLAN_MO_05_GBARPOLU",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_06_KUNGBOR",
        "name": "MICROPLAN_MO_05_06_KUNGBOR",
        "type": "District",
        "parent": "MICROPLAN_MO_05_GBARPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_06_02_KUNGBOR_CLINIC",
        "name": "MICROPLAN_MO_05_06_02_KUNGBOR_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_06_KUNGBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_06_01__103",
        "name": "MICROPLAN_MO_05_06_01__103",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_06_KUNGBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_GBARMA",
        "name": "MICROPLAN_MO_05_05_GBARMA",
        "type": "District",
        "parent": "MICROPLAN_MO_05_GBARPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_05_YANGARYAH_CLINIC",
        "name": "MICROPLAN_MO_05_05_05_YANGARYAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_04_WEASUA_CLINIC",
        "name": "MICROPLAN_MO_05_05_04_WEASUA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_03_GBARMA_CLINIC",
        "name": "MICROPLAN_MO_05_05_03_GBARMA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_02_TARKPOIMA_CLINIC",
        "name": "MICROPLAN_MO_05_05_02_TARKPOIMA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_05_01__98",
        "name": "MICROPLAN_MO_05_05_01__98",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_05_GBARMA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_BOPOLU",
        "name": "MICROPLAN_MO_05_04_BOPOLU",
        "type": "District",
        "parent": "MICROPLAN_MO_05_GBARPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_07_EMIRATES_HOSPITAL",
        "name": "MICROPLAN_MO_05_04_07_EMIRATES_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_06_BAMBUTA_CLINIC",
        "name": "MICROPLAN_MO_05_04_06_BAMBUTA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_05_GOKALA_CLINIC",
        "name": "MICROPLAN_MO_05_04_05_GOKALA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_04_GBARYAMAH_CLINIC",
        "name": "MICROPLAN_MO_05_04_04_GBARYAMAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_03_HENRY_TOWN_CLINIC",
        "name": "MICROPLAN_MO_05_04_03_HENRY_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_02_TOTOQUELEH_CLINIC",
        "name": "MICROPLAN_MO_05_04_02_TOTOQUELEH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_04_01__91",
        "name": "MICROPLAN_MO_05_04_01__91",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_04_BOPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_BOKOMU",
        "name": "MICROPLAN_MO_05_03_BOKOMU",
        "type": "District",
        "parent": "MICROPLAN_MO_05_GBARPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_02_GBARNGAY_CLINIC",
        "name": "MICROPLAN_MO_05_03_02_GBARNGAY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_BOKOMU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_03_01__89",
        "name": "MICROPLAN_MO_05_03_01__89",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_03_BOKOMU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_02_BELLEH",
        "name": "MICROPLAN_MO_05_02_BELLEH",
        "type": "District",
        "parent": "MICROPLAN_MO_05_GBARPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_02_03_KONDESU_CLINIC",
        "name": "MICROPLAN_MO_05_02_03_KONDESU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_02_BELLEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_02_02_FASSAMA_CLINIC",
        "name": "MICROPLAN_MO_05_02_02_FASSAMA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_02_BELLEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_02_01__86",
        "name": "MICROPLAN_MO_05_02_01__86",
        "type": "Locality",
        "parent": "MICROPLAN_MO_05_02_BELLEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_05_01__85",
        "name": "MICROPLAN_MO_05_01__85",
        "type": "District",
        "parent": "MICROPLAN_MO_05_GBARPOLU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_GRAND_GEDEH",
        "name": "MICROPLAN_MO_04_GRAND_GEDEH",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_07_TCHIEN",
        "name": "MICROPLAN_MO_04_07_TCHIEN",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_07_05_TOFFOI_CLINIC",
        "name": "MICROPLAN_MO_04_07_05_TOFFOI_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_07_04_KANNEH_COMMUNITY_CLINIC",
        "name": "MICROPLAN_MO_04_07_04_KANNEH_COMMUNITY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_07_03_GORBOWRAGBA",
        "name": "MICROPLAN_MO_04_07_03_GORBOWRAGBA",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "name": "MICROPLAN_MO_04_07_02_MARTHA_TUBMAN_MEMORIAL_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_07_01__80",
        "name": "MICROPLAN_MO_04_07_01__80",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_07_TCHIEN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_06_PUTU",
        "name": "MICROPLAN_MO_04_06_PUTU",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_06_03_PENNOKON",
        "name": "MICROPLAN_MO_04_06_03_PENNOKON",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_06_PUTU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_06_02_JARWODEE_CLINIC",
        "name": "MICROPLAN_MO_04_06_02_JARWODEE_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_06_PUTU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_06_01__77",
        "name": "MICROPLAN_MO_04_06_01__77",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_06_PUTU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_KONOBO",
        "name": "MICROPLAN_MO_04_05_KONOBO",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_03_BOUNDARY_CLINIC",
        "name": "MICROPLAN_MO_04_05_03_BOUNDARY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_KONOBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_02_KONOBO_HEALTH_CENTER",
        "name": "MICROPLAN_MO_04_05_02_KONOBO_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_KONOBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_05_01__75",
        "name": "MICROPLAN_MO_04_05_01__75",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_05_KONOBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_GBAO",
        "name": "MICROPLAN_MO_04_04_GBAO",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "name": "MICROPLAN_MO_04_04_04_GBOE_GEEWON_COMMUNITY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_GBAO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_03_POLAR_CLINIC",
        "name": "MICROPLAN_MO_04_04_03_POLAR_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_GBAO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_02_GBARZON_HEALTH_CENTER",
        "name": "MICROPLAN_MO_04_04_02_GBARZON_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_GBAO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_04_01__71",
        "name": "MICROPLAN_MO_04_04_01__71",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_04_GBAO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_CAVALLA",
        "name": "MICROPLAN_MO_04_03_CAVALLA",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_07_GBOLEKEN_CLINIC",
        "name": "MICROPLAN_MO_04_03_07_GBOLEKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_06_ZAI_CLINIC",
        "name": "MICROPLAN_MO_04_03_06_ZAI_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_05_TUZON_CLINIC",
        "name": "MICROPLAN_MO_04_03_05_TUZON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_04_JANZON_CLINIC",
        "name": "MICROPLAN_MO_04_03_04_JANZON_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_03_BEH_TOWN_CLINIC",
        "name": "MICROPLAN_MO_04_03_03_BEH_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_02_BARGBLOR_CLINIC",
        "name": "MICROPLAN_MO_04_03_02_BARGBLOR_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_03_01__64",
        "name": "MICROPLAN_MO_04_03_01__64",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_03_CAVALLA",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_B_HAI",
        "name": "MICROPLAN_MO_04_02_B_HAI",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_05_B_HAI_TARWAY_CLINIC",
        "name": "MICROPLAN_MO_04_02_05_B_HAI_TARWAY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_04_TOE_TOWN_CLINIC",
        "name": "MICROPLAN_MO_04_02_04_TOE_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_03_DUOGEE_CLINIC",
        "name": "MICROPLAN_MO_04_02_03_DUOGEE_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_02_DOUGEE_TOWN_CLINIC",
        "name": "MICROPLAN_MO_04_02_02_DOUGEE_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_02_01__59",
        "name": "MICROPLAN_MO_04_02_01__59",
        "type": "Locality",
        "parent": "MICROPLAN_MO_04_02_B_HAI",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_04_01__58",
        "name": "MICROPLAN_MO_04_01__58",
        "type": "District",
        "parent": "MICROPLAN_MO_04_GRAND_GEDEH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_GRAND_KRU",
        "name": "MICROPLAN_MO_03_GRAND_KRU",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_TREHN",
        "name": "MICROPLAN_MO_03_06_TREHN",
        "type": "District",
        "parent": "MICROPLAN_MO_03_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_08_GBLEBO_CLINIC",
        "name": "MICROPLAN_MO_03_06_08_GBLEBO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_07_NEWAKEN_CLINIC",
        "name": "MICROPLAN_MO_03_06_07_NEWAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_06_BEHWAN_HEALTH_CENTER",
        "name": "MICROPLAN_MO_03_06_06_BEHWAN_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_05_NIFA_CLINIC",
        "name": "MICROPLAN_MO_03_06_05_NIFA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_04_NEMIAH_CLINIC",
        "name": "MICROPLAN_MO_03_06_04_NEMIAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_03_GENOYAH_CLINIC",
        "name": "MICROPLAN_MO_03_06_03_GENOYAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_02_GARRAWAY_CLINIC",
        "name": "MICROPLAN_MO_03_06_02_GARRAWAY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_06_01__50",
        "name": "MICROPLAN_MO_03_06_01__50",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_06_TREHN",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_05_LOWER_JLOH",
        "name": "MICROPLAN_MO_03_05_LOWER_JLOH",
        "type": "District",
        "parent": "MICROPLAN_MO_03_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_05_04_NIFU_CLINIC",
        "name": "MICROPLAN_MO_03_05_04_NIFU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_05_03_SOBO_COMMUNITY_CLINIC",
        "name": "MICROPLAN_MO_03_05_03_SOBO_COMMUNITY_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_05_02_SASS_TOWN_HOSPITAL",
        "name": "MICROPLAN_MO_03_05_02_SASS_TOWN_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_05_01__46",
        "name": "MICROPLAN_MO_03_05_01__46",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_05_LOWER_JLOH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_04_DORBOR",
        "name": "MICROPLAN_MO_03_04_DORBOR",
        "type": "District",
        "parent": "MICROPLAN_MO_03_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_04_04_DOESWEN_CLINIC",
        "name": "MICROPLAN_MO_03_04_04_DOESWEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_04_03_BOLLOH_NEWTOWN",
        "name": "MICROPLAN_MO_03_04_03_BOLLOH_NEWTOWN",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_04_02_NYANKUNPO_CLINIC",
        "name": "MICROPLAN_MO_03_04_02_NYANKUNPO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_04_01__42",
        "name": "MICROPLAN_MO_03_04_01__42",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_04_DORBOR",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_BUAH",
        "name": "MICROPLAN_MO_03_03_BUAH",
        "type": "District",
        "parent": "MICROPLAN_MO_03_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_05_PONNOKEN_CLINIC",
        "name": "MICROPLAN_MO_03_03_05_PONNOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_04_TARLU_CLINIC",
        "name": "MICROPLAN_MO_03_03_04_TARLU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_03_DWEKEN_CLINIC",
        "name": "MICROPLAN_MO_03_03_03_DWEKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_02_BUAH_HEALTH_CENTER",
        "name": "MICROPLAN_MO_03_03_02_BUAH_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_03_01__37",
        "name": "MICROPLAN_MO_03_03_01__37",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_03_BUAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "name": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "type": "District",
        "parent": "MICROPLAN_MO_03_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_07_GBANKEN_CLINIC",
        "name": "MICROPLAN_MO_03_02_07_GBANKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_06_RALLY_TIME_HOSPITAL",
        "name": "MICROPLAN_MO_03_02_06_RALLY_TIME_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "name": "MICROPLAN_MO_03_02_05_BARCLAYVILLE_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_04_JUDUKEN_CLINIC",
        "name": "MICROPLAN_MO_03_02_04_JUDUKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_03_PICNECESS_CLINIC",
        "name": "MICROPLAN_MO_03_02_03_PICNECESS_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_02_GBALAKPO_CLINIC",
        "name": "MICROPLAN_MO_03_02_02_GBALAKPO_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_02_01__30",
        "name": "MICROPLAN_MO_03_02_01__30",
        "type": "Locality",
        "parent": "MICROPLAN_MO_03_02_BARCLAYVILLE",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_03_01__29",
        "name": "MICROPLAN_MO_03_01__29",
        "type": "District",
        "parent": "MICROPLAN_MO_03_GRAND_KRU",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_MARYLAND",
        "name": "MICROPLAN_MO_02_MARYLAND",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_PLEEBO",
        "name": "MICROPLAN_MO_02_07_PLEEBO",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_06_PLEEBO_HEALTH_CENTER",
        "name": "MICROPLAN_MO_02_07_06_PLEEBO_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_07_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_05_GBLOKEN_CLINIC",
        "name": "MICROPLAN_MO_02_07_05_GBLOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_07_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_04_OLD_SODOKEN_CLINIC",
        "name": "MICROPLAN_MO_02_07_04_OLD_SODOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_07_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "name": "MICROPLAN_MO_02_07_03_ROCKTOWN_KUNOKUDI__CLINIC_",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_07_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_02_BARRAKEN_CLINIC__FIXED_DP_",
        "name": "MICROPLAN_MO_02_07_02_BARRAKEN_CLINIC__FIXED_DP_",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_07_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_07_01__23",
        "name": "MICROPLAN_MO_02_07_01__23",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_07_PLEEBO",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_KALUWAY__2",
        "name": "MICROPLAN_MO_02_06_KALUWAY__2",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_04_YEDIAKEN_CLINIC",
        "name": "MICROPLAN_MO_02_06_04_YEDIAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_03_MANOLU_CLINIC",
        "name": "MICROPLAN_MO_02_06_03_MANOLU_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_02_BONIKEN",
        "name": "MICROPLAN_MO_02_06_02_BONIKEN",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_06_01__19",
        "name": "MICROPLAN_MO_02_06_01__19",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_06_KALUWAY__2",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_KALUWAY__1",
        "name": "MICROPLAN_MO_02_05_KALUWAY__1",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_03_POUGBAKEN_CLINIC",
        "name": "MICROPLAN_MO_02_05_03_POUGBAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_KALUWAY__1",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "name": "MICROPLAN_MO_02_05_02_EDITH_H__WALLACE_HEALTH_CENTER",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_KALUWAY__1",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_05_01__16",
        "name": "MICROPLAN_MO_02_05_01__16",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_05_KALUWAY__1",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_HARPER",
        "name": "MICROPLAN_MO_02_04_HARPER",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_07_ROCK_TOWN_CLINIC",
        "name": "MICROPLAN_MO_02_04_07_ROCK_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "name": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_06_21_JJ_DOSSEN_COMMUNITY_BISHOP_HILLS",
        "name": "MICROPLAN_MO_02_04_06_21_JJ_DOSSEN_COMMUNITY_BISHOP_HILLS",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_20_JJ_DOSSEN_COMMUNITY_HENCE_STREET",
        "name": "MICROPLAN_MO_02_04_06_20_JJ_DOSSEN_COMMUNITY_HENCE_STREET",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_19_JJ_DOSSEN_COMMUNITY_BONGAR_HILLS",
        "name": "MICROPLAN_MO_02_04_06_19_JJ_DOSSEN_COMMUNITY_BONGAR_HILLS",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_18_JJ_DOSSEN_COMMUNITY_AIRFIELD",
        "name": "MICROPLAN_MO_02_04_06_18_JJ_DOSSEN_COMMUNITY_AIRFIELD",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_17_JJ_DOSSEN_COMMUNITY_EASY_TOWN",
        "name": "MICROPLAN_MO_02_04_06_17_JJ_DOSSEN_COMMUNITY_EASY_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_16_JJ_DOSSEN_COMMUNITY_J__LAMA_COX",
        "name": "MICROPLAN_MO_02_04_06_16_JJ_DOSSEN_COMMUNITY_J__LAMA_COX",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_15_JJ_DOSSEN_COMMUNITY_TU_COMMUNITY",
        "name": "MICROPLAN_MO_02_04_06_15_JJ_DOSSEN_COMMUNITY_TU_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_14_JJ_DOSSEN_COMMUNITY_PHILADEPHIA",
        "name": "MICROPLAN_MO_02_04_06_14_JJ_DOSSEN_COMMUNITY_PHILADEPHIA",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_13_JJ_DOSSEN_COMMUNITY_KPAFLOVILLE",
        "name": "MICROPLAN_MO_02_04_06_13_JJ_DOSSEN_COMMUNITY_KPAFLOVILLE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_12_JJ_DOSSEN_COMMUNITY_NEW_HARPER",
        "name": "MICROPLAN_MO_02_04_06_12_JJ_DOSSEN_COMMUNITY_NEW_HARPER",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_11_JJ_DOSSEN_COMMUNITY_STADIUM_ROAD",
        "name": "MICROPLAN_MO_02_04_06_11_JJ_DOSSEN_COMMUNITY_STADIUM_ROAD",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_10_JJ_DOSSEN_COMMUNITY_CENTRAL_HARPER",
        "name": "MICROPLAN_MO_02_04_06_10_JJ_DOSSEN_COMMUNITY_CENTRAL_HARPER",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_09_JJ_DOSSEN_COMMUNITY_OLD_KRU_TOWN",
        "name": "MICROPLAN_MO_02_04_06_09_JJ_DOSSEN_COMMUNITY_OLD_KRU_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_08_JJ_DOSSEN_COMMUNITY_BASSA_COMMUNITY",
        "name": "MICROPLAN_MO_02_04_06_08_JJ_DOSSEN_COMMUNITY_BASSA_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_07_JJ_DOSSEN_COMMUNITY_MARSH_STREET",
        "name": "MICROPLAN_MO_02_04_06_07_JJ_DOSSEN_COMMUNITY_MARSH_STREET",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_06_JJ_DOSSEN_COMMUNITY_NEGANGBO",
        "name": "MICROPLAN_MO_02_04_06_06_JJ_DOSSEN_COMMUNITY_NEGANGBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_05_JJ_DOSSEN_COMMUNITY_MIDDLE_CESS",
        "name": "MICROPLAN_MO_02_04_06_05_JJ_DOSSEN_COMMUNITY_MIDDLE_CESS",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_04_JJ_DOSSEN_COMMUNITY_LAKE_SHEPERD",
        "name": "MICROPLAN_MO_02_04_06_04_JJ_DOSSEN_COMMUNITY_LAKE_SHEPERD",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_03_JJ_DOSSEN_COMMUNITY_JJ_DOSSEN_COMMUNITY",
        "name": "MICROPLAN_MO_02_04_06_03_JJ_DOSSEN_COMMUNITY_JJ_DOSSEN_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_02_JJ_DOSSEN_COMMUNITY",
        "name": "MICROPLAN_MO_02_04_06_02_JJ_DOSSEN_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_06_01__14",
        "name": "MICROPLAN_MO_02_04_06_01__14",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_06_JJ_DOSSEN_HOSPITAL",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "name": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_05_14_PULLAH_COMMUNITY_SPRING_HILL",
        "name": "MICROPLAN_MO_02_04_05_14_PULLAH_COMMUNITY_SPRING_HILL",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_13_PULLAH_COMMUNITY_NEW_HALF_GRAWAY",
        "name": "MICROPLAN_MO_02_04_05_13_PULLAH_COMMUNITY_NEW_HALF_GRAWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_12_PULLAH_COMMUNITY_FEGURSON",
        "name": "MICROPLAN_MO_02_04_05_12_PULLAH_COMMUNITY_FEGURSON",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_11_PULLAH_COMMUNITY_KIKEN",
        "name": "MICROPLAN_MO_02_04_05_11_PULLAH_COMMUNITY_KIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_10_PULLAH_COMMUNITY_NABLEH",
        "name": "MICROPLAN_MO_02_04_05_10_PULLAH_COMMUNITY_NABLEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_09_PULLAH_COMMUNITY_TICHARBO",
        "name": "MICROPLAN_MO_02_04_05_09_PULLAH_COMMUNITY_TICHARBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_08_PULLAH_COMMUNITY_MLEWIEN",
        "name": "MICROPLAN_MO_02_04_05_08_PULLAH_COMMUNITY_MLEWIEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_07_PULLAH_COMMUNITY_PULLAH_COMMUNITY",
        "name": "MICROPLAN_MO_02_04_05_07_PULLAH_COMMUNITY_PULLAH_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_06_PULLAH_COMMUNITY_WLUPLOWEIN",
        "name": "MICROPLAN_MO_02_04_05_06_PULLAH_COMMUNITY_WLUPLOWEIN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_05_PULLAH_COMMUNITY_OLD_HALF_GRAWAY",
        "name": "MICROPLAN_MO_02_04_05_05_PULLAH_COMMUNITY_OLD_HALF_GRAWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_04_PULLAH_COMMUNITY_KING_S_TOWN",
        "name": "MICROPLAN_MO_02_04_05_04_PULLAH_COMMUNITY_KING_S_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_03_PULLAH_COMMUNITY_WHOLE_GRAWAY",
        "name": "MICROPLAN_MO_02_04_05_03_PULLAH_COMMUNITY_WHOLE_GRAWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_02_PULLAH_COMMUNITY",
        "name": "MICROPLAN_MO_02_04_05_02_PULLAH_COMMUNITY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_05_01__13",
        "name": "MICROPLAN_MO_02_04_05_01__13",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_05_PULLAH_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "name": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_04_07_CAVALLA_TOWN_KABLAKEN",
        "name": "MICROPLAN_MO_02_04_04_07_CAVALLA_TOWN_KABLAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_06_CAVALLA_TOWN_KAAKUDI",
        "name": "MICROPLAN_MO_02_04_04_06_CAVALLA_TOWN_KAAKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_05_CAVALLA_TOWN_SEDEKEN",
        "name": "MICROPLAN_MO_02_04_04_05_CAVALLA_TOWN_SEDEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_04_CAVALLA_TOWN_WORTEKEN",
        "name": "MICROPLAN_MO_02_04_04_04_CAVALLA_TOWN_WORTEKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_03_CAVALLA_TOWN_CAVALLA_TOWN",
        "name": "MICROPLAN_MO_02_04_04_03_CAVALLA_TOWN_CAVALLA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_02_CAVALLA_TOWN",
        "name": "MICROPLAN_MO_02_04_04_02_CAVALLA_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_04_01__12",
        "name": "MICROPLAN_MO_02_04_04_01__12",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_04_CAVALLA_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "name": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_03_12_YOOKUDI_TANGBALEH",
        "name": "MICROPLAN_MO_02_04_03_12_YOOKUDI_TANGBALEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_11_YOOKUDI_JEDEBIAKEN",
        "name": "MICROPLAN_MO_02_04_03_11_YOOKUDI_JEDEBIAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_10_YOOKUDI_WOLIPLKUDI",
        "name": "MICROPLAN_MO_02_04_03_10_YOOKUDI_WOLIPLKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_09_YOOKUDI_DUOKUDI",
        "name": "MICROPLAN_MO_02_04_03_09_YOOKUDI_DUOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_08_YOOKUDI_POOSIKEN",
        "name": "MICROPLAN_MO_02_04_03_08_YOOKUDI_POOSIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_07_YOOKUDI_KUDEKUDI",
        "name": "MICROPLAN_MO_02_04_03_07_YOOKUDI_KUDEKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_06_YOOKUDI_YOOPIDI",
        "name": "MICROPLAN_MO_02_04_03_06_YOOKUDI_YOOPIDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_05_YOOKUDI_LIBSUCO",
        "name": "MICROPLAN_MO_02_04_03_05_YOOKUDI_LIBSUCO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_04_YOOKUDI_PEDEBO",
        "name": "MICROPLAN_MO_02_04_03_04_YOOKUDI_PEDEBO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_03_YOOKUDI_YOOKUDI",
        "name": "MICROPLAN_MO_02_04_03_03_YOOKUDI_YOOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_02_YOOKUDI",
        "name": "MICROPLAN_MO_02_04_03_02_YOOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_03_01__11",
        "name": "MICROPLAN_MO_02_04_03_01__11",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_03_YOOKUDI_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "name": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_04_02_06_FISH_TOWN_TUPAKEN",
        "name": "MICROPLAN_MO_02_04_02_06_FISH_TOWN_TUPAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_05_FISH_TOWN_BOHLUYEH",
        "name": "MICROPLAN_MO_02_04_02_05_FISH_TOWN_BOHLUYEH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_04_FISH_TOWN_PONWIKEN",
        "name": "MICROPLAN_MO_02_04_02_04_FISH_TOWN_PONWIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_03_FISH_TOWN_GBOKUDI",
        "name": "MICROPLAN_MO_02_04_02_03_FISH_TOWN_GBOKUDI",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_02_FISH_TOWN_FISH_TOWN",
        "name": "MICROPLAN_MO_02_04_02_02_FISH_TOWN_FISH_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_02_01__10",
        "name": "MICROPLAN_MO_02_04_02_01__10",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_04_02_FISH_TOWN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_04_01__09",
        "name": "MICROPLAN_MO_02_04_01__09",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_04_HARPER",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_BARROBO_WHOJAH",
        "name": "MICROPLAN_MO_02_03_BARROBO_WHOJAH",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "name": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_04_08_NEWAKEN_SEATOR",
        "name": "MICROPLAN_MO_02_03_04_08_NEWAKEN_SEATOR",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_07_NEWAKEN_SAWTOKEN_2",
        "name": "MICROPLAN_MO_02_03_04_07_NEWAKEN_SAWTOKEN_2",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_06_NEWAKEN_SARGLOKEN",
        "name": "MICROPLAN_MO_02_03_04_06_NEWAKEN_SARGLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_05_NEWAKEN_JARGLOKEN",
        "name": "MICROPLAN_MO_02_03_04_05_NEWAKEN_JARGLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_04_NEWAKEN_SAWTOKEN_1",
        "name": "MICROPLAN_MO_02_03_04_04_NEWAKEN_SAWTOKEN_1",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_03_NEWAKEN_SOLOKEN",
        "name": "MICROPLAN_MO_02_03_04_03_NEWAKEN_SOLOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_02_NEWAKEN_NEWAKEN",
        "name": "MICROPLAN_MO_02_03_04_02_NEWAKEN_NEWAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_04_01__08",
        "name": "MICROPLAN_MO_02_03_04_01__08",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_04_MEWAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "name": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_03_14_JULUKEN_SMALL_JAYE",
        "name": "MICROPLAN_MO_02_03_03_14_JULUKEN_SMALL_JAYE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_13_JULUKEN_BESSIKEN",
        "name": "MICROPLAN_MO_02_03_03_13_JULUKEN_BESSIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_12_JULUKEN_FULA_CAMP",
        "name": "MICROPLAN_MO_02_03_03_12_JULUKEN_FULA_CAMP",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_11_JULUKEN_TAPOLINE_VILLAGE",
        "name": "MICROPLAN_MO_02_03_03_11_JULUKEN_TAPOLINE_VILLAGE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_10_JULUKEN_TUGBAKEN",
        "name": "MICROPLAN_MO_02_03_03_10_JULUKEN_TUGBAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_09_JULUKEN_KPLOWAKEN",
        "name": "MICROPLAN_MO_02_03_03_09_JULUKEN_KPLOWAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_08_JULUKEN_GORTIKEN",
        "name": "MICROPLAN_MO_02_03_03_08_JULUKEN_GORTIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_07_JULUKEN_GORTUKEN",
        "name": "MICROPLAN_MO_02_03_03_07_JULUKEN_GORTUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_06_JULUKEN_MARTUKEN",
        "name": "MICROPLAN_MO_02_03_03_06_JULUKEN_MARTUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_05_JULUKEN_JULUKEN_2",
        "name": "MICROPLAN_MO_02_03_03_05_JULUKEN_JULUKEN_2",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_04_JULUKEN_DWEJAH",
        "name": "MICROPLAN_MO_02_03_03_04_JULUKEN_DWEJAH",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_03_JULUKEN_JULUKEN",
        "name": "MICROPLAN_MO_02_03_03_03_JULUKEN_JULUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_02_JULUKEN",
        "name": "MICROPLAN_MO_02_03_03_02_JULUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_03_01__07",
        "name": "MICROPLAN_MO_02_03_03_01__07",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_03_JULUKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "name": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_03_02_09_GLOFAKEN_GWELEKPOTOWIKEN",
        "name": "MICROPLAN_MO_02_03_02_09_GLOFAKEN_GWELEKPOTOWIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_08_GLOFAKEN_GESSAKEN",
        "name": "MICROPLAN_MO_02_03_02_08_GLOFAKEN_GESSAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_07_GLOFAKEN_GBAKEN",
        "name": "MICROPLAN_MO_02_03_02_07_GLOFAKEN_GBAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_06_GLOFAKEN_SAWKEN",
        "name": "MICROPLAN_MO_02_03_02_06_GLOFAKEN_SAWKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_05_GLOFAKEN_CHILIKEN",
        "name": "MICROPLAN_MO_02_03_02_05_GLOFAKEN_CHILIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_04_GLOFAKEN_DUGBOKEN",
        "name": "MICROPLAN_MO_02_03_02_04_GLOFAKEN_DUGBOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_03_GLOFAKEN_GLOFAKEN",
        "name": "MICROPLAN_MO_02_03_02_03_GLOFAKEN_GLOFAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_02_GLOFAKEN",
        "name": "MICROPLAN_MO_02_03_02_02_GLOFAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_02_01__06",
        "name": "MICROPLAN_MO_02_03_02_01__06",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_03_02_GLOFAKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_03_01__05",
        "name": "MICROPLAN_MO_02_03_01__05",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_03_BARROBO_WHOJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_BARROBO_FARJAH",
        "name": "MICROPLAN_MO_02_02_BARROBO_FARJAH",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "name": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARROBO_FARJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_03_08_FELOKEN_KPANNISO",
        "name": "MICROPLAN_MO_02_02_03_08_FELOKEN_KPANNISO",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_07_FELOKEN_GBARKLIKEN",
        "name": "MICROPLAN_MO_02_02_03_07_FELOKEN_GBARKLIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_06_FELOKEN_BIG_JAYE",
        "name": "MICROPLAN_MO_02_02_03_06_FELOKEN_BIG_JAYE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_05_FELOKEN_FELOKEN",
        "name": "MICROPLAN_MO_02_02_03_05_FELOKEN_FELOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_04_FELOKEN_BULTIKEN",
        "name": "MICROPLAN_MO_02_02_03_04_FELOKEN_BULTIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_03_FELOKEN_FISHTOWN_HIGHWAY",
        "name": "MICROPLAN_MO_02_02_03_03_FELOKEN_FISHTOWN_HIGHWAY",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_02_FELOKEN",
        "name": "MICROPLAN_MO_02_02_03_02_FELOKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_03_01__04",
        "name": "MICROPLAN_MO_02_02_03_01__04",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_03_FELOKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "name": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARROBO_FARJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_02_02_10_GBARWILIKEN_TENKEN",
        "name": "MICROPLAN_MO_02_02_02_10_GBARWILIKEN_TENKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_09_GBARWILIKEN_KARDIO_VILLAGE",
        "name": "MICROPLAN_MO_02_02_02_09_GBARWILIKEN_KARDIO_VILLAGE",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_08_GBARWILIKEN_GBARWILIKEN",
        "name": "MICROPLAN_MO_02_02_02_08_GBARWILIKEN_GBARWILIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_07_GBARWILIKEN_GUTUKEN",
        "name": "MICROPLAN_MO_02_02_02_07_GBARWILIKEN_GUTUKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_06_GBARWILIKEN_ROCK_TOWN",
        "name": "MICROPLAN_MO_02_02_02_06_GBARWILIKEN_ROCK_TOWN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_05_GBARWILIKEN_TEAKEN",
        "name": "MICROPLAN_MO_02_02_02_05_GBARWILIKEN_TEAKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_04_GBARWILIKEN_MARFLIKEN",
        "name": "MICROPLAN_MO_02_02_02_04_GBARWILIKEN_MARFLIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_03_GBARWILIKEN_GWISSIKEN",
        "name": "MICROPLAN_MO_02_02_02_03_GBARWILIKEN_GWISSIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_02_GBARWILIKEN",
        "name": "MICROPLAN_MO_02_02_02_02_GBARWILIKEN",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_02_01__03",
        "name": "MICROPLAN_MO_02_02_02_01__03",
        "type": "Village",
        "parent": "MICROPLAN_MO_02_02_02_GBARWILIKEN_CLINIC",
        "isRoot": false,
        "includeAllChildren": true
    },
    {
        "code": "MICROPLAN_MO_02_02_01__02",
        "name": "MICROPLAN_MO_02_02_01__02",
        "type": "Locality",
        "parent": "MICROPLAN_MO_02_02_BARROBO_FARJAH",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_02_01__01",
        "name": "MICROPLAN_MO_02_01__01",
        "type": "District",
        "parent": "MICROPLAN_MO_02_MARYLAND",
        "isRoot": false,
        "includeAllChildren": false
    },
    {
        "code": "MICROPLAN_MO_01_",
        "name": "MICROPLAN_MO_01_",
        "type": "Province",
        "parent": "MICROPLAN_MO",
        "isRoot": false,
        "includeAllChildren": false
    }
  ]
}