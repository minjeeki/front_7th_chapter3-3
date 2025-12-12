import { useEffect, useState } from 'react'
import { fetchPosts as fetchPostsApi } from '@/entities/post/api'
import { fetchUsers } from '@/entities/user/api'
import type { Post } from '@/entities/post/model'

interface UsePostListParams {
  skip: number
  limit: number
  onTotalChange: (total: number) => void
  onLoadingChange: (loading: boolean) => void
}

export const usePostList = ({
  skip,
  limit,
  onTotalChange,
  onLoadingChange,
}: UsePostListParams) => {
  const [posts, setPosts] = useState<Post[]>([])

  const fetchPosts = async () => {
    onLoadingChange(true)
    try {
      const [postsData, usersData] = await Promise.all([
        fetchPostsApi({ limit, skip }),
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
      onTotalChange(postsData.total)
    } catch (error) {
      console.error('게시물 가져오기 오류:', error)
    } finally {
      onLoadingChange(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit])

  return {
    posts,
    setPosts,
    refetch: fetchPosts,
  }
}
