import AdminResource from './adminResource'

function AdminUsers() {
  return (
    <AdminResource
      title="ผู้ใช้งาน"
      endpoint="users"
      idField="user_id"
      canCreate={false}
      fields={[
        { name: 'full_name', label: 'ชื่อผู้ใช้งาน', required: true },
        { name: 'email', label: 'อีเมล', type: 'email', required: true }
      ]}
      columns={[
        { label: 'ชื่อ', path: 'full_name' },
        { label: 'อีเมล', path: 'email' },
        { label: 'บทบาท', path: 'role' }
      ]}
    />
  )
}

export default AdminUsers
