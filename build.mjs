// 商品ごとの静的ページ(/products/商品ID/)と sitemap.xml を、products.json から自動で作る
// デプロイのたびに実行される。商品ページの見た目や構造を変えるときは、下の page() を編集する
import fs from 'node:fs';

const SITE = 'https://polar-gizmo.party';
const NAME = '極地的珍道具店';
const PUB = process.argv[2] || 'public';

const products = JSON.parse(fs.readFileSync(PUB + '/products.json', 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const abs = u => (/^https?:\/\//.test(u) ? u : SITE + '/' + u.replace(/^\//, ''));
const yen = n => Number(n).toLocaleString('ja-JP');

const ph = (p, c) => c.img
  ? '<img src="' + esc(c.img) + '" alt="' + esc(p.name + ' ' + c.name) + '">'
  : '<div class="ph" style="background:' + esc(c.hex) + '"><span>' + esc(p.name) + '<br>' + esc(c.name) + '（仮画像）</span></div>';
const buy = c => c.link
  ? '<a class="btn" id="buy" href="' + esc(c.link) + '">購入する</a>'
  : '<a class="btn off" id="buy">販売準備中</a>';

// 色ボタンを押したときに、画像・色名・購入リンクを切り替える小さなスクリプト
const CLIENT = `const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const img=document.getElementById('img'),cn=document.getElementById('cn'),buy=document.getElementById('buy'),sw=document.getElementById('sw');
function pick(i){
const c=COLORS[i];
cn.textContent=c.name;
img.innerHTML=c.img?'<img src="'+esc(c.img)+'" alt="'+esc(NAME+' '+c.name)+'">':'<div class="ph" style="background:'+esc(c.hex)+'"><span>'+esc(NAME)+'<br>'+esc(c.name)+'（仮画像）</span></div>';
if(c.link){buy.href=c.link;buy.classList.remove('off');buy.textContent='購入する';}else{buy.removeAttribute('href');buy.classList.add('off');buy.textContent='販売準備中';}
[...sw.children].forEach((b,j)=>b.classList.toggle('on',j===i));
}
sw.addEventListener('click',e=>{const b=e.target.closest('button');if(b)pick(+b.dataset.i);});`;

function page(p) {
  const url = SITE + '/products/' + p.id + '/';
  const specs = p.specs || [];
  const c0 = p.colors[0];
  const imgs = p.colors.filter(c => c.img).map(c => abs(c.img));
  const offer = { '@type': 'Offer', price: p.price, priceCurrency: 'JPY', url };
  if (p.colors.some(c => c.link)) offer.availability = 'https://schema.org/InStock';
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.lead, offers: offer };
  if (imgs.length) ld.image = imgs;
  const desc = p.name + '｜' + p.lead + '（税込' + yen(p.price) + '円・送料無料）';
  const title = p.name + ' | ' + NAME;
  const swatches = p.colors.map((c, i) =>
    '<button type="button" data-i="' + i + '" style="background:' + esc(c.hex) + '" title="' + esc(c.name) + '" aria-label="' + esc(c.name) + '"' + (i ? '' : ' class="on"') + '></button>').join('');
  const data = JSON.stringify({ NAME: p.name, COLORS: p.colors }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<base href="/">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
${imgs.length ? '<meta property="og:image" content="' + esc(imgs[0]) + '">' : ''}
<link rel="stylesheet" href="style.css">
<script src="site.js"></script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body>
<site-header></site-header>
<main>
<div class="content">
<section class="prod">
<div class="pimg" id="img">${ph(p, c0)}</div>
<div>
<h1>${esc(p.name)}</h1>
<p class="price">&yen;${yen(p.price)}<small>税込・送料無料</small></p>
<p>${esc(p.lead)}</p>
<ul>${specs.map(s => '<li>' + esc(s) + '</li>').join('')}</ul>
<p>カラー: <b id="cn">${esc(c0.name)}</b></p>
<div class="sw" id="sw">${swatches}</div>
${buy(c0)}
<p class="note">並行輸入品のため、メーカー保証の対象外です。返品・交換は初期不良のみ、商品到着後3日以内にご連絡ください。詳しくは<a href="guide.html">お買い物ガイド</a>と<a href="tokushoho.html">特定商取引法に基づく表記</a>をご確認ください。</p>
</div>
</section>
</div>
</main>
<site-footer></site-footer>
<script>
const D=${data};
const NAME=D.NAME,COLORS=D.COLORS;
${CLIENT}
</script>
</body>
</html>
`;
}

const made = [];
for (const p of products) {
  if (!/^[a-z0-9-]+$/i.test(String(p.id))) {
    console.warn('id は半角英数字とハイフンだけにしてください。スキップしました:', p.id);
    continue;
  }
  const dir = PUB + '/products/' + p.id;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + '/index.html', page(p));
  made.push(SITE + '/products/' + p.id + '/');
}

const urls = [SITE + '/', ...made];
fs.writeFileSync(PUB + '/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '<url><loc>' + u + '</loc></url>').join('\n') + '\n</urlset>\n');
console.log('商品ページを ' + made.length + ' 件作成しました:', made.join(' '));
