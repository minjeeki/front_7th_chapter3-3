import { create } from 'zustand'
import {
  fetchPosts as fetchPostsApi,
  fetchTags as fetchTagsApi,
  searchPosts as searchPostsApi,
  fetchPostsByTag as fetchPostsByTagApi,
  createPost as createPostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
} from '@/entities/post/api'
import { fetchUsers } from '@/entities/user/api'
import type { Post, Tag, CreatePostDto } from '@/entities/post/model'

interface PostsState {
  // 상태
  posts: Post[]
  tags: Tag[]
  loading: boolean
  total: number
  skip: number
  limit: number
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  selectedPost: Post | null
  newPost: CreatePostDto
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean

  // 액션
  setPosts: (posts: Post[]) => void
  setTags: (tags: Tag[]) => void
  setLoading: (loading: boolean) => void
  setTotal: (total: number) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: string) => void
  setSelectedPost: (post: Post | null) => void
  setNewPost: (post: CreatePostDto) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void

  // 비동기 액션
  fetchPosts: () => Promise<void>
  fetchTags: () => Promise<void>
  searchPosts: () => Promise<void>
  fetchPostsByTag: (tag: string) => Promise<void>
  addPost: () => Promise<void>
  updatePost: () => Promise<void>
  deletePost: (id: number) => Promise<void>
  goToPreviousPage: () => void
  goToNextPage: () => void

  // 계산된 값
  canGoPrevious: () => boolean
  canGoNext: () => boolean

  // 헬퍼
  openPostDetail: (post: Post) => void

  // 초기화
  initialize: (params: { skip?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string; tag?: string }) => Promise<void>
}

