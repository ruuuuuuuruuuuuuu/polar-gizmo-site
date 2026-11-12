// 商品カードのHTMLを組み立てる部分。トップページ(ブラウザ)と、商品一覧ページ(ビルド時)の両方で使う
// カードの表示項目や並び順を変えるときは、card() の中だけを直せば、両方に反映される
(function (root) {
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  function card(p) {
    var c = p.colors[0];
    var thumb = c.img
      ? '<div class="pimg"><img src="' + esc(c.img) + '" alt="' + esc(p.name) + '"></div>'
      : '<div class="ph" style="background:' + esc(c.hex) + '"><span>' + esc(p.name) + '（仮画像）</span></div>';
    return '<a class="card" href="products/' + encodeURIComponent(p.id) + '/">' + thumb +
      '<div class="t">' +
      '<div class="t-itemname"><b>' + esc(p.name) + '</b></div>' +
      '<div class="t-itemtext">' + esc(p.lead) + '</div>' +
      '<div class="t-itemprice"><span class="postage">税込・送料無料</span><span class="pr">&yen;' + Number(p.price).toLocaleString('ja-JP') + '</span></div>' +
      '</div></a>';
  }

  function cards(list) {
    return list.map(card).join('');
  }

  var api = { esc: esc, card: card, cards: cards };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Cards = api;
})(typeof window !== 'undefined' ? window : globalThis);
