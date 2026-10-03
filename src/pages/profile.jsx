import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL, getAssetUrl } from '../api'

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setUser(response.data)

      localStorage.setItem(
        'user',
        JSON.stringify(response.data)
      )

    } catch (error) {
      console.error(error)

      if (error.response?.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        navigate('/login')
        return
      }

      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')

    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token')

    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

    } catch (error) {
      console.error(error)

    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')

      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-gray-500">
          กำลังโหลดข้อมูลโปรไฟล์...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-16 text-center">

        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={fetchUser}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          ลองอีกครั้ง
        </button>

      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              โปรไฟล์ของฉัน
            </h1>

            <p className="mt-2 text-gray-600">
              ข้อมูลบัญชีผู้ใช้งาน
            </p>
          </div>

          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            ← หน้าหลัก
          </Link>

        </div>


        {/* Profile */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col items-center gap-6 sm:flex-row">

            {/* Profile Image */}
            {user.profile_image ? (

              <img
                src={getAssetUrl(user.profile_image)}
                alt={user.full_name}
                className="h-28 w-28 rounded-full object-cover"
              />

            ) : (

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 text-3xl text-gray-500">
                {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

            )}


            {/* User Info */}
            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                {user.full_name}
              </h2>

              <p className="mt-2 text-gray-600">
                {user.email}
              </p>

              {user.role && (
                <p className="mt-2 text-sm text-gray-500">
                  บทบาท: {user.role}
                </p>
              )}

            </div>

          </div>

        </section>


        {/* Account Information */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            ข้อมูลบัญชี
          </h2>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                ชื่อ-นามสกุล
              </p>

              <p className="mt-1 text-gray-900">
                {user.full_name || 'ไม่ระบุ'}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                อีเมล
              </p>

              <p className="mt-1 text-gray-900">
                {user.email || 'ไม่ระบุ'}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                บทบาท
              </p>

              <p className="mt-1 text-gray-900">
                {user.role || 'user'}
              </p>
            </div>


            {user.status && (
              <div>
                <p className="text-sm text-gray-500">
                  สถานะ
                </p>

                <p className="mt-1 text-gray-900">
                  {user.status}
                </p>
              </div>
            )}

          </div>

        </section>


        {/* Actions */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50"
            >
              แก้ไขโปรไฟล์
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
            >
              ออกจากระบบ
            </button>

          </div>

        </section>

      </div>

    </div>
  )
}

export default Profile