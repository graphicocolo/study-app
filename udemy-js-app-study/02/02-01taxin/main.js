// 税込価格計算
// 税抜価格欄と消費税率欄に数字を入力
// 計算するボタンを押すと税込価格が表示される

// ユーザーが行う操作
// 1. 税抜価格を入力 整数のみを想定
// 2. 消費税率を入力 10%と8%を選択可能
// 3. 計算するボタンを押す

// 画面に表示される内容
// 税込価格: 〇〇円

// プラスアルファの機能
// リセットボタンを押すと入力欄と結果欄がクリアされる

// HTMLの要素を取得
const priceInput = document.querySelector("#price");
const taxRateSelect = document.querySelector("#tax-rate");
const taxForm = document.querySelector("#tax-form");
const taxInPrice = document.querySelector("#tax-in-price");

// フォームが送信されたときの処理
taxForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止

  // 入力値を取得
  // バリデーションが必要
  // 文字列が入った場合、プラスやマイナスなどの記号が入った場合、小数点が入った場合、小文字以外の場合など
  if (priceInput.value === "" || isNaN(priceInput.value)) {
    alert("税抜価格には有効な数字を入力してください。");
    return;
  }
  const price = parseInt(priceInput.value, 10); // 税抜価格 明示的に10進数として解析
  // console.log(typeof price); // number
  const taxRate = parseInt(taxRateSelect.value, 10); // 消費税率
  // console.log(typeof taxRate); // number

  // 税込価格を計算
  const taxInPriceValue = Math.floor(price * (1 + taxRate / 100));
  // console.log(typeof taxInPriceValue); // number

  // 結果を表示
  taxInPrice.textContent = `${taxInPriceValue.toLocaleString()}円`;
});

taxForm.addEventListener("reset", () => {
  // 結果欄をクリア
  taxInPrice.textContent = "";
});