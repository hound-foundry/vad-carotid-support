# CommonJS compatibility build of `decode-uri-component` 0.5.0

This private local package uses the upstream 0.5.0 decoder implementation and its MIT license. The only code change is adapting the ESM default export to `module.exports` so the current CommonJS `query-string` 7 consumer can call the patched decoder synchronously.

The package is private and must not be published independently. Recheck this compatibility build when Expo Router or `query-string` changes, and remove it when a compatible upstream CommonJS release is available.
