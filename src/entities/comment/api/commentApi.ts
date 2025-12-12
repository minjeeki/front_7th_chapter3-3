import type { Comment, CreateCommentDto, UpdateCommentDto, CommentsResponse } from '@/entities/comment/model/types'

/**
 * 게시물별 댓글 조회
 */
export const fetchComments = async (postId: number): Promise<CommentsResponse> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  
  if (!response.ok) {
    throw new Error('댓글 가져오기 실패')
  }
  
  return response.json()
}

/**
 * 댓글 추가
 */
export const createComment = async (comment: CreateCommentDto): Promise<Comment> => {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  })
  
  if (!response.ok) {
    throw new Error('댓글 추가 실패')
  }
  
  return response.json()
}

/**
 * 댓글 수정
 */
export const updateComment = async (id: number, comment: UpdateCommentDto): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  })
  
  if (!response.ok) {
    throw new Error('댓글 수정 실패')
  }
  
  return response.json()
}

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number): Promise<void> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('댓글 삭제 실패')
  }
}

/**
 * 댓글 좋아요
 */
export const likeComment = async (id: number, likes: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes }),
  })
  
  if (!response.ok) {
    throw new Error('댓글 좋아요 실패')
  }
  
  return response.json()
}
