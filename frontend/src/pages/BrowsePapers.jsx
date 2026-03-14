import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { papersAPI } from '../services/api'
import PaperCard from '../components/PaperCard'
import { Search, Filter, ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['All', 'Computer Science', 'Medicine', 'Physics', 'Biology', 'Chemistry', 'Mathematics', 'Engineering', 'Social Sciences', 'Other']

export default function BrowsePapers() {
  const { user } = useAuth()
  const [papers, setPapers] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchPapers = async () => {
    setLoading(true)
    try {
      const params = { status: 'published', page, limit: 9 }
      if (search) params.search = search
      if (category !== 'All') params.category = category
      const res = await papersAPI.getAll(params)
      setPapers(res.data.papers)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPapers() }, [page, category])
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchPapers() }, 400)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      {/* Nav */}
      <nav className="glass border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold text-xs font-display">BR</div>
          <span className="font-display font-semibold text-slate-100">BlockReview</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-secondary text-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent-cyan" />
            Browse Research
          </h1>
          <p className="text-slate-400">Explore {total} blockchain-verified academic papers</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="input-field pl-10 pr-10"
              placeholder="Search by title, author, or keywords…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              className="input-field pl-10 pr-4 w-full sm:w-auto appearance-none cursor-pointer"
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(1) }}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.slice(0, 6).map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1) }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${category === c ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'bg-dark-700 text-slate-400 border border-white/5 hover:border-white/15'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Papers grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="glass-card h-52 animate-pulse" />)}
          </div>
        ) : papers.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-slate-300 mb-2">No papers found</h3>
            <p className="text-slate-500">Try different keywords or remove filters</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {papers.map(p => <PaperCard key={p._id} paper={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary p-2 disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                        ${page === n ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'text-slate-400 hover:bg-white/5'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  className="btn-secondary p-2 disabled:opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
