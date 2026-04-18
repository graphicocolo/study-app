// コードの構成
// 1. HTMLの要素を取得、初期状態を設定する
// 2. バリデーションを設定する
// 3. フォームの送信イベントをキャッチして、各教科の点数をソート（降順、昇順）して表示する
// 4. フォームのリセットイベントをキャッチして、結果欄をクリアする

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
/** @type {HTMLFormElement | null} */
const form = document.querySelector("#scoreForm");
/** @type {HTMLDivElement | null} */
const resultDescending = document.querySelector("#result-descending");
/** @type {HTMLDivElement | null} */
const resultAscending = document.querySelector("#result-ascending");

// 入力フィールドの情報をオブジェクトの配列としてまとめる
const inputFields = [
  { element: kokugoInput, name: "kokugo", displayName: "国語", errorElement: kokugoError },
  { element: sugakuInput, name: "sugaku", displayName: "数学", errorElement: sugakuError },
  { element: shakaiInput, name: "shakai", displayName: "社会", errorElement: shakaiError },
  { element: rikaInput, name: "rika", displayName: "理科", errorElement: rikaError },
  { element: eigoInput, name: "eigo", displayName: "英語", errorElement: eigoError }
];

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
  const value = parseInt(element.value);
  if (isNaN(value) || value < 0 || value > 100) {
    errorElement.textContent = `${fieldName}は0〜100の範囲で入力してください`;
    return false;
  }
  return true;
}

// 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新
inputFields.forEach(({ element, name, displayName }) => {
  element.addEventListener("blur", () => {
    const errorElement = document.getElementById(`${name.toLowerCase()}-error`);
    validateScoreRange(element, displayName, errorElement);
  });
});

// すでにエラーメッセージが表示されているフィールドに再度正当な値の入力があった場合、エラーメッセージをクリアする
// 501 と入力された場合、エラーメッセージが表示される。次に、50 と入力された場合、エラーメッセージがクリアされる。というように挙動を変更したい
inputFields.forEach(({ element, name }) => {
  element.addEventListener("input", () => {
    const errorElement = document.getElementById(`${name.toLowerCase()}-error`);
    if (errorElement.textContent !== "") {
      errorElement.textContent = "";
      validateScoreRange(element, name, errorElement);
    }
  });
});

// フォームが送信されたときの処理
form.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  if (resultDescending.hasChildNodes()) resultDescending.replaceChildren() // 連打対策
  if (resultAscending.hasChildNodes()) resultAscending.replaceChildren() // 連打対策

  const scores = inputFields.map(({ element, name , displayName}) => ({
    name,
    displayName,
    value: element.value ? parseInt(element.value) : 0
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
  if (resultDescending.hasChildNodes()) resultDescending.replaceChildren() // 連打対策
  if (resultAscending.hasChildNodes()) resultAscending.replaceChildren() // 連打対策
  if (inputFields.some(({ element }) => element.value !== "")) {
    inputFields.forEach(({ element }) => element.value = ""); // 入力フィールドを空にする
  }
  inputFields.forEach(({ errorElement }) => {
    if (errorElement.textContent !== "") {
      errorElement.textContent = ""; // エラーメッセージ欄をクリア
    }
  });
});