import {APP_VERSION,SERVICE_WORKER_URL} from './version';

export function registerServiceWorker(): void {
 if(!('serviceWorker' in navigator))return;
 window.addEventListener('load',()=>{
  void navigator.serviceWorker.register(SERVICE_WORKER_URL,{updateViaCache:'none'})
   .then(registration=>registration.update())
   .catch(()=>undefined);
 },{once:true});
}

export function requestServiceWorkerUpdate(): void {
 const worker=navigator.serviceWorker.controller;
 worker?.postMessage({type:'SKIP_WAITING',version:APP_VERSION});
}
