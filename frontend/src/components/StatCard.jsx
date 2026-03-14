export default function StatCard({ icon: Icon, label, value, color = 'cyan', trend }) {
  const colorMap = {
    cyan:   'from-accent-cyan/20 to-accent-cyan/5 border-accent-cyan/20 text-accent-cyan',
    green:  'from-accent-green/20 to-accent-green/5 border-accent-green/20 text-accent-green',
    purple: 'from-accent-purple/20 to-accent-purple/5 border-accent-purple/20 text-accent-purple',
    amber:  'from-accent-amber/20 to-accent-amber/5 border-accent-amber/20 text-accent-amber',
  }

  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br border ${colorMap[color]} flex items-center gap-4`}>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-slate-100">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
        {trend && <div className="text-xs text-accent-green mt-0.5">{trend}</div>}
      </div>
    </div>
  )
}
