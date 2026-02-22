import { useState } from 'react'
import TaxCalculator from '@/components/TaxCalculator'
import BmiCalculator from '@/components/BmiCalculator'

function App() {
  const [showElement, setShowElement] = useState<'TaxCalculator' | 'BmiCalculator'>('TaxCalculator')

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto p-4 mt-4">
        <select
          className="ml-4 px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          onChange={(e) => setShowElement(e.target.value as 'TaxCalculator' | 'BmiCalculator')}
          value={showElement}
        >
          <option value="TaxCalculator">税込価格計算</option>
          <option value="BmiCalculator">BMI計算</option>
        </select>
      </div>
      {showElement === 'TaxCalculator' ? <TaxCalculator /> : <BmiCalculator />}
    </div>
  )
}

export default App
