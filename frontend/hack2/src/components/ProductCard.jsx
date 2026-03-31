import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/helpers";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const productId = product.productId || product.id;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product);
      addToast("Added to cart!", "success");
    } catch {
      addToast("Failed to add to cart", "error");
    }
  };

  const handleImageError = (e) => {
    e.target.src = "/images/laptop.jpg";
    e.target.onerror = null;
  };

  return (
    <Link to={`/products/${productId}`} className="glass-card group block overflow-hidden hover:-translate-y-2">
      <div className="aspect-[4/3] bg-black/50 overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-500"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 right-3">
          {product.category && (
            <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-white tracking-wide">
              {product.category.name}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col justify-between h-[160px]">
        <div>
          <h3 className="font-bold text-lg text-white truncate group-hover:text-fuchsia-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-fuchsia-300">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="btn-primary px-4 py-2 text-sm z-10 relative"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
