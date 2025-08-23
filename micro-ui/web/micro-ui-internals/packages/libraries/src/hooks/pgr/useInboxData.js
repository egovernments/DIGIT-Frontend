import { useQuery, useQueryClient } from "@tanstack/react-query";

const useInboxData = (searchParams) => {
  const client = useQueryClient();

  const fetchInboxData = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    let serviceIds = [];
    let commonFilters = { start: 1, end: 10 };
    const { limit, offset } = searchParams;
    let appFilters = {
      ...commonFilters,
      ...searchParams.filters.pgrQuery,
      ...searchParams.search,
      limit,
      offset,
    };
    let wfFilters = { ...commonFilters, ...searchParams.filters.wfQuery };
    let complaintDetailsResponse = await Digit.PGRService.search(tenantId, appFilters);

    complaintDetailsResponse.ServiceWrappers.forEach((service) =>
      serviceIds.push(service.service.serviceRequestId)
    );

    const serviceIdParams = serviceIds.join();
    const workflowInstances = await Digit.WorkflowService.getByBusinessId(
      tenantId,
      serviceIdParams,
      wfFilters,
      false
    );

    let combinedRes = [];

    if (workflowInstances.ProcessInstances.length) {
      combinedRes = combineResponses(complaintDetailsResponse, workflowInstances).map((data) => ({
        ...data,
        sla: Math.round(data.sla / (24 * 60 * 60 * 1000)),
      }));
    }

    return combinedRes;
  };

  const queryKey = [
    "fetchInboxData",
    ...Object.keys(searchParams).map((key) =>
      typeof searchParams[key] === "object"
        ? Object.keys(searchParams[key]).map((subKey) => searchParams[key][subKey])
        : searchParams[key]
    ),
  ];

  const result = useQuery({
    queryKey,
    queryFn: fetchInboxData,
    staleTime: Infinity,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries({ queryKey: ["fetchInboxData"] }),
  };
};

const mapWfBybusinessId = (wfs) => {
  return wfs.reduce((object, item) => {
    return { ...object, [item["businessId"]]: item };
  }, {});
};

const combineResponses = (complaintDetailsResponse, workflowInstances) => {
  let wfMap = mapWfBybusinessId(workflowInstances.ProcessInstances);
  const wrappers = complaintDetailsResponse?.ServiceWrappers || [];

  const filtered = wrappers.filter(
    (complaint) =>
      complaint?.service?.serviceRequestId &&
      wfMap?.[complaint.service.serviceRequestId]
  );

  const complaints = filtered.length ? filtered : wrappers;

  return complaints.map((complaint) => ({
    serviceRequestId: complaint.service.serviceRequestId,
    complaintSubType: complaint.service.serviceCode,
    locality: complaint.service.address.locality.code,
    status: complaint.service.applicationStatus,
    taskOwner: wfMap[complaint.service.serviceRequestId]?.assignes?.[0]?.name || "-",
    sla: wfMap[complaint.service.serviceRequestId]?.businesssServiceSla,
    tenantId: complaint.service.tenantId,
  }));
};

export default useInboxData;
