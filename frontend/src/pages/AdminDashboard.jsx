import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { papersAPI, usersAPI, blockchainAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Shield, FileText, Users, CheckCircle, Link2, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'submitted',        label: 'Submitted' },
  { value: 'under_review',     label: 'Under Review' },
  { value: 'revision_required', label: 'Revision Required' },
  { value: 'published',        label: 'Published' },
  { value: 'rejected',         label: 'Rejected' },
]

export default function AdminDashboard() {
  const [papers, setPapers] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [blockchainStatus, setBlockchainStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [assignModal, setAssignModal] = useState(null) // paperId
  const [selectedReviewer, setSelectedReviewer] = useState('')

  useEffect(() => {
    Promise.all([
      papersAPI.getAllAdmin(),
      usersAPI.getReviewers(),
      blockchainAPI.getStatus(),
    ])
      .then(([pr, rr, bc]) => {
        setPapers(pr.data.papers)
        setReviewers(rr.data.reviewers)
        setBlockchainStatus(bc.data)
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (paperId, status) => {
    try {
      const res = await papersAPI.updateStatus(paperId, status)
      setPapers(prev => prev.map(p => p._id === paperId ? res.data.paper : p))
      toast.success('Status updated')
    } catch (e) { toast.error(e.message) }
  }

  const assignReviewer = async () => {
    if (!selectedReviewer) return toast.error('Select a reviewer')
    try {
      const res = await papersAPI.assignReviewer(assignModal, selectedReviewer)
      setPapers(prev => prev.map(p => p._id === assignModal ? res.data.paper : p))
      toast.success('Reviewer assigned')
      setAssignModal(null)
      setSelectedReviewer('')
    } catch (e) { toast.error(e.message) }
  }

  const filtered = filter === 'all' ? papers : papers.filter(p => p.status === filter)

  const counts = {
    total: papers.length,
    submitted: papers.filter(p => p.status === 'submitted').length,
    review: papers.filter(p => p.status === 'under_review').length,
    published: papers.filter(p => p.status === 'published').length,
  }

  return (
    <Layout title="Admin Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Papers', value: counts.total, color: 'text-accent-cyan' },
          { label: 'New Submissions', value: counts.submitted, color: 'text-accent-amber' },
          { label: 'Under Review', value: counts.review, color: 'text-accent-purple' },
          { label: 'Published', value: counts.published, color: 'text-accent-green' },
        ].map(({ label, value, color }, i) => (
          <div key={i} className="glass-card p-5">
            <div className={`text-3xl font-display font-bold ${color}`}>{value}</div>
            <div className="text-sm text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Blockchain status */}
      {blockchainStatus && (
        <div className={`glass-card p-4 mb-6 flex items-center gap-3 ${blockchainStatus.connected ? 'border-accent-green/20' : 'border-accent-amber/20'}`}>
          <Link2 className={`w-5 h-5 ${blockchainStatus.connected ? 'text-accent-green' : 'text-accent-amber'}`} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-200">
              Blockchain: {blockchainStatus.connected ? 'Connected' : 'Not Connected'}
            </div>
            {blockchainStatus.connected ? (
              <div className="text-xs text-slate-500 font-mono">{blockchainStatus.contractAddress}</div>
            ) : (
              <div className="text-xs text-slate-500">{blockchainStatus.message}</div>
            )}
          </div>
          <div className={`w-2 h-2 rounded-full ${blockchainStatus.connected ? 'bg-accent-green animate-pulse' : 'bg-accent-amber'}`} />
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ value: 'all', label: 'All' }, ...STATUS_OPTIONS].map(({ value, label }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${filter === value ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'btn-ghost text-xs'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Papers table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-500 uppercase">
                <th className="text-left px-5 py-3">Paper</th>
                <th className="text-left px-5 py-3">Author</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Reviewers</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 bg-dark-600 rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">No papers found</td></tr>
              ) : (
                filtered.map(paper => (
                  <tr key={paper._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-medium text-slate-200 line-clamp-1">{paper.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{paper.category}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{paper.submittedBy?.name}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={paper.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-400">
                        {paper.assignedReviewers?.length > 0
                          ? paper.assignedReviewers.map(r => r.name).join(', ')
                          : <span className="text-slate-600">None</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Status select */}
                        <div className="relative">
                          <select
                            value={paper.status}
                            onChange={e => updateStatus(paper._id, e.target.value)}
                            className="appearance-none bg-dark-600/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300
                              focus:outline-none focus:border-accent-cyan/40 cursor-pointer pr-6"
                          >
                            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                        </div>
                        {/* Assign reviewer */}
                        <button onClick={() => setAssignModal(paper._id)}
                          className="px-2 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan text-xs border border-accent-cyan/20 hover:bg-accent-cyan/20 transition-colors">
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="glass-card p-6 w-full max-w-md">
            <h3 className="font-display font-semibold text-slate-100 mb-4">Assign Reviewer</h3>
            <select className="input-field mb-4" value={selectedReviewer} onChange={e => setSelectedReviewer(e.target.value)}>
              <option value="">Select a reviewer…</option>
              {reviewers.map(r => (
                <option key={r._id} value={r._id}>{r.name} — {r.institution || 'Independent'} ({r.stats.reviewsCompleted} reviews)</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={assignReviewer} className="btn-primary flex-1">Assign</button>
              <button onClick={() => { setAssignModal(null); setSelectedReviewer('') }} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
