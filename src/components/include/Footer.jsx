function Footer() {
  return (
    <footer className="mt-12 border-t bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-8 md:grid-cols-3">

          {/* About */}
          <div>
            <h2 className="text-lg font-bold">
              Company Review
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              แพลตฟอร์มสำหรับค้นหาและรีวิวบริษัท
              เพื่อช่วยให้ผู้ใช้งานมีข้อมูลประกอบการตัดสินใจก่อนสมัครงาน
            </p>
          </div>


          {/* Menu */}
          <div>
            <h3 className="font-semibold">
              เมนู
            </h3>

            <div className="mt-3 space-y-2 text-sm text-gray-400">
              <p>หน้าแรก</p>
              <p>บริษัท</p>
              <p>หางาน</p>
              <p>รีวิวบริษัท</p>
            </div>
          </div>


          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              เกี่ยวกับระบบ
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              ระบบรีวิวบริษัทและค้นหางาน
              สำหรับแลกเปลี่ยนข้อมูลและประสบการณ์การทำงาน
            </p>
          </div>

        </div>


        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Company Review. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer