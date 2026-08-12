export default function AuthStatusCard({ title, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <h2 className="mt-3 text-xl font-bold text-slate-900">{value}</h2>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </div>
  )
}
