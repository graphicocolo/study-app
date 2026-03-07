// 割り勘計算
// 総額欄と人数欄に数字を入力
// 計算するボタンを押すと2つの支払い金額が表示される
// 支払い金額(一人当たり)
// 支払い金額(端数負担者)

// ユーザーが行う操作
// 1. 総額を入力 整数のみを想定
// 2. 人数を入力 整数のみを想定
// 3. 計算するボタンを押す

// 画面に表示される内容
// 支払い金額: 小数点は表示させない

// プラスアルファの機能
// リセットボタンを押すと入力欄と結果欄がクリアされる

// コードの構成
// 1. HTMLの要素を取得、初期状態を設定する
// 2. バリデーションを設定する
// 3. フォームの送信イベントをキャッチして、支払い金額を計算して表示する
// 4. フォームのリセットイベントをキャッチして、結果欄をクリアする

// HTMLの要素を取得
const totalInput = document.querySelector("#total");
const nopInput = document.querySelector("#nop");
const splitForm = document.querySelector("#split-form");
const baseResult = document.querySelector("#result-base");
const remainderResult = document.querySelector("#result-remainder");

// 初期状態では、結果欄は「ー」と表示
const DEFAULT_RESULT = "ー";
baseResult.textContent = DEFAULT_RESULT;
remainderResult.textContent = DEFAULT_RESULT;

// バリデーションメッセージを設定する関数
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
heightInput.addEventListener("input", () => setValidationMessage(heightInput, "身長"));
weightInput.addEventListener("input", () => setValidationMessage(weightInput, "体重"));

// フォームが送信されたときの処理
bmiForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  // バリデーションは、HTML属性 + Constraint Validation API の組み合わせで対応

  // ブラウザ標準のバリデーションチェック
  if (!bmiForm.checkValidity()) {
    bmiForm.reportValidity(); // ツールチップでエラーメッセージを表示
    return; // 早期リターン 「 条件を満たさない場合に早めに return して処理を抜ける」パターン
  }

  // 入力値を取得
  // parseIntは "100.5" を 100 として解析するため、暗黙的に切り捨てられる
  const height = parseInt(heightInput.value, 10); // 身長 明示的に基数指定し10進数として解析
  const weight = parseInt(weightInput.value, 10); // 体重 明示的に基数指定し10進数として解析

  // 身長数値変換（cm -> m）
  const heightInMeters = height / 100;

  // BMIを計算
  const bmi = weight / (heightInMeters ** 2);

  // 結果を表示（小数点第一位まで表示）
  bmiResult.textContent = bmi.toFixed(1);
});

bmiForm.addEventListener("reset", () => {
  // 結果欄をクリア
  bmiResult.textContent = "ー";
});