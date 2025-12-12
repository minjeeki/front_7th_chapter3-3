import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateURL, parseURLParams } from '@/shared/lib'

interface UseURLSyncParams {
  skip: number
  limit: number
  search: string
  sortBy: string
  sortOrder: string
  tag: string
  onSkipChange: (skip: number) => void
  onLimitChange: (limit: number) => void
  onSearchChange: (search: string) => void
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (sortOrder: string) => void
  onTagChange: (tag: string) => void
}

/**
 * URL과 상태를 동기화하는 커스텀 훅
 * - URL 파라미터 변경 시 상태 업데이트
 * - 상태 변경 시 URL 업데이트
 */
export const useURLSync = ({
  skip,
  limit,
  search,
  sortBy,
  sortOrder,
  tag,
  onSkipChange,
  onLimitChange,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onTagChange,
}: UseURLSyncParams) => {
  const navigate = useNavigate()
  const location = useLocation()

  // URL 파라미터 변경 시 상태 동기화
  useEffect(() => {
    const params = parseURLParams(location.search)
    
    // 현재 상태와 다를 때만 업데이트 (무한 루프 방지)
    if (params.skip !== skip) onSkipChange(params.skip)
    if (params.limit !== limit) onLimitChange(params.limit)
    if (params.search !== search) onSearchChange(params.search)
    if (params.sortBy !== sortBy) onSortByChange(params.sortBy)
    if (params.sortOrder !== sortOrder) onSortOrderChange(params.sortOrder)
    if (params.tag !== tag) onTagChange(params.tag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // 상태 변경 시 URL 업데이트
  useEffect(() => {
    updateURL(navigate, {
      skip,
      limit,
      search,
      sortBy,
      sortOrder,
      tag,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, search, sortBy, sortOrder, tag])
}
