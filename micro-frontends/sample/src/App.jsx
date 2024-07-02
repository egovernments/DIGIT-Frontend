import "./App.css";
import Users from "./examples/Users";
import { Suspense } from "react";
import Theme from './examples/Theme';
import Action from './examples/Action';
import Optimistic from "./examples/Optimistic";
import FormStatus from "./examples/FormStatus";
import FormState from "./examples/FormState";
import Sample from "./pages/Sample";
import Test from "./pages/test";
import StatusBar from "./components/statusBar";
import { isOnline ,onNetworkChange} from "./idb/networkStatus";
import TestIdb from "./pages/testIdb";
// import TestIdb from "./pages/TestIdb.jsx";
// import { isOnline, onNetworkChange } from './networkStatus';



function App() {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <h1 className="text-2xl text-center font-bold mt-5">Loading...</h1>
          }
        >
          {/* <Action />
          <FormState />
         <FormStatus />
           <Optimistic /> */}
          {/* <Users /> */}
          <Theme >

          {/* <Sample></Sample> */}
          {/* <Test></Test> */}
       <TestIdb></TestIdb>
          </Theme>
<StatusBar></StatusBar>
        </Suspense>
      </div>
    </>
  );
}

export default App;




