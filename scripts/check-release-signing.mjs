const required = ['ANDROID_KEYSTORE_BASE64','ANDROID_KEYSTORE_PASSWORD','ANDROID_KEY_ALIAS','ANDROID_KEY_PASSWORD'];
const missing = required.filter(key => !process.env[key]);
if (process.env.RELEASE_BUILD === 'true' && missing.length) {
  throw new Error(`Release signing configuration missing: ${missing.join(', ')}`);
}
console.log('Release signing configuration is valid for the selected build mode.');
