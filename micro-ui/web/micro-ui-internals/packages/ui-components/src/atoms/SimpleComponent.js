import React, { useState, useEffect, useContext, useReducer, useRef } from 'react';

// Create a Context
const MyContext = React.createContext();

// Create a simple reducer
const initialState = { count: 0 };
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

// A simple child component that consumes the context
function ChildComponent() {
  const contextValue = useContext(MyContext);
  return <div>Context Value: {contextValue}</div>;
}

export default function SimpleComponent() {
  // useState hook
  const [stateValue, setStateValue] = useState(0);

  // useEffect hook
  useEffect(() => {
    console.log('Component mounted or stateValue changed');
    return () => {
      console.log('Cleanup on unmount or before stateValue changes');
    };
  }, [stateValue]);

  // useReducer hook
  const [state, dispatch] = useReducer(reducer, initialState);

  // useRef hook
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    setStateValue(stateValue + 1);
    dispatch({ type: 'increment' });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <MyContext.Provider value="Hello, Context!">
      <div>
        <h1>React Hooks Example</h1>
        <p>useState value: {stateValue}</p>
        <button onClick={handleButtonClick}>Increment</button>
        <p>useReducer count: {state.count}</p>
        <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
        <input ref={inputRef} placeholder="useRef example" />
        <ChildComponent />
      </div>
    </MyContext.Provider>
  );
}
