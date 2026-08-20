import { type ReactElement, useState } from 'react'
import TaxCalculator from '@/components/TaxCalculator'
import BmiCalculator from '@/components/BmiCalculator'
import SplitCalculator from '@/components/SplitCalculator'
import ScoreSort from '@/components/ScoreSort'
import Study01Jsx from '@/components/Study01Jsx'

// option を追加するとき VIEWS だけ変えればよい → 一元管理できる
const VIEWS = [
    { value: 'TaxCalculator', label: '税込価格計算' },
    { value: 'BmiCalculator', label: 'BMI計算' },
    { value: 'SplitCalculator', label: '割り勘計算' },
    { value: 'ScoreSort', label: '成績ソート' },
    { value: 'Study01Jsx', label: 'studyloadmap Reactの基本 JSX の書き方' },
  ] as const // as const をつけるとリテラル型になる（value と label は文字列のまま、string にはならない）
type ViewType = typeof VIEWS[number]['value']
// VIEWS            → オブジェクトの配列
// VIEWS[number]    → 配列の各オブジェクト  { value: '...', label: '...' }
// VIEWS[number]['value'] → 各オブジェクトの value プロパティだけ

const isView = (v: string): v is ViewType => VIEWS.some((view) => view.value === v) // 文字列 v が VIEWS の value のどれかと一致するかをチェックする関数

const VIEW_COMPONENTS: Record<ViewType, ReactElement> = {
  TaxCalculator: <TaxCalculator />,
  BmiCalculator: <BmiCalculator />,
  SplitCalculator: <SplitCalculator />,
  ScoreSort: <ScoreSort />,
  Study01Jsx: <Study01Jsx />,
}

function App() {
  const [showElement, setShowElement] = useState<ViewType>('TaxCalculator')

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto p-4 mt-4">
        <select
            className="ml-4 px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            onChange={(e) => {
              const value = e.target.value
              if (isView(value)) setShowElement(value)
            }}
            value={showElement}
          >
            {VIEWS.map((view) => (
              <option key={view.value} value={view.value}>{view.label}</option>
            ))}
          </select>
      </div>
      {VIEW_COMPONENTS[showElement]}
    </div>
  )
}

export default App
