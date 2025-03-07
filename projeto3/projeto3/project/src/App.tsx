import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Phone, MessageSquare, Clock, Instagram, Facebook } from 'lucide-react';
import Cart from './components/Cart';
import DeliveryForm from './components/DeliveryForm';
import ScheduleModal from './components/ScheduleModal';
import MonteOSeu from './assets/monte.jpg';
import Combo from './assets/combo.jpg';


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
  addons?: {
    name: string;
    price: number;
  }[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  customizable?: boolean;
  options?: {
    sizes?: { size: string; price: number }[];
    toppings?: { name: string; price: number }[];
  };
  addons?: {
    name: string;
    price: number;
  }[];
}

interface SelectedAddonsMap {
  [key: string]: string[];
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'retirada' | 'entrega'>('retirada');
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('artesanais');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddonsMap>({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    const checkStoreHours = () => {
      const now = new Date();
      const hours = now.getHours();
      setIsStoreOpen(hours >= 19 && hours < 23);
    };

    checkStoreHours();
    const interval = setInterval(checkStoreHours, 60000);

    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: MenuItem) => {
    if (!isStoreOpen) {
      setIsScheduleModalOpen(true);
      return;
    }

    if (item.customizable && item.category === 'acai-custom') {
      if (!selectedSize) {
        alert('Por favor, selecione um tamanho para o açaí.');
        return;
      }

      const size = item.options?.sizes?.find(s => s.size === selectedSize);
      if (!size) return;

      const toppingsTotal = selectedToppings.reduce((total, topping) => {
        const toppingPrice = item.options?.toppings?.find(t => t.name === topping)?.price || 0;
        return total + toppingPrice;
      }, 0);

      const customItem: CartItem = {
        id: `${item.id}-${selectedSize}-${Date.now()}`,
        name: `${item.name} ${selectedSize}`,
        price: size.price + toppingsTotal,
        quantity: 1,
        extras: selectedToppings
      };

      setCartItems(prev => [...prev, customItem]);
      setSelectedSize('');
      setSelectedToppings([]);
    } else {
      const itemAddons = selectedAddons[item.id] || [];
      const selectedAddonItems = item.addons?.filter(addon => 
        itemAddons.includes(addon.name)
      ) || [];

      const addonsTotal = selectedAddonItems.reduce((total, addon) => 
        total + addon.price, 0
      );

      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        price: item.price + addonsTotal,
        quantity: 1,
        addons: selectedAddonItems
      };

      setCartItems(prev => [...prev, cartItem]);
      // Clear only the add-ons for this specific item
      setSelectedAddons(prev => ({
        ...prev,
        [item.id]: []
      }));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleToppingToggle = (topping: string) => {
    setSelectedToppings(prev => 
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  const handleAddonToggle = (itemId: string, addon: string) => {
    setSelectedAddons(prev => {
      const currentAddons = prev[itemId] || [];
      const newAddons = currentAddons.includes(addon)
        ? currentAddons.filter(a => a !== addon)
        : [...currentAddons, addon];
      
      return {
        ...prev,
        [itemId]: newAddons
      };
    });
  };

  const burgerAddons = [
    { name: 'Bacon', price: 4 },
    { name: 'Hambúrguer Extra', price: 8 },
    { name: 'Queijo Extra', price: 3 },
    { name: 'Alface', price: 1 },
    { name: 'Tomate', price: 1 },
    { name: 'Molho Caseiro', price: 2 },
    { name: 'Cebola Caramelizada', price: 3 },
    { name: 'Ovo', price: 2 }
  ];

  const hotdogAddons = [
    { name: 'Salsicha Extra', price: 4 },
    { name: 'Bacon', price: 4 },
    { name: 'Queijo Extra', price: 3 },
    { name: 'Batata Palha Extra', price: 2 },
    { name: 'Molho Caseiro', price: 2 }
  ];

  const mistoAddons = [
    { name: 'Queijo Extra', price: 3 },
    { name: 'Presunto Extra', price: 3 },
    { name: 'Tomate', price: 1 },
    { name: 'Orégano', price: 0.5 }
  ];

  const calabresaAddons = [
    { name: 'Calabresa Extra', price: 6 },
    { name: 'Queijo Extra', price: 3 },
    { name: 'Cebola', price: 1 },
    { name: 'Vinagrete Extra', price: 2 },
    { name: 'Molho Caseiro', price: 2 }
  ];

  const frangoAddons = [
    { name: 'Frango Extra', price: 7 },
    { name: 'Queijo Extra', price: 3 },
    { name: 'Bacon', price: 4 },
    { name: 'Alface', price: 1 },
    { name: 'Tomate', price: 1 },
    { name: 'Molho Caseiro', price: 2 }
  ];

  const contrafileAddons = [
    { name: 'Contra Filé Extra', price: 10 },
    { name: 'Queijo Extra', price: 3 },
    { name: 'Bacon', price: 4 },
    { name: 'Cebola Caramelizada', price: 3 },
    { name: 'Molho Caseiro', price: 2 }
  ];

  const bauruAddons = [
    { name: 'Rosbife Extra', price: 8 },
    { name: 'Queijo Extra', price: 3 },
    { name: 'Tomate', price: 1 },
    { name: 'Molho Caseiro', price: 2 }
  ];

  const menuItems: MenuItem[] = [
    {
      id: 'acai1',
      name: 'Açaí Tradicional',
      description: 'Açaí 500ml com banana, granola e leite condensado',
      price: 18,
      image: Combo,
      category: 'acai-combos'
    },
    {
      id: 'acai2',
      name: 'Açaí Power',
      description: 'Açaí 500ml com morango, banana, granola, leite em pó e leite condensado',
      price: 22,
      image: Combo,
      category: 'acai-combos'
    },
    {
      id: 'acai3',
      name: 'Açaí Nutella',
      description: 'Açaí 500ml com nutella, morango, granola e leite condensado',
      price: 25,
      image: Combo,
      category: 'acai-combos'
    },
    {
      id: 'acai-custom',
      name: 'Monte Seu Açaí',
      description: 'Escolha o tamanho e os acompanhamentos do seu açaí',
      price: 0,
      image: MonteOSeu,
      category: 'acai-custom',
      customizable: true,
      options: {
        sizes: [
          { size: '300ml', price: 14 },
          { size: '500ml', price: 18 },
          { size: '700ml', price: 22 }
        ],
        toppings: [
          { name: 'Granola', price: 2 },
          { name: 'Banana', price: 2 },
          { name: 'Morango', price: 3 },
          { name: 'Leite em Pó', price: 2 },
          { name: 'Leite Condensado', price: 2 },
          { name: 'Nutella', price: 4 },
          { name: 'Paçoca', price: 2 },
          { name: 'Kiwi', price: 3 },
          { name: 'M&Ms', price: 3 },
          { name: 'Chocolate Granulado', price: 2 }
        ]
      }
    },
    {
      id: 'h1',
      name: 'Costela Premium',
      description: 'Hambúrguer artesanal de costela 180g, queijo cheddar, bacon, alface, tomate e molho especial',
      price: 32,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      category: 'artesanais',
      addons: burgerAddons
    },
    {
      id: 'h2',
      name: 'Costela BBQ',
      description: 'Hambúrguer artesanal de costela 180g, queijo, cebola caramelizada e molho barbecue',
      price: 30,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      category: 'artesanais',
      addons: burgerAddons
    },
    {
      id: 'c1',
      name: 'Hot Dog Completo',
      description: 'Salsicha, purê, vinagrete, batata palha, milho, ervilha e molhos',
      price: 18,
      image: 'https://images.unsplash.com/photo-1619740455993-9d77a82c8559?auto=format&fit=crop&w=800&q=80',
      category: 'hotdog',
      addons: hotdogAddons
    },
    {
      id: 'm1',
      name: 'Misto Quente',
      description: 'Pão francês, presunto e queijo derretido',
      price: 12,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      category: 'mistos',
      addons: mistoAddons
    },
    {
      id: 'm2',
      name: 'Americano',
      description: 'Pão francês, presunto, queijo, ovo, alface e tomate',
      price: 15,
      image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80',
      category: 'mistos',
      addons: mistoAddons
    },
    {
      id: 'l1',
      name: 'Calabresa Especial',
      description: 'Calabresa fatiada, queijo, vinagrete e molho',
      price: 25,
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
      category: 'calabresa',
      addons: calabresaAddons
    },
    {
      id: 'f1',
      name: 'Frango Supreme',
      description: 'Peito de frango grelhado, queijo, alface, tomate e maionese especial',
      price: 28,
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
      category: 'frango',
      addons: frangoAddons
    },
    {
      id: 'cf1',
      name: 'Contra Filé Especial',
      description: 'Contra filé fatiado, queijo, cebola grelhada e molho',
      price: 35,
      image: 'https://images.unsplash.com/photo-1600555379765-f82335a7b1b0?auto=format&fit=crop&w=800&q=80',
      category: 'contrafile',
      addons: contrafileAddons
    },
    {
      id: 'b1',
      name: 'Bauru Tradicional',
      description: 'Rosbife, queijo derretido, tomate e molho especial',
      price: 22,
      image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=800&q=80',
      category: 'bauru',
      addons: bauruAddons
    }
  ];

  const categories = [
    { id: 'acai-combos', name: 'Combos de Açaí' },
    { id: 'acai-custom', name: 'Monte Seu Açaí' },
    { id: 'artesanais', name: 'Hambúrgueres Artesanais de Costela' },
    { id: 'hotdog', name: 'Cachorro Quente' },
    { id: 'mistos', name: 'Misto Quente e Americano' },
    { id: 'calabresa', name: 'Lanches de Calabresa' },
    { id: 'frango', name: 'Lanches de Peito de Frango' },
    { id: 'contrafile', name: 'Lanches de Contra Filé' },
    { id: 'bauru', name: 'Baurus' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-800 text-white py-4 sm:py-6 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Maná Lanches</h1>
          <p className="text-base sm:text-lg">O sabor que alimenta sua alma!</p>
          <div className={`mt-4 flex items-center justify-center gap-2 ${isStoreOpen ? 'text-green-300' : 'text-red-300'}`}>
            <Clock size={20} />
            <p>
              {isStoreOpen 
                ? 'Aberto agora! Fechamos às 23:00' 
                : 'Fechado no momento. Abrimos às 19:00'}
            </p>
          </div>
        </div>
      </header>

      <nav className="bg-orange-500 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-4 sm:gap-0">
          <div className="flex gap-6">
            <a href="#sobre" className="text-white font-semibold hover:text-orange-100">Sobre</a>
            <a href="#cardapio" className="text-white font-semibold hover:text-orange-100">Cardápio</a>
            <a href="#contato" className="text-white font-semibold hover:text-orange-100">Contato</a>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <section id="sobre" className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sobre Nós</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Bem-vindo ao Maná Lanches! Servimos lanches deliciosos e açaí com ingredientes frescos e muito amor. 
            Nosso objetivo é oferecer uma experiência inesquecível em cada mordida.
          </p>
        </section>

        <section id="cardapio" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Cardápio</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-200">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {menuItems
              .filter(item => item.category === selectedCategory)
              .map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-[1.02]">
                  <div className={`relative ${item.category.includes('acai') ? 'h-96' : 'h-48'}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-full h-full ${
                        item.category.includes('acai') 
                          ? 'object-contain bg-purple-50 p-4' 
                          : 'object-cover'
                      }`}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm">{item.description}</p>
                    
                    {item.customizable ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Escolha o Tamanho:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {item.options?.sizes?.map(size => (
                              <button
                                key={size.size}
                                onClick={() => setSelectedSize(size.size)}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                  selectedSize === size.size
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-200 hover:border-orange-200'
                                }`}
                              >
                                <div className="font-medium">{size.size}</div>
                                <div className="text-sm text-gray-600">
                                  R$ {size.price.toFixed(2)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Escolha os Acompanhamentos:
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {item.options?.toppings?.map(topping => (
                              <label
                                key={topping.name}
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
                                  selectedToppings.includes(topping.name)
                                    ? 'bg-orange-50 border-2 border-orange-500'
                                    : 'bg-gray-50 border-2 border-gray-200 hover:border-orange-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedToppings.includes(topping.name)}
                                  onChange={() => handleToppingToggle(topping.name)}
                                  className="sr-only"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{topping.name}</div>
                                  <div className="text-sm text-gray-600">
                                    +R$ {topping.price.toFixed(2)}
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 ml-2 flex items-center justify-center transition-all ${
                                  selectedToppings.includes(topping.name)
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedToppings.includes(topping.name) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800 font-bold mb-4">R$ {item.price.toFixed(2)}</p>
                        
                        {item.addons && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Adicionais:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {item.addons.map(addon => (
                                <label
                                  key={addon.name}
                                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
                                    (selectedAddons[item.id] || []).includes(addon.name)
                                      ? 'bg-orange-50 border-2 border-orange-500'
                                      : 'bg-gray-50 border-2 border-gray-200 hover:border-orange-200'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={(selectedAddons[item.id] || []).includes(addon.name)}
                                    onChange={() => handleAddonToggle(item.id, addon.name)}
                                    className="sr-only"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{addon.name}</div>
                                    <div className="text-xs text-gray-600">
                                      +R$ {addon.price.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 ml-2 flex items-center justify-center transition-all ${
                                    (selectedAddons[item.id] || []).includes(addon.name)
                                      ? 'border-orange-500 bg-orange-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {(selectedAddons[item.id] || []).includes(addon.name) && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={() => addToCart(item)}
                      className={`w-full py-2 rounded-lg transition-colors ${
                        isStoreOpen 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isStoreOpen ? 'Adicionar ao Carrinho' : 'Agendar Pedido'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section id="contato" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Contato</h2>
          <div className="flex flex-col gap-4 items-center">
            <p className="flex items-center gap-2">
              <MapPin className="text-orange-500" />
              Rua dos Sabores, 123, Centro
            </p>
            <p className="flex items-center gap-2">
              <Phone className="text-orange-500" />
              (11) 1234-5678
            </p>
            <p className="flex items-center gap-2">
              <MessageSquare className="text-orange-500" />
              WhatsApp: (11) 98765-4321
            </p>
            <p className="flex items-center gap-2">
              <Clock className="text-orange-500" />
              Horário de Funcionamento: 19:00 às 23:00
            </p>
          </div>
        </section>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <footer className="bg-purple-800 text-white py-6 mt-12">
        <div className="container mx-auto text-center px-4">
          <div className="flex justify-center gap-6 mb-4">
            <a 
              href="https://instagram.com/manalanches" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-orange-300 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://facebook.com/manalanches" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-orange-300 transition-colors"
            >
              <Facebook size={24} />
            </a>
          </div>
          <p>&copy; 2025 Maná Lanches. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;