# Android Release Signing

Release signing must use CI or local environment secrets. Never commit a keystore or plaintext signing password.

Required CI/local inputs:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`

For a release build, decode the keystore into a temporary workspace and configure Gradle signing from environment/secret-backed properties. Debug builds remain independently reproducible without release credentials.

A release pipeline should publish artifact metadata and a SHA-256 digest. Private signing material must never appear in logs or repository files.
