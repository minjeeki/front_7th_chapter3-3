# FSD에서 API 위치 문제 해결 방안

## 🤔 문제 상황

FSD 아키텍처에서 `entities/api`와 `features/api` 모두에 API 함수가 있다면, 개발자가 API를 찾기 위해 두 곳을 확인해야 하는 문제가 발생합니다.

```
entities/post/api/postApi.ts     ← 여기?
features/post/api/postApi.ts     ← 아니면 여기?
```

---

## ✅ 해결 방안

### 방안 1: **명확한 역할 분리** (권장)

#### entities/api: 기본 CRUD 작업
- **역할**: 엔티티의 기본적인 CRUD 작업 (1:1 매핑)
- **특징**: 순수한 데이터 접근, 재사용 가능
- **예시**:
  ```typescript
  // entities/post/api/postApi.ts
  export const fetchPosts = async (params) => { ... }
  export const createPost = async (post) => { ... }
  export const updatePost = async (id, post) => { ... }
  export const deletePost = async (id) => { ... }
  ```

#### features/api: 기능 특화 API
- **역할**: 특정 기능에 특화된 복잡한 API 호출
- **특징**: 여러 엔티티 조합, 비즈니스 로직 포함
- **예시**:
  ```typescript
  // features/post-export/api/exportApi.ts
  export const exportPostsToExcel = async (filters) => {
    // 여러 API를 조합하거나 특수한 엔드포인트 호출
    const posts = await fetchPosts(filters)
    const users = await fetchUsers()
    // ... 복잡한 변환 로직
    return generateExcel(posts, users)
  }
  ```

#### 구분 기준
```
✅ entities/api에 두는 경우:
- 단일 엔티티의 기본 CRUD
- 다른 곳에서도 재사용 가능
- RESTful API와 1:1 매핑

✅ features/api에 두는 경우:
- 특정 기능에만 사용되는 API
- 여러 엔티티를 조합하는 복잡한 로직
- 기능 특화된 엔드포인트 (예: /api/posts/export)
```

---

### 방안 2: **features에 api를 두지 않기** (더 권장)

현재 프로젝트처럼 **features에는 api를 두지 않고**, entities의 api를 조합해서 사용합니다.

#### 현재 프로젝트 패턴
```typescript
// ✅ 좋은 예: features는 entities의 api를 사용
// features/post/model/usePostManagement.ts
import { createPost, updatePost, deletePost } from '@/entities/post/api'

export const usePostManagement = () => {
  const addPost = async () => {
    const data = await createPost(newPost)  // entities의 api 사용
    // ... 추가 로직
  }
}
```

#### 복잡한 기능의 경우
```typescript
// features/post-export/model/usePostExport.ts
import { fetchPosts } from '@/entities/post/api'
import { fetchUsers } from '@/entities/user/api'

export const usePostExport = () => {
  const exportToExcel = async (filters) => {
    // 여러 entities의 api를 조합
    const [posts, users] = await Promise.all([
      fetchPosts(filters),
      fetchUsers()
    ])
    // ... 변환 로직
    return generateExcel(posts, users)
  }
}
```

**장점**:
- ✅ API 위치가 명확함 (항상 entities에만)
- ✅ 중복 제거
- ✅ 재사용성 향상

---

### 방안 3: **명명 규칙으로 구분**

만약 features에도 api가 필요하다면, 명확한 명명 규칙을 사용합니다.

#### 명명 규칙
```typescript
// entities: 기본 동사 사용
entities/post/api/postApi.ts
  - fetchPosts()
  - createPost()
  - updatePost()
  - deletePost()

// features: 기능명 포함
features/post-export/api/postExportApi.ts
  - exportPostsToExcel()
  - exportPostsToPDF()

features/post-analytics/api/postAnalyticsApi.ts
  - getPostStatistics()
  - getPostTrends()
```

#### 파일 구조
```
entities/post/api/
  └── postApi.ts          // 기본 CRUD

features/post-export/api/
  └── postExportApi.ts    // 기능 특화 (명확한 기능명)

features/post-analytics/api/
  └── postAnalyticsApi.ts // 기능 특화 (명확한 기능명)
```

---

### 방안 4: **문서화와 컨벤션**

팀 내에서 명확한 컨벤션을 수립하고 문서화합니다.

#### README 작성
```markdown
# API 위치 가이드

## entities/api
- 엔티티의 기본 CRUD 작업
- 재사용 가능한 순수한 데이터 접근 함수
- 예: `entities/post/api/postApi.ts`

## features/api
- 특정 기능에만 사용되는 API
- 여러 엔티티를 조합하거나 복잡한 비즈니스 로직 포함
- 예: `features/post-export/api/exportApi.ts`

## API 찾는 방법
1. 기본 CRUD → entities/api 확인
2. 기능 특화 → features/[feature-name]/api 확인
3. 모르겠다면 → entities/api 먼저 확인
```

