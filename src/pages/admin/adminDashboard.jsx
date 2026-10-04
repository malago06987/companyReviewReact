import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

function AdminDashboard() {
  const [counts, setCounts] = useState(null)
  const [averageRating, setAverageRating] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    Promise.all([
      axios.get(`${API_URL}/companies`, config),
      axios.get(`${API_URL}/reviews`, config),
      axios.get(`${API_URL}/jobs`, config),
      axios.get(`${API_URL}/industries`, config),
      axios.get(`${API_URL}/job-functions`, config),
      axios.get(`${API_URL}/users`, config)
    ]).then(([companiesResponse, ...responses]) => {
      const companiesData = companiesResponse.data?.data ?? companiesResponse.data
      if (!Array.isArray(companiesData)) {
        throw new TypeError('Expected the companies API response to contain a collection.')
      }
      const ratings = companiesData
        .map((company) => Number(company.rating?.overall))
        .filter((rating) => Number.isFinite(rating) && rating > 0)
      setAverageRating(ratings.length
        ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
        : 0)

      setCounts([
        companiesData.length,
        ...responses.map((response) => {
        const body = response.data?.data ?? response.data
        return response.data?.total
          ?? response.data?.meta?.total
          ?? (Array.isArray(body) ? body.length : 0)
        })
      ])
    }).catch((requestError) => {
      console.error(requestError)
      setError('ไม่สามารถโหลดสรุปข้อมูลได้')
    })
  }, [])

  const sections = [
    ['บริษัท', '/admin/companies'],
    ['รีวิว', '/admin/reviews'],
    ['ตำแหน่งงาน', '/admin/jobs'],
    ['อุตสาหกรรม', '/admin/industries'],
    ['สายงาน', '/admin/job-functions'],
    ['ผู้ใช้งาน', '/admin/users']
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">ภาพรวมระบบ</h2>
      <p className="mt-2 text-gray-600">จัดการข้อมูลแพลตฟอร์มรีวิวบริษัทและค้นหางาน</p>
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(([label, path], index) => (
          <Link key={path} to={path} className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">จำนวน{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{counts?.[index] ?? '—'}</p>
            <p className="mt-3 text-sm text-blue-600">จัดการข้อมูล →</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">คะแนนเฉลี่ยรวมของบริษัทที่มีคะแนน</p>
        <p className="mt-2 text-3xl font-bold text-yellow-600">
          {averageRating === null ? '—' : `★ ${averageRating.toFixed(1)} / 5`}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          คำนวณค่าเฉลี่ยจากคะแนนรวมของแต่ละบริษัท ไม่ใช่ค่าเฉลี่ยถ่วงตามจำนวนรีวิว
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
