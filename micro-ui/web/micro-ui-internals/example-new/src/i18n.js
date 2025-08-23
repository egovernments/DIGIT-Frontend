import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en_IN: {
    translation: {
      // Common translations
      "CS_COMMON_CHOOSE_LANGUAGE": "Choose Language",
      "CORE_COMMON_CONTINUE": "Continue",
      "TENANT_TENANTS_PB": "Punjab",
      "ENGLISH": "English",
      "हिंदी": "Hindi", 
      "ਪੰਜਾਬੀ": "Punjabi",
      
      // App specific
      "EXAMPLE_APP_TITLE": "Core New Module Example",
      "EXAMPLE_HOME_TITLE": "Welcome to DIGIT Modules Example",
      "EXAMPLE_HOME_DESC": "Test application for Core and Workbench modules",
      "EXAMPLE_GO_TO_EMPLOYEE": "Go to Employee Language Selection",
      "EXAMPLE_GO_TO_CITIZEN": "Go to Citizen Language Selection",
      "EXAMPLE_GO_TO_WORKBENCH": "Go to Workbench Masters",
      "EXAMPLE_BACK_HOME": "Back to Home",
      "EXAMPLE_CURRENT_LANGUAGE": "Current Language",
      "EXAMPLE_SELECTED_PATH": "Selected Path",
      
      // Workbench translations
      "WB_MASTER_DATA_MANAGEMENT": "Master Data Management",
      "WB_MASTER_DATA_DESC": "Manage and configure master data for all modules in the instance",
      "WB_SEARCH_MASTERS": "Search masters...",
      "WB_SELECT_MODULE": "Select Module",
      "WB_CLEAR_FILTERS": "Clear Filters",
      "WB_MASTER_NAME": "Master Name",
      "WB_MODULE": "Module",
      "WB_DESCRIPTION": "Description",
      "WB_RECORDS": "Records",
      "WB_STATUS": "Status",
      "WB_ACTIONS": "Actions",
      "WB_VIEW": "View",
      "WB_EDIT": "Edit",
      "WB_ACTIVE": "Active",
      "WB_INACTIVE": "Inactive",
      "WB_TOTAL_MASTERS": "Total Masters",
      "WB_ACTIVE_MASTERS": "Active Masters",
      "WB_MODULES": "Modules",
      "WB_TOTAL_RECORDS": "Total Records",
      "WB_NO_MASTERS_FOUND": "No masters found"
    }
  },
  hi_IN: {
    translation: {
      "CS_COMMON_CHOOSE_LANGUAGE": "भाषा चुनें",
      "CORE_COMMON_CONTINUE": "जारी रखें",
      "TENANT_TENANTS_PB": "पंजाब",
      "ENGLISH": "अंग्रेज़ी",
      "हिंदी": "हिंदी",
      "ਪੰਜਾਬੀ": "पंजाबी",
      
      "EXAMPLE_APP_TITLE": "कोर न्यू मॉड्यूल उदाहरण",
      "EXAMPLE_HOME_TITLE": "कोर न्यू मॉड्यूल में आपका स्वागत है",
      "EXAMPLE_HOME_DESC": "यह भाषा चयन के साथ नए कोर मॉड्यूल के लिए एक परीक्षण एप्लिकेशन है",
      "EXAMPLE_GO_TO_EMPLOYEE": "कर्मचारी भाषा चयन पर जाएं",
      "EXAMPLE_GO_TO_CITIZEN": "नागरिक भाषा चयन पर जाएं",
      "EXAMPLE_BACK_HOME": "होम पर वापस जाएं",
      "EXAMPLE_CURRENT_LANGUAGE": "वर्तमान भाषा",
      "EXAMPLE_SELECTED_PATH": "चयनित पथ"
    }
  },
  pn_IN: {
    translation: {
      "CS_COMMON_CHOOSE_LANGUAGE": "ਭਾਸ਼ਾ ਚੁਣੋ",
      "CORE_COMMON_CONTINUE": "ਜਾਰੀ ਰੱਖੋ",
      "TENANT_TENANTS_PB": "ਪੰਜਾਬ",
      "ENGLISH": "ਅੰਗਰੇਜ਼ੀ",
      "हिंदी": "ਹਿੰਦੀ",
      "ਪੰਜਾਬੀ": "ਪੰਜਾਬੀ",
      
      "EXAMPLE_APP_TITLE": "ਕੋਰ ਨਵਾਂ ਮੋਡੀਊਲ ਉਦਾਹਰਨ",
      "EXAMPLE_HOME_TITLE": "ਕੋਰ ਨਵੇਂ ਮੋਡੀਊਲ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      "EXAMPLE_HOME_DESC": "ਇਹ ਭਾਸ਼ਾ ਚੋਣ ਦੇ ਨਾਲ ਨਵੇਂ ਕੋਰ ਮੋਡੀਊਲ ਲਈ ਇੱਕ ਟੈਸਟ ਐਪਲੀਕੇਸ਼ਨ ਹੈ",
      "EXAMPLE_GO_TO_EMPLOYEE": "ਕਰਮਚਾਰੀ ਭਾਸ਼ਾ ਚੋਣ ਤੇ ਜਾਓ",
      "EXAMPLE_GO_TO_CITIZEN": "ਨਾਗਰਿਕ ਭਾਸ਼ਾ ਚੋਣ ਤੇ ਜਾਓ",
      "EXAMPLE_BACK_HOME": "ਘਰ ਵਾਪਸ ਜਾਓ",
      "EXAMPLE_CURRENT_LANGUAGE": "ਮੌਜੂਦਾ ਭਾਸ਼ਾ",
      "EXAMPLE_SELECTED_PATH": "ਚੁਣਿਆ ਮਾਰਗ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('digit-language') || 'en_IN',
    fallbackLng: 'en_IN',
    interpolation: {
      escapeValue: false
    }
  });

// Listen for language changes
window.addEventListener('digit-language-change', (event) => {
  i18n.changeLanguage(event.detail.language);
});

export default i18n;