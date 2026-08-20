import { Study02Greeting } from "@/components/Study02Greeting";
import { Study02Profile } from "@/components/Study02Profile";
import { Study02Card } from "@/components/Study02Card";
import { Study02Badge } from "@/components/Study02Badge";

export default function Study02Props() {
  return (
    <>
    {/* ① 最小のコンポーネントを作り、親から呼び出す */}
    {/* ② props を渡す・受け取る */}
    {/* ③ props の分割代入をしない書き方と比較する */}
      <Study02Greeting greet="おはようございます" name="加藤" />
      {/* ④ 複数の props を渡す */}
      <Study02Profile name="加藤" age={30}  />
      {/* ⑤ children props */}
      <Study02Card>
        <p>カードの中身</p>
      </Study02Card>
      {/* ⑥ 省略可能な props（optional props） */}
      <Study02Badge label="SALE" color="red" />
      <Study02Badge label="NEW" />
      {/* ⑦ コンポーネントを分割する判断基準 */}
      <div className="card">
        <span>アイコン</span>
        <p>名前</p>
        <p>ここに自己紹介文を入れます</p>
      </div>
    </>
  );
}