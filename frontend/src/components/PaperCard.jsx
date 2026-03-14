import { Link } from 'react-router-dom'
import { Eye, Download, Star, Calendar, User, Tag } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function PaperCard({ paper, showStatus = false }) {
  const date = new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link to={`/papers/${paper._id}`} className="glass-card p-5 flex flex-col gap-3 hover:border-accent-cyan/20 transition-all duration-200 group block">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-slate-100 group-hover:text-accent-cyan transition-colors line-clamp-2 leading-snug">
            {paper.title}
          </h3>
        </div>
        {showStatus && <StatusBadge status={paper.status} />}
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{paper.abstract}</p>

      {paper.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {paper.keywords.slice(0, 4).map((k, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-xs text-slate-400 border border-white/5">
              <Tag className="w-2.5 h-2.5" />{k}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-white/5 flex-wrap">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />{paper.authors?.[0] || paper.submittedBy?.name}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />{date}
        </span>
        {paper.readCount > 0 && (
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />{paper.readCount}
          </span>
        )}
        {paper.downloadCount > 0 && (
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />{paper.downloadCount}
          </span>
        )}
        {paper.averageRating > 0 && (
          <span className="flex items-center gap-1 text-accent-amber">
            <Star className="w-3 h-3 fill-current" />{paper.averageRating.toFixed(1)}
          </span>
        )}
        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400">
          {paper.category}
        </span>
      </div>
    </Link>
  )
}
