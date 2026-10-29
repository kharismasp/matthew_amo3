/* Visual repair: geometry is generated from the givens, rather than guessed outlines. */
const vrL=(en,id)=>state.lang==='id'?id:en;
const vrText=(x,y,s,cls='given',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(String(s))}</text>`;
const vrLine=(a,b,color='#31596b',dash='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="2" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const vrPoly=(pts,fill='#e9f6fa',stroke='#31596b')=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
const vrSVG=(body,alt,w=620,h=360)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(alt)}">${body}</svg>`;
const vrStage=s=>`<div class="visual-stage">${s}</div>`;
function vrDim(a,b,label,offset=0){const A=[a[0],a[1]+offset],B=[b[0],b[1]+offset];return vrLine(A,B,'#8aa0aa')+vrLine([A[0],A[1]-4],[A[0],A[1]+4],'#8aa0aa')+vrLine([B[0],B[1]-4],[B[0],B[1]+4],'#8aa0aa')+vrText((A[0]+B[0])/2,(A[1]+B[1])/2-8,label)}

// Angle geometry: P,R,B are collinear; Q,R,C are collinear; A,B,C are collinear.
function vrAngle(c=24,reveal=false){
 const theta=c*Math.PI/180,alpha=2*theta;
 const P=[75,215],R=[415,215],Q=[245,215-170*Math.tan(alpha)];
 const RC=118,C=[R[0]+RC*Math.cos(alpha),R[1]+RC*Math.sin(alpha)],B=[R[0]-RC,215];
 const u=[Q[0]-P[0],Q[1]-P[1]],v=[C[0]-B[0],C[1]-B[1]];
 const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];const BP=[B[0]-P[0],B[1]-P[1]],t=cross(BP,v)/cross(u,v);const A=[P[0]+t*u[0],P[1]+t*u[1]];
 const fit=Math.min(1,220/(C[1]-Q[1])),shift=62-Q[1]*fit;for(const p of [P,Q,R,C,B,A]){p[0]=310+(p[0]-310)*fit;p[1]=p[1]*fit+shift;}
 const tick=(a,b,color,n=1)=>{const m=[(a[0]+b[0])/2,(a[1]+b[1])/2],d=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/d,ny=(b[0]-a[0])/d;return Array.from({length:n},(_,i)=>{let shift=(i-(n-1)/2)*6;return vrLine([m[0]+shift*(b[0]-a[0])/d+nx*7,m[1]+shift*(b[1]-a[1])/d+ny*7],[m[0]+shift*(b[0]-a[0])/d-nx*7,m[1]+shift*(b[1]-a[1])/d-ny*7],color)}).join('')};
 let body=vrPoly([P,Q,R],'#f7fbfc')+vrLine(R,C)+vrLine(A,C,'#278a93')+tick(P,Q,'#6d49a8')+tick(Q,R,'#6d49a8')+tick(B,R,'#d97706',2)+tick(R,C,'#d97706',2);
 body+=vrText(P[0]-15,P[1]+20,'P')+vrText(Q[0],Q[1]-17,'Q')+vrText(R[0]+15,R[1]-8,'R')+vrText(B[0]-6,B[1]+24,'B')+vrText(A[0]-18,A[1],'A')+vrText(C[0]+17,C[1]+12,'C');
 const ang1=Math.atan2(R[1]-C[1],R[0]-C[0]),ang2=Math.atan2(B[1]-C[1],B[0]-C[0]);const arcP=a=>[C[0]+34*Math.cos(a),C[1]+34*Math.sin(a)];let e=arcP(ang1),f=arcP(ang2);body+=`<path d="M${e} A34 34 0 0 0 ${f}" fill="none" stroke="#d9467d" stroke-width="2"/>`+vrText(C[0]-51,C[1]-18,`${c}°`);
 body+=vrText(310,338,'PQ = QR     ·     BR = RC','muted');
 if(reveal)body+=vrText(B[0]+41,B[1]+28,`${c}°`,'derived')+vrText(R[0]-48,R[1]-15,`${2*c}°`,'derived')+vrText(Q[0],Q[1]+45,`${180-4*c}°`,'derived');
 return vrSVG(body,vrL(`Angle configuration with C=${c} degrees; all incidences and equal-side marks are exact.`,`Konfigurasi sudut C=${c} derajat; titik, garis, dan tanda sisi sama sesuai geometri.`));
}
angleSVG=()=>vrAngle(24,state.angleStep>0);
angleNeutralSVG=()=>vrAngle(24,false);
angleChainSVG=c=>vrStage(vrAngle(c,false));

