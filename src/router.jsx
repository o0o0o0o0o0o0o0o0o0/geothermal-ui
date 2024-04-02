import { createBrowserRouter, Outlet } from "react-router-dom"
import { Geophires } from "./pages/Geophires"
import { Explorer } from "./pages/Explorer"
import { Hipra } from "./pages/Hipra"
import Navbar from "./Navbar"

export const router = createBrowserRouter([
  {
    element: <NavLayout />,
    children: [
      { path: "/", element: <Geophires /> },
      { path: "/explorer", element: <Explorer /> },
      { path: "/hip-ra", element: <Hipra /> },
    ],
  },
])

function NavLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
