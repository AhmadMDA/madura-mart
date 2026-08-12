const metrics = [
  { label: 'Penjualan', value: 'Rp 42.5 Juta' },
  { label: 'Order', value: '1,280' },
  { label: 'Konsumen Baru', value: '214' },
  { label: 'Refund', value: '3%' },
]

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-black text-slate-900">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-black text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Produk unggulan</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex justify-between"><span>Madura Smart TV 43 inch</span><span className="font-semibold text-slate-900">186 sold</span></li>
            <li className="flex justify-between"><span>Madura Laptop Pro 14</span><span className="font-semibold text-slate-900">142 sold</span></li>
            <li className="flex justify-between"><span>Madura Air Fryer Pro</span><span className="font-semibold text-slate-900">128 sold</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Monitoring</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Order hari ini: 48</li>
            <li>Pengiriman tertunda: 7</li>
            <li>Review baru: 14</li>
            <li>Voucher aktif: 9</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
