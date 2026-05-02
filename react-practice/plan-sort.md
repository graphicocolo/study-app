# 学習計画: 成績ソートアプリ

## React化 学習ステップ計画：成績ソートアプリ

### 前提：vanilla JS → React の対応関係を頭に入れる

| vanilla JS | React |
|---|---|
| `document.querySelector` で値を取得 | `useState` で値を保持 |
| `element.value` を読み書き | state を読み書き |
| `addEventListener('input', ...)` | `onChange` ハンドラ |
| `addEventListener('blur', ...)` | `onBlur` ハンドラ |
| `addEventListener('submit', ...)` | `onSubmit` ハンドラ |
| `element.textContent = ...` | state を更新 → 自動再レンダリング |
| `createElement / appendChild` | JSX で配列を `.map()` |

---

### Step 1：vanilla JS の「状態」を洗い出す

`main.js` を読んで、**何のデータを保持しているか**を書き出す。

- 入力値（5教科分）
- エラーメッセージ（5教科分）
- submitボタンの活性化フラグ
- ソート済み結果（降順・昇順）

→ これが全部 `useState` になる。書き出したら Claude に見せてください。

#### 保持しているデータ

```tsx
const [kokugoValue, setKokugoValue] = useState<string>('')
const [sugakuValue, setSugakuValue] = useState<string>('')
const [shakaiValue, setShakaiValue] = useState<string>('')
const [rikaValue, setRikaValue] = useState<string>('')
const [eigoValue, setEigoValue] = useState<string>('')

const [kokugoErrorMsg setKokugoErrorMsg] = useState<string>('')
const [sugakuErrorMsg, setSugakuErrorMsg] = useState<string>('')
const [shakaiErrorMsg, setShakaiErrorMsg] = useState<string>('')
const [rikaErrorMsg, setRikaErrorMsg] = useState<string>('')
const [eigoErrorMsg, setEigoErrorMsg] = useState<string>('')

const [isEnable, setIsEnable] = useState(false);

const [descendedResult, setDescendedResult] = useState('')
const [ascendedResult, setAscendedResult] = useState('')
```

#### フィードバック

**✅ 正解な部分**
- 入力値を `string` にしたのは正解（`<input>` の値は常に文字列）
- 4カテゴリの state を漏れなく洗い出せている

**要修正：`descendedResult` / `ascendedResult` の型**

`useState('')` だと string になってしまい、後で `.map()` で表示できない。
ソート結果は「教科名と点数のペアの配列」なので：

```ts
type SortedScore = { displayName: string; value: number }

const [descendedResult, setDescendedResult] = useState<SortedScore[]>([])
const [ascendedResult, setAscendedResult] = useState<SortedScore[]>([])
```

**検討ポイント：`isEnable` は state でなくて良いかもしれない**

`isEnable` は「全フィールドに値が入っているか」という既存 state から計算できる値。
このような派生状態は `useState` を使わず直接計算できる：

```ts
const isSubmitEnabled = [kokugoValue, sugakuValue, shakaiValue, rikaValue, eigoValue]
  .every(v => v.trim() !== '')
```

`useState` で持っても動くが、「state は最小限にして、計算できるものは計算する」のが React の基本思想。

**設計の選択肢（好みで OK）**

教科ごとに個別変数（10個）にする方法と、オブジェクトの配列でまとめる方法がある：

```ts
const [scores, setScores] = useState([
  { name: 'kokugo', displayName: '国語', value: '', error: '' },
  // ...
])
```

配列にすると `.map()` 1回で全教科を扱えてコードが短くなるが、更新処理がやや複雑になる。

**修正後のデータ**

```tsx
type Score = {
  subject: string;
  displayName: string;
  value: string;
  error: string;
}
const [scores, setScores] = useState<Score[]>([
  { subject: 'kokugo', displayName: '国語', value: '', error: '' },
  { subject: 'sugaku', displayName: '数学', value: '', error: '' },
  { subject: 'shakai', displayName: '社会', value: '', error: '' },
  { subject: 'rika', displayName: '理科', value: '', error: '' },
  { subject: 'eigo', displayName: '英語', value: '', error: '' }
])

// 今回は input の入力値をeveryで返し、変数に代入する予定
// const [isEnable, setIsEnable] = useState(false);

type SortedScore = { displayName: string; value: number }
const [descendedResult, setDescendedResult] = useState<SortedScore[]>([])
const [ascendedResult, setAscendedResult] = useState<SortedScore[]>([])
```

---

### Step 2：ファイル構成を決める

既存のパターン（`BmiCalculator.tsx` + `useBmiCalculator.ts`）に合わせて：

```
src/
  components/
    ScoreSort.tsx       ← UIだけ書く
  hooks/
    useScoreSort.ts     ← ロジックだけ書く
```

コンポーネントとカスタムフックの役割分担をここで決めてから実装に入る。

---

### Step 3：カスタムフック `useScoreSort.ts` を作る

#### カスタムフックの「定型の骨格」

