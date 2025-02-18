import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import DeliveryForm from './DeliveryForm';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  deliveryType: 'retirada' | 'entrega';
  setDeliveryType: (type: 'retirada' | 'entrega') => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  deliveryType,
  setDeliveryType,
}) => {
  const deliveryFee = deliveryType === 'entrega' ? 8 : 0;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleFinalize = () => {
    if (items.length === 0) {
      alert('Adicione itens ao pedido antes de finalizar.');
      return;
    }

    let message = `Pedido:\n\n`;
    items.forEach(item => {
      message += `${item.name} x${item.quantity}: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.extras && item.extras.length > 0) {
        message += `  Acompanhamentos: ${item.extras.join(', ')}\n`;
      }
    });
    
    if (deliveryFee > 0) {
      message += `\nTaxa de entrega: R$ ${deliveryFee.toFixed(2)}`;
    }
    
    message += `\nTotal: R$ ${total.toFixed(2)}`;
    
    window.open(`https://wa.me/5511987654321?text=${encodeURIComponent(message)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="text-orange-500" />
            Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Cart Items */}
          <div className="p-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">
                Seu carrinho está vazio
              </p>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                      {item.extras && item.extras.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Acompanhamentos: {item.extras.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Type and Form */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="block font-semibold">Tipo de pedido:</label>
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value as 'retirada' | 'entrega')}
                className="w-full p-2 border rounded"
              >
                <option value="retirada">Retirada no Local</option>
                <option value="entrega">Entrega (+R$ 8,00)</option>
              </select>
            </div>

            {deliveryType === 'entrega' && <DeliveryForm />}
          </div>
        </div>

        {/* Footer with Total and Checkout Button - Fixed at bottom */}
        <div className="border-t p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Taxa de entrega:</span>
              <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold text-lg mb-4">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleFinalize}
            disabled={items.length === 0}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;