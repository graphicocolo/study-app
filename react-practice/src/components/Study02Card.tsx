// import type React from "react";

// type CardProps = {
//   children: React.ReactNode;
// }

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
}

// 分割代入
export function Study02Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}