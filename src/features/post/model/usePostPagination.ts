import { useState } from 'react'

interface UsePostPaginationParams {
  initialSkip?: number
  initialLimit?: number
  initialTotal?: number
  onSkipChange?: (skip: number) => void
  onLimitChange?: (limit: number) => void
}

export const usePostPagination = ({
  initialSkip = 0,
  initialLimit = 10,
  initialTotal = 0,
  onSkipChange,
  onLimitChange,
}: UsePostPaginationParams = {}) => {
  const [skip, setSkip] = useState(initialSkip)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(initialTotal)

  const handleSkipChange = (newSkip: number) => {
    setSkip(newSkip)
    onSkipChange?.(newSkip)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setSkip(0) // limit 변경 시 첫 페이지로 이동
    onLimitChange?.(newLimit)
  }

  const goToPreviousPage = () => {
    const newSkip = Math.max(0, skip - limit)
    handleSkipChange(newSkip)
  }

  const goToNextPage = () => {
    const newSkip = skip + limit
    handleSkipChange(newSkip)
  }

  const canGoPrevious = skip > 0
  const canGoNext = skip + limit < total

  return {
    skip,
    limit,
    total,
    setSkip: handleSkipChange,
    setLimit: handleLimitChange,
    setTotal,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  }
}
