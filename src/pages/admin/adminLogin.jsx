import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
      const { access_token: token, user } = response.data
      if (user.role !== 'admin') {
        setError('บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ')
        return
      }

      localStorage.setItem('access_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/admin', { replace: true })
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.message || 'ไม่สามารถเข้าสู่ระบบผู้ดูแลได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-gray-900">เข้าสู่ระบบผู้ดูแล</h1>
        <p className="mt-2 text-center text-gray-500">ใช้บัญชีผู้ดูแลที่ลงทะเบียนไว้ในระบบ</p>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-gray-700">
            อีเมล
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            รหัสผ่าน
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </label>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            เข้าสู่ระบบผู้ดูแล
          </button>
        </form>
        <Link to="/login" className="mt-5 block text-center text-sm text-blue-600 hover:underline">
          เข้าสู่ระบบผู้ใช้งานทั่วไป
        </Link>
      </section>
    </main>
  )
}

export default AdminLogin
