import { Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import React, { useRef, useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, Modal, CardText } from "@egovernments/digit-ui-react-components";




const ManageData = ()=>{

     const [showToast, setShowToast] = useState(null)
     const [uploadedFile, setUploadedFile] = useState([])




    const onBulkUploadSubmit = async (file) => {
        if (file.length > 1) {
          setShowToast({ key: "error", label: t("ERROR_MORE_THAN_ONE_FILE") });
          return;
        }
    }  

    
   
     return <>
         
        
            <Card>
                <Header>{t("Upload Excel for population data")}</Header>
                <Button   label={t("WBH_DOWNLOAD_TEMPLATE")}
                            icon={"FileDownload"}
                            variation="secondary"
                            type="button"
                            className="campaign-download-template-btn"
                            onClick={downloadTemplate}
                
                />
                <p>Please fill the downloaded template with population data and upload the sheet.</p>
                <BulkUpload onSubmit={onBulkUploadSubmit} fileData={uploadedFile} />
            </Card>
            
            
            
  
         
   </>

}


export default ManageData;