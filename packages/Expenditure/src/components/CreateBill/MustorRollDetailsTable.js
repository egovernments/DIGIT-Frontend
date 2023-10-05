import React, {useMemo} from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@egovernments/digit-ui-react-components'
import { mustorRollDetailsTableColumns } from '../../configs/mustorRollDetailsTableColumns'
import { mustorRollDummyData } from '../../configs/mustorRollDummyData'

const MustorRollDetailsTable = () => {
    const { t } = useTranslation()
    const mustorRollDetailsColumns = useMemo(() => mustorRollDetailsTableColumns(t))
    const tableRows = Object.values(mustorRollDummyData.rows);

    return (
        <React.Fragment>
        <div style={{ padding: "0px", overflowX: "scroll" }} className='card week-table-card-wrapper'>
            <Table
                t={t}
                className="wage-seekers-table week-table"
                customTableWrapperClassName="table-wrapper attendence-table"
                disableSort={false}
                autoSort={false}
                manualPagination={false}
                columns={mustorRollDetailsColumns}
                data={tableRows}
                totalRecords={tableRows.length}
                isPaginationRequired={false}
                pageSizeLimit={tableRows.length}
                getCellProps={(cellInfo) => {
                    let tableProp = {};
                    if(cellInfo?.row?.original?.type === "total") {
                      tableProp["data-last-row-cell"] = "last-row";
                    }
                    return tableProp;
                  }}
            />
        </div>
        </React.Fragment>
    )
}

export default MustorRollDetailsTable