import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err.response?.data || err.message);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please log in to add items to cart.');
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#1D4ED8" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-6">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="card flex flex-col md:flex-row gap-6">
        <div className="relative">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full md:w-96 h-64 object-cover rounded-lg"
          />
          {product.stock === 0 && (
            <div className="out-of-stock-badge absolute top-4 right-4">
              Out of Stock
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-3">₹{product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-2">Category: <span className="font-medium">{product.category}</span></p>
          <p className="text-gray-600 mb-4">Stock: <span className="font-medium">{product.stock}</span></p>
          <button
            onClick={handleAddToCart}
            className={`btn-secondary px-6 py-3 text-lg ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;