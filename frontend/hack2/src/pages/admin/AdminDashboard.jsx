import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Products", value: "0", icon: "products", link: "/admin/products" },
    { label: "Total Orders", value: "0", icon: "orders", link: "/admin/orders" },
    { label: "Categories", value: "0", icon: "categories", link: "/admin/categories" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/products"
          className="bg-indigo-600 text-white p-8 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
          <p>Add, edit, or remove products from your store</p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-green-600 text-white p-8 rounded-lg hover:bg-green-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Categories</h3>
          <p>Organize your product categories</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-purple-600 text-white p-8 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
          <p>View and update order statuses</p>
        </Link>

        <div className="bg-gray-100 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Quick Actions</h3>
          <ul className="space-y-2 text-gray-600">
            <li>+ Add New Product</li>
            <li>+ Create Category</li>
            <li>+ View Reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
