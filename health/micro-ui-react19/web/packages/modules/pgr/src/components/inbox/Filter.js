import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, RadioButtons, ActionBar, RemoveableTag, ApplyFilterBar, CloseSvg } from "@egovernments/digit-ui-react-components";
import Status from "./Status";

let pgrQuery = {};
let wfQuery = {};

const Filter = (props) => {
  const { uuid } = Digit.UserService.getUser().info;
  const { searchParams } = props;
  const { t } = useTranslation();

  const assignedToOptions = useMemo(
    () => [
      { code: "ASSIGNED_TO_ME", name: t("ASSIGNED_TO_ME") },
      { code: "ASSIGNED_TO_ALL", name: t("ASSIGNED_TO_ALL") },
    ],
    [t]
  );

  const isAssignedToMe = !!searchParams?.filters?.wfFilters?.assignee?.[0]?.code;
  const [selectAssigned, setSelectedAssigned] = useState(isAssignedToMe ? assignedToOptions[0] : assignedToOptions[1]);
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pgrfilters, setPgrFilters] = useState(
    searchParams?.filters?.pgrfilters || { serviceCode: [], locality: [], applicationStatus: [] }
  );
  const [wfFilters, setWfFilters] = useState(
    searchParams?.filters?.wfFilters || { assignee: [{ code: uuid }] }
  );

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: localities } = Digit.Hooks.useBoundaryLocalities(tenantId, "admin", {}, t);
  const serviceDefs = Digit.Hooks.pgr?.useServiceDefs?.(tenantId, "PGR") || [];

  const ifExists = (list, key) => list.some((obj) => obj.code === key.code);

  const onRadioChange = (value) => {
    setSelectedAssigned(value);
    const assigneeCode = value.code === "ASSIGNED_TO_ME" ? uuid : "";
    setWfFilters({ ...wfFilters, assignee: [{ code: assigneeCode }] });
  };

  const complaintType = (_type) => {
    const type = { i18nKey: t(`SERVICEDEFS.${_type.serviceCode.toUpperCase()}`), code: _type.serviceCode };
    if (!ifExists(pgrfilters.serviceCode, type)) {
      setPgrFilters({ ...pgrfilters, serviceCode: [...pgrfilters.serviceCode, type] });
    }
  };

  const onSelectLocality = (value) => {
    if (!ifExists(pgrfilters.locality, value)) {
      setPgrFilters({ ...pgrfilters, locality: [...pgrfilters.locality, value] });
    }
  };

  const onRemove = (index, key) => {
    setPgrFilters({ ...pgrfilters, [key]: pgrfilters[key].filter((_, i) => i !== index) });
  };

  const handleAssignmentChange = (e, type) => {
    if (e.target.checked) {
      setPgrFilters({ ...pgrfilters, applicationStatus: [...pgrfilters.applicationStatus, { code: type.code }] });
    } else {
      setPgrFilters({ ...pgrfilters, applicationStatus: pgrfilters.applicationStatus.filter((v) => v.code !== type.code) });
    }
  };

  const clearAll = () => {
    setPgrFilters({ serviceCode: [], locality: [], applicationStatus: [] });
    setWfFilters({ assignee: [{ code: "" }] });
    pgrQuery = {};
    wfQuery = {};
    setSelectedAssigned("");
    setSelectedComplaintType(null);
    setSelectedLocality(null);
  };

  const handleFilterSubmit = () => {
    props.onFilterChange({ pgrQuery, wfQuery, wfFilters, pgrfilters });
  };

  useEffect(() => {
    pgrfilters.serviceCode.length > 1
      ? setSelectedComplaintType({ i18nKey: `${pgrfilters.serviceCode.length} selected` })
      : setSelectedComplaintType(pgrfilters.serviceCode[0]);
  }, [pgrfilters.serviceCode]);

  useEffect(() => {
    pgrfilters.locality.length > 1
      ? setSelectedLocality({ name: `${pgrfilters.locality.length} selected` })
      : setSelectedLocality(pgrfilters.locality[0]);
  }, [pgrfilters.locality]);

  useEffect(() => {
    ["serviceCode", "locality", "applicationStatus"].forEach((prop) => {
      const params = pgrfilters[prop].map((p) => p.code).join();
      if (params) pgrQuery[prop] = params;
      else delete pgrQuery[prop];
    });
    const assigneeParam = wfFilters.assignee?.map((p) => p.code).join();
    if (assigneeParam) wfQuery.assignee = assigneeParam;
    else wfQuery = {};

    if (props.type !== "mobile") handleFilterSubmit();
  }, [pgrfilters, wfFilters]);

  const GetSelectOptions = (label, options, selected, select, optionKey, key) => {
    selected = selected || { [optionKey]: " ", code: "" };
    return (
      <div>
        <div className="filter-label">{label}</div>
        <Dropdown option={options} selected={selected} select={(value) => select(value, key)} optionKey={optionKey} />
        <div className="tag-container">
          {pgrfilters[key]?.map((value, index) => (
            <RemoveableTag key={index} text={`${value[optionKey]?.slice(0, 22)} ...`} onClick={() => onRemove(index, key)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>{t("ES_COMMON_CLEAR_ALL")}</div>
            {props.type === "mobile" && <span onClick={props.onClose}><CloseSvg /></span>}
          </div>
          <RadioButtons onSelect={onRadioChange} selectedOption={selectAssigned} optionsKey="name" options={assignedToOptions} />
          {GetSelectOptions(t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"), serviceDefs, selectedComplaintType, complaintType, "i18nKey", "serviceCode")}
          {GetSelectOptions(t("CS_PGR_LOCALITY"), localities, selectedLocality, onSelectLocality, "i18nkey", "locality")}
          <Status complaints={props.complaints} onAssignmentChange={handleAssignmentChange} pgrfilters={pgrfilters} />
        </div>
      </div>
      <ActionBar>
        {props.type === "mobile" && (
          <ApplyFilterBar
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={() => { handleFilterSubmit(); props.onClose(); }}
          />
        )}
      </ActionBar>
    </>
  );
};

export default Filter;
