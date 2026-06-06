// コードの構成
// 1. HTMLの要素を取得
// 2. 変数・定数・初期値定義
// 3. 関数定義
// 4. イベントハンドラ

// 1. HTMLの要素を取得
/** @type {HTMLSpanElement | null} */
const hourDisplay = document.querySelector("#hour");
/** @type {HTMLSpanElement | null} */
const minuteDisplay = document.querySelector("#minute");
/** @type {HTMLSpanElement | null} */
const secondDisplay = document.querySelector("#second");
/** @type {HTMLButtonElement | null} */
const startButton = document.querySelector("#startButton");
/** @type {HTMLButtonElement | null} */
const stopButton = document.querySelector("#stopButton");
/** @type {HTMLButtonElement | null} */
const resetButton = document.querySelector("#resetButton");

// 2. 変数・定数・初期値定義
let intervalId = null;

// 3. 関数定義
// 時間表示初期化
function initialDisplay () {
  hourDisplay.textContent = "00";
  minuteDisplay.textContent = "00";
  secondDisplay.textContent = "00";
}
initialDisplay();
function startWatch (timeStart) {
  // const timeStart = Date.now();
  if (intervalId === null) {
    intervalId = setInterval(() => {
      const diffMs = Date.now() - timeStart;
      const totalSeconds = Math.floor(diffMs / 1000); // 経過時間をミリ秒から秒へ
      if (totalSeconds > 3600) {
      // if (totalSeconds > 10) {
        stopWatch();
        intervalId = null;
        return;
      }
      // 時間を算出
      const hours = Math.floor(totalSeconds / 3600);
      // 3600 = 60秒（1分）× 60分（1時間）で割ると1時間未満の秒数が算出
      // さらにその秒数を60で割って分を出す
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      hourDisplay.textContent = hours.toString().padStart(2, "0");
      minuteDisplay.textContent = minutes.toString().padStart(2, "0");
      secondDisplay.textContent = seconds.toString().padStart(2, "0");
      // console.log(typeof intervalId);
    }, 1000);
  }
}
function stopWatch () {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
// 一度ストップボタンを押した後、再度スタートボタンを押すと時間がリセットされてしまう
// ストップ時のカウントを保持したまま再度カウントをスタートさせるにはどうしたら良いか

// 4. イベントハンドラ
startButton.addEventListener("click", () => {
  const timeStart = Date.now();
  startWatch(timeStart);
});
stopButton.addEventListener("click", () => {
  stopWatch();
});
resetButton.addEventListener("click", () => {
  stopWatch();
  initialDisplay();
});
window.addEventListener("beforeunload", () => {
  clearInterval(intervalId);
});