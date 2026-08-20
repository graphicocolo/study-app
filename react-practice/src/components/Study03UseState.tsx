import { useState } from "react";

export default function Study03UseState() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>(["item1"]);
  const [spreadItems, setSpreadItems] = useState<string[]>(["item1"]);

  // ③ 複数の state を扱う
  // state をそれぞれ個別に持つ場合
  // const [name, setName] = useState("");
  // const [age, setAge] = useState(0);
  // state を1つのオブジェクトにまとめる場合
  // const [profile, setProfile] = useState({ name: "", age: 0 });
  // setProfile({ ...profile, name: "Alice" });
  // ⑤ 初期値の遅延評価
  function heavyCalculation() {
    console.log("計算実行");
    return 42;
  }
  // useState の引数に関数を直接書くと毎回評価されるが、() => ... の形で渡すと初回だけ評価される
  // 通常の初期化（毎回のレンダリングで実行されてしまう重い処理の例）毎回ログが出る
  // const [value, setValue] = useState(heavyCalculation());
  // 遅延初期化（初回レンダリング時にしか実行されない）
  const [value, setValue] = useState(() => heavyCalculation());

  // ⑥ フォーム入力と state を連動させる（controlled input）
  const [text, setText] = useState("");
  return (
    <div className="mx-auto p-4 max-w-sm">
      {/* ① 最小のカウンターを作る */}
      <p>カウント {count}</p>
      <button onClick={() => setCount(count + 1)} className="mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">+1</button>
      {/* ② 直接更新 vs 関数型更新 */}
      <p className="mt-6">直接更新のボタン</p>
      <button onClick={() => {
        setCount(count + 1);
        setCount(count + 1);
      }} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">+2 のつもり</button>
      <p className="mt-6">関数型更新のボタン</p>
      <button onClick={() => {
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
      }} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">+2 関数型</button>
      {/* ④ オブジェクト・配列の state をイミュータブル（変更不能・不変）に更新する */}
      <p className="mt-6">直接pushボタン</p>
      <button onClick={() => {
        items.push("item2")
        setItems(items);
      }} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">直接push</button>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <p className="mt-6">スプレッド構文ボタン</p>
      <button onClick={() => {
        setSpreadItems([...spreadItems, "item2"]);
      }} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">スプレッド構文</button>
      <ul>
        {spreadItems.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {/* ⑤ 初期値の遅延評価 */}
      <p className="mt-6">初期値の遅延評価ボタン</p>
      {/* ⑥ フォーム入力と state を連動させる（controlled input） */}
      <p className="mt-6">フォーム入力と state を連動させる</p>
      <input
        value={text}
        // onChange={(e) => setText(e.target.value)}
      />
      <p>入力中の文字: {text}</p>
    </div>
  );
}