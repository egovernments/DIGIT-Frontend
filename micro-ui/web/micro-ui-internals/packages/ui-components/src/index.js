// import "@egovernments/digit-ui-components-css/dist/index.css";
import {
  ActionBar,
  ActionLinks,
  Amount,
  AppContainer,
  BackLink,
  Sidebar,
  MobileSidebar,
  Tooltip,
  Banner,
  BodyContainer,
  BreadCrumb,
  BreakLine,
  Button,
  Card,
  CardBasedOptions,
  CardCaption,
  CardHeader,
  CardLabel,
  CardLabelError,
  CardText,
  CheckBox,
  CitizenHomeCard,
  CitizenInfoLabel,
  CollapseAndExpandGroups,
  ConnectingCheckPoints,
  DatePicker,
  DisplayPhotos,
  Dropdown,
  ErrorMessage,
  Footer,
  Header,
  HeaderBar,
  HorizontalNav,
  InfoCard,
  PageBasedInput,
  InputTextAmount,
  KeyNote,
  LabelFieldPair,
  Loader,
  LoaderScreen,
  MobileNumber,
  MultiSelectDropdown,
  NoResultsFound,
  OTPInput,
  Paragraph,
  PlusMinusInput,
  PopUp,
  PrivateRoute,
  RadioButtons,
  Rating,
  Chip,
  SVG,
  // Table,
  Telephone,
  TextArea,
  TextInput,
  Toast,
  UploadFile,
  WhatsNewCard,
  Toggle,
  ToggleSwitch,
  TreeSelect,
  SubmitBar,
  ButtonSelector,
  InboxSearchLinks,
  SearchComponent,
  LinkLabel,
  RoundedLabel,
  Stepper,
  Timeline,
  StringManipulator,
  InfoButton,
  Uploader,
  UploadPopup,
  UploadImage,
  ErrorBoundary,
  TextBlock,
  Panels,
  Animation,
  ViewCardFieldPair,
  Divider,
  ButtonsGroup,
  TopBar,
  Hamburger,
  Menu,
  SelectionCard,
  TestComponent,
  Tag
} from "./atoms";

import {
  AnnouncementIcon,
  Calender,
  CitizenTruck,
  ComplaintIcon,
  DocumentSVG,
  DropIcon,
  EmailIcon,
  FilterIcon,
  FilterSvg,
  Person,
  PersonIcon,
  PrintIcon,
  ReceiptIcon,
  RupeeIcon,
  ShareIcon,
  WhatsappIcon,
  OBPSIcon,
  EDCRIcon,
  BPAIcon,
  BPAHomeIcon,
  PDFSvg,
  DownloadPrefixIcon,
  TickMark,
  MapMarker,
  Clock,
  EventCalendar,
  EditIcon,
  SearchIcon,
  DeleteIcon,
  CreateLoiIcon,
  WSICon,
  ArrowForward,
  ArrowVectorDown,
  ArrowDirection,
  CameraIcon,
  EditPencilIcon,
  GalleryIcon,
  RemoveIcon,
  CheckSvg,
  AddressBookIcon,
  LocationIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
  FSMIcon,
  MCollectIcon,
  PGRIcon,
  TLIcon,
  BillsIcon,
  ErrorIcon,
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
  InboxIcon,
  ViewReportIcon,
  PrivacyMaskIcon,
  DeathIcon,
  BirthIcon,
  FirenocIcon,
  CreateEstimateIcon,
  GotoInboxIcon,
  LocateIcon,
  CaseIcon,
  CloseSvg,
  Close,
  Details,
  DownloadIcon,
  DownloadImgIcon,
  DownwardArrow,
  Ellipsis,
  GetApp,
  HomeIcon,
  PrevIcon,
  ViewsIcon,
  LanguageIcon,
  LogoutIcon,
  Poll,
  PropertyHouse,
  PTIcon,
  RefreshIcon,
  RefreshSVG,
  OBPSIconSolidBg,
  DocumentIconSolid,
  PMBIconSolid,
  EventsIconSolid,
  SurveyIconSolid,
  DustbinIcon,
  InfoBannerIcon,
  AddFilled,
  AddFileFilled,
  ImageIcon,
  NotificationBell,
  HelpIcon,
  DocumentIcon,
  ExternalLinkIcon,
  PMBIcon,
  ShippingTruck,
  SortDown,
  SortSvg,
  GenericFileIcon,
  SortUp,
  UpwardArrow,
  ArrowDown,
  ArrowLeft,
  ArrowLeftWhite,
  ArrowRightInbox,
  SearchIconSvg,

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
  PaymentIcon,
} from "./atoms/svgindex";

import { Phone } from "./atoms/svgindex";
import { DownloadBtnCommon } from "./atoms/svgindex";

import { FieldComposer, FieldController, Fields, FormComposerV2, Modal, UploadFileComposer, FieldV1, InboxSearchComposer, ResultsTable } from "./hoc";

import {
  ApiDropdown,
  CustomDropdown,
  DetailsCard,
  FormStep,
  InputCard,
  LocationDropdownWrapper,
  MultiUploadWrapper,
  SearchAction,
  SearchForm,
  SearchField,
  SearchOnRadioButtons,
  TextInputCard,
  PanelCard,
  TimelineMolecule,
  TooltipWrapper
} from "./molecules";

