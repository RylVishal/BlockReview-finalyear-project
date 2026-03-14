import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { papersAPI, reviewsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Star, CheckCircle } from 'lucide-react'

const RECOMMENDATIONS = [
  { value: 'accept',         label: 'Accept',         desc: 'Ready for publication',                color: 'border-accent-green/50 bg-accent-green/10 text-accent-green' },
  { value: 'minor_revision', label: 'Minor Revision',  desc: 'Small changes needed',                color: 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan' },
  { value: 'major_revision', label: 'Major Revision',  desc: 'Significant rework required',          color: 'border-accent-amber/50 bg-accent-amber/10 text-accent-amber' },
  { value: 'reject',         label: 'Reject',          desc: 'Does not meet publication standards',  color: 'border-red-500/50 bg-red-500/10 text-red-400' },
]

export default function ReviewPaper() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const [paper, setPaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    summary: '', strengths: '', weaknesses: '', comments: '', recommendation: '', rating: 0
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    papersAPI.getById(paperId)
      .then(res => setPaper(res.data.paper))
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [paperId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.recommendation) return toast.error('Please select a recommendation')
    if (!form.rating) return toast.error('Please provide a rating')
    setSubmitting(true)
    try {
      await reviewsAPI.submit({ paperId, ...form })
      toast.success('Review submitted! +25 points earned.')
      setSubmitted(true)
      setTimeout(() => navigate('/reviewer'), 2000)
    } catch (err) {
      toast.error(err.message)
    } finally { setSubmitting(false) }
  }

  if (loading) return <Layout title="Review Paper"><div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" /></div></Layout>

  if (submitted) return (
    <Layout title="Review Paper">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-accent-green" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-100 mb-2">Review Submitted!</h2>
        <p className="text-slate-400">Your review has been recorded on the blockchain.</p>
        <p className="text-accent-amber text-sm font-semibold mt-1">+25 points earned 🎉</p>
      </div>
    </Layout>
  )

  return (
    <Layout title="Review Paper">
      <div className="max-w-3xl mx-auto">
        {/* Paper summary */}
        {paper && (
          <div className="glass-card p-6 mb-6 border-accent-cyan/15">
            <div className="text-xs text-accent-cyan font-semibold mb-2 uppercase tracking-wide">Paper Under Review</div>
            <h2 className="font-display text-xl font-bold text-slate-100 mb-2">{paper.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{paper.abstract}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span>{paper.submittedBy?.name}</span>
              <span>•</span>
              <span>{paper.category}</span>
              <span>•</span>
              <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="mb-5">
          <h3 className="font-display text-xl font-bold text-slate-100">Submit Your Review</h3>
          <p className="text-slate-400 text-sm mt-0.5">Your review will be hashed and recorded on-chain</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div className="glass-card p-5">
            <label className="label text-base mb-3">Overall Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => set('rating', n)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${form.rating >= n ? 'bg-accent-amber text-dark-900' : 'bg-dark-600 text-slate-500 hover:bg-dark-500'}`}>
                  <Star className={`w-5 h-5 ${form.rating >= n ? 'fill-current' : ''}`} />
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-400">{form.rating}/5</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="glass-card p-5">
            <label className="label text-base mb-3">Recommendation *</label>
            <div className="grid grid-cols-2 gap-3">
              {RECOMMENDATIONS.map(({ value, label, desc, color }) => (
                <button key={value} type="button" onClick={() => set('recommendation', value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all
                    ${form.recommendation === value ? color : 'border-white/10 bg-dark-600/40 hover:border-white/20'}`}>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Review content */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="label">Summary *</label>
              <textarea className="input-field min-h-[100px] resize-y"
                placeholder="Provide a brief summary of the paper and your overall impression..."
                value={form.summary} onChange={e => set('summary', e.target.value)} required />
            </div>
            <div>
              <label className="label">Strengths *</label>
              <textarea className="input-field min-h-[80px] resize-y"
                placeholder="What does this paper do well? Key contributions, novel ideas..."
                value={form.strengths} onChange={e => set('strengths', e.target.value)} required />
            </div>
            <div>
              <label className="label">Weaknesses *</label>
              <textarea className="input-field min-h-[80px] resize-y"
                placeholder="Areas for improvement, gaps, concerns, limitations..."
                value={form.weaknesses} onChange={e => set('weaknesses', e.target.value)} required />
            </div>
            <div>
              <label className="label">Additional Comments</label>
              <textarea className="input-field min-h-[80px] resize-y"
                placeholder="Any other feedback for the authors (optional)..."
                value={form.comments} onChange={e => set('comments', e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
              : <><CheckCircle className="w-4 h-4" /> Submit Review (+25 points)</>}
          </button>
        </form>
      </div>
    </Layout>
  )
}
