import { useState } from 'react'
import {
  fetchComments as fetchCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
  likeComment as likeCommentApi,
} from '@/entities/comment/api'
import type { Comment, CreateCommentDto } from '@/entities/comment/model'

interface UseCommentManagementParams {
  onCommentAdded?: (comment: Comment) => void
  onCommentUpdated?: (comment: Comment) => void
  onCommentDeleted?: (id: number, postId: number) => void
}

export const useCommentManagement = (params?: UseCommentManagementParams) => {
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<CreateCommentDto>({
    body: '',
    postId: null,
    userId: 1,
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await fetchCommentsApi(postId)
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error('댓글 가져오기 오류:', error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const data = await createCommentApi(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddDialog(false)
      setNewComment({ body: '', postId: null, userId: 1 })
      params?.onCommentAdded?.(data)
    } catch (error) {
      console.error('댓글 추가 오류:', error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return
    try {
      const data = await updateCommentApi(selectedComment.id, { body: selectedComment.body })
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditDialog(false)
      params?.onCommentUpdated?.(data)
    } catch (error) {
      console.error('댓글 업데이트 오류:', error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentApi(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
      params?.onCommentDeleted?.(id, postId)
    } catch (error) {
      console.error('댓글 삭제 오류:', error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (!currentComment) return

      const data = await likeCommentApi(id, currentComment.likes + 1)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
    } catch (error) {
      console.error('댓글 좋아요 오류:', error)
    }
  }

  // 댓글 추가 다이얼로그 열기
  const openAddDialog = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddDialog(true)
  }

  // 댓글 수정 다이얼로그 열기
  const openEditDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditDialog(true)
  }

  return {
    comments,
    selectedComment,
    setSelectedComment,
    newComment,
    setNewComment,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    openAddDialog,
    openEditDialog,
  }
}
