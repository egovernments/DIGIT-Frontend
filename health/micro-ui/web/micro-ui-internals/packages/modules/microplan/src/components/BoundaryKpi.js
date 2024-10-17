import React from 'react';
import { Card } from '@egovernments/digit-ui-components';
import { useMyContext } from '../utils/context';
import { useTranslation } from 'react-i18next';
const BoundaryKpi = ({ data }) => {
  const { state: { boundaryHierarchy } } = useMyContext()
  const { t } = useTranslation();
  console.log("datatat",data);
  return (
    <Card className="kpi-container">
      {Object.keys(data).map((key) => {
        return (
          <div key={key} className="kpi-card">
            <h2>{String(data[key]).padStart(2, '0')}</h2>
            <p>{t(`MICROPLAN_${key.toUpperCase()}`)}</p> {/* Correct use of t with template literal */}
          </div>
        );
      })}
    </Card>
  );
};

export default BoundaryKpi;