import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CompanyList from '../../components/company/CompanyList'
import JobCard from '../../components/job/JobCard'
import ReviewCard from '../../components/review/ReviewCard'

const API_URL = 'http://127.0.0.1:8000/api'

function getSalaryAmount(salary) {
  const amount = String(salary ?? '').match(/\d[\d,]*(?:\.\d+)?/)
  return amount ? Number(amount[0].replaceAll(',', '')) : null
}

function Home() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [reviews, setReviews] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      setError('')

      const [companiesResponse, jobsResponse] = await Promise.all([
        axios.get(`${API_URL}/companies`),
        axios.get(`${API_URL}/jobs`),
      ])

      const companiesData = companiesResponse.data?.data ?? companiesResponse.data
      const jobsData = jobsResponse.data?.data ?? jobsResponse.data
      if (!Array.isArray(companiesData) || !Array.isArray(jobsData)) {
        throw new TypeError('Expected the API responses to contain collections.')
      }
      setCompanies(companiesData)
      setJobs(jobsData)

      try {
        const reviewsResponse = await axios.get(`${API_URL}/reviews`)
        const reviewsData = reviewsResponse.data?.data ?? reviewsResponse.data
        if (!Array.isArray(reviewsData)) {
          throw new TypeError('Expected the reviews API response to contain a collection.')
        }
        setReviews(reviewsData)
      } catch (requestError) {
        console.error(requestError)
        setReviewsError('ไม่สามารถโหลดรีวิวจากพนักงานได้')
      } finally {
        setReviewsLoading(false)
      }
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลได้')
      setReviewsError('ไม่สามารถโหลดรีวิวจากพนักงานได้')
    } finally {
      setLoading(false)
      setReviewsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (!search.trim()) {
      return
    }

    navigate(`/companies?search=${encodeURIComponent(search)}`)
  }

  const popularCompanies = [...companies].sort(
    (first, second) => (Number(second.rating?.overall) || 0) - (Number(first.rating?.overall) || 0)
  )
  const highestSalaryJobs = [...jobs].sort((first, second) => {
    const firstSalary = getSalaryAmount(first.salary)
    const secondSalary = getSalaryAmount(second.salary)
    if (firstSalary === null) return secondSalary === null ? 0 : 1
    if (secondSalary === null) return -1
    return secondSalary - firstSalary
  })
  const latestReviews = [...reviews]
    .sort((first, second) => {
      const firstDate = Date.parse(first.created_at || '')
      const secondDate = Date.parse(second.created_at || '')
      return (Number.isFinite(secondDate) ? secondDate : 0)
        - (Number.isFinite(firstDate) ? firstDate : 0)
    })
    .slice(0, 6)

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gray-100 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">

          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            ค้นหาบริษัทที่ใช่สำหรับคุณ
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            ดูรีวิวจากคนทำงานจริง เปรียบเทียบข้อมูลบริษัท
            และค้นหางานที่เหมาะกับคุณ
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-3xl gap-3"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อบริษัท"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              ค้นหา
            </button>
          </form>

        </div>
      </section>


      {/* Rating Categories */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              เลือกบริษัทจากสิ่งที่สำคัญสำหรับคุณ
            </h2>

            <p className="mt-3 text-gray-600">
              เปรียบเทียบบริษัทจากรีวิวใน 4 ด้าน
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                ชีวิตดี
              </h3>

              <p className="mt-3 text-gray-600">
                Work-Life Balance และคุณภาพชีวิตในการทำงาน
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                งานดี
              </h3>

              <p className="mt-3 text-gray-600">
                ความท้าทายและโอกาสในการเติบโต
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                เงินดี
              </h3>

              <p className="mt-3 text-gray-600">
                เงินเดือนและสวัสดิการ
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                สังคมดี
              </h3>

              <p className="mt-3 text-gray-600">
                วัฒนธรรมและบรรยากาศในการทำงาน
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Companies */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                บริษัท
              </h2>

              <p className="mt-2 text-gray-600">
                ดูข้อมูลและคะแนนรีวิวจากพนักงาน
              </p>
            </div>

            <Link
              to="/companies"
              className="text-blue-600 hover:underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>


          {loading && (
            <p className="mt-8 text-center text-gray-500">
              กำลังโหลดข้อมูล...
            </p>
          )}


          {error && (
            <p className="mt-8 text-center text-red-500">
              {error}
            </p>
          )}


          {!loading && !error && (
            <div className="mt-8">
              <CompanyList items={popularCompanies.slice(0, 6)} />
            </div>
          )}

        </div>
      </section>


      {/* Employee Reviews */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                รีวิวจากพนักงาน
              </h2>
              <p className="mt-2 text-gray-600">
                ประสบการณ์และคะแนนจากคนทำงานจริง
              </p>
            </div>
            <Link to="/companies" className="text-blue-600 hover:underline">
              ดูรีวิวบริษัททั้งหมด →
            </Link>
          </div>

          {reviewsLoading ? (
            <p className="mt-8 text-center text-gray-500">กำลังโหลดรีวิว...</p>
          ) : reviewsError ? (
            <p role="alert" className="mt-8 text-center text-red-500">{reviewsError}</p>
          ) : latestReviews.length === 0 ? (
            <p className="mt-8 rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
              ยังไม่มีรีวิวจากพนักงาน
            </p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestReviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Jobs */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                งานที่น่าสนใจ
              </h2>

              <p className="mt-2 text-gray-600">
                ค้นหางานจากบริษัทต่าง ๆ
              </p>
            </div>

            <Link
              to="/jobs"
              className="text-blue-600 hover:underline"
            >
              ดูทั้งหมด →
            </Link>

          </div>


          {!loading && !error && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {highestSalaryJobs.slice(0, 6).map((job) => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
          )}

        </div>
      </section>


      {/* Review */}
      <section className="bg-gray-100 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            แชร์ประสบการณ์การทำงานของคุณ
          </h2>

          <p className="mt-4 text-gray-600">
            รีวิวบริษัทจากประสบการณ์จริงของคุณ
            เพื่อช่วยให้คนอื่นตัดสินใจเลือกงานได้ดีขึ้น
          </p>

          <Link
            to="/companies"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            เขียนรีวิว
          </Link>

        </div>
      </section>

    </div>
  )
}

export default Home