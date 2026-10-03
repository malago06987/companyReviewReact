import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    profile_image: null
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleFileChange = (e) => {
    setForm({
      ...form,
      profile_image: e.target.files[0] || null
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const formData = new FormData()

      formData.append('full_name', form.full_name)
      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append(
        'password_confirmation',
        form.password_confirmation
      )

      if (form.profile_image) {
        formData.append(
          'profile_image',
          form.profile_image
        )
      }

      const response = await axios.post(
        `${API_URL}/register`,
        formData
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

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors

        const firstError = Object.values(errors)[0]

        if (Array.isArray(firstError)) {
          setError(firstError[0])
        } else {
          setError('ข้อมูลไม่ถูกต้อง')
        }

      } else if (error.response?.data?.message) {
        setError(error.response.data.message)

      } else {
        setError('ไม่สามารถสมัครสมาชิกได้')
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
            สมัครสมาชิก
          </h1>

          <p className="mt-2 text-gray-500">
            สร้างบัญชีเพื่อเริ่มใช้งาน
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

          {/* Full Name */}
          <div>

            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อ-นามสกุล
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="กรอกชื่อ-นามสกุล"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


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
              placeholder="อย่างน้อย 6 ตัวอักษร"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Confirm Password */}
          <div>

            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              ยืนยันรหัสผ่าน
            </label>

            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* Profile Image */}
          <div>

            <label
              htmlFor="profile_image"
              className="block text-sm font-medium text-gray-700"
            >
              รูปโปรไฟล์
            </label>

            <input
              id="profile_image"
              name="profile_image"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              รองรับ JPG, JPEG, PNG ขนาดไม่เกิน 2MB
            </p>

          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'กำลังสมัครสมาชิก...'
              : 'สมัครสมาชิก'}
          </button>

        </form>


        {/* Login */}
        <div className="mt-6 text-center text-sm text-gray-600">

          <span>
            มีบัญชีอยู่แล้ว?
          </span>

          <Link
            to="/login"
            className="ml-2 text-blue-600 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>

        </div>


        {/* Home */}
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

export default Register