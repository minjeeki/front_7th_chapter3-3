/**
 * 텍스트에서 검색어를 하이라이트하는 유틸리티 함수
 */
export const highlightText = (text: string, highlight: string): React.ReactNode => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  )
}
