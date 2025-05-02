import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => {
          const cartItems = res.data.products.map(item => ({
            product: item.product,
            quantity: item.quantity,
          }));
          setCart(cartItems);
        })
        .catch(err => console.error(err));
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (product) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: product._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const cartItems = res.data.products.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setCart(cartItems);
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/remove',
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const cartItems = res.data.products.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setCart(cartItems);
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/update',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const cartItems = res.data.products.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setCart(cartItems);
    } catch (error) {
      console.error('Failed to update cart', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};