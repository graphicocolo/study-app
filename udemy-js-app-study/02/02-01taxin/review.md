# main.js のコードレビュー

---

良い点

- コメントが丁寧 — 仕様・操作手順・機能がファイル冒頭に整理されていて読みやすい
- `event.preventDefault()` — フォーム送信時のページリロードを正しく防止している
- `parseInt(value, 10)` — 基数を明示的に指定しているのは良い習慣
- `Math.floor` — 税込価格の端数処理（切り捨て）が適切
- `toLocaleString()` — 桁区切り表示への配慮がある
- リセット処理 — `reset` イベントで結果欄のクリアも実装されている

改善の提案

1. 負の数やゼロのバリデーション

現状のバリデーションでは "-100" や "0" も通過します。税抜価格としては正の整数のみ許可すべきです。

```js
const price = parseInt(priceInput.value, 10);
if (isNaN(price) || price <= 0) {
  alert("税抜価格には正の整数を入力してください。");
  return;
}
```

2. 小数の入力への対応

コメントで「小数点が入った場合」を懸念していますが、parseIntは "100.5" を 100 として解析するため、暗黙的に切り捨てられます。小数入力を明示的に拒否したい場合は：

```js
if (!Number.isInteger(Number(priceInput.value))) {
  alert("整数を入力してください。");
  return;
}
```

3. isNaNの挙動に注意

isNaN("") は false を返します（空文字は0に変換されるため）。現状は先に === "" でチェックしているので問題ありませんが、Number.isNaNやより堅牢なチェックに置き換えると安全です。

```js
const trimmed = priceInput.value.trim();
if (trimmed === "" || Number.isNaN(Number(trimmed))) {
  alert("税抜価格には有効な数字を入力してください。");
  return;
}
```

4. taxRateSelectのバリデーション省略

taxRateSelectはプルダウン（10%/8%）なので通常は不正値が来ませんが、DevToolsなどで改ざんされる可能性はあります。学習段階では問題ありませんが、実務では念のためチェックを入れることが多いです

まとめ

学習用のコードとして十分な品質です。ロジック・構造ともにシンプルで正しく動作します。上記の改善点は「もう一歩進めるなら」という観点なので、余裕があれば取り入れてみてください。

---

バリデーションの仕組みを自前で書くのは割とたいへんですね。この場合のような静的ページへ使えるバリデーターはありますか

静的ページで使えるバリデーション方法は大きく2つあります。

1. HTML標準のバリデーション属性（最もお手軽）

ブラウザ組み込みの機能なので、ライブラリ不要です

```html
<input type="number" id="price" min="1" step="1" required>
```

- 数値のみ入力可能（スピナーも表示）
- 空欄を防止
- 1以上のみ許可
- 整数のみ許可（小数を拒否）

これだけで、submit時にブラウザが自動的にエラーメッセージを表示してくれます。JS側の isNaN チェックなどがほぼ不要になります。

さらにCSS疑似クラス :invalid / :valid でスタイルも付けられます。

```css
input:invalid {
  border-color: red;
}
```

2. 軽量ライブラリ

- [HTML フォーム検証と制約検証 API の使用](https://developer.mozilla.org/ja/docs/Web/HTML/Constraint_validation)
  - ライブラリではなくブラウザ標準API。setCustomValidity()でカスタムメッセージを設定可能
- [Just-validate](https://github.com/horprogs/Just-validate)
  - ~5KB。モダンで設定が直感的

おすすめ

今回の税込計算のようなシンプルなフォームなら、HTML属性 + Constraint Validation API の組み合わせで十分です。

```js
taxForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // ブラウザ標準のバリデーションチェック
  if (!taxForm.checkValidity()) {
    taxForm.reportValidity(); // エラーメッセージを表示
    return;
  }

  const price = parseInt(priceInput.value, 10);
  const taxRate = parseInt(taxRateSelect.value, 10);
  const taxInPriceValue = Math.floor(price * (1 + taxRate / 100));
  taxInPrice.textContent = `${taxInPriceValue.toLocaleString()}円`;
}
```

---

初期の学習段階なのでバニラJSでそのまま書いていますが、計算アプリなどある程度まとまった計算機能を持つアプリを構築する場合は、Reactなどであれば税込価格計算ロジックをカスタムフックなどに落とし込み、フレームワークを使用しないのであれば、クラスで税込計算システムにまとめたりすることが考えられます。認識はあっていますか

はい、その認識は合っています。

バニラJS の場合

クラスでロジックと状態をまとめるのが一般的です：

```js
class TaxCalculator {
  constructor(taxRate) {
    this.taxRate = taxRate;
  }
  calculate(price) {
    return Math.floor(price * (1 + this.taxRate / 100));
  }
}
```

UIの操作（DOM）と計算ロジックを分離できるのがメリットです。

React の場合

おっしゃる通りカスタムフックに切り出すパターンが一般的です：

```ts
function useTaxCalculator() {
  const [price, setPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(10);

  const taxInPrice = useMemo(
    () => Math.floor(price * (1 + taxRate / 100)),
    [price, taxRate]
  );

  return {price, setPrice, taxRate, setTaxRate, taxInPrice};
}
```

共通する考え方

どちらのアプローチも根本は同じで、関心の分離（Separation of Concerns）です。

|  層  |  責務  |
| ---- | ---- |
|  ロジック層  |  計算・バリデーション  |
|  UI層  |  表示・ユーザー操作の受付  |

今のコードは1ファイルに両方が混在していますが、小規模なので問題ありません。規模が大きくなったときに分離すればよいので、今の段階ではバニラJSでDOMや基本的なロジックの書き方をしっかり掴むのが大事です。

---

今のコードは1ファイルに両方が混在していますが、ということですが、今のファイルで言うとUI層はコードのどの部分に当たりますか

UI層（DOM操作・ユーザーとのやりとり）

- 17〜20行目 — DOM要素の取得（document.querySelector）
- 23〜42行目 — バリデーションメッセージの設定（setCustomValidity）
- 45〜46行目 — イベントリスナー登録、preventDefault()
- 52〜55行目 — バリデーション結果の表示（reportValidity）
- 68行目 — 結果の画面表示（textContent への代入、toLocaleStringでの整形）
- 71〜74行目 — リセット時の画面クリア

ロジック層（純粋な計算）

- 58行目 — 入力値の数値変換（parseInt）
- 60行目 — 税率の数値変換
- 64行目 — Math.floor(price * (1 + taxRate / 100))

ポイント

ロジック層は実質 64行目の1行だけ です。この計算は price と taxRate という数値を受け取って数値を返すだけなので、DOMに一切依存していません。

これが「分離しやすい部分」で、先ほどのクラスやカスタムフックに抽出する対象になります：

```js
// この関数はDOMを知らない = どこでも再利用できる
function calcTaxInPrice(price, taxRate) {
  return Math.floor(price * (1 + taxRate / 100));
}
```

今のコードは小規模なので混在していても全く問題ありませんが、「DOMに触る部分」と「数値だけで完結する部分」を意識して見る癖をつけておくと、規模が大きくなったときに自然と分離できるようになります。

---