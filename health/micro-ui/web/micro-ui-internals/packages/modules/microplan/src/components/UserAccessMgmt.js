import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@egovernments/digit-ui-react-components";
import { DeleteIconv2 } from "@egovernments/digit-ui-react-components";
import { FileIcon } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-react-components";
import { Card } from "@egovernments/digit-ui-react-components";
import { CardSubHeader, Loader } from "@egovernments/digit-ui-react-components";
import DataTable from "react-data-table-component";
import { useMyContext } from "../utils/context";



import { Table } from '@egovernments/digit-ui-react-components';
import searchPlanEmployeeWithTaggingConfig from "../hooks/services/searchPlanEmployeeWithTaggingConfig";
import UserAccessMgmtTableWrapper from "./UserAccessMgmtTableWrapper";


const UserAccessMgmtTable = ({ file, index, handleFileDelete, handleRedirect, setShowPreview }) => {

    const [rowData, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const url = Digit.Hooks.useQueryParams();
    const microplanId = url?.microplanId;
    const { state } = useMyContext();
    const rolesArray = state?.rolesForMicroplan?.sort((a, b) => a.orderNumber - b.orderNumber).map((item) => item.roleCode);
    
    const { t } = useTranslation();

    return rolesArray.map((role) => {
            // Step 2: Call the function with the provided data

            return(
              <UserAccessMgmtTableWrapper
              role={role}
              />
                );
        })
};

export default UserAccessMgmtTable;