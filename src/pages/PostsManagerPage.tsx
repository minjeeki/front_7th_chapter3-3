import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import type { Post } from "@/entities/post/model"
import { usePostsManager, AddPostDialog, EditPostDialog } from "@/features/post"
import { useCommentManagement, AddCommentDialog, EditCommentDialog } from "@/features/comment"
import { useUserInfo, UserModal } from "@/features/user"
import { PostTable } from "@/widgets/post-table"
import { PostDetailDialog } from "@/widgets/post-detail"
import { PostControls } from "@/widgets/post-controls"
import { Pagination } from "@/widgets/pagination"

const PostsManager = () => {
  // 모든 게시물 관련 로직을 하나의 훅으로 통합
  const postsManager = usePostsManager()
  const commentManagement = useCommentManagement()
  const userInfo = useUserInfo()

  // 게시물 상세 보기 핸들러
  const handlePostDetailClick = (post: Post) => {
    postsManager.openPostDetail(post)
    commentManagement.fetchComments(post.id)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => postsManager.postManagement.setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostControls
            searchQuery={postsManager.postSearch.searchQuery}
            onSearchChange={postsManager.postSearch.setSearchQuery}
            onSearch={postsManager.postSearch.searchPosts}
            selectedTag={postsManager.postFilter.selectedTag}
            onTagChange={postsManager.postFilter.setSelectedTag}
            sortBy={postsManager.postFilter.sortBy}
            onSortByChange={postsManager.postFilter.setSortBy}
            sortOrder={postsManager.postFilter.sortOrder}
            onSortOrderChange={postsManager.postFilter.setSortOrder}
            tags={postsManager.tags}
          />

          {/* 게시물 테이블 */}
          {postsManager.loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={postsManager.posts}
              searchQuery={postsManager.postSearch.searchQuery}
              selectedTag={postsManager.postFilter.selectedTag}
              onTagClick={postsManager.postFilter.setSelectedTag}
              onUserClick={userInfo.openUserModal}
              onDetailClick={handlePostDetailClick}
              onEditClick={(post) => {
                postsManager.postManagement.setSelectedPost(post)
                postsManager.postManagement.setShowEditDialog(true)
              }}
              onDeleteClick={postsManager.postManagement.deletePost}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={postsManager.postPagination.limit}
            onLimitChange={postsManager.postPagination.setLimit}
            canGoPrevious={postsManager.postPagination.canGoPrevious}
            canGoNext={postsManager.postPagination.canGoNext}
            onPrevious={postsManager.postPagination.goToPreviousPage}
            onNext={postsManager.postPagination.goToNextPage}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        open={postsManager.postManagement.showAddDialog}
        onOpenChange={postsManager.postManagement.setShowAddDialog}
        newPost={postsManager.postManagement.newPost}
        setNewPost={postsManager.postManagement.setNewPost}
        onAdd={postsManager.postManagement.addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        open={postsManager.postManagement.showEditDialog}
        onOpenChange={postsManager.postManagement.setShowEditDialog}
        selectedPost={postsManager.postManagement.selectedPost}
        setSelectedPost={postsManager.postManagement.setSelectedPost}
        onUpdate={postsManager.postManagement.updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={commentManagement.showAddDialog}
        onOpenChange={commentManagement.setShowAddDialog}
        newComment={commentManagement.newComment}
        setNewComment={commentManagement.setNewComment}
        onAdd={commentManagement.addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        open={commentManagement.showEditDialog}
        onOpenChange={commentManagement.setShowEditDialog}
        selectedComment={commentManagement.selectedComment}
        setSelectedComment={commentManagement.setSelectedComment}
        onUpdate={commentManagement.updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={postsManager.showPostDetailDialog}
        onOpenChange={postsManager.setShowPostDetailDialog}
        post={postsManager.postManagement.selectedPost}
        comments={
          postsManager.postManagement.selectedPost
            ? commentManagement.comments[postsManager.postManagement.selectedPost.id] || []
            : []
        }
        searchQuery={postsManager.postSearch.searchQuery}
        onAddCommentClick={commentManagement.openAddDialog}
        onEditCommentClick={commentManagement.openEditDialog}
        onDeleteCommentClick={commentManagement.deleteComment}
        onLikeCommentClick={commentManagement.likeComment}
      />

      {/* 사용자 모달 */}
      <UserModal
        open={userInfo.showUserModal}
        onOpenChange={userInfo.setShowUserModal}
        user={userInfo.selectedUser}
        loading={userInfo.loading}
      />
    </Card>
  )
}

export default PostsManager
