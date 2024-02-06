import { Header, MultiLink, Card, StatusTable, Row, CardSubHeader,Loader,SubmitBar,ActionBar, HorizontalNav, Menu, Toast } from '@egovernments/digit-ui-react-components'
import React, { Fragment,useEffect,useRef,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import ProjectDetailsNavDetails from './ProjectDetailsNavDetails'

const ProjectDetails = () => {
    const { t } = useTranslation();
    const [activeLink, setActiveLink] = useState("Project_Details");
    const tenantId =  Digit.ULBService.getCurrentTenantId();
    const queryStrings = Digit.Hooks.useQueryParams();
    const history = useHistory();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
    const [configNavItems, setNavTypeConfig] = useState([]);
    const [subProjects, setSubProjects] = useState([]);
    const menuRef = useRef();
    const [showActions, setShowActions] = useState(false);
    const loggedInUserRoles = Digit.Utils.getLoggedInUserDetails("roles");
    const [hideActionBar, setHideActionBar] = useState(false);
    const projectSession = Digit.Hooks.useSessionStorage("NEW_PROJECT_CREATE", {});
    const [sessionFormData, clearSessionFormData] = projectSession;
    const location = useLocation();
    let isProjectModifier = false;
    let isEstimateViewerAndCreator = false;
    const [actionsMenu, setActionsMenu] = useState([]);
    const [toast, setToast] = useState({show : false, label : "", error : false});
    const navConfigs = [
        {
            "name":"Project_Details",
            "code":"WORKS_PROJECT_DETAILS",
            "active" : true 
        },
        {
            "name":"Financial_Details",
            "code":"WORKS_FINANCIAL_DETAILS",
            "active" : true 
        },
        {
            "name":"Sub_Projects_Details",
            "code":"PROJECTS_SUB_PROJECT_DETAILS",
            "active" : false 
        }
    ];
    const searchParams = {
        Projects : [
            {
                tenantId : queryStrings?.tenantId || tenantId,
                projectNumber : queryStrings?.projectNumber
            }
        ]
    } 
    const filters = {
        limit : 11,
        offset : 0,
        includeAncestors : true,
        includeDescendants : true
    }

    const closeMenu = () => {
        setShowActions(false);
    }

    Digit.Hooks.useClickOutside(menuRef, closeMenu, showActions );

    const handleParentProjectSearch = (parentProjectNumber) => {
        history.push(`/${window.contextPath}/employee/project/project-details?tenantId=${searchParams?.Projects?.[0]?.tenantId}&projectNumber=${parentProjectNumber}`);
    }

    const handleActionBar = (option) => {
        if(option?.name === "CREATE_ESTIMATE"){
            history.push(`/${window.contextPath}/employee/estimate/create-detailed-estimate?tenantId=${searchParams?.Projects?.[0]?.tenantId}&projectNumber=${searchParams?.Projects?.[0]?.projectNumber}`);
        }
        if(option?.name === "VIEW_ESTIMATE"){
            history.push(`/${window.contextPath}/employee/estimate/estimate-details?tenantId=${searchParams?.Projects?.[0]?.tenantId}&estimateNumber=${estimates?.[0]?.estimateNumber}`);
        }
        if(option?.name === "MODIFY_PROJECT"){
            if(estimates?.length !==0 && estimates?.[0]?.wfStatus !== "" &&  estimates?.[0]?.wfStatus !== "REJECTED") {
                setToast({show : true, label : t("COMMON_CANNOT_MODIFY_PROJECT_EST_CREATED"), error : true});
            }else {
                // history.push(`/${window.contextPath}/employee/project/modify-project?tenantId=${searchParams?.Projects?.[0]?.tenantId}&projectNumber=${searchParams?.Projects?.[0]?.projectNumber}`);
                history.push({
                    pathname : `/${window.contextPath}/employee/project/create-project`,
                    search : `?tenantId=${searchParams?.Projects?.[0]?.tenantId}&projectNumber=${searchParams?.Projects?.[0]?.projectNumber}`,
                })
            }
        }
    }

    const handleToastClose = () => {
      setToast({show : false, label : "", error : false});
    }

    const HandleDownloadPdf = () => {
        const projectId=searchParams?.Projects?.[0]?.projectNumber;
        Digit.Utils.downloadEgovPDF('project/project-details',{projectId,tenantId:searchParams?.Projects?.[0]?.tenantId},`Project-${projectId}.pdf`)
    }

    const { data } = Digit.Hooks.works.useViewProjectDetails(t, tenantId, searchParams, filters, headerLocale);

    //fetch estimate details
    const { data : estimates, isError : isEstimateSearchError,isLoading:estimateLoading } = Digit.Hooks.works.useSearchEstimate( tenantId, {limit : 1, offset : 0, projectId : data?.projectDetails?.searchedProject?.basicDetails?.uuid });
    

    useEffect(()=>{
        const projectModifierRoles = ["PROJECT_CREATOR"];
        isProjectModifier = projectModifierRoles?.some(role=>loggedInUserRoles?.includes(role));
    },[loggedInUserRoles]);

    useEffect(()=>{
        const estimateViewerAndCreatorRole = ["ESTIMATE_CREATOR", "ESTIMATE_VERIFIER", "TECHNICAL_SANCTIONER", "ESTIMATE_APPROVER"];
        isEstimateViewerAndCreator = estimateViewerAndCreatorRole?.some(role=>loggedInUserRoles?.includes(role));
    },[loggedInUserRoles]);

    const setUniqueActions = (objToSet) => {
        const set = actionsMenu.filter(row => row.name === objToSet.name).length === 0 
        if(set){
            setActionsMenu((prev)=>[...prev, objToSet])
        }
    }

    useEffect(()=>{
        let isUserEstimateCreator = loggedInUserRoles?.includes("ESTIMATE_CREATOR");
        if(isEstimateSearchError && isEstimateViewerAndCreator) {
            setToast({show : true, label : t("COMMON_ERROR_FETCHING_ESTIMATE_DETAILS"), error : true});
            setHideActionBar(true);
        }else {
            if((estimates?.length === 0 || estimates?.[0]?.wfStatus === "" || estimates?.[0]?.wfStatus === "REJECTED")) {
                if(isUserEstimateCreator) {
                    setHideActionBar(false);
                    setUniqueActions({
                        name : "CREATE_ESTIMATE"
                    })
                }else {
                    // setHideActionBar(true);
                }
            }else if(isProjectModifier || isEstimateViewerAndCreator){
                //we have given search estimate access to project creator
                setHideActionBar(false);
                estimates && estimates?.length !== 0 && setUniqueActions({
                    name : "VIEW_ESTIMATE"
                })
            }
            if(isProjectModifier) {
                setHideActionBar(false);
                setUniqueActions({
                    name : "MODIFY_PROJECT"
                })
            }
        }
    },[estimates, isEstimateSearchError,estimateLoading]);

     //remove Toast after 3s
     useEffect(()=>{
        if(toast?.show) {
          setTimeout(()=>{
            handleToastClose();
          },3000);
        }
      },[toast?.show])

    //update config for Nav once we get the data
    useEffect(()=>{
        if(data?.projectDetails?.subProjects?.length > 0) {
            navConfigs[2].active = true;
            setSubProjects(data?.projectDetails?.subProjects);
        }else{
            navConfigs[2].active = false;
        }
        let filterdNavConfig = navConfigs.filter((config)=>config.active === true);
        setNavTypeConfig(filterdNavConfig);
    },[data]);

    //remove session form data if user navigates away from the project create screen
    useEffect(()=>{
        if (!window.location.href.includes("create-project") && sessionFormData && Object.keys(sessionFormData) != 0) {
            clearSessionFormData();
        }
    },[location]);
    
    return (
        <div className={"employee-main-application-details"}>
            <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
                <Header className="works-header-view" styles={{ marginLeft: "0px", paddingTop: "10px"}}>{t("WORKS_PROJECT_DETAILS")}</Header>
            <MultiLink
              onHeadClick={() => HandleDownloadPdf()}
              downloadBtnClassName={"employee-download-btn-className"}
              label={t("CS_COMMON_DOWNLOAD")}
            />
            </div>

 
            <HorizontalNav showNav={false} configNavItems={configNavItems} activeLink={activeLink} setActiveLink={setActiveLink} inFormComposer={false}>  
              <ProjectDetailsNavDetails 
                activeLink={activeLink}
                subProjects={subProjects}
                searchParams={searchParams}
                filters={filters}
              />
            </HorizontalNav>
            {
                !hideActionBar &&
                <ActionBar>
                    {showActions ? 
                        <Menu
                            localeKeyPrefix={`COMMON`}
                            options={actionsMenu}
                            optionKey={"name"}
                            t={t}
                            onSelect={handleActionBar}
                        /> : null
                    }
                    <SubmitBar ref={menuRef} label={t("WORKS_ACTIONS")} onSubmit={() => setShowActions(!showActions)}/>
                </ActionBar>
            }
        {toast?.show && <Toast label={toast?.label} error={toast?.error} isDleteBtn={true} onClose={handleToastClose}></Toast>}
        </div>
    )
}

export default ProjectDetails;