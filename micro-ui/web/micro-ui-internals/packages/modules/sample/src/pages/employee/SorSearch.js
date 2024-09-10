import { Header, InboxSearchComposer, ResultsTable } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { sorSearchConfig } from "../../configs/SorSearchConfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const defaultSearchValues = {
    fieldValue:"",
    typeOfFilter:{}
}

const SorSearch = ()=>{
   const {t} = useTranslation()
   const [defaultValues, setDefaultValues] = useState(defaultSearchValues)
         const sorConfigs = sorSearchConfig() 
         const history = useHistory();


        useEffect(()=>{
           setDefaultValues(defaultSearchValues)
        },[]) 
    
      const onClickRow = (data)=>{
         console.log('Info about the row that was clicked', data)
         const row = data.original.data.name

         history.push(`/microplan-ui/employee/sample/view-sor/${row}`);
      }

        return (
            <React.Fragment>
               <Header >{t(sorConfigs.label)}</Header>
               <div className="inbox-search-wrapper">
                 <InboxSearchComposer configs={sorConfigs} 
                 defaultValues={defaultValues} 
                 additionalConfig={{
                  resultsTable: {
                    onClickRow
                  }
                }}
                 ></InboxSearchComposer>
               </div>
            </React.Fragment>
        )
}

export default SorSearch