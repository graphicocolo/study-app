import { useSplitCalculator } from "@/hooks/useSplitCalculator"

export default function SplitCalculator() {
  const { total, nop, resultBase, resultRemainder, totalError, nopError, handleTotalChange, handleNopChange, handleBlur, handleSubmit, handleReset } = useSplitCalculator()

  return (
    <div className="mx-auto p-4 max-w-sm">
      <h1 className="text-2xl font-bold mb-4">割り勘計算機</h1>
      <form className="mb-4" onSubmit={handleSubmit} onReset={handleReset}>
        <label htmlFor="total" className="block text-base font-medium text-gray-700 mb-1">
          総額
        </label>
        <input
          type="number"
          id="total"
          name="total"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 3000"
          value={total}
          // onChange={handleTotalChange} // カスタムフックにイベントを渡す
          onChange={(e) => handleTotalChange(e.target.value)} // カスタムフックに文字列を渡す
          onBlur={(e) => handleBlur(e.target.value)}
        />
        {totalError && <p className="text-red-500 mb-4">{totalError}</p>}
        <label htmlFor="nop" className="block text-base font-medium text-gray-700 mt-4 mb-1">
          人数
        </label>
        <input
          type="number"
          id="nop"
          name="nop"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 3"
          value={nop}
          // onChange={handleNopChange} // カスタムフックにイベントを渡す
          onChange={(e) => handleNopChange(e.target.value)} // カスタムフックに文字列を渡す
          onBlur={(e) => handleBlur(e.target.value)}
        />
        {nopError && <p className="text-red-500 mb-4">{nopError}</p>}
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
        <p className="text-base">支払い金額(一人当たり)</p>
        <p className="text-xl font-bold text-blue-600">{resultBase}円</p>
        <p className="text-base">支払い金額(端数負担)</p>
        <p className="text-xl font-bold text-blue-600">{resultRemainder}円</p>
      </div>
    </div>
  )
}