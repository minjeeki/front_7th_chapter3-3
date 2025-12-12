import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from '@/shared/ui'
import { usePostsStore } from '@/app/stores'

export const AddPostDialog: React.FC = () => {
  const showAddDialog = usePostsStore((state) => state.showAddDialog)
  const setShowAddDialog = usePostsStore((state) => state.setShowAddDialog)
  const newPost = usePostsStore((state) => state.newPost)
  const setNewPost = usePostsStore((state) => state.setNewPost)
  const addPost = usePostsStore((state) => state.addPost)
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
