import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import Navbar from './components/include/Navbar'
import Footer from './components/include/Footer'
import Home from './pages/all/Home'
import Companies from './pages/all/Companies'
import CompanyDetail from './pages/all/CompanyDetail'
import Jobs from './pages/all/Jobs'
import JobDetail from './pages/all/JobDetail'
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import Profile from './pages/profile'
import WriteReview from './pages/review'
import AdminDashboard from './pages/admin/adminDashboard'
import AdminCompanies from './pages/admin/adminCompanies'
import AdminReviews from './pages/admin/adminReviews'
import AdminJobs from './pages/admin/adminJobs'
import AdminIndustries from './pages/admin/adminIndustries'
import AdminJobFunctions from './pages/admin/adminJobFunctions'
import AdminUsers from './pages/admin/adminUsers'
import AdminLogin from './pages/admin/adminLogin'

const API_URL = 'http://127.0.0.1:8000/api'

function NotFound() {
  return (
    <div className="px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">ไม่พบหน้าที่ต้องการ</p>
    </div>
  )
}

function AdminAccess() {
  const [access, setAccess] = useState('checking')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setAccess('login')
      return
    }

    axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      localStorage.setItem('user', JSON.stringify(data))
      setAccess(data.role === 'admin' ? 'allowed' : 'forbidden')
    }).catch((error) => {
      console.error(error)
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        setAccess('login')
      } else {
        setAccess('error')
      }
    })
  }, [])

  if (access === 'checking') {
    return <div className="px-6 py-16 text-center text-gray-500">กำลังตรวจสอบสิทธิ์...</div>
  }
  if (access === 'login') {
    return <Navigate to="/admin/login" replace />
  }
  if (access === 'forbidden') {
    return <Navigate to="/" replace />
  }
  if (access === 'error') {
    return (
      <div role="alert" className="px-6 py-16 text-center text-red-600">
        ไม่สามารถตรวจสอบสิทธิ์ผู้ดูแลระบบได้ กรุณาลองใหม่ภายหลัง
      </div>
    )
  }

  const links = [
    ['/admin', 'ภาพรวม', true],
    ['/admin/companies', 'บริษัท'],
    ['/admin/reviews', 'รีวิว'],
    ['/admin/jobs', 'ตำแหน่งงาน'],
    ['/admin/industries', 'อุตสาหกรรม'],
    ['/admin/job-functions', 'สายงาน'],
    ['/admin/users', 'ผู้ใช้งาน']
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900">จัดการระบบ</h1>
      <nav className="mt-5 flex flex-wrap gap-3 border-b pb-4">
        {links.map(([to, label, end]) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-medium ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <section className="py-6"><Outlet /></section>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  const isAdminLogin = location.pathname === '/admin/login'

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminLogin && <Navbar />}
      <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/review" element={<WriteReview />} />
        <Route path="/reviews/write" element={<Navigate to="/review" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminAccess />}>
          <Route index element={<AdminDashboard />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="industries" element={<AdminIndustries />} />
          <Route path="job-functions" element={<AdminJobFunctions />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      {!isAdminLogin && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
