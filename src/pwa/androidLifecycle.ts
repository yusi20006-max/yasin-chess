import {App} from '@capacitor/app';

let registered=false;

export function registerAndroidLifecycle():void{
 if(registered||typeof window==='undefined')return;
 registered=true;
 void App.addListener('backButton',event=>{
  if(event.canGoBack)window.history.back();
  else void App.exitApp();
 });
}
