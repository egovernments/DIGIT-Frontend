import React, { useState, useEffect, useMemo, Fragment } from "react";
import { Button, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

/**
 * Main component to handle download button click and trigger data download flow.
 */
const DownloadMaster = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      {clicked && <DownloadData setClicked={setClicked} />}
      <Button
        variation="secondary"
        onClick={() => setClicked(true)}
        label="Download"
      />
    </>
  );
};

/**
 * Utility function to download a JSON file with a timestamped filename.
 *
 * @param {Object} responseData - The data to be downloaded.
 * @param {string} baseFilename - Base name for the downloaded file.
 */
const downloadJSON = (responseData, baseFilename = "data") => {
  const dateTime = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${baseFilename}-${dateTime}.json`;

  const blob = new Blob([JSON.stringify(responseData, null, 2)], {
    type: "application/json",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Component that fetches master data based on query params and downloads it.
 *
 * @param {Function} setClicked - Function to reset the clicked state.
 */
const DownloadData = ({ setClicked }) => {
  const { t } = useTranslation();
  const { masterName: master, moduleName: modulee, tenantId } = Digit.Hooks.useQueryParams();

  // Build API criteria using useMemo for efficiency
  const criteriaToDownload = useMemo(() => {
    return Digit.Utils.mdms.getMDMSV1Criteria(
      tenantId || Digit.ULBService.getCurrentTenantId(),
      modulee,
      [{ name: master}],
      `MASTERDATADOWNLOAD-${modulee}-${master}`,
      {
        enabled: !!modulee,
        ...Digit.Utils.mdms.getMDMSV1Selector(modulee, master),
      }
    );
  }, [modulee, master, tenantId]);

  const { isLoading, data ,error} = Digit.Hooks.useCustomAPIHook(criteriaToDownload);

  // Trigger download when data is available
  useEffect(() => {
    if ( data) {
      downloadJSON(data, `backup-${modulee}.${master}`);
      setClicked(false);

    } else {
      console.error("No data found for download.");
    }

    // Reset clicked state after attempting download
  }, [data]);

    // Trigger download when data is available
    useEffect(() => {
        if ( error) {
            console.error("some erorr occured.",error);
            setClicked(false);
    
        } 
    
        // Reset clicked state after attempting download
      }, [error]);



  
  // Show loading indicator while fetching data
  if (isLoading) {
    return (
      <Loader
        page={true}
        variant="PageLoader"
        loaderText={t("WBH_DATA_FETCHING_FROM_SERVER")}
      />
    );
  }

  return null;
};

export default DownloadMaster;
