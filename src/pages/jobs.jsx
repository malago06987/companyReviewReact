import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const [companyId, setCompanyId] = useState(
    searchParams.get('company_id') || ''
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = 'http://127.0.0.1:8000/api'

  useEffect(() => {
    fetchJobs(searchParams.get('company_id') || '')
  }, [searchParams])

  const fetchJobs = async (company) => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/jobs`,
        {
          params: {
            company_id: company || undefined
          }
        }
      )

      setJobs(response.data.data || [])
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลตำแหน่งงานได้')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (e) => {
    e.preventDefault()

    if (companyId.trim()) {
      setSearchParams({
        company_id: companyId.trim()
      })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ค้นหางาน
          </h1>

          <p className="mt-2 text-gray-600">
            ค้นหาตำแหน่งงานที่เปิดรับจากบริษัทต่าง ๆ
          </p>
        </div>


        {/* Filter */}
        <form
          onSubmit={handleFilter}
          className="mt-8 rounded-xl bg-white p-5 shadow-sm"
        >

          <label className="block text-sm font-medium text-gray-700">
            รหัสบริษัท
          </label>

          <div className="mt-2 flex gap-3">

            <input
              type="number"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              placeholder="กรอกรหัสบริษัท"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              ค้นหา
            </button>

          </div>

        </form>


        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-gray-500">
            กำลังโหลดตำแหน่งงาน...
          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="py-16 text-center text-red-500">
            {error}
          </div>
        )}


        {/* No Jobs */}
        {!loading && !error && jobs.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              ไม่พบตำแหน่งงาน
            </p>
          </div>
        )}


        {/* Jobs */}
        {!loading && !error && jobs.length > 0 && (

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {jobs.map((job) => (

              <div
                key={job.job_id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >

                {/* Job title */}
                <h2 className="text-xl font-bold text-gray-900">
                  {job.job_title}
                </h2>


                {/* Company */}
                <Link
                  to={`/companies/${job.company?.company_id}`}
                  className="mt-2 block text-blue-600 hover:underline"
                >
                  {job.company?.company_name || 'ไม่ระบุบริษัท'}
                </Link>


                {/* Job Function */}
                <p className="mt-2 text-sm text-gray-500">
                  สายงาน: {job.job_function?.function_name || 'ไม่ระบุ'}
                </p>


                {/* Information */}
                <div className="mt-5 space-y-2 text-sm text-gray-600">

                  {job.work_location && (
                    <p>
                      📍 {job.work_location}
                    </p>
                  )}

                  {job.employment_type && (
                    <p>
                      รูปแบบงาน: {job.employment_type}
                    </p>
                  )}

                  {job.salary && (
                    <p>
                      เงินเดือน: {job.salary}
                    </p>
                  )}

                </div>


                {/* Description */}
                {job.job_description && (
                  <p className="mt-5 line-clamp-3 text-sm text-gray-500">
                    {job.job_description}
                  </p>
                )}


                {/* Status */}
                <div className="mt-5">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    เปิดรับสมัคร
                  </span>

                </div>


                {/* Detail */}
                <Link
                  to={`/jobs/${job.job_id}`}
                  className="mt-6 block rounded-lg border border-blue-600 py-2 text-center text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  ดูรายละเอียดงาน
                </Link>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default Jobs