import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateURL, parseURLParams } from '@/shared/lib'
import { usePostsStore } from './postsStore'

/**
 * URL과 Zustand 스토어 상태를 동기화하는 커스텀 훅
 */
export const useURLSync = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    setSkip,
    setLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
  } = usePostsStore()

  // URL 파라미터 변경 시 스토어 상태 동기화
  useEffect(() => {
    const params = parseURLParams(location.search)

    // 현재 상태와 다를 때만 업데이트 (무한 루프 방지)
    if (params.skip !== skip) setSkip(params.skip)
    if (params.limit !== limit) setLimit(params.limit)
    if (params.search !== searchQuery) setSearchQuery(params.search)
    if (params.sortBy !== sortBy) setSortBy(params.sortBy)
    if (params.sortOrder !== sortOrder) setSortOrder(params.sortOrder)
    if (params.tag !== selectedTag) setSelectedTag(params.tag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // 스토어 상태 변경 시 URL 업데이트
  useEffect(() => {
    updateURL(navigate, {
      skip,
      limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag])
}
