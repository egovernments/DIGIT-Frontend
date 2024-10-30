import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";
import TimelinePopUpWrapper from "./timelinePopUpWrapper";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";
import EditVillagePopulationPopUp from "./editVillagePopulationPopUP";
import { tableCustomStyle } from "./tableCustomStyle";
import { CustomLoader } from "./RoleTableComposer";

const PopInboxTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [showEditVillagePopup, setShowEditVillagePopup] = useState({});
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const url = Digit.Hooks.useQueryParams();
  const [isIntermediate, setIsIntermediate] = useState(false);

  const censusData = [
    {
      "id": "3832d751-5924-4aae-a6b6-fc7c288d28c1",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_02_JOKOKEN",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 213,
      "populationByDemographics": null,
      "effectiveFrom": 1730094129198,
      "effectiveTo": 1730102431454,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_02_JOKOKEN",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 213,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 63,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 63
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094129198,
        "lastModifiedTime": 1730094129369
      }
    },
    {
      "id": "fce8432a-872f-4a0d-8fbf-96203677bdcf",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_04_JOKOKEN_SLAH_VI1878",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 211,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128913,
      "effectiveTo": 1730102431139,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_04_JOKOKEN_SLAH_VI1878",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 211,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 61,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 61
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128913,
        "lastModifiedTime": 1730094128980
      }
    },
    {
      "id": "bc9c4d00-5d9d-4f38-81a6-d6034419e32f",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_05_JOKOKEN_ROBERT_1879",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 210,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128848,
      "effectiveTo": 1730102430940,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_05_JOKOKEN_ROBERT_1879",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 210,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 60,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 60
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128848,
        "lastModifiedTime": 1730094128903
      }
    },
    {
      "id": "18306300-21b0-413c-ba2c-4f2f8dec6f70",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_06_POKPAKEN_TOWN",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 209,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128776,
      "effectiveTo": 1730102430741,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_06_POKPAKEN_TOWN",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 209,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 59,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 59
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128776,
        "lastModifiedTime": 1730094128838
      }
    },
    {
      "id": "52722fb0-3e84-4fbf-9576-c819d52a174d",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_07_POKPAKEN_TOWN_S1881",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 208,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128687,
      "effectiveTo": 1730102430446,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_07_POKPAKEN_TOWN_S1881",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 208,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 58,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 58
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128687,
        "lastModifiedTime": 1730094128745
      }
    },
    {
      "id": "8754f566-c848-4c5c-a61e-ae236a32734b",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_08_POKPAKEN_TOWN_P1882",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 207,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128623,
      "effectiveTo": 1730102430340,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_08_POKPAKEN_TOWN_P1882",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 207,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 57,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 57
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128623,
        "lastModifiedTime": 1730094128677
      }
    },
    {
      "id": "648939fa-ee24-4406-86f4-808a0365f5a9",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_09_POKPAKEN_TOWN_K1883",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 206,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128540,
      "effectiveTo": 1730102430170,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_09_POKPAKEN_TOWN_K1883",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 206,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 56,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 56
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128540,
        "lastModifiedTime": 1730094128612
      }
    },
    {
      "id": "4a179ee0-cda7-4bde-93d7-0e0e47435a7e",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_10_BEATUOKEN",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 205,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128442,
      "effectiveTo": 1730102430079,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_10_BEATUOKEN",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 205,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 55,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 55
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128442,
        "lastModifiedTime": 1730094128498
      }
    },
    {
      "id": "4b09945c-8ef5-44e7-a77d-32f0b0b8f4e4",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_11_BEATUOKEN_BEATU1885",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 204,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128338,
      "effectiveTo": 1730102429968,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_11_BEATUOKEN_BEATU1885",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 204,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 54,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 54
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128338,
        "lastModifiedTime": 1730094128396
      }
    },
    {
      "id": "2ad35224-2e1d-4974-a481-02aff3aa7b64",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_12_BEATUOKEN_CHATT1886",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 203,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128239,
      "effectiveTo": 1730102429870,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_12_BEATUOKEN_CHATT1886",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 203,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 53,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 53
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128239,
        "lastModifiedTime": 1730094128294
      }
    },
    {
      "id": "9f2c712f-d258-44e8-a231-caa671c2f21b",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_13_BEATUOKEN_DWEHN1887",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 202,
      "populationByDemographics": null,
      "effectiveFrom": 1730094128039,
      "effectiveTo": 1730102429796,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_13_BEATUOKEN_DWEHN1887",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 202,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 52,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 52
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094128039,
        "lastModifiedTime": 1730094128168
      }
    },
    {
      "id": "a24a7bf4-1ead-43df-9968-ccd73705f40c",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_14_POKPAKEN_TOWN_P1888",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 201,
      "populationByDemographics": null,
      "effectiveFrom": 1730094127888,
      "effectiveTo": 1730102429652,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_14_POKPAKEN_TOWN_P1888",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 201,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 51,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 51
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094127888,
        "lastModifiedTime": 1730094127974
      }
    },
    {
      "id": "acc6dbb9-b5e1-45a1-b655-892c9a274219",
      "tenantId": "mz",
      "hierarchyType": "MICROPLAN",
      "boundaryCode": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
      "assignee": "1df31471-b8d1-4e55-b528-5d6aae085298",
      "status": "PENDING_FOR_VALIDATION",
      "type": "people",
      "totalPopulation": 200,
      "populationByDemographics": null,
      "effectiveFrom": 1730094127766,
      "effectiveTo": 1730102429546,
      "source": "3bac3f1b-e041-4830-843f-159141470147",
      "facilityAssigned": false,
      "workflow": null,
      "additionalDetails": {
        "HCM_ADMIN_CONSOLE_BOUNDARY_CODE": "MICROPLAN_MO_05_07_03_15_POKPAKEN_TOWN_K1889",
        "HCM_ADMIN_CONSOLE_TOTAL_POPULATION": 200,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11": 50,
        "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59": 50
      },
      "additionalFields": [
        {
          "key": "HCM_ADMIN_CONSOLE_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": false,
          "order": 1
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TOTAL_POPULATION",
          "value": 100,
          "showOnUi": true,
          "editable": true,
          "order": 2
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 3
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_3TO11",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 4
        },
        {
          "key": "HCM_ADMIN_CONSOLE_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": false,
          "order": 5
        },
        {
          "key": "HCM_ADMIN_CONSOLE_CONFIRM_TARGET_POPULATION_AGE_12TO59",
          "value": 50,
          "showOnUi": true,
          "editable": true,
          "order": 6
        }
      ],
      "auditDetails": {
        "createdBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "lastModifiedBy": "354ae3fb-372a-4a96-8dfb-8dec61c679e2",
        "createdTime": 1730094127766,
        "lastModifiedTime": 1730094127872
      }
    }
  ]


  const columns = useMemo(() => {
    return [
      {
        name: t(`INBOX_VILLAGE`),
        cell: (row, index, column, id) => (
          <Button
            label={t(`${row.boundaryCode}`)}
            onClick={() =>
              history.push(`/${window.contextPath}/employee/microplan/village-view?microplanId=${url?.microplanId}&boundaryCode=${row.boundaryCode}&campaignId=${url?.campaignId}`)
            }
            title={t(`${row.boundaryCode}`)}
            variation="link"
            size={"medium"}
            style={{}}
          />
        ),
        // selector:(row, index)=>row.boundaryCode,
        sortable: true,
        sortFunction: (rowA, rowB) => {
          const boundaryCodeA = rowA.boundaryCode.toLowerCase();
          const boundaryCodeB = rowB.boundaryCode.toLowerCase();
          if (boundaryCodeA < boundaryCodeB) return -1;
          if (boundaryCodeA > boundaryCodeB) return 1;
          return 0;
        },
      },
      ...(
        (censusData?.[0]?.additionalFields || [])
          .filter((field) => field.showOnUi)
          .sort((a, b) => a.order - b.order)
          .map((field) => ({
            name: t(field.key) || t("ES_COMMON_NA"),
            selector: (row) => {
              const fieldValue = row.additionalFields.find((f) => f.key === field.key)?.value || t("ES_COMMON_NA");

              // Render a button if editable is true, otherwise render the field value as text
              return row.additionalFields.find((f) => f.key === field.key)?.editable ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '24px' }}>{fieldValue}</span>
                  {props.showEditColumn && <Button
                    onClick={() => {
                      setShowEditVillagePopup(row);
                    }}
                    variation="secondary"
                    icon={"Edit"}
                    size="medium"
                  />}
                </div>
              ) : (
                fieldValue
              );
            },
            sortable: true,
          }))
      ),
      {
        name: t("INBOX_STATUSLOGS"),
        cell: (row, index, column, id) => (
          <Button
            label={t(`VIEW_LOGS`)}
            onClick={() => {
              setSelectedBusinessId(row.id); // Set the row.id to state
              setShowTimelinePopup(true);
            }}
            variation="link"
            style={{}}
            size={"medium"}
          />
        ),
        sortable: false,
      },
      {
        name: t("INBOX_ASSIGNEE"),
        selector: (row, index) => props?.employeeNameData?.[row?.assignee] || t("ES_COMMON_NA"),
        sortable: true,
      },
    ];
  }, [censusData, props.showEditColumn, props.employeeNameData]);

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
  };

  const handleRowSelect = (event) => {
    // if(!event?.allSelected && event?.selectedCount >0){
    //     setIsIntermediate(true);
    // }
    props?.onRowSelect(event);
  };

  const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
    props?.handlePerRowsChange(currentRowsPerPage, currentPage);
  };

  const selectProps = {
    hideLabel: true,
    isIntermediate: isIntermediate,
    mainClassName: "data-table-select-checkbox",
  };

  if (showTimelinePopup) {
    return (
      <TimelinePopUpWrapper
        onClose={() => {
          setShowTimelinePopup(false);
          setSelectedBusinessId(null); // Reset the selectedBusinessId when popup is closed
        }}
        businessId={selectedBusinessId} // Pass selectedBusinessId as businessId
        heading="HCM_MICROPLAN_STATUS_LOG_LABEL"
      />
    );
  }

  if (Object.keys(showEditVillagePopup).length > 0) {
    return (
      <EditVillagePopulationPopUp
        onClose={() => {
          setShowEditVillagePopup({});
        }}
        census={showEditVillagePopup}
        onSuccess={(data) => {
          props.onSuccessEdit();
        }}
      />
    );
  }

  //wrapper to the table card
  //show multiple tabs
  return (
    <DataTable
      columns={columns}
      data={censusData}
      selectableRows
      selectableRowsHighlight
      noContextMenu
      onSelectedRowsChange={handleRowSelect}
      customStyles={tableCustomStyle}
      selectableRowsComponent={CheckBox}
      sortIcon={<CustomSVG.SortUp />}
      defaultSortFieldId={1}
      selectableRowsComponentProps={selectProps}
      progressPending={props?.progressPending}
      progressComponent={<CustomLoader />}// progressPending={loading}
      // title="Users"
      // paginationDefaultPage={currentPage}
      // paginationDefaultRowsPerPage={rowsPerPage}
      pagination
      paginationServer
      paginationDefaultPage={props?.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      paginationTotalRows={props?.totalRows}
      paginationPerPage={props?.rowsPerPage}
      paginationRowsPerPageOptions={[10, 20, 50, 100]}
    />
  );
};

export default PopInboxTable;