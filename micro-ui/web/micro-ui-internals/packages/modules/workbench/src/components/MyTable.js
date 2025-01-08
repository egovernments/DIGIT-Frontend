import React,{useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { newConfig } from '../configs/newConfig';

const MyTable = ({onSelect, formData, config}) => {
  // console.log("props object", props)
  // props.props.value = "dummy";
  console.log("config", config);
  console.log("formData", formData);
  const { t } = useTranslation();
  const [formVal, setFormVal] = useState({
      usageType: '',
      usageName: '',
      quantity: '',
    });

  // console.log(props.formData);

  const handleChange = (e)=>{
    const { name, value } = e.target;
    // props.setValue(value, name);
    // console.log(name, value);
    setFormVal({
      ...formVal,
      [name]: value,
    });
    onSelect(config.key, { ...formData[config.key], [name]: value });
  }

  // useEffect(()=>{
  //   console.log("formVal in useEffect", formVal);
  //   console.log(props);
  //   props.formData.MyTable = {
  //     usage_type : formVal.usageType,
  //     usage_name : formVal.usageName,
  //     qty : formVal.quantity
  //   }
  // },[formVal])
  
  // props?.formData?.MyTable.usage_type = 'usage_type';
  // props?.formData?.MyTable.usage_name = 'usage_name';
  // props?.formData?.MyTable.qty = 'qty';
  console.log("myTable")

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
              value={formVal.usageType}
              onChange={(e)=>handleChange(e)}
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
              value={formVal.usageName}
              placeholder="Enter Usage"
              onChange={(e)=>handleChange(e)}
            />
          </td>
          <td>
            <input
              type="number"
              name="quantity"
              value={formVal.quantity}
              placeholder="Enter Quantity"
              onChange={(e)=>handleChange(e)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MyTable;
