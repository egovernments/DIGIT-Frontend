import React from 'react';
import ReactDOM from 'react-dom';
import registerRemotes from './utils/registerRemotes';


registerRemotes()

const AppWithRouter = () => {

  return (
   <div>
Hi
   </div>
  );
};

ReactDOM.render(<AppWithRouter />, document.querySelector('#root'));
