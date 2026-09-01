import { useEffect, useState } from "react";
import { Timer } from "./Study04Timer";

type User = {
  id: number;
  name: string;
}

export default function Study04UseEffect () {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [word, setWord] = useState("");
  // const [result, setResult] = useState("");
  // ① 最小の useEffect を作る
  // useEffect(() => {
  //   console.log("レンダーされた", count); // 初回アクセス時のみ2回レンダリング 
  // });
  // ② 依存配列のパターンを比較する
  useEffect(() => {
    console.log("毎回実行"); // 依存配列なし 毎回実行
  });
  useEffect(() => {
    console.log("初回のみ実行"); // 初回のみ実行
  }, []);
  useEffect(() => {
    console.log("countが変わった：", count);
  }, [count]);
  // ④ API 呼び出し（fetch）
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false); // ここで読み終わった、と伝える
      })
      .catch((err) => {
        console.error("fetch失敗：", err);
        setIsLoading(false);
      });
  }, []);
  // ⑤ 非同期処理と競合状態（race condition）
  // useEffect(() => {
  //   let ignore = false;
  //   fetch(`https://api.example.com/search?q=${word}`)
  //     .then((res) => res.json)
  //     .then((data) => {
  //       if (!ignore) setResult(data); // ignore が false の時だけ setResult を実行
  //     });
  //     return () => {
  //       ignore = true;
  //     }
  // }, [word]);
  return (
    <div className="mx-auto p-4 max-w-sm">
      <p>カウント {count}</p>
      <button onClick={() => {
        setCount((prev) => prev + 1);
      }} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">+1</button>
      <input
        // value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>入力中の文字: {text}</p>
      {/* ③ クリーンアップ関数 */}
      <button onClick={() => {
        setShowTimer((prev) => !prev);
      }} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">タイマー表示切り替え</button>
      {/* showTimer が true → JSX の中に <Timer /> が存在する → React はそれに対応する「実体」（Fiber と呼ばれる管理用のオブジェクト）を作り、画面に描画 */}
      {/* showTimer が false になった瞬間、再レンダリングが走り、React は新しい JSX を見て「今回は <Timer /> が存在しない」と気づきます。これは React にとって「Timerというコンポーネントの実体を破棄する（アンマウントする）」という意味になる */}
      {/* React は「コンポーネントを破棄する前に、そのコンポーネントが登録した useEffect のクリーンアップ関数を必ず呼ぶ」というルールを持っている */}
      {showTimer && <Timer />}
      {/* ④ API 呼び出し（fetch） */}
      <div>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      </div>
      {/* ⑤ 非同期処理と競合状態（race condition） */}
      <p>検索ワード</p>
      {/* <input
        // value={text}
        onChange={(e) => setWord(e.target.value)}
      /> */}
    </div>
  );
}