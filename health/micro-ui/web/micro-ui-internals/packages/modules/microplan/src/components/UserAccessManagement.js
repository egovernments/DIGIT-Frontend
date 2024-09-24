import React from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2 } from "@egovernments/digit-ui-react-components";
import { FileIcon } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-react-components";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { datamgmtconfig } from "../configs/datamgmtconfigs";
import { Table } from '@egovernments/digit-ui-react-components';
import { Chip } from "@egovernments/digit-ui-components";



const UserAccessManagement = ({ file, index, handleFileDelete, handleRedirect, setShowPreview }) => {

    const datamgmtConfigs = datamgmtconfig();
    console.log(datamgmtConfigs);
    const { t } = useTranslation();
    const columns = [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Contact number', accessor: 'contactnumber' },
        { Header: 'Administrative hierachy', accessor: 'adminH' },
        { Header: "Administrative area", accessor: "adminA" }

    ];

    const predata = [
        {
            name: 'Herve', email: "Herve@email.com", contactnumber: '84984984', adminH: "Village",
            adminA: "Chipps"

        },

    ];

    

    const data = predata.map((item) => {
        const obj = { ...item };  // Create a copy of the item

        // If 'adminA' should be rendered as JSX with Chip
        if (item.adminA) {
            obj.adminA = (
                <div className="digit-tag-container">
                    <Chip
                        className=""
                        error=""
                        extraStyles={{
                            color: 'red'
                        }}
                        onClick={() => {}}
                        onTagClick={() => {}}
                        text={item.adminA} // Use the adminA value as text
                    />
                </div>
            );
        }

        return obj;  // Return modified object
    });
    return (
        <div>
            {/* <div className="digit-tag-container">
                <Chip
                    className=""
                    error=""
                    extraStyles={{
                        color: 'red'
                    }}
                    onClick={function noRefCheck() { }}
                    onTagClick={function noRefCheck() { }}
                    text="Chipsss"
                />
            </div> */}

            <Card>
                <div className="view-composer-header-section">
                    <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>Vehicles</CardSubHeader>
                </div>
                <Table
                    columns={columns} data={data}
                    getCellProps={(cellInfo) => {
                        return {
                            style: {
                                padding: "20px 18px",
                                fontSize: "16px",
                                whiteSpace: "normal",
                            },
                        };
                    }}
                    t={t}
                />
            </Card>
        </div>
    );
};

export default UserAccessManagement;