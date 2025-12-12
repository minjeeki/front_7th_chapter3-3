import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from '@/shared/ui'
import { useCommentsStore } from '@/app/stores'

export const AddCommentDialog: React.FC = () => {
  const showAddDialog = useCommentsStore((state) => state.showAddDialog)
  const setShowAddDialog = useCommentsStore((state) => state.setShowAddDialog)
  const newComment = useCommentsStore((state) => state.newComment)
  const setNewComment = useCommentsStore((state) => state.setNewComment)
  const addComment = useCommentsStore((state) => state.addComment)
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
