import { useTranslation } from "react-i18next";
import { CheckBox, Loader } from "@egovernments/digit-ui-react-components";

const Status = ({ complaints, onAssignmentChange, pgrfilters }) => {
  const { t } = useTranslation();
  // Reads status counts from the framework hook registered by the parent app
  const complaintsWithCount = Digit.Hooks.pgr?.useComplaintStatusCount?.(complaints) || [];
  const hasFilters = pgrfilters?.applicationStatus?.length;

  return (
    <div className="status-container">
      <div className="filter-label">{t("ES_PGR_FILTER_STATUS")}</div>
      {complaintsWithCount.length === 0 && <Loader />}
      {complaintsWithCount.map((option, index) => (
        <CheckBox
          key={index}
          onChange={(e) => onAssignmentChange(e, option)}
          checked={hasFilters ? pgrfilters.applicationStatus.some((e) => e.code === option.code) : false}
          label={`${option.name} (${option.count || 0})`}
        />
      ))}
    </div>
  );
};

export default Status;
