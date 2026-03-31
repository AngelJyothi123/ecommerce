import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/helpers";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const getItemId = (item) => item.productId || item.id;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderData = {
        items: cart.map((item) => ({
          productId: getItemId(item),
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        shippingAddress: address,
        totalAmount: cartTotal,
      };
      await orderService.checkout(orderData);
      await clearCart();
      addToast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to place order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-slide-in">
        <h2 className="text-3xl font-extrabold text-white mb-4">No items to checkout</h2>
        <p className="text-xl text-gray-400 mb-8 font-light">Your cart is currently empty.</p>
        <Link to="/">
          <Button className="px-8 py-3">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-slide-in">
      <div className="flex items-center mb-8">
        <Link to="/cart" className="text-gray-400 hover:text-white mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </Link>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold flex items-center text-white">
                <span className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center mr-3 text-sm border border-violet-500/30">1</span>
                Shipping Information
              </h2>
            </Card.Header>
            <Card.Body>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-2">
                <Input
                  label="Street Address"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="123 Luxury Avenue, Suite 100"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="Metropolis"
                    required
                  />
                  <Input
                    label="State / Province"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="NY"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="ZIP Code"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    placeholder="United States"
                    required
                  />
                </div>
              </form>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold flex items-center text-white">
                <span className="w-8 h-8 rounded-full bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center mr-3 text-sm border border-fuchsia-500/30">2</span>
                Payment Method
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Mock Payment Gateway</p>
                  <p className="text-xs text-gray-500 mt-1">Simulated secure transaction</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div>
          <Card className="sticky top-28 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
            <Card.Header className="border-b border-white/10 bg-[#111111]/90">
              <h2 className="text-xl font-bold text-white">Order Summary</h2>
            </Card.Header>
            <Card.Body className="bg-[#111111]/80">
              <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={getItemId(item)} className="flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-black/50 rounded-lg overflow-hidden border border-white/5 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.src = "/images/laptop.jpg";
                            e.target.onerror = null;
                          }}
                        />
                        <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-bl-lg text-[10px] text-white border-l border-b border-white/10">
                          x{item.quantity}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-fuchsia-300 transition-colors">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.category?.name || "Product"}</p>
                      </div>
                    </div>
                    <p className="font-bold text-white tracking-wide ml-4 whitespace-nowrap">
                      {formatCurrency((item.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </Card.Body>
            <Card.Footer className="border-t border-white/10 bg-[#0a0a0a]/90">
              <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-gray-400 text-sm">
                   <span>Subtotal</span>
                   <span>{formatCurrency(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between text-gray-400 text-sm">
                   <span>Shipping</span>
                   <span className="text-emerald-400 font-medium">Free</span>
                 </div>
              </div>
              <div className="flex justify-between items-end mb-8 pt-4 border-t border-white/10">
                <span className="text-gray-400 font-medium pb-1">Total to Pay</span>
                <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              <Button form="checkout-form" type="submit" loading={loading} className="w-full py-4 text-lg">
                Confirm & Pay
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
