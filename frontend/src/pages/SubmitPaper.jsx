import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { papersAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Upload, X, Plus, FileText, CheckCircle } from 'lucide-react'

const CATEGORIES = ['Computer Science', 'Medicine', 'Physics', 'Biology', 'Chemistry', 'Mathematics', 'Engineering', 'Social Sciences', 'Other']

export default function SubmitPaper() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', abstract: '', keywords: [], authors: [], category: 'Computer Science'
  })
  const [kwInput, setKwInput] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addKeyword = () => {
    const kw = kwInput.trim()
    if (kw && !form.keywords.includes(kw)) {
      set('keywords', [...form.keywords, kw])
      setKwInput('')
    }
  }

  const addAuthor = () => {
    const a = authorInput.trim()
    if (a && !form.authors.includes(a)) {
      set('authors', [...form.authors, a])
      setAuthorInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.abstract) return toast.error('Title and abstract required')

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('abstract', form.abstract)
    fd.append('keywords', JSON.stringify(form.keywords))
    fd.append('authors', JSON.stringify(form.authors))
    fd.append('category', form.category)
    if (file) fd.append('file', file)

    setLoading(true)
    try {
      await papersAPI.submit(fd)
      toast.success('Paper submitted successfully! +10 points earned.')
      setSubmitted(true)
      setTimeout(() => navigate('/publisher'), 2000)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <Layout title="Submit Paper">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-accent-green" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-100 mb-2">Paper Submitted!</h2>
        <p className="text-slate-400 mb-1">Your paper has been submitted for peer review.</p>
        <p className="text-accent-amber text-sm font-semibold">+10 points earned 🎉</p>
        <p className="text-slate-500 text-sm mt-4">Redirecting to dashboard…</p>
      </div>
    </Layout>
  )

  return (
    <Layout title="Submit Paper">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-100">Submit Research Paper</h2>
          <p className="text-slate-400 text-sm mt-1">Your paper will be hashed and recorded on the blockchain</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-display font-semibold text-slate-200 border-b border-white/5 pb-3">Paper Details</h3>
            <div>
              <label className="label">Paper Title *</label>
              <input className="input-field" placeholder="Enter the full title of your research paper"
                value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div>
              <label className="label">Abstract *</label>
              <textarea className="input-field min-h-[140px] resize-y" placeholder="Provide a comprehensive abstract (200-500 words recommended)..."
                value={form.abstract} onChange={e => set('abstract', e.target.value)} required />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Authors */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-slate-200 border-b border-white/5 pb-3">Authors</h3>
            <div className="flex gap-2">
              <input className="input-field flex-1" placeholder="Add author name"
                value={authorInput} onChange={e => setAuthorInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAuthor())} />
              <button type="button" onClick={addAuthor} className="btn-secondary px-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.authors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.authors.map((a, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-sm text-accent-cyan">
                    {a}
                    <button type="button" onClick={() => set('authors', form.authors.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-slate-200 border-b border-white/5 pb-3">Keywords</h3>
            <div className="flex gap-2">
              <input className="input-field flex-1" placeholder="Add keyword (press Enter)"
                value={kwInput} onChange={e => setKwInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())} />
              <button type="button" onClick={addKeyword} className="btn-secondary px-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.keywords.map((k, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                    {k}
                    <button type="button" onClick={() => set('keywords', form.keywords.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-slate-200 border-b border-white/5 pb-3 mb-4">Upload Paper (Optional)</h3>
            {file ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
                <FileText className="w-8 h-8 text-accent-cyan" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200 truncate">{file.name}</div>
                  <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="text-slate-500 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 p-10 rounded-xl border-2 border-dashed border-white/10 hover:border-accent-cyan/30 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-slate-600" />
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-300">Click to upload PDF</div>
                  <div className="text-xs text-slate-500 mt-1">PDF up to 20MB • Stored on IPFS</div>
                </div>
                <input type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
            )}
          </div>

          {/* Blockchain info */}
          <div className="glass-card p-4 flex items-start gap-3 border-accent-cyan/10">
            <div className="w-2 h-2 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0 animate-pulse" />
            <div className="text-sm text-slate-400">
              Upon submission, a <span className="text-accent-cyan font-medium">SHA-256 hash</span> of your paper metadata will be recorded on Ethereum. This creates an immutable timestamp proving your authorship.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                : <><FileText className="w-4 h-4" /> Submit Paper (+10 points)</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
