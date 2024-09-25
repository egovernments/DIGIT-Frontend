import React from 'react';
import ThreeInputComp from './ThreeInputComp';
import HeaderComp from './HeaderComp';


const HeaderPlusThreeInput = ({title,threeInputArr}) => {
  return (
    <div>
      <HeaderComp title={t({title})} />
        
        {
            threeInputArr.map((arr,index)=>{
                

            })
        }

    </div>
  )
}

export default HeaderPlusThreeInput