type ProfileProps = {
  name: string;
  age: number;
}

// 分割代入
export function Study02Profile({ name, age }: ProfileProps) {
  return <p>{name}（{age}歳）</p>;
}