import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/ui'
import type { Post } from '@/entities/post/model'
import { PostTableRow } from './PostTableRow'

interface PostTableProps {
  posts: Post[]
  searchQuery: string
  selectedTag?: string
  onTagClick: (tag: string) => void
  onUserClick: (user: { id: number }) => void
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onDeleteClick: (postId: number) => void
}

export const PostTable: React.FC<PostTableProps> = ({
  posts,
  searchQuery,
  selectedTag,
  onTagClick,
  onUserClick,
  onDetailClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <PostTableRow
            key={post.id}
            post={post}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            onTagClick={onTagClick}
            onUserClick={onUserClick}
            onDetailClick={onDetailClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </TableBody>
    </Table>
  )
}
