import { useHistory } from "react-router-dom";
import { useCallback } from "react";


const useRouter = () => {
  const history = useHistory();

  const navigate = useCallback((route) => {
    if (route !== history.location.pathname) {
      history.push(route);
    }
  }, []);

  return { navigate };
};

export default useRouter;
