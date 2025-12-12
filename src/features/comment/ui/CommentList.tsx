import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui'
import type { Comment } from '@/entities/comment/model'

interface CommentListProps {
  postId: number
  comments: Comment[]
  searchQuery?: string
  highlightText?: (text: string, highlight: string) => React.ReactNode
  onAddClick: () => void
  onEditClick: (comment: Comment) => void
  onDeleteClick: (id: number, postId: number) => void
  onLikeClick: (id: number, postId: number) => void
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  comments,
  searchQuery = '',
  highlightText,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onLikeClick,
}) => {
  const defaultHighlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        )}
      </span>
    )
  }

  const highlight = highlightText || defaultHighlightText

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={onAddClick}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlight(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onLikeClick(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEditClick(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteClick(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
