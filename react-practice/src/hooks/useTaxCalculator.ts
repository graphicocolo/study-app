import React, { useState } from 'react'

// 文字列を受け取り、検証し、数値にして返す関数
// 今回はtaxRateはセレクトボックスで固定されているため、priceのみ検証する
// サーバーにデータを送る場合はサーバー側で必ず検証する
function validateInputToInteger(value: string): { price: number } | { error: string } {
  if (value.trim() === '') return { error: '価格を入力してください' } // 空文字
  const num = Number(value) // Number() は数値に変換できない文字列を渡すと NaN を返す
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' } // 数値でない
  if (num < 1) return { error: '1以上の数値を入力してください' } // 0以下
  return { price: Math.floor(num) }
}

// 税込計算を行う関数
function calculateTaxInTotalPrice(price: number, taxRate: number): number {
  return Math.floor(price + (price * taxRate / 100))
}

export function useTaxCalculator() {
  const [price, setPrice] = useState('')
  const [taxRate, setTaxRate] = useState('8')
  const [totalPrice, setTotalPrice] = useState('ー')
  const [error, setError] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false) // 「一度でもバリデーションが実行されたかどうか」の状態
  // true になるタイミング
  // onBlur — フォーカスが外れた時
  // handleSubmit — 送信ボタンを押した時（先ほどの修正）

  // 入力値を検証し、エラーを設定する関数
  const validateAndSetError = (value: string) => {
    const result = validateInputToInteger(value)
    if ('error' in result) {
      setError(result.error)
      setTotalPrice('ー')
    } else {
      setError(null)
    }
  }

  // 価格の入力値が変更されたときのイベントハンドラー
  // 価格の入力値が変更されたときに、リアルタイムでエラーを更新するようにする
  // const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => { // イベントを受け取る書き方
  const handlePriceChange = (value: string) => {
    // const value = e.target.value // イベントを受け取る書き方の場合は、ここで値を取り出す必要がある
    setPrice(value)
    if (isTouched) { // 一度エラーが出た後に、ユーザーが値を修正している最中は、リアルタイムでエラーを更新する
      // まだ触っていない段階では余計なエラーを出さず、一度エラーが出た後は修正に合わせてリアルタイムにフィードバックする
      validateAndSetError(value)
    }
  }

  // 税率の変更イベントハンドラー
  // 税率が変更されたときに、リアルタイムで税込価格を更新するようにする
  const handleTaxRateChange = (value: string) => {
    setTaxRate(value)
  }

  // 入力フィールドがフォーカスを失ったときのイベントハンドラー
  const handleBlur = (value: string) => {
    setIsTouched(true)
    validateAndSetError(value)
  }

  // フォームの送信イベントハンドラー
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // FormEvent は非推奨になったため使わない
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsTouched(true)
    const result = validateInputToInteger(price)
    if ('error' in result) {
      setError(result.error)
      setTotalPrice('ー')
      return
    }
    setError(null)
    const calculatedTotalPrice = calculateTaxInTotalPrice(result.price, Number(taxRate))
    setTotalPrice(calculatedTotalPrice.toLocaleString())
  }

  // フォームのリセットイベントハンドラー
  const handleReset = () => {
    setPrice('')
    setTaxRate('8')
    setTotalPrice('ー')
    setError(null)
    setIsTouched(false)
  }

  return {
    price,
    taxRate,
    totalPrice,
    error,
    handlePriceChange,
    handleTaxRateChange,
    handleBlur,
    handleSubmit,
    handleReset
  }
}