import React from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader,InboxSearchComposer} from "@egovernments/digit-ui-components-core";
// import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import inboxConfig from "../../../configs/InboxConfig";

const ProjectSearchAndInboxComponent = () => {
    const { t } = useTranslation();

    const configs = inboxConfig();
    const tenant = Digit.ULBService.getStateId();
    // const { isLoading, data } = Digit.Hooks.useCustomMDMS(
    //     tenant,
    //     Digit.Utils.getConfigModuleName(),
    //     [
    //         {
    //             "name": "InboxProjectConfig"
    //         }
    //     ]
    // );
   
    // const configs = data?.[Digit.Utils.getConfigModuleName()]?.InboxProjectConfig?.[0]

    // if(isLoading) return <Loader />
      return (
           <React.Fragment>
              <Header styles={{ fontSize: "32px" }}>{t(configs?.label)}</Header>
              <div className="inbox-search-wrapper">
                <InboxSearchComposer configs={configs}></InboxSearchComposer>
              </div>
          </React.Fragment>
      );
}

export default ProjectSearchAndInboxComponent;