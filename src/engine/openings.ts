export type OpeningLine={moves:string[];name:string;family:string;variation?:string};

export const OPENING_DATASET_VERSION='1.0.0';

/** Original compact Yasin Chess opening-line dataset. No runtime network or third-party database is required. */
export const OPENING_LINES:OpeningLine[]=[
 {moves:['e4'],name:'King Pawn Opening',family:'King Pawn'},
 {moves:['e4','e5'],name:'Open Game',family:'King Pawn'},
 {moves:['e4','c5'],name:'Sicilian Defense',family:'Sicilian Defense'},
 {moves:['e4','e6'],name:'French Defense',family:'French Defense'},
 {moves:['e4','c6'],name:'Caro-Kann Defense',family:'Caro-Kann Defense'},
 {moves:['e4','d5'],name:'Scandinavian Defense',family:'Scandinavian Defense'},
 {moves:['e4','Nf6'],name:"Alekhine's Defense",family:"Alekhine's Defense"},
 {moves:['e4','d6'],name:'Pirc Defense',family:'Pirc / Modern'},
 {moves:['e4','e5','Nf3','Nc6'],name:'Open Game: Four Knights Territory',family:'Open Game'},
 {moves:['e4','e5','Nf3','Nc6','Bc4'],name:'Italian Game',family:'Italian Game'},
 {moves:['e4','e5','Nf3','Nc6','Bc4','Bc5'],name:'Giuoco Piano',family:'Italian Game',variation:'Giuoco Piano'},
 {moves:['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d4'],name:'Giuoco Piano: Main Line',family:'Italian Game',variation:'Giuoco Piano Main Line'},
 {moves:['e4','e5','Nf3','Nc6','Bc4','Bc5','b4'],name:'Evans Gambit',family:'Italian Game',variation:'Evans Gambit'},
 {moves:['e4','e5','Nf3','Nc6','Bc4','Nf6'],name:'Italian Game: Two Knights Defense',family:'Italian Game',variation:'Two Knights Defense'},
 {moves:['e4','e5','Nf3','Nc6','Bb5'],name:'Ruy López',family:'Ruy López / Spanish'},
 {moves:['e4','e5','Nf3','Nc6','Bb5','a6'],name:'Ruy López: Morphy Defense',family:'Ruy López / Spanish',variation:'Morphy Defense'},
 {moves:['e4','e5','Nf3','Nc6','d4'],name:'Scotch Game',family:'Scotch Game'},
 {moves:['e4','e5','Nc3'],name:'Vienna Game',family:'Vienna Game'},
 {moves:['e4','e5','f4'],name:"King's Gambit",family:"King's Gambit"},
 {moves:['e4','e5','Nf3','Nf6'],name:'Petrov Defense',family:'Petrov Defense'},
 {moves:['e4','c5','Nf3'],name:'Sicilian Defense: Open',family:'Sicilian Defense',variation:'Open Sicilian'},
 {moves:['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6'],name:'Sicilian Defense: Najdorf',family:'Sicilian Defense',variation:'Najdorf'},
 {moves:['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','g6'],name:'Sicilian Defense: Dragon',family:'Sicilian Defense',variation:'Dragon'},
 {moves:['e4','c5','c3'],name:'Sicilian Defense: Alapin',family:'Sicilian Defense',variation:'Alapin'},
 {moves:['e4','c5','Nc3'],name:'Sicilian Defense: Closed',family:'Sicilian Defense',variation:'Closed'},
 {moves:['d4'],name:'Queen Pawn Opening',family:'Queen Pawn'},
 {moves:['d4','d5'],name:"Queen's Pawn Game",family:"Queen's Pawn"},
 {moves:['d4','d5','c4'],name:"Queen's Gambit",family:"Queen's Gambit"},
 {moves:['d4','d5','c4','e6'],name:"Queen's Gambit Declined",family:"Queen's Gambit",variation:'Declined'},
 {moves:['d4','d5','c4','c6'],name:'Slav Defense',family:'Slav Defense'},
 {moves:['d4','d5','Nf3','Nf6','Bf4'],name:'London System',family:'London System'},
 {moves:['d4','Nf6'],name:'Indian Game',family:'Indian Game'},
 {moves:['d4','Nf6','c4','g6'],name:"King's Indian Defense",family:"King's Indian Defense"},
 {moves:['d4','Nf6','c4','g6','Nc3','Bg7'],name:"King's Indian Defense: Fianchetto",family:"King's Indian Defense",variation:'Fianchetto'},
 {moves:['d4','Nf6','c4','g6','Nc3','d5'],name:'Grünfeld Defense',family:'Grünfeld Defense'},
 {moves:['d4','Nf6','c4','e6','Nc3','Bb4'],name:'Nimzo-Indian Defense',family:'Nimzo-Indian Defense'},
 {moves:['d4','Nf6','c4','e6','Nf3','b6'],name:'Queen\'s Indian Defense',family:'Queen\'s Indian Defense'},
 {moves:['d4','Nf6','c4','e6','g3'],name:'Catalan Opening',family:'Catalan Opening'},
 {moves:['c4'],name:'English Opening',family:'English Opening'},
 {moves:['Nf3'],name:'Réti Opening',family:'Réti Opening'},
 {moves:['Nf3','d5','g3'],name:"King's Indian Attack",family:"King's Indian Attack"},
 {moves:['f4'],name:"Bird Opening",family:'Bird Opening'},
 {moves:['b3'],name:'Nimzowitsch-Larsen Attack',family:'Flank Opening'},
 {moves:['g3'],name:"King's Fianchetto Opening",family:'Flank Opening'},
 {moves:['g4'],name:'Grob Opening',family:'Flank Opening'}
];

export type OpeningMatch={name:string;family:string;variation?:string;matchedMoves:number;nextMoves:string[];confidence:'high'|'medium'|'low'|'unknown'};

export function findOpening(sans:string[]):OpeningMatch{
 const normalized=sans.map(x=>x.trim()).filter(Boolean);
 let best:OpeningLine|undefined;
 for(const line of OPENING_LINES)if(line.moves.length<=normalized.length&&line.moves.every((m,i)=>m===normalized[i])&&(!best||line.moves.length>best.moves.length))best=line;
 if(!best)return {name:'Unknown opening',family:'Unknown opening',matchedMoves:0,nextMoves:[],confidence:'unknown'};
 const next=new Set<string>();
 for(const line of OPENING_LINES){if(line.moves.length>normalized.length&&line.moves.slice(0,normalized.length).every((m,i)=>m===normalized[i]))next.add(line.moves[normalized.length]);}
 const confidence=best.moves.length>=5?'high':best.moves.length>=3?'medium':'low';
 return {name:best.name,family:best.family,variation:best.variation,matchedMoves:best.moves.length,nextMoves:[...next].slice(0,5),confidence};
}
