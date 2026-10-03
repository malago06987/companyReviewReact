import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import JobList from '../../components/job/JobList'
import Paginator from '../../components/others/Paginator'

const API_URL = 'http://127.0.0.1:8000/api'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const [companyId, setCompanyId] = useState(
    searchParams.get('company_id') || ''
  )
  const [search, setSearch] = useState('')
  const [jobFunctions, setJobFunctions] = useState([])
  const [selectedFunction, setSelectedFunction] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastPage, setLastPage] = useState(1)
  const currentPage = Number(searchParams.get('page') || 1)

  useEffect(() => {
    fetchJobs(searchParams.get('company_id') || '', currentPage)
  }, [searchParams])

  useEffect(() => {
    axios.get(`${API_URL}/job-functions`).then((response) => {
      const data = response.data?.data ?? response.data
      if (!Array.isArray(data)) {
        throw new TypeError('Expected the API response to contain a collection.')
      }
      setJobFunctions(data)
    }).catch((requestError) => {
      console.error(requestError)
      setError('ไม่สามารถโหลดตัวกรองสายงานได้')
    })
  }, [])

  const fetchJobs = async (company, page) => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/jobs`,
        {
          params: {
            company_id: company || undefined,
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

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [
      job.job_title,
      job.company?.company_name,
      job.job_function?.function_name,
      job.work_location
    ].some((value) => value?.toLowerCase().includes(query))
    const matchesFunction = !selectedFunction
      || String(job.job_function?.function_id) === selectedFunction
    return matchesSearch && matchesFunction
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            ค้นหางานในหน้าปัจจุบัน
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ชื่อตำแหน่ง บริษัท หรือสถานที่"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </label>
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