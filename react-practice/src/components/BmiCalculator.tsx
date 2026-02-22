import { useState } from 'react'

const MAX_WEIGHT = 200
const MAX_HEIGHT = 250

// 入力値検証、数値変換を行う関数
function validateInputToInteger(value: string, max: number): { value: number } | { error: string } {
  if (value.trim() === '') return { error: '値を入力してください' }
  const num = Number(value)
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' }
  if (num < 1) return { error: '1以上の数値を入力してください' }
  if (num > max) return { error: `${max}以下の数値を入力してください` }
  return { value: Math.floor(num) }
}

// BMI計算を行う関数
function calculateBmi(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Math.floor(weight / (heightInMeters ** 2))
}

export default function BmiCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState<string>('ー')
  const [error, setError] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false)

  // 入力値を検証し、エラーを設定する関数
  const validateAndSetError = (value: string, max: number) => {
    const result = validateInputToInteger(value, max)
    if ('error' in result) {
      setError(result.error)
      setBmi('ー')
    } else {
      setError(null)
    }
  }

  // handleWeightChange と handleHeightChange は内部ロジックが同じ（setter だけ異なる）。
  // 入力フィールドが増えた場合は、setter を引数で受け取るハンドラーにまとめることができる。
  //
  // まとめる場合の書き方（カリー化）:
  // どんな setter 関数を渡すかによって、異なるハンドラー関数が返ってくる
  //   const handleInputChange = (setter: (v: string) => void) => (value: string) => {
  // setter の型：「文字列を受け取って何も返さない関数」
  // setter（関数）を受け取る関数を定義し、その関数がさらにvalue（文字列）を受け取る関数を返す
  //     setter(value)
  //     if (isTouched) validateAndSetError(value)
  //   }
  //   const handleWeightChange = handleInputChange(setWeight)
  //   const handleHeightChange = handleInputChange(setHeight)
  //
  // 今は入力フィールドが2つで明快なので、明示的に2つ書いておく。

  // 体重入力値変更イベントハンドラー
  const handleWeightChange = (value: string, max: number) => {
    setWeight(value)
    if (isTouched) validateAndSetError(value, max)
  }

  // 身長入力値変更イベントハンドラー
  const handleHeightChange = (value: string, max: number) => {
    setHeight(value)
    if (isTouched) validateAndSetError(value, max)
  }

  // 入力フィールドがフォーカスを失ったときのイベントハンドラー
  const handleBlur = (value: string, max: number) => {
    setIsTouched(true)
    validateAndSetError(value, max)
  }

  // フォーム送信イベントハンドラー
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsTouched(true)
    const weightResult = validateInputToInteger(weight, MAX_WEIGHT)
    const heightResult = validateInputToInteger(height, MAX_HEIGHT)
    if ('error' in weightResult) {
      setError(weightResult.error)
      setBmi('ー')
      return
    }
    if ('error' in heightResult) {
      setError(heightResult.error)
      setBmi('ー')
      return
    }
    const bmiValue = calculateBmi(weightResult.value, heightResult.value)
    setBmi(bmiValue.toString())
    setError(null)
  }

  // フォームリセットイベントハンドラー
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setBmi('ー')
    setError(null)
    setIsTouched(false)
  }

  return (
    <div className="mx-auto p-4 max-w-sm">
      <h1 className="text-2xl font-bold mb-4">BMI計算</h1>
      <form className="mb-4" onSubmit={handleSubmit} onReset={handleReset}>
        <label htmlFor="weight" className="block text-base font-medium text-gray-700 mb-1">
          体重 (kg)
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 60"
          max="200"
          value={weight}
          onChange={(e) => handleWeightChange(e.target.value, MAX_WEIGHT)}
          onBlur={(e) => handleBlur(e.target.value, MAX_WEIGHT)}
        />
        <label htmlFor="height" className="block text-base font-medium text-gray-700 mt-4 mb-1">
          身長 (cm)
        </label>
        <input
          type="number"
          id="height"
          name="height"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 170"
          max="250"
          value={height}
          onChange={(e) => handleHeightChange(e.target.value, MAX_HEIGHT)}
          onBlur={(e) => handleBlur(e.target.value, MAX_HEIGHT)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          計算する
        </button>
        <button
          type="reset"
          className="mt-2 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          リセット
        </button>
      </form>
      <div className="mt-6 flex flex-col md:flex-row md:justify-between">
        <p className="text-base">あなたのBMI</p>
        <p className="text-xl font-bold text-blue-600">{bmi}</p>
      </div>
    </div>
  );
}