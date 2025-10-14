
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

interface AdminProductFormProps {
  productToEdit: Product | null;
  onFormClose: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ productToEdit, onFormClose }) => {
  const { addProduct, updateProduct } = useAppContext();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'kg' as 'kg' | 'unidade',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      if (productToEdit.image) {
        setImagePreview(productToEdit.image.startsWith('data:') ? productToEdit.image : null);
      }
    } else {
        setProduct({ name: '', description: '', price: 0, unit: 'kg', image: '' });
        setImagePreview(null);
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProduct(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productToEdit) {
      updateProduct({ ...product, id: productToEdit.id });
    } else {
      addProduct(product);
    }
    onFormClose();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        {productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea name="description" id="description" value={product.description} onChange={handleChange} required rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade</label>
                <select name="unit" id="unit" value={product.unit} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                    <option value="kg">Por Kilo (kg)</option>
                    <option value="unidade">Por Unidade</option>
                </select>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
          <div className="mt-1 flex items-center space-x-4">
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-md object-cover" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-green-light file:text-white hover:file:bg-brand-green" />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onFormClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300">
            Cancelar
          </button>
          <button type="submit" className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300">
            Salvar Produto
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
