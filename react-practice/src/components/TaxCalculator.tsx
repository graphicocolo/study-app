import { useState } from 'react'

// 文字列を受け取り、検証し、数値にして返す関数
// 今回はtaxRateはセレクトボックスで固定されているため、priceのみ検証する
// サーバーにデータを送る場合はサーバー側で必ず検証する
function validateInput(value: string): { price: number } | { error: string } {
  if (value.trim() === '') return { error: '価格を入力してください' } // 空文字
  const num = Number(value)
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' } // 数値でない
  if (num <= 0) return { error: '1以上の数値を入力してください' }
  return { price: Math.floor(num) }
}

// 税込計算を行う関数
function calculateTotalPrice(price: number, taxRate: number): number {
  return Math.floor(price + (price * taxRate / 100))
}

export default function TaxCalculator() {
  const [price, setPrice] = useState('')
  const [taxRate, setTaxRate] = useState('8')
  const [totalPrice, setTotalPrice] = useState('ー')
  const [error, setError] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false) // 「一度でもバリデーションが実行されたかどうか」の状態
  // true になるタイミング
  // onBlur — フォーカスが外れた時
  // handleSubmit — 送信ボタンを押した時（先ほどの修正）

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsTouched(true)
    const result = validateInput(price)
    if ('error' in result) {
      setError(result.error)
      setTotalPrice('ー')
      return
    }
    setError(null)
    const calculatedTotalPrice = calculateTotalPrice(result.price, Number(taxRate))
    setTotalPrice(calculatedTotalPrice.toLocaleString())
  }

  const handleReset = () => {
    setPrice('')
    setTaxRate('8')
    setTotalPrice('ー')
    setError(null)
    setIsTouched(false)
  }

  const validateAndSetError = (value: string) => {
    const result = validateInput(value)
    setError('error' in result ? result.error : null)
  }

  return (
    <div className="mx-auto p-4 max-w-sm">
      <h1 className="text-2xl font-bold mb-4">消費税計算機</h1>
      <form className="mb-4" onSubmit={handleSubmit} onReset={handleReset}>
        <label htmlFor="price" className="block text-base font-medium text-gray-700 mb-1">
          価格
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 1000"
          value={price}
          onChange={(e) => {
            const value = e.target.value
            setPrice(value)
            if (isTouched) { // 一度エラーが出た後に、ユーザーが値を修正している最中は、リアルタイムでエラーを更新する
              // まだ触っていない段階では余計なエラーを出さず、一度エラーが出た後は修正に合わせてリアルタイムにフィードバックする
              validateAndSetError(value)
            }
          }}
          onBlur={(e) => {
            setIsTouched(true)
            validateAndSetError(e.target.value)
          }}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label htmlFor="tax" className="block text-base font-medium text-gray-700 mt-4 mb-1">
          税率
        </label>
        <select
          id="tax"
          name="tax"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
        >
          <option value="8">8%</option>
          <option value="10">10%</option>
        </select>
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
        <p className="text-base">税込価格</p>
        <p className="text-xl font-bold text-blue-600">{totalPrice}円</p>
      </div>
    </div>
  )
}