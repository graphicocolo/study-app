// コードの構成
// 1. HTMLの要素を取得、初期状態を設定する
// 2. バリデーションを設定する
// 3. フォームの送信イベントをキャッチして、支払い金額を計算して表示する
// 4. フォームのリセットイベントをキャッチして、結果欄をクリアする

// HTML要素を取得
/** @type {HTMLInputElement | null} */ 
const totalInput = document.querySelector("#total");
/** @type {HTMLInputElement | null} */ 
const nopInput = document.querySelector("#nop");
/** @type {HTMLFormElement | null} */ 
const splitForm = document.querySelector("#split-form");
/** @type {HTMLParagraphElement | null} */
const baseResult = document.querySelector("#result-base");
/** @type {HTMLParagraphElement | null} */
const remainderResult = document.querySelector("#result-remainder");

/** 結果欄の初期表示文字 */
const DEFAULT_RESULT = "ー";
baseResult.textContent = DEFAULT_RESULT;
remainderResult.textContent = DEFAULT_RESULT;

/**
 * バリデーションメッセージを設定
 * @param {HTMLInputElement} element DOM要素
 * @param {string} fieldName フィールド名（例: "総額", "人数"）
 * @returns {void}
 */
function setValidationMessage(element, fieldName) {
  if (element.validity.valueMissing) {
    element.setCustomValidity(`${fieldName}を入力してください`);
  } else if (element.validity.rangeUnderflow) {
    element.setCustomValidity(`${fieldName}は1以上の数値を入力してください`);
  } else {  
    element.setCustomValidity(""); // バリデーションOK時は空文字にリセット
  }
}

// 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新
totalInput.addEventListener("input", () => setValidationMessage(totalInput, "総額"));
nopInput.addEventListener("input", () => setValidationMessage(nopInput, "人数"));

// フォームが送信されたときの処理
splitForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  // バリデーションは、HTML属性 + Constraint Validation API の組み合わせで対応

  // ブラウザ標準のバリデーションチェック
  if (!splitForm.checkValidity()) {
    splitForm.reportValidity(); // ツールチップでエラーメッセージを表示
    return; // 早期リターン 「 条件を満たさない場合に早めに return して処理を抜ける」パターン
  }

  // 入力値を取得
  // parseIntは "100.5" を 100 として解析するため、暗黙的に切り捨てられる
  const total = parseInt(totalInput.value, 10); // 総額 明示的に基数指定し10進数として解析
  const nop = parseInt(nopInput.value, 10); // 人数 明示的に基数指定し10進数として解析

  // 支払い金額(一人当たり)を計算
  const resultBase = Math.floor(total / nop);

  // 支払い金額(端数負担)を計算
  const resultRemainder = resultBase + (total - (resultBase * nop));

  // 結果を表示
  baseResult.textContent = `${resultBase}円`;
  remainderResult.textContent = `${resultRemainder}円`;
});

splitForm.addEventListener("reset", () => {
  // 結果欄をクリア
  baseResult.textContent = DEFAULT_RESULT;
  remainderResult.textContent = DEFAULT_RESULT;
});