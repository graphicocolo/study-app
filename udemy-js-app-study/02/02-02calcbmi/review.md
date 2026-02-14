# Udemy JavaScript 練習＆講座　第二章 BMI計算アプリを作ろう main.js のコードレビュー

## コードレビュー

全体的にとてもよく書かれています。前回の税率計算のレビューで指摘したポイント（早期リターン、Constraint Validation API、コメントの書き方）がしっかり活かされていて、学習の定着が感じられます。

---

### 良い点

- **早期リターンパターン**の活用（53-56行目）
- **Constraint Validation API** と HTML属性の組み合わせによるバリデーション
- **`parseInt` の基数指定**（10進数を明示）
- **リセット処理**の実装がシンプルで適切
- **コメント**が冒頭に仕様をまとめていて、コードの意図が把握しやすい

---

### 改善提案

#### 1. バリデーション処理の重複を関数にまとめる（重要度：中）

身長・体重のバリデーション処理がほぼ同じ構造です。関数に切り出すと、項目が増えた場合にも対応しやすくなります。

```js
function setValidationMessage(input, fieldName) {
  if (input.validity.valueMissing) {
    input.setCustomValidity(`${fieldName}を入力してください`);
  } else if (input.validity.rangeUnderflow) {
    input.setCustomValidity(`${fieldName}は1以上の数値を入力してください`);
  } else {
    input.setCustomValidity("");
  }
}

heightInput.addEventListener("input", () => setValidationMessage(heightInput, "身長"));
weightInput.addEventListener("input", () => setValidationMessage(weightInput, "体重"));
```

前回の税率計算でも同様の重複がありました。「同じ構造のコードが2箇所以上 → 関数化を検討」という判断基準を意識してみてください。

#### 2. HTML: `</div>` の閉じタグ漏れ（重要度：高）

`index.html` 29行目で `<div id="result">` の閉じタグ `</div>` はありますが、その外側の `<div class="m-auto max-w-sm p-4">` (12行目) の閉じタグがありません。

```html
      </div>  <!-- ← result の閉じタグ (29行目) -->
  </div>      <!-- ← ここに m-auto の閉じタグを追加 -->
  <script src="main.js"></script>
</body>
</html>
```

ブラウザが自動補完してくれるので表示には問題ないかもしれませんが、意図しないレイアウト崩れの原因になりえます。

#### 3. `max` 属性の設定を検討（重要度：低）

`min="1"` は設定されていますが、`max` がありません。身長に `99999` のような値を入れても通ってしまいます。現実的な範囲を設定するとより堅牢です。

```html
<input type="number" id="height" min="1" max="300" step="1" required>
<input type="number" id="weight" min="1" max="500" step="1" required>
```

ただし学習目的のミニアプリなので、これは「余裕があれば」程度の優先度です。

---

### まとめ

前回のレビューからの成長がしっかり見える良いコードです。特に Constraint Validation API の使い方が自然に身についている点が素晴らしいです。次のステップとして、**「同じパターンの繰り返しを見つけたら関数に抽出する」** という視点を意識してみてください。
