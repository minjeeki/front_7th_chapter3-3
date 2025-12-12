import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from '@/shared/ui'
import { usePostsStore } from '@/app/stores'

export const EditPostDialog: React.FC = () => {
  const showEditDialog = usePostsStore((state) => state.showEditDialog)
  const setShowEditDialog = usePostsStore((state) => state.setShowEditDialog)
  const selectedPost = usePostsStore((state) => state.selectedPost)
  const setSelectedPost = usePostsStore((state) => state.setSelectedPost)
  const updatePost = usePostsStore((state) => state.updatePost)
  
  if (!selectedPost) return null

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost.title}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost.body}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
