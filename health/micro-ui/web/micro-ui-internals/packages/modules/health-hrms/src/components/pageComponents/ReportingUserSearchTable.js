import React, { useState, Fragment } from "react";
import { Loader, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const ReportingUserSearchTable = ({
    data = [],
    totalCount = 0,
    rowsPerPage = 5,
    onSelect,
    onPageChange,
    loading = false,
    offset = 0, // get offset from parent
}) => {
    const { t } = useTranslation();

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleNext = () => {
        if (data.length === rowsPerPage) {
            onPageChange?.({ offset: offset + rowsPerPage, limit: rowsPerPage });
        }
    };

    const handlePrevious = () => {
        if (offset > 0) {
            onPageChange?.({ offset: Math.max(offset - rowsPerPage, 0), limit: rowsPerPage });
        }
    };

    const handleSelect = (user) => {

        setSelectedUserId(user.userUuid);
        onSelect?.(user);
    };

    return (
        <div>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                    <Loader />
                </div>
            ) : (
                <div>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #ddd",
                            marginTop: "5px",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                <th style={{ padding: "8px", textAlign: "left" }}>{t("CORE_COMMON_NAME")}</th>
                                <th style={{ padding: "8px", textAlign: "left" }}>{t("CORE_COMMON_PROFILE_MOBILE_NUMBER")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((user) => (
                                    <tr key={user.userUuid} onClick={() => handleSelect(user)} style={{ cursor: "pointer" }}>
                                        <td style={{ padding: "8px", backgroundColor: selectedUserId === user.userUuid ? "lightgrey" : "white" }}>
                                            {user?.name?.givenName || "-"}
                                        </td>
                                        <td style={{ padding: "8px", backgroundColor: selectedUserId === user.userUuid ? "lightgrey" : "white" }}>
                                            {user?.mobileNumber || "-"}
                                        </td>
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination controls */}
                    {totalCount > 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "5px",
                            }}
                        >
                            <Button
                                variation="link"
                                isDisabled={offset === 0 || data.length === 0}
                                label={t("COMMON_TABLE_PREVIOUS_PAGE")}
                                onClick={handlePrevious}
                            />
                            <Button
                                variation="link"
                                isDisabled={data.length < rowsPerPage}
                                label={t("COMMON_TABLE_NEXT_PAGE")}
                                onClick={handleNext}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportingUserSearchTable;
