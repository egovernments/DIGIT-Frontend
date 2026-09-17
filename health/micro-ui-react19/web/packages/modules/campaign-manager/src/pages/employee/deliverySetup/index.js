import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardLabel, CardText, FieldV1, HeaderComponent, LabelFieldPair, Loader } from "@egovernments/digit-ui-components";
import CycleConfiguration from "../CycleConfiguration";
import TagComponent from "../../../components/TagComponent";
import { convertEpochToNewDateFormat } from "../../../utils/convertEpochToNewDateFormat";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import DeliveryMethodSelection from "../../../components/CreateCampaignComponents/DeliveryMethodSelection";
import getDeliveryConfig from "../../../utils/getDeliveryConfig";
import useCampaignStore from "../../../hooks/useCampaignStore";
import {
  getCampaignDeliveryMethods,
  getDeliveryMethods,
  getRoundType,
  getSelectedMethodCodes,
  normaliseSelection,
  usesDeliveryMethods,
} from "../../../utils/deliveryMethods";

// The shift the module applies when storing a date, so the text of the stored string reads as the
// day that was picked. Fixed rather than derived from the browser, matching DateSelection and
// CycleConfiguration - changing it here alone would put delivery dates out of step with the
// campaign and cycle dates, so it has to be changed in all three together or not at all.
const DATE_STORAGE_OFFSET_IN_MS = 19800000;

/**
 * Normalise a date coming out of the date field before it is stored.
 *
 * The field reports the picked day as an ISO string taken from local midnight, so its text already
 * reads as the previous day anywhere ahead of UTC. Every date on a campaign is therefore shifted
 * so the text reads as the day that was picked - this is what the epoch conversion at save time
 * reads, since it matches the date out of the string and ignores the time.
 *
 * Identical to what DateSelection does for the campaign dates and CycleConfiguration for the cycle
 * dates; delivery dates are stored the same way so all three agree.
 */
const toStoredDate = (picked) => {
  if (!picked) return "";
  const localDate = new Date(picked);
  if (Number.isNaN(localDate.getTime())) return "";
  localDate.setHours(0, 0, 0, 0);
  return new Date(localDate.getTime() + DATE_STORAGE_OFFSET_IN_MS).toISOString();
};

