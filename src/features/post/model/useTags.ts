import { useEffect, useState } from 'react'
import { fetchTags as fetchTagsApi } from '@/entities/post/api'
import type { Tag } from '@/entities/post/model'

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTags = async () => {
      setLoading(true)
      try {
        const data = await fetchTagsApi()
        setTags(data)
      } catch (error) {
        console.error('태그 가져오기 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTags()
  }, [])

  return {
    tags,
    loading,
  }
}
