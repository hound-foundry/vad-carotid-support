# Dependency security review

Checked on 12 October 2026 against the current npm lockfile and GitHub advisories. This is a maintenance note, not a complete security audit.

The lockfile now resolves Expo 57.0.28 and Expo Router 57.0.26 within the ranges already declared in `package.json`. The `xcode` build-tool dependency is scoped to `uuid` 11.1.1, which includes the bounds-check fix. A smoke check confirmed the installed `xcode` package and `uuid.v4()` load successfully.

Three advisory paths remain open:

- [`braces` GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): the Expo Metro build chain resolves `braces` 3.0.3. The advisory currently lists no patched version.
- [`node-forge` GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv): Expo CLI code-signing tooling resolves `node-forge` 1.4.0. The advisory currently lists no patched version.
- [`decode-uri-component` GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr): Expo Router’s `query-string` 7 dependency expects a synchronous CommonJS decoder. The published 0.5.0 fix is ESM-only; overriding it directly causes `TypeError: decodeComponent is not a function`. Keep this alert open until an upstream compatible release or a reviewed compatibility adapter is available.

Do not use `npm audit fix --force` to downgrade the Expo SDK. Recheck advisories after upstream releases and before distribution. Keep this gate visible in the release checklist; green project CI does not mean the dependency tree is vulnerability-free.
