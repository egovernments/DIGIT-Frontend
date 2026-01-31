import { useMutation } from "react-query";
import createUpdatePlanProject from "./services/createUpdatePlanProject";
const useCreateUpdatePlanProject = () => {
  return useMutation((req) => {
    return createUpdatePlanProject(req);
  });
};

export default useCreateUpdatePlanProject;
