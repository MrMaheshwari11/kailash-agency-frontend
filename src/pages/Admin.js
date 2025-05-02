import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', imageUrl: '', stock: '' });
  const [stockUpdates, setStockUpdates] = useState({});
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts();
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, filters]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(res.data);
      const uniqueCategories = [...new Set(res.data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to load products.');
    }
  };

  const fetchOrders = async () => {
    try {
      const params = { page, ...filters };
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      });
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data || err.message);
      setError('Failed to load orders. Please try again later.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts([...products, res.data]);
      setNewProduct({ name: '', description: '', price: '', category: '', imageUrl: '', stock: '' });
      setError(null);
      const uniqueCategories = [...new Set([...products, res.data].map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      setError('Failed to add product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const updatedProducts = products.filter(p => p._id !== productId);
        setProducts(updatedProducts);
        const uniqueCategories = [...new Set(updatedProducts.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(orders.map(order =>
        order._id === orderId ? res.data : order
      ));
      setError(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleStockChange = (productId, value) => {
    setStockUpdates({ ...stockUpdates, [productId]: value });
  };

  const handleUpdateStock = async (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined || newStock < 0) {
      setError('Please enter a valid stock value.');
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/${productId}/stock`,
        { stock: parseInt(newStock) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProducts(products.map(product =>
        product._id === productId ? { ...product, stock: res.data.stock } : product
      ));
      setError(null);
    } catch (error) {
      setError('Failed to update stock. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  if (!user || user.role !== 'admin') return <div className="container mx-auto p-6">Admin access only.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        {error && <p className="alert alert-error">{error}</p>}
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="form-label">Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product Name"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              value={newProduct.description}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Description"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="Price (₹)"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select
              value={newProduct.category}
              onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select Category</option>
              <option value="Grocery">Grocery</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Cold Drink">Cold Drink</option>
              <option value="Gift">Gift</option>
            </select>
          </div>
          <div>
            <label className="form-label">Stock</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
              placeholder="Stock"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Image URL (optional)</label>
            <input
              type="text"
              value={newProduct.imageUrl}
              onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              placeholder="Image URL (optional)"
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="btn-secondary w-full p-3 text-lg"
          >
            Add Product
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-lg transition duration-300 shadow-sm ${
            selectedCategory === ''
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition duration-300 shadow-sm ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProducts.map(product => (
          <div key={product._id} className="card p-4">
            <div className="flex items-center">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/50'}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-gray-600 text-sm">₹{product.price.toFixed(2)} | {product.category} | Stock: {product.stock}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="number"
                value={stockUpdates[product._id] !== undefined ? stockUpdates[product._id] : product.stock}
                onChange={e => handleStockChange(product._id, e.target.value)}
                className="form-input w-24"
                min="0"
              />
              <button
                onClick={() => handleUpdateStock(product._id)}
                className="btn-primary px-3 py-1"
              >
                Update Stock
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="btn-danger px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-4">
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>
        </div>
      </div>
      {error ? (
        <p className="alert alert-error">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <>
          {orders.map(order => (
            <div key={order._id} className="card p-4 mb-4 flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold">Order ID: {order._id}</p>
                <p className="text-gray-600">User: {order.userId?.name || 'Unknown User'}</p>
                <p className="text-gray-600">Total: ₹{order.totalAmount.toFixed(2)}</p>
                <p className="text-gray-600">Address: {order.deliveryAddress}</p>
                <p className="text-gray-600">Ordered: {new Date(order.orderDate).toLocaleString()}</p>
                {order.shippedAt && (
                  <p className="text-gray-600">Shipped: {new Date(order.shippedAt).toLocaleString()}</p>
                )}
                {order.deliveredAt && (
                  <p className="text-gray-600">Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>
                )}
                <div className="mt-2">
                  <h3 className="text-gray-700 font-semibold">Items:</h3>
                  {order.products.map(item => (
                    <p key={item._id} className="text-gray-600">
                      {item.product ? (
                        `${item.product.name} x ${item.quantity} - ₹${(item.product.price * item.quantity).toFixed(2)}`
                      ) : (
                        `Deleted Product x ${item.quantity} - Price unavailable`
                      )}
                    </p>
                  ))}
                </div>
              </div>
              <select
                value={order.status}
                onChange={e => handleUpdateStatus(order._id, e.target.value)}
                className="form-input"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 disabled:opacity-50"
            >
              Previous
            </button>
            <p>Page {page} of {totalPages}</p>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;