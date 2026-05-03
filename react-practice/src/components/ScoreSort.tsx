import { useScoreSort } from "@/hooks/useScoreSort";

export default function ScoreSort() {
  const { scores,
    descendedResult,
    ascendedResult,
    isSubmitEnable,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset } = useScoreSort();

    return (
    <>
      <div className="mx-auto p-4 max-w-sm">
        <h1 className="text-2xl font-bold mb-4">成績ソート</h1>
        <p className="text-sm text-gray-500 mb-8">試験が行われなかった教科は0を入力してください</p>
        <form className="mb-4" onSubmit={handleSubmit} onReset={handleReset}>
          {scores.map(inputField => 
            <div key={inputField.subject} className="mb-2">
              <label htmlFor={inputField.subject} className="text-left block text-base font-medium text-gray-700 mb-1">
                {inputField.displayName}
              </label>
              <input
                type="number"
                id={inputField.subject}
                name={inputField.subject}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 60"
                min="0"
                max="100"
                value={inputField.value}
                onChange={(e) => handleChange(inputField.subject, e.target.value)}
                onBlur={() => handleBlur(inputField.subject)}
              />
              {inputField.error && (
                <p className="text-sm text-red-500">{inputField.error}</p>
              )}
            </div>
          )}
          <div className="m-auto md:max-w-xs">
            <button type="submit" className={'mt-6 w-full text-white font-bold py-2 px-4 rounded-md ' + (!isSubmitEnable ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500')} disabled={!isSubmitEnable}>並べ替える</button>
            <button type="reset" className="mt-2 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500">リセット</button>
          </div>
        </form>
      </div>
      <div className="mx-auto">
        <div className="m-auto grid md:grid-cols-2 md:max-w-3xl mt-4 gap-4">
          <div className="rounded p-4 bg-blue-50">
            <h2 className="text-xl font-semibold mb-2 text-center text-sky-600">降順</h2>
            <div>
              <ul>
                {descendedResult.map(item =>
                  <li key={item.subject}>{item.displayName}：{item.value}点</li>
                )}
              </ul>
            </div>
          </div>
          <div className="rounded p-4 bg-blue-50">
            <h2 className="text-xl font-semibold mb-2 text-center text-sky-600">昇順</h2>
            <div>
              <ul>
                {ascendedResult.map(item =>
                  <li key={item.subject}>{item.displayName}：{item.value}点</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
    );
}