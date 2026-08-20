import { useState } from 'react'
import Study01JsxFruitRow from "@/components/Study01JsxFruitRow";

export default function Study01Jsx() {
  const name = "Alice";
  const isLoggedIn = true;
  const hasItems = false;
  const showBadge = 0;
  const fruits = ["apple", "banana", "orange"];
  // const fruits = ["banana", "orange"]
  // const fruits = ["apple", "orange"]
  const [otherFruits, setOtherFruits] = useState(["apple", "banana", "orange"]);

  return (
    // エラー
    // <h1>A</h1>
    // <p>B</p>

    // ① JSX の基本ルールを確認する fragment
    <>
      <h1>A</h1>
      <p>B<br />CDEF</p>
      {/* ② `{}` に式を埋め込む */}
      {/* {...}には式（変数・演算・三項演算子・関数呼び出しなど）しか書けない if / switch などの「文」は書けない */}
      <p>こんにちは、{name} さん</p>
      <p>1 + 2 = {1 + 2}</p>
      <p>{isLoggedIn ? "ログイン中" : "未ログイン"}</p>
      {/* ③ 属性の書き方を確認する */}
      <div className="card bg-amber-50">
        <p>カード</p>
      </div>
      <div style={{ backgroundColor : "#fafafa", margin : "10px", padding : "10px" }}>
        <p>styleの指定</p>
      </div>
      <div className="mx-auto p-4 max-w-sm">
        {/* イベントハンドラはキャメルケースで関数を渡す */}
        <button onClick={() => alert("clicked!")} className="mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">クリック</button>
      </div>
      {/* ④ 条件レンダリング */}
      <p>{hasItems ? "商品あり" : "商品なし"}</p>
      {/* <p>{showBadge && <span>NEW</span>}</p> ←この書き方だと0が表示される場合がある */}
      <p>{!!showBadge && <span>NEW</span>}</p>
      <p>{showBadge ? <span>NEW</span> : null}</p>
      {/* ⑤ リストのレンダリング */}
      <ul>
        {fruits.map((fruit, index) => <li key={index}>{fruit}</li>)}
      </ul>
      {/* <ul>
        {fruits.map((fruit) => <li key={fruit}>{fruit}</li>)}
      </ul> */}
      {/* ⑤ リストのレンダリング 違いを体感する実験 */}
      <ul>
        {otherFruits.map((fruit, index) => (
          <Study01JsxFruitRow key={index} fruit={fruit} />
        ))}
        {/* {otherFruits.map((fruit) => (
          <Study01JsxFruitRow key={fruit} fruit={fruit} />
        ))} */}
      </ul>
      <button onClick={() => setOtherFruits(otherFruits.slice(1))}>先頭を削除</button>
    </>
    // <div className="mx-auto p-4 max-w-sm">
    //   <h1 className="text-2xl font-bold mb-4">BMI計算</h1>
    //   <div className="mt-6 flex flex-col md:flex-row md:justify-between">
    //     <p className="text-base">あなたのBMI</p>
    //   </div>
    // </div>
  );
}