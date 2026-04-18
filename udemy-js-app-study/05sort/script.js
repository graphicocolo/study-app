// HTML要素を取得
/** @type {HTMLFormElement | null} */ 
const submitForm = document.querySelector("#menuDisplayForm");
/** @type {HTMLParagraphElement | null} */
const element = document.querySelector("#menu");

// メニューデータ
const menuData = ['コーヒー', 'トースト', 'パフェ']

/**
 * データをリストで表示
 * @param {Array} data 配列
 * @param {HTMLElement} listElement DOM要素
 * @returns {void}
 */
function listInsertData (data, listElement) {
  if (data.length === 0) return;
  for (let i = 0; i < data.length; i++) { // i 宣言には必ず let をつける
    const listElementItem = document.createElement("li")
    listElementItem.textContent = `「${data[i]}」`
    listElement.appendChild(listElementItem)
  }
}

// フォームが送信されたときの処理
submitForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止
  if (element.hasChildNodes()) element.replaceChildren() // 連打対策
  // 上記が連打対策になる理由は、毎回まず中身を空にしてから新しいリストを生成するため、前のリストが残ることがないから。
  const menuList = document.createElement("ul") // HTML要素を生成
  element.append(menuList) // 生成した要素を挿入
  listInsertData(menuData, menuList)
})

// リセット処理
submitForm.addEventListener("reset", () => {
  // element.innerHTML = "" // HTMLパースが走る
  // element.textContent = "" // HTMLパースが走らない、やや高速
  element.replaceChildren()
})