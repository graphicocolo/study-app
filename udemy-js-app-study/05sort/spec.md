# Udemy JavaScript 練習＆講座　第5章 成績ソート アプリを作ろう

## 仕様

デフォルトの仕様：

テキストエリアにカンマ区切りで入力した6つの数値を、その下に配置した実行ボタンをクリック後に降順に並べ替えて表示

↓以下に変更

1. 個別の入力フォーム（最もシンプル）
5つの `<input type="number">` を並べる。カンマ区切りが不要になり、数値以外を入力しにくくなる。

科目名は固定

```
国語[ 85 ] 数学[ 92 ] 英語[ 78 ] 社会[ 65 ] 理科[ 90 ]
```

**UI**

- 入力欄（5教科分5つ）
- 並べ替えるボタン
- リセットボタン
- 表示部
  - 点数の高い順
    - 国語
    - 数学
    - 社会
    - 理科
    - 英語
  - 点数の低い順
    - 英語
    ...

**挙動**

1. 点数入力欄に数値を入力（2つ以上の数値入力が必要）
2. 並べ替えるボタンをクリック
3. 点数の高い順、点数の低い順に並べ替えられた成績が表示

AI の改善案

### 1. 個別の入力フォーム（最もシンプル）
6つの `<input type="number">` を並べる。カンマ区切りが不要になり、数値以外を入力しにくくなる。

```
[ 85 ] [ 92 ] [ 78 ] [ 65 ] [ 90 ] [ 74 ]
```

### 2. スライダー（range input）
各科目をスライダーで入力。0〜100の範囲が視覚的にわかる。

```
国語 ━━━━●━━━ 85
数学 ━━━━━━●━ 92
```

### 3. 科目ラベル付き入力
科目名を固定しておく。入力欄に意味が生まれる。

```
国語 [ 85 ]
数学 [ 92 ]
英語 [ 78 ]
```

### 4. 動的に入力欄を追加（件数を固定しない場合）
「+ 追加」ボタンで入力欄を増やす。6件固定の制約をなくせる。

---

### おすすめ
**個別 input×6 + 科目ラベル付き** が最もUXが良い。

- `type="number"` でブラウザが数値バリデーションを自動処理
- カンマの打ち間違いがなくなる
- 何番目の入力かが一目でわかる

---

## submit ハンドラ内での複数 input の値の取得方法

### 方法1: 個別変数から直接読む

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const kokugo = parseInt(kokugoInput.value);
  const sugaku = parseInt(sugakuInput.value);
  // ...
});
```

- フィールドが少なく、後続処理も個別に扱う場合に素直でわかりやすい
- フィールドが増えると記述量も増える

### 方法2: `FormData` で一括取得する

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  // 個別に取得
  const kokugo = formData.get("kokugo"); // "80"（文字列）

  // 全フィールドをオブジェクトとしてまとめて取得
  const entries = Object.fromEntries(formData);
  // => { kokugo: "80", sugaku: "70", ... }
});
```

- HTML の `name` 属性を使って値を取得する
- 値はすべて**文字列**で返るため、数値として使う場合は `parseInt` や `Number()` に変換が必要
- サーバーへの送信を想定したフォームとの相性が良い

### 方法3: `querySelectorAll` でその場で集める

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = form.querySelectorAll("input[type='number']");
  const values = [...inputs].map(input => parseInt(input.value));
  // => [80, 70, 0, 90, 0]
});
```

- `form.querySelectorAll` でそのフォーム内に絞って取得できる（`document.querySelectorAll` より安全）
- フィールドが多く配列として一括処理したい場合に向く
- 教科名などのメタ情報は別途管理する必要がある

### まとめ

| 方法 | 向いている場面 |
|---|---|
| 個別変数 | フィールドが少なく、個別に扱いたい |
| `FormData` | フォーム全体をまとめて扱いたい、サーバー送信を想定している |
| `querySelectorAll` | フィールドが多く、配列として一括処理したい |

今回のようにフィールドを配列としてソートする処理には `querySelectorAll` か `FormData` が向いている。  
ただし教科名（"国語" など）と値をセットで扱いたい場合は、`inputFields` のようなオブジェクト配列を事前に定義しておく構成が最も扱いやすい。
