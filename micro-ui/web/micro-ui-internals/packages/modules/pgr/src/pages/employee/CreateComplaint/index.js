import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, Toast } from "@egovernments/digit-ui-react-components";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";

import { FormComposer } from "../../../components/FormComposer";
import { createComplaint } from "../../../redux/actions/index";

export const CreateComplaint = ({ parentUrl }) => {
  const { data: cities, isLoading }  = Digit.Utils.getMultiRootTenant()? Digit.Hooks.useTenants() :Digit.Hooks.pgr.useTenants();
  const [showToast, setShowToast] = useState(null);
  const { t } = useTranslation();

  const getCities = () => Digit.Utils.getMultiRootTenant() ?cities :cities?.filter((e) => e.code === Digit.ULBService.getCurrentTenantId()) || [] ;

  const [complaintType, setComplaintType] = useState({});
  const [subTypeMenu, setSubTypeMenu] = useState([]);
  const [subType, setSubType] = useState({});
  const [pincode, setPincode] = useState("");
  const [selectedCity, setSelectedCity] = useState( getCities()?.[0] || null);

  const cityData =  getCities();


  const { isLoading: hierarchyLOading, data: hierarchyType } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    "sandbox-ui",
    [{ name: "ModuleMasterConfig", filter: '[?(@.module == "PGR")].master[?(@.type == "boundary")]' }],
    {
      select: (data) => {
        const formattedData = data?.["sandbox-ui"]?.["ModuleMasterConfig"];
        return formattedData?.[0]?.code;
      },
    }
  );
  const stateIdForLocality = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getStateId() : cityData?.[0]?.code;
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    stateIdForLocality,
    hierarchyType,
    {
      enabled: Digit.Utils.getMultiRootTenant() ? !!hierarchyType : !!cityData?.[0],
    },
    t
  );

  const [localities, setLocalities] = useState(fetchedLocalities);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [pincodeNotValid, setPincodeNotValid] = useState(false);
  const [params, setParams] = useState({});
  const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  const menu = Digit.Hooks.pgr.useComplaintTypes({ stateCode: tenantId });
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const serviceDefinitions = Digit.GetServiceDefinitions;
  const client = useQueryClient();

  useEffect(() => {
    if (complaintType?.key && subType?.key && selectedCity?.code && selectedLocality?.code) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  }, [complaintType, subType, selectedCity, selectedLocality]);

  useEffect(() => {
    setLocalities(fetchedLocalities);
  }, [fetchedLocalities]);

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        closeToast();
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showToast]);


  useEffect(() => {
    if (!Digit.Utils.getMultiRootTenant()) {
      const city = cities?.find((obj) => obj.pincode?.find((item) => item == pincode));
      if (city?.code && city?.code === getCities()?.[0]?.code) {
        setPincodeNotValid(false);
        setSelectedCity(city);
        setSelectedLocality(null);
        const __localityList = fetchedLocalities;
        const __filteredLocalities = __localityList?.filter((city) => city["pincode"] == pincode);
        setLocalities(__filteredLocalities);
      } else if (pincode === "" || pincode === null) {
        setPincodeNotValid(false);
        setLocalities(fetchedLocalities);
      } else {
        setPincodeNotValid(true);
      }
    }
  }, [pincode]);

  async function selectedType(value) {
    if (value.key !== complaintType.key) {
      if (value.key === "Others") {
        setSubType({ name: "" });
        setComplaintType(value);
        setSubTypeMenu([{ key: "Others", name: t("SERVICEDEFS.OTHERS") }]);
      } else {
        setSubType({ name: "" });
        setComplaintType(value);
        setSubTypeMenu(await serviceDefinitions.getSubMenu(tenantId, value, t));
      }
    }
  }

  function selectedSubType(value) {
    setSubType(value);
  }

  // city locality logic
  const selectCity = async (city) => {
    // if (selectedCity?.code !== city.code) {}
    return;
  };

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  const wrapperSubmit = (data) => {
    // complaintType?.key && subType?.key && selectedCity?.code && selectedLocality?.code
    if (!complaintType?.key) {
      setShowToast({ key: "error", label: "TYPE_MISSING_ERROR" });
      return;
    }
    if (!subType?.key) {
      setShowToast({ key: "error", label: "TYPE_MISSING_ERROR" });
      return;
    }
    if (!selectedCity?.code) {
      setShowToast({ key: "error", label: "CITY_MISSING_ERROR" });
      return;
    }
    if (!selectedLocality?.code) {
      setShowToast({ key: "error", label: "LOCALITY_MISSING_ERROR" });
      return;
    }
    if (!canSubmit) return;
    setSubmitted(true);
    !submitted && onSubmit(data);
  };

  //On SUbmit
  const onSubmit = async (data) => {
    if (!canSubmit) return;
    const cityCode= Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getStateId() : cityCode;
    const city = Digit.Utils.getMultiRootTenant() ? selectedCity.name : selectedCity.city.name;

    const district = Digit.Utils.getMultiRootTenant() ? selectedCity.name : selectedCity.city.name;

    const region = Digit.Utils.getMultiRootTenant() ? selectedCity.name : selectedCity.city.name;
    const localityCode = selectedLocality.code;
    const localityName = selectedLocality.name;
    const landmark = data.landmark;
    const { key } = subType;
    const complaintType = key;
    const mobileNumber = data.mobileNumber;
    const name = data.name;
    const formData = { ...data, cityCode, city, district, region, localityCode, localityName, landmark, complaintType, mobileNumber, name };
    await dispatch(createComplaint(formData));
    await client.refetchQueries(["fetchInboxData"]);
    history.push(parentUrl + "/response");
  };

  const handlePincode = (event) => {
    const { value } = event.target;
    setPincode(value);
    if (!value) {
      setPincodeNotValid(false);
    }
  };

  const isPincodeValid = () => !pincodeNotValid;

  const config = [
    {
      head: t("ES_CREATECOMPLAINT_PROVIDE_COMPLAINANT_DETAILS"),
      body: [
        {
          label: t("ES_CREATECOMPLAINT_MOBILE_NUMBER"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "mobileNumber",
            validation: {
              required: true,
              pattern: /^[6-9]\d{9}$/,
            },
            componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "name",
            validation: {
              required: true,
              pattern: /^[A-Za-z][A-Za-z\s]*$/,
            },
            error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={menu || []} optionKey="name" id="complaintType" selected={complaintType} select={selectedType} />,
        },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"),
          isMandatory: true,
          type: "dropdown",
          menu: { ...subTypeMenu },
          populators: <Dropdown option={subTypeMenu} optionKey="name" id="complaintSubType" selected={subType} select={selectedSubType} />,
        },
      ],
    },
    {
      head: t("CS_ADDCOMPLAINT_LOCATION"),
      body: [
        {
          label: t("CORE_COMMON_PINCODE"),
          type: "text",
          populators: {
            name: "pincode",
            validation: { pattern: /^[1-9][0-9]{5}$/, validate: isPincodeValid },
            error: t("CORE_COMMON_PINCODE_INVALID"),
            onChange: handlePincode,
          },
        },
        {
          label: t("CS_COMPLAINT_DETAILS_CITY"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown
              isMandatory
              selected={selectedCity}
              freeze={true}
              option={getCities()}
              id="city"
              select={selectCity}
              optionKey={"i18nKey"}
              t={t}
            />
          ),
        },
        {
          label: t("CS_CREATECOMPLAINT_MOHALLA"),
          type: "dropdown",
          isMandatory: true,
          dependency: selectedCity && localities ? true : false,
          populators: (
            <Dropdown isMandatory selected={selectedLocality} optionKey="i18nkey" id="locality" option={localities} select={selectLocality} t={t} />
          ),
        },
        {
          label: t("CS_COMPLAINT_DETAILS_LANDMARK"),
          type: "textarea",
          populators: {
            name: "landmark",
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
          type: "textarea",
          populators: {
            name: "description",
          },
        },
      ],
    },
  ];
  return (
    <React.Fragment>
      <FormComposer
        heading={t("ES_CREATECOMPLAINT_NEW_COMPLAINT")}
        config={config}
        onSubmit={wrapperSubmit}
        fieldClassName="pgr-field-pair"
        // isDisabled={!canSubmit && !submitted}
        label={t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT")}
      />
      {showToast && <Toast error={showToast?.key} type={showToast?.key} label={showToast?.label} />}
    </React.Fragment>
  );
};
