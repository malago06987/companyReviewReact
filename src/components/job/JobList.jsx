import JobCard from './JobCard'

function JobList({ items }) {
  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">ไม่พบตำแหน่งงาน</p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((job) => (
        <JobCard key={job.job_id} job={job} />
      ))}
    </div>
  )
}

export default JobList
