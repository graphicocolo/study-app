/** @type {HTMLDivElement | null} */
const display = document.querySelector("#countDisplay");

// トップレベル（関数・イベントリスナーの外）でグローバル変数として宣言し、複数のイベントリスナーから共有して使えるようにした
let count = 0;
let countUpId;

function countUp () {
  return ++count;
}

function displayCount (element) {
  element.textContent = count;
  return setInterval(() => {
    element.textContent = countUp();
  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  const countElement = display.appendChild(document.createElement("p"));
  countUpId = displayCount(countElement);
});

window.addEventListener("beforeunload", () => {
  clearInterval(countUpId);
});