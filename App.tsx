
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Toaster position="bottom-center" reverseOrder={false} />
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
