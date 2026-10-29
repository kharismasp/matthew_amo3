/* Phase 4 final QA patch: geometry reliability, localization, responsive polish. */

// Preserve canonical time metadata while localizing the student-visible abbreviation.
bank.forEach(p=>{ if(!p._timeEn) p._timeEn=p.time; });
function p4TimeLabel(v){
  const raw=String(v||'');
  return state.lang==='id' ? raw.replace(/\bmin\b/g,'menit') : raw.replace(/\bmenit\b/g,'min');
}

// ---------- Geometry reliability repairs ----------

// Exact-ratio schematic for the overlap-perimeter family. Individual rectangles use 10:6 proportions.
perimeterOverlapSVG=function(){
  const note=state.lang==='en'?'schematic · overlap dimensions unknown':'skema · ukuran tumpang tindih belum diketahui';
  return `<svg viewBox="0 0 620 320" role="img" aria-label="${state.lang==='en'?'Two 10 by 6 rectangles overlap in an unknown rectangular region. The drawing is schematic and does not reveal the overlap dimensions.':'Dua persegi panjang 10 kali 6 saling bertumpuk pada daerah persegi panjang yang ukurannya belum diketahui. Gambar bersifat skematis dan tidak membocorkan ukuran tumpang tindih.'}">
    <rect x="70" y="105" width="280" height="168" fill="#e9f6fa" stroke="#31596b" stroke-width="3"/>
    <rect x="255" y="40" width="168" height="280" fill="#f1ebfb" fill-opacity=".86" stroke="#6d49a8" stroke-width="3"/>
    <rect x="255" y="105" width="95" height="168" fill="#fff0ce"/>
    <text x="120" y="92" class="given">10 × 6</text>
    <text x="372" y="32" text-anchor="middle" class="given">6 × 10</text>
    <text x="302" y="193" text-anchor="middle" class="target">${state.lang==='en'?'overlap ?':'tumpang tindih ?'}</text>
    <text x="310" y="307" text-anchor="middle" class="muted">${note}</text>
  </svg>`;
};

// Four right triangles rendered at one common scale: 4-unit horizontal leg = 104 px, heights 1/2/3/4 units.
trianglePackSVG=function(){
  const xs=[38,190,342,494], base=104, unit=26, y=220;
  return `<svg viewBox="0 0 650 270" role="img" aria-label="${state.lang==='en'?'Four separate right triangles drawn to one common scale, with legs 1 by 4, 2 by 4, 3 by 4, and 4 by 4. No containing rectangle is shown.':'Empat segitiga siku-siku terpisah digambar dengan satu skala yang sama, dengan kaki 1 kali 4, 2 kali 4, 3 kali 4, dan 4 kali 4. Persegi panjang pembungkus belum ditampilkan.'}">
  ${[1,2,3,4].map((h,i)=>`<polygon points="${xs[i]},${y} ${xs[i]+base},${y} ${xs[i]},${y-h*unit}" fill="#e9f6fa" stroke="#31596b" stroke-width="2.5"/><text x="${xs[i]+40}" y="248" class="given">${h} × 4</text>`).join('')}
  </svg>`;
};

