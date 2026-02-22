 import { useTaxCalculator } from '@/hooks/useTaxCalculator'

export default function TaxCalculator() {
  const { price, taxRate, totalPrice, error, handlePriceChange, handleTaxRateChange, handleBlur, handleSubmit, handleReset } = useTaxCalculator()

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
          // onChange={handlePriceChange} // カスタムフックにイベントを渡す
          onChange={(e) => handlePriceChange(e.target.value)} // カスタムフックに文字列を渡す
          onBlur={(e) => handleBlur(e.target.value)}
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
          onChange={(e) => handleTaxRateChange(e.target.value)}
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