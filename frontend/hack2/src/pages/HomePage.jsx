import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from "../utils/products";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [categories] = useState(SAMPLE_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizeProduct = useCallback((product) => {
    if (product.category && typeof product.category === 'object') {
      return product;
    }
    if (product.categoryId) {
      const cat = categories.find(c => c.id === product.categoryId);
      return {
        ...product,
        category: cat ? { id: cat.id, name: cat.name } : { id: product.categoryId, name: "Uncategorized" }
      };
    }
    return {
      ...product,
      category: { id: null, name: "Uncategorized" }
    };
  }, [categories]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      if (response.data && response.data.length > 0) {
        const normalizedProducts = response.data.map(normalizeProduct);
        setProducts(normalizedProducts);
      } else {
        setProducts(SAMPLE_PRODUCTS);
      }
    } catch {
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== null) {
      filtered = filtered.filter(p => {
        const productCategoryId = p.category?.id ?? p.categoryId;
        return productCategoryId === selectedCategory;
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const getCategoryName = (id) => {
    if (id === null) return "";
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  return (
    <div className="w-full">
      {/* Dynamic Hero Section */}
      <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden mb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_banner.png" 
            alt="Premium Collection" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 mix-blend-overlay" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-slide-in">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Elevate Your <span className="text-gradient">Lifestyle</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover a curated collection of premium electronics, luxury fashion, and exquisite taste. Redefining modern luxury.
          </p>
          <button 
            onClick={() => document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary px-10 py-4 text-lg"
          >
            Explore Collection
          </button>
        </div>
      </div>

      <div id="shop-section" className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all glass-panel"
            />
            <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Elegant Category Pills */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end w-full md:w-2/3">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === null 
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              All Collection
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border-transparent" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {selectedCategory ? getCategoryName(selectedCategory) : "Featured Products"}
                <span className="ml-4 text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {filteredProducts.length} items
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-slide-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 glass-card mx-auto max-w-2xl mt-10 p-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No products found</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              We couldn't locate any products matching your current filters. 
            </p>
            <button
              onClick={clearFilters}
              className="btn-secondary px-8 py-3"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
