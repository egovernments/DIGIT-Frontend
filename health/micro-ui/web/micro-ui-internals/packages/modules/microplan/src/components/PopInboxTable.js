import React, { useState, useEffect,useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { Button } from '@egovernments/digit-ui-components';
import { useHistory } from "react-router-dom";

const censusResponse = {
  "Census": [
      {
          "id": "676be638-6d06-448f-852c-ba0a81fc036d",
          "tenantId": "mz",
          "hierarchyType": "MICROPLAN",
          "boundaryCode": "MICROPLAN_MO_05_07_JEDEPO",
          "assignee": "xyz",
          "status": "APPROVED",
          "type": "people",
          "totalPopulation": 50000,
          "populationByDemographics": [
              {
                  "id": "85298b0b-c618-4881-b33c-5f7c7d208d5e",
                  "demographicVariable": "age",
                  "populationDistribution": {
                      "65+": 7000,
                      "0-14": 10000,
                      "15-24": 8000,
                      "25-64": 25000
                  }
              }
          ],
          "effectiveFrom": 1729065438235,
          "effectiveTo": 1729065439379,
          "source": "1e9b2ba5-c2cc-493c-801c-cf358143244c",
          "additionalDetails": {
            
          },
          "auditDetails": {
              "createdBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "lastModifiedBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "createdTime": 1729065438235,
              "lastModifiedTime": 1729065438235
          }
      },
      {
          "id": "cfed132f-82c3-4842-a60a-13fc2c9ac0ac",
          "tenantId": "mz",
          "hierarchyType": "MICROPLAN",
          "boundaryCode": "MICROPLAN_MO_05_07_IMOLA",
          "assignee": "xyz",
          "status": "APPROVED",
          "type": "people",
          "totalPopulation": 50000,
          "populationByDemographics": [
              {
                  "id": "188c9033-0ae3-4aa5-8bd0-3d873695457f",
                  "demographicVariable": "age",
                  "populationDistribution": {
                      "65+": 7000,
                      "0-14": 10000,
                      "15-24": 8000,
                      "25-64": 25000
                  }
              }
          ],
          "effectiveFrom": 1729065437311,
          "effectiveTo": 1729065438235,
          "source": "1e9b2ba5-c2cc-493c-801c-cf358143244c",
          "additionalDetails": {},
          "auditDetails": {
              "createdBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "lastModifiedBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "createdTime": 1729065437311,
              "lastModifiedTime": 1729065437311
          }
      },
      {
          "id": "6f621335-ef14-45e4-81c2-b539066dcf46",
          "tenantId": "mz",
          "hierarchyType": "MICROPLAN",
          "boundaryCode": "MICROPLAN_MO_05_07_JEDEPO",
          "assignee": "xyz",
          "status": "APPROVED",
          "type": "people",
          "totalPopulation": 50000,
          "populationByDemographics": [
              {
                  "id": "f1a59f21-710e-43f6-a268-dbe077c362af",
                  "demographicVariable": "age",
                  "populationDistribution": {
                      "65+": 7000,
                      "0-14": 10000,
                      "15-24": 8000,
                      "25-64": 25000
                  }
              }
          ],
          "effectiveFrom": 1729065436109,
          "effectiveTo": 1729065437311,
          "source": "1e9b2ba5-c2cc-493c-801c-cf358143244c",
          "additionalDetails": {},
          "auditDetails": {
              "createdBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "lastModifiedBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "createdTime": 1729065436109,
              "lastModifiedTime": 1729065436109
          }
      },
      {
          "id": "d00180d4-50d8-465c-8444-2db90011a46f",
          "tenantId": "mz",
          "hierarchyType": "MICROPLAN",
          "boundaryCode": "MICROPLAN_MO_05_07_JEDEPO",
          "assignee": "xyz",
          "status": "APPROVED",
          "type": "people",
          "totalPopulation": 50000,
          "populationByDemographics": [
              {
                  "id": "c319e959-a9de-444e-ab92-19556e1d3b94",
                  "demographicVariable": "age",
                  "populationDistribution": {
                      "65+": 7000,
                      "0-14": 10000,
                      "15-24": 8000,
                      "25-64": 25000
                  }
              }
          ],
          "effectiveFrom": 1729065434899,
          "effectiveTo": 1729065436109,
          "source": "1e9b2ba5-c2cc-493c-801c-cf358143244c",
          "additionalDetails": {},
          "auditDetails": {
              "createdBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "lastModifiedBy": "90345b09-f701-4df5-9d08-0c2f14474e9c",
              "createdTime": 1729065434899,
              "lastModifiedTime": 1729065434899
          }
      }
  ],
  "TotalCount": 17,
  "StatusCount": {
      "PENDING_FOR_APPROVAL": 4,
      "PENDING_FOR_VALIDATION": 4,
      "APPROVED": 6,
      "VALIDATED": 3
  }
}





const customStyles = {
	header: {
		style: {
			minHeight: '56px',
		},
	},
	headRow: {
		style: {
			borderTopStyle: 'solid',
			borderTopWidth: '1px',
			borderTopColor: "#D6D5D4"
		},
	},
	headCells: {
		style: {
			'&:not(:last-of-type)': {
				borderRightStyle: 'solid',
				borderRightWidth: '1px',
				borderRightColor: "#D6D5D4",
			},
		},
	},
	cells: {
		style: {
			'&:not(:last-of-type)': {
				borderRightStyle: 'solid',
				borderRightWidth: '1px',
				borderRightColor: "#D6D5D4",
			},
		},
	},
};

const PopInboxTable = ({...props}) => {
  const { t } = useTranslation()
	const [data, setData] = useState(censusResponse?.Census);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
    const history = useHistory();

    const { campaignId, microplanId,  } = Digit.Hooks.useQueryParams();

  const columns = useMemo(() => {
    return [
      {
        name: t(`INBOX_VILLAGE`),
        cell: (row, index, column, id) => <Button
        label={t(`${row.boundaryCode}`)}
        onClick={()=>history.push(`village-view?campaignId=${campaignId}&microplanId=${microplanId}&boundaryCode=${row?.boundaryCode}`)}
        title={t(`${row.boundaryCode}`)}
        variation="link"
        style={{maxWidth:"1rem"}}
      /> ,
        // selector:(row, index)=>row.boundaryCode, 
        sortable: true,
      },
      {
        name:t("INBOX_ASSIGNEE"),
        selector:(row,index) => row?.assignee,
        sortable: true,
      }
      // {
      //   name: t(`INBOX_VILLAGE`),
      //   cell: (row, index, column, id) => <a onClick={()=>{console.log(row)}} href="">View Logs</a>,
      //   sortable: true,
      // },
      // {
      //   name: 'Comment Logs',
      //   cell: row => <a onClick={()=>{console.log(row)}} href="#">View Logs</a>,
      // },
    ];
  }, [])

	const handlePageChange = page => {
		
	};

  const handleRowSelect = (arg) => {
    
  }

	const handlePerRowsChange = async (newPerPage, page) => {
		
	};

//wrapper to the table card
//show multiple tabs 
	return (
		<DataTable
			// title="Users"
			columns={columns}
			data={censusResponse.Census}
			// progressPending={loading}
			// pagination
			// paginationServer
			paginationTotalRows={5}
			selectableRows
      selectableRowsHighlight
			onChangeRowsPerPage={handlePerRowsChange}
			onChangePage={handlePageChange}
      noContextMenu
      onSelectedRowsChange={handleRowSelect}
      customStyles={customStyles}
      // selectableRowsComponent={SimpleCheckbox}
		/>
	);
};

export default PopInboxTable