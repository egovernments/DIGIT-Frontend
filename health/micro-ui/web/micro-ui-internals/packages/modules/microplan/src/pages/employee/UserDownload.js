import React, { useState, useEffect } from 'react';
import FileComponent from '../../components/FileComponent';
import { Header } from '@egovernments/digit-ui-react-components';
import { TextBlock, Card, ActionBar, Button } from '@egovernments/digit-ui-components';
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const UserDownload = () => {
    const { t } = useTranslation();
    const [files, setFiles] = useState([]); // Store file data as an array
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Items per page

    // Fetch data
    const { data, isFetching, isLoading } = Digit.Hooks.microplanv1.useFileDownload({
        "SearchCriteria": {
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "type": "user"
        }
    },
        {
            enabled: true,
            select: data => {
                const ResourceDetails = data?.ResourceDetails || [];
                const filteredData = ResourceDetails.filter(item => item?.action === "create" && (item?.additionalDetails?.source === "microplan" || item?.campaignId === "microplan"));
                data.ResourceDetails = filteredData;
                return data;
            }
        }
    );

    // Update files when data changes
    useEffect(() => {
        if (data && data["ResourceDetails"]) {
            setFiles([...data["ResourceDetails"]].reverse()); // Reverse to show latest first
        }
    }, [data]);

    // Calculate total pages
    const totalPages = Math.ceil(files.length / rowsPerPage);

    // Get current page data
    const currentData = files.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Handlers for pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };
    return (
        <div style={{ marginBottom: "2.5rem" }}>
            {isLoading && <LoaderWithGap text={t("CS_LOADING")} />}
            <Card  >
                <Header className="summary-main-heading">
                    {t(`DOWNLOAD_USER_DATA`)}
                </Header>
                <TextBlock body={t("DOWNLOAD_DESC")} />

                {/* Display paginated files */}
                {currentData.map((item, index) => {
                    const fileName = item?.additionalDetails?.fileName || `FileNo${item?.processedFilestoreId?.slice(0, 4) || ''}`;
                    return (
                        <FileComponent
                            key={index}
                            title=""
                            fileName={fileName}
                            downloadHandler={() => {
                                Digit.Utils.campaign.downloadExcelWithCustomName({
                                    fileStoreId: item?.processedFilestoreId,
                                    customName: String(fileName)
                                });
                            }}
                            status={item?.status}
                            auditDetails={{ userName: item?.username, lastmodTime: item?.auditDetails?.lastmodtime }}
                            rowDetails={item}
                        />
                    );
                })}

                {/* Pagination Controls */}
                <div className="pagination-controls">
                    <label>
                        {t("MP_UD_ROWS_PER_PAGE")}:
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            {[5, 10, 15, 20].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </label>
                    <div>
                        {t("MP_USER_DOWNLOAD_PAGE")}: {currentPage} / {totalPages}
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            icon={"ArrowBackIos"}
                            variation="teritiary"

                        />
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                            variation="teritiary"
                            icon={"ArrowForwardIos"}
                        />
                    </div>
                </div>
            </Card>
            <ActionBar style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: "1" }}>
                <div style={{ marginLeft: "auto" }}>
                    <Link to="/microplan-ui/employee/microplan/user-management" style={{ textDecoration: "none" }}>
                        <Button
                            style={{ minWidth: "12rem" }}
                            className="previous-button"
                            variation="secondary"
                            label={t("BACK")}
                            title={t("BACK")}
                            icon={"ArrowBack"}
                        />
                    </Link>
                </div>
            </ActionBar>
        </div>
    );
};

export default UserDownload;