function p4FoldMiniTriangle(x,idx,kind,punch=false){
  const top=[x+55,24], left=[x,118], right=[x+110,118], hy=72, mid=[x+55,118];
  let extras='';
  if(kind>=1) extras+=`<line x1="${x+20}" y1="${hy}" x2="${x+90}" y2="${hy}" stroke="#8a9aa2" stroke-width="1.8" stroke-dasharray="6 5"/>`;
  if(kind>=2) extras+=`<line x1="${x+20}" y1="${hy}" x2="${mid[0]}" y2="${mid[1]}" stroke="#8a9aa2" stroke-width="1.8" stroke-dasharray="6 5"/>`;
  if(kind>=3) extras+=`<line x1="${x+90}" y1="${hy}" x2="${mid[0]}" y2="${mid[1]}" stroke="#8a9aa2" stroke-width="1.8" stroke-dasharray="6 5"/>`;
  if(punch) extras+=`<circle cx="${x+37}" cy="${hy+7}" r="5.5" fill="white" stroke="#d9467d" stroke-width="3"/>`;
  return `<g><text x="${x+55}" y="14" text-anchor="middle" class="muted">${idx}</text><polygon points="${top[0]},${top[1]} ${left[0]},${left[1]} ${right[0]},${right[1]}" fill="#fbfcfd" stroke="#31596b" stroke-width="2.2"/>${extras}</g>`;
}
foldTriangleSVG=function(final=false){
  if(!final){
    return `<svg viewBox="0 0 520 155" role="img" aria-label="${state.lang==='en'?'Four-step triangular fold sequence. The final folded state contains one punch; the unfolded answer pattern is hidden.':'Urutan empat tahap lipatan segitiga. Keadaan terlipat terakhir memiliki satu lubang; pola setelah dibuka masih disembunyikan.'}">
      ${p4FoldMiniTriangle(8,1,1)}${p4FoldMiniTriangle(136,2,2)}${p4FoldMiniTriangle(264,3,3)}${p4FoldMiniTriangle(392,4,3,true)}
      <text x="429" y="144" text-anchor="middle" class="target">${state.lang==='en'?'PUNCH':'LUBANG'}</text>
    </svg>`;
  }
  // Schematic reconstruction of canonical source option D. All hole positions are inside the original triangle.
  return `<svg viewBox="0 0 500 330" role="img" aria-label="${state.lang==='en'?'Final unfolded source pattern: four hole positions inside the triangle, matching source option D.':'Pola sumber setelah dibuka: empat posisi lubang berada di dalam segitiga, sesuai opsi D pada sumber.'}">
    <polygon points="250,35 70,300 430,300" fill="#fbfcfd" stroke="#31596b" stroke-width="3"/>
    ${[[186,138],[199,163],[211,189],[340,246]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="white" stroke="#d9467d" stroke-width="4"/>`).join('')}
    <text x="250" y="323" text-anchor="middle" class="muted">${state.lang==='en'?'schematic source option D':'skema opsi D pada sumber'}</text>
  </svg>`;
};

// Isometric unit-cube renderer from one coordinate model. The arrangement, not an eyeballed 2D stack, drives the picture.
function p4IsoStack(coords,label){
  const sx=55, sy=28, sz=58, ox=305, oy=230;
  const P=(x,y,z)=>[ox+(x-y)*sx, oy+(x+y)*sy-z*sz];
  const face=(pts,fill)=>`<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="${fill}" stroke="#31596b" stroke-width="2"/>`;
  const cubes=[...coords].sort((a,b)=>(a[0]+a[1]+a[2])-(b[0]+b[1]+b[2]) || a[1]-b[1] || a[0]-b[0]);
  const shapes=cubes.map(([x,y,z])=>{
    const p000=P(x,y,z),p100=P(x+1,y,z),p010=P(x,y+1,z),p001=P(x,y,z+1),p101=P(x+1,y,z+1),p011=P(x,y+1,z+1),p110=P(x+1,y+1,z),p111=P(x+1,y+1,z+1);
    return face([p000,p100,p101,p001],'#dff1f4')+face([p000,p010,p011,p001],'#cfe6ec')+face([p001,p101,p111,p011],'#eef7f8');
  }).join('');
  return `<svg viewBox="0 0 620 330" role="img" aria-label="${label}">${shapes}<text x="310" y="310" text-anchor="middle" class="muted">${state.lang==='en'?'model generated from cube positions · contact count hidden':'model dibuat dari posisi kubus · jumlah kontak disembunyikan'}</text></svg>`;
}

cubeStackSVG=function(){
  return p4IsoStack([[0,0,0],[1,0,0],[2,0,0],[1,0,1],[1,1,0]], state.lang==='en'?'Five unit cubes: three in a row, one above the middle cube, and one directly behind the middle cube. Contact count is not shown.':'Lima kubus satuan: tiga berjajar, satu di atas kubus tengah, dan satu tepat di belakang kubus tengah. Jumlah kontak tidak ditampilkan.');
};
stack6SVG=function(kind){
  const coords=kind==='row' ? [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[1,0,1],[2,0,1]] : [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1]];
  const label=kind==='row'?(state.lang==='en'?'Six unit cubes: four in a row with one cube above each of the two middle cubes.':'Enam kubus satuan: empat berjajar dengan satu kubus di atas masing-masing dua kubus tengah.'):(state.lang==='en'?'Six unit cubes: a 2 by 2 base with one cube on top of each of two adjacent base cubes.':'Enam kubus satuan: dasar 2 kali 2 dengan satu kubus di atas masing-masing dua kubus dasar yang bersebelahan.');
  return p4IsoStack(coords,label);
};

trianglePositionsSVG=function(){
  const A=[310,42],B=[82,278],C=[538,278];
  const interp=(P,Q,t)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
  const pts=[];
  [[A,B],[A,C],[B,C]].forEach(([P,Q])=>{for(let i=0;i<=4;i++){const p=interp(P,Q,i/4);if(!pts.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<1))pts.push(p)}});
  return p3SvgWrap(`<polygon points="310,42 82,278 538,278" fill="none" stroke="#31596b" stroke-width="3"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#fff" stroke="#6d49a8" stroke-width="2"/>`).join('')}<text x="310" y="320" text-anchor="middle" class="muted">12 ${state.lang==='en'?'distinct perimeter positions':'posisi berbeda pada keliling'}</text>`,state.lang==='en'?'Triangle perimeter with exactly twelve distinct empty positions; no values are filled in.':'Keliling segitiga dengan tepat dua belas posisi kosong yang berbeda; tidak ada nilai yang diisikan.');
};

