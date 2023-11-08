import React from 'react';
import { Dropdown, Button } from "@egovernments/digit-ui-react-components";
import { fieldTypes } from './FieldVariable';

const FieldSelect = ({ addingFieldType, setAddingFieldType, state, addField }) => {

    return (
        <div className='label-field-pair'>
            <h2 className="card-label">Type</h2>
            <Dropdown
                selected={addingFieldType}
                option={fieldTypes}
                optionKey="label"
                select={(value) => { setAddingFieldType(value) }}
                showArrow={true}
                t={(text) => text}
                style={{ width: '100%' }}
                showSearchIcon={false}
                disable={false}
                autoComplete="off"
                placeholder="Select a Type"
            />

            {state.nameError?.add && (
                <div>
                    <span style={{ color: "red" }}>{state.nameError.add}</span>
                </div>
            )}

            <div style={{ display: "grid" }}>
                <Button style={{ justifySelf: "flex-end" }} onButtonClick={addField} label={"Add Field"} />
            </div>
        </div>
    );
};

export default FieldSelect;
