import {findOpening} from '../engine/openings';
import {translate,type Locale} from '../app/i18n';

type Props={sans:string[];locale:Locale};

const NAME_KEYS:Record<string,Parameters<typeof translate>[1]>={
 'King Pawn Opening':'openingKingPawn','Open Game':'openingOpenGame','Sicilian Defense':'openingSicilian','French Defense':'openingFrench',
 'Caro-Kann Defense':'openingCaroKann','Scandinavian Defense':'openingScandinavian',"Alekhine's Defense":'openingAlekhine','Pirc Defense':'openingPirc',
 'Four Knights Game':'openingFourKnights','Italian Game':'openingItalian','Giuoco Piano':'openingGiuoco','Giuoco Piano: Main Line':'openingGiuoco',
 'Evans Gambit':'openingEvans','Italian Game: Two Knights Defense':'openingTwoKnights','Ruy López':'openingRuyLopez','Ruy López: Morphy Defense':'openingMorphy',
 'Scotch Game':'openingScotch','Vienna Game':'openingVienna',"King's Gambit":'openingKingsGambit','Petrov Defense':'openingPetrov',
 'Nimzowitsch Defense':'openingNimzowitsch','Sicilian Defense: Open':'openingSicilianOpen','Sicilian Defense: Najdorf':'openingNajdorf',
 'Sicilian Defense: Dragon':'openingDragon','Sicilian Defense: Alapin':'openingAlapin','Sicilian Defense: Closed':'openingClosed',
 'Queen Pawn Opening':'openingQueenPawn',"Queen's Pawn Game":'openingQueensPawnGame',"Queen's Gambit":'openingQueensGambit',
 "Queen's Gambit Declined":'openingQGD','Slav Defense':'openingSlav','London System':'openingLondon','Indian Game':'openingIndian',
 "King's Indian Defense":'openingKingsIndian',"King's Indian Defense: Fianchetto":'openingKingsIndianFianchetto','Grünfeld Defense':'openingGrunfeld',
 'Nimzo-Indian Defense':'openingNimzoIndian',"Queen's Indian Defense":'openingQueensIndian','Catalan Opening':'openingCatalan',
 'English Opening':'openingEnglish','Réti Opening':'openingReti',"King's Indian Attack":'openingKingsIndianAttack','Bird Opening':'openingBird',
 'Nimzowitsch-Larsen Attack':'openingNimzowitschLarsen',"King's Fianchetto Opening":'openingKingsFianchetto','Grob Opening':'openingGrob'
};

export default function OpeningExplorer({sans,locale}:Props){
 const match=findOpening(sans);
 const unknown=match.confidence==='unknown';
 const key=NAME_KEYS[match.name];
 const name=key?translate(locale,key):match.name;
 const variation=match.variation?translateVariation(match.variation,locale):undefined;
 return <section className="opening-explorer" aria-label={translate(locale,'opening')}>
  <div className="opening-header"><h2>{translate(locale,'opening')}</h2><span>{match.matchedMoves?match.matchedMoves+' ply':(locale==='fa'?'آفلاین':'offline')}</span></div>
  <strong className={unknown?'opening-unknown':''}>{name}</strong>
  {variation&&<small>{variation}</small>}
  {!unknown&&match.nextMoves.length>0&&<div className="opening-next"><span>{translate(locale,'knownContinuations')}</span>{match.nextMoves.map(move=><b key={move}>{move}</b>)}</div>}
  {unknown&&<small>{translate(locale,'unknownOpeningLine')}</small>}
 </section>;
}

function translateVariation(value:string,locale:Locale){
 if(locale==='en')return value;
 const map:Record<string,string>={
  'Giuoco Piano':'جیوکو پیانو','Giuoco Piano Main Line':'جیوکو پیانو، خط اصلی','Evans Gambit':'گامبی اوانز','Two Knights Defense':'دفاع دو اسب',
  'Morphy Defense':'دفاع مورفی','Open Sicilian':'دفاع سیسیلی، شاخه باز','Najdorf':'شاخه نایدورف','Dragon':'شاخه دراگون',
  'Alapin':'شاخه آلاپین','Closed':'شاخه بسته','Declined':'دفاع انصرافی','Fianchetto':'فینکتو'
 };
 return map[value]??value;
}
