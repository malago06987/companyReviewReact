import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL, getApiCollection, getAssetUrl } from '../api'

function Companies() {
  const [companies, setCompanies] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompanies(searchParams.get('search') || '')
  }, [searchParams])

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

      setCompanies(getApiCollection(response))
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


        {/* No result */}
        {!loading && !error && companies.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              ไม่พบข้อมูลบริษัท
            </p>
          </div>
        )}


        {/* Companies */}
        {!loading && !error && companies.length > 0 && (

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {companies.map((company) => (

              <div
                key={company.company_id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >

                {/* Company Header */}
                <div className="flex items-center gap-4">

                  {company.logo_image ? (

                    <img
                      src={getAssetUrl(company.logo_image)}
                      alt={company.company_name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />

                  ) : (

                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
                      Logo
                    </div>

                  )}


                  <div className="min-w-0">

                    <h2 className="truncate text-lg font-bold text-gray-900">
                      {company.company_name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {company.industry?.industry_name || company.industry || 'ไม่ระบุอุตสาหกรรม'}
                    </p>

                  </div>

                </div>


                {/* Description */}
                {company.description && (

                  <p className="mt-5 line-clamp-3 text-sm text-gray-600">
                    {company.description}
                  </p>

                )}


                {/* Rating */}
                <div className="mt-5">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                      คะแนนรวม
                    </span>

                    <span className="font-bold text-yellow-500">
                      ★ {company.rating?.overall ?? 0}
                    </span>

                  </div>


                  <div className="mt-4 grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        ชีวิตดี
                      </p>

                      <p className="font-semibold text-gray-900">
                        {company.rating?.life ?? 0}
                      </p>
                    </div>


                    <div>
                      <p className="text-sm text-gray-500">
                        งานดี
                      </p>

                      <p className="font-semibold text-gray-900">
                        {company.rating?.work ?? 0}
                      </p>
                    </div>


                    <div>
                      <p className="text-sm text-gray-500">
                        เงินดี
                      </p>

                      <p className="font-semibold text-gray-900">
                        {company.rating?.money ?? 0}
                      </p>
                    </div>


                    <div>
                      <p className="text-sm text-gray-500">
                        สังคมดี
                      </p>

                      <p className="font-semibold text-gray-900">
                        {company.rating?.society ?? 0}
                      </p>
                    </div>

                  </div>

                </div>


                {/* Detail */}
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

    </div>
  )
}

export default Companies