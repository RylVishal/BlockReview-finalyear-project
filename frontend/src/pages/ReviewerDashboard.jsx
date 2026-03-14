import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { papersAPI, reviewsAPI, usersAPI } from '../services/api'
import { Star, CheckCircle, Clock, Coins, BarChart2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function ReviewerDashboard() {
  const { user } = useAuth()
  const [assignedPapers, setAssignedPapers] = useState([])
  const [myReviews, setMyReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      papersAPI.getAssigned(),
      reviewsAPI.getMy(),
      reviewsAPI.getStats(),
      usersAPI.getPoints(),
    ])
      .then(([ap, mr, st, tr]) => {
        setAssignedPapers(ap.data.papers)
        setMyReviews(mr.data.reviews)
        setStats(st.data.stats)
        setTransactions(tr.data.transactions)
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const reviewedIds = myReviews.map(r => r.paper?._id || r.paper)
  const pendingPapers = assignedPapers.filter(p => !reviewedIds.includes(p._id.toString()))

  const radarData = stats ? [
    { subject: 'Accept', A: stats.byRecommendation.accept },
    { subject: 'Minor Rev', A: stats.byRecommendation.minor_revision },
    { subject: 'Major Rev', A: stats.byRecommendation.major_revision },
    { subject: 'Reject', A: stats.byRecommendation.reject },
  ] : []

  return (
    <Layout title="Reviewer Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">{user?.institution || 'Independent Reviewer'}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-amber/10 border border-accent-amber/20">
          <Coins className="w-4 h-4 text-accent-amber" />
          <span className="text-sm font-semibold text-accent-amber">{user?.points || 0} pts</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Assigned Papers" value={assignedPapers.length} color="cyan" />
        <StatCard icon={CheckCircle} label="Reviews Done" value={myReviews.length} color="green" />
        <StatCard icon={Clock} label="Pending Reviews" value={pendingPapers.length} color="purple" />
        <StatCard icon={Coins} label="Points Earned" value={user?.points || 0} color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Assigned Papers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending */}
          <div>
            <h3 className="section-title mb-4">Pending Reviews
              {pendingPapers.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber text-xs">{pendingPapers.length}</span>
              )}
            </h3>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="glass-card h-28 animate-pulse" />)}</div>
            ) : pendingPapers.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <CheckCircle className="w-10 h-10 text-accent-green mx-auto mb-3" />
                <p className="text-slate-400">All caught up! No pending reviews.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPapers.map(paper => (
                  <div key={paper._id} className="glass-card p-5 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-slate-100 line-clamp-1 mb-1">{paper.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-2">{paper.abstract}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{paper.submittedBy?.name}</span>
                        <span>•</span>
                        <span>{paper.category}</span>
                      </div>
                    </div>
                    <Link to={`/review/${paper._id}`} className="btn-primary text-sm flex-shrink-0">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Reviews */}
          <div>
            <h3 className="section-title mb-4">Completed Reviews</h3>
            {myReviews.length === 0 ? (
              <div className="glass-card p-6 text-center text-slate-500 text-sm">No reviews submitted yet.</div>
            ) : (
              <div className="space-y-3">
                {myReviews.map(review => (
                  <div key={review._id} className="glass-card p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-200 line-clamp-1">{review.paper?.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-accent-amber text-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />{review.rating}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        review.recommendation === 'accept' ? 'bg-accent-green/10 text-accent-green' :
                        review.recommendation === 'reject' ? 'bg-red-500/10 text-red-400' :
                        'bg-accent-amber/10 text-accent-amber'
                      }`}>{review.recommendation?.replace('_', ' ')}</span>
                      <span className="text-xs text-accent-green font-semibold">+25 pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Radar Chart */}
          {stats && stats.total > 0 && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-accent-cyan" /> Review Breakdown
              </h4>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2d4268" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Radar name="Reviews" dataKey="A" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} />
                  <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #2d4268', borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-3 text-center text-xs text-slate-500">
                Avg Rating: <span className="text-accent-amber font-bold">{stats.avgRating}/5</span>
              </div>
            </div>
          )}

          {/* Points */}
          <div className="glass-card p-5">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Recent Points</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center text-slate-500 text-xs py-3">No transactions yet</p>
              ) : (
                transactions.slice(0, 10).map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-xs text-slate-400">{t.reason}</span>
                    <span className="text-xs font-semibold text-accent-green">+{t.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Points guide */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Points Guide</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between"><span>Complete a review</span><span className="text-accent-amber font-bold">+25</span></div>
              <div className="flex justify-between"><span>Review accepted</span><span className="text-accent-amber font-bold">+10</span></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
