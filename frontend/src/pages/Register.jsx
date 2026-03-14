import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'

const ROLES = [
  { value: 'publisher', label: 'Publisher / Author', desc: 'Submit and publish research papers', icon: '📝' },
  { value: 'reviewer',  label: 'Peer Reviewer',      desc: 'Review and evaluate submissions',   icon: '🔬' },
  { value: 'public',    label: 'Public Reader',       desc: 'Browse and read published papers',  icon: '📖' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', institution: '', walletAddress: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) return toast.error('Please select a role')
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Welcome to BlockReview, ${user.name}!`)
      if (user.role === 'publisher') navigate('/publisher')
      else if (user.role === 'reviewer') navigate('/reviewer')
      else navigate('/browse')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 py-10">
      <div className="fixed top-0 right-1/3 w-96 h-96 orb bg-accent-cyan/8 -translate-y-1/2" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold font-display">BR</div>
            <span className="font-display font-bold text-slate-100 text-xl">BlockReview</span>
          </Link>
          <h2 className="font-display text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join the decentralized publishing platform</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input className="input-field" placeholder="Dr. Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input type="email" className="input-field" placeholder="you@university.edu" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <input type="password" className="input-field" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
              </div>
              <div className="col-span-2">
                <label className="label">Institution (optional)</label>
                <input className="input-field" placeholder="MIT, Stanford, IIT..." value={form.institution} onChange={e => set('institution', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label">Wallet Address (optional)</label>
                <input className="input-field font-mono text-sm" placeholder="0x..." value={form.walletAddress} onChange={e => set('walletAddress', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Select Your Role</label>
              <div className="space-y-2">
                {ROLES.map(({ value, label, desc, icon }) => (
                  <button key={value} type="button" onClick={() => set('role', value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                      ${form.role === value
                        ? 'border-accent-cyan/50 bg-accent-cyan/10'
                        : 'border-white/10 bg-dark-600/40 hover:border-white/20'}`}>
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{label}</div>
                      <div className="text-xs text-slate-500">{desc}</div>
                    </div>
                    {form.role === value && <div className="ml-auto w-2 h-2 rounded-full bg-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-400 mt-5">
            Already registered?{' '}
            <Link to="/login" className="text-accent-cyan hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
