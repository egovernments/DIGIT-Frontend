import React,{useMemo,useEffect} from 'react';
import PopUp from '../atoms/PopUp';
import { Button } from '../atoms';
import { FormComposer } from '../hoc/FormComposerV2';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const EditablePopup = ({
  setShowEditablePopup,
  config,
  editRow,
  setEditRow,
  rowData,
  setRowData,
  handleRowSubmit
}) => {
  const {t} = useTranslation();
  const transformConfig = (config) => {
    return useMemo(() => {
      return [
        {
          head: '',
          body: [
            ...config.columns
              .filter((col) => col.editable && col.editableFieldConfig)
              .map(({ editableFieldConfig }) => ({
                ...editableFieldConfig,withoutLabel:false
              })),
            ...((config.additionalPopupColumns || [])
              .filter((col) => col.editable && col.editableFieldConfig)
              .map(({ editableFieldConfig }) => ({
                ...editableFieldConfig,withoutLabel:false
              })))
          ],
        },
      ];
    }, [config]);
  };
  const generateDefaultValues = (config, data) => {
    return useMemo(() => {
      const defaultValues = {};
      const processColumns = (columns) => {
        columns.forEach((col) => {
          if (col.editable && col.editableFieldConfig && col.editableFieldConfig.populators) {
            const fieldPath = col.jsonPath;
            const fieldName = col.editableFieldConfig.populators.name;
            const fieldType = col.editableFieldConfig.type;
            const optionsKey = col.editableFieldConfig.populators.optionsKey;
            
            // Ensure nested structure
            const keys = fieldName.split(".");
            let current = defaultValues;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!current[keys[i]]) current[keys[i]] = {};
              current = current[keys[i]];
            }
            
            const value = (fieldType === "text" || fieldType === "toggle")
              ? `${_.get(data, fieldPath, "")}`
              : { [optionsKey]: `${_.get(data, fieldPath, "")}` };
            
            current[keys[keys.length - 1]] = value;
          }
        });
      };
      
      processColumns(config.columns);
      if (config.additionalPopupColumns) {
        processColumns(config.additionalPopupColumns);
      }
      
      return defaultValues;
    }, [config, data]);
  };

  const onSubmit = (data) => {
    handleRowSubmit(data);
  }
  //here form the formComposer config with column config and render inside children prop of Popup
  
  return (
    <PopUp
      className={'popUpClass'}
      heading={t(`EDIT_ROW`)}
      equalWidthButtons={true}
      onOverlayClick={() => {
        setShowEditablePopup(false);
        setEditRow(null);
      }}
      children={[
        <FormComposer
          label={t('Submit')}
          config={transformConfig(config ? config : {})}
          defaultValues={generateDefaultValues(config,editRow)}
          onSubmit={onSubmit}
          labelfielddirectionvertical={false}
        />,
      ]}
      // footerChildren={[
      //   <Button
      //     type={'button'}
      //     size={'large'}
      //     variation={'primary'}
      //     label={t('YES')}
      //     title={t('YES')}
      //     onClick={() => {
      //     }}
      //   />,
      //   <Button
      //     type={'button'}
      //     size={'large'}
      //     variation={'secondary'}
      //     label={t('NO')}
      //     title={t('NO')}
      //     onClick={() => {
      //     }}
      //   />,
      // ]}
      // sortFooterChildren={true}
      onClose={() => {
        setShowEditablePopup(false);
        setEditRow(null);
      }}
    ></PopUp>
  );
};

export default EditablePopup;
