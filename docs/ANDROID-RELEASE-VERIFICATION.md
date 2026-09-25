# Android Release Verification

The workflow compiles both release and debug variants. The debug APK is the signed, installable CI smoke-test candidate; the release APK is verified at compile time unless release signing secrets are configured.

A signed production release requires the signing architecture from #223.
