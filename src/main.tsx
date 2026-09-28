import React from 'react';import {createRoot} from 'react-dom/client';import App from './ui/App';import './ui/styles.css';import {registerServiceWorker} from './pwa/registerSW';import {registerAndroidLifecycle} from './pwa/androidLifecycle';
registerServiceWorker();
registerAndroidLifecycle();
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
