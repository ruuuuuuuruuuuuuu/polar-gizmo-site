const SHOP={name:'極地的珍道具店',mail:'staff@polar-gizmo.party'};
const NAV=[
['index.html#items','商品一覧'],
['guide.html','お買い物ガイド'],
['about.html','お店情報'],
['news.html','ニュース']
];
const FOOT=[
['guide.html','お買い物ガイド'],
['tokushoho.html','特定商取引法に基づく表記'],
['about.html','お店情報']
];
const links=list=>list.map(n=>'<a href="'+n[0]+'">'+n[1]+'</a>').join('');
function put(el,html){
const t=document.createElement('template');
t.innerHTML=html;
el.replaceWith(t.content);
}
customElements.define('site-header',class extends HTMLElement{
connectedCallback(){
put(this,'<header><a class="logo" href="index.html"><span class="seal">極</span>'+SHOP.name+'</a><nav>'+links(NAV)+'</nav></header>');
}
});
customElements.define('site-footer',class extends HTMLElement{
connectedCallback(){
put(this,'<footer><p>'+links(FOOT)+'</p><p>&copy; '+SHOP.name+' / お問い合わせ: '+SHOP.mail+'</p></footer>');
}
});