// True square cells, including corner and source-position shading.
p3Grid=function(cols,rows,shade=null,point=null){
 const cell=Math.min(390/cols,252/rows),w=cols*cell,h=rows*cell,x=(620-w)/2,y=45;let s='';
 if(shade)s+=`<rect x="${x+shade.c*cell}" y="${y+shade.r*cell}" width="${cell}" height="${cell}" fill="#f1d5df"/>`;
 for(let i=0;i<=cols;i++)s+=vrLine([x+i*cell,y],[x+i*cell,y+h],'#78909a');
 for(let j=0;j<=rows;j++)s+=vrLine([x,y+j*cell],[x+w,y+j*cell],'#78909a');
 if(point){const a=[x+point.c*cell,y+point.r*cell];s+=`<circle cx="${a[0]}" cy="${a[1]}" r="7" fill="#fff" stroke="#d9467d" stroke-width="3"/>`+vrText(a[0]+14,a[1]-12,vrL('avoid','hindari'),'target','start')}
 if(point||cols!==rows){s+=vrText(x,y+h+27,vrL('START','MULAI'))+vrText(x+w,y-16,vrL('END','AKHIR'))}
 return vrSVG(s,vrL(`${cols} by ${rows} grid with square cells.`, `Kisi ${cols} kali ${rows} dengan sel persegi.`));
};
gridSVG=(n=3,shaded=false)=>p3Grid(n,n,shaded?{c:Math.floor(n/2),r:Math.floor(n/2)}:null);

// Lattice points are explicit, rather than confusing cells with points.
latticeSVG=function(){const x=190,y=65,d=110;let b='';for(let i=0;i<3;i++)b+=vrLine([x+i*d,y],[x+i*d,y+2*d],'#78909a')+vrLine([x,y+i*d],[x+2*d,y+i*d],'#78909a');for(let i=0;i<3;i++)for(let j=0;j<3;j++)b+=`<circle cx="${x+i*d}" cy="${y+j*d}" r="5" fill="#31596b"/>`;return vrSVG(b+vrText(x,y+2*d+30,vrL('START','MULAI'))+vrText(x+2*d,y-18,vrL('END','AKHIR')),vrL('3 by 3 points: two moves in each direction.','3 kali 3 titik: dua langkah untuk tiap arah.'))};
nestedSquareSVG=function(a,b){const side=246,inner=side*b/a,x=187,y=57,d=(side-inner)/2;return vrSVG(`<rect x="${x}" y="${y}" width="${side}" height="${side}" fill="#fff0ce" stroke="#31596b" stroke-width="2"/><rect x="${x+d}" y="${y+d}" width="${inner}" height="${inner}" fill="#fff" stroke="#6d49a8" stroke-width="2"/>`+vrText(310,37,`${a} × ${a}`)+vrText(310,186,`${b} × ${b}`),vrL('Centered squares drawn at their stated side-length ratio.','Persegi sepusat sesuai perbandingan panjang sisinya.'))};
coordinateReflectSVG=function(){let s='',u=26,x=145,y=304;for(let i=0;i<=10;i++)s+=vrLine([x+i*u,44],[x+i*u,y],'#dce5e8')+vrLine([x,y-i*u],[x+260,y-i*u],'#dce5e8')+vrText(x+i*u,y+22,i,'muted')+(i?vrText(x-16,y-i*u+4,i,'muted'):'');s+=vrLine([x,44],[x,y])+vrLine([x,y],[x+260,y])+vrLine([x+5*u,44],[x+5*u,y],'#d9467d','7 5')+vrText(x+5*u,27,'x = 5','target');const ps=[[1,1],[2,4],[4,2]].map(([a,b])=>[x+a*u,y-b*u]);s+=vrPoly(ps)+vrText(ps[0][0]-14,ps[0][1]+5,'A')+vrText(ps[1][0],ps[1][1]-13,'B')+vrText(ps[2][0]+14,ps[2][1]+5,'C')+vrText(x+277,y+5,'x')+vrText(x-2,30,'y');return vrSVG(s,vrL('Equal-scale coordinate axes; A(1,1), B(2,4), C(4,2), mirror x=5.','Sumbu koordinat berskala sama; A(1,1), B(2,4), C(4,2), cermin x=5.'))};

