import { Outlet } from 'react-router-dom'
import Navbar from '../compornents/navbar'
import Footer from '../compornents/footer'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout