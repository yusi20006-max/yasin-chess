export type DifficultyId='beginner'|'intermediate'|'advanced'|'master'|'custom';
export type Difficulty={id:DifficultyId;label:string;depth:number;elo:number;hints:boolean;explain:boolean;stockfishSkill:number};
export const DIFFICULTIES:Difficulty[]=[
{id:'beginner',label:'مبتدی',depth:2,elo:800,hints:true,explain:true,stockfishSkill:2},
{id:'intermediate',label:'متوسط',depth:4,elo:1400,hints:true,explain:true,stockfishSkill:7},
{id:'advanced',label:'پیشرفته',depth:8,elo:1900,hints:false,explain:false,stockfishSkill:14},
{id:'master',label:'استاد / Expert',depth:14,elo:2800,hints:false,explain:false,stockfishSkill:20},
{id:'custom',label:'سفارشی',depth:8,elo:1800,hints:false,explain:false,stockfishSkill:10}
];
export function difficulty(id:DifficultyId,overrides?:Partial<Difficulty>):Difficulty{const base=DIFFICULTIES.find(x=>x.id===id)??DIFFICULTIES[0];return {...base,...overrides,id};}
