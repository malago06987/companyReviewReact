import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL, getApiCollection, getAssetUrl } from '../api'

function CompanyDetail() {
  const { id } = useParams()

  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompany()
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError('')

      const [companyResponse, jobsResponse, reviewsResponse] = await Promise.all([
        axios.get(`${API_URL}/companies/${id}`),
        axios.get(`${API_URL}/jobs`, { params: { company_id: id } }),
        axios.get(`${API_URL}/reviews`, { params: { company_id: id } })
      ])

      setCompany(companyResponse.data.data ?? companyResponse.data)
      setJobs(getApiCollection(jobsResponse))
      setReviews(getApiCollection(reviewsResponse))
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลบริษัทได้')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-gray-500">
          กำลังโหลดข้อมูลบริษัท...
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

        <Link
          to="/companies"
          className="mt-4 inline-block text-blue-600"
        >
          ← กลับไปหน้าบริษัท
        </Link>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-gray-500">
          ไม่พบข้อมูลบริษัท
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/companies"
          className="text-blue-600 hover:underline"
        >
          ← กลับไปหน้าบริษัท
        </Link>


        {/* Company Header */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-6 md:flex-row md:items-center">

            {company.logo_image ? (
              <img
                src={getAssetUrl(company.logo_image)}
                alt={company.company_name}
                className="h-24 w-24 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
                Logo
              </div>
            )}

            <div className="flex-1">

              <h1 className="text-3xl font-bold text-gray-900">
                {company.company_name}
              </h1>

              <p className="mt-2 text-gray-500">
                {company.industry?.industry_name || company.industry || 'ไม่ระบุอุตสาหกรรม'}
              </p>

              {company.address && (
                <p className="mt-2 text-sm text-gray-500">
                  📍 {company.address}
                </p>
              )}

            </div>

          </div>

        </section>


        {/* Rating */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            คะแนนรีวิวบริษัท
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                คะแนนรวม
              </p>

              <p className="mt-2 text-2xl font-bold text-yellow-500">
                ★ {company.rating?.overall ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                ชีวิตดี
              </p>

              <p className="mt-2 text-2xl font-bold">
                {company.rating?.life ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                งานดี
              </p>

              <p className="mt-2 text-2xl font-bold">
                {company.rating?.work ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                เงินดี
              </p>

              <p className="mt-2 text-2xl font-bold">
                {company.rating?.money ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                สังคมดี
              </p>

              <p className="mt-2 text-2xl font-bold">
                {company.rating?.society ?? 0}
              </p>
            </div>

          </div>

        </section>


        {/* Description */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              เกี่ยวกับบริษัท
            </h2>

            <p className="mt-4 whitespace-pre-line text-gray-600">
              {company.description || 'ไม่มีข้อมูล'}
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              สวัสดิการ
            </h2>

            <p className="mt-4 whitespace-pre-line text-gray-600">
              {company.benefits || 'ไม่มีข้อมูล'}
            </p>

          </div>

        </section>


        {/* Culture */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            วัฒนธรรมองค์กร
          </h2>

          <p className="mt-4 whitespace-pre-line text-gray-600">
            {company.culture || 'ไม่มีข้อมูล'}
          </p>

        </section>


        {/* Jobs */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                ตำแหน่งงาน
              </h2>

              <p className="mt-1 text-gray-500">
                งานที่เปิดรับจากบริษัทนี้
              </p>
            </div>

          </div>


          {jobs.length > 0 ? (

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {jobs.map((job) => (

                <div
                  key={job.job_id}
                  className="rounded-lg border p-5"
                >

                  <h3 className="font-bold text-gray-900">
                    {job.job_title}
                  </h3>

                  {job.work_location && (
                    <p className="mt-2 text-sm text-gray-500">
                      📍 {job.work_location}
                    </p>
                  )}

                  {job.employment_type && (
                    <p className="mt-1 text-sm text-gray-500">
                      รูปแบบงาน: {job.employment_type}
                    </p>
                  )}

                  {job.salary && (
                    <p className="mt-1 text-sm text-gray-500">
                      เงินเดือน: {job.salary}
                    </p>
                  )}

                  <Link
                    to={`/jobs/${job.job_id}`}
                    className="mt-4 inline-block text-blue-600 hover:underline"
                  >
                    ดูรายละเอียดงาน →
                  </Link>

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-6 text-gray-500">
              ขณะนี้ยังไม่มีตำแหน่งงาน
            </p>

          )}

        </section>


        {/* Reviews */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                รีวิวจากพนักงาน
              </h2>

              <p className="mt-1 text-gray-500">
                ประสบการณ์จากผู้ที่เคยทำงานกับบริษัท
              </p>
            </div>

            <Link
              to={`/review?company_id=${company.company_id}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              เขียนรีวิว
            </Link>

          </div>


          {reviews.length > 0 ? (

            <div className="mt-6 space-y-6">

              {reviews.map((review, index) => {
                const overallRating = [
                  review.rating_life,
                  review.rating_work,
                  review.rating_money,
                  review.rating_society
                ].reduce((total, rating) => total + Number(rating || 0), 0) / 4

                return (

                <div
                  key={review.review_id ?? review.id ?? index}
                  className="border-b pb-6 last:border-b-0"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-semibold text-gray-900">
                        {review.user?.full_name || 'ผู้ใช้งาน'}
                      </p>

                      <p className="text-sm text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString('th-TH')
                          : ''}
                      </p>

                    </div>

                    <p className="font-bold text-yellow-500">
                      ★ {overallRating.toFixed(1)}
                    </p>

                  </div>


                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">

                    <div>
                      <span className="text-gray-500">
                        ชีวิตดี
                      </span>

                      <p className="font-semibold">
                        {review.rating_life ?? 0}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        งานดี
                      </span>

                      <p className="font-semibold">
                        {review.rating_work ?? 0}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        เงินดี
                      </span>

                      <p className="font-semibold">
                        {review.rating_money ?? 0}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        สังคมดี
                      </span>

                      <p className="font-semibold">
                        {review.rating_society ?? 0}
                      </p>
                    </div>

                  </div>


                  {review.review_text && (
                    <p className="mt-4 whitespace-pre-line text-gray-600">
                      {review.review_text}
                    </p>
                  )}

                </div>
                )
              })}

            </div>

          ) : (

            <p className="mt-6 text-gray-500">
              ยังไม่มีรีวิวสำหรับบริษัทนี้
            </p>

          )}

        </section>

      </div>

    </div>
  )
}

export default CompanyDetail