import { useEffect, useState } from 'react'
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
  const [profileImagePreview, setProfileImagePreview] = useState('')

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview)
      }
    }
  }, [profileImagePreview])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null
    setForm({
      ...form,
      profile_image: file
    })
    setProfileImagePreview(file ? URL.createObjectURL(file) : '')
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
            <span className="block text-sm font-medium text-gray-700">
              รูปโปรไฟล์ <span className="font-normal text-gray-400">(ไม่บังคับ)</span>
            </span>

            <label
              htmlFor="profile_image"
              className="mt-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-5 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            >
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="ตัวอย่างรูปโปรไฟล์"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-8 w-8"
                  >
                    <circle cx="12" cy="8" r="3.25" />
                    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                    <circle cx="19" cy="18" r="3" fill="white" />
                    <path d="M19 16.5v3M17.5 18h3" />
                  </svg>
                </span>
              )}
              <span className="mt-3 font-semibold text-gray-800">
                {form.profile_image ? 'เลือกรูปอื่น' : 'คลิกเพื่อเลือกรูปโปรไฟล์'}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                หรือเลือกรูปจากอุปกรณ์ของคุณ
              </span>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            <p className="mt-2 text-center text-xs text-gray-500">
              รองรับ JPG, JPEG, PNG ขนาดไม่เกิน 2MB
            </p>
            {form.profile_image && (
              <p className="mt-2 truncate text-center text-sm text-blue-700" aria-live="polite">
                เลือกแล้ว: {form.profile_image.name}
              </p>
            )}
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            สมัครสมาชิก
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