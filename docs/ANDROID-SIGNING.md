# Android Release Signing

Release signing is intentionally external to source control.

## Required CI secrets

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

The keystore is decoded into the ephemeral CI workspace and never committed.

## Debug builds

Debug APKs use the Android/Gradle debug signing configuration and are safe for local smoke tests.

## Release builds

Release workflows must fail closed when the signing secrets are absent. The release artifact must never silently fall back to debug signing.

## Local release

Set the four environment variables, decode the keystore to a local ignored path, and invoke the Gradle release task. Never add the keystore or passwords to Git.
