import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user')

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser)
    } catch {
      return null
    }
  })

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')

    setUser(null)
    navigate('/login')
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
    </nav>
  )
}

export default Navbar