/** A stored date back into the YYYY-MM-DD the date field expects. Mirrors CycleConfiguration. */
const toDateInput = (storedDate) => {
  if (!storedDate) return "";
  const d = new Date(storedDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

/** The campaign's own start and end are epochs. Read from local parts, as CycleConfiguration does. */
const convertEpochToDate = (epoch) => {
  if (!epoch) return "";
  const date = new Date(Number(epoch));
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/**
 * Step 3a of the campaign wizard.
 *
 * For a campaign type that declares `deliveryMethods` in MDMS this asks for the delivery dates and
 * which delivery strategies apply. For every other campaign type it renders the existing cycle
 * configuration screen untouched, so nothing changes for them.
 *
 * The dates are not a new field - they are cycle 1's dates, written in the same session shape
 * CycleConfiguration writes, so the save transform, draft resume and summary screens keep working.
 */
const DeliveryStrategySetup = ({ onSelect, formData, control, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");

  const [formStorageData] = useCampaignStore("HCM_CAMPAIGN_MANAGER_FORM_DATA", {});
  const selectedProjectType = formStorageData?.HCM_CAMPAIGN_TYPE?.projectType?.code || searchParams.get("projectType");

  const { isLoading: mdmsLoading, data: mdmsData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    { staleTime: 0, cacheTime: 0, enabled: !!selectedProjectType },
    { schemaCode: "HCM-PROJECT-TYPES.projectTypes" }
  );

  const { data: campaignData, isLoading: campaignLoading } = Digit.Hooks.useCustomAPIHook({
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      cacheTime: 0,
      staleTime: 0,
      refetchOnMount: "always",
      select: (d) => d?.CampaignDetails?.[0],
    },
  });

  const projectTypeRecord = useMemo(
    () => mdmsData?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes?.find((e) => e?.code === selectedProjectType),
    [mdmsData, selectedProjectType]
  );

  const roundType = getRoundType(campaignData, formStorageData);
  const methods = useMemo(() => getDeliveryMethods(projectTypeRecord), [projectTypeRecord]);
  const applies = usesDeliveryMethods(projectTypeRecord, roundType);

  // What was entered before can sit in either place: the wizard's session while moving between
  // steps, or on the campaign itself once a draft has been saved. CycleConfiguration resolves the
  // dates the same way.
  const savedCycleConfigure = formStorageData?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
  const campaignCycleConfigure = campaignData?.additionalDetails?.cycleData;
  const savedCycle = savedCycleConfigure?.cycleData?.find((c) => c?.key === 1);

  // Held in the stored shape rather than the display shape, so what is published matches the cycle
  // dates CycleConfiguration writes. The date fields convert on the way in and out.
  const [fromDate, setFromDate] = useState(savedCycle?.fromDate || "");
  const [toDate, setToDate] = useState(savedCycle?.toDate || "");
  const [selected, setSelected] = useState(() => getSelectedMethodCodes(savedCycleConfigure));

  // The campaign arrives after the first render, so anything only stored there is picked up here.
  // Until this has run, nothing is published upward - otherwise the empty initial state would
  // overwrite a selection that was saved earlier.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!applies || hydrated.current) return;
    if (campaignNumber && campaignLoading) return;

    // Resolve each field on its own. The session can hold the dates while the strategies only
    // exist on the campaign, so preferring one whole source over the other loses half of it.
    // On the campaign the strategies may sit on the cycle configuration or, for campaigns saved
    // before that was carried, only on the deliveries themselves - getCampaignDeliveryMethods
    // reads both.
    const codes =
      getSelectedMethodCodes(savedCycleConfigure).length > 0
        ? getSelectedMethodCodes(savedCycleConfigure)
        : getCampaignDeliveryMethods(campaignData);
    if (codes.length > 0) setSelected(codes);

    const cycle =
      savedCycleConfigure?.cycleData?.find((c) => c?.key === 1) || campaignCycleConfigure?.cycleData?.find((c) => c?.key === 1);
    if (cycle?.fromDate) setFromDate(cycle.fromDate);
    if (cycle?.toDate) setToDate(cycle.toDate);

    hydrated.current = true;
  }, [applies, campaignLoading, savedCycleConfigure, campaignCycleConfigure, campaignData]);

  // Drop anything the campaign type no longer offers, and keep declared order.
  useEffect(() => {
    if (!applies || methods.length === 0) return;
    const cleaned = normaliseSelection(selected, methods);
    if (cleaned.length !== selected.length || cleaned.some((c, i) => c !== selected[i])) {
      setSelected(cleaned);
    }
  }, [applies, methods]);

  const campaignRange = useMemo(
    () => ({
      startDate: formStorageData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || convertEpochToDate(campaignData?.startDate),
      endDate: formStorageData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || convertEpochToDate(campaignData?.endDate),
    }),
    [formStorageData, campaignData]
  );

  const deliveryConfig = useMemo(() => {
    if (!mdmsData || !selectedProjectType) return null;
    return getDeliveryConfig({ data: mdmsData?.MdmsRes?.["HCM-PROJECT-TYPES"], projectType: selectedProjectType });
  }, [mdmsData, selectedProjectType]);

  // Publish upward in the shape CycleConfiguration uses, plus the chosen methods.
  useEffect(() => {
    if (!applies || !hydrated.current) return;
    onSelect("cycleConfigure", {
      cycleConfgureDate: {
        cycle: 1,
        deliveries: selected.length || 1,
        IsDisable: true,
        observationStrategy: deliveryConfig?.cycleConfig?.observationStrategy || "DOT1",
      },
      cycleData: fromDate && toDate ? [{ key: 1, fromDate, toDate }] : [],
      deliveryMethods: selected,
      deliveryConfig,
    });
  }, [applies, selected, fromDate, toDate, deliveryConfig, hydrated.current]);

  if (mdmsLoading || (campaignNumber && campaignLoading)) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  // Campaign types that do not use delivery methods keep the existing screen.
  if (!applies) {
    return <CycleConfiguration onSelect={onSelect} formData={formData} control={control} {...props} />;
  }

  return (
    <div className="container">
      <div className="card-container2">
        {campaignRange?.startDate && campaignRange?.endDate && (
          <TagComponent
            campaignName={`${convertEpochToNewDateFormat(campaignRange.startDate)} - ${convertEpochToNewDateFormat(campaignRange.endDate)}`}
          />
        )}
        {selectedProjectType && (
          <HeaderComponent styles={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} className="select-boundary-screen-heading">
            {t(`CAMPAIGN_PROJECT_${selectedProjectType.toUpperCase()}`)}
          </HeaderComponent>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <Card>
            <HeaderComponent className="cycle-configuration-heading">{t("HCM_DELIVERY_DATES_HEADING")}</HeaderComponent>
            <CardText style={{ fontSize: "16px", color: "#505a5f", marginBottom: "0rem" }}>{t("HCM_DELIVERY_DATES_DESC")}</CardText>
            <LabelFieldPair>
              <CardLabel className="cycleBold" style={{ fontWeight: "700", width: "40%" }}>
                {t("HCM_DELIVERY_DATES_LABEL")}
                <span className="mandatory-span">*</span>
              </CardLabel>
              <div className="date-field-container" style={{padding:"0rem"}}>
                <FieldV1
                  type="date"
                  placeholder={t(I18N_KEYS.PAGES.FROM_DATE)}
                  value={toDateInput(fromDate)}
                  withoutLabel={true}
                  populators={{ newDateFormat: true, min: campaignRange?.startDate, max: campaignRange?.endDate }}
                  onChange={(d) => {
                    const next = toStoredDate(d);
                    setFromDate(next);
                    // A start date past the current end date leaves an impossible range, so the end
                    // date is cleared and has to be picked again.
                    if (toDate && next && new Date(toDate) < new Date(next)) setToDate("");
                  }}
                />
                <FieldV1
                  type="date"
                  placeholder={t(I18N_KEYS.PAGES.TO_DATE)}
                  value={toDateInput(toDate)}
                  withoutLabel={true}
                  disabled={!fromDate}
                  populators={{
                    newDateFormat: true,
                    min: toDateInput(fromDate) || campaignRange?.startDate,
                    max: campaignRange?.endDate,
                  }}
                  onChange={(d) => {
                    setToDate(toStoredDate(d));
                  }}
                />
              </div>
            </LabelFieldPair>
          </Card>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <Card>
            <DeliveryMethodSelection
              methods={methods}
              selected={selected}
              onChange={(next) => setSelected(next)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStrategySetup;
