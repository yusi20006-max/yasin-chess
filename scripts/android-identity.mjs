import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const appId = 'com.yasin.chess';
const versionName = '0.3.0';

if (!existsSync('android')) {
  throw new Error('Android platform is missing. Run npm run android:init first.');
}

const gradle = 'android/app/build.gradle';
if (existsSync(gradle)) {
  let text = readFileSync(gradle, 'utf8');
  text = text.replace(/applicationId\s+"[^"]+"/, `applicationId "${appId}"`);
  text = text.replace(/versionName\s+"[^"]+"/, `versionName "${versionName}"`);
  writeFileSync(gradle, text);
}

console.log(`Android identity: ${appId} v${versionName}`);
