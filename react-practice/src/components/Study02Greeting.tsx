type GreetingProps = {
  greet: string;
  name: string;
}

// 分割代入
export function Study02Greeting({ greet, name }: GreetingProps) {
  return <p>{greet}{name}さん</p>;
}

// 分割代入せずに props オブジェクトのまま受け取る
// export function Study02Greeting(props: GreetingProps) {
//   return <p>{props.greet}{props.name}さん</p>;
// }