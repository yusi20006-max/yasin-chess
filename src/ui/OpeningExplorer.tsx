import {findOpening} from '../engine/openings';

type Props={sans:string[];locale:'fa'|'en'};

export default function OpeningExplorer({sans,locale}:Props){
 const match=findOpening(sans);
 const title=locale==='fa'?'گشایش':'Opening';
 const unknown=match.confidence==='unknown';
 return <section className="opening-explorer" aria-label={title}>
  <div className="opening-header"><h2>{title}</h2><span>{match.matchedMoves?match.matchedMoves+' ply':'offline'}</span></div>
  <strong className={unknown?'opening-unknown':''}>{match.name}</strong>
  {match.variation&&<small>{match.variation}</small>}
  {!unknown&&match.nextMoves.length>0&&<div className="opening-next"><span>{locale==='fa'?'ادامه‌های شناخته‌شده:':'Known continuations:'}</span>{match.nextMoves.map(move=><b key={move}>{move}</b>)}</div>}
  {unknown&&<small>{locale==='fa'?'این خط در مجموعه آفلاین فعلی ثبت نشده است.':'This line is not in the current offline dataset.'}</small>}
 </section>;
}
