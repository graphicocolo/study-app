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
