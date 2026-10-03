import AdminResource from './adminResource'

function AdminReviews() {
  return (
    <AdminResource
      title="รีวิว"
      endpoint="reviews"
      idField="review_id"
      canCreate={false}
      note="API ปัจจุบันแสดงเฉพาะรีวิวที่อนุมัติแล้ว จึงไม่สามารถดูรีวิว pending/rejected จากหน้านี้ได้"
      fields={[
        {
          name: 'status',
          label: 'สถานะ',
          type: 'select',
          required: true,
          options: [
            { value: 'pending', label: 'รอตรวจสอบ' },
            { value: 'approved', label: 'อนุมัติ' },
            { value: 'rejected', label: 'ไม่อนุมัติ' }
          ]
        }
      ]}
      columns={[
        { label: 'บริษัท', path: 'company.company_name' },
        { label: 'ผู้รีวิว', path: 'user.full_name' },
        { label: 'ข้อความรีวิว', path: 'review_text' },
        { label: 'สถานะ', path: 'status' }
      ]}
    />
  )
}

export default AdminReviews
