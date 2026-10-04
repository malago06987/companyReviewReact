import AdminResource from './adminResource'

function AdminJobs() {
  return (
    <AdminResource
      title="ตำแหน่งงาน"
      endpoint="jobs"
      listEndpoint="admin/jobs"
      idField="job_id"
      approvalWorkflow
      authorizationDocumentEndpoint="admin/jobs"
      note="ตรวจสอบและอนุมัติประกาศงานก่อนแสดงในหน้าค้นหางาน"
      fields={[
        {
          name: 'company_id',
          label: 'บริษัท',
          type: 'select',
          required: true,
          optionsEndpoint: 'companies',
          optionId: 'company_id',
          optionLabel: 'company_name',
          relatedName: 'company.company_name'
        },
        {
          name: 'function_id',
          label: 'สายงาน',
          type: 'select',
          required: true,
          optionsEndpoint: 'job-functions',
          optionId: 'function_id',
          optionLabel: 'function_name',
          relatedName: 'job_function.function_name'
        },
        { name: 'job_title', label: 'ชื่อตำแหน่ง', required: true },
        { name: 'job_description', label: 'รายละเอียดงาน', type: 'textarea', required: true },
        { name: 'salary', label: 'เงินเดือน' },
        { name: 'work_location', label: 'สถานที่ทำงาน' },
        { name: 'employment_type', label: 'รูปแบบงาน' },
        {
          name: 'status',
          label: 'สถานะ',
          type: 'select',
          options: [
            { value: 'open', label: 'เปิดรับสมัคร' },
            { value: 'closed', label: 'ปิดรับสมัคร' }
          ]
        }
      ]}
      columns={[
        { label: 'ตำแหน่ง', path: 'job_title' },
        { label: 'บริษัท', path: 'company.company_name' },
        { label: 'สายงาน', path: 'job_function.function_name' },
        { label: 'สถานะประกาศ', path: 'status' },
        { label: 'สถานะอนุมัติ', path: 'approval_status', type: 'approvalStatus' },
        { label: 'ผู้ส่ง (User ID)', path: 'submitted_by' },
        { label: 'เหตุผลปฏิเสธ', path: 'rejection_reason' }
      ]}
    />
  )
}

export default AdminJobs
