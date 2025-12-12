import { useState } from 'react'
import { fetchUser as fetchUserApi } from '@/entities/user/api'
import type { User } from '@/entities/user/model'

export const useUserInfo = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // 사용자 모달 열기
  const openUserModal = async (user: { id: number }) => {
    setLoading(true)
    try {
      const userData = await fetchUserApi(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 사용자 모달 닫기
  const closeUserModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  return {
    selectedUser,
    showUserModal,
    loading,
    openUserModal,
    closeUserModal,
    setShowUserModal,
  }
}
