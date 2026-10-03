import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import CompanyList from '../../components/company/CompanyList'

const API_URL = 'http://127.0.0.1:8000/api'

function Companies() {
  const [companies, setCompanies] = useState([])
  const [industries, setIndustries] = useState([])
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompanies(searchParams.get('search') || '')
  }, [searchParams])

  useEffect(() => {
    axios.get(`${API_URL}/industries`).then((response) => {
      const data = response.data?.data ?? response.data
      if (!Array.isArray(data)) {
        throw new TypeError('Expected the API response to contain a collection.')
      }
      setIndustries(data)
    }).catch((requestError) => {
      console.error(requestError)
      setError('ไม่สามารถโหลดตัวกรองอุตสาหกรรมได้')
    })
  }, [])

  const fetchCompanies = async (keyword) => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `${API_URL}/companies`,
        {
          params: {
            search: keyword || undefined
          }
        }
      )

      const companiesData = response.data?.data ?? response.data
      if (!Array.isArray(companiesData)) {
        throw new TypeError('Expected the API response to contain a collection.')
      }
      setCompanies(companiesData)
    } catch (error) {
      console.error(error)
      setError('ไม่สามารถโหลดข้อมูลบริษัทได้')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (search.trim()) {
      setSearchParams({
        search: search.trim()
      })
    } else {
      setSearchParams({})
    }
  }

  const filteredCompanies = selectedIndustry
    ? companies.filter((company) => company.industry === selectedIndustry)
    : companies

  return (
    <div className="bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            บริษัท
          </h1>

          <p className="mt-2 text-gray-600">
            ค้นหาและดูข้อมูลบริษัทจากประสบการณ์ของคนทำงาน
          </p>
        </div>


        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mt-8 flex gap-3"
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
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            ค้นหา
          </button>

        </form>

        <label className="mt-4 block max-w-sm text-sm font-medium text-gray-700">
          กรองตามอุตสาหกรรม
          <select
            value={selectedIndustry}
            onChange={(event) => setSelectedIndustry(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          >
            <option value="">ทุกอุตสาหกรรม</option>
            {industries.map((industry) => (
              <option key={industry.industry_id} value={industry.industry_name}>
                {industry.industry_name}
              </option>
            ))}
          </select>
        </label>


        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-gray-500">
            กำลังโหลดข้อมูลบริษัท...
          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="py-16 text-center text-red-500">
            {error}
          </div>
        )}


        {!loading && !error && <CompanyList items={filteredCompanies} />}

      </div>

    </div>
  )
}

export default Companies