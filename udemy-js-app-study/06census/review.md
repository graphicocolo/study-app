# main.js コードレビュー

## 良い点

- 思考の軌跡・コード構成のコメントが整理されていて読みやすい
- 各関数に JSDoc コメントがついている
- スプレッド構文で元の配列を変更せずにコピーして操作している（不変性の意識）
- `parseInt` に基数 `10` を明示している
- `fetchCensusData` にエラーハンドリングがある

---

## 指摘事項

### 1. 到達不能なコード（line 41）

```js
throw new Error(`HTTP: ${response.status}`);
return null; // ← throw の後なので実行されない
```

`throw` した時点で関数は終了するため、`return null` は実行されない。削除して良い。

---

### 2. `toString(10)` の誤用（line 60）

```js
return ratio.toFixed(1).toString(10);
```

`toFixed(1)` は既に `string` を返す。`String` の `.toString()` は引数を受け付けないため `10` は無視される（`Number.prototype.toString(radix)` と混同している）。`toFixed(1)` だけで十分。

```js
// 修正後
return ratio.toFixed(1);
```

---

### 3. `map` の戻り値を使っていない（line 120）

```js
sortedArray.map((item, index) => {
  // DOM操作のみ、戻り値を使っていない
});
```

`map` は新しい配列を返すメソッドで、変換結果を使う場面に適している。副作用（DOM操作）だけが目的のときは `forEach` が適切。

```js
// 修正後
sortedArray.forEach((item, index) => { ... });
```

---

### 4. ネストした三項演算子が読みにくい（line 131）

```js
ratioIndex === 1 ? ratioCell.textContent = `${item[7]}%`
  : ratioIndex === 2 ? ratioCell.textContent = `${item[8]}%`
  : ratioCell.textContent = "";
```

`ratioIndex` は `1` か `2` しか渡ってこないため、`else` で十分。また三項演算子は値を返すために使うもので、副作用（代入）を三項演算子で書くのは読みにくい。

```js
// 修正後（if/else）
if (ratioIndex === 1) {
  ratioCell.textContent = `${item[7]}%`;
} else {
  ratioCell.textContent = `${item[8]}%`;
}
```

---

### 5. マジックナンバー（line 154, 160, 165）

```js
createRankingTable(censusData, 7, 1);
createRankingTable(censusData, 8, 2);
```

`7`・`8`・`1`・`2` が何を意味するか呼び出し側から読み取れない。定数にすると意図が明確になる。

```js
// 例
const MALE_RATIO_INDEX = 7;
const FEMALE_RATIO_INDEX = 8;
```

---

### 6. `@type` / `@param` の型が不正確

```js
/** @type {HTMLButtonElement | null} */
const maleRankingButton = ...
const femaleRankingButton = ... // ← 型アノテーションなし
```

- `femaleRankingButton` にも同じ `@type` を付けると一貫性が出る
- `@param {array}` は JSDoc の正式な型ではない。`{Array}` または `{Array.<Array.<string>>}` のように書くのが正確

---

## 優先度まとめ

| # | 指摘 | 優先度 |
|---|------|--------|
| 1 | 到達不能コードの削除 | 高 |
| 2 | `toString(10)` の修正 | 高 |
| 3 | `map` → `forEach` | 中 |
| 4 | ネスト三項演算子の整理 | 中 |
| 5 | マジックナンバーの定数化 | 低 |
| 6 | JSDoc の型を正確に書く | 低 |

---

## 関数の構成について

createRankingTable()の中で3つ（4つ）の関数を束ねている作りになっています。さらにそれを各イベントハンドラで呼び出している、という作りなのですが、このロジックについてはどう評価しますか

### 評価：良い設計

**良い点**

`createRankingTable` が「データ変換 → ソート → 描画」の流れを束ねる**ファサード関数**の役割を果たしている。イベントハンドラ側は `createRankingTable` を呼ぶだけで済み、処理の詳細を知らなくていい構造になっている。

各関数が単一の責務を持っている。

- `addRatioToData` → データ変換のみ
- `sortByValueDescending` → ソートのみ
- `renderTable` → 描画のみ

これにより、たとえば「ソートのロジックを変えたい」ときに `sortByValueDescending` だけを修正すればよく、他に影響が出にくい。

---

**気になる点（発展的な話）**

`renderTable` の中に `title` の生成・追加が混在していて、「テーブルを描く」以上のことをしている。タイトルの生成を分けるか、`createRankingTable` 側に移すとより関数の責務が明確になる。

また現状、ボタンを押すたびに `fetchCensusData` を呼んでいる。データは変わらないので、最初に取得したものを変数に保持して使い回す設計にすると無駄なリクエストがなくなる。ただしこれは学習段階では優先度は低い。

---

全体として、関数の分割と束ね方の考え方が実務でも通用するレベルで書けている。