cubePathSVG=function(){const P=([x,y,z])=>[310+95*(x-y),156+55*(x+y)-110*z];let b='';for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let z=0;z<2;z++){let a=[x,y,z];for(let i=0;i<3;i++)if(a[i]===0){let q=[...a];q[i]=1;b+=vrLine(P(a),P(q),'#31596b',x+y+z===0?'6 5':'')}}const start=P([1,1,0]),end=P([0,0,1]);for(const [p,col] of [[start,'#278a93'],[end,'#d9467d']])b+=`<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${col}"/>`;return vrSVG(b+vrText(start[0],start[1]+29,vrL('START','MULAI'))+vrText(end[0],end[1]-18,vrL('OPPOSITE','BERSEBERANGAN')),vrL('Isometric cube with 12 edges; start and opposite vertices marked.','Kubus isometrik dengan 12 rusuk; titik awal dan titik berseberangan ditandai.'))};

// Rectangular unions use the actual given common height and lengths.
function vrAlignedOverlap(h,len,union){const scale=450/union,x=85,y=95,H=h*scale,over=2*len-union,x2=x+(union-len)*scale;return vrSVG(`<rect x="${x}" y="${y}" width="${len*scale}" height="${H}" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/><rect x="${x2}" y="${y}" width="${len*scale}" height="${H}" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/><rect x="${x2}" y="${y}" width="${over*scale}" height="${H}" fill="#fff0ce" stroke="#b38930"/>`+vrDim([x,y-14],[x+len*scale,y-14],`${h} × ${len}`)+vrDim([x2,y-42],[x2+len*scale,y-42],`${h} × ${len}`)+vrText(310,y+H/2+6,'?','target')+vrText(310,y+H+37,vrL(`Union: ${h} × ${union}`,`Gabungan: ${h} × ${union}`)),vrL('Two same-height rectangles; unknown shared region highlighted.','Dua persegi panjang sama tinggi; daerah bersama yang ditanyakan ditandai.'))}
simpleOverlapVisual=function(id){if(id==='B2')return vrAlignedOverlap(13,17,31);if(id==='B4')return vrSVG(`<rect x="110" y="100" width="250" height="100" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/><rect x="260" y="100" width="250" height="100" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/><rect x="260" y="100" width="100" height="100" fill="#fff0ce" stroke="#b38930"/>`+vrText(310,155,'4 cm²')+vrText(310,247,vrL('Non-overlapping parts together: 12 cm²','Jumlah kedua daerah tanpa tumpang tindih: 12 cm²')),vrL('Identical cards with a square overlap.','Kartu identik dengan tumpang tindih berbentuk persegi.'));return overlapNeutralSVG()};
perimeterOverlapSVG=function(){return vrSVG(`<rect x="105" y="120" width="280" height="168" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/><rect x="245" y="55" width="280" height="168" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/><rect x="245" y="120" width="140" height="103" fill="#fff0ce" stroke="#b38930"/>`+vrText(155,106,'10 × 6')+vrText(435,40,'10 × 6')+vrText(315,180,'?','target')+vrText(310,330,vrL('Schematic · overlap dimensions unknown','Skema · ukuran tumpang tindih belum diketahui'),'muted'),vrL('Two 10 by 6 rectangles, offset in both directions; union has eight sides.','Dua persegi panjang 10 kali 6 bergeser horizontal dan vertikal; gabungan memiliki delapan sisi.'))};
function vrAreaOverlap(a,b,note,known=false){const scale=3,x=85,y=95,H=120,W1=a*scale,W2=b*scale;const overlap=known?12*scale:48,x2=x+W1-overlap;return vrSVG(`<rect x="${x}" y="${y}" width="${W1}" height="${H}" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/><rect x="${x2}" y="${y}" width="${W2}" height="${H}" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/><rect x="${x2}" y="${y}" width="${overlap}" height="${H}" fill="#fff0ce" stroke="#b38930"/>`+vrText(x+W1/2,75,`${a} cm²`)+vrText(x2+W2/2,49,`${b} cm²`)+vrText(x2+overlap/2,165,known?'12':'?','target')+vrText(310,268,note)+vrText(310,306,vrL('Schematic · only areas are given','Skema · hanya luas yang diketahui'),'muted'),vrL('Overlapping rectangles labelled with given areas.','Persegi panjang bertumpuk dengan label luas yang diketahui.'))}
photoSVG=function(){return vrSVG(`<rect x="55" y="160" width="144" height="96" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/><rect x="270" y="64" width="288" height="192" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/>`+vrText(127,145,'6')+vrText(35,213,'4')+vrText(414,48,'12')+vrText(578,165,'p','target')+vrText(310,313,vrL('Corresponding sides · same shape','Sisi bersesuaian · bentuk tetap'),'muted'),vrL('6 by 4 photo enlarged to length 12 with its aspect ratio preserved.','Foto 6 kali 4 diperbesar menjadi panjang 12 dengan rasio tetap.'))};
triangleSidesSVG=function(){return vrSVG(vrPoly([[105,266],[490,266],[490,134]])+vrText(297,294,'35')+vrText(516,204,'12')+vrText(285,181,'37'),vrL('Triangle drawn to side ratio 12:35:37; no right-angle answer mark.','Segitiga sesuai rasio sisi 12:35:37; tanpa tanda jawaban siku-siku.'))};
frameSVG=function(full=false){let b='';for(let r=0;r<3;r++)for(let c=0;c<3;c++)if(r!==1||c!==1)b+=`<rect x="${205+c*70}" y="${65+r*70}" width="70" height="70" fill="#fff" stroke="#31596b" stroke-width="2"/>`;['A','B','C','D'].forEach((v,i)=>b+=vrText(i%2?380:240,i<2?109:249,v,'target'));b+=vrText(310,43,vrL('Top = 9','Atas = 9'))+vrText(310,309,vrL('Bottom = 21','Bawah = 21'))+vrText(185,177,vrL('Left = 13','Kiri = 13'),'given','end')+vrText(435,177,vrL('Right = 15','Kanan = 15'),'given','start');return vrSVG(b,vrL('Eight separate frame cells; center missing; four given line sums.','Delapan sel bingkai terpisah; tengah kosong; empat jumlah garis diberikan.'))};

