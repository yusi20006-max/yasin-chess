export type Locale='fa'|'en';

export const messages = {
  fa: {
    playing:'در حال بازی', check:'کیش', checkmate:'کیش‌ومات', stalemate:'پات', draw:'مساوی', undo:'واگرد', redo:'بازانجام', newGame:'بازی جدید', flip:'چرخش صفحه',
    offline:'هوش مصنوعی محلی · بازی آفلاین · بدون نیاز به شبکه', thinking:'هوش مصنوعی در حال فکر کردن', idle:'هوش مصنوعی آماده است', moves:'حرکت‌ها', lastMove:'آخرین حرکت', clear:'پاک‌کردن انتخاب', force:'حرکت اجباری', rematch:'بازی دوباره', gameOver:'پایان بازی', choosePromotion:'انتخاب مهره ترفیع', white:'سفید', blackAi:'سیاه · هوش مصنوعی', yourTurn:'نوبت شما', waiting:'انتظار',
    theme:'پوسته برنامه', language:'زبان', system:'سیستم', light:'روشن', dark:'تیره', boardTheme:'پوسته صفحه', difficulty:'سطح هوش مصنوعی', depth:'عمق', status:'وضعیت', languageFa:'فارسی', languageEn:'English'
  },
  en: {
    playing:'Playing', check:'Check', checkmate:'Checkmate', stalemate:'Stalemate', draw:'Draw', undo:'Undo', redo:'Redo', newGame:'New Game', flip:'Flip board',
    offline:'Local AI · Offline game · No network required', thinking:'AI is thinking', idle:'AI idle', moves:'Moves', lastMove:'Last move', clear:'Clear selection', force:'Force Move', rematch:'Rematch', gameOver:'Game Over', choosePromotion:'Choose promotion', white:'White', blackAi:'Black · AI', yourTurn:'Your turn', waiting:'Waiting',
    theme:'Application theme', language:'Language', system:'System', light:'Light', dark:'Dark', boardTheme:'Board Theme', difficulty:'AI difficulty', depth:'Depth', status:'Status', languageFa:'فارسی', languageEn:'English'
  }
} as const;

export type MessageKey=keyof typeof messages.fa;
export function translate(locale:Locale,key:MessageKey):string{return messages[locale][key];}
export function applyLocale(locale:Locale):void{
 if(typeof document==='undefined')return;
 document.documentElement.lang=locale;
 document.documentElement.dir=locale==='fa'?'rtl':'ltr';
}
