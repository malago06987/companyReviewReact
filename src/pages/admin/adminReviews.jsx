import AdminResource from './adminResource'

function AdminReviews() {
  return (
    <AdminResource
      title="รีวิว"
      endpoint="reviews"
      idField="review_id"
      canCreate={false}
      canEdit={false}
      fields={[]}
      columns={[
        { label: 'บริษัท', path: 'company.company_name' },
        { label: 'ผู้รีวิว', path: 'user.full_name' },
        { label: 'ข้อความรีวิว', path: 'review_text' }
      ]}
    />
  )
}

export default AdminReviews
