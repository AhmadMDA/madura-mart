export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover"
        />
        {product.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            Featured
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            {product.category}
          </span>
          <span className="text-sm font-medium text-amber-500">★ {product.rating}</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-black text-slate-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
            {product.compareAtPrice ? (
              <p className="text-sm text-slate-400 line-through">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {product.stock > 0 ? `${product.stock} stok` : 'Stok habis'}
          </span>
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Lihat produk
        </button>
      </div>
    </article>
  )
}