// Voxel renderer: exterior +x,+y,+z faces only, painter order from depth.
function vrVoxel(coords,label,mark=null){
 const occupied=new Set(coords.map(p=>p.join(','))),faces=[];const P=([x,y,z])=>[(x-y)*34,(x+y)*19.63-z*39.26];
 for(const [x,y,z] of coords){const test=(dx,dy,dz)=>!occupied.has([x+dx,y+dy,z+dz].join(','));const colored=mark&&mark(x,y,z);const add=(pts,col)=>faces.push({pts,fill:colored?'#f1b5cd':col,depth:pts.reduce((s,p)=>s+p[0]+p[1]+p[2],0)/4});
 if(test(1,0,0))add([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],'#d7e9ef');
 if(test(0,1,0))add([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'#b9d7e2');
 if(test(0,0,1))add([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'#eff8fa');
 }
 const all=faces.flatMap(f=>f.pts.map(P)),minX=Math.min(...all.map(p=>p[0])),maxX=Math.max(...all.map(p=>p[0])),minY=Math.min(...all.map(p=>p[1])),maxY=Math.max(...all.map(p=>p[1]));const scale=Math.min(470/(maxX-minX),245/(maxY-minY));const project=p=>{const [a,b]=P(p);return [310+(a-(minX+maxX)/2)*scale,160+(b-(minY+maxY)/2)*scale]};
 return vrSVG(faces.sort((a,b)=>a.depth-b.depth).map(f=>vrPoly(f.pts.map(project),f.fill)).join('')+vrText(310,330,label,'muted'),label);
}
p4IsoStack=(coords,label)=>vrVoxel(coords,vrL('Unit cubes · count all contacts, including hidden ones','Kubus satuan · hitung semua kontak, termasuk yang tersembunyi'));
// +y is towards the camera; the extra cube is at y=0, behind the middle at y=1.
cubeStackSVG=()=>vrVoxel([[0,1,0],[1,1,0],[2,1,0],[1,1,1],[1,0,0]],vrL('3 in a row · 1 above the middle · 1 behind the middle','3 berjajar · 1 di atas tengah · 1 di belakang tengah'));
stack6SVG=kind=>vrVoxel(kind==='row'?[[0,0,0],[1,0,0],[2,0,0],[3,0,0],[1,0,1],[2,0,1]]:[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1]],kind==='row'?vrL('4 in a row · 1 above each middle cube','4 berjajar · 1 di atas masing-masing kubus tengah'):vrL('2 × 2 base · 2 adjacent cubes on top','Dasar 2 × 2 · 2 kubus bersebelahan di atas'));
function vrBlock(n,remove){let c=[];for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++)if(!remove(x,y,z))c.push([x,y,z]);return c}
cornerCubeDiagramSVG=()=>vrVoxel(vrBlock(4,(x,y,z)=>x===3&&y===3&&z===3),vrL('4 × 4 × 4 · one corner unit removed','4 × 4 × 4 · satu kubus sudut diambil'));
faceCenterSVG=()=>vrVoxel(vrBlock(3,(x,y,z)=>x===1&&y===2&&z===1),vrL('3 × 3 × 3 · center unit of the front face removed','3 × 3 × 3 · kubus tengah sisi depan diambil'));
faceLedgerSVG=()=>vrVoxel(vrBlock(5,(x,y,z)=>(x<3&&y<2&&z===4)||(y===4&&z===0)),vrL('Compatible model · cuts: 3 × 2 × 1 and 5 × 1 × 1','Model sesuai deskripsi · potongan: 3 × 2 × 1 dan 5 × 1 × 1'));

