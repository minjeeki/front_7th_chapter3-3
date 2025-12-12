import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from '@/shared/ui'
import { useCommentsStore } from '@/app/stores'

export const EditCommentDialog: React.FC = () => {
  const showEditDialog = useCommentsStore((state) => state.showEditDialog)
  const setShowEditDialog = useCommentsStore((state) => state.setShowEditDialog)
  const selectedComment = useCommentsStore((state) => state.selectedComment)
  const setSelectedComment = useCommentsStore((state) => state.setSelectedComment)
  const updateComment = useCommentsStore((state) => state.updateComment)
  
  if (!selectedComment) return null

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
