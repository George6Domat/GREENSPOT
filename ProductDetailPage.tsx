
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useAppContext();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Produto não encontrado!</h2>
        <Link to="/products" className="mt-4 inline-block bg-brand-green text-white px-6 py-2 rounded-lg">
          Voltar aos Produtos
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity, notes);
      navigate('/products');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image.startsWith('data:') ? product.image : 'https://picsum.photos/seed/' + product.name.replace(' ','') + '/600/600'}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 mt-4 text-lg">{product.description}</p>
          <p className="text-3xl font-bold text-brand-green-dark my-6">
            R$ {product.price.toFixed(2).replace('.', ',')}
            <span className="text-base font-normal text-gray-500"> / {product.unit}</span>
          </p>

          <div className="space-y-4">
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade ({product.unit === 'kg' ? 'em kg, ex: 0.5' : 'em unidades'})
                </label>
                <input
                    type="number"
                    id="quantity"
                    min={product.unit === 'kg' ? 0.1 : 1}
                    step={product.unit === 'kg' ? 0.1 : 1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
                />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações (Ex: mais maduro, mais verde)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma preferência para este item?"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
              ></textarea>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
