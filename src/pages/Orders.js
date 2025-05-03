import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data || err.message);
      setError('Failed to load orders. Please try again later.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const handleCancelOrder = async orderId => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(orders.filter(order => order._id !== orderId));
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to cancel order. Please try again.');
      }
    }
  };

  if (!user) return <div className="container mx-auto p-6">Please log in to view orders.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Orders</h1>
      {error && <p className="alert alert-error mb-6">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-gray-800">Order #{order._id}</p>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
              <p className="text-gray-600">Total: ₹{order.totalAmount.toFixed(2)}</p>
              <p className="text-gray-600">Address: {order.deliveryAddress}</p>
              <p className="text-gray-600">Ordered: {new Date(order.orderDate).toLocaleString()}</p>
              {order.shippedAt && (
                <p className="text-gray-600">Shipped: {new Date(order.shippedAt).toLocaleString()}</p>
              )}
              {order.deliveredAt && (
                <p className="text-gray-600">Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>
              )}
              <div className="mt-4">
                <h3 className="text-gray-700 font-semibold">Items:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {order.products.map(item => (
                    <li key={item._id}>
                      {item.product ? (
                        `${item.product.name} x ${item.quantity} - ₹${(item.product.price * item.quantity).toFixed(2)}`
                      ) : (
                        `Deleted Product x ${item.quantity} - Price unavailable`
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="btn-danger mt-4 px-4 py-2"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;