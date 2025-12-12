import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import type { Post } from '@/entities/post/model'
import { CommentList } from '@/features/comment'
import { highlightText } from '@/shared/lib'
import type { Comment } from '@/entities/comment/model'

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments: Comment[]
  searchQuery: string
  onAddCommentClick: (postId: number) => void
  onEditCommentClick: (comment: Comment) => void
  onDeleteCommentClick: (id: number, postId: number) => void
  onLikeCommentClick: (id: number, postId: number) => void
}

export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery,
  onAddCommentClick,
  onEditCommentClick,
  onDeleteCommentClick,
  onLikeCommentClick,
}) => {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>
          <CommentList
            postId={post.id}
            comments={comments}
            searchQuery={searchQuery}
            highlightText={highlightText}
            onAddClick={() => onAddCommentClick(post.id)}
            onEditClick={onEditCommentClick}
            onDeleteClick={onDeleteCommentClick}
            onLikeClick={onLikeCommentClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
