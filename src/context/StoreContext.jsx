import { createContext, useContext, useMemo, useState } from 'react'
import { demoProducts } from '../data/demoProducts'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([
    { id: 'p-1001', quantity: 1 },
    { id: 'p-1002', quantity: 2 },
  ])
  const [voucher, setVoucher] = useState('WELCOME10')

  const wishlistProducts = useMemo(
    () => demoProducts.filter((product) => wishlist.includes(product.id)),
    [wishlist],
  )

  const cartProducts = useMemo(
    () =>
      cart
        .map((item) => {
          const product = demoProducts.find((entry) => entry.id === item.id)
          return product ? { ...product, quantity: item.quantity } : null
        })
        .filter(Boolean),
    [cart],
  )

  const cartTotal = useMemo(
    () =>
      cartProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0,
      ),
    [cartProducts],
  )

  const voucherDiscount = useMemo(() => {
    if (voucher === 'WELCOME10') {
      return cartTotal * 0.1
    }

    return 0
  }, [cartTotal, voucher])

  const addToWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId) ? current : [...current, productId],
    )
  }

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((id) => id !== productId))
  }

  const addToCart = (productId) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === productId)

      if (existing) {
        return current.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...current, { id: productId, quantity: 1 }]
    })
  }

  const updateCartQuantity = (productId, nextQuantity) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, nextQuantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const clearCart = () => setCart([])

  const checkout = () => {
    const value = {
      items: cartProducts,
      subtotal: cartTotal,
      discount: voucherDiscount,
      total: Math.max(cartTotal - voucherDiscount, 0),
      voucher,
    }

    return value
  }

  const value = {
    wishlist,
    wishlistProducts,
    cart,
    cartProducts,
    cartTotal,
    voucher,
    voucherDiscount,
    setVoucher,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    updateCartQuantity,
    clearCart,
    checkout,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }

  return context
}
