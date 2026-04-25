// コードの構成
// 1. HTMLの要素を取得
// 2. 入力フィールドの情報をオブジェクトの配列としてまとめる
// 3. submitボタン状態の切り替え関数を定義する
// 4. バリデーション関数を定義する
//   - 空文字バリデーション
//   - 入力値バリデーション（0〜100の範囲であることを確認）
// 5. 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新する
//   - blur イベント
//   - input イベント
// 6. フォームの送信イベントをキャッチして、各教科の点数をソート（降順、昇順）して表示する
// 7. フォームのリセットイベントをキャッチして、結果欄をクリアする

// HTML要素を取得
/** @type {HTMLInputElement | null} */ 
const kokugoInput = document.querySelector("#kokugo");
const sugakuInput = document.querySelector("#sugaku");
const shakaiInput = document.querySelector("#shakai");
const rikaInput = document.querySelector("#rika");
const eigoInput = document.querySelector("#eigo");
/** @type {HTMLParagraphElement | null} */
const kokugoError = document.querySelector("#kokugo-error");
const sugakuError = document.querySelector("#sugaku-error");
const shakaiError = document.querySelector("#shakai-error");
const rikaError = document.querySelector("#rika-error");
const eigoError = document.querySelector("#eigo-error");
/** @type {HTMLButtonElement | null} */
const submitButton = document.querySelector("button[type='submit']");
/** @type {HTMLFormElement | null} */
const form = document.querySelector("#scoreForm");
/** @type {HTMLDivElement | null} */
const resultDescending = document.querySelector("#result-descending");
/** @type {HTMLDivElement | null} */
const resultAscending = document.querySelector("#result-ascending");

// 入力フィールドの情報をオブジェクトの配列としてまとめる
const inputFields = [
  { element: kokugoInput, displayName: "国語", errorElement: kokugoError },
  { element: sugakuInput, displayName: "数学", errorElement: sugakuError },
  { element: shakaiInput, displayName: "社会", errorElement: shakaiError },
  { element: rikaInput, displayName: "理科", errorElement: rikaError },
  { element: eigoInput, displayName: "英語", errorElement: eigoError }
];

// submit ボタンの初期状態を設定
/**
 * submit ボタン状態の切り替え
 * @param {boolean} enabled 活性化状態かどうか
 * @returns {void}
 */
function setSubmitEnabled(enabled) {
  submitButton.disabled = !enabled;
  submitButton.classList.toggle("bg-gray-400", !enabled);
  submitButton.classList.toggle("cursor-not-allowed", !enabled);
  submitButton.classList.toggle("bg-sky-600", enabled);
  submitButton.classList.toggle("cursor-pointer", enabled);
}
setSubmitEnabled(false); // 初期状態は非活性化

/**
 * 空文字バリデーション
 * @param {HTMLInputElement} element DOM要素
 * @param {string} fieldName フィールド名（例: "ユーザー名", "メールアドレス"）
 * @param {HTMLParagraphElement} errorElement エラーメッセージを表示する  要素
 * @returns {boolean} バリデーション結果
 */
function validateNotEmpty(element, fieldName, errorElement) {
  if (element.value.trim() === "") {
    errorElement.textContent = `${fieldName}を入力してください`;
    return false;
  }
  return true;
}

/**
 * 入力値バリデーション
 * @param {HTMLInputElement} element DOM要素
 * @param {string} fieldName フィールド名（例: "ユーザー名", "メールアドレス"）
 * @param {HTMLParagraphElement} errorElement エラーメッセージを表示する  要素
 * @returns {boolean} バリデーション結果
 */
function validateScoreRange(element, fieldName, errorElement) {
  if (!validateNotEmpty(element, fieldName, errorElement)) return false;
  const value = parseInt(element.value, 10);
  if (isNaN(value) || value < 0 || value > 100) {
    errorElement.textContent = `${fieldName}は0〜100の範囲で入力してください`;
    return false;
  }
  return true;
}

// 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新
inputFields.forEach(({ element, displayName, errorElement }) => {
  element.addEventListener("blur", () => {
    validateScoreRange(element, displayName, errorElement);
  });
});

// input イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新し、submit ボタンの活性化/非活性化を制御
inputFields.forEach(({ element, displayName, errorElement }) => {
  element.addEventListener("input", () => {
    // すでにエラーメッセージが表示されているフィールドに再度正当な値の入力があった場合、エラーメッセージをクリアする
    if (errorElement.textContent !== "") {
      errorElement.textContent = "";
      validateScoreRange(element, displayName, errorElement);
    }
    const allFilled = inputFields.every((field) => field.element.value.trim() !== "");
    setSubmitEnabled(allFilled);
  });
});

// フォームが送信されたときの処理
form.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  // 連打対策
  if (resultDescending.hasChildNodes()) resultDescending.replaceChildren();
  if (resultAscending.hasChildNodes()) resultAscending.replaceChildren();

  // 入力フィールドのいずれかが空の場合、処理を中断する
  // ボタンが `disabled` の間は submit イベントが発火しないため、このガードは通常到達しない。ただし、ブラウザのデベロッパーツールでボタンを強制的に有効化された場合のフェイルセーフとして残しておくのは問題ない。
  if (inputFields.some(({ element }) => element.value === "")) {
    return;
  }

  const scores = inputFields.map(({ element, displayName }) => ({
    displayName,
    value: parseInt(element.value, 10)
  }));
  const descScores = [...scores].sort((a, b) => b.value - a.value); // 降順
  const ascScores = [...scores].sort((a, b) => a.value - b.value); // 昇順
  const descScoreList = document.createElement("ul");
  resultDescending.appendChild(descScoreList);
  descScores.forEach(({ displayName, value }) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${displayName}: ${value}`;
    descScoreList.appendChild(listItem);
  });
  const ascScoreList = document.createElement("ul");
  resultAscending.appendChild(ascScoreList);
  ascScores.forEach(({ displayName, value }) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${displayName}: ${value}`;
    ascScoreList.appendChild(listItem);
  });
});

// フォームのリセットイベントをキャッチして、結果欄をクリアする
form.addEventListener("reset", () => {
  if (resultDescending.hasChildNodes()) resultDescending.replaceChildren(); // 連打対策
  if (resultAscending.hasChildNodes()) resultAscending.replaceChildren(); // 連打対策
  inputFields.forEach(({ errorElement }) => {
    if (errorElement.textContent !== "") {
      errorElement.textContent = ""; // エラーメッセージ欄をクリア
    }
  });
  setSubmitEnabled(false); // submit ボタンを非活性化
});