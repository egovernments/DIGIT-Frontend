import { Timeline, TimelineMolecule, AlertCard , Button } from "@egovernments/digit-ui-components";
import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { downloadExcelWithCustomName } from "../utils";
import { CONSOLE_MDMS_MODULENAME } from "../Module";

function epochToDateTime(epoch) {
  // Create a new Date object using the epoch time
  const date = new Date(epoch);
  // Extract the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  // Extract the time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Determine AM/PM and convert to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");

  // Format the date and time
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

  // Return the formatted date and time
  return `${formattedDate} ${formattedTime}`;
}

const TimelineComponent = ({ campaignId, resourceId }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const [userCredential, setUserCredential] = useState(null);
  const [newResourceId, setNewResourceId] = useState(resourceId);
  const [searchDATA, setSearchDATA] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(tenantId, CONSOLE_MDMS_MODULENAME, [{ name: "baseTimeOut" }]);

  const formatLabel = (label) => {
    if (!label) return null;
    return `HCM_${label.replace(/-/g, "_").toUpperCase()}`;
  };

  const fetchUser = async () => {
    const responseTemp = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/data/_search`,
      body: {
        SearchCriteria: {
          tenantId: tenantId,
          id: newResourceId,
        },
      },
    });

    const response = responseTemp?.ResourceDetails?.map((i) => i?.processedFilestoreId);

    if (response?.[0]) {
      setUserCredential({ fileStoreId: response?.[0], customName: "userCredential" });
    }
  };

  // useEffect(() => {
  //   if (newResourceId?.length > 0) {
  //     fetchUser();
  //   }
  // }, [newResourceId && lastCompletedProcess]);

  const downloadUserCred = async () => {
    downloadExcelWithCustomName(userCredential);
  };

  const reqCriteria = {
    url: `/project-factory/v1/project-type/getProcessTrack`,
    params: {
      campaignId: campaignId,
      tenantId: tenantId
    },
  };
  // use refetch interval in this
  const { data: progessTrack , refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const lastCompletedProcess = progessTrack?.processTrack
    .filter((process) => process.status === "completed" && process.showInUi === true)
    .reduce((latestProcess, currentProcess) => {
      if (!latestProcess || currentProcess.lastModifiedTime > latestProcess.lastModifiedTime) {
        return currentProcess;
      }
      return latestProcess;
    }, null);

  const failedProcess = progessTrack?.processTrack
    .filter((process) => process.status === "failed")
    .reduce((latestProcess, currentProcess) => {
      return latestProcess === null || currentProcess.lastModifiedTime > latestProcess.lastModifiedTime ? currentProcess : latestProcess;
    }, null);

  const searchAPIData = async (campaignId, resourceId) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/project-factory/v1/project-type/search",
        body: {
          CampaignDetails: {
            tenantId: tenantId,
            ids: [campaignId],
          },
        },
      });
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.Errors?.[0].description);
    }
  };

  useEffect(() => {
    if (
      resourceId.length === 0 &&
      lastCompletedProcess?.type === "campaign-creation" &&
      lastCompletedProcess?.status === "completed" &&
      !dataFetched
    ) {
      const fetchData = async () => {
        try {
          const data = await searchAPIData(campaignId);
          setSearchDATA(data);
          setDataFetched(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [campaignId, newResourceId, lastCompletedProcess, dataFetched]);

  useEffect(() => {
    if (searchDATA) {
      const userResource = searchDATA?.CampaignDetails?.[0]?.resources?.find((resource) => resource.type === "user");
      if (userResource) {
        setNewResourceId([userResource?.createResourceId]);
      }
    }
  }, [searchDATA]);

  useEffect(() => {
    let intervalId;

    if (failedProcess?.status !== "failed" && lastCompletedProcess?.type !== "campaign-creation") {
      intervalId = setInterval(() => {
        refetch();
      }, baseTimeOut?.[CONSOLE_MDMS_MODULENAME]?.baseTimeOut?.[0]?.timelineRefetch);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lastCompletedProcess]);

  // useEffect(() => {
  //   if (lastCompletedProcess?.type === "campaign-creation") {
  //     fetchUser(); // Fetch the user credentials again after the campaign is created
  //   }
  // }, [lastCompletedProcess]);
  useEffect(() => {
    if (newResourceId?.length > 0) {
      fetchUser();
    }
  }, [newResourceId, lastCompletedProcess]);

  const completedProcesses = progessTrack?.processTrack
    .filter((process) => process.status === "completed" && process.showInUi === true)
    .sort((a, b) => b.lastModifiedTime - a.lastModifiedTime)
    .map((process) => ({ type: process.type, lastModifiedTime: process.lastModifiedTime }));

  const completedTimelines = completedProcesses?.map((process) => ({
    label: t(formatLabel(process?.type)),
    subElements: [epochToDateTime(process.lastModifiedTime)],
  }));

  const inprogressProcesses = progessTrack?.processTrack
    .filter((process) => process.status === "inprogress" && process.showInUi === true)
    .map((process) => ({ type: process.type, lastModifiedTime: process.lastModifiedTime }));

  const inProgressTimelines = inprogressProcesses?.map((process) => ({
    label: t(formatLabel(process?.type)),
    subElements: [epochToDateTime(process.lastModifiedTime)],
  }));

  const upcomingProcesses = progessTrack?.processTrack
    .filter((process) => process.status === "toBeCompleted" && process.showInUi === true)
    .map((process) => ({ type: process.type, lastModifiedTime: process.lastModifiedTime }));

  const upcomingTimelines = upcomingProcesses?.map((process) => ({
    label: t(formatLabel(process?.type)),
    subElements: [epochToDateTime(process.lastModifiedTime)],
  }));
  
  return (
    <React.Fragment>
      <div className="timeline-user" style={{marginBottom:"1rem"}}>
        {progessTrack ? (
          (() => {
            const processesToRender = [];
            let foundFirstFailed = false;
            let allCompleted = true;
  
            for (let i = 0; i < progessTrack?.processTrack?.length; i++) {
              const process = progessTrack?.processTrack[i];
              if (process.status === "failed") {
                processesToRender.push(
                  <Timeline
                    key={i}
                    isError
                    label={t(formatLabel(process?.type))}
                    showDefaultValueForDate
                    subElements={[epochToDateTime(process.lastModifiedTime)]}
                    variant="completed"
                  />
                );
                foundFirstFailed = true;
                allCompleted = false; // Mark as not all completed
                break;
              } else {
                if (process.showInUi) {
                  let variant = "completed";
                  if (process.status === "inprogress") {
                    variant = "inprogress";
                    allCompleted = false; // If any process is in progress, mark as not all completed
                  } else if (process.status === "toBeCompleted") {
                    variant = "upcoming";
                    allCompleted = false; // If any process is upcoming, mark as not all completed
                  }
                  if(process?.type === "campaign-creation")
                  {
                    processesToRender.push(
                      <Timeline
                        key={i}
                        label={t(formatLabel(process?.type))}
                        subElements={[epochToDateTime(process.lastModifiedTime)]}
                        variant={variant}
                        showConnector={true}
                        additionalElements={[
                          // {userCredential && lastCompletedProcess?.type === "campaign-creation" && (
                            <Button
                              label={t("CAMPAIGN_DOWNLOAD_USER_CRED")}
                              variation="primary"
                              icon={"DownloadIcon"}
                              type="button"
                              className="campaign-download-template-btn hover"
                              onClick={downloadUserCred}
                            />
                          // )}
                        ]}
                      />
                    );
                  }
                  else{
                  processesToRender.push(
                    <Timeline
                      key={i}
                      label={t(formatLabel(process?.type))}
                      subElements={[epochToDateTime(process.lastModifiedTime)]}
                      variant={variant}
                      showConnector={true}
                    />
                  );}
                }
              }
            }
  
            return (
              <TimelineMolecule
                // initialVisibleCount={allCompleted ? 1 : processesToRender.length} // Show all if not completed
                // hideFutureLabel={!allCompleted} // Hide future labels if not completed
                hideFutureLabel={true}
                hidePastLabel={!allCompleted}
                {...(!allCompleted && { initialVisibleCount: processesToRender.length })}
                {...(allCompleted && { initialVisibleCount: 1})}
              >
                {processesToRender.reverse()}
              </TimelineMolecule>
            );
          })()
        ) : (
          <p></p> // You can replace this with a loading spinner or any other indicator
        )}
        {/* {userCredential && lastCompletedProcess?.type === "campaign-creation" && (
          <Button
            label={t("CAMPAIGN_DOWNLOAD_USER_CRED")}
            variation="primary"
            icon={"DownloadIcon"}
            type="button"
            className="campaign-download-template-btn hover"
            onClick={downloadUserCred}
          />
        )} */}
      </div>
      {lastCompletedProcess?.type !== "campaign-creation" && 
        <AlertCard
        label="Info"
        text={t("CAMPAIGN_CREATION_TAKES_SOME_TIME_PLEASE_WAIT")}
        variant="default"
        />
      }
    </React.Fragment>
  );
};

export default TimelineComponent;
