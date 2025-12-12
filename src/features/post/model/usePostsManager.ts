import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Post } from '@/entities/post/model'
import { usePostManagement } from './usePostManagement'
import { usePostSearch } from './usePostSearch'
import { usePostFilter } from './usePostFilter'
import { usePostPagination } from './usePostPagination'
import { usePostList } from './usePostList'
import { useTags } from './useTags'
import { useURLSync } from './useURLSync'
import { parseURLParams } from '@/shared/lib'

/**
 * 게시물 관리 페이지의 모든 로직을 통합하는 커스텀 훅
 * FSD 원칙에 따라 pages 레이어를 얇게 유지하기 위해 모든 로직을 features로 이동
 */
export const usePostsManager = () => {
  const location = useLocation()
  const queryParams = parseURLParams(location.search)

  // 상태 관리
  const [loading, setLoading] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  // Features hooks
  const postPagination = usePostPagination({
    initialSkip: queryParams.skip,
    initialLimit: queryParams.limit,
    initialTotal: 0,
  })

  const { tags } = useTags()
  const { posts, setPosts, refetch: refetchPosts } = usePostList({
    skip: postPagination.skip,
    limit: postPagination.limit,
    onTotalChange: postPagination.setTotal,
    onLoadingChange: setLoading,
  })

  const postManagement = usePostManagement(posts, setPosts)
  const postSearch = usePostSearch({
    setPosts,
    setTotal: postPagination.setTotal,
    setLoading,
    fetchPosts: refetchPosts,
    initialSearchQuery: queryParams.search,
  })
  const postFilter = usePostFilter({
    setPosts,
    setTotal: postPagination.setTotal,
    setLoading,
    fetchPosts: refetchPosts,
    initialSelectedTag: queryParams.tag,
    initialSortBy: queryParams.sortBy,
    initialSortOrder: queryParams.sortOrder,
  })

  // URL 동기화 (자동으로 URL과 상태를 동기화)
  useURLSync({
    skip: postPagination.skip,
    limit: postPagination.limit,
    search: postSearch.searchQuery,
    sortBy: postFilter.sortBy,
    sortOrder: postFilter.sortOrder,
    tag: postFilter.selectedTag,
    onSkipChange: postPagination.setSkip,
    onLimitChange: postPagination.setLimit,
    onSearchChange: postSearch.setSearchQuery,
    onSortByChange: postFilter.setSortBy,
    onSortOrderChange: postFilter.setSortOrder,
    onTagChange: postFilter.setSelectedTag,
  })

  // 게시물 상세 보기 핸들러
  const openPostDetail = (post: Post) => {
    postManagement.setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  return {
    // 상태
    loading,
    posts,
    tags,
    showPostDetailDialog,
    setShowPostDetailDialog,

    // 게시물 관리
    postManagement,
    postSearch,
    postFilter,
    postPagination,

    // 핸들러
    openPostDetail,
  }
}
