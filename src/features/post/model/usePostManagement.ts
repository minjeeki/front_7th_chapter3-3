import { useState } from 'react'
import { createPost, updatePost, deletePost } from '@/entities/post/api'
import type { Post, CreatePostDto } from '@/entities/post/model'

export const usePostManagement = (posts: Post[], setPosts: (posts: Post[]) => void) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState<CreatePostDto>({ title: "", body: "", userId: 1 })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const addPost = async () => {
    try {
      const data = await createPost(newPost)
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const updatePostHandler = async () => {
    if (!selectedPost) return
    try {
      const data = await updatePost(selectedPost.id, {
        title: selectedPost.title,
        body: selectedPost.body,
        userId: selectedPost.userId,
      })
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const deletePostHandler = async (id: number) => {
    try {
      await deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return {
    selectedPost,
    setSelectedPost,
    newPost,
    setNewPost,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    addPost,
    updatePost: updatePostHandler,
    deletePost: deletePostHandler,
  }
}
