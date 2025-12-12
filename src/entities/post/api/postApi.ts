import type { Post, CreatePostDto, UpdatePostDto, PostsResponse, PostsQueryParams } from '../model/types'

/**
 * 게시물 목록 조회
 */
export const fetchPosts = async (params: PostsQueryParams = {}): Promise<PostsResponse> => {
  const { limit = 10, skip = 0 } = params
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  
  if (!response.ok) {
    throw new Error('게시물 가져오기 실패')
  }
  
  return response.json()
}

/**
 * 게시물 검색
 */
export const searchPosts = async (query: string): Promise<PostsResponse> => {
  if (!query.trim()) {
    throw new Error('검색어가 필요합니다')
  }
  
  const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
  
  if (!response.ok) {
    throw new Error('게시물 검색 실패')
  }
  
  return response.json()
}

/**
 * 태그별 게시물 조회
 */
export const fetchPostsByTag = async (tag: string): Promise<PostsResponse> => {
  if (!tag || tag === 'all') {
    throw new Error('유효한 태그가 필요합니다')
  }
  
  const response = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`)
  
  if (!response.ok) {
    throw new Error('태그별 게시물 가져오기 실패')
  }
  
  return response.json()
}

/**
 * 게시물 추가
 */
export const createPost = async (post: CreatePostDto): Promise<Post> => {
  const response = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
  
  if (!response.ok) {
    throw new Error('게시물 추가 실패')
  }
  
  return response.json()
}

/**
 * 게시물 수정
 */
export const updatePost = async (id: number, post: UpdatePostDto): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
  
  if (!response.ok) {
    throw new Error('게시물 수정 실패')
  }
  
  return response.json()
}

/**
 * 게시물 삭제
 */
export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('게시물 삭제 실패')
  }
}
