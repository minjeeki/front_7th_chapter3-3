import { NavigateFunction } from 'react-router-dom'

interface URLSyncParams {
  skip?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  tag?: string
}

/**
 * URL 파라미터를 동기화하는 유틸리티 함수
 */
export const updateURL = (navigate: NavigateFunction, params: URLSyncParams) => {
  const urlParams = new URLSearchParams()
  
  if (params.skip) urlParams.set('skip', params.skip.toString())
  if (params.limit) urlParams.set('limit', params.limit.toString())
  if (params.search) urlParams.set('search', params.search)
  if (params.sortBy) urlParams.set('sortBy', params.sortBy)
  if (params.sortOrder) urlParams.set('sortOrder', params.sortOrder)
  if (params.tag) urlParams.set('tag', params.tag)
  
  navigate(`?${urlParams.toString()}`)
}

/**
 * URL 파라미터를 읽어오는 유틸리티 함수
 */
export const parseURLParams = (search: string) => {
  const params = new URLSearchParams(search)
  return {
    skip: parseInt(params.get('skip') || '0'),
    limit: parseInt(params.get('limit') || '10'),
    search: params.get('search') || '',
    sortBy: params.get('sortBy') || '',
    sortOrder: params.get('sortOrder') || 'asc',
    tag: params.get('tag') || '',
  }
}
