import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, FormComposerV2, Header } from "@egovernments/digit-ui-react-components";


const fieldStyle={ marginRight: 0 };

const InsideHearingMainPage = () => {
  const history= useHistory();


  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  return (
    <div>
       <br></br>
      Inside hearing home page
      <br></br>
      <br></br>

      <button
        onClick={() => handleNavigate('/employee/orders/generate-orders')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        generate orders
      </button>
      <br></br>


      <button
        onClick={() => handleNavigate('/employee/hearings/make-submission')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        Make submission
      </button>
      <br></br>



      <button 
        onClick={() => handleNavigate('/employee/hearings/add-party')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        add party
      </button>
      <br></br>


      <button
        onClick={() => handleNavigate('/employee/hearings/adjourn-hearing')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        adjourn hearing
      </button>
      <br></br>

      <button
        onClick={() => handleNavigate('/employee/hearings/end-hearing')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        end hearing
      </button>
      <br></br>

      <button
        onClick={() => handleNavigate('/employee/orders/orders-home')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        orders
      </button>
      <br></br>



      <button
        onClick={() => handleNavigate('/employee/hearings/submission')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        Submission
      </button>
      <br></br>


      <button
        onClick={() => handleNavigate('/employee/hearings/case-history')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          margin:'2px'

      }}
      >
        case history
      </button>
      <br></br>


      <button
        onClick={() => handleNavigate('/employee/hearings/parties')}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: '2px',
          cursor: 'pointer',
          margin:'2px'
      }}
      >
        parties
      </button>
      <br></br>
      <br></br>  
      </div>
  );
}

export default InsideHearingMainPage;