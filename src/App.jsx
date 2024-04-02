import Navbar from "./Navbar"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
