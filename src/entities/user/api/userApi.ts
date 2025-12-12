import type { User, UsersResponse, UsersQueryParams } from '@/entities/user/model/types'

/**
 * 단일 사용자 조회
 */
export const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  
  if (!response.ok) {
    throw new Error('사용자 정보 가져오기 실패')
  }
  
  return response.json()
}

/**
 * 사용자 목록 조회
 */
export const fetchUsers = async (params: UsersQueryParams = {}): Promise<UsersResponse> => {
  const { limit = 0, skip = 0, select } = params
  const queryParams = new URLSearchParams()
  
  if (limit) queryParams.set('limit', limit.toString())
  if (skip) queryParams.set('skip', skip.toString())
  if (select) queryParams.set('select', select)
  
  const response = await fetch(`/api/users?${queryParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('사용자 목록 가져오기 실패')
  }
  
  return response.json()
}
