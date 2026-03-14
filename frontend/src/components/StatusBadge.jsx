export default function StatusBadge({ status }) {
  const map = {
    submitted:       { cls: 'badge-submitted',  label: 'Submitted' },
    under_review:    { cls: 'badge-review',      label: 'Under Review' },
    revision_required: { cls: 'badge-revision', label: 'Revision Required' },
    published:       { cls: 'badge-published',   label: 'Published' },
    rejected:        { cls: 'badge-rejected',    label: 'Rejected' },
  }
  const { cls, label } = map[status] || { cls: 'badge-submitted', label: status }
  return <span className={cls}>{label}</span>
}
