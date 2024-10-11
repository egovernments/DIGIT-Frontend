import React,{useState} from 'react'
import FileComponent from '../../components/FileComponent'



const User_Download = () => {
    const [Files,setFile]=useState([])
    const reqCriteriaResource = {
        url: "/project-factory/v1/data/_search",
        body: {
            "SearchCriteria": {
        
        
        
                "tenantId": Digit.ULBService.getCurrentTenantId(),
                "source":"microplan",
                
                
                "status": "completed"
        
            }
        },
        config: {
          enabled: true,
          select: data => {
            debugger
            return data
          }
        }
      };
      const {
        isLoading,
        data,
        isFetching
      } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
    
    console.log("data",data);
    if(data){
        for(const ob of data["ResourceDetails"]){
            setFile((prev)=>[...prev,ob["processedFilestoreId"]])
            debugger

        }
        console.log("files",Files);
    }


    return (
        <div>
            <FileComponent
                title=""
                fileName="file.pdf"
                   
                downloadHandler={()=>{}} // Passing the download function
            />

            
        </div>
    )
}

export default User_Download