```ts
// ①使い回す定数（必要ならば）
// ②汎用関数（必要ならば）フックの中に書くと、コンポーネントが再レンダリングされるたびに関数が再生成される
// バリデーション関数は state を使わない純粋な関数なので、毎回作り直す意味がない
// ③型定義（必要ならば）慣習としてフックの外・ファイルの上部に書くのが一般的
export function useScoreSort() {
  // ① useState（状態の定義）
  // ② 派生値（state から計算するもの、useState 不要）
  // ③ イベントハンドラ（const で関数を定義）
  // ④ return（コンポーネントに渡す値・関数をまとめて返す）
  return { ... } 
}
```

この順番で書けば迷いません。

いざ1人で書くとなると、うわーっとなって書けなかった...

```txt
以下のような疑問が押し寄せてきた...
// 型定義は useScoreSort の外側に記述で大丈夫か（ただし慣習としてフックの外・ファイルの上部に書くのが一般的）
// 2つのバリデーション関数は真偽値を返す作りで問題ないか
// エラーをセットする関数を作成した方が良いか
// どのようにフック内のスクリプトを組み立てて良いかわからない
// フック内のスクリプトの定型の書き方ってあるのか、あれば教えて
// この状態でまず何から進めれば良いか
// - `handleChange(name, value)` → 入力値を更新 + エラークリア制御
// - `handleBlur(name)` → バリデーション実行
// - `handleSubmit` → ソートして結果を state に保存
// - `handleReset` → 全 state を初期値に戻す
```

**3-1. `useState` で状態を定義する**

```ts
// 型のヒント
type Score = { displayName: string; value: string };
type SortedScore = { displayName: string; value: number };
```

5教科をどう表現するか考える。1つずつ5変数か、配列か。

**3-2. バリデーション関数を書く**

`validateNotEmpty` と `validateScoreRange` をそのまま純粋関数として移植する（DOMを引数にとらない形に変える）。

**3-3. イベントハンドラを作る**

- `handleChange(name, value)` → 入力値を更新 + エラークリア制御
- `handleBlur(name)` → バリデーション実行
- `handleSubmit` → ソートして結果を state に保存
- `handleReset` → 全 state を初期値に戻す

---

### Step 4：コンポーネント `ScoreSort.tsx` を作る

フックから値とハンドラを受け取って JSX を書く。

**4-1. フォーム部分** ← **今ここを学習中**  🔥 現在地

`inputFields` 配列を `.map()` して `<input>` を生成する（`id` で個別管理しない）。

**4-2. 結果表示部分**

`sortedScores` が空なら何も表示しない。`sortedScores` がある場合、`.map()` でリストを生成する。

---

### Step 5：`App.tsx` に追加して動作確認

既存コンポーネントの追加パターンを参考に `<ScoreSort />` を追記する。

---

### Step 6：動作チェックリスト

- [ ] 全フィールド未入力でsubmitボタンが非活性になっているか
- [ ] blurしたときエラーが出るか
- [ ] inputで正しい値を入れたらエラーが消えるか
- [ ] 全入力後にsubmitボタンが活性化するか
- [ ] 送信したら降順・昇順で正しく表示されるか
- [ ] リセットで全データがクリアされるか

---

### 進め方のコツ

- Step 3 → 4 の順で進める（ロジック先、UI後）
- 各ステップで「ここどう書けばいいか」「この設計でいいか」を Claude に相談しながら進めてください
- 特に **Step 3-1（state 設計）** は実装前に相談すると後が楽です

---

### バリデーション関数について

#### 記述場所

汎用関数（`validateNotEmpty` など）と型定義（`type Score` など）はフックの**外**に書く。

| | フックの外 | フックの中 |
|---|---|---|
| 汎用関数 | 1回だけ定義される ✅ | 再レンダリングのたびに再生成される |
| 型定義 | export しやすい ✅ | 動作は同じだが export できない |

state を使わない純粋な関数は、毎回作り直す意味がないのでフックの外に置く。

#### true/false型 vs Result型

現在の `useScoreSort.ts` は **true/false型**、`useBmiCalculator.ts` は **Result型** で書かれている。

**true/false型（現在）**

```ts
function validateNotEmpty(value: string) { ... } // false = NG
function validateScoreRange(value: string) { ... } // false = NG
// エラーメッセージは handleBlur 側で書く
```

**Result型（useBmiCalculator 方式）**

```ts
function validateScore(value: string): { value: number } | { error: string } {
  if (value.trim() === '') return { error: '点数が空です' }
  const num = parseInt(value, 10)
  if (isNaN(num) || num < 0 || num > 100) return { error: '0以上100以下の数字を入力してください' }
  return { value: num }
}
// エラーメッセージが関数の中にまとまる
// handleSubmit での parseInt の重複もなくなる
```

どちらも正解。現在の true/false 型の唯一の弱点は `handleSubmit` で `parseInt` を重複して呼んでいる点。Result型にするとそれが解消される。

