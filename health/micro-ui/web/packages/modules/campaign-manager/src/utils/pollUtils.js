const pollForTemplateGeneration = async (functionToBePolledFor, conditionForTermination, pollInterval = 2500, maxRetries = 20,firstTimeWait=5000) => {
  let retries = 0; // Initialize the retry counter
  if (!functionToBePolledFor || !conditionForTermination) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        if (retries >= maxRetries) {
          // Reject if maximum retries are reached
          reject(new Error("Max  retries reached"));
          return;
        }

        const functionResponse = await functionToBePolledFor(); // Execute the polling function

        if (conditionForTermination(functionResponse)) {
          // Check if the termination condition is met
          resolve(functionResponse);
          return;
        } else {
          // Increment retries and continue polling after the specified interval
          retries++;
          setTimeout(poll, retries==1?firstTimeWait:pollInterval);
        }
      } catch (error) {
        // Handle errors by retrying after the specified interval
        retries++;
        setTimeout(poll, pollInterval);
      }
    };

    // Start polling
    poll().catch(reject);

    // Set a timeout to ensure the entire polling operation doesn't exceed a maximum duration
    const timeoutDuration = (maxRetries + 1) * pollInterval;
    setTimeout(() => {
      if (retries < maxRetries) {
        console.log("Polling timeout: Max retries reached");
        reject(new Error("Polling timeout: Max retries reached"));
      }
    }, timeoutDuration);
  });
};

const conditionForTermination = (downloadResponse) => {
  return downloadResponse?.[0]?.status === "completed" && downloadResponse?.[0]?.fileStoreid;
};

const downloadTemplate = async (hierarchyType, campaignId, tenantId, type) => {
  const downloadResponse = await Digit.CustomService.getResponse({
    url: `/project-factory/v1/data/_download`,
    body: {},
    params: {
      tenantId: tenantId,
      type: type,
      hierarchyType: hierarchyType,
      campaignId: campaignId,
    },
  });
  return downloadResponse?.GeneratedResource;
};


export const callTemplateDownloadByUntilCompleted =async(hierarchyType,campaignId,tenantId,type)=>{
    await pollForTemplateGeneration(()=>downloadTemplate(hierarchyType,campaignId,tenantId,type),conditionForTermination,5000,10,10000);
}
