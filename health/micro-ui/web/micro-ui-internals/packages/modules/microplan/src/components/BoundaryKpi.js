import React from 'react';
import { Card } from '@egovernments/digit-ui-components';
import { Loader } from '@egovernments/digit-ui-components';
import { useMyContext } from '../utils/context';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
const BoundaryKpi = ({ data, heading }) => {
  const { state: { boundaryHierarchy } } = useMyContext()
  const { t } = useTranslation();
  
  if (!data || Object.keys(data).length === 0) {
    return <Card className="middle-child"> {<Loader />}</Card>;
  }

  return (

    <Card className="middle-child">
      {heading && <div className="summary-main-heading">{heading}</div>}
      <div className="kpi-container">
        {Object.keys(data).map((key) => {
          return (
            <div key={key} className="kpi-card">
              <h2>{String(data[key]).padStart(2, '0')}</h2>
              <p>{t(`MICROPLAN_${key.toUpperCase()}`)}</p> {/* Correct use of t with template literal */}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BoundaryKpi;