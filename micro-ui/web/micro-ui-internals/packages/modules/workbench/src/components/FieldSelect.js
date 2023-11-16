import React, { useEffect, useState } from 'react';
import { Dropdown, Button } from "@egovernments/digit-ui-react-components";
import { fieldTypes } from '../configs/FieldVariable';
import { addField } from '../utils/schemaUtils';
import { useTranslation } from "react-i18next";

const FieldSelect = ({ state, dispatch }) => {
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        setError(null);
    }, [state.addingFieldType])

    const handleAddField = () => {
        if (state.addingFieldType) {
            addField(state, dispatch);
            setError(null); // Clear the error if field type is selected
        } else {
            setError(t('WORKBENCH_SELECT_TYPE_ERROR'));
        }
    };

    return (
        <div className='label-field-pair'>
            <h2 className="card-label">Type</h2>
            <Dropdown
                selected={state.addingFieldType}
                option={fieldTypes}
                optionKey="label"
                select={(value) => { dispatch({ type: 'SET_ADDING_FIELD_TYPE', payload: value }); }}
                showArrow={true}
                t={(text) => text}
                className='w-full'
                showSearchIcon={false}
                disable={false}
                autoComplete="off"
                placeholder={t("WORKBENCH_PLACEHOLDER_SELECT_TYPE")}
            />
            {error && <p className='schemaInputError'>{error}</p>}
            <div className="field-select-button-container">
                <Button onButtonClick={handleAddField} label={t("WORKBENCH_LABEL_ADD_FIELD")} />
            </div>
        </div>
    );
};

export default FieldSelect;
