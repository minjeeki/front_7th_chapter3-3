import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from '@/shared/ui'
import type { CreateCommentDto } from '@/entities/comment/model'

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newComment: CreateCommentDto
  setNewComment: (comment: CreateCommentDto) => void
  onAdd: () => void
}

export const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  open,
  onOpenChange,
  newComment,
  setNewComment,
  onAdd,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={onAdd}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
