import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, BookOpen, Star, Users, FileCheck } from 'lucide-react'

export default function Landing() {
  const features = [
    { icon: Shield, title: 'Blockchain Verified', desc: 'Every paper and review is cryptographically hashed and stored on Ethereum, ensuring immutable proof of authorship.', color: 'text-accent-cyan' },
    { icon: Zap, title: 'Incentivized Reviews', desc: 'Reviewers earn points for quality feedback. Publishers earn rewards for published research. Aligned incentives.', color: 'text-accent-amber' },
    { icon: Globe, title: 'IPFS Storage', desc: 'Full papers stored on IPFS — decentralized, censorship-resistant, and permanently accessible.', color: 'text-accent-green' },
    { icon: Users, title: 'Expert Peer Review', desc: 'Papers are matched with domain experts. Transparent review process with on-chain accountability.', color: 'text-accent-purple' },
  ]

  const stats = [
    { value: '2,400+', label: 'Papers Published' },
    { value: '840+',   label: 'Verified Reviewers' },
    { value: '98%',    label: 'Uptime' },
    { value: '15min',  label: 'Avg Review Time' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 bg-grid overflow-hidden">
      {/* Orb decorations */}
      <div className="fixed top-0 left-1/4 w-96 h-96 orb bg-brand-500/10 -translate-y-1/2" />
      <div className="fixed top-1/3 right-0 w-80 h-80 orb bg-accent-cyan/8 translate-x-1/2" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 font-bold text-sm font-display">BR</div>
          <span className="font-display font-bold text-slate-100 text-lg">BlockReview</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/browse" className="btn-ghost text-sm">Browse Papers</Link>
          <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          Decentralized Academic Publishing on Ethereum
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-slate-100 mb-6">
          Research You Can
          <br />
          <span className="bg-gradient-to-r from-accent-cyan via-brand-400 to-accent-green bg-clip-text text-transparent">
            Trust On-Chain
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          BlockReview combines blockchain immutability with expert peer review to create
          a transparent, incentivized academic publishing ecosystem.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
            Start Publishing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/browse" className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
            <BookOpen className="w-4 h-4" /> Browse Research
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className="text-3xl font-display font-bold glow-text">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-100 mb-3">
            Why BlockReview?
          </h2>
          <p className="text-slate-400">Built for the next generation of academic publishing</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="glass-card p-6 flex flex-col gap-3 hover:border-white/15 transition-colors">
              <Icon className={`w-8 h-8 ${color}`} />
              <h3 className="font-display font-semibold text-slate-100">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-24">
        <h2 className="font-display text-3xl font-bold text-slate-100 text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: FileCheck, title: 'Submit Research', desc: 'Authors upload papers. Metadata hash is recorded on Ethereum. Full paper stored on IPFS.' },
            { step: '02', icon: Star, title: 'Expert Review', desc: 'Domain expert reviewers are assigned. Reviews submitted and hashed on-chain. Points rewarded.' },
            { step: '03', icon: Globe, title: 'Publish Globally', desc: 'Approved papers published immutably. Permanently accessible and verifiable by anyone.' },
          ].map(({ step, icon: Icon, title, desc }, i) => (
            <div key={i} className="glass-card p-6 flex flex-col gap-4 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-dark-900 text-xs font-bold font-mono">
                {step}
              </div>
              <Icon className="w-7 h-7 text-accent-cyan mt-2" />
              <h3 className="font-display font-semibold text-slate-100">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-8 pb-24 text-center">
        <div className="glass-card p-12 border-accent-cyan/15">
          <h2 className="font-display text-3xl font-bold text-slate-100 mb-4">
            Ready to Publish on the Blockchain?
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of researchers building the future of academic publishing.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-3">
            Create Your Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>© 2024 BlockReview. Decentralized Academic Publishing Platform.</p>
      </footer>
    </div>
  )
}
