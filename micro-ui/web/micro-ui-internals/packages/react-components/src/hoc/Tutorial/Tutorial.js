import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, LIFECYCLE, STATUS } from 'react-joyride';
import { useHistory } from 'react-router-dom';

let theme = {
  // primaryColor: '#ad7bff',
  // arrowColor: '#000',
  // textColor: '#fff',
  primaryColor: '#c84c0e',
  arrowColor: '#FFFFFF',
  textColor: '#505A5F',
  zIndex:9999
};

const Tutorial = ({ tutorial, updateTutorial, ...props }) => {
  const history = useHistory()
  const { run, stepIndex, steps } = tutorial;
  
  //UseEffect to update theme externally
  useEffect(()=>{
    if(props?.theme){
      theme = {...theme,...props?.theme}
    }  
  },[props?.theme])
  
  const handleCallback = (event) => {
    
    const {type,action,status,step} = event
    //when we want to end the tutorial and reset the state
    if(type==="tour:end" || action==="close"){
      updateTutorial({
        run: false,
        steps: [],
        tourActive: false,
      });
    }
  } 
  return (
    <Joyride
      callback={handleCallback}
      continuous
      run={run}
      // stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          arrowColor: theme.arrowColor,
          backgroundColor: theme.arrowColor,
          primaryColor: theme.primaryColor,
          textColor: theme.textColor,
          zIndex: theme.zIndex
        },
      }}
      showProgress={true}
      hideBackButton={false}
      disableOverlay={false}
      spotlightClicks={true}
    />
  );
};

export default Tutorial;
