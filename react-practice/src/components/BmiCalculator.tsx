import { useState } from 'react'

function validateInputToInteger(value: string): { value: number } | { error: string } {
  if (value.trim() === '') return { error: '値を入力してください' }
  const num = Number(value)
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' }
  if (num < 1) return { error: '1以上の数値を入力してください' }
  return { value: Math.floor(num) }
}

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

  const validateAndSetError = (value: string) => {
    const result = validateInputToInteger(value)
    if ('error' in result) {
      setError(result.error)
      setBmi('ー')
    } else {
      setError(null)
    }
  }

  const handleWeightChange = (value: string) => {
    setWeight(value)
    if (isTouched) validateAndSetError(value)
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (isTouched) validateAndSetError(value)
  }

  const handleBlur = (value: string) => {
    setIsTouched(true)
    validateAndSetError(value)
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsTouched(true)
    const weightResult = validateInputToInteger(weight)
    const heightResult = validateInputToInteger(height)
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
          value={weight}
          onChange={(e) => handleWeightChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
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
          value={height}
          onChange={(e) => handleHeightChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
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