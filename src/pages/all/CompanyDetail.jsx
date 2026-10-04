import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Paginator from '../../components/others/Paginator'
import ReviewCard from '../../components/review/ReviewCard'

const API_URL = 'http://127.0.0.1:8000/api'

function CompanyDetail() {
  const { id } = useParams()

  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [reviews, setReviews] = useState([])
  const [jobsError, setJobsError] = useState('')
  const [reviewsError, setReviewsError] = useState('')
  const [jobPage, setJobPage] = useState(1)
  const [jobLastPage, setJobLastPage] = useState(1)
  const [reviewPage, setReviewPage] = useState(1)
  const [reviewLastPage, setReviewLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompany()
  }, [id, jobPage, reviewPage])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError('')
      setJobsError('')
      setReviewsError('')

      const [companyResult, jobsResult, reviewsResult] = await Promise.allSettled([
        axios.get(`${API_URL}/companies/${id}`),
        axios.get(`${API_URL}/jobs`, { params: { company_id: id, page: jobPage } }),
        axios.get(`${API_URL}/reviews`, { params: { company_id: id, page: reviewPage } })
      ])

      if (companyResult.status === 'rejected') {
        throw companyResult.reason
      }

      const companyResponse = companyResult.value
      setCompany(companyResponse.data.data ?? companyResponse.data)

      if (jobsResult.status === 'rejected') {
        console.error(jobsResult.reason)
        setJobsError('ไม่สามารถโหลดตำแหน่งงานของบริษัทนี้ได้')
      } else {
        const jobsResponse = jobsResult.value
        const jobsData = jobsResponse.data?.data ?? jobsResponse.data
        if (!Array.isArray(jobsData)) {
          console.error(new TypeError('Expected the jobs API response to contain a collection.'))
          setJobsError('ไม่สามารถโหลดตำแหน่งงานของบริษัทนี้ได้')
        } else {
          setJobs(jobsData)
          setJobLastPage(jobsResponse.data?.meta?.last_page ?? jobsResponse.data?.last_page ?? 1)
        }
      }

      if (reviewsResult.status === 'rejected') {
        console.error(reviewsResult.reason)
        setReviewsError('ไม่สามารถโหลดรีวิวของบริษัทนี้ได้')
      } else {
        const reviewsResponse = reviewsResult.value
        const reviewsData = reviewsResponse.data?.data ?? reviewsResponse.data
        if (!Array.isArray(reviewsData)) {
          console.error(new TypeError('Expected the reviews API response to contain a collection.'))
          setReviewsError('ไม่สามารถโหลดรีวิวของบริษัทนี้ได้')
        } else {
          setReviews(reviewsData)
          setReviewLastPage(reviewsResponse.data?.meta?.last_page ?? reviewsResponse.data?.last_page ?? 1)
        }
      }
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
                src={new URL(company.logo_image, 'http://127.0.0.1:8000/').toString()}
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


          {jobsError ? (
            <p role="alert" className="mt-6 text-red-600">{jobsError}</p>
          ) : jobs.length > 0 ? (

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
          <Paginator
            page={jobPage}
            totalPages={jobLastPage}
            onPageChange={setJobPage}
          />

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


          {reviewsError ? (
            <p role="alert" className="mt-6 text-red-600">{reviewsError}</p>
          ) : reviews.length > 0 ? (

            <div className="mt-6 space-y-6">

              {reviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}

            </div>

          ) : (

            <p className="mt-6 text-gray-500">
              ยังไม่มีรีวิวสำหรับบริษัทนี้
            </p>

          )}
          <Paginator
            page={reviewPage}
            totalPages={reviewLastPage}
            onPageChange={setReviewPage}
          />

        </section>

      </div>

    </div>
  )
}

export default CompanyDetail