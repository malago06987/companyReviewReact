import AdminResource from './adminResource'

function AdminIndustries() {
  return (
    <AdminResource
      title="อุตสาหกรรม"
      endpoint="industries"
      idField="industry_id"
      fields={[
        { name: 'industry_name', label: 'ชื่ออุตสาหกรรม', required: true }
      ]}
      columns={[{ label: 'ชื่ออุตสาหกรรม', path: 'industry_name' }]}
    />
  )
}

export default AdminIndustries
