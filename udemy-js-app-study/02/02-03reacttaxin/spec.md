# 税込価格計算ミニアプリを React で作成

## 仕様

**UI要素**

- 価格入力欄 `input type="number"`
- 税率入力欄 `select`
- 実行ボタン `button`
- 税込価格表示

**UI**

TailwindCSS を使用

[Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)

**機能**

- フォーム入力
- バリデーション
- 税込計算
- 結果表示
- リセット

**ポイント**

- `useState` (身長・体重・結果の状態管理)
- フォームのイベントハンドリング (onSubmit, onChange)
- 条件付きレンダリング (バリデーションエラー表示)
- コンポーネント分割の考え方

**コードを書く前に**

  1. まず「何を作りたいか」を日本語で書く
  - 例：「税込価格を計算する計算機（リセット機能）」

  2. 次に「ユーザーが何をするか」を書き出す
  - 価格を入力
  - 税率を選択
  - 計算するボタンを押す
  - リセットボタンを押す

  3. 「画面に何が表示されるか」を書き出す
  - 価格入力欄
  - 税率選択欄
  - ボタン2つ（計算する、リセット）
  - 税込価格

  4. 「変化する値（状態）」を特定する
  - 価格 → useStateで管理
  - 税率 → useStateで管理
  - 税込価格 → useStateで管理

  5. ここで初めてコードを書き始める
  - まず空の関数を作り、stateを定義   
  - 型定義はこの段階で書くとよい（stateの型が決まるから）

  6. 機能を1つずつ追加

## 参照

- [クイックスタート](https://ja.react.dev/learn)
- [ゼロからの React アプリ構築](https://ja.react.dev/learn/build-a-react-app-from-scratch)
- [Create React App の非推奨化](https://ja.react.dev/blog/2025/02/14/sunsetting-create-react-app)