import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight, Lock } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const demoAccounts = [
    { label: 'Publisher', email: 'alice@university.edu', role: 'publisher' },
    { label: 'Reviewer',  email: 'james@oxford.ac.uk',  role: 'reviewer' },
    { label: 'Public',    email: 'public@example.com',  role: 'public' },
    { label: 'Admin',     email: 'admin@blockreview.io', role: 'admin' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'publisher') navigate('/publisher')
      else if (user.role === 'reviewer') navigate('/reviewer')
      else if (user.role === 'admin') navigate('/admin')
      else navigate('/browse')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email) => setForm({ email, password: 'password123' })

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4">
      <div className="fixed top-0 left-1/3 w-96 h-96 orb bg-brand-500/10 -translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold font-display">BR</div>
            <span className="font-display font-bold text-slate-100 text-xl">BlockReview</span>
          </Link>
          <h2 className="font-display text-2xl font-bold text-slate-100">Sign In</h2>
          <p className="text-slate-400 text-sm mt-1">Access your research dashboard</p>
        </div>

        {/* Demo accounts */}
        <div className="glass-card p-4 mb-5">
          <p className="text-xs text-slate-500 mb-3 font-medium">DEMO ACCOUNTS (password: password123)</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(({ label, email, role }) => (
              <button key={role} onClick={() => fillDemo(email)}
                className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-xs font-semibold text-slate-300">{label}</div>
                <div className="text-xs text-slate-500 truncate">{email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input-field pr-12"
                  placeholder="••••••••" value={form.password}
                  onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Lock className="w-4 h-4" /> Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-400 mt-5">
            No account?{' '}
            <Link to="/register" className="text-accent-cyan hover:text-accent-cyan/80 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
