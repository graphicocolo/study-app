// BMI計算
// 身長欄と体重欄に数字を入力
// 計算するボタンを押すとBMIが表示される

// ユーザーが行う操作
// 1. 身長を入力 整数のみを想定
// 2. 体重を入力 整数のみを想定
// 3. 計算するボタンを押す

// 画面に表示される内容
// BMI: 小数点第一位まで表示

// プラスアルファの機能
// リセットボタンを押すと入力欄と結果欄がクリアされる

// HTMLの要素を取得
const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");
const bmiForm = document.querySelector("#bmi-form");
const bmiResult = document.querySelector("#bmi-result");

// 初期状態では、結果欄は「ー」と表示
bmiResult.textContent = "ー";

// 入力欄のバリデーションメッセージ設定
heightInput.addEventListener("input", () => {
  if (heightInput.validity.valueMissing) {
    heightInput.setCustomValidity("身長を入力してください");
  } else if (heightInput.validity.rangeUnderflow) {
    heightInput.setCustomValidity("身長は1以上の数値を入力してください");
  } else {  
    heightInput.setCustomValidity(""); // バリデーションOK時は空文字にリセット
  }
});

weightInput.addEventListener("input", () => {
  if (weightInput.validity.valueMissing) {
    weightInput.setCustomValidity("体重を入力してください");
  } else if (weightInput.validity.rangeUnderflow) {
    weightInput.setCustomValidity("体重は1以上の数値を入力してください");
  } else {  
    weightInput.setCustomValidity(""); // バリデーションOK時は空文字にリセット
  }
});

// フォームが送信されたときの処理
bmiForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  // バリデーションは、HTML属性 + Constraint Validation API の組み合わせで対応

  // ブラウザ標準のバリデーションチェック
  if (!bmiForm.checkValidity()) {
    bmiForm.reportValidity(); // ツールチップでエラーメッセージを表示
    return; // 早期リターン 条件を満たさない場合に早めに return して処理を抜ける」パターン
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