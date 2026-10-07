type EvaluationBarProps={scoreCp:number;mate?:number;approximate:boolean;loading:boolean;locale:'fa'|'en'};

function whitePercent(scoreCp:number,mate?:number){if(mate!==undefined)return mate>0?100:0;const bounded=Math.max(-1200,Math.min(1200,scoreCp));return 50+50*Math.tanh(bounded/600);}

export default function EvaluationBar({scoreCp,mate,approximate,loading,locale}:EvaluationBarProps){
 const white=whitePercent(scoreCp,mate);
 const label=matedLabel(mate,locale)??(Math.abs(scoreCp)<8?'0.0':(scoreCp>0?'+':'')+(scoreCp/100).toFixed(1));
 const description=locale==='fa'?('ارزیابی '+(approximate?'تقریبی':'موتور')+': '+label):('Evaluation '+(approximate?'approximate':'engine')+': '+label);
 return <div className="evaluation-wrap" aria-label={description} role="img" data-evaluation-source={approximate?'minimax':'stockfish'}>
  <div className="evaluation-track"><div className="evaluation-white" style={{height:white+'%'}}/><div className="evaluation-center" aria-hidden="true"/></div>
  <div className="evaluation-label" aria-live="polite">{loading?'…':label}</div>
 </div>;
}

function matedLabel(mate:number|undefined,locale:'fa'|'en'){if(mate===undefined)return undefined;return 'M'+Math.abs(mate);}
