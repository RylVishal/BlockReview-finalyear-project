import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { papersAPI, reviewsAPI } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import BlockchainBadge from '../components/BlockchainBadge'
import { useAuth } from '../context/AuthContext'
import { Eye, Download, Star, Calendar, User, Tag, ArrowLeft, FileText, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaperDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [paper, setPaper] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([papersAPI.getById(id), reviewsAPI.getByPaper(id)])
      .then(([pr, rr]) => {
        setPaper(pr.data.paper)
        setReviews(rr.data.reviews)
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = async () => {
    try {
      await papersAPI.download(id)
      if (paper.fileUrl) {
        window.open(paper.fileUrl, '_blank')
      } else {
        toast('No file attached. Hash: ' + paper.paperHash, { icon: 'ℹ️' })
      }
    } catch (e) { toast.error(e.message) }
  }

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!paper) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400">Paper not found.</p>
        <Link to="/browse" className="btn-primary mt-4 inline-block">Back to Browse</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <nav className="glass border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold text-xs font-display">BR</div>
          <span className="font-display font-semibold text-slate-100">BlockReview</span>
        </Link>
        {user && <Link to="/dashboard" className="btn-secondary text-sm">Dashboard</Link>}
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>

        {/* Paper header */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <StatusBadge status={paper.status} />
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400">{paper.category}</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-slate-100 mb-4 leading-snug">{paper.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-5">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{paper.authors?.join(', ') || paper.submittedBy?.name}</span>
            {paper.submittedBy?.institution && <span className="text-slate-500">• {paper.submittedBy.institution}</span>}
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(paper.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {paper.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {paper.keywords.map((k, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-400 border border-white/5">
                  <Tag className="w-3 h-3" />{k}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-slate-400"><Eye className="w-4 h-4" />{paper.readCount} reads</div>
            <div className="flex items-center gap-1.5 text-sm text-slate-400"><Download className="w-4 h-4" />{paper.downloadCount} downloads</div>
            {paper.averageRating > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-accent-amber">
                <Star className="w-4 h-4 fill-current" />{paper.averageRating.toFixed(1)} ({paper.reviewCount} reviews)
              </div>
            )}
          </div>

          {/* Blockchain hashes */}
          <div className="flex flex-wrap gap-3 mb-6">
            <BlockchainBadge hash={paper.paperHash} label="Paper Hash" short />
            <BlockchainBadge hash={paper.metadataHash} label="Metadata Hash" short />
          </div>

          <div className="flex gap-3 flex-wrap">
            {paper.status === 'published' && (
              <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Paper
              </button>
            )}
            {user?.role === 'reviewer' && paper.status === 'under_review' &&
             paper.assignedReviewers?.some(r => (r._id || r) === user._id) && (
              <Link to={`/review/${paper._id}`} className="btn-secondary flex items-center gap-2">
                <Star className="w-4 h-4" /> Write Review
              </Link>
            )}
          </div>
        </div>

        {/* Abstract */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-cyan" /> Abstract
          </h2>
          <p className="text-slate-300 leading-relaxed">{paper.abstract}</p>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent-purple" /> Peer Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="glass-card p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-semibold text-slate-200">{review.reviewer?.name}</div>
                      <div className="text-xs text-slate-500">{review.reviewer?.institution}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-accent-amber">
                        {[1,2,3,4,5].map(n => (
                          <Star key={n} className={`w-4 h-4 ${review.rating >= n ? 'fill-current' : 'opacity-30'}`} />
                        ))}
                        <span className="text-sm ml-1">{review.rating}/5</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium
                        ${review.recommendation === 'accept' ? 'bg-accent-green/10 text-accent-green' :
                          review.recommendation === 'reject' ? 'bg-red-500/10 text-red-400' :
                          'bg-accent-amber/10 text-accent-amber'}`}>
                        {review.recommendation?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-slate-400 font-medium">Summary: </span><span className="text-slate-300">{review.summary}</span></div>
                    <div><span className="text-slate-400 font-medium">Strengths: </span><span className="text-slate-300">{review.strengths}</span></div>
                    <div><span className="text-slate-400 font-medium">Weaknesses: </span><span className="text-slate-300">{review.weaknesses}</span></div>
                    {review.comments && <div><span className="text-slate-400 font-medium">Comments: </span><span className="text-slate-300">{review.comments}</span></div>}
                  </div>
                  <BlockchainBadge hash={review.reviewHash} label="Review Hash" short />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
