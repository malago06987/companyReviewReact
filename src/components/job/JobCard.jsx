import { Link } from 'react-router-dom'

function JobCard({ job }) {
  if (!job) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      {/* Job Title */}
      <h3 className="text-lg font-bold text-gray-900">
        {job.job_title}
      </h3>


      {/* Company */}
      <p className="mt-2 font-medium text-blue-600">
        {job.company?.company_name || 'ไม่ระบุบริษัท'}
      </p>


      {/* Job Function */}
      {job.job_function?.function_name && (
        <p className="mt-1 text-sm text-gray-500">
          {job.job_function.function_name}
        </p>
      )}


      {/* Job Information */}
      <div className="mt-5 space-y-3 text-sm">

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">
            สถานที่
          </span>

          <span className="text-right text-gray-800">
            {job.work_location || 'ไม่ระบุ'}
          </span>
        </div>


        <div className="flex justify-between gap-4">
          <span className="text-gray-500">
            รูปแบบงาน
          </span>

          <span className="text-right text-gray-800">
            {job.employment_type || 'ไม่ระบุ'}
          </span>
        </div>


        <div className="flex justify-between gap-4">
          <span className="text-gray-500">
            เงินเดือน
          </span>

          <span className="text-right font-medium text-gray-800">
            {job.salary || 'ไม่ระบุ'}
          </span>
        </div>

      </div>


      {/* Description */}
      {job.job_description && (
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
          {job.job_description}
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        สถานะ: {job.status === 'open' ? 'เปิดรับสมัคร' : job.status === 'closed' ? 'ปิดรับสมัคร' : job.status || 'ไม่ระบุ'}
      </p>


      {/* Detail Button */}
      <Link
        to={`/jobs/${job.job_id}`}
        className="mt-6 block rounded-lg border border-blue-600 py-2.5 text-center font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        ดูรายละเอียดงาน
      </Link>

    </div>
  )
}

export default JobCard