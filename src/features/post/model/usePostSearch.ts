import { useState } from 'react'
import { searchPosts } from '@/entities/post/api'
import { fetchUsers } from '@/entities/user/api'
import type { Post } from '@/entities/post/model'

interface UsePostSearchParams {
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  fetchPosts: () => Promise<void>
  initialSearchQuery?: string
}

export const usePostSearch = ({
  setPosts,
  setTotal,
  setLoading,
  fetchPosts,
  initialSearchQuery = "",
}: UsePostSearchParams) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)

  const searchPostsHandler = async () => {
    if (!searchQuery) {
      await fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [data, usersData] = await Promise.all([
        searchPosts(searchQuery),
        fetchUsers({ limit: 0, select: 'username,image' }),
      ])
      
      const postsWithUsers = data.posts.map((post) => {
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
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    searchPosts: searchPostsHandler,
  }
}
