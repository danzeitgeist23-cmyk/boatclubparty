import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { RadioProvider } from './context/RadioContext'
import MiniPlayer from './components/MiniPlayer'
import MusicPage from './pages/public/MusicPage'
import HomePage from './pages/public/HomePage'
import AuthPage from './pages/public/AuthPage'
import EventPage from './pages/public/EventPage'
import DjsPage from './pages/public/DjsPage'
import BlogPage from './pages/public/BlogPage'
import PostPage from './pages/public/PostPage'
import LoginPage from './pages/admin/LoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import EventsPage from './pages/admin/EventsPage'
import AccountLayout from './pages/account/AccountLayout'
import AccountPage from './pages/account/AccountPage'
import BookingsPage from './pages/account/BookingsPage'
import RewardsPage from './pages/account/RewardsPage'

function Loader() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="bebas" style={{ fontSize: '2rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>BOAT CLUB PARTY</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8, letterSpacing: '0.15em' }}>LOADING...</div>
      </div>
    </div>
  )
}

// /admin/*: exige sesión Y rol admin (la DB lo exige igualmente vía RLS is_admin())
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth()

  if (loading) return <Loader />
  if (!session) return <Navigate to="/admin/login" replace />
  if (profile?.role !== 'admin') return <Navigate to="/account" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <HashRouter>
      <RadioProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/events/:slug" element={<EventPage />} />
        <Route path="/djs" element={<DjsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="rewards" element={<RewardsPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MiniPlayer />
      </RadioProvider>
    </HashRouter>
  )
}
