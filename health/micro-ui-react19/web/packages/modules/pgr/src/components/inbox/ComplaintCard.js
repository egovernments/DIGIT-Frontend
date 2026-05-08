import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterAction, Card, DetailsCard, PopUp, SearchAction } from "@egovernments/digit-ui-react-components";
import Filter from "./Filter";
import SearchComplaint from "./search";

export const ComplaintCard = ({ data, onFilterChange, onSearch, serviceRequestIdKey, searchParams }) => {
  const { t } = useTranslation();
  const [popup, setPopup] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [filterCount] = useState(Digit.inboxFilterCount || 1);

  const handlePopupClose = () => {
    setPopup(false);
    setSelectedComponent(null);
  };

  const handlePopupAction = (type) => {
    if (type === "SEARCH") {
      setSelectedComponent(<SearchComplaint type="mobile" onClose={handlePopupClose} onSearch={onSearch} searchParams={searchParams} />);
    } else if (type === "FILTER") {
      setSelectedComponent(
        <Filter complaints={data} onFilterChange={onFilterChange} onClose={handlePopupClose} type="mobile" searchParams={searchParams} />
      );
    }
    setPopup(true);
  };

  let result;
  if (!data) {
    result = null;
  } else if (data.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        <p style={{ textAlign: "center" }}>{t("CS_MYCOMPLAINTS_NO_COMPLAINTS")}</p>
      </Card>
    );
  } else {
    result = (
      <DetailsCard
        data={data}
        serviceRequestIdKey={serviceRequestIdKey}
        linkPrefix={`/${window?.contextPath}/employee/pgr/complaint/details/`}
      />
    );
  }

  return (
    <>
      <div className="searchBox">
        <SearchAction text="SEARCH" handleActionClick={() => handlePopupAction("SEARCH")} />
        <FilterAction filterCount={filterCount} text="FILTER" handleActionClick={() => handlePopupAction("FILTER")} />
      </div>
      {result}
      {popup && (
        <PopUp>
          <div className="popup-module">{selectedComponent}</div>
        </PopUp>
      )}
    </>
  );
};
