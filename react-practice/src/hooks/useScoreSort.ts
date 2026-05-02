import React, { useState } from 'react'

// 空文字バリデーション
function validateNotEmpty(value:string) {
  if (value.trim() === '') {
    return false;
  }
  return true;
}

// 入力値バリデーション
function validateScoreRange(value: string) {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
    return false;
  }
  return true;
}

type Score = {
  subject: string;
  displayName: string;
  value: string;
  error: string;
}

type SortedScore = { displayName: string; value: number }

export function useScoreSort() {
  const [scores, setScores] = useState<Score[]>([
    { subject: 'kokugo', displayName: '国語', value: '', error: '' },
    { subject: 'sugaku', displayName: '数学', value: '', error: '' },
    { subject: 'shakai', displayName: '社会', value: '', error: '' },
    { subject: 'rika', displayName: '理科', value: '', error: '' },
    { subject: 'eigo', displayName: '英語', value: '', error: '' }
  ])

  const [descendedResult, setDescendedResult] = useState<SortedScore[]>([])
  const [ascendedResult, setAscendedResult] = useState<SortedScore[]>([])

  const isSubmitEnable = scores.every(s => s.value.trim() !== '' && s.error === '')

  const handleChange = (subject: string, value: string) => {
    setScores(prev =>
      prev.map(score =>
        score.subject === subject ? {...score, value, error: ''} : score
      )
    )
  }

  const handleBlur = (subject: string) => {
    setScores(prev =>
      prev.map(score => {
        if (score.subject !== subject) return score
        if (!validateNotEmpty(score.value)) return {...score, error: `${score.displayName}の点数が空です`}
        if (!validateScoreRange(score.value)) return {...score, error: '0以上100以下の数字を入力してください'}
        return {...score, error: ''}
      })
    )
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const sortable: SortedScore[] = scores.map(s => ({
      displayName: s.displayName,
      value: parseInt(s.value, 10)
    }))
    // scores の value を降順にソートし、setAscendedResult にセット
    setDescendedResult([...sortable].sort((a, b) => b.value - a.value))
    // scores の value を昇順にソートし、setAscendedResult にセット
    setAscendedResult([...sortable].sort((a, b) => a.value - b.value))
    // scores の value を空にする
    setScores(prev =>
      prev.map(score => {
        return {...score, value: ''}
      })
    )
  }

  const handleReset = () => {
    setScores(prev =>
      prev.map(score => {
        return {...score, value: '', error: ''}
      })
    )
    setDescendedResult([])
    setAscendedResult([])
  }

  return {
    scores,
    descendedResult,
    ascendedResult,
    isSubmitEnable,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  }
}