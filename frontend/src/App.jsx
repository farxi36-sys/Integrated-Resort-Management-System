import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import BookingPage from './pages/BookingPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import BillingPage from './pages/BillingPage'
import NotificationsPage from './pages/NotificationsPage'
import InvoicesPage from './pages/InvoicesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RoomsPage from './pages/RoomsPage'
import InvoiceView from './pages/InvoiceView'
import ProfilePage from './pages/ProfilePage'
import TeamPage from './pages/TeamPage'
import ExpensePage from './pages/ExpensePage'
import PublicLandingPage from './pages/PublicLandingPage'
import PublicBookingPage from './pages/PublicBookingPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminBookingsDashboard from './pages/AdminBookingsDashboard'
import AdminExpenses from './pages/AdminExpenses'
import AdminInvoices from './pages/AdminInvoices'

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const adminMode = typeof window !== 'undefined' ? localStorage.getItem('adminMode') === 'true' : false;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  
  // Public paths that don't need auth or header
  const publicPaths = ['/', '/book', '/admin'];
  const adminPaths = ['/admin', '/admin/dashboard', '/admin/expenses', '/admin/invoices'];
  const isPublic = publicPaths.includes(location.pathname);
  const isAdmin = adminPaths.includes(location.pathname);
  const isOwnerPortal = !isPublic && !isAdmin;

  useEffect(()=>{
    // Admin routes
    if (adminPaths.includes(location.pathname)) {
      if (location.pathname === '/admin/dashboard' && !token) {
        navigate('/admin');
      }
      return;
    }
    
    // Public routes
    if (publicPaths.includes(location.pathname)) {
      if (token && adminMode) {
        navigate('/admin/dashboard');
      }
      return;
    }

    // Owner portal routes - need auth
    if (!token) {
      navigate('/owner/login');
    }
  },[location.pathname, navigate, token, adminMode])

  const navItems = useMemo(()=>[
    { to: '/owner/dashboard', label: 'Dashboard' },
    { to: '/owner/booking', label: 'New Booking' },
    { to: '/owner/booking-history', label: 'Booking History' },
    { to: '/owner/billing', label: 'Billing' },
    { to: '/owner/notifications', label: 'Notifications' },
    { to: '/owner/expenses', label: 'Expenses' },
    { to: '/owner/invoices', label: 'Invoices' },
    { to: '/owner/rooms', label: 'Rooms' },
    { to: '/owner/team', label: 'Team' },
    { to: '/owner/profile', label: 'Profile' }
  ], [])

  const navClass = (path) => `rounded-full px-4 py-2 text-sm font-medium transition ${location.pathname === path ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`

  const doLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setConfirmLogout(false);
    navigate('/owner/login');
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_35%,_#f8fafc_70%)] text-slate-900">
      {isOwnerPortal && (
        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Wood Stone Corbett - My Space</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Owner portal</p>
            </div>
            <nav className="flex flex-wrap items-center justify-end gap-2">
              {navItems.map(item => <Link key={item.to} to={item.to} className={navClass(item.to)}>{item.label}</Link>)}
              <button onClick={()=> setConfirmLogout(true)} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">Logout</button>
            </nav>
          </div>
        </header>
      )}
      {isPublic && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-slate-900/20">Wood Stone Corbett</div>
        </div>
      )}
      <main className={isPublic ? 'p-4 pb-10 pt-6 sm:p-6' : 'mx-auto max-w-7xl p-4 pb-10 pt-6 sm:p-6 lg:px-8'}>
        <Routes>
          {/* Public Guest Site */}
          <Route path="/" element={<PublicLandingPage/>} />
          <Route path="/book" element={<PublicBookingPage/>} />
          
          {/* Admin Section */}
          <Route path="/admin" element={<AdminLoginPage/>} />
          <Route path="/admin/dashboard" element={<AdminBookingsDashboard/>} />
          <Route path="/admin/expenses" element={<AdminExpenses/>} />
          <Route path="/admin/invoices" element={<AdminInvoices/>} />

          {/* Owner Portal */}
          <Route path="/owner/login" element={<LoginPage/>} />
          <Route path="/owner/register" element={<RegisterPage/>} />
          <Route path="/owner/dashboard" element={<Dashboard/>} />
          <Route path="/owner/booking" element={<BookingPage/>} />
          <Route path="/owner/booking-history" element={<BookingHistoryPage/>} />
          <Route path="/owner/billing" element={<BillingPage/>} />
          <Route path="/owner/notifications" element={<NotificationsPage/>} />
          <Route path="/owner/expenses" element={<ExpensePage/>} />
          <Route path="/owner/invoices" element={<InvoicesPage/>} />
          <Route path="/owner/invoice/:id" element={<InvoiceView/>} />
          <Route path="/owner/rooms" element={<RoomsPage/>} />
          <Route path="/owner/profile" element={<ProfilePage/>} />
          <Route path="/owner/team" element={<TeamPage/>} />
        </Routes>
      </main>

      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Confirm logout</p>
            <h2 className="mt-2 text-2xl font-semibold">Leave owner space?</h2>
            <p className="mt-2 text-sm text-slate-600">Your session will end on this device. You can log back in anytime.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={()=> setConfirmLogout(false)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
              <button onClick={doLogout} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 font-medium text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
