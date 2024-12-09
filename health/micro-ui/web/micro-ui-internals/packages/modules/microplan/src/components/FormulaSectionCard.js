import React from 'react';
import FormulaView from './FormulaView';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';

const FormulaSectionCard = ({ title, threeInputArr }) => {
  const { t } = useTranslation();
  
  
  return (
    <div>
      <HeaderComp title={t(title)} />

      {
        threeInputArr.map((arr) => {
          

          return (
            <FormulaView
              output={arr[0]} 
              input1={arr[1]} 
              input2={arr[2]} 
              input3={arr[3]} 
            />
          );
        })
      }

    </div>
  );
};

export default FormulaSectionCard;
