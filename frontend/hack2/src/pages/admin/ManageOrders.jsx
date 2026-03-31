import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import LoadingSpinner from "../../components/LoadingSpinner";
import Card from "../../components/Card";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllOrders();
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

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      addToast("Order status updated", "success");
      fetchOrders();
    } catch {
      addToast("Failed to update order status", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
      DELIVERED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <span className="text-sm text-gray-500">{orders.length} total orders</span>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <Card.Header className="bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    <p className="text-sm text-gray-500">Customer: {order.user?.name || order.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <img
                            src={item.imageUrl || "/images/laptop.jpg"}
                            alt={item.productName}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              e.target.src = "/images/laptop.jpg";
                            }}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Shipping Address</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{order.shippingAddress?.street || "N/A"}</p>
                    <p className="text-sm text-gray-700">{order.shippingAddress?.city || ""}, {order.shippingAddress?.state || ""} {order.shippingAddress?.zipCode || ""}</p>
                    <p className="text-sm text-gray-700">{order.shippingAddress?.country || ""}</p>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Last updated: {formatDate(order.updatedAt || order.orderDate)}</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(order.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        order.status === status
                          ? `${getStatusColor(status)} cursor-default`
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                      disabled={order.status === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
