import React, { useState } from 'react';
import { 
  Store, 
  ShoppingCart, 
  CreditCard, 
  Printer, 
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  DollarSign,
  X,
  Check,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  total: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Laptop Pro X1',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
    stock: 10
  },
  {
    id: 'P002',
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    stock: 50
  },
  {
    id: 'P003',
    name: 'Gaming Monitor',
    price: 499.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop',
    stock: 15
  },
  {
    id: 'P004',
    name: 'Mechanical Keyboard',
    price: 149.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&h=300&fit=crop',
    stock: 30
  }
];

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', icon: <DollarSign className="w-6 h-6" /> },
  { id: 'card', name: 'Credit Card', icon: <CreditCard className="w-6 h-6" /> }
];

const categories = ['All', 'Electronics', 'Accessories'];

export function POSModule() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1, total: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return currentCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.price }
            : item
        );
      }
      return currentCart.filter(item => item.id !== productId);
    });
  };

  const deleteFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateChange = () => {
    const total = calculateTotal();
    const received = parseFloat(amountReceived);
    return received ? Math.max(received - total, 0) : 0;
  };

  const handlePayment = () => {
    // Here you would typically process the payment and create the order
    console.log({
      items: cart,
      total: calculateTotal(),
      paymentMethod: selectedPaymentMethod,
      customerInfo,
      timestamp: new Date().toISOString()
    });

    // Reset the state
    setCart([]);
    setSelectedPaymentMethod('');
    setAmountReceived('');
    setCustomerInfo({ name: '', email: '', phone: '' });
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Point of Sale</h1>
            <div className="flex items-center space-x-2">
              <Store className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-600">Main Store</span>
            </div>
          </div>

          {/* Search and Categories */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white rounded-lg shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
            <ShoppingCart className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-sm text-gray-600">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-6 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-6 border-t bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={cart.length === 0}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Payment</h2>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 flex flex-col items-center justify-center border rounded-lg gap-2 ${
                      selectedPaymentMethod === method.id
                        ? 'bg-primary-50 border-primary-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {method.icon}
                    <span className={selectedPaymentMethod === method.id ? 'text-primary-700' : 'text-gray-700'}>
                      {method.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Received */}
            {selectedPaymentMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Received
                </label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter amount received"
                />
                {parseFloat(amountReceived) > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Change:</span>
                    <span className="ml-2 font-medium">${calculateChange().toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{cart.length}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'cash' && !amountReceived)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}