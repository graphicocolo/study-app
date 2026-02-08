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

// 入力欄のバリデーションメッセージ設定
priceInput.addEventListener("input", () => {
  if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity("税抜価格を入力してください");
  } else if (priceInput.validity.rangeUnderflow) {
    priceInput.setCustomValidity("税抜価格は1以上の数値を入力してください");
  } else {  
    priceInput.setCustomValidity(""); // バリデーションOK時は空文字にリセット
  }
});

// 消費税率欄のバリデーションメッセージ設定
taxRateSelect.addEventListener("input", () => {
  if (taxRateSelect.validity.valueMissing) {
    taxRateSelect.setCustomValidity("消費税率を選択してください");
  } else if (taxRateSelect.validity.rangeUnderflow || taxRateSelect.validity.rangeOverflow) {
    taxRateSelect.setCustomValidity("消費税率は8%または10%を選択してください");
  } else {  
    taxRateSelect.setCustomValidity(""); // バリデーションOK時は空文字にリセット
  }
});

// フォームが送信されたときの処理
taxForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  // バリデーションは、HTML属性 + Constraint Validation API の組み合わせで対応
  // parseIntは "100.5" を 100 として解析するため、暗黙的に切り捨てられる

  // ブラウザ標準のバリデーションチェック
  if (!taxForm.checkValidity()) {
    taxForm.reportValidity(); // ツールチップでエラーメッセージを表示
    return; // 早期リターン 条件を満たさない場合に早めに return して処理を抜ける」パターン
  }

  // 入力値を取得
  const price = parseInt(priceInput.value, 10); // 税抜価格 明示的に基数指定し10進数として解析
  // console.log(typeof price); // number
  const taxRate = parseInt(taxRateSelect.value, 10); // 消費税率
  // console.log(typeof taxRate); // number

  // 税込価格を計算
  const taxInPriceValue = Math.floor(price * (1 + taxRate / 100)); // 税込価格の端数処理（切り捨て）
  // console.log(typeof taxInPriceValue); // number

  // 結果を表示
  taxInPrice.textContent = `${taxInPriceValue.toLocaleString()}円`; // 桁区切り表示 1200 -> 1,200
});

taxForm.addEventListener("reset", () => {
  // 結果欄をクリア
  taxInPrice.textContent = "";
});