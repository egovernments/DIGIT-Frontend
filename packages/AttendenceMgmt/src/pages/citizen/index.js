import React from "react";
import { useTranslation } from "react-i18next";
import { PrivateRoute, BackButton, AppContainer } from "@egovernments/digit-ui-react-components";
import { Switch, useLocation } from "react-router-dom";
import ShgInbox from "./markAttendenceInbox/ShgInbox";
import ShgHome from "../../components/shgHome/ShgHome";
import ViewProjectsInbox from "./manageWageSeekers/ViewProjectsInbox";
import ViewProject from "./manageWageSeekers/ViewProject";
import Sample from "./Sample";
// const AttendenceMgmtBreadCrumbs = ({ location }) => {
//     const { t } = useTranslation();

//     const search = useLocation().search;
//     const fromScreen = new URLSearchParams(search).get("from") || null;
//     const crumbs = [
//         {
//             path: `/${window?.contextPath}/employee`,
//             content: t("WORKS_WMS"),
//             show: true,
//         },
//         // {
//         //     path: `/${window.contextPath}/employee/works/loiinbox`,
//         //     content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_LOI_INBOX")}` : t("WORKS_LOI_INBOX"),
//         //     show: location.pathname.includes("/works/loiinbox") ? true : false,
//         //     isBack: fromScreen && true,
//         // },
//     ];
//     return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;

// }

const App = ({ path }) => {
  const location = useLocation();


    return (
        <span className={"pt-citizen"}>
            <Switch>
                <AppContainer>
                    {<BackButton>Back</BackButton>}
                    {/* <PrivateRoute path={`${path}/property/new-application`} component={CreateProperty} /> */}
                    <PrivateRoute path={`${path}/create-application`} component={() => <div>Hi</div>} />
                    <PrivateRoute path={`${path}/trackattendence`} component={() => <ShgInbox {...{path}} />} />
                    <PrivateRoute path={`${path}/view-register`} component={() => <ViewRegister {...{ path }} />} />
                    <PrivateRoute path={`${path}/shghome`} component={() => <ShgHome {...{ path }} />} />
                    <PrivateRoute path={`${path}/sample`} component={() => <Sample {...{ path }} />} />
                    <PrivateRoute path={`${path}/view-projects`} component={() => <ViewProjectsInbox {...{ path }} />} />
                    <PrivateRoute path={`${path}/view-project`} component={() => <ViewProject {...{ path }} exact/>} />
                </AppContainer>
            </Switch>
        </span>
    );

};

export default App;