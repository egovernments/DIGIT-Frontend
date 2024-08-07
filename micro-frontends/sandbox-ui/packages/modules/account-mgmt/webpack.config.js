const path = require('path');
const { mergeWithRules } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const path = require('path');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "app",
    projectName: "react-app",
    webpackConfigEnv,
    argv,
  });

  return mergeWithRules({
    module: {
      rules: {
        test: "match",
        use: "replace"
      }
    }
  })(defaultConfig, {
    resolve: {
      alias: {
        components: path.resolve(__dirname, '../../components/src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          include: path.resolve(__dirname, 'css'),
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ],
        },
      ],
    },
  });
};
