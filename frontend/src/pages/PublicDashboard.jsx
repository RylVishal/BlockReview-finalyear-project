import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { papersAPI, usersAPI } from '../services/api'
import PaperCard from '../components/PaperCard'
import { BookOpen, Search, TrendingUp, Award, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PublicDashboard() {
  const [papers, setPapers] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      papersAPI.getAll({ status: 'published', limit: 6 }),
      usersAPI.getLeaderboard(),
    ])
      .then(([pr, lb]) => {
        setPapers(pr.data.papers)
        setLeaderboard(lb.data.users)
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <div className="fixed top-0 left-1/4 w-96 h-96 orb bg-brand-500/8 -translate-y-1/2" />

      {/* Nav */}
      <nav className="glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold text-xs font-display">BR</div>
          <span className="font-display font-semibold text-slate-100">BlockReview</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/browse" className="btn-ghost text-sm">Browse All</Link>
          <Link to="/login" className="btn-primary text-sm">Sign In</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-slate-100 mb-3">
            Explore Verified <span className="glow-text">Research</span>
          </h1>
          <p className="text-slate-400 mb-6">Blockchain-verified academic papers, openly accessible</p>
          <Link to="/browse" className="btn-primary inline-flex items-center gap-2">
            <Search className="w-4 h-4" /> Search Papers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Papers */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-cyan" /> Latest Publications
              </h2>
              <Link to="/browse" className="text-sm text-accent-cyan hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {papers.map(p => <PaperCard key={p._id} paper={p} />)}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="section-title flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-accent-amber" /> Top Contributors
            </h2>
            <div className="glass-card p-4">
              {leaderboard.map((u, i) => (
                <div key={u._id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display flex-shrink-0
                    ${i === 0 ? 'bg-accent-amber text-dark-900' : i === 1 ? 'bg-slate-400 text-dark-900' : i === 2 ? 'bg-amber-700 text-white' : 'bg-dark-500 text-slate-400'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">{u.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{u.role} • {u.institution || 'Independent'}</div>
                  </div>
                  <div className="text-sm font-bold text-accent-amber">{u.points}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="glass-card p-5 mt-5 text-center border-accent-cyan/15">
              <BookOpen className="w-8 h-8 text-accent-cyan mx-auto mb-3" />
              <h3 className="font-display font-semibold text-slate-100 mb-1">Want to Contribute?</h3>
              <p className="text-xs text-slate-400 mb-4">Join as a publisher or reviewer and earn points</p>
              <Link to="/register" className="btn-primary text-sm w-full flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
