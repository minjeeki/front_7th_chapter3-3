import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import { CommentList } from '@/features/comment'
import { highlightText } from '@/shared/lib'
import type { Post } from '@/entities/post/model'

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  searchQuery: string
}

export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  open,
  onOpenChange,
  post,
  searchQuery,
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
          {/* CommentList는 features이므로 스토어를 직접 사용 */}
          <CommentList postId={post.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
