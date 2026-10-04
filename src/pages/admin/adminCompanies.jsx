import AdminResource from './adminResource'

function AdminCompanies() {
  return (
    <AdminResource
      title="บริษัท"
      endpoint="companies"
      listEndpoint="admin/companies"
      idField="company_id"
      approvalWorkflow
      authorizationDocumentEndpoint="admin/companies"
      documentRoute="registration-document"
      documentAvailabilityField="has_registration_document"
      documentNotFoundMessage="ไม่พบเอกสารจดทะเบียนของบริษัทนี้"
      fields={[
        { name: 'company_name', label: 'ชื่อบริษัท', required: true },
        { name: 'logo_image', label: 'โลโก้บริษัท', type: 'file', accept: 'image/jpeg,image/png' },
        {
          name: 'industry_id',
          label: 'อุตสาหกรรม',
          type: 'select',
          required: true,
          optionsEndpoint: 'industries',
          optionId: 'industry_id',
          optionLabel: 'industry_name',
          relatedName: 'industry'
        },
        { name: 'description', label: 'รายละเอียด', type: 'textarea' },
        { name: 'address', label: 'ที่อยู่', type: 'textarea' },
        { name: 'benefits', label: 'สวัสดิการ', type: 'textarea' },
        { name: 'culture', label: 'วัฒนธรรมองค์กร', type: 'textarea' }
      ]}
      columns={[
        { label: 'โลโก้', path: 'logo_image', type: 'image' },
        { label: 'ชื่อบริษัท', path: 'company_name' },
        { label: 'อุตสาหกรรม', path: 'industry' },
        { label: 'ที่อยู่', path: 'address' },
        { label: 'สถานะอนุมัติ', path: 'approval_status', type: 'approvalStatus' },
        { label: 'userID', path: 'submitted_by' }
      ]}
    />
  )
}

export default AdminCompanies