// Cuboid illustrations use three projected faces, never flat rectangles masquerading as solids.
function vrCuboid(x,y,w,d,h,fill='#e9f6fa'){const dx=d*.65,dy=-d*.38;return vrPoly([[x,y],[x+w,y],[x+w,y-h],[x,y-h]],fill)+vrPoly([[x+w,y],[x+w+dx,y+dy],[x+w+dx,y-h+dy],[x+w,y-h]],'#b9d7e2')+vrPoly([[x,y-h],[x+w,y-h],[x+w+dx,y-h+dy],[x+dx,y-h+dy]],'#eff8fa')}
function vrReshape(label){return vrSVG(vrCuboid(60,225,210,95,80)+vrText(180,100,label)+vrText(350,188,'→','derived')+vrCuboid(420,225,90,90,90,'#f1ebfb')+vrText(475,281,'s = ?','target')+vrText(310,331,vrL('Same material · same volume','Bahan tetap · volume tetap'),'muted'),vrL(`Cuboid ${label} reshaped into a cube with unknown edge.`,`Balok ${label} dibentuk ulang menjadi kubus dengan rusuk belum diketahui.`))}
steelReshapeSVG=()=>vrReshape('270 × 100 × 64');reshapeVolumeSVG=()=>vrReshape('40 × 25 × 8');reshapeP3SVG=label=>vrReshape(label);
function vrGlue(a){let s=vrCuboid(105,239,160,160,65)+vrCuboid(265,239,160,160,65,'#f1ebfb');s+=vrLine([265,239],[265,174],'#d9467d','6 4')+vrLine([265,174],[369,113],'#d9467d','6 4')+vrText(175,82,`${a} × ${a} × 2`)+vrText(420,82,`${a} × ${a} × 2`)+vrText(310,305,vrL(`Shared face: ${a} × 2`,`Bidang kontak: ${a} × 2`),'target');return vrSVG(s,vrL('Two bricks touching along a full side face; contact edges marked pink.','Dua balok menempel pada satu sisi penuh; rusuk kontak berwarna merah muda.'))}
gluedBricksSVG=()=>vrGlue(6);glue442SVG=()=>vrGlue(4);
cubeRearrangeNeutralSVG=()=>vrSVG(vrCuboid(60,230,110,110,110)+vrText(140,310,'4 × 4 × 4')+vrText(295,180,'→','derived')+vrCuboid(365,150,105,105,52.5)+vrCuboid(365,270,105,105,52.5,'#f1ebfb')+vrText(540,160,'4 × 4 × 2')+vrText(540,278,'4 × 4 × 2'),vrL('A cube split into two identical half-height cuboids.','Kubus dipotong menjadi dua balok setengah tinggi yang identik.'));
reconstructDimsSVG=()=>vrSVG(vrCuboid(85,230,130,130,65)+vrCuboid(365,230,130,130,65,'#f1ebfb')+vrText(175,105,'4 × 4 × 2')+vrText(455,105,'4 × 4 × 2')+vrText(310,310,vrL('Join along a 4 × 2 face · final dimensions?','Gabungkan pada sisi 4 × 2 · ukuran akhir?'),'target'),vrL('Two congruent half-cubes, final dimensions unknown.','Dua setengah kubus kongruen, ukuran akhir belum diketahui.'));
reconstructVisual=()=>vrSVG(state.reconstructStep?vrCuboid(110,250,290,145,72.5)+vrText(310,310,'8 × 4 × 2'):vrCuboid(100,250,135,135,67.5)+vrCuboid(360,250,135,135,67.5,'#f1ebfb')+vrText(310,310,'4 × 4 × 2  +  4 × 4 × 2'),vrL('Rearranging the same two half-cube pieces.','Menyusun ulang dua bagian setengah kubus yang sama.'));

