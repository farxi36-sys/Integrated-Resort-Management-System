import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function NotificationsPage(){
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications/list')
      setNotifications(res.data.notifications || [])
    } catch (err) {
      console.error('Failed to load notifications', err)
      alert('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    loadNotifications()
  },[])

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read', { notificationIds: notifications.filter(item => !item.read).map(item => item._id) })
      await loadNotifications()
    } catch (err) {
      alert('Failed to mark notifications as read')
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/15">
        <div className="p-8 md:p-12 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Alerts</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Notifications</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">Track booking created, updated, canceled, checked in, and checked out events.</p>
          </div>
          <button onClick={markAllRead} className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:bg-slate-100">Mark all read</button>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
        {loading ? (
          <div className="text-center py-8">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-600">No notifications yet</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item._id} className={`rounded-2xl border p-4 ${item.read ? 'border-slate-200 bg-slate-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.type?.replaceAll('_', ' ')}</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.message}</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>{new Date(item.createdAt).toLocaleString()}</div>
                    {!item.read && <div className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">New</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
