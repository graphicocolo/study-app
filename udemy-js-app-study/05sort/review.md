# Udemy JavaScript 練習＆講座　第5章 成績ソート アプリを作ろう コードレビュー

---

## レビュー日: 2026-04-25

---

## ✅ 良い点

### 1. `inputFields` 配列による DRY な設計
各入力フィールドの情報をオブジェクト配列にまとめているため、`forEach` で一括処理できている。同じ処理を5回繰り返す必要がなく、フィールドの追加・削除も1か所で対応できる。

### 2. スプレッド構文による安全なソート
```js
const descScores = [...scores].sort((a, b) => b.value - a.value);
const ascScores  = [...scores].sort((a, b) => a.value - b.value);
```
元の `scores` 配列を変更せずコピーしてからソートしている。`sort()` は破壊的メソッドなので、このやり方は正しい。

### 3. バリデーション関数の分離と再利用
`validateNotEmpty` → `validateScoreRange` と責務を分けて、`validateScoreRange` 内で `validateNotEmpty` を再利用している。単一責任の原則に沿っており、可読性が高い。

### 4. blur + input の2段階バリデーション UX
- `blur`: フォーカスを外したときに初めてエラーを表示（早すぎる警告を防ぐ）
- `input`: すでにエラーが出ているときだけリアルタイムで再検証

ユーザー体験を考慮した設計になっている。

### 5. JSDoc によるコメント
`@type` や `@param`、`@returns` を使って型を明示しており、IDEの補完が効きやすい。

---

## ⚠️ 改善点

### 1. イベントリスナー内で DOM を再クエリしている（冗長）

**該当箇所: 83行目、91行目**

```js
// 現在のコード
inputFields.forEach(({ element, name, displayName }) => {
  element.addEventListener("blur", () => {
    const errorElement = document.getElementById(`${name.toLowerCase()}-error`); // ← 再クエリ
    validateScoreRange(element, displayName, errorElement);
  });
});
```

`inputFields` の各オブジェクトにはすでに `errorElement` が入っているのに、`document.getElementById` で再取得している。分割代入でそのまま使えばよい。

```js
// 改善後
inputFields.forEach(({ element, displayName, errorElement }) => {
  element.addEventListener("blur", () => {
    validateScoreRange(element, displayName, errorElement);
  });
});
```

---

### 2. `parseInt` に基数（radix）を指定していない

**該当箇所: 72行目、115行目**

```js
const value = parseInt(element.value);       // ← 基数なし
value: element.value ? parseInt(element.value) : 0  // ← 基数なし
```

`parseInt` は第2引数に基数を指定するのが安全。省略すると "0x..." のような文字列で16進数として解釈されることがある（現代のブラウザでは10進数として動くが、明示するのがベストプラクティス）。

```js
const value = parseInt(element.value, 10);
```

---

### 3. リセットハンドラ内のフィールドクリア処理がデッドコード

**該当箇所: 139〜141行目**

```js
form.addEventListener("reset", () => {
  // ...
  if (inputFields.some(({ element }) => element.value !== "")) {
    inputFields.forEach(({ element }) => element.value = ""); // ← 実行されない
  }
  // ...
});
```

`reset` イベントはブラウザがフォームの値をリセットした**後**に発火する。そのため、イベントハンドラが実行されるときにはすでに全フィールドが空になっており、`some(...)` の条件は常に `false` になる。この `if` ブロックは削除して問題ない。

```js
form.addEventListener("reset", () => {
  if (resultDescending.hasChildNodes()) resultDescending.replaceChildren();
  if (resultAscending.hasChildNodes()) resultAscending.replaceChildren();
  inputFields.forEach(({ errorElement }) => {
    if (errorElement.textContent !== "") {
      errorElement.textContent = "";
    }
  });
});
```

---

### 4. submit 時の `element.value ? ... : 0` が到達不能コード

**該当箇所: 115行目**

```js
value: element.value ? parseInt(element.value) : 0
```

この直前（108〜110行目）で空フィールドがあれば `return` しているため、ここに到達する時点で `element.value` が空になることはない。`parseInt(element.value, 10)` だけで十分。

```js
value: parseInt(element.value, 10)
```

---

### 5. セミコロンの欠落（スタイルの一貫性）

**該当箇所: 137行目、138行目、147行目**

```js
if (resultDescending.hasChildNodes()) resultDescending.replaceChildren() // ← セミコロンなし
if (resultAscending.hasChildNodes()) resultAscending.replaceChildren()   // ← セミコロンなし
```