// Phase-3 visual dispatcher repairs: G4 must show all four GIVEN line sums.
const _p4ProblemVisualBase=problemVisual;
problemVisual=function(p){
  if(p.id==='G4') return `<div class="visual-stage">${frameSVG(true)}</div>`;
  return _p4ProblemVisualBase(p);
};

// ---------- Final localization / state polish ----------
const _p4RenderBase=render;
render=function(){
  bank.forEach(p=>{ p.time=p4TimeLabel(p._timeEn||p.time); });
  _p4RenderBase();
  document.querySelectorAll('.lang-btn,.level-btn').forEach(btn=>btn.setAttribute('aria-pressed',btn.classList.contains('active')?'true':'false'));
  const footer=document.querySelector('.site-footer span:first-child');
  if(footer) footer.textContent=state.lang==='id'?'AMO · Pelatih Strategi III':'AMO Strategy Trainer III';
  // Stretch is an optional fourth opportunity, not CORE. Do not leave CORE visually selected while Stretch is open.
  const isStretch=state.section===10 && state.practiceRoom==='S';
  document.querySelectorAll('.level-btn').forEach(btn=>{ if(isStretch){btn.classList.remove('active');btn.setAttribute('aria-pressed','false')} });
  const actions=document.querySelector('.topbar-actions');
  let chip=document.getElementById('stretchIndicator');
  if(isStretch){
    if(!chip){chip=document.createElement('span');chip.id='stretchIndicator';chip.className='stretch-indicator';actions?.insertBefore(chip,document.getElementById('teacherPassBtn'));}
    chip.textContent=state.lang==='id'?'PENGAYAAN':'STRETCH';
  } else if(chip) chip.remove();
  // Natural Indonesian course naming in the lesson map.
  if(state.lang==='id' && state.section===0){
    document.querySelectorAll('.panel.gold p').forEach(p=>{p.textContent=p.textContent.replace(/^Trainer III\b/,'Pelatih Strategi III')});
  }
};

render();