tilesSVG=function(big){const wide=big.startsWith('24'),fw=wide?250:225,fh=wide?150:150;return vrSVG(`<rect x="45" y="95" width="${fw}" height="${fh}" fill="#fff" stroke="#31596b" stroke-width="2"/>`+vrText(45+fw/2,74,big)+`<rect x="355" y="110" width="62" height="62" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/>`+vrPoly([[475,110],[506,110],[506,172],[537,172],[537,203],[475,203]],'#fff0ce','#8b6508')+vrText(386,225,'2 × 2')+vrText(505,247,vrL('L tile','Ubin L'))+vrText(445,295,vrL('Each tile: 4 m²','Setiap ubin: 4 m²')),vrL('Floor in its given ratio; both square and L tile are shown at the same scale.','Lantai sesuai rasio; ubin persegi dan L ditampilkan pada skala sama.'))};
twoFoldSquareSVG=function(){let b=`<rect x="65" y="70" width="150" height="150" fill="#fff" stroke="#31596b" stroke-width="2"/>`+vrLine([140,70],[140,220],'#8aa0aa','6 4')+vrText(140,260,vrL('1 · fold vertically','1 · lipat vertikal'),'muted')+vrText(248,150,'→','derived')+`<rect x="280" y="70" width="75" height="150" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/>`+vrLine([280,145],[355,145],'#8aa0aa','6 4')+vrText(317,286,vrL('2 · fold horizontally','2 · lipat horizontal'),'muted')+vrText(397,150,'→','derived')+`<rect x="445" y="145" width="75" height="75" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/><circle cx="492" cy="192" r="6" fill="#fff" stroke="#d9467d" stroke-width="3"/>`+vrText(482,260,vrL('3 · punch','3 · lubangi'),'muted');return vrSVG(b,vrL('Square, vertical half, horizontal quarter, then punch away from fold edges.','Persegi, setengah vertikal, seperempat horizontal, lalu lubang jauh dari tepi lipatan.'))};

// The supplied archive contains no source folding diagram or answer-option images.
// Do not invent a fold sequence or a pattern and claim it reproduces option D.
function vrMissingFold(){return `<div class="source-figure-note"><strong>${vrL('Original fold diagram needed','Diagram lipatan asli diperlukan')}</strong><p>${vrL('The source fold sequence and answer options are not included in this package. The previous sketch did not define valid folds, so it cannot determine the hole pattern.','Urutan lipatan dan pilihan jawaban sumber tidak disertakan dalam paket ini. Sketsa sebelumnya tidak mendefinisikan lipatan yang valid, sehingga pola lubangnya tidak dapat ditentukan.')}</p></div>`}
foldTriangleSVG=()=>vrMissingFold();
const vrSymBase=renderSymmetry;
renderSymmetry=function(){let html=vrSymBase();return html.replace(/<div class="prediction-lock">[\s\S]*?<div class="focus-panel formal">/,`<div class="prediction-lock"><strong>${vrL('Practice a fully specified fold sequence below.','Latih urutan lipatan yang jelas di bawah ini.')}</strong>${twoFoldSquareSVG()}</div></div><div class="focus-panel formal">`)};

