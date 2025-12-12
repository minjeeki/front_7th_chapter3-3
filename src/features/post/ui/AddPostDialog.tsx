import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from '@/shared/ui'
import type { CreatePostDto } from '@/entities/post/model'

interface AddPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPost: CreatePostDto
  setNewPost: (post: CreatePostDto) => void
  onAdd: () => void
}

export const AddPostDialog: React.FC<AddPostDialogProps> = ({
  open,
  onOpenChange,
  newPost,
  setNewPost,
  onAdd,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={onAdd}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
