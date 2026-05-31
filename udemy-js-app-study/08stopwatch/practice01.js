/** @type {HTMLDivElement | null} */
const display = document.querySelector("#watchDisplay");

// トップレベル（関数・イベントリスナーの外）でグローバル変数として宣言し、複数のイベントリスナーから共有して使えるようにした
let timeId;

function displayTime (element) {
    return setInterval(() => {
    const date = new Date();
    element.textContent = date.toLocaleString(); // 2026/5/30 15:24:58
    // element.textContent = date.toString(); // Sat May 30 2026 15:24:22 GMT+0900 (日本標準時)
  }, 10);
}

window.addEventListener("DOMContentLoaded", () => {
  const watchElement = display.appendChild(document.createElement("p"));
  timeId = displayTime(watchElement);
});

window.addEventListener("beforeunload", () => {
  clearInterval(timeId);
});