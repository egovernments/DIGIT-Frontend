import { useQuery } from "react-query";

const useInbox = ({ tenantId, filters, config }) => {
    return useQuery(
        ["TL_INBOX", tenantId, filters],
        async () => {
            const response = await Digit.TLService.TLsearch({ tenantId, filters });
            return {
                totalCount: response?.Count || response?.Licenses?.length || 0,
                nearingSlaCount: 0,
                ...response
            };
        },
        config
    );
};

export default useInbox;
