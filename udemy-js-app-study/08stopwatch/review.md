# コードレビュー: ストップウォッチ (main.js)

## 総評

バグ修正（ストップ→再スタート時のリセット問題）を正しく実装できている。
`Date.now()` ベースの時間計算、ガード条件、ポーズ再開の設計など、全体的によく書けている。

---

## 良かった点

### 1. `Date.now()` ベースの時間計算（重要）

```js
const timeStart = Date.now() - pausedElapsedMs;
// ...
const diffMs = Date.now() - timeStart;
```

`setInterval` のコールバックは1000ms間隔で呼ばれるが、ブラウザの都合でわずかにズレる。
カウンタ変数を `+1` する方式だと誤差が蓄積するが、`Date.now()` の差分で計算することで**経過時間は常に正確**になる。

### 2. ポーズ/再開の実装

```js
let pausedElapsedMs = 0;
// ストップ時点での経過時間をインターバルごとに更新
pausedElapsedMs = diffMs;

// 再スタート時にその分をオフセット
const timeStart = Date.now() - pausedElapsedMs;
```

今回修正した核心部分。`pausedElapsedMs` をオフセットとして使うことで、
ストップ→再スタートしても時間がリセットされない。設計として正しい。

### 3. 二重起動防止のガード条件

```js
if (intervalId === null) {
  intervalId = setInterval(...)
}
```

スタートボタンを連打しても `setInterval` が複数走らない。

### 4. コードの構成が明確

4セクション（要素取得・変数定義・関数定義・イベントハンドラ）に整理されており読みやすい。

### 5. `resetWatch` のファサードパターン

```js
function resetWatch () {
  stopWatch();
  initialTimes();
  pausedElapsedMs = 0;
}
```

3つの処理を1つの関数にまとめており、呼び出し側がシンプルになっている。

---

## 改善・気になる点

### 1. コメントの疑問（`// ここにreturn;を入れた方が良い？`）

```js
function stopWatch () {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  // ここにreturn;を入れた方が良い？ ← これ
}
```

**結論: 不要。**
`return;` は関数の途中で処理を打ち切るときに使う。
関数の末尾にある場合は `return;` を書いても意味は変わらない。
疑問自体は良い視点なので、「末尾では不要」と覚えておくと良い。

#### `return` を入れる場面：早期リターン（ガード節）

条件を満たさない場合に**先に弾いて**、ネストを浅くするために使う。

**例1: 条件を満たさない場合に即終了**

```js
// NG: ネストが深い
function startWatch() {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      // 処理...
    }, 1000);
  }
  // if の中にしか処理がないのに、外側のブロックが存在する
}

// OK: 早期リターンでネストを減らす
function startWatch() {
  if (intervalId !== null) return; // すでに動いていたら何もしない

  intervalId = setInterval(() => {
    // 処理...
  }, 1000);
}
```

条件を反転させて先に `return` することで、本来の処理がフラットに書ける。

**例2: 今回のコードでも使える場面（`startWatch` 内）**

```js
function startWatch () {
  const timeStart = Date.now() - pausedElapsedMs;
  if (intervalId === null) {
    intervalId = setInterval(() => {
      const diffMs = Date.now() - timeStart;
      pausedElapsedMs = diffMs;
      const totalSeconds = Math.floor(diffMs / 1000);

      if (totalSeconds > 3600) {
        stopWatch();
        return; // ← ここの return は「setInterval のコールバック関数」から抜けるために使っている
      }
      // ...
    }, 1000);
  }
}
```

この `return;` はコールバック関数（`setInterval` に渡した `() => {...}`）の中にある。
`stopWatch()` を呼んだ後、**それ以降の表示更新処理をスキップする**ために必要。
これが早期リターンの典型的な使い方。

#### まとめ

| 場所 | returnの必要性 |
|------|--------------|
| 関数の末尾 | 不要（何もしない） |
| 関数の途中・条件分岐の後 | 必要（処理を打ち切る） |
| 値を返す関数 | 必要（`return 値;` の形で使う） |

### 2. イベントハンドラのアロー関数は省略できる

```js
// ①現状
startButton.addEventListener("click", () => { startWatch(); });

// ②省略形（関数をそのまま渡す）
startButton.addEventListener("click", startWatch);
// ここで注意
// addEventListener の第2引数には「クリックされたときに呼ぶ関数」を渡す必要があります。() をつけると登録の時点で即実行されてしまい、その戻り値（startWatch は何も返さないので undefined）が渡されてしまいます。
// () なしで関数名だけ書くと、関数の参照（関数そのもの）を渡せるので、クリックのたびに正しく呼ばれます。
```

**引数の受け渡しや加工が不要な場合**、関数を直接渡せる。
`click` イベントオブジェクトが `startWatch` に渡されるが、今回は引数を使っていないので問題なし。

#### ①と②の違い

**違い1：`startWatch` に渡される引数**

```js
// ① アロー関数ラッパーあり
startButton.addEventListener("click", () => { startWatch(); });
// → startWatch() は引数なしで呼ばれる

// ② 直接渡す
startButton.addEventListener("click", startWatch);
// → startWatch(clickEvent) として呼ばれる（クリックイベントオブジェクトが第1引数に入る）
```

`addEventListener` は登録した関数を呼ぶとき、自動的に `MouseEvent` オブジェクトを渡す。
①はアロー関数がそれを受け取って捨て、`startWatch` には渡さない。
②は `startWatch` がそのまま呼ばれるので、`MouseEvent` が `startWatch` の第1引数に入る。

**違い2：`this` の値**

```js
// ① アロー関数ラッパーあり
// → startWatch 内の this は外側のスコープの this（通常 undefined か window）

// ② 直接渡す
// → startWatch 内の this は addEventListener のルールで startButton 要素になる
```

`addEventListener` に直接関数を渡すと、その関数内の `this` はイベントが発生した要素に自動的にバインドされる。

**今回のコードでは影響なし**

`startWatch` は引数も `this` も使っていないため、①②どちらの書き方でも動作は同じ。
ただし引数や `this` を使う関数を渡す場合は、どちらの形式を選ぶかが動作に影響する。

### 3. 最大計測時間の境界値

```js
if (totalSeconds > 3600) {
```

`3600秒ちょうど（1:00:00）` は表示されてからストップする。
`>= 3600` にすると `1:00:00` の手前でストップする（仕様の好みによる）。
どちらが意図か明示したコメントを入れると良い。

### 4. `pausedElapsedMs` の最大1秒のズレ（上級）

```js
// インターバル（1秒ごと）で pausedElapsedMs を更新している
pausedElapsedMs = diffMs;
```

`setInterval` は1秒ごとに動くので、ストップした瞬間の `pausedElapsedMs` は
最大で約1秒前の値になる可能性がある。

より正確にするには `stopWatch` 時点で `Date.now()` を記録する方法があるが、
現在の構造（`timeStart` が `startWatch` のローカル変数）では直接アクセスできない。

**今のコードの範囲では最善の実装**になっている。
気になる場合は `timeStart` をモジュールスコープに移す設計変更が必要。

---

## 学習ポイントまとめ

| テーマ | 今回の実践 |
|--------|-----------|
| 時刻計算 | `Date.now()` の差分で正確な経過時間を取得 |
| 状態管理 | `intervalId` と `pausedElapsedMs` の2変数で状態を表現 |
| ガード条件 | `if (intervalId === null)` で多重実行を防ぐ |
| ファサード | `resetWatch` で複数の操作をまとめる |
| return の役割 | 途中打ち切り vs 末尾のreturnは不要 |
