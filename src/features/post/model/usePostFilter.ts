import { useState, useEffect } from 'react'
import { fetchPostsByTag } from '@/entities/post/api'
import { fetchUsers } from '@/entities/user/api'
import type { Post } from '@/entities/post/model'

interface UsePostFilterParams {
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  fetchPosts: () => Promise<void>
  initialSelectedTag?: string
  initialSortBy?: string
  initialSortOrder?: string
}

export const usePostFilter = ({
  setPosts,
  setTotal,
  setLoading,
  fetchPosts,
  initialSelectedTag = "",
  initialSortBy = "",
  initialSortOrder = "asc",
}: UsePostFilterParams) => {
  const [selectedTag, setSelectedTag] = useState(initialSelectedTag)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)

  const fetchPostsByTagHandler = async (tag: string) => {
    if (!tag || tag === "all") {
      await fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        fetchPostsByTag(tag),
        fetchUsers({ limit: 0, select: 'username,image' }),
      ])

      const postsWithUsers = postsData.posts.map((post) => {
        const user = usersData.users.find((user) => user.id === post.userId)
        return {
          ...post,
          author: user
            ? {
                id: user.id,
                username: user.username,
                image: user.image || '',
              }
            : undefined,
        }
      })

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // selectedTag가 변경될 때 자동으로 게시물 가져오기
  useEffect(() => {
    // 초기값이 아닌 경우에만 실행 (초기 렌더링 방지)
    if (selectedTag && selectedTag !== initialSelectedTag) {
      fetchPostsByTagHandler(selectedTag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag])

  return {
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    fetchPostsByTag: fetchPostsByTagHandler,
  }
}
