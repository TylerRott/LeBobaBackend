import React from 'react';
import { useCart } from './CartContext';

const CartPage = () => {
  const { cartItems, placeOrder } = useCart();

  const handlePlaceOrder = async () => {
    try {
      const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0); // Calculate total price
      const selectedEmployeeId = 1; // Replace with actual employee ID logic

      const orderDetails = await placeOrder(totalPrice, selectedEmployeeId);
      alert(`Order placed! ID: ${orderDetails.id} | Total: $${totalPrice.toFixed(2)}`);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>{item.name} - ${item.price}</li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default CartPage;