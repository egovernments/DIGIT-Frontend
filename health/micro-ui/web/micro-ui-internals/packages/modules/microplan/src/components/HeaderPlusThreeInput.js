import React from 'react';
import ThreeInputComp from './ThreeInputComp';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';

const HeaderPlusThreeInput = ({ title, threeInputArr }) => {
  const { t } = useTranslation();
  
  
  return (
    <div>
      <HeaderComp title={t(title)} />

      {
        threeInputArr.map((arr) => {
          

          return (
            <ThreeInputComp 
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

export default HeaderPlusThreeInput;
