import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 禁用 React DevTools 提示
if (typeof window !== 'undefined') {
  (window as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    isDisabled: true,
    supportsFiber: true,
    inject: () => {},
    onCommitFiberRoot: () => {},
    onCommitFiberUnmount: () => {},
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
