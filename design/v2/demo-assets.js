/* デモ用の架空チーム・エンブレム・チームオリジナルの絵（league.html から切り出した写し。me.html で使う）
   ※ league.html にも同じコードがある。片方を直したらもう片方も直す */
/* ===== 架空のチーム（名前・色・エンブレム）。実在のチームではない ===== */
const ANIMAL={
  fox:c=>`<polygon points='14,13 26,25 38,25 50,13 48,36 32,52 16,36' fill='#fff'/><circle cx='25.5' cy='35' r='2.6' fill='${c}'/><circle cx='38.5' cy='35' r='2.6' fill='${c}'/><circle cx='32' cy='46' r='2.4' fill='${c}'/>`,
  osprey:c=>`<path d='M14 46Q32 34 52 47Q34 55 14 46Z' fill='#fff'/><circle cx='30' cy='29' r='13' fill='#fff'/><polygon points='18,21 9,15 21,17' fill='#fff'/><polygon points='41,25 54,31 41,35' fill='#FFC94A'/><circle cx='34' cy='26' r='2.6' fill='${c}'/>`,
  deer:c=>`<path d='M26 25L21 11M22.5 17L15 13M38 25L43 11M41.5 17L49 13' stroke='#fff' stroke-width='3.2' stroke-linecap='round' fill='none'/><ellipse cx='20' cy='31' rx='6.5' ry='3.2' fill='#fff' transform='rotate(-20 20 31)'/><ellipse cx='44' cy='31' rx='6.5' ry='3.2' fill='#fff' transform='rotate(20 44 31)'/><ellipse cx='32' cy='38' rx='10.5' ry='14' fill='#fff'/><circle cx='28' cy='35' r='2.2' fill='${c}'/><circle cx='36' cy='35' r='2.2' fill='${c}'/><ellipse cx='32' cy='47' rx='3' ry='2.2' fill='${c}'/>`,
  owl:c=>`<polygon points='16,24 19,10 27,20' fill='#fff'/><polygon points='48,24 45,10 37,20' fill='#fff'/><ellipse cx='32' cy='35' rx='17' ry='18' fill='#fff'/><circle cx='25.5' cy='32' r='6.5' fill='${c}'/><circle cx='38.5' cy='32' r='6.5' fill='${c}'/><circle cx='25.5' cy='32' r='2.6' fill='#fff'/><circle cx='38.5' cy='32' r='2.6' fill='#fff'/><polygon points='29.5,39 34.5,39 32,44' fill='${c}'/>`,
  bear:c=>`<circle cx='20' cy='22' r='7' fill='#fff'/><circle cx='44' cy='22' r='7' fill='#fff'/><circle cx='20' cy='22' r='3.2' fill='${c}'/><circle cx='44' cy='22' r='3.2' fill='${c}'/><circle cx='32' cy='36' r='16' fill='#fff'/><circle cx='26.5' cy='33' r='2.3' fill='${c}'/><circle cx='37.5' cy='33' r='2.3' fill='${c}'/><ellipse cx='32' cy='41' rx='3.4' ry='2.5' fill='${c}'/>`,
  turtle:c=>`<circle cx='50' cy='33' r='5.5' fill='#fff'/><ellipse cx='19' cy='45' rx='4.5' ry='3' fill='#fff'/><ellipse cx='43' cy='45' rx='4.5' ry='3' fill='#fff'/><ellipse cx='19' cy='26' rx='4.5' ry='3' fill='#fff'/><ellipse cx='43' cy='26' rx='4.5' ry='3' fill='#fff'/><ellipse cx='31' cy='36' rx='16' ry='13' fill='#fff'/><path d='M31 25L37 30L35 38L27 38L25 30Z M31 25V23 M37 30L45 28 M35 38L40 46 M27 38L22 46 M25 30L17 28' stroke='${c}' stroke-width='1.8' fill='none' stroke-linejoin='round'/><circle cx='51.5' cy='31.5' r='1.3' fill='${c}'/>`,
  wolf:c=>`<polygon points='15,9 26,24 38,24 49,9 51,33 41,45 32,54 23,45 13,33' fill='#fff'/><polygon points='22,33 29,31 28,35' fill='${c}'/><polygon points='42,33 35,31 36,35' fill='${c}'/><circle cx='32' cy='47' r='2.5' fill='${c}'/>`,
  rabbit:c=>`<ellipse cx='26' cy='17' rx='5' ry='13' fill='#fff'/><ellipse cx='38' cy='17' rx='5' ry='13' fill='#fff'/><ellipse cx='26' cy='18' rx='2' ry='9' fill='${c}'/><ellipse cx='38' cy='18' rx='2' ry='9' fill='${c}'/><circle cx='32' cy='40' r='14' fill='#fff'/><circle cx='27' cy='38' r='2.1' fill='${c}'/><circle cx='37' cy='38' r='2.1' fill='${c}'/><circle cx='32' cy='44' r='1.9' fill='${c}'/>`,
};
const TEAM_META={
  A:{name:'あかつきフォクシーズ',color:'#E8632B',animal:'fox'},
  B:{name:'しおかぜオスプレイズ',color:'#2F6FD6',animal:'osprey'},
  C:{name:'もりのディアーズ',color:'#2E9B5E',animal:'deer'},
  D:{name:'ほしぞらオウルズ',color:'#6B4FC8',animal:'owl'},
  E:{name:'いわおベアーズ',color:'#8B5A3C',animal:'bear'},
  F:{name:'はやせタートルズ',color:'#1597BB',animal:'turtle'},
  G:{name:'こがねウルブズ',color:'#56607A',animal:'wolf'},
  H:{name:'たかねラビッツ',color:'#D6457A',animal:'rabbit'},
};
// エンブレム（64×64）。x,y,size を渡すと別の SVG の中に入れ子で置ける
const emblemSVG=(id,x=0,y=0,size=64,ring=0)=>{const m=TEAM_META[id];return `<svg x='${x}' y='${y}' width='${size}' height='${size}' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'>${ring?`<circle cx='32' cy='32' r='32' fill='#fff'/>`:''}<circle cx='32' cy='32' r='${ring?28.5:32}' fill='${m.color}'/><circle cx='32' cy='32' r='${ring?25.5:29}' fill='none' stroke='rgba(255,255,255,.35)' stroke-width='1.5'/>${ANIMAL[m.animal](m.color)}</svg>`};
const teamName=id=>TEAM_META[id].name;
/* ===== チームオリジナルの応援コンテンツ（デモ用に SVG をその場で描く。実在の選手・図柄ではない） ===== */
const svgURI=svg=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
const JA="font-family='Hiragino Sans,Noto Sans JP,sans-serif' font-weight='900'";
const GRAD="<defs><linearGradient id='h' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FF8A1F'/><stop offset='.5' stop-color='#FD434E'/><stop offset='1' stop-color='#F2186C'/></linearGradient></defs>";
const emblem=(id,x,y,r=20)=>emblemSVG(id,x-r-2,y-r-2,(r+2)*2,1);
const TEAM_STAMPS=[
  {key:'nice',name:'ナイス！',price:300,draw:id=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>${GRAD}<path d='M18 26h124a12 12 0 0 1 12 12v66a12 12 0 0 1-12 12H70l-30 26 6-26H18A12 12 0 0 1 6 104V38a12 12 0 0 1 12-12z' fill='#fff' stroke='url(#h)' stroke-width='8' stroke-linejoin='round'/><text x='80' y='84' text-anchor='middle' ${JA} font-size='34' fill='url(#h)'>ナイス！</text>${emblem(id,136,128)}</svg>`},
  {key:'win',name:'勝つぞ！',price:800,draw:id=>{const pts=[...Array(24)].map((_,i)=>{const a=Math.PI*2*i/24,r=i%2?58:76;return `${80+Math.cos(a)*r},${78+Math.sin(a)*r}`}).join(' ');return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>${GRAD}<polygon points='${pts}' fill='url(#h)'/><text x='80' y='90' text-anchor='middle' ${JA} font-size='25' fill='#fff' transform='rotate(-8 80 80)'>勝つぞ！</text>${emblem(id,132,130)}</svg>`}},
  {key:'thx',name:'ありがとう',price:1500,draw:id=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>${GRAD}<circle cx='80' cy='78' r='64' fill='url(#h)'/><circle cx='80' cy='78' r='52' fill='#0B1530'/><text x='80' y='70' text-anchor='middle' ${JA} font-size='17' fill='#fff'>応援</text><text x='80' y='96' text-anchor='middle' ${JA} font-size='17' fill='#fff'>ありがとう</text>${emblem(id,128,132)}</svg>`},
];
const CARDS=[{no:10,limited:false,price:1000},{no:18,limited:false,price:1000},{no:7,limited:true,price:3000}];
const cardSVG=(id,c)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 280'>${GRAD}<linearGradient id='n' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#24345E'/><stop offset='1' stop-color='#0B1530'/></linearGradient>
  <rect x='4' y='4' width='192' height='272' rx='16' fill='${c.limited?'url(#h)':'#0B1530'}'/>
  <rect x='14' y='14' width='172' height='196' rx='10' fill='url(#n)'/>
  <circle cx='100' cy='108' r='34' fill='rgba(255,255,255,.22)'/><path d='M40 210c4-44 30-62 60-62s56 18 60 62z' fill='rgba(255,255,255,.22)'/>
  <text x='26' y='70' font-family='Barlow Condensed,Arial Narrow,sans-serif' font-style='italic' font-weight='800' font-size='58' fill='#fff'>${c.no}</text>
  ${c.limited?`<rect x='112' y='24' width='66' height='22' rx='11' fill='#fff'/><text x='145' y='40' text-anchor='middle' font-family='Arial,sans-serif' font-weight='800' font-size='12' fill='#C4124F'>LIMITED</text>`:''}
  ${emblemSVG(id,20,222,30,1)}<text x='58' y='242' ${JA} font-size='13' fill='#fff'>${teamName(id)}</text>
  <text x='58' y='262' font-family='Arial,sans-serif' font-weight='800' font-size='10' letter-spacing='3' fill='rgba(255,255,255,.75)'>PLAYER CARD #${c.no}</text>
  </svg>`;
/* AI で生成したチームオリジナル（あかつき＝A・ほしぞら＝D）。それ以外のチームは SVG の仮の絵のまま
   選手カードは顔が影になっている あかつき だけを公開デモで使う（ほしぞらのカードは顔が描き込まれているため載せない） */
const TEAM_IMG={A:{nice:'img/team/a_nice.png',win:'img/team/a_win.png',thx:'img/team/a_thx.png'},D:{nice:'img/team/d_nice.png',win:'img/team/d_win.png',thx:'img/team/d_thx.png'}};
const CARD_IMG={A:{10:'img/team/a_card10.jpg',18:'img/team/a_card18.jpg',7:'img/team/a_card7.jpg'}};
