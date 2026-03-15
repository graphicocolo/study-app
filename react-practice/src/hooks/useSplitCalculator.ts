import React, { useState } from 'react'

// 文字列を受け取り、検証し、数値にして返す関数
// サーバーにデータを送る場合はサーバー側で必ず検証する
function validateInputToInteger(value: string): { validatedValue: number } | { error: string } {
  if (value.trim() === '') return { error: '価格を入力してください' } // 空文字
  const num = Number(value) // Number() は数値に変換できない文字列を渡すと NaN を返す
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' } // 数値でない
  if (num < 1) return { error: '1以上の数値を入力してください' } // 0以下
  return { validatedValue: Math.floor(num) }
}

// 一人当たりの支払い金額計算を行う関数
function calculateBasePrice(total: number, nop: number): number {
  return Math.floor(total / nop)
}
// 一人当たりの支払い金額計算(端数負担含む)を行う関数
function calculateRemainderPrice(total: number, nop: number): number {
  const resultBase = calculateBasePrice(total, nop)
  return resultBase + (total - (resultBase * nop))
}

export function useSplitCalculator() {
  const [total, setTotal] = useState('')
  const [nop, setNop] = useState('')
  const [resultBase, setResultBase] = useState('ー')
  const [resultRemainder, setResultRemainder] = useState('ー')
  const [totalError, setTotalError] = useState<string | null>(null)
  const [nopError, setNopError] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false) // 「一度でもバリデーションが実行されたかどうか」の状態
  // true になるタイミング
  // onBlur — フォーカスが外れた時
  // handleSubmit — 送信ボタンを押した時（先ほどの修正）

  // 入力値を検証し、エラーを設定する関数
  // このままだと、`validateAndSetError` は「どちらのフィールドか」を知る手段がなく、現在のエラー state で推測しようとしているのが誤り。さらに `handleBlur` も両フィールドで共用されたまま（`SplitCalculator.tsx:22, 37`）なので、呼び出し元のフィールドを特定できない。
  const validateAndSetError = (value: string) => {
    const result = validateInputToInteger(value)
    if ('error' in result && totalError) { // ← totalError が null なら false 初回バリデーションが機能しない
      setTotalError(result.error)
      setResultBase('ー')
    } else if ('error' in result && nopError) { // ← nopError が null なら false 初回バリデーションが機能しない
      setNopError(result.error)
      setResultRemainder('ー')
    } else {
      setTotalError(null)
      setNopError(null)
    }
  }

  // 総額の入力値が変更されたときのイベントハンドラー
  // 総額の入力値が変更されたときに、リアルタイムでエラーを更新するようにする
  // const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => { // イベントを受け取る書き方
  const handleTotalChange = (value: string) => {
    // const value = e.target.value // イベントを受け取る書き方の場合は、ここで値を取り出す必要がある
    setTotal(value)
    if (isTouched) { // 一度エラーが出た後に、ユーザーが値を修正している最中は、リアルタイムでエラーを更新する
      // まだ触っていない段階では余計なエラーを出さず、一度エラーが出た後は修正に合わせてリアルタイムにフィードバックする
      validateAndSetError(value)
    }
  }

  // 人数の変更イベントハンドラー
  // 人数が変更されたときに、リアルタイムでエラーを更新するようにする
  const handleNopChange = (value: string) => {
    setNop(value)
    if (isTouched) {
      validateAndSetError(value)
    }
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
    const result = validateInputToInteger(total)
    if ('error' in result) {
      setTotalError(result.error)
      setResultBase('ー')
      return
    }
    const resultNop = validateInputToInteger(nop)
    if ('error' in resultNop) {
      setNopError(resultNop.error)
      setResultRemainder('ー')
      return
    }
    setTotalError(null)
    setNopError(null)
    const calculatedBasePrice = calculateBasePrice(result.validatedValue, resultNop.validatedValue)
    setResultBase(calculatedBasePrice.toLocaleString())
    const calculatedRemainderPrice = calculateRemainderPrice(result.validatedValue, resultNop.validatedValue)
    setResultRemainder(calculatedRemainderPrice.toLocaleString())
  }

  // フォームのリセットイベントハンドラー
  const handleReset = () => {
    setTotal('')
    setNop('')
    setResultBase('ー')
    setResultRemainder('ー')
    setTotalError(null)
    setNopError(null)
    setIsTouched(false)
  }

  return {
    total,
    nop,
    resultBase,
    resultRemainder,
    totalError,
    nopError,
    handleTotalChange,
    handleNopChange,
    handleBlur,
    handleSubmit,
    handleReset
  }
}