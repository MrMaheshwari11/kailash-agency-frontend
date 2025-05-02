import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000); // Reset after 1 second
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2 text-gray-800">{product.name}</h3>
      <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
      <div className="mt-2 flex space-x-2 relative">
        <Link
          to={`/product/${product._id}`}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          View
        </Link>
        <button
          onClick={handleAddToCart}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 transform ${
            isAdded ? 'scale-110' : 'scale-100'
          }`}
        >
          Add to Cart
        </button>
        {isAdded && (
          <span className="absolute -top-8 right-0 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded animate-bounce">
            Added!
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;