import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

function readStoredUser() {
  const savedUser = localStorage.getItem('user')

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch (error) {
    console.error(error)
    return null
  }
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(readStoredUser)

  const [logoutError, setLogoutError] = useState('')

  useEffect(() => {
    setUser(readStoredUser())
  }, [location.pathname])

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token')

    try {
      if (token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (error) {
      console.error(error)
      setLogoutError('ไม่สามารถออกจากระบบบนเซิร์ฟเวอร์ได้')
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      setUser(null)
      navigate('/login')
    }
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600"
        >
          Company Review
        </Link>


        {/* Menu */}
        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
          >
            หน้าแรก
          </Link>

          <Link
            to="/companies"
            className="text-gray-700 hover:text-blue-600"
          >
            บริษัท
          </Link>

          <Link
            to="/jobs"
            className="text-gray-700 hover:text-blue-600"
          >
            หางาน
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-600"
            >
              จัดการระบบ
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600"
              >
                โปรไฟล์
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                เข้าสู่ระบบ
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}

        </div>

      </div>
      {logoutError && (
        <p className="px-6 pb-3 text-right text-sm text-red-600">
          {logoutError}
        </p>
      )}
    </nav>
  )
}

export default Navbar