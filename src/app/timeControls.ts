export type TimeControl={name:string;baseMs:number;incrementMs:number};
export const TIME_CONTROLS:TimeControl[]=[{name:'Bullet 1+0',baseMs:60_000,incrementMs:0},{name:'Blitz 3+2',baseMs:180_000,incrementMs:2_000},{name:'Blitz 5+0',baseMs:300_000,incrementMs:0},{name:'Rapid 10+5',baseMs:600_000,incrementMs:5_000},{name:'Classical 30+0',baseMs:1_800_000,incrementMs:0}];
export const timeControl=(name:string)=>TIME_CONTROLS.find(x=>x.name===name)??TIME_CONTROLS[1];
