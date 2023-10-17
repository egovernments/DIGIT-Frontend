import {
    CitizenHomeCard, BackButton,
    BillsIcon,
    CitizenInfoLabel,
    FSMIcon,
    Loader,
    MCollectIcon,
    OBPSIcon,
    PGRIcon,
    PTIcon,
    TLIcon,
    WSICon } from '@egovernments/digit-ui-react-components'
import React from 'react'
import { useTranslation } from "react-i18next";
import configSHGHOME from './config';
const ShgHome = () => {

    const {t} =  useTranslation()

    const iconSelector = (code) => {
        switch (code) {
            case "PT":
                return <PTIcon className="fill-path-primary-main" />;
            case "WS":
                return <WSICon className="fill-path-primary-main" />;
            case "FSM":
                return <FSMIcon className="fill-path-primary-main" />;
            case "MCollect":
                return <MCollectIcon className="fill-path-primary-main" />;
            case "PGR":
                return <PGRIcon className="fill-path-primary-main" />;
            case "TL":
                return <TLIcon className="fill-path-primary-main" />;
            case "OBPS":
                return <OBPSIcon className="fill-path-primary-main" />;
            case "Bills":
                return <BillsIcon className="fill-path-primary-main" />;
            default:
                return <PTIcon className="fill-path-primary-main" />;
        }
    };

    const cardConfig = configSHGHOME()
  return (
      <div className="citizen-all-services-wrapper">
          <div className="citizenAllServiceGrid">
              <CitizenHomeCard
                  header={t("WORKS_MGMT")}
                  links={cardConfig.works.links}
                  Icon={() => iconSelector("PGR")}
              />
              <CitizenHomeCard
                  header={t("ACTION_TEST_ATTENDENCEMGMT")}
                  links={cardConfig.attendencemgmt.links}
                  Icon={() => iconSelector("PGR")}    
              />
          </div>
        </div>
  )
}

export default ShgHome