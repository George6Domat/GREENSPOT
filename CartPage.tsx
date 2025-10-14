
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { OrderDetails } from '../types';

function CartPage() {
  const { cart, removeFromCart, updateCartItem, clearCart } = useAppContext();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
      name: '',
      address: '',
      phone: '',
      paymentMethod: 'pix',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number, notes: string) => {
    if (newQuantity >= 0) {
      updateCartItem(id, newQuantity, notes);
    }
  };

  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderDetails.name || !orderDetails.address) {
        toast.error('Por favor, preencha seu nome e endereço.');
        return;
    }

    let message = `Olá Green Spot! Gostaria de fazer um pedido:\n\n`;
    message += `*Itens do Pedido:*\n`;
    cart.forEach(item => {
        message += ` - ${item.quantity}${item.unit === 'kg' ? 'kg' : 'x'} ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})\n`;
        if (item.notes) {
            message += `   _Obs: ${item.notes}_\n`;
        }
    });
    message += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    message += `*Dados para Entrega:*\n`;
    message += `Nome: ${orderDetails.name}\n`;
    message += `Endereço: ${orderDetails.address}\n`;
    if(orderDetails.phone) message += `Telefone: ${orderDetails.phone}\n`;
    message += `Pagamento: ${orderDetails.paymentMethod === 'pix' ? 'PIX' : orderDetails.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}\n\n`;
    message += `Aguardando confirmação. Obrigado!`;

    const phoneNumber = '41999561651';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    toast.success('Pedido enviado! Você será redirecionado para o WhatsApp.');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio!</h2>
        <p className="text-gray-500 mt-2">Que tal adicionar alguns produtos frescos?</p>
        <Link to="/products" className="mt-6 inline-block bg-brand-green text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-green-dark transition-transform transform hover:scale-105">
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Seu Carrinho</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {cart.map(item => (
              <li key={item.id} className="py-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <img src={item.image.startsWith('data:') ? item.image : 'https://picsum.photos/seed/' + item.name.replace(' ','') + '/100/100'} alt={item.name} className="w-24 h-24 rounded-md object-cover"/>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">R$ {item.price.toFixed(2)} / {item.unit}</p>
                   {item.notes && <p className="text-sm text-gray-500 italic">Obs: {item.notes}</p>}
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.id, parseFloat(e.target.value), item.notes)}
                    min={item.unit === 'kg' ? 0.1 : 1}
                    step={item.unit === 'kg' ? 0.1 : 1}
                    className="w-20 p-1 border rounded-md text-center"
                  />
                  <p className="font-bold w-24 text-right">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">&times;</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold border-b pb-4">Resumo do Pedido</h2>
          <div className="flex justify-between font-bold text-xl my-4">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <form onSubmit={handleFinalizeOrder}>
            <h3 className="text-xl font-semibold mb-3">Detalhes da Entrega</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Seu nome completo" value={orderDetails.name} onChange={e => setOrderDetails({...orderDetails, name: e.target.value})} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Endereço de entrega" value={orderDetails.address} onChange={e => setOrderDetails({...orderDetails, address: e.target.value})} className="w-full p-2 border rounded" required />
                <input type="tel" placeholder="Telefone (Opcional)" value={orderDetails.phone} onChange={e => setOrderDetails({...orderDetails, phone: e.target.value})} className="w-full p-2 border rounded" />
                <select value={orderDetails.paymentMethod} onChange={e => setOrderDetails({...orderDetails, paymentMethod: e.target.value as OrderDetails['paymentMethod']})} className="w-full p-2 border rounded bg-white">
                    <option value="pix">PIX</option>
                    <option value="card">Cartão na Entrega</option>
                    <option value="cash">Dinheiro</option>
                </select>
            </div>
            <button type="submit" className="mt-6 w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-lg text-lg transition duration-300">
              Finalizar Pedido via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
