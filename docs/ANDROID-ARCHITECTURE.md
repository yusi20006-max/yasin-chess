# Android Standalone Architecture

## Goal

Yasin Chess v0.3.0 packages the existing React/TypeScript/Vite application as a standalone Android application. The Android shell is a thin native container; chess rules, engine, UI components, persistence contracts, and offline application assets remain in the web application.

## Runtime boundaries

- **Web layer:** React + TypeScript + Vite build output.
- **Native layer:** Capacitor Android bridge and Android system integration.
- **Storage:** application-owned browser storage exposed by the WebView; native plugins are used only where a native capability is required.
- **Network:** gameplay must not require a network connection.
- **Termux:** development/build convenience only; never a runtime dependency of the APK.

## Build flow

1. `npm install`
2. `npm run build`
3. Capacitor synchronizes `dist/` into the Android project.
4. Gradle builds the APK/AAB.
5. The resulting APK is installable on a clean Android device without Node.js, Python, Termux, or a local server.

## Acceptance criteria

- Android packaging is reproducible from the repository.
- The APK launches directly into Yasin Chess.
- No localhost server is required.
- Existing offline/PWA behavior remains valid for the web build.
- Native integrations stay isolated from chess-core logic.
