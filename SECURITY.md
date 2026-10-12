# Security policy

## Reporting

Report vulnerabilities through GitHub’s **Report a vulnerability** feature on this repository. Do not publish exploit details or personal health information in a public issue. The repository is early-stage and volunteer-led; there is no guaranteed response time or service-level commitment.

Include the affected version or commit, impact, reproduction steps using synthetic data and any safe suggested fix. Do not access or retain another person’s information while investigating.

## Scope

This project currently has no production service or account backend. Its web and native clients, local storage, dependencies, build workflow and future release process remain in scope. A successful report does not imply permission to access third-party systems.

## Dependency review

On 12 October 2026, `npm audit` reported 28 transitive advisories in the Expo and React Native toolchain (18 high and 10 moderate). The suggested automatic resolution would downgrade Expo to a breaking older SDK, so it was not applied. Recheck against compatible upstream releases before distributing builds; this starter is not a production release.
