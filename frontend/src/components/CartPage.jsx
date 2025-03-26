import { useCart } from './CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, i) => (
              <li key={i}>
                <strong>{item.item}</strong> - ${item.price?.toFixed(2)}
                <br />
                Sweetness: {item.sweetness}, Ice: {item.ice}
                {item.toppings.length > 0 && (
                  <div>Toppings: {item.toppings.join(', ')}</div>
                )}
                <button onClick={() => removeFromCart(i)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
