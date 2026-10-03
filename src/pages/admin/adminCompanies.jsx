import AdminResource from './adminResource'

function AdminCompanies() {
  return (
    <AdminResource
      title="บริษัท"
      endpoint="companies"
      idField="company_id"
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
        { label: 'ที่อยู่', path: 'address' }
      ]}
    />
  )
}

export default AdminCompanies
