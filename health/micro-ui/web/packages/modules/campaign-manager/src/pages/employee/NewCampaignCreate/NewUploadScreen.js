import { FormComposerV2, Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadConfig } from "../../../configs/uploadConfig";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";

const NewUploadScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [totalFormData, setTotalFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loader, setLoader] = useState(false);
  const [config, setUploadConfig] = useState(uploadConfig(totalFormData));
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const [summaryErrors, setSummaryErrors] = useState({});
  const [params, setParams] = Digit.Hooks.useSessionStorage("HCM_ADMIN_CONSOLE_UPLOAD_DATA", {});
  const [currentKey, setCurrentKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  const hirechyType = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID")?.hierarchyType || null;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const id = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA")?.id;

  // React Router-safe URL update - only updates if URL key differs from state
  const updateUrlParams = (p) => {
    const currentUrlKey = parseInt(new URLSearchParams(window.location.search).get("key"));
    const newKey = p.key;
    // Skip if URL already has the correct key (e.g., from navigate() in edit flow)
    if (currentUrlKey === newKey) return;

    const url = new URL(window.location.href);
    Object.entries(p).forEach(([k, v]) => url.searchParams.set(k, v));
    // Use navigate with replace to keep React Router in sync
    navigate(`${window.location.pathname}?${url.searchParams.toString()}`, { replace: true });
  };

  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "baseTimeout" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.baseTimeout` }
  );

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.CampaignDetails?.[0],
    },
  };
  const { data: campaignData } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const { mutate: updateMapping } = Digit.Hooks.campaign.useUpdateAndUploadExcel(tenantId);

  const reqUpdate = {
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  useEffect(() => setTotalFormData(params), [params]);
  useEffect(() => setUploadConfig(uploadConfig({ totalFormData, campaignData, summaryErrors })), [campaignData, totalFormData, summaryErrors]);
  useEffect(() => updateUrlParams({ key: currentKey }), [currentKey]);

  // Sync currentKey with URL changes (e.g., when edit button is clicked in DataUploadSummary)
  useEffect(() => {
    const keyParam = new URLSearchParams(location.search).get("key");
    if (keyParam && parseInt(keyParam) !== currentKey) {
      setCurrentKey(parseInt(keyParam));
    }
  }, [location.search]);

  const filterUploadConfig = (c, k) =>
    c
      .map((x) => ({ ...x, form: x?.form.filter((step) => parseInt(step.key) === k) }))
      .filter((x) => x.form.length > 0);
  const [filteredConfig, setfilteredConfig] = useState(filterUploadConfig(config, currentKey));
  useEffect(() => setfilteredConfig(filterUploadConfig(config, currentKey, summaryErrors)), [config, currentKey, summaryErrors]);

  const latestConfig = filteredConfig?.[0];

  const showErrorToast = (messageKey) => {
    setShowToast({ key: "error", label: messageKey });
    setTimeout(() => setShowToast(false), 3000);
  };

  // ---------------- helpers: canonical nested keys + extraction ----------------
  const outerToInner = {
    HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: "uploadFacility",
    HCM_CAMPAIGN_UPLOAD_USER_DATA: "uploadUser",
    HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: "uploadBoundary",
  };
  const outerToType = {
    HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: "facility",
    HCM_CAMPAIGN_UPLOAD_USER_DATA: "user",
    HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: "boundary",
  };

  const getNested = (root, outer, inner) => root?.[outer]?.[inner];

  const setNested = (root, outer, inner, value) => ({
    ...root,
    [outer]: {
      ...(root?.[outer] || {}),
      [inner]: value,
    },
  });

  // Bridge flat -> nested for the current step (so fresh uploads are captured)
  const bridgeFlatToNestedForStep = (base, formData, outer) => {
    const inner = outerToInner[outer];
    let next = { ...base };

    // If formData arrives as { [outer]: { uploadX } } we use that first.
    if (formData?.[outer]?.[inner]) {
      next = setNested(next, outer, inner, formData[outer][inner]);
    }

    // If fields saved flat (uploadFacility/uploadUser/uploadBoundary), copy them into nested.
    // This handles "fresh upload just submitted" cases.
    const flatCandidate =
      formData?.[inner] ||
      (formData?.[outer] && formData[outer][inner]) ||
      null;

    if (flatCandidate?.uploadedFile) {
      next = setNested(next, outer, inner, flatCandidate);
    }

    return next;
  };

  // Extract resources from nested snapshot (accepts filestoreId OR fileStoreId)
  const extractResourcesNested = (root) => {
    const out = [];
    Object.entries(outerToInner).forEach(([outer, inner]) => {
      const section = getNested(root, outer, inner);
      const files = section?.uploadedFile || [];
      files.forEach((f) => {
        const fid =
          f?.filestoreId ??
          f?.fileStoreId ??
          f?.file_store_id ??
          f?.fileStoreID ??
          f?.file_store_Id;
        if (fid) {
          out.push({
            type: outerToType[outer],
            filename: f?.filename,
            filestoreId: fid,
          });
        }
      });
    });
    return out;
  };
  // ---------------------------------------------------------------------------

  const onSubmit = async (formData) => {
    const step = latestConfig?.form?.[0];
    const name = step?.name; // HCM_CAMPAIGN_UPLOAD_*_DATA | DataUploadSummary
    const type = step?.body?.[0]?.customProps?.type; // "facility" | "user" | "boundary"
    const key = Object.keys(formData || {})?.[0];

    // ----- Summary validation (only nested keys considered) -----
    if (key === "DataUploadSummary") {
      const hasBoundary = !!getNested(totalFormData, "HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA", "uploadBoundary")?.uploadedFile?.[0]?.filestoreId ||
        !!getNested(totalFormData, "HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA", "uploadBoundary")?.uploadedFile?.[0]?.fileStoreId;
      const hasFacility = !!getNested(totalFormData, "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA", "uploadFacility")?.uploadedFile?.[0]?.filestoreId ||
        !!getNested(totalFormData, "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA", "uploadFacility")?.uploadedFile?.[0]?.fileStoreId;
      const hasUser = !!getNested(totalFormData, "HCM_CAMPAIGN_UPLOAD_USER_DATA", "uploadUser")?.uploadedFile?.[0]?.filestoreId ||
        !!getNested(totalFormData, "HCM_CAMPAIGN_UPLOAD_USER_DATA", "uploadUser")?.uploadedFile?.[0]?.fileStoreId;

      if (!hasBoundary) {
        setSummaryErrors((prev) => ({ ...prev, target: [{ name: "target", error: t("TARGET_FILE_MISSING") }] }));
        return showErrorToast(t("TARGET_DETAILS_ERROR"));
      }
      if (!hasFacility) {
        setSummaryErrors((prev) => ({ ...prev, facility: [{ name: "facility", error: t("FACILITY_FILE_MISSING") }] }));
        return showErrorToast(t("FACILITY_DETAILS_ERROR"));
      }
      if (!hasUser) {
        setSummaryErrors((prev) => ({ ...prev, user: [{ name: "user", error: t("USER_FILE_MISSING") }] }));
        return showErrorToast(t("USER_DETAILS_ERROR"));
      }

      navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`);
      return;
    }

    // ----- Mapping steps (unchanged logic, trimmed) -----
    if (name === "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA_MAPPING" && formData?.uploadFacilityMapping?.data?.length > 0) {
      setLoader(true);
      const data = formData?.uploadFacilityMapping?.data || [];
      const anyActive = data.some((r) => r.HCM_ADMIN_CONSOLE_FACILITY_USAGE === "Active");
      if (!anyActive) {
        setLoader(false);
        return showErrorToast(t("ONE_FACILITY_ATLEAST_SHOULD_BE_ACTIVE"));
      }
      const schemas = formData?.uploadFacilityMapping?.schemas;
      const invalid = data.some(
        (r) =>
          r?.[schemas?.find((i) => i.description === "Facility usage")?.name] === "Active" &&
          !r?.[schemas?.find((i) => i.description === "Boundary Code")?.name]
      );
      if (invalid) {
        setLoader(false);
        return showErrorToast(t("NO_BOUNDARY_SELECTED_FOR_ACTIVE_FACILITY"));
      }

      return updateMapping(
        {
          arrayBuffer: formData?.uploadFacilityMapping?.arrayBuffer,
          updatedData: data,
          tenantId,
          sheetNameToUpdate: "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES",
          schemas,
          t,
        },
        {
          onError: (error) => {
            setLoader(false);
            showErrorToast(error);
          },
          onSuccess: async (newFileStoreId) => {
            try {
              const useProcess = await Digit.Hooks.campaign.useProcessData(
                [{ filestoreId: newFileStoreId }],
                hirechyType,
                `${type}Validation`,
                tenantId,
                id,
                baseTimeOut?.[CONSOLE_MDMS_MODULENAME]
              );

              // write into nested facility
              const prev = getNested(params, "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA", "uploadFacility");
              const prevFile = prev?.uploadedFile?.[0] || {};
              const updated = {
                ...(prev || {}),
                uploadedFile: [{ ...prevFile, filestoreId: newFileStoreId, resourceId: useProcess?.id }],
                isSuccess: true,
              };
              const next = setNested(params, "HCM_CAMPAIGN_UPLOAD_FACILITY_DATA", "uploadFacility", updated);
              setParams(next);
              setTotalFormData(next);

              // now send resources from nested snapshot
              const resources = extractResourcesNested(next);
              await Digit.CustomService.getResponse({
                url: "/project-factory/v1/project-type/update",
                body: { CampaignDetails: { ...campaignData, resources } },
              });

              setLoader(false);
              setCurrentKey((k) => k + 1);
            } catch (e) {
              setLoader(false);
              showErrorToast(e?.response?.data?.Errors?.[0]?.description || t("UPLOAD_MAPPING_ERROR"));
            }
          },
        }
      );
    }

    if (name === "HCM_CAMPAIGN_UPLOAD_USER_DATA_MAPPING" && formData?.uploadUserMapping?.data?.length > 0) {
      setLoader(true);
      const data = formData?.uploadUserMapping?.data || [];
      const anyActive = data.some((r) => r.HCM_ADMIN_CONSOLE_USER_USAGE === "Active");
      if (!anyActive) {
        setLoader(false);
        return showErrorToast(t("ONE_USER_ATLEAST_SHOULD_BE_ACTIVE"));
      }
      const schemas = formData?.uploadUserMapping?.schemas;
      const invalid = data.some(
        (r) =>
          r?.[schemas?.find((i) => i.description === "User Usage")?.name] === "Active" &&
          !r?.[schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name]
      );
      if (invalid) {
        setLoader(false);
        return showErrorToast(t("NO_BOUNDARY_SELECTED_FOR_ACTIVE_USER"));
      }

      return updateMapping(
        {
          arrayBuffer: formData?.uploadUserMapping?.arrayBuffer,
          updatedData: data,
          tenantId,
          sheetNameToUpdate: "HCM_ADMIN_CONSOLE_USER_LIST",
          schemas,
          t,
        },
        {
          onError: (error) => {
            setLoader(false);
            showErrorToast(error);
          },
          onSuccess: async (newFileStoreId) => {
            try {
              const useProcess = await Digit.Hooks.campaign.useProcessData(
                [{ filestoreId: newFileStoreId }],
                hirechyType,
                `${type}Validation`,
                tenantId,
                id,
                baseTimeOut?.[CONSOLE_MDMS_MODULENAME]
              );

              const prev = getNested(params, "HCM_CAMPAIGN_UPLOAD_USER_DATA", "uploadUser");
              const prevFile = prev?.uploadedFile?.[0] || {};
              const updated = {
                ...(prev || {}),
                uploadedFile: [{ ...prevFile, filestoreId: newFileStoreId, resourceId: useProcess?.id }],
                isSuccess: true,
              };
              const next = setNested(params, "HCM_CAMPAIGN_UPLOAD_USER_DATA", "uploadUser", updated);
              setParams(next);
              setTotalFormData(next);

              const resources = extractResourcesNested(next);
              await Digit.CustomService.getResponse({
                url: "/project-factory/v1/project-type/update",
                body: { CampaignDetails: { ...campaignData, resources } },
              });

              setLoader(false);
              setCurrentKey((k) => k + 1);
            } catch (e) {
              setLoader(false);
              showErrorToast(e?.response?.data?.Errors?.[0]?.description || t("UPLOAD_MAPPING_ERROR"));
            }
          },
        }
      );
    }

    // ----- Regular upload step (facility/user/boundary) -----
    const outer = name; // HCM_CAMPAIGN_UPLOAD_*_DATA
    const inner = outerToInner[outer];

    // 1) Build a merged snapshot that *bridges* any flat value into nested for THIS step
    let snapshot = bridgeFlatToNestedForStep(params, formData, outer);

    // basic error checks on the slice for safety
    const slice = getNested(snapshot, outer, inner);
    if (
      (slice?.uploadedFile?.length && slice?.isError) ||
      (slice?.uploadedFile?.length && slice?.apiError)
    ) {
      return showErrorToast(t("ENTER_VALID_FILE"));
    }

    if (latestConfig?.form?.[0]?.last) {
      navigate(
        `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`
      );
    }

    // Persist immediately so next step sees defaults
    setParams(snapshot);
    setTotalFormData(snapshot);

    // 2) Build resources from the merged snapshot which now includes the fresh file
    const resources = extractResourcesNested(snapshot);

    // 3) Update campaign with those resources
    setLoader(true);
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: { CampaignDetails: { ...campaignData, resources } },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setLoader(false);
          setCurrentKey((k) => k + 1);
        },
        onError: () => {
          showErrorToast(t("HCM_ERROR_IN_CAMPAIGN_CREATION"));
          setLoader(false);
        },
      }
    );
  };

  const onSecondayActionClick = async () => {
    if (currentKey == 1) {
      navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignData?.campaignNumber}&tenantId=${campaignData?.tenantId}`);
    } else {
      setShowToast(null);
      setCurrentKey(currentKey - 1);
    }
  };

  if (loader) return <Loader page={true} variant={"OverlayLoader"} loaderText={t("PLEASE_WAIT_WHILE_UPDATING")} />;

  const closeToast = () => setShowToast(null);

  return (
    <>
      <FormComposerV2
        config={filteredConfig?.[0]?.form.map((cfg) => ({ ...cfg, body: cfg?.body.filter((a) => !a.hideInEmployee) }))}
        onSubmit={onSubmit}
        defaultValues={params}
        showSecondaryLabel={true}
        secondaryLabel={t("HCM_BACK")}
        actionClassName={"actionBarClass"}
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={config?.[0]?.form?.[0]?.last === true ? t("HCM_SUBMIT") : t("HCM_NEXT")}
        secondaryActionIcon={"ArrowBack"}
        primaryActionIconAsSuffix={true}
        primaryActionIcon={"ArrowDirection"}
      />
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default NewUploadScreen;
