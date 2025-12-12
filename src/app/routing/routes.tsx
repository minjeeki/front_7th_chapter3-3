// 단일 책임: 모든 라우팅 경로와 페이지 매핑 정의
import { Routes, Route } from "react-router-dom"
import PostsManagerPage from "../../pages/PostsManagerPage"

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PostsManagerPage />} />
  </Routes>
)