// A row of four cubes and two touching cubes above has SIX, not five, contacts.
// Repair the existing answer key to agree with the unchanged stated arrangement.
const vrM4=bank.find(p=>p.id==='M4');
vrM4.answers=['24'];
vrM4.solution={en:'There are 6 contacts: 3 along the bottom row, 2 vertical contacts, and 1 between the two upper cubes. Surface area = 36 − 2×6 = 24.',id:'Ada 6 kontak: 3 pada baris bawah, 2 kontak vertikal, dan 1 di antara dua kubus atas. Luas permukaan = 36 − 2×6 = 24.'};
vrM4.hints[2]={en:'Count the 2 vertical contacts AND the contact between the two upper cubes.',id:'Hitung 2 kontak vertikal DAN kontak di antara kedua kubus atas.'};
const vrRenderProblemBase=renderProblem;
renderProblem=function(p){if(p.id!=='D1')return vrRenderProblemBase(p);return `<div class="problem-card"><div class="problem-meta"><span>D1</span><span>${p3LevelLabel(p)}</span></div><p class="problem-q">${esc(i18n(p.q))}</p>${vrMissingFold()}<p>${vrL('This question is on hold until its original diagram and options are available. Continue with D5 for a fully specified folding exercise.','Soal ini ditunda sampai diagram dan pilihan jawaban asli tersedia. Lanjutkan ke D5 untuk latihan lipatan dengan informasi lengkap.')}</p><div class="micro-actions"><button data-p3-change>${t('change')}</button><button data-p3-prev>${t('previousProblem')}</button></div></div>`};
const vrVisualBase=problemVisual;
problemVisual=function(p){
 if(p.id==='D1')return vrMissingFold();
 if(p.id==='B7')return vrStage(vrAreaOverlap(96,54,vrL('Given overlap: 12 cm²','Luas tumpang tindih: 12 cm²'),true));
 if(p.id==='B8')return vrStage(vrAlignedOverlap(10,14,24));
 if(p.id==='M1')return vrStage(vrAreaOverlap(80,56,vrL('Union: 120 cm²','Luas gabungan: 120 cm²')));
 return vrVisualBase(p);
};
// Crossed rectangles have the stated dimensions, labelled corner identities and reveal states.
overlapSVG=function(){const step=state.decompStep;let b=`<rect x="95" y="160" width="406" height="84" fill="#e9f6fa" stroke="#31596b" stroke-width="2"/><rect x="300" y="70" width="56" height="182" fill="#f1ebfb" stroke="#6d49a8" stroke-width="2"/><rect x="300" y="160" width="56" height="84" fill="${step?'#fff0ce':'#f8fbfc'}" stroke="#b38930"/>`;
for(const [x,y,label] of [[82,150,'A'],[82,261,'B'],[513,261,'C'],[513,150,'D'],[286,59,'E'],[286,275,'F'],[371,275,'G'],[371,59,'H']])b+=vrText(x,y,label);
b+=vrText(178,127,'ABCD: 174 cm²')+vrText(457,93,'EFGH: 52 cm²')+vrText(200,286,'BC = 29 cm')+vrText(430,306,'EF = 13 cm');
if(step>=2)b+=vrText(328,145,'4 cm','derived')+vrText(380,209,'6 cm','derived');
if(step>=3)b+=vrText(328,210,'24','derived');
return vrSVG(b,vrL('Crossed rectangles ABCD and EFGH, drawn to given dimensions; overlap initially unknown.','Persegi panjang bersilang ABCD dan EFGH sesuai ukuran; tumpang tindih awalnya belum diketahui.'))};
render();

// Keep mobile diagrams available at a readable size without forcing page overflow.
const vrRenderBase=render;
render=function(){vrRenderBase();document.querySelectorAll('.visual-stage').forEach(stage=>{if(!stage.querySelector('svg'))return;const button=document.createElement('button');button.type='button';button.className='vr-enlarge';button.dataset.vrExpand='';button.textContent=vrL('Enlarge diagram','Perbesar gambar');stage.appendChild(button)})};
document.addEventListener('click',e=>{
 const expand=e.target.closest('[data-vr-expand]');if(expand){
 const svg=expand.closest('.visual-stage').querySelector('svg');let dialog=document.getElementById('vrDiagramDialog');if(dialog)dialog.remove();dialog=document.createElement('dialog');dialog.id='vrDiagramDialog';dialog.className='vr-diagram-dialog';dialog.setAttribute('aria-label',vrL('Enlarged diagram','Gambar diperbesar'));dialog.innerHTML=`<div class="vr-dialog-head"><span>${vrL('Scroll to inspect the full diagram','Geser untuk melihat seluruh gambar')}</span><button type="button" data-vr-close>${vrL('Close','Tutup')} ×</button></div><div class="vr-dialog-canvas visual-stage">${svg.outerHTML}</div>`;document.body.appendChild(dialog);dialog.showModal();return;
 }
 if(e.target.closest('[data-vr-close]'))document.getElementById('vrDiagramDialog')?.close();
});
render();
