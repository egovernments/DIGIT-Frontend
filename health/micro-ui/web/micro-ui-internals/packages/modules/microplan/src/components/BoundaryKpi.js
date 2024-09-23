import React from 'react';
import { Card } from '@egovernments/digit-ui-components';
import { useMyContext } from '../utils/context';
const BoundaryKpi = ({ data }) => {
  const {state:{boundaryHierarchy}} = useMyContext()
  return (
    <Card className="kpi-container">
      {Object.keys(data).map((key) => (
        <div key={key} className="kpi-card">
          <h2>{String(data[key]).padStart(2, '0')}</h2>
          <p>{key}</p>
        </div>
      ))}
    </Card>
  );
};

export default BoundaryKpi;