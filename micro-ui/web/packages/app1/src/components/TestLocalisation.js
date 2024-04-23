import React from 'react';
import { useTranslation } from 'react-i18next';

const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

const TestLocalisation = () => {
  
  const { t, i18n } = useTranslation();

  const { isLoading, data } = Digit.Hooks.useLocalisationSearch({
    stateCode: 'mz',
    moduleCode: 'rainmaker-common',
    language: 'en',
    locale:"en_IN",
    config:{
      select:(data) => {
        const res=TransformArrayToObj(data?.data?.messages)
        i18n.addResourceBundle('en', 'translations', res);
        return []
      }
    }
  });

  const { isLoading:isLoadingHindi, data:dataHindi } = Digit.Hooks.useLocalisationSearch({
    stateCode: 'mz',
    moduleCode: 'rainmaker-common',
    language: 'en',
    locale:"hi_IN",
    config:{
      select:(data) => {
        const samplar = [
          {
              "code": "AADHAAR_IS_REQUIRED",
              "message": "आधार संख्या की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_BILL_CREATOR",
              "message": "बिल क्रिएटर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_BILL_VIEWER",
              "message": "बिल दर्शक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_CBO_ADMIN",
              "message": "सीबीओ व्यवस्थापक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_EMPLOYEE_COMMON",
              "message": "कर्मचारी सामान्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ESTIMATE_APPROVER",
              "message": "स्वीकृत अनुमान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ESTIMATE_CREATOR",
              "message": "अनुमान निर्माता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ESTIMATE_VERIFIER",
              "message": "अनुमान सत्यापित",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ESTIMATE_VIEWER",
              "message": "अनुमानित दर्शक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_HRMS_ADMIN",
              "message": "HRMS व्यवस्थापक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_JUNIOR_ENGINEER",
              "message": "कनिष्ठ अभियंता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_MUKTA_ADMIN",
              "message": "मुक्ता एडमिन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_MUNICIPAL_ENGINEER",
              "message": "नगरपालिका इंजीनियर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_MUSTER_ROLL_APPROVER",
              "message": "मस्टर रोल अनुमोदन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_MUSTER_ROLL_VERIFIER",
              "message": "मस्टर रोल सतही",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_OFFICER_IN_CHARGE",
              "message": "प्रभारी अधिकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ORG_ADMIN",
              "message": "संगठन व्यवस्थापक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ORG_STAFF",
              "message": "संगठन कर्मचारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_ORG_VIEWER",
              "message": "संगठन दर्शक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_PROJECT_CREATOR",
              "message": "परियोजना निर्माता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_PROJECT_VIEWER",
              "message": "प्रोजेक्ट व्यूअर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_STADMIN",
              "message": "स्टाफ एडमिन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_TECHNICAL_SANCTIONER",
              "message": "तकनीकी मंजूरी देने वाला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_WORK_ORDER_APPROVER",
              "message": "कार्य आदेश स्वीकृत",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_WORK_ORDER_CREATOR",
              "message": "वर्क ऑर्डर क्रिएटर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCESSCONTROL_ROLES_ROLES_WORK_ORDER_VERIFIER",
              "message": "कार्य आदेश सत्यापनकर्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCOUNT_HOLDER_NAME",
              "message": "खाता धारक का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCOUNT_HOLDER_NAME_IS_REQUIRED",
              "message": "खाता धारक का नाम आवश्यक है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCOUNT_NUMBER_IS_REQUIRED",
              "message": "खाता संख्या आवश्यक है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACCOUNT_TYPE_IS_REQUIRED",
              "message": "खाता प्रकार की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_0HOME",
              "message": "घर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_1PROJECT",
              "message": "परियोजनाओं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_2ESTIMATE",
              "message": "अनुमान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_3CONTRACTS",
              "message": "ठेके",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_4ATTENDENCEMGMT",
              "message": "मस्टर रोल्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_4ATThiDhiCEMGMT",
              "message": "उपस्थिति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_5BILLS",
              "message": "बिलिंग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_5PAYMENT",
              "message": "भुगतान सलाह",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_6DASHBOARD",
              "message": "चकरानेवाला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_7MASTERS",
              "message": "संगठन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_8WAGESEEKER",
              "message": "वेज सीकर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_9HRMS",
              "message": "एचआरएमएस",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_9MDMS",
              "message": "मास्टर डेटा प्रबंधित करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ACTIONS_TEST",
              "message": "कार्रवाई परीक्षण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ATTENDENCEMGMT",
              "message": "उपस्थिति प्रबंधन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ATTENDENCEMGMT_INBOX",
              "message": "उपस्थिति प्रबंधन इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ATTENDENCEMGMT_SEARCH",
              "message": "उपस्थिति प्रबंधन खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_BILLS",
              "message": "विधेयकों",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_BILL_INBOX",
              "message": "बिल इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_BILL_SEARCH",
              "message": "खोज बिल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_BILL_VIEW",
              "message": "बिल देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CHECKLIST",
              "message": "जांच सूची",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CHECKLIST_CREATE",
              "message": "चेकलिस्ट बनाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CHECKLIST_INBOX",
              "message": "चेकलिस्ट इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CONTRACT",
              "message": "कार्य आदेश",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CONTRACTS",
              "message": "ठेके",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CONTRACTS_CREATE",
              "message": "वर्क ऑर्डर बनाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CONTRACTS_INBOX",
              "message": "वर्क ऑर्डर इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CONTRACTS_SEARCH",
              "message": "खोज कार्य आदेश",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CREATE_EMPLOYEE",
              "message": "कर्मचारी बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CREATE_ESTIMATE",
              "message": "अनुमान बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CREATE_LOI",
              "message": "LOI बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CREATE_NEW_BILL",
              "message": "नया बिल बनाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_CREATE_PROJECT ",
              "message": "प्रोजेक्ट बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_DASHBOARD",
              "message": "चकरानेवाला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_DEPARTMENT",
              "message": "विभाग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ESTIMATE",
              "message": "अनुमान लगाना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ESTIMATE_INBOX",
              "message": "इनबॉक्स का अनुमान लगाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_HOME",
              "message": "घर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_HRMS",
              "message": "एचआरएमएस",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_LOCALISATION",
              "message": "स्थानीयकरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_LOI_INBOX",
              "message": "लोई इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MASTERS",
              "message": "मास्टर्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MASTERS_CREATE_ORGANISATION",
              "message": "संगठन बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MASTERS_CREATE_WAGESEEKER",
              "message": "मजदूरी साधक बनाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MASTERS_SEARCH_ORGANISATION",
              "message": "खोज संगठन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MASTERS_SEARCH_WAGESEEKER",
              "message": "खोज मजदूरी साधक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MDMS",
              "message": "मास्टर डेटा प्रबंधित करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MUSTER_ROLL",
              "message": "मस्टर रोल देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_MY_BILLS",
              "message": "मेरे बिल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_PAYMENT_DOWNLOAD",
              "message": "डाउनलोड भुगतान सलाह",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_PAYMENT_GENERATE",
              "message": "भुगतान सलाह उत्पन्न करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_PROJECT",
              "message": "परियोजनाओं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_PROJECTS",
              "message": "परियोजनाओं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_PROJECT_SEARCH",
              "message": "खोज परियोजना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ROLEACTIONS",
              "message": "भूमिका कार्रवाई",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_ROLES",
              "message": "भूमिकाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_SEARCH",
              "message": "खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_SEARCH_APPROVED_ESTIMATES",
              "message": "स्वीकृत अनुमान खोजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_SEARCH_EMPLOYEE",
              "message": "खोज कर्मचारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_SEARCH_ESTIMATE",
              "message": "खोज अनुमान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_TENANT",
              "message": "किराएदार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_TRADE_2",
              "message": "व्यापार मान्यताएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_TRADE_3",
              "message": "व्यापार विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_TRADE_ARRAY_TYPES",
              "message": "व्यापार सरणी प्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_UPDATE_DEPARTMENT_MASTER",
              "message": "विभाग मास्टर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_UPDATE_EMPLOYEETYPE_MASTER",
              "message": "कर्मचारी प्रकार मास्टर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_VIEW_ATTENDENCE",
              "message": "दृश्य -उपस्थिति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_VIEW_WORK_ORDER",
              "message": "कार्य क्रम देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_WAGESEEKER",
              "message": "वेज सीकर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_WORKBENCH",
              "message": "कार्यक्षेत्र",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_WORKS",
              "message": "काम करता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_WORKS_DASHBOARD",
              "message": "मुक्ता डैशबोर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_WORK_ORDER",
              "message": "कार्य - आदेश",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_TEST_WO_INBOX",
              "message": "वर्क ऑर्डर इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTION_VIEW_DETAILS",
              "message": "विवरण देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ACTIVE_EMPLOYEES",
              "message": "सक्रिय कर्मचारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "AGE_LESS_THAN_18_YEARS",
              "message": "उम्र 18 वर्ष से कम नहीं होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "AGE_SHOULD_BE_18_OR_ABOVE",
              "message": "उम्र 18 वर्ष या उससे अधिक होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "APPROVED",
              "message": "अनुमत",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ATM_INDIVIDUAL_DETAILS",
              "message": "व्यक्तिगत विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ATM_SELECT_SKILL",
              "message": "कौशल का चयन करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ATM_SKILLS_DETAILS",
              "message": "कौशल विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BANK_ACCOUNT_VALIDATION",
              "message": "मान्य खाता संख्या दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BILL_STATUS_PAYMENT_COMPLETED",
              "message": "भुगतान पूरा हुआ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BILL_STATUS_PAYMENT_INITIATED",
              "message": "भुगतान शुरू किया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BILL_STATUS_PAYMENT_INITIATED_TOAST",
              "message": "भुगतान आरंभ किया गया, कार्य क्रमांक:",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BILL_STATUS_PAYMENT_PENDING",
              "message": "भुगतान लंबित",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BORING_MISTRY",
              "message": "बोरिंग मिस्त्री",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "BPA_NO_DOCUMENTS_UPLOADED_LABEL",
              "message": "कोई दस्तावेज अपलोड नहीं किया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CAMERA",
              "message": "कैमरा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CANNOT_HAVE_SAME_SKILL_TYPE",
              "message": "व्यक्ति में समान कौशल प्रकार नहीं हो सकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CBO.NA",
              "message": "लागू नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CHAIN_MAN",
              "message": "चेन मैन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CHOOSE_AN_ACTION",
              "message": "एक क्रिया चुनें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CHOOSE_FILE",
              "message": "फाइलें चुनें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CITY_IS_REQUIRED",
              "message": "शहर की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CLEANER",
              "message": "सफाई वाला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CLEAR_SEARCH_LINk",
              "message": "स्पष्ट खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CLICK_TO_ADD_PHOTO",
              "message": "फोटो जोड़ने के लिए क्लिक करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CMN_NOOPTION",
              "message": "कोई विकल्प नहीं मिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ASSIGNEE",
              "message": "संपत्ति-भागी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_BRANCH_NAME",
              "message": "शाखा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_BUTTON_BACK",
              "message": "पीछे",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_CANNOT_MODIFY_PROJECT_EST_CREATED",
              "message": "परियोजना के लिए अनुमान तैयार किया जाता है, इसलिए विवरण को संशोधित नहीं किया जा सकता है।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_CBO_ID",
              "message": "सीबीओ आईडी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_CHECK_FORWARD",
              "message": "प्रसंस्करण विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_CREATE_CONTRACT",
              "message": "वर्क ऑर्डर बनाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_CREATE_ESTIMATE",
              "message": "अनुमान बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_DAYS",
              "message": "दिन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_DESGN_OF_OFFICER_IN_CHARGE",
              "message": "प्रभारी अधिकारी का पदनाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_DOWNLOAD",
              "message": "डाउनलोड करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_END_DATE_SHOULD_BE_GREATER_THAN_START_DATE",
              "message": "अंतिम तिथि प्रारंभ तिथि से अधिक होनी चाहिए।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ENTER_VALID_GEO_LOCATION",
              "message": "कृपया वैध जियो स्थान दर्ज करें।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ERROR_FETCHING_DATA",
              "message": "त्रुटि डेटा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ERROR_FETCHING_ESTIMATE_DETAILS",
              "message": "एरर लानेिंग एस्टिमेट डिटेल्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ERROR_FETCHING_WAGE_SEEKER_DETAILS",
              "message": "त्रुटि लाने वाले मजदूरी साधक विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ESTIMATE_NOT_FOUND",
              "message": "अनुमान नहीं मिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_FILE_COMPONENT_BANNER",
              "message": "केवल JPG, PDF, DOC, DOCX, XLS, XLSX फ़ाइलों को अपलोड किया जा सकता है। फ़ाइल का आकार 5 एमबी से अधिक नहीं होना चाहिए।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_FINANCIAL_DETAILS",
              "message": "वित्तीय विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_GENDER_FEMALE",
              "message": "महिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_GENDER_MALE",
              "message": "नर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_GENDER_TRANSGENDER",
              "message": "ट्रांसजेंडर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_GUARDIAN_NAME",
              "message": "अभिभावक का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_IFSC_CODE",
              "message": "IFSC कोड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_INBOX_ASSIGNED_TO_ALL",
              "message": "सभी को सौंपा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_INBOX_ASSIGNED_TO_ME",
              "message": "मुझे सौंपा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_LABOUR_AND_MATERIAL_ANALYSIS",
              "message": "श्रम और सामग्री विश्लेषण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_LOCALITY",
              "message": "इलाका",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_LOCATION_DETAILS",
              "message": "स्थान विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_A",
              "message": "ए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_B",
              "message": "बी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_C",
              "message": "सी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ACC_AO",
              "message": "लेखा अधिकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ACC_JAO",
              "message": "कनिष्ठ लेखा अधिकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ADM_ADMC",
              "message": "अपर आयुक्त",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ADM_AEO",
              "message": "सहायक कार्यकारी अधिकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ADM_AMC",
              "message": "सहायक आयुक्त",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ADM_DMC",
              "message": "उप आयुक्त",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ADM_EO",
              "message": "कार्यकारी अधिकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_ADM_MC",
              "message": "आयुक्त",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_Tax",
              "message": "वार्ड अधिकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_ACCE",
              "message": "खाता विशेषज्ञ (मुक्ता)",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_AE",
              "message": "सहायक संलग्नक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_AEE",
              "message": "सहायक कार्यकारी अभियंता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_AM",
              "message": "अमीन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_CE",
              "message": "शहर के एंगिनर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_DA",
              "message": "सौदा सहायक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_DEE",
              "message": "उप -कार्यकारी अभियंता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_EE",
              "message": "अधिशाषी अभियंता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_IE",
              "message": "कार्यान्वयन विशेषज्ञ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_JE",
              "message": "कनिष्ठ एंगिनर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_ME",
              "message": "नगरपालिका इंजीनियर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_PC",
              "message": "कार्यक्रम समन्वयक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_DESIGNATION_WRK_RI",
              "message": "राजस्व निरीक्षक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_ORG_CBO",
              "message": "सामुदायिक आधारित संगठन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_ORG_VEN",
              "message": "वेंडर आपूर्तिकर्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SOCIAL_GENERAL",
              "message": "आम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SOCIAL_OBC",
              "message": "अन्य पिछड़ा वर्ग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SOCIAL_OTHER",
              "message": "अन्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SOCIAL_SC",
              "message": "अनुसूचित जाति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SOCIAL_ST",
              "message": "अनुसूचित जनजाति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SUBORG_ALF",
              "message": "क्षेत्र स्तर संघ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SUBORG_CLF",
              "message": "सामुदायिक स्तर संघ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SUBORG_CMS",
              "message": "निर्माण सामग्री आपूर्तिकर्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SUBORG_MSG",
              "message": "मिशन शक्ति समूह",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SUBORG_NA",
              "message": "लागू नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_SUBORG_SDA",
              "message": "स्लम ड्वेलर्स एसोसिएशन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTERS_null",
              "message": "ना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MASTER_DESIGNATION_WRK_EE",
              "message": "अधिशाषी अभियंता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MATERS_SOCIAL_GENERAL",
              "message": "आम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MATER_S_A",
              "message": "एक कक्षा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MATER_S_B",
              "message": "क्लास बी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MATER_S_C",
              "message": "क्लास सी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MATER_S_D",
              "message": "क्लास डी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MATER_S_NA",
              "message": "लागू नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MODIFY_PROJECT",
              "message": "प्रोजेक्ट को संशोधित करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_MODIFY_WO",
              "message": "कार्य आदेश को संशोधित करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_NAME_OF_CBO",
              "message": "सीबीओ का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_NAME_OF_OFFICER_IN_CHARGE",
              "message": "प्रभारी अधिकारी का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_NO_RESULTS_FOUND",
              "message": "कोई परिणाम नहीं मिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ORG_ID",
              "message": "संगठन -आईडी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ORG_NAME",
              "message": "संगठन का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PATTERN_ERR_MSG_MUSTER_ID",
              "message": "कृपया मान्य मस्टर आईडी दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PATTERN_ERR_MSG_PROJECT_COMP_PERIOD",
              "message": "प्रोजेक्ट पूरा होने की अवधि न्यूनतम होनी चाहिए: 1 दिन और अधिकतम: 365 दिन।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PATTERN_ERR_MSG_PROJECT_WO_AMT",
              "message": "कृपया मान्य कार्य आदेश राशि दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PHOTOGRAPH",
              "message": "फोटो",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PINCODE_VALIDATION",
              "message": "पिनकोड 6 अंकों का होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PROJECT_COMP_PERIOD_DAYS",
              "message": "परियोजना पूर्णता अवधि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_PROJECT_NOT_FOUND",
              "message": "परियोजना नहीं मिली",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_RESPONSE",
              "message": "खोज अनुमान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_RE_ENTER_ACCOUNT_NO",
              "message": "खाता संख्या फिर से एंटर करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_ROLE_OF_CBO",
              "message": "सीबीओ की भूमिका",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SELECTED",
              "message": "गिने चुने",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SELECT_LOCALITY",
              "message": "स्थानीयता का चयन करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SELECT_SKILL",
              "message": "कौशल का चयन करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SELECT_WARD",
              "message": "वार्ड का चयन करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SLA_DAYS",
              "message": "SLA दिन शेष",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SOCIAL_CATEGORY",
              "message": "सामाजिक श्रेणी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_START_DATE_SHOULD_BE_LESS_THAN_END_DATE",
              "message": "प्रारंभ तिथि अंतिम तिथि से कम होनी चाहिए।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_SUBDIVISION_MUNICIPAL_CORPORATION",
              "message": "नगर निगम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_TERMS_&_CONDITIONS",
              "message": "नियम और शर्तें देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_TERMS_AND_CONDITIONS",
              "message": "नियम और शर्तें देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_TOTAL",
              "message": "कुल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_VIEW_BILLS",
              "message": "बिल देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_VIEW_COMMUNITY_ORG",
              "message": "सामुदायिक संगठन देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_VIEW_ESTIMATE",
              "message": "देखें अनुमान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_WARD",
              "message": "बालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_WORKFLOW_STATES",
              "message": "वर्कफ़्लो राज्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_WORK_ORDER_AMT_RS",
              "message": "कार्य आदेश राशि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_WO_DETAILS",
              "message": "कार्य आदेश विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMMON_WO_NOT_FOUND",
              "message": "वर्क ऑर्डर नहीं मिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "COMPLETED_LABEL",
              "message": "पुरा होना।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CONTACT_ADMINISTRATOR_FOR_PASSWORD",
              "message": "पासवर्ड रीसेट करने के लिए कृपया व्यवस्थापक से संपर्क करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CONTRACTS_MODIFIED",
              "message": "कार्य आदेश सफलतापूर्वक संशोधित किया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_BACK_BUTTON",
              "message": "पीछे",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_BUTTON_ACCEPT",
              "message": "स्वीकार करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_BUTTON_BACK",
              "message": "वापस जाओ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_BUTTON_CONFIRM",
              "message": "पुष्टि करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_BUTTON_DECLINE",
              "message": "पतन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_CHANGE_TENANT_OK",
              "message": "ठीक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_AADHAAR",
              "message": "आधार संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_ACCOUNT_NO",
              "message": "खाता संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_ACCOUNT_TYPE",
              "message": "खाते का प्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_BACK_HOME_BUTTON",
              "message": "घर वापिस जा रहा हूँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_BANK_ACCOUNT_NO",
              "message": "बैंक खाता नम्बर।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_CHANGE_PASSWORD",
              "message": "पासवर्ड बदलें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_CITY",
              "message": "शहर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_CITY *",
              "message": "शहर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_CONTINUE",
              "message": "जारी रखना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_CURRENT",
              "message": "मौजूदा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_DATES",
              "message": "पिंड खजूर।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_EMAIL",
              "message": "ईमेल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_FATHER",
              "message": "पिता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_FEMALE",
              "message": "महिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_FORGOT_PASSWORD",
              "message": "पासवर्ड भूल गए?",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_FORGOT_PASSWORD_LABEL",
              "message": "पासवर्ड भूल गए?",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_GENDER",
              "message": "लिंग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_GENDER_FEMALE",
              "message": "महिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_GENDER_MALE",
              "message": "नर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_GENDER_TRANSGENDER",
              "message": "ट्रांसजेंडर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_GENERAL",
              "message": "आम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_GO_TO_HOME",
              "message": "घर वापस जाओ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_HUSBAND",
              "message": "पति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_LOCALITY",
              "message": "इलाका",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_LOGIN",
              "message": "लॉग इन करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_LOGOUT",
              "message": "लॉग आउट",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_MALE",
              "message": "नर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_MOBILE_NUMBER",
              "message": "मोबाइल नंबर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_NAME",
              "message": "नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_OBC",
              "message": "अन्य पिछड़ा वर्ग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PHONE_NUMBER",
              "message": "फ़ोन नंबर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PINCODE",
              "message": "पिन कोड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_CITY",
              "message": "शहर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_CONFIRM_PASSWORD",
              "message": "पासवर्ड की पुष्टि कीजिये",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_CONFIRM_PASSWORD,",
              "message": "नए पासवर्ड की पुष्टि करें:",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_CURRENT_PASSWORD",
              "message": "वर्तमान पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_CURRENT_PASSWORD,",
              "message": "वर्तमान पासवर्ड:",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_EMAIL",
              "message": "ईमेल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_GENDER",
              "message": "लिंग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_MOBILE_NUMBER",
              "message": "मोबाइल नंबर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_NAME",
              "message": "नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_NEW_PASSWORD",
              "message": "नया पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_NEW_PASSWORD,",
              "message": "नया पासवर्ड:",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_PASSWORD_INVALID",
              "message": "अवैध पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_PROFILE_UPDATE_SUCCESS",
              "message": "प्रोफाइल को सफलतापूर्वक अपडेट किया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_RELATIONSHIP",
              "message": "रिश्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_RESET_PASSWORD_LABEL",
              "message": "पासवर्ड रीसेट",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_SAVE",
              "message": "बचाना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_SAVINGS",
              "message": "जमा पूंजी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_SC",
              "message": "अनुसूचित जाति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_ST",
              "message": "अनुसूचित जनजाति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_STATUS",
              "message": "दर्जा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_SUBMIT",
              "message": "जमा करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_TRANSGENDER",
              "message": "ट्रांसजेंडर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_COMMON_WARD",
              "message": "बालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_DOB",
              "message": "जन्म की तारीख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_DOOR_NO",
              "message": "दरवाजा नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_FRI",
              "message": "शुक्र",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_CONFIRM_NEW_PASSWORD",
              "message": "नए पासवर्ड की पुष्टि करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_CONFIRM_NEW_PASSWORD,",
              "message": "नए पासवर्ड की पुष्टि करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_NEW_PASSWORD",
              "message": "नया पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_NEW_PASSWORD,",
              "message": "नया पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_PASSWORD",
              "message": "पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_PASSWORD *",
              "message": "पासवर्ड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_USERNAME",
              "message": "उपयोगकर्ता नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGIN_USERNAME *",
              "message": "उपयोगकर्ता नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGOUT_CANCEL",
              "message": "रद्द करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGOUT_MESSAGE",
              "message": "लॉग आउट",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGOUT_MESSAGE?",
              "message": "लॉग आउट",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGOUT_WEB_CONFIRMATION_MESSAGE",
              "message": "क्या आप सचमच करना चाहते हैं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGOUT_WEB_HEADER",
              "message": "लॉग आउट",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_LOGOUT_WEB_YES",
              "message": "लॉग आउट",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_MON",
              "message": "सोम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_MSG_WARNING",
              "message": "चेतावनी!",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_SAT",
              "message": "शनि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_SEARCH_BY_MOBILE",
              "message": "मोबाइल नंबर द्वारा खोजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_SEARCH_BY_NAME",
              "message": "नाम से खोजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_SEARCH_BY_NAME_AADHAAR",
              "message": "नाम / आधार द्वारा खोजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_SEARCH_BY_NAME_MOBILE_NO",
              "message": "नाम / मोबाइल नंबर द्वारा खोजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_STREET_NAME",
              "message": "सड़क का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_SUN",
              "message": "रवि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_THU",
              "message": "गुरु",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_TUE",
              "message": "मंगल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CORE_WED",
              "message": "बुध",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CREATED_FROM_DATE",
              "message": "तिथि से बनाया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CREATED_TO_DATE",
              "message": "आज तक बनाया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CREATE_INDIVIDUAL_SUCCESS",
              "message": "मजदूरी साधक पंजीकरण सफल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CREATE_INDIVIDUAL_SUCCESS_SUB_TEXT",
              "message": "मजदूरी साधक को आईडी {individualID} के साथ सफलतापूर्वक पंजीकृत किया गया है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_ACTION_CANCEL",
              "message": "रद्द करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_ACTION_CLOSE",
              "message": "बंद करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_ACTION",
              "message": "कार्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_ATTACHMENTS",
              "message": "संलग्नक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_CHOOSE_FILE",
              "message": "फाइलें चुनें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_DOCUMENTS",
              "message": "दस्तावेज़",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_DOWNLOAD",
              "message": "डाउनलोड करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_NEXT",
              "message": "अगला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_PROCEED",
              "message": "आगे बढ़ना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_ROWS_PER_PAGE",
              "message": "प्रति पृष्ठ पंक्तियाँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_COMMON_SUBMIT",
              "message": "जमा करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_HOME_HEADER_LANGUAGE",
              "message": "भाषा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_INBOX_SEARCH",
              "message": "खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_LOGIN_OTP_TEXT",
              "message": "भेजे गए OTP को दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_LOGIN_OTP_TEXT,",
              "message": "भेजे गए OTP को दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_RESEND_ANOTHER_OTP",
              "message": "एक और ओटीपी को फिर से भरें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_RESEND_ANOTHER_OTP,",
              "message": "एक और ओटीपी को फिर से भेजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_RESEND_OTP",
              "message": "ओटीपी पुनः भेजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_RESEND_OTP,",
              "message": "ओटीपी पुनः भेजें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_RESEND_SECONDS",
              "message": "सेकेंड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "CS_RESEND_SECONDS,",
              "message": "सेकेंड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DATE_OF_INCORP",
              "message": "संस्थापन की तारीख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DATE_VALIDATION_MSG",
              "message": "तारीख तक मान्य तारीख से मान्य से अधिक होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DATE_VALIDATION_VALID_TO_VALID_FROM_MSG",
              "message": "तारीख तक मान्य तारीख से मान्य से अधिक होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DEPT_REG_NO",
              "message": "विभाग पंजीकरण संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DESIGNATION",
              "message": "पद",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DOB_IS_REQUIRED",
              "message": "जन्म तिथि की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "DUPLICATE_AADHAAR",
              "message": "दर्ज किया गया आधार पहले से ही सिस्टम में मौजूद है।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EDIT_PROFILE",
              "message": "प्रोफ़ाइल संपादित करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EMAIL_VALIDATION",
              "message": "एक वैध ईमेल प्रविष्ट करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ENTERED_MOBILE_NO_NOT_REGISTERED_AS_CBO",
              "message": "दर्ज किए गए मोबाइल नंबर सिस्टम में CBO उपयोगकर्ता के रूप में पंजीकृत नहीं है।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ENTER_OTP_SENT_TO",
              "message": "{mobileNumber} पर भेजे गए OTP दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ENTER_REGISTERED_MOBILE",
              "message": "कृपया पंजीकृत मोबाइल नंबर दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ENTER_VALID_IFSC_CODE",
              "message": "कृपया मान्य IFSC कोड दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ERR_PT_FILL_VALID_FIELDS",
              "message": "कृपया खोज करने के लिए मान्य फ़ील्ड भरें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ESTIMATE_ESTIMATE_NO",
              "message": "अनुमान संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EST_VIEW_ACTIONS_CREATE_CONTRACT",
              "message": "अनुबंध बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_AADHAR",
              "message": "आधार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ACCOUNT_HOLDER_NAME",
              "message": "खाता धारक का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_AGE_GREATER_THAN_18_ERROR",
              "message": "आयु 18 वर्ष से अधिक होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_APPLY",
              "message": "आवेदन करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ATTENDENCEMGMT",
              "message": "मुक्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_BIRTHDATE",
              "message": "जन्म की तारीख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_BRANCH",
              "message": "शाखा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CANCEL",
              "message": "रद्द करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CATEGORY",
              "message": "वर्ग",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CBO_NAME",
              "message": "सीबीओ नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CLEAR_SEARCH",
              "message": "स्पष्ट खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CONTACT_DETAILS",
              "message": "सम्पर्क करने का विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CPS-CWNS",
              "message": "चाइल्ड प्ले स्टेशन - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CPS-CWS",
              "message": "चाइल्ड प्ले स्टेशन - कैपिटल वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CPS-OMNS",
              "message": "चाइल्ड प्ले स्टेशन - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CPS-OMS",
              "message": "चाइल्ड प्ले स्टेशन - संचालन और रखरखाव - झुग्गी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CREATED_BY",
              "message": "के द्वारा बनाई गई",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CREATED_FROM",
              "message": "से बनाया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_CREATED_TO",
              "message": "को बनाया गया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_DAYS_LESS_THAN_SEVEN_ERROR",
              "message": "संशोधित दिन 0 से 7 के बीच होने चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_DOC_FILENAME",
              "message": "फ़ाइल का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_DOOR_NO",
              "message": "दरवाजा/ घर की संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ENTER_DATE_RANGE",
              "message": "मान्य दिनांक सीमा दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ENTER_NAME",
              "message": "फ़ाइल नाम दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_FILTERS",
              "message": "फिल्टर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_FILTER_BY",
              "message": "फिल्टर के द्वारा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_GOTO_HOME",
              "message": "घर जाओ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_HOME",
              "message": "घर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_IFSC_CODE_ERROR",
              "message": "मान्य IFSC कोड दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_INBOX",
              "message": "इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_INFO",
              "message": "जानकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_LOCATION",
              "message": "जगह",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_LOCATION_DETAILS",
              "message": "स्थान विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_LOO-CWNS",
              "message": "लू - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_LOO-OMNS",
              "message": "लू - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_LOO-OMS",
              "message": "लू - संचालन और रखरखाव - झुग्गी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_LOO_CWS",
              "message": "लू - कैपिटल वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MIN_SEARCH_CRITERIA_MSG",
              "message": "कृपया न्यूनतम खोज मानदंड दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MOBILE_EXISTS_ERROR",
              "message": "मोबाइल नंबर पहले से मौजूद है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MODE_OF_ENTRUSTMENT",
              "message": "अनुशंसित मोड का अनुशंसित मोड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MODIFY",
              "message": "संशोधित",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MP-CWNS",
              "message": "मिनी पार्क - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MP-CWS",
              "message": "मिनी पार्क - कैपिटल वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MP-OMNS",
              "message": "मिनी पार्क - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MP-OMS",
              "message": "मिनी पार्क - संचालन और रखरखाव - झुग्गी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MP001",
              "message": "मिनी पार्क उप परियोजना 1",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MP002",
              "message": "मिनी पार्क उप परियोजना 2",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MUSTER_ROLL_ID",
              "message": "मस्टर रोल आईडी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_MUSTER_ROLL_PERIOD",
              "message": "मस्टर रोल अवधि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_NA",
              "message": "ना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_NO_DATA",
              "message": "डाटा प्राप्त नहीं हुआ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_NO_ITEMS",
              "message": "कोई वस्तु नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_NO_ORG_LINKED_WITH_MOBILE_NUMBER",
              "message": "दर्ज किए गए मोबाइल नंबर के साथ कोई संगठन मौजूद नहीं है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_OAG-CWNS",
              "message": "ओपन एयर जिम - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_OAG-CWS",
              "message": "ओपन एयर जिम - कैपिटल वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_OAG-OMNS",
              "message": "ओपन एयर जिम - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_OAG-OMS",
              "message": "ओपन एयर जिम - संचालन और रखरखाव - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ORG_EXISTS_WITH_MOBILE_NUMBER",
              "message": "इस मोबाइल नंबर के साथ एक संगठन पहले से मौजूद है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ORG_NAME",
              "message": "संगठन का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PAGE_1",
              "message": "प्रोफ़ाइल संपादित करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PG-CWNS",
              "message": "खेल का मैदान - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PG-CWS",
              "message": "खेल का मैदान - खेल का मैदान - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PG-OMNS",
              "message": "खेल का मैदान - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PG-OMS",
              "message": "खेल का मैदान - संचालन और रखरखाव - झुग्गी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PHOTOGRAPH",
              "message": "फोटो",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PLEASE_ENTER_ALL_MANDATORY_FIELDS",
              "message": "कृपया सभी मैंडरी फ़ील्ड दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PROJECT_NAME",
              "message": "परियोजना का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_PROPOSAL_DATE",
              "message": "प्रस्ताव की तारीख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_RELATIONSHIP",
              "message": "रिश्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_RESPONSE",
              "message": "जवाब",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_SEARCH",
              "message": "खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_SEARCH_BY",
              "message": "खोज से:",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_SKILL",
              "message": "कौशल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_SKILL_CATEGORY",
              "message": "कौशल श्रेणी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_STATUS",
              "message": "दर्जा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_STREET",
              "message": "गली",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_STREET_NAME",
              "message": "सड़क का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_TAKE_ACTION",
              "message": "कार्यवाही करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_TOTAL_AMOUNT",
              "message": "कुल राशि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_ULB",
              "message": "यूएलबी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VALID_DAY",
              "message": "मान्य दिन दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VALID_FROM",
              "message": "से मान्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VALID_TO",
              "message": "मान्य के लिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VZ-CWNS",
              "message": "वेंडिंग ज़ोन - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VZ-CWS",
              "message": "वेंडिंग ज़ोन - कैपिटल वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VZ-OMNS",
              "message": "वेंडिंग ज़ोन - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_VZ-OMS",
              "message": "वेंडिंग ज़ोन - कैपिटल वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WB-CWNS",
              "message": "वाटर बॉडी - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WB-CWS",
              "message": "जल निकाय - राजधानी वर्क्स - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WB-OMNS",
              "message": "जल निकाय - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WB-OMS",
              "message": "जल निकाय - संचालन और रखरखाव - झुग्गी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WORK_NATURE",
              "message": "कार्य की प्रकृति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WT-CWNS",
              "message": "वॉकिंग ट्रैक - कैपिटल वर्क्स - नॉन -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WT-CWS",
              "message": "वॉकिंग ट्रैक - वॉकिंग ट्रैक - स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WT-OMNS",
              "message": "वॉकिंग ट्रैक - संचालन और रखरखाव - गैर -स्लम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_COMMON_WT-OMS",
              "message": "वॉकिंग ट्रैक - संचालन और रखरखाव - झुग्गी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_ERROR_USER_NOT_PERMITTED",
              "message": "उपयोगकर्ता की अनुमति नहीं है!",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_FORGOT_PASSWORD_DESC",
              "message": "कृपया पासवर्ड रीसेट करने के लिए अपना फ़ोन नंबर दर्ज करें।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_INVALID_LOGIN_CREDENTIALS",
              "message": "अमान्य प्रवेश करना प्रत्यायक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_SELECT_AN_OPTION",
              "message": "कोई विकल्प चुनें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_SOMETHING_WRONG",
              "message": "कुछ गलत हो गया !!",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_SOMETHING_WRONG,",
              "message": "कुछ गलत हो गया !!",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ES_WAGE_SEEKER",
              "message": "मजदूरी साधक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EVENTS_DESCRIPTION",
              "message": "विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EVENTS_END_DATE_LABEL",
              "message": "अंतिम तिथि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EVENTS_START_DATE_LABEL",
              "message": "आरंभ करने की तिथि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EXP_PAYMENT_INS",
              "message": "भुगतान अनुदेश",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "EXP_VIEW_BILLS_MENU",
              "message": "बिल मेनू देखें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FATHER_NAME",
              "message": "पिता / पति का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FATHER_NAME_IS_REQUIRED",
              "message": "पिता का नाम आवश्यक है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FEMALE",
              "message": "महिला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FEMALE_MULIA",
              "message": "मादा मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FILE_LIMIT_EXCEED",
              "message": "फ़ाइल का आकार पार हो गया है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FILE_LIMIT_EXCEEDED",
              "message": "फ़ाइल सीमा अपलोड करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FILE_MANAGER",
              "message": "गेलरी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FILE_SIZE",
              "message": "अधिकतम फ़ाइल का आकार 5 एमबी होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FILE_SIZE_EXCEEDED",
              "message": "कृपया 2mb से कम फ़ाइल अपलोड करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "FITTER",
              "message": "फिटर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "Filter",
              "message": "फ़िल्टर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "GENDER_IS_REQUIRED",
              "message": "लिंग की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HAMMER_MAN",
              "message": "हथौड़ा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HELPER_WELL_SINKER",
              "message": "अच्छी तरह से सिंकर करने के लिए सहायक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIDE_WORKFLOW_TIMELINE",
              "message": "वर्कफ़्लॉवर्टिमलाइन छिपाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED",
              "message": "कुशल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED.FITTER",
              "message": "कुशल - फिटर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED.MASON",
              "message": "कुशल - मेसन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED.PAINTER",
              "message": "कुशल - चित्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED.PLUMBER",
              "message": "कुशल - प्लम्बर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED_FITTER",
              "message": "कुशल - फिटर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED_MASON",
              "message": "कुशल - मेसन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED_PAINTER",
              "message": "कुशल - चित्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HIGHLY_SKILLED_PLUMBER",
              "message": "कुशल - प्लम्बर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HINT_BANK_DETAILS",
              "message": "बैंक ऑफ इंडिया, धेंकनल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HOME_SERVICE_REQUESTS",
              "message": "मेरी सेवा अनुरोध",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HR_COMMON_CREATE_EMPLOYEE_HEADER",
              "message": "कर्मचारी बनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "HR_HOME_SEARCH_RESULTS_HEADING",
              "message": "खोज कर्मचारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "IFSC_CODE_IS_REQUIRED",
              "message": "IFSC कोड की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "IND_ALREADY_ADDED_TO_THE_TABLE",
              "message": "व्यक्ति को पहले से ही सूची में जोड़ा गया है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "INVALID_CREDENTIALS",
              "message": "अवैध प्रत्यय पत्र",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "INVALID_LOGIN_CREDENTIALS",
              "message": "अमान्य प्रवेश करना प्रत्यायक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "IN_PROGRESS_LABEL",
              "message": "चालू",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "LOCALITY_IS_REQUIRED",
              "message": "स्थानीयता की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "LOGIN_INVALID_OTP",
              "message": "अमान्य ओटीपी!",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MALE",
              "message": "नर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MALE_MULIA",
              "message": "नर म्यूलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MASON",
              "message": "राजमिस्त्री",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MASTERS_EFFECTIVE_FROM",
              "message": "से प्रभावी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MASTERS_EFFECTIVE_TO",
              "message": "के लिए प्रभावी होना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MAX_AADHAAR_CHARCTERS_REQUIRED",
              "message": "आधार संख्या 12 अंकों की होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MAX_ACCOUNT_NO_CHARACTERS_REQUIRED",
              "message": "खाता संख्या अधिकतम 18 वर्ण होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MAX_FATHER_CHARCTERS_REQUIRED",
              "message": "पिता का नाम अधिकतम 128 वर्ण होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MAX_MOBILE_CHARCTERS_REQUIRED",
              "message": "मोबाइल नंबर 10 अंकों का होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MAX_NAME_CHARCTERS_REQUIRED",
              "message": "नाम अधिकतम 128 वर्णों का होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MIN_AADHAAR_CHARCTERS_REQUIRED",
              "message": "आधार संख्या 12 अंकों की होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MIN_ACCOUNT_NO_CHARACTERS_REQUIRED",
              "message": "खाता संख्या न्यूनतम 9 वर्णों की होनी चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MIN_FATHER_CHARCTERS_REQUIRED",
              "message": "पिता का नाम न्यूनतम 2 वर्ण होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MIN_MOBILE_CHARCTERS_REQUIRED",
              "message": "मोबाइल नंबर 10 अंकों का होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MIN_NAME_CHARCTERS_REQUIRED",
              "message": "नाम न्यूनतम 2 वर्ण होना चाहिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MIN_SEARCH_CRITERIA_MSG",
              "message": "कृपया न्यूनतम 1 खोज मानदंड दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MOBILE_NUMBER_IS_REQUIRED",
              "message": "मोबाइल नंबर की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MUKTA",
              "message": "मुक्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MUSTER_ROLL_PERIOD",
              "message": "मस्टर रोल अवधि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MUSTOR_APPROVAL_CHECKBOX",
              "message": "मापन पुस्तिका से मस्टर रोल सत्यापित किया गया है। एक बार स्वीकृत भुगतान सलाह उत्पन्न हो जाएगी और भुगतान प्रक्रिया के लिए JIT-FS को भेज दी जाएगी.",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "MY_WORKS",
              "message": "मेरे काम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "NAME_IS_REQUIRED",
              "message": "नाम आवश्यक है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "NAME_OF_WAGE_SEEKER",
              "message": "मजदूरी साधक का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "NOT_SUPPORTED_FILE_TYPE",
              "message": "फ़ाइल प्रकार समर्थित नहीं है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "NO_FILE_UPLOADED",
              "message": "कोई फ़ाइल अपलोड नहीं की गई थी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "NO_TERMS_AND_CONDITIONS",
              "message": "कोई नियम और शर्तें नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_CLASS_OR_RANK",
              "message": "वर्ग रैंक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_CONTACT_DETAILS",
              "message": "सम्पर्क करने का विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_CONTACT_PERSON_NAME",
              "message": "संपर्क व्यक्ति का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_FUNC_CAT",
              "message": "कार्यात्मक श्रेणी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_FUNC_DETAILS",
              "message": "कार्यात्मक विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_PROFILE",
              "message": "Org प्रोफ़ाइल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_SUB_TYPE",
              "message": "संगठन उप प्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_TYPE",
              "message": "संगठन प्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_VALIDATION_ERROR_DEPT",
              "message": "अमान्य विभाग का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_VALID_FROM",
              "message": "से मान्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ORG_VALID_TO",
              "message": "मान्य के लिए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS",
              "message": "अन्य",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS.BORING_MISTRY",
              "message": "बोरिंग - मिस्त्री",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS.HELPER_WELL_SINKER",
              "message": "अच्छी तरह से सिंकर करने के लिए सहायक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS.WINCH_OPERATOR",
              "message": "विंच - प्रचालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS_BORING_MISTRY",
              "message": "बोरिंग - मिस्त्री",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS_HELPER_WELL_SINKER",
              "message": "अच्छी तरह से सिंकर करने के लिए सहायक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTHERS_WINCH_OPERATOR",
              "message": "विंच - प्रचालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "OTP_VERIFICATION",
              "message": "ओटीपी सत्यापन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PAINTER",
              "message": "चित्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PDF_STATIC_LABEL_ESTIMATE_WARD",
              "message": "बालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_B1",
              "message": "वार्ड वन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_B2",
              "message": "वार्ड टू",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_B3",
              "message": "वार्ड थ्री",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_B4",
              "message": "वार्ड फोर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN01",
              "message": "राजन वला (दोनों पक्ष) - एरिया 1",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN02",
              "message": "गुगा मादी रोड (पूर्व की ओर) - एरिया 2",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN03",
              "message": "Singhkiyan (Nothern Side) - areas1",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN10",
              "message": "अजीत नगर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN11",
              "message": "बख्तौर नगर - एरिया 1",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN12",
              "message": "गुरुद्वारा नियाई साहिब स्ट्रीट 1 - एरिया 1",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN20",
              "message": "सिनेमा रोड - एरिया 1",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN21",
              "message": "चंद्र कॉलोनी बिगगरवाल रोड - एरिया 2",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN22",
              "message": "Bigharwal Chowk to रेलवे स्टेशन - एरिया 2",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN30",
              "message": "बाबू लाबा सिंह नगर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN31",
              "message": "डेरा प्रीत नगर झुगिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN32",
              "message": "जावला नगर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG.CITYA_ADMIN_SUN33",
              "message": "नागरा रोड",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PG_PG.CITYA",
              "message": "शहर ए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PHONE_VALIDATION",
              "message": "मान्य फोन दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PHOTOGRAPH",
              "message": "फोटो",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PHOTOGRAPH_VALID_SIZE",
              "message": "केवल PNG, JPG और JPEG फ़ाइलों की अनुमति है। अधिकतम फ़ाइल आकार की अनुमति 5 एमबी है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PINCODE_IS_REQUIRED",
              "message": "पिनकोड की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PLUMBER",
              "message": "प्लंबर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PROJECTS_DESCRIPTION",
              "message": "परियोजना विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PROJECT_BANNER",
              "message": "केवल JPG, PDF, DOC, DOCX, XLS, XLSX फ़ाइलों को अपलोड किया जा सकता है। फ़ाइल का आकार 5 एमबी से अधिक नहीं होना चाहिए।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PROJECT_GEO_LOCATION",
              "message": "जियोलोकेशन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PROJECT_LOR",
              "message": "संचिका संदर्भ संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PROJECT_PATTERN_ERR_MSG_PROJECT_ESTIMATED_COST",
              "message": "5000000 तक सीमित एक वैध परियोजना लागत दर्ज करें।",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "PROJECT_PROJECT_DESC",
              "message": "परियोजना विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "RE-SUBMITTED",
              "message": "फिर से प्रस्तुत",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "REGISTERED_WITH_DEPT",
              "message": "विभाग द्वारा पंजीकृत",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "REGISTER_WAGE_SEEKER",
              "message": "रजिस्टर मजदूरी साधक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "RELATIONSHIP_IS_REQUIRED",
              "message": "संबंध की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "RESEND_OTP_IN_SEC",
              "message": "{timer} सेकंड में एक और ओटीपी का अनुरोध करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "RE_ENTER_ACCOUNT_NUMBER",
              "message": "दर्ज किया गया खाता संख्या मिलान नहीं है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "RE_SUBMITTED",
              "message": "फिर से प्रस्तुत",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "RT_TOTAL",
              "message": "कुल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SANGI_MULIA",
              "message": "सांगी मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SAVE_AS_DRAFT",
              "message": "ड्राफ्ट के रूप में सेव करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SCAVENGER",
              "message": "झगड़ालू",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMISKILLED_ELECTRICIAN",
              "message": "अर्ध-कुशल इलेक्ट्रीशियन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMISKILLED_WELDER",
              "message": "अर्ध-कुशल वेल्डर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED",
              "message": "अर्द्ध कुशल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED.CLEANER",
              "message": "अर्ध -कुशल - क्लीनर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED.FEMALE_MULIA",
              "message": "अर्ध-कुशल महिला मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED.HAMMER_MAN",
              "message": "अर्ध -कुशल - हथौड़ा आदमी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED.MALE_MULIA",
              "message": "अर्ध -कुशल - पुरुष मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED.SANGI_MULIA",
              "message": "अर्ध -कुशल - सांगी मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED.SCAVENGER",
              "message": "अर्ध-कुशल मेहतर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED_CLEANER",
              "message": "अर्ध-कुशल क्लीनर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED_FEMALE_MULIA",
              "message": "अर्ध -कुशल - महिला मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED_HAMMER_MAN",
              "message": "अर्ध-कुशल हथौड़ा आदमी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED_MALE_MULIA",
              "message": "अर्ध -कुशल - पुरुष मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED_SANGI_MULIA",
              "message": "अर्ध -कुशल - सांगी मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEMI_SKILLED_SCAVENGER",
              "message": "अर्ध -कुशल - स्केवेंजर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SEND_FOR_APPROVAL",
              "message": "अनुमोदन के लिए सबमिट करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SENTBACK",
              "message": "वापस भेजा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SENTBACKTOCBO",
              "message": "सुधार के लिए वापस भेजा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SHOW_WORKFLOW_TIMELINE",
              "message": "वर्कफ़्लो टाइमलाइन दिखाएं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLED_FITTER",
              "message": "कुशल फिटर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLED_MASON",
              "message": "कुशल मेसन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLED_MULIA",
              "message": "कुशल मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLED_PAINTER",
              "message": "कुशल चित्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLED_PLUMBER",
              "message": "कुशल प्लम्बर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLS_IS_REQUIRED",
              "message": "कौशल की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SKILLS_SELECTION_INVALID",
              "message": "चुने गए कौशल का संयोजन अमान्य है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SOCIAL_CATEGORY_IS_REQUIRED",
              "message": "सामाजिक श्रेणी की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "STATE_pg",
              "message": "ओडिशा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "STATE_statea",
              "message": "स्टेट डेमो",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SUBMITTED",
              "message": "प्रस्तुत",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "SUMMARY_DETAILS",
              "message": "सारांश विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_CITYA",
              "message": "शहर ए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB",
              "message": "पंजाब",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_AMRITSAR",
              "message": "अमृतसर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_DERABASSI",
              "message": "डेराबस्सी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_JALANDHAR",
              "message": "जालंधर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_MOHALI",
              "message": "मोहाली",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_NAWANSHAHR",
              "message": "नवांशहर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_NAYAGAON",
              "message": "नायगांव",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TENANT_TENANTS_PB_PHAGWARA",
              "message": "फागवाड़ा",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TOTAL_EMPLOYEES",
              "message": "कुल कर्मचारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TOTAL_FILES_MORE_THAN_ALLOWED",
              "message": "फ़ाइल की अनुमति नहीं है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TRACK_ATTENDENCE",
              "message": "ट्रैक उपस्थिति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "TRANSGENDER",
              "message": "ट्रांसजेंडर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ULBGRADE_MC1",
              "message": "नगर निगम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "ULBGRADE_MUNICIPAL_CORPORATION",
              "message": "नगर निगम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED",
              "message": "अकुशल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED.CHAIN_MAN",
              "message": "अकुशल - चेन मैन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED.FEMALE_MULIA",
              "message": "अकुशल - महिला मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED.MALE_MULIA",
              "message": "अकुशल - पुरुष मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED.SCAVENGER",
              "message": "अकुशल - मेहतर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED_CHAIN_MAN",
              "message": "अकुशल - चेन मैन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED_FEMALE_MULIA",
              "message": "अकुशल - महिला मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED_MALE_MULIA",
              "message": "अकुशल - पुरुष मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED_MULIA",
              "message": "अकुशल मुलिया",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED_PLUMBER",
              "message": "अकुशल प्लम्बर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "UNSKILLED_SCAVENGER",
              "message": "अकुशल - scavanger",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "VERIFIED",
              "message": "सत्यापित",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WAGE_SEEKER_SKILL",
              "message": "कौशल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WAGE_SEEKER_SKILL_CAT",
              "message": "कौशल श्रेणी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WARD_IS_REQUIRED",
              "message": "वार्ड की आवश्यकता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WF_ACTION_CANCELLED",
              "message": "कार्रवाई रद्द कर दी गई है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WF_COMMON_COMMENTS",
              "message": "टिप्पणियाँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WF_MODAL_APPROVER",
              "message": "असाइनी का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WF_MODAL_CANCEL",
              "message": "रद्द करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WF_MODAL_COMMENTS",
              "message": "टिप्पणियाँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WINCH_OPERATOR",
              "message": "चरखी प्रचालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKBENCH_HOME",
              "message": "घर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKFLOW_MODAL_UPLOAD_FILES",
              "message": "सहायक दस्तावेज संलग्न करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKFLOW_MODAL_UPLOAD_HINT_TEXT",
              "message": "केवल .jpg और.pdf फ़ाइलें। 5 एमबी अधिकतम फ़ाइल आकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS",
              "message": "मुक्ता",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ACTIONS",
              "message": "कार्रवाई",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ADD_ITEM",
              "message": "लाइन आइटम जोड़ें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ASSIGNEE_NAME",
              "message": "असाइनमेंट नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_BUDGET_HEAD",
              "message": "बजट शीर्ष",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_CANCEL",
              "message": "रद्द करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_CITY",
              "message": "शहर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_CLEAR_SEARCH",
              "message": "साफ़",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_CLOSURE_REQUESTS",
              "message": "नज़दीकी अनुरोध",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_COMMON_APPLY",
              "message": "आवेदन करना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_COMMON_FROM_DATE_LABEL",
              "message": "की तिथि से",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_COMMON_SEARCH",
              "message": "खोज",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_COMMON_TO_DATE_LABEL",
              "message": "तारीख तक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_COMPLETION_PERIOD",
              "message": "पूर्णता अवधि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_CONTRACTS",
              "message": "ठेके",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_DASHBOARD",
              "message": "चकरानेवाला",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_DATE_PROPOSAL",
              "message": "परियोजना मंजूरी की तारीख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_DOC_UPLOAD_HINT",
              "message": "केवल PDF, XLS और DOC फ़ाइलों की अनुमति है। अधिकतम फ़ाइल आकार की अनुमति 5MB है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_DUE_DATE",
              "message": "नियत तारीख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_END_DATE",
              "message": "कार्य समाप्ति तिथि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ESTIMATED_AMOUNT",
              "message": "अनुमानित राशि (रु।)",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ESTIMATES",
              "message": "अनुमान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ESTIMATE_TYPE",
              "message": "अनुमान प्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_FILE_UPLOAD_CUSTOM_ERROR_MSG",
              "message": "केवल पीडीएफ, एक्सएलएस, जेपीईजी और डीओसी फाइलों की अनुमति है। अधिकतम फ़ाइल आकार की अनुमति 5MB है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_FINANCIAL_DETAILS",
              "message": "वित्तीय विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_FORWARD",
              "message": "आगे",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_FUNCTION",
              "message": "समारोह",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_FUND",
              "message": "निधि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_GEO_LOCATION",
              "message": "भू -स्थान",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_HEAD_OF_ACCOUNTS",
              "message": "लेखे का प्रमुख",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_INBOX",
              "message": "इनबॉक्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_INFO",
              "message": "जानकारी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_KICKOFF_CHECKLIST",
              "message": "जांच सूची",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_LOCALITY",
              "message": "इलाका",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_LOCATION_DETAILS",
              "message": "स्थान विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_LOR",
              "message": "संचिका संदर्भ संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_MASTERS",
              "message": "संगठन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_MUKTA",
              "message": "घर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_MUSTERROLLS",
              "message": "मस्टर रोल्स",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_MY_BILLS",
              "message": "मेरे बिल",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_NO_FILE_SELECTED",
              "message": "कोई फ़ाइल चयनित नहीं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_ORDER_NO",
              "message": "कार्य आदेश संख्या",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_OVERHEAD",
              "message": "भूमि के ऊपर",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PATTERN_ERR",
              "message": "एक या एक से अधिक दर्ज वर्णों की अनुमति नहीं है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PERCENT",
              "message": "%",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PROJECT_CLOSURE",
              "message": "बंद करने की परियोजना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PROJECT_DETAILS",
              "message": "परियोजना विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PROJECT_ID",
              "message": "प्रोजेक्ट आईडी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PROJECT_NAME",
              "message": "परियोजना का नाम",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_PROJECT_TYPE",
              "message": "परियोजना प्रकार",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_RELEVANT_DOCS",
              "message": "प्रासंगिक दस्तावेज़",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_RELEVANT_DOCUMENTS",
              "message": "प्रासंगिक दस्तावेज़",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_REQUIRED_ERR",
              "message": "यह क्षेत्र अनिवार्य है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_SCHEME",
              "message": "योजना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_SEARCH_PROJECTS",
              "message": "खोज परियोजनाएँ",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_SNO",
              "message": "क्र.सं",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_START_DATE",
              "message": "कार्य शुरू तिथि",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_SUB_PROJECT_INFO_MSG",
              "message": "कृपया उप-परियोजना अनुभाग में प्रोजेक्ट ब्रेकडाउन का विवरण दर्ज करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_SUB_SCHEME",
              "message": "उप -योजना",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_UPLOAD_DOCS",
              "message": "दस्तावेज़ अपलोड करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_UPLOAD_FILES",
              "message": "फाइलें अपलोड करें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WAGESEEKERS",
              "message": "मजदूरी साधक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WARD",
              "message": "बालक",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WMS",
              "message": "डब्ल्यूएमएस",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WORKFLOW_HISTORY",
              "message": "वर्कफ़्लो इतिहास",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WORKFLOW_TIMELINE",
              "message": "वर्कफ़्लो टाइमलाइन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WORK_DETAILS",
              "message": "कार्य विवरण",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORKS_WORK_NATURE",
              "message": "कार्य की प्रकृति",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_CONDITIONS_FOR_IMPLEMENTATION_AGENCY",
              "message": "कार्यान्वयन की शर्तें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_CONDITIONS_FOR_IMPLEMENTATION_PARTNER",
              "message": "कार्यान्वयन भागीदार के लिए शर्तें (आईपी)",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_CONDITIONS_FOR_NON_COMPLETION",
              "message": "गैर-पूर्णता के लिए शर्तें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_EXECUTION_OF_WORK",
              "message": "काम का निष्पादन",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_GENERAL_CONDITIONS",
              "message": "सामान्य परिस्थितियां",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_INFO",
              "message": "स्वीकृति की तारीख को परियोजना की शुरुआत की तारीख माना जाता है",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_SIR",
              "message": "महोदय",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_SUBJECT",
              "message": "विषय",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_TERMS_AND_CONDITIONS",
              "message": "नियम और शर्तें",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_TO",
              "message": "को",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "WORK_ORDER_YOURS_FAITHFULLY",
              "message": "आपका विश्वासी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "pg.cityA",
              "message": "शहर ए",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "pg.cityB",
              "message": "सिटी बी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          },
          {
              "code": "pg.cityC",
              "message": "शहर सी",
              "module": "rainmaker-common",
              "locale": "hi_IN"
          }
      ]
        const res=TransformArrayToObj(samplar)
        i18n.addResourceBundle('hi', 'translations', res);
        return []
      }
    }
  });



  
  
  //put in one namespace => done
  //try dynamically adding resources with localisation service in isolation and then see thru core app
  //initialise i18n the same way and get t function as passed from signle spa entry
  //sort out that error when commenting out code for i18n init in ui-libraries

  i18n.addResourceBundle('en', 'translations', {
    meet: 'hello from namespace 1',
  });
  i18n.addResourceBundle('hi', 'translations', {
    meet: 'Hindi',
  });
  i18n.addResourceBundle('fr', 'translations', {
    meet: 'French',
  });
  i18n.addResourceBundle('en', 'translations', {
    greeting: 'Hello, Welcome!',
  });
  i18n.addResourceBundle('hi', 'translations', {
    greeting: 'नमस्ते, स्वागत है!',
  });
  i18n.addResourceBundle('fr', 'translations', {
    greeting: 'Bonjour bienvenue',
  });

  if(isLoading) {
    return <div>Loading....</div>
  }

  return (
    <>
      <h2>{t('greeting')}</h2>
      <h2>{t('meet')}</h2>
      <h2>{t("ACTION_TEST_SEARCH")}</h2>
      <h2>{t("CORE_CHANGE_TENANT_CANCEL")}</h2>
      <h2>{t("CORE_COMMON_LOGIN")}</h2>
    </>
  );
};

export default TestLocalisation;