export const usePostsStore = create<PostsState>((set, get) => ({
  // 초기 상태
  posts: [],
  tags: [],
  loading: false,
  total: 0,
  skip: 0,
  limit: 10,
  searchQuery: '',
  selectedTag: '',
  sortBy: '',
  sortOrder: 'asc',
  selectedPost: null,
  newPost: { title: '', body: '', userId: 1 },
  showAddDialog: false,
  showEditDialog: false,
  showPostDetailDialog: false,

  // 상태 업데이트
  setPosts: (posts) => set({ posts }),
  setTags: (tags) => set({ tags }),
  setLoading: (loading) => set({ loading }),
  setTotal: (total) => set({ total }),
  setSkip: (skip) => {
    set({ skip })
    // skip 변경 시 게시물 자동 로드
    const { selectedTag } = get()
    if (selectedTag && selectedTag !== 'all') {
      get().fetchPostsByTag(selectedTag)
    } else {
      get().fetchPosts()
    }
  },
  setLimit: (limit) => {
    set({ limit, skip: 0 }) // limit 변경 시 첫 페이지로
    // limit 변경 시 게시물 자동 로드
    const { selectedTag } = get()
    if (selectedTag && selectedTag !== 'all') {
      get().fetchPostsByTag(selectedTag)
    } else {
      get().fetchPosts()
    }
  },
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTag: (selectedTag) => {
    set({ selectedTag })
    // selectedTag 변경 시 게시물 자동 로드
    if (selectedTag && selectedTag !== 'all') {
      get().fetchPostsByTag(selectedTag)
    } else {
      get().fetchPosts()
    }
  },
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setNewPost: (newPost) => set({ newPost }),
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),
  setShowPostDetailDialog: (showPostDetailDialog) => set({ showPostDetailDialog }),

  // 게시물 가져오기
  fetchPosts: async () => {
    const { skip, limit } = get()
    set({ loading: true })
    try {
      const [postsData, usersData] = await Promise.all([
        fetchPostsApi({ limit, skip }),
        fetchUsers({ limit: 0, select: 'username,image' }),
      ])

      const postsWithUsers = postsData.posts.map((post) => {
        const user = usersData.users.find((user) => user.id === post.userId)
        return {
          ...post,
          author: user
            ? {
                id: user.id,
                username: user.username,
                image: user.image || '',
              }
            : undefined,
        }
      })
      set({ posts: postsWithUsers, total: postsData.total })
    } catch (error) {
      console.error('게시물 가져오기 오류:', error)
    } finally {
      set({ loading: false })
    }
  },

  // 태그 가져오기
  fetchTags: async () => {
    try {
      const data = await fetchTagsApi()
      set({ tags: data })
    } catch (error) {
      console.error('태그 가져오기 오류:', error)
    }
  },

  // 게시물 검색
  searchPosts: async () => {
    const { searchQuery } = get()
    if (!searchQuery) {
      await get().fetchPosts()
      return
    }
    set({ loading: true })
    try {
      const [data, usersData] = await Promise.all([
        searchPostsApi(searchQuery),
        fetchUsers({ limit: 0, select: 'username,image' }),
      ])

      const postsWithUsers = data.posts.map((post) => {
        const user = usersData.users.find((user) => user.id === post.userId)
        return {
          ...post,
          author: user
            ? {
                id: user.id,
                username: user.username,
                image: user.image || '',
              }
            : undefined,
        }
      })
      set({ posts: postsWithUsers, total: data.total })
    } catch (error) {
      console.error('게시물 검색 오류:', error)
    } finally {
      set({ loading: false })
    }
  },

  // 태그별 게시물 가져오기
  fetchPostsByTag: async (tag: string) => {
    if (!tag || tag === 'all') {
      await get().fetchPosts()
      return
    }
    set({ loading: true })
    try {
      const [postsData, usersData] = await Promise.all([
        fetchPostsByTagApi(tag),
        fetchUsers({ limit: 0, select: 'username,image' }),
      ])

      const postsWithUsers = postsData.posts.map((post) => {
        const user = usersData.users.find((user) => user.id === post.userId)
        return {
          ...post,
          author: user
            ? {
                id: user.id,
                username: user.username,
                image: user.image || '',
              }
            : undefined,
        }
      })
      set({ posts: postsWithUsers, total: postsData.total })
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error)
    } finally {
      set({ loading: false })
    }
  },

  // 게시물 추가
  addPost: async () => {
    const { newPost, posts } = get()
    try {
      const data = await createPostApi(newPost)
      set({ posts: [data, ...posts], showAddDialog: false, newPost: { title: '', body: '', userId: 1 } })
    } catch (error) {
      console.error('게시물 추가 오류:', error)
    }
  },

  // 게시물 업데이트
  updatePost: async () => {
    const { selectedPost, posts } = get()
    if (!selectedPost) return
    try {
      const data = await updatePostApi(selectedPost.id, {
        title: selectedPost.title,
        body: selectedPost.body,
        userId: selectedPost.userId,
      })
      set({
        posts: posts.map((post) => (post.id === data.id ? data : post)),
        showEditDialog: false,
      })
    } catch (error) {
      console.error('게시물 업데이트 오류:', error)
    }
  },

  // 게시물 삭제
  deletePost: async (id: number) => {
    try {
      await deletePostApi(id)
      const { posts } = get()
      set({ posts: posts.filter((post) => post.id !== id) })
    } catch (error) {
      console.error('게시물 삭제 오류:', error)
    }
  },

  // 게시물 상세 보기 열기
  openPostDetail: (post: Post) => {
    set({ selectedPost: post, showPostDetailDialog: true })
  },

  // 페이지네이션
  goToPreviousPage: () => {
    const { skip, limit } = get()
    set({ skip: Math.max(0, skip - limit) })
  },

  goToNextPage: () => {
    const { skip, limit } = get()
    set({ skip: skip + limit })
  },

  // 계산된 값
  canGoPrevious: () => {
    const { skip } = get()
    return skip > 0
  },

  canGoNext: () => {
    const { skip, limit, total } = get()
    return skip + limit < total
  },

  // 초기화: URL 파라미터로 초기값 설정 및 데이터 로드
  initialize: async (params) => {
    const { skip, limit, search, sortBy, sortOrder, tag } = params
    const current = get()

    // 초기값 설정
    if (skip !== undefined && skip !== current.skip) set({ skip })
    if (limit !== undefined && limit !== current.limit) set({ limit })
    if (search !== undefined && search !== current.searchQuery) set({ searchQuery: search })
    if (sortBy !== undefined && sortBy !== current.sortBy) set({ sortBy })
    if (sortOrder !== undefined && sortOrder !== current.sortOrder) set({ sortOrder })
    if (tag !== undefined && tag !== current.selectedTag) set({ selectedTag: tag })

    // 태그 가져오기
    await get().fetchTags()

    // 게시물 가져오기
    const finalTag = tag !== undefined ? tag : current.selectedTag
    if (finalTag && finalTag !== 'all') {
      await get().fetchPostsByTag(finalTag)
    } else {
      await get().fetchPosts()
    }
  },
}))
