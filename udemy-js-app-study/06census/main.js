// 思考の軌跡
// 各関数を作成
// 受け取った配列データの一つ一つに対して行うこと
// ・各値を変数に代入
// 総数 data[1].[2]
// 男性総数 data[1].[3]
// 女性総数 data[1].[4]
// ・比率関数を使って男性女性それぞれの比率を計算 ratioCalculate()
// ・計算した比率を配列の末尾に追加

// 比率追加後の配列に対して行うこと
// ・男性比率で降順にソート sortByValueDescending()
// ・女性比率で降順にソート sortByValueDescending()
// ・ソートした配列をテーブルの形に描画（順位・都道府県名・比率）

// コードの構成
// 1. HTMLの要素を取得
// 2. jsonからデータを取得
// 3. 定数を定義
// 4. 各関数を作成
//  - 比率計算関数
//  - 比率追加関数
//  - ソート関数
//  - テーブル描画関数
//  - ランキングテーブル作成関数
// 5. ページが読み込まれたら男性ランキングを表示
// 6. ボタンがクリックされたときの処理

// 各関数の役割と関係
// 比率計算 ratioCalculate() 男性総数もしくは女性総数 / 総数 * 100 の計算のみを行う
// 比率追加 addRatioToData() ratioCalculate() を呼び出して結果を配列の末尾に追加
//  - 比率計算 ratioCalculate()
// ランキングテーブル作成 createRankingTable() 各関数を呼び出してランキングテーブルを作成 各関数のファサード関数
//  - 比率追加 addRatioToData()
//  - ソート sortByValueDescending()
//  - テーブル描画 renderTable()

// 1. HTMLの要素を取得
/** @type {HTMLButtonElement | null} */
const maleRankingButton = document.querySelector("#maleRankingSubmit");
/** @type {HTMLButtonElement | null} */
const femaleRankingButton = document.querySelector("#femaleRankingSubmit");
/** @type {HTMLDivElement | null} */
const result = document.querySelector("#result");

// 2. jsonからデータを取得
async function fetchCensusData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("エラー:", error);
    return null;
  }
}

// 3. 定数を定義
const MALE_RATIO_INDEX = 7;
const FEMALE_RATIO_INDEX = 8;
const MALE_RATIO = 1;
const FEMALE_RATIO = 2;

// 4. 各関数を作成
/**
 * 比率計算
 * @param {string} part 分子
 * @param {string} total 分母
 * @returns {string} 比率（小数点以下1桁）
 */
function ratioCalculate (part, total) {
  const ratio = (parseInt(part, 10) / parseInt(total, 10)) * 100;
  return ratio.toFixed(1);
}

/**
 * 比率追加
 * @param {Array} array 配列データ
 * @returns {Array} 比率追加後の配列
 */
function addRatioToData (array) {
  return [...array].map((item) => {
    const totalPopulation = item[2];
    const malePopulation = item[3];
    const femalePopulation = item[4];
    const maleRatio = ratioCalculate(malePopulation, totalPopulation);
    const femaleRatio = ratioCalculate(femalePopulation, totalPopulation);
    return [...item, maleRatio, femaleRatio];
  });
}

/**
 * ソート
 * @param {Array} array 配列データ
 * @param {number} index ソート対象のインデックス
 * @returns {Array} ソート後の配列
 */
function sortByValueDescending (array, index) {
  const sortedArray = [...array].sort((a, b) => b[index] - a[index]);
  return sortedArray;
}

/**
 * テーブル描画
 * @param {Array} sortedArray ソート後の配列データ
 * @param {number} ratioIndex 比率インデックス 1: 男性比率 2: 女性比率
 */
function renderTable (sortedArray, ratioIndex) {
  const tableElement = document.createElement("table");
  tableElement.setAttribute("class", "mt-4 table-auto w-full text-center");
  const headerRow = document.createElement("tr");
  headerRow.setAttribute("class", "bg-gray-200");
  const rankHeader = document.createElement("th");
  rankHeader.setAttribute("class", "p-2");
  rankHeader.textContent = "順位";
  const areaHeader = document.createElement("th");
  areaHeader.setAttribute("class", "p-2");
  areaHeader.textContent = "都道府県名";
  const ratioHeader = document.createElement("th");
  ratioHeader.setAttribute("class", "p-2");
  ratioHeader.textContent = "比率";
  headerRow.append(rankHeader, areaHeader, ratioHeader);
  tableElement.appendChild(headerRow);
  result.appendChild(tableElement);
  sortedArray.forEach((item, index) => {
    const row = document.createElement("tr");
    row.setAttribute("class", "border-b border-gray-200")
    const rankCell = document.createElement("td");
    rankCell.setAttribute("class", "p-2");
    const areaCell = document.createElement("td");
    areaCell.setAttribute("class", "p-2");
    const ratioCell = document.createElement("td");
    ratioCell.setAttribute("class", "p-2");
    rankCell.textContent = `${index + 1}位`;
    areaCell.textContent = item[0];
    if (ratioIndex === 1) {
      ratioCell.textContent = `${item[7]}%`;
    } else {
      ratioCell.textContent = `${item[8]}%`;
    }
    row.append(rankCell, areaCell, ratioCell);
    tableElement.appendChild(row);
  });
}

/**
 * ランキングテーブル作成
 * @param {Array} array 配列データ
 * @param {number} index ソート対象のインデックス
 * @param {number} ratioIndex 比率インデックス 1: 男性比率 2: 女性比率
 */
function createRankingTable (array, index, ratioIndex) {
  if (result.hasChildNodes()) result.replaceChildren();

  const ratioAddedData = addRatioToData(array);
  const sortedData = sortByValueDescending(ratioAddedData, index);
  const title = document.createElement("h2");
  title.setAttribute("class", "text-lg font-bold mb-6 text-center pt-8");
  result.appendChild(title);
  if (ratioIndex === 1) {
    title.textContent = "男性比率ランキング";
  } else if (ratioIndex === 2) {
    title.textContent = "女性比率ランキング";
  }
  renderTable(sortedData, ratioIndex);
}

// 5. ページが読み込まれたら男性ランキングを表示
let censusData = null; // await はトップレベルでは（モジュール形式でない場合）使えないため、変数を宣言するだけ
window.addEventListener("DOMContentLoaded", async () => {
  censusData = await fetchCensusData(); // ここでデータ取得 以降データ使い回し
  createRankingTable(censusData, MALE_RATIO_INDEX, MALE_RATIO);
});

// 6. ボタンがクリックされたときの処理
maleRankingButton.addEventListener("click", () => {
  createRankingTable(censusData, MALE_RATIO_INDEX, MALE_RATIO);
});

femaleRankingButton.addEventListener("click", () => {
  createRankingTable(censusData, FEMALE_RATIO_INDEX, FEMALE_RATIO);
});