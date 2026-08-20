type BadgeProps = {
  label: string;
  color?: string; // 省略可能
}

// 分割代入
export function Study02Badge({ label, color }: BadgeProps) {
  return <span style={{ color: color ?? "black" }}>{label}</span>;
}