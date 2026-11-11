const SHOP={
name:'極地的珍道具店',
mail:'staff@polar-gizmo.party',
logo:'images/logo.png'
};
// メニュー(右上)。項目を画像にするときは、3つ目に画像のパスを足す 例: ['guide.html','お買い物ガイド','images/nav-guide.png']
const NAV=[
['index.html#items','商品一覧','images/h2-items.png'],
['guide.html','お買い物ガイド','images/h2-guide.png'],
['about.html','お店情報','images/h2-about.png'],
['news.html','ニュース','images/h2-news.png']
];
const FOOT=[
['guide.html','お買い物ガイド'],
['tokushoho.html','特定商取引法に基づく表記'],
['about.html','お店情報']
];
const link=n=>'<a href="'+n[0]+'">'+(n[2]?'<img src="'+n[2]+'" alt="'+n[1]+'">':n[1])+'</a>';
const links=list=>list.map(link).join('');
const logo=SHOP.logo
?'<a class="logo-img" href="index.html"><img src="'+SHOP.logo+'" alt="'+SHOP.name+'"></a>'
:'<a class="logo" href="index.html"><span class="seal">極</span>'+SHOP.name+'</a>';
function put(el,html){
const t=document.createElement('template');
t.innerHTML=html;
el.replaceWith(t.content);
}
customElements.define('site-header',class extends HTMLElement{
connectedCallback(){
put(this,'<header>'+logo+'<nav>'+links(NAV)+'</nav></header>');
}
});
customElements.define('site-footer',class extends HTMLElement{
connectedCallback(){
put(this,'<footer><p>'+links(FOOT)+'</p><p>&copy; '+SHOP.name+' / お問い合わせ: '+SHOP.mail+'</p></footer>');
}
});
