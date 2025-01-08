import React,{useState} from 'react'
import { FormComposer } from '@egovernments/digit-ui-react-components';
import { values } from 'lodash';
import { newConfig } from '../../configs/newConfig';

const AssignmentCreate = () => {
  const [formData, setFormData] = useState({
    usageType: '',
    usageName: '',
    quantity: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const reqCriteriaAdd = {
    url: `/facility/v1/_create`,
    params: {},
    body: {}
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);
  const defVal = {}

  const handleSubmit = (data, formData) => {
    console.log(data, "data of form");
    console.log(formData, "component's data")
    // mutation.mutate(
    //   {
    //     method: "POST",
    //     params: {},
    //     body: {
    //       Facility: {
    //         "tenantId": `${data.tenantid}`,
    //         "isPermanent": "true",
    //         "name": `${data.facilityname}`,
    //         "usage": `${data.usage}`,
    //         "storageCapacity": `${data.storage}`
    //       }
    //     },
    //   },
    //   {
    //     onError: (err) => {
    //       console.log(err)
    //     },
    //     onSuccess: (res) => { console.log("bbbbbbbbbbbbb", res) },
    //   }
    // );
  }
  return (
    <FormComposer
      label="PROCEED"
      config={newConfig}
      defaultValues={defVal}
      onSubmit={(data, formData) => handleSubmit(data, formData)}
      fieldStyle={{ marginRight: 0 }}
      className="form-no-margin"
      labelBold={true}
    />
  )
}

export default AssignmentCreate;