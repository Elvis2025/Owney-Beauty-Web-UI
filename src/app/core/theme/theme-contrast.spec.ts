interface Scheme { name:string;background:string;foreground:string;primary:string;primaryForeground:string }
const schemes:Scheme[]=[
  {name:'noir claro',background:'#FFFFFF',foreground:'#0A0A0A',primary:'#0A0A0A',primaryForeground:'#FAFAFA'},{name:'noir oscuro',background:'#0A0A0A',foreground:'#F5F5F5',primary:'#E7E7E7',primaryForeground:'#0A0A0A'},
  {name:'champagne claro',background:'#FBF8F3',foreground:'#1F1A14',primary:'#8C6B3A',primaryForeground:'#FFFFFF'},{name:'champagne oscuro',background:'#14110D',foreground:'#F5EFE6',primary:'#D4B483',primaryForeground:'#1A140D'},
  {name:'rosé claro',background:'#FFF7F8',foreground:'#2A1218',primary:'#A3264A',primaryForeground:'#FFFFFF'},{name:'rosé oscuro',background:'#170A0E',foreground:'#FBEFF2',primary:'#F28AA8',primaryForeground:'#2A0B15'},
  {name:'orquídea claro',background:'#FCFAFF',foreground:'#1E1530',primary:'#6D28D9',primaryForeground:'#FFFFFF'},{name:'orquídea oscuro',background:'#110C1B',foreground:'#F3EEFD',primary:'#C4A5FF',primaryForeground:'#1E1033'},
  {name:'esmeralda claro',background:'#F7FBF9',foreground:'#0F1F19',primary:'#047857',primaryForeground:'#FFFFFF'},{name:'esmeralda oscuro',background:'#08130F',foreground:'#ECF7F2',primary:'#6EE7B7',primaryForeground:'#052E22'},
  {name:'caribe claro',background:'#F5FBFC',foreground:'#0B2027',primary:'#0E7490',primaryForeground:'#FFFFFF'},{name:'caribe oscuro',background:'#071418',foreground:'#E9F7FA',primary:'#5EE3F5',primaryForeground:'#052A33'},
  {name:'terracota claro',background:'#FCF8F5',foreground:'#2B1A12',primary:'#A84B23',primaryForeground:'#FFFFFF'},{name:'terracota oscuro',background:'#160E0A',foreground:'#F8ECE5',primary:'#F0936A',primaryForeground:'#2B1206'},
  {name:'medianoche claro',background:'#F7F8FB',foreground:'#0E1526',primary:'#1E2A4A',primaryForeground:'#FFFFFF'},{name:'medianoche oscuro',background:'#0A0F1C',foreground:'#EEF1F8',primary:'#E2C275',primaryForeground:'#1A1406'},
];
function luminance(hex:string){const rgb=hex.slice(1).match(/.{2}/g)!.map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
function contrast(a:string,b:string){const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (values[0]+.05)/(values[1]+.05)}
describe('contraste de los 16 esquemas',()=>{for(const scheme of schemes){it(`${scheme.name} cumple AA`,()=>{expect(contrast(scheme.background,scheme.foreground),`${scheme.name}: fondo/texto`).toBeGreaterThanOrEqual(4.5);expect(contrast(scheme.primary,scheme.primaryForeground),`${scheme.name}: acción primaria`).toBeGreaterThanOrEqual(4.5)})}});
