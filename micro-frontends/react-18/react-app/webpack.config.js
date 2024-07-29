
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "app",
    projectName: "react-app",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    devServer: {
      port: 8080, // specify your desired port number here
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, '../components/src'),
      },
    },
    // other modifications to the webpack config can go here
  });
};

