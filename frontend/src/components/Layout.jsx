import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, FileText, PenLine, Search, LogOut,
  Coins, Menu, X, ChevronRight, Shield, Star, BookOpen, Settings
} from 'lucide-react'

const navByRole = {
  publisher: [
    { to: '/publisher',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit',     icon: PenLine,          label: 'Submit Paper' },
    { to: '/browse',     icon: Search,           label: 'Browse Papers' },
  ],
  reviewer: [
    { to: '/reviewer',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/browse',     icon: Search,          label: 'Browse Papers' },
  ],
  admin: [
    { to: '/admin',      icon: Shield,          label: 'Admin Panel' },
    { to: '/publisher',  icon: FileText,        label: 'Publisher View' },
    { to: '/reviewer',   icon: Star,            label: 'Reviewer View' },
    { to: '/browse',     icon: Search,          label: 'Browse Papers' },
  ],
  public: [
    { to: '/browse',     icon: Search,          label: 'Browse Papers' },
    { to: '/public',     icon: BookOpen,        label: 'Public Dashboard' },
  ],
}

export default function Layout({ children, title }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const nav = navByRole[user?.role] || navByRole.public

  const handleLogout = () => { logout(); navigate('/') }

  const roleColors = {
    publisher: 'text-accent-cyan',
    reviewer: 'text-accent-purple',
    admin: 'text-accent-amber',
    public: 'text-accent-green',
  }

  return (
    <div className="flex min-h-screen bg-dark-900 bg-grid">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/5
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold text-sm font-display">
              BR
            </div>
            <div>
              <div className="font-display font-bold text-slate-100 leading-none">BlockReview</div>
              <div className="text-xs text-slate-500 mt-0.5">Academic Publishing</div>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400/30 to-accent-cyan/30 border border-accent-cyan/20 flex items-center justify-center text-sm font-semibold text-accent-cyan font-display">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate">{user?.name}</div>
              <div className={`text-xs font-medium capitalize ${roleColors[user?.role]}`}>{user?.role}</div>
            </div>
            <div className="flex items-center gap-1 text-accent-amber">
              <Coins className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{user?.points || 0}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {location.pathname === to && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="nav-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="lg:hidden btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-slate-100 text-lg">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-dark-600/60 border border-accent-cyan/20 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow" />
              <span className="text-xs text-slate-400 font-mono">NETWORK ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
