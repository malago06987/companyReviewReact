import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

import MainLayout from './layout/mainLayout'
import Home from './pages/home'
import Companies from './pages/companies'
import CompanyDetail from './pages/companyDetail'
import Jobs from './pages/jobs'
import JobDetail from './pages/jobDetail'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import WriteReview from './pages/review'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/review" element={<WriteReview />} />
          <Route
            path="/reviews/write"
            element={<Navigate to="/review" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
