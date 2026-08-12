import { supabase } from '../lib/supabase'
import { demoProducts } from '../data/demoProducts'

export async function getProducts({ search = '', category = 'all', sort = 'featured', minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER } = {}) {
  const query = search.trim().toLowerCase()

  if (!supabase) {
    let filtered = [...demoProducts]

    if (category !== 'all') {
      filtered = filtered.filter((product) => product.category === category)
    }

    filtered = filtered.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice,
    )

    if (query) {
      filtered = filtered.filter((product) =>
        [product.name, product.description, product.category].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else {
      filtered.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return filtered
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')

  if (error) {
    throw error
  }

  let filtered = data || []

  if (category !== 'all') {
    filtered = filtered.filter((product) => product.category_id === category)
  }

  if (query) {
    filtered = filtered.filter((product) =>
      [product.name, product.description, product.short_description].some((value) =>
        String(value || '').toLowerCase().includes(query),
      ),
    )
  }

  filtered = filtered.filter(
    (product) => Number(product.price) >= minPrice && Number(product.price) <= maxPrice,
  )

  if (sort === 'price_asc') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price))
  } else if (sort === 'rating') {
    filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
  }

  return filtered
}

export async function getProductCategories() {
  if (!supabase) {
    return ['Elektronik', 'Rumah Tangga', 'Komputer', 'Office']
  }

  const { data, error } = await supabase.from('categories').select('name').order('name')

  if (error) {
    throw error
  }

  return (data || []).map((item) => item.name)
}
