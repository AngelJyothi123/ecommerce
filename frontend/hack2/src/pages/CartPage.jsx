import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/helpers";
import Button from "../components/Button";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();

  const getItemId = (item) => item.productId || item.id;

  const handleRemove = async (item) => {
    try {
      const itemId = getItemId(item);
      await removeFromCart(itemId);
      addToast("Item removed from cart", "success");
    } catch {
      addToast("Failed to remove item", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      addToast("Cart cleared", "success");
    } catch {
      addToast("Failed to clear cart", "error");
    }
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const itemId = getItemId(item);
      await updateQuantity(itemId, newQuantity);
    } catch {
      addToast("Failed to update quantity", "error");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-slide-in">
        <div className="mb-8 relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl" />
          <div className="relative glass-panel w-full h-full rounded-2xl flex items-center justify-center border border-white/10">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-4">Your cart is completely bare</h2>
        <p className="text-xl text-gray-400 mb-10 font-light">Let's find some amazing premium products to fill it up!</p>
        <Link to="/">
          <Button className="px-10 py-4 text-lg">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-slide-in">
      <h1 className="text-4xl font-extrabold text-white mb-10 flex items-center">
        Your Cart
        <span className="ml-4 text-sm font-semibold bg-white/10 px-4 py-1 rounded-full text-violet-300 border border-white/5 shadow-inner">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={getItemId(item)} className="glass-card p-4 flex items-center border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-24 h-24 bg-black/50 rounded-xl overflow-hidden shrink-0 relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/laptop.jpg";
                    e.target.onerror = null;
                  }}
                />
              </div>
              
              <div className="flex-1 ml-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/products/${getItemId(item)}`} className="text-lg font-bold text-white hover:text-fuchsia-400 transition-colors">
                      {item.name}
                    </Link>
                    {item.category && (
                      <p className="text-sm text-gray-400 mt-1">{item.category.name}</p>
                    )}
                  </div>
                  <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-fuchsia-300">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-1">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
                    </button>
                    <span className="w-12 text-center font-semibold text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <p className="font-bold text-white tracking-wide">
                      Total: {formatCurrency((item.price || 0) * item.quantity)}
                    </p>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-gray-500 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-500/10"
                      title="Remove Item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-2xl border border-white/10 sticky top-28 bg-[#111111]/80 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-white">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Estimated Shipping</span>
                <span className="text-emerald-400 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Tax</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
            </div>
            
            <Link to="/checkout" className="block w-full">
              <Button className="w-full py-4 text-lg">Secure Checkout</Button>
            </Link>
            
            <div className="mt-6 flex flex-col items-center">
              <Link to="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Continue Shopping &rarr;
              </Link>
              <button
                onClick={handleClearCart}
                className="mt-6 text-sm text-gray-500 hover:text-rose-500 transition-colors border-b border-transparent hover:border-rose-500/50"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
