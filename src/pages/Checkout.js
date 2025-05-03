import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to checkout.');
      navigate('/login');
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty. Add items to place an order.');
      return;
    }

    const orderData = {
      products: cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      deliveryAddress,
    };

    try {
      console.log('Creating order with data:', orderData);
      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Order created successfully:', response.data);
      await clearCart();
      setIsModalOpen(false);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order creation failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Order creation failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>
      {error && <p className="alert alert-error mb-6">{error}</p>}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
        {cart.map(item => (
          <p key={item.product._id} className="text-gray-600 mb-2">
            {item.product.name} x {item.quantity} - ₹{(item.product.price * item.quantity).toFixed(2)}
          </p>
        ))}
        <p className="text-xl font-bold text-blue-600 mt-4">Total: ₹{total.toFixed(2)}</p>
      </div>
      <div className="card p-6">
        <label className="form-label">Delivery Address</label>
        <textarea
          value={deliveryAddress}
          onChange={e => setDeliveryAddress(e.target.value)}
          placeholder="Enter delivery address"
          className="form-input"
          rows="4"
          required
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-secondary w-full p-3 text-lg mt-4"
        >
          Place Order
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCheckout}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Order</h2>
        <p className="text-gray-600">Are you sure you want to place this order for ₹{total.toFixed(2)}?</p>
      </Modal>
    </div>
  );
};

export default Checkout;