import { useEffect } from "react";

export function Timer() {
  useEffect(() => {
    const id = setInterval(() => { // ← 本体：effectが実行する処理
      console.log("tick");
    }, 1000);
    // useEffect は、関数を return すると、それを「クリーンアップ関数」として特別扱いするという仕組みを持っている
    // 
    return () => { // ← 後片付け：Reactが然るべきタイミングで呼ぶ 「今作ったこの id のタイマーを止める処理」を、React に「あとで実行して」と渡している形
      clearInterval(id);
    };
  }, []);
  // showTimer: true → false
  //   ↓
  // 再レンダリング → JSXに<Timer />がない
  //   ↓
  // Reactが「Timerをアンマウントする」と判断
  //   ↓
  // アンマウント直前にクリーンアップ関数 () => clearInterval(id) を実行
  //   ↓
  // タイマーが止まる
  // という流れ
  return (
    <p>タイマー</p>
  );
}