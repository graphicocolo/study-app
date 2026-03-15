# コードレビュー: 割り勘アプリ

対象ファイル:
- `src/components/SplitCalculator.tsx`
- `src/hooks/useSplitCalculator.ts`
- `src/App.tsx`

---

## バグ（要修正）

### 1. `handleBlur` がフィールドをまたいでエラーを消してしまう

`useSplitCalculator.ts:68` の `handleBlur` は渡された値だけを検証してエラーを更新する。
`SplitCalculator.tsx:36` で nop フィールドのブラーに同じ `handleBlur` を使っているため、以下のケースで問題が起きる。

- total に無効な値（エラー表示中）
- nop に有効な値を入力してフォーカスを外す

→ nop の値が valid なので `setError(null)` され、**total のエラーが消える**

**対処**: エラー state を total/nop で分けるか、バリデーション関数に「どちらのフィールドか」を伝える。

#### 修正レビュー（`id` を渡すアプローチ）

`handleBlur(value, id)` として `e.target.id` を渡す修正を実施。方向性は正しいが、以下の問題が残っている。

**残っている問題 1: `else` ブランチで無条件にエラーをクリアしてしまう**

`useSplitCalculator.ts:43-45`:

```ts
} else {
  setError(null)  // どちらのフィールドが valid でも無条件にエラーを消してしまう
}
```

`id` チェックはエラーを「セットする」部分には効いているが、「クリアする」部分に効いていない。そのため修正前と同じ状況（valid な nop をブラーすると total のエラーが消える）が再現される。

**残っている問題 2: フックが HTML の `id` 文字列に依存している**

`useSplitCalculator.ts:37-42`:

```ts
if ('error' in result && id === 'total') { ... }
else if ('error' in result && id === 'nop') { ... }
```

カスタムフック（ロジック層）が JSX の `id="total"` `id="nop"` という文字列を知っている状態になっている。JSX 側で `id` を変えるとフックが壊れる。フックは DOM の詳細に依存すべきではない。

また、`handleTotalChange(value, id)` / `handleNopChange(value, id)` はそれぞれ total/nop 専用のハンドラーなのに `id` を受け取っており、引数が冗長になっている。

**推奨する解決策**: エラー state を total/nop で分ける

```ts
const [totalError, setTotalError] = useState<string | null>(null)
const [nopError, setNopError] = useState<string | null>(null)
```

こうすれば `id` を渡す必要がなくなり、フックが DOM に依存しなくなる。表示側も各フィールドの直下にそれぞれのエラーを表示できる。

#### 修正レビュー（`totalError` / `nopError` に分けるアプローチ）

`totalError` / `nopError` の state 分離・各フィールド直下へのエラー表示・`handleReset` / `handleSubmit` のエラークリアは適切。ただし `validateAndSetError` の内部ロジックに新たなバグが生まれている。

**問題: `validateAndSetError` の条件分岐が機能しない**

`useSplitCalculator.ts:38-47`:

```ts
const validateAndSetError = (value: string) => {
  const result = validateInputToInteger(value)
  if ('error' in result && totalError) {      // ← totalError が null なら false
    setTotalError(result.error)
  } else if ('error' in result && nopError) { // ← nopError が null なら false
    setNopError(result.error)
  } else {
    setTotalError(null)
    setNopError(null)
  }
}
```

total が空の状態で初めてフォーカスを外したとき：

- `totalError` は `null`（まだ一度もエラーが出ていない）
- `'error' in result && totalError` → `true && null` → **false**
- `else` に入り `setTotalError(null)` → **エラーが一切セットされない**

「既にエラーが存在する場合のみエラーをセットする」という条件になってしまっているため、初回バリデーションが機能しない。

**根本原因**: `validateAndSetError` は「どちらのフィールドか」を知る手段がなく、現在のエラー state で推測しようとしているのが誤り。さらに `handleBlur` も両フィールドで共用されたまま（`SplitCalculator.tsx:22, 37`）なので、呼び出し元のフィールドを特定できない。

**推奨する修正**: フィールドごとに独立した validate 関数を作り、それぞれのハンドラーから呼び分ける

