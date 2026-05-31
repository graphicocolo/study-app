/** @type {HTMLDivElement | null} */
const display = document.querySelector("#watchDisplay");

function displayTime (element) {
  setInterval(() => {
    const date = new Date();
    element.textContent = date.toLocaleString(); // 2026/5/30 15:24:58
    // element.textContent = date.toString(); // Sat May 30 2026 15:24:22 GMT+0900 (日本標準時)
  }, 10);
}

window.addEventListener("DOMContentLoaded", () => {
  const watchElement = display.appendChild(document.createElement("p"));
  displayTime(watchElement);
});