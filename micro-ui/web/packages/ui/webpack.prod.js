const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

const domain = process.env.PRODUCTION_DOMAIN || "https://unified-dev.digit.org";

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/ui-core-mfe/"
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "ui-core-mfe",
        remotes: {
        hrms: `hrms@${domain}/hrms-ui/remoteEntry.js`,
        //   common: `common@${domain}/common-ui/remoteEntry.js`,
        //   pgr: `pgr@${domain}/pgr-ui/remoteEntry.js`,
        //   workbench : `workbench@${domain}/workbench-mfe/remoteEntry.js`,
        //   dss : `dss@${domain}/dss-ui/remoteEntry.js`,
        //   engagement : `engagement@${domain}/engagement-ui/remoteEntry.js`,
        //   microplan : `microplan@${domain}/microplan-mfe/remoteEntry.js`,
          // tqm : `tqm@${domain}/tqm-ui/remoteEntry.js`,
         // campaign : `campaign@${domain}/campaign-mfe/remoteEntry.js`
        },
        shared: {
          ...packageJson.dependencies,
          react: { singleton: true }, // React will be shared as a singleton
          'react-dom': { singleton: true }, // ReactDOM will be shared as a singleton
          'react-query': { singleton: true },
        },
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
