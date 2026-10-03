import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = 'http://127.0.0.1:8000/api'

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

      setCompanies(companiesResponse.data.data || [])
      setJobs(jobsResponse.data.data || [])
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (!search.trim()) {
      return
    }

    window.location.href = `/companies?search=${encodeURIComponent(search)}`
  }

  return (
    <div className="min-h-screen bg-white">

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
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {companies.slice(0, 6).map((company) => (
                <div
                  key={company.company_id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center gap-4">

                    {company.logo_image ? (
                      <img
                        src={`http://127.0.0.1:8000/${company.logo_image}`}
                        alt={company.company_name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                        Logo
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {company.company_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {company.industry || 'ไม่ระบุ'}
                      </p>
                    </div>

                  </div>


                  <div className="mt-6">

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        คะแนนรวม
                      </span>

                      <span className="font-bold text-yellow-500">
                        ★ {company.rating?.overall ?? 0}
                      </span>
                    </div>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                    <div>
                      <p className="text-gray-500">
                        ชีวิตดี
                      </p>

                      <p className="font-semibold">
                        {company.rating?.life ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        งานดี
                      </p>

                      <p className="font-semibold">
                        {company.rating?.work ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        เงินดี
                      </p>

                      <p className="font-semibold">
                        {company.rating?.money ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        สังคมดี
                      </p>

                      <p className="font-semibold">
                        {company.rating?.society ?? 0}
                      </p>
                    </div>

                  </div>


                  <Link
                    to={`/companies/${company.company_id}`}
                    className="mt-6 block rounded-lg border border-blue-600 py-2 text-center text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    ดูรายละเอียด
                  </Link>

                </div>
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

              {jobs.slice(0, 6).map((job) => (
                <div
                  key={job.job_id}
                  className="rounded-xl border bg-white p-6"
                >

                  <h3 className="text-lg font-bold text-gray-900">
                    {job.job_title}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {job.company?.company_name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {job.job_function?.function_name}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-600">

                    <p>
                      สถานที่: {job.work_location || 'ไม่ระบุ'}
                    </p>

                    <p>
                      รูปแบบงาน: {job.employment_type || 'ไม่ระบุ'}
                    </p>

                    <p>
                      เงินเดือน: {job.salary || 'ไม่ระบุ'}
                    </p>

                  </div>

                  <Link
                    to={`/jobs/${job.job_id}`}
                    className="mt-5 block text-blue-600 hover:underline"
                  >
                    ดูรายละเอียด →
                  </Link>

                </div>
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
            to="/review"
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