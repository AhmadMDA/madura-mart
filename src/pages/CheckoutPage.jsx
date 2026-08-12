import { useStore } from '../context/StoreContext'

export default function CheckoutPage() {
  const { cartProducts, cartTotal, voucherDiscount, checkout } = useStore()
  const summary = checkout()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">Checkout</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Nama penerima</label>
              <input className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="Contoh: Ahmad" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Alamat pengiriman</label>
              <textarea className="mt-2 min-h-[110px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="Jl. Raya ..." />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Metode pembayaran</label>
              <select className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500">
                <option>Midtrans</option>
                <option>Bank Transfer</option>
                <option>E-Wallet</option>
              </select>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            {cartProducts.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <span>{item.name} x {item.quantity}</span>
                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon</span>
              <span>-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(voucherDiscount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.total)}</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Bayar Sekarang
          </button>
        </aside>
      </div>
    </div>
  )
}
