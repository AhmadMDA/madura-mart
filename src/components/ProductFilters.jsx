export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          aria-label="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari produk..."
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
        />

        <select
          aria-label="Sort products"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Harga: Rendah ke Tinggi</option>
          <option value="price_desc">Harga: Tinggi ke Rendah</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              category === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                category === item
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span>Max harga</span>
          <input
            type="range"
            min="500000"
            max="20000000"
            step="500000"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="accent-emerald-600"
          />
          <span className="font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(maxPrice)}</span>
        </label>
      </div>
    </div>
  )
}
