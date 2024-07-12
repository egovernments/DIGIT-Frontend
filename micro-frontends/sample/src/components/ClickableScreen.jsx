// ClickableScreen.js

import React from 'react';
import ToggleButton from './ToggleButton';
import { useDrawerState } from '../state/useDrawerState';
import { useNavigatorState } from '../state/useNavigatorState';
const enabled=false;
const ClickableScreen = ({ onTextClick,children }) => {
 
  const { setData:setDrawer,data:drawerData } = useDrawerState();
  const { data } = useNavigatorState();
  const [state,setState] = React.useState(false);
  const handleClick = (event) => {
    // Get the element that was clicked
    const clickedElement = event.target;

    // Extract text content from the clicked element
    const clickedText = clickedElement.textContent.trim();

    // Call the callback with the clicked text
    console.log(clickedText,'clickedText');
    state&& setDrawer({...drawerData,isOpen:!drawerData?.isOpen,clickedFrom:data?.currentScreen ,content:clickedText})
    onTextClick?.(clickedText);
    setState(false);
  };
  return (
    <div
    //  className="h-screen flex justify-center items-center bg-gray-200"
     >
      <div
        // className="p-6 bg-white shadow-lg rounded-md cursor-pointer"
        onClick={handleClick}
      >
        {!drawerData?.isOpen&&enabled&&<ToggleButton 
        opened={state}
        onClick={(e)=>{
          setState(!state);
          e.preventDefault();
          e.stopPropagation();
        }}
        // onClick={()=>setDrawer({...drawerData,isOpen:!drawerData?.isOpen,fromScreen:data?.currentScreen ,content:"Hii"})}
        ></ToggleButton>}
        
        {/* <p className="mt-2 text-sm text-gray-600">Identify the text you clicked on.</p>
        <button
          className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          onClick={handleClick}
        >
          Click Me
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default ClickableScreen;
