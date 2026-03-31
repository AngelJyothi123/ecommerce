import { useState, useEffect, useCallback } from "react";
import { orderService } from "../services/orderService";
import { useToast } from "../context/ToastContext";
import { formatCurrency, formatDate } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      addToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancel(orderId);
      addToast("Order cancelled successfully", "success");
      fetchOrders();
    } catch {
      addToast("Failed to cancel order", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      PROCESSING: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      SHIPPED: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      DELIVERED: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      CANCELLED: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-300 border border-gray-500/30";
  };

  if (loading) return <div className="py-32"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-slide-in">
      <h1 className="text-4xl font-extrabold text-white mb-10">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl mx-auto max-w-3xl border border-white/5">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No orders yet</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't placed any orders. Discover our exclusive collection.</p>
          <Link to="/" className="btn-primary px-8 py-3 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <Card key={order.orderId} className="border border-white/10 hover:border-violet-500/30 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <Card.Header className="bg-[#111111]/80">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-300 tracking-wider uppercase mb-1">Order #{order.orderId}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </Card.Header>
              <Card.Body className="bg-black/30">
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-xs text-gray-500 mr-4">
                           {item.quantity}x
                        </div>
                        <span className="text-gray-200 font-medium">{item.product?.name}</span>
                      </div>
                      <span className="font-bold text-white tracking-wide">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer className="bg-[#0a0a0a]/90">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(order.orderId)}
                      className="px-6 py-2 rounded-full border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
