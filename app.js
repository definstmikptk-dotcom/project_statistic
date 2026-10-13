const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('id-ID', {maximumFractionDigits:2});

function setupCanvas(canvas){
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width*dpr; canvas.height = rect.height*dpr;
  const c = canvas.getContext('2d'); c.scale(dpr,dpr);
  return {c,w:rect.width,h:rect.height};
}
function barChart(canvasId, labels, values, opts={}){
  const {c,w,h}=setupCanvas($(canvasId)); const pad={l:42,r:15,t:15,b:42};
  const max=Math.max(...values)*1.15 || 1; const plotW=w-pad.l-pad.r, plotH=h-pad.t-pad.b;
  c.font='11px Segoe UI'; c.strokeStyle='#e9eee6'; c.fillStyle='#718077';
  for(let i=0;i<=4;i++){let y=pad.t+plotH-(i/4)*plotH;c.beginPath();c.moveTo(pad.l,y);c.lineTo(w-pad.r,y);c.stroke();c.fillText(fmt(max*i/4),5,y+4)}
  const bw=plotW/values.length*.58;
  values.forEach((v,i)=>{const x=pad.l+(i+.5)*plotW/values.length-bw/2;const bh=v/max*plotH;const y=pad.t+plotH-bh;
    c.fillStyle=opts.color||'#9bcf6b';c.roundRect(x,y,bw,bh,5);c.fill();c.fillStyle='#68756c';c.textAlign='center';c.fillText(labels[i],x+bw/2,h-17);c.fillText(fmt(v),x+bw/2,y-7);c.textAlign='left';
  });
}
function meanChart(stats){
  const labels=stats.map(x=>x.variable.replace('Monthly_Spending','Spending').replace('Study_Hours','Study').replace('Sleep_Hours','Sleep').replace('Screen_Hours','Screen'));
  const values=stats.map(x=>x.mean); barChart('meanChart',labels,values,{color:'#e5c852'});
}
function renderStats(stats){
  $('statsBody').innerHTML=stats.map(s=>`<tr><td>${s.variable}</td><td>${fmt(s.mean)}</td><td>${fmt(s.median)}</td><td>${fmt(s.std)}</td><td>${fmt(s.min)}</td><td>${fmt(s.max)}</td></tr>`).join('');
}
function renderGender(g){
  const total=Object.values(g).reduce((a,b)=>a+b,0); $('genderTotal').textContent=total;
  const entries=Object.entries(g); const f=entries.find(x=>x[0]==='F')?.[1]||0; const pct=f/total*100;
  $('donut').style.background=`conic-gradient(#9ed36b 0 ${pct}%, #f4cf55 ${pct}% 100%)`;
  $('genderLegend').innerHTML=entries.map((x,i)=>`<div class="legend-item"><i class="dot" style="background:${i?'#f4cf55':'#9ed36b'}"></i><b>${x[0]}</b> ${x[1]} orang (${(x[1]/total*100).toFixed(0)}%)</div>`).join('');
}
function renderDecisions(d){
  const cards=[
    ['AKADEMIK',`Rata-rata nilai ujian adalah <b>${fmt(d.exam_mean)}</b>. Sebanyak <b>${fmt(d.high_score_pct)}%</b> mahasiswa mencapai nilai ≥ 80, sedangkan <b>${fmt(d.low_score_pct)}%</b> berada di bawah 60.`,`Fokuskan pendampingan pada kelompok nilai rendah dan pertahankan strategi belajar mahasiswa berprestasi.`,false],
    ['KEHADIRAN',`Rata-rata kehadiran <b>${fmt(d.attendance_mean)}%</b>. Sekitar <b>${fmt(d.high_attendance_pct)}%</b> mahasiswa memiliki kehadiran ≥ 85%.`,`Pertahankan pemantauan kehadiran; kelompok dengan kehadiran rendah dapat diberi intervensi lebih awal.`,true],
    ['WAKTU BELAJAR',`Rata-rata waktu belajar <b>${fmt(d.study_mean)} jam</b>, sementara tidur rata-rata <b>${fmt(d.sleep_mean)} jam</b>.`,`Dorong jadwal belajar yang konsisten sekaligus menjaga waktu istirahat agar produktivitas tetap stabil.`,false],
    ['SCREEN TIME',`Rata-rata screen time <b>${fmt(d.screen_mean)} jam</b> per hari. Data juga menunjukkan pola hubungan negatif yang sangat kuat dengan nilai ujian.`,`Evaluasi penggunaan perangkat di luar kegiatan akademik dan arahkan waktu layar ke aktivitas pembelajaran.`,true],
    ['KEPUASAN',`Skor kepuasan rata-rata <b>${fmt(d.satisfaction_mean)}</b> dari 10.`,`Gunakan survei lanjutan untuk mengetahui faktor yang paling memengaruhi kepuasan dan menentukan prioritas perbaikan layanan.`,false],
    ['KEUANGAN',`Pengeluaran bulanan rata-rata sekitar <b>Rp${Math.round(1114.5*1000).toLocaleString('id-ID')}</b> jika satuan data dianggap ribuan rupiah.`,`Gunakan data pengeluaran untuk membuat batas anggaran atau program pengelolaan keuangan mahasiswa.`,true]
  ];
  $('decisionGrid').innerHTML=cards.map(x=>`<article class="decision ${x[3]?'yellow':''}"><span class="tag">${x[0]}</span><h3>${x[1]}</h3><p><b>Keputusan:</b> ${x[2]}</p></article>`).join('');
}
function renderPreview(data){
  const cols=data.columns; $('previewHead').innerHTML='<tr>'+cols.map(c=>`<th>${c}</th>`).join('')+'</tr>';
  $('previewBody').innerHTML=data.preview.map(r=>'<tr>'+cols.map(c=>`<td>${r[c]}</td>`).join('')+'</tr>').join('');
}
fetch('/api/data').then(r=>r.json()).then(data=>{
  $('rows').textContent=data.rows; $('sideRows').textContent=`${data.rows} observasi`;
  const get=n=>data.stats.find(x=>x.variable===n)?.mean;
  $('examMean').textContent=fmt(get('Exam_Score'));
  $('attendanceMean').textContent=fmt(get('Attendance'))+'%';
  $('satisfactionMean').textContent=fmt(get('Satisfaction'));
  renderStats(data.stats);
  barChart('examChart',data.exam_distribution.labels,data.exam_distribution.values);
  meanChart(data.stats);
  renderGender(data.gender); renderDecisions(data.decisions); renderPreview(data);
}).catch(err=>console.error(err));
window.addEventListener('resize',()=>location.reload());
