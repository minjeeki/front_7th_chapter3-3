import { create } from 'zustand'
import {
  fetchComments as fetchCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
  likeComment as likeCommentApi,
} from '@/entities/comment/api'
import type { Comment, CreateCommentDto } from '@/entities/comment/model'

interface CommentsState {
  // 상태
  comments: Record<number, Comment[]>
  selectedComment: Comment | null
  newComment: CreateCommentDto
  showAddDialog: boolean
  showEditDialog: boolean

  // 액션
  setComments: (comments: Record<number, Comment[]>) => void
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (comment: CreateCommentDto) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void

  // 비동기 액션
  fetchComments: (postId: number) => Promise<void>
  addComment: () => Promise<void>
  updateComment: () => Promise<void>
  deleteComment: (id: number, postId: number) => Promise<void>
  likeComment: (id: number, postId: number) => Promise<void>

  // 헬퍼
  openAddDialog: (postId: number) => void
  openEditDialog: (comment: Comment) => void
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  // 초기 상태
  comments: {},
  selectedComment: null,
  newComment: { body: '', postId: null, userId: 1 },
  showAddDialog: false,
  showEditDialog: false,

  // 상태 업데이트
  setComments: (comments) => set({ comments }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  setNewComment: (newComment) => set({ newComment }),
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),

  // 댓글 가져오기
  fetchComments: async (postId: number) => {
    const { comments } = get()
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await fetchCommentsApi(postId)
      set({ comments: { ...comments, [postId]: data.comments } })
    } catch (error) {
      console.error('댓글 가져오기 오류:', error)
    }
  },

  // 댓글 추가
  addComment: async () => {
    const { newComment, comments } = get()
    try {
      const data = await createCommentApi(newComment)
      set({
        comments: {
          ...comments,
          [data.postId]: [...(comments[data.postId] || []), data],
        },
        showAddDialog: false,
        newComment: { body: '', postId: null, userId: 1 },
      })
    } catch (error) {
      console.error('댓글 추가 오류:', error)
    }
  },

  // 댓글 업데이트
  updateComment: async () => {
    const { selectedComment, comments } = get()
    if (!selectedComment) return
    try {
      const data = await updateCommentApi(selectedComment.id, { body: selectedComment.body })
      set({
        comments: {
          ...comments,
          [data.postId]: comments[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
        },
        showEditDialog: false,
      })
    } catch (error) {
      console.error('댓글 업데이트 오류:', error)
    }
  },

  // 댓글 삭제
  deleteComment: async (id: number, postId: number) => {
    try {
      await deleteCommentApi(id)
      const { comments } = get()
      set({
        comments: {
          ...comments,
          [postId]: comments[postId].filter((comment) => comment.id !== id),
        },
      })
    } catch (error) {
      console.error('댓글 삭제 오류:', error)
    }
  },

  // 댓글 좋아요
  likeComment: async (id: number, postId: number) => {
    const { comments } = get()
    const currentComment = comments[postId]?.find((c) => c.id === id)
    if (!currentComment) return

    try {
      const data = await likeCommentApi(id, currentComment.likes + 1)
      set({
        comments: {
          ...comments,
          [postId]: comments[postId].map((comment) => (comment.id === data.id ? data : comment)),
        },
      })
    } catch (error) {
      console.error('댓글 좋아요 오류:', error)
    }
  },

  // 댓글 추가 다이얼로그 열기
  openAddDialog: (postId: number) => {
    set({ newComment: { body: '', postId, userId: 1 }, showAddDialog: true })
  },

  // 댓글 수정 다이얼로그 열기
  openEditDialog: (comment: Comment) => {
    set({ selectedComment: comment, showEditDialog: true })
  },
}))
