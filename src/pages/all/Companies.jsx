import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CompanyList from '../../components/company/CompanyList'

const API_URL = 'http://127.0.0.1:8000/api'

function Companies() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [industries, setIndustries] = useState([])
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [companyForm, setCompanyForm] = useState({
    company_name: '',
    industry_id: '',
    description: '',
    address: '',
    benefits: '',
    culture: '',
    logo_image: null,
    document: null
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompanies()
  }, [])

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

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(`${API_URL}/companies`)

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

  const handleCreateCompany = async (event) => {
    event.preventDefault()
    if (
      !companyForm.company_name.trim()
      || !companyForm.industry_id
      || !companyForm.document
    ) {
      setCreateError('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    if (companyForm.document.size > 5 * 1024 * 1024) {
      setCreateError('เอกสารยืนยันบริษัทต้องมีขนาดไม่เกิน 5 MB')
      return
    }

    const formData = new FormData()
    Object.entries(companyForm).forEach(([field, value]) => {
      if (value !== null && value !== '') {
        formData.append(field, value)
      }
    })

    try {
      setCreating(true)
      setCreateError('')
      setCreateMessage('')
      const response = await axios.post(`${API_URL}/companies`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCompanyForm({
        company_name: '',
        industry_id: '',
        description: '',
        address: '',
        benefits: '',
        culture: '',
        logo_image: null,
        document: null
      })
      setShowCreateForm(false)
      setCreateMessage(response.data?.message || 'ส่งข้อมูลบริษัทแล้ว รอ Admin อนุมัติ')
    } catch (requestError) {
      console.error(requestError)
      const validationErrors = requestError.response?.data?.errors
      setCreateError(
        validationErrors
          ? Object.values(validationErrors).flat().join(' ')
          : requestError.response?.data?.message || 'ไม่สามารถส่งข้อมูลบริษัทได้'
      )
    } finally {
      setCreating(false)
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
              {showCreateForm ? 'ปิดฟอร์ม' : 'เพิ่มข้อมูลบริษัท'}
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              เข้าสู่ระบบเพื่อส่งข้อมูลบริษัท
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
            noValidate
            onSubmit={handleCreateCompany}
            className="mt-5 grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
          >
            <p className="text-sm text-amber-800 md:col-span-2">
              ข้อมูลบริษัทจะรอ Admin ตรวจสอบและอนุมัติก่อนแสดงบนเว็บไซต์
            </p>
            <label className="text-sm font-medium text-gray-700">
              ชื่อบริษัท *
              <input
                required
                value={companyForm.company_name}
                onChange={(event) => setCompanyForm({
                  ...companyForm,
                  company_name: event.target.value
                })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              อุตสาหกรรม *
              <select
                required
                value={companyForm.industry_id}
                onChange={(event) => setCompanyForm({
                  ...companyForm,
                  industry_id: event.target.value
                })}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">เลือกอุตสาหกรรม</option>
                {industries.map((industry) => (
                  <option key={industry.industry_id} value={industry.industry_id}>
                    {industry.industry_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              โลโก้บริษัท
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(event) => setCompanyForm({
                  ...companyForm,
                  logo_image: event.target.files?.[0] || null
                })}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              />
              <span className="mt-1 block text-xs text-gray-500">ไฟล์ JPG/PNG ขนาดไม่เกิน 2 MB</span>
            </label>
            <label className="text-sm font-medium text-gray-700">
              เอกสารยืนยันบริษัท *
              <input
                required
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                onChange={(event) => setCompanyForm({
                  ...companyForm,
                  document: event.target.files?.[0] || null
                })}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              />
              <span className="mt-1 block text-xs text-gray-500">
                ไฟล์ PDF/JPG/PNG ขนาดไม่เกิน 5 MB
              </span>
            </label>
            <label className="text-sm font-medium text-gray-700">
              ที่อยู่
              <input
                value={companyForm.address}
                onChange={(event) => setCompanyForm({
                  ...companyForm,
                  address: event.target.value
                })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </label>
            {[
              ['description', 'รายละเอียดบริษัท'],
              ['benefits', 'สวัสดิการ'],
              ['culture', 'วัฒนธรรมองค์กร']
            ].map(([field, label]) => (
              <label key={field} className="text-sm font-medium text-gray-700 md:col-span-2">
                {label}
                <textarea
                  rows="3"
                  value={companyForm[field]}
                  onChange={(event) => setCompanyForm({
                    ...companyForm,
                    [field]: event.target.value
                  })}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </label>
            ))}
            <button
              type="submit"
              disabled={creating || industries.length === 0}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 md:col-span-2"
            >
              {creating ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลบริษัท'}
            </button>
          </form>
        )}

        <label className="mt-8 block max-w-sm text-sm font-medium text-gray-700">
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