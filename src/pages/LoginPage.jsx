import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

const initialForm = {
  email: '',
  password: '',
  fullName: '',
  username: '',
  role: 'customer',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { profile, isAdmin } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        const result = await signUp({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          username: form.username,
        })

        if (result?.user) {
          setMessage('Akun berhasil dibuat. Silakan masuk dengan akun baru Anda.')
          setMode('login')
          setForm({ ...initialForm, role: 'customer' })
        }
      } else {
        const result = await signIn({
          email: form.email,
          password: form.password,
        })

        if (result?.user) {
          setMessage('Login berhasil.')

          const nextRole = result?.profile?.role || profile?.role || (isAdmin ? 'admin' : 'customer')

          if (nextRole === 'admin') {
            navigate('/admin')
          } else {
            navigate('/')
          }
        }
      }
    } catch (error) {
      setMessage(error?.message || 'Autentikasi gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Madura Mart</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">
            {mode === 'login' ? 'Masuk ke akun' : 'Buat akun baru'}
          </h1>
        </div>

        <div className="mb-5 flex rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {!isSupabaseConfigured ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Mode demo aktif: gunakan akun admin@maduramart.test / admin123 atau customer@maduramart.test / customer123.
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama lengkap</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  placeholder="username"
                  required
                />
              </div>
            </>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
            Role default: Customer. Admin harus dibuat melalui Supabase dashboard atau role assignment di database dengan RLS.
          </div>

          {message ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>
      </div>
    </div>
  )
}
