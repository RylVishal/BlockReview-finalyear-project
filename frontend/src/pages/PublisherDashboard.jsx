import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import PaperCard from '../components/PaperCard'
import { papersAPI, usersAPI } from '../services/api'
import { FileText, CheckCircle, Clock, Coins, PenLine, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function PublisherDashboard() {
  const { user } = useAuth()
  const [papers, setPapers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([papersAPI.getMy(), usersAPI.getPoints()])
      .then(([pr, tr]) => {
        setPapers(pr.data.papers)
        setTransactions(tr.data.transactions)
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: papers.length,
    published: papers.filter(p => p.status === 'published').length,
    inReview: papers.filter(p => p.status === 'under_review').length,
    revision: papers.filter(p => p.status === 'revision_required').length,
  }

  return (
    <Layout title="Publisher Dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">{user?.institution || 'Independent Researcher'}</p>
        </div>
        <Link to="/submit" className="btn-primary flex items-center gap-2">
          <PenLine className="w-4 h-4" /> Submit Paper
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Total Papers" value={stats.total} color="cyan" />
        <StatCard icon={CheckCircle} label="Published" value={stats.published} color="green" />
        <StatCard icon={Clock} label="Under Review" value={stats.inReview} color="purple" />
        <StatCard icon={Coins} label="Points Earned" value={user?.points || 0} color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Papers */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">My Papers</h3>
            <Link to="/submit" className="text-sm text-accent-cyan hover:underline">+ New</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)}
            </div>
          ) : papers.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No papers submitted yet.</p>
              <Link to="/submit" className="btn-primary inline-flex mt-4 text-sm">Submit Your First Paper</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {papers.map(p => <PaperCard key={p._id} paper={p} showStatus />)}
            </div>
          )}
        </div>

        {/* Points History */}
        <div>
          <h3 className="section-title mb-4">Points History</h3>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-gradient-to-r from-accent-amber/20 to-accent-amber/5 border border-accent-amber/20">
              <Coins className="w-8 h-8 text-accent-amber" />
              <div>
                <div className="text-2xl font-display font-bold text-slate-100">{user?.points || 0}</div>
                <div className="text-sm text-slate-400">Total Points</div>
              </div>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-4">No transactions yet</p>
              ) : (
                transactions.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div>
                      <div className="text-sm text-slate-300">{t.reason}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-accent-green">+{t.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Points guide */}
          <div className="glass-card p-4 mt-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-green" /> Earn More Points
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between"><span>Submit a paper</span><span className="text-accent-amber">+10</span></div>
              <div className="flex justify-between"><span>Paper published</span><span className="text-accent-amber">+50</span></div>
              <div className="flex justify-between"><span>Complete review</span><span className="text-accent-amber">+25</span></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
