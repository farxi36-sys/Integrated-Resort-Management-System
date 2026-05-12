import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const token = res.data.token
      const userId = res.data.user?.id
      localStorage.setItem('token', token)
      localStorage.setItem('adminMode', 'true')
      if (userId) {
        localStorage.setItem('userId', userId)
        localStorage.setItem('ownerId', userId)
      }
      navigate('/admin/dashboard')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-50 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold tracking-tight text-slate-900 hover:text-amber-600"
          >
            🏨 Wood Stone Corbett
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-slate-800"
          >
            Back to Booking
          </button>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Owner Access</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Admin Login</h1>
              <p className="mt-2 text-sm text-slate-600">Manage booking requests and approvals</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-amber-500 focus:outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-amber-500 focus:outline-none"
                  disabled={loading}
                />
              </div>

              {err && (
                <div className="rounded-xl bg-red-50 p-4 text-red-700 text-sm border border-red-200">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/25 hover:bg-slate-800 disabled:opacity-50 transition"
              >
                {loading ? 'Signing in...' : 'Sign in to Admin'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              <p>Don't have an admin account?</p>
              <p className="mt-1">Contact the resort owner</p>
            </div>
          </div>

          {/* Demo Credentials Card */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 p-6 shadow-lg">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-900 mb-4">Demo Credentials</p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-700 font-semibold mb-1">ID / Email</p>
                  <p className="text-lg font-mono font-bold text-amber-900">admin@woodstone.local</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-700 font-semibold mb-1">Password</p>
                  <p className="text-lg font-mono font-bold text-amber-900">demo1234</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 rounded-2xl bg-slate-900/80 text-white p-6 backdrop-blur">
            <h3 className="font-bold mb-3">📋 Admin Features</h3>
            <ul className="text-xs space-y-2 text-slate-300">
              <li>✓ View all pending booking requests</li>
              <li>✓ Review guest information</li>
              <li>✓ Accept or reject bookings</li>
              <li>✓ Add rejection reason</li>
              <li>✓ Manage room availability</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
