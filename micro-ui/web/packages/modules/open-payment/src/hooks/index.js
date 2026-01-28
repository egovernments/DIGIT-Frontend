import utils from "../utils";
import { useMutation } from "@tanstack/react-query";

// export const CustomService = {
//   getResponse: ({ url, params, body, plainAccessRequest,useCache=true,userService=true,setTimeParam=true,userDownload=false,auth=true, headers={}, method="POST"}) =>  Request({
//       url: url,
//       data: body,
//       useCache,
//       userService,
//       method: method,
//       auth:auth,
//       params: params,
//       headers: headers,
//       plainAccessRequest: plainAccessRequest,
//       userDownload:userDownload,
//       setTimeParam
//     })
// };

const services = {
  createPayment : async ({ url, body, headers }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url,
        body,
        method: "POST",
        useCache: false,
        setTimeParam: false,
        headers: headers,
      });
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.Errors?.[0]?.message || "Payment failed");
    }
  }
};

const openpayment = {
  useCreatePayment : () => {
    return useMutation({mutationFn: ({ url, body, headers }) => services?.createPayment({ url, body, headers })});
  }
};

const Hooks = {
  openpayment,
};

const Utils = {
  browser: {
    sample: () => {},
  },
  openpayment:{
    ...utils
  }
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
