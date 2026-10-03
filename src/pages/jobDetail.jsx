import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

function JobDetail() {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = 'http://127.0.0.1:8000/api'

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/jobs/${id}`
      )

      setJob(response.data.data || response.data)
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลตำแหน่งงานได้')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-16 text-center">
        <p className="text-gray-500">
          กำลังโหลดข้อมูลตำแหน่งงาน...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 py-16 text-center">

        <p className="text-red-500">
          {error}
        </p>

        <Link
          to="/jobs"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← กลับไปหน้าค้นหางาน
        </Link>

      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen px-6 py-16 text-center">

        <p className="text-gray-500">
          ไม่พบข้อมูลตำแหน่งงาน
        </p>

        <Link
          to="/jobs"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← กลับไปหน้าค้นหางาน
        </Link>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/jobs"
          className="text-blue-600 hover:underline"
        >
          ← กลับไปหน้าค้นหางาน
        </Link>


        {/* Job Header */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                {job.job_title}
              </h1>

              <Link
                to={`/companies/${job.company?.company_id}`}
                className="mt-3 inline-block text-lg text-blue-600 hover:underline"
              >
                {job.company?.company_name || 'ไม่ระบุบริษัท'}
              </Link>

            </div>


            <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              เปิดรับสมัคร
            </span>

          </div>

        </section>


        {/* Job Information */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            ข้อมูลตำแหน่งงาน
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <p className="text-sm text-gray-500">
                สายงาน
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {job.job_function?.function_name || 'ไม่ระบุ'}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                รูปแบบการทำงาน
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {job.employment_type || 'ไม่ระบุ'}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                สถานที่ทำงาน
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {job.work_location || 'ไม่ระบุ'}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                เงินเดือน
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {job.salary || 'ไม่ระบุ'}
              </p>

            </div>

          </div>

        </section>


        {/* Job Description */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            รายละเอียดงาน
          </h2>

          <p className="mt-5 whitespace-pre-line leading-7 text-gray-600">
            {job.job_description || 'ไม่มีรายละเอียดงาน'}
          </p>

        </section>


        {/* Company */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            บริษัท
          </h2>

          <div className="mt-5 flex items-center justify-between">

            <div>

              <p className="text-lg font-semibold text-gray-900">
                {job.company?.company_name || 'ไม่ระบุบริษัท'}
              </p>

            </div>

            {job.company?.company_id && (
              <Link
                to={`/companies/${job.company.company_id}`}
                className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                ดูข้อมูลบริษัท
              </Link>
            )}

          </div>

        </section>


        {/* Job Date */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            ข้อมูลประกาศ
          </h2>

          <div className="mt-4 space-y-2 text-sm text-gray-500">

            {job.created_at && (
              <p>
                วันที่ประกาศ: {job.created_at}
              </p>
            )}

            {job.updated_at && (
              <p>
                อัปเดตล่าสุด: {job.updated_at}
              </p>
            )}

          </div>

        </section>


        {/* Apply */}
        <section className="mt-6 rounded-xl bg-blue-600 p-8 text-center text-white">

          <h2 className="text-2xl font-bold">
            สนใจตำแหน่งงานนี้?
          </h2>

          <p className="mt-2 text-blue-100">
            ติดต่อบริษัทตามช่องทางการสมัครงานที่บริษัทกำหนด
          </p>

        </section>

      </div>

    </div>
  )
}

export default JobDetail