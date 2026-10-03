import React from "react";
import Navbar from "../compornents/navbar";
import Footer from "../compornents/footer";

function AdminLayout() {
  return (
    <div>
      <Navbar />

      <main>
        <h1>Admin Dashboard</h1>

        <section>
          <h2>จัดการบริษัท</h2>
          <p>จัดการข้อมูลบริษัท</p>
        </section>

        <section>
          <h2>จัดการงาน</h2>
          <p>จัดการข้อมูลตำแหน่งงาน</p>
        </section>

        <section>
          <h2>จัดการรีวิว</h2>
          <p>ตรวจสอบและจัดการรีวิว</p>
        </section>

        <section>
          <h2>จัดการผู้ใช้งาน</h2>
          <p>จัดการข้อมูลผู้ใช้งาน</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AdminLayout;