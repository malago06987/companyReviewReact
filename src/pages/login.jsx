import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../api'

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: form.email,
          password: form.password
        }
      )

      const data = response.data

      localStorage.setItem(
        'access_token',
        data.access_token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      navigate('/')

    } catch (error) {
      console.error(error)

      if (error.response?.status === 401) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('ไม่สามารถเข้าสู่ระบบได้')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center bg-gray-50 px-6 py-10">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">

        {/* Header */}
        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            เข้าสู่ระบบ
          </h1>

          <p className="mt-2 text-gray-500">
            เข้าสู่ระบบเพื่อใช้งานระบบ
          </p>

        </div>


        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              อีเมล
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Password */}
          <div>

            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่าน
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="กรอกรหัสผ่าน"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'กำลังเข้าสู่ระบบ...'
              : 'เข้าสู่ระบบ'}
          </button>

        </form>


        {/* Register */}
        <div className="mt-6 text-center text-sm text-gray-600">

          <span>
            ยังไม่มีบัญชี?
          </span>

          <Link
            to="/register"
            className="ml-2 text-blue-600 hover:underline"
          >
            สมัครสมาชิก
          </Link>

        </div>


        {/* Back Home */}
        <div className="mt-4 text-center">

          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← กลับหน้าหลัก
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Login