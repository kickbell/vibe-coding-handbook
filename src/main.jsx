import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import './styles.css'

// "/#section" 으로 돌아왔을 때 해당 섹션으로 이동
function HashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120 })
  }, [hash, pathname])
  return null
}

function Root() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
      <HashScroll />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/term/:id', element: <Detail /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
