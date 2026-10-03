import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function WriteReview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const companyId = searchParams.get('company_id')

  const [company, setCompany] = useState(null)

  const [form, setForm] = useState({
    rating_life: 0,
    rating_work: 0,
    rating_money: 0,
    rating_society: 0,
    review_text: ''
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const API_URL = 'http://127.0.0.1:8000/api'

  useEffect(() => {
    if (!companyId) {
      setError('ไม่พบรหัสบริษัท')
      setLoading(false)
      return
    }

    fetchCompany()
  }, [companyId])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/companies/${companyId}`
      )

      setCompany(response.data.data || response.data)

    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลบริษัทได้')
    } finally {
      setLoading(false)
    }
  }

  const handleRating = (field, rating) => {
    setForm({
      ...form,
      [field]: rating
    })
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    if (
      form.rating_life === 0 ||
      form.rating_work === 0 ||
      form.rating_money === 0 ||
      form.rating_society === 0
    ) {
      setError('กรุณาให้คะแนนครบทุกด้าน')
      return
    }

    if (!form.review_text.trim()) {
      setError('กรุณาเขียนรีวิว')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await axios.post(
        `${API_URL}/reviews`,
        {
          company_id: Number(companyId),
          rating_life: form.rating_life,
          rating_work: form.rating_work,
          rating_money: form.rating_money,
          rating_society: form.rating_society,
          review_text: form.review_text
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate(`/companies/${companyId}`)

    } catch (error) {
      console.error(error)

      if (error.response?.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        navigate('/login')
        return
      }

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0]

        if (Array.isArray(firstError)) {
          setError(firstError[0])
        } else {
          setError('ข้อมูลรีวิวไม่ถูกต้อง')
        }

      } else if (error.response?.data?.message) {
        setError(error.response.data.message)

      } else {
        setError('ไม่สามารถส่งรีวิวได้')
      }

    } finally {
      setSubmitting(false)
    }
  }

  const Rating = ({ label, field }) => {
    return (
      <div className="rounded-xl border border-gray-200 p-5">

        <p className="font-semibold text-gray-900">
          {label}
        </p>

        <div className="mt-4 flex gap-2">

          {[1, 2, 3, 4, 5].map((number) => (

            <button
              key={number}
              type="button"
              onClick={() => handleRating(field, number)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition ${
                form[field] >= number
                  ? 'border-yellow-400 bg-yellow-400 text-white'
                  : 'border-gray-300 bg-white text-gray-500 hover:border-yellow-400'
              }`}
            >
              {number}
            </button>

          ))}

        </div>

        <p className="mt-2 text-xs text-gray-500">
          คะแนน {form[field] || 0} / 5
        </p>

      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-16 text-center">
        <p className="text-gray-500">
          กำลังโหลดข้อมูลบริษัท...
        </p>
      </div>
    )
  }

  if (error && !company) {
    return (
      <div className="min-h-screen px-6 py-16 text-center">

        <p className="text-red-500">
          {error}
        </p>

        <Link
          to="/companies"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← กลับไปหน้าบริษัท
        </Link>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          to={`/companies/${companyId}`}
          className="text-blue-600 hover:underline"
        >
          ← กลับไปหน้าบริษัท
        </Link>


        {/* Header */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">
            เขียนรีวิวบริษัท
          </h1>

          <p className="mt-2 text-gray-500">
            รีวิวประสบการณ์การทำงานของคุณอย่างตรงไปตรงมา
          </p>

          {company && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                บริษัท
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {company.company_name}
              </p>

            </div>
          )}

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
          className="mt-6"
        >

          {/* Ratings */}
          <section className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              ให้คะแนนบริษัท
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              ให้คะแนนตั้งแต่ 1 ถึง 5 ในแต่ละด้าน
            </p>


            <div className="mt-6 space-y-4">

              <Rating
                label="ชีวิตดี"
                field="rating_life"
              />

              <Rating
                label="งานดี"
                field="rating_work"
              />

              <Rating
                label="เงินดี"
                field="rating_money"
              />

              <Rating
                label="สังคมดี"
                field="rating_society"
              />

            </div>

          </section>


          {/* Review Text */}
          <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              รีวิวของคุณ
            </h2>

            <textarea
              name="review_text"
              value={form.review_text}
              onChange={handleChange}
              rows="8"
              placeholder="เล่าประสบการณ์การทำงานของคุณ..."
              required
              className="mt-5 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </section>


          {/* Submit */}
          <div className="mt-6 flex justify-end gap-3">

            <Link
              to={`/companies/${companyId}`}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? 'กำลังส่งรีวิว...'
                : 'ส่งรีวิว'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default WriteReview