import { useEffect } from "react"
import { Plus } from "lucide-react"
import { useLocation } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import type { Post } from "@/entities/post/model"
import { AddPostDialog, EditPostDialog } from "@/features/post"
import { AddCommentDialog, EditCommentDialog } from "@/features/comment"
import { UserModal } from "@/features/user"
import { PostTable } from "@/widgets/post-table"
import { PostDetailDialog } from "@/widgets/post-detail"
import { PostControls } from "@/widgets/post-controls"
import { Pagination } from "@/widgets/pagination"
import { usePostsStore, useCommentsStore, useUserStore, useURLSync } from "@/app/stores"
import { parseURLParams } from "@/shared/lib"

const PostsManager = () => {
  const location = useLocation()

  // Zustand 스토어 사용
  const postsStore = usePostsStore()
  const commentsStore = useCommentsStore()
  const userStore = useUserStore()

  // URL 동기화
  useURLSync()

  // 초기화: URL 파라미터에서 초기값 설정 및 데이터 로드
  useEffect(() => {
    const params = parseURLParams(location.search)
    postsStore.initialize({
      skip: params.skip,
      limit: params.limit,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      tag: params.tag,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 게시물 상세 보기 핸들러
  const handlePostDetailClick = (post: Post) => {
    postsStore.openPostDetail(post)
    commentsStore.fetchComments(post.id)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => postsStore.setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostControls
            searchQuery={postsStore.searchQuery}
            onSearchChange={postsStore.setSearchQuery}
            onSearch={postsStore.searchPosts}
            selectedTag={postsStore.selectedTag}
            onTagChange={postsStore.setSelectedTag}
            sortBy={postsStore.sortBy}
            onSortByChange={postsStore.setSortBy}
            sortOrder={postsStore.sortOrder}
            onSortOrderChange={postsStore.setSortOrder}
            tags={postsStore.tags}
          />

          {/* 게시물 테이블 */}
          {postsStore.loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={postsStore.posts}
              searchQuery={postsStore.searchQuery}
              selectedTag={postsStore.selectedTag}
              onTagClick={postsStore.setSelectedTag}
              onUserClick={userStore.openUserModal}
              onDetailClick={handlePostDetailClick}
              onEditClick={(post) => {
                postsStore.setSelectedPost(post)
                postsStore.setShowEditDialog(true)
              }}
              onDeleteClick={postsStore.deletePost}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={postsStore.limit}
            onLimitChange={postsStore.setLimit}
            canGoPrevious={postsStore.canGoPrevious()}
            canGoNext={postsStore.canGoNext()}
            onPrevious={postsStore.goToPreviousPage}
            onNext={postsStore.goToNextPage}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        open={postsStore.showAddDialog}
        onOpenChange={postsStore.setShowAddDialog}
        newPost={postsStore.newPost}
        setNewPost={postsStore.setNewPost}
        onAdd={postsStore.addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        open={postsStore.showEditDialog}
        onOpenChange={postsStore.setShowEditDialog}
        selectedPost={postsStore.selectedPost}
        setSelectedPost={postsStore.setSelectedPost}
        onUpdate={postsStore.updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={commentsStore.showAddDialog}
        onOpenChange={commentsStore.setShowAddDialog}
        newComment={commentsStore.newComment}
        setNewComment={commentsStore.setNewComment}
        onAdd={commentsStore.addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        open={commentsStore.showEditDialog}
        onOpenChange={commentsStore.setShowEditDialog}
        selectedComment={commentsStore.selectedComment}
        setSelectedComment={commentsStore.setSelectedComment}
        onUpdate={commentsStore.updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={postsStore.showPostDetailDialog}
        onOpenChange={postsStore.setShowPostDetailDialog}
        post={postsStore.selectedPost}
        comments={
          postsStore.selectedPost
            ? commentsStore.comments[postsStore.selectedPost.id] || []
            : []
        }
        searchQuery={postsStore.searchQuery}
        onAddCommentClick={commentsStore.openAddDialog}
        onEditCommentClick={commentsStore.openEditDialog}
        onDeleteCommentClick={commentsStore.deleteComment}
        onLikeCommentClick={commentsStore.likeComment}
      />

      {/* 사용자 모달 */}
      <UserModal
        open={userStore.showUserModal}
        onOpenChange={userStore.setShowUserModal}
        user={userStore.selectedUser}
        loading={userStore.loading}
      />
    </Card>
  )
}

export default PostsManager
