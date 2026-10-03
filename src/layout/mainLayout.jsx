import React from "react";
import Navbar from "../compornents/navbar";
import Footer from "../compornents/footer";

function MainLayout() {
  return (
    <div>
      <Navbar />

      <main>
        <h1>Company Review</h1>
        <p>แพลตฟอร์มรีวิวบริษัทและค้นหางาน</p>

        <section>
          <h2>บริษัท</h2>
          {/* CompanyCard จะใช้ตรงนี้ */}
        </section>

        <section>
          <h2>งาน</h2>
          {/* JobCard จะใช้ตรงนี้ */}
        </section>

        <section>
          <h2>รีวิว</h2>
          {/* ReviewCard จะใช้ตรงนี้ */}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;