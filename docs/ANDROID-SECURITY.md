# Android Security Baseline

- No runtime server URL is configured.
- Cleartext traffic is disabled in Capacitor configuration.
- CSP restricts runtime network connections to same-origin resources.
- Release signing material stays outside Git.
- Dependency audit runs on pull requests.
- Android emulator smoke tests install the generated package rather than executing through Termux.
