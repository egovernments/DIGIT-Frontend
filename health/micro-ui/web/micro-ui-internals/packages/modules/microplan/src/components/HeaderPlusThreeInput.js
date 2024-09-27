import React from 'react';
import ThreeInputComp from './ThreeInputComp';
import HeaderComp from './HeaderComp';
import { useTranslation } from 'react-i18next';

const HeaderPlusThreeInput = ({ title, threeInputArr }) => {
  const { t } = useTranslation();
  console.log("hello", title, threeInputArr);
  
  return (
    <div>
      <HeaderComp title={t(title)} />

      {
        threeInputArr.map((arr) => {
          console.log("hello1", arr);
          console.log("hello2", arr[0], arr[1], arr[2], arr[3]);

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
