import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { StoreProvider } from './context/StoreContext'
import AdminPage from './pages/AdminPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProductCatalog from './pages/ProductCatalog'
import ReviewsPage from './pages/ReviewsPage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StoreProvider>
  )
}

export default App
