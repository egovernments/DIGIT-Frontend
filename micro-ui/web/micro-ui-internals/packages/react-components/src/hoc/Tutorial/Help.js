import React from 'react';
import { HelpOutlineIcon } from "../../atoms/svgindex"
import Label from '../../atoms/Label';
import { useTranslation } from 'react-i18next';

const Help = ({startTour, ...props}) => {
  const { t } = useTranslation()
  return (
    <div className="header-icon-container" onClick={startTour}>
      <Label className={props?.labelClassName}>{t('Help')}</Label>
      <HelpOutlineIcon fill={props?.fill}/>
    </div>
  );
};

export default Help;
