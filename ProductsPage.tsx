
import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const { products } = useAppContext();

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-4 border-brand-green pb-2">Nossos Produtos</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
