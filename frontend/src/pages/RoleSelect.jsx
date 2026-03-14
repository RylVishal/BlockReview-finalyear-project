import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleSelect() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const roles = [
    { value: 'publisher', label: 'Publisher', icon: '📝', path: '/publisher', desc: 'Submit and track research papers' },
    { value: 'reviewer',  label: 'Reviewer',  icon: '🔬', path: '/reviewer',  desc: 'Review papers and earn points' },
    { value: 'public',    label: 'Public',    icon: '📖', path: '/browse',    desc: 'Browse and read published papers' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold text-slate-100 mb-2">Choose Your View</h1>
        <p className="text-slate-400 mb-10">You are logged in as <span className="text-accent-cyan font-medium">{user?.name}</span></p>
        <div className="space-y-3">
          {roles.map(({ value, label, icon, path, desc }) => (
            <button key={value} onClick={() => navigate(path)}
              className="w-full glass-card p-5 flex items-center gap-4 hover:border-accent-cyan/30 transition-all text-left">
              <span className="text-3xl">{icon}</span>
              <div>
                <div className="font-display font-semibold text-slate-100">{label}</div>
                <div className="text-sm text-slate-400">{desc}</div>
              </div>
              <div className="ml-auto text-accent-cyan">→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
