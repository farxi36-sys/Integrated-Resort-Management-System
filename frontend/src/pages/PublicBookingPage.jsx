import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { rooms as sharedRooms } from '../data/rooms'

export default function PublicBookingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [formData, setFormData] = useState({
    guest: { name: '', phone: '', email: '', idProof: '' },
    roomType: (sharedRooms && sharedRooms.length) ? sharedRooms[0].type : '',
    roomId: (sharedRooms && sharedRooms.length) ? sharedRooms[0].id : '',
    checkIn: '',
    checkOut: ''
  })

  const preferredOwnerId = searchParams.get('owner') || localStorage.getItem('ownerId') || import.meta.env.VITE_OWNER_ID || ''

  useEffect(() => {
    const resolveOwner = async () => {
      if (preferredOwnerId) {
        setOwnerId(preferredOwnerId)
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/auth/public-resort')
        const resolved = res.data?.ownerId
        if (resolved) {
          setOwnerId(resolved)
          localStorage.setItem('ownerId', resolved)
        } else {
          setError('Resort configuration missing. Please contact support.')
        }
      } catch (err) {
        console.error('Failed to resolve owner:', err)
        setError('Unable to load resort configuration. Try again later.')
      } finally {
        setLoading(false)
      }
    }

    resolveOwner()
  }, [preferredOwnerId])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('guest.')) {
      const field = name.replace('guest.', '')
      setFormData({ ...formData, guest: { ...formData.guest, [field]: value } })
      return
    }

    // if user selected a room option (roomId), also set roomType from the sharedRooms list
    if (name === 'roomId') {
      const r = sharedRooms.find(s => s.id === value)
      setFormData({ ...formData, roomId: value, roomType: r ? r.type : formData.roomType })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.guest.name || !formData.guest.phone || !formData.guest.email || !formData.checkIn || !formData.checkOut) {
      setError('Please fill required fields')
      return
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out must be after check-in')
      return
    }

    if (!ownerId) {
      setError('Resort configuration is not available')
      return
    }

    try {
      await api.post('/booking/guest/create', { ...formData, ownerId })
      setSubmitted(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      console.error('Booking error response:', err.response || err.message || err)
      setError(err.response?.data?.message || err.message || 'Booking failed')
    }
  }

  if (error && !submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-4 text-5xl">❌</div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Configuration Error</h2>
          <p className="mb-6 text-slate-600">{error}</p>
          <button onClick={() => navigate('/')} className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105">Back to Home</button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-3 text-5xl">✨</div>
          <h2 className="text-2xl font-black text-emerald-700">Booking Submitted</h2>
          <p className="mt-2 text-slate-600">Thanks — we will confirm your booking shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50 py-12">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-black text-slate-900">Book Your Stay</h1>
          <p className="mt-2 text-sm text-slate-600">Fill out the form below to request a booking</p>
        </header>

        <div className="rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Full name *</label>
              <input
                name="guest.name"
                value={formData.guest.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Phone *</label>
              <input
                name="guest.phone"
                value={formData.guest.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email *</label>
              <input
                type="email"
                name="guest.email"
                value={formData.guest.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">ID Proof</label>
              <input
                name="guest.idProof"
                value={formData.guest.idProof}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Check-in *</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Check-out *</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Room Type</label>
                <select name="roomId" value={formData.roomId} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-emerald-500 focus:bg-white">
                  <optgroup label="AC Rooms">
                    {sharedRooms.filter(r => r.type === 'AC').map(r => (
                      <option key={r.id} value={r.id}>{`${r.name} - ₹${r.price} / night`}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Non-AC Rooms">
                    {sharedRooms.filter(r => r.type === 'Non-AC').map(r => (
                      <option key={r.id} value={r.id}>{`${r.name} - ₹${r.price} / night`}</option>
                    ))}
                  </optgroup>
                </select>
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 text-lg font-black text-white shadow-xl shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-emerald-500/40 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Submit Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
