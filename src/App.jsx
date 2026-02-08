import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import OrdersPage from './pages/admin/OrdersPage';
import CustomersPage from './pages/admin/CustomersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <ProductProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={
            <>
              <Navbar />
              <HomePage />
            </>
          } />
          <Route path="/products" element={
            <>
              <Navbar />
              <ProductsPage />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <ProductDetailPage />
            </>
          } />
          <Route path="/new" element={
            <>
              <Navbar />
              <ProductsPage />
            </>
          } />
          <Route path="/women" element={
            <>
              <Navbar />
              <ProductsPage />
            </>
          } />
          <Route path="/men" element={
            <>
              <Navbar />
              <ProductsPage />
            </>
          } />
          <Route path="/sale" element={
            <>
              <Navbar />
              <ProductsPage />
            </>
          } />

          {/* Admin Routes without Navbar */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/orders" element={<OrdersPage />} />
          <Route path="/admin/dashboard/customers" element={<CustomersPage />} />
          <Route path="/admin/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/dashboard/settings" element={<AdminSettingsPage />} />
        </Routes>
      </Router>
    </ProductProvider>
  );
}

export default App;
