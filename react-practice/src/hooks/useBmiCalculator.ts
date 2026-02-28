import React, { useState } from 'react'

// 定数切り出しのタイミングの目安として、「複数のファイルから同じ定数を参照し始めたとき」が一つのサイン
export const MAX_WEIGHT = 200
export const MAX_HEIGHT = 250

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

export function useBmiCalculator() {
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

  // 入力値変更イベントハンドラーのカリー化
  const handleInputChange = (setter: (v: string) => void) => (value: string) => (max: number) => {
    setter(value)
    if (isTouched) validateAndSetError(value, max)
  }

  // 体重入力値変更イベントハンドラー
  const handleWeightChange = handleInputChange(setWeight)

  // 身長入力値変更イベントハンドラー
  const handleHeightChange = handleInputChange(setHeight)

  // 入力フィールドがフォーカスを失ったときのイベントハンドラー
  // 体重か身長かの区別のないコード
  // const handleBlur = (value: string, max: number) => {
  //   setIsTouched(true)
  //   validateAndSetError(value, max)
  // }
  // フィールドの値によって体重身長の区別のあるコード
  // 将来「weightがblurされたときだけ追加の処理をしたい」といった場合にも field で分岐できるので拡張しやすくなる
  const handleBlur = (field: 'weight' | 'height', value: string) => {
    setIsTouched(true)
    const max = field === 'weight' ? MAX_WEIGHT : MAX_HEIGHT
    validateAndSetError(value, max)
  }

  // フォーム送信イベントハンドラー
  // handleSubmitかeか、どちらか一方に型をつければ良い
  // この場合はeの型は自動で推論される
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

  return {
    weight,
    height,
    error,
    bmi,
    handleSubmit,
    handleReset,
    handleWeightChange,
    handleHeightChange,
    handleBlur
  }
}