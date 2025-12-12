import { useState } from 'react'
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
