import { Link2, ExternalLink } from 'lucide-react'

export default function BlockchainBadge({ hash, label = 'On-Chain', short = false }) {
  const display = short && hash ? hash.slice(0, 8) + '...' + hash.slice(-6) : hash

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20">
      <Link2 className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xs font-mono text-accent-cyan">{display || 'Not recorded'}</div>
      </div>
    </div>
  )
}
