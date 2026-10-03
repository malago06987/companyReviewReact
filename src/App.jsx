import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Companies from './pages/companies'
import CompanyDetail from './pages/companyDetail'
import Jobs from './pages/jobs'
import JobDetail from './pages/jobDetail'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import WriteReview from './pages/reviews/WriteReview'
import Navbar from './components/Navbar'
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Companies */}
        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/companies/:id"
          element={<CompanyDetail />}
        />

        {/* Jobs */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetail />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Reviews */}
        <Route
          path="/reviews/write"
          element={<WriteReview />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
