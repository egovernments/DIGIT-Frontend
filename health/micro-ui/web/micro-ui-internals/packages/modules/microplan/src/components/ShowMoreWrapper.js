import React, { Fragment, useEffect, useState } from "react";
import { Button, PopUp, Chip, Loader,} from "@egovernments/digit-ui-components";
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
       children={[
        <div className="digit-tag-container userAccessCell">
      {alreadyQueuedSelectedState?.map((item, index) => (
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
       ]}
       onOverlayClick={() => {
           setShowPopUp(false);
       }}
       onClose={() => {
           setShowPopUp(false);
       }}
       >
       </PopUp>
    );

 };