import React from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2 } from "@egovernments/digit-ui-react-components";
import { FileIcon } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-react-components";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";

import { Table } from '@egovernments/digit-ui-react-components';


const DataMgmtTable = ({ file, index, handleFileDelete, handleRedirect, setShowPreview }) => {
    
   
    const { t } = useTranslation();
    const columns = [
        { Header: 'Vehicle type', accessor: 'vehicleType' },
        { Header: 'Manufacturer', accessor: 'manufacturer' },
        { Header: 'Model', accessor: 'model' },
        { Header: 'Capacity(in Bales)', accessor: 'cap' },

    ];

    const data = [
        { vehicleType: 'Truck', manufacturer: "Draft", model: 'Household',cap:"70" },
        { vehicleType: 'Motorcycle', manufacturer: "Draft", model: 'Household',cap:"2" },
        { vehicleType: 'Motorcycle', manufacturer: "Draft", model: 'Household', cap:"2" },
    ];
    return (
        <div>
           
            {/* Second card */}
            
            
                <div className="view-composer-header-section">
                    <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>Vehicles</CardSubHeader>
                </div>
                <Table
                    columns={columns} data={data}
                    getCellProps={(cellInfo) => {
                        return {
                            style: {
                                padding: "16px",
                                fontSize: "16px",
                                whiteSpace: "normal",
                            },
                        };
                    }}
                    t={t}
                />
            
        </div>
    );
};

export default DataMgmtTable;