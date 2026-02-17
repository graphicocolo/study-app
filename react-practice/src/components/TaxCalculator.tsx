import { useState } from 'react'

// interface TaxCalculatorProps {
//   price: number
//   taxRate: number
//   totalPrice: number
// }

// 入力値をバリデーションする関数 空値、非数
function validateInput(value: string): string | null {
  if (value.trim() === '') return '価格を入力してください' // 空値
  if (Number.isNaN(Number(value))) return '有効な数値を入力してください' // 非数
  return null  
}

// 文字列から数値に変換する関数
function formatNumber(value: string): number {
  const trimedValue = value.trim()
  const numericValue = trimedValue.replace(/[^0-9]/g, '')
  return parseInt(numericValue, 10)
}

// 数値をバリデーションする関数
function validateNumber(value: number): string | null {
  if (value <= 0) return '1以上の数値を入力してください' // 負数
  return null
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

  // 価格のバリデーション
  const validatePrice = (value: string): string | null => {
    const inputError = validateInput(value)
    if (inputError) return inputError

    const formattedPrice = formatNumber(value)

    const numberError = validateNumber(formattedPrice)
    if (numberError) return numberError

    return null
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const errorMsg = validatePrice(price)
    if (errorMsg) {
      setError(errorMsg)
      setTotalPrice('ー')
      return
    }
    setError('')
    const formattedPrice = formatNumber(price)
    const calculatedTotalPrice = calculateTotalPrice(formattedPrice, parseInt(taxRate, 10))
    setTotalPrice(calculatedTotalPrice.toLocaleString())
  }

  function handleReset () {
    setPrice('')
    setTaxRate('8')
    setTotalPrice('ー')
  }

  return (
    <div className="mx-auto p-4 max-w-sm">
      <h1 className="text-2xl font-bold mb-4">消費税計算機</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          onChange={(e) => setPrice(e.target.value)}
        />
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