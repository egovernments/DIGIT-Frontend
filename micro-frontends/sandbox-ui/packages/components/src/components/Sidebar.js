import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import DigitUIComponents from "../DigitUIComponents";
const { Sidebar, SVG, ProfileIcon,
  AnnouncementIcon,
  ReceiptIcon,
  CreateEstimateIcon,
  GotoInboxIcon,
  ArrowLeft,
  ArrowDown,
  CameraSvg,
  DeleteBtn,
  DownloadIcon,
  Ellipsis,
  SuccessSvg,
  ErrorSvg,
  StarFilled,
  StarEmpty,
  SearchIconSvg,
  CheckSvg,
  RoundedCheck,
  Calender,
  Phone,
  FilterSvg,
  SortSvg,
  Close,
  Feedback,
  GetApp,
  HamburgerIcon,
  ArrowBack,
  ArrowForward,
  ArrowRightInbox,
  SortDown,
  SortUp,
  ShippingTruck,
  CloseSvg,
  CalendarIcon,
  UpwardArrow,
  DownwardArrow,
  Poll,
  FilterIcon,
  RefreshIcon,
  RefreshSVG,
  Details,
  PrintIcon,
  PropertyHouse,
  PrimaryDownlaodIcon,
  InfoBannerIcon,
  ShareIcon,
  RupeeIcon,
  ComplaintIcon,
  DropIcon,
  Person,
  WhatsappIcon,
  EmailIcon,
  DocumentIcon,
  DocumentIconSolid,
  EventsIconSolid,
  SurveyIconSolid,
  PMBIconSolid,
  DustbinIcon,
  ExternalLinkIcon,
  DownloadImgIcon,
  ViewsIcon,
  PrevIcon,
  DocumentSVG,
  ArrowToFirst,
  ArrowToLast,
  DownloadPrefixIcon,
  CaseIcon,
  PersonIcon,
  PTIcon,
  OBPSIcon,
  OBPSIconSolidBg,
  CitizenTruck,
  FSMIcon,
  EDCRIcon,
  BPAIcon,
  BPAHomeIcon,
  HelpIcon,
  NotificationBell,
  MapMarker,
  Clock,
  EventCalendar,
  ImageIcon,
  TickMark,
  PDFSvg,
  EditIcon,
  SearchIcon,
  DeleteIcon,
  CreateLoiIcon,
  PMBIcon,
  GenericFileIcon,
  ArrowLeftWhite,
  WSICon,
  ArrowVectorDown,
  ArrowDirection,
  CameraIcon,
  RemoveIcon,
  GalleryIcon,
  EditPencilIcon,
  AddressBookIcon,
  LocationIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
  MCollectIcon,
  PGRIcon,
  TLIcon,
  BillsIcon,
  ErrorIcon,
  DownloadBtnCommon,
  PrintBtnCommon,
  WhatsappIconGreen,
  HelpLineIcon,
  ServiceCenterIcon,
  TimerIcon,
  RupeeSymbol,
  ValidityTimeIcon,
  AddIcon,
  SubtractIcon,
  AddNewIcon,
  ViewReportIcon,
  InboxIcon,
  PrivacyMaskIcon,
  FirenocIcon,
  BirthIcon,
  DeathIcon,
  ArrowCollapseUp,
  ArrowCollapseDown,
  AddFilled,
  AddFileFilled,
  LocateIcon,
  /* Works Management  */
  NoResultsFoundIcon,
  WorksMgmtIcon,
  BioMetricIcon,
  MuktaHomeIcon,
  HRIcon,
  ProjectIcon,
  EstimateIcon,
  ContractIcon,
  AttendanceIcon,
  WageseekerIcon,
  OrganisationIcon,
  HelperIcon,
  DashboardIcon,
  ExpenditureIcon,
  DoubleTickIcon,
  InfoIcon,
  PaymentIcon,
  HistoryIcon,
  WarningIcon,
  AttentionListIcon,
  UploadIcon,
  FileIcon,
  DeleteIconv2,
  InfoIconOutline,
  XlsxFile,
  JpgFile,
  PdfFile,
  DocFile,
  PngFile,
  DocUpload,
  DocXlsxUpload,
  DocPdfUpload,
  DocdocUpload, } = DigitUIComponents;


