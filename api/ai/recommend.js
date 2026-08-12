import { demoProducts } from '../../src/data/demoProducts.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const recommended = [...demoProducts]
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 3)
      .map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
      }))

    response.status(200).json({
      ok: true,
      recommendations: recommended,
      source: 'database-backed demo catalog',
      message: 'Rekomendasi dibuat berdasarkan produk yang tersedia di katalog.',
    })
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: error.message || 'Recommendation unavailable',
    })
  }
}
