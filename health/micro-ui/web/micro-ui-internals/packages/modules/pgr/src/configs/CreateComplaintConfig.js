export const CreateComplaintConfig =  [
    {
      head: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
      body: [
        {
          label: t("HR_NATIONAL_CAMPAIGN_NAME_LABEL"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown
              option={assignedProjectsDropDown}
              optionKey="name"
              id="campaign"
              selected={selectedCampaign}
              select={(e) => {
                setSelectedCampaign(e);
              }}
              t={t}
            />
          ),
        },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown
              option={complaintTypes}
              optionKey="name"
              id="complaintType"
              selected={selectedComplaintType}
              select={(e) => {
                setSelectedComplaintType(e);
              }}
              t={t}
            />
          ),
        },
        {
          label: t("CS_COMPLAINT_DETAILS_COMPLAINT_DATE"),
          isMandatory: true,
          type: "date",
          populators: {
            name: "dateOfComplaint",
            validation: {
              required: true,
            },
            date: complaintDate,
            onChange: (e) => {
              setComplaintDate(e);
            },
            max: Digit.Utils.date.getDate(),
            defaultValue: Digit.Utils.date.getDate(),
            error: t("CORE_COMMON_REQUIRED_ERRMSG"),
            isRequired: true,
          },
        },
        {
          label: t("WBH_MDMS_HCM_ADMIN_CONSOLE_BOUNDARY"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <Dropdown
              option={boundaryChildren}
              optionKey="name"
              selected={selectedLocality}
              select={(value) => {
                setSelectedLocality(value)}}
              t={t}
            /> ),
          },

        {
          label: t("ES_CREATECOMPLAINT_FOR"),
          isMandatory: true,
          type: "radio",
          populators: {
            name: "complaintCreatedFor",
            value: complaintCreatedFor,
            onChange: (e) => {
              setComplaintCreatedFor(e);
              if (e.code === "ONE") {
                setComplainantName(userInfo.name);
                setComplainantMobileNumber(userInfo.mobileNumber);
                setSelectedCountryCode((userInfo?.mobileNumber?.length === 9) ?
                    PGRConstants.MOZ_COUNTRY_CODE : PGRConstants.INDIA_COUNTRY_CODE);
              } else {
                setComplainantName("");
                setComplainantMobileNumber("");
              }
            },
            validation: {
              required: true,
            },
            error: t("CORE_COMMON_REQUIRED_ERRMSG"),
          },
        },
      ],
    },
    {
      head: t("ES_CREATECOMPLAINT_PROVIDE_COMPLAINANT_DETAILS"),
      body: [
        {
          label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "name",
            maxlength: 64,
            value: complainantName,
            onChange: (e) => {
              setComplainantName(e.target.value);
            },
            validation: {
              required: true,
              pattern: /^[A-Za-z]/,
            },
            error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_MOBILE_NUMBER"),
          isMandatory: true,
          type: "number",
          populators: {
            name: "mobileNumber",
            maxlength: (selectedCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? 9 : 10,
            value: complainantMobileNumber,
            onChange: (e) => {
              setComplainantMobileNumber(e.target.value);
            },
            validation: {
              required: true,
              pattern: (selectedCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? /^[0-9]\d{8}$/ : /^[6-9]\d{9}$/,
            },
            componentInFront: <div className="citizen-card-input citizen-card-input--front">
              <select value={selectedCountryCode} onChange={(e) => {setSelectedCountryCode(e.target.value);setComplainantMobileNumber("")}}>
                <option value={PGRConstants.INDIA_COUNTRY_CODE}>{PGRConstants.INDIA_COUNTRY_CODE}</option>
                <option value={PGRConstants.MOZ_COUNTRY_CODE}>{PGRConstants.MOZ_COUNTRY_CODE}</option>
              </select>
            </div>,
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_SUPERVISOR_NAME"),
          isMandatory: false,
          type: "text",
          populators: {
            name: "supervisorName",
            maxlength: 64,
            validation: {
              pattern: /^[A-Za-z]/,
            },
            error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
          },
        },
        {
          label: t("ES_CREATECOMPLAINT_SUPERVISOR_MOBILE_NUMBER"),
          isMandatory: false,
          type: "number",
          populators: {
            name: "supervisorMobileNumber",
            maxlength: (supervisorCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? 9 : 10,
            validation: {
              pattern: (supervisorCountryCode === PGRConstants.MOZ_COUNTRY_CODE) ? /^[0-9]\d{8}$/ : /^[6-9]\d{9}$/
            },
            componentInFront: <div className="citizen-card-input citizen-card-input--front">
              <select value={supervisorCountryCode} onChange={(e) => {setSupervisorCountryCode(e.target.value)}}>
                <option value={PGRConstants.INDIA_COUNTRY_CODE}>{PGRConstants.INDIA_COUNTRY_CODE}</option>
                <option value={PGRConstants.MOZ_COUNTRY_CODE}>{PGRConstants.MOZ_COUNTRY_CODE}</option>
              </select>
            </div>,
            error: t("CORE_COMMON_MOBILE_ERROR"),
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS_DESCRIPTION"),
          isMandatory: true,
          type: "textarea",
          populators: {
            name: "description",
            maxLength: 1000,
            validation: {
              required: true,
            },
            error: t("CORE_COMMON_REQUIRED_ERRMSG"),
          },
        },
      ],
    },
    {
      head: t("CS_COMPLAINT_LOCATION_DETAILS"),
      body: [
        {
          label: t("CS_COMPLAINT_DETAILS_ADDRESS_1_DETAILS"),
          type: "text",
          populators: {
            name: "buildingName",
            maxlength: 64,
          },
        },
        {
          label: t("CS_COMPLAINT_DETAILS_ADDRESS_2_DETAILS"),
          type: "text",
          populators: {
            name: "street",
            maxlength: 64,
          },
        },
        {
          label: t("CS_COMPLAINT_LANDMARK__DETAILS"),
          type: "text",
          populators: {
            name: "landmark",
            maxlength: 64,
          },
        },
        {
          label: t("CS_COMPLAINT_POSTALCODE__DETAILS"),
          type: "number",
          populators: {
            name: "pincode",
            maxlength: 6,
            validation: {
              pattern: /^[1-9][0-9]{5}$/i,
            },
          },
        },
      ],
    },
  ];