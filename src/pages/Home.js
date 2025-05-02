import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await axios.get('http://localhost:5000/api/products', { params });
        setProducts(res.data);
        const uniqueCategories = [...new Set(res.data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, minPrice, maxPrice]);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Explore Our Products</h1>
      <div className="mb-8 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="p-3 border rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="flex space-x-4">
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="p-3 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="p-3 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#1D4ED8" size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className="card"
            >
              <div className="relative">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                {product.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="btn-primary flex-1 text-sm py-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        alert('Please log in to add items to cart.');
                        navigate('/login');
                        return;
                      }
                      addToCart(product);
                    }}
                    className={`btn-secondary flex-1 text-sm py-2 ${
                      product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;