import React from "react";
import ReactDOM from "react-dom";
import { QueryClient } from "react-query";

import App from "./App";

const c = new QueryClient();

ReactDOM.render(<App queryClient={c} />, document.getElementById("app"));
