import CompanyCard from './CompanyCard'

function CompanyList({ items }) {
  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">ไม่พบข้อมูลบริษัท</p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((company) => (
        <CompanyCard key={company.company_id} company={company} />
      ))}
    </div>
  )
}

export default CompanyList
