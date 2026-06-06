// 1秒ごとに経過秒を表示
/** @type {HTMLDivElement | null} */
const display = document.querySelector("#secondsDisplay");

// トップレベル（関数・イベントリスナーの外）でグローバル変数として宣言し、複数のイベントリスナーから共有して使えるようにした
let countUpId;

function displayCount (element) {
  element.textContent = "カウントスタート...";
  const timeStart = Date.now();
  return setInterval(() => {
    const timeNow = Date.now();
    const diffSeconds = timeNow - timeStart;
    const convertedSeconds = Math.floor(diffSeconds / 1000);
    element.textContent = `${convertedSeconds}秒経過...`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  const countElement = display.appendChild(document.createElement("p"));
  countUpId = displayCount(countElement);
});

window.addEventListener("beforeunload", () => {
  clearInterval(countUpId);
});