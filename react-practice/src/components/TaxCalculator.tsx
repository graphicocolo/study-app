import { useState } from 'react'

// interface TaxCalculatorProps {
//   price: number
//   taxRate: number
//   totalPrice: number
// }

export default function TaxCalculator() {
  const [price, setPrice] = useState('')
  const [taxRate, setTaxRate] = useState('8')
  const [totalPrice, setTotalPrice] = useState('ー')
  const [error, setError] = useState<string | null>(null)

  // 税込価格計算
  const calculateTotalPrice = () => {
    const priceValue = parseInt(price, 10)
    const taxRateValue = parseInt(taxRate, 10)
    const calculatedTotalPrice = Math.floor(priceValue + (priceValue * taxRateValue / 100))
    setTotalPrice(calculatedTotalPrice.toLocaleString())
  }

  // 簡易バリデーション
  const validatePrice = (value: string): string | null => {
    // const numericValue = value.replace(/[^0-9]/g, '')
    // setPrice(numericValue)
    if (value.trim() === '') return '価格を入力してください' // 空値
    if (isNaN(value)) return '有効な数値を入力してください' // 非数
    if (value <= 0) return '1以上の数値を入力してください' // 負数
    // if (!Number.isInteger(numericValue)) return '価格は整数でなければなりません' // 非整数
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
    calculateTotalPrice()
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