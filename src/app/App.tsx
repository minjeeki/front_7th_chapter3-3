/**
 * 애플리케이션 라우팅 설정
 * 
 * 단일 책임: URL 경로에 따라 적절한 페이지를 렌더링하는 라우팅 구조 정의
 * - BrowserRouter로 클라이언트 사이드 라우팅 활성화
 * - 전역 레이아웃을 적용하여 모든 페이지에 공통 구조 제공
 * - 향후 Routes와 Route를 사용하여 여러 페이지 라우팅 확장 가능
 */
import { BrowserRouter as Router } from "react-router-dom"
import Layout from "./layouts/MainLayout/Layout.tsx"
import { AppRoutes } from "./routing/routes.tsx"

const App = () => {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  )
}

export default App