import {
  BackButton,
  Tutorial,
  useTourState,
  Help,
} from '@egovernments/digit-ui-react-components';
import React, { useEffect, useContext, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useMyContext } from '../utils/context';

// import { TourSteps } from '../utils/TourSteps';


const MicroplanningHeader = () => {
  const { tourState, setTourState } = useTourState();
  const {state} = useMyContext()
  const { t } = useTranslation();
  //using location.pathname we can update the stepIndex accordingly when help is clicked from any other screen(other than home screen)
  const { pathname } = useLocation();
  
  const startTour = () => {
    if(state?.tourStateData)
    setTourState(state.tourStateData)
  };

  return (
    <>
    <Tutorial tutorial={tourState} updateTutorial={setTourState} />
      <div className="wbh-header">
        <Help startTour={startTour} />
      </div>
    </>
  );
};

export default MicroplanningHeader;
