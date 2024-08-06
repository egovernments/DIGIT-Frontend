const path = require('path');
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const path = require('path');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "app",
    projectName: "react-app",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    resolve: {
      alias: {
        components: path.resolve(__dirname, '../../components/src'),
      },
    },
  }// modify the webpack config however you'd like to by adding to this object
  );
};
