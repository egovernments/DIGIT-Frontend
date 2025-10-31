import { configureStore } from "@reduxjs/toolkit";
import remoteConfigReducer from "./remoteConfigSlice";
import fieldMasterReducer from "./fieldMasterSlice";
import fieldPropertiesReducer from "./fieldPanelPropertiesSlice";
import localizationReducer from "./localizationSlice";
import flowPagesReducer from "./flowPagesSlice";
import pageFieldsReducer from "./pageFieldsSlice";

export const store = configureStore({
  reducer: {
    remoteConfig: remoteConfigReducer,
    fieldTypeMaster: fieldMasterReducer,
    fieldPanelMaster: fieldPropertiesReducer,
    localization: localizationReducer,
    flowPages: flowPagesReducer,
    pageFields: pageFieldsReducer,
  },
});

export const AppDispatch = store.dispatch;
export default store;

