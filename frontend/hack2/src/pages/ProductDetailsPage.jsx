import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/productService";
import { getProductById } from "../utils/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
      if (response.data) {
        setProduct(response.data);
      } else {
        const sampleProduct = getProductById(id);
        setProduct(sampleProduct);
      }
    } catch {
      const sampleProduct = getProductById(id);
      setProduct(sampleProduct);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      addToast("Added to cart!", "success");
    } catch {
      addToast("Failed to add to cart", "error");
    }
  };

  if (loading) return <div className="py-32"><LoadingSpinner /></div>;
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-slide-in">
        <svg className="w-24 h-24 mx-auto text-gray-400 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
        <p className="text-gray-400 mb-10 text-lg">The luxury item you are looking for does not exist.</p>
        <Link to="/">
          <Button className="px-8 py-3">Back to Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-in">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-fuchsia-400 mb-10 group transition-colors">
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Showcase */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="aspect-[4/5] md:aspect-square bg-[#0f0f0f] rounded-3xl overflow-hidden relative z-10 border border-white/5 shadow-2xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-lighten transform hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.src = "/images/laptop.jpg";
                e.target.onerror = null;
              }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            {product.category && (
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-violet-300 bg-violet-900/30 border border-violet-500/20">
                {product.category.name}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {product.name}
          </h1>
          
          <p className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-8 inline-block">
            {formatCurrency(product.price)}
          </p>
          
          <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10 bg-white/5">
            <h3 className="text-white font-semibold mb-3">Product Description</h3>
            <p className="text-gray-400 leading-relaxed text-lg font-light">
              {product.description}
            </p>
          </div>
          
          {product.stock !== undefined && (
            <div className="mb-10 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${product.stock > 0 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"}`}></div>
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>
          )}

          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Quantity</label>
            <div className="flex items-center w-max bg-white/5 border border-white/10 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                disabled={quantity <= 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-12 text-center text-xl font-bold bg-transparent border-none text-white focus:outline-none"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <Button 
            onClick={handleAddToCart} 
            className="w-full md:w-auto py-4 px-10 text-lg flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Shopping Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
