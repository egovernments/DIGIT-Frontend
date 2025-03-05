import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PaymentService } from "../services/elements/Payment";

export const useFetchCitizenBillsForBuissnessService = ({ businessService, ...filters }, config = {}) => {
  const queryClient = useQueryClient();
  const { mobileNumber, tenantId } = Digit.UserService.getUser()?.info || {};
  const params = { mobileNumber, businessService, ...filters };
  if (!params["mobileNumber"]) delete params["mobileNumber"];
  const { isLoading, error, isError, data, status } = useQuery({
    queryKey: ["citizenBillsForBuisnessService", businessService, { ...params }],
    queryFn: () => Digit.PaymentService.fetchBill(tenantId, { ...params }),
    refetchOnMount: true,
    retry: false,
    ...config,
  });
  return {
    isLoading,
    error,
    isError,
    data,
    status,
    revalidate: () => queryClient.invalidateQueries(["citizenBillsForBuisnessService", businessService]),
  };
};

export const useFetchBillsForBuissnessService = ({ tenantId, businessService, ...filters }, config = {}) => {
  const queryClient = useQueryClient();
  let isPTAccessDone = sessionStorage.getItem("IsPTAccessDone");
  const params = { businessService, ...filters };
  const _tenantId = tenantId || Digit.UserService.getUser()?.info?.tenantId;
  const { isLoading, error, isError, data, status } = useQuery({
    queryKey: ["billsForBuisnessService", businessService, { ...filters }, config, isPTAccessDone],
    queryFn: () => Digit.PaymentService.fetchBill(_tenantId, params),
    retry: (count, err) => {
      return false;
    },
    ...config,
  });
  return {
    isLoading,
    error,
    isError,
    data,
    status,
    revalidate: () => queryClient.invalidateQueries(["billsForBuisnessService", businessService]),
  };
};

export const useFetchPayment = ({ tenantId, consumerCode, businessService }, config) => {
  const queryClient = useQueryClient();

  const fetchBill = async () => {
    /*  Currently enabled the logic to get bill no and expiry date for PT Module  */
    if (businessService?.includes("PT") || businessService?.includes("SW") || businessService?.includes("WS")) {
      const fetchedBill = await Digit.PaymentService.fetchBill(tenantId, { consumerCode, businessService });
      const billdetail = fetchedBill?.Bill?.[0]?.billDetails?.sort((a, b) => b.fromPeriod - a.fromPeriod)?.[0] || {};
      fetchedBill.Bill[0].billDetails = fetchedBill?.Bill[0]?.billDetails?.map((ele) => ({
        ...ele,
        currentBillNo: fetchedBill?.Bill?.[0]?.billNumber,
        currentExpiryDate: billdetail?.expiryDate,
      }));
      if (fetchedBill && fetchedBill?.Bill?.[0]?.billDetails?.length > 1) {
        fetchedBill?.Bill?.[0]?.billDetails?.map(async (billdet) => {
          const searchBill = await Digit.PaymentService.searchBill(tenantId, {
            consumerCode,
            fromPeriod: billdet?.fromPeriod,
            toPeriod: billdet?.toPeriod,
            service: businessService,
            retrieveOldest: true,
          });
          billdet.expiryDate = searchBill?.Bill?.[0]?.billDetails?.[0]?.expiryDate;
          billdet.billNumber = searchBill?.Bill?.[0]?.billNumber;
        });
      }
      return fetchedBill;
    } else {
      return Digit.PaymentService.fetchBill(tenantId, { consumerCode, businessService });
    }
  };

  const retry = (failureCount, error) => {
    if (error?.response?.data?.Errors?.[0]?.code === "EG_BS_BILL_NO_DEMANDS_FOUND") return false;
    else return failureCount < 3;
  };

  const queryData = useQuery({
    queryKey: ["paymentFetchDetails", tenantId, consumerCode, businessService],
    queryFn: () => fetchBill(),
    retry,
    ...config,
  });

  return {
    ...queryData,
    revalidate: () => queryClient.invalidateQueries(["paymentFetchDetails", tenantId, consumerCode, businessService]),
  };
};

export const usePaymentUpdate = ({ egId }, businessService, config) => {
  const getPaymentData = async (egId) => {
    const transaction = await Digit.PaymentService.updateCitizenReciept(egId);
    const payments = await Digit.PaymentService.getReciept(transaction.Transaction[0].tenantId, businessService, {
      consumerCodes: transaction.Transaction[0].consumerCode,
    });
    return { payments, applicationNo: transaction.Transaction[0].consumerCode, txnStatus: transaction.Transaction[0].txnStatus };
  };

  return useQuery({
  queryKey: ["paymentUpdate", egId],
  queryFn: () => getPaymentData(egId),
  ...config,
});

};

export const useGetPaymentRulesForBusinessServices = (tenantId) => {
  return useQuery({
    queryKey: ["getPaymentRules", tenantId],
    queryFn: () => Digit.MDMSService.getPaymentRules(tenantId),
  });};

export const usePaymentSearch = (tenantId, filters, config = {}) => {
  return useQuery({
    queryKey: ["PAYMENT_SERACH", tenantId],
    queryFn: () => Digit.PaymentService.searchBill(tenantId, filters),
    select: (data) => {
      return data?.Bill?.[0]?.billDetails?.[0]?.billAccountDetails.filter((e) => {
        switch (e.taxHeadCode) {
          case "WS_CHARGE":
          case "WS_TIME_PENALTY":
          case "WS_TIME_INTEREST":
          case "SW_TIME_INTEREST":
          case "SW_TIME_PENALTY":
          case "SW_CHARGE":
          case "WS_WATER_CESS":
          case "WS_TIME_ADHOC_PENALTY":
          case "WS_TIME_ADHOC_REBATE":
          case "SW_TIME_ADHOC_PENALTY":
          case "SW_TIME_ADHOC_REBATE":
            return true;
          default:
            return false;
        }
      });
    },
    ...config,
  });
};

export const useDemandSearch = ({ consumerCode, businessService, tenantId }, config = {}) => {
  if (!tenantId) tenantId = Digit.ULBService.getCurrentTenantId();
  const queryFn = () => Digit.PaymentService.demandSearch(tenantId, consumerCode, businessService);
  const queryData = useQuery({
    queryKey: ["demand_search", { consumerCode, businessService, tenantId }],
    queryFn: queryFn,
    refetchOnMount: "always",
    ...config,
  });
  return queryData;
};

export const useRecieptSearch = ({ tenantId, businessService, ...params }, config = {}) => {
  return useQuery({
    queryKey: ["reciept_search", { tenantId, businessService, params }, config],
    queryFn: () => Digit.PaymentService.recieptSearch(tenantId, businessService, params),
    refetchOnMount: false,
    ...config,
  });
};

export const useBulkPdfDetails = ({ filters }) => {
  return useQuery({
    queryKey: ["BULK_PDF_DETAILS", filters],
    queryFn: async () => await PaymentService.getBulkPdfRecordsDetails(filters),
  });
};
