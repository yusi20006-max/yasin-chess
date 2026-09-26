# PWA → Android Promotion Gate

## Rule
A gameplay or UI change is promoted to Android only after the PWA is verified from the same commit.

## Required sequence
1. Install JavaScript dependencies.
2. Run the complete PWA test suite with `npm test`.
3. Run the production PWA build with `npm run build`.
4. Only when both pass, build the Android debug APK.
5. After merge, install the APK on the reference physical Android device and repeat the relevant acceptance scenarios.

## Evidence
Record the commit SHA, PWA test/build result, Android APK path and SHA256, and physical-device result. Keep PWA and Android results separate.

## Scope
This gate does not claim that CI can replace physical-device verification. It prevents an Android debug build in this workflow from starting when the PWA gate fails.

## Runtime rule
The current shipped game is local Human vs AI. Network connectivity is not a prerequisite for local gameplay. Online-opponent transport requires a separate implemented and tested feature.
