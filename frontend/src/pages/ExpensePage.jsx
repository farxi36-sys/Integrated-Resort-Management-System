import React, { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'woodstone-expenses-v1'

function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

function monthKey(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return 'Invalid'
  return date.toLocaleString('en-IN', { month: 'short', year: 'numeric' })
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ title: '', category: 'Operations', amount: '', date: new Date().toISOString().slice(0, 10), note: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    setExpenses(loadExpenses())
  }, [])

  const metrics = useMemo(() => {
    const currentMonth = new Date().toLocaleString('en-IN', { month: 'short', year: 'numeric' })
    const grouped = expenses.reduce((acc, item) => {
      const key = monthKey(item.date)
      acc[key] = (acc[key] || 0) + Number(item.amount || 0)
      return acc
    }, {})
    const currentMonthTotal = grouped[currentMonth] || 0
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const monthlyHistory = Object.entries(grouped)
      .sort((a, b) => new Date(`01 ${b[0]}`) - new Date(`01 ${a[0]}`))
      .map(([month, total]) => ({ month, total }))
    return { currentMonth, currentMonthTotal, totalSpent, monthlyHistory }
  }, [expenses])

  const submit = (e) => {
    e.preventDefault()
    const entry = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: form.title.trim(),
      category: form.category.trim() || 'Operations',
      amount: Number(form.amount || 0),
      date: form.date,
      note: form.note.trim(),
      createdAt: new Date().toISOString()
    }
    if (!entry.title || !entry.amount) {
      setMessage('Please add an expense title and amount.')
      return
    }
    const next = [entry, ...expenses]
    setExpenses(next)
    saveExpenses(next)
    setForm({ title: '', category: 'Operations', amount: '', date: new Date().toISOString().slice(0, 10), note: '' })
    setMessage('Expense saved to owner history.')
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Expense tracker</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Track resort expenses by month.</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">Store every expense entry, review monthly totals, and keep the owner history visible without deleting records.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
          <h3 className="text-2xl font-semibold">Add Expense</h3>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Expense title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
          <div className="grid gap-3 md:grid-cols-2">
            <input type="number" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} />
            <input type="date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
          </div>
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-slate-400 focus:bg-white" placeholder="Note" value={form.note} onChange={e=>setForm({...form, note: e.target.value})} />
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">Save Expense</button>
          {message && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}
        </form>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/70">
              <div className="text-sm text-slate-500">This Month</div>
              <div className="mt-2 text-3xl font-semibold">₹ {metrics.currentMonthTotal.toFixed(2)}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{metrics.currentMonth}</div>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/70">
              <div className="text-sm text-slate-500">All Time</div>
              <div className="mt-2 text-3xl font-semibold">₹ {metrics.totalSpent.toFixed(2)}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">saved history</div>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/70">
              <div className="text-sm text-slate-500">Entries</div>
              <div className="mt-2 text-3xl font-semibold">{expenses.length}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">records</div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
            <h3 className="text-2xl font-semibold">Monthly History</h3>
            <div className="mt-4 space-y-3">
              {metrics.monthlyHistory.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No expenses saved yet. Add the first one on the left.</div>}
              {metrics.monthlyHistory.map(item => (
                <div key={item.month} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <div className="font-semibold">{item.month}</div>
                    <div className="text-sm text-slate-600">Stored monthly total</div>
                  </div>
                  <div className="text-lg font-semibold">₹ {item.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70 md:p-8">
            <h3 className="text-2xl font-semibold">Recent Entries</h3>
            <div className="mt-4 space-y-3">
              {expenses.slice(0, 8).map(expense => (
                <article key={expense.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{expense.title}</div>
                      <div className="text-sm text-slate-600">{expense.category} • {expense.date}</div>
                      {expense.note && <div className="mt-1 text-sm text-slate-500">{expense.note}</div>}
                    </div>
                    <div className="text-lg font-semibold">₹ {Number(expense.amount || 0).toFixed(2)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}