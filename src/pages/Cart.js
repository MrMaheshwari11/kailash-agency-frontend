import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    return item.product && item.product.price ? sum + item.product.price * item.quantity : sum;
  }, 0);

  const handleQuantityChange = (productId, delta) => {
    const item = cart.find(i => i.product._id === productId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId); // Remove item if quantity would be 0
    }
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please log in to proceed to checkout.');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item =>
              item.product ? (
                <div key={item.product._id} className="card flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.product.imageUrl || 'https://via.placeholder.com/50'}
                      alt={item.product.name || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
                      <p className="text-gray-600">₹{item.product.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, -1)}
                      className="btn-danger px-2 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, 1)}
                      className="btn-primary px-2 py-1 text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="btn-danger px-3 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className="mt-6 text-right">
            <p className="text-xl font-bold text-blue-600">Total: ₹{total.toFixed(2)}</p>
            <button
              onClick={handleCheckout}
              className="btn-secondary mt-4 px-6 py-2 text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;