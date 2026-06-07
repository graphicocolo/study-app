// コードの構成
// 1. HTMLの要素を取得
// 2. 変数・定数・初期値定義
// 3. 関数定義
// 4. イベントハンドラ

// 1. HTMLの要素を取得
/** @type {HTMLSpanElement | null} */
const minuteDisplay = document.querySelector("#minute");
/** @type {HTMLSpanElement | null} */
const secondDisplay = document.querySelector("#second");
/** @type {HTMLSpanElement | null} */
const millSecondDisplay = document.querySelector("#millsecond");
/** @type {HTMLButtonElement | null} */
const startButton = document.querySelector("#startButton");
/** @type {HTMLButtonElement | null} */
const stopButton = document.querySelector("#stopButton");
/** @type {HTMLButtonElement | null} */
const resetButton = document.querySelector("#resetButton");

// 2. 変数・定数・初期値定義
let intervalId = null;
let timeStart = 0; // スタート時間
let pausedElapsedMs = 0; // ストップ時点での経過時間

// 3. 関数定義
// 時間初期化
function initialTimes () {
  hourDisplay.textContent = "00";
  minuteDisplay.textContent = "00";
  secondDisplay.textContent = "00";
}
initialTimes();

// ストップウォッチをスタート
function startWatch () {
  if (intervalId !== null) return;

  // 単位を揃えて現在の時間から経過時間を引く
  timeStart = Date.now() - pausedElapsedMs;
  intervalId = setInterval(() => {
    const diffMs = Date.now() - timeStart; // インターバルごとの経過時間（ミリ秒）
    const totalSeconds = Math.floor(diffMs / 1000); // 経過時間をミリ秒から秒へ
    // ストップウォッチの最大計測時間を設定 ストップウォッチは 01:00:00 で止まる
    // 00:59:59 で止めたい場合は、totalSeconds >= 3600 とする
    if (totalSeconds > 3600) {
      stopWatch();
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
  }, 1000);
}
// ストップウォッチをストップ
function stopWatch () {
  if (intervalId === null) return;
  pausedElapsedMs = Date.now() - timeStart; // ストップした時点での経過時間
  clearInterval(intervalId);
  intervalId = null;
}
// リセットのファサード
function resetWatch () {
  stopWatch();
  initialTimes();
  pausedElapsedMs = 0;
}

// 4. イベントハンドラ
startButton.addEventListener("click", startWatch); // startWatchには()をつけない（()ありだと登録時点で実行されてしまうため）
stopButton.addEventListener("click", stopWatch);
resetButton.addEventListener("click", resetWatch);
window.addEventListener("beforeunload", resetWatch);