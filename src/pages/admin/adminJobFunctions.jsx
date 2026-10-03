import AdminResource from './adminResource'

function AdminJobFunctions() {
  return (
    <AdminResource
      title="สายงาน"
      endpoint="job-functions"
      idField="function_id"
      fields={[
        { name: 'function_name', label: 'ชื่อสายงาน', required: true }
      ]}
      columns={[
        { label: 'ชื่อสายงาน', path: 'function_name' },
        { label: 'จำนวนตำแหน่งงาน', path: 'jobs_count' }
      ]}
    />
  )
}

export default AdminJobFunctions
