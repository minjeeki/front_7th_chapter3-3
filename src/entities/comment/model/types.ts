export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    id: number
    username: string
  }
}

export interface CreateCommentDto {
  body: string
  postId: number | null
  userId: number
}

export interface UpdateCommentDto {
  body: string
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}
