import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function CartPage() {
  const { cartProducts, updateCartQuantity, voucherDiscount, cartTotal, voucher, setVoucher } = useStore()

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Keranjang masih kosong</h2>
          <p className="mt-2 text-slate-600">Tambahkan produk untuk mulai checkout.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-4">
          {cartProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />

              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-500">{product.category}</p>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, product.quantity - 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                  aria-label={`Kurangi ${product.name}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-slate-900">{product.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, product.quantity + 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                  aria-label={`Tambah ${product.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Ringkasan</h3>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon</span>
              <span>-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(voucherDiscount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.max(cartTotal - voucherDiscount, 0))}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">Voucher</label>
            <input
              value={voucher}
              onChange={(event) => setVoucher(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Masukkan kode voucher"
            />
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Lanjut ke Checkout
          </button>
        </aside>
      </div>
    </div>
  )
}
