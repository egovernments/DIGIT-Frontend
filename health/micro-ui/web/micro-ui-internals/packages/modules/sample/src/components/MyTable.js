import React from 'react';
import { useTranslation } from 'react-i18next';

const MyTable = ({ formData, handleInputChange }) => {
  const { t } = useTranslation();

  return (
    <table style={{ border: '2px solid black', marginBottom: '12px' }}>
      <thead>
        <tr style={{ border: '2px solid black', margin: '12px' }}>
          <th>{t('Usage Type')}</th>
          <th>{t('Usage Name')}</th>
          <th>{t('Qty.')}</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ border: '2px solid black', margin: '12px' }}>
          <td>
            <select
              name="usageType"
              value={formData.usageType}
              onChange={handleInputChange}
            >
              <option value="">{t('Select Usage Type')}</option>
              <option value="Material">{t('Material')}</option>
              <option value="Linguistic">{t('Linguistic')}</option>
            </select>
          </td>
          <td>
            <input
              type="text"
              name="usageName"
              value={formData.usageName}
              placeholder="Enter Usage"
              onChange={handleInputChange}
            />
          </td>
          <td>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              placeholder="Enter Quantity"
              onChange={handleInputChange}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MyTable;