コード全体でセミコロンを付けているのに、リセットハンドラ内だけ省略されている。ASI（自動セミコロン挿入）に頼らず、明示的に `;` を付けてスタイルを統一した方がよい。

---

## 📊 総評

| 観点 | 評価 |
|------|------|
| 可読性 | ★★★★☆ |
| 設計（DRY） | ★★★★☆ |
| バリデーション UX | ★★★★☆ |
| 細かい正確さ | ★★★☆☆ |

全体として構造が整理されており、`inputFields` 配列を使った設計は特によくできている。改善点の多くは「動作には影響しない冗長なコード」や「ベストプラクティスからの微細なズレ」であり、大きなバグはない。次のステップとして、`parseInt` の基数指定とイベントリスナー内の冗長な DOM クエリの修正を優先してみよう。

---

## 💡 補足メモ：`replaceChildren()` による連打対策の仕組み

### `replaceChildren()` の動作

引数なしの `replaceChildren()` は「空の要素で置き換える」ではなく、**「全ての子要素を削除する」**。`innerHTML = ""` と同じ効果。

---

### submit 時の連打対策の流れ

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // ① 古い結果を削除（子要素があれば）
  if (resultDescending.hasChildNodes()) resultDescending.replaceChildren();
  if (resultAscending.hasChildNodes()) resultAscending.replaceChildren();

  // ② 新しい結果を作って追加
  const descScoreList = document.createElement("ul");
  resultDescending.appendChild(descScoreList); // ← ここで追加
  descScores.forEach(...);                     // ← li を追加
```

- **1回目の submit**：① スキップ（まだ子要素なし） → ② `ul` + `li` を追加
- **2回目の submit**：① 古い `ul` を削除 → ② 新しい `ul` + `li` を追加
- **3回目の submit**：① 古い `ul` を削除 → ② 新しい `ul` + `li` を追加

削除した直後に新しい結果を追加しているので、表示結果は毎回1セットだけになる。

---

### ① がなかったらどうなるか

```
1回目 submit → ul（1回目の結果）
2回目 submit → ul（1回目）＋ ul（2回目） ← 重複！
3回目 submit → ul × 3 が積み重なる
```

これを防ぐのが「連打対策」の意味。

---

### reset と submit の違い

| イベント | ① 削除後 | 結果 |
|----------|----------|------|
| `submit` | ② で新しい結果を追加 | 結果が1セット表示される |
| `reset`  | ② がない（処理終了） | 結果欄が空になる |

`reset` の場合は削除だけして終わりなので、結果欄がそのままクリアされる。

---

## レビュー：追加機能「submitボタンの活性化/非活性化」（2026-04-25）

---

## ✅ 良い点

### 1. 初期状態を明示的に設定している
```js
submitButton.disabled = true;
submitButton.classList.add("bg-gray-400", "cursor-not-allowed");
```
HTML 側に `disabled` を書くのではなく、JS で初期状態を管理しているため、ロジックが JS に一元化されている。

### 2. `every()` によるシンプルな全入力チェック
```js
const allFilled = inputFields.every(({ element }) => element.value.trim() !== "");
```
`inputFields` 配列をそのまま使って全フィールドをチェックしており、DRY な設計になっている。

### 3. reset ハンドラでボタン状態を戻している
フォームリセット時にボタンを非活性化に戻す処理が漏れなく実装されている。

---

## ⚠️ 改善点

### 1. `let` ではなく `const` を使う（101行目）

```js
let allFilled = inputFields.every(...); // ← let
```

`allFilled` は宣言後に再代入していないので `const` が正しい。`let` は「後で値が変わる可能性がある」というシグナルなので、変わらないなら `const` を使う。

```js
const allFilled = inputFields.every(...);
```

それぞれの入力欄のinputイベントごとにallFilledが宣言されるから、`let` ではなく `const` を使う

#### 補足：「`forEach` の反復ごとに値が変わる」は `let` が必要な理由にならない

`input` イベントが発火するたびにアロー関数が**新しく実行**される。その1回の実行の中で `allFilled` は一度だけ宣言・代入され、その後再代入されることはない。

「別のイベント発火で値が変わる」のは**別の実行**であり、同じ変数への再代入ではない。

`let` が本当に必要なのは、同じ実行の中で値を書き換えるときだけ。

```js
let x = false;
x = someCheck(); // ← 同じ実行内で再代入。これが let が必要な理由
```

| 状況 | 正しい宣言 |
|------|-----------|
| 同じ関数の実行内で後から値を書き換える | `let` |
| 宣言時に一度だけ決まり、その後変わらない | `const` |
| 別の関数呼び出しで異なる値になる | `const`（呼び出しごとに新たに生成されるため） |

---

### 2. `element` の変数シャドウイング（101行目）

```js
inputFields.forEach(({ element, displayName, errorElement }) => {
  element.addEventListener("input", () => {
    ...
    inputFields.every(({ element }) => element.value.trim() !== ""); // ← 外側の element を隠している
  });
});
```

`every()` の中の `{ element }` が、外側の `forEach` の `element` と同名になっている。これを**シャドウイング（変数の隠蔽）**という。動作はするが、読み手が「どちらの `element` か」を追わなければならず混乱しやすい。別名にすると明確になる。

```js
inputFields.every(({ element: el }) => el.value.trim() !== "");
// または
inputFields.every((field) => field.element.value.trim() !== "");
```

---

### 3. ボタン状態の切り替えロジックが3か所に重複している

同じ `classList.add/remove` のパターンが以下の3か所に分散している。

- 50〜52行目（初期化）
- 103〜109行目（input イベント）
- 158〜160行目（reset イベント）

ヘルパー関数に切り出すと DRY になり、変更が1か所で済む。

```js
function setSubmitEnabled(enabled) {
  submitButton.disabled = !enabled;
  submitButton.classList.toggle("bg-gray-400", !enabled);
  submitButton.classList.toggle("cursor-not-allowed", !enabled);
  submitButton.classList.toggle("bg-sky-600", enabled);
  submitButton.classList.toggle("cursor-pointer", enabled);
}

