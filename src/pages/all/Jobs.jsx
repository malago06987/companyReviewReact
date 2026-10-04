import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import JobList from '../../components/job/JobList'
import Paginator from '../../components/others/Paginator'

const API_URL = 'http://127.0.0.1:8000/api'

function readCollection(response) {
  const collection = response.data?.data ?? response.data

  if (!Array.isArray(collection)) {
    throw new TypeError('Expected the API response to contain a collection.')
  }

  return collection
}

function Jobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const [jobFunctions, setJobFunctions] = useState([])
  const [companies, setCompanies] = useState([])
  const [selectedFunction, setSelectedFunction] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [createOptionsError, setCreateOptionsError] = useState('')
  const [authorizationDocument, setAuthorizationDocument] = useState(null)
  const [jobForm, setJobForm] = useState({
    company_id: '',
    function_id: '',
    job_title: '',
    job_description: '',
    salary: '',
    work_location: '',
    employment_type: '',
    status: 'open'
  })
  const [lastPage, setLastPage] = useState(1)
  const currentPage = Number(searchParams.get('page') || 1)

  useEffect(() => {
    fetchJobs(currentPage)
  }, [searchParams])

  useEffect(() => {
    axios.get(`${API_URL}/job-functions`).then((response) => {
      setJobFunctions(readCollection(response))
    }).catch((requestError) => {
      console.error(requestError)
      setCreateOptionsError('ไม่สามารถโหลดตัวเลือกสายงานสำหรับประกาศงานได้')
    })
    axios.get(`${API_URL}/companies`).then((response) => {
      setCompanies(readCollection(response))
    }).catch((requestError) => {
      console.error(requestError)
      setCreateOptionsError('ไม่สามารถโหลดรายชื่อบริษัทสำหรับประกาศงานได้')
    })
  }, [])

  const fetchJobs = async (page) => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/jobs`,
        {
          params: {
            page
          }
        }
      )

      const jobsData = response.data?.data ?? response.data
      if (!Array.isArray(jobsData)) {
        throw new TypeError('Expected the API response to contain a collection.')
      }
      setJobs(jobsData)
      setLastPage(response.data?.meta?.last_page ?? response.data?.last_page ?? 1)
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลตำแหน่งงานได้')
    } finally {
      setLoading(false)
    }
  }

  const changePage = (nextPage) => {
    setSearchParams((params) => {
      if (nextPage === 1) {
        params.delete('page')
      } else {
        params.set('page', String(nextPage))
      }
      return params
    })
  }

  const handleCreateJob = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    if (!authorizationDocument) {
      setCreateError('กรุณาแนบเอกสารยืนยันสิทธิ์ลงประกาศงาน')
      return
    }
    if (authorizationDocument.size > 5 * 1024 * 1024) {
      setCreateError('เอกสารต้องมีขนาดไม่เกิน 5 MB')
      return
    }

    try {
      setCreating(true)
      setCreateError('')
      setCreateMessage('')
      const payload = new FormData()
      Object.entries(jobForm).forEach(([field, value]) => {
        if (value !== '') {
          payload.append(field, value)
        }
      })
      payload.append('authorization_document', authorizationDocument)

      const response = await axios.post(`${API_URL}/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobForm({
        company_id: '',
        function_id: '',
        job_title: '',
        job_description: '',
        salary: '',
        work_location: '',
        employment_type: '',
        status: 'open'
      })
      setAuthorizationDocument(null)
      setShowCreateForm(false)
      setCreateMessage(response.data?.message || 'ส่งประกาศงานแล้ว รอ Admin อนุมัติ')
    } catch (requestError) {
      console.error(requestError)
      const validationErrors = requestError.response?.data?.errors
      setCreateError(
        validationErrors
          ? Object.values(validationErrors).flat().join(' ')
          : requestError.response?.data?.message || 'ไม่สามารถลงประกาศงานได้'
      )
    } finally {
      setCreating(false)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    if (job.status !== 'open') {
      return false
    }
    const matchesFunction = !selectedFunction
      || String(job.job_function?.function_id) === selectedFunction
    return matchesFunction
  })

  return (
    <div className="bg-gray-50 px-6 py-10">

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

        <div className="mt-6">
          {localStorage.getItem('access_token') ? (
            <button
              type="button"
              onClick={() => {
                setShowCreateForm((visible) => !visible)
                setCreateError('')
                setCreateMessage('')
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              {showCreateForm ? 'ปิดฟอร์ม' : 'ลงประกาศงาน'}
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              เข้าสู่ระบบเพื่อลงประกาศงาน
            </Link>
          )}
        </div>

        {createMessage && (
          <div role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">
            <p>{createMessage}</p>
            <Link to="/profile" className="mt-1 inline-block font-medium underline">
              ดูสถานะรายการที่ส่งในโปรไฟล์
            </Link>
          </div>
        )}
        {createError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
            {createError}
          </p>
        )}

        {showCreateForm && (
          <form
            onSubmit={handleCreateJob}
            className="mt-5 grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
          >
            <p className="text-sm text-amber-800 md:col-span-2">
              แนบหลักฐานว่าได้รับอนุญาตให้ลงประกาศในนามบริษัทที่เลือก Admin จะตรวจสอบทั้งเอกสารและประกาศก่อนเผยแพร่
            </p>
            <label className="text-sm font-medium text-gray-700">
              บริษัท *
              <select
                required
                value={jobForm.company_id}
                onChange={(event) => setJobForm({ ...jobForm, company_id: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">เลือกบริษัท</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              สายงาน *
              <select
                required
                value={jobForm.function_id}
                onChange={(event) => setJobForm({ ...jobForm, function_id: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">เลือกสายงาน</option>
                {jobFunctions.map((jobFunction) => (
                  <option key={jobFunction.function_id} value={jobFunction.function_id}>
                    {jobFunction.function_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              ชื่อตำแหน่ง *
              <input
                required
                value={jobForm.job_title}
                onChange={(event) => setJobForm({ ...jobForm, job_title: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              เงินเดือน
              <input
                value={jobForm.salary}
                onChange={(event) => setJobForm({ ...jobForm, salary: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              สถานที่ทำงาน
              <input
                value={jobForm.work_location}
                onChange={(event) => setJobForm({ ...jobForm, work_location: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              รูปแบบงาน
              <input
                value={jobForm.employment_type}
                onChange={(event) => setJobForm({ ...jobForm, employment_type: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 md:col-span-2">
              รายละเอียดงาน *
              <textarea
                required
                rows="4"
                value={jobForm.job_description}
                onChange={(event) => setJobForm({ ...jobForm, job_description: event.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            {createOptionsError && (
              <p role="alert" className="text-sm text-red-700 md:col-span-2">
                {createOptionsError}
              </p>
            )}
            <label className="text-sm font-medium text-gray-700 md:col-span-2">
              เอกสารยืนยันสิทธิ์ลงประกาศ *
              <input
                required
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={(event) => setAuthorizationDocument(event.target.files?.[0] || null)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              />
              <span className="mt-1 block text-xs font-normal text-gray-500">
                รองรับ PDF, JPG และ PNG ขนาดไม่เกิน 5 MB
              </span>
            </label>
            <button
              type="submit"
              disabled={
                creating
                || companies.length === 0
                || jobFunctions.length === 0
              }
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 md:col-span-2"
            >
              {creating ? 'กำลังส่งประกาศ...' : 'ส่งประกาศให้ Admin ตรวจสอบ'}
            </button>
          </form>
        )}

        <div className="mt-8 max-w-sm">
          <label className="text-sm font-medium text-gray-700">
            กรองตามสายงาน
            <select
              value={selectedFunction}
              onChange={(event) => setSelectedFunction(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="">ทุกสายงาน</option>
              {jobFunctions.map((jobFunction) => (
                <option key={jobFunction.function_id} value={jobFunction.function_id}>
                  {jobFunction.function_name}
                </option>
              ))}
            </select>
          </label>
        </div>


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


        {!loading && !error && <JobList items={filteredJobs} />}

        {!loading && !error && (
          <Paginator page={currentPage} totalPages={lastPage} onPageChange={changePage} disabled={loading} />
        )}

      </div>

    </div>
  )
}

export default Jobs