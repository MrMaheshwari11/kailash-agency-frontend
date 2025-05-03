import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_BASE_URL } from '../config';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_BASE_URL}/api/cart`, {
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

  const addToCart = async product => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/cart/add`,
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

  const removeFromCart = async productId => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/cart/remove`,
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
        `${API_BASE_URL}/api/cart/update`,
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
      await axios.delete(`${API_BASE_URL}/api/cart/clear`, {
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