// import { initCoreLibraries } from "@egovernments/digit-ui-libraries-core";
// import { initLibraries } from "@egovernments/digit-ui-libraries";

// initLibraries().then(() => {
//   console.info("DIGIT Contants enabled");
// });

export {
  ActionBar,
  ActionLinks,
  Amount,
  AppContainer,
  BackLink,
  Sidebar,
  MobileSidebar,
  Tooltip,
  Banner,
  BodyContainer,
  BreadCrumb,
  BreakLine,
  Button,
  SelectionCard,
  Card,
  CardBasedOptions,
  CardCaption,
  CardHeader,
  CardLabel,
  CardLabelError,
  CardText,
  CheckBox,
  PageBasedInput,
  CitizenHomeCard,
  CitizenInfoLabel,
  CollapseAndExpandGroups,
  ConnectingCheckPoints,
  DatePicker,
  DisplayPhotos,
  Dropdown,
  ErrorMessage,
  Footer,
  Header,
  HeaderBar,
  HorizontalNav,
  InfoCard,
  InputTextAmount,
  SearchField,
  KeyNote,
  LabelFieldPair,
  Loader,
  LoaderScreen,
  MobileNumber,
  MultiSelectDropdown,
  NoResultsFound,
  OTPInput,
  Paragraph,
  PlusMinusInput,
  PopUp,
  PrivateRoute,
  RadioButtons,
  Rating,
  Chip,
  SVG,
  // Table,
  Telephone,
  TextArea,
  TextInput,
  Toast,
  UploadFile,
  WhatsNewCard,
  FieldComposer,
  FieldV1,
  FieldController,
  Fields,
  FormComposerV2,
  Modal,
  UploadFileComposer,
  ApiDropdown,
  CustomDropdown,
  DetailsCard,
  FormStep,
  InputCard,
  LocationDropdownWrapper,
  MultiUploadWrapper,
  SearchAction,
  SearchForm,
  SearchOnRadioButtons,
  TextInputCard,
  PanelCard,
  TimelineMolecule,
  Toggle,
  ToggleSwitch,
  TreeSelect,
  SubmitBar,
  ButtonSelector,
  TopBar,
  Hamburger,
  Menu,
  Stepper,
  Timeline,
  StringManipulator,
  InfoButton,
  Uploader,
  UploadPopup,
  UploadImage,
  TextBlock,
  Panels,
  ViewCardFieldPair,
  ButtonsGroup,
  Divider,
  Animation,
  InboxSearchLinks,
  SearchComponent,
  InboxSearchComposer,
  ResultsTable,
  LinkLabel,
  RoundedLabel,
  //Icons
  FilterIcon,
  FilterSvg,
  PrintIcon,
  ShareIcon,
  Calender,
  DropIcon,
  RupeeIcon,
  ComplaintIcon,
  Person,
  WhatsappIcon,
  EmailIcon,
  DocumentSVG,
  PersonIcon,
  ReceiptIcon,
  AnnouncementIcon,
  OBPSIcon,
  CitizenTruck,
  EDCRIcon,
  BPAIcon,
  BPAHomeIcon,
  MapMarker,
  Clock,
  EventCalendar,
  TickMark,
  PDFSvg,
  DownloadPrefixIcon,
  EditIcon,
  SearchIcon,
  DeleteIcon,
  CreateLoiIcon,
  WSICon,
  CameraIcon,
  EditPencilIcon,
  GalleryIcon,
  RemoveIcon,
  CheckSvg,
  ArrowForward,
  ArrowVectorDown,
  ArrowDirection,
  AddressBookIcon,
  LocationIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
  FSMIcon,
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
  DeathIcon,
  BirthIcon,
  FirenocIcon,
  CreateEstimateIcon,
  GotoInboxIcon,
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
  PaymentIcon,
  Phone,
  CaseIcon,
  CloseSvg,
  Close,
  Details,
  DownloadIcon,
  DownloadImgIcon,
  DownwardArrow,
  Ellipsis,
  GetApp,
  HomeIcon,
  PrevIcon,
  ViewsIcon,
  LanguageIcon,
  LogoutIcon,
  Poll,
  PropertyHouse,
  PTIcon,
  RefreshIcon,
  RefreshSVG,
  OBPSIconSolidBg,
  DocumentIconSolid,
  PMBIconSolid,
  EventsIconSolid,
  SurveyIconSolid,
  DustbinIcon,
  InfoBannerIcon,
  AddFilled,
  AddFileFilled,
  ImageIcon,
  NotificationBell,
  HelpIcon,
  DocumentIcon,
  ExternalLinkIcon,
  PMBIcon,
  ShippingTruck,
  SortDown,
  SortSvg,
  GenericFileIcon,
  SortUp,
  UpwardArrow,
  ArrowDown,
  ArrowLeft,
  ArrowLeftWhite,
  ArrowRightInbox,
  SearchIconSvg,
  ErrorBoundary,
  TestComponent,
  Tag,
  TooltipWrapper
};
