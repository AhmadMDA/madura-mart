import { demoProducts } from '../../src/data/demoProducts.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { message = '' } = JSON.parse(request.body || '{}')
    const normalized = String(message).toLowerCase().trim()

    const relevant = demoProducts.filter((product) => {
      const text = `${product.name} ${product.description} ${product.category}`.toLowerCase()
      return text.includes(normalized) || normalized.includes(product.category.toLowerCase()) || !normalized
    })

    const fallbackProducts = relevant.length > 0 ? relevant.slice(0, 3) : demoProducts.slice(0, 3)

    const result = `Saya merekomendasikan produk berikut berdasarkan katalog yang tersedia: ${fallbackProducts
      .map((product) => `${product.name} (Rp ${new Intl.NumberFormat('id-ID').format(product.price)})`)
      .join(', ')}. Produk-produk ini sesuai dengan permintaan Anda dan hanya menggunakan item yang ada di database.`

    response.status(200).json({
      ok: true,
      answer: result,
      products: fallbackProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      })),
    })
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: error.message || 'AI helper unavailable',
    })
  }
}
