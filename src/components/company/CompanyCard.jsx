import { Link } from 'react-router-dom'

function CompanyCard({ company }) {
  if (!company) {
    return null
  }

  const rating = company.rating || {}

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      {/* Company Header */}
      <div className="flex items-center gap-4">

        {company.logo_image ? (
          <img
            src={new URL(company.logo_image, 'http://127.0.0.1:8000/').toString()}
            alt={company.company_name}
            className="h-16 w-16 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500">
            Logo
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-gray-900">
            {company.company_name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {company.industry?.industry_name || company.industry || 'ไม่ระบุอุตสาหกรรม'}
          </p>
        </div>

      </div>


      {/* Overall Rating */}
      <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">

        <span className="text-sm text-gray-600">
          คะแนนรวม
        </span>

        <span className="text-lg font-bold text-yellow-500">
          ★ {rating.overall ?? 0}
        </span>

      </div>


      {/* 4 Ratings */}
      <div className="mt-5 grid grid-cols-2 gap-4">

        <div>
          <p className="text-sm text-gray-500">
            ชีวิตดี
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {rating.life ?? 0} / 5
          </p>
        </div>


        <div>
          <p className="text-sm text-gray-500">
            งานดี
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {rating.work ?? 0} / 5
          </p>
        </div>


        <div>
          <p className="text-sm text-gray-500">
            เงินดี
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {rating.money ?? 0} / 5
          </p>
        </div>


        <div>
          <p className="text-sm text-gray-500">
            สังคมดี
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {rating.society ?? 0} / 5
          </p>
        </div>

      </div>


      {/* Description */}
      {company.description && (
        <p className="mt-5 line-clamp-2 text-sm text-gray-600">
          {company.description}
        </p>
      )}


      {/* Detail Button */}
      <Link
        to={`/companies/${company.company_id}`}
        className="mt-6 block rounded-lg border border-blue-600 py-2.5 text-center font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        ดูรายละเอียด
      </Link>

    </div>
  )
}

export default CompanyCard