/**
 * Sidebar Component
 * 
 * A simple sidebar component with navigation links, styled using Tailwind CSS.
 * 
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const Sidebar1 = () => {

  const [search, setSearch] = useState("");
  const url = 'http://localhost:9001/access/v1/actions/mdms/_get';
  const payload = {
    "roleCodes": [
      "HRMS_ADMIN",
      "WORK_ORDER_CREATOR",
      "ESTIMATE_VERIFIER",
      "ESTIMATE_APPROVER",
      "MB_VERIFIER",
      "WORK_ORDER_VERIFIER",
      "PROJECT_VIEWER",
      "MB_CREATOR",
      "MUSTER_ROLL_VERIFIER",
      "OFFICER_IN_CHARGE",
      "PROJECT_CREATOR",
      "EMPLOYEE_COMMON",
      "BILL_VIEWER",
      "TECHNICAL_SANCTIONER",
      "BILL_CREATOR",
      "MUSTER_ROLL_APPROVER",
      "ESTIMATE_VIEWER",
      "WORK_ORDER_APPROVER",
      "MB_APPROVER",
      "ESTIMATE_CREATOR",
      "MB_VIEWER",
      "MUKTA_ADMIN"
    ],
    "tenantId": "pg",
    "actionMaster": "actions-test",
    "enabled": true,
    "RequestInfo": {
      "apiId": "Rainmaker",
      "authToken": "da34f2ea-854c-413b-8c57-c9ef741072b6",
      "userInfo": {
        "id": 922,
        "uuid": "45614d29-9a50-4970-aba5-81b380745f48",
        "userName": "ANSH-001",
        "name": "Ansh",
        "mobileNumber": "9876543210",
        "emailId": "",
        "locale": null,
        "type": "EMPLOYEE",
        "roles": [
          {
            "name": "HRMS Admin",
            "code": "HRMS_ADMIN",
            "tenantId": "pg.citya"
          },
          {
            "name": "WORK ORDER CREATOR",
            "code": "WORK_ORDER_CREATOR",
            "tenantId": "pg.citya"
          },
          {
            "name": "ESTIMATE VERIFIER",
            "code": "ESTIMATE_VERIFIER",
            "tenantId": "pg.citya"
          },
          {
            "name": "ESTIMATE APPROVER",
            "code": "ESTIMATE_APPROVER",
            "tenantId": "pg.citya"
          },
          {
            "name": "MB_VERIFIER",
            "code": "MB_VERIFIER",
            "tenantId": "pg.citya"
          },
          {
            "name": "WORK ORDER VERIFIER",
            "code": "WORK_ORDER_VERIFIER",
            "tenantId": "pg.citya"
          },
          {
            "name": "PROJECT VIEWER",
            "code": "PROJECT_VIEWER",
            "tenantId": "pg.citya"
          },
          {
            "name": "MB_CREATOR",
            "code": "MB_CREATOR",
            "tenantId": "pg.citya"
          },
          {
            "name": "MUSTER ROLL VERIFIER",
            "code": "MUSTER_ROLL_VERIFIER",
            "tenantId": "pg.citya"
          },
          {
            "name": "OFFICER IN CHARGE",
            "code": "OFFICER_IN_CHARGE",
            "tenantId": "pg.citya"
          },
          {
            "name": "PROJECT CREATOR",
            "code": "PROJECT_CREATOR",
            "tenantId": "pg.citya"
          },
          {
            "name": "Employee Common",
            "code": "EMPLOYEE_COMMON",
            "tenantId": "pg.citya"
          },
          {
            "name": "BILL_VIEWER",
            "code": "BILL_VIEWER",
            "tenantId": "pg.citya"
          },
          {
            "name": "TECHNICAL SANCTIONER",
            "code": "TECHNICAL_SANCTIONER",
            "tenantId": "pg.citya"
          },
          {
            "name": "BILL_CREATOR",
            "code": "BILL_CREATOR",
            "tenantId": "pg.citya"
          },
          {
            "name": "MUSTER ROLL APPROVER",
            "code": "MUSTER_ROLL_APPROVER",
            "tenantId": "pg.citya"
          },
          {
            "name": "ESTIMATE VIEWER",
            "code": "ESTIMATE_VIEWER",
            "tenantId": "pg.citya"
          },
          {
            "name": "WORK ORDER APPROVER",
            "code": "WORK_ORDER_APPROVER",
            "tenantId": "pg.citya"
          },
          {
            "name": "MB_APPROVER",
            "code": "MB_APPROVER",
            "tenantId": "pg.citya"
          },
          {
            "name": "ESTIMATE CREATOR",
            "code": "ESTIMATE_CREATOR",
            "tenantId": "pg.citya"
          },
          {
            "name": "MB_VIEWER",
            "code": "MB_VIEWER",
            "tenantId": "pg.citya"
          },
          {
            "name": "MUKTA Admin",
            "code": "MUKTA_ADMIN",
            "tenantId": "pg.citya"
          }
        ],
        "active": true,
        "tenantId": "pg.citya",
        "permanentCity": "CityA"
      },
      "msgId": "1723182672458|en_IN",
      "plainAccessRequest": {},
      "ts": 1723182672458
    }
  };
  let data = {};
  const [transformedSidebarItems, setTransformedSidebarItems] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state

  const iconMap = {
    ProfileIcon,
  AnnouncementIcon,
  ReceiptIcon,
  CreateEstimateIcon,
  GotoInboxIcon,
  ArrowLeft,
  ArrowDown,
  CameraSvg,
  DeleteBtn,
  DownloadIcon,
  Ellipsis,
  SuccessSvg,
  ErrorSvg,
  StarFilled,
  StarEmpty,
  SearchIconSvg,
  CheckSvg,
  RoundedCheck,
  Calender,
  Phone,
  FilterSvg,
  SortSvg,
  Close,
  Feedback,
  GetApp,
  HamburgerIcon,
  ArrowBack,
  ArrowForward,
  ArrowRightInbox,
  SortDown,
  SortUp,
  ShippingTruck,
  CloseSvg,
  CalendarIcon,
  UpwardArrow,
  DownwardArrow,
  Poll,
  FilterIcon,
  RefreshIcon,
  RefreshSVG,
  Details,
  PrintIcon,
  PropertyHouse,
  PrimaryDownlaodIcon,
  InfoBannerIcon,
  ShareIcon,
  RupeeIcon,
  ComplaintIcon,
  DropIcon,
  Person,
  WhatsappIcon,
  EmailIcon,
  DocumentIcon,
  DocumentIconSolid,
  EventsIconSolid,
  SurveyIconSolid,
  PMBIconSolid,
  DustbinIcon,
  ExternalLinkIcon,
  DownloadImgIcon,
  ViewsIcon,
  PrevIcon,
  DocumentSVG,
  ArrowToFirst,
  ArrowToLast,
  DownloadPrefixIcon,
  CaseIcon,
  PersonIcon,
  PTIcon,
  OBPSIcon,
  OBPSIconSolidBg,
  CitizenTruck,
  FSMIcon,
  EDCRIcon,
  BPAIcon,
  BPAHomeIcon,
  HelpIcon,
  NotificationBell,
  MapMarker,
  Clock,
  EventCalendar,
  ImageIcon,
  TickMark,
  PDFSvg,
  EditIcon,
  SearchIcon,
  DeleteIcon,
  CreateLoiIcon,
  PMBIcon,
  GenericFileIcon,
  ArrowLeftWhite,
  WSICon,
  ArrowVectorDown,
  ArrowDirection,
  CameraIcon,
  RemoveIcon,
  GalleryIcon,
  EditPencilIcon,
  AddressBookIcon,
  LocationIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
  MCollectIcon,
  PGRIcon,
  TLIcon,
  BillsIcon,
  ErrorIcon,
  DownloadBtnCommon,
  PrintBtnCommon,
  WhatsappIconGreen,
  HelpLineIcon,
  ServiceCenterIcon,
  TimerIcon,
  RupeeSymbol,
  ValidityTimeIcon,
  AddIcon,
  SubtractIcon,
  AddNewIcon,
  ViewReportIcon,
  InboxIcon,
  PrivacyMaskIcon,
  FirenocIcon,
  BirthIcon,
  DeathIcon,
  ArrowCollapseUp,
  ArrowCollapseDown,
  AddFilled,
  AddFileFilled,
  LocateIcon,
  /* Works Management  */
  NoResultsFoundIcon,
  WorksMgmtIcon,
  BioMetricIcon,
  MuktaHomeIcon,
  HRIcon,
  ProjectIcon,
  EstimateIcon,
  ContractIcon,
  AttendanceIcon,
  WageseekerIcon,
  OrganisationIcon,
  HelperIcon,
  DashboardIcon,
  ExpenditureIcon,
  DoubleTickIcon,
  InfoIcon,
  PaymentIcon,
  HistoryIcon,
  WarningIcon,
  AttentionListIcon,
  UploadIcon,
  FileIcon,
  DeleteIconv2,
  InfoIconOutline,
  XlsxFile,
  JpgFile,
  PdfFile,
  DocFile,
  PngFile,
  DocUpload,
  DocXlsxUpload,
  DocPdfUpload,
  DocdocUpload, 

  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching");
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        data = responseData;
        console.log("data", data);

        function mergeObjects(obj1, obj2) {
          for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
              if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
                if (!obj1[key]) {
                  obj1[key] = {};
                }
                mergeObjects(obj1[key], obj2[key]);
              } else {
                if (!obj1[key]) {
                  obj1[key] = obj2[key];
                }
              }
            }
          }
        }

        const configEmployeeSideBar = {};
        data?.actions
          .filter((e) => e.url === 'url')
          .forEach((item) => {
            let index = item?.path?.split('.')?.[0] || '';
            if (search === '' && item.path !== '') {
              const keys = item.path.split('.');
              let hierarchicalMap = {};

              keys.reduce((acc, key, index) => {
                if (index === keys.length - 1) {
                  acc[key] = { item };
                } else {
                  acc[key] = {};
                  return acc[key];
                }
              }, hierarchicalMap);
              mergeObjects(configEmployeeSideBar, hierarchicalMap);
            } else if (
              checkMatch(t(`ACTION_TEST_${index?.toUpperCase()?.replace(/[ -]/g, '_')}`), search) ||
              checkMatch(t(Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${item?.displayName}`)), search)
            ) {
              const keys = item.path.split('.');
              let hierarchicalMap = {};

              keys.reduce((acc, key, index) => {
                if (index === keys.length - 1) {
                  acc[key] = { item };
                } else {
                  acc[key] = {};
                  return acc[key];
                }
              }, hierarchicalMap);
              mergeObjects(configEmployeeSideBar, hierarchicalMap);
            }
          });

        const transformConfig = (config) => {
          const result = [];

          const processItem = (key, value) => {
            const item = value.item;

            // Extract the icon name from the leftIcon property
            const iconName = item ? item.leftIcon.split(':').pop() : '';

            // Get the corresponding React component from the iconMap
            const IconComponent = iconMap[iconName] || null;

            const obj = {
              // label: item ? item.displayName : key,
              label: key,
              //icon: item ? item.leftIcon : '', // Assuming icon is in leftIcon field
              //icon: item ? item.leftIcon.split(':').pop() : '',
              icon: IconComponent ? <IconComponent /> : null,  // Render the icon component
              link: item ? item.navigationURL : '',
              children: [],
            };

            for (const childKey in value) {
              if (childKey !== 'item' && typeof value[childKey] === 'object') {
                obj.children.push(processItem(childKey, value[childKey]));
              }
              else {
                delete obj.children;
              }
            }

            return obj;
          };

          for (const key in config) {
            result.push(processItem(key, config[key]));
          }

          return result;
        };

        const sortSidebarItems = (items) => {
          // Sort items based on the label
          items.sort((a, b) => a.label.localeCompare(b.label));

          // Recursively sort children if they exist
          items.forEach(item => {
            if (item.children && item.children.length > 0) {
              sortSidebarItems(item.children);
            }
          });

          return items;
        };

        const removeLeadingNumbers = (items) => {
          // Function to clean up the label by removing the initial number
          const cleanLabel = (label) => label.replace(/^\d+\s*/, '');

          // Recursive function to process each item
          const processItem = (item) => {
            // Clean the label of the current item
            item.label = cleanLabel(item.label);

            // If there are children, process them recursively
            if (item.children && item.children.length > 0) {
              item.children = item.children.map(processItem);
            }

            return item;
          };

          return items.map(processItem);
        };



        console.log("confug", configEmployeeSideBar);
        const transformedItems = transformConfig(configEmployeeSideBar);
        console.log("transformed0", transformedSidebarItems);
        // Use the sorting function on the transformedSidebarItems
        const sortedItems = sortSidebarItems(transformedItems);

        const cleanedSidebarItems = removeLeadingNumbers(sortedItems);
        console.log(cleanedSidebarItems);
        setTransformedSidebarItems(cleanedSidebarItems); // Update state with transformed data
        console.log("transformed", transformedSidebarItems);
        setLoading(false); // Set loading to false after data is fetched and transformed
      } catch (error) {
        console.error('Error:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    //fetchData();
    const runProgram = async () => {
      await fetchData(); // Wait for the fetchData function to complete
      console.log("Final transformed config:", transformedSidebarItems);
      // You can now use transformedSidebarItems outside of fetchData
    };

    runProgram();
  }, []); // Empty dependency array to run once on component mount

  useEffect(() => {
    console.log("Final Transformed Sidebar Items:", transformedSidebarItems);
  }, [transformedSidebarItems]); // Log when transformedSidebarItems changes

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner while fetching data
  }
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white top-0 left-0 p-4">
      <h2 className="text-2xl font-semibold mb-6">Sidebar</h2>
      <Sidebar
        expandedWidth="200px"
        // transitionDuration={1.0}
        items={
          transformedSidebarItems
          
        }
      />
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/home" className="hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/pwc/account-mgmt" className="hover:text-gray-400">Account-mgmt</Link>
          </li>
          <li>
            <Link to="/pwc/data-mgmt" className="hover:text-gray-400">Data-mgmt</Link>
          </li>
          <li>
            <Link to="/pwc/user" className="hover:text-gray-400">User</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar1;
