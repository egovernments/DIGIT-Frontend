import React from 'react';
import { TextBlock } from '@egovernments/digit-ui-components';

const SummaryMicroplanDetails = () => {
  return (
    <div style={{ padding: '16px', borderTop: '4px solid #FF5722', width: '60%', margin: 'auto', marginTop: '2rem' }}>
      {/* Campaign disease */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <TextBlock header="Campaign disease" />
        <TextBlock subHeader="Malaria" />
      </div>

      {/* Campaign type */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <TextBlock header="Campaign type" />
        <TextBlock subHeader="ITIN" />
      </div>

      {/* Resource distribution strategy */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextBlock header="Resource distribution strategy" />
        <TextBlock subHeader="House-House" />
      </div>
    </div>
  );
}

export default SummaryMicroplanDetails;