#### 코드 주석
```typescript
/**
 * 게시물 목록 조회
 * 
 * @location entities/post/api/postApi.ts
 * @usage 기본 게시물 조회 시 사용
 * @see features/post-export/api/exportApi.ts - 내보내기 기능
 */
export const fetchPosts = async (params) => { ... }
```

---

## 🎯 실전 권장 사항

### 1. **기본 원칙: entities에만 API 두기**

```typescript
// ✅ 권장: entities에만 API
entities/
  ├── post/api/postApi.ts
  ├── user/api/userApi.ts
  └── comment/api/commentApi.ts

features/
  ├── post/
  │   └── model/
  │       └── usePostManagement.ts  // entities의 api 사용
  └── post-export/
      └── model/
          └── usePostExport.ts      // 여러 entities의 api 조합
```

### 2. **복잡한 기능은 model에서 조합**

```typescript
// features/post-export/model/usePostExport.ts
import { fetchPosts } from '@/entities/post/api'
import { fetchUsers } from '@/entities/user/api'
import { fetchComments } from '@/entities/comment/api'

export const usePostExport = () => {
  const exportToExcel = async (filters) => {
    // 여러 entities의 api를 조합
    const [posts, users, comments] = await Promise.all([
      fetchPosts(filters),
      fetchUsers(),
      fetchComments(filters.postId)
    ])
    
    // 변환 로직
    return transformToExcel(posts, users, comments)
  }
}
```

### 3. **특수한 경우만 features/api 사용**

```typescript
// ✅ features/api를 사용하는 경우
// - 완전히 다른 엔드포인트 (예: /api/export, /api/analytics)
// - 여러 엔티티를 한 번에 처리하는 특수 API
// - 기능에만 특화되어 재사용 불가능한 API

// features/post-export/api/exportApi.ts
export const exportPostsToExcel = async (filters) => {
  // 특수한 엔드포인트 호출
  const response = await fetch('/api/posts/export', {
    method: 'POST',
    body: JSON.stringify(filters)
  })
  return response.blob()
}
```

---

## 📋 체크리스트

API를 어디에 둘지 결정할 때:

- [ ] **기본 CRUD 작업인가?** → `entities/api`
- [ ] **여러 곳에서 재사용 가능한가?** → `entities/api`
- [ ] **단일 엔티티만 다루는가?** → `entities/api`
- [ ] **특정 기능에만 사용되는가?** → `features/api` 고려
- [ ] **여러 엔티티를 조합하는가?** → `features/model`에서 entities의 api 조합
- [ ] **특수한 엔드포인트인가?** → `features/api`

---

## 🔍 현재 프로젝트 분석

현재 프로젝트는 **방안 2 (features에 api 없음)**를 사용하고 있습니다.

### 현재 구조
```
entities/
  ├── post/api/postApi.ts      ✅ 모든 Post API
  ├── user/api/userApi.ts      ✅ 모든 User API
  └── comment/api/commentApi.ts ✅ 모든 Comment API

features/
  ├── post/model/
  │   └── usePostManagement.ts  ✅ entities의 api 사용
  └── comment/model/
      └── useCommentManagement.ts ✅ entities의 api 사용
```

### 장점
- ✅ API 위치가 명확함 (항상 entities에만)
- ✅ 중복 없음
- ✅ 재사용성 높음
- ✅ 찾기 쉬움

### 개선 가능한 점
만약 복잡한 기능이 추가된다면:
```typescript
// 예: 게시물 통계 기능 추가 시
features/post-analytics/model/usePostAnalytics.ts
import { fetchPosts } from '@/entities/post/api'
import { fetchComments } from '@/entities/comment/api'

export const usePostAnalytics = () => {
  const getStatistics = async () => {
    // 여러 entities의 api를 조합
    const [posts, comments] = await Promise.all([
      fetchPosts(),
      fetchComments()
    ])
    return calculateStatistics(posts, comments)
  }
}
```

---

## 💡 결론

**가장 권장하는 방법**:
1. **기본 원칙**: 모든 API는 `entities/api`에만 둔다
2. **복잡한 기능**: `features/model`에서 여러 entities의 api를 조합
3. **특수한 경우만**: `features/api` 사용 (명확한 기능명으로 구분)

이렇게 하면:
- ✅ API 위치가 명확함
- ✅ 찾기 쉬움
- ✅ 중복 없음
- ✅ 재사용성 높음
