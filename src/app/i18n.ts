export type Locale='fa'|'en';

export const messages = {
  fa: {
    playing:'در حال بازی', check:'کیش', checkmate:'کیش‌ومات', stalemate:'پات', draw:'تساوی', undo:'واگرد', redo:'بازانجام', newGame:'بازی جدید', flip:'چرخش صفحه',
    offline:'هوش مصنوعی محلی · بازی آفلاین · بدون نیاز به شبکه', thinking:'هوش مصنوعی در حال فکر کردن', idle:'هوش مصنوعی آماده است', moves:'حرکت‌ها', lastMove:'آخرین حرکت', clear:'پاک‌کردن انتخاب', force:'حرکت اجباری', rematch:'بازی دوباره', gameOver:'پایان بازی', choosePromotion:'انتخاب مهره برای ترفیع', white:'سفید', blackAi:'سیاه · هوش مصنوعی', yourTurn:'نوبت شما', waiting:'انتظار',
    theme:'پوسته برنامه', language:'زبان', system:'سیستم', light:'روشن', dark:'تیره', boardTheme:'پوسته صفحه', difficulty:'سطح هوش مصنوعی', depth:'عمق', status:'وضعیت', languageFa:'فارسی', languageEn:'انگلیسی',
    gameMode:'حالت بازی', humanVsAi:'انسان در برابر هوش مصنوعی', humanVsHuman:'انسان در برابر انسان', aiVsAi:'هوش مصنوعی در برابر هوش مصنوعی', chessEngine:'موتور شطرنج', localMinimax:'مینیمکس محلی', stockfishWasm:'استاک‌فیش WASM',
    timeControl:'زمان بازی', boardAndFiles:'صفحه و فایل', positionEditor:'ویرایشگر موقعیت', loadFen:'بارگذاری FEN', importPgn:'درون‌ریزی PGN', exportPgn:'برون‌بری PGN', sound:'صدا',
    close:'بستن', menu:'منو', options:'گزینه‌ها', gameAndBoardSettings:'تنظیمات بازی و صفحه', appearanceLanguage:'ظاهر و زبان', clearSelection:'پاک‌کردن انتخاب',
    boardThemes:'پوسته‌های صفحه', chessBoard:'صفحه شطرنج', selected:'انتخاب‌شده', legalMove:'حرکت قانونی', inCheck:'در کیش',
    reviewMoves:'مرور حرکت‌ها', analyzeMoves:'تحلیل حرکت‌ها', analyzing:'در حال تحلیل', whiteWins:'برد سفید', blackWins:'برد سیاه', winsByCheckmate:'با کیش‌ومات پیروز شد', gameEndedReview:'بازی پایان یافته است. حرکت‌ها را مرور کنید یا بازی جدید را شروع کنید.',
    brilliant:'درخشان', excellent:'عالی', good:'خوب', inaccuracy:'نادقتی', mistake:'اشتباه', blunder:'سهل‌انگاری فاحش', approximateAnalysis:'تحلیل تقریبی مینیمکس', engineAnalysis:'تحلیل موتور',
    opening:'گشایش', knownContinuations:'ادامه‌های شناخته‌شده:', unknownOpeningLine:'این خط در مجموعه آفلاین فعلی ثبت نشده است.',
    openingKingPawn:'گشایش پیاده شاه', openingOpenGame:'بازی باز', openingSicilian:'دفاع سیسیلی', openingFrench:'دفاع فرانسوی', openingCaroKann:'دفاع کاروکان', openingScandinavian:'دفاع اسکاندیناوی',
    openingAlekhine:'دفاع آلخین', openingPirc:'دفاع پیرک', openingFourKnights:'بازی چهار اسب', openingItalian:'گشایش ایتالیایی', openingGiuoco:'گامبیت/بازی جیوکو پیانو',
    openingEvans:'گامبی اوانز', openingTwoKnights:'دفاع دو اسب', openingRuyLopez:'گشایش اسپانیایی (روی لوپز)', openingMorphy:'دفاع مورفی', openingScotch:'بازی اسکاتلندی',
    openingVienna:'گشایش وین', openingKingsGambit:'گامبی شاه', openingPetrov:'دفاع پتروف', openingNimzowitsch:'دفاع نیمزوویچ', openingSicilianOpen:'دفاع سیسیلی: شاخه باز',
    openingNajdorf:'دفاع سیسیلی: شاخه نایدورف', openingDragon:'دفاع سیسیلی: شاخه دراگون', openingAlapin:'دفاع سیسیلی: شاخه آلاپین', openingClosed:'دفاع سیسیلی: شاخه بسته',
    openingQueenPawn:'گشایش پیاده وزیر', openingQueensPawnGame:'بازی پیاده وزیر', openingQueensGambit:'گامبی وزیر', openingQGD:'گامبی وزیر: دفاع انصرافی', openingSlav:'دفاع اسلاو',
    openingLondon:'سیستم لندن', openingIndian:'بازی هندی', openingKingsIndian:'دفاع هندی شاه', openingKingsIndianFianchetto:'دفاع هندی شاه: فینکتو',
    openingGrunfeld:'دفاع گرونفلد', openingNimzoIndian:'دفاع نیمزو-هندی', openingQueensIndian:'دفاع هندی وزیر', openingCatalan:'گشایش کاتالان',
    openingEnglish:'گشایش انگلیسی', openingReti:'گشایش رتی', openingKingsIndianAttack:'حمله هندی شاه', openingBird:'گشایش برد', openingNimzowitschLarsen:'حمله نیمزوویچ-لارسن',
    openingKingsFianchetto:'گشایش فینکتوی شاه', openingGrob:'گشایش گروب', expert:'استاد'
  },
  en: {
    playing:'Playing', check:'Check', checkmate:'Checkmate', stalemate:'Stalemate', draw:'Draw', undo:'Undo', redo:'Redo', newGame:'New Game', flip:'Flip board',
    offline:'Local AI · Offline game · No network required', thinking:'AI is thinking', idle:'AI ready', moves:'Moves', lastMove:'Last move', clear:'Clear selection', force:'Force Move', rematch:'Rematch', gameOver:'Game Over', choosePromotion:'Choose promotion', white:'White', blackAi:'Black · AI', yourTurn:'Your turn', waiting:'Waiting',
    theme:'Application theme', language:'Language', system:'System', light:'Light', dark:'Dark', boardTheme:'Board Theme', difficulty:'AI difficulty', depth:'Depth', status:'Status', languageFa:'Persian', languageEn:'English',
    gameMode:'Game mode', humanVsAi:'Human vs AI', humanVsHuman:'Human vs Human', aiVsAi:'AI vs AI', chessEngine:'Chess engine', localMinimax:'Local Minimax', stockfishWasm:'Stockfish WASM',
    timeControl:'Time control', boardAndFiles:'Board & files', positionEditor:'Position editor', loadFen:'Load FEN', importPgn:'Import PGN', exportPgn:'Export PGN', sound:'Sound',
    close:'Close', menu:'Menu', options:'Options', gameAndBoardSettings:'Game and board settings', appearanceLanguage:'Appearance & language', clearSelection:'Clear selection',
    boardThemes:'Board themes', chessBoard:'Chess board', selected:'selected', legalMove:'legal move', inCheck:'in check',
    reviewMoves:'Review moves', analyzeMoves:'Analyze moves', analyzing:'Analyzing', whiteWins:'White wins', blackWins:'Black wins', winsByCheckmate:'wins by checkmate', gameEndedReview:'The game has ended. Review the moves or start a new game.',
    brilliant:'Brilliant', excellent:'Excellent', good:'Good', inaccuracy:'Inaccuracy', mistake:'Mistake', blunder:'Blunder', approximateAnalysis:'Approximate Minimax analysis', engineAnalysis:'Engine analysis',
    opening:'Opening', knownContinuations:'Known continuations:', unknownOpeningLine:'This line is not in the current offline dataset.',
    openingKingPawn:'King Pawn Opening', openingOpenGame:'Open Game', openingSicilian:'Sicilian Defense', openingFrench:'French Defense', openingCaroKann:'Caro-Kann Defense', openingScandinavian:'Scandinavian Defense',
    openingAlekhine:"Alekhine's Defense", openingPirc:'Pirc Defense', openingFourKnights:'Four Knights Game', openingItalian:'Italian Game', openingGiuoco:'Giuoco Piano',
    openingEvans:'Evans Gambit', openingTwoKnights:'Two Knights Defense', openingRuyLopez:'Ruy López', openingMorphy:'Morphy Defense', openingScotch:'Scotch Game',
    openingVienna:'Vienna Game', openingKingsGambit:"King's Gambit", openingPetrov:'Petrov Defense', openingNimzowitsch:'Nimzowitsch Defense', openingSicilianOpen:'Sicilian Defense: Open',
    openingNajdorf:'Sicilian Defense: Najdorf', openingDragon:'Sicilian Defense: Dragon', openingAlapin:'Sicilian Defense: Alapin', openingClosed:'Sicilian Defense: Closed',
    openingQueenPawn:'Queen Pawn Opening', openingQueensPawnGame:"Queen's Pawn Game", openingQueensGambit:"Queen's Gambit", openingQGD:"Queen's Gambit: Declined", openingSlav:'Slav Defense',
    openingLondon:'London System', openingIndian:'Indian Game', openingKingsIndian:"King's Indian Defense", openingKingsIndianFianchetto:"King's Indian Defense: Fianchetto",
    openingGrunfeld:'Grünfeld Defense', openingNimzoIndian:'Nimzo-Indian Defense', openingQueensIndian:"Queen's Indian Defense", openingCatalan:'Catalan Opening',
    openingEnglish:'English Opening', openingReti:'Réti Opening', openingKingsIndianAttack:"King's Indian Attack", openingBird:'Bird Opening', openingNimzowitschLarsen:'Nimzowitsch-Larsen Attack',
    openingKingsFianchetto:"King's Fianchetto Opening", openingGrob:'Grob Opening', expert:'Master'
  }
} as const;

export type MessageKey=keyof typeof messages.fa;
export function translate(locale:Locale,key:MessageKey):string{return messages[locale][key];}
export function applyLocale(locale:Locale):void{
 if(typeof document==='undefined')return;
 document.documentElement.lang=locale;
 document.documentElement.dir=locale==='fa'?'rtl':'ltr';
}