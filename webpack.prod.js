const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

const domain = process.env.PRODUCTION_DOMAIN || "https://design-egov.github.io";

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "/container",
      filename: "[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "container",
        remotes: {
          // landing: `landing@${domain}/landing/remoteEntry.js`,
          auth: `auth@${domain}/auth/remoteEntry.js`,
          // header: `header@${domain}/header/remoteEntry.js`,
          // dashboard: `dashboard@${domain}/dashboard/remoteEntry.js`,
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
