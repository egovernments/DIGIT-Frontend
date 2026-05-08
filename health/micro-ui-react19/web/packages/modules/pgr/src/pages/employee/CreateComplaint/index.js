import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Dropdown, Toast } from "@egovernments/digit-ui-react-components";
import useCreateComplaint from "../../../hooks/useCreateComplaint";

// Employee-side complaint creation. Replaces Redux dispatch with useCreateComplaint mutation.
export const CreateComplaint = ({ parentUrl }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tenantId = Digit.SessionStorage.get("Employee.tenantId") || Digit.ULBService.getCurrentTenantId();
  const createComplaintMutation = useCreateComplaint(tenantId);

  const { data: cities } = Digit.Utils.getMultiRootTenant?.()
    ? Digit.Hooks.useTenants()
    : Digit.Hooks.pgr?.useTenants?.() || { data: [] };

  const getCities = () =>
    Digit.Utils.getMultiRootTenant?.()
      ? cities
      : cities?.filter((e) => e.code === tenantId) || [];

  const [showToast, setShowToast] = useState(null);
  const [complaintType, setComplaintType] = useState({});
  const [subTypeMenu, setSubTypeMenu] = useState([]);
  const [subType, setSubType] = useState({});
  const [pincode, setPincode] = useState("");
  const [selectedCity, setSelectedCity] = useState(getCities()?.[0] || null);
  const [localities, setLocalities] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ mobileNumber: "", name: "", landmark: "", description: "" });

  const menu = Digit.Hooks.pgr?.useComplaintTypes?.({ stateCode: tenantId }) || [];

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "admin",
    { enabled: !!selectedCity?.code },
    t
  );

  useEffect(() => {
    setLocalities(fetchedLocalities || []);
  }, [fetchedLocalities]);

  useEffect(() => {
    setSubmitValve(!!(complaintType?.key && subType?.key && selectedCity?.code && selectedLocality?.code));
  }, [complaintType, subType, selectedCity, selectedLocality]);

  useEffect(() => {
    let timer;
    if (showToast) timer = setTimeout(() => setShowToast(null), 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const selectedTypeHandler = async (value) => {
    if (value.key !== complaintType.key) {
      setSubType({});
      setComplaintType(value);
      if (value.key === "Others") {
        setSubTypeMenu([{ key: "Others", name: t("SERVICEDEFS.OTHERS") }]);
      } else {
        const sub = await Digit.GetServiceDefinitions?.getSubMenu(tenantId, value, t);
        setSubTypeMenu(sub || []);
      }
    }
  };

  const onSubmit = async () => {
    if (!complaintType?.key) return setShowToast({ key: "error", label: "TYPE_MISSING_ERROR" });
    if (!subType?.key) return setShowToast({ key: "error", label: "TYPE_MISSING_ERROR" });
    if (!selectedCity?.code) return setShowToast({ key: "error", label: "CITY_MISSING_ERROR" });
    if (!selectedLocality?.code) return setShowToast({ key: "error", label: "LOCALITY_MISSING_ERROR" });
    if (!canSubmit || submitted) return;
    setSubmitted(true);

    const payload = {
      ...formData,
      cityCode: selectedCity.code,
      city: selectedCity.city?.name || selectedCity.name,
      localityCode: selectedLocality.code,
      localityName: selectedLocality.name,
      complaintType: subType.key,
    };

    createComplaintMutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pgr-inbox"] });
        navigate(parentUrl ? `${parentUrl}/response` : `/${window?.contextPath}/employee/pgr/response`);
      },
      onError: () => {
        setSubmitted(false);
        setShowToast({ key: "error", label: "CS_COMMON_COMPLAINT_NOT_SUBMITTED" });
      },
    });
  };

  const handleField = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="pgr-create-complaint">
      <h2>{t("ES_CREATECOMPLAINT_NEW_COMPLAINT")}</h2>
      <div className="pgr-field-pair">
        <label>{t("ES_CREATECOMPLAINT_MOBILE_NUMBER")} *</label>
        <input name="mobileNumber" value={formData.mobileNumber} onChange={handleField} pattern="^[6-9]\d{9}$" />
      </div>
      <div className="pgr-field-pair">
        <label>{t("ES_CREATECOMPLAINT_COMPLAINT_NAME")} *</label>
        <input name="name" value={formData.name} onChange={handleField} />
      </div>
      <div className="pgr-field-pair">
        <label>{t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE")} *</label>
        <Dropdown option={menu || []} optionKey="name" selected={complaintType} select={selectedTypeHandler} />
      </div>
      <div className="pgr-field-pair">
        <label>{t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE")} *</label>
        <Dropdown option={subTypeMenu} optionKey="name" selected={subType} select={setSubType} />
      </div>
      <div className="pgr-field-pair">
        <label>{t("CS_COMPLAINT_DETAILS_CITY")} *</label>
        <Dropdown option={getCities()} optionKey="i18nKey" selected={selectedCity} select={setSelectedCity} t={t} />
      </div>
      <div className="pgr-field-pair">
        <label>{t("CS_CREATECOMPLAINT_MOHALLA")} *</label>
        <Dropdown option={localities} optionKey="i18nkey" selected={selectedLocality} select={setSelectedLocality} t={t} />
      </div>
      <div className="pgr-field-pair">
        <label>{t("CS_COMPLAINT_DETAILS_LANDMARK")}</label>
        <textarea name="landmark" value={formData.landmark} onChange={handleField} />
      </div>
      <div className="pgr-field-pair">
        <label>{t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS")}</label>
        <textarea name="description" value={formData.description} onChange={handleField} />
      </div>
      <button onClick={onSubmit} disabled={!canSubmit || submitted || createComplaintMutation.isPending}>
        {t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT")}
      </button>
      {showToast && <Toast error={showToast?.key === "error"} label={t(showToast?.label)} />}
    </div>
  );
};
