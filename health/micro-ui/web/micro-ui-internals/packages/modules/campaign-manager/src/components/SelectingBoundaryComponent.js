import React, { useState, useEffect, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, Header, CardText } from "@egovernments/digit-ui-react-components";
import { LabelFieldPair, CardLabel } from "@egovernments/digit-ui-components";
// import { MultiSelectDropdown } from "@egovernments/digit-ui-components";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { value } from "jsonpath";
import { Dropdown } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";

// const data = {
//   id: "2b31768d-eed4-449d-8145-d193bb4c8307",
//   code: "HEALTH_MO",
//   boundaryType: "Country",
//   children: [
//     {
//       id: "50864ee3-7bdd-4e24-b741-04cee6b2aac2",
//       code: "HEALTH_MO_13_NAMPULA",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "539496aa-2b4b-4bab-96e3-bb3025160195",
//           code: "HEALTH_MO_13_02_MOSSURILEE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "50d6db7d-9bba-4687-85d5-7ec58cdc4a94",
//               code: "HEALTH_MO_13_02_02_CHITIMA-01",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "a31dd2e4-e088-470c-b6d3-96a8c7163b85",
//                   code: "HEALTH_MO_13_02_02_01_CHITIMA SEDE-01",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "95017dbe-de20-4392-b1c8-c415bd744f22",
//                       code: "HEALTH_MO_13_02_02_01_16_CANGUD ZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "941bdf26-732e-4e75-85e6-0f47b0b353fa",
//                       code: "HEALTH_MO_13_02_02_01_15_CANDOD O",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3b515e89-9b18-412a-95c3-a2dfa0c7f045",
//                       code: "HEALTH_MO_13_02_02_01_14_CARANG ACHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f8821fd2-53f7-484c-bae6-5de5d5649a2f",
//                       code: "HEALTH_MO_13_02_02_01_13_NHANTS UNGUI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "27b9706c-776e-44df-9f73-1b02fb21b435",
//                       code: "HEALTH_MO_13_02_02_01_12_CHITHA NDO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1486ae34-81b7-4512-b8b6-cca5fb5316c8",
//                       code: "HEALTH_MO_13_02_02_01_11_GUEBUZ A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e7b836e9-1366-4ee0-a7a3-bfc12ed4f235",
//                       code: "HEALTH_MO_13_02_02_01_10_CADONG OLO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7957d848-41fd-4028-b69f-a04e0b28e9a3",
//                       code: "HEALTH_MO_13_02_02_01_09_BOROMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a6609f02-6bc8-4df1-a0dd-bf88fe4728df",
//                       code: "HEALTH_MO_13_02_02_01_08_CAHO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d812758c-c9ba-41e0-819c-b1c4fb150067",
//                       code: "HEALTH_MO_13_02_02_01_07_1 DE M AIO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0534ba99-db97-4265-8a54-37f5d9f558a3",
//                       code: "HEALTH_MO_13_02_02_01_06_CATOND O",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ae642eb2-9467-43fb-9a6e-50c238296574",
//                       code: "HEALTH_MO_13_02_02_01_05_JOSINA MACHEL",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e2b8bc3b-9d64-4236-85cf-6401fc80ac77",
//                       code: "HEALTH_MO_13_02_02_01_04_25 DE JUNHO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4c761d6f-01a7-45d4-b70b-6640d3178228",
//                       code: "HEALTH_MO_13_02_02_01_03_VALE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e198ca16-36e3-4fba-96ba-3b928d042e0b",
//                       code: "HEALTH_MO_13_02_02_01_02_CAWIRA B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "646ed7bc-2aa8-46bf-a267-7513248c569a",
//                       code: "HEALTH_MO_13_02_02_01_01_CAWIRA A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "b4b548b6-46c3-4977-8f89-d6196f3a230e",
//               code: "HEALTH_MO_13_02_01_NSADZO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "584e9175-264c-4d96-b6d9-ce57efe63904",
//                   code: "HEALTH_MO_13_02_01_01_ANG'OMBE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "2ec0168b-e6f6-4a9d-9b73-fee1e5c4941b",
//                       code: "HEALTH_MO_13_02_01_01_23_THEQUESSE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6cbd9ebb-67cd-4905-8218-39252df025e3",
//                       code: "HEALTH_MO_13_02_01_01_22_ZANICHI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "18a9ac6e-e4aa-40c9-8b99-035d53022ee3",
//                       code: "HEALTH_MO_13_02_01_01_21_MACATA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d20fb3e8-8a49-4d50-a7f3-338889fb0527",
//                       code: "HEALTH_MO_13_02_01_01_20_JULIO CHAMALULO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6bd30399-81cd-4630-aa81-1db4d044a7ab",
//                       code: "HEALTH_MO_13_02_01_01_19_COFATI 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "00682625-23c2-44b2-b446-8a32f3716095",
//                       code: "HEALTH_MO_13_02_01_01_18_AFULEDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "88312eee-3aa5-4401-83a1-a486fc5f94d8",
//                       code: "HEALTH_MO_13_02_01_01_17_ADAMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "05407288-6d07-44ad-9e39-e043a588fa50",
//                       code: "HEALTH_MO_13_02_01_01_16_ACUSE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f1c88a7b-00d3-48c6-93d6-80ab84203953",
//                       code: "HEALTH_MO_13_02_01_01_15_NTUITI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "97ae429c-98ae-4905-84fd-17ce5a0538a2",
//                       code: "HEALTH_MO_13_02_01_01_14_NCUMBZI 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3a58b33a-b689-4a93-89e2-9122598b4532",
//                       code: "HEALTH_MO_13_02_01_01_13_NCUMBUZI 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bdab9244-6105-4e50-b345-fba72d5e5231",
//                       code: "HEALTH_MO_13_02_01_01_12_ACHINTSUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c1dce501-d86b-42b7-890a-dcd51f56a3cf",
//                       code: "HEALTH_MO_13_02_01_01_11_AMBULEZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6cd67490-66f5-405e-b7ec-29474a981db3",
//                       code: "HEALTH_MO_13_02_01_01_10_KAPHIRI KA MPANDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "42551fc9-d311-4a7c-a1a6-abd14a92b15d",
//                       code: "HEALTH_MO_13_02_01_01_09_COFATI 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa4eeb4f-566b-4ae3-a1c1-5fa4f96a2e66",
//                       code: "HEALTH_MO_13_02_01_01_08_TSHIRIZA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a358e885-87f1-4408-adb0-7d9a53a5cc1a",
//                       code: "HEALTH_MO_13_02_01_01_07_ANANIAS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e2c59f3f-bfc9-4264-8213-eb3566e05521",
//                       code: "HEALTH_MO_13_02_01_01_06_MAXENECA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a916fb8f-ae8f-4c58-a9d8-aa873749e8f9",
//                       code: "HEALTH_MO_13_02_01_01_05_CAPOCHI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fc9606b9-9c35-46c1-af72-00ece4998e61",
//                       code: "HEALTH_MO_13_02_01_01_04_CHANGUI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9012a17d-04e8-4ba7-b7ca-6a6300087144",
//                       code: "HEALTH_MO_13_02_01_01_03_LIPIRANI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ccc1fcde-5dd0-4ede-a751-50fd25c06a2b",
//                       code: "HEALTH_MO_13_02_01_01_02_MPHEMBERE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0464aea2-f301-4921-bffc-b6c508abd0c0",
//                       code: "HEALTH_MO_13_02_01_01_01_MOAMBEDZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "0a870de6-b481-4ef0-8b0f-61a01d0557b5",
//           code: "HEALTH_MO_13_01_MURRUPULA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "b0ba1ff2-1deb-4d49-bb39-376ea4cc2b59",
//               code: "HEALTH_MO_13_01_04_NIHESSIUE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "9a697e05-24fc-404b-83e2-8213854e2fa8",
//                   code: "HEALTH_MO_13_01_04_03_NACOCOLO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e79c2fd0-e32f-434b-8ec7-74ffb9614264",
//                       code: "HEALTH_MO_13_01_04_03_09_NACOCOLOA9",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "02609072-b99f-42f0-82b1-02c769f012d3",
//                       code: "HEALTH_MO_13_01_04_03_08_NACOCOLOA8",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9f3c640c-717e-49fd-acb0-cd6c6bfb534e",
//                       code: "HEALTH_MO_13_01_04_03_07_NACOCOLOA7",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3f26ac9b-04ec-4ca3-b8e7-1df3ae2e1bc7",
//                       code: "HEALTH_MO_13_01_04_03_06_NACOCOLOA6",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "af157b10-c9c1-427f-8c35-41f32f2104ea",
//                       code: "HEALTH_MO_13_01_04_03_05_NACOCOLOA5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e8f5593b-373d-45a5-b1cd-b866c5dcc99d",
//                       code: "HEALTH_MO_13_01_04_03_04_NACOCOLOA4",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4372238d-a237-4fec-af99-817b661e9e2e",
//                       code: "HEALTH_MO_13_01_04_03_03_NACOCOLOA3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7766eb17-da03-416b-a31c-55036deb1976",
//                       code: "HEALTH_MO_13_01_04_03_02_NACOCOLOA2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "936e2fe4-0d29-4969-940e-0b2893317763",
//                       code: "HEALTH_MO_13_01_04_03_01_NACOCOLOA1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "98deca95-926c-4feb-b0a8-0ef802ba8501",
//                   code: "HEALTH_MO_13_01_04_02_MULHANIUA",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "4a328b67-666d-4845-ad13-16b7ff497498",
//                       code: "HEALTH_MO_13_01_04_02_10_NACULUER10",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dab78154-ca3b-42c0-bd2d-1ceaed0f1238",
//                       code: "HEALTH_MO_13_01_04_02_09_NACULUER9",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "07d49f06-f604-4b02-bf86-5f8575db87a6",
//                       code: "HEALTH_MO_13_01_04_02_08_NACULUER8",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "afcf5d8d-4be8-4a8f-9f80-f4ea460ab33e",
//                       code: "HEALTH_MO_13_01_04_02_07_NACULUER7",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1db0d810-163b-469b-bd9e-c050be4eb869",
//                       code: "HEALTH_MO_13_01_04_02_06_NACULUER6",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c9739ac1-be8e-49ba-afe3-73a8f7119ac3",
//                       code: "HEALTH_MO_13_01_04_02_05_NACULUER5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c30a63e3-e386-4d37-b795-4401034d79b3",
//                       code: "HEALTH_MO_13_01_04_02_04_NACULUER4",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d39de87e-d38b-4fe5-b317-5abf02069101",
//                       code: "HEALTH_MO_13_01_04_02_03_NACULUER3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "926a1a30-d77f-418b-8ad2-16e0391bb3df",
//                       code: "HEALTH_MO_13_01_04_02_02_NACULUER2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f6f38b71-d0bd-4755-a05f-04bdaeb851fb",
//                       code: "HEALTH_MO_13_01_04_02_01_NACULUER1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7aa9dd75-5d7a-46df-993b-e598f6c57176",
//                   code: "HEALTH_MO_13_01_04_01_NIHESSIUEA",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1230bd62-32b6-4aba-b58a-fa84643404f0",
//                       code: "HEALTH_MO_13_01_04_01_29_CAVINA29",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6825fe09-1b7a-4799-85fd-08f0e1e226d6",
//                       code: "HEALTH_MO_13_01_04_01_28_CAVINA28",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "01b8625e-1dea-45df-be6f-054f6aff6dfc",
//                       code: "HEALTH_MO_13_01_04_01_27_CAVINA27",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "80376040-44a1-4ad6-b1df-c549e47e6706",
//                       code: "HEALTH_MO_13_01_04_01_26_CAVINA26",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "54360a47-ca61-4684-99e6-daf1dc1b525b",
//                       code: "HEALTH_MO_13_01_04_01_25_CAVINA25",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5bf97d10-000a-4f8e-9439-83991851f704",
//                       code: "HEALTH_MO_13_01_04_01_24_CAVINA24",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d385b291-337b-4a96-add7-47dbc0a56419",
//                       code: "HEALTH_MO_13_01_04_01_23_CAVINA23",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d91041ea-f809-4108-8a2d-ee14dfd12a91",
//                       code: "HEALTH_MO_13_01_04_01_22_CAVINA22",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ed5934c7-2bbf-4545-bb85-ddb4d0a43781",
//                       code: "HEALTH_MO_13_01_04_01_21_CAVINA21",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0fe72720-2e63-4ef4-bb48-f76010d8ffac",
//                       code: "HEALTH_MO_13_01_04_01_20_CAVINA20",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ca470342-4bef-4efb-ac8d-95f8149e6cfc",
//                       code: "HEALTH_MO_13_01_04_01_19_CAVINA19",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7b37ff9d-38d4-4383-80f0-b323c374b6f4",
//                       code: "HEALTH_MO_13_01_04_01_18_CAVINA18",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "23764f61-c821-4178-9823-66642fd54f53",
//                       code: "HEALTH_MO_13_01_04_01_17_CAVINA17",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f41deb28-2c9e-47a1-9973-c46f0d430bf6",
//                       code: "HEALTH_MO_13_01_04_01_16_CAVINA16",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9fe33d50-7da3-4e78-a203-2f1dda5d7766",
//                       code: "HEALTH_MO_13_01_04_01_15_CAVINA15",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "58024880-04b1-437c-b58f-3f58068da35a",
//                       code: "HEALTH_MO_13_01_04_01_14_CAVINA14",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0c8ea5cb-66e1-407f-962b-e11f7980bee1",
//                       code: "HEALTH_MO_13_01_04_01_13_CAVINA13",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "92c5bc0f-455a-4035-a272-6e03965a7c44",
//                       code: "HEALTH_MO_13_01_04_01_12_CAVINA12",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bfa6cb5d-c105-4f2d-be66-a2e2e5e612a4",
//                       code: "HEALTH_MO_13_01_04_01_11_CAVINA11",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b6b06c97-55f3-40e7-adf5-10abc6e8b338",
//                       code: "HEALTH_MO_13_01_04_01_10_CAVINA10",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c0b3cf54-f38e-449b-9a1f-f2408b30ffbc",
//                       code: "HEALTH_MO_13_01_04_01_09_CAVINA9",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b7efd2b0-363d-4469-8031-28409144e82e",
//                       code: "HEALTH_MO_13_01_04_01_08_CAVINA8",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "15d77a44-d318-482c-b996-83e7ce8b43e3",
//                       code: "HEALTH_MO_13_01_04_01_07_CAVINA7",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fbc25071-ffa8-425d-b49b-67ee83eaa071",
//                       code: "HEALTH_MO_13_01_04_01_06_CAVINA6",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "05468443-d3d7-4cb1-94af-2919052fa83c",
//                       code: "HEALTH_MO_13_01_04_01_05_CAVINA5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3e3b188e-23e0-4698-aa0a-a830a363db1d",
//                       code: "HEALTH_MO_13_01_04_01_04_CAVINA4",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fd71aae7-1b13-4525-a937-f3fa011c68b4",
//                       code: "HEALTH_MO_13_01_04_01_03_CAVINA3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "674a6c32-5f7d-45e8-957b-32adcc2dc930",
//                       code: "HEALTH_MO_13_01_04_01_02_CAVINA2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa8942c7-c70b-40a4-8182-bf0113b3ab5a",
//                       code: "HEALTH_MO_13_01_04_01_01_CAVINA1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "dc6dcbf8-0dfd-4023-b1e3-84caf2fa1298",
//               code: "HEALTH_MO_13_01_03_CHITEEIMA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "84ff5952-9e22-456d-b6c2-412293ada3eb",
//                   code: "HEALTH_MO_13_01_03_02_CHIBAGADIGO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b8aaf047-5abb-40a3-bddd-f7659128af80",
//                       code: "HEALTH_MO_13_01_03_02_13_CHIRODZI PONTE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "106d7ce7-7e06-4155-87aa-caeb928b34d1",
//                       code: "HEALTH_MO_13_01_03_02_12_NHAULIRI 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c7772466-acbc-4ab0-b633-49796830a039",
//                       code: "HEALTH_MO_13_01_03_02_11_NHAULIRI 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ab9b18a8-a876-401b-9013-b4b7394419b3",
//                       code: "HEALTH_MO_13_01_03_02_10_NCHENGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bce5e92c-13fa-435b-83bd-ea7ee07d02b4",
//                       code: "HEALTH_MO_13_01_03_02_09_CHAMIMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ef340e32-6c47-4fb6-86ab-f0d687cc796d",
//                       code: "HEALTH_MO_13_01_03_02_08_CHIRODZI NTEPE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "12b168b2-4fb5-4a58-b50c-d58d268a13d2",
//                       code: "HEALTH_MO_13_01_03_02_07_NHANTSINGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "334881d3-6efb-4be4-a5da-0decea130a3c",
//                       code: "HEALTH_MO_13_01_03_02_06_NHAMIDZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0d76d544-27b1-4baf-b578-2f2e68ca9963",
//                       code: "HEALTH_MO_13_01_03_02_05_CAVULANCIE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "22b3fc5a-2b4f-4bfb-bf69-6b870e4778fa",
//                       code: "HEALTH_MO_13_01_03_02_04_CHISSUA SEDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4e97b52a-03c4-4f22-b0dd-65dbe9bda33f",
//                       code: "HEALTH_MO_13_01_03_02_03_CHISSUA CRUZAMENTO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b7c0c81b-194e-4782-983e-7d53fe0de230",
//                       code: "HEALTH_MO_13_01_03_02_02_CHISSUA THALA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c8fb82ab-77a3-4e20-a0bd-4dd30ae3a882",
//                       code: "HEALTH_MO_13_01_03_02_01_CHABONGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7c44c797-9a51-43d3-b577-1d85cc2bdabe",
//                   code: "HEALTH_MO_13_01_03_01_CHICOA NOVA",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a550c193-7401-4027-9d5d-6bccbc9d3f12",
//                       code: "HEALTH_MO_13_01_03_01_05_MATUNGULU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6862434e-a626-44ea-bbbf-a08b31094f36",
//                       code: "HEALTH_MO_13_01_03_01_04_MASSECHA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1c0b7b60-52d1-4469-af25-8b03f0681e89",
//                       code: "HEALTH_MO_13_01_03_01_03_CHINHANDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cea37d05-96b6-44f1-9060-4015549adad0",
//                       code: "HEALTH_MO_13_01_03_01_02_CHICOA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8ca641fc-fa11-4a99-a978-0b897ecd8080",
//                       code: "HEALTH_MO_13_01_03_01_01_NHAMINHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "c30caa30-3c12-4d24-891e-ef6aebffa8cf",
//               code: "HEALTH_MO_13_01_02_CHIFUNDE-01",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c5d72894-d0ec-4129-aa82-2c8265f13afc",
//                   code: "HEALTH_MO_13_01_02_01_MUALADZI",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "bef62019-7794-42cd-951b-88553001dc0f",
//                       code: "HEALTH_MO_13_01_02_01_36_MUALADZI SEDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "091e4e0b-d772-437b-85b3-0d5a98e5573c",
//                       code: "HEALTH_MO_13_01_02_01_35_CHITUMBULA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "32ff3a8f-844a-413a-9769-bc52bda41981",
//                       code: "HEALTH_MO_13_01_02_01_34_CHIMBALAME",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5c0cbb92-c288-4e6e-b0cb-8423860df2ed",
//                       code: "HEALTH_MO_13_01_02_01_33_CHATSICA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "58475a6c-3b33-4b41-8549-327cf22392bb",
//                       code: "HEALTH_MO_13_01_02_01_32_NAMICOMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c2619826-332e-49ca-85bf-63e3d4378b02",
//                       code: "HEALTH_MO_13_01_02_01_31_SATEMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6021c6f5-d761-4c21-b2a6-66c9c502eb0d",
//                       code: "HEALTH_MO_13_01_02_01_30_TSEBONDO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c7e74908-5882-4ac3-9d79-a271ada4f3b6",
//                       code: "HEALTH_MO_13_01_02_01_29_CATAKWALA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e24c1200-7cb3-4827-8903-4bcb8dc635c3",
//                       code: "HEALTH_MO_13_01_02_01_28_DZIWELANGONA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "60dd005f-533c-4d91-bc40-d4596ccaa5a3",
//                       code: "HEALTH_MO_13_01_02_01_27_MUANANHANJE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a3d72497-97d8-45b5-8727-f4acfc898e71",
//                       code: "HEALTH_MO_13_01_02_01_26_CHOLONNGUELERA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ca6c5f5c-903b-4f66-9623-30176a05c9c0",
//                       code: "HEALTH_MO_13_01_02_01_25_MULAWE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b55c382c-73ef-41f1-9c81-2f1de58475ea",
//                       code: "HEALTH_MO_13_01_02_01_24_NCHENGOERA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "00e0022e-2363-4893-b18a-cacabd766387",
//                       code: "HEALTH_MO_13_01_02_01_23_MANKACA 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "61d0dff8-fe4c-41a4-818d-7b3e3eb00c5b",
//                       code: "HEALTH_MO_13_01_02_01_22_CHIRUDZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8e4f7a27-3ddc-4ec7-9e85-d6960ab0f6db",
//                       code: "HEALTH_MO_13_01_02_01_21_DAUNDELA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "04f1fa98-d2ac-414f-9c8a-c7daf8a5c161",
//                       code: "HEALTH_MO_13_01_02_01_20_GOELA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "160f04fd-a162-4c69-b502-c8622733f454",
//                       code: "HEALTH_MO_13_01_02_01_19_THIMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "305512a6-cfcf-4223-8edf-724d13498571",
//                       code: "HEALTH_MO_13_01_02_01_18_PHOCA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1d473482-68aa-41ca-9ccd-572c761e82e9",
//                       code: "HEALTH_MO_13_01_02_01_17_GUEROSSOMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9f0cb6a5-e661-4720-bc86-4ea3b5f4861c",
//                       code: "HEALTH_MO_13_01_02_01_16_NKHONDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f0369bb9-00bd-4cce-9cc6-1e5f7ff87d4c",
//                       code: "HEALTH_MO_13_01_02_01_15_MANKACA 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "24455ba1-6bd0-4072-9aa6-d2be133d33fa",
//                       code: "HEALTH_MO_13_01_02_01_14_VUBUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "82ab586b-4675-4662-bd8f-2deeb4de42be",
//                       code: "HEALTH_MO_13_01_02_01_13_MALIDZIMAERA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "76454331-050a-4140-81da-55544a3ff8cb",
//                       code: "HEALTH_MO_13_01_02_01_12_CAWELENGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e45c4738-61d5-40f8-aa3b-8c4b506a7ccc",
//                       code: "HEALTH_MO_13_01_02_01_11_CHIMPOYO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "124cad58-5e7f-453d-b2b4-4288ba20fb8a",
//                       code: "HEALTH_MO_13_01_02_01_10_MAGRENI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c8a0d522-e101-44e1-8f5b-8b7534697325",
//                       code: "HEALTH_MO_13_01_02_01_09_WERENGANI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "94552f01-da9b-46eb-9238-0b4ba30fcc66",
//                       code: "HEALTH_MO_13_01_02_01_08_AMOSSE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d5717b22-4cca-4ac5-8a9a-5a05ee27fb74",
//                       code: "HEALTH_MO_13_01_02_01_07_MBOMBE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "45c9f40c-9c97-4e81-818e-b39d15deab8d",
//                       code: "HEALTH_MO_13_01_02_01_06_NROLO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6f6934cc-a436-4669-af90-3866b88d9124",
//                       code: "HEALTH_MO_13_01_02_01_05_MPHANJAYAUTSI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3e4c75fc-624c-4c41-9a72-a5d74ef2d906",
//                       code: "HEALTH_MO_13_01_02_01_04_MALAZA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6f43d64c-0a0c-439d-b56a-d4e2800ca8dd",
//                       code: "HEALTH_MO_13_01_02_01_03_NHATIKOWA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fb3f5215-16bc-4542-b8ce-996ccdf5a762",
//                       code: "HEALTH_MO_13_01_02_01_02_CHITHAWALE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e9c2d127-05ac-4d87-8d4e-0644db081a48",
//                       code: "HEALTH_MO_13_01_02_01_01_ANTIGA MIGRACAO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "8116a4b3-de8f-44c0-84d3-513c3449b9e3",
//               code: "HEALTH_MO_13_01_01_MUALDZI",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "596d9e77-2681-4b89-9e69-4bd7790a1a8f",
//                   code: "HEALTH_MO_13_01_01_01_KHAMANDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "31f6299e-1e98-4c43-9891-ad2d351d0f0e",
//                       code: "HEALTH_MO_13_01_01_01_19_KHAMANDE SEDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e58cc173-1896-4ad1-a15b-e5b9df8fd898",
//                       code: "HEALTH_MO_13_01_01_01_18_SEQUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ade9980c-a1ba-45a3-a898-86909bc38a2e",
//                       code: "HEALTH_MO_13_01_01_01_17_CASSOCHELA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b95147d9-dd60-410f-9508-a67bbe6a36b2",
//                       code: "HEALTH_MO_13_01_01_01_16_MASSAUASSAUA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fe4a91d2-a36c-43ab-a14a-9b362c1e017c",
//                       code: "HEALTH_MO_13_01_01_01_15_NKONDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e60ae707-0c7c-415f-8bb9-09bef09aade5",
//                       code: "HEALTH_MO_13_01_01_01_14_MASSIMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "66f5a472-a5cb-4d89-8aa1-47300d0bbe18",
//                       code: "HEALTH_MO_13_01_01_01_13_ALISSONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d3d5842d-513c-498d-a48d-29abebc73c87",
//                       code: "HEALTH_MO_13_01_01_01_12_CANQUIRA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d36c99e9-1f05-47ac-b385-c883df16ea55",
//                       code: "HEALTH_MO_13_01_01_01_11_CHIGONDO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e214aad9-bd0e-4eda-8342-a8adc3b2d33c",
//                       code: "HEALTH_MO_13_01_01_01_10_CALIDZIPIRE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fa27f5a5-2012-44ec-89c0-105014400dbf",
//                       code: "HEALTH_MO_13_01_01_01_09_DZICO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2e327e16-c537-43e5-b7be-1a1704d65f27",
//                       code: "HEALTH_MO_13_01_01_01_08_JASSONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4f51dc23-71b7-4169-a5ab-b6fb9ca4621c",
//                       code: "HEALTH_MO_13_01_01_01_07_CHAWANTA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "60d200cb-4e44-4101-b194-8522035858fa",
//                       code: "HEALTH_MO_13_01_01_01_06_KANKHUKU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "755aa950-0419-4aa0-a087-e16a6ec8441d",
//                       code: "HEALTH_MO_13_01_01_01_05_KAPAMANGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dd601ec1-82e6-45b4-985c-a5eeeda6a1ec",
//                       code: "HEALTH_MO_13_01_01_01_04_CHICAONDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3c959b97-4814-4b83-bd6b-0670ee926968",
//                       code: "HEALTH_MO_13_01_01_01_03_FAIZAZE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "47680552-3cd6-4bea-9940-3a4ccc0ab89e",
//                       code: "HEALTH_MO_13_01_01_01_02_MULAMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "996f8133-a8fe-4034-8230-0662b35bfc96",
//                       code: "HEALTH_MO_13_01_01_01_01_TCHALE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "ea346106-08af-4b55-8a3b-70f7c7f5bafc",
//       code: "HEALTH_MO_12_CABO",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "afa08354-7af3-4a69-8a05-b625bd322109",
//           code: "HEALTH_MO_12_01_CABO DELGADO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "353fe981-aa50-4014-b15c-f4e41c646a32",
//               code: "HEALTH_MO_12_01_01_PEMBA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "ed501fbc-09f9-44b3-8a66-dd5506fd684a",
//                   code: "HEALTH_MO_12_01_01_01_PEMBA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "515a2c4b-26c1-4c61-a63a-10617239cb4d",
//                       code: "HEALTH_MO_12_01_01_01_43_CHIMELO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c29467cb-a8cc-4a27-9d5c-0e0fb6864af9",
//                       code: "HEALTH_MO_12_01_01_01_42_CHIGELA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b84c2ff8-12da-493d-930f-2f7a6b0651b0",
//                       code: "HEALTH_MO_12_01_01_01_41_CHIPACO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bcbbea2c-8fc9-4329-bab8-f329619c66fa",
//                       code: "HEALTH_MO_12_01_01_01_40_CHIPANG A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7a5a8019-f256-45cb-9de0-1092cf8926f9",
//                       code: "HEALTH_MO_12_01_01_01_39_CHIPINHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ba63c32d-4ffc-4cee-9859-4ca78ec850e0",
//                       code: "HEALTH_MO_12_01_01_01_38_COLOMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "63444aad-fc67-4a5f-b738-09e7a56e7dc2",
//                       code: "HEALTH_MO_12_01_01_01_37_COTOMON A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "56fc500f-d7de-47bc-985c-91555a1193e5",
//                       code: "HEALTH_MO_12_01_01_01_36_FAHELO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d22a97a4-3072-4a3d-a5db-33b0f5ccff2f",
//                       code: "HEALTH_MO_12_01_01_01_35_FAMULO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2e7825bb-a81f-49ea-a92f-65414c438ac0",
//                       code: "HEALTH_MO_12_01_01_01_34_HODI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9008dc83-8e17-40a2-a58e-2484c35e092c",
//                       code: "HEALTH_MO_12_01_01_01_33_JUNHO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "876730eb-b08b-40d4-ae60-3762699d1f12",
//                       code: "HEALTH_MO_12_01_01_01_32_MAFELENE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e21b0ac4-e9f6-44bb-a690-07f4bf1bd34a",
//                       code: "HEALTH_MO_12_01_01_01_31_MALUPIRIR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9c0c5ddc-7cf8-43e9-8247-50893e6ec9e5",
//                       code: "HEALTH_MO_12_01_01_01_30_MAPIRORO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3ebdacb4-ab44-48d9-b10f-58ba67797312",
//                       code: "HEALTH_MO_12_01_01_01_29_MARIRIU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7d0530a5-af30-46c4-bc7e-1bfd2e82c680",
//                       code: "HEALTH_MO_12_01_01_01_28_MUNGO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "456eacaa-0da6-4137-bdae-06a4d52dc736",
//                       code: "HEALTH_MO_12_01_01_01_27_NABOARO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5c032f87-9072-4a9a-be10-aeecd4835965",
//                       code: "HEALTH_MO_12_01_01_01_26_NALO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "26f5d438-720a-43b3-8b36-3f207c9f00cd",
//                       code: "HEALTH_MO_12_01_01_01_25_OCALIMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "751ea7a1-e137-4263-a5de-42541a7cb98a",
//                       code: "HEALTH_MO_12_01_01_01_24_OCUMALO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "773ef4f3-4216-4654-b8de-5ed9d6fdf2fb",
//                       code: "HEALTH_MO_12_01_01_01_23_OCUMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a363d868-4aeb-4ac3-bc81-c794ab967d29",
//                       code: "HEALTH_MO_12_01_01_01_22_PASSENDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "76b9ad97-a1a1-42a8-8f50-ba9c30b61490",
//                       code: "HEALTH_MO_12_01_01_01_21_PIRO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e1818418-9eee-4662-8987-8dfb8b8d3066",
//                       code: "HEALTH_MO_12_01_01_01_20_PONACO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e9af5ec4-a798-46dc-8585-72a5275f2fc0",
//                       code: "HEALTH_MO_12_01_01_01_19_SANTOS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "776a3066-6419-4f74-b465-ac16cf2ef224",
//                       code: "HEALTH_MO_12_01_01_01_18_TINGACO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3f408cdd-d321-4dca-bc2a-0ecf7f8755e9",
//                       code: "HEALTH_MO_12_01_01_01_17_VERDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9603d192-99bc-41de-b491-3118ac22388b",
//                       code: "HEALTH_MO_12_01_01_01_16_VIATURA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bf71bb07-616f-4f05-a61b-aa22e1f31d51",
//                       code: "HEALTH_MO_12_01_01_01_15_VULAGUNDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "37f4c681-979e-4784-a833-6cb4a14f8e05",
//                       code: "HEALTH_MO_12_01_01_01_14_WINAZO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ad27775e-df4a-49fb-8333-b905eb44ee29",
//                       code: "HEALTH_MO_12_01_01_01_13_XIMANGO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c2fba4de-72e1-413b-8c33-b2d85d797a36",
//                       code: "HEALTH_MO_12_01_01_01_12_XIMPACO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e9038153-9891-49fc-b37e-0c7d87da7e16",
//                       code: "HEALTH_MO_12_01_01_01_11_XINZIQUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9339e033-4ecc-472f-941f-f97bd6ba4fbc",
//                       code: "HEALTH_MO_12_01_01_01_10_YUAMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "243fee44-a034-464d-9adf-c243ea45350c",
//                       code: "HEALTH_MO_12_01_01_01_09_ZIMBAZE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4b123032-2461-4f5d-9762-af860b57c80c",
//                       code: "HEALTH_MO_12_01_01_01_08_ZUNGULE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4e7a1b4d-d4ed-40b9-b8ae-32260a641595",
//                       code: "HEALTH_MO_12_01_01_01_07_INGURU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "844b447a-2564-4b60-9549-90f10658d09d",
//                       code: "HEALTH_MO_12_01_01_01_06_NANGURU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4a0145fd-3f7e-4cd9-a430-faab229f2a0f",
//                       code: "HEALTH_MO_12_01_01_01_05_MISSETA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2210b1af-594e-4797-9da7-27655e5ded7f",
//                       code: "HEALTH_MO_12_01_01_01_04_MUCO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cd01c93c-b4ff-470a-b3fc-a0cb412b97ee",
//                       code: "HEALTH_MO_12_01_01_01_03_NAMANCA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "22babf6b-9978-4c2f-a3a7-193d07a14407",
//                       code: "HEALTH_MO_12_01_01_01_02_MBUZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ff91a2f2-8d0d-444a-a655-e7ef17aa8d8e",
//                       code: "HEALTH_MO_12_01_01_01_01_CABATA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "45ffe064-5774-4ec1-9d05-22aaf0187689",
//       code: "HEALTH_MO_11_SOFALA",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "c0cca757-c8af-49f7-a7eb-05782da1565a",
//           code: "HEALTH_MO_11_06_NHAMATANDA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "7910ee5f-94f5-4d65-bc9b-adbf1a76d41e",
//               code: "HEALTH_MO_11_06_05_TICA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0eeccb10-2ef2-48e9-be03-a883393aeebf",
//                   code: "HEALTH_MO_11_06_05_01_TICA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b40595a7-3d27-4366-a03d-0fa8a9f1ccb5",
//                       code: "HEALTH_MO_11_06_05_01_02_MUZIRO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9605b34b-8da2-4d73-a001-c5ad60c1fd12",
//                       code: "HEALTH_MO_11_06_05_01_01_MUCHAPA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "8103af42-ef82-4eb8-a85f-3cd935c52054",
//               code: "HEALTH_MO_11_06_04_NHAMPOCA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "bd902d95-ba16-450f-855e-d87123e81059",
//                   code: "HEALTH_MO_11_06_04_01_NHAMPOCA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "16157d7f-a39f-4b71-9120-32ad7156ea7a",
//                       code: "HEALTH_MO_11_06_04_01_02_MUBO-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "abe6d358-26b6-470b-a286-d1c7fdd0ac96",
//                       code: "HEALTH_MO_11_06_04_01_01_SANGO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "0719950e-db12-477f-a467-e04d44e112f7",
//               code: "HEALTH_MO_11_06_03_MUTUA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "65ca7ae5-483b-47f4-a7f6-5e3a38975a70",
//                   code: "HEALTH_MO_11_06_03_01_MUTUA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1a2959ef-e79e-4293-9f5f-bfdcec08179b",
//                       code: "HEALTH_MO_11_06_03_01_02_NHANDUMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6eb2a561-7b23-4c2c-9233-e66fc36e496a",
//                       code: "HEALTH_MO_11_06_03_01_01_MAHAMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "209d67a1-6a5f-4e34-b4fd-d63230bb1cfb",
//               code: "HEALTH_MO_11_06_02_LAMEGO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "9ea3cd3e-d047-447c-9795-c58cf74de05f",
//                   code: "HEALTH_MO_11_06_02_01_LAMEGO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "5d28b69c-b7f3-416b-a1a9-aefe5b9aa8fe",
//                       code: "HEALTH_MO_11_06_02_01_02_MACANDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3177c175-a0f8-4f13-9b5f-da14c7df56e1",
//                       code: "HEALTH_MO_11_06_02_01_01_NHACOTA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "09cb39d0-1c2e-462c-bd68-1a81d4e99580",
//               code: "HEALTH_MO_11_06_01_BEBEDO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "3b26453d-3045-4409-a56a-b7469dbe12b1",
//                   code: "HEALTH_MO_11_06_01_01_BEBEDO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "df353fce-17b8-4294-af43-6ab26366578a",
//                       code: "HEALTH_MO_11_06_01_01_01_BEBEDO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "30a6dcd3-3eeb-40c2-8cb9-e074d8fae429",
//           code: "HEALTH_MO_11_05_DONDO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "d28f3ef3-4125-44b1-984e-e84f47b05261",
//               code: "HEALTH_MO_11_05_04_SAVANE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "8ad6a8b2-4a48-42f1-b1d1-485f124940af",
//                   code: "HEALTH_MO_11_05_04_01_SAVANE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "bcbf645e-6b8b-4568-9294-4c6f247b5c26",
//                       code: "HEALTH_MO_11_05_04_01_02_NHAMUDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c0293395-b122-4e5d-9cbc-ebe3d83bcddf",
//                       code: "HEALTH_MO_11_05_04_01_01_MANIKA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "2e1ee4e4-a5d4-4015-ae34-f48300246205",
//               code: "HEALTH_MO_11_05_03_MAFAMBISSE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7f1b12e3-a0e5-44d0-9232-4bbf5b0ddbc4",
//                   code: "HEALTH_MO_11_05_03_01_MAFAMBISSE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ea0e7032-df2c-4a1f-8dd2-53c8f7dc5e09",
//                       code: "HEALTH_MO_11_05_03_01_02_MAGOMBE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "09195911-763b-4253-9f46-c7e00f6e7f5d",
//                       code: "HEALTH_MO_11_05_03_01_01_NHATEMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "416eb3ed-454f-4482-9a11-87e64d1d3a3c",
//               code: "HEALTH_MO_11_05_02_CHINAMACONDO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4936af8d-119b-4b66-b201-da6fc7e9342a",
//                   code: "HEALTH_MO_11_05_02_01_CHINAMACONDO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "4a3ea874-2086-44cf-8f62-61a1e1fce8f4",
//                       code: "HEALTH_MO_11_05_02_01_02_MAZONDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "142e1d27-1f5b-4533-b80a-c743ea0d84d3",
//                       code: "HEALTH_MO_11_05_02_01_01_LICUARI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "aa0a5070-2bc3-436a-a7e9-adcaac7f2ed0",
//               code: "HEALTH_MO_11_05_01_SENGO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "490e94fc-5ab9-4c1c-b079-de1315acb607",
//                   code: "HEALTH_MO_11_05_01_01_SENGO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "cce97bec-9edc-4cc8-a697-52929c6de332",
//                       code: "HEALTH_MO_11_05_01_01_02_MARUJA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d2881126-8440-43ae-a7da-a1a1862673ff",
//                       code: "HEALTH_MO_11_05_01_01_01_MACHIR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "b30d30bd-fcab-42dc-9dd8-cb475c47a656",
//           code: "HEALTH_MO_11_04_GORONGOSA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "b726342c-f362-4cf9-8b73-a72b272befa3",
//               code: "HEALTH_MO_11_04_04_VUNDUZI",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "986ef57c-fbbb-4bbb-b715-bb21acc78753",
//                   code: "HEALTH_MO_11_04_04_01_VUNDUZI SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1ce2bf70-733a-45a9-b7df-61289ef80fa9",
//                       code: "HEALTH_MO_11_04_04_01_02_MARANGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9a580497-87c1-4876-9636-4b44edbf14b8",
//                       code: "HEALTH_MO_11_04_04_01_01_MAVICHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "108f5578-973a-42f4-b9ac-ac8a0c42f64e",
//               code: "HEALTH_MO_11_04_03_CHITUNGA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "45e1a9c2-18d3-43f7-aec1-44ea4b31360f",
//                   code: "HEALTH_MO_11_04_03_01_CHITUNGA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7c223535-a96d-4e0e-a454-90365381a93e",
//                       code: "HEALTH_MO_11_04_03_01_02_MILANGULO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5ec92497-793a-4d3d-b133-baa00149371f",
//                       code: "HEALTH_MO_11_04_03_01_01_MACUNGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "08c58a62-d1d8-40f6-ad12-b25c3eac9fe3",
//               code: "HEALTH_MO_11_04_02_NHAMASSONGE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "bd9aa487-b302-4465-a454-c2e82b2138b3",
//                   code: "HEALTH_MO_11_04_02_01_NHAMASSONGE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "adbbfc6e-b26d-4b55-a8f2-aeb603f199c4",
//                       code: "HEALTH_MO_11_04_02_01_02_NHATADIMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f2c19db7-eba3-475a-be9a-2ffaca60cfe3",
//                       code: "HEALTH_MO_11_04_02_01_01_NHANDJA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "3496f53b-a72e-4b32-a418-cdb6430d8b87",
//               code: "HEALTH_MO_11_04_01_DINDIZA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "8ede5dc9-e705-434a-aead-db20409b32bc",
//                   code: "HEALTH_MO_11_04_01_01_DINDIZA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "2eebda5f-9c5b-430f-943f-51c595101488",
//                       code: "HEALTH_MO_11_04_01_01_02_LAMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "effa45dd-6fee-4949-8eae-0ddd9b9088dd",
//                       code: "HEALTH_MO_11_04_01_01_01_NHANJI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "23dda36d-fa92-4881-8da3-d44de48967f3",
//           code: "HEALTH_MO_11_03_BUZI",
//           boundaryType: "District",
//           children: [
//             {
//               id: "71e31c06-e489-4917-8753-653c608e7807",
//               code: "HEALTH_MO_11_03_04_NOVA SOFALA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "927470e1-f952-4b46-88c6-bc48278cfa08",
//                   code: "HEALTH_MO_11_03_04_01_NOVA SOFALA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "317715ee-f13f-4c39-8d4a-a907e1a03ef6",
//                       code: "HEALTH_MO_11_03_04_01_02_SENGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "83df8e65-8e01-4959-b124-0abe70860c97",
//                       code: "HEALTH_MO_11_03_04_01_01_CHICENGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "47a698f6-43a7-484f-bf4c-a030b8b715ec",
//               code: "HEALTH_MO_11_03_03_INHAMINGA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f5ff6889-6112-4c20-9bc0-597e1754292f",
//                   code: "HEALTH_MO_11_03_03_01_INHAMINGA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "5d83722f-31bc-46e9-a76f-9ae8be8b9a86",
//                       code: "HEALTH_MO_11_03_03_01_02_NHOHULA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b9bddbb4-48d9-4463-8faa-04b2bd29b24a",
//                       code: "HEALTH_MO_11_03_03_01_01_MUZOMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "61e1dde9-da00-4bd9-b47d-455a8cdeb380",
//               code: "HEALTH_MO_11_03_02_GRUDJA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4022cd0e-4b35-4f6f-befb-d297cb9cf56d",
//                   code: "HEALTH_MO_11_03_02_01_GRUDJA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a630a41f-7a57-4c5d-a7ed-28726157fde7",
//                       code: "HEALTH_MO_11_03_02_01_02_MAZACHA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3711c5a7-0e91-43ad-b97f-973925d435cf",
//                       code: "HEALTH_MO_11_03_02_01_01_CHICUARI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "7ec4c25d-d03a-4e94-ab80-d8aa0149f8cb",
//               code: "HEALTH_MO_11_03_01_GUARA-GUARA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "5405b6d2-257b-4d9b-80fd-b95e900f2f34",
//                   code: "HEALTH_MO_11_03_01_01_GUARA-GUARA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "4ea7876e-1b16-4ab8-b424-6c2ea6e2dd0a",
//                       code: "HEALTH_MO_11_03_01_01_02_MAHORO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "299a7713-0aca-4470-b44a-1bdbed833134",
//                       code: "HEALTH_MO_11_03_01_01_01_MACHUMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "565b8345-f53b-4677-ab2d-98599ee311d5",
//           code: "HEALTH_MO_11_02_CHEMBA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "6676debd-5015-4c86-aebb-6e37713f58b9",
//               code: "HEALTH_MO_11_02_04_MARROMEU",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "729f3b2d-e3be-45e2-a63a-85522e68aac4",
//                   code: "HEALTH_MO_11_02_04_01_MARROMEU SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "95459e40-434f-4989-b248-dcfbbe5d39bb",
//                       code: "HEALTH_MO_11_02_04_01_02_CHAMBULI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "398da9ab-ecbf-4715-9953-13bc60336696",
//                       code: "HEALTH_MO_11_02_04_01_01_MEQUELE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "eb78a4ea-d991-42b6-a542-edd8ac1f2a11",
//               code: "HEALTH_MO_11_02_03_CHUPANGA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "def811b4-875f-4cf8-89ef-db76c0f08820",
//                   code: "HEALTH_MO_11_02_03_01_CHUPANGA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "44d3c7a9-5d47-4a75-97a0-538d7bb93a5d",
//                       code: "HEALTH_MO_11_02_03_01_02_MATEQUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7b56111e-9f9a-4a29-8dca-baaaa180c705",
//                       code: "HEALTH_MO_11_02_03_01_01_MACUNHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "4ac755c2-36a7-458c-862d-db258baa127a",
//               code: "HEALTH_MO_11_02_02_MORRUMBALA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "3a45e477-d0a8-4ff1-a3ac-d9b324ebec14",
//                   code: "HEALTH_MO_11_02_02_01_MORRUMBALA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "9c429e36-b1fb-4b11-b440-52ca1410c39b",
//                       code: "HEALTH_MO_11_02_02_01_02_MACAVALA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "391c232e-02de-4042-a845-d856bd8d27bf",
//                       code: "HEALTH_MO_11_02_02_01_01_NHAXANA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "41a88444-7b33-418d-a702-be21d6355942",
//               code: "HEALTH_MO_11_02_01_INHANGOMA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4e5d7730-2642-409e-8935-b71e0108103f",
//                   code: "HEALTH_MO_11_02_01_01_INHANGOMA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0164af78-3eb3-4784-8c67-8f856ffed673",
//                       code: "HEALTH_MO_11_02_01_01_02_MECHUO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6e0b2d6a-d0cb-400d-b5d0-3c773e8b160e",
//                       code: "HEALTH_MO_11_02_01_01_01_MACAHULO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "7e542125-7b21-4a1c-8204-061c5f5ab0b9",
//           code: "HEALTH_MO_11_01_CAIA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "994e7682-502e-42c1-b812-d1aa77cee3a7",
//               code: "HEALTH_MO_11_01_04_SENA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "20072800-9d7b-49b2-9b2d-f3a49cc619b2",
//                   code: "HEALTH_MO_11_01_04_01_SENA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "42a0cecf-de15-43d9-8ef9-859e15666627",
//                       code: "HEALTH_MO_11_01_04_01_02_CHIMBUNGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e1f07f16-59a7-4448-8efb-410e2e68b9be",
//                       code: "HEALTH_MO_11_01_04_01_01_MACHANGULO-02",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "f17f44c6-bf87-4bad-8220-8fe74b0b7a5b",
//               code: "HEALTH_MO_11_01_03_MURRAÇA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "62611742-857d-423d-a526-8a7c78691cf1",
//                   code: "HEALTH_MO_11_01_03_01_MURRAÇA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "daa0eafb-8b43-48b7-9c89-cf1a1a663ad3",
//                       code: "HEALTH_MO_11_01_03_01_02_NHIRO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "20f59d9b-3e52-4f35-8227-f159216e8bb5",
//                       code: "HEALTH_MO_11_01_03_01_01_MACHUMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "a59acd87-d4ac-4a7f-860c-c29906e33423",
//               code: "HEALTH_MO_11_01_02_CHIMUARA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0c63755f-eab2-44b4-b918-3fd8c296b0ce",
//                   code: "HEALTH_MO_11_01_02_01_CHIMUARA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "f35ce6d9-ae7c-48e5-8a22-797e760d9eaa",
//                       code: "HEALTH_MO_11_01_02_01_02_MAFOGUENE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d2378a29-c8b1-47d8-9d4e-9d699344eb54",
//                       code: "HEALTH_MO_11_01_02_01_01_NHASSICO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "0cb3a64c-30e0-4a1b-bdd3-ca593f9ec3e0",
//               code: "HEALTH_MO_11_01_01_MOPEIA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "66f6a19d-c2dd-4d3b-bec9-2b2b03410a1b",
//                   code: "HEALTH_MO_11_01_01_01_MOPEIA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "18d968fd-0740-42f2-b1ef-3052c966539c",
//                       code: "HEALTH_MO_11_01_01_01_02_MAZUQUA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d8b45356-eb85-4c3a-987d-6b9d62f9d37b",
//                       code: "HEALTH_MO_11_01_01_01_01_LICUMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "0648520e-015a-48a2-876c-61bb18966fd2",
//       code: "HEALTH_MO_10_MAPUTO",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "20a9005a-2890-4f5e-bd7b-29742ff014a6",
//           code: "HEALTH_MO_10_07_MATUTUINE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "c5f06eeb-5e04-41c6-a314-430e8ad81276",
//               code: "HEALTH_MO_10_07_01_BELA VISTA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7e1a2168-c8cd-4aeb-a5f3-e514cd1f9933",
//                   code: "HEALTH_MO_10_07_01_01_BELA VISTA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e2e022a9-0d24-45a1-9f3f-7b5201a93ba8",
//                       code: "HEALTH_MO_10_07_01_01_04_MASSAVANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "35509d3c-947c-4034-a86c-ee61ca15266c",
//                       code: "HEALTH_MO_10_07_01_01_03_NHAMBAZA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "de14aa1e-09bd-42d8-b8f8-39401e02ff48",
//                       code: "HEALTH_MO_10_07_01_01_02_MASSUNGULO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8124e880-2c22-441f-a3c4-cf905a6f0f06",
//                       code: "HEALTH_MO_10_07_01_01_01_CHAVANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "857e63fa-3ec7-45dd-a922-41deb731001d",
//           code: "HEALTH_MO_10_06_BOANE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "eab17dd8-a577-402a-a714-1301d6a05dec",
//               code: "HEALTH_MO_10_06_01_BOANE VISTA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "8b9536b2-65ca-4921-b21b-80bf039ccf6b",
//                   code: "HEALTH_MO_10_06_01_01_BOANE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "68bf95c3-c8d8-4c19-85f6-0108b17da722",
//                       code: "HEALTH_MO_10_06_01_01_04_NDUMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2dcd91c1-3d27-486c-b77f-c0d24c197bce",
//                       code: "HEALTH_MO_10_06_01_01_03_MUBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "256a86bb-a3fb-42eb-92e8-d641e3f878fa",
//                       code: "HEALTH_MO_10_06_01_01_02_MAGULUCO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3b8f48d2-183f-4f2d-8dba-0feb485b996e",
//                       code: "HEALTH_MO_10_06_01_01_01_CHANGAMBE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "d4fa06d0-4f54-470c-8bad-d15d75ec9535",
//           code: "HEALTH_MO_10_05_MARRACUENE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "ae6e6182-ec49-4ead-a85d-72ffbc9207ce",
//               code: "HEALTH_MO_10_05_01_MARRACUENEE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "00449164-f924-4ae2-b53a-c4d17d97cbf3",
//                   code: "HEALTH_MO_10_05_01_01_MARRACUENE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "06bac821-b490-4453-8294-e9c360b3f15e",
//                       code: "HEALTH_MO_10_05_01_01_04_MACANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5c57bb9f-d328-4549-9399-58d2c0515ccb",
//                       code: "HEALTH_MO_10_05_01_01_03_MAZIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8c9ebdd1-6ece-48af-8b7e-3a68fd14e209",
//                       code: "HEALTH_MO_10_05_01_01_02_MANGUNHANEII",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "128ffeb1-9557-40ad-8113-2600b81c143b",
//                       code: "HEALTH_MO_10_05_01_01_01_MAJACAZAI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "c4941661-303d-49be-8238-84c8566c5667",
//           code: "HEALTH_MO_10_04_MAGUDE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "cd9ec93c-5edd-4f57-8c7c-15c76310fb7e",
//               code: "HEALTH_MO_10_04_01_MAGUDEE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "6d2078a3-dc19-4c5b-9c71-af9b254e3acc",
//                   code: "HEALTH_MO_10_04_01_01_MAGUDE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "3ea76fe1-2210-4f0e-beeb-9c34ba402b76",
//                       code: "HEALTH_MO_10_04_01_01_04_MAPULANGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "43aea7fa-0a4f-4cfc-894a-65e0ffc29a55",
//                       code: "HEALTH_MO_10_04_01_01_03_NHAMACONDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6a1099a9-5925-4802-b9a3-3640878a0d94",
//                       code: "HEALTH_MO_10_04_01_01_02_MASSINGA-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8db8e9a2-3b5f-41e6-9a46-e8dc118ed09a",
//                       code: "HEALTH_MO_10_04_01_01_01_CHICHACHAEW",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "4576f999-7331-450a-9a2e-bf6469aa8ce7",
//           code: "HEALTH_MO_10_03_MANHICA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "8a3c6411-3ac8-4126-80f6-d8ec761cf4bd",
//               code: "HEALTH_MO_10_03_01_MANHICAE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0d95c3a8-5855-4fef-b638-d7bd8c4a5f7a",
//                   code: "HEALTH_MO_10_03_01_01_MANHICA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8b94622b-eca3-4c9d-ae8f-7690e8244105",
//                       code: "HEALTH_MO_10_03_01_01_02_MASSACANHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1d7b83e2-518c-4c91-ace2-1bc6bba4f707",
//                       code: "HEALTH_MO_10_03_01_01_01_MACALANGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "086b479a-0b61-49d2-94fb-0326ba720eb3",
//           code: "HEALTH_MO_10_02_MOA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "f8cdd5b4-7429-43be-a2e6-0a1f4f73a788",
//               code: "HEALTH_MO_10_02_01_MOAA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d46282d6-6248-48ad-b43e-80c2a38326b5",
//                   code: "HEALTH_MO_10_02_01_01_MOA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "c2f007cb-0e0e-48e2-865e-097377822c59",
//                       code: "HEALTH_MO_10_02_01_01_02_CHICUALACUALA-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fc3b2a13-765f-473d-bb39-cdb1e05867c2",
//                       code: "HEALTH_MO_10_02_01_01_01_MASSIFUTA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "1f0ab8ba-b5d2-48ab-82e3-a906abc059ca",
//           code: "HEALTH_MO_10_01_NOME",
//           boundaryType: "District",
//           children: [
//             {
//               id: "7100df67-8b1d-4daf-85cc-7628f2cc7103",
//               code: "HEALTH_MO_10_01_01_NOMEA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "508871ee-5d33-4214-a57b-cedffe43598f",
//                   code: "HEALTH_MO_10_01_01_01_NOME SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "eb4e9932-7f75-4320-8b71-bd5b7b20b2f4",
//                       code: "HEALTH_MO_10_01_01_01_02_CHIMUANA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "51414cff-f98b-43a0-9e8f-f162c7956bc8",
//                       code: "HEALTH_MO_10_01_01_01_01_NHAMATE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "f9470a34-3a99-4850-b4b7-b54e33094834",
//       code: "HEALTH_MO_09_GAZA",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "6bd0c78a-649d-4328-b828-ed1dc287bf54",
//           code: "HEALTH_MO_09_09_CHIBUTO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "b2f81058-7f94-4801-9179-db3583e473f6",
//               code: "HEALTH_MO_09_09_01_CHIBUTOO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f4f4eb64-b3c9-4436-bf3e-c444a3b975a7",
//                   code: "HEALTH_MO_09_09_01_01_CHIBUTO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "956f9e77-a856-4f3f-b763-ccbf6253c01f",
//                       code: "HEALTH_MO_09_09_01_01_03_MAPA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9308962c-96d4-4ef4-a11a-f0559b5f9d4a",
//                       code: "HEALTH_MO_09_09_01_01_02_CHICUZA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e70b7460-39c9-4f0f-935a-838bffc61d3e",
//                       code: "HEALTH_MO_09_09_01_01_01_CHANGANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "fa492fa6-e828-425e-9684-3b3159b95d19",
//           code: "HEALTH_MO_09_08_CHOKWE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "0d739964-7296-4150-bc10-1eb3e0b0b3c9",
//               code: "HEALTH_MO_09_08_01_CHOKWEE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "32ef0bdd-11f5-4c6f-b71e-9745d3f8f549",
//                   code: "HEALTH_MO_09_08_01_01_CHOKWE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6e8ebd6c-9aa3-448e-93e5-6c302f665bfa",
//                       code: "HEALTH_MO_09_08_01_01_02_MACIA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "310afa7e-34ff-4ee2-ba26-cb4dc7adaeab",
//                       code: "HEALTH_MO_09_08_01_01_01_CHIBONGO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "70fa6e16-b3c4-46f9-bb97-66f942705af2",
//           code: "HEALTH_MO_09_07_GUIJA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "40dc9598-1869-47fa-8ee1-966d6cdeb3b6",
//               code: "HEALTH_MO_09_07_01_GUIJAA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c4f7db41-7008-4ce6-82e6-7f691d24e433",
//                   code: "HEALTH_MO_09_07_01_01_GUIJA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "99a5fa87-5fd1-4c91-bb9b-765302a78718",
//                       code: "HEALTH_MO_09_07_01_01_03_MASSANGENA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "da3e7ba9-56f3-4280-8561-df1e56696de5",
//                       code: "HEALTH_MO_09_07_01_01_02_MABALANE-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c2ed5866-53d3-4c55-9dc5-31e5a163f0c2",
//                       code: "HEALTH_MO_09_07_01_01_01_CHIBALO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "6ea1ff06-46a9-41f7-9474-668ecddc9f39",
//           code: "HEALTH_MO_09_06_LIMPOPO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "71b5394e-46be-46d4-9127-3d3f8dc9fb5b",
//               code: "HEALTH_MO_09_06_01_LIMPOPOQ",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4b8822f0-074e-4dfe-92aa-11b08a9dce49",
//                   code: "HEALTH_MO_09_06_01_01_LIMPOPO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8fb1f0dd-5d9d-4cc6-a29f-a1c67c82f008",
//                       code: "HEALTH_MO_09_06_01_01_03_MACUACUA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dc550890-63bc-44e5-a80c-e19399c793f4",
//                       code: "HEALTH_MO_09_06_01_01_02_MASSINGIR-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b52882df-c6c5-440d-8b5b-74c062a1cac1",
//                       code: "HEALTH_MO_09_06_01_01_01_MALE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "1ce8d7b7-c897-4d08-ba8b-c1b3bd4ef743",
//           code: "HEALTH_MO_09_05_MANJACAZE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "698592d8-2acf-4db2-9596-97234f5df182",
//               code: "HEALTH_MO_09_05_01_MANJACAZEE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f32c29b4-4e7c-442d-a87e-7ab97a32f80b",
//                   code: "HEALTH_MO_09_05_01_01_MANJACAZE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8022015e-19f4-4c22-b1ac-6291f217f99c",
//                       code: "HEALTH_MO_09_05_01_01_02_CHIDENGUELE-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a7cdfeec-eb47-4360-8ce2-f020a8ee47c7",
//                       code: "HEALTH_MO_09_05_01_01_01_MACARRETANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "ec70be37-4409-49a6-8210-29df01bda253",
//           code: "HEALTH_MO_09_04_XAI-XAI",
//           boundaryType: "District",
//           children: [
//             {
//               id: "b29d0751-fdc8-47a6-bc62-d00c9d14135c",
//               code: "HEALTH_MO_09_04_01_XAI-XAI PA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "09f95696-e97e-4930-9931-5124609eb896",
//                   code: "HEALTH_MO_09_04_01_01_XAI-XAI SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e3b8ae6a-0460-4d88-ad1b-79ef3ba9050d",
//                       code: "HEALTH_MO_09_04_01_01_03_CHILANGANA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ac6c99a3-418d-4da8-a38a-f2c373daa4eb",
//                       code: "HEALTH_MO_09_04_01_01_02_MATIMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "21d55b43-aea7-4f09-bab9-37b4aa04ce25",
//                       code: "HEALTH_MO_09_04_01_01_01_CHICOMA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "143adb40-d2a9-46a9-8116-6ee5615a8f56",
//           code: "HEALTH_MO_09_03_MASSINGIR",
//           boundaryType: "District",
//           children: [
//             {
//               id: "e4ea70c7-482b-4203-8a9e-fab34362a645",
//               code: "HEALTH_MO_09_03_01_MASSINGIR PA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "903f5c15-61ef-4102-b432-afb8c8228c4a",
//                   code: "HEALTH_MO_09_03_01_01_MASSINGIR SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7cad3810-5b61-4c00-8f7a-59ae85a7f56a",
//                       code: "HEALTH_MO_09_03_01_01_01_MACHANGULO-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "426cd07d-ff5e-4892-aad5-c8a5f05c6906",
//           code: "HEALTH_MO_09_02_MABALANE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "6d81d13e-5d0c-4eb8-b90d-d28871398a09",
//               code: "HEALTH_MO_09_02_01_MABALANEE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "927412c1-c5cd-451b-8513-0cba89fdf82b",
//                   code: "HEALTH_MO_09_02_01_01_MABALANE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7b37e337-05eb-41df-a933-01901f803db5",
//                       code: "HEALTH_MO_09_02_01_01_02_CHIGUBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7c4c9ff4-27e6-404d-88df-40f202dbd2ac",
//                       code: "HEALTH_MO_09_02_01_01_01_MAPAI-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "1d78b192-4ada-4091-8391-215ab9a6d033",
//           code: "HEALTH_MO_09_01_BILENE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "fc09383a-a601-4b76-9900-488367480742",
//               code: "HEALTH_MO_09_01_01_BILENEE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0dc3c83d-2236-43d4-9fe4-43a0a1d0d227",
//                   code: "HEALTH_MO_09_01_01_01_BILENE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "72a97683-6928-4f4a-be59-1a1cb923644a",
//                       code: "HEALTH_MO_09_01_01_01_02_MASSACHO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "85f08429-d74a-4e5a-a531-1e0a1f1e669a",
//                       code: "HEALTH_MO_09_01_01_01_01_MACANETA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "2a2197f0-7a48-4a18-850c-e7022363dac9",
//       code: "HEALTH_MO_08_INHAMBANE",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "2456ff64-a3e2-4eda-876a-9ea37042c56a",
//           code: "HEALTH_MO_08_09_INHARRIMEA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "fdeb6b5c-a021-4712-a3a1-b193f0b94689",
//               code: "HEALTH_MO_08_09_01_INHARRIME",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "94bdf771-02ef-4043-9986-2681b61507f4",
//                   code: "HEALTH_MO_08_09_01_01_INHARRIME SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "eba7736b-dbdc-4990-9077-e799a4ab03e6",
//                       code: "HEALTH_MO_08_09_01_01_03_MASSINGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "63bbd4d4-a158-4bca-ba5a-cbdfddebc006",
//                       code: "HEALTH_MO_08_09_01_01_02_CHACAME",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3ecf5708-e76a-42d2-9da8-df56061e2e73",
//                       code: "HEALTH_MO_08_09_01_01_01_CHIBUTO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "210a8f21-b774-4f05-b7ee-5c724af50c90",
//           code: "HEALTH_MO_08_08_JANGAMOO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "621d0e57-0803-4386-bbba-3f5d614095b4",
//               code: "HEALTH_MO_08_08_01_JANGAMO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4563c811-cd66-4588-9851-5ba02bf55b11",
//                   code: "HEALTH_MO_08_08_01_01_JANGAMO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "437c613a-21e3-45fa-b244-b7b843d94a95",
//                       code: "HEALTH_MO_08_08_01_01_07_MASSACATE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "69555732-a4a4-4da5-ad34-285fb3c20f63",
//                       code: "HEALTH_MO_08_08_01_01_06_CHIDENGUELE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d41d3caf-6eff-4d90-b1ba-ac45130c0a67",
//                       code: "HEALTH_MO_08_08_01_01_05_CHICUZAI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3c8fa38-dc2f-45a6-baa2-1d170ca8ad76",
//                       code: "HEALTH_MO_08_08_01_01_04_CHIBUTO1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b56b674-06ce-479d-8b1c-0733ccf8cd06",
//                       code: "HEALTH_MO_08_08_01_01_03_CHIMACUALAA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "252a6884-77ed-4b0d-91dd-cb7f1896aa3b",
//                       code: "HEALTH_MO_08_08_01_01_02_MASSINGAI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "78a6a127-7a72-4aed-954c-d92719261b12",
//                       code: "HEALTH_MO_08_08_01_01_01_MACUANE11",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "0689d3a8-6dfd-4261-a0aa-b7c5742ae691",
//           code: "HEALTH_MO_08_07_MASSINGAA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "a96b13f6-dcbe-417c-942c-9cbd8f14b224",
//               code: "HEALTH_MO_08_07_01_MASSINGA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "54743b3c-f978-4a90-ab54-a71a0041e988",
//                   code: "HEALTH_MO_08_07_01_01_MASSINGA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e1e7c3fc-cd5a-4619-8be8-2f760e65c408",
//                       code: "HEALTH_MO_08_07_01_01_06_MACUACHENE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6037cd22-e5cb-4801-b167-dfcd9efedc0b",
//                       code: "HEALTH_MO_08_07_01_01_05_CHICOMO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "29d0614a-c2b8-4993-9179-64b08d8fdf42",
//                       code: "HEALTH_MO_08_07_01_01_04_CHICOAA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "433661a3-834a-4bb8-bcf8-17aa7ab7cf23",
//                       code: "HEALTH_MO_08_07_01_01_03_MACUANEEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4d6c2687-b263-41d1-aafc-0eb9a158072b",
//                       code: "HEALTH_MO_08_07_01_01_02_MASSINGIRI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "609f61b9-f5a1-4c8e-b0ed-1cc18a195d30",
//                       code: "HEALTH_MO_08_07_01_01_01_CHIBUTOOO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "e5bd8227-3a8b-40f4-bd06-d657b878c177",
//           code: "HEALTH_MO_08_06_MAXIXEE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "fb1105c7-aeeb-419d-8b44-e2c0e2edf151",
//               code: "HEALTH_MO_08_06_01_MAXIXE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "8833ecc2-8998-444f-9a07-291d54891fdd",
//                   code: "HEALTH_MO_08_06_01_01_MAXIXE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7afda592-e798-4ff6-8d6b-d91985f841f9",
//                       code: "HEALTH_MO_08_06_01_01_03_MUABSA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9db76bc3-3af5-41f1-ab1e-3a9821a5739b",
//                       code: "HEALTH_MO_08_06_01_01_02_CHIMBONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cc333b9d-010f-41e8-9ea2-7fe13d3fed52",
//                       code: "HEALTH_MO_08_06_01_01_01_MACUANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "18f7598c-d1a5-4178-a106-1782c60d467e",
//           code: "HEALTH_MO_08_05_FUNHALOUROA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "c98fff3c-9460-4424-98cd-ceccac5c6618",
//               code: "HEALTH_MO_08_05_01_FUNHALOURO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "9fda08de-75a3-48e9-a9cd-16429ef05ec7",
//                   code: "HEALTH_MO_08_05_01_01_FUNHALOURO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "2960b57d-5ec9-4b47-810b-0910497b911a",
//                       code: "HEALTH_MO_08_05_01_01_03_CHICOA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "94e1cdb2-9991-446b-8f7c-b53078c09032",
//                       code: "HEALTH_MO_08_05_01_01_02_CHICUALACUALA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "42497562-129d-4411-8870-6f73a6516a1d",
//                       code: "HEALTH_MO_08_05_01_01_01_MALIPA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "c9b25620-dc73-4ae7-b924-df42d362d4b3",
//           code: "HEALTH_MO_08_04_INHASSOROE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "42a1c387-0a4e-40fd-a2cc-dd535cb0d855",
//               code: "HEALTH_MO_08_04_01_INHASSORO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "aea54073-3e51-4ecd-a33f-1cf5f16a2153",
//                   code: "HEALTH_MO_08_04_01_01_INHASSORO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "3f84e97c-c4bc-4345-ba6f-c58542a3d9f0",
//                       code: "HEALTH_MO_08_04_01_01_02_MACATANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d7610a24-ec82-46b9-bca6-8b98c7084216",
//                       code: "HEALTH_MO_08_04_01_01_01_CHIMACUALA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "03616743-6d53-44ea-911a-71145e5c93d2",
//           code: "HEALTH_MO_08_03_MABOTEE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "bbf34749-2350-4945-a56d-4dfd3eac2b47",
//               code: "HEALTH_MO_08_03_01_MABOTE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "8553504f-9c31-47d0-aa2c-499b0d657e66",
//                   code: "HEALTH_MO_08_03_01_01_MABOTE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "4bf83671-64c0-43d4-a0f0-9a41b83b740c",
//                       code: "HEALTH_MO_08_03_01_01_03_CHIMANCHE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "469b0810-bf79-4614-a527-06115b34d46a",
//                       code: "HEALTH_MO_08_03_01_01_02_MACHANGULO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1ad80dca-7386-45ff-80e9-5c0e8abe6dc6",
//                       code: "HEALTH_MO_08_03_01_01_01_MAPAI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "9e966d99-7bf9-4291-9531-1013e154a3bf",
//           code: "HEALTH_MO_08_02_VILANCULOSE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "146d4b63-b1f2-4597-9e1d-717d469c8e31",
//               code: "HEALTH_MO_08_02_01_VILANCULOS",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7f2dda5f-8fa6-4cad-b5a4-5f7b6627ac6b",
//                   code: "HEALTH_MO_08_02_01_01_VILANCULOS SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6a1c1096-148f-46c6-9a94-306dfa322364",
//                       code: "HEALTH_MO_08_02_01_01_02_CHINAMANI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7375edec-bb36-4ed2-b2cd-f5aed23f28f5",
//                       code: "HEALTH_MO_08_02_01_01_01_MASSACA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "33709951-dc59-4096-9d2d-40a7d78f3aa5",
//           code: "HEALTH_MO_08_01_ZAVALAA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "4eb00038-4a32-4f4c-8a8f-5c7abcbeb60e",
//               code: "HEALTH_MO_08_01_01_ZAVALA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "a39c07b1-5cd6-48f5-b33d-44f0ad8b1916",
//                   code: "HEALTH_MO_08_01_01_01_ZAVALA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "78dac634-54fb-4b64-b639-970215df3c5b",
//                       code: "HEALTH_MO_08_01_01_01_02_MABALANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8574448d-f108-4ffc-8798-5cb603edd0bf",
//                       code: "HEALTH_MO_08_01_01_01_01_MASSINGIR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "5421f271-d33b-4e9f-ae20-dc082af37c93",
//       code: "HEALTH_MO_07_ZAMBEZIA",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "51c70539-c110-432d-b929-35df32d2e8cc",
//           code: "HEALTH_MO_07_02_ALTO MOLOCULE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "da312652-d69a-4fea-aa37-9ed3493b529c",
//               code: "HEALTH_MO_07_02_01_ALTO MOLOCUE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "dc5d0fc9-64fc-4b78-aaf3-796b626648b1",
//                   code: "HEALTH_MO_07_02_01_01_ALTO MOLOCUE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d68f4b28-ff7c-4c12-b0c8-499633b96db3",
//                       code: "HEALTH_MO_07_02_01_01_10_LOCATION1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0220df87-30f7-450b-87bb-6f1b816f4613",
//                       code: "HEALTH_MO_07_02_01_01_09_LOCATION2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "70368288-69b7-4987-bf21-440c56f62d26",
//                       code: "HEALTH_MO_07_02_01_01_08_LOCATION3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cfdb9eb2-2f15-4aed-a480-5fc8bf3c954d",
//                       code: "HEALTH_MO_07_02_01_01_07_LOCATION4",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "93c63da9-d562-4bca-a193-cad893416994",
//                       code: "HEALTH_MO_07_02_01_01_06_LOCATION5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ee508fb8-4e1c-4996-96f7-160556a13910",
//                       code: "HEALTH_MO_07_02_01_01_05_LOCATION6",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "491a7388-e142-4390-8aff-1cd2e29ca7a2",
//                       code: "HEALTH_MO_07_02_01_01_04_LOCATION7",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "26760853-3e46-4356-a335-3bbcacce9ccd",
//                       code: "HEALTH_MO_07_02_01_01_03_LOCATION8",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a55c223d-9f66-4cbb-bc12-4f90df48d030",
//                       code: "HEALTH_MO_07_02_01_01_02_LOCATION9",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c68db21b-eb5a-4a9f-9d4f-783cad7de70d",
//                       code: "HEALTH_MO_07_02_01_01_01_LOCATION10",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "678ce6b3-e41d-419e-b18f-a61f63379384",
//           code: "HEALTH_MO_07_01_NAISSAE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "dfae2603-02eb-4e31-8104-501c72039d50",
//               code: "HEALTH_MO_07_01_01_NAISSA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d35dc50d-48ce-4581-b03d-5d8b6b150f56",
//                   code: "HEALTH_MO_07_01_01_01_NAISSA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "82856508-a50b-482b-abd0-3316df9de8fb",
//                       code: "HEALTH_MO_07_01_01_01_30_REGION1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "31dd52c1-95e3-412a-8c87-97fc014673d8",
//                       code: "HEALTH_MO_07_01_01_01_29_REGION2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5737cb9f-f109-4c04-b14d-1234ae65d783",
//                       code: "HEALTH_MO_07_01_01_01_28_REGION3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c9a4b462-9d95-4897-985b-42988b609b1e",
//                       code: "HEALTH_MO_07_01_01_01_27_REGION4",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b410f5c7-e906-44e4-9dfd-fad69d1e904b",
//                       code: "HEALTH_MO_07_01_01_01_26_REGION5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bdf9c0ba-95a7-4786-a0a9-189fa20dc8f8",
//                       code: "HEALTH_MO_07_01_01_01_25_REGION6",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6ff11be7-183f-42f1-a284-b6216b063cf8",
//                       code: "HEALTH_MO_07_01_01_01_24_REGION7",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "65385167-6c61-4180-b5ce-303d7f885e5a",
//                       code: "HEALTH_MO_07_01_01_01_23_REGION8",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0aad31a5-d4e4-4cf9-84aa-5e2303fdf235",
//                       code: "HEALTH_MO_07_01_01_01_22_REGION9",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e6df9f8a-9d97-4555-8b22-c4fdc72be172",
//                       code: "HEALTH_MO_07_01_01_01_21_REGION10",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6720cc00-29dd-45b0-b329-4ca3f13aeb04",
//                       code: "HEALTH_MO_07_01_01_01_20_REGION11",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0edef65d-d818-4b7c-ade1-d26dd2a24386",
//                       code: "HEALTH_MO_07_01_01_01_19_REGION12",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "947665e6-5a92-48de-8dc1-96d3eb167eb1",
//                       code: "HEALTH_MO_07_01_01_01_18_REGION13",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "06cac410-97eb-4d59-b558-69f67bae845d",
//                       code: "HEALTH_MO_07_01_01_01_17_REGION14",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "625f9b01-449e-4ac7-8741-de21fca218f7",
//                       code: "HEALTH_MO_07_01_01_01_16_REGION15",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aadda1d7-92e1-4288-a216-eaaa024a673f",
//                       code: "HEALTH_MO_07_01_01_01_15_REGION16",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f95493c1-ebd0-4e30-b970-1839b81de669",
//                       code: "HEALTH_MO_07_01_01_01_14_REGION17",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2670745d-338a-43d4-b25c-ebd673d6b837",
//                       code: "HEALTH_MO_07_01_01_01_13_REGION18",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "60213f49-3f7c-49f5-a971-545c0264761a",
//                       code: "HEALTH_MO_07_01_01_01_12_REGION19",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fc37796b-55ee-4d92-b776-e15e27e87ed7",
//                       code: "HEALTH_MO_07_01_01_01_11_REGION20",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1a93d94d-004c-4e5e-afe5-80c46a5a373e",
//                       code: "HEALTH_MO_07_01_01_01_10_REGION21",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9e5c07b1-e7e5-45bd-a61f-7f41ac91fcd5",
//                       code: "HEALTH_MO_07_01_01_01_09_REGION22",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e9cf906e-307c-4a3f-8b69-8063e37fc9b9",
//                       code: "HEALTH_MO_07_01_01_01_08_REGION23",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "04300ec1-4b4c-4c58-a5f8-78bf6c762e49",
//                       code: "HEALTH_MO_07_01_01_01_07_REGION24",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0b2cef1a-a309-4ca6-826d-b27ace536b39",
//                       code: "HEALTH_MO_07_01_01_01_06_REGION25",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1d5a883b-4837-4186-92c4-1b505145cee1",
//                       code: "HEALTH_MO_07_01_01_01_05_REGION26",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f16b04b9-6974-4ef3-9f74-467afd51ecec",
//                       code: "HEALTH_MO_07_01_01_01_04_REGION27",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1d8e0c05-bc88-4cd3-9a3a-02c8504e57e5",
//                       code: "HEALTH_MO_07_01_01_01_03_REGION28",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f409f8f-290b-4672-a7ec-71239de79642",
//                       code: "HEALTH_MO_07_01_01_01_02_REGION29",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c8da8976-b4d7-4cbb-9521-607c6406c5a1",
//                       code: "HEALTH_MO_07_01_01_01_01_REGION30",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "834e788e-bedb-41b2-96b6-ea9a933c3fd5",
//       code: "HEALTH_MO_06_TETE",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "4c99b9d7-63cc-4d16-9b56-060a507284f3",
//           code: "HEALTH_MO_06_12_MOATIZE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "8a3c9c87-43ab-4d54-b139-ba5a8291b98f",
//               code: "HEALTH_MO_06_12_01_KANSENGWA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "5830614a-783a-4a89-a4d8-f5512411bc5d",
//                   code: "HEALTH_MO_06_12_01_01_KANSENGWA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "bf107395-b333-4ada-a1a4-94995de94a2f",
//                       code: "HEALTH_MO_06_12_01_01_02_MURO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b942233b-64c5-46d7-a6ae-1fa3e9103787",
//                       code: "HEALTH_MO_06_12_01_01_01_CHIRIMBU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "5d6e4f10-975f-4a8e-9649-e394711191a7",
//           code: "HEALTH_MO_06_11_MUTARARA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "30cd1f64-3cb7-4476-bc16-34b0597bdfec",
//               code: "HEALTH_MO_06_11_01_MURROTHONE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "dc5c9cf7-1e59-4807-a2d4-8ea9aadd99fb",
//                   code: "HEALTH_MO_06_11_01_01_MURROTHONE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "802e14af-439c-4d00-9b7b-335b7458f6f3",
//                       code: "HEALTH_MO_06_11_01_01_02_CHIMUQUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7ee53a8a-f0cf-4756-9e29-74b2d6e3dbb7",
//                       code: "HEALTH_MO_06_11_01_01_01_NHAFUCO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "05cc5e70-c94c-4f01-b384-0307ca8ad3f8",
//           code: "HEALTH_MO_06_10_MACANGA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "228cbe2c-400b-41b8-afbd-33abf40792be",
//               code: "HEALTH_MO_06_10_01_CHIFUNDE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "9b148a0b-e794-41d5-8dcd-5128439ca34a",
//                   code: "HEALTH_MO_06_10_01_01_CHIFUNDE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "174d1b61-2c4a-47d8-8179-b8bb84b62234",
//                       code: "HEALTH_MO_06_10_01_01_02_NHAMAMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b27b6aa6-394c-4882-84b1-a85c2a3eb4fc",
//                       code: "HEALTH_MO_06_10_01_01_01_MACOTI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "cfac6ca1-2f11-4e00-ac09-8ee474910b26",
//           code: "HEALTH_MO_06_09_ANGÓNIA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "50349441-0c60-4d26-83dc-f00349e1563f",
//               code: "HEALTH_MO_06_09_02_ULONGUE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "5256e6f5-55be-4985-9bc7-172fc50d5f8a",
//                   code: "HEALTH_MO_06_09_02_01_ULONGUE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b4180b6c-76c8-44d0-9ef5-c2cdce09a1f3",
//                       code: "HEALTH_MO_06_09_02_01_02_NHATE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "90e80207-fb21-47ad-b26a-fd0cac7be115",
//                       code: "HEALTH_MO_06_09_02_01_01_MATCHESSA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "aa57bacc-5a3a-4ca3-ab4c-48c19951b8f6",
//               code: "HEALTH_MO_06_09_01_MULANGUANE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "33136241-0053-4223-a97d-bb4ed8e34741",
//                   code: "HEALTH_MO_06_09_01_01_MULANGUANE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "2ec2ffd2-69aa-48b2-9394-a4a79e62f99b",
//                       code: "HEALTH_MO_06_09_01_01_02_NHAYARA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9bb04147-692e-4745-bd32-bf0002a9e965",
//                       code: "HEALTH_MO_06_09_01_01_01_CHILEMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "61ea2163-3513-49a3-b64c-e9478678c9e0",
//           code: "HEALTH_MO_06_08_TSANGANO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "9aab6184-cdc3-4469-93f1-e53145f6ef7d",
//               code: "HEALTH_MO_06_08_02_FURANCUNGO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "b14ef0c8-a5a4-4792-9146-5ff46d83d5cf",
//                   code: "HEALTH_MO_06_08_02_01_FURANCUNGO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "c5ac1f89-5de2-45ff-8719-a090e60af835",
//                       code: "HEALTH_MO_06_08_02_01_02_MAROE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1ef0a7fa-eb97-425f-b073-754107f9e919",
//                       code: "HEALTH_MO_06_08_02_01_01_MUJA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "6661ace4-3f08-472c-b520-bed159ede5bc",
//               code: "HEALTH_MO_06_08_01_MARARA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f611e501-26bc-4208-ad0c-8c25931962cc",
//                   code: "HEALTH_MO_06_08_01_01_MARARA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "09f3d6b1-5aaf-476b-a599-3520dd627ccb",
//                       code: "HEALTH_MO_06_08_01_01_02_MATCHIME",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2c4423e6-de1f-49c6-a196-dc3c72e87bda",
//                       code: "HEALTH_MO_06_08_01_01_01_MACAIA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "5c5861fa-52bf-47e4-b8b6-78254e5441ba",
//           code: "HEALTH_MO_06_07_CAHORA BASSA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "8d7fbdf2-192c-4716-94e2-792eba1f7051",
//               code: "HEALTH_MO_06_07_03_CHITIMA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "33c3e0ec-1c23-4d7c-a670-9a060d343484",
//                   code: "HEALTH_MO_06_07_03_01_CHITIMA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "763ebbaa-a0a6-40d7-af1f-393b9e561b2e",
//                       code: "HEALTH_MO_06_07_03_01_02_SAMBINDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1bf333ab-3f2a-47ca-b732-97ec0d19c57e",
//                       code: "HEALTH_MO_06_07_03_01_01_MACHURO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "69f3cfa1-ecdf-4e9a-ab3a-b43b13a82ad2",
//               code: "HEALTH_MO_06_07_02_SONGO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "e5fc8840-f960-42ca-8c1a-90ded66d1786",
//                   code: "HEALTH_MO_06_07_02_01_SONGO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a5f59f24-c09e-4bd7-9d6f-4eb6cc06ade8",
//                       code: "HEALTH_MO_06_07_02_01_02_MACOCHA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1a849c47-f429-43e9-ad9b-76b7c1336f2a",
//                       code: "HEALTH_MO_06_07_02_01_01_NHAMADA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "3d6284a7-69ac-4b82-b7d0-f53fffed0f2a",
//               code: "HEALTH_MO_06_07_01_MANDIE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "1c5d200d-648c-40b3-9609-f4edc568c1e2",
//                   code: "HEALTH_MO_06_07_01_01_MANDIE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "f5636af6-3d28-44ac-b39e-a259e5c1b4c1",
//                       code: "HEALTH_MO_06_07_01_01_02_NHAMISSENGUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b3ebc49e-0ebe-4e3b-8fda-35f940250788",
//                       code: "HEALTH_MO_06_07_01_01_01_MACAPA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "1dfe4e0a-9ea4-4c2e-a2cf-38bff2a3a124",
//           code: "HEALTH_MO_06_06_CHIUTA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "76d46661-8a76-4c3a-8ed5-99f0b842527e",
//               code: "HEALTH_MO_06_06_02_KAFUNFO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d399ad5b-895d-4fd6-ad03-d9682936de45",
//                   code: "HEALTH_MO_06_06_02_01_KAFUNFO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "68d7b9c4-7c80-4f78-b364-0477e7a9d93b",
//                       code: "HEALTH_MO_06_06_02_01_02_NHANDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fbbe9f38-6b13-431d-87dd-8d68c1b906ed",
//                       code: "HEALTH_MO_06_06_02_01_01_MACAMBULA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "79ec1679-05a5-4502-a790-ee0223c649f1",
//               code: "HEALTH_MO_06_06_01_NHAMPOSSA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "929be54f-7f08-4125-bb4e-a4e76dbac7ff",
//                   code: "HEALTH_MO_06_06_01_01_NHAMPOSSA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "191c1a05-b15d-48dd-95a9-d81f27a49d34",
//                       code: "HEALTH_MO_06_06_01_01_02_MAZANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "84ea9695-97d7-4707-addb-205b6963e2da",
//                       code: "HEALTH_MO_06_06_01_01_01_MACUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "2982a58f-8d9e-45c9-9d12-78564be15370",
//           code: "HEALTH_MO_06_05_MAGOE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "e806df00-c9d8-4376-9a23-e97363c5b902",
//               code: "HEALTH_MO_06_05_03_CHARRE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "eaa8f85a-f9fc-44a2-8463-4d57f0c845b7",
//                   code: "HEALTH_MO_06_05_03_01_CHARRE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a4be9d3e-4cc8-4b07-a255-56ad292691c2",
//                       code: "HEALTH_MO_06_05_03_01_02_CHILUCA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "24d03807-7a2d-453e-bbc6-83aaa7325a2b",
//                       code: "HEALTH_MO_06_05_03_01_01_CHIMBUNDE-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "a9a20077-1c96-435d-9f9d-5a653f4399c5",
//               code: "HEALTH_MO_06_05_02_CAFUMPA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d3fbb280-539a-4578-bfdf-129bf9fd8cbf",
//                   code: "HEALTH_MO_06_05_02_01_CAFUMPA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ecd40ee6-efde-4dca-ae02-e98e5266aa17",
//                       code: "HEALTH_MO_06_05_02_01_02_MACHIPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "684b0f56-b3b4-4673-a6fb-ae36efcdcf08",
//                       code: "HEALTH_MO_06_05_02_01_01_CHIMBENGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "ce3eb8f5-9605-4c18-b5eb-92b678412d51",
//               code: "HEALTH_MO_06_05_01_INHAMGOMA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0c1c3494-3dec-4381-9cc8-0be51565faf4",
//                   code: "HEALTH_MO_06_05_01_01_INHAMGOMA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a6c9dc77-aba6-4d6e-bad9-acc5b8a478f8",
//                       code: "HEALTH_MO_06_05_01_01_02_MACHAMBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "150e9b4d-ee18-4a37-9ece-8c9df44da894",
//                       code: "HEALTH_MO_06_05_01_01_01_MACARULA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "e3fd5254-93b6-4210-b4d7-37165d7addb4",
//           code: "HEALTH_MO_06_04_CHANGARA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "8132a646-d67c-4ceb-8048-c5b78379c3f7",
//               code: "HEALTH_MO_06_04_02_LUCALA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "3ddf6863-7da6-408c-bc1b-cd643dfa6674",
//                   code: "HEALTH_MO_06_04_02_01_LUCALA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "43058095-7d36-4eba-9035-bde3303f6f82",
//                       code: "HEALTH_MO_06_04_02_01_02_MALENGA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0008999f-eb92-477d-aa9d-0ad1e69c4692",
//                       code: "HEALTH_MO_06_04_02_01_01_NHAURAO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "ac58c10f-2ecf-4d8d-8cfb-4b6206d9cd75",
//               code: "HEALTH_MO_06_04_01_NDIMA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f7a61915-d40e-4894-b1c2-3d3a6ef23f1f",
//                   code: "HEALTH_MO_06_04_01_01_NDIMA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1418718d-984e-4447-87db-0ad7634a79ca",
//                       code: "HEALTH_MO_06_04_01_01_02_NHATHANDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "97d66c83-1cfb-472f-81de-83fefa71de2a",
//                       code: "HEALTH_MO_06_04_01_01_01_CHIRINDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "eb2782b0-a920-40ae-ac87-e1d2a50a40a4",
//           code: "HEALTH_MO_06_03_ZUMBO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "798e721f-602d-4a99-bb94-d126ace0f86d",
//               code: "HEALTH_MO_06_03_01_MUCUMBURA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "76cc72e7-fc3a-45aa-933a-7d8b8b4c5b16",
//                   code: "HEALTH_MO_06_03_01_01_MUCUMBURA SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "4b910928-41a9-4bd2-b76e-71a90b0e049f",
//                       code: "HEALTH_MO_06_03_01_01_02_MAVERA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "448d82ed-594e-4cba-8a9a-e55dc37278e4",
//                       code: "HEALTH_MO_06_03_01_01_01_NYAMPANDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "66f992b4-6284-4d4f-84a1-181cab90a0d0",
//           code: "HEALTH_MO_06_02_CHIFUNDE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "c4f96f46-8d1e-4290-a9ca-1376a49ac9e6",
//               code: "HEALTH_MO_06_02_01_CHINTHOLO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7f350df7-d5c2-4630-aff0-04167c47d680",
//                   code: "HEALTH_MO_06_02_01_01_CHINTHOLO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "aca65774-d702-4823-bb83-304cee22a41b",
//                       code: "HEALTH_MO_06_02_01_01_02_CHAVITSA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "80c60011-12c1-4b5b-97ed-86040565abe4",
//                       code: "HEALTH_MO_06_02_01_01_01_NHASSANGWA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "bc6cf5dc-81b7-46a8-a3a3-fca23d83e5cf",
//           code: "HEALTH_MO_06_01_DÔA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "d3f663de-6567-4eef-ab12-019dc5a2de89",
//               code: "HEALTH_MO_06_01_01_NHAMAYABWE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "2c8315f7-3d23-4867-92ba-7cdbfef9b1e2",
//                   code: "HEALTH_MO_06_01_01_01_NHAMAYABWE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "78a6e4d8-9e55-43d4-83d9-94b5eb85c4e7",
//                       code: "HEALTH_MO_06_01_01_01_02_NHAMUCANDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6bceea64-fd02-4aec-a29e-4b9c2835c9fa",
//                       code: "HEALTH_MO_06_01_01_01_01_MATARARA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "becd0f6e-c1dd-4629-9b7d-d22ec022fc73",
//       code: "HEALTH_MO_05_TEST PROVINCE",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "f8f66489-33c8-4837-bd66-aa93dbe71a18",
//           code: "HEALTH_MO_05_02_DISTRICTONE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "6d4aeaf6-8463-47c6-9fcc-407f20cd80d9",
//               code: "HEALTH_MO_05_02_02_POST ADMINISTRATIVEONE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "e8602e07-43a3-4955-8edd-26898b4d352e",
//                   code: "HEALTH_MO_05_02_02_03_LOCALITYONE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "baaf85f0-325c-4235-b33d-4f91cf7b3740",
//                       code: "HEALTH_MO_05_02_02_03_12_VILLAGEONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dfd9f84b-d3e2-4a4c-ab2b-8bf568f0c7b2",
//                       code: "HEALTH_MO_05_02_02_03_11_VILLAGETWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "92992bcb-761a-4458-a7cd-916d2e032c27",
//                       code: "HEALTH_MO_05_02_02_03_10_VILLAGETHREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ec18fdf5-3b85-4a25-a947-d5edd6129f8a",
//                       code: "HEALTH_MO_05_02_02_03_09_VILLAGEFOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7046bd06-0230-434a-ad3b-8104d955d599",
//                       code: "HEALTH_MO_05_02_02_03_08_VILLAGEFIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a5cd8eb7-88d6-4645-8578-68e34127a362",
//                       code: "HEALTH_MO_05_02_02_03_07_VILLAGESIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b6af67b4-9e9e-4ed4-b99a-655761ba7755",
//                       code: "HEALTH_MO_05_02_02_03_06_VILLAGESEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "51b5f69b-7365-4f11-8f91-464359c7cbcc",
//                       code: "HEALTH_MO_05_02_02_03_05_VILLAGEEIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f2b28001-9fa8-40ff-a9bf-80fc941cdb17",
//                       code: "HEALTH_MO_05_02_02_03_04_VILLAGENINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "61743112-a4e1-43da-9db0-d3af4ea18303",
//                       code: "HEALTH_MO_05_02_02_03_03_VILLAGETEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9721fad2-5075-47f0-84e7-2652739df98c",
//                       code: "HEALTH_MO_05_02_02_03_02_VILLAGEELEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "233c3052-8230-497d-929b-3e4825b27a38",
//                       code: "HEALTH_MO_05_02_02_03_01_VILLAGETWELVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "d111d7d7-f77f-424d-8382-df461f33b4d1",
//                   code: "HEALTH_MO_05_02_02_02_LOCALITYTWO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0ed51057-5193-4937-94ae-a50724c21166",
//                       code: "HEALTH_MO_05_02_02_02_12_VILLAGETHIRTEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a2640cb0-89b1-4a08-b29f-36d654eece40",
//                       code: "HEALTH_MO_05_02_02_02_11_VILLAGEFOURTEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8ba622c1-261f-4738-a000-0a312145fe10",
//                       code: "HEALTH_MO_05_02_02_02_10_VILLAGEFIFTEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5a25bc04-5a0f-4635-af1a-ed58ab8d4374",
//                       code: "HEALTH_MO_05_02_02_02_09_VILLAGESIXTEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4d210f6e-9fd2-491d-83d4-07e4ae7905fa",
//                       code: "HEALTH_MO_05_02_02_02_08_VILLAGESEVENTEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "28de79e3-f5d7-4893-961c-3dc1a3b05937",
//                       code: "HEALTH_MO_05_02_02_02_07_VILLAGEEIGHTEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3cc9c764-20d5-4a32-834a-050ea0c16f4b",
//                       code: "HEALTH_MO_05_02_02_02_06_VILLAGENINETEEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4e3ed144-a90c-4c92-88b0-6110fadeb8b6",
//                       code: "HEALTH_MO_05_02_02_02_05_VILLAGETWENTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a48d0f0e-c90d-47fa-8b0f-148677e5fcc9",
//                       code: "HEALTH_MO_05_02_02_02_04_VILLAGETWENTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "900d06c6-5daf-45d3-9326-9643fcdeb59a",
//                       code: "HEALTH_MO_05_02_02_02_03_VILLAGETWENTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fb781147-dcbb-402e-b696-6d98caa8198b",
//                       code: "HEALTH_MO_05_02_02_02_02_VILLAGETWENTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "573208b9-527c-4417-9109-0402e46439c1",
//                       code: "HEALTH_MO_05_02_02_02_01_VILLAGETWENTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "e0ebc5f9-fe18-4356-9fc7-8f4816cdfa54",
//                   code: "HEALTH_MO_05_02_02_01_LOCALITYTHREE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "9f530fa5-bf1b-459a-81a7-50b1b5a611da",
//                       code: "HEALTH_MO_05_02_02_01_12_VILLAGETWENTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7f9a1c4a-f3da-420d-90f8-46bf06229f6c",
//                       code: "HEALTH_MO_05_02_02_01_11_VILLAGETWENTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b6630808-3037-44ca-8c3c-b0af71261ee1",
//                       code: "HEALTH_MO_05_02_02_01_10_VILLAGETWENTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a80e8f91-8e04-48c2-8788-7f15173080e4",
//                       code: "HEALTH_MO_05_02_02_01_09_VILLAGETWENTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "10344b5d-59ca-4ec3-9ac7-9c818d7a0cc9",
//                       code: "HEALTH_MO_05_02_02_01_08_VILLAGETWENTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f81afa7b-7250-4066-a7ec-35a579c5c458",
//                       code: "HEALTH_MO_05_02_02_01_07_VILLAGETHIRTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3ef9e8b5-2349-4fa5-9c08-4e221da1243f",
//                       code: "HEALTH_MO_05_02_02_01_06_VILLAGETHIRTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "78fecf3a-8dad-4fc0-a938-6e5a05ec6781",
//                       code: "HEALTH_MO_05_02_02_01_05_VILLAGETHIRTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f1647460-6978-462b-a5ad-a320f99561e5",
//                       code: "HEALTH_MO_05_02_02_01_04_VILLAGETHIRTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "79ab4fff-d994-44c0-9c77-5851c587d3e0",
//                       code: "HEALTH_MO_05_02_02_01_03_VILLAGETHIRTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b71acd9-eec1-41b1-8b24-68801f55a24c",
//                       code: "HEALTH_MO_05_02_02_01_02_VILLAGETHIRTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "56a9eb99-bc8d-4a44-9a0f-70b24d4e51fb",
//                       code: "HEALTH_MO_05_02_02_01_01_VILLAGETHIRTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "9c1f639e-65d1-4990-a7eb-26eb7ae569ea",
//               code: "HEALTH_MO_05_02_01_POST ADMINISTRATIVETWO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "ae4b8ad8-95c2-42c2-8a8b-889b11f68ba2",
//                   code: "HEALTH_MO_05_02_01_02_LOCALITYFOUR",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "30e01d9e-b635-46eb-a783-b68125fe2c84",
//                       code: "HEALTH_MO_05_02_01_02_12_VILLAGETHIRTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1b8f56e3-3cdd-451b-bf80-ad0903e946b4",
//                       code: "HEALTH_MO_05_02_01_02_11_VILLAGETHIRTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f7f4d0be-eb27-46c2-8649-f22afe04d2b7",
//                       code: "HEALTH_MO_05_02_01_02_10_VILLAGETHIRTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2ac8bbc9-6848-415d-b2b1-06e3e941b2f8",
//                       code: "HEALTH_MO_05_02_01_02_09_VILLAGEFORTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "db4c6319-feef-406c-bb5f-cde7b56d9909",
//                       code: "HEALTH_MO_05_02_01_02_08_VILLAGEFORTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "66992025-550a-48e0-b04c-c65ccda19112",
//                       code: "HEALTH_MO_05_02_01_02_07_VILLAGEFORTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7ef3345e-e22f-426a-a75a-ba22e6429d3f",
//                       code: "HEALTH_MO_05_02_01_02_06_VILLAGEFORTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6529b5fd-ff09-47a6-84b0-770915d58c7c",
//                       code: "HEALTH_MO_05_02_01_02_05_VILLAGEFORTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9ac9f385-01e5-46a8-ad8e-147ba0172321",
//                       code: "HEALTH_MO_05_02_01_02_04_VILLAGEFORTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "541fc9f9-4716-4ac0-b6d9-4910cc29097a",
//                       code: "HEALTH_MO_05_02_01_02_03_VILLAGEFORTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "672d6121-b61d-41e9-8354-5eeba6ca32ad",
//                       code: "HEALTH_MO_05_02_01_02_02_VILLAGEFORTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8ab4a358-a277-46e1-a96c-52af0ae89969",
//                       code: "HEALTH_MO_05_02_01_02_01_VILLAGEFORTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "3edbb694-2b9b-4c0f-8d32-0e0e655ff78d",
//                   code: "HEALTH_MO_05_02_01_01_LOCALITYFIVE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "2d21b480-4743-4aa0-9426-d5d26308dc3a",
//                       code: "HEALTH_MO_05_02_01_01_12_VILLAGEFORTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f74a7d02-4391-431a-bc52-da46b7f24f2d",
//                       code: "HEALTH_MO_05_02_01_01_11_VILLAGEFIFTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "37ee9942-faf7-4e5e-bd55-bbb0eded18f3",
//                       code: "HEALTH_MO_05_02_01_01_10_VILLAGEFIFTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d3d9d6f5-4030-406d-968b-205243e73e74",
//                       code: "HEALTH_MO_05_02_01_01_09_VILLAGEFIFTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "00a4abda-d0d2-47a0-920b-ebe3f00b0728",
//                       code: "HEALTH_MO_05_02_01_01_08_VILLAGEFIFTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f8df2522-9ce1-432c-b9a0-0934ec84c92b",
//                       code: "HEALTH_MO_05_02_01_01_07_VILLAGEFIFTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa8d3f21-5b87-4bdd-80b3-40db3cf6187a",
//                       code: "HEALTH_MO_05_02_01_01_06_VILLAGEFIFTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b6a93179-daa4-4964-8339-6c89b6f0ffe8",
//                       code: "HEALTH_MO_05_02_01_01_05_VILLAGEFIFTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f604ada1-5dc6-4e0c-9217-eb810cb5b031",
//                       code: "HEALTH_MO_05_02_01_01_04_VILLAGEFIFTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "df91bbe8-cd7c-4a5f-809d-2da55089c945",
//                       code: "HEALTH_MO_05_02_01_01_03_VILLAGEFIFTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "18fcc0a5-4990-4ba5-9d09-311f83e8e208",
//                       code: "HEALTH_MO_05_02_01_01_02_VILLAGEFIFTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7cce47cb-4292-4dd9-80d6-b3cdc201dbe9",
//                       code: "HEALTH_MO_05_02_01_01_01_VILLAGESIXTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "37e9456f-045a-4972-8daa-aaba976ca3ee",
//           code: "HEALTH_MO_05_01_DISTRICTTWO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "5e84fedf-7f52-41fa-a91e-d7c8fc311fe5",
//               code: "HEALTH_MO_05_01_02_POST ADMINISTRATIVETHREE",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "1ebc3b2c-6b83-4ddf-95c4-910176cb832b",
//                   code: "HEALTH_MO_05_01_02_02_LOCALITYSIX",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "37298c01-e51a-4bbd-aaa7-5dfea9db0e5a",
//                       code: "HEALTH_MO_05_01_02_02_12_VILLAGESIXTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "28dbdd6a-3090-4436-8aa1-f4232508cf15",
//                       code: "HEALTH_MO_05_01_02_02_11_VILLAGESIXTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "12f389b6-7ca0-4d81-8e13-43eb8db3f789",
//                       code: "HEALTH_MO_05_01_02_02_10_VILLAGESIXTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9c648f9e-efdb-49fc-b4a9-90973f8e7da2",
//                       code: "HEALTH_MO_05_01_02_02_09_VILLAGESIXTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5b506e10-8db6-4c70-80e7-650ca73b0caf",
//                       code: "HEALTH_MO_05_01_02_02_08_VILLAGESIXTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "454cde59-df1e-4f80-995e-1324248d699c",
//                       code: "HEALTH_MO_05_01_02_02_07_VILLAGESIXTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2b3d9fb4-d4ee-4519-a4b4-d54eab4cae8b",
//                       code: "HEALTH_MO_05_01_02_02_06_VILLAGESIXTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4e4401b3-c5c9-47e3-b997-23ecc9560e3e",
//                       code: "HEALTH_MO_05_01_02_02_05_VILLAGESIXTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "981c482d-8836-4dce-9809-eaecc92a404f",
//                       code: "HEALTH_MO_05_01_02_02_04_VILLAGESIXTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "92e6b2ab-c391-44b9-999e-c6f366f462a8",
//                       code: "HEALTH_MO_05_01_02_02_03_VILLAGESEVENTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c66b42c2-1876-49a1-b68a-a4794a320a0b",
//                       code: "HEALTH_MO_05_01_02_02_02_VILLAGESEVENTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1c6fe0c8-60e6-466e-83aa-c35f75872479",
//                       code: "HEALTH_MO_05_01_02_02_01_VILLAGESEVENTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "9d85ec04-35ff-43e2-a216-43aea935a45d",
//                   code: "HEALTH_MO_05_01_02_01_LOCALITYSEVEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e29bf2af-c518-41db-83fe-2cc075637943",
//                       code: "HEALTH_MO_05_01_02_01_07_VILLAGESEVENTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "54438067-7656-4ce5-98e3-5968e3e78553",
//                       code: "HEALTH_MO_05_01_02_01_06_VILLAGESEVENTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d2556fde-2ac2-4ea4-81d9-53d651649153",
//                       code: "HEALTH_MO_05_01_02_01_05_VILLAGESEVENTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6824e819-63c9-4a79-966c-acef8d0611a7",
//                       code: "HEALTH_MO_05_01_02_01_04_VILLAGESEVENTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "69ae899b-c336-4491-b89d-0030afe7f71a",
//                       code: "HEALTH_MO_05_01_02_01_03_VILLAGESEVENTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "630a964a-af9d-48ae-ba58-a08d3260d674",
//                       code: "HEALTH_MO_05_01_02_01_02_VILLAGESEVENTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "78142e7c-7f67-4635-85c5-7808d5da15cb",
//                       code: "HEALTH_MO_05_01_02_01_01_VILLAGESEVENTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "daa24fd9-64ea-4662-8fb5-64b14509c7ee",
//               code: "HEALTH_MO_05_01_01_POST ADMINISTRATIVEFOUR",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d61f51e0-365c-4fc4-aef9-b903fdfc4601",
//                   code: "HEALTH_MO_05_01_01_02_LOCALITYEIGHT",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "24a9b886-dae5-40f1-ac9b-751ad0255ac2",
//                       code: "HEALTH_MO_05_01_01_02_10_VILLAGEEIGHTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3260300c-efee-4d27-9bb7-7ccfcbbf9f60",
//                       code: "HEALTH_MO_05_01_01_02_09_VILLAGEEIGHTY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "91618128-b567-4d1e-a9fb-5aa7cab566c4",
//                       code: "HEALTH_MO_05_01_01_02_08_VILLAGEEIGHTY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3a50994a-d852-4046-aac8-69ee1f073e57",
//                       code: "HEALTH_MO_05_01_01_02_07_VILLAGEEIGHTY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a1b8328a-4da4-48cf-923f-2e2a1a028cb7",
//                       code: "HEALTH_MO_05_01_01_02_06_VILLAGEEIGHTY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "983a9e1b-6467-4f1a-bf67-7571d5798261",
//                       code: "HEALTH_MO_05_01_01_02_05_VILLAGEEIGHTY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "443812c9-4ceb-41d0-8315-3d2798214097",
//                       code: "HEALTH_MO_05_01_01_02_04_VILLAGEEIGHTY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f9c11cda-e24a-4eb4-9901-6369c4f30563",
//                       code: "HEALTH_MO_05_01_01_02_03_VILLAGEEIGHTY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "128ff25d-9f7b-4c2e-a1e3-69c869e9af0e",
//                       code: "HEALTH_MO_05_01_01_02_02_VILLAGEEIGHTY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5a9e3b31-79cc-438c-b785-cfe31f65c60d",
//                       code: "HEALTH_MO_05_01_01_02_01_VILLAGEEIGHTY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "c6da2ed1-e22b-42ce-a12e-d56faea08b41",
//                   code: "HEALTH_MO_05_01_01_01_LOCALITYNINE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "23077b6d-2f2b-4f7c-9212-5cf218296fab",
//                       code: "HEALTH_MO_05_01_01_01_10_VILLAGENINETY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "28a516bc-a916-46af-a3ef-45a1c9bed62a",
//                       code: "HEALTH_MO_05_01_01_01_09_VILLAGENINETY-ONE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e6afa230-bc4f-4224-b666-335596c1947d",
//                       code: "HEALTH_MO_05_01_01_01_08_VILLAGENINETY-TWO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "957e851d-bd12-4862-b582-2061fbf3cd49",
//                       code: "HEALTH_MO_05_01_01_01_07_VILLAGENINETY-THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2a01e7c5-5147-46d3-85e5-22270161a927",
//                       code: "HEALTH_MO_05_01_01_01_06_VILLAGENINETY-FOUR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3ba0f59c-4c55-462d-a0c5-0f6b01f338e9",
//                       code: "HEALTH_MO_05_01_01_01_05_VILLAGENINETY-FIVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8a66b08c-4c73-422d-83a4-77e1550a5b26",
//                       code: "HEALTH_MO_05_01_01_01_04_VILLAGENINETY-SIX",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "14196433-d04b-4f12-a763-efd51c0dedbe",
//                       code: "HEALTH_MO_05_01_01_01_03_VILLAGENINETY-SEVEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "951dfba9-1fb4-489d-9142-092afa29dd6d",
//                       code: "HEALTH_MO_05_01_01_01_02_VILLAGENINETY-EIGHT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b1298d61-9a71-4294-9a90-d8b9613bc288",
//                       code: "HEALTH_MO_05_01_01_01_01_VILLAGENINETY-NINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "ae82a327-8369-4bbd-9738-e432f43fb583",
//       code: "HEALTH_MO_04_MAPUTO CITY",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "4e0bf6c4-1218-4014-978f-ba427d31f3b4",
//           code: "HEALTH_MO_04_02_KAMPFUMU",
//           boundaryType: "District",
//           children: [
//             {
//               id: "ec8745f3-ca53-46c7-9173-1934026d50fa",
//               code: "HEALTH_MO_04_02_03_KAMAXAQUENEB",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "9dde2ecd-dc92-468e-94e7-71c4640cdff2",
//                   code: "HEALTH_MO_04_02_03_01_KAMAXAQUENEB SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ba4fcbc2-9e3e-4a40-a19c-b6df53653a15",
//                       code: "HEALTH_MO_04_02_03_01_04_NHAGOLO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b60bfb54-3f55-4518-bf28-58e881c92523",
//                       code: "HEALTH_MO_04_02_03_01_03_MAFALALA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "961505d5-7210-4ae3-a8c6-f3b8267e9fab",
//                       code: "HEALTH_MO_04_02_03_01_02_NHAMATCHUCO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e02ec8c4-cb4c-4232-8c56-2bf98bbb7d7e",
//                       code: "HEALTH_MO_04_02_03_01_01_CHONWANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "f741cc6f-1b5b-45d5-972c-22274ad2102a",
//               code: "HEALTH_MO_04_02_02_KACHAMANCULOO",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0b3cfeb9-12bc-4ad3-9f48-96fe0ac6ab2c",
//                   code: "HEALTH_MO_04_02_02_01_KACHAMANCULO SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "226c9241-3b20-4e3d-b786-86eb72e621b6",
//                       code: "HEALTH_MO_04_02_02_01_12_CHICUANA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "44ed0a89-92d6-40bc-85fe-4ed3161edbc0",
//                       code: "HEALTH_MO_04_02_02_01_11_MAQUIAVE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "17182c91-c949-45f2-828b-c287cf33c04e",
//                       code: "HEALTH_MO_04_02_02_01_10_NHAMATANDA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "51c03405-9a31-45c7-ba9c-81d8db91fdb7",
//                       code: "HEALTH_MO_04_02_02_01_09_CHISSANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c52fc2b2-2dd9-468c-aefa-53cc8e3b00d5",
//                       code: "HEALTH_MO_04_02_02_01_08_CHIUUREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "df301b7a-98f0-4f28-a61e-01b05053d936",
//                       code: "HEALTH_MO_04_02_02_01_07_CHIUUREE 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7ccf7832-20e6-4c64-8a4d-c8ba9874fd5d",
//                       code: "HEALTH_MO_04_02_02_01_06_CHIUUREE 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "69948b53-1165-437c-8a28-0973c90e498c",
//                       code: "HEALTH_MO_04_02_02_01_05_CHIUUREE 3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7256e1b6-af17-4d38-acfb-12371fb8553f",
//                       code: "HEALTH_MO_04_02_02_01_04_CHIUUREE 4",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2643f604-6991-4e5d-acec-e08439a5d103",
//                       code: "HEALTH_MO_04_02_02_01_03_MAPUTO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3631d14d-b4f5-4521-903a-ef0ed4bcb2e7",
//                       code: "HEALTH_MO_04_02_02_01_02_CHIMBUNDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "238f61c3-eb32-4e1a-aa57-d4436902dfca",
//                       code: "HEALTH_MO_04_02_02_01_01_CHIMAZI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "6edaebeb-02ea-4763-a117-62c3e27a9803",
//               code: "HEALTH_MO_04_02_01_KAMPFUMUU",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0bab267f-5618-422b-a091-f8dbf22a290d",
//                   code: "HEALTH_MO_04_02_01_01_KAMPFUMU SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8287b40c-2887-454d-a14e-ea959d768e43",
//                       code: "HEALTH_MO_04_02_01_01_02_MASSAMBI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3c9c8c10-7570-4b10-8828-faccf9ce69df",
//                       code: "HEALTH_MO_04_02_01_01_01_CHIMARIR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "edf21e92-1e29-4bbd-b4b6-0a9c30145b52",
//           code: "HEALTH_MO_04_01_KAMAXAQUENE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "da2bfafc-0e8f-4ea0-82a3-928b57635ab1",
//               code: "HEALTH_MO_04_01_01_KAMAXAQUENEA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "969953d5-5f96-4c31-a913-cdfa96f77202",
//                   code: "HEALTH_MO_04_01_01_01_KAMAXAQUENE SEDE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e49d8672-e242-49d7-945d-f3315c560e44",
//                       code: "HEALTH_MO_04_01_01_01_04_NHAMAZANE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e28258ae-6d72-4723-a5fc-ce65bd36bf4f",
//                       code: "HEALTH_MO_04_01_01_01_03_MAZAMBIQUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0cba7955-b216-427d-a55e-43ec9d40778f",
//                       code: "HEALTH_MO_04_01_01_01_02_CHINMARI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "595d691c-4651-41a5-82d9-ef5eb582a21d",
//                       code: "HEALTH_MO_04_01_01_01_01_CHIRINGU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "1d2819b2-0f35-423a-91e6-95aa146cadd4",
//       code: "HEALTH_MO_03_MARYLAND",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "538f27e0-d51e-4fdd-9eea-dd51629aabc8",
//           code: "HEALTH_MO_03_06_BARROBO FARJAH",
//           boundaryType: "District",
//           children: [
//             {
//               id: "3a330d34-4f62-45b7-83b9-c0d2d9a4e597",
//               code: "HEALTH_MO_03_06_02_GBARWILIKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "840f92e8-d65c-4324-bf94-0f3462852fe4",
//                   code: "HEALTH_MO_03_06_02_01_GBARWILIKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "81920728-2c99-44b5-84bb-5ecb8e259e76",
//                       code: "HEALTH_MO_03_06_02_01_08_GWISSIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "54b2230a-9708-457e-9d44-bcf9d56360d2",
//                       code: "HEALTH_MO_03_06_02_01_07_MARFLIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7de894a3-a4aa-4fb1-87b3-02f4e7d4bb09",
//                       code: "HEALTH_MO_03_06_02_01_06_TEAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c7dbe377-1630-41d7-b248-213431b11bc9",
//                       code: "HEALTH_MO_03_06_02_01_05_ROCK TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b49fc3e5-3411-4b46-bd38-82e31a464ba3",
//                       code: "HEALTH_MO_03_06_02_01_04_GUTUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "acd160bf-1abd-46ea-8e5f-dca3975bff50",
//                       code: "HEALTH_MO_03_06_02_01_03_GBARWILIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dc026428-d130-4b57-ae02-445e23feb175",
//                       code: "HEALTH_MO_03_06_02_01_02_KARDIO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ecfc48f3-96ac-4bc8-89ad-eeec3db56bc1",
//                       code: "HEALTH_MO_03_06_02_01_01_TENKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "4c6f1329-09eb-4efd-9eb1-085f84ab55bd",
//               code: "HEALTH_MO_03_06_01_FELOKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "1296058a-9b97-42ed-bad3-65a7250085e4",
//                   code: "HEALTH_MO_03_06_01_01_FELOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a3da24e2-74c0-4b3c-97f1-b5864de16f5f",
//                       code: "HEALTH_MO_03_06_01_01_06_FISHTOWN HIGHWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "90c841a0-e8a3-4c54-a01a-85067596326a",
//                       code: "HEALTH_MO_03_06_01_01_05_BULTIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6ec57b2e-7134-43ec-934a-dbc0ab1fec49",
//                       code: "HEALTH_MO_03_06_01_01_04_FELOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b77ee41-dbb6-433f-bcac-7dcf9494a128",
//                       code: "HEALTH_MO_03_06_01_01_03_BIG JAYE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "32347f57-eb3e-45ad-b8d4-98af48d85875",
//                       code: "HEALTH_MO_03_06_01_01_02_GBARKLIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cb550888-875a-43c5-9e0e-3eca0880b7ad",
//                       code: "HEALTH_MO_03_06_01_01_01_KPANNISO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "7aa7403c-223d-4ec2-afb8-01be2554ba6d",
//           code: "HEALTH_MO_03_05_BARROBO WHOJAH",
//           boundaryType: "District",
//           children: [
//             {
//               id: "ea2efe05-01dc-4cf1-b060-3eb458491bfe",
//               code: "HEALTH_MO_03_05_03_GLOFAKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "2149db82-887b-407b-9ff8-a25770eeadef",
//                   code: "HEALTH_MO_03_05_03_01_GLOFAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d0fb0b70-c781-47dc-869f-4130fc1bc3d2",
//                       code: "HEALTH_MO_03_05_03_01_07_GLOFAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "510daac9-3ebf-434e-8a1d-8690f0f4ab6e",
//                       code: "HEALTH_MO_03_05_03_01_06_DUGBOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "26684708-5bfc-46d1-92e8-4a82b9c727a9",
//                       code: "HEALTH_MO_03_05_03_01_05_CHILIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a18f4533-4aa8-4ab0-8c1b-e119048924f8",
//                       code: "HEALTH_MO_03_05_03_01_04_SAWKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "456fe9b3-906f-4fc1-8249-cb990a66cfdd",
//                       code: "HEALTH_MO_03_05_03_01_03_GBAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "489a3b5d-413b-4ef9-9aba-af8f0feb5daf",
//                       code: "HEALTH_MO_03_05_03_01_02_GESSAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9ec6e063-def5-4661-b116-67cf9b8b06b9",
//                       code: "HEALTH_MO_03_05_03_01_01_GWELEKPOTOWIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "dafd166a-5757-4843-aab7-518dfeb90c7f",
//               code: "HEALTH_MO_03_05_02_JULUKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "705bc02a-6a58-4779-8fe2-8dc532b1c5ce",
//                   code: "HEALTH_MO_03_05_02_01_JULUKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "5cae444a-cf82-4840-a9e8-8eddbda4822f",
//                       code: "HEALTH_MO_03_05_02_01_12_JULUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "34ac7ccb-c99b-4d73-b1e2-a7ef204669c7",
//                       code: "HEALTH_MO_03_05_02_01_11_DWEJAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d4b20e77-1046-4859-96f0-82fe632028b7",
//                       code: "HEALTH_MO_03_05_02_01_10_JULUKEN 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e4bc9fd1-c111-463d-b2cb-6723e399ee44",
//                       code: "HEALTH_MO_03_05_02_01_09_MARTUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e30e33e3-2377-49df-b666-dfb06b26e97a",
//                       code: "HEALTH_MO_03_05_02_01_08_GORTUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bca889ae-fc5b-4d7c-8ea1-bcb20a0bbd32",
//                       code: "HEALTH_MO_03_05_02_01_07_GORTIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f68cfe3a-64a9-497a-9998-55fc682d8a06",
//                       code: "HEALTH_MO_03_05_02_01_06_KPLOWAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fc995e8d-79db-47d0-ad4a-dd641a0a2120",
//                       code: "HEALTH_MO_03_05_02_01_05_TUGBAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e0f97e08-4e7a-46e1-a6ac-4efa1e933dae",
//                       code: "HEALTH_MO_03_05_02_01_04_TAPOLINE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a99a6302-fe08-47e4-92b8-5149dfa2546f",
//                       code: "HEALTH_MO_03_05_02_01_03_FULA CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f270c4fc-a103-466f-adc6-e047fe85312b",
//                       code: "HEALTH_MO_03_05_02_01_02_BESSIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "37edf154-d319-4a4e-87b1-2bafb7dcaeb1",
//                       code: "HEALTH_MO_03_05_02_01_01_SMALL JAYE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "fe7ea9bc-02d8-4b5b-bfca-582268682a77",
//               code: "HEALTH_MO_03_05_01_MEWAKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "2c184617-cc0d-421b-b9b4-8e6d9a1dc54c",
//                   code: "HEALTH_MO_03_05_01_01_NEWAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "bc620833-5ec1-470d-a7f9-bf5b3d262fd6",
//                       code: "HEALTH_MO_03_05_01_01_07_NEWAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ba6e1d71-ab45-4df0-be67-9d43a35b5e8a",
//                       code: "HEALTH_MO_03_05_01_01_06_SOLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "56649cbc-c8a6-4071-8558-fad7029cb4dd",
//                       code: "HEALTH_MO_03_05_01_01_05_SAWTOKEN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0303b0ca-442e-4740-94cc-1345092cd797",
//                       code: "HEALTH_MO_03_05_01_01_04_JARGLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ec8c0498-5dcf-48e1-a699-b1b50d80c9cd",
//                       code: "HEALTH_MO_03_05_01_01_03_SARGLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2fee83be-69de-4717-8ac4-7a723bb204f0",
//                       code: "HEALTH_MO_03_05_01_01_02_SAWTOKEN 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4628f0d0-2ae5-49b1-910d-dc5599c277c9",
//                       code: "HEALTH_MO_03_05_01_01_01_SEATOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "32a8ba74-4b05-4348-b207-3acfa6fd1182",
//           code: "HEALTH_MO_03_04_HARPER",
//           boundaryType: "District",
//           children: [
//             {
//               id: "b516ac06-fa49-4531-9356-28aced54b1f2",
//               code: "HEALTH_MO_03_04_06_FISH TOWN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d3e32da4-467a-47b3-a5dd-e3ff328f56b2",
//                   code: "HEALTH_MO_03_04_06_01_FISH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "676031de-46cd-4b31-bd17-34f0baff4d9a",
//                       code: "HEALTH_MO_03_04_06_01_05_FISH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f7b68def-52e5-465e-ac51-df6a6ed84609",
//                       code: "HEALTH_MO_03_04_06_01_04_GBOKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3847879b-4e15-477e-b5bc-190bf6bc5d2a",
//                       code: "HEALTH_MO_03_04_06_01_03_PONWIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b79f9e5a-5cbc-4018-a468-974b2a6a85c4",
//                       code: "HEALTH_MO_03_04_06_01_02_BOHLUYEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6e57556b-3a01-4c02-9b75-71b561b7513b",
//                       code: "HEALTH_MO_03_04_06_01_01_TUPAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "a9c720c4-1124-41c5-832e-d59333c7608a",
//               code: "HEALTH_MO_03_04_05_YOOKUDI CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "16e9b20b-34b3-47d4-ba5f-8bed37db0a92",
//                   code: "HEALTH_MO_03_04_05_01_YOOKUDI",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "bc26fcbb-bb7b-4320-81ef-eb50a6f97e4d",
//                       code: "HEALTH_MO_03_04_05_01_10_YOOKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "648b40e3-8679-4682-b438-e29a14f55202",
//                       code: "HEALTH_MO_03_04_05_01_09_PEDEBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "80f10d68-5c9b-4671-b2ce-aa178d267960",
//                       code: "HEALTH_MO_03_04_05_01_08_LIBSUCO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9140263b-04ac-4023-8eec-4858630f1fbb",
//                       code: "HEALTH_MO_03_04_05_01_07_YOOPIDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ba847da1-9570-4d62-9ed1-7aa0654a1dbd",
//                       code: "HEALTH_MO_03_04_05_01_06_KUDEKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "63ca0f9e-4288-482e-bf7b-a40985e506d7",
//                       code: "HEALTH_MO_03_04_05_01_05_POOSIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "35f7b9c1-90ce-4985-bd38-43c1581102d0",
//                       code: "HEALTH_MO_03_04_05_01_04_DUOKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ba64da0f-ba85-4444-afec-1e8c2cb25f70",
//                       code: "HEALTH_MO_03_04_05_01_03_WOLIPLKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2c44741f-8b2d-4686-bdb6-14a85936a26d",
//                       code: "HEALTH_MO_03_04_05_01_02_JEDEBIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e324f911-cb40-4baa-b49d-a59ab4d0287c",
//                       code: "HEALTH_MO_03_04_05_01_01_TANGBALEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "fbdd2a34-5183-4897-ad95-f922a4100693",
//               code: "HEALTH_MO_03_04_04_CAVALLA CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "2b1f207f-cc9f-4010-ba7c-8799bf40455c",
//                   code: "HEALTH_MO_03_04_04_01_CAVALLA TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e87bf9dd-d76c-4a83-91ab-780f305e25d0",
//                       code: "HEALTH_MO_03_04_04_01_05_CAVALLA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b68117a9-c033-418d-ab49-09e005a2aef5",
//                       code: "HEALTH_MO_03_04_04_01_04_WORTEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "007de391-5126-4682-b35b-d697c4bcb7a1",
//                       code: "HEALTH_MO_03_04_04_01_03_SEDEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "eb398b94-760e-4c8d-ac43-84f05fdbe220",
//                       code: "HEALTH_MO_03_04_04_01_02_KAAKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1d1fcbad-3bed-4ffe-9095-6e7d947a3cd3",
//                       code: "HEALTH_MO_03_04_04_01_01_KABLAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "eca0bc14-e59b-4a81-ad2c-280534c03a51",
//               code: "HEALTH_MO_03_04_03_PULLAH CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "2b2db909-9c5e-4455-833a-44fd6a7be130",
//                   code: "HEALTH_MO_03_04_03_01_PULLAH COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "9b70935d-6772-40c6-a56f-508b933afdb9",
//                       code: "HEALTH_MO_03_04_03_01_12_WHOLE GRAWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0b0c5250-efd8-4314-90aa-ae1ecdfae261",
//                       code: "HEALTH_MO_03_04_03_01_11_KING'S TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0c0781aa-f312-45cb-b836-5ad8e9a2e600",
//                       code: "HEALTH_MO_03_04_03_01_10_OLD HALF GRAWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f0d3a1c2-c730-4c9f-a7ca-7090bcf53631",
//                       code: "HEALTH_MO_03_04_03_01_09_WLUPLOWEIN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "77e79de3-34fa-4228-8c98-534403cf11ac",
//                       code: "HEALTH_MO_03_04_03_01_08_PULLAH COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a6ed9cbf-697d-4216-a345-4a2a599ba6da",
//                       code: "HEALTH_MO_03_04_03_01_07_MLEWIEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "829df8bf-ff84-4cbd-8aef-a7a5fcb08a25",
//                       code: "HEALTH_MO_03_04_03_01_06_TICHARBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b8074a79-ff77-46fe-b5c1-fcb676a5d5da",
//                       code: "HEALTH_MO_03_04_03_01_05_NABLEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0dcf6014-5523-4a49-9f43-6e85be7820e4",
//                       code: "HEALTH_MO_03_04_03_01_04_KIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2dcda38e-8295-4f0c-9a4a-69e6cfff9b45",
//                       code: "HEALTH_MO_03_04_03_01_03_FEGURSON",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fd5c516d-6268-489e-bc9a-e6ed514fc981",
//                       code: "HEALTH_MO_03_04_03_01_02_NEW HALF GRAWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bf609059-018b-4bd7-a219-d849638b1672",
//                       code: "HEALTH_MO_03_04_03_01_01_SPRING HILL",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "37f84dc3-e6a5-4a29-94a0-31d5264fb986",
//               code: "HEALTH_MO_03_04_02_JJ DOSSEN HOSPITAL",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4b0faa30-59b2-4ba2-bb6b-ee67fccd9af8",
//                   code: "HEALTH_MO_03_04_02_01_JJ DOSSEN COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "56c6946e-4418-4a68-a278-86cceb4923f7",
//                       code: "HEALTH_MO_03_04_02_01_29_JJ DOSSEN COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "530794b2-dc70-4936-a3d0-e637590b9eac",
//                       code: "HEALTH_MO_03_04_02_01_28_LAKE SHEPERD",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "646a86e8-0c18-4893-b324-1691767e446e",
//                       code: "HEALTH_MO_03_04_02_01_27_MIDDLE CESS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7576a44b-7d19-4894-b4e8-1cc234dbadf8",
//                       code: "HEALTH_MO_03_04_02_01_26_NEGANGBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1527097f-d66e-4e63-9a3d-756388b66331",
//                       code: "HEALTH_MO_03_04_02_01_25_MARSH STREET",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4e40900b-4997-4eea-9a54-f4a4d52b85f7",
//                       code: "HEALTH_MO_03_04_02_01_24_BASSA COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "384ab731-bf8b-4942-9485-67d184ccb637",
//                       code: "HEALTH_MO_03_04_02_01_23_OLD KRU TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "82fc4bd5-7f75-4ca1-acad-8b5410308931",
//                       code: "HEALTH_MO_03_04_02_01_22_CENTRAL HARPER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f7dad3f8-9582-4069-b667-8cc53fa2c1d6",
//                       code: "HEALTH_MO_03_04_02_01_21_STADIUM ROAD",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5aa0d853-e4a0-479d-9cb3-daa098f7d36f",
//                       code: "HEALTH_MO_03_04_02_01_20_NEW HARPER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "49dd9c80-41df-4003-abfa-8a66bb84b857",
//                       code: "HEALTH_MO_03_04_02_01_19_KPAFLOVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9a4200c6-4690-4571-9b68-5caa1d6391e9",
//                       code: "HEALTH_MO_03_04_02_01_18_PHILADEPHIA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5524a167-db18-43fa-99a4-017de8858c31",
//                       code: "HEALTH_MO_03_04_02_01_17_TU COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "661fb4c1-3262-4eb3-9d5b-41cd0d340c0b",
//                       code: "HEALTH_MO_03_04_02_01_16_EASY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "62a3e1cf-ae2f-4ad3-b307-b515674c0df6",
//                       code: "HEALTH_MO_03_04_02_01_15_AIRFIELD",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a15594c1-862e-4e5d-a48d-ed8028b74e76",
//                       code: "HEALTH_MO_03_04_02_01_14_BONGAR HILLS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3abb00ac-ea90-4775-a10e-5082845fae5e",
//                       code: "HEALTH_MO_03_04_02_01_13_HENCE STREET",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "db86ab89-8939-4b54-ac01-9f02ab364bf5",
//                       code: "HEALTH_MO_03_04_02_01_12_BISHOP HILLS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1bb08a58-3034-49a1-b358-61a8e8294d0e",
//                       code: "HEALTH_MO_03_04_02_01_11_CENTRAL HOFFMAN STATION",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e47575ec-a0db-4c63-b98e-118800f37c8a",
//                       code: "HEALTH_MO_03_04_02_01_10_WULUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e9fe0812-6ab2-4609-921a-4617a0a5e48f",
//                       code: "HEALTH_MO_03_04_02_01_09_WAA HODO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "81f63df5-5401-4e2a-be23-97bad84926a7",
//                       code: "HEALTH_MO_03_04_02_01_08_BIGTOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c6a08aae-278b-4683-b32c-9f61c032d10a",
//                       code: "HEALTH_MO_03_04_02_01_07_PULUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "453858e0-f313-4465-b2b8-205c79b52dfa",
//                       code: "HEALTH_MO_03_04_02_01_06_PEACE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "39af25a3-5eea-483e-8636-ba151b989e67",
//                       code: "HEALTH_MO_03_04_02_01_05_NEW KRU TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "30f3d85a-ab4c-440d-b1e5-974645574799",
//                       code: "HEALTH_MO_03_04_02_01_04_BARROBO COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a19e3a98-7e5e-42db-9a73-519b5e24a766",
//                       code: "HEALTH_MO_03_04_02_01_03_MILLIONAIRE QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3b0fcf54-7747-4b47-92a7-e23e7a3d8f52",
//                       code: "HEALTH_MO_03_04_02_01_02_GIABO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "445595d2-397b-4c3d-8cb9-d5ea18641c74",
//                       code: "HEALTH_MO_03_04_02_01_01_HARD WOOD",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "7f11b3e8-2333-4c63-b412-bfcdb82f7074",
//               code: "HEALTH_MO_03_04_01_ROCK TOWN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "b4db5d0c-90b4-4e69-9d75-64e0181fc5ed",
//                   code: "HEALTH_MO_03_04_01_01_ROCK TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "be59c302-1980-4ec1-8c89-535748453bb3",
//                       code: "HEALTH_MO_03_04_01_01_07_ROCK TOWN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "20b25875-51d6-4088-bacc-4383165796d5",
//                       code: "HEALTH_MO_03_04_01_01_06_GYIGBIDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7696f7d3-0015-4554-a82d-5cf589199f44",
//                       code: "HEALTH_MO_03_04_01_01_05_MIDDLE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "531b7dfe-0ea0-4c9c-b4b0-a11045de6400",
//                       code: "HEALTH_MO_03_04_01_01_04_NMAKLEWIEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8691b887-411a-4f02-96cc-25f4cc25ea4c",
//                       code: "HEALTH_MO_03_04_01_01_03_LITTLE WELEBO CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "22b8b4bc-a720-46fe-a765-4ee987f5df17",
//                       code: "HEALTH_MO_03_04_01_01_02_LITTLE WLEBO OLD TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ee42498e-ab29-478c-8058-ae2eea589c94",
//                       code: "HEALTH_MO_03_04_01_01_01_LITTLE WLEBO NEW TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "76cff4a5-b08f-41a5-89f6-21fb8a348d91",
//           code: "HEALTH_MO_03_03_KALUWAY  1",
//           boundaryType: "District",
//           children: [
//             {
//               id: "ec611c0f-1579-4a0d-ac4a-08644ff9cb43",
//               code: "HEALTH_MO_03_03_02_EDITH H. WALLACE HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "533e943c-c518-4328-a6a8-78d8ec5541fe",
//                   code: "HEALTH_MO_03_03_02_01_KARLOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "91d210e7-0676-4872-a6d8-95ae7ea600f4",
//                       code: "HEALTH_MO_03_03_02_01_21_GEAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a5691fdc-f618-45e2-9beb-8441114dc9c9",
//                       code: "HEALTH_MO_03_03_02_01_20_GEDERO KONUSO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ac6f9271-d412-4590-bd8b-cd0259a52832",
//                       code: "HEALTH_MO_03_03_02_01_19_GEDERO SUASU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "46199b7b-4f23-4968-91fd-524341729772",
//                       code: "HEALTH_MO_03_03_02_01_18_GIO VALLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "16ec5b2a-19a7-4134-83e7-256dc1651047",
//                       code: "HEALTH_MO_03_03_02_01_17_KARLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b76d7f58-e89c-447e-919a-d38f87af239d",
//                       code: "HEALTH_MO_03_03_02_01_16_GEDEBO WARTEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c34c75ec-0127-4ede-8286-e01612462984",
//                       code: "HEALTH_MO_03_03_02_01_15_GEDEBO WULUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3d93bd19-91c6-4247-ad0a-19cb71f1e51d",
//                       code: "HEALTH_MO_03_03_02_01_14_GEDEBO DIAGBLILAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f053b031-8c70-4678-81a2-5c2455aeaf59",
//                       code: "HEALTH_MO_03_03_02_01_13_DORROBO GBALAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "30339ab0-99c9-474c-a269-658608b8aabe",
//                       code: "HEALTH_MO_03_03_02_01_12_DORROBO GBAWAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b962e329-c5e0-45e7-9adb-feb842559efe",
//                       code: "HEALTH_MO_03_03_02_01_11_DORROBO KONUSO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f41b81c1-5621-4a97-8d99-de2458a28735",
//                       code: "HEALTH_MO_03_03_02_01_10_DORROBO SAYLILAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "97cac903-b994-412d-9d06-249646409474",
//                       code: "HEALTH_MO_03_03_02_01_09_DORROBO WLUPLUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b51a5f1a-a1fe-477c-8280-291e2925c32e",
//                       code: "HEALTH_MO_03_03_02_01_08_DORROBO KLILIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5d039d65-8f34-4537-9a2f-f7d6332de71e",
//                       code: "HEALTH_MO_03_03_02_01_07_GEDEBO JLELOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5f819154-7cc2-4c9a-8041-8bab89c1691a",
//                       code: "HEALTH_MO_03_03_02_01_06_GEDEBO BIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a9690458-d997-443f-b493-b10f1063bad0",
//                       code: "HEALTH_MO_03_03_02_01_05_GEDOBO KARBLAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b00e300-8e92-433f-ab4a-583e3dc321a7",
//                       code: "HEALTH_MO_03_03_02_01_04_GEDOBO TENSOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "220855f8-887b-4063-8406-421ad5f4764f",
//                       code: "HEALTH_MO_03_03_02_01_03_GEDEBO KLISO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "75c09c1a-81f9-4541-83ff-13e859406fd7",
//                       code: "HEALTH_MO_03_03_02_01_02_GEDEBO HEWEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "747b2901-cf5e-4026-b587-9454159a2be6",
//                       code: "HEALTH_MO_03_03_02_01_01_GEDEBO TUPELUSO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "a4cd09d6-97c5-4d62-a19e-31a13cf78fac",
//               code: "HEALTH_MO_03_03_01_POUGBAKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "d8f1d615-d84d-43c4-aeaa-08c1f8c4faaf",
//                   code: "HEALTH_MO_03_03_01_01_POUGBAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "9605ca61-2c59-4fe5-9745-40a4e4a1d499",
//                       code: "HEALTH_MO_03_03_01_01_07_POUGBAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b5e2dd3a-4ad5-420d-a719-8a7cc012bd67",
//                       code: "HEALTH_MO_03_03_01_01_06_TOCHOSO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6ca5f0f5-d9cc-4b4e-bd7b-976132d49b74",
//                       code: "HEALTH_MO_03_03_01_01_05_GBAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "653c47ef-8ac2-49e4-9e2a-25da6d4f1074",
//                       code: "HEALTH_MO_03_03_01_01_04_ANDERSON FARM",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fd6ddaa9-a0cd-4205-9447-026e6a539200",
//                       code: "HEALTH_MO_03_03_01_01_03_WUIUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5eebcf5c-dff1-4733-8cd6-fd305566762a",
//                       code: "HEALTH_MO_03_03_01_01_02_POMUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa3732c5-514e-4263-aacf-23a5d60699ae",
//                       code: "HEALTH_MO_03_03_01_01_01_TYETEWASO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "be53b0be-b59c-4bef-97a7-3caeb6a086fa",
//           code: "HEALTH_MO_03_02_KALUWAY  2",
//           boundaryType: "District",
//           children: [
//             {
//               id: "0c6ce143-0d10-4a3e-8f05-a5c450ccc5c4",
//               code: "HEALTH_MO_03_02_03_BONIKEN",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c690b753-0bb0-4560-a496-5d3fd2842536",
//                   code: "HEALTH_MO_03_02_03_01_BONIKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "dc5b839e-be7b-49a2-b71b-bc07b5d8038d",
//                       code: "HEALTH_MO_03_02_03_01_06_BONIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7127fb0e-a67b-4166-8d24-96e14c6c48aa",
//                       code: "HEALTH_MO_03_02_03_01_05_TUGBAKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "54a47a0c-31be-48a4-a9d6-932cca2b7420",
//                       code: "HEALTH_MO_03_02_03_01_04_HENONGBE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7e25e7d6-6352-4e10-8a3b-1ae542d5f239",
//                       code: "HEALTH_MO_03_02_03_01_03_GIANT TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c23791d2-4602-450d-9433-5c64a7f151e9",
//                       code: "HEALTH_MO_03_02_03_01_02_WLOWIEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "19ae30a2-e164-4a07-b1fe-6521030b1e3c",
//                       code: "HEALTH_MO_03_02_03_01_01_DOLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "ca2815e3-f936-4682-902a-d8233a05fcb5",
//               code: "HEALTH_MO_03_02_02_MANOLU CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "3a769de5-e5b0-43d2-a943-55260588bdaa",
//                   code: "HEALTH_MO_03_02_02_01_MANOLU BIG TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "346d9e56-3f33-44fd-abae-265a1941211c",
//                       code: "HEALTH_MO_03_02_02_01_11_MANOLU MISSION TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8a1bebf5-a2a7-4d61-a18c-4f22c901586c",
//                       code: "HEALTH_MO_03_02_02_01_10_MANOLU BIG TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dd20a9f0-baaf-473e-a5bc-b6e5433987f6",
//                       code: "HEALTH_MO_03_02_02_01_09_NEWAKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "467a8525-0836-4a4b-a2ff-d5018e63200f",
//                       code: "HEALTH_MO_03_02_02_01_08_DOKLIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6558bae8-d445-4477-9704-127485e7e543",
//                       code: "HEALTH_MO_03_02_02_01_07_POTUSO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "326b3ebe-0b3c-4f26-b050-eb847ae41a48",
//                       code: "HEALTH_MO_03_02_02_01_06_GBAWANKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dbdaed46-c84a-4e52-8221-47a2219b8be8",
//                       code: "HEALTH_MO_03_02_02_01_05_NYENOWROKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fda51822-2575-42f6-953f-c120f4ef0eed",
//                       code: "HEALTH_MO_03_02_02_01_04_TARWONKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "269103ae-0cb7-43e0-832a-23b4d082a26f",
//                       code: "HEALTH_MO_03_02_02_01_03_BABORKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1ce5d180-7563-4a34-9f43-ff1e7fcd823e",
//                       code: "HEALTH_MO_03_02_02_01_02_KPANIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c66af395-820d-4976-a060-9367f15c9092",
//                       code: "HEALTH_MO_03_02_02_01_01_SUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "e632596c-66b3-4c47-bf24-4be0abcb1a53",
//               code: "HEALTH_MO_03_02_01_YEDIAKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c78c9df1-fdd7-4384-93e3-036264e2ad3f",
//                   code: "HEALTH_MO_03_02_01_01_YEDIAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "af10494c-8bff-492f-ae76-e6ebd650a7f0",
//                       code: "HEALTH_MO_03_02_01_01_11_YEDIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4a12c19e-70e5-4da8-b9e8-ab1c07f42b91",
//                       code: "HEALTH_MO_03_02_01_01_10_WELEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ec918b59-337e-46db-a48f-8a54d58f4e0a",
//                       code: "HEALTH_MO_03_02_01_01_09_GBAWILY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0eae2239-36b0-420e-aa3c-b8d4412f332a",
//                       code: "HEALTH_MO_03_02_01_01_08_GBISO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f4a3ef30-d688-4f38-9713-6f0bbbbe247e",
//                       code: "HEALTH_MO_03_02_01_01_07_GBON",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7f77c280-276b-43f4-ad1a-819fa797f90f",
//                       code: "HEALTH_MO_03_02_01_01_06_NYEONWISIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aec10cf0-aa10-464a-a46a-7944df10bd9e",
//                       code: "HEALTH_MO_03_02_01_01_05_YEDEROBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa5ffefa-9a98-41e4-8f47-19291efc12c2",
//                       code: "HEALTH_MO_03_02_01_01_04_JOHNSONVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f493fa30-2b68-440e-b606-b4ff5e34f0c1",
//                       code: "HEALTH_MO_03_02_01_01_03_YOBLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "13402577-49d1-4ced-9a0a-607960866326",
//                       code: "HEALTH_MO_03_02_01_01_02_YORKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e96b7a27-9e48-4688-84de-ebc013e5bce0",
//                       code: "HEALTH_MO_03_02_01_01_01_YORKEN1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "e99acd1f-0bd7-4677-b6b0-c109ab79b11f",
//           code: "HEALTH_MO_03_01_PLEEBO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "15957bd8-9a2c-4a14-8166-4f95f156ba8e",
//               code: "HEALTH_MO_03_01_05_BARRAKEN CLINIC (FIXED DP)",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c2957c42-ba1c-4f84-bc50-ae9183199efe",
//                   code: "HEALTH_MO_03_01_05_01_BARRAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a25b4497-22fa-4ec4-bad5-8fcbef97f253",
//                       code: "HEALTH_MO_03_01_05_01_05_BARRAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa66fbc5-9596-4fe1-9f41-19454df57280",
//                       code: "HEALTH_MO_03_01_05_01_04_OLD LADY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3c2baa7c-a5fe-497c-a72d-36df39a0878f",
//                       code: "HEALTH_MO_03_01_05_01_03_WEAH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a0afcfd1-1539-491d-bf5f-5196b11db92f",
//                       code: "HEALTH_MO_03_01_05_01_02_REFUGEE CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3cdb33de-0b56-43ba-b803-b3e232c19c70",
//                       code: "HEALTH_MO_03_01_05_01_01_NEW GBAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "05cf8b3a-998b-4939-b283-3b46e1072353",
//               code: "HEALTH_MO_03_01_04_ROCKTOWN KUNOKUDI (CLINIC)",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "999a53e4-86cb-4b02-b0ca-8e7f8f67d1ce",
//                   code: "HEALTH_MO_03_01_04_01_RTK",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e40d9874-d597-4323-a948-dd6f4550f016",
//                       code: "HEALTH_MO_03_01_04_01_08_RTK",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1619646c-bd89-47e1-a6e1-e4ccc875bbb2",
//                       code: "HEALTH_MO_03_01_04_01_07_GENIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6eeaf885-e996-43e1-b51e-b5f297c307ec",
//                       code: "HEALTH_MO_03_01_04_01_06_GEKOEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3342448-7aca-460a-849b-37fc6850c082",
//                       code: "HEALTH_MO_03_01_04_01_05_BLAGEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7129b88b-e6fb-4699-b9e9-a8c0054082f8",
//                       code: "HEALTH_MO_03_01_04_01_04_JLOBOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "40df1de1-fd9c-4bf2-af6a-408a7d8304dd",
//                       code: "HEALTH_MO_03_01_04_01_03_TUOKPEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e2c0ebb9-7d0f-4d71-ab1b-eb1a6593708c",
//                       code: "HEALTH_MO_03_01_04_01_02_CAVALLA KUNOKUDI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "be6ed7f7-f17b-4401-ac0e-f8c56ef32899",
//                       code: "HEALTH_MO_03_01_04_01_01_TENDEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "d26ea407-c6b8-4993-8ee1-3c1a22c76bda",
//               code: "HEALTH_MO_03_01_03_OLD SODOKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "2d622662-ad9b-45f4-b4f0-f05e9ebec796",
//                   code: "HEALTH_MO_03_01_03_01_OLD SODOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "726cf8ab-63ed-4457-baf2-4e7dcbd78952",
//                       code: "HEALTH_MO_03_01_03_01_08_OLD SODOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a4b2773b-29e5-41e0-baf6-bb5a19b317c9",
//                       code: "HEALTH_MO_03_01_03_01_07_GBOLOLU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ef3890d1-09e2-4a03-bd9c-482a71e33f37",
//                       code: "HEALTH_MO_03_01_03_01_06_NEW SODOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3494fd1b-a1c3-432d-950c-078a579e6431",
//                       code: "HEALTH_MO_03_01_03_01_05_MOPP CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "50fa0852-f40a-4f2e-a5e6-017eaa6fdcb4",
//                       code: "HEALTH_MO_03_01_03_01_04_GBEWIEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "55316d8c-dcf5-49d3-bd9b-690bec02965a",
//                       code: "HEALTH_MO_03_01_03_01_03_WATCHOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "922e75f7-a4b6-4f95-a2f4-a74501189e83",
//                       code: "HEALTH_MO_03_01_03_01_02_GOLOBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7e2cb6af-8835-4f83-9da2-7134be4243e7",
//                       code: "HEALTH_MO_03_01_03_01_01_CAMP 10",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "462bf7bf-fab9-4577-b975-ddcb18b91cc3",
//               code: "HEALTH_MO_03_01_02_GBLOKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "5a70ca38-a6c7-4b5f-a3fc-a265f08e2294",
//                   code: "HEALTH_MO_03_01_02_01_GBLOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e134b891-8baf-40d7-9c8a-b0ff007d21dc",
//                       code: "HEALTH_MO_03_01_02_01_09_GBLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1c59f1bd-05b4-4d2e-ae98-1f1af490bf83",
//                       code: "HEALTH_MO_03_01_02_01_08_KWILOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4d28126c-0d0f-4ff3-9238-cab5241e41a6",
//                       code: "HEALTH_MO_03_01_02_01_07_TUMBIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3b77c172-557a-47ac-adc9-aacedb236803",
//                       code: "HEALTH_MO_03_01_02_01_06_SOLOKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "486c8285-6f7d-402c-a1ec-4e3b675297d5",
//                       code: "HEALTH_MO_03_01_02_01_05_GBAKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "81b6a071-3a2c-407f-9b1c-7499789811e1",
//                       code: "HEALTH_MO_03_01_02_01_04_SEDEKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c02245a4-ccc3-453c-95f8-2f0ba28b0f80",
//                       code: "HEALTH_MO_03_01_02_01_03_NIKPACHELU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5cfffe81-7c5e-4a01-817b-7aafddaea1e0",
//                       code: "HEALTH_MO_03_01_02_01_02_SADEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1322718a-955b-4031-821a-88237afca713",
//                       code: "HEALTH_MO_03_01_02_01_01_DEBLEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "4ab7555a-b48c-4502-a592-5c37c93ad002",
//               code: "HEALTH_MO_03_01_01_PLEEBO HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "ad758604-950a-41c0-abb9-39e810b9f2b3",
//                   code: "HEALTH_MO_03_01_01_14_PLEEBO ZONE 1A",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "69afc347-b217-4861-b959-32bc71a8891a",
//                       code: "HEALTH_MO_03_01_01_14_05_PLEEBO ZONE 1A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cccdb0cc-01eb-44fd-a1a9-8c38b19fec67",
//                       code: "HEALTH_MO_03_01_01_14_04_PLEEBO ZONE 1B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cd1e5644-e27b-4b52-8ce9-3740e448b995",
//                       code: "HEALTH_MO_03_01_01_14_03_PLEEBO ZONE 2A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1b8b0eab-5548-4dbe-b196-6dbef8729f11",
//                       code: "HEALTH_MO_03_01_01_14_02_PLEEBO ZONE 2B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bdca2a9f-b67e-4634-8665-669c865ef154",
//                       code: "HEALTH_MO_03_01_01_14_01_PLEEBO ZONE 5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "fa5e1374-8d51-44d1-8a0f-13e9e9ffd045",
//                   code: "HEALTH_MO_03_01_01_13_PLEEBO ZONE 3A",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "05dc7117-ba68-4b73-a3fd-ecca911ab04f",
//                       code: "HEALTH_MO_03_01_01_13_05_PLEEBO ZONE 3A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4caf3d71-ebbd-416a-aebb-5b8d5c73aca0",
//                       code: "HEALTH_MO_03_01_01_13_04_PLEEBO ZONE 3B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "edd78ebd-d0a0-4aea-8f79-9b614b525b39",
//                       code: "HEALTH_MO_03_01_01_13_03_PLEEBO ZONE 4A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4397a324-2bc7-4fee-8c49-fa51163cf549",
//                       code: "HEALTH_MO_03_01_01_13_02_PLEEBO ZONE 4B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9ad0c26d-50fd-4219-999a-f84e3f0e7d83",
//                       code: "HEALTH_MO_03_01_01_13_01_PLEEBO ZONE 4C",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "6237c375-095e-4e1b-adf1-2d5fa85c5a66",
//                   code: "HEALTH_MO_03_01_01_12_PLEEBO ZONE 7A",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1ef400ad-3d2e-41f1-922f-74131940fe9e",
//                       code: "HEALTH_MO_03_01_01_12_07_PLEEBO ZONE 6A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f06369c-ddda-4a80-91a5-82f9efb86a57",
//                       code: "HEALTH_MO_03_01_01_12_06_PLEEBO ZONE 6B/CRC CAMP 5",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8319306f-3509-4bb6-8d54-47b85b31d8e9",
//                       code: "HEALTH_MO_03_01_01_12_05_PLEEBO ZONE 7A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dc76dfd9-5841-4779-901d-4f64061e6426",
//                       code: "HEALTH_MO_03_01_01_12_04_PLEEBO ZONE 7B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "28d43045-ae41-436b-a9c7-5a71562f37fa",
//                       code: "HEALTH_MO_03_01_01_12_03_PLEEBO ZONE 7C",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5491927e-7fec-46e2-8c55-a318d4f9d616",
//                       code: "HEALTH_MO_03_01_01_12_02_PLEEBO ZONE 8",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "071b4c91-ff2b-4f6a-bac9-f1502ab967f6",
//                       code: "HEALTH_MO_03_01_01_12_01_PLEEBO ZONE 9",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "caf3b625-57c2-4541-ad04-1881cfc4d527",
//                   code: "HEALTH_MO_03_01_01_11_PLEEBO ZONE 11A",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "56dcce72-1c10-4030-a1c1-bd9a71610552",
//                       code: "HEALTH_MO_03_01_01_11_06_PLEEBO ZONE 10A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2dd26bb4-12b5-4349-bb51-d0a5bd6e0b43",
//                       code: "HEALTH_MO_03_01_01_11_05_PLEEBO ZONE 10B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f166496b-3d50-4a91-86a0-1dad39775a1b",
//                       code: "HEALTH_MO_03_01_01_11_04_PLEEBO ZONE 10C",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2f716d3d-bb09-48de-b9fd-57a68cd5d9ec",
//                       code: "HEALTH_MO_03_01_01_11_03_PLEEBO ZONE 11A",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c6d32450-e725-4828-b8b3-9c9c41b4bc8b",
//                       code: "HEALTH_MO_03_01_01_11_02_PLEEBO ZONE 11B",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e671239e-a60b-4d4a-945b-ed5a20bda87e",
//                       code: "HEALTH_MO_03_01_01_11_01_PLEEBO ZONE 11C",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "6c792ee0-5d1a-4cf7-b960-3b83e46061df",
//                   code: "HEALTH_MO_03_01_01_10_GBOLOBO BESSIKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d6e328cc-98ff-42f8-96dc-4fa5621bbda7",
//                       code: "HEALTH_MO_03_01_01_10_06_GBOLOBO KAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "53a5fd8e-936f-479f-bacc-87af83aac3d5",
//                       code: "HEALTH_MO_03_01_01_10_05_GBOLOBO TUNUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f94dcab4-799e-448e-bb2f-fec3758a389b",
//                       code: "HEALTH_MO_03_01_01_10_04_GBOLOBO BESSIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2bf7b755-bcdc-40ff-a9b7-5052d94e6c55",
//                       code: "HEALTH_MO_03_01_01_10_03_GBOLOBO TAMBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4fdfad92-9f58-45a4-866d-887ac07b4ba0",
//                       code: "HEALTH_MO_03_01_01_10_02_FODOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "96c16bd5-df33-4f74-8beb-6d36c6e8214e",
//                       code: "HEALTH_MO_03_01_01_10_01_GBOLOBO GEEWLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "9b640ea5-3343-4dff-b4af-2e8fb3d2ee1d",
//                   code: "HEALTH_MO_03_01_01_09_GEDETARBO 1",
//                   boundaryType: "Locality",
//                   children: [],
//                 },
//                 {
//                   id: "64ccd5bf-7c2e-48a1-ac4e-9ec70e850379",
//                   code: "HEALTH_MO_03_01_01_08_GEDETARBO 2",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b2df6793-5b92-4478-907e-d6c044d7c8c2",
//                       code: "HEALTH_MO_03_01_01_08_01_NEPLUWIEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "af464815-ae6a-4105-8c0e-5c66ae53ec9d",
//                   code: "HEALTH_MO_03_01_01_07_GEDETARBO 3",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "523f49e3-9493-469a-83c6-dea0e49ccd99",
//                       code: "HEALTH_MO_03_01_01_07_01_HELOMEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "3acbbda3-4981-44db-8d70-3fc53f4147ae",
//                   code: "HEALTH_MO_03_01_01_06_GEDETARBO 4",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b1edfae7-4b4c-4736-89c8-b5153c836c35",
//                       code: "HEALTH_MO_03_01_01_06_01_NEMEKEN/WERTIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "1ee6b1f9-25ba-420c-ad29-378a786f432c",
//                   code: "HEALTH_MO_03_01_01_05_GEDETARBO 5",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "c264b6c8-c168-406e-b848-ef6c99d32c28",
//                       code: "HEALTH_MO_03_01_01_05_01_TOGBA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "4ae467f6-2f42-47a2-8da4-292a0b1ea78f",
//                   code: "HEALTH_MO_03_01_01_04_GEDETARBO 6",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d78b9f35-ed51-4204-a897-a43482da9228",
//                       code: "HEALTH_MO_03_01_01_04_01_RUBBER BED",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "d81aff25-73f1-44f2-8e0f-1d21cf5396aa",
//                   code: "HEALTH_MO_03_01_01_03_GEDETARBO 7",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "05b8ef83-67a0-47b4-bbf7-4ee16a3da300",
//                       code: "HEALTH_MO_03_01_01_03_01_GEDETARBO 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "fe404514-ed04-4f98-ae21-844f30a42fec",
//                   code: "HEALTH_MO_03_01_01_02_GEDETARBO 8",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d6d7a9e2-3bfd-4d2f-944c-e9f9ce971606",
//                       code: "HEALTH_MO_03_01_01_02_01_GEDETARBO 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "054b78c5-cd92-40fb-87d9-85f4f9b7d4cc",
//                   code: "HEALTH_MO_03_01_01_01_HOSPITAL CAMP/CAMP 3",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a0fed5a6-1536-4e69-b969-780d3cf38263",
//                       code: "HEALTH_MO_03_01_01_01_03_HOSPITAL CAMP/CAMP 3",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "35714351-a57b-4b74-bb6a-1ec2ea39e5b2",
//                       code: "HEALTH_MO_03_01_01_01_02_FACTORY CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bd917e59-264c-4730-80b8-b8b73d2ba318",
//                       code: "HEALTH_MO_03_01_01_01_01_HOSPITAL CAMP/CAMP 5 VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "208b4287-790d-496a-bebd-df5e4c937259",
//       code: "HEALTH_MO_02_GRAND KRU",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "777ecb28-a595-46d7-8d17-957f0d0112c2",
//           code: "HEALTH_MO_02_05_BARCLAYVILLE",
//           boundaryType: "District",
//           children: [
//             {
//               id: "fd8a920b-721a-489e-b751-b5114b47a34c",
//               code: "HEALTH_MO_02_05_06_GBALAKPO CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0c743a2b-8dc4-4487-8b9d-ba634b10b774",
//                   code: "HEALTH_MO_02_05_06_03_FILORKEN CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "895109f0-34b5-4bb2-823f-b60127317503",
//                       code: "HEALTH_MO_02_05_06_03_02_FILORKEN CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5a681ddb-2eea-4756-b43c-6614b9cf2798",
//                       code: "HEALTH_MO_02_05_06_03_01_GBUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "4f34fedb-6c52-458b-a4c8-9333807e1ee6",
//                   code: "HEALTH_MO_02_05_06_02_JOPLOKEN CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ff59c928-847b-4e74-a688-d6d04f87f93b",
//                       code: "HEALTH_MO_02_05_06_02_03_JOPLOKEN CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9e266f5b-aae4-4347-b86c-65f5c4f9b35e",
//                       code: "HEALTH_MO_02_05_06_02_02_KANWEAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ebc395b1-1a67-4ca0-8af9-6b18b369ec6b",
//                       code: "HEALTH_MO_02_05_06_02_01_TUTUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "e04a089e-aae1-466f-80e6-b38a4f82c5d9",
//                   code: "HEALTH_MO_02_05_06_01_GENWIEN CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "46a8b66d-5c5b-458a-8261-a0293bf02076",
//                       code: "HEALTH_MO_02_05_06_01_03_GENWIEN CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1db51289-a5f2-4108-95a7-932b4f8393fb",
//                       code: "HEALTH_MO_02_05_06_01_02_OTIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7bba2059-8c82-4e3e-a082-637b1e81d9f7",
//                       code: "HEALTH_MO_02_05_06_01_01_DWATRO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "0512e9a2-e343-4c8b-9e1c-e5217fea2650",
//               code: "HEALTH_MO_02_05_05_PICNECESS CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c9baed0c-f3df-43b6-81ce-cee2da6f82c5",
//                   code: "HEALTH_MO_02_05_05_03_BAILAKPO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "151f4202-8098-466f-9479-3c6772d042e6",
//                       code: "HEALTH_MO_02_05_05_03_03_BAILAKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c3bf64f1-2688-43a1-bb49-bb49056c8f67",
//                       code: "HEALTH_MO_02_05_05_03_02_BONGALO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b8a97c22-5496-4e91-9f36-c9afbacd2733",
//                       code: "HEALTH_MO_02_05_05_03_01_FUNKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "62eb7e02-d6b2-4ed2-aeed-8f3b8bd75544",
//                   code: "HEALTH_MO_02_05_05_02_KLOFUEH",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b33bfc2f-eff5-4bf1-8b10-1b91f3632988",
//                       code: "HEALTH_MO_02_05_05_02_03_KLOFUEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0829fe0a-d305-4778-b13f-43d02c211606",
//                       code: "HEALTH_MO_02_05_05_02_02_JLATEKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3e0bedec-b975-4e24-970f-a0fe214dbbbd",
//                       code: "HEALTH_MO_02_05_05_02_01_TOGBAKLEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "375e2f26-719e-4ec3-9532-362c5ed1160c",
//                   code: "HEALTH_MO_02_05_05_01_SOLOKPO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "41d4074e-2b90-48c8-9519-f455d59193be",
//                       code: "HEALTH_MO_02_05_05_01_04_SOLOKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fdf3937d-3c3d-4a22-aac2-92c489598970",
//                       code: "HEALTH_MO_02_05_05_01_03_SOBOBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3f53b86e-7190-436e-8fbb-458360fe480c",
//                       code: "HEALTH_MO_02_05_05_01_02_JAKAKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b5fca4a-91a8-4672-a3e7-e7bd74ebe526",
//                       code: "HEALTH_MO_02_05_05_01_01_TARAWA VILAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "4f2c72a3-4f74-4e14-aaaf-94f55f112dc3",
//               code: "HEALTH_MO_02_05_04_JUDUKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "36c107e8-77a6-4538-bf2a-7a784754063a",
//                   code: "HEALTH_MO_02_05_04_03_JUDUKEN TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ec205c74-a467-4e96-8dc2-8bf0f680d008",
//                       code: "HEALTH_MO_02_05_04_03_03_JUDUKEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7ad4c001-c9ce-4e13-be30-5556edc5018a",
//                       code: "HEALTH_MO_02_05_04_03_02_GBEWIEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "15849c49-9d12-4dca-9c05-958968b95516",
//                       code: "HEALTH_MO_02_05_04_03_01_DUDUBOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "05576181-4256-4ac4-aafe-1212bbfd6c41",
//                   code: "HEALTH_MO_02_05_04_02_GBEBOR",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ad6ba595-d007-4847-8341-a006f42dff41",
//                       code: "HEALTH_MO_02_05_04_02_05_GBEBOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0cb3b5c9-5514-4b6a-a1ef-cc4a2beab84d",
//                       code: "HEALTH_MO_02_05_04_02_04_DEGBLAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "22a89fe2-9fd0-4158-ae7c-20fa1828891a",
//                       code: "HEALTH_MO_02_05_04_02_03_ISLAND NEMIAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d1c940f3-181c-41c4-b71f-27badcb41e94",
//                       code: "HEALTH_MO_02_05_04_02_02_UPPER NEMIAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "285e1675-77be-484c-97b8-b42cc997de48",
//                       code: "HEALTH_MO_02_05_04_02_01_PANWENKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "fc9047fc-b00c-4820-bcc8-65217a288aab",
//                   code: "HEALTH_MO_02_05_04_01_TUPAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d8dab2c3-1ffa-4196-97be-ec2b2dbe6053",
//                       code: "HEALTH_MO_02_05_04_01_03_TUPAKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f7e0677e-7131-4c1d-81f3-8ed47f01f34b",
//                       code: "HEALTH_MO_02_05_04_01_02_SORROKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c88dc327-2bce-419c-b804-fb4140387e41",
//                       code: "HEALTH_MO_02_05_04_01_01_CHANGBEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "402dc744-18a8-4534-8a01-c88937495d82",
//               code: "HEALTH_MO_02_05_03_BARCLAYVILLE HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "b2771f7f-4d9b-4e65-b278-e583c03c18c1",
//                   code: "HEALTH_MO_02_05_03_04_ZONE ONE HOSPITAL CAMP",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6144462e-5683-4906-9a8c-e874e387273d",
//                       code: "HEALTH_MO_02_05_03_04_05_ZONE ONE HOSPITAL CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "788f2e1e-493d-4ceb-9a9a-04dcb69d7801",
//                       code: "HEALTH_MO_02_05_03_04_04_CAMP THREE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d106688a-e042-4f32-9df8-8310d58f5c80",
//                       code: "HEALTH_MO_02_05_03_04_03_GREEN HILL",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "803cabbc-cce3-43da-9efb-e46294492c91",
//                       code: "HEALTH_MO_02_05_03_04_02_SEDEE COMPOUND",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "05ae4230-3db5-48ca-94dd-6481479df66d",
//                       code: "HEALTH_MO_02_05_03_04_01_KAYKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "669e1336-0927-40c5-bd3f-7be74bbb2cf4",
//                   code: "HEALTH_MO_02_05_03_03_WAKPEKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1cd9bf75-b742-4be9-84f5-d937b59e2540",
//                       code: "HEALTH_MO_02_05_03_03_02_WAKPEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ba73ce1e-350f-41ac-bba5-d01da624e677",
//                       code: "HEALTH_MO_02_05_03_03_01_SEATOR-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "f4114237-379d-4124-ba37-56319366652e",
//                   code: "HEALTH_MO_02_05_03_02_TOPOH",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "52e3062a-a19a-4d74-bd5b-abbc2976bf45",
//                       code: "HEALTH_MO_02_05_03_02_02_TOPOH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "20da4284-8399-47ef-b6a8-0e50803142b9",
//                       code: "HEALTH_MO_02_05_03_02_01_BIG SUEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "c4c4c42b-d0e5-41c3-b55a-42feef54ce72",
//                   code: "HEALTH_MO_02_05_03_01_BIG FLENEKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6d46d503-8ddc-483c-863e-c9f294b72a78",
//                       code: "HEALTH_MO_02_05_03_01_02_BIG FLENEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9cf3e1e3-5bbd-4a15-b22d-0da9bc3efd16",
//                       code: "HEALTH_MO_02_05_03_01_01_WUTUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "b2b2771d-f400-4704-a5bc-173c344bcec1",
//               code: "HEALTH_MO_02_05_02_RALLY TIME HOSPITAL",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4d145301-1a05-4722-bd14-055ca1b6dbaa",
//                   code: "HEALTH_MO_02_05_02_02_GRAND CESS CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0b8f5d96-1a25-42d4-a8fa-f844b57533cc",
//                       code: "HEALTH_MO_02_05_02_02_01_GRAND CESS CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "c2e963a7-409a-492f-b3d0-02b5362b0afd",
//                   code: "HEALTH_MO_02_05_02_01_NEWCESS",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "09a80c9e-82cf-45d5-ab90-897fa3a29d34",
//                       code: "HEALTH_MO_02_05_02_01_03_NEWCESS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "563999a3-132f-4178-a36c-ed4164c820d8",
//                       code: "HEALTH_MO_02_05_02_01_02_GBANKEN BEACH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6fcbc747-5e00-4354-a9d1-e74fab62f01a",
//                       code: "HEALTH_MO_02_05_02_01_01_BELLORKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "4e899562-90b1-4c32-a181-97d6e60c7bc6",
//               code: "HEALTH_MO_02_05_01_GBANKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "401c5ebc-bc40-4739-b782-90d16f16e35d",
//                   code: "HEALTH_MO_02_05_01_05_GBANKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d5b7396c-66ec-4d01-81f3-e1e8755391d0",
//                       code: "HEALTH_MO_02_05_01_05_02_GBANKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2001cbf4-6e10-4548-8b9a-fd8f255b5319",
//                       code: "HEALTH_MO_02_05_01_05_01_YLATWEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "86ed718c-2383-4b62-9bcb-0d72295e54b3",
//                   code: "HEALTH_MO_02_05_01_04_ZOLOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "f4ca58ab-719b-473a-81d9-63a371bf5645",
//                       code: "HEALTH_MO_02_05_01_04_02_ZOLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4bc39c3f-da89-4b9a-a01d-3b04cc32c5d1",
//                       code: "HEALTH_MO_02_05_01_04_01_KWELEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "b63f7dea-810d-4017-85e6-3a898b6242d0",
//                   code: "HEALTH_MO_02_05_01_03_GENEKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "4d877427-a304-47d0-881a-f21887393e1d",
//                       code: "HEALTH_MO_02_05_01_03_03_GENEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a1caa1c3-b41e-47b9-9d9a-4179295c205f",
//                       code: "HEALTH_MO_02_05_01_03_02_DENTIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3b0496a8-6867-4e61-8134-9884fd9459aa",
//                       code: "HEALTH_MO_02_05_01_03_01_WEDABOBEHWAN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "d122757c-bf95-41e5-86c5-2ec009c6052a",
//                   code: "HEALTH_MO_02_05_01_02_GBLABLOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "583659bf-d0f2-43d1-b039-ad7b5be63d03",
//                       code: "HEALTH_MO_02_05_01_02_03_GBLABLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ce987a5f-4b10-4c15-8421-ec34cc1ebeb8",
//                       code: "HEALTH_MO_02_05_01_02_02_JLAROKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8e9aa00a-bd3c-421a-9b56-8433c26f5411",
//                       code: "HEALTH_MO_02_05_01_02_01_TARPLAH'S TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "3a2fd903-dfe8-478a-90d1-2c809e3b6a1d",
//                   code: "HEALTH_MO_02_05_01_01_KWEYEKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "9429dc8c-15c3-45a9-b9c1-c5ab57c6c49e",
//                       code: "HEALTH_MO_02_05_01_01_04_KWEYEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "08e05d1a-330b-4b73-909a-6e725fd5e506",
//                       code: "HEALTH_MO_02_05_01_01_03_TUPOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8a1396c1-b784-43fb-98db-c0cfe03630dc",
//                       code: "HEALTH_MO_02_05_01_01_02_MUYANKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bfcdef27-3ce8-48bf-acc8-9a8bb6ecfb16",
//                       code: "HEALTH_MO_02_05_01_01_01_KAYBOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "7f1dad49-9704-4417-a26d-d480cb436909",
//           code: "HEALTH_MO_02_04_BUAH",
//           boundaryType: "District",
//           children: [
//             {
//               id: "c564a592-c8d0-404a-bc6a-e84657312741",
//               code: "HEALTH_MO_02_04_04_BUAH HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "32b84760-db8c-4134-a9b8-f44eb4679539",
//                   code: "HEALTH_MO_02_04_04_05_CHENWRIKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "3bb7c5d4-5e60-4645-b9c6-7869bb7499d9",
//                       code: "HEALTH_MO_02_04_04_05_03_CHENWRIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3b19966f-c755-4315-8ae8-ba2dd28f2009",
//                       code: "HEALTH_MO_02_04_04_05_02_TARKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f82b441-ad12-412a-a3a1-108a3e301c2b",
//                       code: "HEALTH_MO_02_04_04_05_01_WROPLUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "3fde9585-b976-4604-9cc6-3240a43eafb3",
//                   code: "HEALTH_MO_02_04_04_04_DIAYOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "91836b62-f944-4094-a8dd-278c3c7b0980",
//                       code: "HEALTH_MO_02_04_04_04_03_TUBUVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3bc2b482-615c-4e07-a4a2-112d8604b32b",
//                       code: "HEALTH_MO_02_04_04_04_02_DIAYOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "eebf9b92-1aa1-41cb-be2a-7687854ca59d",
//                       code: "HEALTH_MO_02_04_04_04_01_WOLOKEN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "e528436c-1c01-45bb-b292-2fbdb02a2e94",
//                   code: "HEALTH_MO_02_04_04_03_SIAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "5da9e8da-f36f-46d1-bc47-871d2799420d",
//                       code: "HEALTH_MO_02_04_04_03_03_SIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "596a6d47-3d0c-4c55-9339-9f39a9f3d4b6",
//                       code: "HEALTH_MO_02_04_04_03_02_TARWROKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cdd48751-a277-4109-8930-6c0f4023c993",
//                       code: "HEALTH_MO_02_04_04_03_01_TAYBUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "a1e2eba2-387a-405f-b620-e346889e43e6",
//                   code: "HEALTH_MO_02_04_04_02_SMITHVILLE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1104655a-e60d-4457-965e-e13202fca969",
//                       code: "HEALTH_MO_02_04_04_02_01_SMITHVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "d076d3ac-0cac-4352-b077-ceafd8525bcc",
//                   code: "HEALTH_MO_02_04_04_01_ANAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7b058dc8-21dc-4d7e-933e-ba70cb61fb72",
//                       code: "HEALTH_MO_02_04_04_01_01_ANAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "f253073d-d7e4-4250-92d1-c6b4018ce27e",
//               code: "HEALTH_MO_02_04_03_DWEKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c808990e-ab52-467c-90de-4fd6dbee5ee5",
//                   code: "HEALTH_MO_02_04_03_02_DWEKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0d651855-d389-470f-b0c8-27649cc81396",
//                       code: "HEALTH_MO_02_04_03_02_02_DWEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8af98624-24f2-4c3a-bbd4-5864d2dab0ae",
//                       code: "HEALTH_MO_02_04_03_02_01_PHILIDEPHEDIA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "be9b6b5b-549e-4851-a818-356d00830116",
//                   code: "HEALTH_MO_02_04_03_01_JABLAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "86a8433c-065a-4d4f-97c3-720b76e4a76e",
//                       code: "HEALTH_MO_02_04_03_01_03_JABLAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "72d40002-dc3b-4f6c-b7a4-e49857c45b42",
//                       code: "HEALTH_MO_02_04_03_01_02_GBASULUKU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8374fce5-c9d9-4529-8a43-5976012e1a7c",
//                       code: "HEALTH_MO_02_04_03_01_01_SARKPA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "43e5ce3a-fc67-4699-9512-4836c7417f8c",
//               code: "HEALTH_MO_02_04_02_TARLU CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0fccae32-198e-48dd-9aaa-11ca4d41647a",
//                   code: "HEALTH_MO_02_04_02_02_JERBOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "356036d9-367d-4b90-b233-07ff3a286fc6",
//                       code: "HEALTH_MO_02_04_02_02_02_JERBOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "41511f66-cd27-47f2-a0f4-2e5cb2a12b27",
//                       code: "HEALTH_MO_02_04_02_02_01_JLATEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "e58f85e7-349e-4dbc-8738-f6c5793ac87c",
//                   code: "HEALTH_MO_02_04_02_01_PLANPLANKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "9bb6a2a3-ec33-4662-a447-748b0214b7f8",
//                       code: "HEALTH_MO_02_04_02_01_04_PLANPLANKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c3cf9559-7d2e-443c-88d8-b9c334551716",
//                       code: "HEALTH_MO_02_04_02_01_03_WOLOKEN-2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ce249cf3-9381-413b-8565-0d69d1d0afa3",
//                       code: "HEALTH_MO_02_04_02_01_02_WREKEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "20233f2c-a6a1-45e9-89b1-8e4ced695100",
//                       code: "HEALTH_MO_02_04_02_01_01_SARBEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "3f368523-c648-44fa-85c1-5fec5055c5fd",
//               code: "HEALTH_MO_02_04_01_PONNOKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7a566f2c-be22-471e-b1f5-c37d00c5cbcf",
//                   code: "HEALTH_MO_02_04_01_02_WROPLUKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6feac461-984c-4f39-a9d6-62c6a10d1ba1",
//                       code: "HEALTH_MO_02_04_01_02_02_GBARKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cc86ae60-f3b7-419e-b887-0f44b8828b57",
//                       code: "HEALTH_MO_02_04_01_02_01_WROPLUKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "a4e83094-a7e0-4f2d-ace6-d9678a54606f",
//                   code: "HEALTH_MO_02_04_01_01_PARLUKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b5434139-3bf6-4164-8ce8-78818a665f64",
//                       code: "HEALTH_MO_02_04_01_01_12_PARLUKEN1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f54154ec-0f7d-4504-b0ca-8a284009e75a",
//                       code: "HEALTH_MO_02_04_01_01_11_JLABAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2703e6f2-b368-40ba-b054-2df41543071a",
//                       code: "HEALTH_MO_02_04_01_01_10_CAMP SPAIN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1c7e3f2e-a4d7-4a4a-ac02-8e7ad2aca30b",
//                       code: "HEALTH_MO_02_04_01_01_09_CHWNBOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2903d4c7-9795-46da-ac71-7ca831d01c18",
//                       code: "HEALTH_MO_02_04_01_01_08_CAMP SCOTTLAND",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a608dcc1-40de-4e23-9d9f-55da44fde7f0",
//                       code: "HEALTH_MO_02_04_01_01_07_PLACE TO BE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3a248252-1d60-4896-9eb5-05e44447e5ea",
//                       code: "HEALTH_MO_02_04_01_01_06_CAMP SUCCESS",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0c6a4aae-d353-43ea-91b1-73b910d174cf",
//                       code: "HEALTH_MO_02_04_01_01_05_SARTIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "886e9dab-d649-4a92-80d6-9a042e660cef",
//                       code: "HEALTH_MO_02_04_01_01_04_E-MAN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b2ddf42d-c7ee-487a-ad5a-ea3a9ffff2a1",
//                       code: "HEALTH_MO_02_04_01_01_03_MA-MARY VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8dc1a5e3-e830-45a4-b745-fbb91ec6758f",
//                       code: "HEALTH_MO_02_04_01_01_02_JUDANYAN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1ada48af-467b-4477-8dbe-e29da630a476",
//                       code: "HEALTH_MO_02_04_01_01_01_BOLUWIN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "dbce0493-a79f-4ff0-ae40-d246d001c619",
//           code: "HEALTH_MO_02_03_DORBOR",
//           boundaryType: "District",
//           children: [
//             {
//               id: "df8cd63c-30ca-47c8-9892-e9fd8b443903",
//               code: "HEALTH_MO_02_03_03_NYANKUNPO CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "870aba15-0685-4a9d-ac23-f05f1551cb9c",
//                   code: "HEALTH_MO_02_03_03_03_NYANKUNPO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "5181f137-44d7-4c55-850c-d6942709bd80",
//                       code: "HEALTH_MO_02_03_03_03_02_NYANKUNPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2ee9f120-2b17-49c1-b622-c7e6b04724e0",
//                       code: "HEALTH_MO_02_03_03_03_01_PUTU TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "afa86626-bba5-4f8a-a6c2-82f145a6d8dd",
//                   code: "HEALTH_MO_02_03_03_02_BARFORWIN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "11c576f9-f0de-4201-a54d-87173f55e757",
//                       code: "HEALTH_MO_02_03_03_02_02_BARFORWIN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "67fb44c3-e6bd-4c8a-86a6-037f4cacef2a",
//                       code: "HEALTH_MO_02_03_03_02_01_BOLLOH POE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "25dc7581-96f8-4f52-9046-26a917d5b28f",
//                   code: "HEALTH_MO_02_03_03_01_JARKAKPO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "940ee08a-ff3a-4937-97e1-f4d9e6a52a45",
//                       code: "HEALTH_MO_02_03_03_01_03_JARKAKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "319787be-0857-48cb-8d93-04d79342a7c5",
//                       code: "HEALTH_MO_02_03_03_01_02_KAYKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c1dc7172-d427-4f08-a302-5208229b0a1f",
//                       code: "HEALTH_MO_02_03_03_01_01_KLAYDEEPER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "e4ea3f8e-3b0b-4868-9256-6abc5c1a9f2c",
//               code: "HEALTH_MO_02_03_02_BOLLOH NEWTOWN",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "5cb0c201-8f97-406a-a1cd-d48d128edbc9",
//                   code: "HEALTH_MO_02_03_02_03_NEWTOWN COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0b75f2cc-a038-479a-8c8d-f016395d5ed5",
//                       code: "HEALTH_MO_02_03_02_03_01_NEWTOWN COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "2ac8edf8-ab7f-4798-adcb-b65af72a2a0c",
//                   code: "HEALTH_MO_02_03_02_02_WARKPO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "314021c9-430b-4ee6-8a16-cd85a73288df",
//                       code: "HEALTH_MO_02_03_02_02_02_WARKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b940fbb8-3e77-4097-a049-3d759f0deb28",
//                       code: "HEALTH_MO_02_03_02_02_01_NIPLAIKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "a0236546-fad3-456b-8955-d7b18aa7d04e",
//                   code: "HEALTH_MO_02_03_02_01_NIMEYOUVILLE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "49bccda2-05bb-4a96-93bf-ddb8415da160",
//                       code: "HEALTH_MO_02_03_02_01_02_NIMEYOUVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "12a4daac-bb4e-411e-a929-5effb515b64d",
//                       code: "HEALTH_MO_02_03_02_01_01_BEFORE CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "a222ac61-79a8-4e2e-a43a-71f0af48dd35",
//               code: "HEALTH_MO_02_03_01_DOESWEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "1a833011-5627-41b9-afc4-ca51e4b7034a",
//                   code: "HEALTH_MO_02_03_01_03_DOESWEN TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0edb4f75-39f7-4d5d-90e8-aa894c4db78a",
//                       code: "HEALTH_MO_02_03_01_03_03_DOESWEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0d8fb847-2c62-49f9-83f6-75caa7c9519d",
//                       code: "HEALTH_MO_02_03_01_03_02_ATLANTIC CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5c64bf30-e986-4c46-9a5b-1de09c3fb727",
//                       code: "HEALTH_MO_02_03_01_03_01_WARWLEKEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "bb785a80-1eb4-479b-bb52-7945d8fa4e0b",
//                   code: "HEALTH_MO_02_03_01_02_BOLLOH JLATIKEN TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1be3b739-c950-45cf-88dd-8b0c4e78f833",
//                       code: "HEALTH_MO_02_03_01_02_03_BOLLOH JLATIKEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f1015991-46cb-4d5b-a4d5-5adf6fbf8391",
//                       code: "HEALTH_MO_02_03_01_02_02_CHENGBETEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "872f1d99-a172-4506-b8fd-3bf7de7194fb",
//                       code: "HEALTH_MO_02_03_01_02_01_DAYBAH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "e3ecaba4-e28d-401a-8138-e680c4fa29a9",
//                   code: "HEALTH_MO_02_03_01_01_WEAYAN TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "b6c8db72-fc08-4598-993c-41c51e6874f7",
//                       code: "HEALTH_MO_02_03_01_01_02_WEAYAN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "df5689b1-2cc7-4c7a-9d1c-aa35f21ac68f",
//                       code: "HEALTH_MO_02_03_01_01_01_SEEBODRO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "68c4cdb0-8bab-4f4b-a3bc-41025db38ec1",
//           code: "HEALTH_MO_02_02_LOWER JLOH",
//           boundaryType: "District",
//           children: [
//             {
//               id: "1ce57726-cf42-4544-a481-cc4f24d5a724",
//               code: "HEALTH_MO_02_02_03_SASS TOWN HOSPITAL",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "633e63ce-6a4c-444b-b19c-eca56b16ccc1",
//                   code: "HEALTH_MO_02_02_03_05_JEKWIKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7295adb6-3a5f-4797-a71c-609c95ba3d2e",
//                       code: "HEALTH_MO_02_02_03_05_03_FELORKLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b176590e-1cfa-47e3-bbfd-1a36efc2455a",
//                       code: "HEALTH_MO_02_02_03_05_02_DARGBEVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cbdee80f-fa7c-46e3-8193-decef36edd47",
//                       code: "HEALTH_MO_02_02_03_05_01_JEKWIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "3212d1ce-205a-4472-9afc-56af505be1fe",
//                   code: "HEALTH_MO_02_02_03_04_DAYKPO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "94a69522-71a7-415d-8af0-8e543b16b6db",
//                       code: "HEALTH_MO_02_02_03_04_03_DAYKPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "95693a71-b313-46d4-b957-ef84764d0bcc",
//                       code: "HEALTH_MO_02_02_03_04_02_BETU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1287aa18-a34e-40ad-999e-3dc41267dd2b",
//                       code: "HEALTH_MO_02_02_03_04_01_SOBOBO-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "18a58c61-99f4-416f-a2b1-3f87ed58f8c0",
//                   code: "HEALTH_MO_02_02_03_03_NROKWIA",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "75ad19ff-8e79-473c-bcc0-5c6f59d6cb4a",
//                       code: "HEALTH_MO_02_02_03_03_04_NROKWIA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e74f6db4-5660-4831-9068-8bec1c98d709",
//                       code: "HEALTH_MO_02_02_03_03_03_KLADIA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fcbdcad3-34a3-48c6-8038-4f8f723b019b",
//                       code: "HEALTH_MO_02_02_03_03_02_KUNNIE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8df5dc4b-488f-47c8-88f5-6c9c934bc545",
//                       code: "HEALTH_MO_02_02_03_03_01_WLOKRI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "474cffb9-af2e-4d50-a7e1-065ca50d7380",
//                   code: "HEALTH_MO_02_02_03_02_WESSEH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "52556a76-589c-43cb-9ac6-bf09d757705d",
//                       code: "HEALTH_MO_02_02_03_02_04_WESSEH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "45a7a3a6-20d7-4e8c-931a-0dc981fcd32b",
//                       code: "HEALTH_MO_02_02_03_02_03_SLOYEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9b0e6e2e-1d74-4de9-8e1a-588f20233971",
//                       code: "HEALTH_MO_02_02_03_02_02_BASSA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e7cb7cb8-d0dc-4318-92fe-e24d30aad5fe",
//                       code: "HEALTH_MO_02_02_03_02_01_KITTEAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "3b390d10-692c-461b-8c1b-c89048480bbb",
//                   code: "HEALTH_MO_02_02_03_01_VALLA ROCK FIELD",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "65d1829e-d05c-421b-b7e1-4bca4d7f0436",
//                       code: "HEALTH_MO_02_02_03_01_02_VALLA ROCK FIELD",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "340dff9e-16ba-496b-997b-ca82b9ab45ce",
//                       code: "HEALTH_MO_02_02_03_01_01_ARAB BASED",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "03a638b9-3cc9-40fa-adcf-d4002eb5eb5e",
//               code: "HEALTH_MO_02_02_02_SOBO COMMUNITY CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "8c30d3de-2088-44ae-a1eb-6e086f1481e0",
//                   code: "HEALTH_MO_02_02_02_02_SOBO CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "394d8a89-5d73-4bb0-9bbb-f88fb30a90cc",
//                       code: "HEALTH_MO_02_02_02_02_02_SOBO CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fb3a0e83-8eb4-486c-b5e3-a9243e1cc6b7",
//                       code: "HEALTH_MO_02_02_02_02_01_PITTAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "67a68578-9ec5-4a4d-9949-a377a5a2f9f1",
//                   code: "HEALTH_MO_02_02_02_01_NEROH",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "7fb12cd6-9f71-454b-8cd8-c1bb838728c3",
//                       code: "HEALTH_MO_02_02_02_01_03_NEROH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bed43f6f-2224-4f52-b54c-fab3ca0db516",
//                       code: "HEALTH_MO_02_02_02_01_02_WESSEHPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "89d301c5-70ec-4e9b-a7ca-afcd37cd9364",
//                       code: "HEALTH_MO_02_02_02_01_01_KARH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "1175a943-26aa-4f4d-b0c7-7f764eaba035",
//               code: "HEALTH_MO_02_02_01_NIFU CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "b66a9f5a-7a33-4b1a-b5a2-672ae4984720",
//                   code: "HEALTH_MO_02_02_01_02_NIFU CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "85f2ec69-a27c-41fa-881b-49779d5a4599",
//                       code: "HEALTH_MO_02_02_01_02_01_NIFU CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7bf7de3c-cb5d-43f1-9917-7b19f1cfbd5c",
//                   code: "HEALTH_MO_02_02_01_01_BOTRA",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "39b12f4e-749d-44b0-a041-248a2ba08991",
//                       code: "HEALTH_MO_02_02_01_01_03_BOTRA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e78c37fc-b88a-4f0e-8aca-ef53109ff159",
//                       code: "HEALTH_MO_02_02_01_01_02_DIOH CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "91a9897f-4e77-4c83-b17d-09e7168a3279",
//                       code: "HEALTH_MO_02_02_01_01_01_UNITED BASE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "e0d049f2-10c9-4b75-8b5f-4cd69639c23f",
//           code: "HEALTH_MO_02_01_TREHN",
//           boundaryType: "District",
//           children: [
//             {
//               id: "74d40f95-4273-4c19-bba0-560beda536cc",
//               code: "HEALTH_MO_02_01_07_GARRAWAY CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7e400712-0e20-4f83-8f7f-323d23b2614e",
//                   code: "HEALTH_MO_02_01_07_03_NEW GARRAWAY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a677ef97-482f-4a55-a2b3-f39571919c4f",
//                       code: "HEALTH_MO_02_01_07_03_08_NEW GARRAWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0641cee3-29a2-47fc-bf05-556e7bd5aeaf",
//                       code: "HEALTH_MO_02_01_07_03_07_MISSION TOWN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ed77a0b6-a2fd-4add-a702-14dcd665d07d",
//                       code: "HEALTH_MO_02_01_07_03_06_MESSION TOWN-2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "23b7647b-ec09-4af1-bb20-a4158839f5ec",
//                       code: "HEALTH_MO_02_01_07_03_05_SAYWONKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "84cacb58-74f6-4ed9-9eaf-5a97dc66158c",
//                       code: "HEALTH_MO_02_01_07_03_04_HOSPITAL CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "51a868cc-0366-4040-bbca-3f84eb9bc685",
//                       code: "HEALTH_MO_02_01_07_03_03_GBALEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "516eaeca-8a62-4c03-baff-1524d3511f84",
//                       code: "HEALTH_MO_02_01_07_03_02_MAHQUENKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "60ae17cf-d095-43d3-9766-3218b517e59f",
//                       code: "HEALTH_MO_02_01_07_03_01_PUNGBALOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "8e8bd20d-720c-4649-acd3-bd710fc6e027",
//                   code: "HEALTH_MO_02_01_07_02_WETEKEN 1",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0724c069-a42c-4cfb-a4aa-c6970ebb0ed5",
//                       code: "HEALTH_MO_02_01_07_02_02_WETEKEN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d05c4ff6-dd81-465b-8708-4f37738552a4",
//                       code: "HEALTH_MO_02_01_07_02_01_WETEKEN-2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "ea8a498b-a7ae-4d1c-b05e-9be30175e4fe",
//                   code: "HEALTH_MO_02_01_07_01_TUWAKEN 1",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "97c420d9-9fe6-437c-8089-5409b7461df6",
//                       code: "HEALTH_MO_02_01_07_01_04_TEBEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3fc6e08c-668d-4b9d-9d9e-1163478b35fb",
//                       code: "HEALTH_MO_02_01_07_01_03_BACHEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "793682ac-6217-4d96-be5f-63792268c50e",
//                       code: "HEALTH_MO_02_01_07_01_02_TUWAKEN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d9091443-458e-405a-b5f2-3daa72dded6d",
//                       code: "HEALTH_MO_02_01_07_01_01_TUWAKEN-2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "1f1b37a5-db7a-4b0b-a2c9-603a55929067",
//               code: "HEALTH_MO_02_01_06_GENOYAH CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f82e91e0-5258-4cd7-bec0-b0d5ca5f1b54",
//                   code: "HEALTH_MO_02_01_06_02_GENOYAH CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0e481e97-2b88-49b2-9126-c7686cbfc2cd",
//                       code: "HEALTH_MO_02_01_06_02_03_GENOYAH CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "af4f6d32-ae83-4934-ae2e-934cae5949dc",
//                       code: "HEALTH_MO_02_01_06_02_02_NEGBOWINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4f63cbda-15fd-4b88-815d-390c7531a933",
//                       code: "HEALTH_MO_02_01_06_02_01_YETIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "6085cd95-ba69-4a8f-bd54-f2113b37a74d",
//                   code: "HEALTH_MO_02_01_06_01_NYANBO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "92ff07c7-5d5a-45ef-b66c-ca7ee07c16f0",
//                       code: "HEALTH_MO_02_01_06_01_03_NYANBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3725140e-b18d-4b2e-bf97-b7e2393bfef7",
//                       code: "HEALTH_MO_02_01_06_01_02_PIDDY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "47f12890-822e-4fc6-a2fa-0914e77e38f0",
//                       code: "HEALTH_MO_02_01_06_01_01_JLODEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "abe35368-f447-414a-949a-b83682430dc1",
//               code: "HEALTH_MO_02_01_05_NEMIAH CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "75252e5d-ed36-4c0a-ba4d-c2e02b3b1243",
//                   code: "HEALTH_MO_02_01_05_03_WILISONVILLE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "5f5fcfe5-746d-4bc6-9adc-ff2161a8ba3a",
//                       code: "HEALTH_MO_02_01_05_03_05_WILSONVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "93582578-f1d6-4ba5-82b4-3470c85b5227",
//                       code: "HEALTH_MO_02_01_05_03_04_JLAWLEKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9a7b2a79-011f-4744-8ecf-5b4bffcc09cd",
//                       code: "HEALTH_MO_02_01_05_03_03_SLOLOH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0aa2beb3-fde8-479d-acb0-da55d163c185",
//                       code: "HEALTH_MO_02_01_05_03_02_GBAYOUBEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1bcbd95e-a7d1-4a7c-ac02-1e3684a6bb18",
//                       code: "HEALTH_MO_02_01_05_03_01_TUBIAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "edbc497b-d588-44e1-831d-6c5743021904",
//                   code: "HEALTH_MO_02_01_05_02_PENNUKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "39634f7c-7016-4156-9408-a0c5d1910d3c",
//                       code: "HEALTH_MO_02_01_05_02_05_JLATIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4dd2156d-b632-470a-a0a7-fdf0a5b449a7",
//                       code: "HEALTH_MO_02_01_05_02_04_GLOPLUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "736c3eb6-0d15-4c00-9470-e2656b72482e",
//                       code: "HEALTH_MO_02_01_05_02_03_ZOLUBEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "978ba1bb-d4d7-412d-a35b-76620077deee",
//                       code: "HEALTH_MO_02_01_05_02_02_PENNUKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "adc6125c-f430-44ed-b3f6-33cd427b874d",
//                       code: "HEALTH_MO_02_01_05_02_01_NEMIAH BEACH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "b97ad250-d81f-4e70-a859-01daad2dc63d",
//                   code: "HEALTH_MO_02_01_05_01_COFFIBEE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "3b29caa9-5302-4fa9-b181-63389704e2aa",
//                       code: "HEALTH_MO_02_01_05_01_05_TENDENKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5b0fd417-b241-4c09-b9ed-9e96fa8d91c9",
//                       code: "HEALTH_MO_02_01_05_01_04_OLD GBAMIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "492d6b20-50e7-41f6-a590-33c99f2b7a61",
//                       code: "HEALTH_MO_02_01_05_01_03_NEW GBAMIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "beabac1a-8ac5-4763-b0c5-eb3385e226b6",
//                       code: "HEALTH_MO_02_01_05_01_02_DARPLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "143a381b-1854-4410-baf7-68ca9f80eead",
//                       code: "HEALTH_MO_02_01_05_01_01_COFFIBEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "bfa5da63-4a11-4b9e-98a6-7074201bb15d",
//               code: "HEALTH_MO_02_01_04_NIFA CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "dd947fba-79cf-41cf-a54a-1bdc51702051",
//                   code: "HEALTH_MO_02_01_04_01_MIDDLE TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "f9d1b513-b4a9-4273-9415-289cf301ba59",
//                       code: "HEALTH_MO_02_01_04_01_05_BIG TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "080d2576-ae95-43d1-ac21-f88a57b2db80",
//                       code: "HEALTH_MO_02_01_04_01_04_JLORWIN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1629ded2-7e25-49e4-82b7-a2296140fe32",
//                       code: "HEALTH_MO_02_01_04_01_03_WATER SIDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2f8963a9-8fcf-43a5-81ac-27b4ad18acf8",
//                       code: "HEALTH_MO_02_01_04_01_02_WEDABO BEACH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "170032f7-b4af-4c4b-8767-6834d588d29c",
//                       code: "HEALTH_MO_02_01_04_01_01_MIDDLE TOWN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "7ea1f08e-1e95-4c10-bdbf-970d50e99f6b",
//               code: "HEALTH_MO_02_01_03_BEHWAN HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "536454bb-26b4-4a59-9dfa-58d0b686a942",
//                   code: "HEALTH_MO_02_01_03_03_BEHWAN CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "0b51ab69-9f70-478a-87e8-30eb26b5d067",
//                       code: "HEALTH_MO_02_01_03_03_01_BEHWAN CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "5b2d8cfc-c124-44a8-9d29-9c3f7c065938",
//                   code: "HEALTH_MO_02_01_03_02_GBONOWINE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6cbc3f59-22fe-4a00-a872-59fef153f4a6",
//                       code: "HEALTH_MO_02_01_03_02_04_SAWKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a4b12bc3-cb57-4bd5-ae00-8462696057c3",
//                       code: "HEALTH_MO_02_01_03_02_03_GBONOWINE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "407e0686-ab9f-498a-9aae-668101c18067",
//                       code: "HEALTH_MO_02_01_03_02_02_SANGBANIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f445d2a6-2051-431c-ae28-d034dd8377a7",
//                       code: "HEALTH_MO_02_01_03_02_01_KWEBIE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "0328c442-9860-49f4-8aac-cfb38cd6240d",
//                   code: "HEALTH_MO_02_01_03_01_KPOIKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ce05d0fa-0a9e-4b97-8302-574723c5e367",
//                       code: "HEALTH_MO_02_01_03_01_06_FOLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7dde2a4f-a8c5-4b89-baae-de762557289a",
//                       code: "HEALTH_MO_02_01_03_01_05_QUENKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ac4a2d80-a7bd-4e4f-a137-14af02110063",
//                       code: "HEALTH_MO_02_01_03_01_04_KULODEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "969748f1-085d-4370-8b0f-53f8b8575f9f",
//                       code: "HEALTH_MO_02_01_03_01_03_CHANGBENKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5b83f83f-05a2-4d21-bb97-912351d1ca21",
//                       code: "HEALTH_MO_02_01_03_01_02_SAYWONKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "68fd82ed-1c13-4515-af34-277602f0a879",
//                       code: "HEALTH_MO_02_01_03_01_01_KPOIKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "fbbe9420-e09f-49e6-8778-88b24262a6db",
//               code: "HEALTH_MO_02_01_02_NEWAKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "80264817-4de2-4035-bfa2-bd23d6f9a39b",
//                   code: "HEALTH_MO_02_01_02_03_NEWAKEN CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "989d4922-3b68-493f-b5d0-1d461f7cd0b2",
//                       code: "HEALTH_MO_02_01_02_03_02_NEWAKEN CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9f842a5a-9284-419b-938d-a6c200cf6117",
//                       code: "HEALTH_MO_02_01_02_03_01_DIAYOKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "e6d91ce1-390d-4e38-b8ee-3666020102ac",
//                   code: "HEALTH_MO_02_01_02_02_SORROKEN CITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "af8b4f57-b4d0-46b5-a029-67ce2f081f3d",
//                       code: "HEALTH_MO_02_01_02_02_03_SORROKEN CITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "882eea30-3f4e-497a-b680-1b42aa14e15d",
//                       code: "HEALTH_MO_02_01_02_02_02_GEDEBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7dc75b2c-d4f4-4305-b141-53c493dc7adc",
//                       code: "HEALTH_MO_02_01_02_02_01_WUTUKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "c1662f04-53c8-4f57-9957-64a8e9468b22",
//                   code: "HEALTH_MO_02_01_02_01_DOUGBO",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "c67dfcb6-9041-4e1a-ac69-26f2200f07cd",
//                       code: "HEALTH_MO_02_01_02_01_03_DOUGBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "10692f49-fdb6-4e42-aa2d-fa613f0597af",
//                       code: "HEALTH_MO_02_01_02_01_02_GEDEBO-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3be88c3-cb36-4d7b-816d-a73ac86c0b55",
//                       code: "HEALTH_MO_02_01_02_01_01_GBARKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "c0d5796d-cf85-45d0-b6fd-4a12ec6e9eaf",
//               code: "HEALTH_MO_02_01_01_GBLEBO CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4fa71467-bf9e-4f01-a040-d4e2aac223d7",
//                   code: "HEALTH_MO_02_01_01_02_GBLEBO TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "c2bb8ed0-b2c1-4407-be15-065b18cba562",
//                       code: "HEALTH_MO_02_01_01_02_01_GBLEBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "10ab4774-4384-44db-9198-6e556cd1aa98",
//                   code: "HEALTH_MO_02_01_01_01_OLD KARLAWAKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a95bee0c-7f61-4bff-b81f-9e36a52148e2",
//                       code: "HEALTH_MO_02_01_01_01_09_KWAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d36e9b41-64c5-48cc-81ef-370dd58992b4",
//                       code: "HEALTH_MO_02_01_01_01_08_SAYWONKEN-02",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4c54b2bc-e339-4293-a1cb-e26579054e5d",
//                       code: "HEALTH_MO_02_01_01_01_07_OLD KARLAWAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5a6c2ed2-94e4-46de-9c8e-d4d42521992f",
//                       code: "HEALTH_MO_02_01_01_01_06_NEW KARLAWAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ab57a89b-1214-4f91-9e02-ac0c5e7a54ed",
//                       code: "HEALTH_MO_02_01_01_01_05_TUNKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3c3ca3ba-81f6-4908-a5bb-f8c9f8fe1316",
//                       code: "HEALTH_MO_02_01_01_01_04_QUAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7a908ae2-91db-46d9-a87a-ed3ea9bd7e91",
//                       code: "HEALTH_MO_02_01_01_01_03_DUTORKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "89a8c2ca-61c3-43e6-86c7-d06f3809ba87",
//                       code: "HEALTH_MO_02_01_01_01_02_DOUGBOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e799177d-972f-4ff1-8bd8-d2b59e4bb0a5",
//                       code: "HEALTH_MO_02_01_01_01_01_TENDEKEN-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "30a3fa44-0063-4339-a31e-f5508d4baa13",
//       code: "HEALTH_MO_01_GRAND GEDEH",
//       boundaryType: "Province",
//       children: [
//         {
//           id: "ab3919b9-16bb-4f9e-b327-8ef2e9440d6d",
//           code: "HEALTH_MO_01_05_CAVALLA",
//           boundaryType: "District",
//           children: [
//             {
//               id: "906e8754-5687-43d2-86b6-5776b862747d",
//               code: "HEALTH_MO_01_05_06_BARGBLOR CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "9e1917d6-c22c-42a1-addc-1e84d34d78f9",
//                   code: "HEALTH_MO_01_05_06_02_BARGBLOR TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1735dc90-2a76-4c44-a5c3-d452876c3ef9",
//                       code: "HEALTH_MO_01_05_06_02_20_ZONPLEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1c19f043-0bce-4860-a5b3-f6ff1104f9fe",
//                       code: "HEALTH_MO_01_05_06_02_19_MLAYEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a71d6f3b-3bbb-41ad-a57a-401641e9329b",
//                       code: "HEALTH_MO_01_05_06_02_18_BARGBLOR TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bd68056a-d22c-44f3-a2ff-c5373eabc3f6",
//                       code: "HEALTH_MO_01_05_06_02_17_DOLUE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4cf8ecfb-e515-4224-a2c6-78d2a47ae2ac",
//                       code: "HEALTH_MO_01_05_06_02_16_TOJALLAH TOWN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4a6ab2e3-bcf7-44b0-b520-f5886b9ba14b",
//                       code: "HEALTH_MO_01_05_06_02_15_TOJALLAH TOWN 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b51ce8dc-bd0f-4850-91ef-68e8b7ec81d4",
//                       code: "HEALTH_MO_01_05_06_02_14_HARRIS COLLIN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bc9fa50f-48f3-4b89-bf3c-01f3907241bb",
//                       code: "HEALTH_MO_01_05_06_02_13_ONE MAN VI8LLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "625ae674-4838-4ad3-85ce-42d781cda284",
//                       code: "HEALTH_MO_01_05_06_02_12_BABLEE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "889e07db-8883-4cd4-8153-fb496e9b1240",
//                       code: "HEALTH_MO_01_05_06_02_11_COCODE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6e3ebc98-90cb-4de0-ace3-026f225025a7",
//                       code: "HEALTH_MO_01_05_06_02_10_SALAKAZON",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2393c058-64db-453c-9109-3df9252d6570",
//                       code: "HEALTH_MO_01_05_06_02_09_JOE DENNIS VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "99c60929-3cb4-456d-bce5-bd6edcdf53da",
//                       code: "HEALTH_MO_01_05_06_02_08_CAMROOM VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "104fb76c-c5ad-40d8-8ab5-34f3217eece8",
//                       code: "HEALTH_MO_01_05_06_02_07_GAYE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "df2b8373-b78b-4fcd-8427-71355e389584",
//                       code: "HEALTH_MO_01_05_06_02_06_PETER VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "73fc5e03-0fc3-4bf1-81b8-b9c245d52646",
//                       code: "HEALTH_MO_01_05_06_02_05_DEHYE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "78d2810c-782e-4854-9454-c41d1de9eeac",
//                       code: "HEALTH_MO_01_05_06_02_04_GEE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "236503a5-aa0e-46d9-a610-327c6911c067",
//                       code: "HEALTH_MO_01_05_06_02_03_JOSEPHUS VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d5a0a714-ede4-45ec-9899-69134fc0157c",
//                       code: "HEALTH_MO_01_05_06_02_02_NICO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "33d80cda-6e01-4b9c-916c-54f9bfba9286",
//                       code: "HEALTH_MO_01_05_06_02_01_TENZON VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "827e9a73-9f6b-4524-9fb0-98dc3b0157e8",
//                   code: "HEALTH_MO_01_05_06_01_PENUNEWEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "89e91101-474e-48c7-ab94-6fa4d651e907",
//                       code: "HEALTH_MO_01_05_06_01_05_JAYOR VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fac042e9-0f9f-4d94-8272-100c743c273f",
//                       code: "HEALTH_MO_01_05_06_01_04_VORWBLEE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3ce0963-ef56-4ca9-8ace-a0b660f28965",
//                       code: "HEALTH_MO_01_05_06_01_03_PENUNEWEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cbc81622-26de-49ed-bf70-c58ae8b046af",
//                       code: "HEALTH_MO_01_05_06_01_02_YOUGE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aa7ee88a-d895-4a07-9fe2-9a82a338c7ba",
//                       code: "HEALTH_MO_01_05_06_01_01_BAYE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "e61ae52a-ac81-4e95-a6ad-3209cda9bfb9",
//               code: "HEALTH_MO_01_05_05_BEH TOWN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "29990092-a0ad-4cf4-a0fa-4f3774309b34",
//                   code: "HEALTH_MO_01_05_05_01_BEH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a9bfa0a7-abb2-4ca8-9b0e-fe7275afaac7",
//                       code: "HEALTH_MO_01_05_05_01_20_ZAZA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fab5a1b6-8899-49d0-af45-49f2f73f06b3",
//                       code: "HEALTH_MO_01_05_05_01_19_COMPOUND",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "97fc3508-8e6a-4469-b95b-b727e5ca855f",
//                       code: "HEALTH_MO_01_05_05_01_18_GLEPLAY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "09479c33-aeb1-4d2a-b15a-3d44a8901d5c",
//                       code: "HEALTH_MO_01_05_05_01_17_KPAI TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "eae205c8-32b4-4b98-ab19-24ec28a74205",
//                       code: "HEALTH_MO_01_05_05_01_16_JULUTUZON1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "86894c74-7f3c-4831-b8eb-8ed614bfdc60",
//                       code: "HEALTH_MO_01_05_05_01_15_JULUTUZON2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e10b5a67-3716-4678-85f9-8ff19ea73786",
//                       code: "HEALTH_MO_01_05_05_01_14_BASSA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "80738b0c-799c-4bac-877b-382d5e8adcd6",
//                       code: "HEALTH_MO_01_05_05_01_13_GLOKPADEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b2e0571-28d4-421f-9a78-0e160526abe5",
//                       code: "HEALTH_MO_01_05_05_01_12_SAYDEE VILLAGE-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bf4aa27b-cfb0-4cc0-822a-3fa1fff56f39",
//                       code: "HEALTH_MO_01_05_05_01_11_WLUBOR VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "59302b4a-dab6-4cce-b994-d2b101d9a506",
//                       code: "HEALTH_MO_01_05_05_01_10_SINKON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "285886fd-2c83-4025-a4a7-e95fe61eb3b3",
//                       code: "HEALTH_MO_01_05_05_01_09_BEH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bc8cf9fd-bf90-43fd-968a-7cfb6f2b0ee1",
//                       code: "HEALTH_MO_01_05_05_01_08_BODUO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6c0745dd-03e2-4a41-abd5-62e4c37e377c",
//                       code: "HEALTH_MO_01_05_05_01_07_TOGBALEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9039ce56-0b09-4835-934e-dbe35f6f1336",
//                       code: "HEALTH_MO_01_05_05_01_06_KPOWEIN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f0ddf5e-8f05-4ae9-9cb6-177d47c36401",
//                       code: "HEALTH_MO_01_05_05_01_05_DEBOR TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "61383724-46c0-4f45-9298-3a2b9184a1aa",
//                       code: "HEALTH_MO_01_05_05_01_04_MIDDLE EAST",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "118e1121-1ab7-4cf9-9994-942b8e226d00",
//                       code: "HEALTH_MO_01_05_05_01_03_GEYAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7c2caac6-8634-40f1-8d5e-c1be33bb377c",
//                       code: "HEALTH_MO_01_05_05_01_02_VLEGEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "46208580-6914-449f-a2c8-6b89aa158892",
//                       code: "HEALTH_MO_01_05_05_01_01_GRADY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "e18e92e2-0eb6-4a54-b004-c10498340353",
//               code: "HEALTH_MO_01_05_04_JANZON CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4dedecad-1816-4501-8d4d-8c6676e5c515",
//                   code: "HEALTH_MO_01_05_04_01_JANZON TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "611c4b0b-0f14-4f57-961a-c592c4b18b4b",
//                       code: "HEALTH_MO_01_05_04_01_14_DIAHN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "31e64095-52fe-4965-a8d5-2fdbae07271a",
//                       code: "HEALTH_MO_01_05_04_01_13_BROWN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "984159ab-7957-43fc-a3d0-2bef614d23ef",
//                       code: "HEALTH_MO_01_05_04_01_12_BANANA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f421f93-17d4-489d-93c0-fa3b35e14e16",
//                       code: "HEALTH_MO_01_05_04_01_11_JANZON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "49f09245-07b1-40ec-984d-2ded118c5cb3",
//                       code: "HEALTH_MO_01_05_04_01_10_BAYWAYDEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4cc3d86c-81a7-4524-be13-8773ce625b40",
//                       code: "HEALTH_MO_01_05_04_01_09_NEW POHAN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f7d5b1b0-4464-4bcd-9945-7bdfbda37ad0",
//                       code: "HEALTH_MO_01_05_04_01_08_OLD POHAN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5d0bd8dd-8c90-42a4-b536-595c0941a94a",
//                       code: "HEALTH_MO_01_05_04_01_07_BOE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d3c2bdce-d7c4-4ed2-a16b-93c7e00aa618",
//                       code: "HEALTH_MO_01_05_04_01_06_BANGBOR VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8d3998a2-21dd-4bd0-b821-8e9fe4f544e8",
//                       code: "HEALTH_MO_01_05_04_01_05_GLAHN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0226f39a-96c5-4e32-9946-f96c3fbdd12f",
//                       code: "HEALTH_MO_01_05_04_01_04_DUBA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "967e2c38-9d56-4779-98da-0dfb5f8592cb",
//                       code: "HEALTH_MO_01_05_04_01_03_SOLO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a63d588b-99cb-498b-801b-e99261fdc11c",
//                       code: "HEALTH_MO_01_05_04_01_02_KAHN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ccd412af-dbaa-4e8d-b19b-ca84e6c9d997",
//                       code: "HEALTH_MO_01_05_04_01_01_GOANWONKPI",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "8a4e0e7f-5430-48f4-a740-1af0d80c364b",
//               code: "HEALTH_MO_01_05_03_TUZON CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "52f073cc-f756-4f03-b086-927e15de60e4",
//                   code: "HEALTH_MO_01_05_03_01_TUZON TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "2d5aee24-011c-4be3-beb7-bf5a9cbbb987",
//                       code: "HEALTH_MO_01_05_03_01_09_TUZON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "caa0d395-36a2-4b24-bab7-5249f88af33a",
//                       code: "HEALTH_MO_01_05_03_01_08_SOLO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "382c37ec-82f5-453f-a487-a7a75f4e33ef",
//                       code: "HEALTH_MO_01_05_03_01_07_KAHN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "41470a60-0de8-45c0-9418-9b36b7583df6",
//                       code: "HEALTH_MO_01_05_03_01_06_CHEALUBLEE1 VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "54e61a2c-2554-4271-9411-7c7917c8dabc",
//                       code: "HEALTH_MO_01_05_03_01_05_CHEALUBLEE2 VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b946417a-7f9d-49d4-826a-7592491af31f",
//                       code: "HEALTH_MO_01_05_03_01_04_JALOKEN VLLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f5343602-bb65-4709-9e16-17e02ba5732b",
//                       code: "HEALTH_MO_01_05_03_01_03_GOLYEAZON VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "40ffb284-7d90-4ab4-bbfc-abce92b76f38",
//                       code: "HEALTH_MO_01_05_03_01_02_BIG JOE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "168edf74-3379-4921-91b9-d304d883ed2f",
//                       code: "HEALTH_MO_01_05_03_01_01_DOEBLEE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "90768536-109b-41ec-863a-714d18b082fe",
//               code: "HEALTH_MO_01_05_02_ZAI CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "e28fc788-496e-4e54-89fa-abf76ad6b61c",
//                   code: "HEALTH_MO_01_05_02_01_ZAI TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "efb8953b-680d-4e52-b0f0-5e91ec60cf47",
//                       code: "HEALTH_MO_01_05_02_01_14_ZAI TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "941f244e-7b03-4f2a-bfb5-7a4147f451a1",
//                       code: "HEALTH_MO_01_05_02_01_13_BARTEHJAM",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fa1c568f-706d-4ac0-88d1-e6fcfd618633",
//                       code: "HEALTH_MO_01_05_02_01_12_GWEIN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "745847d6-0380-4bb0-bc9b-0ee72201fe45",
//                       code: "HEALTH_MO_01_05_02_01_11_BASSA VILLAGE 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "64d84ed1-28da-4736-a9ae-04c9ffdf6cac",
//                       code: "HEALTH_MO_01_05_02_01_10_SOWAKEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b0d21bf-bcfc-4152-bde7-711f6860dcaf",
//                       code: "HEALTH_MO_01_05_02_01_09_KOON VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f9d61d7d-8d99-43a7-ad7f-d0508bd5dc29",
//                       code: "HEALTH_MO_01_05_02_01_08_ONE MAN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f84080f7-ab0c-4536-ac6f-ba6b81ea9cac",
//                       code: "HEALTH_MO_01_05_02_01_07_KOHU VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "eaba6377-a8e5-462b-a66d-6b697f679fe5",
//                       code: "HEALTH_MO_01_05_02_01_06_QUIAH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "93a6ba8f-fcee-45f1-83d6-af0156f273eb",
//                       code: "HEALTH_MO_01_05_02_01_05_FLAHN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a8c054ff-0036-4184-97f3-3dd0e14e5a3e",
//                       code: "HEALTH_MO_01_05_02_01_04_TARLUE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8a91bf24-90a9-4b42-a55a-e7b847807c4c",
//                       code: "HEALTH_MO_01_05_02_01_03_ESTHER VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8a6e3351-5e63-41fb-abfc-66547d1f4fdb",
//                       code: "HEALTH_MO_01_05_02_01_02_KANGBEKEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a15df2ec-4d8c-4b27-88f4-61eb20b6ca39",
//                       code: "HEALTH_MO_01_05_02_01_01_PERER VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "791a3159-ed2c-4525-9c65-62adfca5e530",
//               code: "HEALTH_MO_01_05_01_GBOLEKEN CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "015b5bc3-5782-4059-9656-0093d29b7a52",
//                   code: "HEALTH_MO_01_05_01_01_GBOLEKEN TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "21cab5fa-d284-4afd-8dd6-4d84cecbff0b",
//                       code: "HEALTH_MO_01_05_01_01_15_GBOLEKEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "92a227ee-b596-4517-8742-eefea86e392a",
//                       code: "HEALTH_MO_01_05_01_01_14_GARLEY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1580ebee-747f-4177-95f2-d2e832fdfa5a",
//                       code: "HEALTH_MO_01_05_01_01_13_GAMBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "66f8541c-3e4c-495a-b359-1d1361c12cc2",
//                       code: "HEALTH_MO_01_05_01_01_12_DWEH COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1182e7bd-dece-49ba-bfc7-238e3ae43830",
//                       code: "HEALTH_MO_01_05_01_01_11_SEWIEN 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d7d34a71-a7ba-473a-956b-ac7a1e93ee68",
//                       code: "HEALTH_MO_01_05_01_01_10_SEWIEN 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2bfeb30e-fa6f-455e-a5c4-95140c9ae87e",
//                       code: "HEALTH_MO_01_05_01_01_09_ZIWAY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a649960c-6849-4812-a017-252260698ab4",
//                       code: "HEALTH_MO_01_05_01_01_08_JONE ZBAYEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "54537ffb-b7b3-4484-b5e4-d0fdc6d81fbb",
//                       code: "HEALTH_MO_01_05_01_01_07_WILSON VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "03c8ef45-f10d-4e6b-93cf-8d6a8528f849",
//                       code: "HEALTH_MO_01_05_01_01_06_DEH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6b7acdd0-fd85-4c00-8dfb-762f3b27c326",
//                       code: "HEALTH_MO_01_05_01_01_05_ZONE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f79e3975-248d-47aa-936a-4209165fa1bb",
//                       code: "HEALTH_MO_01_05_01_01_04_GWENEBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b6941022-9113-4d12-ac5d-f59033482887",
//                       code: "HEALTH_MO_01_05_01_01_03_FRANZAY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "46c81667-dd0a-4af5-9874-91a35140ee95",
//                       code: "HEALTH_MO_01_05_01_01_02_DOLEZON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fa305677-247d-4e66-a565-f10f966ff7a0",
//                       code: "HEALTH_MO_01_05_01_01_01_SOLO TOWN INSIDE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "3d7e9689-7afe-4e6a-83d2-4d04f4386ad8",
//           code: "HEALTH_MO_01_04_GBAO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "2bd64f48-8f2b-4e7d-ac0a-fbc17e29ed88",
//               code: "HEALTH_MO_01_04_03_GBARZON HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f47cc21f-8e2c-4e8c-b75c-3b74d7ff7698",
//                   code: "HEALTH_MO_01_04_03_03_ZLEH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e18f6429-8221-4f9c-be00-c421971617c5",
//                       code: "HEALTH_MO_01_04_03_03_07_ZLEH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fbc23656-a70c-4c17-a2dc-62071b81df52",
//                       code: "HEALTH_MO_01_04_03_03_06_GBAYEA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "39f0c29b-8ae2-416f-bcc3-f39a4f6d5701",
//                       code: "HEALTH_MO_01_04_03_03_05_GAYE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c968111b-3bd7-451d-94ca-2e678e08ec12",
//                       code: "HEALTH_MO_01_04_03_03_04_TOWAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "635cce60-2898-4558-b473-c50032d03c82",
//                       code: "HEALTH_MO_01_04_03_03_03_POUH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "159c858c-87c4-4486-bc56-31e0370c2914",
//                       code: "HEALTH_MO_01_04_03_03_02_WULOTONDEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "03964df5-37b9-4ac9-a68e-ac9841f82015",
//                       code: "HEALTH_MO_01_04_03_03_01_PARBOE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "6fd61b04-732e-4be1-92f8-7dd5f781da55",
//                   code: "HEALTH_MO_01_04_03_02_GBARZON TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "224a9d26-7e82-451a-8c40-e2e5f8cf5367",
//                       code: "HEALTH_MO_01_04_03_02_04_GBARZON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dfd13bc7-3690-4e2a-b1f1-f9f19e3d7ec0",
//                       code: "HEALTH_MO_01_04_03_02_03_GOR VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "556e7ead-105e-4029-9832-160aa74ec353",
//                       code: "HEALTH_MO_01_04_03_02_02_KONUWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6e1ffb42-ebfd-45c0-8a34-82b133627933",
//                       code: "HEALTH_MO_01_04_03_02_01_SAYON VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "84b7e362-c87e-4b22-8188-394368a659d6",
//                   code: "HEALTH_MO_01_04_03_01_GBARZON JARWODEE TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "04649931-2068-4501-b9ec-8202b34413ec",
//                       code: "HEALTH_MO_01_04_03_01_10_MOMBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4007ad48-8fec-451d-8316-6df1cb277c2e",
//                       code: "HEALTH_MO_01_04_03_01_09_GBARKEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6362722f-5d76-41c9-b8a9-33a1c71deafa",
//                       code: "HEALTH_MO_01_04_03_01_08_TELEDEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1d412724-2fec-42ac-b33f-00b3ced79fef",
//                       code: "HEALTH_MO_01_04_03_01_07_DAYBLEY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6c00e93d-92e4-4853-ba93-3e64de13cd89",
//                       code: "HEALTH_MO_01_04_03_01_06_KWEOH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3a1348f0-f186-481d-ac7c-0a4cbd42ecbb",
//                       code: "HEALTH_MO_01_04_03_01_05_JULUZON",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0d4c4214-ab51-4bd1-b769-2261572362ff",
//                       code: "HEALTH_MO_01_04_03_01_04_GBARZON JARWODEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2aa1d5d9-de08-47db-bf98-1c40e8beb155",
//                       code: "HEALTH_MO_01_04_03_01_03_BARKOR TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7fce073e-1f95-48a7-b567-990f0e27ee28",
//                       code: "HEALTH_MO_01_04_03_01_02_KANYEA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "538f29de-7456-4f46-9b72-ed816b289a38",
//                       code: "HEALTH_MO_01_04_03_01_01_CHINESE CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "b8e4c80c-4387-48a8-a8d5-a25e035b7a4c",
//               code: "HEALTH_MO_01_04_02_POLAR CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "4108be72-51a6-4592-93b3-12bbabf26340",
//                   code: "HEALTH_MO_01_04_02_01_GBARZON POLAR",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "19ffc06e-7a7b-4f18-8ee9-0d1eec6395ae",
//                       code: "HEALTH_MO_01_04_02_01_07_GBARZON POLAR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "45d4e429-243d-4258-ad0f-54a086029aa3",
//                       code: "HEALTH_MO_01_04_02_01_06_CHELSLA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "da430f7b-2486-4005-8fdd-7cd0866e0087",
//                       code: "HEALTH_MO_01_04_02_01_05_ZUAJAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "de04b678-652c-437f-a217-f38a0457a5e1",
//                       code: "HEALTH_MO_01_04_02_01_04_KULEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bb6ae8ae-dab7-4c95-8977-bd0a193a93b9",
//                       code: "HEALTH_MO_01_04_02_01_03_JALAYOU VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bb041447-c5a4-4b78-8202-fe050cd09900",
//                       code: "HEALTH_MO_01_04_02_01_02_SOWOE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "140cd4f6-326b-4007-8d59-280cb36f610c",
//                       code: "HEALTH_MO_01_04_02_01_01_ZALAKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "ea5ea9c7-a07d-458f-a15b-18a51ae1958e",
//               code: "HEALTH_MO_01_04_01_GBOE GEEWON COMMUNITY CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c38750df-b261-4fe7-a0f7-be5972aa9670",
//                   code: "HEALTH_MO_01_04_01_02_GBOE GEEWON",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "42c3edd9-d796-4b84-a791-043868222f57",
//                       code: "HEALTH_MO_01_04_01_02_12_GBOE GEEWON",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5806fcef-df4f-4d55-b559-6f8a77a8aec2",
//                       code: "HEALTH_MO_01_04_01_02_11_ZEAN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a6ba6f93-5afc-44a8-b4d8-7fb445b68e7f",
//                       code: "HEALTH_MO_01_04_01_02_10_ZEAGBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3c2db241-24f8-42e5-8b5e-db456552bbd1",
//                       code: "HEALTH_MO_01_04_01_02_09_CHAYEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5097c4e4-1460-4466-9611-1e0afb569623",
//                       code: "HEALTH_MO_01_04_01_02_08_ZAMMIE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "21846564-b0a7-4f26-a06e-4b84b5d48a32",
//                       code: "HEALTH_MO_01_04_01_02_07_MADRA CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c9eb7701-a23c-47dc-a614-4a6a4a9babd2",
//                       code: "HEALTH_MO_01_04_01_02_06_ZARZAR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "396563ac-1c33-4dcd-9494-f0caa8ff0180",
//                       code: "HEALTH_MO_01_04_01_02_05_PANNEWEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "03c9cd02-5647-4fd0-a3dd-36558bfb864a",
//                       code: "HEALTH_MO_01_04_01_02_04_JERRY TIAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e84d894e-b76e-4051-943d-6e23045a4eee",
//                       code: "HEALTH_MO_01_04_01_02_03_GBARWU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "fd5d4b8e-5b5c-41db-9f32-ceaee8836705",
//                       code: "HEALTH_MO_01_04_01_02_02_LAWRENCE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cd1e8ca2-81d9-44a8-8253-84ed34add7d8",
//                       code: "HEALTH_MO_01_04_01_02_01_ABENEGO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "04fcfce4-f7ef-4c02-b0d2-2d0a7f8f59c0",
//                   code: "HEALTH_MO_01_04_01_01_DARLUE VILLAGE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "afad9b62-1b07-463b-8e00-fc4e086bd2f5",
//                       code: "HEALTH_MO_01_04_01_01_01_DARLUE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "5b6f1d55-115b-477c-a8a1-387ba3ef7f90",
//           code: "HEALTH_MO_01_03_KONOBO",
//           boundaryType: "District",
//           children: [
//             {
//               id: "870fd7ce-366a-4777-bdf3-fd8dc0730d2b",
//               code: "HEALTH_MO_01_03_02_KONOBO HEALTH CENTER",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "aaa8eeb7-f0d9-4310-bc1b-4112aa18b651",
//                   code: "HEALTH_MO_01_03_02_10_ZIAH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "1cf25daa-8f8c-49ef-aaae-6932358398ac",
//                       code: "HEALTH_MO_01_03_02_10_01_ZIAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "82979a7d-1679-4713-ade9-cbaae966b31f",
//                   code: "HEALTH_MO_01_03_02_09_DWEH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "e19bceb2-9c96-4603-96ce-c454dc81783e",
//                       code: "HEALTH_MO_01_03_02_09_11_DWEH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0c83a1a4-90e6-47c7-b5f1-1acd269fb6e0",
//                       code: "HEALTH_MO_01_03_02_09_10_QUAYE VILLAGE/ABUJAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "24a2c062-65ba-440e-806e-d41b519231b4",
//                       code: "HEALTH_MO_01_03_02_09_09_DOWAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e50efdf0-8bc1-4903-b3d7-82fa9d7c1c4b",
//                       code: "HEALTH_MO_01_03_02_09_08_BANGLOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0f0856ef-a9b9-4033-a5b7-2bb2e89bc1fa",
//                       code: "HEALTH_MO_01_03_02_09_07_WLABO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a6808dbd-06d1-4243-ac59-d80c8ffefe63",
//                       code: "HEALTH_MO_01_03_02_09_06_DEHJALLAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3e3d899-c56b-4b32-8d42-410e034640e2",
//                       code: "HEALTH_MO_01_03_02_09_05_DROUGLOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d451b640-2970-4ec4-baf0-ac7aef0ba21d",
//                       code: "HEALTH_MO_01_03_02_09_04_DELAYEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3c830d81-0fd4-4f7f-8113-7101d0fdf8ad",
//                       code: "HEALTH_MO_01_03_02_09_03_WHYBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cd0034cb-bf64-4044-99b2-78ef7af7d2bd",
//                       code: "HEALTH_MO_01_03_02_09_02_BUWAY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "66e1c7c4-891e-451e-b8fd-cf007e91f4e3",
//                       code: "HEALTH_MO_01_03_02_09_01_GLAYGEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "6aa2c64e-0127-4ee9-b364-12720a2a337d",
//                   code: "HEALTH_MO_01_03_02_08_BARWU TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "20d3195e-dba8-4b8e-84ee-f0971779d873",
//                       code: "HEALTH_MO_01_03_02_08_06_BARWU TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3865681-74e1-49ad-8d7f-764a4e2e68b7",
//                       code: "HEALTH_MO_01_03_02_08_05_GARGLOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "74baa5bf-f4b1-47b0-929e-a21a9fdb03d1",
//                       code: "HEALTH_MO_01_03_02_08_04_PEAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "350874a1-22df-4164-9cea-37f6345be6e0",
//                       code: "HEALTH_MO_01_03_02_08_03_DRUWAR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "412acac1-452f-4f1f-9202-552d2a28ceee",
//                       code: "HEALTH_MO_01_03_02_08_02_GBARWU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1e47a36c-e061-4f0e-86a2-a2a5b2922b8b",
//                       code: "HEALTH_MO_01_03_02_08_01_FLAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "9b8dc1e1-3186-4996-b5d1-65b6f9f7bd11",
//                   code: "HEALTH_MO_01_03_02_07_BILLIBO TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "da2089c9-7bd4-403e-9ff3-96f96b75bdec",
//                       code: "HEALTH_MO_01_03_02_07_03_BILLIBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c1eade2a-edf7-48ec-83da-b2cd61a7ad83",
//                       code: "HEALTH_MO_01_03_02_07_02_TWABO MISSION",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "3dbcfb5f-1657-44a6-8a2e-f488372a26e6",
//                       code: "HEALTH_MO_01_03_02_07_01_TWABO SAYUO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "23cc8756-90e2-4458-8896-fdf4b65f88f9",
//                   code: "HEALTH_MO_01_03_02_06_TARLOKEN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a4a46506-855f-4e23-835c-04f311e4cd95",
//                       code: "HEALTH_MO_01_03_02_06_06_TARLOKEN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "00ffff5c-1c5a-44a6-8e5e-1965b88a3f87",
//                       code: "HEALTH_MO_01_03_02_06_05_BAO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "83cfb5df-0140-4b64-8378-6cb79ce04348",
//                       code: "HEALTH_MO_01_03_02_06_04_CLOTELEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "56116f31-299c-4a17-b62e-01b185fa1d67",
//                       code: "HEALTH_MO_01_03_02_06_03_YEOH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "45e8d328-7dd9-4d74-ba26-eb3b20740d0a",
//                       code: "HEALTH_MO_01_03_02_06_02_GARLEO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d5b6689e-5551-4f39-98d8-b15079da595b",
//                       code: "HEALTH_MO_01_03_02_06_01_TEMPO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7902abc4-6e41-4ac5-a7ab-f84ab0d1d74a",
//                   code: "HEALTH_MO_01_03_02_05_KOA TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8ff31f40-c462-4031-a70b-428d18359e05",
//                       code: "HEALTH_MO_01_03_02_05_05_KOA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2dc0a63e-ca11-4d1b-a9c6-09b4da6abe5e",
//                       code: "HEALTH_MO_01_03_02_05_04_ZARR TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b1b544d2-8e0c-4d81-a763-73b78044cf58",
//                       code: "HEALTH_MO_01_03_02_05_03_GLAY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "22127806-2908-4a85-9428-96b5edd07bdc",
//                       code: "HEALTH_MO_01_03_02_05_02_PA-MOORE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dfb5cf51-6e60-416c-9a16-e248e572f469",
//                       code: "HEALTH_MO_01_03_02_05_01_ZD CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "ef446b88-98cc-492d-a505-556b2b4c1373",
//                   code: "HEALTH_MO_01_03_02_04_NEW CREEK TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "d1b6b14a-f8a5-430c-bf28-1f8da5da13f6",
//                       code: "HEALTH_MO_01_03_02_04_03_NEW CREEK TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ef1e0d48-ef7a-4ec0-935c-f19b98acec2e",
//                       code: "HEALTH_MO_01_03_02_04_02_SOLO CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "10caf6b4-5b9d-42aa-9428-cd4ee7d3eb30",
//                       code: "HEALTH_MO_01_03_02_04_01_TURNING POINT(CVI)",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "48215040-adf7-4efe-8ddb-b360201757c1",
//                   code: "HEALTH_MO_01_03_02_03_HEADQUARTER(CVI) COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "cdd762f4-c62b-4229-b4a5-48a0b2ed4267",
//                       code: "HEALTH_MO_01_03_02_03_03_HEADQUARTER (CIV) COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5f7dcdbc-7ebc-497f-b543-fd6813c88c17",
//                       code: "HEALTH_MO_01_03_02_03_02_BOLO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "de7810fb-fa92-4c82-9cb7-05c1e8f24f71",
//                       code: "HEALTH_MO_01_03_02_03_01_BELLAYELLAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7cd1112d-dcfc-4891-8a5b-6b9e1602e900",
//                   code: "HEALTH_MO_01_03_02_02_BARLIKEN TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "af0e5626-a974-491a-9986-1bb2ecadd130",
//                       code: "HEALTH_MO_01_03_02_02_01_BARLIKEN TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7c10d93c-72c3-4183-aa20-10764157ba2a",
//                   code: "HEALTH_MO_01_03_02_01_AMERICA TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "06146b39-f64f-4bf8-8a12-f647270d6716",
//                       code: "HEALTH_MO_01_03_02_01_04_AMERICA TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c606b620-8d1a-4eb4-905b-fed6c9598df0",
//                       code: "HEALTH_MO_01_03_02_01_03_JAMICA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3392775-f2eb-4292-bb47-8fd1ff23401a",
//                       code: "HEALTH_MO_01_03_02_01_02_NYONGBA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f6b09c16-88f9-4274-a975-2f1f0ac80a2d",
//                       code: "HEALTH_MO_01_03_02_01_01_TWABO DEHJELLAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "d5518302-cfec-4057-9376-ebcd1b51c3c9",
//               code: "HEALTH_MO_01_03_01_BOUNDARY CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "41ce5ec3-714a-49a3-b17a-dc6907e774d5",
//                   code: "HEALTH_MO_01_03_01_03_BOUNDARY-2",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "36b5538f-deb4-4ed4-88c7-c83d05219ef4",
//                       code: "HEALTH_MO_01_03_01_03_11_BOUNDARY- 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7936d631-7cad-4ad6-9a23-813fd4af397f",
//                       code: "HEALTH_MO_01_03_01_03_10_BOUNDARY-1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "967aced0-4949-4f2e-a4d5-173e2b41fd49",
//                       code: "HEALTH_MO_01_03_01_03_09_SINNTRODRU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1e7c9c17-40f1-47bc-9346-277376f0d64c",
//                       code: "HEALTH_MO_01_03_01_03_08_YALLAH VALLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ad70bee3-2273-4c95-aca9-39138c90acda",
//                       code: "HEALTH_MO_01_03_01_03_07_GARYEKOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8136e024-fbb2-4f11-b10f-f884f30c50b0",
//                       code: "HEALTH_MO_01_03_01_03_06_DWEH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8aaf8e59-6798-4072-b2f6-004943734d8e",
//                       code: "HEALTH_MO_01_03_01_03_05_TORH VALLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "698afe88-48b6-4e32-a4fe-faee779b0764",
//                       code: "HEALTH_MO_01_03_01_03_04_YENNEH VALLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9060ede4-525f-4a1b-bddc-4e9d25c90de0",
//                       code: "HEALTH_MO_01_03_01_03_03_PETER VALLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ebc98fad-8612-4051-92ae-51b71fceddb5",
//                       code: "HEALTH_MO_01_03_01_03_02_BROWN VALLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c950fcf0-686e-4d34-a531-0979f2ccb2b0",
//                       code: "HEALTH_MO_01_03_01_03_01_DELAYEE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "5797193d-0dc3-4a85-8fbe-2c3145b4b53d",
//                   code: "HEALTH_MO_01_03_01_02_KOTOMIE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "637651b6-b774-4dcb-a569-92262a98d907",
//                       code: "HEALTH_MO_01_03_01_02_03_KOTOMIE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6de3ff42-fcdb-44ca-b420-8f6b42374669",
//                       code: "HEALTH_MO_01_03_01_02_02_CHEA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f04df098-9a29-4dcb-b9f8-b9ca2b5ea315",
//                       code: "HEALTH_MO_01_03_01_02_01_KONOBO SAYUO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "479f1b2d-f653-4e4e-bb70-ebdae3a4230d",
//                   code: "HEALTH_MO_01_03_01_01_WULU TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "194c479c-ad37-490d-9ac8-c1c80c5ca90e",
//                       code: "HEALTH_MO_01_03_01_01_03_WULU TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "56fce8eb-1784-4625-8770-1e0e0914d0a4",
//                       code: "HEALTH_MO_01_03_01_01_02_TUGLOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "02a10673-5704-4800-b031-fbda6db1467e",
//                       code: "HEALTH_MO_01_03_01_01_01_VARGLOR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "c875b9de-9300-4c73-9604-dc6c473e3f4c",
//           code: "HEALTH_MO_01_02_PUTU",
//           boundaryType: "District",
//           children: [
//             {
//               id: "559aec58-83c2-4e0b-a5b4-b2b60c3012c7",
//               code: "HEALTH_MO_01_02_02_JARWODEE CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "b3338872-7917-4d1c-9828-7ced861689ea",
//                   code: "HEALTH_MO_01_02_02_02_JARWODEE TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "36f6953e-2cb1-4565-9b47-104b59ab9efb",
//                       code: "HEALTH_MO_01_02_02_02_06_JARWODEE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0863b6cb-9625-45d7-804d-abc34fc32d85",
//                       code: "HEALTH_MO_01_02_02_02_05_KEHTOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d2becbf1-0785-481b-8e9e-782e736c5f03",
//                       code: "HEALTH_MO_01_02_02_02_04_SEOH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e563dff7-50c4-4b1d-8fc5-c7855c101434",
//                       code: "HEALTH_MO_01_02_02_02_03_NEW TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f1d17e88-b292-4210-9593-28617d20c27a",
//                       code: "HEALTH_MO_01_02_02_02_02_TWEH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0fa753a5-412e-4509-ae75-d76f09e15845",
//                       code: "HEALTH_MO_01_02_02_02_01_ZONDEH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "eacfc4c5-98e4-47f2-94e3-2a42e6dd7816",
//                   code: "HEALTH_MO_01_02_02_01_WHITEMAN CAMP",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "cb0caaf8-d27a-4796-83d3-b90c21c95bd7",
//                       code: "HEALTH_MO_01_02_02_01_11_CENTRAL DOUGBE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "92e7ce8a-4013-4445-b971-ac8955a5f9c0",
//                       code: "HEALTH_MO_01_02_02_01_10_DOWN DOUUGBE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f9c1370b-7185-40ac-83a6-c4a4030e476f",
//                       code: "HEALTH_MO_01_02_02_01_09_WHITEMAN CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "765e6d88-d9f6-4b7f-afe2-bc257c2de263",
//                       code: "HEALTH_MO_01_02_02_01_08_SAYLEE PYNE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aeb20e2d-0f8e-4cac-b6f2-74e1c4faba29",
//                       code: "HEALTH_MO_01_02_02_01_07_JARGBAH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7edc9c59-95d4-4328-8612-1fde49e2845d",
//                       code: "HEALTH_MO_01_02_02_01_06_TUGBA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bae796f6-a64c-4776-8aac-649d18450aba",
//                       code: "HEALTH_MO_01_02_02_01_05_WATER VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "552046d4-8430-49e7-8a69-56f3376ff761",
//                       code: "HEALTH_MO_01_02_02_01_04_ABLEE CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5f662a27-5356-4626-9c87-74c73d129f87",
//                       code: "HEALTH_MO_01_02_02_01_03_CEMENCO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "01bfe3bc-33fd-4059-94a2-ee7f98761863",
//                       code: "HEALTH_MO_01_02_02_01_02_GBARYEA",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "994bb679-064b-4e10-b896-9383a053fca3",
//                       code: "HEALTH_MO_01_02_02_01_01_SLAGBALEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "ec10f66e-a9ec-49d9-b140-2981cb6c6081",
//               code: "HEALTH_MO_01_02_01_PENNOKON",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "7610c8bd-7c9a-433f-bedb-bef124120f6a",
//                   code: "HEALTH_MO_01_02_01_02_PENNOKON TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "f9cc7fd3-ae99-4114-922c-73249c84beb1",
//                       code: "HEALTH_MO_01_02_01_02_07_PENNOKON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7e99cc18-1243-4414-b0e5-67c75c725ea6",
//                       code: "HEALTH_MO_01_02_01_02_06_GEEBLO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "51d4f741-7611-462a-822c-9abc733f1f03",
//                       code: "HEALTH_MO_01_02_01_02_05_PANWLOH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d63589bc-ff05-40d2-b1bd-9eddafd41226",
//                       code: "HEALTH_MO_01_02_01_02_04_PETROKON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6499444e-1612-4117-82ba-dcdcc4f57475",
//                       code: "HEALTH_MO_01_02_01_02_03_BOLEY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e6c44a5c-341d-48a8-b171-2b98638cfde9",
//                       code: "HEALTH_MO_01_02_01_02_02_GBEJOLOBO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "def53a22-9257-483b-808a-993cf7a8ceb7",
//                       code: "HEALTH_MO_01_02_01_02_01_FARLEY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "9681d317-f3e7-4671-a165-0c158ca92528",
//                   code: "HEALTH_MO_01_02_01_01_KARLOWLEH",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "cf9fa775-808c-4dd4-a10b-00cb3944b2bc",
//                       code: "HEALTH_MO_01_02_01_01_07_KARLOWLEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4fdbaa0e-37f9-4ab4-aaf0-031a9778694a",
//                       code: "HEALTH_MO_01_02_01_01_06_DUO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "22876a43-685a-482e-b671-223271fd19c6",
//                       code: "HEALTH_MO_01_02_01_01_05_JOHN DAVIS TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "88a3d1c1-e029-433b-888a-15fc853ae86b",
//                       code: "HEALTH_MO_01_02_01_01_04_WREGBALEH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6aaf5d91-1e87-49b8-b133-f7ce7bfb8ec6",
//                       code: "HEALTH_MO_01_02_01_01_03_JARWLEH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "596c19e3-23e5-4caa-bbe9-0972817fd95e",
//                       code: "HEALTH_MO_01_02_01_01_02_POLO",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "47da336a-e9f2-4aec-ab7a-3a2db3bc0114",
//                       code: "HEALTH_MO_01_02_01_01_01_DOUBLE BRIDGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "f318ed73-c143-48bb-a7cb-3eaeb56702ff",
//           code: "HEALTH_MO_01_01_TCHIEN",
//           boundaryType: "District",
//           children: [
//             {
//               id: "e67570a6-5b38-4a19-a01a-5e328d3534a6",
//               code: "HEALTH_MO_01_01_04_MARTHA TUBMAN MEMORIAL HOSPITAL",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "f74764b1-f617-4c48-ba37-67d0eb487fc1",
//                   code: "HEALTH_MO_01_01_04_04_NAO COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "ab892b07-567e-4d30-bfc5-659ae0bcb408",
//                       code: "HEALTH_MO_01_01_04_04_09_BOWEN QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f065ffc7-5122-43c2-894b-0013df7f8ded",
//                       code: "HEALTH_MO_01_01_04_04_08_GBOE QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "98281370-d367-48b4-bc2a-35b0a72c38d3",
//                       code: "HEALTH_MO_01_01_04_04_07_KYNE QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "129b9c70-fbeb-47c9-8fed-b5870680e948",
//                       code: "HEALTH_MO_01_01_04_04_06_ZANBO QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "15ca57d5-edb0-48c2-bf54-52e4fa714e7f",
//                       code: "HEALTH_MO_01_01_04_04_05_MANDINGO QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "29da5cdd-4924-4423-9ef2-3483641bfc5c",
//                       code: "HEALTH_MO_01_01_04_04_04_ELRZ COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7a1fd500-d57e-42fa-9fa2-30f086a76105",
//                       code: "HEALTH_MO_01_01_04_04_03_GBAGBAVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f4f3df32-4b7b-4ac2-8261-0a48b0b52d86",
//                       code: "HEALTH_MO_01_01_04_04_02_KPASUAH HILL",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ea1af4d0-521e-4538-80ee-fd33fcbac33b",
//                       code: "HEALTH_MO_01_01_04_04_01_NAO COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "7f91df24-1584-467f-b0d8-8e8fba86fbec",
//                   code: "HEALTH_MO_01_01_04_03_TRIANGLE COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8b2a9fc7-b99c-4dc6-a617-f0cd26cc2a0d",
//                       code: "HEALTH_MO_01_01_04_03_12_A.G. COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "677cbb40-6675-4834-a920-6872372cac1d",
//                       code: "HEALTH_MO_01_01_04_03_11_TOWAH COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2fe27b27-6416-4735-92f2-75e15aebea68",
//                       code: "HEALTH_MO_01_01_04_03_10_BAPTIST COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f650fd14-e5c7-4582-8c33-eb5ce824d979",
//                       code: "HEALTH_MO_01_01_04_03_09_SPS COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2377730a-47a8-4581-becb-9a14d2616602",
//                       code: "HEALTH_MO_01_01_04_03_08_TRIANGLE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bf91bf9c-9b96-4d41-aabf-400bbaf86459",
//                       code: "HEALTH_MO_01_01_04_03_07_WELBO QUARTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2ff1e687-8601-455f-83f8-6eae15f1d1e7",
//                       code: "HEALTH_MO_01_01_04_03_06_CITY HALL COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "47d18964-a260-48e4-9364-dc9b68cbb76d",
//                       code: "HEALTH_MO_01_01_04_03_05_ZOE BUSH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7fd16827-ddf6-484c-8744-c2dce33b5388",
//                       code: "HEALTH_MO_01_01_04_03_04_ZWEDRU CENTRAL MARKET",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6adfdafc-eb39-4797-988b-0aacc9da137b",
//                       code: "HEALTH_MO_01_01_04_03_03_KANNAH ROAD COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f5faa63-2df2-4c9f-9d48-ed34a9b3bdbc",
//                       code: "HEALTH_MO_01_01_04_03_02_SUAH COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "8b87e371-8f50-487c-a08c-86fd4b2a2ba1",
//                       code: "HEALTH_MO_01_01_04_03_01_GARLOVILLE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "881cbaf8-2f71-4d5c-a160-3ac0868cd740",
//                   code: "HEALTH_MO_01_01_04_02_TODDY VILLE",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "a9ec3b9c-4a2b-4f59-876b-1a65669521f3",
//                       code: "HEALTH_MO_01_01_04_02_12_BARLAVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a691227b-84f2-4d79-8b86-cae32c067014",
//                       code: "HEALTH_MO_01_01_04_02_11_CHEAYEEVILLEDOUYE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "58bec788-7542-49d2-bd06-3a9de55513ea",
//                       code: "HEALTH_MO_01_01_04_02_10_FDA COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1a384207-b9d8-438f-ad14-8162d98b9e55",
//                       code: "HEALTH_MO_01_01_04_02_09_GORBO COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "18d179ea-2717-4132-9ea6-cd8a6a2fe792",
//                       code: "HEALTH_MO_01_01_04_02_08_KRAHVILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c5bf540a-ec08-4358-8c20-92df617c1f6a",
//                       code: "HEALTH_MO_01_01_04_02_07_PENNUE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "94845191-5871-46ef-a304-10417d911a38",
//                       code: "HEALTH_MO_01_01_04_02_06_TODDY VILLE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a12962ca-bd6a-4a61-8e89-4a55d2f71020",
//                       code: "HEALTH_MO_01_01_04_02_05_JENSON VILLE 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1a01b6c2-e0e8-413e-9c79-b75a13f6e76a",
//                       code: "HEALTH_MO_01_01_04_02_04_BLESSING HILL COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "83ade96b-76aa-4e3b-9a75-095cc2fb9d2b",
//                       code: "HEALTH_MO_01_01_04_02_03_CANTOMENT SITE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "37925758-905c-43f9-bdc7-7b5462220e2a",
//                       code: "HEALTH_MO_01_01_04_02_02_DOUYEE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "922b0131-b922-41b6-962f-47d2fc9ec0dc",
//                       code: "HEALTH_MO_01_01_04_02_01_JENSON VILLE 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "402bddd1-68e6-454e-adaf-bc8ef15b6fe3",
//                   code: "HEALTH_MO_01_01_04_01_ZMHS COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "c8c2648f-b1b7-45b5-a478-08e9d37bced6",
//                       code: "HEALTH_MO_01_01_04_01_18_ZMHS COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f39bb5a-09cd-42dd-979e-65118856cc5b",
//                       code: "HEALTH_MO_01_01_04_01_17_PEACE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1268d589-248d-4587-bebc-f0b22c69833c",
//                       code: "HEALTH_MO_01_01_04_01_16_BROWN SAYEE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ac999a48-af2e-45a2-9e38-1c57e96444a6",
//                       code: "HEALTH_MO_01_01_04_01_15_BOLEYVILLE 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "77631b8d-919a-4f1a-85f2-95ae84e8ad19",
//                       code: "HEALTH_MO_01_01_04_01_14_WORD SOWER COMMUINTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "06998a6b-3c08-4916-9e55-aa17c74c20d0",
//                       code: "HEALTH_MO_01_01_04_01_13_EDUCATION COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4e1423e4-3e21-4754-af93-b5abd6da21e2",
//                       code: "HEALTH_MO_01_01_04_01_12_MAP OFFICE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d25930d7-df59-4df0-a52e-36430f69c89f",
//                       code: "HEALTH_MO_01_01_04_01_11_AGRICULTURE COMMUINTY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "304dd473-cf66-4b6d-bda4-094e8ae4f088",
//                       code: "HEALTH_MO_01_01_04_01_10_CARR CENTER",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "33b25917-d08e-4e1f-a0e2-d125d659d10f",
//                       code: "HEALTH_MO_01_01_04_01_09_PINEAPPLE VILLAGE ROAD",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f5e6eecd-f5b6-4d82-84f1-74e15d276495",
//                       code: "HEALTH_MO_01_01_04_01_08_SINOE ROAD MARKET COMM.",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ec93fd60-3254-4d03-8f3d-7929ea40b169",
//                       code: "HEALTH_MO_01_01_04_01_07_BOLYVILLE 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "f3635671-70ac-44c0-8e4c-148cd73b5180",
//                       code: "HEALTH_MO_01_01_04_01_06_DISCO HILL",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7461d5d9-a849-4437-aab1-31c89efdac7a",
//                       code: "HEALTH_MO_01_01_04_01_05_NEW ZWEDRU",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "50643036-e52b-4753-88e2-39a2ad703569",
//                       code: "HEALTH_MO_01_01_04_01_04_AIR FIELD COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "dbefef7e-3a8c-4a90-89fa-0ed34e27bf6d",
//                       code: "HEALTH_MO_01_01_04_01_03_BLUE CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "acd0d6e8-88ae-4619-b0a7-7815630321bd",
//                       code: "HEALTH_MO_01_01_04_01_02_GUNNIE COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9dbc80c9-a196-4d97-a7fc-be151f6d87ae",
//                       code: "HEALTH_MO_01_01_04_01_01_CATHOLIC COMPOUND",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "45182d22-5c83-4bf7-bc51-cae7cd199410",
//               code: "HEALTH_MO_01_01_03_GORBOWRAGBA",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "0eeb1253-e1b0-4a1d-b4e8-6850bb6015f6",
//                   code: "HEALTH_MO_01_01_03_02_GORBOWRAGBA COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "921394db-d4f7-43f6-a4c2-8ebcea2c7a65",
//                       code: "HEALTH_MO_01_01_03_02_16_GORBOWRAGBA COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bd705cde-d526-45de-8b29-9b5e7f4e8efb",
//                       code: "HEALTH_MO_01_01_03_02_15_KYNE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b5ac85d6-e4a4-439c-8d90-a0395a33974a",
//                       code: "HEALTH_MO_01_01_03_02_14_SLOMEN CAMP 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "44cc68ad-8b02-4ffa-8875-f329a9b961ae",
//                       code: "HEALTH_MO_01_01_03_02_13_SLOMEN CAMP 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "87046354-3ee3-4d63-b1a3-1e49176c5633",
//                       code: "HEALTH_MO_01_01_03_02_12_GBORLUE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "35c8b36e-4f84-4da2-bdfd-1d1eb5f95dd0",
//                       code: "HEALTH_MO_01_01_03_02_11_CAVALLAH CAMP 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "44410ee7-6f87-40e9-ae3d-37ffc279f0d3",
//                       code: "HEALTH_MO_01_01_03_02_10_CAVALLAH CAMP 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0029a5fe-3313-4b93-b0fb-eeeccff9d419",
//                       code: "HEALTH_MO_01_01_03_02_09_JACOB GAYE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "d05cbcf8-a5b5-4467-a5ef-79a812e3a059",
//                       code: "HEALTH_MO_01_01_03_02_08_JAMES GAYWAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "037b60b9-1a66-4395-969a-0c9b516b908e",
//                       code: "HEALTH_MO_01_01_03_02_07_KARDAFFII VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a157c27a-28f5-4e45-aa7a-cbbc65a1cca1",
//                       code: "HEALTH_MO_01_01_03_02_06_LIFE CAN CHANGE GOLD CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7ca5f5e0-70cf-4569-8df4-a5f81052a67c",
//                       code: "HEALTH_MO_01_01_03_02_05_YOLNY VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ffd88ed1-b00e-44e6-9aa2-fae190480a6c",
//                       code: "HEALTH_MO_01_01_03_02_04_ZINC VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "92d22ad6-cb74-4d3a-8bf5-916457657679",
//                       code: "HEALTH_MO_01_01_03_02_03_JARDEIAH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "637d680b-3d5b-4642-8053-6d2ab50e303e",
//                       code: "HEALTH_MO_01_01_03_02_02_GREAT VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cd2c3d84-e7f0-4c1f-ae7d-7a1788b13bda",
//                       code: "HEALTH_MO_01_01_03_02_01_AMARA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "81d3406d-9c5a-41e8-9fb1-25bf282c526b",
//                   code: "HEALTH_MO_01_01_03_01_KUMAH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "6711d4dd-5cf8-4bbd-882d-44b81ee59b32",
//                       code: "HEALTH_MO_01_01_03_01_13_TCHIEN POLAR",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1f8431ab-490c-4c7b-be43-f24fb14aab23",
//                       code: "HEALTH_MO_01_01_03_01_12_JARBAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2b2dcd30-68a2-4ad2-bcb2-28d601219e8c",
//                       code: "HEALTH_MO_01_01_03_01_11_PELLEZON",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "15bba6d4-e59b-49a5-90b1-984991367ed2",
//                       code: "HEALTH_MO_01_01_03_01_10_TETE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "aed0a359-482c-4642-85c8-b2228ee34550",
//                       code: "HEALTH_MO_01_01_03_01_09_GBARBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "904fefe3-7853-4fa3-b2b7-07a6ec998d17",
//                       code: "HEALTH_MO_01_01_03_01_08_JAIBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c4915840-c93d-48fd-91da-a0f63716d8e7",
//                       code: "HEALTH_MO_01_01_03_01_07_ZAYBAY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4b5bce49-aa7e-47fd-b478-41c8800862fc",
//                       code: "HEALTH_MO_01_01_03_01_06_KUMAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0a26a6f2-21f8-48b0-a452-dd35df4f8368",
//                       code: "HEALTH_MO_01_01_03_01_05_PENNUE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "20a734ec-876d-4851-82d1-86b12019405b",
//                       code: "HEALTH_MO_01_01_03_01_04_BASSA VILLAGE-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "58696a5b-8bd0-40ba-9085-ddc9d120aba5",
//                       code: "HEALTH_MO_01_01_03_01_03_ALPHONSO GAYE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9d073e5b-d0f2-45e0-9d66-41e5adfd89dc",
//                       code: "HEALTH_MO_01_01_03_01_02_JELLUE TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "99979f56-d472-4f4b-b519-d062cee8c956",
//                       code: "HEALTH_MO_01_01_03_01_01_VICTORIAL VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "c0a2891d-cf05-412c-b548-be2755a9c20f",
//               code: "HEALTH_MO_01_01_02_KANNEH COMMUNITY CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "33c0b7b5-925b-4787-8eac-c8d02fa8cb20",
//                   code: "HEALTH_MO_01_01_02_02_KANNEH COMMUNITY",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "40fdcbb1-2fe8-4941-ba6c-631761d916e5",
//                       code: "HEALTH_MO_01_01_02_02_19_ANTHONY VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "2f164b28-0555-4f47-982d-5a2466b0cfc1",
//                       code: "HEALTH_MO_01_01_02_02_18_KANNEH COMMUNITY",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "91a37440-dfe0-4fcb-afcf-ca9980d99e68",
//                       code: "HEALTH_MO_01_01_02_02_17_THOMAS VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "c302132c-e607-45bf-ab81-f9570ecda361",
//                       code: "HEALTH_MO_01_01_02_02_16_DAKPENAL VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "85f1f60b-f0bc-410b-b983-f224f12fd9d6",
//                       code: "HEALTH_MO_01_01_02_02_15_ERIC VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "30e5a93b-9728-44b8-9b8b-71a8292887ce",
//                       code: "HEALTH_MO_01_01_02_02_14_MORTOR VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "84facf07-9a8f-487a-b05a-8e89a0335e89",
//                       code: "HEALTH_MO_01_01_02_02_13_DWEH VILLAGE-01",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a81e6cc1-3923-4678-9929-814f6893996b",
//                       code: "HEALTH_MO_01_01_02_02_12_PA-MOORE VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ce66dabc-5059-4276-a535-a5e4076bd078",
//                       code: "HEALTH_MO_01_01_02_02_11_POWPOW VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "60da866d-535a-4767-ac6c-24f21ca8bd52",
//                       code: "HEALTH_MO_01_01_02_02_10_BODUO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5d87b5b5-1e29-457b-b574-6dbb299aae26",
//                       code: "HEALTH_MO_01_01_02_02_09_GBABO VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0a52deb9-6260-4d40-a514-d5ba350b975c",
//                       code: "HEALTH_MO_01_01_02_02_08_PALMMAD VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0abe3201-22a1-4ea6-ab21-dfeb6c00a0c7",
//                       code: "HEALTH_MO_01_01_02_02_07_DARK FOREST VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ea4053c7-4861-48b8-9f7f-c5e301a076e8",
//                       code: "HEALTH_MO_01_01_02_02_06_KPELLEH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "65f703b3-0cce-4c1c-9039-c73f55ce2ff1",
//                       code: "HEALTH_MO_01_01_02_02_05_GEE DWEH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "e621fa84-31e5-4642-be8f-cb482dc96718",
//                       code: "HEALTH_MO_01_01_02_02_04_SAYUO JUNCTION VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "6623b91c-8bde-4a24-9aa8-4d64b0b60ca4",
//                       code: "HEALTH_MO_01_01_02_02_03_P.T.P. CAMP 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1b8ad0fd-57cc-4898-b554-fd6a2e919b72",
//                       code: "HEALTH_MO_01_01_02_02_02_PAPAYE CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4c0aa1ac-6bdf-4468-9cd8-bea87f5867a2",
//                       code: "HEALTH_MO_01_01_02_02_01_P.T.P. CAMP 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: "1c0aa1b4-e7f0-451b-b5ba-e2fef0083559",
//                   code: "HEALTH_MO_01_01_02_01_SAYUOH TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "8d60d855-d1ad-4c62-8700-9ff25857c355",
//                       code: "HEALTH_MO_01_01_02_01_13_BENDLY CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "cdd13124-887d-463e-8277-e6668b8d420b",
//                       code: "HEALTH_MO_01_01_02_01_12_GOLO CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "88aa3b3f-7a4b-4846-9889-5c94e184b759",
//                       code: "HEALTH_MO_01_01_02_01_11_WULU VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "7f1c2674-0668-446a-86ca-b6ad11305ea0",
//                       code: "HEALTH_MO_01_01_02_01_10_JEMECA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ee03602d-cda3-44d4-8bfd-028de334822a",
//                       code: "HEALTH_MO_01_01_02_01_09_TAILEY VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "0c9233db-7d26-4dcc-9b23-2aee100c3291",
//                       code: "HEALTH_MO_01_01_02_01_08_BANA VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "014ba1c7-d64e-4762-9846-04989efff915",
//                       code: "HEALTH_MO_01_01_02_01_07_SAYUOH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "61dcb6de-b3a7-4d44-bc8b-28be2c30ddc4",
//                       code: "HEALTH_MO_01_01_02_01_06_KALLAH VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "1708b6e1-2b0b-466e-9fb6-afcc2e1a7230",
//                       code: "HEALTH_MO_01_01_02_01_05_MISSIN VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ee68d257-b2bd-40d5-817b-1c6371b0169f",
//                       code: "HEALTH_MO_01_01_02_01_04_DORBOR VILLAGE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ca03ca8a-9e77-4ad3-bdf7-abc747bab837",
//                       code: "HEALTH_MO_01_01_02_01_03_CHECKPOINT",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "b61f9619-aa16-4f0b-8406-f9fc96b728e0",
//                       code: "HEALTH_MO_01_01_02_01_02_BENTOR CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "ae6aebaa-5401-478a-955e-353469828c68",
//                       code: "HEALTH_MO_01_01_02_01_01_GHANA GOLD CAMP",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: "4601f6d0-ee64-4aff-ba32-b2943443ddda",
//               code: "HEALTH_MO_01_01_01_TOFFOI CLINIC",
//               boundaryType: "Post Administrative",
//               children: [
//                 {
//                   id: "c7e5c9b0-c14f-4c08-8c45-25c8bd2dc365",
//                   code: "HEALTH_MO_01_01_01_01_TOFFOI TOWN",
//                   boundaryType: "Locality",
//                   children: [
//                     {
//                       id: "17467b9b-2a3e-4eee-bd34-38134397869a",
//                       code: "HEALTH_MO_01_01_01_01_11_GBEYOUBO TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "5441b97f-e060-400d-a8c6-4d66ee765825",
//                       code: "HEALTH_MO_01_01_01_01_10_JELLU TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "81f1dce6-86d9-435c-aff0-c75b08b38d4c",
//                       code: "HEALTH_MO_01_01_01_01_09_TOFFOI TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "a4483158-1837-4fd8-b4e8-a76a91bb390a",
//                       code: "HEALTH_MO_01_01_01_01_08_BEEZON TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "99593069-d267-43e5-8da3-d0bd09bec34a",
//                       code: "HEALTH_MO_01_01_01_01_07_MANYEAH",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "4cc976bd-5863-430d-935f-4e1f5aae16d0",
//                       code: "HEALTH_MO_01_01_01_01_06_KRAH TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "9d4134aa-4fcb-4f8f-ba37-26cd62a4c669",
//                       code: "HEALTH_MO_01_01_01_01_05_YOUBOR TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "171136dc-b41d-4ef2-9ecf-750ed45cbd8e",
//                       code: "HEALTH_MO_01_01_01_01_04_BAWAY TOWN",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "db8950e7-002e-454e-9639-fbf12ed1956a",
//                       code: "HEALTH_MO_01_01_01_01_03_CORRECTION PALACE",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "bb34d12b-86c3-4db3-8952-e2765ff34be3",
//                       code: "HEALTH_MO_01_01_01_01_02_GREBO VILLAGE 1",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                     {
//                       id: "afc0c160-2518-4551-92b4-7b7e9b5174ba",
//                       code: "HEALTH_MO_01_01_01_01_01_GREBO VILLAGE 2",
//                       boundaryType: "Village",
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const hierarchy = [
//   {
//     boundaryType: "Country",
//     parentBoundaryType: null,
//     active: true,
//   },
//   {
//     boundaryType: "Province",
//     parentBoundaryType: "Country",
//     active: true,
//   },
//   {
//     boundaryType: "District",
//     parentBoundaryType: "Province",
//     active: true,
//   },
//   {
//     boundaryType: "Post Administrative",
//     parentBoundaryType: "District",
//     active: true,
//   },
//   {
//     boundaryType: "Locality",
//     parentBoundaryType: "Post Administrative",
//     active: true,
//   },
//   {
//     boundaryType: "Village",
//     parentBoundaryType: "Locality",
//     active: true,
//   },
// ];

// const hierarchyType = "Health";

// const lowest = "Post Administrative";

const isMultiSelect = true;

// const frozenData = [
//   {
//     code: "mz",
//     name: "HEALTH_MO",
//     boundaryType: "Country",
//   },
//   {
//     code: "Mozambique.Nampula",
//     name: "HEALTH_MO_13_NAMPULA",
//     boundaryType: "Province",
//   },
//   {
//     code: "Mozambique.Cabo",
//     name: "HEALTH_MO_12_CABO",
//     boundaryType: "Province",
//   },
//   {
//     code: "Nampula.Mossurilee",
//     name: "HEALTH_MO_13_02_MOSSURILEE",
//     boundaryType: "District",
//   },
//   {
//     code: "Nampula.Murrupula",
//     name: "HEALTH_MO_13_01_MURRUPULA",
//     boundaryType: "District",
//   },
//   {
//     code: "Cabo.Cabo Delgado",
//     name: "HEALTH_MO_12_01_CABO DELGADO",
//     boundaryType: "District",
//   },
//   {
//     code: "Mossurilee.Chitima-01",
//     name: "HEALTH_MO_13_02_02_CHITIMA-01",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Mossurilee.Nsadzo",
//     name: "HEALTH_MO_13_02_01_NSADZO",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Nihessiue",
//     name: "HEALTH_MO_13_01_04_NIHESSIUE",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Chiteeima",
//     name: "HEALTH_MO_13_01_03_CHITEEIMA",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Chifunde-01",
//     name: "HEALTH_MO_13_01_02_CHIFUNDE-01",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Murrupula.Mualdzi",
//     name: "HEALTH_MO_13_01_01_MUALDZI",
//     boundaryType: "Post Administrative",
//   },
//   {
//     code: "Cabo Delgado.Pemba",
//     name: "HEALTH_MO_12_01_01_PEMBA",
//     boundaryType: "Post Administrative",
//   },
// ];

// const frozenType = "";
const Wrapper = ({ hierarchyType, lowest, frozenData, frozenType, selectedData, onSelect, boundaryOptions , updateBoundary ,hierarchyData}) => {
  return (
    <SelectingBoundaryComponent
      onSelect={onSelect}
      hierarchyType={hierarchyType}
      lowest={lowest}
      frozenData={frozenData}
      frozenType={frozenType}
      selectedData1={selectedData}
      boundaryOptionsPage={boundaryOptions}
      updateBoundary = {updateBoundary}
      data = {hierarchyData}
    ></SelectingBoundaryComponent>
  );
};

const SelectingBoundaryComponent = ({ onSelect, hierarchyType, lowest, frozenData, frozenType, selectedData1, boundaryOptionsPage , updateBoundary  , data}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  // const [boundaryOptions, setBoundaryOptions] = useState({ Country: { HEALTH_MO: "mz" } });
  const [boundaryOptions, setBoundaryOptions] = useState(boundaryOptionsPage);
  const [selectedData, setSelectedData] = useState(selectedData1);
  const [showPopUp, setShowPopUp] = useState(false);
  const timerRef = useRef(null);
  const [restrictSelection, setRestrictSelection] = useState(null);

  useEffect(() => {
    setSelectedData(selectedData1);
  }, [selectedData1]);

  useEffect(() => {
    setBoundaryOptions(boundaryOptionsPage);
  }, [boundaryOptionsPage]);

  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: hierarchyType,
      },
    },
  };

  const { isLoading: hierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);


  function processData(data, parentPath = "", lowestBoundaryType) {
    const result = {};

    const currentPath = parentPath ? `${data?.code}.${parentPath}` : data?.code;

    result[data?.boundaryType] = result[data?.boundaryType] || {};
    result[data?.boundaryType][data?.code] = parentPath || "mz";

    if (data?.boundaryType === lowestBoundaryType) {
      return result;
    }

    // If the current node has children, process them recursively
    if (data?.children && data?.children.length > 0) {
      data?.children.forEach((child) => {
        const childResult = processData(child, currentPath, lowestBoundaryType);
        Object.keys(childResult).forEach((key) => {
          result[key] = {
            ...result[key],
            ...childResult[key],
          };
        });
      });
    }
    return result;
  }

  const boundaryData = processData(data?.[0], "", lowest);

  function createHierarchyStructure(hierarchy) {
    const hierarchyStructure = {};

    // Recursive function to gather all descendants for a given boundary type
    function gatherDescendants(boundaryType) {
      const descendants = [];

      // Find all children for the current boundary type
      const children = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.filter((item) => item?.parentBoundaryType === boundaryType);

      // Recursively gather descendants for each child
      children.forEach((child) => {
        const childBoundaryType = child?.boundaryType;
        const childDescendants = gatherDescendants(childBoundaryType);
        descendants.push(childBoundaryType, ...childDescendants);
      });

      return descendants;
    }

    // Iterate through the boundaryHierarchy array to populate hierarchyStructure
    hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.forEach((item) => {
      const boundaryType = item?.boundaryType;
      const descendants = gatherDescendants(boundaryType);

      hierarchyStructure[boundaryType] = descendants;
    });
    return hierarchyStructure;
  }

  function handleBoundaryChange(data, boundary) {
    if (
      !updateBoundary &&
      restrictSelection &&
      (props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0)
    ) {
      setShowPopUp(true);
      return;
    }
    if (!data || data.length === 0) {
      const structure = createHierarchyStructure(hierarchy);
      const check = structure?.[boundary.boundaryType];

      if (check) {
        const typesToRemove = [boundary?.boundaryType, ...check];
        const updatedSelectedData = selectedData?.filter((item) => !typesToRemove?.includes(item?.type));
        const updatedBoundaryData = { ...boundaryOptions };
        typesToRemove.forEach((type) => {
          if (type !== boundary?.boundaryType && updatedBoundaryData?.hasOwnProperty(type)) {
            updatedBoundaryData[type] = {};
          }
        });
        if (!_.isEqual(selectedData, updatedSelectedData)) {
          setSelectedData(updatedSelectedData);
        }
        setBoundaryOptions(updatedBoundaryData);
      }
      return;
    }
    let res = isMultiSelect ? data?.map((ob) => ob?.[1]) || [] : [data];
    let transformedRes = [];

    if (isMultiSelect) {
      transformedRes = selectedData.filter((item) => item?.type === boundary?.boundaryType);
      const filteredData = selectedData.filter((item) => item?.type === boundary?.boundaryType);
      if (filteredData.length === 0 || filteredData.length !== res.length) {
        // If no selected data for the particular boundary type, run the transformation logic
        transformedRes = res?.map((item) => ({
          code: item.code,
          name: item.name,
          type: item.type || item.boundaryType,
          // isRoot: item.boundaryType === parentBoundaryTypeRoot,
          // includeAllChildren: item.type === lowestHierarchy || item.boundaryType === lowestHierarchy,
          parent: item.parent,
        }));
      } else {
        transformedRes = filteredData;
      }
      let updatedSelectedData = selectedData.filter((item) => item?.type !== boundary?.boundaryType);

      // Add the transformedRes entries
      updatedSelectedData = [...updatedSelectedData, ...transformedRes];
      setSelectedData(updatedSelectedData);
    } else {
      transformedRes = res?.map((item) => ({
        code: item.code,
        name: item.name,
        type: item.type || item.boundaryType,
        // isRoot: item.boundaryType === parentBoundaryTypeRoot,
        // includeAllChildren: item.type === lowestHierarchy || item.boundaryType === lowestHierarchy,
        parent: item.code.split(".")[0],
      }));

      const structure = createHierarchyStructure(hierarchy);
      const check = structure?.[boundary.boundaryType];

      if (check) {
        const typesToRemove = [boundary?.boundaryType, ...check];
        let updatedSelectedData = selectedData?.filter((item) => !typesToRemove?.includes(item?.type));
        updatedSelectedData = [...updatedSelectedData, ...transformedRes];
        setSelectedData(updatedSelectedData);
      }
    }

    const updatedBoundaryOptions = { ...boundaryOptions };
    let newData = {};

    const childBoundaryType = hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy.find((h) => h.parentBoundaryType === res?.[0]?.type)
      ?.boundaryType;

    res.forEach((item) => {
      const { code, parent, boundaryType, name } = item;

      // If parentBoundaryType exists, update the corresponding boundaryOptions
      if (childBoundaryType) {
        // Initialize if not present
        if (!boundaryOptions[childBoundaryType]) {
          boundaryOptions[childBoundaryType] = {};
        }

        const newMapping = {};

        Object.keys(boundaryData[childBoundaryType] || {}).forEach((key) => {
          if (boundaryData[childBoundaryType][key].includes(name)) {
            newMapping[key] = boundaryData[childBoundaryType][key];
          }
        });

        newData = { ...newData, ...newMapping };
      }
    });
    updatedBoundaryOptions[childBoundaryType] = { ...newData };
    setBoundaryOptions(updatedBoundaryOptions);
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSelect({ selectedData: selectedData, boundaryOptions: boundaryOptions });
    }, 5000);
  }, [selectedData, boundaryOptions]);

  const checkDataPresent = ({ action }) => {
    if (action === false) {
      setShowPopUp(false);
      setUpdateBoundary(true);
      setRestrictSelection(false);
      return;
    }
    if (action === true) {
      setShowPopUp(false);
      setUpdateBoundary(false);
      return;
    }
  };

  if (hierarchyLoading) return <Loader />;

  return (
    <>
      <div className="selecting-boundary-div">
        {isMultiSelect
          ? hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy
              .filter((boundary, index, array) => {
                // Find the index of the lowest hierarchy
                const lowestIndex = array.findIndex((b) => b.boundaryType === lowest);
                // Include only those boundaries that are above or equal to the lowest hierarchy
                return index <= lowestIndex;
              })
              .map((boundary) =>
                boundary?.parentBoundaryType == null ? (
                  <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel>
                      {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={Object.entries(boundaryOptions)
                          .filter(([key]) => key.startsWith(boundary.boundaryType))
                          .flatMap(
                            ([key, value]) =>
                              Object.entries(value || {}).map(([subkey, item]) => ({
                                code: item?.split(".")?.[0],
                                name: subkey,
                                type: boundary.boundaryType,
                              })) || []
                          )}
                        onSelect={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType) || []}
                        optionsKey={"name"}
                        restrictSelection={restrictSelection}
                        config={{
                          isDropdownWithChip: true,
                          chipKey: "name",
                        }}
                        // frozenData={frozenData}
                      />
                    </div>
                  </LabelFieldPair>
                ) : (
                  <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                    <CardLabel>
                      {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                      <span className="mandatory-span">*</span>
                    </CardLabel>
                    <div className="digit-field">
                      <MultiSelectDropdown
                        t={t}
                        props={{ className: "selecting-boundaries-dropdown" }}
                        options={Object.entries(boundaryOptions)
                          .filter(([key]) => key.startsWith(boundary.boundaryType))
                          .flatMap(([key, value]) =>
                            Object.entries(value || {})
                              .filter(([subkey, item]) => {
                                const itemCode = item?.split(".")?.[0];
                                if (frozenData?.length > 0) {
                                  const isFrozen = frozenData.some((frozenOption) => {
                                    return (
                                      frozenOption.code === subkey && frozenOption.type === boundary.boundaryType
                                      // frozenOption.code === ${t(itemCode)}.${t(subkey)} &&
                                      // frozenOption.boundaryType === boundary.boundaryType
                                    );
                                  });
                                  return frozenType === "filter" ? !isFrozen : true; // Filter or include based on frozenType
                                }

                                // If frozenData is not present, just return true
                                return true;
                              })
                              .map(([subkey, item]) => ({
                                code: item?.split(".")?.[0],
                                name: item?.split(".")?.[0],
                                options:
                                  [
                                    {
                                      code: subkey,
                                      name: subkey,
                                      type: boundary.boundaryType,
                                      parent: `${item?.split(".")?.[0]}`,
                                    },
                                  ] || [],
                              }))
                          )}
                        onSelect={(value) => {
                          handleBoundaryChange(value, boundary);
                        }}
                        selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType) || []}
                        optionsKey={"name"}
                        restrictSelection={restrictSelection}
                        config={{
                          isDropdownWithChip: true,
                          chipKey: "name",
                          numberOfChips: 4,
                        }}
                        addCategorySelectAllCheck={true}
                        addSelectAllCheck={true}
                        variant="nestedmultiselect"
                        frozenData={frozenType === "frozen" ? frozenData : []}
                        popUpOption={boundaryOptions}
                      />
                    </div>
                  </LabelFieldPair>
                )
              )
          : hierarchy?.BoundaryHierarchy?.[0]?.boundaryHierarchy
              .filter((boundary, index, array) => {
                // Find the index of the lowest hierarchy
                const lowestIndex = array.findIndex((b) => b.boundaryType === lowest);
                // Include only those boundaries that are above or equal to the lowest hierarchy
                return index <= lowestIndex;
              })
              .map((boundary) => (
                <LabelFieldPair style={{ alignItems: "flex-start", paddingRight: "30%" }}>
                  <CardLabel>
                    {t((hierarchyType + "_" + boundary?.boundaryType).toUpperCase())}
                    <span className="mandatory-span">*</span>
                  </CardLabel>
                  <Dropdown
                    t={t}
                    props={{ className: "selecting-boundaries-dropdown" }}
                    option={Object.entries(boundaryOptions)
                      .filter(([key]) => key.startsWith(boundary.boundaryType))
                      .flatMap(
                        ([key, value]) =>
                          Object.entries(value || {}).map(([subkey, item]) => ({
                            code: item?.split(".")?.[0],
                            name: subkey,
                            type: boundary.boundaryType,
                          })) || []
                      )}
                    select={(value) => {
                      handleBoundaryChange(value, boundary);
                    }}
                    selected={selectedData?.filter((item) => item?.type === boundary?.boundaryType)?.[0] || {}}
                    optionKey={"name"}
                  />
                </LabelFieldPair>
              ))}
      </div>
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_HEADER")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_TEXT") + " "}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_BACK")}
              onClick={() => {
                checkDataPresent({ action: false });
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_SUBMIT")}
              onClick={() => {
                checkDataPresent({ action: true });
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
    </>
  );
};

// export default SelectingBoundaryComponent;
export { Wrapper, SelectingBoundaryComponent };
