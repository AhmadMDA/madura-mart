const orders = [
  {
    id: 'ORD-1001',
    status: 'Processing',
    total: 5890000,
    createdAt: '2026-08-12',
  },
  {
    id: 'ORD-1002',
    status: 'Shipped',
    total: 1499000,
    createdAt: '2026-08-09',
  },
]

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-black text-slate-900">Riwayat Pesanan</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-600">{order.id}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.total)}
              </p>
            </div>
            <div className="text-sm text-slate-600">
              <p>{order.createdAt}</p>
              <p className="mt-1 font-semibold text-slate-900">Status: {order.status}</p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Lihat detail
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
