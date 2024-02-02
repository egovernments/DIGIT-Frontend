import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  plugins: [
    resolve({
      extensions: [".js", ".jsx"],
    }),
    babel({
      babelHelpers: "runtime",
      plugins: ["@babel/plugin-transform-runtime"],
      presets: ["@babel/preset-react"],
    }),
  ],
  output: [
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom", "react-query"],
};
