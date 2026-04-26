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