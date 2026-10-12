# Dependency security review

Checked on 12 October 2026 against the current npm lockfile, npm audit data, npm registry releases, GitHub Dependabot alerts and Expo’s SDK 57 documentation. This is a maintenance note, not a complete security audit.

The lockfile now resolves Expo 57.0.28 and Expo Router 57.0.26 within the ranges already declared in `package.json`. The `xcode` build-tool dependency is scoped to `uuid` 11.1.1, which includes the bounds-check fix. A smoke check confirmed the installed `xcode` package and `uuid.v4()` load successfully.

GitHub currently reports four open Dependabot alerts on the default branch. The `uuid` alert is fixed on this project branch by the `xcode` override; it will remain visible against the default branch until that change is merged. Three distinct advisory paths still affect the current tree:

- [`braces` GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): Expo Metro’s file-matching build chain resolves `braces` 3.0.3. The advisory lists no patched version.
- [`node-forge` GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv): Expo CLI code-signing tooling resolves `node-forge` 1.4.0. This advisory also lists no patched version. The earlier `node-forge` certificate-chain issue is fixed in 1.4.0; this is a separate later finding.
- [`decode-uri-component` GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr): `expo-router` 57.0.26 includes `query-string` 7.1.3, which synchronously calls the CommonJS decoder while parsing route query parameters. Version 0.5.0 fixes the decoder advisory but is ESM-only, and a direct override breaks the current consumer. This is the one open finding with a published package fix, but there is no compatible stable Expo Router update in the current Expo SDK 57 line.

`npm audit` reports 21 affected package nodes because it counts transitive dependencies along multiple paths; this is not 21 distinct advisories. The three issues above are the distinct unresolved upstream findings. On the check date, npm’s latest stable tags were Expo 57.0.28 and Expo Router 57.0.26; [Expo’s current stable SDK reference](https://docs.expo.dev/versions/latest/) lists SDK 57. Do not move this project to the SDK 58 router `next` line or a canary solely to silence an alert; [Expo recommends incremental upgrades](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) and checking release notes.

The current exposure differs by dependency: `braces` and `node-forge` are in the local Expo/Metro build and signing toolchain; `decode-uri-component` is reached through Expo Router’s query parsing path in the app. Keep build tooling patched where possible, avoid serving untrusted project changes through local development servers, and keep private notes out of URL parameters. These are mitigations only; they do not clear the advisories or replace a compatibility fix.

Weekly Dependabot updates are configured for npm packages and GitHub Actions in `.github/dependabot.yml`. Review and test each update; automated update PRs do not constitute approval. Do not use `npm audit fix --force` to downgrade the Expo SDK. Recheck advisories after upstream releases and before distribution. Keep this gate visible in the release checklist; green project CI does not mean the dependency tree is vulnerability-free.
