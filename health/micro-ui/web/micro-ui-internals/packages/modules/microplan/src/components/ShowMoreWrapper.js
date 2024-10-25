import React from "react";
import { PopUp, Chip,} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";


export const ShowMoreWrapper = ({ setShowPopUp, alreadyQueuedSelectedState, heading="" }) => {
    const { t } = useTranslation();
   
    return (
       <PopUp
       className={""}
       style={{
           maxWidth: '40%'
       }}
       type={"default"}
       heading={t(heading)}
       children={[]}
       onOverlayClick={() => {
           setShowPopUp(false);
       }}
       onClose={() => {
           setShowPopUp(false);
       }}
       >
       <div className="digit-tag-container userAccessCell">
      {Array.isArray(alreadyQueuedSelectedState) && alreadyQueuedSelectedState?.map((item, index) => (
               <Chip 
                key={index} 
                text={t(item)} 
                className=""
                error=""
                extraStyles={{}}
                iconReq=""
                hideClose={true}
               />
         ))}  
         </div>
       </PopUp>
    );

 };