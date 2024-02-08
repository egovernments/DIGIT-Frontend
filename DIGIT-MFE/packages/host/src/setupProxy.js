const { createProxyMiddleware } = require("http-proxy-middleware");

const individualSearchProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_API ||"https://unified-dev.digit.org",
  changeOrigin: true,
  secure: false,
});

//   const otherApiProxy = createProxyMiddleware({
//     target: 'http://your-other-api-url',
//     changeOrigin: true,
//     secure: false,
//   });                                  // add more proxy configurations as needed



module.exports = function (app) {
//   app.use("/individual/v1/_search", individualSearchProxy);
  ["/individual/v1/_search"].forEach((location) => app.use(location, individualSearchProxy));

//   app.use("/other-api-path", otherApiProxy);                // Apply proxy for other APIs



};
