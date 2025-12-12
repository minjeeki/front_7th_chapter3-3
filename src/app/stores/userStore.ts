import { create } from 'zustand'
import { fetchUser as fetchUserApi } from '@/entities/user/api'
import type { User } from '@/entities/user/model'

interface UserState {
  // 상태
  selectedUser: User | null
  showUserModal: boolean
  loading: boolean

  // 액션
  setSelectedUser: (user: User | null) => void
  setShowUserModal: (show: boolean) => void
  setLoading: (loading: boolean) => void

  // 비동기 액션
  openUserModal: (user: { id: number }) => Promise<void>
  closeUserModal: () => void
}

export const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  selectedUser: null,
  showUserModal: false,
  loading: false,

  // 상태 업데이트
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setShowUserModal: (showUserModal) => set({ showUserModal }),
  setLoading: (loading) => set({ loading }),

  // 사용자 모달 열기
  openUserModal: async (user: { id: number }) => {
    set({ loading: true })
    try {
      const userData = await fetchUserApi(user.id)
      set({ selectedUser: userData, showUserModal: true })
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error)
    } finally {
      set({ loading: false })
    }
  },

  // 사용자 모달 닫기
  closeUserModal: () => {
    set({ showUserModal: false, selectedUser: null })
  },
}))
