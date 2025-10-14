
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AdminLogin from '../components/AdminLogin';
import AdminProductForm from '../components/AdminProductForm';
import { Product } from '../types';

function AdminPage() {
  const { isAdminAuthenticated, products, deleteProduct, logout } = useAppContext();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
      setIsFormVisible(false);
      setEditingProduct(null);
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Sair
        </button>
      </div>

      {isFormVisible ? (
        <AdminProductForm productToEdit={editingProduct} onFormClose={handleFormClose} />
      ) : (
        <div>
            <div className="text-right mb-6">
                <button
                    onClick={handleAddNew}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                    Adicionar Novo Produto
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Produtos Existentes</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Imagem</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preço</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <img src={product.image.startsWith('data:') ? product.image : 'https://picsum.photos/seed/' + product.name.replace(' ','') + '/50/50'} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                                </td>
                                <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                                <td className="py-3 px-4 text-gray-600">R$ {product.price.toFixed(2)} / {product.unit}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 font-medium">Editar</button>
                                        <button onClick={() => {if(window.confirm(`Tem certeza que deseja excluir ${product.name}?`)) deleteProduct(product.id)}} className="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
