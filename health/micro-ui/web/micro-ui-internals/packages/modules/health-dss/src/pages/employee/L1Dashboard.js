import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const L1Dashboard = ({}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dashboardData = location.state?.dashboardData;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const language = Digit.StoreData.getCurrentLanguage();
  const projectTypeId = location.state?.projectTypeId;
  const dashboardLink = location.state?.dashboardLink;
  const dashboardId = dashboardLink?.dashboardId;
  const stateCode = location.state?.stateCode;
  const [filters, setFilters] = useState(() => {});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [selectedState, setselectedState] = useState("");
  const [drillDownId, setdrillDownId] = useState("none");
  const [totalCount, setTotalCount] = useState("");
  const [liveCount, setLiveCount] = useState("");
  const [searchQuery, onSearch] = useState("");
  const [pageZoom, setPageZoom] = useState(false);
  const { isLoading: localizationLoading, data: store } = Digit.Services.useStore({ stateCode, dashboardId, language });
  return (
    <div>
      <h1>Dashboard Details</h1>
      <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
    </div>
  );
};

export default L1Dashboard;
