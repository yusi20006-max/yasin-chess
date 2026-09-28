import {existsSync,readFileSync} from 'node:fs';

const required=['ANDROID_KEYSTORE_BASE64','ANDROID_KEY_ALIAS','ANDROID_KEYSTORE_PASSWORD','ANDROID_KEY_PASSWORD'];
const forbidden=['keystore.jks','upload-keystore.jks','*.jks'];

const gradlePaths=['android/app/build.gradle','android/app/build.gradle.kts'];
const gradle=gradlePaths.find(existsSync);
if(gradle){
 const text=readFileSync(gradle,'utf8');
 if(/signingConfigs\s*\{/.test(text)&&/storePassword\s+['"][^'"]+['"]/.test(text))throw new Error('Hard-coded signing password detected');
}
if(required.length!==4)throw new Error('Signing contract definition invalid');
console.log('Android signing contract passed.');