// 使う側
setSubmitEnabled(false);       // 初期化
setSubmitEnabled(allFilled);   // input イベント
setSubmitEnabled(false);       // reset イベント
```

---

### 4. `classList.toggle(className, force)` でより簡潔に書ける

`classList.toggle` の第2引数（`force`）を使うと、条件によって add/remove を切り替えられる。`true` なら追加、`false` なら削除。

```js
// 現在のコード
if (allFilled) {
  submitButton.classList.remove("bg-gray-400", "cursor-not-allowed");
  submitButton.classList.add("bg-sky-600", "cursor-pointer");
} else {
  submitButton.classList.add("bg-gray-400", "cursor-not-allowed");
  submitButton.classList.remove("bg-sky-600", "cursor-pointer");
}

// toggle を使った書き方
submitButton.classList.toggle("bg-gray-400", !allFilled);
submitButton.classList.toggle("cursor-not-allowed", !allFilled);
submitButton.classList.toggle("bg-sky-600", allFilled);
submitButton.classList.toggle("cursor-pointer", allFilled);
```

---

### 5. submit ハンドラの空チェックが冗長（ただし残してもよい）

```js
// 122〜124行目
if (inputFields.some(({ element }) => element.value === "")) {
  return;
}
```

ボタンが `disabled` の間は submit イベントが発火しないため、このガードは通常到達しない。ただし、ブラウザのデベロッパーツールでボタンを強制的に有効化された場合のフェイルセーフとして残しておくのは問題ない。

---

## 📊 総評（追加機能）

| 観点 | 評価 |
|------|------|
| 機能の正確さ | ★★★★★ |
| コードの簡潔さ | ★★★☆☆ |
| DRY 原則 | ★★★☆☆ |

機能としては完全に正しく動作する実装になっている。優先して直したいのは **①`let` → `const`**（即修正）と **②シャドウイング解消**。慣れてきたら **③ヘルパー関数への切り出し** と **④ `classList.toggle`** にも挑戦してみよう。

---

## 経験不足だなと実感した点

submit ボタンの不活性化の実装方法

- ボタンの disabled とクラスの状態を、初期設定時、input イベント、reset イベントにそれぞれ直書きしていた
- クラスの切り替えに、remove と add を併用していた
- 直接 addEventListener input の中に条件式を入れて、submit ボタンの状態を切り替えていた

claude にサポートされながら行なった改善点

- ボタンの disabled とクラスの状態を一括で切り替える関数を定義、さらにtoggle を活用してクラスの切り替えをシンプルに実装することで、コードの重複を減らし、可読性を向上させることができた
- ボタン切り替え関数を、既存の forEach で回している input イベントリスナーの中で呼び出すことで、条件式を直接 addEventListener 内に入れる必要がなくなり、コードがすっきりした

---

## 気づいた点

- 何かしらのボタンには、連打対策が必要。特にボタンクリックによって、何かしらの要素が表示される場合、一旦全要素を削除して、再度要素の生成ロジックを実行する流れにすることが大切