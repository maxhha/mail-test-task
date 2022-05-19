const path = require("path");

module.exports = {
  paths: function (paths, env) {
    paths.appPublic = path.resolve(__dirname, "frontend/public");
    paths.appHtml = path.resolve(__dirname, "frontend/public/index.html");
    paths.appIndexJs = path.resolve(__dirname, "frontend/src/index.js");
    paths.testsSetup = path.resolve(__dirname, "frontend/src/setupTests.js");
    paths.proxySetup = path.resolve(__dirname, "frontend/src/setupProxy.js");
    paths.swSrc = path.resolve(__dirname, "frontend/src/service-worker.js");
    paths.appSrc = path.resolve(__dirname, "frontend/src");
    paths.appTypeDeclarations = path.resolve(
      __dirname,
      "frontend/src/react-app-env.d.ts"
    );

    return paths;
  },
};
