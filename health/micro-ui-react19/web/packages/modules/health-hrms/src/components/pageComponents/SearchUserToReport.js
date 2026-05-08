import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Loader, TextInput, Button, NoResultsFound } from "@egovernments/digit-ui-components";
import AttendanceService from "../../services/hrms/SearchUser";
import ReportingUserSearchTable from "./ReportingUserSearchTable";

const SearchUserToReport = ({ boundaryCode, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [showHint, setShowHint] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedIndividual, setSearchedIndividual] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [apiCall, setApiCall] = useState(false);

  const rowsPerPage = 5;

  const searchUser = async (name, currentoffset = 0, limit = rowsPerPage) => {
    try {
      setLoading(true);
      setSearchedIndividual([]);
      setSelectedUser(null);

      const locallity = Digit.SessionStorage.get("selectedBoundary")?.code || null;

      if (locallity === null) {
        setLoading(false);
        return;
      }

      const result = await AttendanceService.searchIndividual({ name, locallity, tenantId, offset: currentoffset, limit });
      setSearchedIndividual(result.Individual);
      setTotalCount(result.TotalCount);
      setOffset(currentoffset);
    } catch (error) {
      // silent error
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollAttendee = () => {
    onSubmit({ id: selectedUser?.userUuid, name: selectedUser?.name?.givenName });
    onClose();
  };

  return (
    <PopUp
      style={{ width: "800px", minHeight: "430px" }}
      onClose={onClose}
      heading={t("HCM_AM_SEARCH_USER")}
      onOverlayClick={onClose}
      children={[
        <div key="content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <TextInput
                type="search"
                name="title"
                placeholder={t("HCM_AM_VIEW_REGISTER_PLACE_HOLDER")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length < 3) {
                    setShowHint(true);
                    setApiCall(false);
                    setSearchedIndividual([]);
                  } else {
                    setApiCall(false);
                    setShowHint(false);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setApiCall(true);
                    searchUser(searchQuery, 0, rowsPerPage);
                  }
                }}
              />
              <Button
                style={{ minWidth: "140px" }}
                isDisabled={searchQuery.length < 3}
                type="button"
                size="large"
                variation="primary"
                label={t("CS_INBOX_SEARCH")}
                onClick={(e) => {
                  e.preventDefault();
                  setApiCall(true);
                  searchUser(searchQuery, 0, rowsPerPage);
                }}
              />
            </div>
          </div>

          {loading && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Loader />
            </div>
          )}

          {!loading && searchQuery !== "" && searchedIndividual.length === 0 && apiCall === true && (
            <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} />
          )}

          {!loading && searchedIndividual.length > 0 && (
            <ReportingUserSearchTable
              data={searchedIndividual}
              totalCount={totalCount}
              rowsPerPage={5}
              offset={offset}
              loading={loading}
              onSelect={(user) => setSelectedUser(user)}
              onPageChange={({ offset, limit }) => searchUser(searchQuery, offset, limit)}
            />
          )}
        </div>,
      ]}
      footerChildren={[
        <Button
          key="assign"
          isDisabled={!selectedUser}
          type="button"
          size="large"
          variation="primary"
          label={t("HCM_AM_ASSIGN_BT")}
          onClick={handleEnrollAttendee}
        />,
      ]}
      sortFooterChildren={true}
    />
  );
};

export default SearchUserToReport;
