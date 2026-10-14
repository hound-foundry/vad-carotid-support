const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
// Metro cannot consume tslib's ESM facade default import of its UMD build.
// The CommonJS entry keeps pdf-lib's named TypeScript helpers available.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") return { type: "sourceFile", filePath: require.resolve("tslib") };
  return context.resolveRequest(context, moduleName, platform);
};
module.exports = config;
