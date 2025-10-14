
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="relative h-56">
          <img
            src={product.image.startsWith('data:') ? product.image : 'https://picsum.photos/seed/' + product.name.replace(' ','') + '/400/400' }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-xl font-bold text-brand-green mt-2">
            R$ {product.price.toFixed(2).replace('.', ',')}
            <span className="text-sm font-normal text-gray-500"> / {product.unit}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
