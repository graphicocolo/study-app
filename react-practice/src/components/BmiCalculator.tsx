import { useBmiCalculator, MAX_WEIGHT, MAX_HEIGHT } from '@/hooks/useBmiCalculator';

export default function BmiCalculator() {
  const { weight, height, error, bmi, handleSubmit, handleReset, handleWeightChange, handleHeightChange, handleBlur } = useBmiCalculator(); 

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
          max="200"
          value={weight}
          onChange={(e) => handleWeightChange(e.target.value)(MAX_WEIGHT)}
          onBlur={(e) => handleBlur('weight', e.target.value)}
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
          max="250"
          value={height}
          onChange={(e) => handleHeightChange(e.target.value)(MAX_HEIGHT)}
          onBlur={(e) => handleBlur('height', e.target.value)}
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