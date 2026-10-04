import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

function approvalStatusLabel(status) {
  return {
    pending: 'รอ Admin อนุมัติ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ถูกปฏิเสธ'
  }[status] || 'ไม่ทราบสถานะ'
}

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState('')
  const [submittedCompanies, setSubmittedCompanies] = useState([])
  const [submittedJobs, setSubmittedJobs] = useState([])
  const [submissionsLoading, setSubmissionsLoading] = useState(true)
  const [submissionsError, setSubmissionsError] = useState('')
  const [updatingJobStatusId, setUpdatingJobStatusId] = useState(null)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [reviewForm, setReviewForm] = useState(null)
  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchReviews = async (userId) => {
    try {
      setReviewsLoading(true)
      setReviewsError('')
      const ownReviews = []
      let page = 1
      let lastPage = 1

      do {
        const response = await axios.get(`${API_URL}/reviews`, {
          params: { page }
        })
        const pageReviews = response.data?.data ?? response.data
        if (!Array.isArray(pageReviews)) {
          throw new TypeError('Expected the API response to contain a collection.')
        }

        ownReviews.push(...pageReviews.filter((review) => review.user?.user_id === userId))
        lastPage = response.data?.meta?.last_page ?? response.data?.last_page ?? 1
        page += 1
      } while (page <= lastPage)

      setReviews(ownReviews)
    } catch (requestError) {
      console.error(requestError)
      setReviewsError('ไม่สามารถโหลดรีวิวของคุณได้')
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('access_token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      setSubmissionsLoading(true)
      setSubmissionsError('')
      const [companiesResponse, jobsResponse] = await Promise.all([
        axios.get(`${API_URL}/my/companies`, config),
        axios.get(`${API_URL}/my/jobs`, config)
      ])
      const companies = companiesResponse.data?.data ?? companiesResponse.data
      const jobs = jobsResponse.data?.data ?? jobsResponse.data
      if (!Array.isArray(companies) || !Array.isArray(jobs)) {
        throw new TypeError('Expected submitted records to contain collections.')
      }
      setSubmittedCompanies(companies)
      setSubmittedJobs(jobs)
    } catch (requestError) {
      console.error(requestError)
      setSubmissionsError(
        requestError.response?.data?.message || 'ไม่สามารถโหลดสถานะข้อมูลที่คุณส่งได้'
      )
    } finally {
      setSubmissionsLoading(false)
    }
  }

  const toggleJobStatus = async (job) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open'
    const token = localStorage.getItem('access_token')
    setUpdatingJobStatusId(job.job_id)
    setSubmissionsError('')

    try {
      const response = await axios.patch(
        `${API_URL}/jobs/${job.job_id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const updatedJob = response.data?.data ?? response.data
      setSubmittedJobs((current) => current.map((item) => (
        item.job_id === job.job_id
          ? { ...item, ...updatedJob, status: nextStatus }
          : item
      )))
    } catch (requestError) {
      console.error(requestError)
      setSubmissionsError(
        requestError.response?.data?.message || 'ไม่สามารถเปลี่ยนสถานะประกาศงานได้'
      )
    } finally {
      setUpdatingJobStatusId(null)
    }
  }

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
      await Promise.all([
        fetchReviews(response.data.user_id),
        fetchSubmissions()
      ])

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

  const startReviewEdit = (review) => {
    setEditingReviewId(review.review_id)
    setReviewForm({
      rating_life: review.rating_life,
      rating_work: review.rating_work,
      rating_money: review.rating_money,
      rating_society: review.rating_society,
      review_text: review.review_text
    })
    setReviewMessage('')
    setReviewsError('')
  }

  const saveReview = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access_token')

    try {
      await axios.put(
        `${API_URL}/reviews/${editingReviewId}`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReviews((current) => current.map((review) => (
        review.review_id === editingReviewId
          ? { ...review, ...reviewForm }
          : review
      )))
      setEditingReviewId(null)
      setReviewForm(null)
      setReviewMessage('บันทึกรีวิวแล้ว และแสดงบนหน้าบริษัททันที')
    } catch (requestError) {
      console.error(requestError)
      setReviewsError(requestError.response?.data?.message || 'ไม่สามารถแก้ไขรีวิวได้')
    }
  }

  const deleteReview = async (reviewId) => {
    if (!window.confirm('ยืนยันการลบรีวิวนี้หรือไม่?')) {
      return
    }

    const token = localStorage.getItem('access_token')
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews((current) => current.filter((review) => review.review_id !== reviewId))
      setReviewMessage('ลบรีวิวเรียบร้อยแล้ว')
      if (editingReviewId === reviewId) {
        setEditingReviewId(null)
        setReviewForm(null)
      }
      setReviewsError('')
    } catch (requestError) {
      console.error(requestError)
      setReviewsError(requestError.response?.data?.message || 'ไม่สามารถลบรีวิวได้')
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
                src={new URL(user.profile_image, 'http://127.0.0.1:8000/').toString()}
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

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">รายการที่ฉันส่ง</h2>
          <p className="mt-2 text-sm text-gray-500">
            บริษัทและประกาศงานจะแสดงต่อสาธารณะหลัง Admin อนุมัติแล้ว
          </p>
          {submissionsError && (
            <p role="alert" className="mt-4 text-red-600">{submissionsError}</p>
          )}
          {submissionsLoading ? (
            <p className="mt-5 text-gray-500">กำลังโหลดรายการที่ส่ง...</p>
          ) : (
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-800">บริษัท</h3>
                {submittedCompanies.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">ยังไม่มีข้อมูลบริษัทที่ส่ง</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {submittedCompanies.map((company) => (
                      <li key={company.company_id} className="rounded-lg border p-4">
                        <p className="font-medium text-gray-900">{company.company_name}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          สถานะ: {approvalStatusLabel(company.approval_status)}
                        </p>
                        {company.rejection_reason && (
                          <p className="mt-2 text-sm text-red-700">
                            เหตุผลที่ปฏิเสธ: {company.rejection_reason}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">ประกาศงาน</h3>
             
                {submittedJobs.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">ยังไม่มีประกาศงานที่ส่ง</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {submittedJobs.map((job) => (
                      <li key={job.job_id} className="rounded-lg border p-4">
                        <p className="font-medium text-gray-900">{job.job_title}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {job.company?.company_name || 'ไม่ระบุบริษัท'} · สถานะ: {approvalStatusLabel(job.approval_status)}
                        </p>
                        {job.approval_status === 'approved' && (
                          <div className="mt-3 flex items-center gap-3">
                            <span className={`text-sm ${job.status === 'open' ? 'text-green-700' : 'text-gray-500'}`}>
                              {job.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                            </span>
                            <button
                              type="button"
                              disabled={updatingJobStatusId === job.job_id}
                              onClick={() => toggleJobStatus(job)}
                              className="rounded border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                            >
                              {updatingJobStatusId === job.job_id
                                ? 'กำลังบันทึก...'
                                : job.status === 'open' ? 'ปิดรับสมัคร' : 'เปิดรับสมัคร'}
                            </button>
                          </div>
                        )}
                        {job.rejection_reason && (
                          <p className="mt-2 text-sm text-red-700">
                            เหตุผลที่ปฏิเสธ: {job.rejection_reason}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">รีวิวของฉัน</h2>
          <p className="mt-2 text-sm text-gray-500">
            รีวิวที่ส่งแล้วจะแสดงบนหน้าบริษัททันที
          </p>
          {reviewsError && <p role="alert" className="mt-4 text-red-600">{reviewsError}</p>}
          {reviewMessage && <p role="status" className="mt-4 text-green-700">{reviewMessage}</p>}
          {reviewsLoading ? (
            <p className="mt-5 text-gray-500">กำลังโหลดรีวิว...</p>
          ) : reviews.length === 0 ? (
            <p className="mt-5 text-gray-500">คุณยังไม่มีรีวิว</p>
          ) : (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <article key={review.review_id} className="rounded-lg border p-4">
                  {editingReviewId === review.review_id ? (
                    <form onSubmit={saveReview} className="space-y-4">
                      {[
                        ['rating_life', 'ชีวิตดี'],
                        ['rating_work', 'งานดี'],
                        ['rating_money', 'เงินดี'],
                        ['rating_society', 'สังคมดี']
                      ].map(([field, label]) => (
                        <label key={field} className="mr-4 inline-flex items-center gap-2 text-sm">
                          {label}
                          <select
                            required
                            min="1"
                            max="5"
                            value={reviewForm[field]}
                            onChange={(event) => setReviewForm({
                              ...reviewForm,
                              [field]: Number(event.target.value)
                            })}
                            className="rounded border px-2 py-1"
                          >
                            {[1, 2, 3, 4, 5].map((score) => (
                              <option key={score} value={score}>{score}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                      <textarea
                        required
                        value={reviewForm.review_text}
                        onChange={(event) => setReviewForm({
                          ...reviewForm,
                          review_text: event.target.value
                        })}
                        rows="4"
                        className="w-full rounded-lg border px-3 py-2"
                      />
                      <div className="flex gap-3">
                        <button className="rounded bg-blue-600 px-4 py-2 text-white">บันทึก</button>
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="rounded border px-4 py-2"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{review.company?.company_name}</p>
                          <p className="mt-1 text-sm text-gray-500">{review.review_text}</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => startReviewEdit(review)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => deleteReview(review.review_id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600 sm:grid-cols-4">
                        <span>ชีวิตดี: {review.rating_life}</span>
                        <span>งานดี: {review.rating_work}</span>
                        <span>เงินดี: {review.rating_money}</span>
                        <span>สังคมดี: {review.rating_society}</span>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
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