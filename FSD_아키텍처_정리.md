# FSD 아키텍처 및 단일 책임 원칙 적용 정리

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [FSD 구조 적용](#fsd-구조-적용)
3. [단일 책임 원칙 적용](#단일-책임-원칙-적용)
4. [레이어별 역할 및 책임](#레이어별-역할-및-책임)
5. [주요 설계 결정사항](#주요-설계-결정사항)
6. [개선 효과](#개선-효과)

---

## 프로젝트 개요

게시물 관리자(Posts Manager) 애플리케이션을 **Feature-Sliced Design (FSD)** 아키텍처와 **단일 책임 원칙(Single Responsibility Principle)**을 적용하여 리팩토링한 프로젝트입니다.

### 초기 문제점
- 컴포넌트가 너무 크고 복잡함
- TypeScript 타입 처리 부실
- 상태 관리 개념 부재로 과도한 상태 보유
- useEffect 관리 미흡
- 비동기 처리 로직 복잡

### 개선 목표
- TypeScript를 활용한 타입 안정성 확보
- 단일 책임 원칙을 통한 작은 컴포넌트 구성
- 관심사의 분리를 통한 명확한 폴더 구조
- FSD 아키텍처 적용

---

## FSD 구조 적용

### 전체 디렉토리 구조

```
src/
├── app/                    # 애플리케이션 초기화 및 전역 설정
│   ├── stores/            # 전역 상태 관리 (Zustand)
│   ├── routing/           # 라우팅 설정
│   └── layouts/           # 레이아웃 컴포넌트
│
├── pages/                 # 페이지 컴포넌트
│   └── PostsManagerPage.tsx
│
├── widgets/               # 복합 UI 블록 (재사용 가능한 독립적 컴포넌트)
│   ├── post-table/       # 게시물 테이블 위젯
│   ├── post-controls/    # 게시물 검색/필터 컨트롤 위젯
│   ├── post-detail/      # 게시물 상세 보기 위젯
│   └── pagination/       # 페이지네이션 위젯
│
├── features/              # 사용자 기능 단위
│   ├── post/             # 게시물 관련 기능
│   │   ├── model/        # 비즈니스 로직 (커스텀 훅)
│   │   └── ui/           # 기능별 UI 컴포넌트
│   ├── comment/          # 댓글 관련 기능
│   └── user/             # 사용자 관련 기능
│
├── entities/              # 비즈니스 엔티티
│   ├── post/             # 게시물 엔티티
│   │   ├── api/          # API 호출 함수
│   │   └── model/        # 타입 정의
│   ├── comment/          # 댓글 엔티티
│   └── user/             # 사용자 엔티티
│
└── shared/                # 공통 코드
    ├── ui/               # 공통 UI 컴포넌트
    └── lib/              # 유틸리티 함수
```

### FSD 레이어별 역할

#### 1. **app/** - 애플리케이션 계층
- **역할**: 애플리케이션의 초기화, 전역 설정, 라우팅
- **책임**:
  - 전역 상태 관리 스토어 정의 (Zustand)
  - 라우팅 설정
  - 레이아웃 구성
- **예시**: `app/stores/postsStore.ts`, `app/stores/commentsStore.ts`

#### 2. **pages/** - 페이지 계층
- **역할**: 전체 페이지 컴포넌트 조합
- **책임**:
  - 위젯과 기능 컴포넌트를 조합하여 페이지 구성
  - 최소한의 로직만 포함 (얇은 레이어 유지)
- **예시**: `pages/PostsManagerPage.tsx`

#### 3. **widgets/** - 위젯 계층
- **역할**: 독립적이고 재사용 가능한 복합 UI 블록
- **책임**:
  - 여러 기능과 엔티티를 조합한 UI 컴포넌트
  - 자체적인 상태 관리 가능
- **예시**:
  - `widgets/post-table/`: 게시물 목록 테이블
  - `widgets/post-controls/`: 검색, 필터, 정렬 컨트롤
  - `widgets/pagination/`: 페이지네이션 컨트롤

#### 4. **features/** - 기능 계층
- **역할**: 사용자 기능 단위 (사용자 행동 중심)
- **책임**:
  - 특정 사용자 기능의 UI와 로직 관리
  - `model/`: 비즈니스 로직 (커스텀 훅)
  - `ui/`: 기능별 UI 컴포넌트
- **예시**:
  - `features/post/`: 게시물 추가, 수정, 검색, 필터링
  - `features/comment/`: 댓글 추가, 수정, 목록 조회

#### 5. **entities/** - 엔티티 계층
- **역할**: 비즈니스 엔티티 정의
- **책임**:
  - 도메인 모델 타입 정의 (`model/types.ts`)
  - API 호출 함수 (`api/`)
  - 엔티티 관련 기본 로직
- **예시**:
  - `entities/post/api/postApi.ts`: 게시물 API 호출
  - `entities/post/model/types.ts`: Post, Tag 등 타입 정의

#### 6. **shared/** - 공유 계층
- **역할**: 프로젝트 전반에서 사용되는 공통 코드
- **책임**:
  - 재사용 가능한 UI 컴포넌트 (`ui/`)
  - 유틸리티 함수 (`lib/`)
- **예시**:
  - `shared/ui/table/`: 테이블 컴포넌트
  - `shared/ui/button/`: 버튼 컴포넌트
  - `shared/lib/urlSync.ts`: URL 동기화 유틸리티

---

## 단일 책임 원칙 적용

### 1. Feature Model의 세분화

`features/post/model/` 디렉토리에서 각 커스텀 훅이 하나의 책임만 담당하도록 분리:

#### `usePostSearch.ts` - 검색 기능만 담당
```typescript
// 책임: 게시물 검색 기능만 관리
export const usePostSearch = ({ setPosts, setTotal, setLoading, fetchPosts, initialSearchQuery }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  
  const searchPostsHandler = async () => {
    // 검색 로직만 처리
  }
  
  return { searchQuery, setSearchQuery, searchPosts: searchPostsHandler }
}
```

#### `usePostFilter.ts` - 필터링 기능만 담당
```typescript
// 책임: 태그 필터링 및 정렬 기능만 관리
export const usePostFilter = ({ setPosts, setTotal, setLoading, fetchPosts, ... }) => {
  const [selectedTag, setSelectedTag] = useState(initialSelectedTag)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  
  // 태그별 필터링 로직만 처리
  return { selectedTag, setSelectedTag, sortBy, setSortBy, sortOrder, setSortOrder }
}
```

#### `usePostPagination.ts` - 페이지네이션만 담당
```typescript
// 책임: 페이지네이션 상태 및 로직만 관리
export const usePostPagination = ({ initialSkip, initialLimit, initialTotal }) => {
  const [skip, setSkip] = useState(initialSkip)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(initialTotal)
  
  // 페이지네이션 로직만 처리
  return { skip, limit, total, setSkip, setLimit, setTotal, canGoPrevious, canGoNext }
}
```

#### `usePostList.ts` - 게시물 목록 조회만 담당
```typescript
// 책임: 게시물 목록 데이터 페칭만 관리
export const usePostList = ({ skip, limit, onTotalChange, onLoadingChange }) => {
  // 게시물 목록 조회 로직만 처리
}
```

#### `usePostManagement.ts` - 게시물 CRUD만 담당
```typescript
// 책임: 게시물 생성, 수정, 삭제 기능만 관리
export const usePostManagement = (posts, setPosts) => {
  // CRUD 로직만 처리
}
```

#### `useTags.ts` - 태그 조회만 담당
```typescript
// 책임: 태그 목록 조회만 관리
export const useTags = () => {
  // 태그 조회 로직만 처리
}
```

#### `useURLSync.ts` - URL 동기화만 담당
```typescript
// 책임: URL 파라미터와 상태 동기화만 관리
export const useURLSync = ({ skip, limit, search, sortBy, sortOrder, tag, ... }) => {
  // URL 동기화 로직만 처리
}
```

#### `usePostsManager.ts` - 통합 조정만 담당
```typescript
// 책임: 여러 훅을 조합하여 통합 인터페이스 제공
export const usePostsManager = () => {
  const postPagination = usePostPagination(...)
  const postSearch = usePostSearch(...)
  const postFilter = usePostFilter(...)
  // ... 다른 훅들 조합
  
  return { /* 통합된 인터페이스 */ }
}
```

### 2. API 레이어 분리

`entities/post/api/postApi.ts`에서 각 함수가 하나의 API 엔드포인트만 담당:

```typescript
// 각 함수는 하나의 API 호출만 담당
export const fetchPosts = async (params: PostsQueryParams): Promise<PostsResponse> => { ... }
export const searchPosts = async (query: string): Promise<PostsResponse> => { ... }
export const fetchPostsByTag = async (tag: string): Promise<PostsResponse> => { ... }
export const createPost = async (post: CreatePostDto): Promise<Post> => { ... }
export const updatePost = async (id: number, post: UpdatePostDto): Promise<Post> => { ... }
export const deletePost = async (id: number): Promise<void> => { ... }
export const fetchTags = async (): Promise<TagsResponse> => { ... }
```

### 3. UI 컴포넌트 분리

#### 위젯 레이어
- **PostTable**: 게시물 테이블 표시만 담당
- **PostControls**: 검색/필터 컨트롤만 담당
- **Pagination**: 페이지네이션 UI만 담당
- **PostDetailDialog**: 게시물 상세 보기만 담당

#### Feature UI 레이어
- **AddPostDialog**: 게시물 추가 UI만 담당
- **EditPostDialog**: 게시물 수정 UI만 담당
- **AddCommentDialog**: 댓글 추가 UI만 담당
- **EditCommentDialog**: 댓글 수정 UI만 담당

#### Shared UI 레이어
- **Table**: 테이블 구조만 제공 (데이터와 무관)
- **Button**: 버튼 UI만 제공
- **Dialog**: 다이얼로그 UI만 제공
- **Input**: 입력 필드 UI만 제공

### 4. 상태 관리 분리

#### 전역 상태 (app/stores/)
- **postsStore**: 게시물 관련 전역 상태만 관리
- **commentsStore**: 댓글 관련 전역 상태만 관리
- **userStore**: 사용자 관련 전역 상태만 관리

각 스토어는 자신의 도메인에만 집중하며, 다른 도메인의 상태를 직접 참조하지 않음.

---

## 레이어별 역할 및 책임

### 의존성 규칙

FSD의 핵심 원칙인 **의존성 규칙**을 준수:

```
app → pages → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어에만 의존 가능
- 하위 레이어는 상위 레이어에 의존 불가
- 같은 레이어 내에서는 서로 참조 가능

### 예시: 의존성 흐름

```
PostsManagerPage (pages)
  ↓
PostTable (widgets)
  ↓
Post (entities) + AddPostDialog (features)
  ↓
Table (shared/ui) + postApi (entities/api)
```

---

## 주요 설계 결정사항

### 1. 상태 관리 전략

**결정**: Zustand를 사용한 전역 상태 관리 + 커스텀 훅을 통한 로컬 상태 관리

**이유**:
- 전역 상태는 `app/stores/`에서 중앙 관리
- 기능별 로직은 `features/*/model/`의 커스텀 훅으로 분리
- 각 훅은 단일 책임을 가지며, 필요시 조합하여 사용

### 2. API 호출 위치

**결정**: `entities/*/api/`에서 API 함수 정의, `features/*/model/`에서 호출

**이유**:
- 엔티티 레이어에서 API 인터페이스 정의 (재사용성)
- 기능 레이어에서 비즈니스 로직과 함께 호출 (관심사 분리)

### 3. 타입 정의 위치

**결정**: `entities/*/model/types.ts`에서 엔티티 타입 정의

**이유**:
- 엔티티 타입은 도메인 모델이므로 entities 레이어에 위치
- 다른 레이어에서 import하여 사용 (단일 소스)

### 4. URL 동기화 처리

**결정**: `shared/lib/urlSync.ts`에서 유틸리티 제공, `features/post/model/useURLSync.ts`에서 사용

**이유**:
- URL 파싱/생성 로직은 공통 유틸리티로 분리
- URL 동기화 로직은 기능 레이어에서 관리

### 5. 컴포넌트 크기 제한

**결정**: 각 컴포넌트는 100줄 이하로 유지, 복잡한 경우 분리

**이유**:
- 단일 책임 원칙 준수
- 가독성 및 유지보수성 향상

---

## 개선 효과

### 1. 코드 가독성 향상
- 각 파일이 명확한 책임을 가져 이해하기 쉬움
- 파일 크기가 작아져 탐색이 용이함

### 2. 재사용성 증대
- 공통 컴포넌트와 로직을 shared 레이어에서 관리
- 기능별 훅을 독립적으로 사용 가능

### 3. 테스트 용이성
- 각 훅과 컴포넌트가 독립적이어서 단위 테스트 작성이 쉬움
- 모킹이 간단함

### 4. 유지보수성 향상
- 변경 사항이 특정 레이어/기능에만 영향
- 버그 추적이 용이함

### 5. 확장성
- 새로운 기능 추가 시 해당 features 디렉토리에만 추가
- 기존 코드에 미치는 영향 최소화

### 6. 협업 효율성
- 명확한 폴더 구조로 작업 분담이 쉬움
- 코드 리뷰 시 변경 범위 파악이 용이함

---

## 체크리스트

### FSD 구조 적용
- [x] `app/` 레이어: 전역 설정 및 상태 관리
- [x] `pages/` 레이어: 페이지 컴포넌트 (얇은 레이어)
- [x] `widgets/` 레이어: 복합 UI 블록
- [x] `features/` 레이어: 사용자 기능 단위
- [x] `entities/` 레이어: 비즈니스 엔티티
- [x] `shared/` 레이어: 공통 코드

### 단일 책임 원칙
- [x] 각 커스텀 훅이 하나의 책임만 담당
- [x] 각 API 함수가 하나의 엔드포인트만 담당
- [x] 각 UI 컴포넌트가 하나의 역할만 담당
- [x] 각 스토어가 하나의 도메인만 관리

### 관심사 분리
- [x] API 호출 로직 분리 (`entities/api/`)
- [x] 비즈니스 로직 분리 (`features/*/model/`)
- [x] UI 컴포넌트 분리 (`features/*/ui/`, `widgets/`, `shared/ui/`)
- [x] 타입 정의 분리 (`entities/*/model/types.ts`)

### 의존성 규칙
- [x] 상위 레이어 → 하위 레이어 의존성만 허용
- [x] 같은 레이어 내 상호 참조 가능
- [x] 순환 의존성 없음

---

## 결론

이 프로젝트는 **FSD 아키텍처**와 **단일 책임 원칙**을 적용하여 다음과 같은 개선을 달성했습니다:

1. **명확한 구조**: 각 레이어와 파일의 역할이 명확함
2. **작은 단위**: 각 컴포넌트와 훅이 하나의 책임만 담당
3. **재사용성**: 공통 코드를 적절히 추출하여 재사용
4. **유지보수성**: 변경 사항의 영향 범위가 명확함
5. **확장성**: 새로운 기능 추가가 용이함

이러한 구조는 프로젝트의 규모가 커질수록 그 가치가 더욱 명확해집니다.
