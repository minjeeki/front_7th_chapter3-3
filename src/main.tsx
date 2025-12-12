/**
 * 애플리케이션 진입점 (Entry Point)
 * 
 * 단일 책임: React 애플리케이션을 DOM에 마운트하고 개발 모드 엄격 모드를 활성화
 * - React 18의 createRoot API를 사용하여 애플리케이션을 렌더링
 * - StrictMode로 개발 중 잠재적 문제를 조기에 발견
 * - 전역 CSS 스타일을 로드
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
