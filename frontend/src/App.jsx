import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RoleSelect from './pages/RoleSelect'
import PublisherDashboard from './pages/PublisherDashboard'
import ReviewerDashboard from './pages/ReviewerDashboard'
import PublicDashboard from './pages/PublicDashboard'
import SubmitPaper from './pages/SubmitPaper'
import ReviewPaper from './pages/ReviewPaper'
import BrowsePapers from './pages/BrowsePapers'
import PaperDetail from './pages/PaperDetail'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen bg-dark-900">
    <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
  </div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'publisher') return <Navigate to="/publisher" replace />
  if (user.role === 'reviewer') return <Navigate to="/reviewer" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/browse" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/browse" element={<BrowsePapers />} />
      <Route path="/papers/:id" element={<PaperDetail />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

      <Route path="/publisher" element={
        <ProtectedRoute roles={['publisher', 'admin']}>
          <PublisherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/submit" element={
        <ProtectedRoute roles={['publisher', 'admin']}>
          <SubmitPaper />
        </ProtectedRoute>
      } />
      <Route path="/reviewer" element={
        <ProtectedRoute roles={['reviewer', 'admin']}>
          <ReviewerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/review/:paperId" element={
        <ProtectedRoute roles={['reviewer', 'admin']}>
          <ReviewPaper />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/public" element={<PublicDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