```ts
const validateTotal = (value: string) => {
  const result = validateInputToInteger(value)
  if ('error' in result) {
    setTotalError(result.error)
    setResultBase('ー')
  } else {
    setTotalError(null)
  }
}

const validateNop = (value: string) => {
  const result = validateInputToInteger(value)
  if ('error' in result) {
    setNopError(result.error)
    setResultRemainder('ー')
  } else {
    setNopError(null)
  }
}

const handleTotalChange = (value: string) => {
  setTotal(value)
  if (isTouched) validateTotal(value)
}

const handleNopChange = (value: string) => {
  setNop(value)
  if (isTouched) validateNop(value)
}

const handleBlurTotal = (value: string) => { setIsTouched(true); validateTotal(value) }
const handleBlurNop = (value: string) => { setIsTouched(true); validateNop(value) }
```

---

### 2. `handleSubmit` での result のリセットが非対称

`useSplitCalculator.ts:81-88`:

```ts
// total が無効な場合
setResultBase('ー')
return  // ← resultRemainder はリセットされない

// nop が無効な場合
setResultRemainder('ー')
return  // ← resultBase はリセットされない
```

**対処**: エラー時は `resultBase` と `resultRemainder` の両方をリセットする。

---

## 設計上の問題

### 3. エラーメッセージが汎用でない

`useSplitCalculator.ts:6`:

```ts
if (value.trim() === '') return { error: '価格を入力してください' }
```

`validateInputToInteger` は nop（人数）にも使われるが、エラーメッセージが「価格」になっている。

**対処**: ラベルを引数で渡すか、「値を入力してください」等の汎用メッセージに変える。

---

### 4. `React.SubmitEventHandler` の使用

`useSplitCalculator.ts:75`:

```ts
const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
```

`React.SubmitEventHandler` はあまり一般的でない型。コメントに「`FormEvent` は非推奨」とあるが、`React.FormEvent` は非推奨ではない。

**対処**: 標準的な書き方に変える。

```ts
const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
// または
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
```

---

## コード品質

### 5. コメントアウトされたコードが残っている

`SplitCalculator.tsx:20-21`, `34-35` に古い実装案がコメントとして残っている。判断が完了しているなら削除する。

---

### 6. `App.tsx` の型コメントが古い

`App.tsx:13`:

```ts
// ViewType は 'TaxCalculator' | 'BmiCalculator' のどちらかの型になる
```

SplitCalculator 追加後もコメントが更新されていない。`'SplitCalculator'` を追記する。

---

### 7. 結果表示のレイアウト

`SplitCalculator.tsx:53-58` で4要素を横並びにしているため、PCサイズではラベルと値が対応して見えない。

```tsx
// 現状
<div className="mt-6 flex flex-col md:flex-row md:justify-between">
  <p>支払い金額(一人当たり)</p>
  <p>{resultBase}円</p>
  <p>支払い金額(端数負担)</p>
  <p>{resultRemainder}円</p>
</div>
```

**対処**: ラベルと値をペアでグループ化する。

```tsx
<div className="mt-6 space-y-2">
  <div className="flex justify-between">
    <p>支払い金額(一人当たり)</p>
    <p>{resultBase}円</p>
  </div>
  <div className="flex justify-between">
    <p>支払い金額(端数負担)</p>
    <p>{resultRemainder}円</p>
  </div>
</div>
```

---

## 優先度まとめ

| 優先度 | 項目 | ファイル |
|--------|------|----------|
| 高 | バグ1: `handleBlur` のエラー上書き問題 | `useSplitCalculator.ts` |
| 高 | バグ2: `handleSubmit` の非対称リセット | `useSplitCalculator.ts` |
| 中 | エラーメッセージが「価格」固定 | `useSplitCalculator.ts` |
| 中 | `React.SubmitEventHandler` → `React.FormEventHandler` | `useSplitCalculator.ts` |
| 低 | コメントアウト削除 | `SplitCalculator.tsx` |
| 低 | 型コメント更新 | `App.tsx` |
| 低 | 結果表示レイアウト改善 | `SplitCalculator.tsx` |
