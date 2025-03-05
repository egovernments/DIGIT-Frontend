import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";


const useDocumentSearch = (documents=[], config = {}) => {
  const client = useQueryClient();
  const tenant = Digit.ULBService.getStateId();
  const filesArray = documents?.map((value) => value?.fileStoreId);

  const { isLoading, error, data } = useQuery({
    queryKey: [filesArray.join('')],
    queryFn: () => Digit.UploadServices.Filefetch(filesArray, tenant),
    enabled: filesArray && filesArray.length > 0,
    select: (data) => {
      return documents.map(document => {
        const fileUrl = data?.data?.[document?.fileStoreId] 
          ? Digit.Utils.getFileUrl(data.data[document?.fileStoreId]) 
          : "";
        return {
          ...document,
          fileURL: fileUrl,
          url: fileUrl,
          fileResponse: data?.data?.[document?.fileStoreId] || "",
        };
      });
    },
    ...config,
  });
  return { isLoading, error, data: { pdfFiles: data }, revalidate: () => client.invalidateQueries([filesArray.join('')]) };
};

/**
 * Used to get the documents file url based on the given documents array
 */
export default useDocumentSearch;


useDocumentSearch.propTypes = {
  /**
   * document array for which we get file urls
   */
   documents: PropTypes.array,
  /**
   * any config to use query
   */
   config: PropTypes.object,
};

useDocumentSearch.defaultProps = {
  documents: [],
  config: {}
};

